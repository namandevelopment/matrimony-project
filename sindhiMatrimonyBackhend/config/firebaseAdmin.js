import admin from "firebase-admin";
import fs from "fs";
import { logMessage } from "../utils/globalFunction.js";

let firebaseApp = null;
let isFirebaseConfigured = false;

const initFirebaseAdmin = () => {
  if (firebaseApp) return firebaseApp;

  try {
    if (admin.apps.length > 0) {
      firebaseApp = admin.apps[0];
      isFirebaseConfigured = true;
      return firebaseApp;
    }

    let credential = null;

    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const raw = process.env.FIREBASE_SERVICE_ACCOUNT.trim();
      if (raw.startsWith("{")) {
        credential = admin.credential.cert(JSON.parse(raw));
      } else if (fs.existsSync(raw)) {
        const fileContent = fs.readFileSync(raw, "utf8");
        credential = admin.credential.cert(JSON.parse(fileContent));
      } else {
        try {
          const decoded = Buffer.from(raw, "base64").toString("utf8");
          credential = admin.credential.cert(JSON.parse(decoded));
        } catch {
          logMessage("[Firebase Admin] Unable to parse FIREBASE_SERVICE_ACCOUNT", null, "warn");
        }
      }
    } else if (
      process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
    ) {
      credential = admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      });
    }

    if (credential) {
      firebaseApp = admin.initializeApp({
        credential,
      });
      isFirebaseConfigured = true;
      logMessage("[Firebase Admin] Initialized successfully.", null, "info");
    } else {
      logMessage(
        "[Firebase Admin] Missing Firebase credentials (FIREBASE_SERVICE_ACCOUNT). Push notifications will operate in mock/log mode.",
        null,
        "warn"
      );
    }
  } catch (error) {
    logMessage(`[Firebase Admin] Initialization failed: ${error.message}`, error, "error");
  }

  return firebaseApp;
};

// Initialize on module load
initFirebaseAdmin();

/**
 * Send Multicast Notification to multiple device tokens
 * @param {Object} options
 * @param {string[]} options.tokens - Array of FCM registration tokens
 * @param {string} options.title - Notification title
 * @param {string} options.body - Notification body
 * @param {Object} [options.data] - Key-value string map for data payload
 * @param {string} [options.priority] - 'HIGH' | 'NORMAL'
 * @param {string} [options.channelId] - Android channel id
 */
export const sendMulticastPush = async ({
  tokens = [],
  title,
  body,
  data = {},
  priority = "HIGH",
  channelId = "matrimony_general_channel",
}) => {
  if (!Array.isArray(tokens) || tokens.length === 0) {
    return { successCount: 0, failureCount: 0, invalidTokens: [] };
  }

  // Ensure data values are all strings
  const stringifiedData = {};
  for (const [key, value] of Object.entries(data)) {
    stringifiedData[key] = typeof value === "string" ? value : JSON.stringify(value);
  }

  if (!isFirebaseConfigured || !admin.apps.length) {
    logMessage(
      `[Firebase Admin Mock] Multicast Push to ${tokens.length} token(s) | Title: "${title}" | Data: ${JSON.stringify(stringifiedData)}`,
      null,
      "info"
    );
    return {
      successCount: tokens.length,
      failureCount: 0,
      invalidTokens: [],
      isMock: true,
    };
  }

  const message = {
    tokens,
    notification: {
      title,
      body,
    },
    data: stringifiedData,
    android: {
      priority: priority === "HIGH" ? "high" : "normal",
      notification: {
        channelId,
        clickAction: "sindhimatrimony://notification",
        sound: "default",
      },
    },
    apns: {
      payload: {
        aps: {
          alert: {
            title,
            body,
          },
          sound: "default",
          badge: 1,
        },
      },
    },
  };

  try {
    const response = await admin.messaging().sendEachForMulticast(message);
    const invalidTokens = [];

    response.responses.forEach((resp, idx) => {
      if (!resp.success) {
        const errCode = resp.error?.code;
        if (
          errCode === "messaging/invalid-registration-token" ||
          errCode === "messaging/registration-token-not-registered"
        ) {
          invalidTokens.push(tokens[idx]);
        }
      }
    });

    logMessage(
      `[Firebase Admin] Multicast sent. Success: ${response.successCount}, Failures: ${response.failureCount}`,
      null,
      "info"
    );

    return {
      successCount: response.successCount,
      failureCount: response.failureCount,
      invalidTokens,
      isMock: false,
    };
  } catch (error) {
    logMessage(`[Firebase Admin] Multicast dispatch error: ${error.message}`, error, "error");
    return {
      successCount: 0,
      failureCount: tokens.length,
      invalidTokens: [],
      error: error.message,
    };
  }
};

export { admin, isFirebaseConfigured };

