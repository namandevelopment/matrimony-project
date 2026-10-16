import Joi from "joi";
import {
  phoneValidation,
  requiredString,
  optionalString,
  optionalEmailValidator,
  optionalNumber,
  requiredEnum,
  optionalEnum,
} from "../../utils/joiValidationDataType.js";

// Send OTP Request Schema
export const sendOtpSchema = Joi.object({
  phone: phoneValidation(),
  countryCode: optionalString(2, 6).default("+91"),
  purpose: Joi.string()
    .trim()
    .uppercase()
    .valid("LOGIN", "REGISTER", "RESET_PASSWORD")
    .default("LOGIN"),
});

// Full Registration Request Schema (Mobile Quick Register, Web Landing, & Wizard Form)
export const registerUserSchema = Joi.object({
  phone: phoneValidation(),
  otp: requiredString(4, 6).messages({
    "string.empty": "Verification code (OTP) is required.",
    "any.required": "Verification code (OTP) is required.",
  }),
  name: requiredString(2, 100).messages({
    "string.empty": "Candidate's full name is required.",
    "any.required": "Candidate's full name is required.",
  }),
  profileFor: Joi.string()
    .trim()
    .uppercase()
    .valid(
      "MYSELF",
      "SON",
      "DAUGHTER",
      "BROTHER",
      "SISTER",
      "FRIEND",
      "RELATIVE"
    )
    .default("MYSELF")
    .messages({
      "any.only": "Value must be one of: MYSELF, SON, DAUGHTER, BROTHER, SISTER, FRIEND, RELATIVE",
    }),
  gender: Joi.string()
    .trim()
    .uppercase()
    .valid("MALE", "FEMALE")
    .required()
    .messages({
      "any.only": "Gender must be either MALE or FEMALE.",
      "any.required": "Gender is required.",
    }),
  countryCode: optionalString(2, 6).default("+91"),
  email: optionalEmailValidator(),
  password: optionalString(6, 50),
  fcmToken: optionalString(10, 500),
  clientPlatform: Joi.string()
    .trim()
    .uppercase()
    .valid("MOBILE", "WEB")
    .default("WEB"),

  // Optional multi-step registration wizard extensions (1-step or multi-step hydration)
  subcaste: optionalString(2, 50),
  dateOfBirth: optionalNumber(),
  dob: optionalString(4, 30),
  maritalStatus: optionalString(3, 50),
  height: optionalNumber(),
  education: optionalString(2, 100),
  profession: optionalString(2, 100),
  occupation: optionalString(2, 100),
  annualIncome: optionalNumber(),
  city: optionalString(2, 100),
  state: optionalString(2, 100),
  nativePlace: optionalString(2, 100),
  aboutMe: optionalString(0, 1500),
  aboutMyself: optionalString(0, 1500),
  familyStatus: optionalString(0, 50),
});

// Verify Login OTP Schema
export const verifyOtpSchema = Joi.object({
  phone: phoneValidation(),
  otp: requiredString(4, 6),
  countryCode: optionalString(2, 6).default("+91"),
  fcmToken: optionalString(10, 500),
  clientPlatform: Joi.string()
    .trim()
    .uppercase()
    .valid("MOBILE", "WEB")
    .default("WEB"),
});

// Resend OTP Schema
export const resendOtpSchema = Joi.object({
  phone: phoneValidation(),
  countryCode: optionalString(2, 6).default("+91"),
  purpose: Joi.string()
    .trim()
    .uppercase()
    .valid("LOGIN", "REGISTER", "RESET_PASSWORD")
    .default("LOGIN"),
});

// Fast Phone Pre-Check Schema (Instant Check on registration typing)
export const checkPhoneSchema = Joi.object({
  phone: phoneValidation(),
  countryCode: optionalString(2, 6).default("+91"),
});

