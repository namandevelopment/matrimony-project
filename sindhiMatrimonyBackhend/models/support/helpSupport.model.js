import mongoose from "mongoose";

const { Schema } = mongoose;

const supportChannelSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, default: "" },
    value: { type: String, required: true },
    displayValue: { type: String, required: true },
    actionLabel: { type: String, required: true },
    actionHref: { type: String, required: true },
    timing: { type: String, default: "" },
    badge: { type: String, default: "" },
    iconType: { type: String, enum: ["phone", "message", "mail", "shield"], default: "phone" },
    isPrimary: { type: Boolean, default: false },
  },
  { _id: false }
);

const helpCategorySchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    shortTitle: { type: String, default: "" },
    description: { type: String, default: "" },
    iconName: { type: String, default: "HelpCircle" },
  },
  { _id: false }
);

const faqItemSchema = new Schema(
  {
    id: { type: String, required: true },
    categoryId: { type: String, required: true, index: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    keywords: { type: [String], default: [] },
    isHelpfulCount: { type: Number, default: 0 },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { _id: false }
);

const guidelineItemSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    points: { type: [String], default: [] },
    iconName: { type: String, default: "Shield" },
    badge: { type: String, default: "" },
  },
  { _id: false }
);

const helpSupportSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "DEFAULT_HELP_SUPPORT",
      index: true,
    },
    title: {
      type: String,
      default: "Sindhi Matrimony Help & Member Support Desk",
    },
    channels: {
      type: [supportChannelSchema],
      default: [],
    },
    categories: {
      type: [helpCategorySchema],
      default: [],
    },
    faqs: {
      type: [faqItemSchema],
      default: [],
    },
    guidelines: {
      type: [guidelineItemSchema],
      default: [],
    },
    grievanceOfficer: {
      name: { type: String, default: "Vipin Narang" },
      designation: { type: String, default: "Grievance Redressal & Data Protection Officer" },
      email: { type: String, default: "grievance@sindhimarriage.in" },
      phone: { type: String, default: "8144-77-88-66" },
      address: { type: String, default: "Sindhi Matrimony Helpdesk, Matrimony.com Group, India" },
      slaHours: { type: Number, default: 24 },
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    version: {
      type: String,
      default: "1.0.0",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const HelpSupport =
  mongoose.models.HelpSupport ||
  mongoose.model("HelpSupport", helpSupportSchema);

export default HelpSupport;
