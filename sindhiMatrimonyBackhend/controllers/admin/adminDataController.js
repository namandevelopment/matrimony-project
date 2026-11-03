/**
 * 👑 ADMIN CRM & PORTAL CONTROLLER
 * Sindhi Matrimony Application
 *
 * Implements full server controllers for Admin Screens:
 * - Members Management (/api/v1/admin/members)
 * - Leads & CRM (/api/v1/admin/leads)
 * - Dashboard KPI & Analytics (/api/v1/admin/dashboard)
 * - Verifications Queue (/api/v1/admin/verifications)
 * - Employees & RBAC (/api/v1/admin/employees)
 * - Finance Ledger (/api/v1/admin/finance)
 * - Membership Plans (/api/v1/admin/plans)
 */

import { asyncHandler, apiHTTPResponse } from "../../utils/globalFunction.js";
import * as CONSTANTS from "../../utils/constants.js";
import {
  STAFF_EMPLOYEES,
  IN_MEMORY_LEADS,
  IN_MEMORY_VERIFICATIONS,
  IN_MEMORY_TRANSACTIONS,
  getMembersInMemory,
  getLeadsInMemory,
  getDashboardStatsInMemory,
  getDashboardActionQueuesInMemory,
  getDashboardChartsDataInMemory,
  findProfileByIdInMemory,
  registerCandidateInMemory,
  findUserByPhoneInMemory,
} from "../../services/realDataService.js";

// ============================================================================
// 1. MEMBERS MANAGEMENT
// ============================================================================

export const getMembersList = asyncHandler(async (req, res) => {
  const {
    page = req.query.pageNo || 1,
    limit = req.query.pageSize || 20,
    search = "",
    status = "ALL",
    isVerified,
    membershipTier = "ALL",
    gender = "ALL",
    city = "ALL",
    subcaste = "ALL",
    filter = req.query.tab || req.query.type || "ALL",
  } = req.query;

  const result = getMembersInMemory({
    page: Number(page),
    limit: Number(limit),
    search,
    status,
    isVerified,
    membershipTier,
    gender,
    city,
    subcaste,
    filter,
  });

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Members fetched successfully.",
    result,
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

export const getMemberDetail = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const candidate = findProfileByIdInMemory(id);

  if (!candidate) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_NOT_FOUND,
      "Member profile not found.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.NOT_FOUND,
      CONSTANTS.ERROR_TRUE
    );
  }

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Member details retrieved successfully.",
    {
      member: candidate,
      stats: {
        matchesSuggested: 14,
        interestsReceived: 8,
        interestsSent: 5,
        profileViews: 42,
      },
    },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

export const updateMemberStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, reason } = req.body;
  const candidate = findProfileByIdInMemory(id);

  if (candidate) {
    candidate.status = status;
    candidate.statusReason = reason;
  }

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    `Member status updated to ${status}.`,
    { id, status, reason },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

export const verifyMember = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { isVerified = true } = req.body;
  const candidate = findProfileByIdInMemory(id);

  if (candidate) {
    candidate.isVerified = Boolean(isVerified);
    candidate.verificationBadge = isVerified ? "VERIFIED" : "REJECTED";
  }

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    `Member verification updated.`,
    { id, isVerified },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

export const createMember = asyncHandler(async (req, res) => {
  const {
    name,
    gender,
    phone,
    mobile,
    email,
    dateOfBirth,
    dob,
    age,
    height,
    maritalStatus = "NEVER_MARRIED",
    subcaste = "Bhaiband",
    gotra = "Advani",
    motherGotra = "Vaswani",
    manglik = "NON_MANGLIK",
    education = {},
    profession = {},
    location = {},
    family = {},
    partnerPreference = {},
    aboutMe,
    avatar,
    image,
    photo,
    photos,
    membershipTier = "FREE",
    isVerified = false,
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

  const candidateGender = (gender || "").toString().toUpperCase();
  if (candidateGender !== "MALE" && candidateGender !== "FEMALE") {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "Validation Failed: 'gender' is required and must be either 'MALE' or 'FEMALE'.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  const rawPhone = phone || mobile || "";
  const cleanPhone = String(rawPhone).replace(/\D/g, "");
  if (cleanPhone.length < 10) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "Validation Failed: A valid 10-digit phone/mobile number is required.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  if (findUserByPhoneInMemory(cleanPhone)) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_CONFLICT,
      "Validation Failed: A member with this phone number already exists.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.CONFLICT,
      CONSTANTS.ERROR_TRUE
    );
  }

  let calculatedAge = Number(age);
  const resolvedDob = dateOfBirth || dob;
  if (resolvedDob) {
    const birthDate = new Date(resolvedDob);
    if (!isNaN(birthDate.getTime())) {
      const today = new Date();
      let diffAge = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        diffAge--;
      }
      calculatedAge = diffAge;
    }
  }

  if (calculatedAge && calculatedAge < 18) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "Validation Failed: Candidate must be at least 18 years old.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  const finalAge = calculatedAge || (candidateGender === "FEMALE" ? 25 : 28);

  const userPayload = {
    phone: cleanPhone,
    name: name.trim(),
    email: email || `${cleanPhone}@sindhimarriage.in`,
    role: 1,
    status: "ACTIVE",
    isPhoneVerified: true,
    isEmailVerified: Boolean(email),
  };

  const profilePayload = {
    name: name.trim(),
    gender: candidateGender,
    dateOfBirth: resolvedDob || new Date(Date.now() - finalAge * 365.25 * 24 * 3600 * 1000).toISOString(),
    age: finalAge,
    height: Number(height) || (candidateGender === "FEMALE" ? 165 : 175),
    maritalStatus: maritalStatus.toUpperCase(),
    subcaste: subcaste.trim(),
    gotra: gotra.trim(),
    motherGotra: motherGotra.trim(),
    manglik: manglik.toUpperCase(),
    education: typeof education === "object" ? education : { degree: String(education), field: "General", college: "University" },
    profession: typeof profession === "object" ? profession : { occupation: String(profession), companyName: "Business/Corporate", annualIncome: 1200000, currency: "INR" },
    location: typeof location === "object" ? location : { city: String(location) || "Mumbai", state: "Maharashtra", country: "India" },
    family: typeof family === "object" ? family : { familyType: "NUCLEAR", fatherOccupation: "Businessman", motherOccupation: "Homemaker" },
    partnerPreference: typeof partnerPreference === "object" ? partnerPreference : {},
    aboutMe: aboutMe || `Sindhi candidate looking for a compatible life partner.`,
    avatar: avatar || image || photo || (candidateGender === "FEMALE" ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600" : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600"),
    photos: Array.isArray(photos) ? photos : (avatar || image || photo ? [avatar || image || photo] : []),
    membershipTier: membershipTier.toUpperCase(),
    isVerified: Boolean(isVerified),
  };

  const { user: registeredUser, profile: registeredProfile } = registerCandidateInMemory(userPayload, profilePayload);

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_CREATED,
    `Candidate '${registeredProfile.name}' registered successfully with ID ${registeredProfile.matrimonyId}.`,
    { user: registeredUser, profile: registeredProfile },
    CONSTANTS.CREATED,
    CONSTANTS.ERROR_FALSE
  );
});

export const bulkAddMember = asyncHandler(async (req, res) => {
  let rawList = null;
  if (Array.isArray(req.body)) {
    rawList = req.body;
  } else if (Array.isArray(req.body?.members)) {
    rawList = req.body.members;
  } else if (req.body && typeof req.body === "object") {
    const values = Object.values(req.body).filter((item) => item && typeof item === "object" && item.name);
    if (values.length > 0) {
      rawList = values;
    }
  }

  if (!rawList || !rawList.length) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "Validation Failed: Request body must be an array of candidate objects or contain a 'members' array.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  const created = [];
  const skipped = [];
  const seenBatchPhones = new Set();

  for (let idx = 0; idx < rawList.length; idx++) {
    const item = rawList[idx];
    const {
      name,
      gender,
      phone,
      mobile,
      email,
      dateOfBirth,
      dob,
      age,
      height,
      maritalStatus = "NEVER_MARRIED",
      subcaste = "Bhaiband",
      gotra = "Advani",
      motherGotra = "Vaswani",
      manglik = "NON_MANGLIK",
      education = {},
      profession = {},
      location = {},
      family = {},
      partnerPreference = {},
      aboutMe,
      avatar,
      image,
      photo,
      photos,
      membershipTier = "FREE",
      isVerified = false,
    } = item || {};

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      skipped.push({ index: idx, name: name || "Unknown", phone: phone || "N/A", reason: "Name is required and must have at least 2 characters." });
      continue;
    }

    const candidateGender = (gender || "").toString().toUpperCase();
    if (candidateGender !== "MALE" && candidateGender !== "FEMALE") {
      skipped.push({ index: idx, name, phone: phone || "N/A", reason: "Gender must be either 'MALE' or 'FEMALE'." });
      continue;
    }

    const rawPhone = phone || mobile || "";
    const cleanPhone = String(rawPhone).replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      skipped.push({ index: idx, name, phone: rawPhone, reason: "A valid 10-digit phone number is required." });
      continue;
    }

    if (seenBatchPhones.has(cleanPhone)) {
      skipped.push({ index: idx, name, phone: cleanPhone, reason: `Duplicate phone '${cleanPhone}' within this upload batch.` });
      continue;
    }

    if (findUserByPhoneInMemory(cleanPhone)) {
      skipped.push({ index: idx, name, phone: cleanPhone, reason: `Member with phone '${cleanPhone}' already exists in system.` });
      continue;
    }

    seenBatchPhones.add(cleanPhone);

    let calculatedAge = Number(age);
    const resolvedDob = dateOfBirth || dob;
    if (resolvedDob) {
      const birthDate = new Date(resolvedDob);
      if (!isNaN(birthDate.getTime())) {
        const today = new Date();
        let diffAge = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          diffAge--;
        }
        calculatedAge = diffAge;
      }
    }

    if (calculatedAge && calculatedAge < 18) {
      skipped.push({ index: idx, name, phone: cleanPhone, reason: "Candidate must be at least 18 years old." });
      continue;
    }

    const finalAge = calculatedAge || (candidateGender === "FEMALE" ? 25 : 28);

    const userPayload = {
      phone: cleanPhone,
      name: name.trim(),
      email: email || `${cleanPhone}@sindhimarriage.in`,
      role: 1,
      status: "ACTIVE",
      isPhoneVerified: true,
      isEmailVerified: Boolean(email),
    };

    const profilePayload = {
      name: name.trim(),
      gender: candidateGender,
      dateOfBirth: resolvedDob || new Date(Date.now() - finalAge * 365.25 * 24 * 3600 * 1000).toISOString(),
      age: finalAge,
      height: Number(height) || (candidateGender === "FEMALE" ? 165 : 175),
      maritalStatus: maritalStatus.toUpperCase(),
      subcaste: subcaste.trim(),
      gotra: gotra.trim(),
      motherGotra: motherGotra.trim(),
      manglik: manglik.toUpperCase(),
      education: typeof education === "object" ? education : { degree: String(education), field: "General", college: "University" },
      profession: typeof profession === "object" ? profession : { occupation: String(profession), companyName: "Business/Corporate", annualIncome: 1200000, currency: "INR" },
      location: typeof location === "object" ? location : { city: String(location) || "Mumbai", state: "Maharashtra", country: "India" },
      family: typeof family === "object" ? family : { familyType: "NUCLEAR", fatherOccupation: "Businessman", motherOccupation: "Homemaker" },
      partnerPreference: typeof partnerPreference === "object" ? partnerPreference : {},
      aboutMe: aboutMe || `Sindhi candidate looking for a compatible life partner.`,
      avatar: avatar || image || photo || (candidateGender === "FEMALE" ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600" : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600"),
      photos: Array.isArray(photos) ? photos : (avatar || image || photo ? [avatar || image || photo] : []),
      membershipTier: membershipTier.toUpperCase(),
      isVerified: Boolean(isVerified),
    };

    const { user: regUser, profile: regProfile } = registerCandidateInMemory(userPayload, profilePayload);
    created.push({
      id: regProfile._id,
      matrimonyId: regProfile.matrimonyId,
      name: regProfile.name,
      phone: regUser.phone,
      gender: regProfile.gender,
      membershipTier: regProfile.membershipTier,
    });
  }

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_CREATED,
    `Bulk registration complete: ${created.length} candidates added successfully, ${skipped.length} skipped.`,
    {
      totalSubmitted: rawList.length,
      createdCount: created.length,
      skippedCount: skipped.length,
      created,
      skipped,
    },
    CONSTANTS.CREATED,
    CONSTANTS.ERROR_FALSE
  );
});

export const updateMember = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const candidate = findProfileByIdInMemory(id);

  if (!candidate) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_NOT_FOUND,
      `Member profile with ID '${id}' not found.`,
      CONSTANTS.DATA_NULL,
      CONSTANTS.NOT_FOUND,
      CONSTANTS.ERROR_TRUE
    );
  }

  const {
    name,
    gender,
    age,
    dateOfBirth,
    height,
    maritalStatus,
    subcaste,
    gotra,
    motherGotra,
    manglik,
    education,
    profession,
    location,
    family,
    partnerPreference,
    aboutMe,
    avatar,
    photos,
    membershipTier,
    isVerified,
    status,
  } = req.body;

  if (age !== undefined && Number(age) < 18) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "Validation Failed: Candidate age must be at least 18.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  if (name !== undefined) candidate.name = name.trim();
  if (gender !== undefined) candidate.gender = gender.toUpperCase();
  if (age !== undefined) candidate.age = Number(age);
  if (dateOfBirth !== undefined) candidate.dateOfBirth = dateOfBirth;
  if (height !== undefined) {
    candidate.height = Number(height);
    candidate.heightFormatted = `${Math.floor(Number(height) / 30.48)}'${Math.round((Number(height) % 30.48) / 2.54)}"`;
  }
  if (maritalStatus !== undefined) candidate.maritalStatus = maritalStatus.toUpperCase();
  if (subcaste !== undefined) candidate.subcaste = subcaste.trim();
  if (gotra !== undefined) candidate.gotra = gotra.trim();
  if (motherGotra !== undefined) candidate.motherGotra = motherGotra.trim();
  if (manglik !== undefined) candidate.manglik = manglik.toUpperCase();

  if (education !== undefined) {
    candidate.education = typeof education === "object" ? { ...candidate.education, ...education } : { degree: String(education) };
  }
  if (profession !== undefined) {
    candidate.profession = typeof profession === "object" ? { ...candidate.profession, ...profession } : { occupation: String(profession) };
  }
  if (location !== undefined) {
    candidate.location = typeof location === "object" ? { ...candidate.location, ...location } : { city: String(location) };
  }
  if (family !== undefined) {
    candidate.family = typeof family === "object" ? { ...candidate.family, ...family } : candidate.family;
  }
  if (partnerPreference !== undefined) {
    candidate.partnerPreference = typeof partnerPreference === "object" ? { ...candidate.partnerPreference, ...partnerPreference } : candidate.partnerPreference;
  }
  if (aboutMe !== undefined) candidate.aboutMe = aboutMe.trim();
  if (avatar !== undefined) candidate.avatar = avatar.trim();
  if (photos !== undefined && Array.isArray(photos)) candidate.photos = photos;
  if (membershipTier !== undefined) candidate.membershipTier = membershipTier.toUpperCase();
  if (isVerified !== undefined) {
    candidate.isVerified = Boolean(isVerified);
    candidate.verificationBadge = isVerified ? "VERIFIED" : "NOT_SUBMITTED";
  }
  if (status !== undefined) candidate.status = status.toUpperCase();

  candidate.updatedAt = new Date().toISOString();

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    `Member '${candidate.name}' updated successfully.`,
    candidate,
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});


// ============================================================================
// 2. LEADS & CRM MANAGEMENT
// ============================================================================

export const getLeadsList = asyncHandler(async (req, res) => {
  const {
    page = req.query.pageNo || 1,
    limit = req.query.pageSize || 20,
    search = "",
    view = "ALL",
    status = "ALL",
    source = "ALL",
    priority = "ALL",
    ownerId,
  } = req.query;

  const result = getLeadsInMemory({
    page: Number(page),
    limit: Number(limit),
    search,
    view,
    status,
    source,
    priority,
    ownerId,
  });

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "CRM Leads retrieved successfully.",
    result,
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

export const getLeadSavedViews = asyncHandler(async (req, res) => {
  const total = IN_MEMORY_LEADS.length;
  const myLeads = IN_MEMORY_LEADS.filter((l) => l.owner?._id === STAFF_EMPLOYEES[1]._id).length;
  const unassigned = IN_MEMORY_LEADS.filter((l) => !l.owner?._id).length;
  const todaysFollowups = IN_MEMORY_LEADS.filter((l) => l.status === "FOLLOW_UP").length;
  const overdue = IN_MEMORY_LEADS.filter((l) => l.slaStatus === "BREACH").length;
  const highPriority = IN_MEMORY_LEADS.filter((l) => l.priority === "HIGH").length;
  const converted = IN_MEMORY_LEADS.filter((l) => l.status === "CONVERTED").length;

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Saved views counts retrieved.",
    [
      { key: "ALL", label: "All Leads", count: total },
      { key: "MY_LEADS", label: "My Leads", count: myLeads },
      { key: "UNASSIGNED", label: "Unassigned", count: unassigned },
      { key: "TODAYS_FOLLOWUPS", label: "Today's Follow-ups", count: todaysFollowups },
      { key: "OVERDUE", label: "Overdue (SLA)", count: overdue },
      { key: "HIGH_PRIORITY", label: "High Priority", count: highPriority },
      { key: "CONVERTED", label: "Converted", count: converted },
    ],
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

export const getLeadDetail = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const lead = IN_MEMORY_LEADS.find((l) => l._id === id || l.leadId === id || l.candidateProfileId === id);

  if (!lead) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_NOT_FOUND,
      "Lead not found.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.NOT_FOUND,
      CONSTANTS.ERROR_TRUE
    );
  }

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Lead details retrieved.",
    lead,
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

export const updateLeadStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, note } = req.body;
  const lead = IN_MEMORY_LEADS.find((l) => l._id === id || l.leadId === id);

  if (lead) {
    const prevStatus = lead.status;
    lead.status = status;
    lead.timeline.unshift({
      _id: `time_${Date.now()}`,
      type: "STATUS_CHANGED",
      description: `Status changed from ${prevStatus} to ${status}${note ? `: ${note}` : ""}`,
      timestamp: new Date().toISOString(),
    });
  }

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    `Lead status updated to ${status}.`,
    lead,
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

export const addLeadNote = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { noteText, author = "Staff Admin" } = req.body;
  const lead = IN_MEMORY_LEADS.find((l) => l._id === id || l.leadId === id);

  if (lead) {
    const newNote = {
      _id: `note_${Date.now()}`,
      noteText,
      author,
      createdAt: new Date().toISOString(),
    };
    lead.notes.unshift(newNote);
    lead.timeline.unshift({
      _id: `time_${Date.now()}`,
      type: "NOTE_ADDED",
      description: `Note added by ${author}: ${noteText.slice(0, 50)}...`,
      timestamp: new Date().toISOString(),
    });
  }

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_CREATED,
    "Note added to lead.",
    lead?.notes?.[0] || {},
    CONSTANTS.CREATED,
    CONSTANTS.ERROR_FALSE
  );
});

export const setLeadFollowUp = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { followUpDate, reason = "Routine client follow-up" } = req.body;
  const lead = IN_MEMORY_LEADS.find((l) => l._id === id || l.leadId === id);

  if (lead) {
    lead.nextFollowUp = followUpDate;
    lead.status = "FOLLOW_UP";
    lead.timeline.unshift({
      _id: `time_${Date.now()}`,
      type: "FOLLOW_UP_SET",
      description: `Follow-up set for ${new Date(followUpDate).toLocaleString("en-IN")}: ${reason}`,
      timestamp: new Date().toISOString(),
    });
  }

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Follow-up scheduled.",
    { id, followUpDate, reason },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

export const bulkAssignLeads = asyncHandler(async (req, res) => {
  const { leadIds = [], employeeId } = req.body;
  const emp = STAFF_EMPLOYEES.find((e) => e._id === employeeId || e.employeeId === employeeId) || STAFF_EMPLOYEES[1];

  let assignedCount = 0;
  for (const lId of leadIds) {
    const lead = IN_MEMORY_LEADS.find((l) => l._id === lId || l.leadId === lId);
    if (lead) {
      lead.owner = {
        _id: emp._id,
        name: emp.fullName,
        email: emp.email,
      };
      lead.timeline.unshift({
        _id: `time_${Date.now()}`,
        type: "REASSIGNED",
        description: `Lead reassigned to ${emp.fullName}`,
        timestamp: new Date().toISOString(),
      });
      assignedCount++;
    }
  }

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    `Successfully assigned ${assignedCount} leads to ${emp.fullName}.`,
    { assignedCount, assignedTo: emp.fullName },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

// ============================================================================
// 3. DASHBOARD STATS & ANALYTICS
// ============================================================================

export const getDashboardStats = asyncHandler(async (req, res) => {
  const stats = getDashboardStatsInMemory();
  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Dashboard KPI metrics retrieved.",
    { stats },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

export const getDashboardActionQueues = asyncHandler(async (req, res) => {
  const queues = getDashboardActionQueuesInMemory();
  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Admin action queues retrieved.",
    { queues },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

export const getDashboardChartsOverview = asyncHandler(async (req, res) => {
  const charts = getDashboardChartsDataInMemory();
  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Dashboard charts overview retrieved.",
    charts,
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

export const getDashboardCharts = asyncHandler(async (req, res) => {
  const { type } = req.params;

  let chartData = {};
  if (type === "registrations") {
    chartData = {
      labels: ["Day 1", "Day 5", "Day 10", "Day 15", "Day 20", "Day 25", "Day 30"],
      data: [12, 19, 24, 31, 28, 38, 45],
    };
  } else if (type === "lead-status") {
    chartData = {
      labels: ["New", "Assigned", "Contacted", "Interested", "Follow Up", "Converted", "Lost"],
      data: [12, 10, 18, 22, 14, 25, 6],
    };
  } else if (type === "revenue-by-plan") {
    chartData = {
      labels: ["Silver (₹2,999)", "Gold (₹5,999)", "Diamond (₹9,999)", "VIP (₹21,000)"],
      data: [45000, 120000, 90000, 105000],
    };
  } else if (type === "funnel") {
    chartData = {
      steps: [
        { label: "Website Visitors", count: 8500 },
        { label: "Sign-Up Initiated", count: 1850 },
        { label: "Profile Completed", count: 1240 },
        { label: "Phone & KYC Verified", count: 980 },
        { label: "Paid Subscriptions", count: 215 },
      ],
    };
  } else {
    chartData = {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      data: [42, 65, 84, 95, 112, 150],
    };
  }

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    `Chart data for ${type} retrieved.`,
    chartData,
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

export const getTopAgents = asyncHandler(async (req, res) => {
  const agents = STAFF_EMPLOYEES.filter((e) => e.role !== "SUPER_ADMIN").map((emp, idx) => ({
    employeeId: emp.employeeId,
    name: emp.fullName,
    leadsAssigned: 25 + idx * 8,
    converted: 8 + idx * 3,
    conversionRate: `${((8 + idx * 3) / (25 + idx * 8) * 100).toFixed(1)}%`,
    avgFirstContact: `${15 + idx * 3} mins`,
  }));

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Top CRM agents retrieved.",
    agents,
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

export const getRecentLeads = asyncHandler(async (req, res) => {
  const leads = IN_MEMORY_LEADS.slice(0, 10);
  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Recent leads retrieved.",
    leads,
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

export const getTodaysFollowups = asyncHandler(async (req, res) => {
  const followups = IN_MEMORY_LEADS.filter((l) => l.status === "FOLLOW_UP" || l.nextFollowUp).slice(0, 15);
  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Today's follow-ups retrieved.",
    followups,
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

// ============================================================================
// 4. VERIFICATIONS QUEUE
// ============================================================================

export const getPendingVerifications = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.pageNo || req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit || req.query.pageSize) || 20));
  const pending = IN_MEMORY_VERIFICATIONS.filter((v) => v.status === "PENDING");
  const total = pending.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const paginated = pending.slice((page - 1) * limit, (page - 1) * limit + limit);

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Pending verifications retrieved.",
    {
      verifications: paginated,
      list: paginated,
      total,
      totalPages,
      page,
      limit,
      hasMore: page < totalPages,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasMore: page < totalPages,
      },
    },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

export const approveVerification = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const verif = IN_MEMORY_VERIFICATIONS.find((v) => v._id === id || v.candidateId === id);

  if (verif) {
    verif.status = "APPROVED";
    const cand = findProfileByIdInMemory(verif.candidateId);
    if (cand) {
      cand.isVerified = true;
      cand.verificationBadge = "VERIFIED";
    }
  }

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Verification approved successfully.",
    verif,
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

export const rejectVerification = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason = "Document image is unclear" } = req.body;
  const verif = IN_MEMORY_VERIFICATIONS.find((v) => v._id === id || v.candidateId === id);

  if (verif) {
    verif.status = "REJECTED";
    verif.rejectionReason = reason;
    const cand = findProfileByIdInMemory(verif.candidateId);
    if (cand) {
      cand.isVerified = false;
      cand.verificationBadge = "REJECTED";
    }
  }

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Verification rejected.",
    verif,
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

// ============================================================================
// 5. EMPLOYEES & STAFF
// ============================================================================

export const getEmployeesList = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.pageNo || req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit || req.query.pageSize) || 20));
  const total = STAFF_EMPLOYEES.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const paginated = STAFF_EMPLOYEES.slice((page - 1) * limit, (page - 1) * limit + limit);

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Employees fetched successfully.",
    {
      employees: paginated,
      list: paginated,
      total,
      totalPages,
      page,
      limit,
      hasMore: page < totalPages,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasMore: page < totalPages,
      },
    },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

export const getEmployeeDetail = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const emp = STAFF_EMPLOYEES.find((e) => e._id === id || e.employeeId === id);

  if (!emp) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_NOT_FOUND,
      "Employee not found.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.NOT_FOUND,
      CONSTANTS.ERROR_TRUE
    );
  }

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Employee details retrieved.",
    emp,
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

export const updateEmployeePermissions = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { permissions, reason } = req.body;
  const emp = STAFF_EMPLOYEES.find((e) => e._id === id || e.employeeId === id);

  if (emp) {
    emp.permissions = { ...emp.permissions, ...permissions };
  }

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Employee permissions updated.",
    { id, permissions, reason },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

// ============================================================================
// 6. FINANCE & PLANS
// ============================================================================

export const getFinanceSummary = asyncHandler(async (req, res) => {
  const totalRevenue = IN_MEMORY_TRANSACTIONS
    .filter((t) => t.status === "SUCCESS")
    .reduce((acc, t) => acc + t.amount, 0);

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Finance summary retrieved.",
    {
      totalRevenue,
      currency: "INR",
      successfulTransactions: IN_MEMORY_TRANSACTIONS.filter((t) => t.status === "SUCCESS").length,
      refundedTransactions: IN_MEMORY_TRANSACTIONS.filter((t) => t.status === "REFUNDED").length,
      pendingSettlement: 18500,
    },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

export const getTransactionsList = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.pageNo || req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit || req.query.pageSize) || 20));
  const total = IN_MEMORY_TRANSACTIONS.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const paginated = IN_MEMORY_TRANSACTIONS.slice((page - 1) * limit, (page - 1) * limit + limit);

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Transaction ledger retrieved.",
    {
      transactions: paginated,
      list: paginated,
      total,
      totalPages,
      page,
      limit,
      hasMore: page < totalPages,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasMore: page < totalPages,
      },
    },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

export const getPlansList = asyncHandler(async (req, res) => {
  const plans = [
    {
      _id: "plan_silver",
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
    },
    {
      _id: "plan_gold",
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
    },
    {
      _id: "plan_diamond",
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
    },
    {
      _id: "plan_vip",
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
    },
  ];

  const page = Math.max(1, Number(req.query.pageNo || req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit || req.query.pageSize) || 20));
  const total = plans.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const paginated = plans.slice((page - 1) * limit, (page - 1) * limit + limit);

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Plans retrieved successfully.",
    {
      plans: paginated,
      list: paginated,
      total,
      totalPages,
      page,
      limit,
      hasMore: page < totalPages,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasMore: page < totalPages,
      },
    },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

// ============================================================================
// 8. USER ANALYTICS & TELEMETRY SESSIONS (Google / Firebase Analytics style)
// ============================================================================
const nowMs = Date.now();
const hMs = 60 * 60 * 1000;
const dMs = 24 * hMs;

export const inMemoryUserSessions = [
  // --- TODAY'S SESSIONS (Past 0-12 hours) ---
  {
    id: "sess_1",
    userId: "u_101",
    name: "Simran Advani",
    memberId: "SM-4821",
    phone: "+91 98201 54321",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    platform: "MOBILE_APP",
    deviceInfo: "Android 14 (OnePlus 11)",
    loginTime: new Date(nowMs - 3.8 * hMs).toISOString(),
    logoutTime: new Date(nowMs - 3.3 * hMs).toISOString(),
    sessionDurationMinutes: 28,
    screensVisited: ["Home Feed", "Daily Horoscope", "Recommendations", "Payment & Upgrade Plans"],
    visitedPaymentScreen: true,
    viewedPlan: "Sindhi Gold (3 Months)",
    engagementScore: "HIGH",
    status: "LOGGED_OUT",
  },
  {
    id: "sess_2",
    userId: "u_102",
    name: "Rohan Chandiramani",
    memberId: "SM-4932",
    phone: "+91 98233 87654",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    platform: "WEB_PANEL",
    deviceInfo: "Chrome on macOS (Desktop)",
    loginTime: new Date(nowMs - 1.8 * hMs).toISOString(),
    logoutTime: null,
    sessionDurationMinutes: 45,
    screensVisited: ["Dashboard", "Member Search", "Kundli Match", "Festival Offers", "Payment Checkout"],
    visitedPaymentScreen: true,
    viewedPlan: "Royal Sindhi Platinum (6 Months)",
    engagementScore: "HIGH",
    status: "ACTIVE_NOW",
  },
  {
    id: "sess_3",
    userId: "u_103",
    name: "Pooja Vazirani",
    memberId: "SM-5104",
    phone: "+91 97112 34567",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
    platform: "MOBILE_APP",
    deviceInfo: "iOS 18.1 (iPhone 15 Pro)",
    loginTime: new Date(nowMs - 1.5 * hMs).toISOString(),
    logoutTime: new Date(nowMs - 1.25 * hMs).toISOString(),
    sessionDurationMinutes: 15,
    screensVisited: ["Home Feed", "Interests Received", "Chat Messaging"],
    visitedPaymentScreen: false,
    viewedPlan: null,
    engagementScore: "MEDIUM",
    status: "LOGGED_OUT",
  },
  {
    id: "sess_4",
    userId: "u_104",
    name: "Karan Lulla",
    memberId: "SM-5220",
    phone: "+91 99887 11223",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    platform: "MOBILE_APP",
    deviceInfo: "Android 13 (Samsung S23)",
    loginTime: new Date(nowMs - 35 * 60 * 1000).toISOString(),
    logoutTime: null,
    sessionDurationMinutes: 22,
    screensVisited: ["Home Feed", "Profile Edit", "Upgrade Screen"],
    visitedPaymentScreen: true,
    viewedPlan: "Sindhi Diamond VIP (12 Months)",
    engagementScore: "HIGH",
    status: "ACTIVE_NOW",
  },
  {
    id: "sess_5",
    userId: "u_105",
    name: "Ananya Motwani",
    memberId: "SM-5341",
    phone: "+91 98450 11998",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    platform: "WEB_PANEL",
    deviceInfo: "Safari on iPadOS",
    loginTime: new Date(nowMs - 5 * hMs).toISOString(),
    logoutTime: new Date(nowMs - 4.8 * hMs).toISOString(),
    sessionDurationMinutes: 12,
    screensVisited: ["Home Feed", "Browse Profiles"],
    visitedPaymentScreen: false,
    viewedPlan: null,
    engagementScore: "LOW",
    status: "LOGGED_OUT",
  },
  {
    id: "sess_6",
    userId: "u_106",
    name: "Deepak Chawla",
    memberId: "SM-5490",
    phone: "+91 98110 55443",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150",
    platform: "MOBILE_APP",
    deviceInfo: "Android 14 (Pixel 8)",
    loginTime: new Date(nowMs - 6.5 * hMs).toISOString(),
    logoutTime: new Date(nowMs - 6.0 * hMs).toISOString(),
    sessionDurationMinutes: 33,
    screensVisited: ["Home Feed", "Kundli Report", "Prime Plans", "Payment Screen"],
    visitedPaymentScreen: true,
    viewedPlan: "Diwali Mahabachat Vivah (Flat 60% OFF)",
    engagementScore: "HIGH",
    status: "LOGGED_OUT",
  },
  {
    id: "sess_7",
    userId: "u_107",
    name: "Mehak Jagtiani",
    memberId: "SM-5512",
    phone: "+91 98330 99881",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    platform: "MOBILE_APP",
    deviceInfo: "iOS 18 (iPhone 14)",
    loginTime: new Date(nowMs - 20 * 60 * 1000).toISOString(),
    logoutTime: null,
    sessionDurationMinutes: 18,
    screensVisited: ["Home Feed", "Matches", "Contact Info View", "Upgrade Screen"],
    visitedPaymentScreen: true,
    viewedPlan: "Royal Sindhi Platinum (6 Months)",
    engagementScore: "HIGH",
    status: "ACTIVE_NOW",
  },
  {
    id: "sess_8",
    userId: "u_108",
    name: "Naveen Bhambhani",
    memberId: "SM-5601",
    phone: "+91 97654 32109",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    platform: "WEB_PANEL",
    deviceInfo: "Edge on Windows 11",
    loginTime: new Date(nowMs - 8 * hMs).toISOString(),
    logoutTime: new Date(nowMs - 7.5 * hMs).toISOString(),
    sessionDurationMinutes: 30,
    screensVisited: ["Dashboard", "Shortlists", "Settings"],
    visitedPaymentScreen: false,
    viewedPlan: null,
    engagementScore: "MEDIUM",
    status: "LOGGED_OUT",
  },

  // --- PAST 2 - 7 DAYS SESSIONS ---
  {
    id: "sess_9",
    userId: "u_109",
    name: "Priyanka Malkani",
    memberId: "SM-5710",
    phone: "+91 98211 44556",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150",
    platform: "MOBILE_APP",
    deviceInfo: "Android 14 (Samsung S24)",
    loginTime: new Date(nowMs - 1.2 * dMs).toISOString(),
    logoutTime: new Date(nowMs - 1.15 * dMs).toISOString(),
    sessionDurationMinutes: 40,
    screensVisited: ["Home Feed", "Kundli Match", "Pricing Plans", "Payment Screen"],
    visitedPaymentScreen: true,
    viewedPlan: "Sindhi Gold (3 Months)",
    engagementScore: "HIGH",
    status: "LOGGED_OUT",
  },
  {
    id: "sess_10",
    userId: "u_110",
    name: "Sunil Wadhwa",
    memberId: "SM-5822",
    phone: "+91 98920 66778",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",
    platform: "WEB_PANEL",
    deviceInfo: "Firefox on macOS",
    loginTime: new Date(nowMs - 2.1 * dMs).toISOString(),
    logoutTime: new Date(nowMs - 2.05 * dMs).toISOString(),
    sessionDurationMinutes: 24,
    screensVisited: ["Dashboard", "Matches", "Chat"],
    visitedPaymentScreen: false,
    viewedPlan: null,
    engagementScore: "MEDIUM",
    status: "LOGGED_OUT",
  },
  {
    id: "sess_11",
    userId: "u_111",
    name: "Ritu Chhabria",
    memberId: "SM-5930",
    phone: "+91 98451 22334",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150",
    platform: "MOBILE_APP",
    deviceInfo: "iOS 17.5 (iPhone 13)",
    loginTime: new Date(nowMs - 2.8 * dMs).toISOString(),
    logoutTime: new Date(nowMs - 2.75 * dMs).toISOString(),
    sessionDurationMinutes: 35,
    screensVisited: ["Home Feed", "Festival Offers", "Upgrade Screen"],
    visitedPaymentScreen: true,
    viewedPlan: "Cheti Chand Jhulelal Offer (50% OFF)",
    engagementScore: "HIGH",
    status: "LOGGED_OUT",
  },
  {
    id: "sess_12",
    userId: "u_112",
    name: "Manish Vaswani",
    memberId: "SM-6011",
    phone: "+91 98222 77889",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150",
    platform: "WEB_PANEL",
    deviceInfo: "Chrome on Windows 10",
    loginTime: new Date(nowMs - 3.4 * dMs).toISOString(),
    logoutTime: new Date(nowMs - 3.35 * dMs).toISOString(),
    sessionDurationMinutes: 20,
    screensVisited: ["Dashboard", "Kundli Match", "Pricing Plans"],
    visitedPaymentScreen: true,
    viewedPlan: "Sindhi Diamond VIP (12 Months)",
    engagementScore: "HIGH",
    status: "LOGGED_OUT",
  },
  {
    id: "sess_13",
    userId: "u_113",
    name: "Riya Keswani",
    memberId: "SM-6124",
    phone: "+91 97118 88990",
    avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150",
    platform: "MOBILE_APP",
    deviceInfo: "Android 13 (Vivo V29)",
    loginTime: new Date(nowMs - 4.2 * dMs).toISOString(),
    logoutTime: new Date(nowMs - 4.15 * dMs).toISOString(),
    sessionDurationMinutes: 18,
    screensVisited: ["Home Feed", "Explore Profiles"],
    visitedPaymentScreen: false,
    viewedPlan: null,
    engagementScore: "LOW",
    status: "LOGGED_OUT",
  },
  {
    id: "sess_14",
    userId: "u_114",
    name: "Harsh Gidwani",
    memberId: "SM-6235",
    phone: "+91 98334 11223",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    platform: "MOBILE_APP",
    deviceInfo: "iOS 18 (iPhone 15)",
    loginTime: new Date(nowMs - 5.1 * dMs).toISOString(),
    logoutTime: new Date(nowMs - 5.0 * dMs).toISOString(),
    sessionDurationMinutes: 48,
    screensVisited: ["Home Feed", "Chat", "Festival Deals", "Payment Screen"],
    visitedPaymentScreen: true,
    viewedPlan: "Royal Sindhi Platinum (6 Months)",
    engagementScore: "HIGH",
    status: "LOGGED_OUT",
  },
  {
    id: "sess_15",
    userId: "u_115",
    name: "Divya Wadhwa",
    memberId: "SM-6340",
    phone: "+91 98205 66779",
    avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150",
    platform: "WEB_PANEL",
    deviceInfo: "Safari on macOS",
    loginTime: new Date(nowMs - 6.2 * dMs).toISOString(),
    logoutTime: new Date(nowMs - 6.15 * dMs).toISOString(),
    sessionDurationMinutes: 26,
    screensVisited: ["Dashboard", "Shortlists", "Profile Edit"],
    visitedPaymentScreen: false,
    viewedPlan: null,
    engagementScore: "MEDIUM",
    status: "LOGGED_OUT",
  },

  // --- PAST 8 - 30 DAYS SESSIONS ---
  {
    id: "sess_16",
    userId: "u_116",
    name: "Gaurav Hiranandani",
    memberId: "SM-6455",
    phone: "+91 99880 12345",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    platform: "MOBILE_APP",
    deviceInfo: "Android 14 (OnePlus 12)",
    loginTime: new Date(nowMs - 9.5 * dMs).toISOString(),
    logoutTime: new Date(nowMs - 9.4 * dMs).toISOString(),
    sessionDurationMinutes: 38,
    screensVisited: ["Home Feed", "Recommendations", "Payment Upgrade"],
    visitedPaymentScreen: true,
    viewedPlan: "Sindhi Gold (3 Months)",
    engagementScore: "HIGH",
    status: "LOGGED_OUT",
  },
  {
    id: "sess_17",
    userId: "u_117",
    name: "Komal Rohra",
    memberId: "SM-6560",
    phone: "+91 98114 55667",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150",
    platform: "WEB_PANEL",
    deviceInfo: "Chrome on Windows 11",
    loginTime: new Date(nowMs - 14.2 * dMs).toISOString(),
    logoutTime: new Date(nowMs - 14.15 * dMs).toISOString(),
    sessionDurationMinutes: 19,
    screensVisited: ["Dashboard", "Kundli Match"],
    visitedPaymentScreen: false,
    viewedPlan: null,
    engagementScore: "LOW",
    status: "LOGGED_OUT",
  },
  {
    id: "sess_18",
    userId: "u_118",
    name: "Sanjay Asrani",
    memberId: "SM-6672",
    phone: "+91 98223 99887",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    platform: "MOBILE_APP",
    deviceInfo: "Android 13 (Realme GT)",
    loginTime: new Date(nowMs - 21.0 * dMs).toISOString(),
    logoutTime: new Date(nowMs - 20.95 * dMs).toISOString(),
    sessionDurationMinutes: 52,
    screensVisited: ["Home Feed", "Matches", "Pricing Plans", "Payment Screen"],
    visitedPaymentScreen: true,
    viewedPlan: "Sindhi Diamond VIP (12 Months)",
    engagementScore: "HIGH",
    status: "LOGGED_OUT",
  },
  {
    id: "sess_19",
    userId: "u_119",
    name: "Sapna Mirchandani",
    memberId: "SM-6780",
    phone: "+91 98450 33221",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150",
    platform: "WEB_PANEL",
    deviceInfo: "Chrome on macOS",
    loginTime: new Date(nowMs - 26.5 * dMs).toISOString(),
    logoutTime: new Date(nowMs - 26.45 * dMs).toISOString(),
    sessionDurationMinutes: 30,
    screensVisited: ["Dashboard", "Browse", "Upgrade Plans"],
    visitedPaymentScreen: true,
    viewedPlan: "Royal Sindhi Platinum (6 Months)",
    engagementScore: "HIGH",
    status: "LOGGED_OUT",
  },
];

export const getUserAnalyticsSessions = asyncHandler(async (req, res) => {
  const { platform, status, search, timeframe = "TODAY" } = req.query;
  const now = Date.now();
  const ONE_DAY = 24 * 60 * 60 * 1000;

  // 1. Timeframe filtering
  let cutoff = now - ONE_DAY;
  if (timeframe === "7D") {
    cutoff = now - 7 * ONE_DAY;
  } else if (timeframe === "30D") {
    cutoff = now - 30 * ONE_DAY;
  }

  // Active pool filtered by selected timeframe
  const timeframeList = inMemoryUserSessions.filter(
    (s) => new Date(s.loginTime).getTime() >= cutoff
  );

  // 2. Sub-filters for table
  let filtered = [...timeframeList];
  if (platform && platform !== "ALL") {
    filtered = filtered.filter((s) => s.platform === platform);
  }
  if (status && status !== "ALL") {
    if (status === "PAYMENT_VISITED") {
      filtered = filtered.filter((s) => s.visitedPaymentScreen);
    } else {
      filtered = filtered.filter((s) => s.status === status);
    }
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.memberId.toLowerCase().includes(q) ||
        s.phone.includes(q) ||
        (s.viewedPlan && s.viewedPlan.toLowerCase().includes(q))
    );
  }

  // 3. Dynamic Summary Stats computed from timeframeList
  const activeUsersToday = timeframeList.filter((s) => s.status === "ACTIVE_NOW").length;
  const paymentVisitsToday = timeframeList.filter((s) => s.visitedPaymentScreen).length;
  const mobileCount = timeframeList.filter((s) => s.platform === "MOBILE_APP").length;
  const webCount = timeframeList.filter((s) => s.platform === "WEB_PANEL").length;
  const totalDuration = timeframeList.reduce((acc, s) => acc + (s.sessionDurationMinutes || 0), 0);
  const avgEngagementMinutes = timeframeList.length > 0 ? Math.round(totalDuration / timeframeList.length) : 0;

  // 4. Dynamic Activity Trend Graph according to timeframe
  let hourlyActivity = [];
  let chartTitle = "Today's Hourly User Engagement & Traffic Spikes";

  if (timeframe === "TODAY") {
    chartTitle = "Today's Hourly User Engagement & Traffic Spikes";
    const hourSlots = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"];
    hourlyActivity = hourSlots.map((h) => {
      const targetH = parseInt(h.split(":")[0], 10);
      const matches = timeframeList.filter((s) => {
        const d = new Date(s.loginTime);
        const sH = d.getHours();
        return sH >= targetH - 1 && sH <= targetH + 1;
      });
      return {
        hour: h,
        logins: matches.length,
        logouts: matches.filter((s) => s.status === "LOGGED_OUT").length,
        paymentVisits: matches.filter((s) => s.visitedPaymentScreen).length,
      };
    });
  } else if (timeframe === "7D") {
    chartTitle = "Last 7 Days Daily User Engagement & Trend";
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now - i * ONE_DAY);
      const dayName = days[d.getDay()];
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
      const dayEnd = dayStart + ONE_DAY;
      const matches = timeframeList.filter((s) => {
        const t = new Date(s.loginTime).getTime();
        return t >= dayStart && t < dayEnd;
      });
      hourlyActivity.push({
        hour: dayName,
        logins: matches.length,
        logouts: matches.filter((s) => s.status === "LOGGED_OUT").length,
        paymentVisits: matches.filter((s) => s.visitedPaymentScreen).length,
      });
    }
  } else {
    chartTitle = "Last 30 Days Weekly User Traffic & Spikes";
    const weekLabels = ["Week 1", "Week 2", "Week 3", "Week 4"];
    for (let w = 3; w >= 0; w--) {
      const wStart = now - (w + 1) * 7.5 * ONE_DAY;
      const wEnd = now - w * 7.5 * ONE_DAY;
      const matches = timeframeList.filter((s) => {
        const t = new Date(s.loginTime).getTime();
        return t >= wStart && t < wEnd;
      });
      hourlyActivity.push({
        hour: weekLabels[3 - w],
        logins: matches.length,
        logouts: matches.filter((s) => s.status === "LOGGED_OUT").length,
        paymentVisits: matches.filter((s) => s.visitedPaymentScreen).length,
      });
    }
  }

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "User analytics sessions retrieved successfully.",
    {
      timeframe,
      sessions: filtered,
      totalCount: filtered.length,
      summary: {
        totalLoginsToday: timeframeList.length,
        totalLogoutsToday: timeframeList.filter((s) => s.status === "LOGGED_OUT").length,
        activeUsersToday,
        paymentScreenVisitsToday: paymentVisitsToday,
        avgEngagementMinutes,
        mobileCount,
        webCount,
        chartTitle,
        hourlyActivity,
      },
    },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

export const recordUserSessionEvent = asyncHandler(async (req, res) => {
  const { userId, name, memberId, phone, platform = "MOBILE_APP", deviceInfo = "Mobile Device", eventType = "LOGIN", screen } = req.body || {};

  const existing = inMemoryUserSessions.find((s) => s.userId === userId && s.status === "ACTIVE_NOW");
  if (eventType === "LOGOUT" && existing) {
    existing.logoutTime = new Date().toISOString();
    existing.status = "LOGGED_OUT";
    return apiHTTPResponse(req, res, CONSTANTS.HTTP_OK, "Session logout recorded.", { session: existing }, CONSTANTS.OK, CONSTANTS.ERROR_FALSE);
  }

  const newSession = {
    id: `sess_${Date.now()}`,
    userId: userId || "u_guest",
    name: name || "Member",
    memberId: memberId || "SM-" + Math.floor(1000 + Math.random() * 9000),
    phone: phone || "",
    platform,
    deviceInfo,
    loginTime: new Date().toISOString(),
    logoutTime: null,
    sessionDurationMinutes: 1,
    screensVisited: screen ? [screen] : ["Home Feed"],
    visitedPaymentScreen: screen === "PAYMENT_UPGRADE",
    engagementScore: "MEDIUM",
    status: "ACTIVE_NOW",
  };

  inMemoryUserSessions.unshift(newSession);

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_CREATED,
    "User session event recorded successfully.",
    { session: newSession },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

export default {
  getMembersList,
  getMemberDetail,
  createMember,
  bulkAddMember,
  updateMember,
  updateMemberStatus,
  verifyMember,
  getLeadsList,
  getLeadSavedViews,
  getLeadDetail,
  updateLeadStatus,
  addLeadNote,
  setLeadFollowUp,
  bulkAssignLeads,
  getDashboardStats,
  getDashboardActionQueues,
  getDashboardChartsOverview,
  getDashboardCharts,
  getTopAgents,
  getRecentLeads,
  getTodaysFollowups,
  getPendingVerifications,
  approveVerification,
  rejectVerification,
  getEmployeesList,
  getEmployeeDetail,
  updateEmployeePermissions,
  getFinanceSummary,
  getTransactionsList,
  getPlansList,
  getUserAnalyticsSessions,
  recordUserSessionEvent,
};
