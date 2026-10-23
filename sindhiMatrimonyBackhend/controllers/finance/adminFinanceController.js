import { asyncHandler, apiHTTPResponse } from "../../utils/globalFunction.js";
import * as CONSTANTS from "../../utils/constants.js";
import { findProfileByIdInMemory } from "../../services/realDataService.js";

// Offline payment transactions store
let offlinePaymentsStore = [];

// Customer refunds queue store
let refundRequestsStore = [
  {
    _id: "ref_101",
    refundId: "REF-101",
    userId: "SM10018",
    candidateName: "Deepak Mirchandani",
    originalPaymentId: "PAY_RAZOR_98213",
    planName: "Sindhi Royal Elite",
    amount: 15000,
    requestReason: "Found life partner through personal family referral within 3 days of upgrade.",
    status: "PENDING_APPROVAL",
    requestedAt: new Date(Date.now() - 3600000 * 20).toISOString(),
  },
  {
    _id: "ref_102",
    refundId: "REF-102",
    userId: "SM10025",
    candidateName: "Rakesh Nagdev",
    originalPaymentId: "PAY_RAZOR_99411",
    planName: "Sindhi Premium Gold",
    amount: 9999,
    requestReason: "Double charged due to bank network timeout on Razorpay.",
    status: "PENDING_APPROVAL",
    requestedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
];

/**
 * 1. POST /api/v1/admin/finance/offline-payment
 * Manual cash/bank transfer receipting
 */
export const recordOfflinePayment = asyncHandler(async (req, res) => {
  const {
    userId,
    profileId,
    planId = "plan_royal_3",
    amount,
    paymentMode = "BANK_TRANSFER",
    referenceNumber = "",
    receiptNumber = "",
    notes = "",
  } = req.body;

  const targetId = userId || profileId;
  if (!targetId) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "Validation Failed: 'userId' or 'profileId' is required.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  const numAmount = Number(amount);
  if (!numAmount || isNaN(numAmount) || numAmount <= 0) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "Validation Failed: 'amount' must be a valid positive number.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  const ALLOWED_MODES = ["CASH", "BANK_TRANSFER", "CHEQUE", "UPI_QR", "NEFT_RTGS", "POS_SWIPE"];
  const upperMode = paymentMode.toUpperCase();
  if (!ALLOWED_MODES.includes(upperMode)) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      `Validation Failed: Invalid paymentMode '${paymentMode}'. Allowed: ${ALLOWED_MODES.join(", ")}`,
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  const candidate = findProfileByIdInMemory(targetId) || {
    name: "Registered Candidate",
    candidateId: targetId,
  };

  const receiptId = receiptNumber || `RCP-${Date.now().toString().slice(-6)}`;
  const txnId = `TXN-OFFLINE-${Date.now()}`;
  const now = new Date().toISOString();

  const newOfflinePayment = {
    _id: `pay_off_${Date.now()}`,
    transactionId: txnId,
    receiptNumber: receiptId,
    candidateId: candidate.candidateId || targetId,
    candidateName: candidate.name,
    planId,
    amount: numAmount,
    currency: "INR",
    paymentMode: upperMode,
    referenceNumber: referenceNumber.trim() || `REF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    status: "SUCCESS",
    verifiedBy: req.user?.name || "Accounts Executive",
    notes: notes.trim(),
    membershipStatus: "ACTIVATED",
    membershipExpiresAt: new Date(Date.now() + 180 * 24 * 3600000).toISOString(),
    createdAt: now,
  };

  offlinePaymentsStore.unshift(newOfflinePayment);

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_CREATED,
    `Offline payment of ₹${numAmount.toLocaleString()} recorded. Receipt ${receiptId} issued.`,
    newOfflinePayment,
    CONSTANTS.CREATED,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 2. POST /api/v1/admin/finance/refunds/:id/action
 * Approve or decline customer refund
 */
export const actionRefundRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { action, reason = "", refundTransactionId } = req.body;

  const upperAction = String(action || "").toUpperCase();
  if (!["APPROVE", "DECLINE"].includes(upperAction)) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "Validation Failed: 'action' must be either 'APPROVE' or 'DECLINE'.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  const refund = refundRequestsStore.find(
    (r) => r._id === id || r.refundId === id
  );

  if (!refund) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_NOT_FOUND,
      `Refund request with ID '${id}' not found.`,
      CONSTANTS.DATA_NULL,
      CONSTANTS.NOT_FOUND,
      CONSTANTS.ERROR_TRUE
    );
  }

  refund.status = upperAction === "APPROVE" ? "APPROVED" : "DECLINED";
  refund.actionDetails = {
    action: upperAction,
    actionedBy: req.user?.name || "Finance Admin",
    reason: reason.trim(),
    refundTransactionId: refundTransactionId || (upperAction === "APPROVE" ? `RFND_TXN_${Date.now()}` : null),
    processedAt: new Date().toISOString(),
  };

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    `Refund request ${refund.refundId} has been ${upperAction === "APPROVE" ? "approved" : "declined"}.`,
    refund,
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});
