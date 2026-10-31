/**
 * Notification Channels Configuration for Android & iOS
 * Sindhi Matrimony Application
 */

import notifee, {
  AndroidImportance,
  AndroidVisibility,
  AndroidColor,
} from '@notifee/react-native';
import { NotificationChannelId } from './types';

export interface ChannelConfig {
  id: NotificationChannelId;
  name: string;
  description: string;
  importance: AndroidImportance;
  vibration: boolean;
  sound?: string;
  visibility?: AndroidVisibility;
  lights?: boolean;
  lightColor?: string;
}

export const NOTIFICATION_CHANNELS: ChannelConfig[] = [
  {
    id: 'matrimony_matches_critical',
    name: 'New Matches & Recommendations',
    description: 'High priority alerts for top compatible profile matches and proposals',
    importance: AndroidImportance.HIGH,
    vibration: true,
    sound: 'default',
    visibility: AndroidVisibility.PUBLIC,
    lights: true,
    lightColor: AndroidColor.RED,
  },
  {
    id: 'matrimony_messages_channel',
    name: 'Chat & Direct Messages',
    description: 'Instant messages received from prospective matches',
    importance: AndroidImportance.HIGH,
    vibration: true,
    sound: 'default',
    visibility: AndroidVisibility.PUBLIC,
    lights: true,
    lightColor: AndroidColor.BLUE,
  },
  {
    id: 'matrimony_interests_channel',
    name: 'Interests & Profile Activity',
    description: 'Notifications when someone sends or accepts your interest, or views your profile',
    importance: AndroidImportance.DEFAULT,
    vibration: true,
    sound: 'default',
    visibility: AndroidVisibility.PUBLIC,
  },
  {
    id: 'matrimony_promotions_channel',
    name: 'Offers, Plans & Discounts',
    description: 'Premium membership discounts, special festive offers, and renewals',
    importance: AndroidImportance.LOW,
    vibration: false,
    visibility: AndroidVisibility.PRIVATE,
  },
  {
    id: 'matrimony_general_channel',
    name: 'General Updates & Verification',
    description: 'Account security, profile verification badges, and system announcements',
    importance: AndroidImportance.DEFAULT,
    vibration: true,
    sound: 'default',
    visibility: AndroidVisibility.PUBLIC,
  },
  // Compatibility Channels (for Cab/Rider workflows if invoked)
  {
    id: 'ola_rides_critical',
    name: 'Critical Alerts',
    description: 'High priority alerts',
    importance: AndroidImportance.HIGH,
    vibration: true,
    sound: 'default',
    visibility: AndroidVisibility.PUBLIC,
  },
  {
    id: 'ola_rides_updates',
    name: 'Live Updates',
    description: 'Real-time updates',
    importance: AndroidImportance.DEFAULT,
    vibration: true,
    sound: 'default',
    visibility: AndroidVisibility.PUBLIC,
  },
  {
    id: 'ola_sos_channel',
    name: 'Emergency & Safety',
    description: 'Safety alerts',
    importance: AndroidImportance.HIGH,
    vibration: true,
    sound: 'default',
    visibility: AndroidVisibility.PUBLIC,
  },
  {
    id: 'ola_promotions_channel',
    name: 'Promotions',
    description: 'Special offers',
    importance: AndroidImportance.LOW,
    vibration: false,
    visibility: AndroidVisibility.PRIVATE,
  },
  {
    id: 'ola_general_channel',
    name: 'General Notifications',
    description: 'General updates',
    importance: AndroidImportance.DEFAULT,
    vibration: true,
    sound: 'default',
    visibility: AndroidVisibility.PUBLIC,
  },
];

/**
 * Creates all required Android notification channels at app startup.
 * Fully safe with try-catch so it never crashes if native module is unavailable.
 */
export async function setupNotificationChannels(): Promise<boolean> {
  try {
    for (const channel of NOTIFICATION_CHANNELS) {
      const channelPayload: Parameters<typeof notifee.createChannel>[0] = {
        id: channel.id,
        name: channel.name,
        description: channel.description,
        importance: channel.importance,
        vibration: channel.vibration,
        lights: Boolean(channel.lights),
      };

      if (channel.sound !== undefined) {
        channelPayload.sound = channel.sound;
      }
      if (channel.visibility !== undefined) {
        channelPayload.visibility = channel.visibility;
      }
      if (channel.lightColor !== undefined) {
        channelPayload.lightColor = channel.lightColor;
      }

      await notifee.createChannel(channelPayload);
    }
    console.log('✅ [NotificationChannels] Android Notification Channels initialized successfully.');
    return true;
  } catch (error) {
    console.warn('⚠️ [NotificationChannels] Failed to create notification channels:', error);
    return false;
  }
}
