# 🔔 Firebase & Notifee Push Notification Engine

This folder contains the complete, production-grade Firebase Cloud Messaging (FCM) & Notifee push notification architecture for the **Sindhi Matrimony Application**.

---

## 📁 Files in this Folder

| File | Description |
| :--- | :--- |
| [`FIREBASE_FCM_IMPLEMENTATION.md`](file:///Users/naman/Documents/CRM%20Landing%20Projects/sindhiMatrimony/src/firebase/FIREBASE_FCM_IMPLEMENTATION.md) | **Complete Master Implementation Guide** (Architecture, Android/iOS setup, error handling, payloads, testing) |
| [`fcmService.ts`](file:///Users/naman/Documents/CRM%20Landing%20Projects/sindhiMatrimony/src/firebase/fcmService.ts) | Core FCM & Notifee Engine (Permissions, Token caching/sync, Listeners, Display banner) |
| [`notificationChannels.ts`](file:///Users/naman/Documents/CRM%20Landing%20Projects/sindhiMatrimony/src/firebase/notificationChannels.ts) | Android Notification Channels (Matches, Messages, Interests, Promotions, General) |
| [`notificationHandler.ts`](file:///Users/naman/Documents/CRM%20Landing%20Projects/sindhiMatrimony/src/firebase/notificationHandler.ts) | Navigation routing, Deep links, and Action button click handlers (`View Match`, `Reply`, `Accept`) |
| [`notificationTracker.ts`](file:///Users/naman/Documents/CRM%20Landing%20Projects/sindhiMatrimony/src/firebase/notificationTracker.ts) | Analytics and MMKV delivery log buffer |
| [`backgroundHandler.ts`](file:///Users/naman/Documents/CRM%20Landing%20Projects/sindhiMatrimony/src/firebase/backgroundHandler.ts) | Headless JS & Background notification event handlers |
| [`localNotificationService.ts`](file:///Users/naman/Documents/CRM%20Landing%20Projects/sindhiMatrimony/src/firebase/localNotificationService.ts) | Standalone Local Notification Engine (Immediate, scheduled, matrimony presets, cancel/badge) |
| [`useNotificationObserver.ts`](file:///Users/naman/Documents/CRM%20Landing%20Projects/sindhiMatrimony/src/firebase/useNotificationObserver.ts) | Optimized React hook for zero-rerender notification subscriptions |
| [`types.ts`](file:///Users/naman/Documents/CRM%20Landing%20Projects/sindhiMatrimony/src/firebase/types.ts) | Strict TypeScript interfaces for all payloads and events |
| [`index.ts`](file:///Users/naman/Documents/CRM%20Landing%20Projects/sindhiMatrimony/src/firebase/index.ts) | Barrel export for clean application-wide imports |

---

## 🚀 Quick Usage Example

### 1. Global Setup (`App.tsx` or `index.js`):
```typescript
import { fcmService, setupBackgroundMessageHandler, setupNotifeeBackgroundHandler } from './src/firebase';

// In index.js (Headless background workers)
setupBackgroundMessageHandler();
setupNotifeeBackgroundHandler();

// In App.tsx (Main app startup)
useEffect(() => {
  fcmService.initialize();
}, []);
```

### 2. Triggering Local Notifications:
```typescript
import { localNotificationService } from './src/firebase';

// A. Instant Match Alert
localNotificationService.showMatchAlert('Simran Advani', 26, 'Mumbai', 'profile_123');

// B. New Message Alert
localNotificationService.showNewMessage('Rahul Mirchandani', 'Hi! Saw your profile and would love to connect.', 'chat_456');

// C. Scheduled Notification (e.g. 2 hours later)
localNotificationService.schedule({
  title: 'Check Today\'s Top Recommendations',
  body: '12 new compatible matches have joined today in your city!',
  timestamp: Date.now() + 2 * 60 * 60 * 1000,
});
```
