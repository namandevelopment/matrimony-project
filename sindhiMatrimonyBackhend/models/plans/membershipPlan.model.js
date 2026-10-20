import mongoose from "mongoose";
import { MEMBERSHIP_TIERS } from "../../utils/variables.js";

const { Schema } = mongoose;

const membershipPlanSchema = new Schema(
  {
    planId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    tagline: {
      type: String,
      trim: true,
    },
    tier: {
      type: String,
      enum: Object.values(MEMBERSHIP_TIERS),
      default: MEMBERSHIP_TIERS.FREE,
      index: true,
    },
    durationMonths: {
      type: Number,
      required: true,
      default: 1,
    },
    durationDays: {
      type: Number,
      required: true,
      default: 30,
    },
    priceINR: {
      type: Number,
      required: true,
      default: 0,
    },
    originalPriceINR: {
      type: Number,
      default: 0,
    },
    discountPercentage: {
      type: Number,
      default: 0,
    },
    contactViewCredits: {
      type: Number,
      default: 0,
    },
    canChat: {
      type: Boolean,
      default: true,
    },
    isUnlimitedChat: {
      type: Boolean,
      default: true,
    },
    allowDirectChat: {
      type: Boolean,
      default: true,
    },
    badge: {
      type: String,
      default: null,
    },
    features: {
      type: [String],
      default: [],
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

membershipPlanSchema.index({ tier: 1, isActive: 1 });

const MembershipPlan =
  mongoose.models.MembershipPlan ||
  mongoose.model("MembershipPlan", membershipPlanSchema);

export default MembershipPlan;
