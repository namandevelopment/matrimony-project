import { asyncHandler, apiHTTPResponse, logMessage } from "../../utils/globalFunction.js";
import * as CONSTANTS from "../../utils/constants.js";
import mongoose from "mongoose";
import UserSubscription from "../../models/plans/userSubscription.model.js";
import notificationService, {
  addSSEClient,
  hasRecentProfileVisitNotification as serviceHasRecentProfileVisitNotification,
} from "../../services/notification/notification.service.js";

// Backward-compatible in-memory fallback helper
export const addNotification = async (notif) => {
  try {
    if (mongoose.connection.readyState === 1 && notif.recipientUserId) {
      await notificationService.createNotification(notif);
    }
  } catch (err) {
    logMessage(`[NotificationController] addNotification error: ${err.message}`, err, "error");
  }
};

export const hasRecentProfileVisitNotification = async (
  viewerUserId,
  recipientUserId,
  windowMs = 24 * 60 * 60 * 1000
) => {
  if (mongoose.connection.readyState === 1) {
    return await serviceHasRecentProfileVisitNotification(viewerUserId, recipientUserId, windowMs);
  }
  return false;
};

/**
 * 🔔 Get In-App Notifications Feed
 * GET /api/v1/notifications?page=1&limit=20&category=ALL
 */
export const getNotifications = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query?.pageNo || req.query?.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query?.pageSize || req.query?.limit, 10) || 20));
  const category = req.query?.category || null;

  const userId =
    req.user?.id ||
    req.auth?.id ||
    req.user?._id ||
    req.auth?._id ||
    req.user?.userId ||
    req.auth?.userId ||
    req.query?.userId;

  let isPaidSubscriber = Boolean(
    req.user?.isPaidSubscriber ||
    req.auth?.isPaidSubscriber ||
    req.user?.isPaid ||
    req.auth?.isPaid ||
    req.query?.isPaid === "true"
  );

  if (userId && mongoose.connection.readyState === 1) {
    try {
      const activeSub = await UserSubscription.findOne({
        userId,
        status: "ACTIVE",
        expiresAt: { $gt: new Date() },
      }).lean();
      if (activeSub) isPaidSubscriber = true;
    } catch (e) {
      logMessage(`[Notification] Subscription check error: ${e.message}`, null, "error");
    }
  }

  const result = await notificationService.getNotifications({
    userId,
    isPaidSubscriber,
    page,
    limit,
    category,
  });

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Notifications retrieved successfully.",
    {
      totalNotifications: result.total,
      total: result.total,
      totalPages: result.totalPages,
      unreadCount: result.unreadCount,
      page: result.page,
      limit: result.limit,
      hasMore: result.hasMore,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
        hasMore: result.hasMore,
      },
      notifications: result.notifications,
      list: result.notifications,
      isPaidSubscriber,
    },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 🔢 Get Unread Notification Badge Count (Sub-5ms)
 * GET /api/v1/notifications/unread-count
 */
export const getUnreadNotificationCount = asyncHandler(async (req, res) => {
  const userId =
    req.user?.id ||
    req.auth?.id ||
    req.user?._id ||
    req.auth?._id ||
    req.user?.userId ||
    req.auth?.userId ||
    req.query?.userId;

  const unreadCount = await notificationService.getUnreadCount(userId);

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Unread notification badge count retrieved.",
    {
      unreadCount,
    },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * ✔️ Mark Notifications as Read
 * PUT /api/v1/notifications/mark-read
 * PATCH /api/v1/notifications/:id/read
 * PATCH /api/v1/notifications/read-all
 */
export const markNotificationsRead = asyncHandler(async (req, res) => {
  const notificationId = req.params?.id || req.body?.notificationId || "ALL";
  const userId =
    req.user?.id ||
    req.auth?.id ||
    req.user?._id ||
    req.auth?._id ||
    req.user?.userId ||
    req.auth?.userId ||
    req.body?.userId;

  const result = await notificationService.markNotificationsRead(userId, notificationId);

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Notifications marked as read.",
    {
      notificationId,
      remainingUnread: result.remainingUnread,
    },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 🗑️ Delete Notification
 * DELETE /api/v1/notifications/:id
 */
export const deleteNotification = asyncHandler(async (req, res) => {
  const notificationId = req.params?.id || req.body?.notificationId;
  const userId =
    req.user?.id ||
    req.auth?.id ||
    req.user?._id ||
    req.auth?._id ||
    req.user?.userId ||
    req.auth?.userId;

  if (!notificationId) {
    return apiHTTPResponse(req, res, CONSTANTS.HTTP_BAD_REQUEST, "Notification ID is required.", null, CONSTANTS.BAD_REQUEST, CONSTANTS.ERROR_TRUE);
  }

  await notificationService.deleteNotification(userId, notificationId);

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Notification deleted successfully.",
    { notificationId },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 📱 Register Mobile Device Push Notification Token (FCM / APNs)
 * POST /api/v1/notifications/fcm-token
 */
export const registerDeviceToken = asyncHandler(async (req, res) => {
  const { token, platform = "ANDROID", deviceId = null } = req.body;
  const userId =
    req.user?.id ||
    req.auth?.id ||
    req.user?._id ||
    req.auth?._id ||
    req.user?.userId ||
    req.auth?.userId ||
    req.body?.userId;

  if (!token) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "Device token is required.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  if (userId) {
    await notificationService.registerDeviceToken({
      userId,
      token,
      platform,
      deviceId,
    });
  }

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Device token registered successfully for push notifications.",
    {
      tokenPreview: token.substring(0, 16) + "...",
      platform,
      registeredAt: Date.now(),
    },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 📱 Deactivate Mobile Device Push Notification Token (Logout)
 * DELETE /api/v1/notifications/fcm-token
 */
export const deactivateDeviceToken = asyncHandler(async (req, res) => {
  const { token } = req.body;
  const userId =
    req.user?.id ||
    req.auth?.id ||
    req.user?._id ||
    req.auth?._id ||
    req.user?.userId ||
    req.auth?.userId;

  await notificationService.deactivateDeviceToken({ userId, token });

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Device token deactivated successfully.",
    null,
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * ⚙️ Get Notification Preferences
 * GET /api/v1/notifications/preferences
 */
export const getPreferences = asyncHandler(async (req, res) => {
  const userId =
    req.user?.id ||
    req.auth?.id ||
    req.user?._id ||
    req.auth?._id ||
    req.user?.userId ||
    req.auth?.userId ||
    req.query?.userId;

  if (!userId) {
    return apiHTTPResponse(req, res, CONSTANTS.HTTP_BAD_REQUEST, "User ID is required.", null, CONSTANTS.BAD_REQUEST, CONSTANTS.ERROR_TRUE);
  }

  const prefs = await notificationService.getNotificationPreferences(userId);

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Notification preferences retrieved.",
    prefs,
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * ⚙️ Update Notification Preferences
 * PUT /api/v1/notifications/preferences
 */
export const updatePreferences = asyncHandler(async (req, res) => {
  const userId =
    req.user?.id ||
    req.auth?.id ||
    req.user?._id ||
    req.auth?._id ||
    req.user?.userId ||
    req.auth?.userId;

  if (!userId) {
    return apiHTTPResponse(req, res, CONSTANTS.HTTP_BAD_REQUEST, "User ID is required.", null, CONSTANTS.BAD_REQUEST, CONSTANTS.ERROR_TRUE);
  }

  const updated = await notificationService.updateNotificationPreferences(userId, req.body);

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Notification preferences updated successfully.",
    updated,
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 🚀 Bulk Create Notifications (Admin Campaigns)
 * POST /api/v1/notifications/bulk
 */
export const bulkCreateNotifications = asyncHandler(async (req, res) => {
  const {
    targetAudience = "ALL",
    targetUserIds = [],
    title,
    message,
    category = "PROMOTION",
    type = "BROADCAST_CAMPAIGN",
    data = {},
    priority = "NORMAL",
  } = req.body;

  if (!title || !message) {
    return apiHTTPResponse(req, res, CONSTANTS.HTTP_BAD_REQUEST, "Title and message are required.", null, CONSTANTS.BAD_REQUEST, CONSTANTS.ERROR_TRUE);
  }

  const result = await notificationService.createBulkNotifications({
    targetAudience,
    targetUserIds,
    title,
    message,
    category,
    type,
    data,
    priority,
  });

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_CREATED,
    `Campaign dispatched to ${result.recipientCount} recipients.`,
    result,
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 🔴 Live Real-Time Notifications Stream (Server-Sent Events)
 * GET /api/v1/notifications/sse
 */
export const streamNotifications = (req, res) => {
  const userId =
    req.user?.id ||
    req.auth?.id ||
    req.user?._id ||
    req.auth?._id ||
    req.user?.userId ||
    req.auth?.userId ||
    req.query?.userId;

  if (!userId) {
    return res.status(401).json({ message: "Authentication required for SSE stream." });
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  // Send initial connection ping
  res.write(`event: connected\ndata: ${JSON.stringify({ userId, connectedAt: Date.now() })}\n\n`);

  addSSEClient(userId, res);
};
