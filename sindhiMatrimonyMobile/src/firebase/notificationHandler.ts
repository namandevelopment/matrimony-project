/**
 * Production-Grade Notification Navigation & Deep Link Router
 * Sindhi Matrimony Application
 *
 * Handles screen routing, queued navigation when NavigationContainer is not yet ready,
 * deep linking schemes (sindhimatrimony://), interactive action buttons, authentication guards,
 * and post-login redirection.
 */

import { Linking } from 'react-native';
import { navigationRef, navigate, reset } from '../navigation/navigationService';
import { Storage } from '../storage/Storage';
import { ParsedNotification, MatrimonyNotificationPayload } from './types';
import { notificationTracker } from './notificationTracker';

const PENDING_REDIRECT_KEY = 'pending_notification_redirect_v1';
const MAX_NAV_RETRIES = 20; // 20 retries * 250ms = 5 seconds window for app mount

export interface NavigationTarget {
  screen: string;
  params?: Record<string, any>;
  resetStack?: boolean;
}

class NotificationHandler {
  private navRetryCount = 0;
  private pendingTarget: NavigationTarget | null = null;
  public hasHandledInitialNotification: boolean = false;

  /**
   * Main entry point when user taps a notification banner
   */
  public handleNotificationTap(notification: ParsedNotification) {
    try {
      this.hasHandledInitialNotification = true;
      const { type, data, id } = notification;

      notificationTracker.logClicked(id, type, notification.source, {
        screen: data.screen,
        profileId: data.profileId,
        deepLink: data.deepLink,
      });

      console.log(`🧭 [NotificationHandler] User tapped notification: ${type}`, data);

      // 1. If deep link is present, attempt parsing URL
      if (data.deepLink) {
        const parsedFromDeepLink = this.parseDeepLinkUrl(data.deepLink);
        if (parsedFromDeepLink) {
          this.executeOrQueueNavigation(parsedFromDeepLink);
          return;
        }
      }

      // 2. Resolve destination from Notification Type & Payload
      const target = this.resolveTargetRoute(type, data);
      this.executeOrQueueNavigation(target);
    } catch (error) {
      notificationTracker.logError(
        notification.id,
        error,
        'NotificationHandler.handleNotificationTap'
      );
    }
  }

  /**
   * Resolve target screen and params based on notification type
   */
  public resolveTargetRoute(type: string, data: MatrimonyNotificationPayload): NavigationTarget {
    switch (type) {
      // 💍 Matches & Proposals
      case 'NEW_MATCH':
      case 'MATCH_ALERT':
        return {
          screen: 'BottomTab',
          params: {
            screen: 'Matches',
            params: data.profileId ? { profileId: data.profileId } : undefined,
          },
        };

      // 💌 Interests & Activity
      case 'INTEREST_RECEIVED':
      case 'INTEREST_ACCEPTED':
        return {
          screen: 'BottomTab',
          params: {
            screen: 'Interests',
            params: data.interestId ? { interestId: data.interestId } : undefined,
          },
        };

      // 💬 Messages & Chat
      case 'NEW_MESSAGE':
      case 'CHAT_MESSAGE':
        return {
          screen: 'BottomTab',
          params: {
            screen: 'Messages',
            params: {
              chatId: data.chatId,
              senderName: data.senderName,
            },
          },
        };

      // 👤 Profile Views
      case 'PROFILE_VIEW':
      case 'PROFILE_VISIT':
        return {
          screen: 'BottomTab',
          params: {
            screen: 'ProfileScreen',
            params: data.profileId ? { profileId: data.profileId } : undefined,
          },
        };

      // 💎 Upgrade & Membership
      case 'UPGRADE_OFFER':
      case 'MEMBERSHIP_EXPIRED':
      case 'PROMO_OFFER':
        return {
          screen: 'BottomTab',
          params: {
            screen: 'Upgrade',
            params: {
              planName: data.planName,
              discount: data.discountPercentage,
            },
          },
        };

      // 🛡️ Verification
      case 'PROFILE_VERIFIED':
      case 'VERIFICATION_REMINDER':
        return {
          screen: 'VerifyYourProfile',
          params: data.additionalData || {},
        };

      // ❓ Help & Support
      case 'SUPPORT_CHAT':
      case 'HELP_CENTER':
        return {
          screen: 'HelpCenter',
          params: data.additionalData || {},
        };

      // 🔔 Notifications Screen
      case 'GENERAL_ALERT':
      case 'SYSTEM_ALERT':
        return {
          screen: 'BottomTab',
          params: {
            screen: 'NotificationScreen',
          },
        };

      // 🚕 Ride / Generic Fallbacks
      case 'DRIVER_ASSIGNED':
      case 'DRIVER_ARRIVED':
      case 'RIDE_STARTED':
      case 'RIDE_COMPLETED':
      case 'RIDE_CANCELLED':
      case 'SOS_ALERT':
      default:
        if (data.screen) {
          const bottomTabNames = ['Home', 'Matches', 'Interests', 'Messages', 'Search', 'Upgrade', 'NotificationScreen', 'ProfileScreen', 'EditProfile'];
          if (bottomTabNames.includes(data.screen)) {
            return {
              screen: 'BottomTab',
              params: { screen: data.screen, params: data.additionalData },
            };
          }
          return {
            screen: data.screen,
            params: data.additionalData || {},
          };
        }
        return {
          screen: 'BottomTab',
          params: {
            screen: 'Home',
          },
        };
    }
  }

  /**
   * Parse Deep Link URL (e.g. sindhimatrimony://matches/123)
   */
  private parseDeepLinkUrl(url: string): NavigationTarget | null {
    try {
      const cleanUrl = url.toLowerCase();

      if (cleanUrl.includes('match') || cleanUrl.includes('proposal')) {
        return { screen: 'BottomTab', params: { screen: 'Matches' } };
      }
      if (cleanUrl.includes('interest')) {
        return { screen: 'BottomTab', params: { screen: 'Interests' } };
      }
      if (cleanUrl.includes('message') || cleanUrl.includes('chat')) {
        return { screen: 'BottomTab', params: { screen: 'Messages' } };
      }
      if (cleanUrl.includes('upgrade') || cleanUrl.includes('plan')) {
        return { screen: 'BottomTab', params: { screen: 'Upgrade' } };
      }
      if (cleanUrl.includes('notification')) {
        return { screen: 'BottomTab', params: { screen: 'NotificationScreen' } };
      }
      if (cleanUrl.includes('profile')) {
        return { screen: 'BottomTab', params: { screen: 'ProfileScreen' } };
      }
      if (cleanUrl.includes('help') || cleanUrl.includes('support')) {
        return { screen: 'HelpCenter' };
      }
      if (cleanUrl.includes('verify')) {
        return { screen: 'VerifyYourProfile' };
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Execute Navigation safely or Queue if NavigationContainer is not ready yet
   */
  public executeOrQueueNavigation(target: NavigationTarget) {
    try {
      // 1. Check if user is authenticated
      const token = Storage.getItemSync<string>('token') || Storage.getItemSync<string>('accessToken') || Storage.getItemSync<string>('user');
      if (
        !token &&
        target.screen !== 'LoginScreen' &&
        target.screen !== 'LoginWithPassword' &&
        target.screen !== 'ValidateOTPScreen'
      ) {
        console.log(
          '🔒 [NotificationHandler] User not logged in. Storing pending redirect for post-login.'
        );
        Storage.setItemSync(PENDING_REDIRECT_KEY, target);
        return;
      }

      // 2. Check if NavigationContainer is ready
      if (!navigationRef?.isReady?.()) {
        Storage.setItemSync(PENDING_REDIRECT_KEY, target);
        if (this.navRetryCount < MAX_NAV_RETRIES) {
          this.navRetryCount++;
          this.pendingTarget = target;
          console.warn(
            `⏳ [NotificationHandler] Navigation not ready. Queued (${this.navRetryCount}/${MAX_NAV_RETRIES})...`
          );
          setTimeout(() => this.executeOrQueueNavigation(target), 250);
        } else {
          console.warn('⏳ [NotificationHandler] Queued to storage for post-ready execution.');
          this.navRetryCount = 0;
          this.pendingTarget = null;
        }
        return;
      }

      // 3. Navigation is ready -> Execute
      this.navRetryCount = 0;
      this.pendingTarget = null;
      Storage.removeItemSync(PENDING_REDIRECT_KEY);

      console.log(`🚀 [NotificationHandler] Navigating to: ${target.screen}`, target.params);

      if (target.resetStack) {
        reset(target.screen, target.params);
      } else {
        navigate(target.screen, target.params);
      }
    } catch (error) {
      console.error('🚨 [NotificationHandler] Error during navigation execution:', error);
    }
  }

  /**
   * Post-Login / Splash Screen Redirect Processor
   * Call this in NavigationContainer onReady, SplashScreen, or after login!
   */
  public processPendingNotificationRedirect(): boolean {
    try {
      const pending = Storage.getItemSync<NavigationTarget>(PENDING_REDIRECT_KEY);
      if (pending && pending.screen) {
        console.log('🎯 [NotificationHandler] Found pending notification redirect:', pending);
        Storage.removeItemSync(PENDING_REDIRECT_KEY);
        this.executeOrQueueNavigation(pending);
        return true;
      }
      return false;
    } catch (err) {
      console.warn('⚠️ [NotificationHandler] Error processing pending redirect:', err);
      return false;
    }
  }

  /**
   * Handles interactive action button clicks on Android / iOS
   */
  public handleNotificationAction(actionId: string, notification: ParsedNotification) {
    try {
      const { data, id, type } = notification;

      notificationTracker.logActionPressed(id, type, actionId, notification.source);
      console.log(`🔘 [NotificationHandler] Action button triggered: ${actionId}`);

      switch (actionId) {
        // Direct Action: View Profile
        case 'VIEW_PROFILE':
        case 'VIEW_MATCH':
          this.handleNotificationTap(notification);
          break;

        // Direct Action: Reply / Open Chat
        case 'REPLY_MESSAGE':
        case 'OPEN_CHAT':
          this.executeOrQueueNavigation({
            screen: 'BottomTab',
            params: { screen: 'Messages', params: { chatId: data.chatId } },
          });
          break;

        // Direct Action: Accept Interest
        case 'ACCEPT_INTEREST':
          this.executeOrQueueNavigation({
            screen: 'BottomTab',
            params: { screen: 'Interests' },
          });
          break;

        // Direct Action: Upgrade Plan
        case 'UPGRADE_NOW':
          this.executeOrQueueNavigation({
            screen: 'BottomTab',
            params: { screen: 'Upgrade' },
          });
          break;

        // Direct Phone Call (if contact shared)
        case 'CALL_CONTACT':
        case 'CALL_DRIVER':
          if (data.driverPhone) {
            Linking.openURL(`tel:${data.driverPhone}`).catch((err) => {
              console.warn('[NotificationHandler] Error opening dialer:', err);
            });
          }
          break;

        default:
          this.handleNotificationTap(notification);
          break;
      }
    } catch (err) {
      notificationTracker.logError(notification.id, err, `handleNotificationAction_${actionId}`);
    }
  }
}

export const notificationHandler = new NotificationHandler();
