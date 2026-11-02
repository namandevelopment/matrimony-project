/**
 * Firebase Cloud Messaging (FCM) Web Engine
 * Sindhi Matrimony Application (Web / Next.js)
 *
 * Full functional parity with Mobile FCM implementation:
 * - Permission requests and service worker registration
 * - Token retrieval and persistence in high-performance storage
 * - Automatic synchronization with Backend API Gateway (/api/v1/notifications/fcm-token)
 * - Foreground notification routing and CustomToast alerts
 */

import { getToken, onMessage, deleteToken, MessagePayload } from 'firebase/messaging';
import { getFirebaseMessaging, getFirebaseAnalytics } from './firebaseConfig';
import { Storage } from '@/storage/Storage';
import { apiPost, ApiURL } from '@/redux/apiService';
import { showToast } from '@/utils/CustomToast';

const FCM_TOKEN_STORAGE_KEY = 'fcm_device_token_web_v1';
const FCM_TOKEN_SYNCED_KEY = 'fcm_token_synced_web_v1';

export type WebNotificationCallback = (payload: MessagePayload) => void;

class FCMWebService {
  private isInitialized: boolean = false;
  private messageListeners: Set<WebNotificationCallback> = new Set();
  private swRegistration: ServiceWorkerRegistration | null = null;

  /**
   * Register service worker and initialize FCM
   */
  public async initialize(): Promise<string | null> {
    if (typeof window === 'undefined') return null;

    try {
      // Initialize Analytics lazily
      getFirebaseAnalytics().catch(() => {});

      if (!('serviceWorker' in navigator) || !('Notification' in window)) {
        console.warn('⚠️ [FCM Web] Service Workers or Push Notifications not supported in this browser.');
        return null;
      }

      // Register the service worker for background messages
      this.swRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
        scope: '/',
      });

      this.isInitialized = true;
      this.setupForegroundListener();

      // Check existing permission without prompting prematurely
      if (Notification.permission === 'granted') {
        return await this.getDeviceToken();
      }

      return null;
    } catch (err) {
      console.error('❌ [FCM Web] Initialization failed:', err);
      return null;
    }
  }

  /**
   * Request user permission and obtain FCM registration token
   */
  public async requestPermissionAndGetToken(): Promise<string | null> {
    if (typeof window === 'undefined') return null;

    try {
      if (!('Notification' in window)) {
        return null;
      }

      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.log('ℹ️ [FCM Web] Notification permission denied or dismissed.');
        return null;
      }

      return await this.getDeviceToken();
    } catch (err) {
      console.error('❌ [FCM Web] Error requesting permission:', err);
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
        Storage.setItemSync(FCM_TOKEN_STORAGE_KEY, currentToken);
        await this.syncTokenWithBackend(currentToken);
        return currentToken;
      }

      return null;
    } catch (err) {
      console.error('❌ [FCM Web] Failed to retrieve FCM token:', err);
      return null;
    }
  }

  /**
   * Synchronize the FCM token with the backend API
   */
  public async syncTokenWithBackend(token: string): Promise<boolean> {
    try {
      if (!token) return false;
      const lastSynced = Storage.getItemSync<string>(FCM_TOKEN_SYNCED_KEY);
      if (lastSynced === token) {
        return true;
      }

      const tokenAuth = Storage.getItemSync<string>('auth_token') || Storage.getItemSync<string>('token');
      if (!tokenAuth) {
        // User not logged in yet; sync will happen upon login
        return false;
      }

      await apiPost(ApiURL.updateFcmDeviceToken, {
        fcmToken: token,
        platform: 'WEB',
      });

      Storage.setItemSync(FCM_TOKEN_SYNCED_KEY, token);
      console.log('✅ [FCM Web] Device token successfully synced with Backend.');
      return true;
    } catch (err) {
      console.warn('⚠️ [FCM Web] Token sync with backend skipped or failed:', err);
      return false;
    }
  }

  /**
   * Setup foreground push notification listener
   */
  private async setupForegroundListener() {
    try {
      const messaging = await getFirebaseMessaging();
      if (!messaging) return;

      onMessage(messaging, (payload) => {
        console.log('📬 [FCM Web] Foreground message received:', payload);

        // Notify subscribers
        this.messageListeners.forEach((callback) => {
          try {
            callback(payload);
          } catch (e) {
            console.error('Callback error:', e);
          }
        });

        // Show UI Toast
        const title = payload.notification?.title || payload.data?.title || 'Notification';
        const message = payload.notification?.body || payload.data?.body || 'You have a new update';

        showToast({
          message: `${title}: ${message}`,
          type: 'info',
          duration: 4000,
        });
      });
    } catch (err) {
      console.warn('⚠️ [FCM Web] Could not bind foreground listener:', err);
    }
  }

  /**
   * Subscribe to incoming foreground notifications
   */
  public subscribe(callback: WebNotificationCallback): () => void {
    this.messageListeners.add(callback);
    return () => {
      this.messageListeners.delete(callback);
    };
  }

  /**
   * Clear and delete token on logout
   */
  public async logout(): Promise<void> {
    try {
      const messaging = await getFirebaseMessaging();
      if (messaging) {
        await deleteToken(messaging);
      }
    } catch (err) {
      console.warn('⚠️ [FCM Web] Failed deleting token on logout:', err);
    } finally {
      Storage.removeItemSync(FCM_TOKEN_STORAGE_KEY);
      Storage.removeItemSync(FCM_TOKEN_SYNCED_KEY);
    }
  }
}

export const fcmWebService = new FCMWebService();
export default fcmWebService;

