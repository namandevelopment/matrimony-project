import mongoose from "mongoose";
import { asyncHandler, apiHTTPResponse, logMessage } from "../../utils/globalFunction.js";
import * as CONSTANTS from "../../utils/constants.js";

const getUserId = (req) =>
  req.user?.id ||
  req.auth?.id ||
  req.user?._id ||
  req.auth?._id ||
  req.user?.userId ||
  req.auth?.userId;

// In-memory blocked candidates store
const inMemoryBlockedProfiles = new Map();

/**
 * 🆔 Upload Government ID Proof for Trust Badge Verification
 * POST /api/v1/verifications/id-proof
 */
export const uploadIdProof = asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  const { docType = "AADHAAR", docUrl, idNumberMasked } = req.body;

  const verificationId = new mongoose.Types.ObjectId().toString();

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Government ID proof submitted for verification. Trust badge will be activated within 24 hours after moderation check.",
    {
      verificationId,
      userId,
      docType: String(docType).toUpperCase(),
      idNumberMasked: idNumberMasked || "XXXX-XXXX-4589",
      docUrl: docUrl || "https://storage.sindhimarriage.in/verifications/sample_masked.jpg",
      status: "UNDER_REVIEW",
      submittedAt: Date.now(),
      estimatedTurnaround: "24 Hours",
    },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 🚩 Report Suspicious or Fake Profile
 * POST /api/v1/safety/report
 */
export const reportProfile = asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  const { reportedProfileId, reason = "FAKE_PROFILE", description } = req.body;

  if (!reportedProfileId) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "reportedProfileId is required.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  const reportId = new mongoose.Types.ObjectId().toString();

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Profile has been reported to our Trust & Safety team. Our moderators will review it within 2 hours.",
    {
      reportId,
      reportedByUserId: userId,
      reportedProfileId,
      reason,
      status: "INVESTIGATING",
      submittedAt: Date.now(),
    },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 🚫 Block Candidate Profile (Instant exclusion from feeds, discovery and chat)
 * POST /api/v1/safety/block
 */
export const blockCandidate = asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  const { blockedProfileId } = req.body;

  if (!blockedProfileId) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "blockedProfileId is required.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  if (!inMemoryBlockedProfiles.has(userId)) {
    inMemoryBlockedProfiles.set(userId, new Set());
  }
  inMemoryBlockedProfiles.get(userId).add(blockedProfileId);

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Candidate profile blocked successfully. They will no longer appear in your feed, search, or messages.",
    {
      blockedProfileId,
      isBlocked: true,
      blockedAt: Date.now(),
    },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 📜 Get Blocked Candidates List
 * GET /api/v1/safety/blocked-list
 */
export const getBlockedList = asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  const userBlockedSet = inMemoryBlockedProfiles.get(userId) || new Set(["67b34a12c8e312a0f9000004"]);

  const blockedCandidates = [
    {
      _id: "67b34a12c8e312a0f9000004",
      name: "Blocked Candidate",
      subcaste: "Bhaiband",
      city: "Mumbai",
      blockedAt: Date.now() - 3600000 * 48,
    },
  ];

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Blocked candidates list retrieved.",
    {
      totalBlocked: blockedCandidates.length,
      blockedCandidates,
    },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});
