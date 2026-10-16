import mongoose from "mongoose";
import { addTimeStamp } from "../../utils/globalFunction.js";
import {
  GENDER,
  MARITAL_STATUS,
  MANGLIK_STATUS,
  SINDHI_SUBCASTES,
  KYC_STATUS,
  MEMBERSHIP_TIERS,
} from "../../utils/variables.js";

const { Schema } = mongoose;

const profileSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    profileFor: {
      type: String,
      enum: ["MYSELF", "SON", "DAUGHTER", "BROTHER", "SISTER", "FRIEND", "RELATIVE"],
      default: "MYSELF",
    },
    gender: {
      type: String,
      enum: GENDER,
      required: true,
      index: true,
    },
    dateOfBirth: {
      type: Number, // Timestamp in ms
    },
    age: {
      type: Number,
      index: true,
    },
    height: {
      type: Number, // in centimeters (e.g. 172)
    },
    maritalStatus: {
      type: String,
      enum: MARITAL_STATUS,
      default: "NEVER_MARRIED",
      index: true,
    },
    // Sindhi Cultural Hierarchy
    subcaste: {
      type: String,
      enum: SINDHI_SUBCASTES,
      default: "Amil",
      index: true,
    },
    gotra: {
      type: String,
      trim: true,
      index: true,
    },
    motherGotra: {
      type: String,
      trim: true,
    },
    manglik: {
      type: String,
      enum: MANGLIK_STATUS,
      default: "DONT_KNOW",
      index: true,
    },
    // Education & Career
    education: {
      degree: { type: String, trim: true },
      field: { type: String, trim: true },
      college: { type: String, trim: true },
    },
    profession: {
      occupation: { type: String, trim: true },
      companyName: { type: String, trim: true },
      annualIncome: { type: Number, default: 0 },
      currency: { type: String, default: "INR" },
    },
    // Location & Origins
    location: {
      city: { type: String, trim: true, index: true },
      state: { type: String, trim: true },
      country: { type: String, default: "India", trim: true },
      nativePlace: { type: String, trim: true }, // Ancestral city in Sindh
    },
    // Family Background
    family: {
      fatherName: { type: String, trim: true },
      fatherOccupation: { type: String, trim: true },
      motherName: { type: String, trim: true },
      motherOccupation: { type: String, trim: true },
      brothersCount: { type: Number, default: 0 },
      sistersCount: { type: Number, default: 0 },
      familyType: { type: String, enum: ["NUCLEAR", "JOINT"], default: "NUCLEAR" },
      familyValues: { type: String, enum: ["TRADITIONAL", "MODERATE", "LIBERAL"], default: "MODERATE" },
    },
    aboutMe: {
      type: String,
      trim: true,
      maxlength: 1500,
    },
    // Media & Photos
    avatar: {
      type: String, // Main display profile picture URL
      default: "",
    },
    photos: [
      {
        url: { type: String, required: true },
        isProfilePicture: { type: Boolean, default: false },
        privacy: { type: String, enum: ["PUBLIC", "BLURRED", "PRIVATE"], default: "PUBLIC" },
        createdAt: { type: Number, default: () => Date.now() },
      },
    ],
    // Trust & Moderation
    verificationBadge: {
      type: String,
      enum: Object.values(KYC_STATUS),
      default: KYC_STATUS.NOT_SUBMITTED,
      index: true,
    },
    membershipTier: {
      type: String,
      enum: Object.values(MEMBERSHIP_TIERS),
      default: MEMBERSHIP_TIERS.FREE,
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    ...addTimeStamp(),
  },
  {
    timestamps: true,
  }
);

// High-speed matchmaking compound indexes
profileSchema.index({ gender: 1, subcaste: 1, age: 1, isDeleted: 1 });
profileSchema.index({ gender: 1, "location.city": 1, isDeleted: 1 });
profileSchema.index({ membershipTier: 1, isDeleted: 1 });

export const Profile = mongoose.model("Profile", profileSchema);
export default Profile;
