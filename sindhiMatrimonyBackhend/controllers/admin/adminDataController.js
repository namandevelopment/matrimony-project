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
} from "../../services/realDataService.js";

// ============================================================================
// 1. MEMBERS MANAGEMENT
// ============================================================================

export const getMembersList = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    search = "",
    status = "ALL",
    isVerified,
    membershipTier = "ALL",
    gender = "ALL",
    city = "ALL",
    subcaste = "ALL",
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

// ============================================================================
// 2. LEADS & CRM MANAGEMENT
// ============================================================================

export const getLeadsList = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
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
  const pending = IN_MEMORY_VERIFICATIONS.filter((v) => v.status === "PENDING");
  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Pending verifications retrieved.",
    {
      verifications: pending,
      total: pending.length,
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
  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Employees fetched successfully.",
    {
      employees: STAFF_EMPLOYEES,
      pagination: {
        total: STAFF_EMPLOYEES.length,
        page: 1,
        limit: 20,
        totalPages: 1,
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
  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Transaction ledger retrieved.",
    {
      transactions: IN_MEMORY_TRANSACTIONS,
      total: IN_MEMORY_TRANSACTIONS.length,
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

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Plans retrieved successfully.",
    { plans },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

export default {
  getMembersList,
  getMemberDetail,
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
};
