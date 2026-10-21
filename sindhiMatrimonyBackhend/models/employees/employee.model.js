import mongoose from "mongoose";
import { ROLES } from "../../utils/variables.js";

const { Schema } = mongoose;

const employeeSchema = new Schema(
  {
    employeeId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      index: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    mobile: {
      type: String,
      trim: true,
      default: "",
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    password: {
      type: String,
      select: false, // Hidden by default for security
    },
    role: {
      type: String,
      default: "SUPER_ADMIN",
      index: true,
    },
    roleCode: {
      type: Number,
      default: ROLES.SUPER_ADMIN,
    },
    department: {
      type: String,
      default: "Executive Management",
    },
    designation: {
      type: String,
      default: "Super Administrator",
    },
    team: {
      type: String,
      default: "Executive Leadership",
    },
    managerId: {
      type: String,
      default: null,
    },
    managerName: {
      type: String,
      default: null,
    },
    recordScope: {
      type: String,
      enum: ["ALL", "BRANCH", "OWN", "ASSIGNED", "TEAM", "REGION"],
      default: "ALL",
    },
    permissions: {
      type: Schema.Types.Mixed,
      default: () => ({
        leads: { view: true, edit: true, create: true, delete: true, assign: true, export: true, call: true },
        members: { view: true, edit: true, create: true, delete: true, verify: true, export: true },
        finance: { view: true, edit: true, refund: true, export: true },
        ads: { view: true, create: true, edit: true, pause: true },
        reports: { view: true, export: true },
        chat: { view: true, receive: true, initiate: true },
        settings: { view: true, edit: true, manage: true },
      }),
    },
    allowedSections: {
      type: [String],
      default: () => [
        "dashboard",
        "leads",
        "tasks",
        "chat",
        "matchmaking",
        "match_responses",
        "horoscope",
        "member_search",
        "members",
        "verifications",
        "finance",
        "employees",
        "plans",
        "campaigns",
        "reviews",
        "success_stories",
        "safety",
        "help_support",
        "notifications",
        "master_settings",
        "settings",
      ],
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isChatEnabled: {
      type: Boolean,
      default: true,
    },
    maxLeadCapacity: {
      type: Number,
      default: 100,
    },
    activeLeadsCount: {
      type: Number,
      default: 0,
    },
    regions: {
      type: [String],
      default: ["Mumbai", "Pune", "Delhi NCR", "Ahmedabad", "Dubai", "Jaipur", "Indore", "Bangalore"],
    },
    languages: {
      type: [String],
      default: ["Sindhi", "Hindi", "English"],
    },
    isMfaEnabled: {
      type: Boolean,
      default: false,
    },
    mfaSecret: {
      type: String,
      select: false,
      default: null,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
    lastActiveAt: {
      type: String,
      default: "Just now",
    },
    avatarUrl: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save normalization: sync phone & mobile
employeeSchema.pre("save", function (next) {
  if (this.mobile && !this.phone) {
    this.phone = this.mobile;
  } else if (this.phone && !this.mobile) {
    this.mobile = this.phone;
  }
  next();
});

const Employee = mongoose.models.Employee || mongoose.model("Employee", employeeSchema);
export default Employee;
