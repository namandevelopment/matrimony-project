import mongoose from "mongoose";

const { Schema } = mongoose;

const auditLogSchema = new Schema(
  {
    actorEmployeeId: {
      type: String,
      default: "SYSTEM",
      index: true,
    },
    actorNameSnapshot: {
      type: String,
      default: "System",
    },
    targetEmployeeId: {
      type: String,
      default: null,
      index: true,
    },
    targetNameSnapshot: {
      type: String,
      default: null,
    },
    action: {
      type: String,
      required: true,
      index: true,
    },
    module: {
      type: String,
      required: true,
      default: "EMPLOYEES",
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    before: {
      type: Schema.Types.Mixed,
      default: null,
    },
    after: {
      type: Schema.Types.Mixed,
      default: null,
    },
    ipAddress: {
      type: String,
      default: "",
    },
    userAgent: {
      type: String,
      default: "",
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

auditLogSchema.index({ module: 1, action: 1, timestamp: -1 });

const AuditLog = mongoose.models.AuditLog || mongoose.model("AuditLog", auditLogSchema);

export default AuditLog;

