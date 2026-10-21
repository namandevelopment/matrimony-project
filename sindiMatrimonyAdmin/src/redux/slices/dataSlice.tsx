import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import equal from 'fast-deep-equal';
import { optimisticReducers } from '../Action/optimisticUpdate';
import {
  addApiReducer,
  addApiReducerWithPagination,
  createPostThunk,
} from '../Action/apiThunk';

// =============================================================================
// 1. SAFE DEEP MUTATION HELPERS
// =============================================================================

export const updateStateIfChanged = (
  state: any,
  key: string,
  newValue: any,
) => {
  if (!equal(state[key], newValue)) {
    state[key] = newValue;
  }
};

/**
 * Safely updates any nested path (e.g., 'getprofiledata.data.name' or 'leadsData.loader')
 * creating intermediate objects/arrays if they don't already exist.
 */
export const setDeepValue = (target: any, path: string, value: any) => {
  if (!target || typeof target !== 'object' || !path || typeof path !== 'string') {
    return;
  }
  const normalizedPath = path.replace(/\[(\w+)\]/g, '.$1').replace(/^\./, '');
  const keys = normalizedPath.split('.');
  let current = target;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (current[key] === undefined || current[key] === null || typeof current[key] !== 'object') {
      const nextKey = keys[i + 1];
      const isNextNumeric = !isNaN(Number(nextKey));
      current[key] = isNextNumeric ? [] : {};
    }
    current = current[key];
  }

  const lastKey = keys[keys.length - 1];
  if (current && typeof current === 'object') {
    current[lastKey] = value;
  }
};

// =============================================================================
// 2. INITIAL STATE (Mirroring User Panel & Mobile + Admin Management)
// =============================================================================

const initialState: any = {
  // App UI & Global States
  darkMode: false,
  loader: false,
  activeTab: 'Home',

  // ---------------------------------------------------------------------------
  // 2.1 Normal API States (Single Object / List)
  // ---------------------------------------------------------------------------
  getprofiledata: {
    data: null,
    loader: false,
    error: null,
  },
  dashboardData: {
    data: null,
    loader: false,
    error: null,
  },
  masterDropdownsData: {
    data: null,
    loader: false,
    error: null,
  },
  myProfilesData: {
    data: [],
    loader: false,
    error: null,
  },
  getcountriesList: {
    data: null,
    loader: false,
    error: null,
  },

  // ---------------------------------------------------------------------------
  // 2.2 Pagination API States (Feeds / Lists)
  // ---------------------------------------------------------------------------
  allMatchesData: {
    data: { list: [], hasMore: false },
    loader: false,
    paginationLoader: false,
    error: null,
  },
  recommendedMatchesData: {
    data: { list: [], hasMore: false },
    loader: false,
    paginationLoader: false,
    error: null,
  },
  newMatchesData: {
    data: { list: [], hasMore: false },
    loader: false,
    paginationLoader: false,
    error: null,
  },
  whoViewedYouData: {
    data: { list: [], hasMore: false },
    loader: false,
    paginationLoader: false,
    error: null,
  },
  profilesYouViewedData: {
    data: { list: [], hasMore: false },
    loader: false,
    paginationLoader: false,
    error: null,
  },
  shortlistData: {
    data: { list: [], hasMore: false },
    loader: false,
    paginationLoader: false,
    error: null,
  },
  interestsReceivedData: {
    data: { list: [], hasMore: false },
    loader: false,
    paginationLoader: false,
    error: null,
  },
  interestsSentData: {
    data: { list: [], hasMore: false },
    loader: false,
    paginationLoader: false,
    error: null,
  },
  conversationsListData: {
    data: { list: [], hasMore: false },
    loader: false,
    paginationLoader: false,
    error: null,
  },
  notificationsListData: {
    data: { list: [], hasMore: false },
    loader: false,
    paginationLoader: false,
    error: null,
  },

  // ---------------------------------------------------------------------------
  // 2.3 Admin Specific Management States
  // ---------------------------------------------------------------------------
  leadsData: {
    data: { list: [], hasMore: false },
    loader: false,
    paginationLoader: false,
    error: null,
  },
  membersData: {
    data: { list: [], hasMore: false },
    loader: false,
    paginationLoader: false,
    error: null,
  },
  employeesData: {
    data: { list: [], hasMore: false },
    loader: false,
    paginationLoader: false,
    error: null,
  },
  campaignsData: {
    data: { list: [], hasMore: false },
    loader: false,
    paginationLoader: false,
    error: null,
  },
  verificationsData: {
    data: { list: [], hasMore: false },
    loader: false,
    paginationLoader: false,
    error: null,
  },
  auditLogsData: {
    data: { list: [], hasMore: false },
    loader: false,
    paginationLoader: false,
    error: null,
  },
  financeSummaryData: {
    data: null,
    loader: false,
    error: null,
  },
  transactionsData: {
    data: { list: [], hasMore: false },
    loader: false,
    paginationLoader: false,
    error: null,
  },
  refundsData: {
    data: { list: [], hasMore: false },
    loader: false,
    paginationLoader: false,
    error: null,
  },
  subscriptionsData: {
    data: { list: [], hasMore: false },
    loader: false,
    paginationLoader: false,
    error: null,
  },
  subcastesData: {
    data: [],
    loader: false,
    error: null,
  },
  gotrasData: {
    data: [],
    loader: false,
    error: null,
  },
};

// =============================================================================
// 3. ASYNC THUNKS (Mirroring User Panel & Mobile + Admin)
// =============================================================================

// Normal API Thunks
export const getProfileCall = createPostThunk('data/getProfile');
export const getProfile_Call = getProfileCall; // Alias for backward compatibility
export const getDashboardCall = createPostThunk('data/getDashboard');
export const getMasterDropdownsCall = createPostThunk('data/getMasterDropdowns');
export const getMyProfilesCall = createPostThunk('data/getMyProfiles');
export const getCountriesListCall = createPostThunk('data/getCountriesList');

// Pagination API Thunks
export const getAllMatchesCall = createPostThunk('data/getAllMatches');
export const getRecommendedMatchesCall = createPostThunk('data/getRecommendedMatches');
export const getNewMatchesCall = createPostThunk('data/getNewMatches');
export const getWhoViewedYouCall = createPostThunk('data/getWhoViewedYou');
export const getProfilesYouViewedCall = createPostThunk('data/getProfilesYouViewed');
export const getShortlistCall = createPostThunk('data/getShortlist');
export const getInterestsReceivedCall = createPostThunk('data/getInterestsReceived');
export const getInterestsSentCall = createPostThunk('data/getInterestsSent');
export const getConversationsListCall = createPostThunk('data/getConversationsList');
export const getNotificationsListCall = createPostThunk('data/getNotificationsList');

// Admin Management Thunks
export const getLeadsCall = createPostThunk('data/getLeads');
export const getMembersCall = createPostThunk('data/getMembers');
export const getEmployeesCall = createPostThunk('data/getEmployees');
export const getCampaignsCall = createPostThunk('data/getCampaigns');
export const getVerificationsCall = createPostThunk('data/getVerifications');
export const getAuditLogsCall = createPostThunk('data/getAuditLogs');
export const getFinanceSummaryCall = createPostThunk('data/getFinanceSummary');
export const getTransactionsCall = createPostThunk('data/getTransactions');
export const getSubscriptionsCall = createPostThunk('data/getSubscriptions');
export const getSubcastesCall = createPostThunk('data/getSubcastes');
export const getGotrasCall = createPostThunk('data/getGotras');

// =============================================================================
// 4. DATA SLICE DEFINITION
// =============================================================================

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    /**
     * 🔥 UNIVERSAL REDUX STATE UPDATER 🔥
     * Update ANY value or nested property in the Redux store.
     *
     * Usage examples:
     * 1. Path & value:
     *    dispatch(updateAnyState({ path: 'darkMode', value: true }))
     *    dispatch(updateAnyState({ path: 'getprofiledata.data.name', value: 'Admin' }))
     * 
     * 2. Multiple key/path updates:
     *    dispatch(updateAnyState({ darkMode: true, loader: false }))
     */
    updateAnyState: (state: any, action: PayloadAction<any>) => {
      const payload = action.payload;
      if (!payload || typeof payload !== 'object') return;

      // Case 1: Payload has 'path' or 'key' with 'value'
      if ('path' in payload && 'value' in payload) {
        setDeepValue(state, payload.path, payload.value);
        return;
      }
      if ('key' in payload && 'value' in payload) {
        setDeepValue(state, payload.key, payload.value);
        return;
      }

      // Case 2: Multi-key object payload
      Object.entries(payload).forEach(([pathKey, val]) => {
        if (pathKey.includes('.')) {
          setDeepValue(state, pathKey, val);
        } else {
          state[pathKey] = val;
        }
      });
    },

    toggleDarkMode: (state: any) => {
      state.darkMode = !state.darkMode;
    },

    resetProfileData: (state: any) => {
      state.getprofiledata = { data: null, loader: false, error: null };
    },

    resetEntireStore: () => {
      return initialState;
    },

    // Optimistic list updates (updateListItem, removeListItem, addListItem)
    ...optimisticReducers,
  },

  extraReducers: (builder) => {
    // =========================================================================
    // 1. Normal API Reducers (Function 1: addApiReducer)
    // =========================================================================
    addApiReducer(builder, getProfileCall, 'getprofiledata', 'data', 'Failed to fetch profile');
    addApiReducer(builder, getDashboardCall, 'dashboardData', 'data', 'Failed to fetch dashboard');
    addApiReducer(builder, getMasterDropdownsCall, 'masterDropdownsData', 'data', 'Failed to fetch dropdown options');
    addApiReducer(builder, getMyProfilesCall, 'myProfilesData', 'data', 'Failed to fetch profiles');
    addApiReducer(builder, getCountriesListCall, 'getcountriesList', 'data', 'Failed to fetch countries');
    addApiReducer(builder, getFinanceSummaryCall, 'financeSummaryData', 'data', 'Failed to fetch finance summary');
    addApiReducer(builder, getSubcastesCall, 'subcastesData', 'data', 'Failed to fetch subcastes');
    addApiReducer(builder, getGotrasCall, 'gotrasData', 'data', 'Failed to fetch gotras');

    // =========================================================================
    // 2. Pagination API Reducers (Function 2: addApiReducerWithPagination)
    // =========================================================================
    addApiReducerWithPagination(builder, getAllMatchesCall, 'allMatchesData', 'data', 'Failed to fetch matches');
    addApiReducerWithPagination(builder, getRecommendedMatchesCall, 'recommendedMatchesData', 'data', 'Failed to fetch recommendations');
    addApiReducerWithPagination(builder, getNewMatchesCall, 'newMatchesData', 'data', 'Failed to fetch new matches');
    addApiReducerWithPagination(builder, getWhoViewedYouCall, 'whoViewedYouData', 'data', 'Failed to fetch who viewed you');
    addApiReducerWithPagination(builder, getProfilesYouViewedCall, 'profilesYouViewedData', 'data', 'Failed to fetch profiles you viewed');
    addApiReducerWithPagination(builder, getShortlistCall, 'shortlistData', 'data', 'Failed to fetch shortlisted candidates');
    addApiReducerWithPagination(builder, getInterestsReceivedCall, 'interestsReceivedData', 'data', 'Failed to fetch received requests');
    addApiReducerWithPagination(builder, getInterestsSentCall, 'interestsSentData', 'data', 'Failed to fetch sent requests');
    addApiReducerWithPagination(builder, getConversationsListCall, 'conversationsListData', 'data', 'Failed to fetch conversations');
    addApiReducerWithPagination(builder, getNotificationsListCall, 'notificationsListData', 'data', 'Failed to fetch notifications');

    // Admin pagination reducers
    addApiReducerWithPagination(builder, getLeadsCall, 'leadsData', 'data', 'Failed to fetch leads');
    addApiReducerWithPagination(builder, getMembersCall, 'membersData', 'data', 'Failed to fetch members');
    addApiReducerWithPagination(builder, getEmployeesCall, 'employeesData', 'data', 'Failed to fetch employees');
    addApiReducerWithPagination(builder, getCampaignsCall, 'campaignsData', 'data', 'Failed to fetch campaigns');
    addApiReducerWithPagination(builder, getVerificationsCall, 'verificationsData', 'data', 'Failed to fetch verifications');
    addApiReducerWithPagination(builder, getAuditLogsCall, 'auditLogsData', 'data', 'Failed to fetch audit logs');
    addApiReducerWithPagination(builder, getTransactionsCall, 'transactionsData', 'data', 'Failed to fetch transactions');
    addApiReducerWithPagination(builder, getSubscriptionsCall, 'subscriptionsData', 'data', 'Failed to fetch subscriptions');
  },
});

// =============================================================================
// 5. HELPER FUNCTION: setReduxData
// =============================================================================

/**
 * Standalone helper to easily update any Redux state from anywhere.
 */
export const setReduxData = (
  dispatch: any,
  keyOrObject: string | Record<string, any>,
  value?: any,
) => {
  if (typeof keyOrObject === 'string') {
    return dispatch(updateAnyState({ path: keyOrObject, value }));
  }
  if (typeof keyOrObject === 'object' && keyOrObject !== null) {
    return dispatch(updateAnyState(keyOrObject));
  }
};

// =============================================================================
// 6. EXPORTS
// =============================================================================

export const {
  updateAnyState,
  toggleDarkMode,
  resetProfileData,
  resetEntireStore,
  updateListItem,
  removeListItem,
  addListItem,
} = dataSlice.actions;

export default dataSlice.reducer;
