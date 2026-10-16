export type EmploymentType =
  | "Private"
  | "Business"
  | "Defence"
  | "Government / PSU"
  | "Not working"
  | "Self employed";

export interface LocationProfessionalFormData {
  residentCountry: string;
  residingState: string;
  residingCity: string;
  citizenship: string;
  education: string;
  employmentType: EmploymentType | string;
  occupation: string;
  currency: string;
  annualIncome: string;
}

export interface FormErrors {
  residentCountry?: string;
  residingState?: string;
  residingCity?: string;
  education?: string;
  employmentType?: string;
  occupation?: string;
  annualIncome?: string;
}
