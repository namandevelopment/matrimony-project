/**
 * Local Notification Engine (Notifee Powered)
 * Sindhi Matrimony Application
 *
 * Provides standalone utility functions for triggering immediate, scheduled,
 * progress-based, and matrimony-specific local notifications with sound, vibration,
 * and interactive action buttons.
 */

import notifee, {
  AndroidImportance,
  AndroidVisibility,
  TriggerType,
  TimestampTrigger,
} from '@notifee/react-native';
import { NotificationType, NotificationChannelId, MatrimonyNotificationPayload } from './types';
import { notificationTracker } from './notificationTracker';

export interface LocalNotificationOptions {
  id?: string;
  title: string;
  body: string;
  subtitle?: string;
  type?: NotificationType;
  channelId?: NotificationChannelId;
  data?: Record<string, any>;
  sound?: string;
  vibrate?: boolean;
  color?: string;
  smallIcon?: string;
  actions?: Array<{
    title: string;
    pressAction: {
      id: string;
    };
  }>;
  badgeCount?: number;
}

export interface ScheduleNotificationOptions extends LocalNotificationOptions {
  timestamp: number; // Future timestamp in milliseconds
}

export interface ProgressNotificationOptions {
  id: string;
  title: string;
  body: string;
  currentProgress: number; // e.g. 70
  maxProgress?: number; // default 100
  indeterminate?: boolean;
  channelId?: NotificationChannelId;
  data?: Record<string, any>;
}

class LocalNotificationService {
  /**
   * 1. Unified function: Trigger an Immediate Local Notification
   */
  public async displayLocalNotification(options: LocalNotificationOptions): Promise<string | null> {
    try {
      const id = options.id || `local_${Date.now()}`;
      const type = options.type || 'GENERAL_ALERT';
      const channelId = options.channelId || this.resolveChannelId(type);

      await notifee.displayNotification({
        id,
        title: options.title,
        body: options.body,
        subtitle: options.subtitle,
        data: {
          ...options.data,
          type,
        },
        android: {
          channelId,
          importance: AndroidImportance.HIGH,
          visibility: AndroidVisibility.PUBLIC,
          smallIcon: options.smallIcon || 'ic_launcher',
          color: options.color || '#E91E63', // Matrimony Pink/Rose
          pressAction: {
            id: 'default',
          },
          actions: options.actions || this.getDefaultActionsForType(type, options.data),
          vibrationPattern: options.vibrate !== false ? [300, 500] : undefined,
          sound: options.sound || 'default',
        },
        ios: {
          sound: options.sound || 'default',
          critical: type === 'NEW_MATCH' || type === 'NEW_MESSAGE',
          ...(typeof options.badgeCount === 'number' && options.badgeCount >= 0
            ? { badgeCount: Math.floor(options.badgeCount) }
            : {}),
        },
      });

      notificationTracker.logEvent({
        messageId: id,
        type,
        action: 'DISPLAYED',
        timestamp: Date.now(),
        appState: 'FOREGROUND',
        meta: options.data,
      });

      return id;
    } catch (error) {
      notificationTracker.logError(
        options.id || 'local_error',
        error,
        'LocalNotificationService.displayLocalNotification'
      );
      return null;
    }
  }

  // Alias for backward compatibility
  public show = this.displayLocalNotification;

  /**
   * 2. Schedule a Notification for Future Trigger
   */
  public async schedule(options: ScheduleNotificationOptions): Promise<string | null> {
    try {
      const id = options.id || `sched_${Date.now()}`;
      const type = options.type || 'GENERAL_ALERT';
      const channelId = options.channelId || this.resolveChannelId(type);

      const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: options.timestamp,
      };

      await notifee.createTriggerNotification(
        {
          id,
          title: options.title,
          body: options.body,
          subtitle: options.subtitle,
          data: {
            ...options.data,
            type,
          },
          android: {
            channelId,
            importance: AndroidImportance.HIGH,
            visibility: AndroidVisibility.PUBLIC,
            smallIcon: options.smallIcon || 'ic_launcher',
            color: options.color || '#E91E63',
            pressAction: { id: 'default' },
            actions: options.actions || this.getDefaultActionsForType(type, options.data),
          },
          ios: {
            sound: options.sound || 'default',
          },
        },
        trigger
      );

      console.log(
        `⏰ [LocalNotificationService] Scheduled notification ID: ${id} at ${new Date(
          options.timestamp
        ).toLocaleTimeString()}`
      );
      return id;
    } catch (error) {
      notificationTracker.logError(
        options.id || 'sched_error',
        error,
        'LocalNotificationService.schedule'
      );
      return null;
    }
  }

  /**
   * 3. Display or Update a Progress Notification (e.g. Profile completion / upload)
   */
  public async showProgress(options: ProgressNotificationOptions): Promise<string | null> {
    try {
      const max = options.maxProgress || 100;
      const current = Math.min(Math.max(0, options.currentProgress), max);
      const channelId = options.channelId || 'matrimony_general_channel';

      await notifee.displayNotification({
        id: options.id,
        title: options.title,
        body: options.body,
        data: options.data,
        android: {
          channelId,
          smallIcon: 'ic_launcher',
          color: '#E91E63',
          onlyAlertOnce: true,
          progress: {
            max,
            current,
            indeterminate: Boolean(options.indeterminate),
          },
          pressAction: { id: 'default' },
        },
      });

      return options.id;
    } catch (error) {
      notificationTracker.logError(
        options.id,
        error,
        'LocalNotificationService.showProgress'
      );
      return null;
    }
  }

  /**
   * 4. Matrimony Specific Notification Presets
   */
  public showMatchAlert(name: string, age: number | string, city: string, profileId?: string) {
    return this.show({
      title: '💍 New Match Recommendation!',
      body: `${name}, ${age} from ${city} matches your partner preferences.`,
      type: 'NEW_MATCH',
      data: { profileId, senderName: name },
      actions: [
        { title: 'View Profile', pressAction: { id: 'VIEW_MATCH' } },
        { title: 'Send Interest', pressAction: { id: 'ACCEPT_INTEREST' } },
      ],
    });
  }

  public showNewMessage(senderName: string, message: string, chatId?: string) {
    return this.show({
      title: `💬 Message from ${senderName}`,
      body: message,
      type: 'NEW_MESSAGE',
      data: { chatId, senderName },
      actions: [
        { title: 'Reply', pressAction: { id: 'REPLY_MESSAGE' } },
      ],
    });
  }

  public showInterestAlert(senderName: string, profileId?: string) {
    return this.show({
      title: '💌 Interest Received!',
      body: `${senderName} has sent you an interest. Check their profile now.`,
      type: 'INTEREST_RECEIVED',
      data: { profileId, senderName },
      actions: [
        { title: 'View Profile', pressAction: { id: 'VIEW_PROFILE' } },
        { title: 'Accept', pressAction: { id: 'ACCEPT_INTEREST' } },
      ],
    });
  }

  public showUpgradeOffer(discount = '30%', planName = 'Premium Gold') {
    return this.show({
      title: `🎉 Special Offer: ${discount} OFF on ${planName}`,
      body: 'Unlock unlimited contacts, chats and premium matches today!',
      type: 'UPGRADE_OFFER',
      data: { planName },
      actions: [
        { title: 'Upgrade Now', pressAction: { id: 'UPGRADE_NOW' } },
      ],
    });
  }

  /**
   * 5. Auth Notification Helpers (Login, Register, OTP)
   */
  public showLoginSuccess(userName?: string) {
    return this.show({
      title: '✨ Welcome Back!',
      body: userName
        ? `Hello ${userName}, you've logged in successfully to Sindhi Matrimony.`
        : 'Welcome back to Sindhi Matrimony. Find your perfect match today.',
      type: 'LOGIN_SUCCESS',
      data: { userName },
    });
  }

  public showRegisterSuccess(userName?: string) {
    return this.show({
      title: '💍 Registration Successful!',
      body: userName
        ? `Welcome ${userName}! Your profile is now live on Sindhi Matrimony.`
        : 'Welcome to Sindhi Matrimony! Your profile is now live. Complete your details to receive verified matches.',
      type: 'REGISTER_SUCCESS',
      data: { userName },
    });
  }

  public showOtpSent(phoneNumber?: string) {
    return this.show({
      title: '📲 OTP Sent Successfully',
      body: `Verification code sent to ${phoneNumber || 'your registered number'}. Valid for 10 minutes.`,
      type: 'OTP_SENT',
      data: { phoneNumber },
    });
  }

  // Compatibility helper for Cab workflows
  public showDriverArrived(driverName: string, otp: string, phone?: string) {
    return this.show({
      title: '🚕 Cab Arrived',
      body: `${driverName} has arrived at pickup. OTP: ${otp}`,
      type: 'DRIVER_ARRIVED',
      data: { driverName, otp, driverPhone: phone },
    });
  }

  /**
   * 5. Cancel a Specific Notification
   */
  public async cancel(id: string): Promise<void> {
    try {
      await notifee.cancelNotification(id);
    } catch (error) {
      console.warn(`[LocalNotificationService] Failed to cancel notification ${id}:`, error);
    }
  }

  /**
   * 6. Cancel All Displayed and Scheduled Notifications
   */
  public async cancelAll(): Promise<void> {
    try {
      await notifee.cancelAllNotifications();
    } catch (error) {
      console.warn('[LocalNotificationService] Failed to cancel all notifications:', error);
    }
  }

  /**
   * 7. Set App Icon Badge Count (iOS & supported Android launchers)
   */
  public async setBadgeCount(count: number): Promise<void> {
    try {
      await notifee.setBadgeCount(Math.max(0, count));
    } catch (error) {
      console.warn('[LocalNotificationService] Failed to update badge count:', error);
    }
  }

  /**
   * Helper: Maps Notification Type to Android Channel ID
   */
  public resolveChannelId(type: NotificationType): NotificationChannelId {
    switch (type) {
      case 'NEW_MATCH':
      case 'MATCH_ALERT':
        return 'matrimony_matches_critical';
      case 'NEW_MESSAGE':
      case 'CHAT_MESSAGE':
        return 'matrimony_messages_channel';
      case 'INTEREST_RECEIVED':
      case 'INTEREST_ACCEPTED':
      case 'PROFILE_VIEW':
      case 'PROFILE_VISIT':
        return 'matrimony_interests_channel';
      case 'UPGRADE_OFFER':
      case 'MEMBERSHIP_EXPIRED':
      case 'PROMO_OFFER':
        return 'matrimony_promotions_channel';
      case 'DRIVER_ARRIVED':
      case 'RIDE_STARTED':
      case 'SOS_ALERT':
        return 'ola_rides_critical';
      default:
        return 'matrimony_general_channel';
    }
  }

  /**
   * Helper: Default Action buttons based on type
   */
  private getDefaultActionsForType(
    type: NotificationType,
    data?: Record<string, any>
  ): Array<{ title: string; pressAction: { id: string } }> | undefined {
    switch (type) {
      case 'NEW_MATCH':
      case 'MATCH_ALERT':
        return [
          { title: 'View Match', pressAction: { id: 'VIEW_MATCH' } },
        ];
      case 'NEW_MESSAGE':
      case 'CHAT_MESSAGE':
        return [
          { title: 'Reply', pressAction: { id: 'REPLY_MESSAGE' } },
        ];
      case 'INTEREST_RECEIVED':
        return [
          { title: 'Accept', pressAction: { id: 'ACCEPT_INTEREST' } },
          { title: 'View', pressAction: { id: 'VIEW_PROFILE' } },
        ];
      case 'UPGRADE_OFFER':
        return [
          { title: 'Upgrade Now', pressAction: { id: 'UPGRADE_NOW' } },
        ];
      case 'DRIVER_ARRIVED':
        return [
          { title: 'Call Driver', pressAction: { id: 'CALL_DRIVER' } },
        ];
      default:
        return undefined;
    }
  }
}

export const localNotificationService = new LocalNotificationService();

/**
 * Unified Standalone Local Notification Function
 * Pass any notification payload (title, body, type, data, channelId, etc.)
 *
 * @example
 * await displayLocalNotification({
 *   title: '💍 Registration Successful!',
 *   body: 'Welcome to Sindhi Matrimony.',
 *   type: 'REGISTER_SUCCESS',
 * });
 */
export const displayLocalNotification = (options: LocalNotificationOptions) =>
  localNotificationService.displayLocalNotification(options);
