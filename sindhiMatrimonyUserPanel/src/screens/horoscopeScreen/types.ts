import React from "react";

export interface HoroscopeProfileData {
  matrimonyId: string;
  profileCreatedFor: string;
  name: string;
  age: number;
  height: string;
  heightCm: number;
  education: string;
  occupation: string;
  location: string;
  mobileNumber: string;
  photoUrl?: string;
  
  aboutMe: string;

  basicDetails: {
    profileCreatedFor: string;
    name: string;
    age: string;
    height: string;
    gender: string;
    maritalStatus: string;
    motherTongue: string;
    physicalStatus: string;
  };

  religiousInfo: {
    subcaste: string;
    casteDivision: string;
    star: string;
    raasi: string;
    gothram: string;
  };

  professionalInfo: {
    education: string;
    educationDetail: string;
    occupation: string;
    annualIncome?: string;
  };

  locationInfo: {
    country: string;
    state: string;
    city: string;
    citizenship: string;
  };

  horoscopeInfo: {
    name: string;
    dateOfBirth: string;
    timeOfBirth: string;
    timeZone: string;
    timeCorrection: string;
    placeOfBirth: string;
    latitude?: string;
    longitude?: string;
    ayanamsha?: string;
    sunSign?: string;
    moonSign?: string;
    nakshatraPada?: string;
  };

  familyDetails: {
    familyStatus: string;
    familyValues?: string;
    familyType?: string;
    fatherOccupation?: string;
    motherOccupation?: string;
  };

  lifestyleInfo: {
    eatingHabits: string;
    drinkingHabits: string;
    smokingHabits: string;
  };

  partnerPreference: {
    maritalStatus: string;
    haveChildren: string;
    age: string;
    height: string;
    motherTongue: string;
    physicalStatus: string;
    eatingHabits: string;
    drinkingHabits: string;
    smokingHabits: string;
    casteDivision: string;
    subcaste: string;
    star: string;
    manglik: string;
    education: string;
  };
}

export interface KundaliPlanetaryPosition {
  planet: string;
  sign: string;
  degree: string;
  house: number;
  isRetrograde?: boolean;
}

export interface HoroscopeScreenProps {
  initialData?: HoroscopeProfileData;
  onEditSection?: (sectionId: string) => void;
  className?: string;
}
