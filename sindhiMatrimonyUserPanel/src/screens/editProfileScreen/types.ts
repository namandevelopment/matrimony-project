import React from "react";

export type ProfileSectionId =
  | "basic_info"
  | "education_occupation"
  | "family_details"
  | "hobbies_interest"
  | "partner_preference"
  | "location"
  | "email"
  | "contact_number"
  | "photos"
  | "horoscope"
  | "identity_badge"
  | "professional_badge";

export type ProfileSectionGroup =
  | "profile_info"
  | "contact_details"
  | "enhance_profile"
  | "trust_badge";

export interface SidebarMenuItem {
  id: ProfileSectionId;
  label: string;
  actionText: "edit" | "add" | "view";
  badgeCount?: string | number;
  icon?: React.ReactNode;
}

export interface SidebarNavGroup {
  id: ProfileSectionGroup;
  title: string;
  items: SidebarMenuItem[];
}

export type MaritalStatus = "Unmarried" | "Widow / Widower" | "Divorced" | "Separated";
export type PhysicalStatus = "Normal" | "Physically Challenged";
export type ManglikStatus = "Yes" | "No" | "Don't Know";
export type EatingHabits = "Vegetarian" | "Non-vegetarian" | "Eggetarian" | "Vegan";
export type SmokingHabits = "Non-smoker" | "Light / Social smoker" | "Regular smoker";
export type DrinkingHabits = "Non-drinker" | "Light / Social drinker" | "Regular drinker";

export interface BasicInfoFormData {
  profileCreatedBy: string;
  name: string;
  dobDay: string;
  dobMonth: string;
  dobYear: string;
  maritalStatus: MaritalStatus;
  height: string;
  weightUnit: "kg" | "lbs";
  weightKg: string;
  weightLbs: string;
  physicalStatus: PhysicalStatus;
  casteDivision: string;
  subcaste: string;
  motherTongue: string;
  languagesKnown: string[];
  gothra: string;
  star: string;
  raasi: string;
  manglik: ManglikStatus;
  eatingHabits: EatingHabits;
  smokingHabits: SmokingHabits;
  drinkingHabits: DrinkingHabits;
  aboutMe: string;
}

export interface EducationOccupationFormData {
  highestEducation: string;
  educationDetail: string;
  collegeInstitute: string;
  employedIn: string;
  occupation: string;
  occupationDetail: string;
  annualIncome: string;
  workCountry: string;
  workState: string;
  workCity: string;
}

export interface FamilyDetailsFormData {
  familyValues: string;
  familyType: string;
  familyStatus: string;
  fatherOccupation: string;
  motherOccupation: string;
  brothersCount: string;
  brothersMarried: string;
  sistersCount: string;
  sistersMarried: string;
  livingWithParents: string;
  familyLocation: string;
  aboutFamily: string;
}

export interface HobbiesInterestsFormData {
  hobbies: string[];
  interests: string[];
  music: string[];
  sports: string[];
  food: string[];
}

export interface PartnerPreferenceFormData {
  ageFrom: string;
  ageTo: string;
  heightFrom: string;
  heightTo: string;
  maritalStatus: string[];
  castePreference: string[];
  educationPreference: string[];
  occupationPreference: string[];
  annualIncomePreference: string;
  eatingHabitsPreference: string[];
  manglikPreference: string;
  preferredCountry: string;
  preferredState: string;
  motherTonguePreference?: string[];
  physicalStatusPreference?: string;
  smokingHabitsPreference?: string;
  drinkingHabitsPreference?: string;
  religionPreference?: string;
  subcastePreference?: string;
  starPreference?: string;
  gothramPreference?: string;
  employmentTypePreference?: string;
  preferredCity?: string;
  preferredCitizenship?: string;
}

export interface ContactDetailsFormData {
  country: string;
  state: string;
  city: string;
  citizenship: string;
  ancestralOrigin: string;
  email: string;
  isEmailVerified: boolean;
  mobileCountryCode: string;
  mobileNumber: string;
  isMobileVerified: boolean;
  alternateNumber: string;
  contactPerson: string;
  convenientTimeToCall: string;
}

export interface PhotoItem {
  id: string;
  url: string;
  isPrimary: boolean;
  isApproved: boolean;
  uploadedAt: string;
}

export interface HoroscopeFormData {
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
  raasi: string;
  nakshatra: string;
  horoscopeMatchRequired: string;
  manglikStatus: string;
  hasKundaliFile: boolean;
  kundaliFileName?: string;
}

export interface TrustBadgeState {
  identityBadgeStatus: "not_submitted" | "pending" | "verified";
  identityDocumentType?: string;
  professionalBadgeStatus: "not_submitted" | "pending" | "verified";
  professionalDocumentType?: string;
}

export interface EditProfileState {
  basicInfo: BasicInfoFormData;
  educationOccupation: EducationOccupationFormData;
  familyDetails: FamilyDetailsFormData;
  hobbiesInterests: HobbiesInterestsFormData;
  partnerPreference: PartnerPreferenceFormData;
  contactDetails: ContactDetailsFormData;
  photos: PhotoItem[];
  horoscope: HoroscopeFormData;
  trustBadge: TrustBadgeState;
}

export interface EditProfileScreenProps {
  initialSection?: ProfileSectionId;
  onViewProfile?: () => void;
  onUpgradeClick?: () => void;
  className?: string;
}
