import { ApiURL } from '../apiService/endpoint';
import {
  getProfileCall,
  getProfile_Call,
  getDashboardCall,
  getMasterDropdownsCall,
  getMyProfilesCall,
  getCountriesListCall,
  getAllMatchesCall,
  getRecommendedMatchesCall,
  getNewMatchesCall,
  getWhoViewedYouCall,
  getProfilesYouViewedCall,
  getShortlistCall,
  getInterestsReceivedCall,
  getInterestsSentCall,
  getConversationsListCall,
  getNotificationsListCall,
  getLeadsCall,
  getMembersCall,
  getEmployeesCall,
  getCampaignsCall,
  getVerificationsCall,
  getAuditLogsCall,
  getFinanceSummaryCall,
  getTransactionsCall,
  getSubscriptionsCall,
  getSubcastesCall,
  getGotrasCall,
  setReduxData,
  updateAnyState,
  updateListItem,
  removeListItem,
  addListItem,
} from '../slices/dataSlice';

// =============================================================================
// NORMAL API DISPATCH HELPERS (Mirroring User Panel & Mobile)
// =============================================================================

export const get_Profile_Call = (dispatch: any) => {
  return dispatch(getProfileCall({ url: ApiURL.getProfile, method: 'GET' }));
};

export const get_Dashboard_Call = (dispatch: any) => {
  return dispatch(getDashboardCall({ url: ApiURL.mobileHomeFeed, method: 'GET' }));
};

export const get_Master_Dropdowns_Call = (dispatch: any) => {
  return dispatch(getMasterDropdownsCall({ url: ApiURL.masterDropdowns, method: 'GET' }));
};

export const get_My_Profiles_Call = (dispatch: any) => {
  return dispatch(getMyProfilesCall({ url: ApiURL.myProfiles, method: 'GET' }));
};

export const get_Countries_List_Call = (dispatch: any) => {
  return dispatch(getCountriesListCall({ url: ApiURL.countries, method: 'GET' }));
};

// =============================================================================
// PAGINATION API DISPATCH HELPERS (Mirroring User Panel & Mobile)
// =============================================================================

export const get_All_Matches_Call = (dispatch: any, pageNo: number = 1, filters: Record<string, any> = {}) => {
  return dispatch(
    getAllMatchesCall({
      url: ApiURL.allMatchesFeed,
      method: 'GET',
      params: { pageNo, ...filters },
    }),
  );
};

export const get_Recommended_Matches_Call = (dispatch: any, pageNo: number = 1) => {
  return dispatch(
    getRecommendedMatchesCall({
      url: ApiURL.recommendedMatches,
      method: 'GET',
      params: { pageNo },
    }),
  );
};

export const get_New_Matches_Call = (dispatch: any, pageNo: number = 1) => {
  return dispatch(
    getNewMatchesCall({
      url: ApiURL.newMatchesFeed,
      method: 'GET',
      params: { pageNo },
    }),
  );
};

export const get_Who_Viewed_You_Call = (dispatch: any, pageNo: number = 1) => {
  return dispatch(
    getWhoViewedYouCall({
      url: ApiURL.whoViewedYouFeed,
      method: 'GET',
      params: { pageNo },
    }),
  );
};

export const get_Profiles_You_Viewed_Call = (dispatch: any, pageNo: number = 1) => {
  return dispatch(
    getProfilesYouViewedCall({
      url: ApiURL.profilesYouViewedFeed,
      method: 'GET',
      params: { pageNo },
    }),
  );
};

export const get_Shortlist_Call = (dispatch: any, pageNo: number = 1) => {
  return dispatch(
    getShortlistCall({
      url: ApiURL.getShortlist,
      method: 'GET',
      params: { pageNo },
    }),
  );
};

export const get_Interests_Received_Call = (dispatch: any, pageNo: number = 1) => {
  return dispatch(
    getInterestsReceivedCall({
      url: ApiURL.interestsReceived,
      method: 'GET',
      params: { pageNo },
    }),
  );
};

export const get_Interests_Sent_Call = (dispatch: any, pageNo: number = 1) => {
  return dispatch(
    getInterestsSentCall({
      url: ApiURL.interestsSent,
      method: 'GET',
      params: { pageNo },
    }),
  );
};

export const get_Conversations_List_Call = (dispatch: any, pageNo: number = 1) => {
  return dispatch(
    getConversationsListCall({
      url: ApiURL.conversationsList,
      method: 'GET',
      params: { pageNo },
    }),
  );
};

export const get_Notifications_List_Call = (dispatch: any, pageNo: number = 1) => {
  return dispatch(
    getNotificationsListCall({
      url: ApiURL.notificationsList,
      method: 'GET',
      params: { pageNo },
    }),
  );
};

// =============================================================================
// ADMIN SPECIFIC DISPATCH HELPERS
// =============================================================================

export const get_Leads_Call = (dispatch: any, pageNo: number = 1, filters: Record<string, any> = {}) => {
  return dispatch(
    getLeadsCall({
      url: ApiURL.getLeads,
      method: 'GET',
      params: { pageNo, ...filters },
    }),
  );
};

export const get_Members_Call = (dispatch: any, pageNo: number = 1, filters: Record<string, any> = {}) => {
  return dispatch(
    getMembersCall({
      url: ApiURL.getMembers,
      method: 'GET',
      params: { pageNo, ...filters },
    }),
  );
};

export const get_Employees_Call = (dispatch: any, pageNo: number = 1, filters: Record<string, any> = {}) => {
  return dispatch(
    getEmployeesCall({
      url: ApiURL.getEmployees,
      method: 'GET',
      params: { pageNo, ...filters },
    }),
  );
};

export const get_Campaigns_Call = (dispatch: any, pageNo: number = 1, filters: Record<string, any> = {}) => {
  return dispatch(
    getCampaignsCall({
      url: ApiURL.getCampaigns,
      method: 'GET',
      params: { pageNo, ...filters },
    }),
  );
};

export const get_Verifications_Call = (dispatch: any, pageNo: number = 1) => {
  return dispatch(
    getVerificationsCall({
      url: ApiURL.getPendingVerifications,
      method: 'GET',
      params: { pageNo },
    }),
  );
};

export const get_Audit_Logs_Call = (dispatch: any, pageNo: number = 1, filters: Record<string, any> = {}) => {
  return dispatch(
    getAuditLogsCall({
      url: ApiURL.getAuditLogs,
      method: 'GET',
      params: { pageNo, ...filters },
    }),
  );
};

export const get_Finance_Summary_Call = (dispatch: any) => {
  return dispatch(
    getFinanceSummaryCall({
      url: ApiURL.getFinanceSummary,
      method: 'GET',
    }),
  );
};

export const get_Transactions_Call = (dispatch: any, pageNo: number = 1, filters: Record<string, any> = {}) => {
  return dispatch(
    getTransactionsCall({
      url: ApiURL.getTransactions,
      method: 'GET',
      params: { pageNo, ...filters },
    }),
  );
};

export const get_Subscriptions_Call = (dispatch: any, pageNo: number = 1, filters: Record<string, any> = {}) => {
  return dispatch(
    getSubscriptionsCall({
      url: ApiURL.getSubscriptions,
      method: 'GET',
      params: { pageNo, ...filters },
    }),
  );
};

export const get_Subcastes_Call = (dispatch: any) => {
  return dispatch(
    getSubcastesCall({
      url: ApiURL.subcastes,
      method: 'GET',
    }),
  );
};

export const get_Gotras_Call = (dispatch: any) => {
  return dispatch(
    getGotrasCall({
      url: ApiURL.gotras,
      method: 'GET',
    }),
  );
};

// Re-export core state updaters
export {
  getProfile_Call,
  setReduxData,
  updateAnyState,
  updateListItem,
  removeListItem,
  addListItem,
};
