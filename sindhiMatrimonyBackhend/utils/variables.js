// Staff & User Roles
export const ROLES = {
  SUPER_ADMIN: 1,
  ADMIN: 2,
  MATCHMAKER: 3,
  TELECALLER: 4,
  ACCOUNTS: 5,
  USER: 6, // Candidate / Matrimonial Member
};

export const ROLE_NAMES = {
  [ROLES.SUPER_ADMIN]: "SUPER_ADMIN",
  [ROLES.ADMIN]: "ADMIN",
  [ROLES.MATCHMAKER]: "MATCHMAKER",
  [ROLES.TELECALLER]: "TELECALLER",
  [ROLES.ACCOUNTS]: "ACCOUNTS",
  [ROLES.USER]: "USER",
};

// Record Scope for CRM Data Isolation
export const RECORD_SCOPE = {
  ALL: "ALL",           // Super Admin / Director sees all records
  BRANCH: "BRANCH",     // Branch manager sees local branch records
  OWN: "OWN",           // Telecaller/Matchmaker sees only their assigned records
  ASSIGNED: "ASSIGNED", // Read/Write access on explicitly assigned profiles
};

// CRM Lead Stages
export const LEAD_STAGES = [
  "NEW",
  "CONTACTED",
  "INTERESTED",
  "DEMO_SCHEDULED",
  "CONVERTED",
  "LOST",
  "DO_NOT_CALL",
];

// Lead Acquisition Sources
export const LEAD_SOURCES = [
  "WEBSITE",
  "MOBILE_APP",
  "META_ADS",
  "GOOGLE_ADS",
  "OFFLINE_EVENT",
  "COMMUNITY_REFERRAL",
];

// Profile KYC Verification Status
export const KYC_STATUS = {
  NOT_SUBMITTED: "NOT_SUBMITTED",
  PENDING: "PENDING",
  VERIFIED: "VERIFIED",
  REJECTED: "REJECTED",
};

// Account Status
export const ACCOUNT_STATUS = {
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED",
  FROZEN: "FROZEN",
  DELETED: "DELETED",
};

// Mutual Matchmaking Express Interest Status
export const INTEREST_STATUS = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  DECLINED: "DECLINED",
  CANCELLED: "CANCELLED",
};

// Membership Tiers
export const MEMBERSHIP_TIERS = {
  FREE: "FREE",
  SILVER: "SILVER",
  GOLD: "GOLD",
  DIAMOND_ASSISTED: "DIAMOND_ASSISTED",
};

// Demographic & Cultural Enums
export const GENDER = ["MALE", "FEMALE"];

export const MARITAL_STATUS = [
  "NEVER_MARRIED",
  "DIVORCED",
  "WIDOWED",
  "AWAITING_DIVORCE",
];

export const MANGLIK_STATUS = [
  "MANGLIK",
  "NON_MANGLIK",
  "ANSHIK_MANGLIK",
  "DONT_KNOW",
];

export const SINDHI_SUBCASTES = [
  "Amil",
  "Bhaiband",
  "Sahiti",
  "Larkana",
  "Shikarpuri",
  "Dadu",
  "Sehwani",
  "Sindhi Sikh",
  "Other",
];

// Photo Privacy Settings
export const PHOTO_PRIVACY = {
  PUBLIC: "PUBLIC",
  BLURRED: "BLURRED",
  PRIVATE: "PRIVATE",
};
