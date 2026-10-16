export type OnboardingStep = "horoscope" | "star" | "eating-habit" | "lifestyle";

export type EatingHabit = "Vegetarian" | "Non-Vegetarian" | "Eggetarian";

export type LifestyleTab = "hobbies" | "music" | "sports" | "food";

export interface HoroscopeFormData {
  dateOfBirth: string;
  timeOfBirth: string; // e.g. "02:02 AM"
  birthCountry: string;
  birthState: string;
  birthCity: string;
}

export interface StarFormData {
  nakshatra: string;
  raasi: string;
}

export interface LifestyleFormData {
  hobbies: string[];
  music: string[];
  sports: string[];
  food: string[];
}
