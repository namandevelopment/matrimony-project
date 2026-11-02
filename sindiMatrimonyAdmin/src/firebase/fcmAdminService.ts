/**
 * Firebase Cloud Messaging (FCM) Admin Engine
 * Sindhi Matrimony Application (Admin CRM Portal)
 *
 * Full functional parity with Mobile & User Panel:
 * - Service worker registration and permission lifecycle
 * - Role-based authorization & notification suppression
 * - Automatic device token sync with Backend API (/api/v1/notifications/fcm-token)
 * - Foreground notification dispatch to operational Toast and in-app feeds
 */

import { getToken, onMessage, deleteToken } from 'firebase/messaging';
import type { MessagePayload } from 'firebase/messaging';
import { getFirebaseMessaging, getFirebaseAnalytics } from './firebaseConfig';
import { isNotificationPermittedForRole } from './roleFilter';
import { storage, getActiveRole, getStoredUser, getToken as getAuthToken } from '../storage';
import { apiFetch, ApiURL } from '../redux/apiService';
import { toast } from '../toastMessage/toast';

const FCM_TOKEN_STORAGE_KEY = 'admin_fcm_device_token_v1';
const FCM_TOKEN_SYNCED_KEY = 'admin_fcm_token_synced_v1';

export type AdminNotificationCallback = (payload: MessagePayload) => void;

class FCMAdminService {
  private isInitialized: boolean = false;
  private messageListeners: Set<AdminNotificationCallback> = new Set();
  private swRegistration: ServiceWorkerRegistration | null = null;

  /**
   * Register service worker and initialize FCM
   */
  public async initialize(): Promise<string | null> {
    if (typeof window === 'undefined') return null;
    if (this.isInitialized) return this.getDeviceToken();

    try {
      getFirebaseAnalytics().catch(() => {});

      if (!('serviceWorker' in navigator) || !('Notification' in window)) {
        console.warn('⚠️ [FCM Admin] Push notifications not supported in this browser.');
        return null;
      }

      this.swRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
        scope: '/',
      });

      this.isInitialized = true;
      this.setupForegroundListener();

      if (Notification.permission === 'granted') {
        return await this.getDeviceToken();
      }

      return null;
    } catch (err) {
      console.error('❌ [FCM Admin] Initialization failed:', err);
      return null;
    }
  }

  /**
   * Request user permission and obtain FCM registration token
   */
  public async requestPermissionAndGetToken(): Promise<string | null> {
    if (typeof window === 'undefined') return null;

    try {
      if (!('Notification' in window)) return null;

      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.log('ℹ️ [FCM Admin] Permission denied or dismissed.');
        return null;
      }

      return await this.getDeviceToken();
    } catch (err) {
      console.error('❌ [FCM Admin] Error requesting permission:', err);
      return null;
    }
  }

  /**
   * Retrieve device FCM token
   */
  public async getDeviceToken(): Promise<string | null> {
    try {
      const messaging = await getFirebaseMessaging();
      if (!messaging) return null;

      const sw = this.swRegistration || (await navigator.serviceWorker.ready);

      const currentToken = await getToken(messaging, {
        serviceWorkerRegistration: sw,
      });

      if (currentToken) {
        storage.set(FCM_TOKEN_STORAGE_KEY, currentToken);
        await this.syncTokenWithBackend(currentToken);
        return currentToken;
      }

      return null;
    } catch (err) {
      console.error('❌ [FCM Admin] Failed to retrieve token:', err);
      return null;
    }
  }

  /**
   * Synchronize the FCM token with the backend API
   */
  public async syncTokenWithBackend(token: string): Promise<boolean> {
    try {
      if (!token) return false;
      const lastSynced = storage.getString(FCM_TOKEN_SYNCED_KEY);
      if (lastSynced === token) {
        return true;
      }

      const authToken = getAuthToken();
      if (!authToken) {
        return false;
      }

      const user = getStoredUser();
      const activeRole = getActiveRole() || user?.role || 'SUPER_ADMIN';

      await apiFetch.post(
        ApiURL.updateFcmDeviceToken,
        {
          token,
          platform: 'WEB',
          role: activeRole,
          employeeId: user?.id || user?._id || user?.employeeId,
        },
        { isToken: true, showErrorToast: false }
      );

      storage.set(FCM_TOKEN_SYNCED_KEY, token);
      console.log('✅ [FCM Admin] Token registered successfully with role:', activeRole);
      return true;
    } catch (err) {
      console.warn('⚠️ [FCM Admin] Token registration skipped or failed:', err);
      return false;
    }
  }

  /**
   * Setup foreground push notification listener with strict Role-Based Filtering
   */
  private async setupForegroundListener() {
    try {
      const messaging = await getFirebaseMessaging();
      if (!messaging) return;

      onMessage(messaging, (payload) => {
        const user = getStoredUser();
        const activeRole = getActiveRole() || user?.role || 'SUPER_ADMIN';
        const employeeId = user?.id || user?._id || user?.employeeId;

        // Role-Based Authorization Gate
        const isPermitted = isNotificationPermittedForRole(
          {
            category: payload.data?.category,
            targetRole: payload.data?.targetRole,
            allowedRoles: payload.data?.allowedRoles,
            targetEmployeeId: payload.data?.targetEmployeeId,
          },
          activeRole,
          employeeId
        );

        if (!isPermitted) {
          console.log(`🔒 [FCM Admin] Notification suppressed: role '${activeRole}' unauthorized for category '${payload.data?.category}'`);
          return;
        }

        // Forward to subscribers
        this.messageListeners.forEach((callback) => {
          try {
            callback(payload);
          } catch (e) {
            console.error('Callback error:', e);
          }
        });

        // Show Admin CRM Toast
        const title = payload.notification?.title || payload.data?.title || 'CRM Alert';
        const message = payload.notification?.body || payload.data?.body || 'New operational update received.';

        toast.show({
          title,
          message,
          type: 'info',
          duration: 5000,
        });
      });
    } catch (err) {
      console.warn('⚠️ [FCM Admin] Could not bind foreground listener:', err);
    }
  }

  /**
   * Subscribe to incoming authorized notifications
   */
  public subscribe(callback: AdminNotificationCallback): () => void {
    this.messageListeners.add(callback);
    return () => {
      this.messageListeners.delete(callback);
    };
  }

  /**
   * Clear on logout
   */
  public async logout(): Promise<void> {
    try {
      const messaging = await getFirebaseMessaging();
      if (messaging) {
        await deleteToken(messaging);
      }
    } catch (err) {
      console.warn('⚠️ [FCM Admin] Failed deleting token on logout:', err);
    } finally {
      storage.remove(FCM_TOKEN_STORAGE_KEY);
      storage.remove(FCM_TOKEN_SYNCED_KEY);
    }
  }
}

export const fcmAdminService = new FCMAdminService();
export default fcmAdminService;
