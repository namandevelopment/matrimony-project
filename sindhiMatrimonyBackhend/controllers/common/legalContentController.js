import LegalContent from "../../models/common/legalContent.model.js";
import {
  DEFAULT_PRIVACY_POLICY,
  DEFAULT_TERMS_AND_CONDITIONS,
} from "../../constants/legalContentSeed.js";
import {
  HTTP_OK,
  HTTP_NOT_FOUND,
  HTTP_INTERNAL_SERVER_ERROR,
  OK,
  ERROR_FALSE,
  ERROR_TRUE,
} from "../../utils/constants.js";
import { apiHTTPResponse, logMessage, asyncHandler } from "../../utils/globalFunction.js";

/**
 * Normalizes frontend path/param (e.g., 'privacy-policy') to DB enum ('PRIVACY_POLICY')
 */
const normalizeType = (rawType) => {
  if (!rawType) return null;
  const clean = String(rawType).trim().toUpperCase().replace(/-/g, "_");
  if (clean === "PRIVACY_POLICY" || clean === "PRIVACY") return "PRIVACY_POLICY";
  if (
    clean === "TERMS_AND_CONDITIONS" ||
    clean === "TERMS_CONDITIONS" ||
    clean === "TERMS"
  )
    return "TERMS_AND_CONDITIONS";
  if (clean === "SAFETY_TIPS" || clean === "SAFETY") return "SAFETY_TIPS";
  return null;
};

/**
 * 🔒 Internal Helper: Ensure Default Seed Data Exists in Database
 */
const getOrSeedPolicy = async (dbType) => {
  try {
    let doc = await LegalContent.findOne({ type: dbType, isActive: true }).lean();
    if (!doc) {
      const seedData =
        dbType === "PRIVACY_POLICY"
          ? DEFAULT_PRIVACY_POLICY
          : DEFAULT_TERMS_AND_CONDITIONS;

      try {
        doc = await LegalContent.create(seedData);
        logMessage(`✅ Seeded ${dbType} into database.`, null, "info");
      } catch (insertErr) {
        // Fallback to in-memory seed data if DB insertion fails
        return seedData;
      }
    }
    return doc;
  } catch (err) {
    logMessage(`⚠️ Error reading ${dbType} from DB: ${err.message}`, null, "warn");
    return dbType === "PRIVACY_POLICY"
      ? DEFAULT_PRIVACY_POLICY
      : DEFAULT_TERMS_AND_CONDITIONS;
  }
};

/**
 * 📜 1. GET PRIVACY POLICY
 * Route: GET /api/v1/content/privacy-policy
 * Public API
 */
export const getPrivacyPolicy = asyncHandler(async (req, res) => {
  const policy = await getOrSeedPolicy("PRIVACY_POLICY");
  return apiHTTPResponse(
    req,
    res,
    HTTP_OK,
    "Privacy Policy retrieved successfully.",
    policy,
    OK,
    ERROR_FALSE
  );
});

/**
 * 📜 2. GET TERMS & CONDITIONS
 * Route: GET /api/v1/content/terms-and-conditions
 * Public API
 */
export const getTermsAndConditions = asyncHandler(async (req, res) => {
  const terms = await getOrSeedPolicy("TERMS_AND_CONDITIONS");
  return apiHTTPResponse(
    req,
    res,
    HTTP_OK,
    "Terms & Conditions retrieved successfully.",
    terms,
    OK,
    ERROR_FALSE
  );
});

/**
 * 📜 3. GET DYNAMIC LEGAL CONTENT BY TYPE
 * Route: GET /api/v1/content/:type
 * Public API
 */
export const getLegalContentByType = asyncHandler(async (req, res) => {
  const { type: rawType } = req.params;
  const dbType = normalizeType(rawType);

  if (!dbType) {
    return apiHTTPResponse(
      req,
      res,
      HTTP_NOT_FOUND,
      `Invalid legal content type '${rawType}'. Supported: privacy-policy, terms-and-conditions.`,
      null,
      HTTP_NOT_FOUND,
      ERROR_TRUE
    );
  }

  const content = await getOrSeedPolicy(dbType);
  return apiHTTPResponse(
    req,
    res,
    HTTP_OK,
    `${content.title || dbType} retrieved successfully.`,
    content,
    OK,
    ERROR_FALSE
  );
});

/**
 * ✏️ 4. UPDATE LEGAL CONTENT (ADMIN)
 * Route: PUT /api/v1/content/:type
 * Route: PUT /api/v1/admin/content/:type
 * Protected (Admin / System)
 */
export const updateLegalContent = asyncHandler(async (req, res) => {
  const { type: rawType } = req.params;
  const dbType = normalizeType(rawType);

  if (!dbType) {
    return apiHTTPResponse(
      req,
      res,
      HTTP_NOT_FOUND,
      `Invalid legal content type '${rawType}'.`,
      null,
      HTTP_NOT_FOUND,
      ERROR_TRUE
    );
  }

  const {
    title,
    version,
    effectiveDate,
    lastUpdatedDate,
    meta,
    introduction,
    sections,
    assurance,
    contactInfo,
  } = req.body;

  const updatePayload = {
    ...(title && { title }),
    ...(version && { version }),
    ...(effectiveDate && { effectiveDate }),
    lastUpdatedDate:
      lastUpdatedDate ||
      new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    ...(meta && { meta }),
    ...(introduction && { introduction }),
    ...(Array.isArray(sections) && { sections }),
    ...(assurance && { assurance }),
    ...(contactInfo && { contactInfo }),
  };

  const updatedDoc = await LegalContent.findOneAndUpdate(
    { type: dbType },
    { $set: updatePayload },
    { new: true, upsert: true, runValidators: true }
  );

  return apiHTTPResponse(
    req,
    res,
    HTTP_OK,
    `${updatedDoc.title || dbType} updated successfully.`,
    updatedDoc,
    OK,
    ERROR_FALSE
  );
});
