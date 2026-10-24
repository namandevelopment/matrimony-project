import mongoose from "mongoose";
import { asyncHandler, apiHTTPResponse, logMessage, cleanEntity } from "../../utils/globalFunction.js";
import * as CONSTANTS from "../../utils/constants.js";
import { SEED_MATCH_CANDIDATES } from "./matchmakingController.js";
import { SEED_INTERESTS } from "../../constants/seedCandidateData.js";
import { addNotification } from "../notifications/notificationController.js";
import { findProfileByIdInMemory } from "../../services/realDataService.js";

const getUserId = (req) =>
  req.user?.id ||
  req.auth?.id ||
  req.user?._id ||
  req.auth?._id ||
  req.user?.userId ||
  req.auth?.userId;

// In-memory interest clearinghouse store
const inMemoryInterests = new Map();
export const sentInterestReceiverIds = new Set();

export const isInterestSentToCandidate = (candidateId, userId) => {
  if (!candidateId) return false;
  const idStr = candidateId.toString();
  const cand = findProfileByIdInMemory(idStr);
  const allIds = [idStr];
  if (cand?._id) allIds.push(cand._id.toString());
  if (cand?.matrimonyId) allIds.push(cand.matrimonyId.toString());
  if (cand?.userId) allIds.push(cand.userId.toString());

  for (const id of allIds) {
    if (sentInterestReceiverIds.has(id)) return true;
  }
  for (const item of inMemoryInterests.values()) {
    if (item.direction === "SENT") {
      const recId = item.receiverProfileId || item.receiverProfile?._id;
      if (recId && allIds.includes(recId.toString())) {
        return true;
      }
    }
  }
  return false;
};

// Initialize initial seed interests from realistic dataset
SEED_INTERESTS.forEach((item) => inMemoryInterests.set(item._id, { ...item }));

/**
 * 💌 Send Interest / Express Rishta Connect
 * POST /api/v1/matchmaking/interests/send
 */
export const sendInterest = asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  const targetId = req.body?.receiverProfileId || req.body?.receiverCandidateId || req.body?.candidateId;
  const personalizedNote = req.body?.personalizedNote || req.body?.message;

  if (!targetId) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "receiverProfileId or candidateId is required to send interest.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  const idStr = targetId.toString();
  const cand = findProfileByIdInMemory(idStr);
  const allIds = [idStr];
  if (cand?._id) allIds.push(cand._id.toString());
  if (cand?.matrimonyId) allIds.push(cand.matrimonyId.toString());
  if (cand?.userId) allIds.push(cand.userId.toString());

  const isAlreadySent = isInterestSentToCandidate(idStr, userId);

  if (isAlreadySent) {
    allIds.forEach((id) => sentInterestReceiverIds.delete(id));
    for (const [key, item] of inMemoryInterests.entries()) {
      if (
        item.direction === "SENT" &&
        (allIds.includes(item.receiverProfileId) || (item.receiverProfile?._id && allIds.includes(item.receiverProfile._id)))
      ) {
        inMemoryInterests.delete(key);
      }
    }

    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_OK,
      "Interest withdrawn successfully.",
      {
        sendIntrestSended: false,
        candidateId: idStr,
      },
      CONSTANTS.OK,
      CONSTANTS.ERROR_FALSE
    );
  }

  allIds.forEach((id) => sentInterestReceiverIds.add(id));
  const interestId = new mongoose.Types.ObjectId().toString();
  const targetCandidate = cand || SEED_MATCH_CANDIDATES.find((c) => c._id === idStr);

  const newInterest = {
    _id: interestId,
    senderUserId: userId,
    senderProfileId: req.user?.activeProfileId || "my_active_profile",
    receiverProfileId: idStr,
    receiverProfile: targetCandidate
      ? {
          _id: targetCandidate._id || idStr,
          name: targetCandidate.name,
          age: targetCandidate.age,
          subcaste: targetCandidate.subcaste,
          city: targetCandidate.location?.city || "Mumbai",
          profession: targetCandidate.profession?.occupation || "Professional",
          avatar: targetCandidate.avatar,
        }
      : null,
    personalizedNote: personalizedNote || "Namaste, we liked your profile and would love to connect.",
    status: "PENDING",
    direction: "SENT",
    sentAt: Date.now(),
  };

  inMemoryInterests.set(interestId, newInterest);

  // Also record received interest for receiver's inbox
  const receivedInterestId = `rec_${interestId}`;
  inMemoryInterests.set(receivedInterestId, {
    _id: receivedInterestId,
    senderUserId: userId,
    senderProfileId: req.user?.activeProfileId || userId || "my_active_profile",
    senderProfile: {
      _id: userId || "my_active_profile",
      name: req.user?.name || "Sindhi Member",
      city: req.user?.location?.city || "Mumbai",
      profession: req.user?.profession || "Professional",
      avatar: req.user?.avatar || "",
    },
    receiverProfileId: idStr,
    receiverUserId: idStr,
    personalizedNote: personalizedNote || "Namaste, we liked your profile and would love to connect.",
    status: "PENDING",
    direction: "RECEIVED",
    sentAt: Date.now(),
  });

  // Dispatch in-app notification for receiver
  addNotification({
    _id: `notif_${Date.now()}`,
    type: "INTEREST_RECEIVED",
    title: "New Rishta Connect Request 💌",
    body: `${req.user?.name || "A member"} expressed interest in your profile.`,
    data: { candidateId: idStr, interestId, receiverProfileId: idStr },
    avatar: req.user?.avatar || "",
    isRead: false,
    createdAt: Date.now(),
  });

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Connect interest sent successfully.",
    {
      interestId,
      sendIntrestSended: true,
      candidateId: idStr,
      status: "PENDING",
      sentAt: newInterest.sentAt,
    },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * ✅ Accept Interest
 * PUT /api/v1/matchmaking/interests/:interestId/accept
 */
export const acceptInterest = asyncHandler(async (req, res) => {
  const { interestId } = req.params;

  let interest = inMemoryInterests.get(interestId);
  if (!interest) {
    interest = {
      _id: interestId,
      status: "ACCEPTED",
      respondedAt: Date.now(),
    };
    inMemoryInterests.set(interestId, interest);
  } else {
    interest.status = "ACCEPTED";
    interest.respondedAt = Date.now();
  }

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Interest accepted! Contact details and direct messaging unlocked.",
    {
      interestId,
      status: "ACCEPTED",
      chatUnlocked: true,
      contactUnlocked: true,
      respondedAt: Date.now(),
    },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * ❌ Decline Interest
 * PUT /api/v1/matchmaking/interests/:interestId/decline
 */
export const declineInterest = asyncHandler(async (req, res) => {
  const { interestId } = req.params;

  let interest = inMemoryInterests.get(interestId);
  if (!interest) {
    interest = {
      _id: interestId,
      status: "DECLINED",
      respondedAt: Date.now(),
    };
    inMemoryInterests.set(interestId, interest);
  } else {
    interest.status = "DECLINED";
    interest.respondedAt = Date.now();
  }

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Interest declined politely.",
    {
      interestId,
      status: "DECLINED",
      respondedAt: Date.now(),
    },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 📥 Get Received Interests List
 * GET /api/v1/matchmaking/interests/received?status=PENDING&page=1&limit=20&search=...
 */

export const getReceivedInterests = asyncHandler(async (req, res) => {
  const { status = "ALL", page = 1, limit = 20, search = "" } = req.query;

  let list = Array.from(inMemoryInterests.values()).filter(i => i.direction !== "SENT");
  if (status && status !== "ALL") {
    list = list.filter((i) => i.status.toUpperCase() === String(status).toUpperCase());
  }

  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    list = list.filter((i) => {
      const p = i.senderProfile || {};
      return (
        p.name?.toLowerCase().includes(q) ||
        p.subcaste?.toLowerCase().includes(q) ||
        p.city?.toLowerCase().includes(q) ||
        p.profession?.toLowerCase().includes(q) ||
        i.personalizedNote?.toLowerCase().includes(q)
      );
    });
  }

  // Sort by sentAt descending
  list.sort((a, b) => (b.sentAt || 0) - (a.sentAt || 0));

  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.min(50, Math.max(1, Number(limit) || 20));
  const startIdx = (pageNum - 1) * limitNum;
  const paginated = list.slice(startIdx, startIdx + limitNum);

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Received interests retrieved successfully.",
    {
      status,
      totalReceived: list.length,
      totalPages: Math.ceil(list.length / limitNum),
      page: pageNum,
      limit: limitNum,
      interests: paginated,
    },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 📤 Get Sent Interests List & Tracking
 * GET /api/v1/matchmaking/interests/sent?status=ALL&page=1&limit=20&search=...
 */
export const getSentInterests = asyncHandler(async (req, res) => {
  const { status = "ALL", page = 1, limit = 20, search = "" } = req.query;

  let sentList = Array.from(inMemoryInterests.values()).filter(i => i.direction === "SENT");
  if (status && status !== "ALL") {
    sentList = sentList.filter((i) => i.status.toUpperCase() === String(status).toUpperCase());
  }

  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    sentList = sentList.filter((i) => {
      const p = i.receiverProfile || {};
      return (
        p.name?.toLowerCase().includes(q) ||
        p.subcaste?.toLowerCase().includes(q) ||
        p.city?.toLowerCase().includes(q) ||
        p.profession?.toLowerCase().includes(q) ||
        i.personalizedNote?.toLowerCase().includes(q)
      );
    });
  }

  // Sort by sentAt descending
  sentList.sort((a, b) => (b.sentAt || 0) - (a.sentAt || 0));

  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.min(50, Math.max(1, Number(limit) || 20));
  const startIdx = (pageNum - 1) * limitNum;
  const paginated = sentList.slice(startIdx, startIdx + limitNum);

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Sent interests tracking retrieved successfully.",
    {
      status,
      totalSent: sentList.length,
      totalPages: Math.ceil(sentList.length / limitNum),
      page: pageNum,
      limit: limitNum,
      interests: paginated,
    },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * ⏰ Send Reminder for Pending Sent Interest
 * PUT /api/v1/matchmaking/interests/:interestId/remind
 */
export const remindInterest = asyncHandler(async (req, res) => {
  const { interestId } = req.params;
  const interest = inMemoryInterests.get(interestId);
  if (interest) {
    interest.remindedAt = Date.now();
  }
  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Reminder sent to member successfully.",
    { interestId, remindedAt: Date.now() },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 🗑️ Cancel Sent Interest
 * DELETE /api/v1/matchmaking/interests/:interestId/cancel
 */
export const cancelInterest = asyncHandler(async (req, res) => {
  const { interestId } = req.params;
  inMemoryInterests.delete(interestId);
  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Interest withdrawn successfully.",
    { interestId },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 🔔 Interests Badge Counter (Provides counts for both top header and all sidebar filter tabs)
 * GET /api/v1/matchmaking/interests/badge-count
 */
export const getInterestsBadgeCount = asyncHandler(async (req, res) => {
  const allReceived = Array.from(inMemoryInterests.values()).filter((i) => i.direction !== "SENT");
  const allSent = Array.from(inMemoryInterests.values()).filter((i) => i.direction === "SENT");

  const received = {
    all: allReceived.length,
    pending: allReceived.filter((i) => i.status === "PENDING").length,
    accepted: allReceived.filter((i) => i.status === "ACCEPTED").length,
    declined: allReceived.filter((i) => i.status === "DECLINED").length,
  };

  const sent = {
    all: allSent.length,
    pending: allSent.filter((i) => i.status === "PENDING").length,
    accepted: allSent.filter((i) => i.status === "ACCEPTED").length,
    declined: allSent.filter((i) => i.status === "DECLINED").length,
  };

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Interests badge count retrieved.",
    {
      received,
      sent,
      pendingCount: received.pending,
      acceptedCount: received.accepted,
      totalUnread: received.pending,
    },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});
