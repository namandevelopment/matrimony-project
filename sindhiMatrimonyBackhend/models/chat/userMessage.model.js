import mongoose from "mongoose";

const { Schema } = mongoose;

const userMessageSchema = new Schema(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "UserConversation",
      required: true,
      index: true,
    },
    senderUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    senderProfileId: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
      index: true,
    },
    recipientUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    recipientProfileId: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
      index: true,
    },
    messageType: {
      type: String,
      enum: ["TEXT", "IMAGE", "INTEREST", "SYSTEM"],
      default: "TEXT",
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    attachments: [
      {
        url: { type: String, trim: true },
        fileType: { type: String, default: "IMAGE" },
      },
    ],
    status: {
      type: String,
      enum: ["SENT", "DELIVERED", "READ"],
      default: "SENT",
      index: true,
    },
    isTrialMessage: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: {
      type: Number,
      default: null,
    },
    deliveredAt: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userMessageSchema.index({ conversationId: 1, createdAt: -1 });
userMessageSchema.index({ senderUserId: 1, isTrialMessage: 1 });
userMessageSchema.index({ recipientUserId: 1, status: 1 });

const UserMessage =
  mongoose.models.UserMessage ||
  mongoose.model("UserMessage", userMessageSchema);

export default UserMessage;
