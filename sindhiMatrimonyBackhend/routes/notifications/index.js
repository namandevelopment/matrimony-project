import express from "express";
import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationsRead,
  deleteNotification,
  registerDeviceToken,
  deactivateDeviceToken,
  getPreferences,
  updatePreferences,
  bulkCreateNotifications,
  streamNotifications,
} from "../../controllers/notifications/notificationController.js";

const router = express.Router();

/**
 * --------------------------------------------------------------------------
 * 🔔 NOTIFICATIONS & MOBILE DEVICE PUSH ALERTS ROUTES
 * --------------------------------------------------------------------------
 */
// Notification Feed & Unread Badges
router.get("/", getNotifications);
router.get("/unread-count", getUnreadNotificationCount);

// Mark as Read (Multiple backward-compatible shapes)
router.put("/mark-read", markNotificationsRead);
router.patch("/:id/read", markNotificationsRead);
router.patch("/read-all", (req, res, next) => {
  req.body = { ...req.body, notificationId: "ALL" };
  return markNotificationsRead(req, res, next);
});
router.put("/mark-all-read", (req, res, next) => {
  req.body = { ...req.body, notificationId: "ALL" };
  return markNotificationsRead(req, res, next);
});
router.patch("/mark-all-read", (req, res, next) => {
  req.body = { ...req.body, notificationId: "ALL" };
  return markNotificationsRead(req, res, next);
});

// Single Notification Deletion
router.delete("/:id", deleteNotification);

// FCM / APNs Device Token Management
router.post("/fcm-token", registerDeviceToken);
router.delete("/fcm-token", deactivateDeviceToken);

// User Notification Preferences
router.get("/preferences", getPreferences);
router.put("/preferences", updatePreferences);

// Admin / Targeted Broadcast Campaigns
router.post("/bulk", bulkCreateNotifications);

// Real-Time Server-Sent Events (SSE) Stream
router.get("/sse", streamNotifications);

export default router;
