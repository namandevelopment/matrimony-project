import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../Store/store';
import { createSelector } from '@reduxjs/toolkit';

// =============================================================================
// BASE SELECTOR (Zero unnecessary re-renders)
// =============================================================================
const selectDataState = (state: RootState): any => state?.data ?? {};

// =============================================================================
// 1. PROFILE & DASHBOARD SELECTORS
// =============================================================================
export const selectProfile = createSelector([selectDataState], (data: any) => data?.getprofiledata?.data || null);
export const selectProfileLoader = createSelector([selectDataState], (data: any) => !!data?.getprofiledata?.loader);
export const selectProfileError = createSelector([selectDataState], (data: any) => data?.getprofiledata?.error || null);

export const selectDashboardData = createSelector([selectDataState], (data: any) => data?.dashboardData?.data || null);
export const selectDashboardLoader = createSelector([selectDataState], (data: any) => !!data?.dashboardData?.loader);

export const selectMasterDropdowns = createSelector([selectDataState], (data: any) => data?.masterDropdownsData?.data || {});
export const selectMyProfiles = createSelector([selectDataState], (data: any) => data?.myProfilesData?.data || []);

// =============================================================================
// 2. MATCHES & FEEDS SELECTORS (Paginated)
// =============================================================================
export const selectAllMatches = createSelector([selectDataState], (data: any) => data?.allMatchesData?.data?.list ?? []);
export const selectAllMatchesData = createSelector([selectDataState], (data: any) => data?.allMatchesData ?? {});

export const selectRecommendedMatches = createSelector([selectDataState], (data: any) => data?.recommendedMatchesData?.data?.list ?? []);
export const selectRecommendedMatchesData = createSelector([selectDataState], (data: any) => data?.recommendedMatchesData ?? {});

export const selectNewMatches = createSelector([selectDataState], (data: any) => data?.newMatchesData?.data?.list ?? []);
export const selectNewMatchesData = createSelector([selectDataState], (data: any) => data?.newMatchesData ?? {});

export const selectWhoViewedYou = createSelector([selectDataState], (data: any) => data?.whoViewedYouData?.data?.list ?? []);
export const selectWhoViewedYouData = createSelector([selectDataState], (data: any) => data?.whoViewedYouData ?? {});

export const selectProfilesYouViewed = createSelector([selectDataState], (data: any) => data?.profilesYouViewedData?.data?.list ?? []);
export const selectProfilesYouViewedData = createSelector([selectDataState], (data: any) => data?.profilesYouViewedData ?? {});

export const selectShortlist = createSelector([selectDataState], (data: any) => data?.shortlistData?.data?.list ?? []);
export const selectShortlistData = createSelector([selectDataState], (data: any) => data?.shortlistData ?? {});

// =============================================================================
// 3. INTERESTS, CHAT & NOTIFICATIONS SELECTORS
// =============================================================================
export const selectInterestsReceived = createSelector([selectDataState], (data: any) => data?.interestsReceivedData?.data?.list ?? []);
export const selectInterestsReceivedData = createSelector([selectDataState], (data: any) => data?.interestsReceivedData ?? {});

export const selectInterestsSent = createSelector([selectDataState], (data: any) => data?.interestsSentData?.data?.list ?? []);
export const selectInterestsSentData = createSelector([selectDataState], (data: any) => data?.interestsSentData ?? {});

export const selectConversationsList = createSelector([selectDataState], (data: any) => data?.conversationsListData?.data?.list ?? []);
export const selectConversationsData = createSelector([selectDataState], (data: any) => data?.conversationsListData ?? {});

export const selectNotificationsList = createSelector([selectDataState], (data: any) => data?.notificationsListData?.data?.list ?? []);
export const selectNotificationsData = createSelector([selectDataState], (data: any) => data?.notificationsListData ?? {});

// =============================================================================
// 4. GLOBAL APP STATE SELECTORS
// =============================================================================
export const selectDarkMode = createSelector([selectDataState], (data: any) => !!data?.darkMode);
export const selectGlobalLoader = createSelector([selectDataState], (data: any) => !!data?.loader);
export const selectActiveTab = createSelector([selectDataState], (data: any) => data?.activeTab ?? 'Home');

// =============================================================================
// 5. CUSTOM REACT HOOKS (Convenient & Memoized)
// =============================================================================

export const useProfile = () => {
  const data = useSelector(selectProfile);
  const loader = useSelector(selectProfileLoader);
  const error = useSelector(selectProfileError);
  return { profile: data, loader, error };
};

export const useProfileData = () => useSelector(selectProfile);

export const useAllMatches = () => {
  const state = useSelector(selectAllMatchesData);
  return {
    list: state?.data?.list ?? [],
    hasMore: state?.data?.hasMore ?? false,
    loader: state?.loader ?? false,
    paginationLoader: state?.paginationLoader ?? false,
    error: state?.error ?? null,
  };
};

export const useRecommendedMatches = () => {
  const state = useSelector(selectRecommendedMatchesData);
  return {
    list: state?.data?.list ?? [],
    hasMore: state?.data?.hasMore ?? false,
    loader: state?.loader ?? false,
    paginationLoader: state?.paginationLoader ?? false,
    error: state?.error ?? null,
  };
};

export const useNewMatches = () => {
  const state = useSelector(selectNewMatchesData);
  return {
    list: state?.data?.list ?? [],
    hasMore: state?.data?.hasMore ?? false,
    loader: state?.loader ?? false,
    paginationLoader: state?.paginationLoader ?? false,
    error: state?.error ?? null,
  };
};

export const useWhoViewedYou = () => {
  const state = useSelector(selectWhoViewedYouData);
  return {
    list: state?.data?.list ?? [],
    hasMore: state?.data?.hasMore ?? false,
    loader: state?.loader ?? false,
    paginationLoader: state?.paginationLoader ?? false,
    error: state?.error ?? null,
  };
};

export const useShortlist = () => {
  const state = useSelector(selectShortlistData);
  return {
    list: state?.data?.list ?? [],
    hasMore: state?.data?.hasMore ?? false,
    loader: state?.loader ?? false,
    paginationLoader: state?.paginationLoader ?? false,
    error: state?.error ?? null,
  };
};

export const useInterests = () => {
  const received = useSelector(selectInterestsReceivedData);
  const sent = useSelector(selectInterestsSentData);
  return {
    receivedList: received?.data?.list ?? [],
    receivedLoader: received?.loader ?? false,
    sentList: sent?.data?.list ?? [],
    sentLoader: sent?.loader ?? false,
  };
};

export const useConversations = () => {
  const state = useSelector(selectConversationsData);
  return {
    list: state?.data?.list ?? [],
    hasMore: state?.data?.hasMore ?? false,
    loader: state?.loader ?? false,
    paginationLoader: state?.paginationLoader ?? false,
    error: state?.error ?? null,
  };
};

export const useNotifications = () => {
  const state = useSelector(selectNotificationsData);
  return {
    list: state?.data?.list ?? [],
    hasMore: state?.data?.hasMore ?? false,
    loader: state?.loader ?? false,
    paginationLoader: state?.paginationLoader ?? false,
    error: state?.error ?? null,
  };
};

export const useCountriesList = () =>
  useSelector((state: any) => state?.data?.getcountriesList?.data?.countries ?? []);

export const useCountryDropdownData = () => {
  const countries = useCountriesList();
  return useMemo(() => {
    if (!countries || countries.length === 0) return [];
    return countries.map((cntry: any) => ({
      label: cntry?.name,
      value: cntry?.shortName,
      emoji: cntry?.emoji,
      dialCode: cntry?.dialCode || cntry?.disalCode,
    }));
  }, [countries]);
};

// =============================================================================
// 6. BACKWARD COMPATIBILITY ALIASES
// =============================================================================
export const myProfileData = selectProfile;
export const getLearnerSessionListData = createSelector([selectDataState], (data: any) => data?.getprofiledata ?? {});
export const getLearnerBatchListData = createSelector([selectDataState], (data: any) => data?.allMatchesData ?? {});
export const getFreeCourseListData = createSelector([selectDataState], (data: any) => data?.recommendedMatchesData ?? {});
export const getBatchForHomeScreenData = createSelector([selectDataState], (data: any) => data?.dashboardData ?? {});
export const getTrendingCourseListData = createSelector([selectDataState], (data: any) => data?.newMatchesData ?? {});
export const getOneOnSessionData = createSelector([selectDataState], (data: any) => data?.whoViewedYouData ?? {});
export const getFreeBatchesListData = createSelector([selectDataState], (data: any) => data?.profilesYouViewedData ?? {});
export const getTopPerformingCoursesListData = createSelector([selectDataState], (data: any) => data?.shortlistData ?? {});
export const getAllCategoryData = createSelector([selectDataState], (data: any) => data?.masterDropdownsData ?? {});
export const getBannersListData = createSelector([selectDataState], (data: any) => data?.dashboardData?.data?.banners ?? []);
export const designerListData = () => [];
export const useCategoryDropdown = () => [];
