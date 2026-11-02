import { initializeApp, getApps, getApp } from "firebase/app";
import type { FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported as isAnalyticsSupported } from "firebase/analytics";
import type { Analytics } from "firebase/analytics";
import { getMessaging, isSupported as isMessagingSupported } from "firebase/messaging";
import type { Messaging } from "firebase/messaging";

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDpM0nGsEVK9PHptEMwIC7i-uUHLb-QzAQ",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "sindhimarriage-eb382.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "sindhimarriage-eb382",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "sindhimarriage-eb382.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "7241577975",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:7241577975:web:6b38b208a88fe1dba9aaf2",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-V1FNJTXW8H",
};

let app: FirebaseApp | null = null;
let analytics: Analytics | null = null;
let messaging: Messaging | null = null;

export const getFirebaseApp = (): FirebaseApp | null => {
  if (typeof window === "undefined") return null;
  if (!app) {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  }
  return app;
};

export const getFirebaseAnalytics = async (): Promise<Analytics | null> => {
  if (typeof window === "undefined") return null;
  if (analytics) return analytics;
  const currentApp = getFirebaseApp();
  if (currentApp && (await isAnalyticsSupported())) {
    analytics = getAnalytics(currentApp);
  }
  return analytics;
};

export const getFirebaseMessaging = async (): Promise<Messaging | null> => {
  if (typeof window === "undefined") return null;
  if (messaging) return messaging;
  const currentApp = getFirebaseApp();
  if (currentApp && (await isMessagingSupported())) {
    messaging = getMessaging(currentApp);
  }
  return messaging;
};
