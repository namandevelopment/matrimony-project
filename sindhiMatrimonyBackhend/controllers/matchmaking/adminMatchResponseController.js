import { asyncHandler, apiHTTPResponse } from "../../utils/globalFunction.js";
import * as CONSTANTS from "../../utils/constants.js";
import { findProfileByIdInMemory } from "../../services/realDataService.js";

// Allowed pipeline stages
const ALLOWED_STAGES = [
  "ALL",
  "PROPOSED",
  "AWAITING_RESPONSE",
  "ONE_ACCEPTED",
  "MUTUAL_INTEREST",
  "CALL_SCHEDULED",
  "MEETING_FIXED",
  "DROPPED",
  "ALLIANCE_FINALIZED",
];

const ALLOWED_RESPONSES = [
  "ACCEPTED",
  "DECLINED",
  "CONSIDERING",
  "REQUEST_MORE_DETAILS",
  "CALL_BACK_LATER",
  "PENDING",
];

// Pre-seeded Match Proposals Store
let matchResponsesStore = [
  {
    _id: "resp_701",
    proposalId: "MR_701",
    party1: {
      candidateId: "SM10001",
      name: "Kunal Ahuja",
      gender: "MALE",
      age: 29,
      subcaste: "Amil",
      gotra: "Ahuja",
      city: "Pune",
      occupation: "Senior Solutions Architect",
      consent: {
        status: "ACCEPTED",
        feedbackReason: "Profile background, education, and gotra compatibility are excellent.",
        notes: "Spoke with father Shri Mohan Ahuja. Families happy to proceed with in-person meeting.",
        recordedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        recordedBy: "Simran Khatri (Senior Matchmaker)",
      },
    },
    party2: {
      candidateId: "SM10002",
      name: "Simran Vaswani",
      gender: "FEMALE",
      age: 26,
      subcaste: "Bhaiband",
      gotra: "Vaswani",
      city: "Pune",
      occupation: "Investment Analyst",
      consent: {
        status: "ACCEPTED",
        feedbackReason: "Mutual values, living in the same city, non-clashing gotras.",
        notes: "Mother confirmed interest after video discussion. Ready for formal meeting.",
        recordedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        recordedBy: "Simran Khatri (Senior Matchmaker)",
      },
    },
    compatibilityScore: 94,
    stage: "MEETING_FIXED",
    status: "MEETING_FIXED",
    assignedRM: {
      id: "emp_003",
      name: "Simran Khatri",
      role: "Senior Matchmaker",
      phone: "+91 98200 44556",
    },
    meetingDetails: {
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      time: "04:30 PM",
      venue: "Hotel Conrad Lobby Lounge, Pune",
      attendees: "Candidate & Parents from both sides",
      agenda: "Family introduction and formal Kachhi Misri discussion",
    },
    timeline: [
      {
        stage: "PROPOSED",
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        notes: "Proposal dispatched to both families via WhatsApp & App.",
      },
      {
        stage: "MUTUAL_INTEREST",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        notes: "Both candidates verbally accepted after RM telephonic consultation.",
      },
      {
        stage: "MEETING_FIXED",
        timestamp: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
        notes: "Meeting finalized at Hotel Conrad, Pune.",
      },
    ],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
  },
  {
    _id: "resp_702",
    proposalId: "MR_702",
    party1: {
      candidateId: "SM10003",
      name: "Rahul Makhija",
      gender: "MALE",
      age: 31,
      subcaste: "Bhaiband",
      gotra: "Makhija",
      city: "Mumbai",
      occupation: "Textile Importer & Retailer",
      consent: {
        status: "ACCEPTED",
        feedbackReason: "Looking for a warm, family-oriented Sindhi bride.",
        notes: "Rahul confirmed readiness. Waiting for bride's family response.",
        recordedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
        recordedBy: "Vikram Wadhwa (RM)",
      },
    },
    party2: {
      candidateId: "SM10004",
      name: "Ananya Chawla",
      gender: "FEMALE",
      age: 28,
      subcaste: "Sahiti",
      gotra: "Chawla",
      city: "Mumbai",
      occupation: "Senior HR Specialist",
      consent: {
        status: "PENDING",
        feedbackReason: "",
        notes: "Follow up call scheduled tomorrow at 6 PM.",
        recordedAt: null,
        recordedBy: null,
      },
    },
    compatibilityScore: 88,
    stage: "AWAITING_RESPONSE",
    status: "AWAITING_RESPONSE",
    assignedRM: {
      id: "emp_004",
      name: "Vikram Wadhwa",
      role: "Assisted Service Specialist",
      phone: "+91 98200 66778",
    },
    meetingDetails: null,
    timeline: [
      {
        stage: "PROPOSED",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        notes: "Proposal shared with both candidates.",
      },
      {
        stage: "ONE_ACCEPTED",
        timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
        notes: "Rahul accepted proposal. Awaiting Ananya's feedback.",
      },
    ],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  },
  {
    _id: "resp_703",
    proposalId: "MR_703",
    party1: {
      candidateId: "SM10005",
      name: "Vivek Hingorani",
      gender: "MALE",
      age: 30,
      subcaste: "Amil",
      gotra: "Hingorani",
      city: "Jaipur",
      occupation: "Chartered Accountant",
      consent: {
        status: "ACCEPTED",
        feedbackReason: "Very keen on settling down with cultured partner.",
        notes: "Parental consent verified.",
        recordedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
        recordedBy: "Simran Khatri (Senior Matchmaker)",
      },
    },
    party2: {
      candidateId: "SM10006",
      name: "Diya Mirchandani",
      gender: "FEMALE",
      age: 27,
      subcaste: "Amil",
      gotra: "Mirchandani",
      city: "Jaipur",
      occupation: "Commercial Interior Designer",
      consent: {
        status: "ACCEPTED",
        feedbackReason: "Both families are based in Jaipur, gotras match well.",
        notes: "Diya's father requested initial 3-way conference call.",
        recordedAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
        recordedBy: "Simran Khatri (Senior Matchmaker)",
      },
    },
    compatibilityScore: 91,
    stage: "CALL_SCHEDULED",
    status: "CALL_SCHEDULED",
    assignedRM: {
      id: "emp_003",
      name: "Simran Khatri",
      role: "Senior Matchmaker",
      phone: "+91 98200 44556",
    },
    meetingDetails: {
      date: new Date(Date.now() + 24 * 3600 * 1000).toISOString().split("T")[0],
      time: "07:00 PM",
      venue: "Assisted Matchmaker Zoom Conference Call",
      attendees: "Candidate 1, Candidate 2, Both Parents, RM Facilitator",
      agenda: "First mutual interaction and horoscope discussion",
    },
    timeline: [
      {
        stage: "PROPOSED",
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        notes: "Proposal initiated.",
      },
      {
        stage: "CALL_SCHEDULED",
        timestamp: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
        notes: "Mutual consent received. Conference call booked.",
      },
    ],
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
  },
  {
    _id: "resp_704",
    proposalId: "MR_704",
    party1: {
      candidateId: "SM10007",
      name: "Rohan Advani",
      gender: "MALE",
      age: 28,
      subcaste: "Amil",
      gotra: "Advani",
      city: "Dubai",
      occupation: "Investment Banker",
      consent: {
        status: "DECLINED",
        feedbackReason: "Candidate requires partner who is already based in UAE or immediately willing to relocate.",
        notes: "Rohan expressed that distance relocation could be an issue.",
        recordedAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
        recordedBy: "Vikram Wadhwa (RM)",
      },
    },
    party2: {
      candidateId: "SM10008",
      name: "Geeta Chhabria",
      gender: "FEMALE",
      age: 26,
      subcaste: "Amil",
      gotra: "Chhabria",
      city: "Jaipur",
      occupation: "Senior Software Engineer",
      consent: {
        status: "CONSIDERING",
        feedbackReason: "",
        notes: "Was evaluating relocation to Middle East.",
        recordedAt: new Date(Date.now() - 6 * 24 * 3600 * 1000).toISOString(),
        recordedBy: "Vikram Wadhwa (RM)",
      },
    },
    compatibilityScore: 76,
    stage: "DROPPED",
    status: "DROPPED",
    dropReason: "Relocation criteria mismatch between Dubai and Jaipur.",
    assignedRM: {
      id: "emp_004",
      name: "Vikram Wadhwa",
      role: "Assisted Service Specialist",
      phone: "+91 98200 66778",
    },
    meetingDetails: null,
    timeline: [
      {
        stage: "PROPOSED",
        timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        notes: "Proposal dispatched.",
      },
      {
        stage: "DROPPED",
        timestamp: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
        notes: "Case closed due to relocation preferences.",
      },
    ],
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
  },
];

/**
 * 1. GET /api/v1/admin/matchmaking/responses
 * Mutual responses & feedback clearinghouse directory
 */
export const getAdminMatchResponses = asyncHandler(async (req, res) => {
  const {
    stage = "ALL",
    status = "ALL",
    search,
    q,
    rmId,
    page = 1,
    limit = 20,
  } = req.query;

  const filterStage = (status !== "ALL" ? status : stage).toUpperCase();
  if (filterStage !== "ALL" && !ALLOWED_STAGES.includes(filterStage)) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      `Invalid stage/status '${filterStage}'. Allowed options: ${ALLOWED_STAGES.join(", ")}`,
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  let filtered = [...matchResponsesStore];

  if (filterStage !== "ALL") {
    filtered = filtered.filter(
      (r) => r.stage.toUpperCase() === filterStage || r.status.toUpperCase() === filterStage
    );
  }

  if (rmId) {
    filtered = filtered.filter((r) => r.assignedRM?.id === rmId || r.assignedRM?.name?.toLowerCase().includes(rmId.toLowerCase()));
  }

  const querySearch = (search || q || "").toString().trim().toLowerCase();
  if (querySearch) {
    filtered = filtered.filter(
      (r) =>
        r.proposalId.toLowerCase().includes(querySearch) ||
        r.party1.name.toLowerCase().includes(querySearch) ||
        r.party1.candidateId.toLowerCase().includes(querySearch) ||
        r.party2.name.toLowerCase().includes(querySearch) ||
        r.party2.candidateId.toLowerCase().includes(querySearch) ||
        (r.assignedRM?.name && r.assignedRM.name.toLowerCase().includes(querySearch))
    );
  }

  // Sorting: newest updated first
  filtered.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  // Pagination
  const parsedPage = Math.max(1, parseInt(page, 10) || 1);
  const parsedLimit = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
  const total = filtered.length;
  const totalPages = Math.ceil(total / parsedLimit) || 1;
  const startIndex = (parsedPage - 1) * parsedLimit;
  const paginatedResponses = filtered.slice(startIndex, startIndex + parsedLimit);

  // Clearinghouse KPI summary
  const totalProposals = matchResponsesStore.length;
  const meetingFixedCount = matchResponsesStore.filter((r) => r.stage === "MEETING_FIXED").length;
  const mutualInterestCount = matchResponsesStore.filter((r) => r.stage === "MUTUAL_INTEREST" || r.stage === "MEETING_FIXED" || r.stage === "CALL_SCHEDULED").length;
  const awaitingCount = matchResponsesStore.filter((r) => r.stage === "AWAITING_RESPONSE" || r.stage === "PROPOSED").length;
  const droppedCount = matchResponsesStore.filter((r) => r.stage === "DROPPED").length;
  const conversionRate = totalProposals > 0 ? `${((meetingFixedCount / totalProposals) * 100).toFixed(1)}%` : "0.0%";

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Matchmaking responses clearinghouse retrieved successfully.",
    {
      responses: paginatedResponses,
      pagination: {
        total,
        page: parsedPage,
        limit: parsedLimit,
        totalPages,
        hasNextPage: parsedPage < totalPages,
        hasPrevPage: parsedPage > 1,
      },
      kpiSummary: {
        totalProposals,
        mutualInterestCount,
        awaitingCount,
        meetingFixedCount,
        droppedCount,
        conversionRate,
      },
    },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 2. POST /api/v1/admin/matchmaking/record-response
 * Staff recording candidate phone consent & telephonic feedback
 */
export const recordCandidateResponse = asyncHandler(async (req, res) => {
  const {
    proposalId,
    candidateId,
    response,
    feedbackReason = "",
    phoneNotes = "",
    nextFollowUp,
    recordedBy,
  } = req.body;

  // Validation: Proposal ID
  if (!proposalId) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "Validation Failed: 'proposalId' is required.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  // Find proposal in store
  const proposalIndex = matchResponsesStore.findIndex(
    (r) =>
      r._id === proposalId ||
      r.proposalId === proposalId ||
      r.proposalId.toLowerCase() === proposalId.toLowerCase()
  );

  if (proposalIndex === -1) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_NOT_FOUND,
      `Match proposal with ID '${proposalId}' not found.`,
      CONSTANTS.DATA_NULL,
      CONSTANTS.NOT_FOUND,
      CONSTANTS.ERROR_TRUE
    );
  }

  const proposal = matchResponsesStore[proposalIndex];

  // Validation: Candidate ID
  if (!candidateId) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "Validation Failed: 'candidateId' is required to attribute who gave the feedback.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  // Determine which party is responding
  const cleanCandId = candidateId.trim().toLowerCase();
  let partySlot = null;
  if (
    proposal.party1.candidateId.toLowerCase() === cleanCandId ||
    proposal.party1.name.toLowerCase().includes(cleanCandId)
  ) {
    partySlot = "party1";
  } else if (
    proposal.party2.candidateId.toLowerCase() === cleanCandId ||
    proposal.party2.name.toLowerCase().includes(cleanCandId)
  ) {
    partySlot = "party2";
  }

  if (!partySlot) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      `Validation Failed: Candidate '${candidateId}' is not a party in proposal '${proposal.proposalId}'.`,
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  // Validation: Response Enum
  const upperResponse = (response || "").toString().toUpperCase();
  if (!ALLOWED_RESPONSES.includes(upperResponse)) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      `Validation Failed: Invalid response '${response}'. Allowed options: ${ALLOWED_RESPONSES.join(", ")}`,
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  const staffName = recordedBy || req.user?.name || proposal.assignedRM?.name || "Staff Matchmaker";

  // Record consent into party slot
  proposal[partySlot].consent = {
    status: upperResponse,
    feedbackReason: feedbackReason.trim(),
    notes: phoneNotes.trim(),
    recordedAt: new Date().toISOString(),
    recordedBy: staffName,
  };

  // Determine stage progression
  const otherSlot = partySlot === "party1" ? "party2" : "party1";
  const otherConsentStatus = proposal[otherSlot].consent?.status;

  if (upperResponse === "DECLINED") {
    proposal.stage = "DROPPED";
    proposal.status = "DROPPED";
    proposal.dropReason = feedbackReason || `Candidate ${proposal[partySlot].name} declined.`;
    proposal.timeline.push({
      stage: "DROPPED",
      timestamp: new Date().toISOString(),
      notes: `Proposal declined by ${proposal[partySlot].name}: ${feedbackReason || "No specific reason provided."}`,
    });
  } else if (upperResponse === "ACCEPTED") {
    if (otherConsentStatus === "ACCEPTED") {
      proposal.stage = "MUTUAL_INTEREST";
      proposal.status = "MUTUAL_INTEREST";
      proposal.timeline.push({
        stage: "MUTUAL_INTEREST",
        timestamp: new Date().toISOString(),
        notes: `Both candidates have now accepted! Proposal ready for call scheduling or in-person meet.`,
      });
    } else {
      proposal.stage = "ONE_ACCEPTED";
      proposal.status = "ONE_ACCEPTED";
      proposal.timeline.push({
        stage: "ONE_ACCEPTED",
        timestamp: new Date().toISOString(),
        notes: `${proposal[partySlot].name} accepted. Awaiting response from ${proposal[otherSlot].name}.`,
      });
    }
  } else {
    // CONSIDERING, REQUEST_MORE_DETAILS, CALL_BACK_LATER
    proposal.timeline.push({
      stage: proposal.stage,
      timestamp: new Date().toISOString(),
      notes: `${proposal[partySlot].name} status updated to ${upperResponse}. Notes: ${phoneNotes || feedbackReason}`,
    });
  }

  proposal.updatedAt = new Date().toISOString();
  matchResponsesStore[proposalIndex] = proposal;

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    `Candidate ${proposal[partySlot].name} response '${upperResponse}' recorded successfully. Stage is now '${proposal.stage}'.`,
    {
      proposalId: proposal.proposalId,
      respondingParty: proposal[partySlot].name,
      response: upperResponse,
      currentStage: proposal.stage,
      party1Status: proposal.party1.consent.status,
      party2Status: proposal.party2.consent.status,
      updatedAt: proposal.updatedAt,
    },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 3. PUT /api/v1/admin/matchmaking/responses/:id/status
 * Advance proposal stage (Meet fixed, dropped, call scheduled)
 */
export const updateProposalStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, stage, notes = "", meetingDetails, dropReason } = req.body;

  const targetStage = (status || stage || "").toString().toUpperCase();

  if (!targetStage || !ALLOWED_STAGES.includes(targetStage) || targetStage === "ALL") {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      `Validation Failed: Valid 'stage' or 'status' is required. Allowed options: ${ALLOWED_STAGES.filter(
        (s) => s !== "ALL"
      ).join(", ")}`,
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  const proposalIndex = matchResponsesStore.findIndex(
    (r) =>
      r._id === id ||
      r.proposalId === id ||
      r.proposalId.toLowerCase() === id.toLowerCase()
  );

  if (proposalIndex === -1) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_NOT_FOUND,
      `Match proposal with ID '${id}' not found.`,
      CONSTANTS.DATA_NULL,
      CONSTANTS.NOT_FOUND,
      CONSTANTS.ERROR_TRUE
    );
  }

  const proposal = matchResponsesStore[proposalIndex];
  proposal.stage = targetStage;
  proposal.status = targetStage;

  if (targetStage === "MEETING_FIXED" && meetingDetails && typeof meetingDetails === "object") {
    proposal.meetingDetails = {
      date: meetingDetails.date || new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString().split("T")[0],
      time: meetingDetails.time || "05:00 PM",
      venue: meetingDetails.venue || "Formal Family Meeting Venue",
      attendees: meetingDetails.attendees || "Both Families & RM Facilitator",
      agenda: meetingDetails.agenda || "Kachhi Misri and Alliance Formalization",
    };
  }

  if (targetStage === "DROPPED") {
    proposal.dropReason = dropReason || notes || "Dropped by RM desk.";
  }

  proposal.timeline.push({
    stage: targetStage,
    timestamp: new Date().toISOString(),
    notes: notes || `Stage advanced to ${targetStage} by staff.`,
  });

  proposal.updatedAt = new Date().toISOString();
  matchResponsesStore[proposalIndex] = proposal;

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    `Proposal '${proposal.proposalId}' stage successfully updated to '${targetStage}'.`,
    proposal,
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});
