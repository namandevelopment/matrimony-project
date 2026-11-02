// Firebase Messaging Service Worker for Admin CRM Panel
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

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

messaging.onBackgroundMessage((payload) => {
  const data = payload?.data || {};
  const notificationTitle = payload?.notification?.title || data.title || 'CRM Admin Alert';
  const notificationOptions = {
    body: payload?.notification?.body || data.body || 'New operational update received.',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    data: data,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const clickAction = event.notification?.data?.actionUrl || event.notification?.data?.click_action || '/notifications';
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

