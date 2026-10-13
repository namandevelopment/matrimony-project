export interface QuickRegisterFormData {
  profileFor: string;
  name: string;
  countryCode: string;
  mobileNumber: string;
}

export interface TrustBadgeItem {
  id: string;
  title: string;
  iconName: "medal" | "rings" | "trophy" | "shield" | "location";
}
