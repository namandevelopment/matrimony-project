export type InterestSection = "received" | "sent";
export type InterestStatus = "all" | "pending" | "accepted" | "declined";

export interface InterestFilter {
  section: InterestSection;
  status: InterestStatus;
}

export interface InterestProfile {
  id: string;
  matrimonyId: string;
  name: string;
  age: number;
  height: string;
  city: string;
  profession: string;
  education: string;
  photoUrl?: string;
  isSilhouette?: boolean;
  receivedAt: string;
  message?: string;
}

export interface InterestsScreenProps {
  initialSection?: InterestSection;
  initialStatus?: InterestStatus;
  searchQuery?: string;
  onUpgradeClick?: () => void;
}
