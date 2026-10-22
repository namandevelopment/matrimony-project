import { useQuery, useInfiniteQuery, type UseQueryOptions, type UseInfiniteQueryOptions } from '@tanstack/react-query';
import { apiRequest } from '../../redux/apiService';
import { ApiURL } from '../../redux/apiService/endpoint';
import { QUERY_KEYS } from '../keys';

// =============================================================================
// BASE QUERY WRAPPERS (Matching User Panel & Mobile)
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

export interface UseApiInfiniteQueryProps<_T = any> {
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
      const hasMore = lastPage?.hasMore ?? (lastPage?.pagination?.page < lastPage?.pagination?.totalPages);
      const list = Array.isArray(lastPage?.list)
        ? lastPage.list
        : Array.isArray(lastPage?.members)
          ? lastPage.members
          : Array.isArray(lastPage?.leads)
            ? lastPage.leads
            : Array.isArray(lastPage?.data)
              ? lastPage.data
              : Array.isArray(lastPage)
                ? lastPage
                : [];

      if (hasMore === false || list.length === 0) {
        return undefined;
      }
      return allPages.length + 1;
    },
    ...options,
  });
};

// =============================================================================
// SHARED SINDHI MATRIMONY QUERY HOOKS (Exact same as User Panel & Mobile)
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

  const matches = query.data?.pages.flatMap((page) => page?.list || []) ?? [];

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

  const matches = query.data?.pages.flatMap((page) => page?.list || []) ?? [];

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

  const matches = query.data?.pages.flatMap((page) => page?.list || []) ?? [];

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

  const viewers = query.data?.pages.flatMap((page) => page?.list || []) ?? [];

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

  const profiles = query.data?.pages.flatMap((page) => page?.list || []) ?? [];

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

  const shortlisted = query.data?.pages.flatMap((page) => page?.list || []) ?? [];

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

  const requests = query.data?.pages.flatMap((page) => page?.list || []) ?? [];

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

  const requests = query.data?.pages.flatMap((page) => page?.list || []) ?? [];

  return {
    ...query,
    requests,
  };
};

/** 13. Chat Conversations List */
export const useConversationsQuery = () => {
  const query = useApiInfiniteQuery({
    queryKey: QUERY_KEYS.conversations,
    url: ApiURL.conversationsList,
  });

  const conversations = query.data?.pages.flatMap((page) => page?.list || []) ?? [];

  return {
    ...query,
    conversations,
  };
};

/** 14. Notifications List */
export const useNotificationsQuery = () => {
  const query = useApiInfiniteQuery({
    queryKey: QUERY_KEYS.notifications,
    url: ApiURL.notificationsList,
  });

  const notifications = query.data?.pages.flatMap((page) => page?.list || []) ?? [];

  return {
    ...query,
    notifications,
  };
};

// =============================================================================
// ADMIN SPECIFIC QUERY HOOKS
// =============================================================================

/** Admin Dashboard Stats */
export const useDashboardStatsQuery = () => {
  return useApiQuery({
    queryKey: QUERY_KEYS.dashboardStats,
    url: ApiURL.dashboardStats,
  });
};

/** Admin Dashboard Action Queues */
export const useDashboardActionQueuesQuery = () => {
  return useApiQuery({
    queryKey: QUERY_KEYS.dashboardActionQueues,
    url: ApiURL.dashboardActionQueues,
  });
};

/** Admin Dashboard Charts Overview */
export const useDashboardChartsOverviewQuery = () => {
  return useApiQuery({
    queryKey: QUERY_KEYS.dashboardChartsOverview,
    url: ApiURL.dashboardChartsOverview,
  });
};

/** Admin Dashboard Charts */
export const useDashboardChartsQuery = (type: string) => {
  return useApiQuery({
    queryKey: QUERY_KEYS.dashboardCharts(type),
    url: ApiURL.dashboardCharts(type),
  });
};

/** Admin Leads Infinite / List Query */
export const useLeadsQuery = (filters: Record<string, any> = {}) => {
  const query = useApiInfiniteQuery({
    queryKey: QUERY_KEYS.leads(filters),
    url: ApiURL.getLeads,
    params: filters,
  });

  const leads = query.data?.pages.flatMap((page) => {
    if (Array.isArray(page?.leads)) return page.leads;
    if (Array.isArray(page?.list)) return page.list;
    if (Array.isArray(page?.data)) return page.data;
    if (Array.isArray(page)) return page;
    return [];
  }) ?? [];

  return {
    ...query,
    leads,
  };
};

/** Admin Lead Detail Query */
export const useLeadDetailQuery = (id: string, enabled = true) => {
  return useApiQuery({
    queryKey: QUERY_KEYS.leadDetail(id),
    url: ApiURL.getLeadDetail(id),
    enabled: !!id && enabled,
  });
};

/** Admin Members Query */
export const useMembersQuery = (filters: Record<string, any> = {}) => {
  const query = useApiInfiniteQuery({
    queryKey: QUERY_KEYS.members(filters),
    url: ApiURL.getMembers,
    params: filters,
  });

  const members = query.data?.pages.flatMap((page) => {
    if (Array.isArray(page?.members)) return page.members;
    if (Array.isArray(page?.list)) return page.list;
    if (Array.isArray(page?.data)) return page.data;
    if (Array.isArray(page)) return page;
    return [];
  }) ?? [];

  return {
    ...query,
    members,
  };
};

/** Admin Member Detail Query */
export const useMemberDetailQuery = (id: string, enabled = true) => {
  return useApiQuery({
    queryKey: QUERY_KEYS.memberDetail(id),
    url: ApiURL.getMemberDetail(id),
    enabled: !!id && enabled,
  });
};

/** Admin Pending Verifications Query */
export const usePendingVerificationsQuery = () => {
  return useApiQuery({
    queryKey: QUERY_KEYS.pendingVerifications,
    url: ApiURL.getPendingVerifications,
  });
};

/** Admin Finance Summary Query */
export const useFinanceSummaryQuery = () => {
  return useApiQuery({
    queryKey: QUERY_KEYS.financeSummary,
    url: ApiURL.getFinanceSummary,
  });
};

/** Admin Transactions Query */
export const useTransactionsQuery = (filters: Record<string, any> = {}) => {
  const query = useApiInfiniteQuery({
    queryKey: QUERY_KEYS.transactions(filters),
    url: ApiURL.getTransactions,
    params: filters,
  });

  const transactions = query.data?.pages.flatMap((page) => page?.list || page?.data || []) ?? [];

  return {
    ...query,
    transactions,
  };
};

/** Admin Pending Refunds Query */
export const usePendingRefundsQuery = () => {
  return useApiQuery({
    queryKey: QUERY_KEYS.pendingRefunds,
    url: ApiURL.getPendingRefunds,
  });
};

/** Admin Plans Query */
export const usePlansQuery = () => {
  return useApiQuery({
    queryKey: QUERY_KEYS.plans,
    url: ApiURL.getPlans,
  });
};

/** Admin Subscriptions Query */
export const useSubscriptionsQuery = (filters: Record<string, any> = {}) => {
  return useApiQuery({
    queryKey: QUERY_KEYS.subscriptions(filters),
    url: ApiURL.getSubscriptions,
    params: filters,
  });
};

/** Admin Campaigns Query */
export const useCampaignsQuery = () => {
  return useApiQuery({
    queryKey: QUERY_KEYS.campaigns,
    url: ApiURL.getCampaigns,
  });
};

/** Admin Employees Query */
export const useEmployeesQuery = (filters: Record<string, any> = {}) => {
  return useApiQuery({
    queryKey: QUERY_KEYS.employees(filters),
    url: ApiURL.getEmployees,
    params: filters,
  });
};

/** Admin Employee Detail Query */
export const useEmployeeDetailQuery = (id: string, enabled = true) => {
  return useApiQuery({
    queryKey: QUERY_KEYS.employeeDetail(id),
    url: ApiURL.getEmployeeDetail(id),
    enabled: !!id && enabled,
  });
};

/** Admin Audit Logs Query */
export const useAuditLogsQuery = (filters: Record<string, any> = {}) => {
  const query = useApiInfiniteQuery({
    queryKey: QUERY_KEYS.auditLogs(filters),
    url: ApiURL.getAuditLogs,
    params: filters,
  });

  const auditLogs = query.data?.pages.flatMap((page) => page?.list || page?.data || []) ?? [];

  return {
    ...query,
    auditLogs,
  };
};

/** Admin Subcastes Query */
export const useSubcastesQuery = () => {
  return useApiQuery({
    queryKey: QUERY_KEYS.subcastes,
    url: ApiURL.getSubcastes,
  });
};

/** Admin Gotras Query */
export const useGotrasQuery = () => {
  return useApiQuery({
    queryKey: QUERY_KEYS.gotras,
    url: ApiURL.getGotras,
  });
};
