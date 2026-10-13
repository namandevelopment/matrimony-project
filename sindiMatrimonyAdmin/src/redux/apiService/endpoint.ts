export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const ApiURL = {
  // Auth
  adminLogin: `${BASE_URL}/api/v1/auth/admin/login`,
  verifyMfa: `${BASE_URL}/api/v1/auth/admin/verify-mfa`,
  refreshToken: `${BASE_URL}/api/v1/auth/refresh-token`,
  adminLogout: `${BASE_URL}/api/v1/auth/logout`,

  // Dashboard
  dashboardStats: `${BASE_URL}/api/v1/admin/dashboard/stats`,
  dashboardCharts: (type: string) => `${BASE_URL}/api/v1/admin/dashboard/charts/${type}`,

  // Leads & CRM
  getLeads: `${BASE_URL}/api/v1/admin/leads`,
  getLeadDetail: (id: string) => `${BASE_URL}/api/v1/admin/leads/${id}`,
  updateLeadStatus: (id: string) => `${BASE_URL}/api/v1/admin/leads/${id}/status`,
  addLeadNote: (id: string) => `${BASE_URL}/api/v1/admin/leads/${id}/notes`,
  setFollowUp: (id: string) => `${BASE_URL}/api/v1/admin/leads/${id}/follow-up`,
  bulkAssignLeads: `${BASE_URL}/api/v1/admin/leads/bulk-assign`,
  bulkAssignPreview: `${BASE_URL}/api/v1/admin/leads/bulk-assign/preview`,

  // Telephony
  initiateCall: `${BASE_URL}/api/v1/admin/calls/initiate`,
  submitCallDisposition: (callId: string) => `${BASE_URL}/api/v1/admin/calls/${callId}/disposition`,
  getCallReports: `${BASE_URL}/api/v1/admin/calls/reports`,

  // Members
  getMembers: `${BASE_URL}/api/v1/admin/members`,
  getMemberDetail: (id: string) => `${BASE_URL}/api/v1/admin/members/${id}`,
  updateMemberStatus: (id: string) => `${BASE_URL}/api/v1/admin/members/${id}/status`,
  verifyMember: (id: string) => `${BASE_URL}/api/v1/admin/members/${id}/verify`,

  // Verifications
  getPendingVerifications: `${BASE_URL}/api/v1/admin/verifications/pending`,
  approveVerification: (id: string) => `${BASE_URL}/api/v1/admin/verifications/${id}/approve`,
  rejectVerification: (id: string) => `${BASE_URL}/api/v1/admin/verifications/${id}/reject`,

  // Finance & Transactions
  getFinanceSummary: `${BASE_URL}/api/v1/admin/finance/summary`,
  getTransactions: `${BASE_URL}/api/v1/admin/finance/transactions`,
  getPendingRefunds: `${BASE_URL}/api/v1/admin/finance/refunds/pending`,
  approveRefund: (id: string) => `${BASE_URL}/api/v1/admin/finance/refunds/${id}/approve`,
  rejectRefund: (id: string) => `${BASE_URL}/api/v1/admin/finance/refunds/${id}/reject`,

  // Subscriptions & Plans
  getPlans: `${BASE_URL}/api/v1/admin/plans`,
  getSubscriptions: `${BASE_URL}/api/v1/admin/subscriptions`,
  manualEntitlement: `${BASE_URL}/api/v1/admin/subscriptions/manual-entitle`,

  // Campaigns & Ads
  getCampaigns: `${BASE_URL}/api/v1/admin/campaigns`,
  createCampaign: `${BASE_URL}/api/v1/admin/campaigns`,
  pauseCampaign: (id: string) => `${BASE_URL}/api/v1/admin/campaigns/${id}/pause`,

  // Employees & RBAC
  getEmployees: `${BASE_URL}/api/v1/admin/employees`,
  getEmployeeDetail: (id: string) => `${BASE_URL}/api/v1/admin/employees/${id}`,
  updateEmployeePermissions: (id: string) => `${BASE_URL}/api/v1/admin/employees/${id}/permissions`,

  // Audit Logs
  getAuditLogs: `${BASE_URL}/api/v1/admin/audit-logs`,

  // Master Data
  getSubcastes: `${BASE_URL}/api/v1/admin/master-data/subcastes`,
  getGotras: `${BASE_URL}/api/v1/admin/master-data/gotras`,
};
