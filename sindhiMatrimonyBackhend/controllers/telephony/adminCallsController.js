import { asyncHandler, apiHTTPResponse } from "../../utils/globalFunction.js";
import * as CONSTANTS from "../../utils/constants.js";
import { Lead } from "../../models/index.js";
import mongoose from "mongoose";

// Telephony call records store
let callLogsStore = [];

/**
 * 1. GET /api/v1/admin/calls
 * All call logs and audio records
 */
export const getCallLogs = asyncHandler(async (req, res) => {
  const { disposition = "ALL", staffId, search = "" } = req.query;

  let filtered = [...callLogsStore];

  if (disposition && disposition !== "ALL") {
    filtered = filtered.filter((c) => c.disposition === disposition.toUpperCase());
  }

  if (staffId) {
    filtered = filtered.filter((c) => c.callerStaffId === staffId);
  }

  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.candidateName?.toLowerCase().includes(s) ||
        c.phoneNumber?.includes(s) ||
        c.callId?.toLowerCase().includes(s) ||
        c.leadId?.toLowerCase().includes(s)
    );
  }

  const page = Math.max(1, parseInt(req.query?.pageNo || req.query?.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query?.pageSize || req.query?.limit, 10) || 20));

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const startIdx = (page - 1) * limit;
  const paginatedCalls = filtered.slice(startIdx, startIdx + limit);

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Call logs retrieved successfully.",
    {
      total,
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
      calls: paginatedCalls,
      list: paginatedCalls,
    },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 2. POST /api/v1/admin/calls/log
 * Record telephony outcome
 */
export const logCallOutcome = asyncHandler(async (req, res) => {
  const {
    leadId,
    candidateProfileId,
    candidateName = "Candidate",
    phoneNumber,
    disposition = "CONNECTED",
    durationSeconds = 0,
    notes = "",
    nextFollowUpDate,
    recordingUrl = null,
  } = req.body;

  const cleanPhone = String(phoneNumber || "").replace(/\D/g, "");
  if (!cleanPhone || cleanPhone.length < 10) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "Validation Failed: 'phoneNumber' must be a valid 10-digit number.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  const ALLOWED_DISPOSITIONS = [
    "CONNECTED",
    "NOT_ANSWERED",
    "BUSY",
    "CALLBACK_REQUESTED",
    "INVALID_NUMBER",
    "DECLINED_CALL",
  ];
  const upperDisp = disposition.toUpperCase();
  if (!ALLOWED_DISPOSITIONS.includes(upperDisp)) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      `Validation Failed: Invalid disposition '${disposition}'. Allowed: ${ALLOWED_DISPOSITIONS.join(", ")}`,
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  const durationNum = Number(durationSeconds) || 0;
  const mins = Math.floor(durationNum / 60);
  const secs = durationNum % 60;
  const durationFormatted = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;

  const staffName = req.user?.fullName || req.user?.name || "Staff Matchmaker";
  const staffId = req.user?.id || req.user?._id || "staff_001";
  const now = new Date().toISOString();
  const callId = `CL-${900 + callLogsStore.length + 1}`;

  const newLog = {
    _id: `call_${Date.now()}`,
    callId,
    leadId: leadId || null,
    candidateProfileId: candidateProfileId || null,
    candidateName,
    phoneNumber: `+91 ${cleanPhone.slice(-10)}`,
    callerStaffId: staffId,
    callerStaffName: staffName,
    direction: "OUTBOUND",
    disposition: upperDisp,
    durationSeconds: durationNum,
    durationFormatted,
    notes: notes.trim(),
    recordingUrl,
    calledAt: now,
  };

  callLogsStore.unshift(newLog);

  // If tied to lead, update MongoDB Lead last contacted timestamp & timeline
  if (leadId && mongoose.connection.readyState === 1) {
    try {
      const query = mongoose.Types.ObjectId.isValid(leadId) ? { _id: leadId } : { leadId };
      const updateDoc = {
        lastContactedAt: new Date(),
        $push: {
          timeline: {
            event: "CALL_LOGGED",
            description: `[Call Logged: ${upperDisp} (${durationFormatted})] ${notes}`,
            performedBy: staffName,
            timestamp: new Date(),
          },
        },
      };
      if (nextFollowUpDate) {
        updateDoc.nextFollowUp = new Date(nextFollowUpDate);
      }
      await Lead.findOneAndUpdate(query, updateDoc);
    } catch {}
  }

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_CREATED,
    `Telephony call outcome logged successfully (${newLog.callId}).`,
    newLog,
    CONSTANTS.CREATED,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 3. GET /api/v1/admin/calls/analytics
 * Call duration & disposition rates
 */
export const getCallAnalytics = asyncHandler(async (req, res) => {
  const totalCalls = callLogsStore.length;
  const connectedCalls = callLogsStore.filter((c) => c.disposition === "CONNECTED").length;
  const notAnswered = callLogsStore.filter((c) => c.disposition === "NOT_ANSWERED").length;
  const busy = callLogsStore.filter((c) => c.disposition === "BUSY").length;
  const callbackReq = callLogsStore.filter((c) => c.disposition === "CALLBACK_REQUESTED").length;

  const totalDuration = callLogsStore.reduce((acc, c) => acc + (c.durationSeconds || 0), 0);
  const avgDurationSeconds = connectedCalls > 0 ? Math.round(totalDuration / connectedCalls) : 0;

  const connectRate = totalCalls > 0 ? `${((connectedCalls / totalCalls) * 100).toFixed(1)}%` : "0%";

  const dispositionBreakdown = [
    { disposition: "CONNECTED", count: connectedCalls, percentage: totalCalls > 0 ? ((connectedCalls / totalCalls) * 100).toFixed(1) : 0 },
    { disposition: "NOT_ANSWERED", count: notAnswered, percentage: totalCalls > 0 ? ((notAnswered / totalCalls) * 100).toFixed(1) : 0 },
    { disposition: "BUSY", count: busy, percentage: totalCalls > 0 ? ((busy / totalCalls) * 100).toFixed(1) : 0 },
    { disposition: "CALLBACK_REQUESTED", count: callbackReq, percentage: totalCalls > 0 ? ((callbackReq / totalCalls) * 100).toFixed(1) : 0 },
  ];

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Telephony call analytics retrieved successfully.",
    {
      totalCalls,
      totalDurationSeconds: totalDuration,
      averageTalkTimeSeconds: avgDurationSeconds,
      connectRate,
      dispositionBreakdown,
    },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});
