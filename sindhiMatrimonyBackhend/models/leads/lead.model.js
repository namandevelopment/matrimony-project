import mongoose from "mongoose";

const { Schema } = mongoose;

const leadSchema = new Schema(
  {
    leadId: {
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
    mobile: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    city: {
      type: String,
      trim: true,
      index: true,
    },
    subcaste: {
      type: String,
      default: "",
    },
    candidateProfileId: {
      type: String,
      default: null,
      index: true,
    },
    source: {
      type: String,
      default: "MANUAL",
    },
    status: {
      type: String,
      enum: ["NEW", "CONTACTED", "INTERESTED", "FOLLOW_UP", "CONVERTED", "DROPPED"],
      default: "NEW",
      index: true,
    },
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
      default: "MEDIUM",
      index: true,
    },
    assignedEmployeeId: {
      type: String,
      default: null,
      index: true,
    },
    owner: {
      _id: { type: String, default: null },
      name: { type: String, default: null },
      email: { type: String, default: null },
    },
    teamId: {
      type: String,
      default: null,
      index: true,
    },
    regions: {
      type: [String],
      default: [],
    },
    slaStatus: {
      type: String,
      default: "ON_TIME",
    },
    notes: [
      {
        noteText: String,
        author: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    timeline: [
      {
        type: { type: String },
        description: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    nextFollowUp: {
      type: Date,
      default: null,
    },
    lastContactedAt: {
      type: Date,
      default: null,
    },
    createdBy: {
      type: String,
      default: "SYSTEM",
      index: true,
    },
    updatedBy: {
      type: String,
      default: "SYSTEM",
    },
  },
  {
    timestamps: true,
  }
);

leadSchema.index({ assignedEmployeeId: 1, status: 1 });
leadSchema.index({ status: 1, createdAt: -1 });

const Lead = mongoose.models.Lead || mongoose.model("Lead", leadSchema);

export default Lead;

