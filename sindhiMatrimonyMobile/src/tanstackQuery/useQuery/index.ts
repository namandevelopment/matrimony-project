import { useQuery, useInfiniteQuery, UseQueryOptions, UseInfiniteQueryOptions } from '@tanstack/react-query';
import { apiRequest } from '../../redux/apiService';
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
  staleTime,
  select,
  options = {},
}: UseApiQueryProps<T>) => {
  return useQuery<T>({
    queryKey: queryKey as any,
    enabled,
    staleTime,
    select,
    ...options,
    queryFn: () =>
      apiRequest<T>({
        url,
        method: 'GET',
        params,
        isToken,
      }),
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
      return await apiRequest({
        url,
        method: 'GET',
        params: {
          ...params,
          pageNo: pageParam,
          page: pageParam,
        },
        isToken,
      });
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

/** 2. Home Dashboard & Recommendations Feed */
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
