import express from "express";
import {
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
} from "../../controllers/admin/adminDataController.js";

const router = express.Router();

// 1. Dashboard & Analytics
router.get("/dashboard/stats", getDashboardStats);
router.get("/dashboard/charts/:type", getDashboardCharts);
router.get("/dashboard/top-agents", getTopAgents);
router.get("/dashboard/recent-leads", getRecentLeads);
router.get("/dashboard/todays-followups", getTodaysFollowups);

// 2. Members Management
router.get("/members", getMembersList);
router.get("/members/:id", getMemberDetail);
router.put("/members/:id/status", updateMemberStatus);
router.post("/members/:id/verify", verifyMember);

// 3. CRM & Leads
router.get("/leads/saved-views", getLeadSavedViews);
router.get("/leads", getLeadsList);
router.get("/leads/:id", getLeadDetail);
router.put("/leads/:id/status", updateLeadStatus);
router.post("/leads/:id/notes", addLeadNote);
router.post("/leads/:id/follow-up", setLeadFollowUp);
router.post("/leads/bulk-assign", bulkAssignLeads);

// 4. Verifications Queue
router.get("/verifications/pending", getPendingVerifications);
router.post("/verifications/:id/approve", approveVerification);
router.post("/verifications/:id/reject", rejectVerification);

// 5. Employees & RBAC
router.get("/employees", getEmployeesList);
router.get("/employees/:id", getEmployeeDetail);
router.put("/employees/:id/permissions", updateEmployeePermissions);

import {
  getAdminReviews,
  updateAdminReview,
  moderateReviewStatus,
  deleteAdminReview,
} from "../../controllers/reviews/reviewController.js";

// 6. Finance & Subscriptions
router.get("/finance/summary", getFinanceSummary);
router.get("/finance/transactions", getTransactionsList);
router.get("/plans", getPlansList);

// 7. Reviews Moderation Desk
router.get("/reviews", getAdminReviews);
router.put("/reviews/:id", updateAdminReview);
router.post("/reviews/:id/moderation", moderateReviewStatus);
router.delete("/reviews/:id", deleteAdminReview);

export default router;
