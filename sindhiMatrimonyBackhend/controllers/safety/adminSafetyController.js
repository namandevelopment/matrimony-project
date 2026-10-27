import { asyncHandler, apiHTTPResponse } from "../../utils/globalFunction.js";
import * as CONSTANTS from "../../utils/constants.js";

// Store for flagged abuse reports
let safetyReportsStore = [
  {
    _id: "rep_501",
    reportId: "REP-501",
    reportedUserId: "SM10022",
    reportedUserName: "Vikram Wadhwa",
    reportedByUserId: "SM10002",
    reportedByUserName: "Simran Chandnani",
    reason: "INAPPROPRIATE_MESSAGING",
    description: "Repeatedly calling outside agreed hours and asking for financial details.",
    status: "PENDING",
    severity: "HIGH",
    proofAttachments: [],
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    actionHistory: [],
  },
  {
    _id: "rep_502",
    reportId: "REP-502",
    reportedUserId: "SM10034",
    reportedUserName: "Manish Chhabria",
    reportedByUserId: "SM10006",
    reportedByUserName: "Kajal Makhija",
    reason: "FAKE_PROFILE_PHOTOS",
    description: "Profile picture appears to be copied from internet celebrity.",
    status: "PENDING",
    severity: "MEDIUM",
    proofAttachments: [],
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    actionHistory: [],
  },
];

// Blocked hardware devices & IP ban registry
let blockedDevicesStore = [
  {
    _id: "blk_1",
    deviceId: "DEV-F8B2C4D1",
    ipAddress: "103.212.145.88",
    reason: "Scraping profile photos & bot automation",
    blockedBy: "Super Admin",
    blockedAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    status: "ACTIVE_BAN",
  },
];

/**
 * 1. GET /api/v1/admin/safety/reports
 * Flagged member abuse reports queue
 */
export const getSafetyReports = asyncHandler(async (req, res) => {
  const { status = "ALL", severity = "ALL" } = req.query;
  const page = Math.max(1, parseInt(req.query?.pageNo || req.query?.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query?.pageSize || req.query?.limit, 10) || 20));

  let filtered = [...safetyReportsStore];

  if (status && status !== "ALL") {
    filtered = filtered.filter((r) => r.status === status.toUpperCase());
  }

  if (severity && severity !== "ALL") {
    filtered = filtered.filter((r) => r.severity === severity.toUpperCase());
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const startIdx = (page - 1) * limit;
  const paginatedReports = filtered.slice(startIdx, startIdx + limit);

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Safety abuse reports queue retrieved successfully.",
    {
      total,
      pendingCount: safetyReportsStore.filter((r) => r.status === "PENDING").length,
      totalPages,
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
      reports: paginatedReports,
      list: paginatedReports,
    },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 2. PUT /api/v1/admin/safety/reports/:id/action
 * Apply safety action: WARN, SHADOWBAN, BLOCK, DISMISS
 */
export const takeSafetyReportAction = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { action, adminNotes = "" } = req.body;

  const upperAction = String(action || "").toUpperCase();
  const ALLOWED_ACTIONS = ["WARN", "SHADOWBAN", "BLOCK", "DISMISS"];

  if (!ALLOWED_ACTIONS.includes(upperAction)) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      `Validation Failed: Invalid action '${action}'. Allowed options: ${ALLOWED_ACTIONS.join(", ")}`,
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  const report = safetyReportsStore.find(
    (r) => r._id === id || r.reportId === id
  );

  if (!report) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_NOT_FOUND,
      `Abuse report with ID '${id}' not found.`,
      CONSTANTS.DATA_NULL,
      CONSTANTS.NOT_FOUND,
      CONSTANTS.ERROR_TRUE
    );
  }

  report.status = upperAction === "DISMISS" ? "DISMISSED" : "RESOLVED";
  report.resolution = {
    actionTaken: upperAction,
    adminNotes: adminNotes.trim(),
    actionedBy: req.user?.name || "Safety Officer",
    actionedAt: new Date().toISOString(),
  };

  report.actionHistory.push({
    action: upperAction,
    notes: adminNotes.trim(),
    staff: req.user?.name || "Safety Officer",
    timestamp: new Date().toISOString(),
  });

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    `Safety report ${report.reportId} resolved with action '${upperAction}'.`,
    report,
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 3. POST /api/v1/admin/safety/block-device
 * Hardware/IP ban for bad actors
 */
export const blockDeviceOrIp = asyncHandler(async (req, res) => {
  const { deviceId, ipAddress, reason = "", userId = "" } = req.body;

  if (!deviceId && !ipAddress) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "Validation Failed: At least one of 'deviceId' or 'ipAddress' must be provided.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  const newBan = {
    _id: `blk_${Date.now()}`,
    deviceId: deviceId || null,
    ipAddress: ipAddress || null,
    associatedUserId: userId || null,
    reason: reason.trim() || "Administrative security ban",
    blockedBy: req.user?.name || "Security Admin",
    blockedAt: new Date().toISOString(),
    status: "ACTIVE_BAN",
  };

  blockedDevicesStore.unshift(newBan);

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_CREATED,
    `Device/IP ban enacted successfully (${deviceId || ipAddress}).`,
    newBan,
    CONSTANTS.CREATED,
    CONSTANTS.ERROR_FALSE
  );
});
