export interface UserProfile {
  name: string;
  matrimonyId: string;
  community: string;
  membershipStatus: "Free member" | "Paid member" | "Prime member";
  completenessScore: number;
  avatarUrl?: string;
}

export interface MatchProfile {
  id: string;
  name: string;
  age: number;
  height: string;
  city?: string;
  caste?: string;
  education?: string;
  photoUrl?: string;
  isSilhouette?: boolean;
}

export interface CompletenessActionItem {
  id: string;
  title: string;
  subtitle?: string;
  iconType: "photo" | "family" | "hobbies";
  completed?: boolean;
  href?: string;
}

export interface DashboardNavTab {
  id: "home" | "matches" | "interests" | "messages" | "search" | "notifications";
  label: string;
  href: string;
  badgeCount?: number;
}

export type DashboardMode = "regular" | "prime";

export interface DashboardScreenProps {
  initialUser?: UserProfile;
  initialMatches?: MatchProfile[];
  onLogout?: () => void;
  onUpgradeClick?: () => void;
}
