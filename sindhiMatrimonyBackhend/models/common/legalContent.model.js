import mongoose from "mongoose";

const { Schema } = mongoose;

const policySectionSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      trim: true,
    },
    number: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    badge: {
      type: String,
      default: null,
      trim: true,
    },
    summary: {
      type: String,
      default: "",
      trim: true,
    },
    paragraphs: {
      type: [String],
      default: [],
    },
    bullets: {
      type: [String],
      default: [],
    },
    highlights: {
      type: [String],
      default: [],
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const legalContentSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      unique: true,
      enum: ["PRIVACY_POLICY", "TERMS_AND_CONDITIONS", "SAFETY_TIPS"],
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    lastUpdatedDate: {
      type: String,
      required: true,
      default: () => new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    },
    effectiveDate: {
      type: String,
      required: true,
      default: "January 1, 2026",
    },
    version: {
      type: String,
      default: "1.0.0",
      trim: true,
    },
    meta: {
      complianceStandard: { type: String, default: "DPDP Act 2023 & IT Act 2000" },
      securityStandard: { type: String, default: "256-Bit SSL Encryption" },
      targetAudience: { type: String, default: "All Registered Members & Visitors" },
    },
    introduction: {
      type: String,
      default: "",
    },
    sections: {
      type: [policySectionSchema],
      default: [],
    },
    assurance: {
      title: { type: String, default: "" },
      description: { type: String, default: "" },
      commitmentBadge: { type: String, default: "" },
    },
    contactInfo: {
      email: { type: String, default: "support@sindhimarriage.in" },
      dpoEmail: { type: String, default: "grievance@sindhimarriage.in" },
      phone: { type: String, default: "8144-77-88-66" },
      address: { type: String, default: "Sindhi Matrimony, Matrimony.com Group, India" },
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

const LegalContent =
  mongoose.models.LegalContent ||
  mongoose.model("LegalContent", legalContentSchema);

export default LegalContent;
