export type MessageTab = "received" | "awaiting" | "calls";

export interface ConversationItem {
  id: string;
  name: string;
  subtitle: string;
  lastMessageTime?: string;
  isOnline?: boolean;
  unreadCount?: number;
  isAssisted?: boolean;
  avatarUrl?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  time: string;
  isAssistedOffer?: boolean;
}

export interface MessagesScreenProps {
  initialTab?: MessageTab;
  onUpgradeClick?: () => void;
  onPayNowClick?: () => void;
}
