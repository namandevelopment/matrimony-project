/**
 * Firebase Crashlytics & Analytics Service
 * Sindhi Matrimony Application
 *
 * Robust error handling and telemetry with safe fallbacks and zero JS crashes.
 */

import { Platform } from 'react-native';
import { ApiURL } from '../redux/apiService/endpoint';

class CrashlyticsService {
  private isInitialized = false;
  private currentUserId = '';

  public initialize(): void {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // Attach global JavaScript error handler
    if (typeof (global as any).ErrorUtils !== 'undefined') {
      const defaultHandler = (global as any).ErrorUtils.getGlobalHandler();
      (global as any).ErrorUtils.setGlobalHandler((error: Error, isFatal?: boolean) => {
        this.recordError(error, { isFatal, source: 'global_handler' });
        if (typeof defaultHandler === 'function') {
          defaultHandler(error, isFatal);
        }
      });
    }

    this.logEvent('app_initialized', { platform: Platform.OS });
  }

  public recordError(error: Error | any, context?: Record<string, any>): void {
    try {
      const errMsg = error?.message || String(error);
      const stack = error?.stack || 'No stack trace';

      if (__DEV__) {
        console.warn('🚨 [Crashlytics] Recorded exception:', errMsg, context);
      }

      // Safe delegate to native Crashlytics if package is available
      try {
        const crashlyticsModule = require('@react-native-firebase/crashlytics');
        const crashlytics = crashlyticsModule.default ? crashlyticsModule.default() : crashlyticsModule();
        if (context) {
          Object.entries(context).forEach(([k, v]) => crashlytics.setAttribute(k, String(v)));
        }
        crashlytics.recordError(error instanceof Error ? error : new Error(errMsg));
      } catch {
        // Native module optional fallback
      }

      // Forward real-time crash alert to Admin CRM
      fetch(ApiURL.reportCrash, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: errMsg,
          stack,
          isFatal: context?.isFatal,
          platform: Platform.OS,
          screen: context?.screen,
          userId: this.currentUserId,
        }),
      }).catch(() => {});
    } catch {}
  }

  public setUserId(userId: string): void {
    this.currentUserId = userId;
    try {
      const crashlyticsModule = require('@react-native-firebase/crashlytics');
      const crashlytics = crashlyticsModule.default ? crashlyticsModule.default() : crashlyticsModule();
      crashlytics.setUserId(userId);
    } catch {}
  }

  public log(message: string): void {
    try {
      const crashlyticsModule = require('@react-native-firebase/crashlytics');
      const crashlytics = crashlyticsModule.default ? crashlyticsModule.default() : crashlyticsModule();
      crashlytics.log(message);
    } catch {}
  }

  public setAttribute(key: string, value: string): void {
    try {
      const crashlyticsModule = require('@react-native-firebase/crashlytics');
      const crashlytics = crashlyticsModule.default ? crashlyticsModule.default() : crashlyticsModule();
      crashlytics.setAttribute(key, String(value));
    } catch {}
  }

  public logEvent(eventName: string, params?: Record<string, any>): void {
    try {
      if (__DEV__) {
        console.log(`📊 [Analytics] Event: ${eventName}`, params);
      }
      const analyticsModule = require('@react-native-firebase/analytics');
      const analytics = analyticsModule.default ? analyticsModule.default() : analyticsModule();
      analytics.logEvent(eventName, params);
    } catch {}
  }
}

export const crashlyticsService = new CrashlyticsService();
export default crashlyticsService;

