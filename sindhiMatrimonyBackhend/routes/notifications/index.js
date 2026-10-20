import express from "express";
import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationsRead,
  registerDeviceToken,
} from "../../controllers/notifications/notificationController.js";

const router = express.Router();

/**
 * --------------------------------------------------------------------------
 * 🔔 NOTIFICATIONS & MOBILE DEVICE PUSH ALERTS ROUTES
 * --------------------------------------------------------------------------
 */
router.get("/", getNotifications);
router.get("/unread-count", getUnreadNotificationCount);
router.put("/mark-read", markNotificationsRead);
router.post("/fcm-token", registerDeviceToken);

export default router;
