export type PlanCategory = 'SELF_SERVICE' | 'ASSIST_PLAN';

export interface MembershipPlan {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  offerPrice: number;
  duration: string;
  category: PlanCategory;
  features: string[];
  highlighted?: boolean;
  badge?: string;
  active: boolean;
  sortOrder?: number;
  updatedAt?: string;
}

export interface PlanFormValues {
  title: string;
  subtitle: string;
  price: number | string;
  offerPrice: number | string;
  duration: string;
  category: PlanCategory;
  featuresText: string;
  highlighted: boolean;
  badge: string;
  active: boolean;
}

export interface MembershipPlanStats {
  totalPlans: number;
  activePlans: number;
  selfServiceCount: number;
  assistPlansCount: number;
}
