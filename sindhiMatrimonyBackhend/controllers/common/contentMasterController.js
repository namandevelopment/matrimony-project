import mongoose from "mongoose";
import LegalContent from "../../models/common/legalContent.model.js";
import OurProcess from "../../models/common/ourProcess.model.js";
import HelpSupport from "../../models/support/helpSupport.model.js";
import SupportTicket from "../../models/support/supportTicket.model.js";
import {
  DEFAULT_PRIVACY_POLICY,
  DEFAULT_TERMS_AND_CONDITIONS,
} from "../../constants/legalContentSeed.js";
import DEFAULT_OUR_PROCESS from "../../constants/ourProcessSeed.js";
import { DEFAULT_HELP_SUPPORT_DATA } from "../../constants/helpSupportSeed.js";
import {
  HTTP_OK,
  HTTP_CREATED,
  HTTP_BAD_REQUEST,
  HTTP_NOT_FOUND,
  HTTP_INTERNAL_SERVER_ERROR,
  OK,
  ERROR_FALSE,
  ERROR_TRUE,
} from "../../utils/constants.js";
import { apiHTTPResponse, logMessage, asyncHandler } from "../../utils/globalFunction.js";

/**
 * 🏷️ Normalize various query/path type values to standardized keys
 */
export const normalizeType = (rawType) => {
  if (!rawType) return null;
  const clean = String(rawType).trim().toUpperCase().replace(/[-\s]/g, "_");

  if (clean === "PRIVACY_POLICY" || clean === "PRIVACY") return "PRIVACY_POLICY";
  if (
    clean === "TERMS_AND_CONDITIONS" ||
    clean === "TERMS_CONDITIONS" ||
    clean === "TERMS"
  )
    return "TERMS_AND_CONDITIONS";
  if (
    clean === "HELP_SUPPORT" ||
    clean === "HELP" ||
    clean === "SUPPORT" ||
    clean === "HELP_DESK" ||
    clean === "FAQS"
  )
    return "HELP_SUPPORT";
  if (
    clean === "OUR_PROCESS" ||
    clean === "PROCESS" ||
    clean === "HOW_IT_WORKS" ||
    clean === "STEPS"
  )
    return "OUR_PROCESS";
  if (clean === "SAFETY_TIPS" || clean === "SAFETY") return "SAFETY_TIPS";
  if (clean === "ALL") return "ALL";

  return null;
};

/**
 * ✂️ Helper: Project only requested fields if ?select=title,sections or ?fields=... is specified
 */
const projectFields = (doc, selectQuery) => {
  if (!doc || !selectQuery) return doc;
  const fields = String(selectQuery)
    .split(",")
    .map((f) => f.trim())
    .filter(Boolean);

  if (fields.length === 0) return doc;

  const rawObj = doc.toObject ? doc.toObject() : { ...doc };
  const filtered = {};

  // Always keep essential identifiers
  if (rawObj.type) filtered.type = rawObj.type;
  if (rawObj.key) filtered.key = rawObj.key;

  fields.forEach((field) => {
    if (rawObj[field] !== undefined) {
      filtered[field] = rawObj[field];
    }
  });

  return Object.keys(filtered).length > 0 ? filtered : rawObj;
};

/**
 * 🔒 Safe Data Fetchers with DB auto-seed and in-memory resilience
 */
export const fetchPrivacyPolicy = async () => {
  if (mongoose.connection.readyState !== 1) {
    return DEFAULT_PRIVACY_POLICY;
  }
  try {
    let doc = await LegalContent.findOne({
      type: "PRIVACY_POLICY",
      isActive: true,
    }).lean();

    if (!doc) {
      try {
        doc = await LegalContent.create(DEFAULT_PRIVACY_POLICY);
        logMessage("✅ Seeded Privacy Policy into database.", null, "info");
      } catch {
        return DEFAULT_PRIVACY_POLICY;
      }
    }
    return doc;
  } catch (err) {
    logMessage(`⚠️ Privacy Policy fetch error: ${err.message}`, null, "warn");
    return DEFAULT_PRIVACY_POLICY;
  }
};

export const fetchTermsAndConditions = async () => {
  if (mongoose.connection.readyState !== 1) {
    return DEFAULT_TERMS_AND_CONDITIONS;
  }
  try {
    let doc = await LegalContent.findOne({
      type: "TERMS_AND_CONDITIONS",
      isActive: true,
    }).lean();

    if (!doc) {
      try {
        doc = await LegalContent.create(DEFAULT_TERMS_AND_CONDITIONS);
        logMessage("✅ Seeded Terms & Conditions into database.", null, "info");
      } catch {
        return DEFAULT_TERMS_AND_CONDITIONS;
      }
    }
    return doc;
  } catch (err) {
    logMessage(`⚠️ Terms & Conditions fetch error: ${err.message}`, null, "warn");
    return DEFAULT_TERMS_AND_CONDITIONS;
  }
};

export const fetchHelpSupport = async (options = {}) => {
  const { category, q } = options;

  if (mongoose.connection.readyState !== 1) {
    let faqs = Array.isArray(DEFAULT_HELP_SUPPORT_DATA.faqs)
      ? [...DEFAULT_HELP_SUPPORT_DATA.faqs]
      : [];

    if (category && category !== "ALL") {
      const catClean = String(category).trim().toLowerCase();
      faqs = faqs.filter(
        (f) => String(f.categoryId).toLowerCase() === catClean
      );
    }

    if (q && String(q).trim()) {
      const searchTerm = String(q).trim().toLowerCase();
      faqs = faqs.filter(
        (f) =>
          f.question?.toLowerCase().includes(searchTerm) ||
          f.answer?.toLowerCase().includes(searchTerm) ||
          f.keywords?.some((k) => k.toLowerCase().includes(searchTerm))
      );
    }

    return {
      ...DEFAULT_HELP_SUPPORT_DATA,
      faqs,
      totalFaqsCount: faqs.length,
    };
  }

  try {
    let doc = await HelpSupport.findOne({
      key: "DEFAULT_HELP_SUPPORT",
      isActive: true,
    }).lean();

    if (!doc) {
      try {
        doc = await HelpSupport.create(DEFAULT_HELP_SUPPORT_DATA);
        logMessage("✅ Seeded Help & Support into database.", null, "info");
      } catch {
        doc = { ...DEFAULT_HELP_SUPPORT_DATA };
      }
    }

    // Apply optional category and keyword search filters
    let faqs = Array.isArray(doc.faqs) ? [...doc.faqs] : [];

    if (category && category !== "ALL") {
      const catClean = String(category).trim().toLowerCase();
      faqs = faqs.filter(
        (f) => String(f.categoryId).toLowerCase() === catClean
      );
    }

    if (q && String(q).trim()) {
      const searchTerm = String(q).trim().toLowerCase();
      faqs = faqs.filter(
        (f) =>
          f.question?.toLowerCase().includes(searchTerm) ||
          f.answer?.toLowerCase().includes(searchTerm) ||
          f.keywords?.some((k) => k.toLowerCase().includes(searchTerm))
      );
    }

    return {
      ...doc,
      faqs,
      totalFaqsCount: faqs.length,
    };
  } catch (err) {
    logMessage(`⚠️ Help Support fetch error: ${err.message}`, null, "warn");
    return DEFAULT_HELP_SUPPORT_DATA;
  }
};

export const fetchOurProcess = async () => {
  if (mongoose.connection.readyState !== 1) {
    return DEFAULT_OUR_PROCESS;
  }
  try {
    let doc = await OurProcess.findOne({ isActive: true }).lean();

    if (!doc) {
      try {
        doc = await OurProcess.create(DEFAULT_OUR_PROCESS);
        logMessage("✅ Seeded Our Process into database.", null, "info");
      } catch {
        return DEFAULT_OUR_PROCESS;
      }
    }
    return doc;
  } catch (err) {
    logMessage(`⚠️ Our Process fetch error: ${err.message}`, null, "warn");
    return DEFAULT_OUR_PROCESS;
  }
};

/**
 * 🌟 1. UNIFIED GET CONTENT (Primary Endpoint with Select Query Support)
 * Route: GET /api/v1/content
 * Query Parameters:
 *   - type: 'privacy-policy' | 'terms-and-conditions' | 'help-support' | 'our-process' | 'all'
 *   - types: comma-separated list, e.g. 'privacy-policy,terms-and-conditions,our-process'
 *   - select: fields to project, e.g. 'title,steps,stats' or 'title,sections'
 *   - category: (for help-support) filter FAQs by category ID
 *   - q: search keyword in FAQs / sections / steps
 */
export const getContent = asyncHandler(async (req, res) => {
  const { type: rawType, types: rawTypes, select, fields, category, q } = req.query;
  const selectQuery = select || fields;

  // Case A: Comma-separated multi-type batch selection (e.g. ?types=privacy-policy,terms,our-process)
  if (rawTypes) {
    const requestedTypes = String(rawTypes)
      .split(",")
      .map((t) => normalizeType(t.trim()))
      .filter(Boolean);

    const batchResponse = {};

    await Promise.all(
      requestedTypes.map(async (t) => {
        if (t === "PRIVACY_POLICY") {
          const doc = await fetchPrivacyPolicy();
          batchResponse.privacyPolicy = projectFields(doc, selectQuery);
        } else if (t === "TERMS_AND_CONDITIONS") {
          const doc = await fetchTermsAndConditions();
          batchResponse.termsAndConditions = projectFields(doc, selectQuery);
        } else if (t === "HELP_SUPPORT") {
          const doc = await fetchHelpSupport({ category, q });
          batchResponse.helpSupport = projectFields(doc, selectQuery);
        } else if (t === "OUR_PROCESS") {
          const doc = await fetchOurProcess();
          batchResponse.ourProcess = projectFields(doc, selectQuery);
        }
      })
    );

    return apiHTTPResponse(
      req,
      res,
      HTTP_OK,
      "Requested content sections retrieved successfully.",
      batchResponse,
      OK,
      ERROR_FALSE
    );
  }

  // Case B: Single Type requested (e.g. ?type=privacy-policy or ?type=our-process)
  const normalized = normalizeType(rawType);

  if (normalized === "PRIVACY_POLICY") {
    const doc = await fetchPrivacyPolicy();
    let result = projectFields(doc, selectQuery);

    if (q && result.sections) {
      const searchTerm = String(q).trim().toLowerCase();
      result = {
        ...result,
        sections: result.sections.filter(
          (s) =>
            s.title?.toLowerCase().includes(searchTerm) ||
            s.summary?.toLowerCase().includes(searchTerm) ||
            s.paragraphs?.some((p) => p.toLowerCase().includes(searchTerm)) ||
            s.bullets?.some((b) => b.toLowerCase().includes(searchTerm))
        ),
      };
    }

    return apiHTTPResponse(
      req,
      res,
      HTTP_OK,
      "Privacy Policy retrieved successfully.",
      result,
      OK,
      ERROR_FALSE
    );
  }

  if (normalized === "TERMS_AND_CONDITIONS") {
    const doc = await fetchTermsAndConditions();
    let result = projectFields(doc, selectQuery);

    if (q && result.sections) {
      const searchTerm = String(q).trim().toLowerCase();
      result = {
        ...result,
        sections: result.sections.filter(
          (s) =>
            s.title?.toLowerCase().includes(searchTerm) ||
            s.summary?.toLowerCase().includes(searchTerm) ||
            s.paragraphs?.some((p) => p.toLowerCase().includes(searchTerm)) ||
            s.bullets?.some((b) => b.toLowerCase().includes(searchTerm))
        ),
      };
    }

    return apiHTTPResponse(
      req,
      res,
      HTTP_OK,
      "Terms & Conditions retrieved successfully.",
      result,
      OK,
      ERROR_FALSE
    );
  }

  if (normalized === "HELP_SUPPORT") {
    const doc = await fetchHelpSupport({ category, q });
    const result = projectFields(doc, selectQuery);
    return apiHTTPResponse(
      req,
      res,
      HTTP_OK,
      "Help & Support information retrieved successfully.",
      result,
      OK,
      ERROR_FALSE
    );
  }

  if (normalized === "OUR_PROCESS") {
    const doc = await fetchOurProcess();
    const result = projectFields(doc, selectQuery);
    return apiHTTPResponse(
      req,
      res,
      HTTP_OK,
      "Our Process matchmaking workflow retrieved successfully.",
      result,
      OK,
      ERROR_FALSE
    );
  }

  // Case C: When type is 'ALL' or not provided -> return unified bundle with all sections
  const [privacyPolicy, termsAndConditions, helpSupport, ourProcess] =
    await Promise.all([
      fetchPrivacyPolicy(),
      fetchTermsAndConditions(),
      fetchHelpSupport({ category, q }),
      fetchOurProcess(),
    ]);

  const unifiedData = {
    privacyPolicy: projectFields(privacyPolicy, selectQuery),
    termsAndConditions: projectFields(termsAndConditions, selectQuery),
    helpSupport: projectFields(helpSupport, selectQuery),
    ourProcess: projectFields(ourProcess, selectQuery),
    meta: {
      availableTypes: [
        "privacy-policy",
        "terms-and-conditions",
        "help-support",
        "our-process",
      ],
      usage:
        "Pass ?type=privacy-policy | terms-and-conditions | help-support | our-process or ?types=type1,type2. Use &select=field1,field2 for projection.",
      lastSyncTime: new Date().toISOString(),
    },
  };

  return apiHTTPResponse(
    req,
    res,
    HTTP_OK,
    "Unified content retrieved successfully.",
    unifiedData,
    OK,
    ERROR_FALSE
  );
});

/**
 * 🎯 2. GET CONTENT BY URL PARAM
 * Route: GET /api/v1/content/:type
 */
export const getContentByType = asyncHandler(async (req, res) => {
  const { type: rawType } = req.params;
  const { select, fields, category, q } = req.query;

  // Delegate directly to unified logic by setting query param
  req.query.type = rawType;
  req.query.select = select || fields;
  req.query.category = category;
  req.query.q = q;

  return getContent(req, res);
});

/**
 * ✏️ 3. UNIFIED UPDATE CONTENT (Admin)
 * Route: PUT /api/v1/content
 * Route: PUT /api/v1/content/:type
 * Accepts query or body 'type' to update Privacy Policy, Terms, Help Support, or Our Process.
 */
export const updateContent = asyncHandler(async (req, res) => {
  const rawType = req.params.type || req.query.type || req.body.type;
  const normalized = normalizeType(rawType);

  if (!normalized) {
    return apiHTTPResponse(
      req,
      res,
      HTTP_BAD_REQUEST,
      `Invalid content type '${rawType}'. Supported: privacy-policy, terms-and-conditions, help-support, our-process.`,
      null,
      HTTP_BAD_REQUEST,
      ERROR_TRUE
    );
  }

  const payload = req.body.data || req.body;

  if (normalized === "PRIVACY_POLICY" || normalized === "TERMS_AND_CONDITIONS") {
    payload.lastUpdatedDate =
      payload.lastUpdatedDate ||
      new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

    const updated = await LegalContent.findOneAndUpdate(
      { type: normalized },
      { $set: payload },
      { new: true, upsert: true, runValidators: true }
    );

    return apiHTTPResponse(
      req,
      res,
      HTTP_OK,
      `${updated.title || normalized} updated successfully.`,
      updated,
      OK,
      ERROR_FALSE
    );
  }

  if (normalized === "HELP_SUPPORT") {
    payload.lastUpdated = new Date();
    const updated = await HelpSupport.findOneAndUpdate(
      { key: "DEFAULT_HELP_SUPPORT" },
      { $set: payload },
      { new: true, upsert: true, runValidators: true }
    );

    return apiHTTPResponse(
      req,
      res,
      HTTP_OK,
      "Help & Support information updated successfully.",
      updated,
      OK,
      ERROR_FALSE
    );
  }

  if (normalized === "OUR_PROCESS") {
    const updated = await OurProcess.findOneAndUpdate(
      {},
      { $set: payload },
      { new: true, upsert: true, runValidators: true }
    );

    return apiHTTPResponse(
      req,
      res,
      HTTP_OK,
      "Our Process workflow updated successfully.",
      updated,
      OK,
      ERROR_FALSE
    );
  }

  return apiHTTPResponse(
    req,
    res,
    HTTP_BAD_REQUEST,
    "Unhandled content type for update.",
    null,
    HTTP_BAD_REQUEST,
    ERROR_TRUE
  );
});

/**
 * 🎫 4. SUBMIT SUPPORT TICKET
 * Route: POST /api/v1/support/ticket
 * Route: POST /api/v1/content/ticket
 * Public or Authenticated
 */
export const submitSupportTicket = asyncHandler(async (req, res) => {
  const { name, email, phone, category, subject, message, priority, source } =
    req.body;

  if (!name || !email || !subject || !message) {
    return apiHTTPResponse(
      req,
      res,
      HTTP_BAD_REQUEST,
      "Name, email, subject, and message are required fields.",
      null,
      HTTP_BAD_REQUEST,
      ERROR_TRUE
    );
  }

  // Generate unique human-readable ticket ID: SM-TKT-YYYYMMDD-XXXX
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const ticketId = `SM-TKT-${dateStr}-${randomSuffix}`;

  const userId = req.user?._id || req.user?.id || null;

  let ticket;
  if (mongoose.connection.readyState !== 1) {
    ticket = {
      ticketId,
      status: "OPEN",
      subject: String(subject).trim(),
      category: category || "GENERAL",
      createdAt: new Date(),
    };
  } else {
    ticket = await SupportTicket.create({
      ticketId,
      userId,
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      phone: phone ? String(phone).trim() : "",
      category: category || "GENERAL",
      subject: String(subject).trim(),
      message: String(message).trim(),
      priority: priority || "MEDIUM",
      source: source || "WEB",
      status: "OPEN",
    });
  }

  return apiHTTPResponse(
    req,
    res,
    HTTP_CREATED,
    `Support ticket ${ticketId} created successfully. Our team will contact you within 4 hours.`,
    {
      ticketId: ticket.ticketId,
      status: ticket.status,
      subject: ticket.subject,
      category: ticket.category,
      createdAt: ticket.createdAt,
    },
    HTTP_CREATED,
    ERROR_FALSE
  );
});

/**
 * 📋 5. GET USER'S SUPPORT TICKETS
 * Route: GET /api/v1/support/tickets/my-tickets
 */
export const getMySupportTickets = asyncHandler(async (req, res) => {
  const userId = req.user?._id || req.user?.id;
  const email = req.query.email || req.user?.email;

  if (!userId && !email) {
    return apiHTTPResponse(
      req,
      res,
      HTTP_BAD_REQUEST,
      "User authentication or email query is required.",
      null,
      HTTP_BAD_REQUEST,
      ERROR_TRUE
    );
  }

  if (mongoose.connection.readyState !== 1) {
    return apiHTTPResponse(
      req,
      res,
      HTTP_OK,
      "Support tickets retrieved successfully.",
      [],
      OK,
      ERROR_FALSE
    );
  }

  const query = userId ? { userId } : { email: String(email).toLowerCase() };
  const tickets = await SupportTicket.find(query)
    .sort({ createdAt: -1 })
    .lean();

  return apiHTTPResponse(
    req,
    res,
    HTTP_OK,
    "Support tickets retrieved successfully.",
    tickets,
    OK,
    ERROR_FALSE
  );
});
