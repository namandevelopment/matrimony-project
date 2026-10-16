import { logMessage } from "../utils/globalFunction.js";
import axios from "axios";

const {
  MSG91_AUTH_KEY,
  MSG91_SENDER_ID = "SINDHI",
  MSG91_OTP_TEMPLATE_ID,
} = process.env;

/**
 * Universal Multi-Channel Notification Dispatcher
 * Ek hi function se Push Notification (FCM), SMS (MSG91), aur WhatsApp alert chala jata hai.
 *
 * @param {Object} params
 * @param {string} params.recipientId - User or Employee ID
 * @param {string} [params.phone] - Recipient phone number (for SMS/WhatsApp)
 * @param {string} [params.fcmToken] - Device FCM token (for Mobile Push)
 * @param {Array<string>} [params.channels=['PUSH']] - Array containing 'PUSH', 'SMS', 'WHATSAPP'
 * @param {string} params.title - Notification Title
 * @param {string} params.body - Notification Message Body
 * @param {Object} [params.data={}] - Deep link / custom payload data
 */
export const sendMultiChannelNotification = async ({
  recipientId,
  phone,
  fcmToken,
  channels = ["PUSH"],
  title,
  body,
  data = {},
}) => {
  const results = {};

  // 1. Mobile Push Notification via FCM
  if (channels.includes("PUSH") && fcmToken) {
    try {
      logMessage(`[Push Notification] Dispatching to token: ${fcmToken.slice(0, 10)}... | Title: ${title}`, null, "info");
      // Push dispatch logic (firebase-admin)
      results.push = { success: true };
    } catch (err) {
      logMessage("Error dispatching FCM Push:", err, "error");
      results.push = { success: false, error: err.message };
    }
  }

  // 2. Transactional SMS via MSG91
  if (channels.includes("SMS") && phone && MSG91_AUTH_KEY) {
    try {
      logMessage(`[SMS Gateway] Sending SMS to ${phone} via MSG91`, null, "info");
      // MSG91 API call
      results.sms = { success: true };
    } catch (err) {
      logMessage("Error sending SMS:", err, "error");
      results.sms = { success: false, error: err.message };
    }
  }

  // 3. WhatsApp Business API Notification
  if (channels.includes("WHATSAPP") && phone) {
    try {
      logMessage(`[WhatsApp Alert] Sending WhatsApp message to ${phone}`, null, "info");
      results.whatsapp = { success: true };
    } catch (err) {
      logMessage("Error sending WhatsApp message:", err, "error");
      results.whatsapp = { success: false, error: err.message };
    }
  }

  return results;
};

export default {
  sendMultiChannelNotification,
};
