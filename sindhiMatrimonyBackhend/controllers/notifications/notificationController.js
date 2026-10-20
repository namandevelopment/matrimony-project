import { asyncHandler, apiHTTPResponse, logMessage } from "../../utils/globalFunction.js";
import * as CONSTANTS from "../../utils/constants.js";
import { SEED_NOTIFICATIONS } from "../../constants/seedCandidateData.js";

const inMemoryNotifications = SEED_NOTIFICATIONS.map((n) => ({ ...n }));

/**
 * 🔔 Get In-App Notifications Feed
 * GET /api/v1/notifications?page=1&limit=20
 */
export const getNotifications = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Number(req.query.limit) || 20);

  const startIdx = (page - 1) * limit;
  const paginated = inMemoryNotifications.slice(startIdx, startIdx + limit);

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Notifications retrieved successfully.",
    {
      totalNotifications: inMemoryNotifications.length,
      totalPages: Math.ceil(inMemoryNotifications.length / limit),
      unreadCount: inMemoryNotifications.filter((n) => !n.isRead).length,
      page,
      limit,
      notifications: paginated,
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
  const unreadCount = inMemoryNotifications.filter((n) => !n.isRead).length;

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
 */
export const markNotificationsRead = asyncHandler(async (req, res) => {
  const { notificationId = "ALL" } = req.body;

  if (notificationId === "ALL") {
    inMemoryNotifications.forEach((n) => {
      n.isRead = true;
    });
  } else {
    const target = inMemoryNotifications.find((n) => n._id === notificationId);
    if (target) {
      target.isRead = true;
    }
  }

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Notifications marked as read.",
    {
      notificationId,
      remainingUnread: inMemoryNotifications.filter((n) => !n.isRead).length,
    },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 📱 Register Mobile Device Push Notification Token (FCM / APNs)
 * POST /api/v1/notifications/fcm-token
 */
export const registerDeviceToken = asyncHandler(async (req, res) => {
  const { token, platform = "ANDROID" } = req.body;

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
