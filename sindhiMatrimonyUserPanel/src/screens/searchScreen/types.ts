export type SearchTab = "criteria" | "profile_id" | "saved_search";

export interface SearchCriteriaState {
  ageFrom: number;
  ageTo: number;
  heightFrom: string;
  heightTo: string;
  profileCreatedBy: string;
  caste: string;
  star: string;
  withHoroscopeOnly: boolean;
  manglik: string;
  gothra: string;
  occupation: string;
  incomeFrom: string;
  incomeTo: string;
  employmentType: string;
  education: string;
  nearbyOnly: boolean;
  country: string;
  mutualHobbiesOnly: boolean;
  eatingHabits: string;
  maritalStatus?: string;
  state?: string;
}

export interface SearchScreenProps {
  initialTab?: SearchTab;
  onSearchSubmit?: (criteria: SearchCriteriaState) => void;
  onUpgradeClick?: () => void;
}
