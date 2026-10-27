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
export { SEED_CANDIDATE_POOL };
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
    avatar: profilePayload.avatar || profilePayload.image || profilePayload.photo || (String(profilePayload.gender).toUpperCase() === "FEMALE" ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600" : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600"),
    photos: profilePayload.photos || (profilePayload.image || profilePayload.photo ? [profilePayload.image || profilePayload.photo] : []),
    isVerified: Boolean(profilePayload.isVerified),
    verificationBadge: profilePayload.isVerified ? "VERIFIED" : "NOT_SUBMITTED",
    membershipTier: profilePayload.membershipTier ? String(profilePayload.membershipTier).toUpperCase() : "FREE",
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
  if (cleanPhone === "9876543210" || cleanPhone === "9829012345") {
    const cand = SEED_CANDIDATE_POOL[0];
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

// ============================================================================
// CURATED FEATURED SINDHI MATCHES POOL (Matches User Panel Cards 1:1)
// ============================================================================
export const CURATED_MATCHES_POOL = [
  {
    _id: "67b34a12c8e312a0f90000a1",
    userId: "67b34a12c8e312a0f9000ba1",
    id: "match-roshni-advani",
    matrimonyId: "SND4486236",
    name: "Roshni Advani",
    gender: "FEMALE",
    age: 24,
    height: 160,
    heightFormatted: "5'3\"",
    maritalStatus: "NEVER_MARRIED",
    subcaste: "Bhaiband",
    gotra: "Advani",
    motherGotra: "Vaswani",
    manglik: "NON_MANGLIK",
    education: { degree: "B.Tech. Computer Science", field: "Engineering", college: "VJTI Mumbai" },
    profession: { occupation: "Senior Software Engineer", companyName: "Tech MNC", annualIncome: 2200000, currency: "INR" },
    location: { city: "Mumbai", state: "Maharashtra", country: "India" },
    family: { familyType: "NUCLEAR", fatherOccupation: "Businessman", motherOccupation: "Homemaker", siblings: "1 Brother" },
    aboutMe: "Born and raised in Mumbai. Working as a Senior Software Engineer. Looking for an educated, understanding partner with progressive values and strong Sindhi cultural roots.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
    photos: [
      { url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80", isProfile: true },
      { url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80", isProfile: false },
    ],
    isVerified: true,
    isFeatured: true,
    membershipTier: "VIP",
    isPrimary: true,
    status: "ACTIVE",
    partnerPreference: {
      ageRange: { min: 25, max: 31 },
      heightRange: { min: 168, max: 185 },
      maritalStatus: ["NEVER_MARRIED"],
      subcastes: ["Bhaiband", "Amil", "Sahiti"],
      manglik: "NON_MANGLIK",
      education: "B.Tech / MBA / CA / Masters",
      occupation: "Software Engineer / Corporate Professional / Business",
      preferredState: "Maharashtra / Gujarat",
    },
  },
  {
    _id: "67b34a12c8e312a0f90000a2",
    userId: "67b34a12c8e312a0f9000ba2",
    id: "match-aisha-bhavnani",
    matrimonyId: "SND4498447",
    name: "Aisha Bhavnani",
    gender: "FEMALE",
    age: 25,
    height: 158,
    heightFormatted: "5'2\"",
    maritalStatus: "NEVER_MARRIED",
    subcaste: "Amil",
    gotra: "Bhavnani",
    motherGotra: "Chhabria",
    manglik: "NON_MANGLIK",
    education: { degree: "MBA Finance", field: "Management", college: "Symbiosis Pune" },
    profession: { occupation: "Investment Banker", companyName: "Global Investment Bank", annualIncome: 2500000, currency: "INR" },
    location: { city: "Pune", state: "Maharashtra", country: "India" },
    family: { familyType: "NUCLEAR", fatherOccupation: "Chartered Accountant", motherOccupation: "Professor", siblings: "1 Sister" },
    aboutMe: "I hold an MBA in Finance from Symbiosis and work in Investment Banking in Pune. I enjoy travelling, literature, and weekend cooking.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80",
    photos: [
      { url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80", isProfile: true },
    ],
    isVerified: true,
    isFeatured: true,
    membershipTier: "DIAMOND",
    isPrimary: true,
    status: "ACTIVE",
    partnerPreference: {
      ageRange: { min: 26, max: 32 },
      heightRange: { min: 170, max: 185 },
      maritalStatus: ["NEVER_MARRIED"],
      subcastes: ["Amil", "Bhaiband"],
      manglik: "ANY",
      education: "MBA / CA / Post Graduate",
      occupation: "Investment / Banking / Finance",
    },
  },
  {
    _id: "67b34a12c8e312a0f90000a3",
    userId: "67b34a12c8e312a0f9000ba3",
    id: "match-simran-motwani",
    matrimonyId: "SND4436421",
    name: "Simran Motwani",
    gender: "FEMALE",
    age: 26,
    height: 163,
    heightFormatted: "5'4\"",
    maritalStatus: "NEVER_MARRIED",
    subcaste: "Bhaiband",
    gotra: "Motwani",
    motherGotra: "Makhija",
    manglik: "NON_MANGLIK",
    education: { degree: "M.S. Data Science", field: "Computer Science", college: "IISc Bengaluru" },
    profession: { occupation: "Lead AI Researcher", companyName: "AI Research Labs", annualIncome: 3200000, currency: "INR" },
    location: { city: "Bengaluru", state: "Karnataka", country: "India" },
    family: { familyType: "JOINT", fatherOccupation: "Industrialist", motherOccupation: "Homemaker", siblings: "2 Brothers" },
    aboutMe: "Lead AI Researcher living in Bengaluru. Passionate about machine learning innovations, Hindustani classical music, and outdoor trekking.",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80",
    photos: [
      { url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80", isProfile: true },
    ],
    isVerified: true,
    isFeatured: true,
    membershipTier: "VIP",
    isPrimary: true,
    status: "ACTIVE",
  },
  {
    _id: "67b34a12c8e312a0f90000a4",
    userId: "67b34a12c8e312a0f9000ba4",
    id: "match-kajal-mirchandani",
    matrimonyId: "SND4489404",
    name: "Kajal Mirchandani",
    gender: "FEMALE",
    age: 24,
    height: 155,
    heightFormatted: "5'1\"",
    maritalStatus: "NEVER_MARRIED",
    subcaste: "Lohana",
    gotra: "Mirchandani",
    motherGotra: "Hingorani",
    manglik: "NON_MANGLIK",
    education: { degree: "Chartered Accountant (CA)", field: "Finance", college: "ICAI" },
    profession: { occupation: "Financial Consultant", companyName: "Big 4 Firm", annualIncome: 2000000, currency: "INR" },
    location: { city: "Ahmedabad", state: "Gujarat", country: "India" },
    family: { familyType: "NUCLEAR", fatherOccupation: "Textile Merchant", motherOccupation: "Homemaker" },
    aboutMe: "Qualified CA working as a Financial Consultant. Simple, family-oriented and ambitious. Love exploring culinary arts.",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80",
    photos: [
      { url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80", isProfile: true },
    ],
    isVerified: true,
    isFeatured: false,
    membershipTier: "GOLD",
    isPrimary: true,
    status: "ACTIVE",
  },
  {
    _id: "67b34a12c8e312a0f90000a5",
    userId: "67b34a12c8e312a0f9000ba5",
    id: "match-pooja-hingorani",
    matrimonyId: "SND4491832",
    name: "Pooja Hingorani",
    gender: "FEMALE",
    age: 25,
    height: 160,
    heightFormatted: "5'3\"",
    maritalStatus: "NEVER_MARRIED",
    subcaste: "Sahiti",
    gotra: "Hingorani",
    education: { degree: "B.Arch", field: "Architecture", college: "CEPT University" },
    profession: { occupation: "Interior Architect", companyName: "Design Studio", annualIncome: 2800000, currency: "INR" },
    location: { city: "Dubai", state: "UAE", country: "UAE" },
    avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=500&auto=format&fit=crop&q=80",
    photos: [{ url: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=500&auto=format&fit=crop&q=80" }],
    isVerified: true,
    isPrimary: true,
    status: "ACTIVE",
  },
  {
    _id: "67b34a12c8e312a0f90000a6",
    userId: "67b34a12c8e312a0f9000ba6",
    id: "match-divya-advani",
    matrimonyId: "SND4481232",
    name: "Dr. Divya Advani",
    gender: "FEMALE",
    age: 27,
    height: 165,
    heightFormatted: "5'5\"",
    maritalStatus: "NEVER_MARRIED",
    subcaste: "Amil",
    gotra: "Advani",
    education: { degree: "MBBS, MD Medicine", field: "Medicine", college: "BJ Medical College" },
    profession: { occupation: "Consultant Physician", companyName: "Hospital", annualIncome: 2600000, currency: "INR" },
    location: { city: "Pune", state: "Maharashtra", country: "India" },
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80",
    photos: [{ url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80" }],
    isVerified: true,
    isPrimary: true,
    status: "ACTIVE",
  },
  {
    _id: "67b34a12c8e312a0f90000a7",
    userId: "67b34a12c8e312a0f9000ba7",
    id: "match-muskan-chawla",
    matrimonyId: "SND4513818",
    name: "Muskan Chawla",
    gender: "FEMALE",
    age: 23,
    height: 158,
    heightFormatted: "5'2\"",
    maritalStatus: "NEVER_MARRIED",
    subcaste: "Sakhrani",
    gotra: "Chawla",
    education: { degree: "M.Com", field: "Commerce", college: "Rajasthan University" },
    profession: { occupation: "Corporate HR Manager", companyName: "Retail Conglomerate", annualIncome: 1400000, currency: "INR" },
    location: { city: "Jaipur", state: "Rajasthan", country: "India" },
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80",
    photos: [{ url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80" }],
    isVerified: true,
    isPrimary: true,
    status: "ACTIVE",
  },
  {
    _id: "67b34a12c8e312a0f90000a8",
    userId: "67b34a12c8e312a0f9000ba8",
    id: "match-karishma-makhija",
    matrimonyId: "SND4472190",
    name: "Karishma Makhija",
    gender: "FEMALE",
    age: 26,
    height: 163,
    heightFormatted: "5'4\"",
    maritalStatus: "NEVER_MARRIED",
    subcaste: "Bhaiband",
    gotra: "Makhija",
    education: { degree: "B.Des Fashion", field: "Fashion", college: "NIFT Mumbai" },
    profession: { occupation: "Fashion Designer", companyName: "Fashion Label", annualIncome: 1800000, currency: "INR" },
    location: { city: "Ulhasnagar", state: "Maharashtra", country: "India" },
    avatar: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=500&auto=format&fit=crop&q=80",
    photos: [{ url: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=500&auto=format&fit=crop&q=80" }],
    isVerified: true,
    isPrimary: true,
    status: "ACTIVE",
  },
];

/**
 * Retrieve candidate profile by ID or phone
 */
export function findProfileByIdInMemory(id) {
  if (!id) return null;
  const strId = String(id).trim();
  const lowerId = strId.toLowerCase();
  const numericId = strId.replace(/\D/g, "");

  if (customProfilesMap.has(strId)) {
    return customProfilesMap.get(strId);
  }

  // 1. Check curated matches pool first (exact 1:1 match with user panel match cards)
  const curatedMatch = CURATED_MATCHES_POOL.find((c) => 
    c._id === strId ||
    c.userId === strId ||
    c.id?.toLowerCase() === lowerId ||
    c.matrimonyId?.toLowerCase() === lowerId ||
    (numericId && c.matrimonyId?.replace(/\D/g, "") === numericId)
  );
  if (curatedMatch) {
    return curatedMatch;
  }

  // 2. Check full seed candidate pool (150 realistic Sindhi members)
  const cand = SEED_CANDIDATE_POOL.find((c) => 
    c._id === strId || 
    c.userId === strId || 
    c.matrimonyId?.toLowerCase() === lowerId ||
    (numericId && c.matrimonyId?.replace(/\D/g, "") === numericId)
  );
  if (cand) {
    return cand;
  }

  // 3. Fallback: If numeric ID provided and seed candidates exist
  if (numericId && numericId.length >= 4 && SEED_CANDIDATE_POOL.length > 0) {
    const seedIndex = parseInt(numericId.slice(-3), 10) % SEED_CANDIDATE_POOL.length;
    const baseCand = SEED_CANDIDATE_POOL[seedIndex] || SEED_CANDIDATE_POOL[0];
    return {
      ...baseCand,
      _id: strId.length === 24 ? strId : baseCand._id,
      matrimonyId: strId.toUpperCase().startsWith("SM") || strId.toUpperCase().startsWith("SND") ? strId.toUpperCase() : `SM${numericId}`,
    };
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

  const pageNum = Math.max(1, Number(page || 1));
  const limitNum = Math.min(100, Math.max(1, Number(limit || 20)));
  const total = filtered.length;
  const totalPages = Math.ceil(total / limitNum) || 1;
  const start = (pageNum - 1) * limitNum;
  const members = filtered.slice(start, start + limitNum).map((m) => ({
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
    list: members,
    total,
    totalPages,
    page: pageNum,
    limit: limitNum,
    hasMore: pageNum < totalPages,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
      hasMore: pageNum < totalPages,
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

  const pageNum = Math.max(1, Number(page || 1));
  const limitNum = Math.min(100, Math.max(1, Number(limit || 20)));
  const total = filtered.length;
  const totalPages = Math.ceil(total / limitNum) || 1;
  const start = (pageNum - 1) * limitNum;
  const leads = filtered.slice(start, start + limitNum);

  return {
    leads,
    list: leads,
    total,
    totalPages,
    page: pageNum,
    limit: limitNum,
    hasMore: pageNum < totalPages,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
      hasMore: pageNum < totalPages,
    },
  };
}

/**
 * Compute KPI stats
 */
export function getDashboardStatsInMemory() {
  const allCandidates = [...SEED_CANDIDATE_POOL, ...customProfilesMap.values()];
  const totalRegistrations = 150 + customProfilesMap.size;
  const activeMembers = totalRegistrations - 4;
  const newLeadsToday = IN_MEMORY_LEADS.filter((l) => l.status === "NEW").length + 12;
  const convertedLeads = IN_MEMORY_LEADS.filter((l) => l.status === "CONVERTED").length + 34;
  const conversionRate = `${((convertedLeads / (IN_MEMORY_LEADS.length + 50)) * 100).toFixed(1)}%`;
  const totalRevenue = 385000;
  const activeSubscriptions = 142;
  const pendingVerifications = IN_MEMORY_VERIFICATIONS.filter((v) => v.status === "PENDING").length;

  let maleProfiles = allCandidates.filter((m) => (m.gender || "").toUpperCase() === "MALE").length;
  let femaleProfiles = allCandidates.filter((m) => (m.gender || "").toUpperCase() === "FEMALE").length;
  if (maleProfiles === 75 && customProfilesMap.size === 0) {
    maleProfiles = 93;
    femaleProfiles = 57;
  }
  const inactiveMembers = 4;
  const membershipPlans = 6;
  const totalBlogs = 1;

  return {
    totalMembers: totalRegistrations,
    maleProfiles,
    femaleProfiles,
    inactiveMembers,
    membershipPlans,
    totalBlogs,
    totalRevenueNumeric: totalRevenue,
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

/**
 * Live Operational Action Queues
 */
export function getDashboardActionQueuesInMemory() {
  const pendingVerifCount = IN_MEMORY_VERIFICATIONS.filter((v) => v.status === "PENDING").length || 38;

  return {
    profileVerification: {
      id: "profile_verification",
      title: "Profile Verification",
      count: pendingVerifCount,
      badgeText: "High SLA",
      badgeColor: "bg-blue-100 text-blue-700",
      iconBg: "bg-blue-50 text-blue-600",
      description: "Govt ID cards, salary slips & selfies awaiting visual authenticity audit",
      items: [
        "18 Aadhaar Card OCR Mismatch",
        "12 High-Income Salary Slip (>30 LPA)",
        "8 Selfie Liveness Review",
      ],
      actionLabel: "Open Verification Desk",
      route: "/verifications",
      urgent: false,
    },
    matchExceptions: {
      id: "match_exceptions",
      title: "Match Exceptions",
      count: 7,
      badgeText: "Requires Admin Sign-off",
      badgeColor: "bg-amber-100 text-amber-700",
      iconBg: "bg-amber-50 text-amber-600",
      description: "Borderline horoscope gunas, age gap > 6 yrs, or inter-subcaste manual requests",
      items: [
        "3 Horoscope Guna < 18 (Client Requested)",
        "2 Age Gap Exception (+6 Years)",
        "2 Sagotra Distance Review",
      ],
      actionLabel: "Review Match Exceptions",
      route: "/matchmaking",
      urgent: true,
    },
    abuseComplaints: {
      id: "abuse_complaints",
      title: "Abuse Complaints",
      count: 4,
      badgeText: "Priority 1",
      badgeColor: "bg-rose-100 text-rose-700",
      iconBg: "bg-rose-50 text-rose-600",
      description: "Grievances reported by members regarding harassment, fake profiles, or extortion",
      items: [
        "2 Misbehavior on Phone Call",
        "1 Suspicious NRI Identity Claim",
        "1 Already Married / Impersonation",
      ],
      actionLabel: "Open Priority Triage",
      route: "/safety",
      urgent: true,
    },
    marriageOffboarding: {
      id: "marriage_offboarding",
      title: "Engagement / Marriage",
      count: 6,
      badgeText: "Offboarding Ready",
      badgeColor: "bg-emerald-100 text-emerald-700",
      iconBg: "bg-emerald-50 text-emerald-600",
      description: "Couples who reported wedding fix. Deactivate from matches and log success stories",
      items: [
        "4 Vivah Confirmed (Archive Profile)",
        "2 Success Story Photos Submitted",
        "RM Attribution: Priya (2), Amit (2)",
      ],
      actionLabel: "Review & Offboard",
      route: "/success-stories",
      urgent: false,
    },
  };
}

/**
 * Dashboard Charts & Analytics Overview
 */
export function getDashboardChartsDataInMemory() {
  return {
    membersWeekly: [
      { day: "Sat", deposit: 490, withdraw: 210 },
      { day: "Sun", deposit: 260, withdraw: 310 },
      { day: "Mon", deposit: 310, withdraw: 290 },
      { day: "Tue", deposit: 450, withdraw: 410 },
      { day: "Wed", deposit: 180, withdraw: 310 },
      { day: "Thu", deposit: 340, withdraw: 460 },
      { day: "Fri", deposit: 395, withdraw: 380 },
    ],
    totalWeeklyInteractions: 4495,
    plansDistribution: [
      { label: "Free Tier", percentage: 40, count: 15774, color: "#0F172A" },
      { label: "Silver Plan", percentage: 15, count: 5915, color: "#F97316" },
      { label: "Gold Royal", percentage: 25, count: 9858, color: "#D946EF" },
      { label: "Diamond / NRI", percentage: 20, count: 7887, color: "#4F46E5" },
    ],
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
  getDashboardActionQueuesInMemory,
  getDashboardChartsDataInMemory,
};
