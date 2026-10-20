export type InterestSection = "received" | "sent";
export type InterestStatus = "all" | "pending" | "accepted" | "declined";

export interface InterestFilter {
  section: InterestSection;
  status: InterestStatus;
}

export interface InterestCandidateProfile {
  _id: string;
  matrimonyId?: string;
  name: string;
  age: number;
  height?: string;
  subcaste?: string;
  city?: string;
  state?: string;
  profession?: string;
  companyName?: string;
  education?: string;
  avatar?: string;
  verified?: boolean;
}

export interface InterestItem {
  _id: string;
  senderUserId?: string;
  senderProfileId?: string;
  receiverProfileId?: string;
  direction?: "RECEIVED" | "SENT";
  status: "PENDING" | "ACCEPTED" | "DECLINED";
  personalizedNote?: string;
  sentAt?: number;
  respondedAt?: number;
  remindedAt?: number;
  senderProfile?: InterestCandidateProfile;
  receiverProfile?: InterestCandidateProfile;
}

export interface InterestBadgeCounts {
  received: {
    all: number;
    pending: number;
    accepted: number;
    declined: number;
  };
  sent: {
    all: number;
    pending: number;
    accepted: number;
    declined: number;
  };
  pendingCount?: number;
  acceptedCount?: number;
  totalUnread?: number;
}

export interface InterestsScreenProps {
  initialSection?: InterestSection;
  initialStatus?: InterestStatus;
  searchQuery?: string;
  onUpgradeClick?: () => void;
}
