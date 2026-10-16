import Joi from "joi";
import {
  optionalString,
  optionalNumber,
  subcasteValidation,
  manglikValidation,
  maritalStatusValidation,
} from "../../utils/joiValidationDataType.js";
import { MARITAL_STATUS, SINDHI_SUBCASTES, MANGLIK_STATUS } from "../../utils/variables.js";

// 1. Basic & Cultural Details
export const basicProfileSchema = Joi.object({
  maritalStatus: maritalStatusValidation().optional(),
  dateOfBirth: optionalNumber(0), // Timestamp in ms
  age: optionalNumber(18, 100),
  height: optionalNumber(100, 250), // cm
  subcaste: subcasteValidation().optional(),
  gotra: optionalString(2, 50),
  motherGotra: optionalString(2, 50),
  aboutMe: optionalString(0, 1500),
  location: Joi.object({
    city: optionalString(1, 100),
    state: optionalString(1, 100),
    country: optionalString(1, 100).default("India"),
    nativePlace: optionalString(1, 100),
  }).optional(),
}).options({ stripUnknown: true });

// 2. Education & Career
export const educationCareerSchema = Joi.object({
  education: Joi.object({
    degree: optionalString(1, 100),
    field: optionalString(1, 100),
    college: optionalString(1, 150),
  }).optional(),
  profession: Joi.object({
    occupation: optionalString(1, 100),
    companyName: optionalString(1, 150),
    annualIncome: optionalNumber(0),
    currency: optionalString(1, 10).default("INR"),
  }).optional(),
}).options({ stripUnknown: true });

// 3. Family Background
export const familySchema = Joi.object({
  family: Joi.object({
    fatherName: optionalString(1, 100),
    fatherOccupation: optionalString(1, 100),
    motherName: optionalString(1, 100),
    motherOccupation: optionalString(1, 100),
    brothersCount: optionalNumber(0, 20).default(0),
    sistersCount: optionalNumber(0, 20).default(0),
    familyType: Joi.string().valid("NUCLEAR", "JOINT").default("NUCLEAR"),
    familyValues: Joi.string().valid("TRADITIONAL", "MODERATE", "LIBERAL").default("MODERATE"),
  }).optional(),
}).options({ stripUnknown: true });

// 4. Astro & Kundli
export const horoscopeSchema = Joi.object({
  manglik: manglikValidation().optional(),
  horoscope: Joi.object({
    nakshatra: optionalString(1, 50),
    rashi: optionalString(1, 50),
    charan: optionalNumber(1, 4),
    birthTime: optionalString(1, 20),
    birthPlace: optionalString(1, 100),
  }).optional(),
}).options({ stripUnknown: true });

// 5. Partner Preferences
export const partnerPreferenceSchema = Joi.object({
  ageMin: optionalNumber(18, 70).default(21),
  ageMax: optionalNumber(18, 70).default(35),
  heightMin: optionalNumber(120, 230).default(150),
  heightMax: optionalNumber(120, 230).default(195),
  maritalStatus: Joi.array().items(Joi.string().valid(...MARITAL_STATUS)).optional(),
  subcastes: Joi.array().items(Joi.string().valid(...SINDHI_SUBCASTES)).optional(),
  excludedGotras: Joi.array().items(Joi.string().trim()).optional(),
  manglikPreference: Joi.array().items(Joi.string().valid(...MANGLIK_STATUS)).optional(),
  preferredCities: Joi.array().items(Joi.string().trim()).optional(),
  minAnnualIncome: optionalNumber(0).default(0),
}).options({ stripUnknown: true });

// 6. Generic Onboarding Step Validator (Steps 1 to 7)
export const onboardingStepSchema = Joi.object({
  step: Joi.number().min(1).max(7).required(),
  data: Joi.object().required(),
}).options({ stripUnknown: true });
