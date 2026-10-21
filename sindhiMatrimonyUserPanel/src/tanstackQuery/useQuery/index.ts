import { useQuery, useInfiniteQuery, UseQueryOptions, UseInfiniteQueryOptions } from '@tanstack/react-query';
import { apiFetch, apiRequest } from '../../redux/apiService';
import { ApiURL } from '../../redux/apiService/endpoint';
import { QUERY_KEYS } from '../keys';

// =============================================================================
// BASE QUERY WRAPPERS
// =============================================================================

export interface UseApiQueryProps<T = any> {
  queryKey: readonly any[] | any[];
  url: string;
  params?: Record<string, any>;
  isToken?: boolean;
  enabled?: boolean;
  staleTime?: number;
  select?: (data: T) => any;
  options?: Omit<UseQueryOptions<T, any, any, any>, 'queryKey' | 'queryFn'>;
}

export const useApiQuery = <T = any>({
  queryKey,
  url,
  params = {},
  isToken = true,
  enabled = true,
  staleTime = 1000 * 60 * 5, // 5 minutes default fresh cache
  select,
  options = {},
}: UseApiQueryProps<T>) => {
  return useQuery<T>({
    queryKey: queryKey as any,
    enabled,
    staleTime,
    select,
    ...options,
    queryFn: async () => {
      const res = await apiFetch<T>({
        url,
        method: 'GET',
        params,
        isToken,
        showErrorToast: false,
        throwOnError: false,
      });
      if (res.error) {
        throw new Error(res.message || 'API request failed');
      }
      return (res.data !== undefined && res.data !== null ? res.data : res) as T;
    },
  });
};

export interface UseApiInfiniteQueryProps<T = any> {
  queryKey: readonly any[] | any[];
  url: string;
  params?: Record<string, any>;
  isToken?: boolean;
  enabled?: boolean;
  staleTime?: number;
  options?: Partial<UseInfiniteQueryOptions<any, any, any, any, any>>;
}

export const useApiInfiniteQuery = <T = any>({
  queryKey,
  url,
  params = {},
  isToken = true,
  enabled = true,
  staleTime,
  options = {},
}: UseApiInfiniteQueryProps<T>) => {
  return useInfiniteQuery<any>({
    queryKey: queryKey as any,
    enabled,
    staleTime,
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const res = await apiFetch<any>({
        url,
        method: 'GET',
        params: {
          ...params,
          pageNo: pageParam,
          page: pageParam,
        },
        isToken,
        showErrorToast: false,
        throwOnError: false,
      });
      if (res.error) {
        throw new Error(res.message || 'API request failed');
      }
      return res.data !== undefined && res.data !== null ? res.data : res;
    },
    getNextPageParam: (lastPage: any, allPages: any[]) => {
      const hasMore = lastPage?.hasMore;
      const list = Array.isArray(lastPage?.list) ? lastPage.list : Array.isArray(lastPage) ? lastPage : [];

      if (hasMore === false || list.length === 0) {
        return undefined;
      }
      return allPages.length + 1;
    },
    ...options,
  });
};

// =============================================================================
// SINDHI MATRIMONY SPECIFIC QUERY HOOKS (Equivalent to useSelector)
// =============================================================================

/** 1. Current User Profile */
export const useProfileQuery = (enabled = true) => {
  return useApiQuery({
    queryKey: QUERY_KEYS.profile,
    url: ApiURL.getProfile,
    enabled,
  });
};

/** 2. Consolidated Web Dashboard Feed (sub-10ms single flight) */
export const useDashboardFeedQuery = (rashi?: string, enabled = true) => {
  return useApiQuery({
    queryKey: QUERY_KEYS.dashboardFeed(rashi),
    url: ApiURL.dashboard,
    params: rashi ? { rashi } : undefined,
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
};

/** 2.1 Dashboard Recommended Matches Feed */
export const useDashboardMatchesQuery = (enabled = true) => {
  return useApiQuery({
    queryKey: QUERY_KEYS.dashboardMatches,
    url: ApiURL.dashboardMatches,
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
};

/** 2.2 Success Stories Feed (Public / User Panel) */
export const useSuccessStoriesQuery = (page = 1, limit = 12, enabled = true) => {
  return useApiQuery({
    queryKey: QUERY_KEYS.successStories(page, limit),
    url: ApiURL.successStoriesFeed,
    params: { page, limit },
    isToken: false,
    enabled,
    staleTime: 1000 * 60 * 10, // 10 minutes cache
  });
};

/** 2.3 Public Approved Reviews & Testimonials */
export const useReviewsQuery = (enabled = true) => {
  return useApiQuery({
    queryKey: QUERY_KEYS.reviews,
    url: ApiURL.reviewsPublicList,
    isToken: false,
    enabled,
    staleTime: 1000 * 60 * 10, // 10 minutes cache
  });
};

/** 2.4 Daily Astrological Horoscope */
export const useHoroscopeQuery = (rashi = "leo", enabled = true) => {
  return useApiQuery({
    queryKey: QUERY_KEYS.horoscope(rashi),
    url: ApiURL.dashboardHoroscope,
    params: { rashi },
    isToken: false,
    enabled,
    staleTime: 1000 * 60 * 15, // 15 minutes cache
  });
};

/** 2.5 Mobile HomeScreen Consolidated Feed */
export const useDashboardQuery = (enabled = true) => {
  return useApiQuery({
    queryKey: QUERY_KEYS.dashboard,
    url: ApiURL.mobileHomeFeed,
    enabled,
  });
};

/** 3. Master Dropdowns (Subcaste, Gotra, Occupations) */
export const useMasterDropdownsQuery = () => {
  return useApiQuery({
    queryKey: QUERY_KEYS.masterDropdowns,
    url: ApiURL.masterDropdowns,
    staleTime: 1000 * 60 * 60, // 1 hour cached (rarely changes)
  });
};

/** 4. Countries List */
export const useCountriesQuery = () => {
  return useApiQuery({
    queryKey: QUERY_KEYS.countries,
    url: ApiURL.countries,
    staleTime: 1000 * 60 * 60,
  });
};

/** 5. All Matches Infinite Feed */
export const useAllMatchesQuery = (filters: Record<string, any> = {}) => {
  const query = useApiInfiniteQuery({
    queryKey: QUERY_KEYS.allMatches(filters),
    url: ApiURL.allMatchesFeed,
    params: filters,
  });

  const matches = query.data?.pages.flatMap(page => page?.list || []) ?? [];

  return {
    ...query,
    matches,
  };
};

/** 6. Recommended Matches Infinite Feed */
export const useRecommendedMatchesQuery = (filters: Record<string, any> = {}) => {
  const query = useApiInfiniteQuery({
    queryKey: QUERY_KEYS.recommendedMatches(filters),
    url: ApiURL.recommendedMatches,
    params: filters,
  });

  const matches = query.data?.pages.flatMap(page => page?.list || []) ?? [];

  return {
    ...query,
    matches,
  };
};

/** 7. New Matches Infinite Feed */
export const useNewMatchesQuery = () => {
  const query = useApiInfiniteQuery({
    queryKey: QUERY_KEYS.newMatches,
    url: ApiURL.newMatchesFeed,
  });

  const matches = query.data?.pages.flatMap(page => page?.list || []) ?? [];

  return {
    ...query,
    matches,
  };
};

/** 8. Who Viewed You Infinite Feed */
export const useWhoViewedYouQuery = () => {
  const query = useApiInfiniteQuery({
    queryKey: QUERY_KEYS.whoViewedYou,
    url: ApiURL.whoViewedYouFeed,
  });

  const viewers = query.data?.pages.flatMap(page => page?.list || []) ?? [];

  return {
    ...query,
    viewers,
  };
};

/** 9. Profiles You Viewed Infinite Feed */
export const useProfilesYouViewedQuery = () => {
  const query = useApiInfiniteQuery({
    queryKey: QUERY_KEYS.profilesYouViewed,
    url: ApiURL.profilesYouViewedFeed,
  });

  const profiles = query.data?.pages.flatMap(page => page?.list || []) ?? [];

  return {
    ...query,
    profiles,
  };
};

/** 10. Shortlist Candidates Infinite Feed */
export const useShortlistQuery = () => {
  const query = useApiInfiniteQuery({
    queryKey: QUERY_KEYS.shortlist,
    url: ApiURL.getShortlist,
  });

  const shortlisted = query.data?.pages.flatMap(page => page?.list || []) ?? [];

  return {
    ...query,
    shortlisted,
  };
};

/** 11. Received Interests Requests */
export const useInterestsReceivedQuery = () => {
  const query = useApiInfiniteQuery({
    queryKey: QUERY_KEYS.interestsReceived,
    url: ApiURL.interestsReceived,
  });

  const requests = query.data?.pages.flatMap(page => page?.list || []) ?? [];

  return {
    ...query,
    requests,
  };
};

/** 12. Sent Interests Requests */
export const useInterestsSentQuery = () => {
  const query = useApiInfiniteQuery({
    queryKey: QUERY_KEYS.interestsSent,
    url: ApiURL.interestsSent,
  });

  const requests = query.data?.pages.flatMap(page => page?.list || []) ?? [];

  return {
    ...query,
    requests,
  };
};

/** 12.1 Interests Sidebar Badge Counts */
export const useInterestsBadgeCountQuery = (enabled = true) => {
  return useApiQuery({
    queryKey: QUERY_KEYS.interestsBadgeCount,
    url: ApiURL.interestsBadgeCount,
    enabled,
    staleTime: 1000 * 60 * 3, // 3 minutes cache
  });
};

/** 12.2 Dashboard Interests Tab Feed */
export const useInterestsTabQuery = (
  section: 'received' | 'sent',
  filters: { status?: string; search?: string; page?: number; limit?: number } = {},
  enabled = true,
) => {
  const isReceived = section === 'received';
  const endpoint = isReceived ? ApiURL.interestsReceived : ApiURL.interestsSent;
  const statusParam = filters.status === 'all' || !filters.status ? 'ALL' : filters.status.toUpperCase();
  const searchParam = filters.search?.trim() || undefined;

  return useApiQuery({
    queryKey: QUERY_KEYS.interestsList(section, statusParam, searchParam),
    url: endpoint,
    params: {
      status: statusParam,
      search: searchParam,
      page: filters.page || 1,
      limit: filters.limit || 30,
    },
    enabled,
    staleTime: 1000 * 60 * 3, // 3 minutes cache
  });
};

/** 13. Chat Conversations List */
export const useConversationsQuery = () => {
  const query = useApiInfiniteQuery({
    queryKey: QUERY_KEYS.conversations,
    url: ApiURL.chatConversations,
  });

  const conversations = query.data?.pages.flatMap(page => page?.list || []) ?? [];

  return {
    ...query,
    conversations,
  };
};

/** 14. Notifications List */
export const useNotificationsQuery = () => {
  const query = useApiInfiniteQuery({
    queryKey: QUERY_KEYS.notifications,
    url: ApiURL.getNotificationsList,
  });

  const notifications = query.data?.pages.flatMap(page => page?.list || []) ?? [];

  return {
    ...query,
    notifications,
  };
};
