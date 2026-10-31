/**
 * Firebase FCM & Notifee Notification Types
 * Sindhi Matrimony Application
 */

export type NotificationType =
  // Matrimony Core Events
  | 'NEW_MATCH'
  | 'MATCH_ALERT'
  | 'INTEREST_RECEIVED'
  | 'INTEREST_ACCEPTED'
  | 'NEW_MESSAGE'
  | 'CHAT_MESSAGE'
  | 'PROFILE_VIEW'
  | 'PROFILE_VISIT'
  | 'PROFILE_VERIFIED'
  | 'PHOTO_REQUEST'
  | 'UPGRADE_OFFER'
  | 'MEMBERSHIP_EXPIRED'
  | 'GENERAL_ALERT'
  | 'SUPPORT_CHAT'
  // Auth Events
  | 'LOGIN_SUCCESS'
  | 'REGISTER_SUCCESS'
  | 'OTP_SENT'
  // Common / Cab Compatibility Events
  | 'RIDE_REQUESTED'
  | 'DRIVER_ASSIGNED'
  | 'DRIVER_LOCATION_UPDATE'
  | 'DRIVER_ARRIVED'
  | 'RIDE_STARTED'
  | 'RIDE_COMPLETED'
  | 'RIDE_CANCELLED'
  | 'PAYMENT_SUCCESS'
  | 'SOS_ALERT'
  | 'PROMO_OFFER';

export type NotificationChannelId =
  | 'matrimony_matches_critical'
  | 'matrimony_messages_channel'
  | 'matrimony_interests_channel'
  | 'matrimony_promotions_channel'
  | 'matrimony_general_channel'
  // Legacy / Compatibility Channels
  | 'ola_rides_critical'
  | 'ola_rides_updates'
  | 'ola_sos_channel'
  | 'ola_promotions_channel'
  | 'ola_general_channel';

export interface NotificationAction {
  id: string;
  title: string;
  pressAction: {
    id: string;
  };
}

export interface MatrimonyNotificationPayload {
  type: NotificationType;
  profileId?: string;
  senderName?: string;
  senderPhoto?: string;
  messageText?: string;
  chatId?: string;
  interestId?: string;
  planName?: string;
  discountPercentage?: number | string;
  deepLink?: string;
  screen?: string;
  additionalData?: Record<string, any>;
  // Ride / Generic Compatibility fields
  rideId?: string;
  driverName?: string;
  driverPhone?: string;
  vehicleModel?: string;
  plateNumber?: string;
  otp?: string;
  etaMins?: number | string;
  distanceKm?: number | string;
  progressPercentage?: number | string;
  fare?: number | string;
  pickupAddress?: string;
  dropAddress?: string;
  trackingUrl?: string;
  [key: string]: any;
}

export type RideNotificationPayload = MatrimonyNotificationPayload;

export interface RawRemoteMessage {
  messageId?: string;
  collapseKey?: string;
  from?: string;
  sentTime?: number;
  ttl?: number;
  notification?: {
    title?: string;
    body?: string;
    android?: any;
    ios?: any;
  };
  data?: Record<string, string>;
}

export type NotificationSourceState =
  | 'FOREGROUND'
  | 'BACKGROUND'
  | 'KILLED'
  | 'INITIAL_NOTIFICATION';

export interface ParsedNotification {
  id: string;
  title: string;
  body: string;
  type: NotificationType;
  data: MatrimonyNotificationPayload;
  receivedAt: number;
  source: NotificationSourceState;
}

export type NotificationEventCallback = (notification: ParsedNotification) => void;

export interface NotificationTrackerEvent {
  messageId: string;
  type: NotificationType;
  action: 'RECEIVED' | 'DISPLAYED' | 'CLICKED' | 'DISMISSED' | 'ACTION_PRESSED';
  actionId?: string;
  timestamp: number;
  appState: NotificationSourceState;
  meta?: Record<string, any>;
}
