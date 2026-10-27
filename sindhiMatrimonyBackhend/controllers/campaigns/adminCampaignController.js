import { asyncHandler, apiHTTPResponse } from "../../utils/globalFunction.js";
import * as CONSTANTS from "../../utils/constants.js";
import { Campaign, InAppPopup } from "../../models/campaigns/campaign.model.js";

// Allowed enums for strict scenario validations
const ALLOWED_STATUSES = [
  "ALL",
  "DRAFT",
  "NEW_REQUEST",
  "REVIEW",
  "APPROVED",
  "SCHEDULED",
  "LIVE",
  "PAUSED",
  "COMPLETED",
  "CANCELLED",
];

const ALLOWED_CHANNELS = ["ALL", "PUSH", "SMS", "EMAIL", "WHATSAPP", "POPUP", "BANNER"];

const ALLOWED_PLATFORMS = ["ALL", "WEB", "MOBILE", "BOTH", "ANDROID", "IOS"];

const ALLOWED_PLACEMENTS = [
  "ALL",
  "HOME_POPUP",
  "DISCOVER_BANNER",
  "PROFILE_BOTTOM",
  "SEARCH_TOP",
  "HOME_SPLASH",
  "DISCOUNT_MODAL",
  "UPGRADE_PROMPT",
  "NOTIFICATION_INBOX",
];

const ALLOWED_TARGET_AUDIENCES = [
  "ALL_USERS",
  "ACTIVE_USERS",
  "GOLD_SUBSCRIBERS",
  "FREE_USERS",
  "UNVERIFIED_USERS",
  "SPECIFIC_USERS",
  "CUSTOM_SEGMENT",
];

const ALLOWED_POPUP_PLACEMENTS = [
  "HOME_SPLASH",
  "DISCOUNT_MODAL",
  "UPGRADE_PROMPT",
  "HOME_POPUP",
  "DISCOVER_BANNER",
];

const AUDIENCE_ESTIMATES = {
  ALL_USERS: 2450,
  ACTIVE_USERS: 1820,
  GOLD_SUBSCRIBERS: 480,
  FREE_USERS: 1340,
  UNVERIFIED_USERS: 630,
  SPECIFIC_USERS: 50,
  CUSTOM_SEGMENT: 720,
};

// Seed in-memory store for campaigns (instant responses & development mode)
let adminCampaignsStore = [
  {
    _id: "cmp_seed_001",
    campaignId: "CMP_101",
    name: "Sindhi New Year Cheti Chand Special - 50% Off",
    advertiserName: "Sindhi Matrimony Core Team",
    advertiserEmail: "promotions@sindhimatrimony.com",
    channel: "PUSH",
    objective: "Festive membership upgrade drive",
    status: "LIVE",
    placement: "HOME_POPUP",
    targetPlatform: "BOTH",
    targetAudience: "FREE_USERS",
    targetingCriteria: {
      locations: ["Mumbai", "Ahmedabad", "Pune", "Indore", "Dubai"],
      gender: "ALL",
      loginState: "LOGGED_IN",
    },
    title: "🌸 Cheti Chand Mubarak! Flat 50% Off on Gold Plans",
    message: "Unlock direct WhatsApp chats and certified Sindhi family contacts today with code CHETI50.",
    creativeType: "IMAGE",
    creativeUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
    destinationUrl: "/plans?coupon=CHETI50",
    cta: "Claim 50% Discount",
    startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    scheduledAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    launchedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    launchedBy: "Ad Operations Lead",
    frequencyCap: { count: 1, per: "DAY" },
    dismissBehavior: "CLOSE_BUTTON",
    pricingModel: "FIXED_PLACEMENT",
    price: 15000,
    impressions: 12450,
    clicks: 482,
    dismissals: 3120,
    ctaConversions: 84,
    ctr: "3.87%",
    deliveryStats: {
      estimatedAudience: 1340,
      totalSent: 1340,
      delivered: 1295,
      opened: 482,
      failed: 45,
    },
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "cmp_seed_002",
    campaignId: "CMP_102",
    name: "Profile Photo Verification SMS Nudge",
    advertiserName: "Trust & Safety Desk",
    advertiserEmail: "safety@sindhimatrimony.com",
    channel: "SMS",
    objective: "Profile completion and trust score enhancement",
    status: "COMPLETED",
    placement: "PROFILE_BOTTOM",
    targetPlatform: "MOBILE",
    targetAudience: "UNVERIFIED_USERS",
    targetingCriteria: {
      locations: ["All India"],
      gender: "ALL",
      loginState: "ALL",
    },
    title: "Upload Photo Reminder",
    message: "Sindhi Matrimony: Profiles with a verified photo get 8x more rishta responses! Upload yours now: https://sindhimatrimony.com/p/upload",
    creativeType: "RICH_TEXT",
    creativeUrl: "",
    destinationUrl: "/profile/edit/photos",
    cta: "Upload Photo",
    startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    scheduledAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    launchedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    launchedBy: "Safety Executive",
    frequencyCap: { count: 1, per: "ONCE" },
    dismissBehavior: "CLOSE_BUTTON",
    pricingModel: "FREE_INTERNAL",
    price: 0,
    impressions: 630,
    clicks: 142,
    dismissals: 0,
    ctaConversions: 98,
    ctr: "22.54%",
    deliveryStats: {
      estimatedAudience: 630,
      totalSent: 630,
      delivered: 618,
      opened: 142,
      failed: 12,
    },
    createdAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "cmp_seed_003",
    campaignId: "CMP_103",
    name: "Elite Matchmaker Kundali Consultation - Email Blast",
    advertiserName: "VIP Concierge Services",
    advertiserEmail: "vip@sindhimatrimony.com",
    channel: "EMAIL",
    objective: "VIP Assisted Service Lead Generation",
    status: "SCHEDULED",
    placement: "DISCOVER_BANNER",
    targetPlatform: "BOTH",
    targetAudience: "GOLD_SUBSCRIBERS",
    targetingCriteria: {
      locations: ["Mumbai", "Delhi NCR", "Jaipur", "Bengaluru"],
      gender: "ALL",
      loginState: "LOGGED_IN",
    },
    title: "Complimentary 30-Min Kundali Consultation with Pandit Shastri",
    message: "As a valued Gold member, claim your complimentary personalized horoscope compatibility reading with our master Vedic astrologer.",
    creativeType: "IMAGE",
    creativeUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80",
    destinationUrl: "/services/horoscope-consultation",
    cta: "Book Free Slot",
    startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    launchedAt: null,
    launchedBy: null,
    frequencyCap: { count: 1, per: "WEEK" },
    dismissBehavior: "CLOSE_BUTTON",
    pricingModel: "FIXED_PLACEMENT",
    price: 8500,
    impressions: 0,
    clicks: 0,
    dismissals: 0,
    ctaConversions: 0,
    ctr: "0.00%",
    deliveryStats: {
      estimatedAudience: 480,
      totalSent: 0,
      delivered: 0,
      opened: 0,
      failed: 0,
    },
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "cmp_seed_004",
    campaignId: "CMP_104",
    name: "Direct WhatsApp Rishta Alerts Promotion",
    advertiserName: "Sindhi Matrimony Product Growth",
    advertiserEmail: "growth@sindhimatrimony.com",
    channel: "WHATSAPP",
    objective: "Opt-in for real-time match recommendations on WhatsApp",
    status: "PAUSED",
    placement: "SEARCH_TOP",
    targetPlatform: "MOBILE",
    targetAudience: "ACTIVE_USERS",
    targetingCriteria: {
      locations: ["All India", "UAE", "USA"],
      gender: "ALL",
      loginState: "LOGGED_IN",
    },
    title: "Get Matching Verified Profiles on WhatsApp Every Morning",
    message: "Namaste! Never miss a prospective alliance. Receive handpicked Sindhi biodatas matching your preferences directly on WhatsApp.",
    creativeType: "IMAGE",
    creativeUrl: "https://images.unsplash.com/photo-1616469829941-c7200edec809?auto=format&fit=crop&w=1200&q=80",
    destinationUrl: "/settings/whatsapp-alerts",
    cta: "Enable WhatsApp Alerts",
    startDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    scheduledAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    launchedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    launchedBy: "Growth Marketer",
    frequencyCap: { count: 1, per: "DAY" },
    dismissBehavior: "CLOSE_BUTTON",
    pricingModel: "FREE_INTERNAL",
    price: 0,
    impressions: 4210,
    clicks: 312,
    dismissals: 850,
    ctaConversions: 180,
    ctr: "7.41%",
    deliveryStats: {
      estimatedAudience: 1820,
      totalSent: 1820,
      delivered: 1780,
      opened: 1120,
      failed: 40,
    },
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Seed in-memory store for promotional in-app popups
let adminPopupsStore = [
  {
    _id: "popup_seed_001",
    popupId: "POPUP_201",
    title: "Cheti Chand Mahotsav: 50% Off Gold Membership",
    subtitle: "Find your life partner in the auspicious month of Chaitra",
    bannerUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80",
    placement: "DISCOUNT_MODAL",
    targetPlatform: "BOTH",
    ctaText: "Claim 50% Off Now",
    ctaLink: "/plans?coupon=CHETI50",
    couponCode: "CHETI50",
    discountPercentage: 50,
    status: "ACTIVE",
    dismissible: true,
    frequencyCapPerDay: 1,
    priority: 1,
    startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
    views: 18450,
    clicks: 1210,
    conversions: 245,
    ctr: "6.56%",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "popup_seed_002",
    popupId: "POPUP_202",
    title: "Get Government ID Verified for Blue Badge",
    subtitle: "Verified badges receive 300% more interest and trust from parents",
    bannerUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80",
    placement: "HOME_SPLASH",
    targetPlatform: "MOBILE",
    ctaText: "Upload Aadhaar / Passport",
    ctaLink: "/verifications/upload",
    couponCode: "",
    discountPercentage: 0,
    status: "ACTIVE",
    dismissible: true,
    frequencyCapPerDay: 1,
    priority: 2,
    startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    views: 9420,
    clicks: 812,
    conversions: 340,
    ctr: "8.62%",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "popup_seed_003",
    popupId: "POPUP_203",
    title: "Upgrade to Royal Diamond Concierge",
    subtitle: "Personal Relationship Manager dedicated to finding matches for your family",
    bannerUrl: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80",
    placement: "UPGRADE_PROMPT",
    targetPlatform: "WEB",
    ctaText: "Speak with Concierge",
    ctaLink: "/assisted-service",
    couponCode: "ROYALVIP",
    discountPercentage: 15,
    status: "SCHEDULED",
    dismissible: false,
    frequencyCapPerDay: 1,
    priority: 3,
    startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    views: 0,
    clicks: 0,
    conversions: 0,
    ctr: "0.00%",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

/**
 * 1. GET /api/v1/admin/campaigns
 * List all marketing campaigns with advanced filtering, metrics, and pagination.
 */
export const getAdminCampaigns = asyncHandler(async (req, res) => {
  const {
    status = "ALL",
    channel = "ALL",
    placement = "ALL",
    platform = "ALL",
    targetPlatform,
    search,
    q,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  // Validation: Status enum
  if (status && status !== "ALL") {
    const upperStatus = status.toUpperCase();
    if (!ALLOWED_STATUSES.includes(upperStatus)) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_BAD_REQUEST,
        `Invalid status '${status}'. Allowed statuses: ${ALLOWED_STATUSES.join(", ")}`,
        CONSTANTS.DATA_NULL,
        CONSTANTS.BAD_REQUEST,
        CONSTANTS.ERROR_TRUE
      );
    }
  }

  // Validation: Channel enum
  if (channel && channel !== "ALL") {
    const upperChannel = channel.toUpperCase();
    if (!ALLOWED_CHANNELS.includes(upperChannel)) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_BAD_REQUEST,
        `Invalid channel '${channel}'. Allowed channels: ${ALLOWED_CHANNELS.join(", ")}`,
        CONSTANTS.DATA_NULL,
        CONSTANTS.BAD_REQUEST,
        CONSTANTS.ERROR_TRUE
      );
    }
  }

  // Validation: Placement enum
  if (placement && placement !== "ALL") {
    const upperPlacement = placement.toUpperCase();
    if (!ALLOWED_PLACEMENTS.includes(upperPlacement)) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_BAD_REQUEST,
        `Invalid placement '${placement}'. Allowed placements: ${ALLOWED_PLACEMENTS.join(", ")}`,
        CONSTANTS.DATA_NULL,
        CONSTANTS.BAD_REQUEST,
        CONSTANTS.ERROR_TRUE
      );
    }
  }

  // Validation: Platform enum
  const effectivePlatform = (platform !== "ALL" ? platform : targetPlatform || "ALL").toUpperCase();
  if (effectivePlatform !== "ALL" && !ALLOWED_PLATFORMS.includes(effectivePlatform)) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      `Invalid platform '${effectivePlatform}'. Allowed platforms: ${ALLOWED_PLATFORMS.join(", ")}`,
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  // Pipeline Filtering
  let filtered = [...adminCampaignsStore];

  if (status && status.toUpperCase() !== "ALL") {
    filtered = filtered.filter((c) => c.status.toUpperCase() === status.toUpperCase());
  }

  if (channel && channel.toUpperCase() !== "ALL") {
    filtered = filtered.filter((c) => c.channel.toUpperCase() === channel.toUpperCase());
  }

  if (placement && placement.toUpperCase() !== "ALL") {
    filtered = filtered.filter((c) => c.placement.toUpperCase() === placement.toUpperCase());
  }

  if (effectivePlatform !== "ALL") {
    filtered = filtered.filter(
      (c) => c.targetPlatform.toUpperCase() === effectivePlatform || c.targetPlatform === "BOTH"
    );
  }

  const querySearch = (search || q || "").toString().trim().toLowerCase();
  if (querySearch) {
    filtered = filtered.filter(
      (c) =>
        c.name.toLowerCase().includes(querySearch) ||
        c.campaignId.toLowerCase().includes(querySearch) ||
        (c.advertiserName && c.advertiserName.toLowerCase().includes(querySearch)) ||
        (c.title && c.title.toLowerCase().includes(querySearch)) ||
        (c.message && c.message.toLowerCase().includes(querySearch))
    );
  }

  // Sorting
  filtered.sort((a, b) => {
    const dateA = new Date(a[sortBy] || a.createdAt);
    const dateB = new Date(b[sortBy] || b.createdAt);
    return sortOrder.toLowerCase() === "asc" ? dateA - dateB : dateB - dateA;
  });

  // Pagination slice
  const parsedPage = Math.max(1, parseInt(req.query?.pageNo || page, 10) || 1);
  const parsedLimit = Math.max(1, Math.min(100, parseInt(req.query?.pageSize || limit, 10) || 10));
  const total = filtered.length;
  const totalPages = Math.ceil(total / parsedLimit) || 1;
  const startIndex = (parsedPage - 1) * parsedLimit;
  const paginatedCampaigns = filtered.slice(startIndex, startIndex + parsedLimit);

  // Overall Campaign Metrics
  const totalCampaigns = adminCampaignsStore.length;
  const liveCount = adminCampaignsStore.filter((c) => c.status === "LIVE").length;
  const scheduledCount = adminCampaignsStore.filter((c) => c.status === "SCHEDULED").length;
  const pausedCount = adminCampaignsStore.filter((c) => c.status === "PAUSED").length;
  const completedCount = adminCampaignsStore.filter((c) => c.status === "COMPLETED").length;
  const totalImpressions = adminCampaignsStore.reduce((acc, c) => acc + (c.impressions || 0), 0);
  const totalClicks = adminCampaignsStore.reduce((acc, c) => acc + (c.clicks || 0), 0);
  const totalConversions = adminCampaignsStore.reduce((acc, c) => acc + (c.ctaConversions || 0), 0);
  const averageCTR =
    totalImpressions > 0 ? `${((totalClicks / totalImpressions) * 100).toFixed(2)}%` : "0.00%";

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Marketing campaigns retrieved successfully.",
    {
      campaigns: paginatedCampaigns,
      list: paginatedCampaigns,
      total,
      totalPages,
      page: parsedPage,
      limit: parsedLimit,
      hasMore: parsedPage < totalPages,
      pagination: {
        total,
        page: parsedPage,
        limit: parsedLimit,
        totalPages,
        hasMore: parsedPage < totalPages,
        hasNextPage: parsedPage < totalPages,
        hasPrevPage: parsedPage > 1,
      },
      metrics: {
        totalCampaigns,
        liveCount,
        scheduledCount,
        pausedCount,
        completedCount,
        totalImpressions,
        totalClicks,
        totalConversions,
        averageCTR,
      },
      filtersApplied: {
        status,
        channel,
        placement,
        platform: effectivePlatform,
        search: querySearch || null,
      },
    },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 2. POST /api/v1/admin/campaigns
 * Create a new push, SMS, email, WhatsApp, or in-app popup campaign with full validation.
 */
export const createAdminCampaign = asyncHandler(async (req, res) => {
  const {
    name,
    advertiserName = "Sindhi Matrimony Internal",
    advertiserEmail = "promotions@sindhimatrimony.com",
    channel = "PUSH",
    objective = "Brand engagement & subscription",
    placement = "HOME_POPUP",
    targetPlatform = "BOTH",
    targetAudience = "ALL_USERS",
    targetingCriteria = {},
    title,
    message,
    creativeType = "IMAGE",
    creativeUrl = "",
    destinationUrl = "",
    cta = "Explore Now",
    startDate,
    endDate,
    scheduledAt,
    frequencyCap = { count: 1, per: "DAY" },
    dismissBehavior = "CLOSE_BUTTON",
    pricingModel = "FREE_INTERNAL",
    price = 0,
    status: reqStatus,
  } = req.body;

  // Validation: Name
  if (!name || typeof name !== "string" || name.trim().length < 3) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "Validation Failed: 'name' is required and must contain at least 3 characters.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  // Validation: Channel
  const upperChannel = (channel || "").toString().toUpperCase();
  if (!ALLOWED_CHANNELS.includes(upperChannel) || upperChannel === "ALL") {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      `Validation Failed: Invalid channel '${channel}'. Allowed channels: ${ALLOWED_CHANNELS.filter(
        (c) => c !== "ALL"
      ).join(", ")}`,
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  // Validation: Target Audience
  const upperAudience = (targetAudience || "").toString().toUpperCase();
  if (!ALLOWED_TARGET_AUDIENCES.includes(upperAudience)) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      `Validation Failed: Invalid targetAudience '${targetAudience}'. Allowed audiences: ${ALLOWED_TARGET_AUDIENCES.join(
        ", "
      )}`,
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  // Channel specific message validations
  if (upperChannel === "SMS") {
    if (!message || message.trim().length === 0) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_BAD_REQUEST,
        "Validation Failed: SMS campaigns require a non-empty 'message' copy.",
        CONSTANTS.DATA_NULL,
        CONSTANTS.BAD_REQUEST,
        CONSTANTS.ERROR_TRUE
      );
    }
    if (message.length > 320) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_BAD_REQUEST,
        "Validation Failed: SMS message copy exceeds maximum 320 characters limit.",
        CONSTANTS.DATA_NULL,
        CONSTANTS.BAD_REQUEST,
        CONSTANTS.ERROR_TRUE
      );
    }
  } else if (upperChannel === "EMAIL") {
    if (!title || title.trim().length < 3) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_BAD_REQUEST,
        "Validation Failed: Email campaigns require a 'title' / subject line of at least 3 characters.",
        CONSTANTS.DATA_NULL,
        CONSTANTS.BAD_REQUEST,
        CONSTANTS.ERROR_TRUE
      );
    }
    if (!message || message.trim().length < 5) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_BAD_REQUEST,
        "Validation Failed: Email campaigns require a 'message' body.",
        CONSTANTS.DATA_NULL,
        CONSTANTS.BAD_REQUEST,
        CONSTANTS.ERROR_TRUE
      );
    }
  } else {
    // PUSH, POPUP, WHATSAPP, BANNER
    if (!title && !message) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_BAD_REQUEST,
        "Validation Failed: At least 'title' or 'message' is required for push/popup/banner campaigns.",
        CONSTANTS.DATA_NULL,
        CONSTANTS.BAD_REQUEST,
        CONSTANTS.ERROR_TRUE
      );
    }
  }

  // Schedule date validation
  let parsedScheduledAt = scheduledAt ? new Date(scheduledAt) : null;
  if (scheduledAt && isNaN(parsedScheduledAt.getTime())) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "Validation Failed: Invalid date format for 'scheduledAt'. Use ISO-8601 string.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  let parsedStartDate = startDate ? new Date(startDate) : new Date();
  let parsedEndDate = endDate ? new Date(endDate) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
  if (endDate && parsedEndDate <= parsedStartDate) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "Validation Failed: 'endDate' must be chronologically after 'startDate'.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  // Determine initial status
  let initialStatus = "NEW_REQUEST";
  if (reqStatus && ALLOWED_STATUSES.includes(reqStatus.toUpperCase())) {
    initialStatus = reqStatus.toUpperCase();
  } else if (parsedScheduledAt && parsedScheduledAt > new Date()) {
    initialStatus = "SCHEDULED";
  }

  const generatedCampaignId = `CMP_${Date.now()}`;
  const estimatedCount = AUDIENCE_ESTIMATES[upperAudience] || 1000;

  const newCampaign = {
    _id: `cmp_${Date.now()}`,
    campaignId: generatedCampaignId,
    name: name.trim(),
    advertiserName: advertiserName.trim(),
    advertiserEmail: advertiserEmail.trim(),
    channel: upperChannel,
    objective: objective.trim(),
    status: initialStatus,
    placement,
    targetPlatform: (targetPlatform || "BOTH").toUpperCase(),
    targetAudience: upperAudience,
    targetingCriteria: {
      locations: targetingCriteria.locations || ["All India"],
      gender: targetingCriteria.gender || "ALL",
      loginState: targetingCriteria.loginState || "ALL",
    },
    title: (title || name).trim(),
    message: (message || "").trim(),
    creativeType,
    creativeUrl: creativeUrl || "",
    destinationUrl: destinationUrl || "",
    cta: cta || "Explore Now",
    startDate: parsedStartDate.toISOString(),
    endDate: parsedEndDate.toISOString(),
    scheduledAt: parsedScheduledAt ? parsedScheduledAt.toISOString() : null,
    launchedAt: null,
    launchedBy: null,
    frequencyCap: {
      count: frequencyCap.count || 1,
      per: frequencyCap.per || "DAY",
    },
    dismissBehavior: dismissBehavior || "CLOSE_BUTTON",
    pricingModel: pricingModel || "FREE_INTERNAL",
    price: Number(price) || 0,
    impressions: 0,
    clicks: 0,
    dismissals: 0,
    ctaConversions: 0,
    ctr: "0.00%",
    deliveryStats: {
      estimatedAudience: estimatedCount,
      totalSent: 0,
      delivered: 0,
      opened: 0,
      failed: 0,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  adminCampaignsStore.unshift(newCampaign);

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_CREATED,
    `Campaign '${newCampaign.name}' created successfully with status ${newCampaign.status}.`,
    newCampaign,
    CONSTANTS.CREATED,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 3. GET /api/v1/admin/campaigns/:id
 * Retrieve comprehensive campaign details, creative assets, targeting, and analytics.
 */
export const getAdminCampaignDetail = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const campaign = adminCampaignsStore.find(
    (c) => c._id === id || c.campaignId === id || c.campaignId?.toLowerCase() === id.toLowerCase()
  );

  if (!campaign) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_NOT_FOUND,
      `Campaign with ID '${id}' not found.`,
      CONSTANTS.DATA_NULL,
      CONSTANTS.NOT_FOUND,
      CONSTANTS.ERROR_TRUE
    );
  }

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Campaign detail retrieved successfully.",
    campaign,
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 4. PUT /api/v1/admin/campaigns/:id
 * Update campaign schedule, creatives, destination, or targeting parameters.
 */
export const updateAdminCampaign = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const campaignIndex = adminCampaignsStore.findIndex(
    (c) => c._id === id || c.campaignId === id || c.campaignId?.toLowerCase() === id.toLowerCase()
  );

  if (campaignIndex === -1) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_NOT_FOUND,
      `Campaign with ID '${id}' not found.`,
      CONSTANTS.DATA_NULL,
      CONSTANTS.NOT_FOUND,
      CONSTANTS.ERROR_TRUE
    );
  }

  const existingCampaign = adminCampaignsStore[campaignIndex];

  // Scenario: Cannot update a completed campaign
  if (existingCampaign.status === "COMPLETED") {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "Validation Failed: Cannot modify a completed campaign. Please create a new campaign or clone this one.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  const {
    name,
    title,
    message,
    creativeUrl,
    destinationUrl,
    cta,
    startDate,
    endDate,
    scheduledAt,
    targetPlatform,
    targetAudience,
    placement,
    frequencyCap,
    price,
    status: updateStatus,
  } = req.body;

  // Partial validations if provided
  if (name !== undefined) {
    if (typeof name !== "string" || name.trim().length < 3) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_BAD_REQUEST,
        "Validation Failed: 'name' must be at least 3 characters long.",
        CONSTANTS.DATA_NULL,
        CONSTANTS.BAD_REQUEST,
        CONSTANTS.ERROR_TRUE
      );
    }
    existingCampaign.name = name.trim();
  }

  if (title !== undefined) existingCampaign.title = title.trim();
  if (message !== undefined) existingCampaign.message = message.trim();
  if (creativeUrl !== undefined) existingCampaign.creativeUrl = creativeUrl.trim();
  if (destinationUrl !== undefined) existingCampaign.destinationUrl = destinationUrl.trim();
  if (cta !== undefined) existingCampaign.cta = cta.trim();

  if (startDate) existingCampaign.startDate = new Date(startDate).toISOString();
  if (endDate) existingCampaign.endDate = new Date(endDate).toISOString();
  if (scheduledAt) existingCampaign.scheduledAt = new Date(scheduledAt).toISOString();

  if (targetPlatform && ALLOWED_PLATFORMS.includes(targetPlatform.toUpperCase())) {
    existingCampaign.targetPlatform = targetPlatform.toUpperCase();
  }

  if (targetAudience && ALLOWED_TARGET_AUDIENCES.includes(targetAudience.toUpperCase())) {
    existingCampaign.targetAudience = targetAudience.toUpperCase();
    existingCampaign.deliveryStats.estimatedAudience =
      AUDIENCE_ESTIMATES[targetAudience.toUpperCase()] || 1000;
  }

  if (placement && ALLOWED_PLACEMENTS.includes(placement.toUpperCase())) {
    existingCampaign.placement = placement.toUpperCase();
  }

  if (frequencyCap && typeof frequencyCap === "object") {
    existingCampaign.frequencyCap = {
      count: frequencyCap.count || existingCampaign.frequencyCap.count,
      per: frequencyCap.per || existingCampaign.frequencyCap.per,
    };
  }

  if (price !== undefined) existingCampaign.price = Number(price);

  if (updateStatus && ALLOWED_STATUSES.includes(updateStatus.toUpperCase())) {
    existingCampaign.status = updateStatus.toUpperCase();
  }

  existingCampaign.updatedAt = new Date().toISOString();
  adminCampaignsStore[campaignIndex] = existingCampaign;

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    `Campaign '${existingCampaign.name}' updated successfully.`,
    existingCampaign,
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 5. POST /api/v1/admin/campaigns/:id/launch
 * Trigger immediate campaign delivery blast to target audience.
 */
export const launchAdminCampaign = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const campaign = adminCampaignsStore.find(
    (c) => c._id === id || c.campaignId === id || c.campaignId?.toLowerCase() === id.toLowerCase()
  );

  if (!campaign) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_NOT_FOUND,
      `Campaign with ID '${id}' not found.`,
      CONSTANTS.DATA_NULL,
      CONSTANTS.NOT_FOUND,
      CONSTANTS.ERROR_TRUE
    );
  }

  // Scenario: Already completed
  if (campaign.status === "COMPLETED") {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "Validation Failed: Campaign has already executed and completed delivery.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  // Calculate delivery figures based on target audience
  const audienceCount = campaign.deliveryStats?.estimatedAudience || 1200;
  const deliveredCount = Math.floor(audienceCount * 0.965);
  const failedCount = audienceCount - deliveredCount;

  campaign.status = "LIVE";
  campaign.launchedAt = new Date().toISOString();
  campaign.launchedBy = req.user?.name || "Admin Operations Lead";
  campaign.updatedAt = new Date().toISOString();

  campaign.deliveryStats = {
    estimatedAudience: audienceCount,
    totalSent: audienceCount,
    delivered: deliveredCount,
    opened: Math.floor(deliveredCount * 0.32),
    failed: failedCount,
  };

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    `Campaign '${campaign.name}' launched successfully into LIVE delivery queue.`,
    {
      campaignId: campaign.campaignId,
      name: campaign.name,
      status: campaign.status,
      channel: campaign.channel,
      targetAudience: campaign.targetAudience,
      launchedAt: campaign.launchedAt,
      deliverySummary: {
        recipientsQueued: audienceCount,
        dispatched: deliveredCount,
        simulatedDeliveryRate: "96.5%",
      },
    },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 6. POST /api/v1/admin/campaigns/:id/pause
 * Emergency pause a live campaign.
 */
export const pauseAdminCampaign = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason = "Administrative review requested" } = req.body;

  const campaign = adminCampaignsStore.find(
    (c) => c._id === id || c.campaignId === id || c.campaignId?.toLowerCase() === id.toLowerCase()
  );

  if (!campaign) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_NOT_FOUND,
      `Campaign with ID '${id}' not found.`,
      CONSTANTS.DATA_NULL,
      CONSTANTS.NOT_FOUND,
      CONSTANTS.ERROR_TRUE
    );
  }

  if (campaign.status !== "LIVE") {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      `Campaign cannot be paused because its current status is '${campaign.status}'. Only LIVE campaigns can be paused.`,
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  campaign.status = "PAUSED";
  campaign.pauseReason = reason;
  campaign.pausedAt = new Date().toISOString();
  campaign.updatedAt = new Date().toISOString();

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    `Campaign '${campaign.name}' has been PAUSED. Delivery stopped.`,
    campaign,
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 7. GET /api/v1/admin/campaigns/popups
 * Retrieve in-app promotional popups and splash announcements.
 */
export const getAdminCampaignPopups = asyncHandler(async (req, res) => {
  const { status = "ALL", placement = "ALL", platform = "ALL" } = req.query;

  let filtered = [...adminPopupsStore];

  if (status && status.toUpperCase() !== "ALL") {
    filtered = filtered.filter((p) => p.status.toUpperCase() === status.toUpperCase());
  }

  if (placement && placement.toUpperCase() !== "ALL") {
    filtered = filtered.filter((p) => p.placement.toUpperCase() === placement.toUpperCase());
  }

  if (platform && platform.toUpperCase() !== "ALL") {
    filtered = filtered.filter(
      (p) => p.targetPlatform.toUpperCase() === platform.toUpperCase() || p.targetPlatform === "BOTH"
    );
  }

  // Summary counts
  const totalPopups = adminPopupsStore.length;
  const activePopups = adminPopupsStore.filter((p) => p.status === "ACTIVE").length;
  const scheduledPopups = adminPopupsStore.filter((p) => p.status === "SCHEDULED").length;
  const totalViews = adminPopupsStore.reduce((acc, p) => acc + (p.views || 0), 0);
  const totalClicks = adminPopupsStore.reduce((acc, p) => acc + (p.clicks || 0), 0);
  const totalConversions = adminPopupsStore.reduce((acc, p) => acc + (p.conversions || 0), 0);

  const page = Math.max(1, parseInt(req.query?.pageNo || req.query?.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query?.pageSize || req.query?.limit, 10) || 10));

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const startIndex = (page - 1) * limit;
  const paginatedPopups = filtered.slice(startIndex, startIndex + limit);

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Promotional popups retrieved successfully.",
    {
      popups: paginatedPopups,
      list: paginatedPopups,
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
      summary: {
        totalPopups,
        activePopups,
        scheduledPopups,
        totalViews,
        totalClicks,
        totalConversions,
        averageCTR:
          totalViews > 0 ? `${((totalClicks / totalViews) * 100).toFixed(2)}%` : "0.00%",
      },
    },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 8. POST /api/v1/admin/campaigns/popups
 * Create a new promotional in-app popup / splash modal with full validation.
 */
export const createAdminCampaignPopup = asyncHandler(async (req, res) => {
  const {
    title,
    subtitle = "",
    bannerUrl = "",
    placement = "HOME_SPLASH",
    targetPlatform = "BOTH",
    ctaText = "Explore Now",
    ctaLink = "/plans",
    couponCode = "",
    discountPercentage = 0,
    dismissible = true,
    frequencyCapPerDay = 1,
    priority = 1,
    startDate,
    endDate,
  } = req.body;

  // Validation: Title
  if (!title || typeof title !== "string" || title.trim().length < 3) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "Validation Failed: 'title' is required and must contain at least 3 characters.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  // Validation: Placement
  const upperPlacement = (placement || "").toString().toUpperCase();
  if (!ALLOWED_POPUP_PLACEMENTS.includes(upperPlacement)) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      `Validation Failed: Invalid popup placement '${placement}'. Allowed placements: ${ALLOWED_POPUP_PLACEMENTS.join(
        ", "
      )}`,
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  // Validation: CTA Text
  if (!ctaText || typeof ctaText !== "string" || ctaText.trim().length === 0) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "Validation Failed: 'ctaText' is required.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  // Validation: Dates
  const parsedStartDate = startDate ? new Date(startDate) : new Date();
  if (!endDate) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "Validation Failed: 'endDate' is required for promotional popups.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  const parsedEndDate = new Date(endDate);
  if (isNaN(parsedEndDate.getTime())) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "Validation Failed: Invalid ISO date format for 'endDate'.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  if (parsedEndDate <= parsedStartDate) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "Validation Failed: 'endDate' must be chronologically after 'startDate'.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  const now = new Date();
  const initialStatus = parsedStartDate > now ? "SCHEDULED" : "ACTIVE";

  const newPopup = {
    _id: `popup_${Date.now()}`,
    popupId: `POPUP_${Date.now()}`,
    title: title.trim(),
    subtitle: subtitle.trim(),
    bannerUrl: bannerUrl.trim(),
    placement: upperPlacement,
    targetPlatform: (targetPlatform || "BOTH").toUpperCase(),
    ctaText: ctaText.trim(),
    ctaLink: ctaLink.trim(),
    couponCode: (couponCode || "").trim().toUpperCase(),
    discountPercentage: Math.max(0, Math.min(100, Number(discountPercentage) || 0)),
    status: initialStatus,
    dismissible: dismissible !== false,
    frequencyCapPerDay: Number(frequencyCapPerDay) || 1,
    priority: Number(priority) || 1,
    startDate: parsedStartDate.toISOString(),
    endDate: parsedEndDate.toISOString(),
    views: 0,
    clicks: 0,
    conversions: 0,
    ctr: "0.00%",
    createdAt: new Date().toISOString(),
  };

  adminPopupsStore.unshift(newPopup);

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_CREATED,
    `Promotional popup '${newPopup.title}' created successfully.`,
    newPopup,
    CONSTANTS.CREATED,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 9. GET /api/v1/admin/campaigns/:id/analytics
 * Retrieve rich performance metrics and daily breakdowns.
 */
export const getAdminCampaignAnalytics = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const campaign = adminCampaignsStore.find(
    (c) => c._id === id || c.campaignId === id || c.campaignId?.toLowerCase() === id.toLowerCase()
  );

  if (!campaign) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_NOT_FOUND,
      `Campaign with ID '${id}' not found.`,
      CONSTANTS.DATA_NULL,
      CONSTANTS.NOT_FOUND,
      CONSTANTS.ERROR_TRUE
    );
  }

  const impressions = campaign.impressions || 0;
  const clicks = campaign.clicks || 0;
  const ctaConversions = campaign.ctaConversions || 0;
  const dismissals = campaign.dismissals || 0;
  const ctr = impressions > 0 ? `${((clicks / impressions) * 100).toFixed(2)}%` : "0.00%";
  const conversionRate = clicks > 0 ? `${((ctaConversions / clicks) * 100).toFixed(2)}%` : "0.00%";

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Campaign analytics retrieved successfully.",
    {
      campaignId: campaign.campaignId,
      name: campaign.name,
      channel: campaign.channel,
      status: campaign.status,
      metrics: {
        eligibleAudience: campaign.deliveryStats?.estimatedAudience || 1200,
        impressions,
        clicks,
        dismissals,
        ctaConversions,
        ctr,
        conversionRate,
      },
      deviceBreakdown: {
        web: Math.floor(impressions * 0.58),
        mobile: impressions - Math.floor(impressions * 0.58),
      },
      deliveryBreakdown: campaign.deliveryStats || {},
    },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 10. DELETE /api/v1/admin/campaigns/:id
 * Delete or archive campaign.
 */
export const deleteAdminCampaign = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const campaignIndex = adminCampaignsStore.findIndex(
    (c) => c._id === id || c.campaignId === id || c.campaignId?.toLowerCase() === id.toLowerCase()
  );

  if (campaignIndex === -1) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_NOT_FOUND,
      `Campaign with ID '${id}' not found.`,
      CONSTANTS.DATA_NULL,
      CONSTANTS.NOT_FOUND,
      CONSTANTS.ERROR_TRUE
    );
  }

  const campaign = adminCampaignsStore[campaignIndex];

  // Prevent deleting currently live campaigns
  if (campaign.status === "LIVE") {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "Validation Failed: Live campaigns cannot be deleted directly. Please pause the campaign before deleting.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  const removedCampaign = adminCampaignsStore.splice(campaignIndex, 1)[0];

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    `Campaign '${removedCampaign.name}' (${removedCampaign.campaignId}) deleted successfully.`,
    { deletedCampaignId: removedCampaign.campaignId },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});
