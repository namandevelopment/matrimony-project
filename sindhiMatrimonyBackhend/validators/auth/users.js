import Joi from "joi";
import {
  phoneValidation,
  requiredString,
  optionalString,
  optionalEmailValidator,
  requiredNumber,
  optionalNumber,
  requiredEnum,
  optionalEnum,
} from "../../utils/joiValidationDataType.js";

// Send OTP Request Schema (Strictly for Registration and Password Reset)
export const sendOtpSchema = Joi.object({
  phone: phoneValidation(),
  countryCode: optionalString(2, 6).default("+91"),
  purpose: Joi.string()
    .trim()
    .uppercase()
    .valid("REGISTER", "RESET_PASSWORD", "LOGIN")
    .default("REGISTER"),
});

// Full Registration Request Schema (Mobile Quick Register, Web Landing, & Wizard Form)
export const registerUserSchema = Joi.object({
  phone: phoneValidation(),
  otp: requiredString(4, 6).messages({
    "string.empty": "Verification code (OTP) is required.",
    "any.required": "Verification code (OTP) is required.",
  }),
  password: requiredString(6, 50).messages({
    "string.empty": "Password is required for registration.",
    "any.required": "Password is required for registration.",
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

// Candidate Login with Mobile Number and Password Schema
export const loginWithPasswordSchema = Joi.object({
  phone: optionalString(4, 25),
  mobileNumber: optionalString(4, 25),
  mobile: optionalString(4, 25),
  identifier: optionalString(4, 50),
  password: requiredString(6, 50).messages({
    "string.empty": "Password is required for login.",
    "any.required": "Password is required for login.",
  }),
  countryCode: optionalString(2, 6).default("+91"),
  fcmToken: optionalString(10, 500),
  clientPlatform: Joi.string()
    .trim()
    .uppercase()
    .valid("MOBILE", "WEB")
    .default("WEB"),
})
  .custom((value, helpers) => {
    const rawPhone = value.phone || value.mobileNumber || value.mobile || value.identifier;
    if (!rawPhone || typeof rawPhone !== "string" || !rawPhone.trim()) {
      return helpers.message("Mobile number is required for login.");
    }

    // Sanitize phone number (strip whitespace, hyphens, plus, parentheses)
    let clean = rawPhone.trim().replace(/[\s+\-().]/g, "");

    // If prefixed with country code 91 (length 12) or trunk prefix 0 (length 11), strip prefix
    if (clean.startsWith("91") && clean.length === 12) {
      clean = clean.slice(2);
    } else if (clean.startsWith("0") && clean.length === 11) {
      clean = clean.slice(1);
    }

    // Verify 10-digit Indian mobile number starting with 6, 7, 8, or 9
    if (!/^[6-9]\d{9}$/.test(clean)) {
      return helpers.message("Please enter a valid 10-digit mobile number.");
    }

    value.phone = clean;
    return value;
  });

// Forgot Password (Send OTP) Schema
export const forgotPasswordSchema = Joi.object({
  phone: phoneValidation(),
  countryCode: optionalString(2, 6).default("+91"),
});

// Reset Password (Verify OTP & Set New Password) Schema
export const resetPasswordSchema = Joi.object({
  phone: phoneValidation(),
  otp: optionalString(4, 6),
  newPassword: requiredString(6, 50).messages({
    "string.empty": "New password is required (min 6 characters).",
    "any.required": "New password is required.",
  }),
  countryCode: optionalString(2, 6).default("+91"),
  token: optionalString(10, 1000),
}).or("otp", "token");

// Verify Login / Reset OTP Schema
export const verifyOtpSchema = Joi.object({
  phone: phoneValidation(),
  otp: requiredString(4, 6),
  purpose: Joi.string()
    .trim()
    .uppercase()
    .valid("LOGIN", "RESET_PASSWORD", "REGISTER")
    .default("LOGIN"),
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
    .valid("REGISTER", "RESET_PASSWORD", "LOGIN")
    .default("REGISTER"),
});

// Fast Phone Pre-Check Schema (Instant Check on registration typing)
export const checkPhoneSchema = Joi.object({
  phone: phoneValidation(),
  countryCode: optionalString(2, 6).default("+91"),
});

// Create Secondary Profile Schema (For adding sibling, child, self under same account)
export const createSecondaryProfileSchema = Joi.object({
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
    .required()
    .messages({
      "any.only": "Value must be one of: MYSELF, SON, DAUGHTER, BROTHER, SISTER, FRIEND, RELATIVE",
      "any.required": "Relationship profileFor is required.",
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
  subcaste: requiredString(2, 50).messages({
    "string.empty": "Subcaste is required.",
    "any.required": "Subcaste is required.",
  }),
  dob: requiredString(4, 30).messages({
    "string.empty": "Date of birth (dob) is required.",
    "any.required": "Date of birth (dob) is required.",
  }),
  dateOfBirth: optionalNumber(),
  maritalStatus: requiredString(3, 50).messages({
    "string.empty": "Marital status is required.",
    "any.required": "Marital status is required.",
  }),
  height: requiredNumber(50, 300).messages({
    "number.base": "Height is required.",
    "any.required": "Height is required.",
  }),
  education: requiredString(2, 100).messages({
    "string.empty": "Education is required.",
    "any.required": "Education is required.",
  }),
  profession: requiredString(2, 100).messages({
    "string.empty": "Profession is required.",
    "any.required": "Profession is required.",
  }),
  occupation: optionalString(2, 100),
  annualIncome: requiredNumber(0).messages({
    "number.base": "Annual income is required.",
    "any.required": "Annual income is required.",
  }),
  city: requiredString(2, 100).messages({
    "string.empty": "City is required.",
    "any.required": "City is required.",
  }),
  state: requiredString(2, 100).messages({
    "string.empty": "State is required.",
    "any.required": "State is required.",
  }),
  nativePlace: requiredString(2, 100).messages({
    "string.empty": "Native place is required.",
    "any.required": "Native place is required.",
  }),
  aboutMe: requiredString(5, 1500).messages({
    "string.empty": "About candidate description is required.",
    "any.required": "About candidate description is required.",
  }),
});

// Switch Active Profile Context Schema
export const switchProfileSchema = Joi.object({
  targetProfileId: requiredString(1, 50).messages({
    "string.empty": "Target profile ID is required.",
    "any.required": "Target profile ID is required.",
  }),
});

// Update Profile Status Schema (e.g. Deactivation / Hide)
export const updateProfileStatusSchema = Joi.object({
  status: Joi.string()
    .trim()
    .uppercase()
    .valid("ACTIVE", "DEACTIVATED", "HIDDEN")
    .required()
    .messages({
      "any.only": "Status must be one of: ACTIVE, DEACTIVATED, HIDDEN",
      "any.required": "Profile status is required.",
    }),
});

// Grant Family Access Delegation Schema
export const grantAccessSchema = Joi.object({
  granteePhone: phoneValidation(),
  accessRole: Joi.string()
    .trim()
    .uppercase()
    .valid("OWNER", "CO_MANAGER", "VIEWER")
    .required()
    .messages({
      "any.only": "Access role must be one of: OWNER, CO_MANAGER, VIEWER",
      "any.required": "Access role is required.",
    }),
  relationshipToCandidate: Joi.string()
    .trim()
    .uppercase()
    .valid("PARENT", "SIBLING", "RELATIVE", "MATCHMAKER", "SELF")
    .default("PARENT"),
});

// Profile Transfer Schema
export const transferProfileSchema = Joi.object({
  candidatePhone: phoneValidation(),
  otp: optionalString(4, 6),
});

// Refresh Token Schema
export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string()
    .trim()
    .required()
    .messages({
      "string.empty": "Refresh token is required.",
      "any.required": "Refresh token is required.",
    }),
});


