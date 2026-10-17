import mongoose from "mongoose";
import { addTimeStamp } from "../../utils/globalFunction.js";

const { Schema } = mongoose;

export const ACCESS_ROLES = {
  OWNER: "OWNER",             // Full read/write, delete, transfer, payment
  CO_MANAGER: "CO_MANAGER",   // Read/write biodata, send interests, accept chats
  VIEWER: "VIEWER",           // Read-only access to matches and profiles
};

const profileAccessGrantSchema = new Schema(
  {
    profileId: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
      index: true,
    },
    // The user who was granted access
    granteeUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    // The owner user who granted the access
    grantedByUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    accessRole: {
      type: String,
      enum: Object.values(ACCESS_ROLES),
      default: ACCESS_ROLES.VIEWER,
      required: true,
    },
    relationshipToCandidate: {
      type: String,
      enum: ["PARENT", "SIBLING", "RELATIVE", "MATCHMAKER", "SELF"],
      default: "PARENT",
    },
    status: {
      type: String,
      enum: ["ACTIVE", "REVOKED", "PENDING_ACCEPTANCE"],
      default: "ACTIVE",
      index: true,
    },
    ...addTimeStamp(),
  },
  { timestamps: true }
);

profileAccessGrantSchema.index({ profileId: 1, granteeUserId: 1 }, { unique: true });
profileAccessGrantSchema.index({ granteeUserId: 1, status: 1, isDeleted: 1 });

export const ProfileAccessGrant = mongoose.model("ProfileAccessGrant", profileAccessGrantSchema);
export default ProfileAccessGrant;
