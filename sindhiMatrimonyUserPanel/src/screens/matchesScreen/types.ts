export type MatchCategoryType =
  | "your_matches"
  | "shortlisted_by_you"
  | "viewed_you"
  | "shortlisted_you"
  | "viewed_by_you"
  | "newly_joined"
  | "nearby_matches";

export interface MatchDetailProfile {
  id: string;
  matrimonyId: string;
  name: string;
  age: number;
  height: string;
  education: string;
  profession: string;
  city: string;
  state?: string;
  lastSeen: string;
  isNewlyJoined?: boolean;
  photoUrl?: string;
  isSilhouette?: boolean;
  gender?: "female" | "male";
  hasHoroscope?: boolean;
  isNotSeen?: boolean;
  phoneAvailable?: boolean;
  whatsappAvailable?: boolean;
  phoneNumber?: string;
  whatsappNumber?: string;
  isShortlisted?: boolean;
  interestSent?: boolean;
  photoRequested?: boolean;
  caste?: string;
  motherTongue?: string;
}

export type FilterChipId =
  | "newly_joined"
  | "not_seen"
  | "with_photo"
  | "with_horoscope";

export type SortOption =
  | "relevance"
  | "newly_joined"
  | "last_seen"
  | "age_asc"
  | "age_desc";

export interface PartnerPreferences {
  ageRange: [number, number];
  heightRange: [string, string];
  maritalStatus: string[];
  religion: string;
  community: string;
  motherTongue: string[];
  country: string[];
  state: string[];
  education: string[];
  occupation: string[];
  annualIncome: string;
}

export interface MatchesScreenProps {
  initialProfiles?: MatchDetailProfile[];
  initialCategory?: MatchCategoryType;
  initialMode?: "regular" | "prime";
  onUpgradeClick?: () => void;
  onAssistedServiceClick?: () => void;
}
