/**
 * Firebase Cloud Messaging (FCM) & Notifee Core Engine
 * Sindhi Matrimony Application
 *
 * Provides crash-proof lifecycle management across Foreground, Background,
 * and Cold-Start (Killed) states with high performance, zero re-renders,
 * and comprehensive error boundaries.
 */

// Silence React Native Firebase modular deprecation warnings during v21+ migration
if (typeof globalThis !== 'undefined') {
  (globalThis as any).RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;
}

import * as messagingModule from '@react-native-firebase/messaging';
const messaging: any = (messagingModule as any).default || messagingModule;
import notifee, {
  EventType,
  Event as NotifeeEvent,
  AndroidImportance,
  AndroidVisibility,
} from '@notifee/react-native';
import { Platform } from 'react-native';
import { Storage } from '../storage/Storage';
import {
  NotificationType,
  ParsedNotification,
  RawRemoteMessage,
  MatrimonyNotificationPayload,
  NotificationEventCallback,
} from './types';
import { setupNotificationChannels } from './notificationChannels';
import { notificationTracker } from './notificationTracker';
import { notificationHandler } from './notificationHandler';
import { localNotificationService } from './localNotificationService';

const FCM_TOKEN_STORAGE_KEY = 'fcm_device_token_v1';
const FCM_TOKEN_SYNCED_KEY = 'fcm_token_synced_v1';

class FCMService {
  private isInitialized: boolean = false;
  private listeners: Set<NotificationEventCallback> = new Set();
  private unsubscribeForeground: (() => void) | null = null;
  private unsubscribeTokenRefresh: (() => void) | null = null;
  private unsubscribeNotifeeForeground: (() => void) | null = null;
  private unsubscribeNotificationOpenedApp: (() => void) | null = null;

  private getMessaging(): any {
    return typeof messaging === 'function' ? messaging() : messaging;
  }

  /**
   * Main Initialization entry point
   * Call once during app startup (e.g., in App.tsx or root provider)
   */
  public async initialize(): Promise<boolean> {
    if (this.isInitialized) {
      console.log('ℹ️ [FCMService] Already initialized.');
      return true;
    }

    try {
      console.log('🚀 [FCMService] Initializing Firebase FCM & Notifee...');

      // 1. Setup Android Notification Channels
      if (Platform.OS === 'android') {
        await setupNotificationChannels();
      }

      // 2. Request Permissions
      const hasPermission = await this.requestUserPermission();
      if (!hasPermission) {
        console.warn('⚠️ [FCMService] User did not grant push notification permission.');
      }

      // 3. Register device with FCM & fetch Token
      await this.registerDeviceForRemoteMessages();
      const token = await this.getFCMToken();
      if (token) {
        await this.syncTokenWithBackend(token);
      }

      // 4. Attach Listeners
      this.attachForegroundMessageListener();
      this.attachTokenRefreshListener();
      this.attachNotifeeForegroundListener();
      this.attachNotificationOpenedAppListener();

      // 5. Check if app was opened from a notification (Cold Start / Killed state)
      await this.checkInitialNotification();

      this.isInitialized = true;
      console.log('✅ [FCMService] Initialized successfully.');
      return true;
    } catch (error) {
      notificationTracker.logError('init_error', error, 'FCMService.initialize');
      return false;
    }
  }

  /**
   * Request Push Notification Permission (Android 13+ & iOS)
   */
  public async requestUserPermission(): Promise<boolean> {
    try {
      if (Platform.OS === 'ios') {
        const authStatus = await this.getMessaging().requestPermission({
          alert: true,
          badge: true,
          sound: true,
          provisional: false,
        });
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        return enabled;
      }

      // Android 13+ (API 33+) requires runtime POST_NOTIFICATIONS permission
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        const settings = await notifee.requestPermission();
        return settings.authorizationStatus >= 1;
      }

      return true;
    } catch (error) {
      console.warn('⚠️ [FCMService] requestUserPermission error:', error);
      return false;
    }
  }

  /**
   * Register Device with APNs (iOS prerequisite for FCM)
   */
  public async registerDeviceForRemoteMessages(): Promise<void> {
    try {
      if (Platform.OS === 'ios') {
        const msg = this.getMessaging();
        if (!msg.isDeviceRegisteredForRemoteMessages) {
          await msg.registerDeviceForRemoteMessages();
          console.log('📱 [FCMService] Registered device for remote messages on iOS.');
        }
      }
    } catch (error) {
      console.warn('⚠️ [FCMService] registerDeviceForRemoteMessages error:', error);
    }
  }

  /**
   * Fetch current FCM Token (cached in MMKV for instant availability)
   */
  public async getFCMToken(): Promise<string | null> {
    try {
      const cachedToken = Storage.getItem<string>(FCM_TOKEN_STORAGE_KEY);
      if (cachedToken) {
        // Fetch fresh in background to check for rotation
        this.fetchAndCacheFreshToken();
        return cachedToken;
      }
      return await this.fetchAndCacheFreshToken();
    } catch (error) {
      console.warn('⚠️ [FCMService] getFCMToken error:', error);
      return null;
    }
  }

  private async fetchAndCacheFreshToken(): Promise<string | null> {
    try {
      const token = await this.getMessaging().getToken();
      if (token) {
        Storage.setItem(FCM_TOKEN_STORAGE_KEY, token);
        console.log('🔑 [FCMService] Fresh FCM Token acquired:', token);
        return token;
      }
      return null;
    } catch (error) {
      console.warn('⚠️ [FCMService] fetchAndCacheFreshToken error:', error);
      return null;
    }
  }

  /**
   * Synchronize FCM Token with Backend API
   */
  public async syncTokenWithBackend(token: string): Promise<boolean> {
    try {
      const lastSyncedToken = await Storage.getItem<string>(FCM_TOKEN_SYNCED_KEY);
      if (lastSyncedToken === token) {
        return true; // Already synced
      }

      console.log('🔄 [FCMService] Syncing FCM Token with backend server...');
      await Storage.setItem(FCM_TOKEN_SYNCED_KEY, token);
      return true;
    } catch (error) {
      console.warn('⚠️ [FCMService] Failed to sync FCM token with backend:', error);
      return false;
    }
  }

  /**
   * Parse Raw Remote Message from Firebase into strongly typed ParsedNotification
   */
  public parseRemoteMessage(
    remoteMessage: RawRemoteMessage,
    source: 'FOREGROUND' | 'BACKGROUND' | 'KILLED' | 'INITIAL_NOTIFICATION'
  ): ParsedNotification {
    const rawData = (remoteMessage.data || {}) as Record<string, any>;
    const notification = remoteMessage.notification || {};

    const type: NotificationType =
      rawData.type ||
      rawData.notificationType ||
      rawData.event ||
      'GENERAL_ALERT';

    const title =
      notification.title ||
      rawData.title ||
      'Sindhi Matrimony';

    const body =
      notification.body ||
      rawData.body ||
      rawData.message ||
      '';

    const payload: MatrimonyNotificationPayload = {
      type,
      profileId: rawData.profileId || rawData.id,
      senderName: rawData.senderName || rawData.name,
      senderPhoto: rawData.senderPhoto || rawData.photo,
      messageText: rawData.messageText || body,
      chatId: rawData.chatId,
      interestId: rawData.interestId,
      planName: rawData.planName,
      discountPercentage: rawData.discountPercentage,
      deepLink: rawData.deepLink || rawData.link,
      screen: rawData.screen,
      additionalData: rawData,
      // Ride fallbacks
      rideId: rawData.rideId,
      driverName: rawData.driverName,
      driverPhone: rawData.driverPhone,
      otp: rawData.otp,
      etaMins: rawData.etaMins,
      fare: rawData.fare,
    };

    return {
      id: remoteMessage.messageId || `msg_${Date.now()}`,
      title,
      body,
      type,
      data: payload,
      receivedAt: Date.now(),
      source,
    };
  }

  /**
   * Foreground Firebase Listener
   */
  private attachForegroundMessageListener() {
    if (this.unsubscribeForeground) return;

    this.unsubscribeForeground = this.getMessaging().onMessage(async (remoteMessage: any) => {
      console.log('☀️ [FCMService] Foreground FCM received:', remoteMessage);

      try {
        const parsed = this.parseRemoteMessage(remoteMessage as unknown as RawRemoteMessage, 'FOREGROUND');
        notificationTracker.logReceived(parsed.id, parsed.type, 'FOREGROUND', parsed.data);

        // 1. Notify in-app subscribers (active screens / components)
        this.notifySubscribers(parsed);

        // 2. Display local banner with Notifee in foreground
        await this.displayLocalNotification(parsed);
      } catch (err) {
        notificationTracker.logError(remoteMessage.messageId || 'fg_err', err, 'onMessage');
      }
    });
  }

  /**
   * Displays local notification banner via Notifee
   */
  public async displayLocalNotification(parsed: ParsedNotification): Promise<void> {
    try {
      const channelId = localNotificationService.resolveChannelId(parsed.type);

      await notifee.displayNotification({
        id: parsed.id,
        title: parsed.title,
        body: parsed.body,
        data: {
          ...parsed.data,
          type: parsed.type,
        },
        android: {
          channelId,
          importance: AndroidImportance.HIGH,
          visibility: AndroidVisibility.PUBLIC,
          smallIcon: 'ic_launcher',
          color: '#E91E63',
          pressAction: {
            id: 'default',
          },
          vibrationPattern: [300, 500],
          sound: 'default',
        },
        ios: {
          sound: 'default',
        },
      });

      notificationTracker.logEvent({
        messageId: parsed.id,
        type: parsed.type,
        action: 'DISPLAYED',
        timestamp: Date.now(),
        appState: parsed.source,
        meta: parsed.data,
      });
    } catch (error) {
      console.warn('⚠️ [FCMService] Failed to display local notification banner:', error);
    }
  }

  /**
   * Listen for Token Refresh
   */
  private attachTokenRefreshListener() {
    if (this.unsubscribeTokenRefresh) return;

    this.unsubscribeTokenRefresh = this.getMessaging().onTokenRefresh(async (newToken: string) => {
      console.log('🔄 [FCMService] FCM Token refreshed:', newToken);
      Storage.setItem(FCM_TOKEN_STORAGE_KEY, newToken);
      await this.syncTokenWithBackend(newToken);
    });
  }

  /**
   * Notifee Foreground Event Listener (When user taps foreground notification)
   */
  private attachNotifeeForegroundListener() {
    if (this.unsubscribeNotifeeForeground) return;

    this.unsubscribeNotifeeForeground = notifee.onForegroundEvent(({ type, detail }: NotifeeEvent) => {
      const { notification, pressAction } = detail;
      if (!notification) return;

      const parsed: ParsedNotification = {
        id: notification.id || `notif_${Date.now()}`,
        title: notification.title || '',
        body: notification.body || '',
        type: (notification.data?.type as NotificationType) || 'GENERAL_ALERT',
        data: (notification.data || {}) as unknown as MatrimonyNotificationPayload,
        receivedAt: Date.now(),
        source: 'FOREGROUND',
      };

      if (type === EventType.PRESS) {
        notificationHandler.handleNotificationTap(parsed);
      } else if (type === EventType.ACTION_PRESS && pressAction?.id) {
        notificationHandler.handleNotificationAction(pressAction.id, parsed);
      } else if (type === EventType.DISMISSED) {
        notificationTracker.logEvent({
          messageId: parsed.id,
          type: parsed.type,
          action: 'DISMISSED',
          timestamp: Date.now(),
          appState: 'FOREGROUND',
        });
      }
    });
  }

  /**
   * Firebase onNotificationOpenedApp Listener
   * Triggers when user taps a Firebase notification while app is in background
   */
  private attachNotificationOpenedAppListener() {
    if (this.unsubscribeNotificationOpenedApp) return;

    this.unsubscribeNotificationOpenedApp = this.getMessaging().onNotificationOpenedApp((remoteMessage: any) => {
      console.log('📱 [FCMService] FCM notification tapped in background (onNotificationOpenedApp):', remoteMessage);
      try {
        if (!remoteMessage) return;
        const parsed = this.parseRemoteMessage(remoteMessage as unknown as RawRemoteMessage, 'BACKGROUND');
        notificationTracker.logClicked(parsed.id, parsed.type, 'BACKGROUND', parsed.data);
        notificationHandler.handleNotificationTap(parsed);
      } catch (err) {
        notificationTracker.logError(remoteMessage?.messageId || 'opened_app_err', err, 'onNotificationOpenedApp');
      }
    });
  }

  /**
   * Check if app was opened from notification banner (Cold Start / Killed state)
   */
  public async checkInitialNotification(): Promise<void> {
    try {
      // 1. Check Notifee initial notification
      const notifeeInitial = await notifee.getInitialNotification();
      if (notifeeInitial?.notification && !notificationHandler.hasHandledInitialNotification) {
        console.log('❄️ [FCMService] Cold-start from Notifee notification:', notifeeInitial.notification);
        const parsed: ParsedNotification = {
          id: notifeeInitial.notification.id || `init_${Date.now()}`,
          title: notifeeInitial.notification.title || '',
          body: notifeeInitial.notification.body || '',
          type: (notifeeInitial.notification.data?.type as NotificationType) || 'GENERAL_ALERT',
          data: (notifeeInitial.notification.data || {}) as unknown as MatrimonyNotificationPayload,
          receivedAt: Date.now(),
          source: 'INITIAL_NOTIFICATION',
        };
        notificationHandler.handleNotificationTap(parsed);
        return;
      }

      // 2. Check Firebase FCM initial notification
      const fcmInitial = await this.getMessaging().getInitialNotification();
      if (fcmInitial && !notificationHandler.hasHandledInitialNotification) {
        console.log('❄️ [FCMService] Cold-start from Firebase FCM notification:', fcmInitial);
        const parsed = this.parseRemoteMessage(fcmInitial as unknown as RawRemoteMessage, 'INITIAL_NOTIFICATION');
        notificationHandler.handleNotificationTap(parsed);
      }
    } catch (err) {
      console.warn('⚠️ [FCMService] checkInitialNotification error:', err);
    }
  }

  /**
   * Subscribe component callback to real-time notifications
   */
  public subscribe(callback: NotificationEventCallback): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notifySubscribers(notification: ParsedNotification) {
    this.listeners.forEach((callback) => {
      try {
        callback(notification);
      } catch (e) {
        console.warn('⚠️ [FCMService] Error executing listener callback:', e);
      }
    });
  }

  /**
   * Delete FCM Token (Call upon user Logout)
   */
  public async deleteToken(): Promise<void> {
    try {
      await this.getMessaging().deleteToken();
      Storage.removeItem(FCM_TOKEN_STORAGE_KEY);
      Storage.removeItem(FCM_TOKEN_SYNCED_KEY);
      console.log('🗑️ [FCMService] FCM Token deleted on logout.');
    } catch (error) {
      console.warn('⚠️ [FCMService] Failed to delete token:', error);
    }
  }
}

export const fcmService = new FCMService();
