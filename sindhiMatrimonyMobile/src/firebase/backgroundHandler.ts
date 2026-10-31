/**
 * Background & Headless Notification Handlers
 * Sindhi Matrimony Application
 *
 * MUST be registered early in the application lifecycle (e.g. index.js)
 * to process incoming data payloads when the app is in Background or Killed/Quit state.
 */

// Silence React Native Firebase modular deprecation warnings during v21+ migration
if (typeof globalThis !== 'undefined') {
  (globalThis as any).RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;
}

import * as messagingModule from '@react-native-firebase/messaging';
const messaging: any = (messagingModule as any).default || messagingModule;
import notifee, { EventType, Event as NotifeeEvent } from '@notifee/react-native';
import { fcmService } from './fcmService';
import { notificationTracker } from './notificationTracker';
import { notificationHandler } from './notificationHandler';
import { ParsedNotification, MatrimonyNotificationPayload, NotificationType, RawRemoteMessage } from './types';

/**
 * Background FCM message handler (Headless JS worker)
 */
export async function setupBackgroundMessageHandler() {
  try {
    const msgInstance = typeof messaging === 'function' ? messaging() : messaging;
    msgInstance.setBackgroundMessageHandler(async (remoteMessage: any) => {
      console.log('🌙 [BackgroundHandler] Background FCM message received:', remoteMessage);

      try {
        const parsed = fcmService.parseRemoteMessage(remoteMessage as unknown as RawRemoteMessage, 'BACKGROUND');
        notificationTracker.logReceived(parsed.id, parsed.type, 'BACKGROUND', parsed.data);

        // Display local notification with Notifee in background
        await fcmService.displayLocalNotification(parsed);
      } catch (innerError) {
        notificationTracker.logError(remoteMessage.messageId || 'bg_err', innerError, 'setBackgroundMessageHandler');
      }
    });

    console.log('✅ [BackgroundHandler] Firebase setBackgroundMessageHandler registered.');
  } catch (error) {
    console.warn('⚠️ [BackgroundHandler] Error registering setBackgroundMessageHandler:', error);
  }
}

/**
 * Notifee Background Event Handler (When user clicks action in background/lockscreen)
 */
export function setupNotifeeBackgroundHandler() {
  try {
    notifee.onBackgroundEvent(async ({ type, detail }: NotifeeEvent) => {
      try {
        const { notification, pressAction } = detail;
        if (!notification) return;

        console.log('🌙 [BackgroundHandler] Notifee Background Event:', type, pressAction);

        const parsed: ParsedNotification = {
          id: notification.id || `bg_notif_${Date.now()}`,
          title: notification.title || 'Sindhi Matrimony',
          body: notification.body || '',
          type: (notification.data?.type as NotificationType) || 'GENERAL_ALERT',
          data: (notification.data || {}) as unknown as MatrimonyNotificationPayload,
          receivedAt: Date.now(),
          source: 'BACKGROUND',
        };

        if (type === EventType.ACTION_PRESS && pressAction?.id) {
          notificationTracker.logActionPressed(parsed.id, parsed.type, pressAction.id, 'BACKGROUND');
          notificationHandler.handleNotificationAction(pressAction.id, parsed);
        } else if (type === EventType.PRESS) {
          notificationTracker.logClicked(parsed.id, parsed.type, 'BACKGROUND');
          notificationHandler.handleNotificationTap(parsed);
        } else if (type === EventType.DISMISSED) {
          notificationTracker.logEvent({
            messageId: parsed.id,
            type: parsed.type,
            action: 'DISMISSED',
            timestamp: Date.now(),
            appState: 'BACKGROUND',
          });
        }
      } catch (e) {
        notificationTracker.logError('bg_notifee_error', e, 'onBackgroundEvent');
      }
    });

    console.log('✅ [BackgroundHandler] Notifee onBackgroundEvent registered.');
  } catch (error) {
    console.warn('⚠️ [BackgroundHandler] Error registering onBackgroundEvent:', error);
  }
}
