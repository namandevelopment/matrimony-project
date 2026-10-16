export type PhysicalStatus = "Normal" | "Physically challenged";

export type MaritalStatus =
  | "Never married"
  | "Widower"
  | "Awaiting divorce"
  | "Divorced";

export type DoshStatus = "No" | "Yes" | "Don't know";

export interface PersonalReligiousFormData {
  height: string;
  physicalStatus: PhysicalStatus;
  maritalStatus: MaritalStatus;
  religion: string;
  caste: string;
  subcaste?: string;
  willingToMarryAnyCaste?: boolean;
  gothra?: string;
  dosh?: DoshStatus;
}

export interface FormErrors {
  height?: string;
  physicalStatus?: string;
  maritalStatus?: string;
  religion?: string;
  caste?: string;
  subcaste?: string;
}
