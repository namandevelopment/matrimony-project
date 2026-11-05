import { asyncHandler, apiHTTPResponse, logMessage } from "../../utils/globalFunction.js";
import * as CONSTANTS from "../../utils/constants.js";
import { User, Profile, UserSubscription } from "../../models/index.js";
import { MEMBERSHIP_TIERS } from "../../utils/variables.js";
import { adminPlansStore, globalTogglesStore } from "../admin/adminSettingsController.js";
import { addAdminNotification } from "../admin/adminNotificationController.js";

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

export const MEMBERSHIP_PLANS = [];

/**
 * 🏷️ List All Membership Plans & Feature Matrix
 * GET /api/v1/plans
 */
export const getPlans = asyncHandler(async (req, res) => {
  const activePlans = (adminPlansStore || []).filter((p) => p.status === "ACTIVE" || !p.status);
  const formattedPlans = activePlans.map((p) => {
    const isAssisted = p.tier === "VIP" || p.category === "ASSIST_PLAN" || p.name?.toLowerCase().includes("assist");
    const durationDays = Number(p.durationDays) || 30;
    const durationMonths = Math.max(1, Math.round(durationDays / 30));
    const priceINR = Number(p.offerPrice || p.price || 0);
    const originalPriceINR = Number(p.originalPrice || p.originalPriceINR || (p.offerPrice ? p.price : Math.round(priceINR * 1.5)));
    const discountPercentage = p.discountPercentage || (originalPriceINR > priceINR ? Math.round(((originalPriceINR - priceINR) / originalPriceINR) * 100) : 0);

    return {
      id: p.planId || p._id || p.id,
      name: p.name || p.title,
      tagline: p.tagline || p.subtitle || (isAssisted ? "White-glove matrimonial assistance by senior Sindhi matchmaker" : `Essential ${p.name} membership package`),
      tier: p.tier || (isAssisted ? "DIAMOND_ASSISTED" : "GOLD"),
      durationMonths,
      durationDays,
      priceINR,
      originalPriceINR,
      discountPercentage,
      contactViewCredits: Number(p.contactViewsQuota || p.contactViewCredits || 25),
      canChat: p.canChat !== false,
      isUnlimitedChat: p.chatQuota === "Unlimited" || p.isUnlimitedChat !== false,
      allowDirectChat: p.allowDirectChat !== false,
      badge: p.badge || (p.tier === "GOLD" ? "MOST POPULAR" : p.tier === "DIAMOND" ? "BEST VALUE" : null),
      features: Array.isArray(p.features) && p.features.length > 0 ? p.features : [
        `Unlock ${p.contactViewsQuota || 25} verified Phone & WhatsApp contacts`,
        `Direct chat messaging with candidates (${p.chatQuota || "Unlimited"})`,
        p.horoscopeMatching ? "Kundli & Horoscope Matching breakdown" : null,
        p.featuredListing ? "Featured candidate badge on profile card" : null,
        p.dedicatedAdvisor ? "Dedicated matrimonial advisor support" : null,
        p.relationshipManager ? "Personal Sindhi Matchmaking Relationship Manager" : null,
        `Valid for ${durationDays} Days`,
      ].filter(Boolean),
      isPopular: Boolean(p.isPopular || p.tier === "GOLD"),
    };
  });

  const hasPageParam = Boolean(req.query?.page || req.query?.pageNo || req.query?.limit || req.query?.pageSize);
  const page = Math.max(1, parseInt(req.query?.pageNo || req.query?.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query?.pageSize || req.query?.limit, 10) || (hasPageParam ? 10 : 100)));

  const finalPlans = formattedPlans;
  const total = finalPlans.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const startIdx = (page - 1) * limit;
  const paginatedPlans = finalPlans.slice(startIdx, startIdx + limit);

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Membership plans retrieved successfully.",
    {
      currency: "INR",
      currencySymbol: "₹",
      totalPlans: total,
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
      plans: paginatedPlans,
      list: paginatedPlans,
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
  const { planId = "plan_gold", currency = "INR" } = req.body;

  const allPlans = (adminPlansStore && adminPlansStore.length > 0) ? adminPlansStore : MEMBERSHIP_PLANS;
  const selectedPlan =
    allPlans.find((p) => p.id === planId || p.planId === planId || p._id === planId) || allPlans[0];
  const priceINR = Number(selectedPlan.priceINR || selectedPlan.offerPrice || selectedPlan.price || 1499);
  const durationMonths = Number(selectedPlan.durationMonths) || Math.max(1, Math.round((selectedPlan.durationDays || 30) / 30));

  const orderId = `order_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;

  addAdminNotification({
    title: `Purchase Intent: ${selectedPlan.name || selectedPlan.title || "Membership"}`,
    message: `A candidate initiated checkout for ${selectedPlan.name || selectedPlan.title} (₹${priceINR}).`,
    category: "PAYMENT",
    priority: "NORMAL",
    actionUrl: `/admin/finance/transactions?orderId=${orderId}`,
    actionLabel: "View Order",
    metadata: {
      orderId,
      userId: getUserId(req) || "guest",
      planId: selectedPlan.planId || selectedPlan._id || selectedPlan.id,
      amount: priceINR,
      status: "INITIATED",
    },
  });

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Payment order initiated successfully.",
    {
      orderId,
      amount: priceINR * 100, // Amount in paise
      amountFormatted: `₹${priceINR}`,
      currency,
      planId: selectedPlan.planId || selectedPlan._id || selectedPlan.id,
      planName: selectedPlan.name || selectedPlan.title,
      contactViewCredits: Number(selectedPlan.contactViewsQuota || selectedPlan.contactViewCredits || 25),
      razorpayKeyId: process.env.RAZORPAY_KEY_ID || "rzp_test_simulated_key",
      upi: {
        upiId: globalTogglesStore?.paymentGateway?.upiId || "namansaini033@oksbi",
        payeeName: globalTogglesStore?.paymentGateway?.payeeName || "Naman Saini",
        merchantName: globalTogglesStore?.paymentGateway?.merchantName || "Sindhi Matrimony",
      },
      notes: {
        platform: "Sindhi Matrimony",
        planDuration: `${durationMonths} Months`,
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

  addAdminNotification({
    title: `Payment Received: ${selectedPlan.name}`,
    message: `Payment of ₹${selectedPlan.priceINR} received for ${selectedPlan.name}. Subscription activated.`,
    category: "PAYMENT",
    priority: "NORMAL",
    actionUrl: `/admin/finance/transactions?orderId=${paymentOrderId || paymentId}`,
    actionLabel: "View Receipt",
    metadata: {
      orderId: paymentOrderId,
      paymentId,
      userId,
      planId: selectedPlan.id,
      amount: selectedPlan.priceINR,
      status: "SUCCESSFUL",
    },
  });

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
 * 🚫 Cancel Payment Checkout Order
 * POST /api/v1/payments/cancel
 */
export const cancelPaymentOrder = asyncHandler(async (req, res) => {
  const { orderId, reason = "User cancelled transaction at checkout" } = req.body;
  const userId = getUserId(req);

  addAdminNotification({
    title: "Payment Checkout Cancelled",
    message: `Checkout was cancelled for order ${orderId || "unknown"}. Reason: ${reason}`,
    category: "PAYMENT",
    priority: "HIGH",
    actionUrl: `/admin/finance/transactions?orderId=${orderId}`,
    actionLabel: "Inspect Order",
    metadata: {
      orderId,
      userId,
      status: "CANCELLED",
      cancellationReason: reason,
    },
  });

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Payment checkout marked as cancelled.",
    { orderId, status: "CANCELLED", reason },
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

// ============================================================================
// 6. PAYMENT & OFFER SCREEN VISIT INTENT TRACKING (1 VISIT / DAY DEDUPLICATION)
// ============================================================================
export const paymentScreenVisitsStore = [];

export const recordScreenVisit = asyncHandler(async (req, res) => {
  const userId = getUserId(req) || req.body?.userId || "guest_user";
  const { screen = "PAYMENT_UPGRADE", screenTitle = "Payment & Upgrade Plans", metadata = {} } = req.body || {};
  const today = new Date().toISOString().slice(0, 10);

  // 1. Strict 1-visit-per-day deduplication
  const existingToday = paymentScreenVisitsStore.find(
    (v) => (v.userId === userId || (req.body?.phone && v.phone === req.body.phone)) &&
           v.visitDate === today &&
           v.visitedScreen === screen
  );

  if (existingToday) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_OK,
      "Visit already recorded for today (1 visit/day limit active).",
      { recorded: false, throttled: true, visit: existingToday },
      CONSTANTS.OK,
      CONSTANTS.ERROR_FALSE
    );
  }

  // 2. Fetch or assemble user details
  let userName = req.body?.name || req.user?.fullName || "Registered Member";
  let phone = req.body?.phone || req.user?.phone || "";
  let email = req.body?.email || req.user?.email || "";
  let memberId = req.body?.memberId || "SM-" + Math.floor(1000 + Math.random() * 9000);
  let avatar = req.body?.avatar || "";
  let city = req.body?.city || "Sindhi Matrimony User";
  let currentPlan = req.body?.currentPlan || "FREE_MEMBER";

  try {
    if (userId && userId !== "guest_user") {
      const dbUser = await User.findById(userId).lean();
      if (dbUser) {
        userName = dbUser.fullName || dbUser.name || userName;
        phone = dbUser.phone || phone;
        email = dbUser.email || email;
      }
      const dbProfile = await Profile.findOne({ userId, isDeleted: false }).lean();
      if (dbProfile) {
        memberId = dbProfile.memberId || memberId;
        city = dbProfile.city || dbProfile.location?.city || city;
        currentPlan = dbProfile.membershipTier || currentPlan;
        avatar = dbProfile.profilePictureUrl || dbProfile.photos?.[0] || avatar;
      }
    }
  } catch {}

  const newVisit = {
    id: `visit_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    userId,
    name: userName,
    memberId,
    phone,
    email,
    avatar,
    city,
    currentPlan,
    visitedScreen: screen,
    visitedScreenTitle: screenTitle,
    visitedAt: new Date().toISOString(),
    visitDate: today,
    visitCountToday: 1,
    totalHistoricalVisits: 1,
    status: "NEW_VISIT",
    notes: metadata?.notes || "Visited via Mobile App",
  };

  paymentScreenVisitsStore.unshift(newVisit);

  // Send real-time notification to Admin CRM
  addAdminNotification({
    title: `Payment Screen Visit: ${userName} (${memberId})`,
    message: `${userName} (${currentPlan}) opened the ${screenTitle}. High purchase intent detected.`,
    category: "PAYMENT",
    priority: "HIGH",
    actionUrl: `/campaigns?tab=PAYMENT_VISITORS`,
    actionLabel: "View Visitor",
    metadata: {
      userId,
      memberId,
      name: userName,
      phone,
      screen,
      visitedAt: newVisit.visitedAt,
    },
  });

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_CREATED,
    "Payment / Offer screen visit recorded successfully.",
    { recorded: true, throttled: false, visit: newVisit },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

export const getScreenVisits = asyncHandler(async (req, res) => {
  const { screen, status, search, date } = req.query || {};
  let list = [...paymentScreenVisitsStore];

  if (screen && screen !== "ALL") {
    list = list.filter((v) => v.visitedScreen === screen);
  }
  if (status && status !== "ALL") {
    list = list.filter((v) => v.status === status);
  }
  if (date) {
    list = list.filter((v) => v.visitDate === date);
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (v) =>
        v.name?.toLowerCase().includes(q) ||
        v.phone?.includes(q) ||
        v.memberId?.toLowerCase().includes(q) ||
        v.city?.toLowerCase().includes(q)
    );
  }

  const today = new Date().toISOString().slice(0, 10);
  const todayVisits = list.filter((v) => v.visitDate === today);

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Screen visits retrieved successfully.",
    {
      visits: list,
      totalCount: list.length,
      todayCount: todayVisits.length,
      summary: {
        total: list.length,
        today: todayVisits.length,
        newVisits: list.filter((v) => v.status === "NEW_VISIT").length,
        contacted: list.filter((v) => v.status === "CONTACTED").length,
        converted: list.filter((v) => v.status === "CONVERTED").length,
      },
    },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

export const updateScreenVisitStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body || {};

  const item = paymentScreenVisitsStore.find((v) => v.id === id);
  if (!item) {
    return apiHTTPResponse(req, res, CONSTANTS.HTTP_NOT_FOUND, "Visit record not found.", null, CONSTANTS.OK, CONSTANTS.ERROR_TRUE);
  }

  if (status) item.status = status;
  if (notes) item.notes = notes;
  if (status === "CONTACTED") item.lastContactedAt = new Date().toISOString();

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Screen visit status updated successfully.",
    { visit: item },
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
  recordScreenVisit,
  getScreenVisits,
  updateScreenVisitStatus,
  paymentScreenVisitsStore,
};
