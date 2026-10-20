import mongoose from "mongoose";

const { Schema } = mongoose;

const processStepSchema = new Schema(
  {
    stepNumber: {
      type: Number,
      required: true,
    },
    stepKey: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true,
    },
    detailedDescription: {
      type: String,
      default: "",
      trim: true,
    },
    icon: {
      type: String,
      default: "Sparkles",
      trim: true,
    },
    badge: {
      type: String,
      default: "",
      trim: true,
    },
    highlights: {
      type: [String],
      default: [],
    },
    tips: {
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

const featurePillarSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, default: "CheckCircle2" },
    badge: { type: String, default: "" },
  },
  { _id: false }
);

const processStatSchema = new Schema(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
    suffix: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { _id: false }
);

const processFaqSchema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { _id: false }
);

const ourProcessSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      default: "Our Matchmaking Process",
      trim: true,
    },
    subtitle: {
      type: String,
      required: true,
      default: "A dignified, 4-step journey designed exclusively for Sindhi families worldwide.",
      trim: true,
    },
    badge: {
      type: String,
      default: "Simple • Secure • Trusted",
      trim: true,
    },
    tagline: {
      type: String,
      default: "From first introduction to Vivah — guided every step of the way.",
      trim: true,
    },
    steps: {
      type: [processStepSchema],
      default: [],
    },
    featurePillars: {
      type: [featurePillarSchema],
      default: [],
    },
    stats: {
      type: [processStatSchema],
      default: [],
    },
    faqs: {
      type: [processFaqSchema],
      default: [],
    },
    cta: {
      title: { type: String, default: "Ready to Find Your Life Partner?" },
      subtitle: { type: String, default: "Join over 50,000+ verified Sindhi singles and families today." },
      buttonText: { type: String, default: "Register Free Today" },
      buttonLink: { type: String, default: "/#quick-register" },
    },
    version: {
      type: String,
      default: "1.0.0",
      trim: true,
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

const OurProcess =
  mongoose.models.OurProcess || mongoose.model("OurProcess", ourProcessSchema);

export default OurProcess;
