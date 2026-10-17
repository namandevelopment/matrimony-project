export type NotificationCategory =
  | "all"
  | "interests"
  | "matches"
  | "messages"
  | "system";

export type NotificationType =
  | "interest_received"
  | "interest_accepted"
  | "interest_declined"
  | "photo_request"
  | "horoscope_request"
  | "profile_viewed"
  | "profile_shortlisted"
  | "daily_recommendation"
  | "high_match"
  | "chat_message"
  | "call_request"
  | "assisted_service_update"
  | "profile_verified"
  | "membership_offer"
  | "system_announcement";

export type NotificationActionType =
  | "accept_interest"
  | "decline_interest"
  | "view_profile"
  | "reply_message"
  | "upload_photo"
  | "share_horoscope"
  | "upgrade_plan"
  | "view_matches"
  | "complete_profile"
  | "call_back";

export interface NotificationActor {
  id: string;
  name: string;
  matrimonyId: string;
  avatarUrl?: string;
  age?: number;
  height?: string;
  caste?: string;
  city?: string;
  profession?: string;
  education?: string;
  verified?: boolean;
  matchScore?: number;
  isOnline?: boolean;
}

export interface NotificationActionItem {
  label: string;
  action: NotificationActionType;
  variant?: "primary" | "secondary" | "outline" | "danger";
}

export interface NotificationMetadata {
  unreadMessageCount?: number;
  discountPercent?: number;
  expiryText?: string;
  badgeText?: string;
  subCategory?: string;
  highlightText?: string;
}

export interface NotificationItem {
  id: string;
  category: NotificationCategory;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  createdAt: string; // ISO string for sorting & date grouping
  isRead: boolean;
  isActionRequired?: boolean;
  actor?: NotificationActor;
  primaryAction?: NotificationActionItem;
  secondaryAction?: NotificationActionItem;
  metadata?: NotificationMetadata;
}

export type NotificationFilter = "all" | "unread" | "action_needed";

export type NotificationSort = "newest" | "oldest";

export interface NotificationPreferenceSetting {
  id: string;
  title: string;
  description: string;
  email: boolean;
  sms: boolean;
  push: boolean;
}

export interface NotificationsScreenProps {
  onUpgradeClick?: () => void;
  onViewProfile?: (actorId: string, matrimonyId: string) => void;
  onOpenChat?: (actorId: string) => void;
  onNavigateToTab?: (tab: string) => void;
  className?: string;
}
