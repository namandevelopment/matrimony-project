import mongoose from "mongoose";

const { Schema } = mongoose;

const contactUnlockSchema = new Schema(
  {
    viewerUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    candidateProfileId: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
      index: true,
    },
    creditsCharged: {
      type: Number,
      default: 1,
    },
    unlockedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

contactUnlockSchema.index({ viewerUserId: 1, candidateProfileId: 1 }, { unique: true });

const ContactUnlock =
  mongoose.models.ContactUnlock ||
  mongoose.model("ContactUnlock", contactUnlockSchema);

export default ContactUnlock;

