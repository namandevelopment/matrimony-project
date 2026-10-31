# 🔥 Comprehensive Firebase Cloud Messaging (FCM) & Notifee Implementation Guide

## 📋 Architecture Overview
The Sindhi Matrimony notification system delivers reliable, high-performance push notifications across all application states:
- **Foreground (Active)**: Firebase `onMessage` -> Notifee local heads-up banner + zero-re-render component observer.
- **Background (Minimized)**: Firebase `setBackgroundMessageHandler` -> Notifee notification banner with sound and vibration.
- **Killed / Cold-Start**: Notifee `getInitialNotification()` & Firebase `getInitialNotification()` -> Deep link resolution & authentication guard.

---

## 🛠️ Setup & Configuration

### 1. Android Configuration
1. Place your `google-services.json` in `android/app/google-services.json`.
2. In `android/build.gradle`:
   ```groovy
   dependencies {
       classpath("com.google.gms:google-services:4.4.2")
   }
   ```
3. In `android/app/build.gradle`:
   ```groovy
   apply plugin: "com.google.gms.google-services"
   ```
4. In `android/app/src/main/AndroidManifest.xml`, ensure permissions:
   ```xml
   <uses-permission android:name="android.permission.INTERNET" />
   <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
   <uses-permission android:name="android.permission.VIBRATE" />
   <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
   ```

### 2. iOS Configuration
1. Place `GoogleService-Info.plist` in `ios/sindhiMatrimony/`.
2. Enable **Push Notifications** and **Background Modes** (Remote notifications) in Xcode Signing & Capabilities.

---

## 📦 Payload Specification

### Standard FCM Data Payload:
```json
{
  "to": "<FCM_DEVICE_TOKEN>",
  "priority": "high",
  "notification": {
    "title": "💍 New Match Recommendation!",
    "body": "Pooja Vazirani, 25 from Pune matches your criteria."
  },
  "data": {
    "type": "NEW_MATCH",
    "profileId": "user_789456",
    "screen": "MatchesScreen",
    "deepLink": "sindhimatrimony://matches/user_789456"
  }
}
```

### Supported Notification Types:
- `NEW_MATCH`: New profile recommendation -> Navigates to MatchesScreen.
- `INTEREST_RECEIVED`: Another member expressed interest -> Navigates to InterestsScreen.
- `NEW_MESSAGE`: Chat message from a match -> Navigates to MessagesScreen.
- `PROFILE_VIEW`: Someone visited your profile -> Navigates to ProfileScreen.
- `UPGRADE_OFFER`: Special membership discount -> Navigates to UpgradeScreen.
- `PROFILE_VERIFIED`: ID/Profile verification approved -> Navigates to VerifyYourProfile.
- `GENERAL_ALERT`: System announcements -> Navigates to NotificationScreen.

---

## ⚡ Performance Best Practices
1. **Zero-Rerender Hook**: `useNotificationObserver` stores callbacks in React mutable refs, preventing unnecessary re-renders on screen mount.
2. **Fast Token Access**: FCM token is cached in MMKV memory-mapped storage for instant availability without waiting for network round-trips.
3. **Queued Navigation**: If a user opens a notification during app cold-start, navigation commands are safely queued until `NavigationContainer` finishes mounting.
