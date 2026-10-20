import mongoose from "mongoose";
import { MEMBERSHIP_TIERS } from "../../utils/variables.js";

const { Schema } = mongoose;

const userSubscriptionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    profileId: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
      index: true,
    },
    planId: {
      type: String,
      required: true,
      index: true,
    },
    planName: {
      type: String,
      required: true,
    },
    tier: {
      type: String,
      enum: Object.values(MEMBERSHIP_TIERS),
      default: MEMBERSHIP_TIERS.SILVER,
      index: true,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "EXPIRED", "CANCELLED", "PENDING"],
      default: "ACTIVE",
      index: true,
    },
    startDate: {
      type: Number,
      default: () => Date.now(),
    },
    expiresAt: {
      type: Number,
      required: true,
      index: true,
    },
    contactViewCredits: {
      type: Number,
      default: 0,
    },
    usedContactViewCredits: {
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
    paymentOrderId: {
      type: String,
      default: null,
    },
    paymentId: {
      type: String,
      default: null,
    },
    amountPaid: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: "INR",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSubscriptionSchema.index({ userId: 1, status: 1, expiresAt: -1 });
userSubscriptionSchema.index({ profileId: 1, status: 1 });

const UserSubscription =
  mongoose.models.UserSubscription ||
  mongoose.model("UserSubscription", userSubscriptionSchema);

export default UserSubscription;
