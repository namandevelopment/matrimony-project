import * as CONSTANTS from "./constants.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import geoip from "geoip-lite";
import moment from "moment-timezone";
import equal from "fast-deep-equal";

export { moment };

export const guessedTimezone =
  process.env.IS_PRODUCTION === "true" ? "Asia/Kolkata" : "Asia/Kolkata";

export const isProduction = () => {
  return process.env.IS_PRODUCTION === "true";
};

// Database result container
export const resultDb = (statusCode, data = null) => {
  return {
    statusCode: statusCode,
    data: data,
  };
};

// Unique key generator
export function generateKey(length = CONSTANTS.VERIFICATION_TOKEN_LENGTH) {
  let key = "";
  const possible = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  for (let i = 0; i < length; i++) {
    key += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return key;
}

// 6-Digit OTP generator
export function generateOTP(length = CONSTANTS.OTP_LENGTH) {
  let key = "";
  const possible = "0123456789";
  for (let i = 0; i < length; i++) {
    key += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return key;
}

// Password hashing & verification
export async function hashPassword(plainTextPassword) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainTextPassword, salt);
}

export async function verifyPassword(hash, password) {
  try {
    return await bcrypt.compare(password, hash);
  } catch (err) {
    logMessage("Error verifying password:", err, "error");
    return false;
  }
}

// Uniform API HTTP Response Builder
export const apiHTTPResponse = (
  req,
  res,
  httpCode = CONSTANTS.HTTP_SERVICE_UNAVAILABLE,
  message = CONSTANTS.DATA_NULL,
  data = CONSTANTS.DATA_NULL,
  code = CONSTANTS.SERVICE_UNAVAILABLE,
  error = CONSTANTS.ERROR_TRUE
) => {
  const defaultMsg = httpCode >= 500
    ? "An internal server error occurred. Please try again."
    : (httpCode >= 400 ? "Request could not be processed. Please check your input." : "Success.");

  const responsePayload = {
    message: message || defaultMsg,
    code: typeof code === "number" ? code : (Number(code) || httpCode),
    error: httpCode === CONSTANTS.HTTP_OK || httpCode === CONSTANTS.HTTP_CREATED ? CONSTANTS.ERROR_FALSE : error,
    data: data,
  };

  if (data && typeof data === "object" && data.errors) {
    responsePayload.errors = data.errors;
  }

  return res.status(httpCode).json(responsePayload);
};

// Universal Entity/Document Sanitizer & Deduplicator:
// 1. Strict single '_id' standard (removes redundant 'id' virtual).
// 2. Removes internal/sensitive fields (__v, isDeleted, password, tokens, deduplication hashes).
// 3. Ultra-compact, fast, recursion-safe for nested subdocuments and arrays.
export const cleanEntity = (entity, options = {}) => {
  if (entity === null || entity === undefined) return entity;
  if (Array.isArray(entity)) {
    return entity.map((item) => cleanEntity(item, options));
  }
  if (typeof entity !== "object") return entity;

  // If Mongoose document instance, convert to plain object with virtuals disabled
  let raw = entity;
  if (typeof entity.toObject === "function") {
    raw = entity.toObject({ virtuals: false });
  } else if (entity._doc) {
    raw = { ...entity._doc };
  } else {
    raw = { ...entity };
  }

  const clean = {};
  for (const [key, value] of Object.entries(raw)) {
    // 1. Exclude internal database metadata & credentials
    if (
      key === "__v" ||
      key === "isDeleted" ||
      key === "password" ||
      key === "verificationToken" ||
      key === "passwordResetToken" ||
      key === "identityDeduplicationHash"
    ) {
      continue;
    }

    // 2. Eliminate duplicate Mongoose virtual 'id' if '_id' exists
    if (key === "id" && raw._id !== undefined) {
      continue;
    }

    // 3. Normalize _id to clean string representation
    if (key === "_id") {
      clean._id = value?.toString ? value.toString() : String(value);
      continue;
    }

    // 4. Strip redundant userId when requested
    if (options.stripUserId && key === "userId") {
      continue;
    }

    // 5. Recursively clean nested objects and arrays
    if (value && typeof value === "object") {
      if (value instanceof Date) {
        clean[key] = value.getTime();
      } else if (Array.isArray(value)) {
        clean[key] = value.map((sub) =>
          sub && typeof sub === "object" ? cleanEntity(sub, options) : sub
        );
      } else if (
        value._bsontype === "ObjectID" ||
        value.constructor?.name === "ObjectId" ||
        (typeof value.toHexString === "function")
      ) {
        clean[key] = value.toString();
      } else {
        clean[key] = cleanEntity(value, options);
      }
    } else {
      clean[key] = value;
    }
  }

  // Fallback: If only 'id' was present without '_id', standardize to '_id'
  if (!clean._id && clean.id) {
    clean._id = clean.id.toString();
    delete clean.id;
  }

  return clean;
};

// Async Handler to eliminate try/catch in skinny controllers
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Normalizes values for Mongo/Mongoose BSON & JSON safe deep equality
export const normalizeForComparison = (val) => {
  if (val === null || val === undefined) return null;

  // If Mongoose document instance, convert to plain object
  if (typeof val === "object" && typeof val.toObject === "function") {
    val = val.toObject();
  }

  if (typeof val === "object") {
    // MongoDB ObjectId support
    if (
      val._bsontype === "ObjectID" ||
      typeof val.toHexString === "function" ||
      (typeof val.toString === "function" && val.constructor?.name === "ObjectId")
    ) {
      return val.toString();
    }
    // Date / Moment support
    if (val instanceof Date) {
      return val.getTime();
    }
    // Array support
    if (Array.isArray(val)) {
      return val.map(normalizeForComparison);
    }
    // Plain Object recursion
    const cleanObj = {};
    for (const [k, v] of Object.entries(val)) {
      cleanObj[k] = normalizeForComparison(v);
    }
    return cleanObj;
  }
  return val;
};

// Smart zero-write mutation memoization using fast-deep-equal with Mongo & JSON normalization
export const isDataEqual = (currentData, incomingData) => {
  if (currentData === incomingData) return true;
  if (
    (currentData === null || currentData === undefined) &&
    (incomingData === null || incomingData === undefined)
  ) {
    return true;
  }
  return equal(normalizeForComparison(currentData), normalizeForComparison(incomingData));
};

// Zero-write delta comparison helper: checks if all keys in incomingDelta already match existingDoc
export const isDeltaEqual = (
  existingDoc,
  incomingDelta,
  ignoreFields = ["updatedAt", "createdAt", "_id", "id", "__v"]
) => {
  if (!existingDoc || !incomingDelta) return false;

  for (const [key, value] of Object.entries(incomingDelta)) {
    if (ignoreFields.includes(key)) continue;

    // Support dot-notation path traversal (e.g. "education.degree" or "family.fatherName")
    let existingValue;
    if (key.includes(".")) {
      existingValue = key
        .split(".")
        .reduce(
          (acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined),
          existingDoc
        );
    } else {
      existingValue = existingDoc[key];
    }

    if (!isDataEqual(existingValue, value)) {
      return false;
    }
  }
  return true;
};

// Standard Joi schema runner
export const joiValidatorFunction = async (schema, data) => {
  try {
    await schema.validateAsync(data, {
      abortEarly: false,
      stripUnknown: true,
    });
    return null;
  } catch (error) {
    const errorMap = error?.details?.reduce((acc, detail) => {
      const fieldName = (detail.path && detail.path.length > 0)
        ? detail.path.join(".")
        : (detail.context?.label || detail.context?.key || "field");
      const errorMessage = detail.message.replace(/"/g, "");
      acc[fieldName] = errorMessage;
      return acc;
    }, {}) || {};
    return Object.values(errorMap).join(", ");
  }
};

// IP Geolocation
export const ipDetectorDetails = (ip) => {
  if (!ip) return null;
  const cleanIp = ip.split(",")[0].trim();
  return geoip.lookup(cleanIp);
};

// Schema Timestamp Defaults
export function addTimeStamp() {
  return {
    isDisable: {
      type: Boolean,
      default: false,
      index: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    createdAt: {
      type: Number,
      default: () => moment().valueOf(),
      index: true,
    },
    updatedAt: {
      type: Number,
      default: () => moment().valueOf(),
    },
  };
}

// Universal Logging Helper
export function logMessage(
  message = "Default log message",
  error = null,
  level = "info"
) {
  const upperMessage = message.toUpperCase();

  switch (level.toLowerCase()) {
    case "error":
      if (error) {
        console.error(upperMessage, error);
      } else {
        console.error(upperMessage);
      }
      break;

    case "warn":
      console.warn(upperMessage);
      if (error) console.warn(error);
      break;

    case "info":
      console.info(upperMessage);
      if (error) console.info(error);
      break;

    case "debug":
      console.debug(upperMessage);
      if (error) console.debug(error);
      break;

    default:
      console.log(upperMessage);
  }
}

// Generates SHA-256 fingerprint for candidate deduplication (Name + DOB + Gender + Subcaste)
export function generateCandidateDeduplicationHash({ name, dateOfBirth, dob, gender, subcaste }) {
  const normName = String(name || "").toLowerCase().trim();
  const normGender = String(gender || "").toUpperCase().trim();
  const normSubcaste = String(subcaste || "").toLowerCase().trim();

  let formattedDob = "";
  const rawDob = dateOfBirth || dob;
  if (rawDob) {
    const d = new Date(isNaN(Number(rawDob)) ? rawDob : Number(rawDob));
    if (!isNaN(d.getTime())) {
      formattedDob = d.toISOString().split("T")[0]; // YYYY-MM-DD
    }
  }

  const identityString = `${normName}_${formattedDob}_${normGender}_${normSubcaste}`;
  return crypto.createHash("sha256").update(identityString).digest("hex");
}
