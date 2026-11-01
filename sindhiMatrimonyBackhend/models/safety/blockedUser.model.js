import mongoose from "mongoose";

const { Schema } = mongoose;

const blockedUserSchema = new Schema(
  {
    blockerUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    blockedUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    reason: {
      type: String,
      default: "User requested block",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

blockedUserSchema.index({ blockerUserId: 1, blockedUserId: 1 }, { unique: true });

const BlockedUser =
  mongoose.models.BlockedUser ||
  mongoose.model("BlockedUser", blockedUserSchema);

export default BlockedUser;

