export interface BasicInfoFormData {
  day: string;
  month: string;
  year: string;
  gender?: string;
  motherTongue: string;
  email: string;
  password: string;
}

export interface FormErrors {
  dob?: string;
  gender?: string;
  motherTongue?: string;
  email?: string;
  password?: string;
}

export type MonthAbbr =
  | "Jan"
  | "Feb"
  | "Mar"
  | "Apr"
  | "May"
  | "Jun"
  | "Jul"
  | "Aug"
  | "Sep"
  | "Oct"
  | "Nov"
  | "Dec";
