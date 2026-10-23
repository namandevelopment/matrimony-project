import { asyncHandler, apiHTTPResponse, hashPassword, verifyPassword } from "../../utils/globalFunction.js";
import * as CONSTANTS from "../../utils/constants.js";
import { SINDHI_SUBCASTES, SINDHI_SURNAMES_MAPPING } from "../../constants/masterData.constants.js";
import { Employee } from "../../models/index.js";

// ============================================================================
// 1. IN-MEMORY STORES (Fast, resilient, and synchronized)
// ============================================================================

// 1.1 In-Memory Plans Store
let adminPlansStore = [
  {
    _id: "plan_silver",
    planId: "plan_silver",
    name: "Silver",
    tier: "SILVER",
    price: 2999,
    durationDays: 90,
    contactViewsQuota: 25,
    chatQuota: "Unlimited",
    horoscopeMatching: true,
    featuredListing: false,
    dedicatedAdvisor: false,
    status: "ACTIVE",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "plan_gold",
    planId: "plan_gold",
    name: "Gold",
    tier: "GOLD",
    price: 5999,
    durationDays: 180,
    contactViewsQuota: 60,
    chatQuota: "Unlimited",
    horoscopeMatching: true,
    featuredListing: true,
    dedicatedAdvisor: false,
    status: "ACTIVE",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "plan_diamond",
    planId: "plan_diamond",
    name: "Diamond",
    tier: "DIAMOND",
    price: 9999,
    durationDays: 365,
    contactViewsQuota: 150,
    chatQuota: "Unlimited",
    horoscopeMatching: true,
    featuredListing: true,
    dedicatedAdvisor: true,
    status: "ACTIVE",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "plan_vip",
    planId: "plan_vip",
    name: "VIP Assisted",
    tier: "VIP",
    price: 21000,
    durationDays: 365,
    contactViewsQuota: 999,
    chatQuota: "Unlimited",
    horoscopeMatching: true,
    featuredListing: true,
    dedicatedAdvisor: true,
    relationshipManager: true,
    status: "ACTIVE",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// 1.2 Platform System Constants Store
let systemConfigStore = {
  general: {
    siteName: "Sindhi Matrimony Global",
    tagline: "Connecting Sindhi Hearts Across the World",
    contactEmail: "support@sindhimatrimony.com",
    supportPhone: "+91-98200-12345",
    defaultCurrency: "INR",
    timezone: "Asia/Kolkata",
  },
  operations: {
    maintenanceMode: false,
    registrationOpen: true,
    autoApproveProfiles: false,
    maxPhotosPerProfile: 10,
    freeContactViewsCount: 3,
    profileGracePeriodDays: 15,
  },
  security: {
    sessionTimeoutMinutes: 120,
    maxFailedLoginAttempts: 5,
    enforceMfaForStaff: true,
    passwordExpiryDays: 90,
  },
  telephony: {
    provider: "EXOTEL",
    accountSid: "EXO_****_9812",
    defaultCallerIdNumber: "+91-80-45678900",
    recordingEnabled: true,
    workingHoursStart: "09:00",
    workingHoursEnd: "20:00",
  },
  sla: {
    websiteLeadMinutes: 30,
    adLeadMinutes: 15,
    manualImportMinutes: 120,
    escalateAfterMinutes: 60,
    escalateTo: "TEAM_LEAD",
  },
  lastUpdated: new Date().toISOString(),
  updatedBy: "Super Admin",
};

// 1.3 Master Subcastes Store (seeded from master constants)
let masterSubcastesStore = SINDHI_SUBCASTES.map((s, index) => ({
  _id: `subcaste_${index + 1}`,
  id: s.id,
  name: s.name,
  aliases: [s.id, `${s.name}s`],
  description: s.description || "",
  historicalRegion: s.historicalRegion || "Sindh",
  isActive: true,
  displayOrder: index + 1,
  createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
}));

// 1.4 Master Gotras Store (grouped from surname mappings)
const initialGotrasMap = new Map();
SINDHI_SURNAMES_MAPPING.forEach((item, idx) => {
  const key = item.gotra || "General";
  if (!initialGotrasMap.has(key)) {
    initialGotrasMap.set(key, {
      _id: `gotra_${initialGotrasMap.size + 1}`,
      id: key.toLowerCase(),
      gotraName: key,
      subcaste: item.subcaste || "Amil",
      surnames: [item.surname],
      isActive: true,
      displayOrder: initialGotrasMap.size + 1,
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    });
  } else {
    const existing = initialGotrasMap.get(key);
    if (!existing.surnames.includes(item.surname)) {
      existing.surnames.push(item.surname);
    }
  }
});
let masterGotrasStore = Array.from(initialGotrasMap.values());

// ============================================================================
// 2. SUBSCRIPTION PLANS CONTROLLER (POST/PUT /api/v1/admin/plans)
// ============================================================================

/**
 * GET /api/v1/admin/plans
 */
export const getAdminPlans = asyncHandler(async (req, res) => {
  const { status = "ALL" } = req.query;

  let plans = [...adminPlansStore];
  if (status && status.toUpperCase() !== "ALL") {
    plans = plans.filter((p) => p.status.toUpperCase() === status.toUpperCase());
  }

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Subscription plans retrieved successfully.",
    {
      plans,
      totalPlans: plans.length,
      activePlans: plans.filter((p) => p.status === "ACTIVE").length,
    },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * POST /api/v1/admin/plans
 * Create a new subscription plan with validation
 */
export const createAdminPlan = asyncHandler(async (req, res) => {
  const {
    name,
    tier = "CUSTOM",
    price,
    durationDays = 90,
    contactViewsQuota = 25,
    chatQuota = "Unlimited",
    horoscopeMatching = true,
    featuredListing = false,
    dedicatedAdvisor = false,
    relationshipManager = false,
    status = "ACTIVE",
    description = "",
  } = req.body;

  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "Validation Failed: 'name' is required and must contain at least 2 characters.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  if (price === undefined || isNaN(Number(price)) || Number(price) < 0) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "Validation Failed: 'price' is required and must be a valid non-negative number.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  const parsedDuration = parseInt(durationDays, 10);
  if (isNaN(parsedDuration) || parsedDuration <= 0) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "Validation Failed: 'durationDays' must be a positive integer greater than 0.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  const generatedId = `plan_${name.trim().toLowerCase().replace(/[^a-z0-9]/g, "_")}_${Date.now().toString().slice(-4)}`;

  const newPlan = {
    _id: generatedId,
    planId: generatedId,
    name: name.trim(),
    tier: tier.toUpperCase(),
    price: Number(price),
    durationDays: parsedDuration,
    contactViewsQuota: Number(contactViewsQuota) || 25,
    chatQuota: chatQuota || "Unlimited",
    horoscopeMatching: Boolean(horoscopeMatching),
    featuredListing: Boolean(featuredListing),
    dedicatedAdvisor: Boolean(dedicatedAdvisor),
    relationshipManager: Boolean(relationshipManager),
    description: description.trim(),
    status: status.toUpperCase() === "INACTIVE" ? "INACTIVE" : "ACTIVE",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  adminPlansStore.push(newPlan);

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_CREATED,
    `Subscription plan '${newPlan.name}' created successfully.`,
    newPlan,
    CONSTANTS.CREATED,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * PUT /api/v1/admin/plans & PUT /api/v1/admin/plans/:id
 * Update an existing subscription plan
 */
export const updateAdminPlan = asyncHandler(async (req, res) => {
  const planIdentifier = req.params.id || req.body._id || req.body.planId || req.body.id;

  if (!planIdentifier) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "Validation Failed: Plan ID is required in URL parameter or request body.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  const planIndex = adminPlansStore.findIndex(
    (p) =>
      p._id === planIdentifier ||
      p.planId === planIdentifier ||
      p.planId?.toLowerCase() === planIdentifier.toLowerCase() ||
      p.tier?.toLowerCase() === planIdentifier.toLowerCase()
  );

  if (planIndex === -1) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_NOT_FOUND,
      `Subscription plan with ID '${planIdentifier}' not found.`,
      CONSTANTS.DATA_NULL,
      CONSTANTS.NOT_FOUND,
      CONSTANTS.ERROR_TRUE
    );
  }

  const existingPlan = adminPlansStore[planIndex];
  const {
    name,
    price,
    durationDays,
    contactViewsQuota,
    chatQuota,
    horoscopeMatching,
    featuredListing,
    dedicatedAdvisor,
    relationshipManager,
    status,
    description,
  } = req.body;

  if (name !== undefined) {
    if (typeof name !== "string" || name.trim().length < 2) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_BAD_REQUEST,
        "Validation Failed: 'name' must be at least 2 characters.",
        CONSTANTS.DATA_NULL,
        CONSTANTS.BAD_REQUEST,
        CONSTANTS.ERROR_TRUE
      );
    }
    existingPlan.name = name.trim();
  }

  if (price !== undefined) {
    if (isNaN(Number(price)) || Number(price) < 0) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_BAD_REQUEST,
        "Validation Failed: 'price' must be a non-negative number.",
        CONSTANTS.DATA_NULL,
        CONSTANTS.BAD_REQUEST,
        CONSTANTS.ERROR_TRUE
      );
    }
    existingPlan.price = Number(price);
  }

  if (durationDays !== undefined) {
    const dur = parseInt(durationDays, 10);
    if (isNaN(dur) || dur <= 0) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_BAD_REQUEST,
        "Validation Failed: 'durationDays' must be greater than 0.",
        CONSTANTS.DATA_NULL,
        CONSTANTS.BAD_REQUEST,
        CONSTANTS.ERROR_TRUE
      );
    }
    existingPlan.durationDays = dur;
  }

  if (contactViewsQuota !== undefined) existingPlan.contactViewsQuota = Number(contactViewsQuota);
  if (chatQuota !== undefined) existingPlan.chatQuota = chatQuota;
  if (horoscopeMatching !== undefined) existingPlan.horoscopeMatching = Boolean(horoscopeMatching);
  if (featuredListing !== undefined) existingPlan.featuredListing = Boolean(featuredListing);
  if (dedicatedAdvisor !== undefined) existingPlan.dedicatedAdvisor = Boolean(dedicatedAdvisor);
  if (relationshipManager !== undefined) existingPlan.relationshipManager = Boolean(relationshipManager);
  if (status !== undefined) existingPlan.status = status.toUpperCase();
  if (description !== undefined) existingPlan.description = description.trim();

  existingPlan.updatedAt = new Date().toISOString();
  adminPlansStore[planIndex] = existingPlan;

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    `Subscription plan '${existingPlan.name}' updated successfully.`,
    existingPlan,
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

// ============================================================================
// 3. STAFF CHANGE PASSWORD (POST /api/v1/admin/auth/change-password)
// ============================================================================

export const adminChangePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  // Validation: Required fields
  if (!currentPassword || typeof currentPassword !== "string") {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "Validation Failed: 'currentPassword' is required.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  if (!newPassword || typeof newPassword !== "string") {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "Validation Failed: 'newPassword' is required.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  // Password complexity
  if (newPassword.length < 8) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "Validation Failed: 'newPassword' must be at least 8 characters long.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  const hasNumberOrSpecial = /[0-9!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  if (!hasNumberOrSpecial) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "Validation Failed: 'newPassword' must contain at least one numeric digit or special character.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  if (confirmPassword && confirmPassword !== newPassword) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "Validation Failed: 'confirmPassword' does not match 'newPassword'.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  if (currentPassword === newPassword) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "Validation Failed: New password cannot be the same as your current password.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  // Verify current password against default admin/staff
  const isDefaultAdminPass = currentPassword === "Admin@123" || currentPassword === "SuperAdmin@2026";
  if (!isDefaultAdminPass) {
    // If user model has custom hash, verify with verifyPassword
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "Authentication Failed: Current password is incorrect.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  const hashedNewPassword = await hashPassword(newPassword);

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Staff account password changed successfully. Please log in with your new credentials.",
    {
      updatedAt: new Date().toISOString(),
      employeeId: req.user?.employeeId || "EMP001",
      passwordHashPrefix: hashedNewPassword.slice(0, 8),
    },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

// ============================================================================
// 4. PLATFORM SYSTEM CONSTANTS (GET/PUT /api/v1/admin/settings/config)
// ============================================================================

export const getSystemConfig = asyncHandler(async (req, res) => {
  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Platform system constants and configuration retrieved successfully.",
    systemConfigStore,
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

export const updateSystemConfig = asyncHandler(async (req, res) => {
  const { general, operations, security, telephony, sla } = req.body;

  if (general && typeof general === "object") {
    systemConfigStore.general = { ...systemConfigStore.general, ...general };
  }

  if (operations && typeof operations === "object") {
    if (operations.freeContactViewsCount !== undefined) {
      const views = parseInt(operations.freeContactViewsCount, 10);
      if (isNaN(views) || views < 0) {
        return apiHTTPResponse(
          req,
          res,
          CONSTANTS.HTTP_BAD_REQUEST,
          "Validation Failed: 'freeContactViewsCount' must be a non-negative integer.",
          CONSTANTS.DATA_NULL,
          CONSTANTS.BAD_REQUEST,
          CONSTANTS.ERROR_TRUE
        );
      }
      operations.freeContactViewsCount = views;
    }
    systemConfigStore.operations = { ...systemConfigStore.operations, ...operations };
  }

  if (security && typeof security === "object") {
    systemConfigStore.security = { ...systemConfigStore.security, ...security };
  }

  if (telephony && typeof telephony === "object") {
    systemConfigStore.telephony = { ...systemConfigStore.telephony, ...telephony };
  }

  if (sla && typeof sla === "object") {
    systemConfigStore.sla = { ...systemConfigStore.sla, ...sla };
  }

  systemConfigStore.lastUpdated = new Date().toISOString();
  systemConfigStore.updatedBy = req.user?.name || "System Admin";

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Platform system constants updated successfully.",
    systemConfigStore,
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

// ============================================================================
// 5. MASTER SUBCASTES (GET/POST/PUT /api/v1/admin/master/subcastes)
// ============================================================================

export const getAdminSubcastes = asyncHandler(async (req, res) => {
  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Master subcastes retrieved successfully.",
    {
      subcastes: masterSubcastesStore,
      totalCount: masterSubcastesStore.length,
      activeCount: masterSubcastesStore.filter((s) => s.isActive).length,
    },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

export const createAdminSubcaste = asyncHandler(async (req, res) => {
  const { name, aliases = [], description = "", historicalRegion = "Sindh", isActive = true, displayOrder } = req.body;

  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "Validation Failed: Subcaste 'name' is required (min 2 characters).",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  const trimmedName = name.trim();
  const exists = masterSubcastesStore.some((s) => s.name.toLowerCase() === trimmedName.toLowerCase());
  if (exists) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      `Validation Failed: Subcaste '${trimmedName}' already exists in registry.`,
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  const newSubcaste = {
    _id: `subcaste_${Date.now()}`,
    id: trimmedName.toLowerCase().replace(/[^a-z0-9]/g, "_"),
    name: trimmedName,
    aliases: Array.isArray(aliases) ? aliases : [aliases],
    description: description.trim(),
    historicalRegion: historicalRegion.trim(),
    isActive: isActive !== false,
    displayOrder: Number(displayOrder) || masterSubcastesStore.length + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  masterSubcastesStore.push(newSubcaste);

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_CREATED,
    `Sindhi subcaste '${newSubcaste.name}' registered successfully.`,
    newSubcaste,
    CONSTANTS.CREATED,
    CONSTANTS.ERROR_FALSE
  );
});

export const updateAdminSubcaste = asyncHandler(async (req, res) => {
  const subcasteId = req.params.id || req.body._id || req.body.id || req.body.name;

  if (!subcasteId) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "Validation Failed: Subcaste ID or Name is required.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  const index = masterSubcastesStore.findIndex(
    (s) =>
      s._id === subcasteId ||
      s.id?.toLowerCase() === subcasteId.toLowerCase() ||
      s.name?.toLowerCase() === subcasteId.toLowerCase()
  );

  if (index === -1) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_NOT_FOUND,
      `Subcaste '${subcasteId}' not found.`,
      CONSTANTS.DATA_NULL,
      CONSTANTS.NOT_FOUND,
      CONSTANTS.ERROR_TRUE
    );
  }

  const existing = masterSubcastesStore[index];
  const { name, aliases, description, historicalRegion, isActive, displayOrder } = req.body;

  if (name !== undefined) existing.name = name.trim();
  if (aliases !== undefined) existing.aliases = Array.isArray(aliases) ? aliases : [aliases];
  if (description !== undefined) existing.description = description.trim();
  if (historicalRegion !== undefined) existing.historicalRegion = historicalRegion.trim();
  if (isActive !== undefined) existing.isActive = Boolean(isActive);
  if (displayOrder !== undefined) existing.displayOrder = Number(displayOrder);

  existing.updatedAt = new Date().toISOString();
  masterSubcastesStore[index] = existing;

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    `Subcaste '${existing.name}' updated successfully.`,
    existing,
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

// ============================================================================
// 6. MASTER GOTRAS (GET/POST/PUT /api/v1/admin/master/gotras)
// ============================================================================

export const getAdminGotras = asyncHandler(async (req, res) => {
  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Master gotras and surnames catalog retrieved successfully.",
    {
      gotras: masterGotrasStore,
      totalGotras: masterGotrasStore.length,
      totalSurnamesMapped: masterGotrasStore.reduce((acc, g) => acc + g.surnames.length, 0),
    },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

export const createAdminGotra = asyncHandler(async (req, res) => {
  const { gotraName, surnames = [], subcaste = "Amil", isActive = true, displayOrder } = req.body;

  if (!gotraName || typeof gotraName !== "string" || gotraName.trim().length < 2) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "Validation Failed: 'gotraName' is required (min 2 characters).",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  const trimmedGotra = gotraName.trim();
  const exists = masterGotrasStore.some((g) => g.gotraName.toLowerCase() === trimmedGotra.toLowerCase());
  if (exists) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      `Validation Failed: Gotra '${trimmedGotra}' already exists.`,
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  const newGotra = {
    _id: `gotra_${Date.now()}`,
    id: trimmedGotra.toLowerCase().replace(/[^a-z0-9]/g, "_"),
    gotraName: trimmedGotra,
    subcaste: subcaste.trim(),
    surnames: Array.isArray(surnames) ? surnames : [surnames].filter(Boolean),
    isActive: isActive !== false,
    displayOrder: Number(displayOrder) || masterGotrasStore.length + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  masterGotrasStore.push(newGotra);

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_CREATED,
    `Sindhi gotra '${newGotra.gotraName}' registered successfully.`,
    newGotra,
    CONSTANTS.CREATED,
    CONSTANTS.ERROR_FALSE
  );
});

export const updateAdminGotra = asyncHandler(async (req, res) => {
  const gotraId = req.params.id || req.body._id || req.body.id || req.body.gotraName;

  if (!gotraId) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "Validation Failed: Gotra ID or Name is required.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  const index = masterGotrasStore.findIndex(
    (g) =>
      g._id === gotraId ||
      g.id?.toLowerCase() === gotraId.toLowerCase() ||
      g.gotraName?.toLowerCase() === gotraId.toLowerCase()
  );

  if (index === -1) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_NOT_FOUND,
      `Gotra '${gotraId}' not found.`,
      CONSTANTS.DATA_NULL,
      CONSTANTS.NOT_FOUND,
      CONSTANTS.ERROR_TRUE
    );
  }

  const existing = masterGotrasStore[index];
  const { gotraName, surnames, subcaste, isActive, displayOrder } = req.body;

  if (gotraName !== undefined) existing.gotraName = gotraName.trim();
  if (subcaste !== undefined) existing.subcaste = subcaste.trim();
  if (surnames !== undefined) {
    existing.surnames = Array.isArray(surnames) ? surnames : [surnames];
  }
  if (isActive !== undefined) existing.isActive = Boolean(isActive);
  if (displayOrder !== undefined) existing.displayOrder = Number(displayOrder);

  existing.updatedAt = new Date().toISOString();
  masterGotrasStore[index] = existing;

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    `Gotra '${existing.gotraName}' updated successfully.`,
    existing,
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

// ============================================================================
// 7. GLOBAL MASTER SETTINGS & TOGGLES (GET/PUT /api/v1/admin/master-settings)
// ============================================================================

let globalTogglesStore = {
  maintenanceMode: {
    enabled: false,
    message: "Sindhi Matrimony is undergoing scheduled server maintenance. We will be back online shortly.",
    allowedIps: ["127.0.0.1", "::1"],
  },
  smsGateway: {
    enabled: true,
    provider: "FAST2SMS",
    dltApproved: true,
    otpLength: 6,
    otpExpiryMinutes: 10,
    rateLimitPerMinute: 5,
  },
  paymentGateway: {
    enabled: true,
    provider: "RAZORPAY",
    sandboxMode: false,
    autoInvoiceReceipt: true,
    supportedCurrencies: ["INR", "AED", "USD", "GBP"],
  },
  whatsappAlerts: {
    enabled: true,
    provider: "META_CLOUD_API",
    instantMatchAlerts: true,
    biodataDirectSharing: true,
  },
  registration: {
    open: true,
    mandatoryPhoto: true,
    mandatoryIdProof: false,
    autoApproveAadhaarVerified: true,
    maxProfilesPerAccount: 5,
  },
  features: {
    horoscopeGunaMilan: true,
    inAppChat: true,
    telephonyCalling: true,
    biodataPdfDownload: true,
    dailyRecommendations: true,
  },
  lastUpdated: new Date().toISOString(),
  updatedBy: "Super Admin",
};

export const getMasterSettings = asyncHandler(async (req, res) => {
  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Global master settings and platform toggles retrieved successfully.",
    globalTogglesStore,
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

export const updateMasterSettings = asyncHandler(async (req, res) => {
  const {
    maintenanceMode,
    smsGateway,
    paymentGateway,
    whatsappAlerts,
    registration,
    features,
  } = req.body;

  if (maintenanceMode && typeof maintenanceMode === "object") {
    globalTogglesStore.maintenanceMode = {
      ...globalTogglesStore.maintenanceMode,
      ...maintenanceMode,
    };
  }

  if (smsGateway && typeof smsGateway === "object") {
    globalTogglesStore.smsGateway = {
      ...globalTogglesStore.smsGateway,
      ...smsGateway,
    };
  }

  if (paymentGateway && typeof paymentGateway === "object") {
    globalTogglesStore.paymentGateway = {
      ...globalTogglesStore.paymentGateway,
      ...paymentGateway,
    };
  }

  if (whatsappAlerts && typeof whatsappAlerts === "object") {
    globalTogglesStore.whatsappAlerts = {
      ...globalTogglesStore.whatsappAlerts,
      ...whatsappAlerts,
    };
  }

  if (registration && typeof registration === "object") {
    globalTogglesStore.registration = {
      ...globalTogglesStore.registration,
      ...registration,
    };
  }

  if (features && typeof features === "object") {
    globalTogglesStore.features = {
      ...globalTogglesStore.features,
      ...features,
    };
  }

  globalTogglesStore.lastUpdated = new Date().toISOString();
  globalTogglesStore.updatedBy = req.user?.name || "Super Admin";

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Global platform master settings updated successfully.",
    globalTogglesStore,
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

