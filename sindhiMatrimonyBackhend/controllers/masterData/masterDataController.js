import crypto from "crypto";
import { asyncHandler, apiHTTPResponse } from "../../utils/globalFunction.js";
import * as CONSTANTS from "../../utils/constants.js";
import {
  SINDHI_SUBCASTES,
  SINDHI_SUBCASTE_MAP,
  DEFAULT_SUBCASTES,
  GOTHRA_OPTIONS,
  SINDHI_SURNAMES_MAPPING,
  SINDHI_SAMPRADAYAS,
  PROFILE_FOR_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  HAVE_CHILDREN_OPTIONS,
  HEIGHT_OPTIONS,
  DIET_OPTIONS,
  HABIT_OPTIONS,
  EDUCATION_CATEGORIES,
  EMPLOYED_IN_SECTORS,
  POPULAR_OCCUPATIONS,
  ANNUAL_INCOME_SLABS,
  SINDHI_DIASPORA_COUNTRIES,
  MAJOR_SINDHI_CITIES,
  HOROSCOPE_REFERENCE,
  FAMILY_OPTIONS,
  GENDER_OPTIONS,
  RELIGION_OPTIONS,
  CASTE_OPTIONS,
  MOTHER_TONGUE_OPTIONS,
  PHYSICAL_STATUS_OPTIONS,
  BODY_TYPE_OPTIONS,
  COMPLEXION_OPTIONS,
  BLOOD_GROUP_OPTIONS,
  INDIAN_STATES,
  CURRENCY_OPTIONS,
  LEAD_STATUS_OPTIONS,
  LEAD_SOURCE_OPTIONS,
  VERIFICATION_STATUS_OPTIONS,
  DOCUMENT_TYPE_OPTIONS,
  EMPLOYEE_ROLE_OPTIONS,
} from "../../constants/masterData.constants.js";
import { systemConfigStore } from "../admin/adminSettingsController.js";

// Pre-compute static bootstrap bundle and hash for instant Sub-1ms serving
const BOOTSTRAP_PAYLOAD = {
  gender: GENDER_OPTIONS,
  subcastes: SINDHI_SUBCASTES,
  defaultSubcastes: DEFAULT_SUBCASTES,
  subcasteMap: SINDHI_SUBCASTE_MAP,
  castes: CASTE_OPTIONS,
  gothras: GOTHRA_OPTIONS,
  religions: RELIGION_OPTIONS,
  sampradayas: SINDHI_SAMPRADAYAS,
  motherTongues: MOTHER_TONGUE_OPTIONS,
  profileFor: PROFILE_FOR_OPTIONS,
  maritalStatuses: MARITAL_STATUS_OPTIONS,
  haveChildren: HAVE_CHILDREN_OPTIONS,
  heights: HEIGHT_OPTIONS,
  diets: DIET_OPTIONS,
  habits: HABIT_OPTIONS,
  physicalStatuses: PHYSICAL_STATUS_OPTIONS,
  bodyTypes: BODY_TYPE_OPTIONS,
  complexions: COMPLEXION_OPTIONS,
  bloodGroups: BLOOD_GROUP_OPTIONS,
  educationCategories: EDUCATION_CATEGORIES,
  employmentSectors: EMPLOYED_IN_SECTORS,
  popularOccupations: POPULAR_OCCUPATIONS,
  incomeSlabs: ANNUAL_INCOME_SLABS,
  diasporaCountries: SINDHI_DIASPORA_COUNTRIES,
  states: INDIAN_STATES,
  quickCities: MAJOR_SINDHI_CITIES.slice(0, 20),
  currencies: CURRENCY_OPTIONS,
  horoscope: HOROSCOPE_REFERENCE,
  family: FAMILY_OPTIONS,
  leadStatuses: LEAD_STATUS_OPTIONS,
  leadSources: LEAD_SOURCE_OPTIONS,
  verificationStatuses: VERIFICATION_STATUS_OPTIONS,
  documentTypes: DOCUMENT_TYPE_OPTIONS,
  employeeRoles: EMPLOYEE_ROLE_OPTIONS,
  version: "1.1.0",
};

const BOOTSTRAP_JSON_STRING = JSON.stringify(BOOTSTRAP_PAYLOAD);
const BOOTSTRAP_ETAG = `"${crypto.createHash("md5").update(BOOTSTRAP_JSON_STRING).digest("hex")}"`;

// Helper for extracting filtered gotras
function getFilteredGotrasList(subcaste, search) {
  const searchTerm = (search || "").trim().toLowerCase();
  let filtered = SINDHI_SURNAMES_MAPPING;

  if (subcaste && subcaste !== "ALL" && subcaste !== "Other") {
    filtered = filtered.filter(
      (item) => item.subcaste.toLowerCase() === subcaste.trim().toLowerCase()
    );
  }

  if (searchTerm) {
    filtered = filtered.filter(
      (item) =>
        item.gotra.toLowerCase().includes(searchTerm) ||
        item.surname.toLowerCase().includes(searchTerm)
    );
  }

  const uniqueGotrasMap = new Map();
  filtered.forEach((item) => {
    if (!uniqueGotrasMap.has(item.gotra.toLowerCase())) {
      uniqueGotrasMap.set(item.gotra.toLowerCase(), {
        id: item.gotra,
        gotra: item.gotra,
        subcaste: item.subcaste,
        exampleSurname: item.surname,
        label: `${item.gotra} (${item.subcaste})`,
      });
    }
  });

  return Array.from(uniqueGotrasMap.values());
}

// Helper for extracting filtered cities
function getFilteredCitiesList(country, state, search) {
  const searchTerm = (search || "").trim().toLowerCase();
  let filtered = MAJOR_SINDHI_CITIES;

  if (country) {
    filtered = filtered.filter(
      (c) => c.country.toLowerCase() === country.trim().toLowerCase()
    );
  }

  if (state) {
    filtered = filtered.filter(
      (c) => c.state.toLowerCase() === state.trim().toLowerCase()
    );
  }

  if (searchTerm) {
    filtered = filtered.filter(
      (c) =>
        c.city.toLowerCase().includes(searchTerm) ||
        c.state.toLowerCase().includes(searchTerm) ||
        c.country.toLowerCase().includes(searchTerm)
    );
  }

  return filtered.map((c) => ({
    id: c.city,
    city: c.city,
    state: c.state,
    country: c.country,
    label: `${c.city}, ${c.state}`,
  }));
}

// Helper for extracting filtered degrees by education category
function getFilteredDegreesList(category, search) {
  const searchTerm = (search || "").trim().toLowerCase();
  let degrees = [];

  if (category) {
    const foundCat = EDUCATION_CATEGORIES.find(
      (c) => c.category.toLowerCase() === category.trim().toLowerCase()
    );
    degrees = foundCat ? foundCat.degrees : [];
  } else {
    EDUCATION_CATEGORIES.forEach((c) => {
      degrees.push(...c.degrees);
    });
  }

  if (searchTerm) {
    degrees = degrees.filter((d) => d.toLowerCase().includes(searchTerm));
  }

  return degrees.map((d) => ({ id: d, label: d }));
}

/**
 * ⚡ 0. GET /api/v1/master/dropdowns
 * Flexible, Sparse-Fieldset Dropdowns API.
 * Query: ?select=gender,heights,castes,subcastes,maritalStatuses
 * Or: ?select=gotras&subcaste=Bhaiband
 * Or: ?select=cities&state=Maharashtra&search=Mum
 * If no ?select provided, returns complete dropdown bundle.
 */
export const getDropdowns = asyncHandler(async (req, res) => {
  const { select, subcaste, caste, country, state, category, search, q } = req.query;

  // 1. If no select or select is 'all', return full bundle with ETag
  if (!select || select.trim() === "all" || select.trim() === "*") {
    if (req.headers["if-none-match"] === BOOTSTRAP_ETAG) {
      return res.status(304).end();
    }
    res.setHeader("ETag", BOOTSTRAP_ETAG);
    res.setHeader("Cache-Control", "public, max-age=86400, stale-while-revalidate=3600");
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_OK,
      "All master dropdown configurations loaded successfully.",
      BOOTSTRAP_PAYLOAD,
      CONSTANTS.OK,
      CONSTANTS.ERROR_FALSE
    );
  }

  // 2. Parse requested comma-separated keys
  const requestedKeys = select
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);

  const responseData = {};
  const activeSearch = search || q || "";

  for (const key of requestedKeys) {
    if (key === "gotras") {
      responseData.gotras = getFilteredGotrasList(subcaste || caste, activeSearch);
    } else if (key === "cities") {
      responseData.cities = getFilteredCitiesList(country, state, activeSearch);
    } else if (key === "quickCities") {
      responseData.quickCities = BOOTSTRAP_PAYLOAD.quickCities;
    } else if (key === "degrees") {
      responseData.degrees = getFilteredDegreesList(category, activeSearch);
    } else if (key === "portalConfig" || key === "contactConfig" || key === "config" || key === "systemConfig") {
      responseData[key] = {
        whatsappNumber: systemConfigStore?.general?.whatsappNumber || "+91 98765 43210",
        enquiryNumber: systemConfigStore?.general?.enquiryNumber || "+91 8144-77-88-66",
        supportPhone: systemConfigStore?.general?.supportPhone || "+91 98765 43210",
        supportEmail: systemConfigStore?.general?.contactEmail || "support@sindhimarriage.in",
        headquartersCity: systemConfigStore?.general?.headquartersCity || "Mumbai / Ahmedabad",
        siteName: systemConfigStore?.general?.siteName || "Sindhi Matrimony Official",
      };
    } else if (key === "whatsapp" || key === "whatsappNumber") {
      responseData[key] = systemConfigStore?.general?.whatsappNumber || "+91 98765 43210";
    } else if (key === "enquiry" || key === "enquiryNumber") {
      responseData[key] = systemConfigStore?.general?.enquiryNumber || "+91 8144-77-88-66";
    } else if (BOOTSTRAP_PAYLOAD[key] !== undefined) {
      responseData[key] = BOOTSTRAP_PAYLOAD[key];
    }
  }

  res.setHeader("Cache-Control", "public, max-age=86400");
  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Requested dropdown options retrieved successfully.",
    responseData,
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * ⚡ 0.1 GET /api/v1/master/dropdowns/:entity
 * Dynamic Single Entity Dropdown Handler.
 * Example: GET /api/v1/master/dropdowns/gender
 * Example: GET /api/v1/master/dropdowns/gotras?subcaste=Amil
 * Example: GET /api/v1/master/dropdowns/cities?state=Maharashtra&search=Mum
 */
export const getEntityDropdown = asyncHandler(async (req, res) => {
  const entity = (req.params.entity || "").trim();
  const { subcaste, caste, country, state, category, search, q } = req.query;
  const activeSearch = search || q || "";

  let items = null;

  if (entity === "gotras") {
    items = getFilteredGotrasList(subcaste || caste, activeSearch);
  } else if (entity === "cities") {
    items = getFilteredCitiesList(country, state, activeSearch);
  } else if (entity === "degrees") {
    items = getFilteredDegreesList(category, activeSearch);
  } else if (BOOTSTRAP_PAYLOAD[entity] !== undefined) {
    items = BOOTSTRAP_PAYLOAD[entity];
  }

  if (items === null) {
    const supportedEntities = [
      ...Object.keys(BOOTSTRAP_PAYLOAD),
      "gotras",
      "cities",
      "degrees",
    ].sort();

    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_NOT_FOUND,
      `Dropdown entity '${entity}' not found. Supported entities: ${supportedEntities.join(", ")}`,
      null,
      CONSTANTS.NOT_FOUND,
      CONSTANTS.ERROR_TRUE
    );
  }

  res.setHeader("Cache-Control", "public, max-age=86400");
  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    `${entity} dropdown options retrieved successfully.`,
    {
      entity,
      total: Array.isArray(items) ? items.length : 1,
      items,
    },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * ⚡ 1. GET /api/v1/master/bootstrap
 * One-call comprehensive dropdowns bundle. Ultra fast (<2ms) with ETag 304 caching.
 * Supports optional ?select= query parameter.
 */
export const getBootstrapConfig = asyncHandler(async (req, res) => {
  if (req.query.select) {
    return getDropdowns(req, res);
  }

  // HTTP Conditional Caching (If-None-Match)
  if (req.headers["if-none-match"] === BOOTSTRAP_ETAG) {
    return res.status(304).end();
  }

  res.setHeader("ETag", BOOTSTRAP_ETAG);
  res.setHeader("Cache-Control", "public, max-age=86400, stale-while-revalidate=3600");

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Master dropdown configurations loaded successfully.",
    BOOTSTRAP_PAYLOAD,
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 🏛️ 2. GET /api/v1/master/subcastes
 * List of Sindhi Subcastes with cultural descriptions
 */
export const getSubcastes = asyncHandler(async (req, res) => {
  res.setHeader("Cache-Control", "public, max-age=86400");
  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Sindhi subcastes fetched successfully.",
    SINDHI_SUBCASTES,
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 🔍 3. GET /api/v1/master/gotras
 * List of Sindhi Gotras, filterable by subcaste & prefix search
 * Query: ?subcaste=Bhaiband&search=adv
 */
export const getGotras = asyncHandler(async (req, res) => {
  const { subcaste, search, q } = req.query;
  const searchTerm = (search || q || "").trim().toLowerCase();

  let filtered = SINDHI_SURNAMES_MAPPING;

  if (subcaste && subcaste !== "ALL" && subcaste !== "Other") {
    filtered = filtered.filter(
      (item) => item.subcaste.toLowerCase() === subcaste.trim().toLowerCase()
    );
  }

  if (searchTerm) {
    filtered = filtered.filter(
      (item) =>
        item.gotra.toLowerCase().includes(searchTerm) ||
        item.surname.toLowerCase().includes(searchTerm)
    );
  }

  // Extract unique Gotras
  const uniqueGotrasMap = new Map();
  filtered.forEach((item) => {
    if (!uniqueGotrasMap.has(item.gotra.toLowerCase())) {
      uniqueGotrasMap.set(item.gotra.toLowerCase(), {
        gotra: item.gotra,
        subcaste: item.subcaste,
        exampleSurname: item.surname,
      });
    }
  });

  const result = Array.from(uniqueGotrasMap.values());

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Gotras list retrieved successfully.",
    {
      total: result.length,
      gotras: result,
    },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 🪄 4. GET /api/v1/master/surnames/lookup
 * Smart Auto-Fill: Enter surname to instantly detect recommended Subcaste & Gotra
 * Query: ?surname=Advani
 */
export const lookupSurname = asyncHandler(async (req, res) => {
  const querySurname = (req.query.surname || req.query.q || req.body?.surname || "").trim();

  if (!querySurname) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "Please provide a surname to lookup (e.g. ?surname=Advani)",
      null,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  const normalized = querySurname.toLowerCase();

  // 1. Exact match
  const exactMatch = SINDHI_SURNAMES_MAPPING.find(
    (item) => item.surname.toLowerCase() === normalized
  );

  // 2. Fuzzy / Prefix suggestions
  const suggestions = SINDHI_SURNAMES_MAPPING.filter((item) =>
    item.surname.toLowerCase().startsWith(normalized.slice(0, 3))
  ).slice(0, 10);

  if (exactMatch) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_OK,
      `Matched Sindhi lineage for ${exactMatch.surname}: Subcaste ${exactMatch.subcaste}`,
      {
        matched: true,
        detectedSurname: exactMatch.surname,
        recommendedSubcaste: exactMatch.subcaste,
        recommendedGotra: exactMatch.gotra,
        suggestions,
      },
      CONSTANTS.OK,
      CONSTANTS.ERROR_FALSE
    );
  }

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    suggestions.length > 0
      ? `No exact match for '${querySurname}', but found ${suggestions.length} similar Sindhi surnames.`
      : `No matching Sindhi lineage found for '${querySurname}'. Manual entry allowed.`,
    {
      matched: false,
      detectedSurname: querySurname,
      recommendedSubcaste: null,
      recommendedGotra: querySurname,
      suggestions,
    },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 🎓 5. GET /api/v1/master/occupations
 * Education categories, degree lists, and popular professions
 */
export const getOccupationsAndEducation = asyncHandler(async (req, res) => {
  res.setHeader("Cache-Control", "public, max-age=86400");
  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Education and occupation master options retrieved.",
    {
      educationCategories: EDUCATION_CATEGORIES,
      employmentSectors: EMPLOYED_IN_SECTORS,
      popularOccupations: POPULAR_OCCUPATIONS,
      incomeSlabs: ANNUAL_INCOME_SLABS,
    },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 🌍 6. GET /api/v1/master/locations/countries
 * Countries with prominent Sindhi presence
 */
export const getCountries = asyncHandler(async (req, res) => {
  res.setHeader("Cache-Control", "public, max-age=86400");
  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Countries list retrieved.",
    SINDHI_DIASPORA_COUNTRIES,
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 🏙️ 7. GET /api/v1/master/locations/cities
 * Searchable & filterable cities list
 * Query: ?country=India&state=Maharashtra&search=Mum
 */
export const getCities = asyncHandler(async (req, res) => {
  const { country, state, search, q } = req.query;
  const searchTerm = (search || q || "").trim().toLowerCase();

  let filtered = MAJOR_SINDHI_CITIES;

  if (country) {
    filtered = filtered.filter(
      (c) => c.country.toLowerCase() === country.trim().toLowerCase()
    );
  }

  if (state) {
    filtered = filtered.filter(
      (c) => c.state.toLowerCase() === state.trim().toLowerCase()
    );
  }

  if (searchTerm) {
    filtered = filtered.filter(
      (c) =>
        c.city.toLowerCase().includes(searchTerm) ||
        c.state.toLowerCase().includes(searchTerm) ||
        c.country.toLowerCase().includes(searchTerm)
    );
  }

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Cities list retrieved.",
    {
      total: filtered.length,
      cities: filtered,
    },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 🔮 8. GET /api/v1/master/horoscope
 * Manglik status, 12 Moon signs (Raas), and 27 Vedic Nakshatras
 */
export const getHoroscopeOptions = asyncHandler(async (req, res) => {
  res.setHeader("Cache-Control", "public, max-age=86400");
  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Horoscope and astrology options retrieved.",
    HOROSCOPE_REFERENCE,
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});
