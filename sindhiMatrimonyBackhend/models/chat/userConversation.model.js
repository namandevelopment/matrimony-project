import mongoose from "mongoose";

const { Schema } = mongoose;

const userConversationSchema = new Schema(
  {
    // The 2 candidate profiles participating in this conversation
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "Profile",
        required: true,
      },
    ],
    // The master user account IDs for fast socket room targeted messaging
    participantUserIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    lastMessage: {
      text: { type: String, default: "" },
      senderProfileId: { type: Schema.Types.ObjectId, ref: "Profile" },
      senderUserId: { type: Schema.Types.ObjectId, ref: "User" },
      timestamp: { type: Number, default: () => Date.now() },
      isRead: { type: Boolean, default: false },
    },
    // Map of profileId (string) -> unread count for that profile
    unreadCounts: {
      type: Map,
      of: Number,
      default: {},
    },
    status: {
      type: String,
      enum: ["ACTIVE", "ARCHIVED", "BLOCKED"],
      default: "ACTIVE",
      index: true,
    },
    blockedBy: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userConversationSchema.index({ participants: 1 });
userConversationSchema.index({ participantUserIds: 1 });
userConversationSchema.index({ "lastMessage.timestamp": -1 });

const UserConversation =
  mongoose.models.UserConversation ||
  mongoose.model("UserConversation", userConversationSchema);

export default UserConversation;
