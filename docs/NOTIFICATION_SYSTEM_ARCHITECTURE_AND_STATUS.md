# 🔔 Sindhi Matrimony - Complete Notification System Audit & Architecture

A comprehensive, end-to-end breakdown of the Notification System across the entire ecosystem: **Backend API**, **User Panel (Web)**, **Admin CRM Panel**, and **Mobile App (React Native)**.

---

## 📊 High-Level Status Summary

| Platform / Module | Current Implementation Status | Data Source / Storage | Key Capabilities Built | Next Steps / Pending |
| :--- | :--- | :--- | :--- | :--- |
| **Backend API** | 🟡 **Partially Complete** | In-Memory Array (`inMemoryNotifications`) | REST Feed, Unread Badges, Mark as Read, Token Registration, Subscription Paywall Masking | MongoDB `Notification` Schema, FCM Admin SDK Push Dispatch |
| **User Panel (Web)** | 🟢 **Complete (Ready)** | TanStack Query (`/api/v1/notifications`) | Category Filters, Badge Counters, Paywall Blur/Lock for Free Users, Quick Action Buttons | Connect to WebSocket / SSE for real-time live toast alerts |
| **Admin CRM Panel** | 🟢 **Complete (Ready)** | `notificationService` & CRM Events | System Alerts, Lead Escalations, Payment Notices, KPI Metric Cards, RBAC Guard | Multi-channel broadcast push composer UI for users |
| **Mobile App (RN)** | 🟡 **Partially Complete** | FlashList UI + Firebase Handlers | `NotificationHandler` Deep Linking (`sindhimatrimony://`), Channel Config, Time Grouping | Switch screen from initial mock state to live React Query API hook |

---

## 🛠️ 1. Backend API (`sindhiMatrimonyBackhend`)

### Routes & Endpoints (`routes/notifications/index.js`)
* **`GET /api/v1/notifications`**:
  * Paginated notification feed (`page`, `limit`).
  * Dynamically queries recipient notifications based on authenticated user (`userId`).
  * **Subscription-Aware Paywall Masking**:
    * **Free Members**: Visitor details are blurred/hidden (`"Someone Viewed Your Profile"`, masked Matrimony ID `"SM******"`, hidden photo, CTA: `"Upgrade to View Profile"`).
    * **Paid Subscribers**: Full visitor card unlocked with real candidate name, photo, profession, and `"View Profile"` CTA.
* **`GET /api/v1/notifications/unread-count`**:
  * Lightweight sub-5ms endpoint returning `{ unreadCount: number }` for header bell badges.
* **`PUT /api/v1/notifications/mark-read`**:
  * Marks either a specific notification (`notificationId: string`) or all notifications (`notificationId: "ALL"`) as read.
* **`POST /api/v1/notifications/fcm-token`**:
  * Registers device push tokens (FCM/APNs) along with platform identifier (`ANDROID` / `IOS`).
* **`POST /api/v1/notifications/bulk`**:
  * Internal batch insertion endpoint for promotional campaigns or admin announcements.

### Automatic Event Triggers
1. **Interest Sent (`interestsController.js`)**:
   * Fires `addNotification()` upon interest creation notifying the recipient.
2. **Profile Visits (`userDashboardController.js`)**:
   * Intercepts profile detail lookups.
   * Leverages `hasRecentProfileVisitNotification()` rate-limiter (24-hour deduplication window) to prevent notification spam.

### Pending Backend Enhancements:
1. **Persistent MongoDB Model**: Create `models/notifications/notification.model.js` with indexes on `{ recipientUserId: 1, createdAt: -1 }` and `{ recipientUserId: 1, isRead: 1 }`.
2. **Device Token Persistence**: Save FCM tokens to the `User` or `DeviceToken` schema.
3. **FCM Admin SDK Integration**: Dispatch background push alerts via Firebase Admin SDK when `addNotification()` is invoked.

---

## 💻 2. User Panel Web (`sindhiMatrimonyUserPanel`)

### Components & Routes
* **Page Route**: `/notifications` (`app/notifications/page.tsx` & `screens/notificationsScreen/NotificationsScreen.tsx`).
* **State Management**:
  * TanStack React Query keys: `QUERY_KEYS.notifications` (`['notifications', 'list']`) and `QUERY_KEYS.unreadNotificationsCount`.
  * Optimistic updates for marking items as read without layout flicker.

### Features Built:
* **Interactive Filtering Tabs**: `All`, `Interests`, `Profile Views`, `Messages`, and `System`.
* **Actionable Notification Cards**:
  * Direct acceptance/rejection buttons for incoming matrimonial interests.
  * Paywall upgrade trigger modals for locked visitor notifications.
* **Header Bell Indicator**: Displays live unread count badge in main desktop/mobile web navigation.

---

## 🛡️ 3. Admin CRM Panel (`sindiMatrimonyAdmin`)

### Components & Routes
* **Page Route**: `/notifications` (`screens/notificationsScreen/NotificationsScreen.tsx`).
* **Role-Based Access Control (RBAC)**: Guarded via `utils/rbac.ts` for CRM Staff, Verification Officers, and Admins.

### Features Built:
* **KPI Metrics Bar**: Real-time display of *Total Alerts*, *Unread Alerts*, *Action Required*, and *Critical Urgencies*.
* **CRM Operational Alert Categories**:
  * `LEAD`: High-value incoming leads and auto-escalated inquiries.
  * `PAYMENT`: Payment gateway settlement completions and plan renewal reminders.
  * `VERIFICATION`: Pending ID proof and horoscope document verification requests.
  * `SYSTEM`: Error logs, server health thresholds, and security audits.
* **Action Triggers**: One-click navigation routing directly to the affected CRM lead, member profile, or verification queue.

---

## 📱 4. Mobile App (`sindhiMatrimonyMobile`)

### Architecture & Handlers (`src/firebase/`)
* **`notificationHandler.ts`**:
  * Production-grade deep link & routing resolver.
  * Supports custom URI scheme (`sindhimatrimony://profile/:id`, `sindhimatrimony://chat/:roomId`, etc.).
  * **Navigation Queue Safety**: Buffers pending navigation requests when `NavigationContainer` is still initializing or app is cold-booting.
  * **Interactive Push Actions**: Handles notification action button taps directly from Android/iOS notification trays.
* **`notificationChannels.ts`**:
  * Configures Android 8.0+ notification channels (`Matches`, `Interests`, `Messages`, `Promotions`).
* **`notificationTracker.ts`**:
  * Logs impression and notification tap engagement analytics.

### Screen & UI (`screens/notificationScreen/`)
* Built with `@shopify/flash-list` for smooth 60fps scrolling.
* Grouped time sections: `Today`, `Yesterday`, `Earlier`.
* Filter pills: `All`, `Interests`, `Matches`, `Visitors`, `Offers`.

---

## 🎯 Implementation Checklist for 100% Production Closure

- [ ] **Step 1 (Backend)**: Add `Notification` Mongoose model and migrate `inMemoryNotifications` storage to database queries.
- [ ] **Step 2 (Backend)**: Add `DeviceToken` Mongoose model to store FCM tokens registered via `POST /api/v1/notifications/fcm-token`.
- [ ] **Step 3 (Backend)**: Wire Firebase Admin SDK (`firebase-admin`) in backend to trigger native mobile push alerts.
- [ ] **Step 4 (Mobile)**: Connect `sindhiMatrimonyMobile/src/screens/notificationScreen` to the backend `/api/v1/notifications` endpoint via TanStack Query.

