export type PlanTab = "regular" | "assisted";

export interface PlanItem {
  id: string;
  name: string;
  tagline: string;
  tier: string;
  durationMonths: number;
  durationDays?: number;
  priceINR: number;
  originalPriceINR: number;
  discountPercentage: number;
  contactViewCredits: number;
  canChat: boolean;
  isUnlimitedChat: boolean;
  allowDirectChat?: boolean;
  badge?: string | null;
  features: string[];
  isPopular?: boolean;
}

export interface SubscriptionScreenProps {
  initialPlanType?: PlanTab;
  className?: string;
}
