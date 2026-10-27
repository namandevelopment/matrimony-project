import { asyncHandler, apiHTTPResponse } from "../../utils/globalFunction.js";
import * as CONSTANTS from "../../utils/constants.js";
import { IN_MEMORY_LEADS, STAFF_EMPLOYEES } from "../../services/realDataService.js";

// Telephony call records store
let callLogsStore = [
  {
    _id: "call_901",
    callId: "CL-901",
    leadId: "LD-1501",
    candidateName: "Kunal Ahuja",
    phoneNumber: "+91 9820011223",
    callerStaffId: "staff_002",
    callerStaffName: "Pooja Advani",
    direction: "OUTBOUND",
    disposition: "CONNECTED",
    durationSeconds: 245,
    durationFormatted: "4m 5s",
    notes: "Detailed consultation completed. Candidate approved proposal for Simran Chandnani.",
    recordingUrl: "https://s3.ap-south-1.amazonaws.com/sindhi-matrimony-calls/rec_901.mp3",
    calledAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    _id: "call_902",
    callId: "CL-902",
    leadId: "LD-1502",
    candidateName: "Simran Chandnani",
    phoneNumber: "+91 9820022334",
    callerStaffId: "staff_002",
    callerStaffName: "Pooja Advani",
    direction: "OUTBOUND",
    disposition: "CONNECTED",
    durationSeconds: 180,
    durationFormatted: "3m 0s",
    notes: "Spoke to candidate's mother. Positive feedback on Kunal's bio-data. Family conference planned.",
    recordingUrl: "https://s3.ap-south-1.amazonaws.com/sindhi-matrimony-calls/rec_902.mp3",
    calledAt: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
  {
    _id: "call_903",
    callId: "CL-903",
    leadId: "LD-1503",
    candidateName: "Rohan Advani",
    phoneNumber: "+91 9820033445",
    callerStaffId: "staff_001",
    callerStaffName: "Rajesh Vazirani",
    direction: "OUTBOUND",
    disposition: "NOT_ANSWERED",
    durationSeconds: 0,
    durationFormatted: "0s",
    notes: "Ringing no answer. Auto-scheduled callback in 3 hours.",
    recordingUrl: null,
    calledAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    _id: "call_904",
    callId: "CL-904",
    leadId: "LD-1504",
    candidateName: "Ananya Wadhwa",
    phoneNumber: "+91 9820044556",
    callerStaffId: "staff_003",
    callerStaffName: "Deepak Mirchandani",
    direction: "OUTBOUND",
    disposition: "BUSY",
    durationSeconds: 0,
    durationFormatted: "0s",
    notes: "Line busy. Sent WhatsApp nudge.",
    recordingUrl: null,
    calledAt: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
];

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

  const staffName = req.user?.name || req.user?.fullName || "Staff Matchmaker";
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

  // If tied to lead, update lead's last contacted timestamp & notes
  if (leadId) {
    const lead = IN_MEMORY_LEADS.find((l) => l._id === leadId || l.leadId === leadId);
    if (lead) {
      lead.lastContactedAt = now;
      if (nextFollowUpDate) {
        lead.nextFollowUp = new Date(nextFollowUpDate).toISOString();
      }
      lead.notes.unshift({
        _id: `note_call_${Date.now()}`,
        noteText: `[Call Logged: ${upperDisp} (${durationFormatted})] ${notes}`,
        author: staffName,
        createdAt: now,
      });
    }
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
