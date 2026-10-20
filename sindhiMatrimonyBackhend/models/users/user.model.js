import mongoose from "mongoose";
import { addTimeStamp } from "../../utils/globalFunction.js";
import { ROLES, ACCOUNT_STATUS } from "../../utils/variables.js";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    phone: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    countryCode: {
      type: String,
      default: "+91",
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true,
      index: true,
    },
    password: {
      type: String,
      select: false, // Hidden by default for security
    },
    role: {
      type: Number,
      default: ROLES.USER,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(ACCOUNT_STATUS),
      default: ACCOUNT_STATUS.ACTIVE,
      index: true,
    },
    // Reference to the currently active profile selected by the user
    activeProfileId: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
      default: null,
    },
    // Maximum profiles allowed per mobile account (anti-abuse limit)
    maxProfilesAllowed: {
      type: Number,
      default: 4,
      max: 6,
    },
    // Free trial chat messages used (Max 5 for free users before requiring paid plan)
    chatTrialMessagesUsed: {
      type: Number,
      default: 0,
      min: 0,
    },
    isPhoneVerified: {
      type: Boolean,
      default: true,
      index: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isKycVerified: {
      type: Boolean,
      default: false,
      index: true,
    },
    fcmTokens: {
      type: [String],
      default: [],
    },
    clientPlatform: {
      type: String,
      enum: ["MOBILE", "WEB", "UNKNOWN"],
      default: "WEB",
    },
    onboardingStep: {
      type: Number,
      default: 1, // 1 to 7
      min: 1,
      max: 7,
    },
    isOnboardingComplete: {
      type: Boolean,
      default: false,
      index: true,
    },
    lastLoginAt: {
      type: Number,
    },
    lastActiveAt: {
      type: Number,
    },
    ...addTimeStamp(),
  },
  {
    timestamps: true,
  }
);

// Compound indexes for ultra-fast query matching
userSchema.index({ phone: 1, isDeleted: 1 });
userSchema.index({ status: 1, isDeleted: 1 });

export const User = mongoose.model("User", userSchema);
export default User;
