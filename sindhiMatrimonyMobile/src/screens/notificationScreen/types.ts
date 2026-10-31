export type NotificationType =
  | 'interest'
  | 'match'
  | 'message'
  | 'profile_view'
  | 'interest_accepted'
  | 'system';

export type NotificationFilter =
  | 'all'
  | 'unread'
  | 'interest'
  | 'match'
  | 'message';

export type InterestStatus = 'pending' | 'accepted' | 'declined';

export type NotificationTimeSection = 'today' | 'yesterday' | 'earlier';

export interface NotificationItemData {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  meta?: string;
  time: string;
  section: NotificationTimeSection;
  read: boolean;
  accent: string;
  initials: string;
  interestStatus?: InterestStatus;
}

