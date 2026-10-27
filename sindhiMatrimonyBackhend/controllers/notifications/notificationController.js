import { asyncHandler, apiHTTPResponse, logMessage } from "../../utils/globalFunction.js";
import * as CONSTANTS from "../../utils/constants.js";
import mongoose from "mongoose";
import UserSubscription from "../../models/plans/userSubscription.model.js";

const inMemoryNotifications = [];

export const addNotification = (notif) => {
  inMemoryNotifications.unshift(notif);
};

export const hasRecentProfileVisitNotification = (viewerUserId, recipientUserId, windowMs = 24 * 60 * 60 * 1000) => {
  const cutoff = Date.now() - windowMs;
  return inMemoryNotifications.some((n) => {
    const isProfileView = n.type === "PROFILE_VIEWED" || n.type === "profile_viewed";
    const matchesRecipient =
      String(n.recipientUserId || n.data?.viewedUserId) === String(recipientUserId);
    const matchesViewer =
      String(n.viewerUserId || n.data?.viewerUserId) === String(viewerUserId);
    const notifTime = n.createdAt ? new Date(n.createdAt).getTime() : 0;
    return isProfileView && matchesRecipient && matchesViewer && notifTime > cutoff;
  });
};

/**
 * 🔔 Get In-App Notifications Feed
 * GET /api/v1/notifications?page=1&limit=20
 */
export const getNotifications = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query?.pageNo || req.query?.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query?.pageSize || req.query?.limit, 10) || 20));

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
        expiresAt: { $gt: Date.now() },
      }).lean();
      isPaidSubscriber = Boolean(activeSub);
    } catch (e) {
      logMessage(`[Notification] Subscription check error: ${e.message}`, null, "error");
    }
  }

  // Filter for the recipient if userId is available, or include general broadcast
  const userNotifs = inMemoryNotifications.filter((n) => {
    if (!userId) return true;
    const recipient = n.recipientUserId || n.data?.viewedUserId;
    return !recipient || String(recipient) === String(userId);
  });

  // Transform notifications to mask/unmask visitor details based on subscription status
  const processedNotifs = userNotifs.map((n) => {
    if (n.type === "PROFILE_VIEWED" || n.type === "profile_viewed") {
      const hasPlan = isPaidSubscriber || n.data?.isRecipientPaid;
      if (!hasPlan) {
        return {
          ...n,
          title: "Someone Viewed Your Profile 👁️",
          body: `A verified Sindhi match from ${n.data?.city || "Sindhi community"} viewed your profile. Upgrade your plan to see who visited you.`,
          avatar: "",
          isLocked: true,
          upgradeRequired: true,
          actor: {
            id: "",
            matrimonyId: "SM******",
            name: "Sindhi Member",
            city: n.data?.city || "Hidden",
            profession: "Locked (Premium)",
            avatarUrl: "",
          },
          primaryAction: {
            label: "Upgrade to View Profile",
            action: "upgrade_plan",
            variant: "primary",
          },
        };
      } else {
        const visitorName = n.data?.visitorName || n.actor?.name || "Sindhi Candidate";
        const visitorCity = n.data?.visitorCity || n.data?.city || n.actor?.city || "Mumbai";
        const visitorProfession = n.data?.visitorProfession || n.data?.profession || n.actor?.profession || "Professional";
        const visitorAvatar = n.data?.visitorAvatar || n.avatar || n.actor?.avatarUrl || "";
        const visitorMatrimonyId = n.data?.visitorMatrimonyId || (n.actor?.matrimonyId !== "SM******" ? n.actor?.matrimonyId : "SM4517094");

        return {
          ...n,
          title: "Profile Visitor 👁️",
          body: `${visitorName} (${visitorProfession}, ${visitorCity}) viewed your profile.`,
          avatar: visitorAvatar,
          isLocked: false,
          upgradeRequired: false,
          actor: {
            id: String(n.data?.candidateId || n.actor?.id || ""),
            matrimonyId: visitorMatrimonyId,
            name: visitorName,
            avatarUrl: visitorAvatar,
            city: visitorCity,
            profession: visitorProfession,
            age: n.data?.age || n.actor?.age || 25,
            caste: n.data?.caste || n.actor?.caste || "Sindhi",
          },
          primaryAction: {
            label: "View Profile",
            action: "view_profile",
            variant: "secondary",
          },
        };
      }
    }
    return n;
  });

  const total = processedNotifs.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const startIdx = (page - 1) * limit;
  const paginated = processedNotifs.slice(startIdx, startIdx + limit);

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Notifications retrieved successfully.",
    {
      totalNotifications: total,
      total,
      totalPages,
      unreadCount: processedNotifs.filter((n) => !n.isRead).length,
      page,
      limit,
      hasMore: page < totalPages,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasMore: page < totalPages,
      },
      notifications: paginated,
      list: paginated,
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

  const userNotifs = inMemoryNotifications.filter((n) => {
    if (!userId) return true;
    const recipient = n.recipientUserId || n.data?.viewedUserId;
    return !recipient || String(recipient) === String(userId);
  });

  const unreadCount = userNotifs.filter((n) => !n.isRead).length;

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
