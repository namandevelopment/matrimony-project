import mongoose from "mongoose";

const { Schema } = mongoose;

const roleSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    description: {
      type: String,
      default: "",
    },
    department: {
      type: String,
      default: "General",
    },
    hierarchyLevel: {
      type: Number,
      default: 5,
      index: true,
    },
    canManageEmployees: {
      type: Boolean,
      default: false,
    },
    canManageRoles: {
      type: Boolean,
      default: false,
    },
    canManagePermissions: {
      type: Boolean,
      default: false,
    },
    canViewAuditLogs: {
      type: Boolean,
      default: false,
    },
    isSystemRole: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    allowedSections: {
      type: [String],
      default: ["dashboard"],
    },
    permissions: {
      type: Schema.Types.Mixed,
      default: () => ({}),
    },
    createdBy: {
      type: String,
      default: "SYSTEM",
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

roleSchema.index({ code: 1, isActive: 1 });

const Role = mongoose.models.Role || mongoose.model("Role", roleSchema);

export default Role;

