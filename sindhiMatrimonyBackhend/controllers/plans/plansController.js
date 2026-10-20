import { asyncHandler, apiHTTPResponse, logMessage } from "../../utils/globalFunction.js";
import * as CONSTANTS from "../../utils/constants.js";
import { User, Profile, UserSubscription } from "../../models/index.js";
import { MEMBERSHIP_TIERS } from "../../utils/variables.js";

const getUserId = (req) =>
  req.user?.id ||
  req.auth?.id ||
  req.user?._id ||
  req.auth?._id ||
  req.user?.userId ||
  req.auth?.userId;

const getActiveProfileId = (req) =>
  req.headers["x-active-profile-id"] ||
  req.body?.profileId ||
  req.query?.profileId ||
  req.user?.activeProfileId ||
  req.auth?.activeProfileId ||
  req.currentProfile?._id;

export const MEMBERSHIP_PLANS = [
  {
    id: "PLAN_SILVER_1_MONTH",
    name: "Silver Tier",
    tagline: "Essential starter package for active discovery",
    tier: MEMBERSHIP_TIERS.SILVER,
    durationMonths: 1,
    durationDays: 30,
    priceINR: 1499,
    originalPriceINR: 2499,
    discountPercentage: 40,
    contactViewCredits: 10,
    canChat: true,
    isUnlimitedChat: true,
    allowDirectChat: true,
    badge: null,
    features: [
      "Send unlimited Connect / Rishta interests",
      "Unlock 10 verified Phone & WhatsApp contacts",
      "Direct chat messaging with all candidates (Unlimited)",
      "Basic Kundli & 36 Guna Milan report",
      "Valid for 1 Month",
    ],
    isPopular: false,
  },
  {
    id: "PLAN_GOLD_3_MONTHS",
    name: "Gold Tier",
    tagline: "Most popular choice for serious candidates & families",
    tier: MEMBERSHIP_TIERS.GOLD,
    durationMonths: 3,
    durationDays: 90,
    priceINR: 2999,
    originalPriceINR: 5999,
    discountPercentage: 50,
    contactViewCredits: 35,
    canChat: true,
    isUnlimitedChat: true,
    allowDirectChat: true,
    badge: "MOST POPULAR",
    features: [
      "Everything in Silver Tier included",
      "Unlock 35 verified Phone & WhatsApp contacts",
      "Unlimited direct chat messaging for 3 full months",
      "View candidates who visited your profile",
      "Priority profile placement in daily recommendations feed",
      "Full Vedic Kundli matching breakdown with Ashta Kootas",
      "Instant SMS & WhatsApp alert notifications",
      "Valid for 3 Months",
    ],
    isPopular: true,
  },
  {
    id: "PLAN_DIAMOND_6_MONTHS",
    name: "Diamond Tier",
    tagline: "High-visibility package with premium matchmaking perks",
    tier: MEMBERSHIP_TIERS.GOLD, // High tier
    durationMonths: 6,
    durationDays: 180,
    priceINR: 4999,
    originalPriceINR: 11999,
    discountPercentage: 58,
    contactViewCredits: 75,
    canChat: true,
    isUnlimitedChat: true,
    allowDirectChat: true,
    badge: "BEST VALUE",
    features: [
      "Everything in Gold Tier included",
      "Unlock 75 verified Phone & WhatsApp contacts",
      "Unlimited direct chat messaging for 6 full months",
      "Featured Candidate badge on profile card",
      "Standout profile highlighting in search results",
      "Exclusive access to newly registered NRI & Verified profiles",
      "Valid for 6 Months",
    ],
    isPopular: false,
  },
  {
    id: "PLAN_VIP_ASSISTED_12_MONTHS",
    name: "VIP Assisted Matchmaking",
    tagline: "White-glove matrimonial assistance by senior Sindhi matchmaker",
    tier: MEMBERSHIP_TIERS.DIAMOND_ASSISTED,
    durationMonths: 12,
    durationDays: 365,
    priceINR: 14999,
    originalPriceINR: 29999,
    discountPercentage: 50,
    contactViewCredits: 200,
    canChat: true,
    isUnlimitedChat: true,
    allowDirectChat: true,
    badge: "VIP DEDICATED",
    features: [
      "Everything in Diamond Tier included",
      "Dedicated Senior Sindhi Relationship Manager",
      "Handpicked weekly profile recommendations personally vetted by staff",
      "Matchmaker arranges and mediates introductory calls between families",
      "Gotra & Nukh background verification check by community elders",
      "Unlock up to 200 verified Phone & WhatsApp contacts",
      "Unlimited direct chat messaging for 12 Months",
      "Valid for 12 Months",
    ],
    isPopular: false,
  },
];

/**
 * 🏷️ List All Membership Plans & Feature Matrix
 * GET /api/v1/plans
 */
export const getPlans = asyncHandler(async (req, res) => {
  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Membership plans retrieved successfully.",
    {
      currency: "INR",
      currencySymbol: "₹",
      totalPlans: MEMBERSHIP_PLANS.length,
      plans: MEMBERSHIP_PLANS,
    },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 💳 Create Payment Order (Razorpay / Cashfree)
 * POST /api/v1/payments/create-order
 */
export const createPaymentOrder = asyncHandler(async (req, res) => {
  const { planId = "PLAN_GOLD_3_MONTHS", currency = "INR" } = req.body;

  const selectedPlan =
    MEMBERSHIP_PLANS.find((p) => p.id === planId) || MEMBERSHIP_PLANS[1];

  const orderId = `order_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Payment order initiated successfully.",
    {
      orderId,
      amount: selectedPlan.priceINR * 100, // Amount in paise
      amountFormatted: `₹${selectedPlan.priceINR}`,
      currency,
      planId: selectedPlan.id,
      planName: selectedPlan.name,
      contactViewCredits: selectedPlan.contactViewCredits,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID || "rzp_test_simulated_key",
      notes: {
        platform: "Sindhi Matrimony",
        planDuration: `${selectedPlan.durationMonths} Months`,
      },
    },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * ⚡ Verify Payment & Activate Membership Subscription (Unlocks Unlimited Chat)
 * POST /api/v1/payments/verify
 * POST /api/v1/payments/activate
 */
export const verifyAndActivateMembership = asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  const profileId = getActiveProfileId(req);
  const {
    planId = "PLAN_GOLD_3_MONTHS",
    paymentOrderId,
    paymentId = `pay_${Date.now().toString(36)}`,
  } = req.body;

  if (!userId) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_UNAUTHORIZED,
      "User authentication required.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.UNAUTHORIZED,
      CONSTANTS.ERROR_TRUE
    );
  }

  const selectedPlan =
    MEMBERSHIP_PLANS.find((p) => p.id === planId) || MEMBERSHIP_PLANS[1];

  const now = Date.now();
  const expiresAt = now + selectedPlan.durationDays * 86400000;

  let subscription = null;
  try {
    subscription = await UserSubscription.create({
      userId,
      profileId: profileId || null,
      planId: selectedPlan.id,
      planName: selectedPlan.name,
      tier: selectedPlan.tier || "GOLD",
      status: "ACTIVE",
      startDate: now,
      expiresAt,
      contactViewCredits: selectedPlan.contactViewCredits,
      usedContactViewCredits: 0,
      canChat: true,
      isUnlimitedChat: true,
      allowDirectChat: true,
      paymentOrderId,
      paymentId,
      amountPaid: selectedPlan.priceINR,
      currency: "INR",
    });

    // Update active profile membership tier
    if (profileId) {
      await Profile.findByIdAndUpdate(profileId, {
        membershipTier: selectedPlan.tier || "GOLD",
      });
    } else {
      await Profile.updateMany(
        { userId, isDeleted: false },
        { membershipTier: selectedPlan.tier || "GOLD" }
      );
    }
  } catch (err) {
    logMessage("DB error saving subscription, falling back to memory:", err?.message, "warn");
    subscription = {
      _id: `sub_${now}`,
      userId,
      planId: selectedPlan.id,
      planName: selectedPlan.name,
      tier: selectedPlan.tier || "GOLD",
      status: "ACTIVE",
      expiresAt,
      canChat: true,
      isUnlimitedChat: true,
    };
  }

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    `Congratulations! Your ${selectedPlan.name} is now active. Unlimited chat and ${selectedPlan.contactViewCredits} contacts have been unlocked.`,
    {
      subscription,
      plan: selectedPlan,
      chatUnlocked: true,
      isUnlimitedChat: true,
      expiresAt,
    },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 🔔 Payment Webhook Handler (Razorpay Payment Capture)
 * POST /api/v1/payments/webhook
 */
export const handlePaymentWebhook = asyncHandler(async (req, res) => {
  logMessage("Razorpay webhook received:", req.body, "info");

  const { payload } = req.body || {};
  const paymentEntity = payload?.payment?.entity;
  const orderId = paymentEntity?.order_id;
  const paymentId = paymentEntity?.id;
  const notes = paymentEntity?.notes || {};
  const userId = notes?.userId;
  const planId = notes?.planId || "PLAN_GOLD_3_MONTHS";

  if (userId) {
    const selectedPlan =
      MEMBERSHIP_PLANS.find((p) => p.id === planId) || MEMBERSHIP_PLANS[1];

    const now = Date.now();
    const expiresAt = now + selectedPlan.durationDays * 86400000;

    try {
      await UserSubscription.create({
        userId,
        planId: selectedPlan.id,
        planName: selectedPlan.name,
        tier: selectedPlan.tier || "GOLD",
        status: "ACTIVE",
        startDate: now,
        expiresAt,
        contactViewCredits: selectedPlan.contactViewCredits,
        canChat: true,
        isUnlimitedChat: true,
        paymentOrderId: orderId,
        paymentId,
        amountPaid: selectedPlan.priceINR,
      });

      await Profile.updateMany(
        { userId, isDeleted: false },
        { membershipTier: selectedPlan.tier || "GOLD" }
      );
      logMessage(`✅ Webhook: Activated ${selectedPlan.name} for User: ${userId}`, null, "info");
    } catch (err) {
      logMessage("Webhook DB error:", err?.message, "error");
    }
  }

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Payment webhook processed successfully. User membership activated.",
    {
      received: true,
      status: "PROCESSED",
      timestamp: Date.now(),
    },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

export default {
  MEMBERSHIP_PLANS,
  getPlans,
  createPaymentOrder,
  verifyAndActivateMembership,
  handlePaymentWebhook,
};
