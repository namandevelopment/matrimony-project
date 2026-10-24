import { asyncHandler, apiHTTPResponse } from "../../utils/globalFunction.js";
import * as CONSTANTS from "../../utils/constants.js";

// Allowed enums for strict scenario validation
const ALLOWED_CATEGORIES = [
  "ALL",
  "VERIFICATION",
  "SECURITY",
  "PAYMENT",
  "ABUSE_REPORT",
  "SYSTEM",
  "CRM_LEAD",
];

const ALLOWED_PRIORITIES = ["ALL", "LOW", "NORMAL", "MEDIUM", "HIGH", "CRITICAL", "URGENT"];

const ALLOWED_TARGET_AUDIENCES = [
  "ALL_USERS",
  "ACTIVE_USERS",
  "GOLD_SUBSCRIBERS",
  "FREE_USERS",
  "UNVERIFIED_USERS",
  "STAFF_ONLY",
  "SPECIFIC_USERS",
];

const ALLOWED_CHANNELS = ["PUSH", "IN_APP", "SMS", "WHATSAPP", "EMAIL", "ALL"];

const AUDIENCE_ESTIMATES = {
  ALL_USERS: 2450,
  ACTIVE_USERS: 1820,
  GOLD_SUBSCRIBERS: 480,
  FREE_USERS: 1340,
  UNVERIFIED_USERS: 630,
  STAFF_ONLY: 15,
};

// In-Memory Staff Operational Alerts
export let adminNotificationsStore = [
  {
    _id: "adm_notif_001",
    title: "Pending Photo Verifications (14)",
    message: "14 new profile photo verification requests require manual staff review.",
    category: "VERIFICATION",
    priority: "HIGH",
    isRead: false,
    actionUrl: "/admin/verifications/pending",
    actionLabel: "Review Photos",
    metadata: { pendingCount: 14, queueType: "PHOTO" },
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    readAt: null,
  },
  {
    _id: "adm_notif_002",
    title: "Security Alert: Suspicious Login Spike",
    message: "Multiple failed login attempts detected on admin account from IP 194.26.29.112.",
    category: "SECURITY",
    priority: "CRITICAL",
    isRead: false,
    actionUrl: "/admin/security/audit-logs",
    actionLabel: "Investigate IP",
    metadata: { ip: "194.26.29.112", attemptCount: 8 },
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    readAt: null,
  },
  {
    _id: "adm_notif_003",
    title: "Payment Received: Gold Plan Upgrade",
    message: "Member Roshni Mirchandani (SIN94812) upgraded to 12-Month Gold Membership (₹4,999).",
    category: "PAYMENT",
    priority: "NORMAL",
    isRead: true,
    actionUrl: "/admin/finance/transactions",
    actionLabel: "View Receipt",
    metadata: { transactionId: "TXN_77491", amount: 4999, currency: "INR" },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    readAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "adm_notif_004",
    title: "Abuse Report Filed",
    message: "Candidate SIN10928 was reported for inappropriate messaging by SIN88421.",
    category: "ABUSE_REPORT",
    priority: "URGENT",
    isRead: false,
    actionUrl: "/admin/reviews/abuse",
    actionLabel: "View Report",
    metadata: { reportedUser: "SIN10928", reporterUser: "SIN88421" },
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    readAt: null,
  },
  {
    _id: "adm_notif_005",
    title: "CRM Follow-up SLA Warning",
    message: "5 VIP inquiry leads have remained unassigned for over 24 hours.",
    category: "CRM_LEAD",
    priority: "MEDIUM",
    isRead: false,
    actionUrl: "/admin/leads?view=unassigned",
    actionLabel: "Assign Leads",
    metadata: { unassignedCount: 5, slaThresholdHours: 24 },
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    readAt: null,
  },
  {
    _id: "adm_notif_006",
    title: "Automated Daily Backup Complete",
    message: "MongoDB Atlas cluster backup completed successfully (3.2 GB archived).",
    category: "SYSTEM",
    priority: "LOW",
    isRead: true,
    actionUrl: "/admin/system/status",
    actionLabel: "System Status",
    metadata: { backupSize: "3.2 GB", durationSeconds: 42 },
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    readAt: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
  },
];

export const addAdminNotification = (notif) => {
  adminNotificationsStore.unshift({
    _id: `adm_notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    isRead: false,
    createdAt: new Date().toISOString(),
    readAt: null,
    ...notif,
  });
};

// Delivery Logs Store for Broadcasts
let broadcastDeliveryLogs = [
  {
    _id: "bcast_log_001",
    broadcastId: "bcast_1708701234000",
    title: "Diwali Special Discount",
    channel: "PUSH",
    targetAudience: "FREE_USERS",
    estimatedRecipients: 1340,
    dispatchedCount: 1340,
    failedCount: 4,
    status: "DELIVERED",
    sentBy: "admin@sindhimarriage.in",
    dispatchedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
  },
];

/**
 * 🔔 GET /api/v1/admin/notifications (and alias /api/v1/admin/notification)
 * Fetch Admin Operational Alerts Feed
 * Scenarios Handled:
 * - Pagination (page, limit with safe min/max clamping)
 * - Category filter (VERIFICATION, SECURITY, PAYMENT, ABUSE_REPORT, SYSTEM, CRM_LEAD)
 * - Priority filter (LOW, NORMAL, MEDIUM, HIGH, CRITICAL, URGENT)
 * - Read status filter (ALL, READ, UNREAD, true, false)
 * - Text search query (q or search across title, message)
 * - Metadata summary counts (unreadCount, criticalCount, byCategory)
 */
export const getAdminNotifications = asyncHandler(async (req, res) => {
  const { category, priority, status, isRead, search, q, paymentStatus } = req.query;

  // Scenario: Sanitize and validate pagination
  const rawPage = Number(req.query.page);
  const rawLimit = Number(req.query.limit);
  const page = !isNaN(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;
  const limit = !isNaN(rawLimit) && rawLimit > 0 ? Math.min(100, Math.floor(rawLimit)) : 10;

  // Scenario: Category validation
  if (category && category !== "ALL") {
    const upperCategory = category.toUpperCase();
    if (!ALLOWED_CATEGORIES.includes(upperCategory)) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_BAD_REQUEST,
        `Invalid category '${category}'. Allowed categories: ${ALLOWED_CATEGORIES.join(", ")}`,
        CONSTANTS.DATA_NULL,
        CONSTANTS.BAD_REQUEST,
        CONSTANTS.ERROR_TRUE
      );
    }
  }

  // Scenario: Priority validation
  if (priority && priority !== "ALL") {
    const upperPriority = priority.toUpperCase();
    if (!ALLOWED_PRIORITIES.includes(upperPriority)) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_BAD_REQUEST,
        `Invalid priority '${priority}'. Allowed priorities: ${ALLOWED_PRIORITIES.join(", ")}`,
        CONSTANTS.DATA_NULL,
        CONSTANTS.BAD_REQUEST,
        CONSTANTS.ERROR_TRUE
      );
    }
  }

  // Filtering pipeline
  let filtered = [...adminNotificationsStore];

  // 1. Category Filter
  if (category && category.toUpperCase() !== "ALL") {
    filtered = filtered.filter((n) => n.category.toUpperCase() === category.toUpperCase());
  }

  // 1b. Payment Lifecycle Status Filter
  if (paymentStatus && paymentStatus.toUpperCase() !== "ALL") {
    filtered = filtered.filter(
      (n) => n.metadata?.status?.toUpperCase() === paymentStatus.toUpperCase()
    );
  }

  // 2. Priority Filter
  if (priority && priority !== "ALL") {
    filtered = filtered.filter((n) => n.priority.toUpperCase() === priority.toUpperCase());
  }

  // 3. Status / isRead Filter
  const statusParam = (status || isRead || "").toString().toUpperCase();
  if (statusParam === "UNREAD" || statusParam === "FALSE") {
    filtered = filtered.filter((n) => !n.isRead);
  } else if (statusParam === "READ" || statusParam === "TRUE") {
    filtered = filtered.filter((n) => n.isRead);
  }

  // 4. Keyword Search Filter
  const searchTerm = (search || q || "").toString().trim().toLowerCase();
  if (searchTerm) {
    filtered = filtered.filter(
      (n) =>
        n.title.toLowerCase().includes(searchTerm) ||
        n.message.toLowerCase().includes(searchTerm) ||
        (n.actionLabel && n.actionLabel.toLowerCase().includes(searchTerm))
    );
  }

  // Sorting: unread first, then newest first
  filtered.sort((a, b) => {
    if (a.isRead === b.isRead) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return a.isRead ? 1 : -1;
  });

  // Pagination slice
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const startIdx = (page - 1) * limit;
  const paginated = filtered.slice(startIdx, startIdx + limit);

  // Summary counts across all operational alerts
  const totalAlerts = adminNotificationsStore.length;
  const unreadCount = adminNotificationsStore.filter((n) => !n.isRead).length;
  const criticalCount = adminNotificationsStore.filter(
    (n) => !n.isRead && (n.priority === "CRITICAL" || n.priority === "URGENT")
  ).length;

  const categoryCounts = ALLOWED_CATEGORIES.filter((c) => c !== "ALL").reduce((acc, cat) => {
    acc[cat] = adminNotificationsStore.filter((n) => n.category === cat).length;
    return acc;
  }, {});

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Admin notifications feed retrieved successfully.",
    {
      notifications: paginated,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      summary: {
        totalAlerts,
        unreadCount,
        criticalCount,
        categoryCounts,
      },
    },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 🔢 GET /api/v1/admin/notifications/unread-count
 * Quick Bell Badge Counter for Admin Portal Top Bar
 */
export const getAdminUnreadNotificationCount = asyncHandler(async (req, res) => {
  const unreadAlerts = adminNotificationsStore.filter((n) => !n.isRead);
  const criticalUnread = unreadAlerts.filter(
    (n) => n.priority === "CRITICAL" || n.priority === "URGENT"
  ).length;
  const highUnread = unreadAlerts.filter((n) => n.priority === "HIGH").length;

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Unread admin notification count retrieved.",
    {
      unreadCount: unreadAlerts.length,
      criticalUnread,
      highUnread,
      lastCheckedAt: new Date().toISOString(),
    },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * ✉️ PUT /api/v1/admin/notifications/:id/read or PUT /api/v1/admin/notifications/mark-read
 * Mark Single or All Admin Alerts as Read
 * Scenarios Handled:
 * - Mark specific ID (returns 404 if not found, 200 if already read or newly marked)
 * - Mark ALL in bulk (?id=all, or body.notificationId === 'ALL', or body.markAll === true)
 * - Missing identifier returns 400
 */
export const markAdminNotificationRead = asyncHandler(async (req, res) => {
  const targetId = req.params.id || req.body.notificationId || req.body.id;
  const isMarkAll = req.body.markAll === true || targetId === "ALL" || targetId === "all";

  // Scenario 1: Bulk mark all as read
  if (isMarkAll) {
    let modifiedCount = 0;
    const nowIso = new Date().toISOString();
    adminNotificationsStore.forEach((n) => {
      if (!n.isRead) {
        n.isRead = true;
        n.readAt = nowIso;
        modifiedCount++;
      }
    });

    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_OK,
      `All notifications marked as read (${modifiedCount} updated).`,
      {
        modifiedCount,
        remainingUnread: 0,
      },
      CONSTANTS.OK,
      CONSTANTS.ERROR_FALSE
    );
  }

  // Scenario 2: Missing identifier
  if (!targetId) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "Notification ID or markAll flag is required.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  // Scenario 3: Find specific notification
  const notif = adminNotificationsStore.find((n) => n._id === targetId);
  if (!notif) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_NOT_FOUND,
      `Admin notification with ID '${targetId}' not found.`,
      CONSTANTS.DATA_NULL,
      CONSTANTS.NOT_FOUND,
      CONSTANTS.ERROR_TRUE
    );
  }

  // Scenario 4: Already read (idempotent)
  if (notif.isRead) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_OK,
      "Notification is already marked as read.",
      notif,
      CONSTANTS.OK,
      CONSTANTS.ERROR_FALSE
    );
  }

  // Mark read
  notif.isRead = true;
  notif.readAt = new Date().toISOString();

  const remainingUnread = adminNotificationsStore.filter((n) => !n.isRead).length;

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Notification marked as read successfully.",
    {
      notification: notif,
      remainingUnread,
    },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 🚀 POST /api/v1/admin/notifications/broadcast (and POST /api/v1/admin/notifications)
 * Send Targeted Broadcast / Push / In-App Notification Campaign
 * Scenarios Handled:
 * - Missing/empty title (400)
 * - Title length > 120 chars (400)
 * - Missing/empty body (400)
 * - Body length > 1000 chars (400)
 * - Invalid targetAudience enum (400)
 * - Specific users audience without non-empty userIds array (400)
 * - Invalid delivery channel (400)
 * - Invalid priority enum (400)
 * - Past scheduled timestamp (400) or invalid date format (400)
 * - Success dispatch with audience recipient estimation and delivery log creation (201)
 */
export const broadcastAdminNotification = asyncHandler(async (req, res) => {
  const {
    title,
    body,
    message,
    targetAudience = "ALL_USERS",
    channel = "PUSH",
    priority = "NORMAL",
    deepLink,
    userIds,
    recipientIds,
    scheduledAt,
  } = req.body;

  const contentText = (body || message || "").toString().trim();
  const titleText = (title || "").toString().trim();

  // Scenario 1: Title Validation
  if (!titleText) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "Notification title is required and cannot be empty.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }
  if (titleText.length > 120) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "Notification title cannot exceed 120 characters.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  // Scenario 2: Body / Message Validation
  if (!contentText) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "Notification body / message is required and cannot be empty.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }
  if (contentText.length > 1000) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "Notification body / message cannot exceed 1000 characters.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  // Scenario 3: Target Audience Validation
  const upperAudience = targetAudience.toUpperCase();
  if (!ALLOWED_TARGET_AUDIENCES.includes(upperAudience)) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      `Invalid targetAudience '${targetAudience}'. Allowed values: ${ALLOWED_TARGET_AUDIENCES.join(
        ", "
      )}`,
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  // Scenario 4: Specific Users Validation
  const recipientsList = userIds || recipientIds;
  if (upperAudience === "SPECIFIC_USERS") {
    if (!Array.isArray(recipientsList) || recipientsList.length === 0) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_BAD_REQUEST,
        "For targetAudience 'SPECIFIC_USERS', 'userIds' must be a non-empty array of valid user IDs.",
        CONSTANTS.DATA_NULL,
        CONSTANTS.BAD_REQUEST,
        CONSTANTS.ERROR_TRUE
      );
    }
  }

  // Scenario 5: Channel Validation
  const upperChannel = channel.toUpperCase();
  if (!ALLOWED_CHANNELS.includes(upperChannel)) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      `Invalid channel '${channel}'. Allowed values: ${ALLOWED_CHANNELS.join(", ")}`,
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  // Scenario 6: Priority Validation
  const upperPriority = priority.toUpperCase();
  if (!ALLOWED_PRIORITIES.includes(upperPriority) || upperPriority === "ALL") {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      `Invalid priority '${priority}'. Allowed values: LOW, NORMAL, MEDIUM, HIGH, CRITICAL, URGENT`,
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  // Scenario 7: Scheduled Delivery Validation
  let scheduledIso = null;
  if (scheduledAt) {
    const scheduledDate = new Date(scheduledAt);
    if (isNaN(scheduledDate.getTime())) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_BAD_REQUEST,
        "Invalid scheduledAt format. Must be a valid ISO 8601 timestamp.",
        CONSTANTS.DATA_NULL,
        CONSTANTS.BAD_REQUEST,
        CONSTANTS.ERROR_TRUE
      );
    }
    if (scheduledDate.getTime() <= Date.now()) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_BAD_REQUEST,
        "scheduledAt timestamp cannot be in the past. Must be a future date/time.",
        CONSTANTS.DATA_NULL,
        CONSTANTS.BAD_REQUEST,
        CONSTANTS.ERROR_TRUE
      );
    }
    scheduledIso = scheduledDate.toISOString();
  }

  // Scenario 8: Successful Dispatch & Recipient Estimation
  const estimatedRecipients =
    upperAudience === "SPECIFIC_USERS"
      ? recipientsList.length
      : AUDIENCE_ESTIMATES[upperAudience] || 500;

  const broadcastId = `bcast_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const dispatchStatus = scheduledIso ? "SCHEDULED" : "DISPATCHED";

  const newLog = {
    _id: `bcast_log_${Date.now()}`,
    broadcastId,
    title: titleText,
    body: contentText,
    channel: upperChannel,
    targetAudience: upperAudience,
    priority: upperPriority,
    deepLink: deepLink || null,
    estimatedRecipients,
    dispatchedCount: scheduledIso ? 0 : estimatedRecipients,
    failedCount: 0,
    status: dispatchStatus,
    scheduledAt: scheduledIso,
    sentBy: req.user?.email || "admin@sindhimarriage.in",
    dispatchedAt: scheduledIso ? null : new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };

  broadcastDeliveryLogs.unshift(newLog);

  // If broadcast is intended for STAFF_ONLY or IN_APP operational alert, also append to alerts feed
  if (upperAudience === "STAFF_ONLY" || (upperChannel === "IN_APP" && !scheduledIso)) {
    adminNotificationsStore.unshift({
      _id: `adm_notif_${Date.now()}`,
      title: titleText,
      message: contentText,
      category: "SYSTEM",
      priority: upperPriority,
      isRead: false,
      actionUrl: deepLink || null,
      actionLabel: deepLink ? "View Update" : null,
      metadata: { broadcastId, targetAudience: upperAudience },
      createdAt: new Date().toISOString(),
      readAt: null,
    });
  }

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_CREATED,
    scheduledIso
      ? "Broadcast notification scheduled successfully."
      : "Broadcast notification dispatched successfully.",
    {
      broadcastId,
      status: dispatchStatus,
      channel: upperChannel,
      targetAudience: upperAudience,
      estimatedRecipients,
      title: titleText,
      priority: upperPriority,
      scheduledAt: scheduledIso,
      deepLink: deepLink || null,
      dispatchedAt: newLog.dispatchedAt,
    },
    CONSTANTS.CREATED,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 📜 GET /api/v1/admin/notifications/logs
 * Broadcast & Delivery Audit Logs with Status/Channel Filters
 */
export const getAdminNotificationLogs = asyncHandler(async (req, res) => {
  const { status, channel, page = 1, limit = 10 } = req.query;

  let logs = [...broadcastDeliveryLogs];

  if (status && status !== "ALL") {
    logs = logs.filter((l) => l.status.toUpperCase() === status.toUpperCase());
  }

  if (channel && channel !== "ALL") {
    logs = logs.filter((l) => l.channel.toUpperCase() === channel.toUpperCase());
  }

  const p = Math.max(1, Number(page) || 1);
  const l = Math.min(50, Number(limit) || 10);
  const startIdx = (p - 1) * l;
  const paginatedLogs = logs.slice(startIdx, startIdx + l);

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Broadcast delivery logs retrieved successfully.",
    {
      logs: paginatedLogs,
      total: logs.length,
      page: p,
      limit: l,
      totalPages: Math.ceil(logs.length / l) || 1,
    },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 🗑️ DELETE /api/v1/admin/notifications/:id
 * Dismiss or Delete an Admin Alert
 */
export const deleteAdminNotification = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "Notification ID is required.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  const index = adminNotificationsStore.findIndex((n) => n._id === id);
  if (index === -1) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_NOT_FOUND,
      `Notification with ID '${id}' not found.`,
      CONSTANTS.DATA_NULL,
      CONSTANTS.NOT_FOUND,
      CONSTANTS.ERROR_TRUE
    );
  }

  const removed = adminNotificationsStore.splice(index, 1)[0];

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Notification dismissed successfully.",
    {
      deletedId: id,
      title: removed.title,
      remainingCount: adminNotificationsStore.length,
    },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});
