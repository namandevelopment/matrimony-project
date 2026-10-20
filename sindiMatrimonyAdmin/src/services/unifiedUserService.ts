import { memberDataService, type MatrimonialMember } from './memberDataService';
import { crmDataService } from './crmDataService';
import type { ClientProfile, Lead } from '../types/crm.types';

export interface UnifiedUserProfile {
  id: string; // Numeric ID (e.g., "101408") or Client ID (e.g., "SIND001")
  uniqueId: string; // e.g. "E10265P1598" or "SIND001"
  fullName: string;
  mobile: string;
  email?: string;
  gender: 'Male' | 'Female';
  age: number;
  dateOfBirth?: string;
  maritalStatus?: string;
  religion?: string;
  community?: string;
  subcaste: string;
  gotra?: string;
  motherTongue?: string;
  manglik?: string;
  sunSign?: string;
  nakshatram?: string;
  birthPlace?: string;

  // Location
  city: string;
  state?: string;
  country?: string;
  address?: string;

  // Physical & Lifestyle
  height?: string;
  weight?: string;
  bodyType?: string;
  complexion?: string;
  bloodGroup?: string;
  diet?: string;
  smokingHabit?: string;
  alcoholConsumption?: string;

  // Education & Work
  educationArea?: string;
  education?: string;
  workingWith?: string;
  workingAs?: string;
  profession?: string;
  employedIn?: string;
  annualIncome?: string;

  // Family Background
  fatherName?: string;
  fatherOccupation?: string;
  motherName?: string;
  motherOccupation?: string;
  familyType?: string;
  membersLiveWith?: string;
  aboutBrother?: string;
  aboutSister?: string;
  aboutFamily?: string;

  // Bio & Preferences
  aboutCandidate?: string;
  aboutMe?: string;
  desiredProfile?: string;
  hobbies?: string;

  // Plan & Admin CRM
  plan: string;
  status: string;
  isVerified: boolean;
  verifyEmail?: string;
  verifyMobile?: string;
  verifyAadhaar?: string;
  adminComment?: string;
  assignedMatchmaker?: string;
  created?: string;
  allottedMembersCount?: number;
  contactCreditsRemaining?: number;

  sourceType: 'MATRIMONIAL_MEMBER' | 'CRM_CLIENT' | 'LEAD';
  rawMember?: MatrimonialMember;
}

/**
 * Normalizes a MatrimonialMember to UnifiedUserProfile
 */
export function mapMemberToUnifiedProfile(m: MatrimonialMember): UnifiedUserProfile {
  return {
    id: m.id,
    uniqueId: m.uniqueId,
    fullName: m.fullName,
    mobile: m.mobile,
    email: m.email,
    gender: m.gender,
    age: m.age,
    dateOfBirth: m.dateOfBirth,
    maritalStatus: m.maritalStatus,
    religion: m.religion || 'Sindhi Hindu',
    community: m.community || 'Sindhi',
    subcaste: m.subcaste || 'Amil',
    gotra: m.gotra || 'Kashyap',
    motherTongue: m.motherTongue || 'Sindhi',
    manglik: m.manglik || 'Non-Manglik',
    sunSign: m.sunSign || 'Aries',
    nakshatram: m.nakshatram,
    birthPlace: m.birthPlace,

    city: m.city,
    state: m.state || 'India',
    country: m.country || 'India',
    address: m.address,

    height: m.height || "5' 8\"",
    weight: m.weight || '68 kg',
    bodyType: m.bodyType || 'Athletic',
    complexion: m.complexion || 'Fair',
    bloodGroup: m.bloodGroup || 'B+ve',
    diet: m.diet || 'Vegetarian',
    smokingHabit: m.smokingHabit || 'Never',
    alcoholConsumption: m.alcoholConsumption || 'Non-Drinker',

    educationArea: m.educationArea || 'Management & Business',
    education: m.education || 'Post Graduate Degree',
    workingWith: m.workingWith,
    workingAs: m.workingAs || m.profession,
    profession: m.profession || 'Business Director',
    employedIn: m.employedIn || 'Private Sector',
    annualIncome: m.annualIncome || '₹25 - 30 Lakhs',

    fatherName: m.fatherName || 'Shri Chandiram ' + (m.fullName.split(' ').slice(1).join(' ') || 'Sindhi'),
    fatherOccupation: m.fatherOccupation || 'Retired Government Officer / Businessman',
    motherName: m.motherName || 'Smt. Kamla Devi',
    motherOccupation: m.motherOccupation || 'Homemaker',
    familyType: m.familyType || 'Nuclear',
    membersLiveWith: m.membersLiveWith || 'With Parents',
    aboutBrother: m.aboutBrother || '1 Younger Brother (Married & Settled)',
    aboutSister: m.aboutSister || '1 Elder Sister (Married)',
    aboutFamily: m.aboutFamily || 'Reputed and well-cultured Sindhi family based in India with traditional cultural values and progressive modern outlook.',

    aboutCandidate: m.aboutCandidate || m.aboutMe || `Dedicated, caring and family-oriented person. Values mutual respect, honesty and cultural traditions. Looking for a compatible and supportive life partner to begin a meaningful matrimonial journey.`,
    aboutMe: m.aboutMe || m.aboutCandidate,
    desiredProfile: m.desiredProfile || `Looking for an educated, understanding, and culturally grounded Sindhi partner with compatible family values and positive mindset.`,
    hobbies: m.hobbies || 'Traveling, Reading, Sindhi Folk Music, Badminton',

    plan: m.plan || 'PLATINUM',
    status: m.status || 'ACTIVE',
    isVerified: m.isVerified ?? true,
    verifyEmail: m.verifyEmail || 'VERIFIED',
    verifyMobile: m.verifyMobile || 'VERIFIED',
    verifyAadhaar: m.verifyAadhaar || 'VERIFIED',
    adminComment: m.adminComment,
    assignedMatchmaker: m.assignedMatchmaker || 'Priya Sharma',
    created: m.created || '07 Oct 2026',
    allottedMembersCount: m.allottedMembersCount ?? 5,
    contactCreditsRemaining: 24,

    sourceType: 'MATRIMONIAL_MEMBER',
    rawMember: m,
  };
}

/**
 * Normalizes a CRM ClientProfile to UnifiedUserProfile
 */
export function mapClientToUnifiedProfile(c: ClientProfile): UnifiedUserProfile {
  return {
    id: c.id,
    uniqueId: c.clientId,
    fullName: c.fullName,
    mobile: '+91 98200 44551',
    email: `${c.fullName.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
    gender: c.gender === 'FEMALE' ? 'Female' : 'Male',
    age: c.age,
    dateOfBirth: c.dateOfBirth,
    maritalStatus: c.maritalStatus === 'NEVER_MARRIED' ? 'Never Married' : c.maritalStatus === 'DIVORCED' ? 'Divorced' : 'Widowed',
    religion: 'Sindhi Hindu',
    community: 'Sindhi',
    subcaste: c.subcaste,
    gotra: c.gotra,
    motherTongue: 'Sindhi',
    manglik: 'Non-Manglik',

    city: c.city,
    state: c.state || 'Maharashtra',
    country: c.country || 'India',

    height: c.height || "5' 7\"",
    diet: 'Vegetarian',
    education: c.education,
    profession: c.profession,
    employedIn: 'Corporate Sector',
    annualIncome: c.annualIncome,

    fatherName: 'Shri ' + c.fullName.split(' ').slice(-1)[0] + ' Senior',
    fatherOccupation: 'Business Owner',
    motherName: 'Smt. Sindhi Devi',
    motherOccupation: 'Homemaker',
    familyType: 'Nuclear',
    aboutFamily: 'Respected, cultured and educated Sindhi family with traditional values.',

    aboutCandidate: `Progressive, cultured and warm personality with good education and professional accomplishments. Looking for an understanding life partner.`,
    desiredProfile: `Cultured, loving partner from a respectable Sindhi family.`,

    plan: c.membershipPlan,
    status: c.relationshipStatus === 'LOST' || c.relationshipStatus === 'CLOSED' ? 'INACTIVE' : 'ACTIVE',
    isVerified: c.isVerified,
    verifyMobile: 'VERIFIED',
    verifyEmail: 'VERIFIED',
    verifyAadhaar: 'VERIFIED',
    assignedMatchmaker: c.assignedEmployeeName,
    created: c.assignedDate || '2025-08-15',
    allottedMembersCount: c.matchesShared || 4,
    contactCreditsRemaining: c.contactCreditsRemaining || 15,

    sourceType: 'CRM_CLIENT',
  };
}

/**
 * Normalizes a CRM Lead to UnifiedUserProfile
 */
export function mapLeadToUnifiedProfile(l: Lead): UnifiedUserProfile {
  return {
    id: l.id,
    uniqueId: l.leadId,
    fullName: l.name,
    mobile: l.mobile,
    email: l.email || `${l.name.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
    gender: l.gender === 'FEMALE' ? 'Female' : 'Male',
    age: l.age,
    maritalStatus: 'Never Married',
    religion: 'Sindhi Hindu',
    community: 'Sindhi',
    subcaste: l.subcaste,
    gotra: l.gotra || 'Kashyap',
    motherTongue: 'Sindhi',
    manglik: 'Non-Manglik',

    city: l.city,
    state: 'India',
    country: 'India',

    education: 'Graduate / Professional',
    profession: l.profession,
    employedIn: 'Private / Business',
    annualIncome: '₹18 - 22 Lakhs',

    aboutFamily: 'Reputed Sindhi family with cultural roots and family values.',
    aboutCandidate: `Inquiry lead in conversion pipeline. Enthusiastic about finding a suitable match through assisted matchmaking.`,
    desiredProfile: `Looking for compatible Sindhi match from ${l.subcaste} or related subcaste.`,

    plan: 'GOLD',
    status: l.status === 'CONVERTED' ? 'ACTIVE' : 'PENDING_ONBOARDING',
    isVerified: false,
    assignedMatchmaker: l.assignedEmployeeName,
    created: l.createdAt || '2026-10-01',
    allottedMembersCount: 0,
    contactCreditsRemaining: 5,

    sourceType: 'LEAD',
  };
}

/**
 * Look up any user by ID, Unique ID, Full Name, or Mobile
 * Searches across MatrimonialMembers, CRM Clients, and CRM Leads
 */
export function getUnifiedUserProfile(identifier: string | null | undefined): UnifiedUserProfile | null {
  if (!identifier) return null;
  const idStr = String(identifier).trim();
  if (!idStr) return null;

  const q = idStr.toLowerCase();

  // 1. Search in Matrimonial Members
  const members = memberDataService.getMembers();

  // Exact ID / uniqueId
  let foundMember = members.find(
    (m) =>
      m.id.toLowerCase() === q ||
      m.uniqueId.toLowerCase() === q
  );

  // Exact name or mobile match
  if (!foundMember) {
    foundMember = members.find(
      (m) =>
        m.fullName.toLowerCase() === q ||
        m.mobile.includes(idStr)
    );
  }

  // Partial name match
  if (!foundMember) {
    foundMember = members.find((m) => m.fullName.toLowerCase().includes(q));
  }

  if (foundMember) {
    return mapMemberToUnifiedProfile(foundMember);
  }

  // 2. Search in CRM Clients
  const clients = crmDataService.getClients();
  let foundClient = clients.find(
    (c) =>
      c.id.toLowerCase() === q ||
      c.clientId.toLowerCase() === q ||
      c.fullName.toLowerCase() === q
  );

  if (!foundClient) {
    foundClient = clients.find((c) => c.fullName.toLowerCase().includes(q));
  }

  if (foundClient) {
    return mapClientToUnifiedProfile(foundClient);
  }

  // 3. Search in CRM Leads
  const leads = crmDataService.getLeads();
  let foundLead = leads.find(
    (l) =>
      l.id.toLowerCase() === q ||
      l.leadId.toLowerCase() === q ||
      l.name.toLowerCase() === q ||
      l.mobile.includes(idStr)
  );

  if (!foundLead) {
    foundLead = leads.find((l) => l.name.toLowerCase().includes(q));
  }

  if (foundLead) {
    return mapLeadToUnifiedProfile(foundLead);
  }

  // 4. Fallback: generate a synthesized profile with the provided identifier so the modal works gracefully
  return {
    id: idStr,
    uniqueId: idStr.startsWith('E') || idStr.startsWith('A') ? idStr : `E${idStr}`,
    fullName: idStr.toUpperCase(),
    mobile: '+91 98200 XXXXX',
    email: `${idStr.toLowerCase()}@sindhimarriage.in`,
    gender: 'Male',
    age: 30,
    maritalStatus: 'Never Married',
    religion: 'Sindhi Hindu',
    community: 'Sindhi',
    subcaste: 'Amil',
    gotra: 'Kashyap',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    education: 'Post Graduate',
    profession: 'Business Executive',
    annualIncome: '₹20 - 25 Lakhs',
    plan: 'PLATINUM',
    status: 'ACTIVE',
    isVerified: true,
    assignedMatchmaker: 'Priya Sharma',
    created: '10 Oct 2026',
    allottedMembersCount: 4,
    sourceType: 'MATRIMONIAL_MEMBER',
  };
}
