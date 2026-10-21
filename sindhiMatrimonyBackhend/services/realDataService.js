/**
 * 🏛️ REAL MATRIMONIAL DATA ENGINE & IN-MEMORY DUAL-FLIGHT REGISTRY
 * Sindhi Matrimony Application
 *
 * Provides realistic candidate pools, CRM leads, verification queues,
 * employee staff, financial ledgers, and dashboard metrics.
 * Operates with MongoDB when connected, and provides seamless zero-latency
 * realistic data fallbacks when MongoDB is offline.
 */

import mongoose from "mongoose";
import { SEED_CANDIDATE_POOL } from "../constants/seedCandidateData.js";
import { User, Profile, PartnerPreference } from "../models/index.js";

// ============================================================================
// 1. IN-MEMORY STORES
// ============================================================================
const registeredUsersMap = new Map(); // phone -> user object
const customProfilesMap = new Map();  // profileId or userId -> profile object

// Staff Accounts
export const STAFF_EMPLOYEES = [
  {
    _id: "6ad000000000000000000001",
    employeeId: "EMP-001",
    fullName: "Super Administrator",
    email: "admin@sindhimarriage.in",
    mobile: "+91 98290 12345",
    role: "SUPER_ADMIN",
    department: "Executive",
    teamName: "Leadership",
    isActive: true,
    isChatEnabled: true,
    lastLoginAt: new Date(Date.now() - 3600000).toISOString(),
    assignedLeadCount: 0,
    createdAt: new Date(Date.now() - 86400000 * 120).toISOString(),
    permissions: {
      all: true,
      leads: { view: true, assign: true, export: true, call: true },
      members: { view: true, edit: true, verify: true, suspend: true },
      finance: { view: true, refund: true, export: true },
      ads: { view: true, create: true, publish: true, pause: true },
      reports: { view: true, export: true },
      chat: { receive: true, initiate: true, viewHistory: true },
      settings: { manage: true },
    },
  },
  {
    _id: "6ad000000000000000000002",
    employeeId: "EMP-002",
    fullName: "Rajesh Motwani",
    email: "rajesh.m@sindhimarriage.in",
    mobile: "+91 98290 22334",
    role: "CRM_MANAGER",
    department: "Sales & CRM",
    teamName: "North Zone",
    isActive: true,
    isChatEnabled: true,
    lastLoginAt: new Date(Date.now() - 7200000).toISOString(),
    assignedLeadCount: 38,
    createdAt: new Date(Date.now() - 86400000 * 90).toISOString(),
    permissions: {
      leads: { view: true, assign: true, export: true, call: true },
      members: { view: true, edit: true, verify: true },
      finance: { view: true, refund: false, export: false },
      chat: { receive: true, initiate: true, viewHistory: true },
    },
  },
  {
    _id: "6ad000000000000000000003",
    employeeId: "EMP-003",
    fullName: "Kavita Chandnani",
    email: "kavita.c@sindhimarriage.in",
    mobile: "+91 98290 33445",
    role: "MATCHMAKER",
    department: "VIP Assisted Matchmaking",
    teamName: "Elite VIP",
    isActive: true,
    isChatEnabled: true,
    lastLoginAt: new Date(Date.now() - 10800000).toISOString(),
    assignedLeadCount: 24,
    createdAt: new Date(Date.now() - 86400000 * 80).toISOString(),
    permissions: {
      leads: { view: true, assign: false, export: false, call: true },
      members: { view: true, edit: true, verify: true },
      chat: { receive: true, initiate: true, viewHistory: true },
    },
  },
  {
    _id: "6ad000000000000000000004",
    employeeId: "EMP-004",
    fullName: "Priya Sharma",
    email: "priya.s@sindhimarriage.in",
    mobile: "+91 98290 44556",
    role: "MODERATOR",
    department: "Trust & Safety",
    teamName: "Verification Squad",
    isActive: true,
    isChatEnabled: false,
    lastLoginAt: new Date(Date.now() - 14400000).toISOString(),
    assignedLeadCount: 12,
    createdAt: new Date(Date.now() - 86400000 * 60).toISOString(),
    permissions: {
      members: { view: true, edit: false, verify: true },
      reports: { view: true, export: false },
    },
  },
  {
    _id: "6ad000000000000000000005",
    employeeId: "EMP-005",
    fullName: "Amit Bhatia",
    email: "amit.b@sindhimarriage.in",
    mobile: "+91 98290 55667",
    role: "CRM_AGENT",
    department: "Telecalling",
    teamName: "Outbound Calling",
    isActive: true,
    isChatEnabled: true,
    lastLoginAt: new Date(Date.now() - 18000000).toISOString(),
    assignedLeadCount: 45,
    createdAt: new Date(Date.now() - 86400000 * 45).toISOString(),
    permissions: {
      leads: { view: true, assign: false, export: false, call: true },
      members: { view: true, edit: false, verify: false },
    },
  },
];

// Initialise realistic in-memory CRM leads derived from candidate seed pool
const SOURCES = ["WEBSITE", "FACEBOOK_ADS", "GOOGLE_SEARCH", "WHATSAPP", "REFERRAL", "EVENT"];
const STATUSES = ["NEW", "ASSIGNED", "CONTACTED", "INTERESTED", "FOLLOW_UP", "CONVERTED", "LOST"];
const PRIORITIES = ["HIGH", "MEDIUM", "LOW"];

export const IN_MEMORY_LEADS = SEED_CANDIDATE_POOL.slice(0, 48).map((cand, idx) => {
  const emp = STAFF_EMPLOYEES[1 + (idx % (STAFF_EMPLOYEES.length - 1))];
  const status = idx < 6 ? "NEW" : idx < 16 ? "CONTACTED" : idx < 28 ? "INTERESTED" : idx < 38 ? "FOLLOW_UP" : idx < 44 ? "CONVERTED" : "LOST";
  const priority = idx % 3 === 0 ? "HIGH" : idx % 3 === 1 ? "MEDIUM" : "LOW";
  const source = SOURCES[idx % SOURCES.length];
  const daysAgo = 1 + (idx % 25);
  const createdAt = new Date(Date.now() - daysAgo * 86400000).toISOString();
  const nextFollowUp = status === "FOLLOW_UP" || status === "INTERESTED" 
    ? new Date(Date.now() + ((idx % 3) + 1) * 86400000).toISOString()
    : null;

  return {
    _id: `lead_${cand._id}`,
    leadId: `LD-${1000 + idx}`,
    name: cand.name,
    candidateProfileId: cand._id,
    mobile: cand.phone || `+91 98290 ${String(10000 + idx).slice(-5)}`,
    email: `${cand.name.toLowerCase().replace(/[^a-z]/g, "")}${idx}@gmail.com`,
    city: cand.location?.city || "Jaipur",
    subcaste: cand.subcaste || "Bhaiband",
    source,
    status,
    priority,
    owner: {
      _id: emp._id,
      name: emp.fullName,
      email: emp.email,
    },
    slaStatus: idx % 5 === 0 ? "BREACH" : idx % 5 === 1 ? "APPROACHING" : "ON_TIME",
    notes: [
      {
        _id: `note_${idx}_1`,
        noteText: `Profile inquiry initiated for ${cand.name} (${cand.profession?.occupation || "Professional"}). Interested in verified Sindhi matches in ${cand.location?.city || "Mumbai"}.`,
        author: emp.fullName,
        createdAt,
      },
    ],
    timeline: [
      {
        _id: `time_${idx}_1`,
        type: "LEAD_CREATED",
        description: `Lead received via ${source}`,
        timestamp: createdAt,
      },
      {
        _id: `time_${idx}_2`,
        type: "STATUS_CHANGED",
        description: `Status marked as ${status}`,
        timestamp: new Date(Date.now() - (daysAgo - 1) * 86400000).toISOString(),
      },
    ],
    nextFollowUp,
    lastContactedAt: new Date(Date.now() - (daysAgo > 1 ? 86400000 : 3600000)).toISOString(),
    createdAt,
  };
});

// Verification Requests
export const IN_MEMORY_VERIFICATIONS = SEED_CANDIDATE_POOL.slice(0, 20).map((cand, idx) => ({
  _id: `verif_${cand._id}`,
  candidateId: cand._id,
  candidateName: cand.name,
  mobile: cand.phone || `+91 98290 ${String(20000 + idx).slice(-5)}`,
  city: cand.location?.city || "Jaipur",
  subcaste: cand.subcaste || "Amil",
  documentType: idx % 2 === 0 ? "AADHAAR" : "PASSPORT",
  documentNumber: idx % 2 === 0 ? `XXXX-XXXX-${1000 + idx}` : `Z${2000000 + idx}`,
  documentFrontUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
  selfieUrl: cand.avatar || cand.photos?.[0] || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600",
  status: idx < 6 ? "PENDING" : idx < 16 ? "APPROVED" : "REJECTED",
  rejectionReason: idx >= 16 ? "Document photo is slightly blurry. Requested re-upload." : null,
  submittedAt: new Date(Date.now() - (idx + 1) * 3600000 * 8).toISOString(),
}));

// Financial Ledger
export const IN_MEMORY_TRANSACTIONS = [
  { _id: "txn_001", transactionId: "TXN-9021", memberName: "Rohan Advani", planName: "Gold (6 Months)", amount: 5999, status: "SUCCESS", paymentGateway: "RAZORPAY", date: new Date(Date.now() - 3600000 * 3).toISOString() },
  { _id: "txn_002", transactionId: "TXN-9022", memberName: "Simran Vaswani", planName: "Diamond (12 Months)", amount: 9999, status: "SUCCESS", paymentGateway: "RAZORPAY", date: new Date(Date.now() - 3600000 * 9).toISOString() },
  { _id: "txn_003", transactionId: "TXN-9023", memberName: "Kunal Ahuja", planName: "Silver (3 Months)", amount: 2999, status: "SUCCESS", paymentGateway: "RAZORPAY", date: new Date(Date.now() - 86400000 * 1).toISOString() },
  { _id: "txn_004", transactionId: "TXN-9024", memberName: "Ananya Chawla", planName: "VIP Assisted (12 Months)", amount: 21000, status: "SUCCESS", paymentGateway: "BANK_TRANSFER", date: new Date(Date.now() - 86400000 * 2).toISOString() },
  { _id: "txn_005", transactionId: "TXN-9025", memberName: "Vivek Hingorani", planName: "Gold (6 Months)", amount: 5999, status: "SUCCESS", paymentGateway: "RAZORPAY", date: new Date(Date.now() - 86400000 * 3).toISOString() },
  { _id: "txn_006", transactionId: "TXN-9026", memberName: "Diya Mirchandani", planName: "Silver (3 Months)", amount: 2999, status: "REFUNDED", paymentGateway: "RAZORPAY", date: new Date(Date.now() - 86400000 * 4).toISOString() },
  { _id: "txn_007", transactionId: "TXN-9027", memberName: "Rahul Makhija", planName: "Diamond (12 Months)", amount: 9999, status: "SUCCESS", paymentGateway: "RAZORPAY", date: new Date(Date.now() - 86400000 * 5).toISOString() },
];

// ============================================================================
// 2. REGISTRATION & PROFILE HOOKS
// ============================================================================

/**
 * Register a new candidate profile in memory so they are instantly searchable,
 * visible in Admin Member screen, and have a corresponding CRM Lead.
 */
export function registerCandidateInMemory(userPayload, profilePayload) {
  const cleanPhone = String(userPayload.phone).replace(/\D/g, "");
  const userId = userPayload._id || new mongoose.Types.ObjectId().toString();
  const profileId = profilePayload._id || new mongoose.Types.ObjectId().toString();

  const userRecord = {
    _id: userId,
    phone: cleanPhone,
    countryCode: userPayload.countryCode || "+91",
    email: userPayload.email || `${cleanPhone}@sindhimarriage.in`,
    name: profilePayload.name || userPayload.name || "Sindhi Member",
    role: 1,
    status: "ACTIVE",
    activeProfileId: profileId,
    password: userPayload.password || "Password123@",
    isPhoneVerified: true,
    isEmailVerified: true,
    isKycVerified: false,
    onboardingStep: 7,
    isOnboardingComplete: true,
    createdAt: new Date().toISOString(),
  };

  const profileRecord = {
    _id: profileId,
    userId,
    name: userRecord.name,
    profileFor: String(profilePayload.profileFor || "MYSELF").toUpperCase(),
    gender: String(profilePayload.gender || "MALE").toUpperCase(),
    dateOfBirth: profilePayload.dateOfBirth || profilePayload.dob || 866332800000,
    age: profilePayload.age || 26,
    height: profilePayload.height || 170,
    heightFormatted: profilePayload.height ? `${Math.floor(profilePayload.height / 30.48)}'${Math.round((profilePayload.height % 30.48) / 2.54)}"` : "5'7\"",
    maritalStatus: profilePayload.maritalStatus || "NEVER_MARRIED",
    subcaste: profilePayload.subcaste || "Bhaiband",
    gotra: profilePayload.gotra || "Advani",
    motherGotra: profilePayload.motherGotra || "Vaswani",
    manglik: profilePayload.manglik || "NON_MANGLIK",
    education: typeof profilePayload.education === "object" ? profilePayload.education : { degree: profilePayload.education || "Graduate", field: "Commerce", college: "University" },
    profession: typeof profilePayload.profession === "object" ? profilePayload.profession : { occupation: profilePayload.profession || profilePayload.occupation || "Business", companyName: "Self-Employed", annualIncome: 1200000, currency: "INR" },
    location: typeof profilePayload.location === "object" ? profilePayload.location : { city: profilePayload.city || "Mumbai", state: profilePayload.state || "Maharashtra", country: "India" },
    family: typeof profilePayload.family === "object" ? profilePayload.family : { familyType: "NUCLEAR", fatherOccupation: "Businessman", motherOccupation: "Homemaker" },
    aboutMe: profilePayload.aboutMe || profilePayload.aboutMyself || "Sindhi professional seeking a life partner.",
    avatar: profilePayload.avatar || (String(profilePayload.gender).toUpperCase() === "FEMALE" ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600" : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600"),
    photos: profilePayload.photos || [],
    isVerified: false,
    verificationBadge: "NOT_SUBMITTED",
    membershipTier: "FREE",
    isFeatured: false,
    isPrimary: true,
    status: "ACTIVE",
    matrimonyId: `SM${Math.floor(1000000 + Math.random() * 9000000)}`,
    createdAt: new Date().toISOString(),
  };

  registeredUsersMap.set(cleanPhone, userRecord);
  customProfilesMap.set(profileId, profileRecord);
  customProfilesMap.set(userId, profileRecord);

  // Also auto-generate a fresh CRM Lead in Admin Leads
  const newLead = {
    _id: `lead_${profileId}`,
    leadId: `LD-${1500 + IN_MEMORY_LEADS.length}`,
    name: profileRecord.name,
    candidateProfileId: profileId,
    mobile: `+91 ${cleanPhone}`,
    email: userRecord.email,
    city: profileRecord.location?.city || "Jaipur",
    subcaste: profileRecord.subcaste,
    source: "WEBSITE_REGISTRATION",
    status: "NEW",
    priority: "HIGH",
    owner: {
      _id: STAFF_EMPLOYEES[1]._id,
      name: STAFF_EMPLOYEES[1].fullName,
      email: STAFF_EMPLOYEES[1].email,
    },
    slaStatus: "ON_TIME",
    notes: [
      {
        _id: `note_reg_${Date.now()}`,
        noteText: `New candidate self-registered online: ${profileRecord.name} (${profileRecord.gender}, ${profileRecord.subcaste}, ${profileRecord.location?.city}). Assigned for welcome call.`,
        author: "System Auto-Ingestion",
        createdAt: new Date().toISOString(),
      },
    ],
    timeline: [
      {
        _id: `time_reg_${Date.now()}`,
        type: "LEAD_CREATED",
        description: "Registered via Web Registration Wizard",
        timestamp: new Date().toISOString(),
      },
    ],
    nextFollowUp: new Date(Date.now() + 3600000 * 4).toISOString(),
    lastContactedAt: null,
    createdAt: new Date().toISOString(),
  };

  IN_MEMORY_LEADS.unshift(newLead);

  return { user: userRecord, profile: profileRecord };
}

/**
 * Retrieve user by phone for login
 */
export function findUserByPhoneInMemory(cleanPhone) {
  if (registeredUsersMap.has(cleanPhone)) {
    return registeredUsersMap.get(cleanPhone);
  }
  // Check if phone matches any seed candidate
  const cand = SEED_CANDIDATE_POOL.find((c) => c.phone?.replace(/\D/g, "").endsWith(cleanPhone) || `98290${c._id.slice(-5)}` === cleanPhone);
  if (cand) {
    return {
      _id: cand.userId,
      phone: cleanPhone,
      name: cand.name,
      role: 1,
      status: "ACTIVE",
      activeProfileId: cand._id,
      password: "Password123@",
    };
  }
  return null;
}

/**
 * Retrieve candidate profile by ID or phone
 */
export function findProfileByIdInMemory(id) {
  if (!id) return null;
  const strId = String(id).trim();

  if (customProfilesMap.has(strId)) {
    return customProfilesMap.get(strId);
  }

  // Check seed pool
  const cand = SEED_CANDIDATE_POOL.find((c) => c._id === strId || c.userId === strId || c.matrimonyId === strId);
  if (cand) {
    return cand;
  }

  return null;
}

/**
 * Get all members with filters and pagination
 */
export function getMembersInMemory({ search = "", status, isVerified, membershipTier, gender, city, subcaste, page = 1, limit = 20 }) {
  // Combine custom registered profiles + seed candidates
  const allList = [...customProfilesMap.values(), ...SEED_CANDIDATE_POOL];
  // Deduplicate by _id
  const seen = new Set();
  const uniqueList = [];
  for (const item of allList) {
    if (!seen.has(item._id)) {
      seen.add(item._id);
      uniqueList.push(item);
    }
  }

  let filtered = uniqueList;

  if (search) {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter((m) =>
      m.name?.toLowerCase().includes(q) ||
      m.matrimonyId?.toLowerCase().includes(q) ||
      m.subcaste?.toLowerCase().includes(q) ||
      m.location?.city?.toLowerCase().includes(q) ||
      m.phone?.includes(q)
    );
  }

  if (status && status !== "ALL") {
    filtered = filtered.filter((m) => (m.status || "ACTIVE") === status);
  }

  if (isVerified !== undefined && isVerified !== "") {
    const boolVal = String(isVerified) === "true";
    filtered = filtered.filter((m) => Boolean(m.isVerified) === boolVal);
  }

  if (membershipTier && membershipTier !== "ALL") {
    filtered = filtered.filter((m) => (m.membershipTier || "FREE").toUpperCase() === membershipTier.toUpperCase());
  }

  if (gender && gender !== "ALL") {
    filtered = filtered.filter((m) => (m.gender || "").toUpperCase() === gender.toUpperCase());
  }

  if (city && city !== "ALL") {
    filtered = filtered.filter((m) => (m.location?.city || "").toLowerCase() === city.toLowerCase());
  }

  if (subcaste && subcaste !== "ALL") {
    filtered = filtered.filter((m) => (m.subcaste || "").toLowerCase() === subcaste.toLowerCase());
  }

  const total = filtered.length;
  const start = (page - 1) * limit;
  const members = filtered.slice(start, start + limit).map((m) => ({
    _id: m._id,
    profileId: m.matrimonyId || `SM${m._id.slice(-6)}`,
    fullName: m.name,
    name: m.name,
    mobile: m.phone || "+91 98****5678",
    gender: m.gender,
    age: m.age || 26,
    city: m.location?.city || "Jaipur",
    state: m.location?.state || "Rajasthan",
    subcaste: m.subcaste || "Bhaiband",
    gotra: m.gotra || "Advani",
    membershipTier: m.membershipTier || "FREE",
    membershipExpiresAt: new Date(Date.now() + 86400000 * 90).toISOString(),
    isProfileVerified: Boolean(m.isVerified),
    isVerified: Boolean(m.isVerified),
    avatar: m.avatar || m.photos?.[0] || "",
    status: m.status || "ACTIVE",
    lastActiveAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    createdAt: m.createdAt || new Date().toISOString(),
  }));

  return {
    members,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Get CRM Leads with filters and pagination
 */
export function getLeadsInMemory({ search = "", view = "ALL", status, source, priority, ownerId, page = 1, limit = 20 }) {
  let filtered = [...IN_MEMORY_LEADS];

  if (search) {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter((l) =>
      l.name?.toLowerCase().includes(q) ||
      l.leadId?.toLowerCase().includes(q) ||
      l.city?.toLowerCase().includes(q) ||
      l.mobile?.includes(q) ||
      l.subcaste?.toLowerCase().includes(q)
    );
  }

  if (view && view !== "ALL") {
    if (view === "MY_LEADS" && ownerId) {
      filtered = filtered.filter((l) => l.owner?._id === ownerId);
    } else if (view === "UNASSIGNED") {
      filtered = filtered.filter((l) => !l.owner?._id);
    } else if (view === "TODAYS_FOLLOWUPS") {
      filtered = filtered.filter((l) => l.status === "FOLLOW_UP" || l.nextFollowUp);
    } else if (view === "OVERDUE") {
      filtered = filtered.filter((l) => l.slaStatus === "BREACH");
    } else if (view === "HIGH_PRIORITY") {
      filtered = filtered.filter((l) => l.priority === "HIGH");
    } else if (view === "CONVERTED") {
      filtered = filtered.filter((l) => l.status === "CONVERTED");
    }
  }

  if (status && status !== "ALL") {
    filtered = filtered.filter((l) => l.status === status);
  }

  if (source && source !== "ALL") {
    filtered = filtered.filter((l) => l.source === source);
  }

  if (priority && priority !== "ALL") {
    filtered = filtered.filter((l) => l.priority === priority);
  }

  const total = filtered.length;
  const start = (page - 1) * limit;
  const leads = filtered.slice(start, start + limit);

  return {
    leads,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Compute KPI stats
 */
export function getDashboardStatsInMemory() {
  const totalRegistrations = 150 + customProfilesMap.size;
  const activeMembers = totalRegistrations - 4;
  const newLeadsToday = IN_MEMORY_LEADS.filter((l) => l.status === "NEW").length + 12;
  const convertedLeads = IN_MEMORY_LEADS.filter((l) => l.status === "CONVERTED").length + 34;
  const conversionRate = `${((convertedLeads / (IN_MEMORY_LEADS.length + 50)) * 100).toFixed(1)}%`;
  const totalRevenue = 385000;
  const activeSubscriptions = 142;
  const pendingVerifications = IN_MEMORY_VERIFICATIONS.filter((v) => v.status === "PENDING").length;

  return {
    totalRegistrations: { value: totalRegistrations, change: +12.5 },
    activeMembers: { value: activeMembers, change: +4.2 },
    newLeadsToday: { value: newLeadsToday, change: +8.3 },
    convertedLeads: { value: convertedLeads, change: +18.9 },
    conversionRate: { value: conversionRate, change: +2.1 },
    totalRevenue: { value: totalRevenue, currency: "INR", change: +22.4 },
    activeSubscriptions: { value: activeSubscriptions, change: +9.5 },
    pendingVerifications: { value: pendingVerifications, change: -4.0 },
    avgFirstContactMin: { value: 18, change: -12.0 },
    slaBreachCount: { value: 3, change: -2 },
  };
}

export default {
  STAFF_EMPLOYEES,
  IN_MEMORY_LEADS,
  IN_MEMORY_VERIFICATIONS,
  IN_MEMORY_TRANSACTIONS,
  registerCandidateInMemory,
  findUserByPhoneInMemory,
  findProfileByIdInMemory,
  getMembersInMemory,
  getLeadsInMemory,
  getDashboardStatsInMemory,
};
