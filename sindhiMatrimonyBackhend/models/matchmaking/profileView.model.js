import mongoose from "mongoose";

const { Schema } = mongoose;

const profileViewSchema = new Schema(
  {
    // The candidate who viewed the other profile
    viewerUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    viewerProfileId: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
      index: true,
    },
    // The candidate whose profile was viewed
    viewedUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    viewedProfileId: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
      index: true,
    },
    viewedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    viewCount: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// High-speed compound indexes for "Who Viewed You" and "Profiles You Viewed"
profileViewSchema.index({ viewedUserId: 1, viewedAt: -1 });
profileViewSchema.index({ viewerUserId: 1, viewedAt: -1 });
profileViewSchema.index({ viewerUserId: 1, viewedProfileId: 1 });

const ProfileView =
  mongoose.models.ProfileView ||
  mongoose.model("ProfileView", profileViewSchema);

export default ProfileView;
