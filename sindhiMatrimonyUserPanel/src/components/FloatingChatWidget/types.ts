export interface ChatMessage {
  id: string;
  sender: "support" | "user";
  text: string;
  timestamp: string;
  actionType?: "whatsapp" | "link";
  actionUrl?: string;
  actionLabel?: string;
  suggestedQuestions?: string[];
  isAbusiveWarning?: boolean;
}

export interface QuickSuggestion {
  id: string;
  label: string;
  query: string;
  response: string;
  actionUrl?: string;
  actionLabel?: string;
}

export interface FloatingChatWidgetProps {
  /** Optional custom title for the support header */
  title?: string;
  /** Optional subtitle or status text */
  subtitle?: string;
  /** Support contact phone / WhatsApp number in international format without plus */
  whatsappNumber?: string;
  /** Support email address */
  supportEmail?: string;
  /** Initial welcome greeting message */
  initialGreeting?: string;
  /** Callback when chat window opened */
  onOpen?: () => void;
  /** Callback when chat window closed */
  onClose?: () => void;
}

export interface BotResponseResult {
  text: string;
  actionType?: "whatsapp" | "link";
  actionUrl?: string;
  actionLabel?: string;
  suggestedQuestions?: string[];
  isAbusiveWarning?: boolean;
  matchedCategoryId?: string;
}

export interface KnowledgeBaseCategory {
  id: string;
  title: string;
  primaryKeywords: string[];
  secondaryKeywords: string[];
  sampleQuestions: string[];
  response: string;
  actionLabel?: string;
  actionUrl?: string;
  actionType?: "whatsapp" | "link";
  suggestedQuestions?: string[];
}

export interface KnowledgeBaseModeration {
  abusiveKeywords: string[];
  abusivePatterns: string[];
  warningResponses: string[];
}

export interface KnowledgeBaseSchema {
  version: string;
  lastUpdated: string;
  moderation: KnowledgeBaseModeration;
  categories: KnowledgeBaseCategory[];
  fallback: {
    response: string;
    actionLabel?: string;
    actionUrl?: string;
    suggestedQuestions?: string[];
  };
}
