import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema(
  {
    campaignId: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    advertiserName: {
      type: String,
      trim: true,
      default: "Sindhi Matrimony Internal",
    },
    advertiserEmail: {
      type: String,
      trim: true,
      default: "marketing@sindhimatrimony.com",
    },
    channel: {
      type: String,
      enum: ["PUSH", "SMS", "EMAIL", "WHATSAPP", "POPUP", "BANNER"],
      required: true,
      default: "PUSH",
    },
    objective: {
      type: String,
      trim: true,
      default: "User engagement & subscription upgrades",
    },
    status: {
      type: String,
      enum: [
        "DRAFT",
        "NEW_REQUEST",
        "REVIEW",
        "APPROVED",
        "SCHEDULED",
        "LIVE",
        "PAUSED",
        "COMPLETED",
        "CANCELLED",
      ],
      default: "NEW_REQUEST",
      index: true,
    },
    placement: {
      type: String,
      enum: [
        "HOME_POPUP",
        "DISCOVER_BANNER",
        "PROFILE_BOTTOM",
        "SEARCH_TOP",
        "HOME_SPLASH",
        "DISCOUNT_MODAL",
        "UPGRADE_PROMPT",
        "NOTIFICATION_INBOX",
      ],
      default: "HOME_POPUP",
    },
    targetPlatform: {
      type: String,
      enum: ["WEB", "MOBILE", "BOTH", "ANDROID", "IOS"],
      default: "BOTH",
    },
    targetAudience: {
      type: String,
      enum: [
        "ALL_USERS",
        "ACTIVE_USERS",
        "GOLD_SUBSCRIBERS",
        "FREE_USERS",
        "UNVERIFIED_USERS",
        "SPECIFIC_USERS",
        "CUSTOM_SEGMENT",
      ],
      default: "ALL_USERS",
    },
    targetingCriteria: {
      locations: [{ type: String }],
      gender: { type: String, enum: ["ALL", "MALE", "FEMALE"], default: "ALL" },
      ageRange: {
        min: { type: Number, default: 18 },
        max: { type: Number, default: 70 },
      },
      loginState: {
        type: String,
        enum: ["ALL", "LOGGED_IN", "LOGGED_OUT"],
        default: "ALL",
      },
      specificUserIds: [{ type: String }],
    },
    title: {
      type: String,
      trim: true,
      default: "",
    },
    message: {
      type: String,
      trim: true,
      default: "",
    },
    creativeType: {
      type: String,
      enum: ["IMAGE", "VIDEO", "RICH_TEXT", "CAROUSEL"],
      default: "IMAGE",
    },
    creativeUrl: {
      type: String,
      trim: true,
      default: "",
    },
    destinationUrl: {
      type: String,
      trim: true,
      default: "",
    },
    cta: {
      type: String,
      trim: true,
      default: "View Offer",
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    scheduledAt: {
      type: Date,
    },
    launchedAt: {
      type: Date,
    },
    launchedBy: {
      type: String,
      default: "System Admin",
    },
    frequencyCap: {
      count: { type: Number, default: 1 },
      per: { type: String, enum: ["SESSION", "DAY", "WEEK", "ONCE"], default: "DAY" },
    },
    dismissBehavior: {
      type: String,
      enum: ["CLOSE_BUTTON", "TAP_OUTSIDE", "NON_DISMISSIBLE", "AUTO_DISMISS"],
      default: "CLOSE_BUTTON",
    },
    pricingModel: {
      type: String,
      enum: ["FREE_INTERNAL", "FIXED_PLACEMENT", "CPM", "CPC"],
      default: "FREE_INTERNAL",
    },
    price: {
      type: Number,
      default: 0,
    },
    impressions: {
      type: Number,
      default: 0,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    dismissals: {
      type: Number,
      default: 0,
    },
    ctaConversions: {
      type: Number,
      default: 0,
    },
    deliveryStats: {
      estimatedAudience: { type: Number, default: 0 },
      totalSent: { type: Number, default: 0 },
      delivered: { type: Number, default: 0 },
      opened: { type: Number, default: 0 },
      failed: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

export const Campaign =
  mongoose.models.Campaign || mongoose.model("Campaign", campaignSchema);

const inAppPopupSchema = new mongoose.Schema(
  {
    popupId: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
      default: "",
    },
    bannerUrl: {
      type: String,
      trim: true,
      default: "",
    },
    placement: {
      type: String,
      enum: ["HOME_SPLASH", "DISCOUNT_MODAL", "UPGRADE_PROMPT", "HOME_POPUP", "DISCOVER_BANNER"],
      required: true,
      default: "HOME_SPLASH",
    },
    targetPlatform: {
      type: String,
      enum: ["WEB", "MOBILE", "BOTH"],
      default: "BOTH",
    },
    ctaText: {
      type: String,
      required: true,
      trim: true,
      default: "Explore Now",
    },
    ctaLink: {
      type: String,
      trim: true,
      default: "/plans",
    },
    couponCode: {
      type: String,
      trim: true,
      default: "",
    },
    discountPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "SCHEDULED", "EXPIRED"],
      default: "ACTIVE",
      index: true,
    },
    dismissible: {
      type: Boolean,
      default: true,
    },
    frequencyCapPerDay: {
      type: Number,
      default: 1,
    },
    priority: {
      type: Number,
      default: 1,
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    conversions: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const InAppPopup =
  mongoose.models.InAppPopup || mongoose.model("InAppPopup", inAppPopupSchema);
