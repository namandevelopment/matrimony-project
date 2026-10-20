import mongoose from "mongoose";

const { Schema } = mongoose;

const replySchema = new Schema(
  {
    senderType: {
      type: String,
      enum: ["USER", "ADMIN", "AGENT", "SYSTEM"],
      required: true,
    },
    senderName: {
      type: String,
      default: "Support Representative",
    },
    message: {
      type: String,
      required: true,
    },
    attachments: {
      type: [String],
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const supportTicketSchema = new Schema(
  {
    ticketId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "GENERAL",
        "PROFILE_VERIFICATION",
        "MEMBERSHIP_BILLING",
        "CHAT_MESSAGES",
        "PRIVACY_PHOTO",
        "KUNDALI_ASTROLOGY",
        "SAFETY_REPORTING",
        "OTHER",
      ],
      default: "GENERAL",
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"],
      default: "OPEN",
      index: true,
    },
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
      default: "MEDIUM",
      index: true,
    },
    source: {
      type: String,
      enum: ["WEB", "MOBILE_APP", "WHATSAPP", "PHONE"],
      default: "WEB",
    },
    replies: {
      type: [replySchema],
      default: [],
    },
    assignedAgentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

supportTicketSchema.index({ status: 1, createdAt: -1 });

const SupportTicket =
  mongoose.models.SupportTicket ||
  mongoose.model("SupportTicket", supportTicketSchema);

export default SupportTicket;
