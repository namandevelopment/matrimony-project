export interface ProfilePersonalInfo {
  age: string;
  height: string;
  motherTongue: string;
  profileCreatedBy: string;
  maritalStatus: string;
  livesIn: string;
  eatingHabits: string;
  religion: string;
  caste: string;
  subcaste: string;
  gothra: string;
  manglik: string;
  dateOfBirthMasked: string;
  timeOfBirthMasked: string;
  horoscopeAvailable: boolean;
  employment: string;
  education: string;
  occupation: string;
}

export interface ProfileContactInfo {
  phoneMasked: string;
  whatsappMasked: string;
  isUnlocked: boolean;
}

export interface PartnerPreferenceItem {
  id: string;
  label: string;
  preferenceValue: string;
  isMatched: boolean;
  category: "basic" | "religious" | "professional" | "location";
  moreValues?: string[];
}

export interface PartnerPreferencesData {
  matchCount: number;
  totalCount: number;
  basicPreferences: PartnerPreferenceItem[];
  religiousPreferences: PartnerPreferenceItem[];
  professionalPreferences: PartnerPreferenceItem[];
  locationPreferences: PartnerPreferenceItem[];
}

export interface ViewUserProfile {
  id: string;
  matrimonyId: string;
  name: string;
  age: number;
  height: string;
  education: string;
  profession: string;
  city: string;
  state: string;
  lastSeen: string;
  photoUrls: string[];
  gender: "female" | "male";
  casteSummary: string;
  maritalStatus: string;
  profileCreatedBy: string;
  isShortlisted?: boolean;
  interestSent?: boolean;
  isNewlyJoined?: boolean;
  aboutText: string;
  personalInfo: ProfilePersonalInfo;
  contactInfo: ProfileContactInfo;
  partnerPreferences: PartnerPreferencesData;
}

export interface ViewProfileScreenProps {
  initialProfileId?: string;
  onBackToMatches?: () => void;
  onNavigateToNext?: (nextId: string) => void;
  onUpgradeClick?: () => void;
  className?: string;
}
