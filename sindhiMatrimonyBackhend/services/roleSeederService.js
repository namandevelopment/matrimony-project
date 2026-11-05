import Role from "../models/roles/role.model.js";
import { logMessage } from "../utils/globalFunction.js";
import mongoose from "mongoose";

const ALL_SECTIONS = [
  "dashboard", "leads", "tasks", "chat", "matchmaking", "match_responses",
  "horoscope", "member_search", "members", "verifications", "finance",
  "employees", "settings", "tools", "master_settings", "success_stories",
  "reviews", "safety", "campaigns", "notifications", "help_support"
];

export const INITIAL_12_ROLES = [
  {
    code: "SUPER_ADMIN",
    name: "Super Administrator",
    department: "Executive Management",
    description: "Complete full platform clearance, staff management, audit log vault & system control.",
    hierarchyLevel: 1,
    canManageEmployees: true,
    canManageRoles: true,
    canManagePermissions: true,
    canViewAuditLogs: true,
    isSystemRole: true,
    allowedSections: ALL_SECTIONS,
    permissions: {
      leads: { view: true, edit: true, create: true, delete: true, assign: true, export: true, call: true },
      members: { view: true, edit: true, create: true, delete: true, verify: true, export: true },
      finance: { view: true, edit: true, refund: true, export: true },
      ads: { view: true, create: true, edit: true, pause: true },
      reports: { view: true, export: true },
      chat: { view: true, receive: true, initiate: true },
      settings: { view: true, edit: true, manage: true },
      employees: { view: true, edit: true, create: true, delete: true, manage_roles: true },
    },
  },
  {
    code: "ADMIN",
    name: "Operations Administrator",
    department: "Operations",
    description: "Enterprise operations management, team lead supervision and operational workflows.",
    hierarchyLevel: 2,
    canManageEmployees: true,
    canManageRoles: false,
    canManagePermissions: true,
    canViewAuditLogs: true,
    isSystemRole: true,
    allowedSections: ALL_SECTIONS.filter((s) => s !== "master_settings"),
    permissions: {
      leads: { view: true, edit: true, create: true, delete: false, assign: true, export: true, call: true },
      members: { view: true, edit: true, create: true, delete: false, verify: true, export: true },
      finance: { view: true, edit: true, refund: false, export: true },
      ads: { view: true, create: true, edit: true, pause: true },
      reports: { view: true, export: true },
      chat: { view: true, receive: true, initiate: true },
      settings: { view: true, edit: true, manage: false },
      employees: { view: true, edit: true, create: true, delete: false, manage_roles: false },
    },
  },
  {
    code: "CRM_MANAGER",
    name: "CRM Team Lead",
    department: "Sales & CRM",
    description: "Team performance tracking, 20-batch lead allocation and client escalation handling.",
    hierarchyLevel: 3,
    canManageEmployees: true,
    canManageRoles: false,
    canManagePermissions: false,
    canViewAuditLogs: false,
    isSystemRole: true,
    allowedSections: [
      "dashboard", "leads", "tasks", "chat", "matchmaking", "match_responses",
      "horoscope", "member_search", "members", "employees", "notifications",
      "help_support", "success_stories", "reviews", "safety", "campaigns"
    ],
    permissions: {
      leads: { view: true, edit: true, create: true, delete: false, assign: true, export: true, call: true },
      members: { view: true, edit: true, create: false, delete: false, verify: false, export: true },
      chat: { view: true, receive: true, initiate: true },
    },
  },
  {
    code: "CRM_AGENT",
    name: "CRM Sales Agent",
    department: "Sales & CRM",
    description: "Customer onboarding calls, proposal dispatch and follow-up closure.",
    hierarchyLevel: 4,
    canManageEmployees: false,
    canManageRoles: false,
    canManagePermissions: false,
    canViewAuditLogs: false,
    isSystemRole: true,
    allowedSections: [
      "dashboard", "leads", "tasks", "chat", "member_search", "matchmaking",
      "match_responses", "horoscope", "notifications", "help_support", "success_stories"
    ],
    permissions: {
      leads: { view: true, edit: true, create: true, delete: false, assign: false, export: false, call: true },
      chat: { view: true, receive: true, initiate: true },
    },
  },
  {
    code: "MATCHMAKER",
    name: "Senior Matchmaker",
    department: "Matchmaking Desk",
    description: "Kundli matching, personalized proposal recommendations and family meeting liaison.",
    hierarchyLevel: 4,
    canManageEmployees: false,
    canManageRoles: false,
    canManagePermissions: false,
    canViewAuditLogs: false,
    isSystemRole: true,
    allowedSections: [
      "dashboard", "leads", "chat", "matchmaking", "match_responses",
      "horoscope", "member_search", "members", "notifications", "help_support", "success_stories"
    ],
    permissions: {
      members: { view: true, edit: true, create: false, delete: false, verify: false, export: false },
      leads: { view: true, edit: false, create: false, delete: false, assign: false, export: false, call: true },
      chat: { view: true, receive: true, initiate: true },
    },
  },
  {
    code: "FINANCE_MANAGER",
    name: "Finance & Accounts Head",
    department: "Finance & Accounts",
    description: "Revenue auditing, subscription ledger controls and refund approval authorization.",
    hierarchyLevel: 3,
    canManageEmployees: false,
    canManageRoles: false,
    canManagePermissions: false,
    canViewAuditLogs: true,
    isSystemRole: true,
    allowedSections: ["dashboard", "finance", "settings", "notifications"],
    permissions: {
      finance: { view: true, edit: true, refund: true, export: true },
    },
  },
  {
    code: "FINANCE_STAFF",
    name: "Finance Executive",
    department: "Finance & Accounts",
    description: "Billing transactions, receipt generation and ledger reconciliation.",
    hierarchyLevel: 4,
    canManageEmployees: false,
    canManageRoles: false,
    canManagePermissions: false,
    canViewAuditLogs: false,
    isSystemRole: true,
    allowedSections: ["dashboard", "finance", "notifications"],
    permissions: {
      finance: { view: true, edit: false, refund: false, export: true },
    },
  },
  {
    code: "MODERATOR",
    name: "Profile & Content Moderator",
    department: "Trust & Safety",
    description: "Candidate profile screening, photo approvals and community guidelines enforcement.",
    hierarchyLevel: 4,
    canManageEmployees: false,
    canManageRoles: false,
    canManagePermissions: false,
    canViewAuditLogs: false,
    isSystemRole: true,
    allowedSections: ["dashboard", "verifications", "reviews", "success_stories", "members", "safety"],
    permissions: {
      members: { view: true, edit: true, create: false, delete: false, verify: true, export: false },
    },
  },
  {
    code: "TRUST_SAFETY",
    name: "Trust & Safety Lead",
    department: "Trust & Safety",
    description: "Fraud prevention, identity document forensics (Aadhaar KYC) and harassment escalations.",
    hierarchyLevel: 3,
    canManageEmployees: false,
    canManageRoles: false,
    canManagePermissions: false,
    canViewAuditLogs: true,
    isSystemRole: true,
    allowedSections: ["dashboard", "safety", "verifications", "reviews", "members", "notifications"],
    permissions: {
      members: { view: true, edit: true, create: false, delete: true, verify: true, export: true },
    },
  },
  {
    code: "AD_MANAGER",
    name: "Growth & Campaign Manager",
    department: "Marketing",
    description: "Festival discounts, popups, promotional broadcasts and user engagement metrics.",
    hierarchyLevel: 4,
    canManageEmployees: false,
    canManageRoles: false,
    canManagePermissions: false,
    canViewAuditLogs: false,
    isSystemRole: true,
    allowedSections: ["dashboard", "campaigns", "notifications"],
    permissions: {
      ads: { view: true, create: true, edit: true, pause: true },
    },
  },
  {
    code: "SUPPORT_AGENT",
    name: "Customer Support Executive",
    department: "Help & Support",
    description: "Member issue resolution, call inquiries, and portal help desk ticketing.",
    hierarchyLevel: 4,
    canManageEmployees: false,
    canManageRoles: false,
    canManagePermissions: false,
    canViewAuditLogs: false,
    isSystemRole: true,
    allowedSections: ["dashboard", "help_support", "chat", "notifications"],
    permissions: {
      chat: { view: true, receive: true, initiate: true },
    },
  },
  {
    code: "ANALYST",
    name: "Business Intelligence Analyst",
    department: "Executive Management",
    description: "Conversion metrics, revenue cohorts, agent KPIs and executive report exports.",
    hierarchyLevel: 4,
    canManageEmployees: false,
    canManageRoles: false,
    canManagePermissions: false,
    canViewAuditLogs: false,
    isSystemRole: true,
    allowedSections: ["dashboard", "leads", "members", "finance", "notifications"],
    permissions: {
      reports: { view: true, export: true },
      leads: { view: true, export: true },
      members: { view: true, export: true },
      finance: { view: true, export: true },
    },
  },
];

export async function seedInitialRoles() {
  if (mongoose.connection.readyState !== 1) return;

  try {
    for (const r of INITIAL_12_ROLES) {
      const existing = await Role.findOne({ code: r.code });
      if (!existing) {
        await Role.create({ ...r, isActive: true });
        logMessage(`🛡️ Seeded RBAC Role: ${r.code} (${r.name})`, null, "info");
      }
    }
  } catch (err) {
    logMessage(`Notice during role seeding: ${err?.message || err}`, null, "warn");
  }
}

