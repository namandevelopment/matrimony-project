import mongoose from "mongoose";
import Notification from "../../models/notifications/notification.model.js";
import DeviceToken from "../../models/notifications/deviceToken.model.js";
import NotificationPreference from "../../models/notifications/notificationPreference.model.js";
import UserSubscription from "../../models/plans/userSubscription.model.js";
import User from "../../models/users/user.model.js";
import { sendMulticastPush } from "../../config/firebaseAdmin.js";
import { logMessage } from "../../utils/globalFunction.js";

// In-Memory SSE Clients for Real-Time Streaming
const sseClients = new Map(); // userId -> Set of express res objects

/**
 * Register SSE Client for Live Notifications
 */
export const addSSEClient = (userId, res) => {
  const uid = String(userId);
  if (!sseClients.has(uid)) {
    sseClients.set(uid, new Set());
  }
  sseClients.get(uid).add(res);

  res.on("close", () => {
    removeSSEClient(uid, res);
  });
};

export const removeSSEClient = (userId, res) => {
  const uid = String(userId);
  if (sseClients.has(uid)) {
    const clients = sseClients.get(uid);
    clients.delete(res);
    if (clients.size === 0) {
      sseClients.delete(uid);
    }
  }
};

/**
 * Emit real-time event to connected SSE clients
 */
export const emitSSEToUser = (userId, eventName, payload) => {
  const uid = String(userId);
  if (sseClients.has(uid)) {
    const clients = sseClients.get(uid);
    const data = `event: ${eventName}\ndata: ${JSON.stringify(payload)}\n\n`;
    for (const client of clients) {
      try {
        client.write(data);
      } catch (err) {
        logMessage(`[SSE] Write error for user ${uid}: ${err.message}`, null, "warn");
      }
    }
  }
};

/**
 * 24-Hour Profile View Deduplication Check
 */
export const hasRecentProfileVisitNotification = async (
  viewerUserId,
  recipientUserId,
  windowMs = 24 * 60 * 60 * 1000
) => {
  try {
    const cutoff = new Date(Date.now() - windowMs);
    const exists = await Notification.findOne({
      recipientUserId,
      type: { $in: ["PROFILE_VIEWED", "profile_viewed", "PROFILE_VIEW", "PROFILE_VISIT"] },
      $or: [
        { senderUserId: viewerUserId },
        { "data.viewerUserId": String(viewerUserId) },
      ],
      createdAt: { $gt: cutoff },
    }).lean();

    return Boolean(exists);
  } catch (error) {
    logMessage(`[NotificationService] Error checking profile visit deduplication: ${error.message}`, error, "error");
    return false;
  }
};

/**
 * Create Single Notification and Dispatch Push Alert
 */
export const createNotification = async ({
  recipientUserId,
  senderUserId = null,
  type,
  category = "SYSTEM",
  title,
  message,
  data = {},
  isActionRequired = false,
  priority = "NORMAL",
  expiresAt = null,
  idempotencyKey = null,
}) => {
  try {
    if (!recipientUserId) {
      throw new Error("recipientUserId is mandatory for creating a notification.");
    }

    // Check idempotency if key provided
    if (idempotencyKey) {
      const existing = await Notification.findOne({ idempotencyKey }).lean();
      if (existing) {
        return existing;
      }
    }

    // Check user preferences if available
    const prefs = await NotificationPreference.findOne({ userId: recipientUserId }).lean();
    if (prefs) {
      const catKey = category.toLowerCase();
      // Allow SYSTEM/SECURITY notifications always
      if (category !== "SYSTEM" && prefs[catKey] && prefs[catKey].inApp === false) {
        logMessage(`[NotificationService] In-App notification suppressed by preference for user ${recipientUserId}`, null, "info");
        return null;
      }
    }

    const newNotification = await Notification.create({
      recipientUserId,
      senderUserId,
      type,
      category,
      title,
      message,
      data,
      isActionRequired,
      priority,
      expiresAt,
      idempotencyKey,
      isRead: false,
    });

    // Push SSE real-time alert to live active client sessions
    emitSSEToUser(recipientUserId, "notification", {
      notification: newNotification,
      unreadIncrement: 1,
    });

    // Check if push notifications should be dispatched
    const pushAllowed = !prefs || category === "SYSTEM" || prefs[category.toLowerCase()]?.push !== false;
    if (pushAllowed) {
      // Non-blocking async background push dispatch
      setImmediate(() => {
        dispatchPushNotification({
          recipientUserId,
          title,
          body: message,
          data: {
            ...data,
            notificationId: String(newNotification._id),
            type,
            category,
          },
          priority: priority === "CRITICAL" || priority === "HIGH" ? "HIGH" : "NORMAL",
        }).catch((err) => {
          logMessage(`[NotificationService] Async push dispatch failed: ${err.message}`, err, "error");
        });
      });
    }

    return newNotification;
  } catch (error) {
    // Graceful handling of duplicate idempotency key errors
    if (error.code === 11000 && idempotencyKey) {
      return await Notification.findOne({ idempotencyKey }).lean();
    }
    logMessage(`[NotificationService] createNotification failed: ${error.message}`, error, "error");
    throw error;
  }
};

/**
 * Dispatch Push Notification to active device tokens for a user
 */
export const dispatchPushNotification = async ({
  recipientUserId,
  title,
  body,
  data = {},
  priority = "HIGH",
}) => {
  try {
    const activeTokens = await DeviceToken.find({
      userId: recipientUserId,
      isActive: true,
    })
      .select("token platform")
      .lean();

    if (!activeTokens || activeTokens.length === 0) {
      return { sent: 0, reason: "No active device tokens found." };
    }

    const tokens = activeTokens.map((t) => t.token);

    // Map category to native channel
    let channelId = "matrimony_general_channel";
    const type = (data.type || "").toUpperCase();
    if (type.includes("MATCH")) channelId = "matrimony_matches_critical";
    else if (type.includes("MESSAGE") || type.includes("CHAT")) channelId = "matrimony_messages_channel";
    else if (type.includes("INTEREST")) channelId = "matrimony_interests_channel";
    else if (type.includes("PROMO") || type.includes("OFFER")) channelId = "matrimony_promotions_channel";

    const pushResult = await sendMulticastPush({
      tokens,
      title,
      body,
      data,
      priority,
      channelId,
    });

    // Automatically deactivate stale or unregistered tokens returned by FCM
    if (pushResult.invalidTokens && pushResult.invalidTokens.length > 0) {
      await DeviceToken.updateMany(
        { token: { $in: pushResult.invalidTokens } },
        { $set: { isActive: false } }
      );
      await User.updateOne(
        { _id: recipientUserId },
        { $pull: { fcmTokens: { $in: pushResult.invalidTokens } } }
      );
      logMessage(`[NotificationService] Deactivated ${pushResult.invalidTokens.length} invalid tokens.`, null, "info");
    }

    return pushResult;
  } catch (error) {
    logMessage(`[NotificationService] dispatchPushNotification error: ${error.message}`, error, "error");
    return { error: error.message };
  }
};

/**
 * Get Paginated Notifications Feed with Subscription-Aware Privacy
 */
export const getNotifications = async ({
  userId,
  isPaidSubscriber = false,
  page = 1,
  limit = 20,
  category = null,
}) => {
  const query = {};
  if (userId) {
    query.recipientUserId = userId;
  }
  if (category && category !== "ALL") {
    query.category = category.toUpperCase();
  }

  const skip = (page - 1) * limit;

  const [rawList, total, unreadCount] = await Promise.all([
    Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Notification.countDocuments(query),
    Notification.countDocuments({ ...query, isRead: false }),
  ]);

  // Subscription-Aware Masking for Matrimonial Privacy
  const notifications = rawList.map((n) => {
    const isProfileView =
      n.type === "PROFILE_VIEWED" ||
      n.type === "profile_viewed" ||
      n.type === "PROFILE_VIEW" ||
      n.type === "PROFILE_VISIT";

    if (isProfileView) {
      const hasPlan = Boolean(isPaidSubscriber || n.data?.isRecipientPaid);
      if (!hasPlan) {
        return {
          ...n,
          title: "Someone Viewed Your Profile 👁️",
          message: `A verified Sindhi match from ${n.data?.city || "Sindhi community"} viewed your profile. Upgrade to view profile details.`,
          body: `A verified Sindhi match from ${n.data?.city || "Sindhi community"} viewed your profile. Upgrade to view profile details.`,
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
        const visitorName = n.data?.visitorName || n.data?.name || "Sindhi Candidate";
        const visitorCity = n.data?.visitorCity || n.data?.city || "Mumbai";
        const visitorProfession = n.data?.visitorProfession || n.data?.profession || "Professional";
        const visitorAvatar = n.data?.visitorAvatar || n.data?.avatarUrl || "";
        const visitorMatrimonyId = n.data?.visitorMatrimonyId || "SM4517094";

        return {
          ...n,
          title: "Profile Visitor 👁️",
          message: `${visitorName} (${visitorProfession}, ${visitorCity}) viewed your profile.`,
          body: `${visitorName} (${visitorProfession}, ${visitorCity}) viewed your profile.`,
          avatar: visitorAvatar,
          isLocked: false,
          upgradeRequired: false,
          actor: {
            id: String(n.data?.candidateId || n.senderUserId || ""),
            matrimonyId: visitorMatrimonyId,
            name: visitorName,
            avatarUrl: visitorAvatar,
            city: visitorCity,
            profession: visitorProfession,
            age: n.data?.age || 26,
            caste: n.data?.caste || "Sindhi",
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

  const totalPages = Math.ceil(total / limit) || 1;

  return {
    notifications,
    list: notifications,
    total,
    totalPages,
    page,
    limit,
    unreadCount,
    hasMore: page < totalPages,
    isPaidSubscriber,
  };
};

/**
 * Get Unread Notification Count
 */
export const getUnreadCount = async (userId) => {
  if (!userId) return 0;
  return await Notification.countDocuments({
    recipientUserId: userId,
    isRead: false,
  });
};

/**
 * Mark Single or All Notifications Read
 */
export const markNotificationsRead = async (userId, notificationId = "ALL") => {
  const filter = { recipientUserId: userId };
  if (notificationId !== "ALL") {
    filter._id = notificationId;
  }

  const updateResult = await Notification.updateMany(filter, {
    $set: {
      isRead: true,
      readAt: new Date(),
    },
  });

  const remainingUnread = await Notification.countDocuments({
    recipientUserId: userId,
    isRead: false,
  });

  // Emit SSE unread badge sync
  emitSSEToUser(userId, "unread_count", { unreadCount: remainingUnread });

  return {
    modifiedCount: updateResult.modifiedCount,
    remainingUnread,
  };
};

/**
 * Delete Notification
 */
export const deleteNotification = async (userId, notificationId) => {
  const result = await Notification.deleteOne({
    _id: notificationId,
    recipientUserId: userId,
  });
  return result.deletedCount > 0;
};

/**
 * Register FCM / APNs Device Token
 */
export const registerDeviceToken = async ({ userId, token, platform = "ANDROID", deviceId = null }) => {
  if (!token || !userId) {
    throw new Error("Both userId and token are required for device registration.");
  }

  // Upsert token record
  await DeviceToken.findOneAndUpdate(
    { token },
    {
      userId,
      token,
      platform,
      deviceId,
      isActive: true,
      lastUsedAt: new Date(),
    },
    { upsert: true, new: true }
  );

  // Sync with user's fcmTokens array
  await User.findByIdAndUpdate(userId, {
    $addToSet: { fcmTokens: token },
  });

  return { success: true };
};

/**
 * Deactivate Device Token on Logout
 */
export const deactivateDeviceToken = async ({ userId, token }) => {
  if (token) {
    await DeviceToken.updateMany({ token }, { $set: { isActive: false } });
    if (userId) {
      await User.findByIdAndUpdate(userId, {
        $pull: { fcmTokens: token },
      });
    }
  } else if (userId) {
    await DeviceToken.updateMany({ userId }, { $set: { isActive: false } });
    await User.findByIdAndUpdate(userId, {
      $set: { fcmTokens: [] },
    });
  }
  return { success: true };
};

/**
 * Notification Preferences
 */
export const getNotificationPreferences = async (userId) => {
  let prefs = await NotificationPreference.findOne({ userId }).lean();
  if (!prefs) {
    prefs = await NotificationPreference.create({ userId });
  }
  return prefs;
};

export const updateNotificationPreferences = async (userId, updateData) => {
  return await NotificationPreference.findOneAndUpdate(
    { userId },
    { $set: updateData },
    { new: true, upsert: true }
  );
};

/**
 * Bulk Broadcast Campaigns (Targeted)
 */
export const createBulkNotifications = async ({
  targetAudience = "ALL",
  targetUserIds = [],
  title,
  message,
  category = "PROMOTION",
  type = "BROADCAST_CAMPAIGN",
  data = {},
  priority = "NORMAL",
}) => {
  let recipientIds = [];

  if (targetAudience === "SELECTED_IDS" && Array.isArray(targetUserIds) && targetUserIds.length > 0) {
    recipientIds = targetUserIds;
  } else if (targetAudience === "PREMIUM_USERS") {
    const activeSubs = await UserSubscription.find({
      status: "ACTIVE",
      expiresAt: { $gt: new Date() },
    })
      .select("userId")
      .lean();
    recipientIds = activeSubs.map((s) => s.userId);
  } else if (targetAudience === "FREE_USERS") {
    const activeSubs = await UserSubscription.find({
      status: "ACTIVE",
      expiresAt: { $gt: new Date() },
    })
      .select("userId")
      .lean();
    const paidIds = new Set(activeSubs.map((s) => String(s.userId)));
    const allUsers = await User.find({ isDeleted: { $ne: true } }).select("_id").lean();
    recipientIds = allUsers.filter((u) => !paidIds.has(String(u._id))).map((u) => u._id);
  } else if (targetAudience === "UNVERIFIED_PROFILES") {
    const unverified = await User.find({
      isKycVerified: false,
      isDeleted: { $ne: true },
    })
      .select("_id")
      .lean();
    recipientIds = unverified.map((u) => u._id);
  } else {
    // ALL users
    const allUsers = await User.find({ isDeleted: { $ne: true } }).select("_id").lean();
    recipientIds = allUsers.map((u) => u._id);
  }

  if (recipientIds.length === 0) {
    return { count: 0, recipientCount: 0 };
  }

  const batchDocs = recipientIds.map((uid) => ({
    recipientUserId: uid,
    type,
    category,
    title,
    message,
    data,
    priority,
    isRead: false,
    createdAt: new Date(),
  }));

  // Chunked batch insertion (1000 at a time)
  const chunkSize = 1000;
  for (let i = 0; i < batchDocs.length; i += chunkSize) {
    const chunk = batchDocs.slice(i, i + chunkSize);
    await Notification.insertMany(chunk, { ordered: false });
  }

  // Non-blocking push notification multicast
  setImmediate(async () => {
    try {
      const tokens = await DeviceToken.find({
        userId: { $in: recipientIds },
        isActive: true,
      })
        .select("token")
        .lean();

      if (tokens.length > 0) {
        const tokenList = tokens.map((t) => t.token);
        // Multicast in chunks of 500 (FCM limit per multicast call)
        for (let i = 0; i < tokenList.length; i += 500) {
          const slice = tokenList.slice(i, i + 500);
          await sendMulticastPush({
            tokens: slice,
            title,
            body: message,
            data: { ...data, category, type },
            priority: priority === "HIGH" ? "HIGH" : "NORMAL",
          });
        }
      }
    } catch (e) {
      logMessage(`[NotificationService] Bulk push dispatch error: ${e.message}`, e, "error");
    }
  });

  return {
    count: batchDocs.length,
    recipientCount: recipientIds.length,
  };
};

export default {
  createNotification,
  createBulkNotifications,
  getNotifications,
  getUnreadCount,
  markNotificationsRead,
  deleteNotification,
  registerDeviceToken,
  deactivateDeviceToken,
  dispatchPushNotification,
  getNotificationPreferences,
  updateNotificationPreferences,
  hasRecentProfileVisitNotification,
  addSSEClient,
  removeSSEClient,
};

