export type VerificationStatus = "idle" | "verifying" | "success" | "error";

export type ResendChannel = "sms" | "whatsapp" | "missed_call";

export interface RegistrationOtpUserData {
  mobile: string;
  countryCode: string;
  name: string;
  profileFor: string;
}

export interface RegistrationOtpScreenProps {
  initialData?: Partial<RegistrationOtpUserData>;
}
