// Scripts for Firebase and Firebase Messaging in Service Worker
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// Initialize Firebase in Service Worker
firebase.initializeApp({
  apiKey: "AIzaSyDpM0nGsEVK9PHptEMwIC7i-uUHLb-QzAQ",
  authDomain: "sindhimarriage-eb382.firebaseapp.com",
  projectId: "sindhimarriage-eb382",
  storageBucket: "sindhimarriage-eb382.firebasestorage.app",
  messagingSenderId: "7241577975",
  appId: "1:7241577975:web:6b38b208a88fe1dba9aaf2",
  measurementId: "G-V1FNJTXW8H"
});

const messaging = firebase.messaging();

// Handle Background Push Messages
messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload?.notification?.title || payload?.data?.title || 'Sindhi Matrimony Alert';
  const notificationOptions = {
    body: payload?.notification?.body || payload?.data?.body || 'You have a new update.',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    data: payload?.data || {},
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle Notification Clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const clickAction = event.notification?.data?.click_action || event.notification?.data?.url || '/notifications';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(clickAction);
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(clickAction);
      }
    })
  );
});

