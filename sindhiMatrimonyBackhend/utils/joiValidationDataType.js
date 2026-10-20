import Joi from "joi";
import { STRONG_PASSWORD_ERROR, INVALID_PHONE, INVALID_EMAIL } from "./constantsMessage.js";
import { PASSWORD_REGEX, INDIAN_PHONE_REGEX } from "./constants.js";
import { SINDHI_SUBCASTES, MANGLIK_STATUS, MARITAL_STATUS } from "./variables.js";

// Text & Strings
export const requiredString = (min = 1, max = 255) =>
  Joi.string().trim().min(min).max(max).required();

export const optionalString = (min = 1, max = 255) =>
  Joi.string().trim().min(min).max(max).optional().allow("", null);

// Email Validation
export const emailValidation = () =>
  Joi.string().trim().email().required().messages({
    "string.empty": "Email is required.",
    "string.email": INVALID_EMAIL,
    "any.required": "Email is required.",
  });

export const optionalEmailValidator = () =>
  Joi.string().trim().email().allow(null, "").messages({
    "string.email": INVALID_EMAIL,
  });

// Indian Mobile Number Validation
export const phoneValidation = () =>
  Joi.string()
    .trim()
    .pattern(INDIAN_PHONE_REGEX)
    .required()
    .messages({
      "string.empty": "Phone number is required.",
      "string.pattern.base": INVALID_PHONE,
      "any.required": "Phone number is required.",
    });

export const optionalPhoneValidation = () =>
  Joi.string()
    .trim()
    .pattern(INDIAN_PHONE_REGEX)
    .optional()
    .allow(null, "")
    .messages({
      "string.pattern.base": INVALID_PHONE,
    });

// Passwords
export const passwordValidation = (min = 8, max = 30) =>
  Joi.string()
    .trim()
    .required()
    .min(min)
    .max(max)
    .pattern(PASSWORD_REGEX)
    .disallow("")
    .messages({
      "string.empty": "Password is required.",
      "any.required": "Password is required.",
      "string.min": `Password must be at least ${min} characters.`,
      "string.max": `Password must be at most ${max} characters.`,
      "string.pattern.base": STRONG_PASSWORD_ERROR,
    });

export const confirmPasswordValidation = () =>
  Joi.string()
    .trim()
    .when("password", {
      is: Joi.string().min(1),
      then: Joi.valid(Joi.ref("password")).required().messages({
        "any.only": "Confirm password does not match password.",
        "any.required": "Please confirm your password.",
      }),
      otherwise: Joi.optional().allow(""),
    });

// MongoDB 24-char Hex ObjectId Validation
export const objectIdValidation = (fieldName = "ID") =>
  Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": `Invalid ${fieldName} format. Must be a valid 24-character hexadecimal ObjectId.`,
      "any.required": `${fieldName} is required.`,
    });

export const optionalObjectIdValidation = (fieldName = "ID") =>
  Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .optional()
    .allow(null, "")
    .messages({
      "string.pattern.base": `Invalid ${fieldName} format.`,
    });

// Numbers & Booleans
export const requiredNumber = (min = 0, max = Number.MAX_SAFE_INTEGER) =>
  Joi.number().min(min).max(max).required();

export const optionalNumber = (min = 0, max = Number.MAX_SAFE_INTEGER) =>
  Joi.number().min(min).max(max).optional().allow(null);

export const requiredBoolean = () => Joi.boolean().required();
export const optionalBoolean = () => Joi.boolean().optional().allow(null);

// Arrays & Enums
export const requiredArray = (itemsSchema, min = 1, max = undefined) =>
  Joi.array()
    .items(itemsSchema)
    .min(min)
    .max(max || Number.MAX_SAFE_INTEGER)
    .required();

export const optionalArray = (itemsSchema) =>
  Joi.array().items(itemsSchema).optional().allow(null);

export const requiredEnum = (enumValues) =>
  Joi.string()
    .valid(...enumValues)
    .required()
    .messages({
      "any.only": `Value must be one of: ${enumValues.join(", ")}`,
    });

export const optionalEnum = (enumValues) =>
  Joi.string()
    .valid(...enumValues)
    .allow(null, "")
    .optional();

// Matrimonial Domain Checks
export const matrimonyAgeValidation = (gender = "MALE") => {
  const minAge = gender === "FEMALE" ? 18 : 21;
  return Joi.number()
    .integer()
    .min(minAge)
    .max(75)
    .required()
    .messages({
      "number.min": `Legal minimum marriage age is ${minAge} years for ${gender.toLowerCase()} candidates.`,
      "number.max": "Maximum age limit is 75 years.",
    });
};

export const subcasteValidation = () =>
  Joi.string()
    .valid(...SINDHI_SUBCASTES)
    .required()
    .messages({
      "any.only": `Please select a valid Sindhi subcaste (${SINDHI_SUBCASTES.join(", ")})`,
    });

export const manglikValidation = () =>
  Joi.string()
    .valid(...MANGLIK_STATUS)
    .required();

export const maritalStatusValidation = () =>
  Joi.string()
    .valid(...MARITAL_STATUS)
    .required();

export const aadhaarValidation = () =>
  Joi.string()
    .trim()
    .regex(/^\d{12}$/)
    .required()
    .messages({
      "string.pattern.base": "Aadhaar number must be exactly 12 digits.",
    });
