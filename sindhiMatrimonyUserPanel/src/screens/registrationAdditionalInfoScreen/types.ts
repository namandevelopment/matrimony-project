export type FamilyStatus =
  | "Middle class"
  | "Upper middle class"
  | "Rich / Affluent (Elite)";

export interface AdditionalInfoFormData {
  familyStatus: FamilyStatus;
  aboutMyself: string;
}

export interface FormErrors {
  familyStatus?: string;
  aboutMyself?: string;
  general?: string;
}
