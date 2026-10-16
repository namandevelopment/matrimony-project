export type HelpCategoryId =
  | "all"
  | "profile-verification"
  | "matchmaking-search"
  | "membership-billing"
  | "privacy-security"
  | "safety-fraud";

export interface HelpCategory {
  id: HelpCategoryId;
  title: string;
  shortTitle: string;
  description: string;
  iconName: string;
  badge?: string;
}

export interface HelpStep {
  stepNumber: number;
  title: string;
  description: string;
}

export interface HelpGuideline {
  id: string;
  categoryId: HelpCategoryId;
  title: string;
  summary: string;
  steps: HelpStep[];
  tips?: string[];
  tags: string[];
}

export interface HelpFAQ {
  id: string;
  question: string;
  answer: string;
  category: HelpCategoryId;
}

export interface SupportChannel {
  id: string;
  title: string;
  subtitle: string;
  value: string;
  displayValue: string;
  actionLabel: string;
  actionHref: string;
  timing: string;
  badge?: string;
  iconType: "phone" | "mail" | "message" | "shield";
  isPrimary?: boolean;
}

export interface TicketFormState {
  fullName: string;
  email: string;
  phone: string;
  matrimonyId: string;
  category: string;
  subject: string;
  message: string;
}
