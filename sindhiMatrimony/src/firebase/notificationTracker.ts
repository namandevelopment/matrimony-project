/**
 * Notification Analytics & Delivery Tracker
 * Sindhi Matrimony Application
 *
 * Tracks delivery rates, clicks, user interactions, action buttons and errors
 * with local buffering and optional crashlytics/sentry breadcrumbs.
 */

import { NotificationTrackerEvent, NotificationType, NotificationSourceState } from './types';
import { Storage } from '../storage/Storage';

const STORAGE_KEY_NOTIFICATION_LOGS = 'cached_notification_logs_v1';
const MAX_BUFFERED_LOGS = 50;

class NotificationTracker {
  private logBuffer: NotificationTrackerEvent[] = [];

  constructor() {
    this.restoreBufferedLogs();
  }

  private restoreBufferedLogs() {
    try {
      const saved = Storage.getItem<NotificationTrackerEvent[]>(STORAGE_KEY_NOTIFICATION_LOGS);
      if (Array.isArray(saved)) {
        this.logBuffer = saved.slice(-MAX_BUFFERED_LOGS);
      }
    } catch (e) {
      console.warn('⚠️ [NotificationTracker] Error restoring logs from MMKV:', e);
    }
  }

  private persistLogs() {
    try {
      Storage.setItem(STORAGE_KEY_NOTIFICATION_LOGS, this.logBuffer.slice(-MAX_BUFFERED_LOGS));
    } catch (e) {
      console.warn('⚠️ [NotificationTracker] Error saving logs to MMKV:', e);
    }
  }

  /**
   * Log an event across all states (Foreground, Background, Killed, Initial)
   */
  public logEvent(event: NotificationTrackerEvent) {
    try {
      console.log(
        `📊 [NotificationTracker] ${event.action} | Type: ${event.type} | State: ${event.appState} | ID: ${event.messageId}`
      );

      // Add to local buffer
      this.logBuffer.push(event);
      this.persistLogs();
    } catch (err) {
      console.warn('⚠️ [NotificationTracker] Failed to record event:', err);
    }
  }

  /**
   * Helper to log received notification
   */
  public logReceived(
    messageId: string,
    type: NotificationType,
    appState: NotificationSourceState,
    meta?: Record<string, any>
  ) {
    this.logEvent({
      messageId: messageId || `gen_${Date.now()}`,
      type,
      action: 'RECEIVED',
      timestamp: Date.now(),
      appState,
      meta,
    });
  }

  /**
   * Helper to log notification click / tap
   */
  public logClicked(
    messageId: string,
    type: NotificationType,
    appState: NotificationSourceState,
    meta?: Record<string, any>
  ) {
    this.logEvent({
      messageId: messageId || `gen_${Date.now()}`,
      type,
      action: 'CLICKED',
      timestamp: Date.now(),
      appState,
      meta,
    });
  }

  /**
   * Helper to log action button press
   */
  public logActionPressed(
    messageId: string,
    type: NotificationType,
    actionId: string,
    appState: NotificationSourceState,
    meta?: Record<string, any>
  ) {
    this.logEvent({
      messageId: messageId || `gen_${Date.now()}`,
      type,
      action: 'ACTION_PRESSED',
      actionId,
      timestamp: Date.now(),
      appState,
      meta,
    });
  }

  /**
   * Helper to log notification error
   */
  public logError(messageId: string, error: any, context?: string) {
    try {
      console.warn(`🚨 [NotificationTracker] Error in ${context || 'Notification'}:`, error);
    } catch (e) {
      console.warn('⚠️ [NotificationTracker] Failed to log error:', e);
    }
  }

  /**
   * Get all buffered logs for debugging / support diagnostics
   */
  public getLogs(): NotificationTrackerEvent[] {
    return [...this.logBuffer];
  }

  /**
   * Clear all notification logs
   */
  public clearLogs() {
    this.logBuffer = [];
    Storage.removeItem(STORAGE_KEY_NOTIFICATION_LOGS);
  }
}

export const notificationTracker = new NotificationTracker();
