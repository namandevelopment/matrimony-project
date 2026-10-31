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
  setReduxData,
  updateAnyState,
  updateListItem,
  removeListItem,
  addListItem,
} from '../slices/dataSlice';

// =============================================================================
// NORMAL API DISPATCH HELPERS
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
// PAGINATION API DISPATCH HELPERS
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
      url: ApiURL.chatConversations,
      method: 'GET',
      params: { pageNo },
    }),
  );
};

export const get_Notifications_List_Call = (dispatch: any, pageNo: number = 1) => {
  return dispatch(
    getNotificationsListCall({
      url: ApiURL.getNotificationsList,
      method: 'GET',
      params: { pageNo },
    }),
  );
};

export {
  setReduxData,
  updateAnyState,
  updateListItem,
  removeListItem,
  addListItem,
  getProfileCall,
  getProfile_Call,
};
