import { HoroscopeProfileData, KundaliPlanetaryPosition } from "./types";

export const INITIAL_HOROSCOPE_PROFILE_DATA: HoroscopeProfileData = {
  matrimonyId: "BRH4517087",
  profileCreatedFor: "Self",
  name: "Naman",
  age: 27,
  height: "4 ft 7 in / 139 cm",
  heightCm: 139,
  education: "B.Arch, Retired",
  occupation: "Not Working",
  location: "Ajmer, Rajasthan, India",
  mobileNumber: "91-9509531768",
  photoUrl: undefined,

  aboutMe:
    "I have completed my a Bachelor's degree. I am currently not working and I live in Ajmer.",

  basicDetails: {
    profileCreatedFor: "Self",
    name: "Naman",
    age: "27 yrs",
    height: "4 ft 7 in / 139 cm",
    gender: "Male",
    maritalStatus: "Unmarried",
    motherTongue: "Hindi",
    physicalStatus: "Normal",
  },

  religiousInfo: {
    subcaste: "Vathima",
    casteDivision: "Iyer (Caste / Division No Bar)",
    star: "Anuradha",
    raasi: "Vrishchik (Scorpio)",
    gothram: "Not Specified",
  },

  professionalInfo: {
    education: "B.Arch",
    educationDetail: "Not Specified",
    occupation: "Not Working",
    annualIncome: "Not Specified",
  },

  locationInfo: {
    country: "India",
    state: "Rajasthan",
    city: "Ajmer",
    citizenship: "India",
  },

  horoscopeInfo: {
    name: "Naman",
    dateOfBirth: "11 April 1999, Sunday",
    timeOfBirth: "2:2 AM, Standard Time",
    timeZone: "(Hrs. Mins): 05.30E",
    timeCorrection: "Standard Time",
    placeOfBirth: "Nicobar Is.",
    latitude: "9° 10' N",
    longitude: "92° 49' E",
    ayanamsha: "Lahiri (23° 50' 42\")",
    sunSign: "Aries (Mesha)",
    moonSign: "Vrishchik (Scorpio)",
    nakshatraPada: "Anuradha - Pada 3",
  },

  familyDetails: {
    familyStatus: "Upper middle class",
    familyValues: "Moderate",
    familyType: "Joint",
    fatherOccupation: "Business",
    motherOccupation: "Homemaker",
  },

  lifestyleInfo: {
    eatingHabits: "Non-vegetarian",
    drinkingHabits: "Not Specified",
    smokingHabits: "Not Specified",
  },

  partnerPreference: {
    maritalStatus: "Any",
    haveChildren: "Doesn't matter",
    age: "20 to 27 Yrs",
    height: "4 ft to 4 ft 7 in",
    motherTongue: "Hindi",
    physicalStatus: "Normal",
    eatingHabits: "Doesn't matter",
    drinkingHabits: "Doesn't matter",
    smokingHabits: "Doesn't matter",
    casteDivision: "Any",
    subcaste: "Any",
    star: "Any",
    manglik: "Doesn't matter",
    education: "Bachelors - Engineering / Computers. ...More",
  },
};

export const MOCK_KUNDALI_PLANETS: KundaliPlanetaryPosition[] = [
  { planet: "Ascendant (Lagna)", sign: "Scorpio (Vrishchik)", degree: "08° 14'", house: 1 },
  { planet: "Sun (Surya)", sign: "Aries (Mesha)", degree: "27° 14'", house: 6 },
  { planet: "Moon (Chandra)", sign: "Scorpio (Vrishchik)", degree: "10° 22'", house: 1 },
  { planet: "Mars (Mangal)", sign: "Libra (Tula)", degree: "18° 45'", house: 12, isRetrograde: true },
  { planet: "Mercury (Budha)", sign: "Pisces (Meena)", degree: "21° 08'", house: 5 },
  { planet: "Jupiter (Guru)", sign: "Pisces (Meena)", degree: "12° 36'", house: 5 },
  { planet: "Venus (Shukra)", sign: "Taurus (Vrishabha)", degree: "08° 19'", house: 7 },
  { planet: "Saturn (Shani)", sign: "Aries (Mesha)", degree: "15° 52'", house: 6 },
  { planet: "Rahu", sign: "Cancer (Karka)", degree: "25° 40'", house: 9, isRetrograde: true },
  { planet: "Ketu", sign: "Capricorn (Makara)", degree: "25° 40'", house: 3, isRetrograde: true },
];
