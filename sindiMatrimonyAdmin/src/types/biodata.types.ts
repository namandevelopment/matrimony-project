import type { Role } from './auth.types';

export type BiodataTemplateId = 'TRADITIONAL' | 'MODERN_MINIMAL';

export type BiodataPrivacyMode = 'BLIND' | 'FULL';

export type BiodataConsentStatus = 'GRANTED' | 'WITHDRAWN' | 'PENDING';

export type ReligiousMotif = 'OM' | 'GANESH_SHLOK' | 'SWASTIK' | 'NONE';

export type BiodataAuditEventType =
  | 'BIODATA_GENERATION_REQUESTED'
  | 'BIODATA_GENERATED'
  | 'BIODATA_DOWNLOAD_REQUESTED'
  | 'BIODATA_SHARE_INITIATED'
  | 'BIODATA_DELIVERED'
  | 'BIODATA_SHARE_FAILED'
  | 'BIODATA_ACCESS_DENIED';

export interface BiodataConfigSettings {
  defaultTemplate: BiodataTemplateId;
  defaultPrivacyMode: BiodataPrivacyMode;
  allowReligiousMotif: boolean;
  defaultMotif: ReligiousMotif;
  portalBrandingName: string;
  portalWebsiteUrl: string;
  supportPhone: string;
  supportEmail: string;
  footerText: string;
  watermarkEnabled: boolean;
}

/**
 * Sanitized, server-side allowlisted payload for rendering biodatas.
 * Sensitive fields (mobile, email, exact address, CRM notes) are strictly omitted in BLIND mode.
 */
export interface BiodataRenderPayload {
  memberId: string;
  uniqueId: string;
  privacyMode: BiodataPrivacyMode;
  templateId: BiodataTemplateId;
  generatedAt: string;
  generatedByEmployeeId: string;
  generatedByEmployeeName: string;
  isVerified: boolean;
  completenessScore: number;
  lastUpdated: string;

  // Personal Essentials (Always included if present)
  fullName: string;
  gender: 'Male' | 'Female';
  age: number;
  dateOfBirth?: string;
  height?: string;
  weight?: string;
  maritalStatus: string;
  motherTongue?: string;
  religion?: string;
  community?: string;
  subcaste: string;
  gotra?: string;
  diet?: string;

  // Location
  city: string;
  state?: string;
  country?: string;
  // Included ONLY in FULL mode with authorization
  residentialAddress?: string;

  // Contact (Included ONLY in FULL mode with authorization)
  mobile?: string;
  email?: string;

  // Horoscope / Kundli
  birthTime?: string;
  birthPlace?: string;
  manglik?: string;
  rashi?: string;
  nakshatra?: string;
  sunSign?: string;

  // Education & Professional
  educationArea?: string;
  education?: string;
  employedIn?: string;
  profession?: string;
  workingWith?: string;
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

  // Photograph (Photo sharing consent check)
  photoUrl?: string;
  hasPhotoConsent: boolean;

  // Relationship Manager & Contact Info
  assignedRmName: string;
  assignedRmContact: string;

  // Included & Excluded Field Tags (for transparency & auditing)
  includedFields: string[];
  excludedFields: string[];
}

export interface BiodataAuditLogEntry {
  id: string;
  eventType: BiodataAuditEventType;
  memberId: string;
  memberUniqueId: string;
  memberName: string;
  employeeId: string;
  employeeName: string;
  employeeRole: Role;
  templateId: BiodataTemplateId;
  privacyMode: BiodataPrivacyMode;
  recipientReference?: string;
  shareMethod?: 'WHATSAPP_WEB' | 'DOWNLOAD' | 'NATIVE_SHARE' | 'API';
  notes?: string;
  timestamp: string;
  correlationId: string;
}

export interface MissingFieldWarning {
  field: string;
  label: string;
  category: 'PERSONAL' | 'CAREER' | 'FAMILY' | 'HOROSCOPE' | 'CONTACT';
  isCritical: boolean;
}
