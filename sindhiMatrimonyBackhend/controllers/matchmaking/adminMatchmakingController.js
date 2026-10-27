import { asyncHandler, apiHTTPResponse } from "../../utils/globalFunction.js";
import * as CONSTANTS from "../../utils/constants.js";
import { findProfileByIdInMemory, SEED_CANDIDATE_POOL } from "../../services/realDataService.js";

// Store for assisted match proposals
let assistedProposalsStore = [
  {
    _id: "prop_801",
    proposalId: "AP-801",
    candidate1: {
      profileId: "SM10001",
      name: "Kunal Ahuja",
      gender: "MALE",
      age: 29,
      subcaste: "Amil",
      city: "Pune",
      occupation: "Senior Solutions Architect",
    },
    candidate2: {
      profileId: "SM10002",
      name: "Simran Chandnani",
      gender: "FEMALE",
      age: 26,
      subcaste: "Amil",
      city: "Mumbai",
      occupation: "Chartered Accountant",
    },
    matchScore: 92,
    compatibilityFactors: {
      subcasteMatch: "SAME_SUBCASTE_HIGH",
      ageDifferenceYears: 3,
      cityProximity: "SAME_REGION",
      educationScore: "COMPATIBLE",
    },
    status: "PROPOSED",
    curatedBy: "Pooja Advani",
    deliveryChannel: "WHATSAPP",
    notes: "Both families from respected Amil background looking for well-settled professionals.",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    _id: "prop_802",
    proposalId: "AP-802",
    candidate1: {
      profileId: "SM10003",
      name: "Rohan Advani",
      gender: "MALE",
      age: 31,
      subcaste: "Bhaiband",
      city: "Ahmedabad",
      occupation: "Business Owner",
    },
    candidate2: {
      profileId: "SM10004",
      name: "Ananya Wadhwa",
      gender: "FEMALE",
      age: 27,
      subcaste: "Bhaiband",
      city: "Vadodara",
      occupation: "Fashion Merchandiser",
    },
    matchScore: 88,
    compatibilityFactors: {
      subcasteMatch: "SAME_SUBCASTE_HIGH",
      ageDifferenceYears: 4,
      cityProximity: "GUJARAT_CORRIDOR",
      educationScore: "COMPATIBLE",
    },
    status: "ACCEPTED",
    curatedBy: "Rajesh Vazirani",
    deliveryChannel: "IN_APP",
    notes: "Mutual interest expressed. Proceeding to family telephone conference.",
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
];

/**
 * 1. GET /api/v1/admin/matchmaking/proposals
 * Assisted proposals queue
 */
export const getAssistedProposals = asyncHandler(async (req, res) => {
  const { status = "ALL", search = "" } = req.query;

  let filtered = [...assistedProposalsStore];

  if (status && status !== "ALL") {
    filtered = filtered.filter((p) => p.status === status.toUpperCase());
  }

  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.proposalId?.toLowerCase().includes(s) ||
        p.candidate1?.name?.toLowerCase().includes(s) ||
        p.candidate2?.name?.toLowerCase().includes(s) ||
        p.candidate1?.profileId?.toLowerCase().includes(s) ||
        p.candidate2?.profileId?.toLowerCase().includes(s)
    );
  }

  const page = Math.max(1, parseInt(req.query?.pageNo || req.query?.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query?.pageSize || req.query?.limit, 10) || 20));

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const startIdx = (page - 1) * limit;
  const paginatedProposals = filtered.slice(startIdx, startIdx + limit);

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Assisted proposals queue retrieved successfully.",
    {
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
      proposals: paginatedProposals,
      list: paginatedProposals,
    },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 2. POST /api/v1/admin/matchmaking/send-proposal
 * Send curated match proposal between 2 members
 */
export const sendAssistedProposal = asyncHandler(async (req, res) => {
  const {
    candidate1Id,
    candidate2Id,
    notes = "",
    deliveryChannel = "WHATSAPP",
    priority = "HIGH",
  } = req.body;

  if (!candidate1Id || !candidate2Id) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "Validation Failed: Both 'candidate1Id' and 'candidate2Id' are required.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  if (candidate1Id === candidate2Id) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "Validation Failed: Candidate 1 and Candidate 2 cannot be the same profile.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  const p1 = findProfileByIdInMemory(candidate1Id) ||
    SEED_CANDIDATE_POOL.find((c) => c._id === candidate1Id || c.candidateId === candidate1Id);
  const p2 = findProfileByIdInMemory(candidate2Id) ||
    SEED_CANDIDATE_POOL.find((c) => c._id === candidate2Id || c.candidateId === candidate2Id);

  if (!p1 || !p2) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_NOT_FOUND,
      `Validation Failed: One or both candidate profiles could not be found (${!p1 ? candidate1Id : candidate2Id}).`,
      CONSTANTS.DATA_NULL,
      CONSTANTS.NOT_FOUND,
      CONSTANTS.ERROR_TRUE
    );
  }

  // Calculate compatibility score
  let score = 70;
  const sameSubcaste = p1.subcaste && p2.subcaste && p1.subcaste.toLowerCase() === p2.subcaste.toLowerCase();
  if (sameSubcaste) score += 15;

  const ageDiff = Math.abs((p1.age || 28) - (p2.age || 26));
  if (ageDiff <= 4) score += 10;

  const sameCity = p1.location?.city?.toLowerCase() === p2.location?.city?.toLowerCase();
  if (sameCity) score += 5;

  const proposalId = `AP-${800 + assistedProposalsStore.length + 1}`;
  const now = new Date().toISOString();

  const newProposal = {
    _id: `prop_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    proposalId,
    candidate1: {
      profileId: p1.candidateId || p1._id,
      name: p1.name,
      gender: p1.gender,
      age: p1.age,
      subcaste: p1.subcaste,
      city: p1.location?.city || "Jaipur",
      occupation: p1.career?.occupation || "Professional",
    },
    candidate2: {
      profileId: p2.candidateId || p2._id,
      name: p2.name,
      gender: p2.gender,
      age: p2.age,
      subcaste: p2.subcaste,
      city: p2.location?.city || "Mumbai",
      occupation: p2.career?.occupation || "Professional",
    },
    matchScore: Math.min(score, 98),
    compatibilityFactors: {
      subcasteMatch: sameSubcaste ? "SAME_SUBCASTE_HIGH" : "CROSS_SUBCASTE_ACCEPTABLE",
      ageDifferenceYears: ageDiff,
      cityProximity: sameCity ? "SAME_CITY" : "INTER_CITY",
      educationScore: "COMPATIBLE",
    },
    status: "PROPOSED",
    curatedBy: req.user?.name || "Senior Matchmaker",
    deliveryChannel: deliveryChannel.toUpperCase(),
    notes: notes.trim(),
    createdAt: now,
    updatedAt: now,
  };

  assistedProposalsStore.unshift(newProposal);

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_CREATED,
    `Curated proposal ${newProposal.proposalId} dispatched between ${p1.name} and ${p2.name} via ${deliveryChannel}.`,
    newProposal,
    CONSTANTS.CREATED,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 3. GET /api/v1/admin/matchmaking/criteria-preview
 * Live match scoring between 2 candidate IDs
 */
export const previewMatchCriteria = asyncHandler(async (req, res) => {
  const { id1, id2 } = req.query;

  if (!id1 || !id2) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "Validation Failed: Both 'id1' and 'id2' query parameters are required.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  const p1 = findProfileByIdInMemory(id1) ||
    SEED_CANDIDATE_POOL.find((c) => c._id === id1 || c.candidateId === id1) ||
    SEED_CANDIDATE_POOL[0];
  const p2 = findProfileByIdInMemory(id2) ||
    SEED_CANDIDATE_POOL.find((c) => c._id === id2 || c.candidateId === id2) ||
    SEED_CANDIDATE_POOL[1];

  const sameSubcaste = p1.subcaste && p2.subcaste && p1.subcaste.toLowerCase() === p2.subcaste.toLowerCase();
  const ageDiff = Math.abs((p1.age || 29) - (p2.age || 26));
  const sameCity = (p1.location?.city || "").toLowerCase() === (p2.location?.city || "").toLowerCase();

  let totalScore = 65;
  if (sameSubcaste) totalScore += 18;
  if (ageDiff <= 3) totalScore += 12;
  else if (ageDiff <= 5) totalScore += 8;
  if (sameCity) totalScore += 5;

  const previewData = {
    candidate1: {
      id: p1.candidateId || p1._id,
      name: p1.name,
      gender: p1.gender,
      age: p1.age,
      subcaste: p1.subcaste,
      gotra: p1.family?.gotra || "Kashyap",
      city: p1.location?.city,
      income: p1.career?.annualIncomeFormatted || "15-20 LPA",
    },
    candidate2: {
      id: p2.candidateId || p2._id,
      name: p2.name,
      gender: p2.gender,
      age: p2.age,
      subcaste: p2.subcaste,
      gotra: p2.family?.gotra || "Vashisht",
      city: p2.location?.city,
      income: p2.career?.annualIncomeFormatted || "12-15 LPA",
    },
    overallScore: Math.min(totalScore, 98),
    scoringVectors: [
      {
        criterion: "Cultural & Subcaste Compatibility",
        score: sameSubcaste ? 95 : 75,
        rating: sameSubcaste ? "EXCELLENT" : "GOOD",
        notes: sameSubcaste ? `Both candidates are Sindhi ${p1.subcaste}` : "Cross-subcaste Sindhi alliance",
      },
      {
        criterion: "Age Difference",
        score: ageDiff <= 3 ? 95 : 80,
        rating: ageDiff <= 3 ? "EXCELLENT" : "COMPATIBLE",
        notes: `Age gap is ${ageDiff} year(s)`,
      },
      {
        criterion: "Geographic Proximity",
        score: sameCity ? 90 : 75,
        rating: sameCity ? "EXCELLENT" : "MANAGEABLE",
        notes: sameCity ? `Both residing in ${p1.location?.city}` : `${p1.location?.city} & ${p2.location?.city}`,
      },
      {
        criterion: "Horoscope & Guna Milan",
        score: 86,
        rating: "HIGH_FAVORABLE",
        notes: "28/36 Gunas matched; Nadi & Bhakoot free of dosha",
      },
    ],
  };

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Live match scoring preview generated successfully.",
    previewData,
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});
