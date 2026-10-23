import express from "express";
import {
  getMembersList,
  getMemberDetail,
  createMember,
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
} from "../../controllers/admin/adminDataController.js";

const router = express.Router();

// 1. Dashboard & Analytics
router.get("/dashboard/stats", getDashboardStats);
router.get("/dashboard/action-queues", getDashboardActionQueues);
router.get("/dashboard/charts", getDashboardChartsOverview);
router.get("/dashboard/charts/:type", getDashboardCharts);
router.get("/dashboard/top-agents", getTopAgents);
router.get("/dashboard/recent-leads", getRecentLeads);
router.get("/dashboard/todays-followups", getTodaysFollowups);

// 2. Members Management
import { generateMemberBiodata } from "../../controllers/members/biodataController.js";
router.get("/members", getMembersList);
router.post("/members", createMember);
router.get("/members/:id", getMemberDetail);
router.put("/members/:id", updateMember);
router.put("/members/:id/status", updateMemberStatus);
router.post("/members/:id/verify", verifyMember);
router.post("/members/:id/generate-biodata", generateMemberBiodata);
router.get("/members/:id/generate-biodata", generateMemberBiodata);



// 3. CRM & Leads
import { createAdminLead, exportLeadsCSV } from "../../controllers/leads/adminLeadsExtendedController.js";
router.get("/leads/saved-views", getLeadSavedViews);
router.get("/leads/export", exportLeadsCSV);
router.get("/leads", getLeadsList);
router.post("/leads", createAdminLead);
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
import { createStaffEmployee, updateStaffEmployeeStatus } from "../../controllers/employees/adminEmployeeExtendedController.js";
router.get("/employees", getEmployeesList);
router.post("/employees", createStaffEmployee);
router.get("/employees/:id", getEmployeeDetail);
router.put("/employees/:id/permissions", updateEmployeePermissions);
router.put("/employees/:id/status", updateStaffEmployeeStatus);

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

import {
  getAdminSuccessStories,
  createAdminSuccessStory,
  updateAdminSuccessStory,
  deleteAdminSuccessStory,
} from "../../controllers/stories/successStoryController.js";

// 7. Reviews Moderation Desk
router.get("/reviews", getAdminReviews);
router.put("/reviews/:id", updateAdminReview);
router.post("/reviews/:id/moderation", moderateReviewStatus);
router.delete("/reviews/:id", deleteAdminReview);

// 8. Success Stories Registry & Moderation
router.get("/success-stories", getAdminSuccessStories);
router.post("/success-stories", createAdminSuccessStory);
router.put("/success-stories/:id", updateAdminSuccessStory);
router.delete("/success-stories/:id", deleteAdminSuccessStory);

import {
  getAdminNotifications,
  getAdminUnreadNotificationCount,
  markAdminNotificationRead,
  broadcastAdminNotification,
  getAdminNotificationLogs,
  deleteAdminNotification,
} from "../../controllers/admin/adminNotificationController.js";

// 9. Admin Operational Alerts & Push Broadcasts (/notifications & /notification)
router.get("/notifications", getAdminNotifications);
router.get("/notification", getAdminNotifications);
router.get("/notifications/unread-count", getAdminUnreadNotificationCount);
router.get("/notification/unread-count", getAdminUnreadNotificationCount);
router.get("/notifications/logs", getAdminNotificationLogs);
router.get("/notification/logs", getAdminNotificationLogs);
router.post("/notifications/broadcast", broadcastAdminNotification);
router.post("/notification/broadcast", broadcastAdminNotification);
router.post("/notifications", broadcastAdminNotification);
router.post("/notification", broadcastAdminNotification);
router.put("/notifications/mark-read", markAdminNotificationRead);
router.put("/notifications/:id/read", markAdminNotificationRead);
router.put("/notification/mark-read", markAdminNotificationRead);
router.put("/notification/:id/read", markAdminNotificationRead);
router.delete("/notifications/:id", deleteAdminNotification);
router.delete("/notification/:id", deleteAdminNotification);

import {
  getAdminCampaigns,
  createAdminCampaign,
  getAdminCampaignDetail,
  updateAdminCampaign,
  launchAdminCampaign,
  pauseAdminCampaign,
  getAdminCampaignPopups,
  createAdminCampaignPopup,
  getAdminCampaignAnalytics,
  deleteAdminCampaign,
  getAdminAds,
  createAdminAd,
  getAdminAdDetail,
  updateAdminAd,
  updateAdminAdStatus,
  deleteAdminAd,
} from "../../controllers/campaigns/index.js";

// 10. Marketing & Campaigns (/campaigns & /campaigns/popups)
router.get("/campaigns", getAdminCampaigns);
router.post("/campaigns", createAdminCampaign);
router.get("/campaigns/popups", getAdminCampaignPopups);
router.post("/campaigns/popups", createAdminCampaignPopup);
router.get("/campaigns/:id", getAdminCampaignDetail);
router.put("/campaigns/:id", updateAdminCampaign);
router.post("/campaigns/:id/launch", launchAdminCampaign);
router.post("/campaigns/:id/pause", pauseAdminCampaign);
router.get("/campaigns/:id/analytics", getAdminCampaignAnalytics);
router.delete("/campaigns/:id", deleteAdminCampaign);

// 10b. Advertisements & Partner Deals Management (/ads)
router.get("/ads", getAdminAds);
router.post("/ads", createAdminAd);
router.get("/ads/:id", getAdminAdDetail);
router.put("/ads/:id", updateAdminAd);
router.patch("/ads/:id/status", updateAdminAdStatus);
router.delete("/ads/:id", deleteAdminAd);

import {
  getAdminPlans,
  createAdminPlan,
  updateAdminPlan,
  adminChangePassword,
  getSystemConfig,
  updateSystemConfig,
  getAdminSubcastes,
  createAdminSubcaste,
  updateAdminSubcaste,
  getAdminGotras,
  createAdminGotra,
  updateAdminGotra,
  getMasterSettings,
  updateMasterSettings,
} from "../../controllers/admin/adminSettingsController.js";

// 11. Subscription Plans Management (/plans)
router.post("/plans", createAdminPlan);
router.put("/plans/:id", updateAdminPlan);
router.put("/plans", updateAdminPlan);

// 12. Staff Change Password (/auth/change-password)
router.post("/auth/change-password", adminChangePassword);

// 13. System Constants & Config (/settings/config)
router.get("/settings/config", getSystemConfig);
router.put("/settings/config", updateSystemConfig);

// 13b. Global Master Settings & Platform Toggles (/master-settings)
router.get("/master-settings", getMasterSettings);
router.put("/master-settings", updateMasterSettings);


// 14. Master Subcastes Management (/master/subcastes & /master-data/subcastes)
router.get("/master/subcastes", getAdminSubcastes);
router.get("/master-data/subcastes", getAdminSubcastes);
router.post("/master/subcastes", createAdminSubcaste);
router.post("/master-data/subcastes", createAdminSubcaste);
router.put("/master/subcastes/:id", updateAdminSubcaste);
router.put("/master-data/subcastes/:id", updateAdminSubcaste);
router.put("/master/subcastes", updateAdminSubcaste);
router.put("/master-data/subcastes", updateAdminSubcaste);

// 15. Master Gotras Management (/master/gotras & /master-data/gotras)
router.get("/master/gotras", getAdminGotras);
router.get("/master-data/gotras", getAdminGotras);
router.post("/master/gotras", createAdminGotra);
router.post("/master-data/gotras", createAdminGotra);
router.put("/master/gotras/:id", updateAdminGotra);
router.put("/master-data/gotras/:id", updateAdminGotra);
router.put("/master/gotras", updateAdminGotra);
router.put("/master-data/gotras", updateAdminGotra);

import {
  getAdminMatchResponses,
  recordCandidateResponse,
  updateProposalStatus,
} from "../../controllers/matchmaking/adminMatchResponseController.js";

// 16. Match Responses Clearinghouse (/matchmaking/responses & /matchmaking/record-response)
router.get("/matchmaking/responses", getAdminMatchResponses);
router.post("/matchmaking/record-response", recordCandidateResponse);
router.put("/matchmaking/responses/:id/status", updateProposalStatus);

import {
  getSystemHealth,
  clearCache,
  reindexSearch,
  exportBackup,
} from "../../controllers/tools/index.js";

// 17. Admin Diagnostics & Tools (/tools)
router.get("/tools/health", getSystemHealth);
router.post("/tools/cache/clear", clearCache);
router.post("/tools/reindex", reindexSearch);
router.get("/tools/export-backup", exportBackup);

import {
  getStaffConversations,
  getStaffMessages,
  sendStaffMessage,
  markStaffMessagesRead,
} from "../../controllers/chat/adminChatController.js";

// 18. Internal Staff Team Chat (/chat)
router.get("/chat/conversations", getStaffConversations);
router.get("/chat/messages/:partnerId", getStaffMessages);
router.post("/chat/messages", sendStaffMessage);
router.put("/chat/messages/read", markStaffMessagesRead);

import {
  getAssistedProposals,
  sendAssistedProposal,
  previewMatchCriteria,
} from "../../controllers/matchmaking/adminMatchmakingController.js";

// 19. Assisted Matchmaking & Curated Proposals (/matchmaking)
router.get("/matchmaking/proposals", getAssistedProposals);
router.post("/matchmaking/send-proposal", sendAssistedProposal);
router.get("/matchmaking/criteria-preview", previewMatchCriteria);

import {
  getSafetyReports,
  takeSafetyReportAction,
  blockDeviceOrIp,
} from "../../controllers/safety/adminSafetyController.js";

// 20. Safety & Moderation (/safety)
router.get("/safety/reports", getSafetyReports);
router.put("/safety/reports/:id/action", takeSafetyReportAction);
router.post("/safety/block-device", blockDeviceOrIp);

import {
  getStaffTasks,
  createStaffTask,
  updateStaffTask,
} from "../../controllers/tasks/adminTasksController.js";

// 21. Staff Daily Tasks & Reminders (/tasks)
router.get("/tasks", getStaffTasks);
router.post("/tasks", createStaffTask);
router.put("/tasks/:id", updateStaffTask);

import {
  recordOfflinePayment,
  actionRefundRequest,
} from "../../controllers/finance/adminFinanceController.js";

// 22. Finance & Subscriptions (/finance)
router.post("/finance/offline-payment", recordOfflinePayment);
router.post("/finance/refunds/:id/action", actionRefundRequest);

import {
  getSupportTickets,
  resolveSupportTicket,
} from "../../controllers/support/adminSupportController.js";

// 23. Support & Grievance Tickets (/support)
router.get("/support/tickets", getSupportTickets);
router.put("/support/tickets/:id/resolve", resolveSupportTicket);

import {
  getCallLogs,
  logCallOutcome,
  getCallAnalytics,
} from "../../controllers/telephony/adminCallsController.js";

// 24. Telephony & Calling Management (/calls)
router.get("/calls", getCallLogs);
router.post("/calls/log", logCallOutcome);
router.get("/calls/analytics", getCallAnalytics);

export default router;



