import mongoose from "mongoose";

const notificationPreferenceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    interests: {
      push: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
      inApp: { type: Boolean, default: true },
    },
    profileViews: {
      push: { type: Boolean, default: true },
      email: { type: Boolean, default: false },
      inApp: { type: Boolean, default: true },
    },
    matches: {
      push: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
      inApp: { type: Boolean, default: true },
    },
    chat: {
      push: { type: Boolean, default: true },
      email: { type: Boolean, default: false },
      inApp: { type: Boolean, default: true },
    },
    subscription: {
      push: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
      inApp: { type: Boolean, default: true },
    },
    promotions: {
      push: { type: Boolean, default: false },
      email: { type: Boolean, default: false },
      inApp: { type: Boolean, default: true },
    },
    system: {
      // Mandatory security & system alerts cannot be disabled via promotional preferences
      push: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
      inApp: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
  }
);

const NotificationPreference =
  mongoose.models.NotificationPreference ||
  mongoose.model("NotificationPreference", notificationPreferenceSchema);

export default NotificationPreference;

