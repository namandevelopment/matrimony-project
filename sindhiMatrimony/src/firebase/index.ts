/**
 * Firebase Module Barrel Export
 * Sindhi Matrimony Application
 */

export * from './types';
export * from './fcmService';
export * from './notificationChannels';
export * from './notificationHandler';
export * from './notificationTracker';
export * from './backgroundHandler';
export * from './useNotificationObserver';
export * from './localNotificationService';

// Convenience Singleton Exports
export { fcmService as NotificationService } from './fcmService';
export { notificationHandler as NotificationHandler } from './notificationHandler';
export { notificationTracker as NotificationTracker } from './notificationTracker';
export { localNotificationService as LocalNotificationService } from './localNotificationService';

// Navigation Helpers
export const handleNotificationTap = (notif: import('./types').ParsedNotification) =>
  import('./notificationHandler').then((m) => m.notificationHandler.handleNotificationTap(notif));

export const processPendingNotificationRedirect = () =>
  import('./notificationHandler').then((m) => m.notificationHandler.processPendingNotificationRedirect());

// Direct Action Function Exports
export const displayLocalNotification = (opts: import('./localNotificationService').LocalNotificationOptions) =>
  import('./localNotificationService').then((m) => m.localNotificationService.displayLocalNotification(opts));

export const showLocalNotification = displayLocalNotification;

export const scheduleLocalNotification = (opts: import('./localNotificationService').ScheduleNotificationOptions) =>
  import('./localNotificationService').then((m) => m.localNotificationService.schedule(opts));

export const cancelNotification = (id: string) =>
  import('./localNotificationService').then((m) => m.localNotificationService.cancel(id));

export const cancelAllNotifications = () =>
  import('./localNotificationService').then((m) => m.localNotificationService.cancelAll());

export const showLoginSuccessNotification = (userName?: string) =>
  import('./localNotificationService').then((m) => m.localNotificationService.showLoginSuccess(userName));

export const showRegisterSuccessNotification = (userName?: string) =>
  import('./localNotificationService').then((m) => m.localNotificationService.showRegisterSuccess(userName));

export const showOtpSentNotification = (phoneNumber?: string) =>
  import('./localNotificationService').then((m) => m.localNotificationService.showOtpSent(phoneNumber));
