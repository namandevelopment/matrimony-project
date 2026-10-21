const getEnvVar = (key: string): string | undefined => {
  try {
    const metaEnv = (import.meta as any)?.env;
    if (metaEnv && typeof metaEnv === 'object' && metaEnv[key]) {
      return metaEnv[key];
    }
  } catch {}
  try {
    if (typeof process !== 'undefined' && process?.env) {
      return process.env[key];
    }
  } catch {}
  return undefined;
};

export const BASE_URL = getEnvVar('VITE_API_URL') || 'http://localhost:5001';
export const SOCKET_URL = getEnvVar('VITE_SOCKET_URL') || 'http://localhost:5001';

export const ApiURL = {
  // =========================================================================
  // 1. ADMIN AUTH & SESSION
  // =========================================================================
  adminLogin: `${BASE_URL}/api/v1/auth/admin/login`,
  login: `${BASE_URL}/api/v1/auth/admin/login`,
  verifyMfa: `${BASE_URL}/api/v1/auth/admin/verify-mfa`,
  refreshToken: `${BASE_URL}/api/v1/auth/refresh-token`,
  authRefreshToken: `${BASE_URL}/api/v1/auth/refresh-token`,
  adminLogout: `${BASE_URL}/api/v1/auth/logout`,
  logout: `${BASE_URL}/api/v1/auth/logout`,

  // =========================================================================
  // 2. ADMIN DASHBOARD & ANALYTICS
  // =========================================================================
  dashboardStats: `${BASE_URL}/api/v1/admin/dashboard/stats`,
  dashboardCharts: (type: string) => `${BASE_URL}/api/v1/admin/dashboard/charts/${type}`,
  dashboard: `${BASE_URL}/api/v1/admin/dashboard/stats`,
  mobileHomeFeed: `${BASE_URL}/api/v1/dashboard/mobile-home`,

  // =========================================================================
  // 3. PROFILE & MY PROFILES (Shared with User Panel & Mobile)
  // =========================================================================
  getProfile: `${BASE_URL}/api/v1/profile/getProfile`,
  getUserProfile: `${BASE_URL}/api/v1/profile/getProfile`,
  getProfileMe: `${BASE_URL}/api/v1/profile/me`,
  editProfile: `${BASE_URL}/api/v1/profile/editProfile`,
  updateProfile: `${BASE_URL}/api/v1/profile/editProfile`,
  myProfiles: `${BASE_URL}/api/v1/auth/my-profiles`,

  // =========================================================================
  // 4. LEADS & CRM
  // =========================================================================
  getLeads: `${BASE_URL}/api/v1/admin/leads`,
  getLeadDetail: (id: string) => `${BASE_URL}/api/v1/admin/leads/${id}`,
  updateLeadStatus: (id: string) => `${BASE_URL}/api/v1/admin/leads/${id}/status`,
  addLeadNote: (id: string) => `${BASE_URL}/api/v1/admin/leads/${id}/notes`,
  setFollowUp: (id: string) => `${BASE_URL}/api/v1/admin/leads/${id}/follow-up`,
  bulkAssignLeads: `${BASE_URL}/api/v1/admin/leads/bulk-assign`,
  bulkAssignPreview: `${BASE_URL}/api/v1/admin/leads/bulk-assign/preview`,

  // =========================================================================
  // 5. TELEPHONY & CALLS
  // =========================================================================
  initiateCall: `${BASE_URL}/api/v1/admin/calls/initiate`,
  submitCallDisposition: (callId: string) => `${BASE_URL}/api/v1/admin/calls/${callId}/disposition`,
  getCallReports: `${BASE_URL}/api/v1/admin/calls/reports`,

  // =========================================================================
  // 6. MEMBERS MANAGEMENT
  // =========================================================================
  getMembers: `${BASE_URL}/api/v1/admin/members`,
  getMemberDetail: (id: string) => `${BASE_URL}/api/v1/admin/members/${id}`,
  updateMemberStatus: (id: string) => `${BASE_URL}/api/v1/admin/members/${id}/status`,
  verifyMember: (id: string) => `${BASE_URL}/api/v1/admin/members/${id}/verify`,

  // =========================================================================
  // 7. VERIFICATIONS
  // =========================================================================
  getPendingVerifications: `${BASE_URL}/api/v1/admin/verifications/pending`,
  approveVerification: (id: string) => `${BASE_URL}/api/v1/admin/verifications/${id}/approve`,
  rejectVerification: (id: string) => `${BASE_URL}/api/v1/admin/verifications/${id}/reject`,

  // =========================================================================
  // 8. FINANCE & TRANSACTIONS
  // =========================================================================
  getFinanceSummary: `${BASE_URL}/api/v1/admin/finance/summary`,
  getTransactions: `${BASE_URL}/api/v1/admin/finance/transactions`,
  getPendingRefunds: `${BASE_URL}/api/v1/admin/finance/refunds/pending`,
  approveRefund: (id: string) => `${BASE_URL}/api/v1/admin/finance/refunds/${id}/approve`,
  rejectRefund: (id: string) => `${BASE_URL}/api/v1/admin/finance/refunds/${id}/reject`,

  // =========================================================================
  // 9. SUBSCRIPTIONS & PLANS
  // =========================================================================
  getPlans: `${BASE_URL}/api/v1/admin/plans`,
  plans: `${BASE_URL}/api/v1/admin/plans`,
  getSubscriptions: `${BASE_URL}/api/v1/admin/subscriptions`,
  manualEntitlement: `${BASE_URL}/api/v1/admin/subscriptions/manual-entitle`,

  // =========================================================================
  // 10. CAMPAIGNS & MARKETING
  // =========================================================================
  getCampaigns: `${BASE_URL}/api/v1/admin/campaigns`,
  createCampaign: `${BASE_URL}/api/v1/admin/campaigns`,
  pauseCampaign: (id: string) => `${BASE_URL}/api/v1/admin/campaigns/${id}/pause`,

  // =========================================================================
  // 11. EMPLOYEES & RBAC
  // =========================================================================
  getEmployees: `${BASE_URL}/api/v1/admin/employees`,
  getEmployeeDetail: (id: string) => `${BASE_URL}/api/v1/admin/employees/${id}`,
  updateEmployeePermissions: (id: string) => `${BASE_URL}/api/v1/admin/employees/${id}/permissions`,

  // =========================================================================
  // 12. AUDIT LOGS
  // =========================================================================
  getAuditLogs: `${BASE_URL}/api/v1/admin/audit-logs`,

  // =========================================================================
  // 13. MASTER DATA & DROPDOWNS (Shared with User Panel & Mobile)
  // =========================================================================
  masterDropdowns: `${BASE_URL}/api/v1/master/dropdowns`,
  commonDropdowns: `${BASE_URL}/api/v1/master/dropdowns`,
  bootstrapConfig: `${BASE_URL}/api/v1/master/bootstrap`,
  subcastes: `${BASE_URL}/api/v1/master/subcastes`,
  gotras: `${BASE_URL}/api/v1/master/gotras`,
  getSubcastes: `${BASE_URL}/api/v1/admin/master-data/subcastes`,
  getGotras: `${BASE_URL}/api/v1/admin/master-data/gotras`,
  surnameLookup: `${BASE_URL}/api/v1/master/surnames/lookup`,
  occupations: `${BASE_URL}/api/v1/master/occupations`,
  countries: `${BASE_URL}/api/v1/master/locations/countries`,
  cities: `${BASE_URL}/api/v1/master/locations/cities`,
  getCountriesListForMobile: `${BASE_URL}/api/v1/master/locations/countries`,
  horoscopeOptions: `${BASE_URL}/api/v1/master/horoscope`,

  // =========================================================================
  // 14. MATCHMAKING & FEEDS (Shared with User Panel & Mobile)
  // =========================================================================
  allMatchesFeed: `${BASE_URL}/api/v1/dashboard/all-matches`,
  recommendedMatches: `${BASE_URL}/api/v1/matches/recommendations`,
  newMatchesFeed: `${BASE_URL}/api/v1/dashboard/new-matches`,
  whoViewedYouFeed: `${BASE_URL}/api/v1/dashboard/who-viewed-you`,
  profilesYouViewedFeed: `${BASE_URL}/api/v1/dashboard/profiles-you-viewed`,
  getShortlist: `${BASE_URL}/api/v1/matchmaking/shortlist`,
  shortlistCandidate: (candidateId: string) => `${BASE_URL}/api/v1/matchmaking/shortlist/${candidateId}`,
  interestsReceived: `${BASE_URL}/api/v1/matchmaking/interests/received`,
  interestsSent: `${BASE_URL}/api/v1/matchmaking/interests/sent`,
  interestsSend: `${BASE_URL}/api/v1/matchmaking/interests/send`,
  conversationsList: `${BASE_URL}/api/v1/chat/conversations`,
  notificationsList: `${BASE_URL}/api/v1/notifications`,
};

export default ApiURL;
