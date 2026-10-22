import { useMutation, useQueryClient, UseMutationOptions, QueryClient } from '@tanstack/react-query';
import { apiFetch } from '../../redux/apiService';
import { ApiURL } from '../../redux/apiService/endpoint';
import { QUERY_KEYS } from '../keys';
import {
  updateQueryCache,
  updateItemInQueryCache,
  removeItemFromQueryCache,
  addItemToQueryCache,
  snapshotQueries,
  rollbackQueries,
  QuerySnapshot,
} from '../optimisticUpdate';

// =============================================================================
// BASE MUTATION WRAPPER (Equivalent to useDispatch / Thunk invoker)
// =============================================================================

export interface MutationParams {
  url?: string;
  method?: 'POST' | 'PUT' | 'PATCH' | 'DELETE' | string;
  data?: any;
  params?: Record<string, any>;
  isToken?: boolean;
}

export interface OptimisticConfig<TVariables = MutationParams> {
  /** Queries to cancel and snapshot for rollback on error */
  snapshotQueryKeys?: (readonly any[] | any[])[];

  /** Direct object cache update (e.g. Profile) */
  updateCache?: {
    queryKey: readonly any[] | any[];
    data?: Record<string, any> | ((old: any, variables: TVariables) => any);
  };

  /** Direct list item update (e.g. Card action) */
  updateItem?: {
    queryKey: readonly any[] | any[];
    id: string | ((variables: TVariables) => string);
    data: Record<string, any> | ((variables: TVariables, oldItem: any) => Record<string, any>);
  };

  /** Direct remove from list (e.g. Block/Decline) */
  removeItem?: {
    queryKey: readonly any[] | any[];
    id: string | ((variables: TVariables) => string);
  };

  /** Direct add to list (e.g. New Review/Story) */
  addItem?: {
    queryKey: readonly any[] | any[];
    item: Record<string, any> | ((variables: TVariables) => Record<string, any>);
    prepend?: boolean;
  };

  /** Custom optimistic logic */
  custom?: (variables: TVariables, client: QueryClient) => Promise<any> | any;
}

export interface UseApiMutationOptions<TResponse = any, TVariables extends MutationParams = MutationParams> {
  defaultUrl?: string;
  defaultMethod?: string;
  invalidateQueries?: (readonly any[] | any[])[];

  /**
   * ⚡ OPTIMISTIC UPDATE CONFIG
   * Automatically executes in onMutate in sub-1ms and rolls back on error!
   */
  optimisticUpdate?: OptimisticConfig<TVariables>;

  /** Post-success direct updates (fallback) */
  updateCache?: {
    queryKey: readonly any[] | any[];
    data?: Record<string, any> | ((old: any, res: TResponse, variables: TVariables) => any);
  };

  updateItem?: {
    queryKey: readonly any[] | any[];
    id: string | ((variables: TVariables) => string);
    data: Record<string, any> | ((variables: TVariables, res: TResponse) => Record<string, any>);
  };

  removeItem?: {
    queryKey: readonly any[] | any[];
    id: string | ((variables: TVariables) => string);
  };

  addItem?: {
    queryKey: readonly any[] | any[];
    item: Record<string, any> | ((res: TResponse, variables: TVariables) => Record<string, any>);
    prepend?: boolean;
  };

  onMutate?: (variables: TVariables) => Promise<any> | any;
  onSuccess?: (data: TResponse, variables: TVariables, context: unknown) => void;
  onError?: (error: any, variables: TVariables, context: unknown) => void;
  onSettled?: (data: TResponse | undefined, error: any, variables: TVariables, context: unknown) => void;
  mutationOptions?: Omit<UseMutationOptions<TResponse, any, TVariables>, 'mutationFn'>;
}

export const useApiMutation = <TResponse = any, TVariables extends MutationParams = MutationParams>(
  options?: UseApiMutationOptions<TResponse, TVariables>,
) => {
  const queryClient = useQueryClient();

  return useMutation<TResponse, any, TVariables>({
    mutationFn: async ({
      url,
      method,
      data = {},
      params = {},
      isToken = true,
    }: TVariables) => {
      const targetUrl = url || options?.defaultUrl;
      if (!targetUrl) {
        throw new Error('Mutation URL is required');
      }
      const targetMethod = (method || options?.defaultMethod || 'POST') as any;
      const res = await apiFetch<TResponse>({
        url: targetUrl,
        method: targetMethod,
        data,
        params,
        isToken,
        showErrorToast: false,
        throwOnError: false,
      });
      if (res.error) {
        throw new Error(res.message || 'Mutation failed');
      }
      return (res.data !== undefined && res.data !== null ? res.data : res) as TResponse;
    },

    onMutate: async (variables: TVariables) => {
      let snapshots: QuerySnapshot[] = [];
      const opt = options?.optimisticUpdate;

      // 1. Gather all queries to snapshot for automatic rollback
      const queryKeysToSnapshot: (readonly any[] | any[])[] = [];

      if (opt?.snapshotQueryKeys) {
        queryKeysToSnapshot.push(...opt.snapshotQueryKeys);
      }
      if (opt?.updateCache?.queryKey) {
        queryKeysToSnapshot.push(opt.updateCache.queryKey);
      }
      if (opt?.updateItem?.queryKey) {
        queryKeysToSnapshot.push(opt.updateItem.queryKey);
      }
      if (opt?.removeItem?.queryKey) {
        queryKeysToSnapshot.push(opt.removeItem.queryKey);
      }
      if (opt?.addItem?.queryKey) {
        queryKeysToSnapshot.push(opt.addItem.queryKey);
      }

      if (queryKeysToSnapshot.length > 0) {
        snapshots = await snapshotQueries(queryKeysToSnapshot, queryClient);
      }

      // 2. Apply optimistic updates immediately
      if (opt?.updateCache) {
        const { queryKey, data } = opt.updateCache;
        const payload =
          typeof data === 'function' ? (old: any) => data(old, variables) : (data ?? variables.data);
        updateQueryCache(queryKey, payload, queryClient);
      }

      if (opt?.updateItem) {
        const { queryKey, id, data } = opt.updateItem;
        const resolvedId = typeof id === 'function' ? id(variables) : id;
        if (resolvedId) {
          updateItemInQueryCache(
            queryKey,
            resolvedId,
            (oldItem) => (typeof data === 'function' ? data(variables, oldItem) : data),
            queryClient,
          );
        }
      }

      if (opt?.removeItem) {
        const { queryKey, id } = opt.removeItem;
        const resolvedId = typeof id === 'function' ? id(variables) : id;
        if (resolvedId) {
          removeItemFromQueryCache(queryKey, resolvedId, queryClient);
        }
      }

      if (opt?.addItem) {
        const { queryKey, item, prepend = true } = opt.addItem;
        const resolvedItem = typeof item === 'function' ? item(variables) : item;
        if (resolvedItem) {
          addItemToQueryCache(queryKey, resolvedItem, prepend, queryClient);
        }
      }

      let customContext: any = null;
      if (opt?.custom) {
        customContext = await opt.custom(variables, queryClient);
      }

      let userContext: any = null;
      if (options?.onMutate) {
        userContext = await options.onMutate(variables);
      }

      return { snapshots, customContext, userContext };
    },

    onSuccess: (resData, variables, context: any) => {
      // Post-success updates (legacy or non-optimistic hooks)
      if (options?.updateCache) {
        const { queryKey, data } = options.updateCache;
        const updatePayload =
          typeof data === 'function'
            ? (old: any) => data(old, resData, variables)
            : data ?? variables.data ?? resData;

        updateQueryCache(queryKey, updatePayload, queryClient);
      }

      if (options?.updateItem) {
        const { queryKey, id, data } = options.updateItem;
        const resolvedId = typeof id === 'function' ? id(variables) : id;
        const resolvedData = typeof data === 'function' ? data(variables, resData) : data;

        if (resolvedId) {
          updateItemInQueryCache(queryKey, resolvedId, resolvedData, queryClient);
        }
      }

      if (options?.removeItem) {
        const { queryKey, id } = options.removeItem;
        const resolvedId = typeof id === 'function' ? id(variables) : id;
        if (resolvedId) {
          removeItemFromQueryCache(queryKey, resolvedId, queryClient);
        }
      }

      if (options?.addItem) {
        const { queryKey, item, prepend = true } = options.addItem;
        const resolvedItem = typeof item === 'function' ? item(resData, variables) : item;
        if (resolvedItem) {
          addItemToQueryCache(queryKey, resolvedItem, prepend, queryClient);
        }
      }

      options?.onSuccess?.(resData, variables, context?.userContext ?? context);
    },

    onError: (error, variables, context: any) => {
      // ⏪ Automatic Rollback to previous state on failure!
      if (context?.snapshots) {
        rollbackQueries(context.snapshots, queryClient);
      }
      options?.onError?.(error, variables, context?.userContext ?? context);
    },

    onSettled: (data, error, variables, context: any) => {
      // Background cache invalidation
      if (options?.invalidateQueries && Array.isArray(options.invalidateQueries)) {
        options.invalidateQueries.forEach((qKey) => {
          queryClient.invalidateQueries({ queryKey: qKey as any });
        });
      }
      options?.onSettled?.(data, error, variables, context?.userContext ?? context);
    },

    ...options?.mutationOptions,
  });
};

// =============================================================================
// SINDHI MATRIMONY SPECIFIC MUTATION HOOKS (Full Optimistic Support)
// =============================================================================

/**
 * ⚡ 1. Update Profile Mutation
 * Optimistically updates 'profile' cache in sub-1ms with automatic rollback!
 */
export const useUpdateProfileMutation = (onSuccessCallback?: (data: any) => void) => {
  return useApiMutation({
    defaultUrl: ApiURL.editProfile,
    defaultMethod: 'POST',
    optimisticUpdate: {
      snapshotQueryKeys: [QUERY_KEYS.profile, ['dashboard']],
      updateCache: {
        queryKey: QUERY_KEYS.profile,
        data: (old, vars) => ({ ...(old || {}), ...(vars.data || {}) }),
      },
    },
    invalidateQueries: [QUERY_KEYS.profile],
    onSuccess: (data) => {
      onSuccessCallback?.(data);
    },
  });
};

/**
 * ⚡ 1.1 Upload Profile Photo Mutation
 */
export const useUploadProfilePhotoMutation = (onSuccessCallback?: (data: any) => void) => {
  return useApiMutation({
    defaultUrl: ApiURL.uploadProfilePhoto,
    defaultMethod: 'POST',
    invalidateQueries: [QUERY_KEYS.profile],
    onSuccess: (data) => {
      onSuccessCallback?.(data);
    },
  });
};

/**
 * ⚡ 1.2 Delete Profile Photo Mutation
 */
export const useDeleteProfilePhotoMutation = (onSuccessCallback?: (data: any) => void) => {
  return useApiMutation({
    defaultMethod: 'DELETE',
    invalidateQueries: [QUERY_KEYS.profile],
    onSuccess: (data) => {
      onSuccessCallback?.(data);
    },
  });
};

/**
 * ⚡ 2. Send Interest Mutation (Full Optimistic Update)
 * Instantly marks interestSent: true across all match feeds, increments badge count, rolls back on error!
 */
export const useSendInterestMutation = (initialCandidateId?: string) => {
  return useApiMutation({
    defaultUrl: ApiURL.interestsSend,
    defaultMethod: 'POST',
    optimisticUpdate: {
      snapshotQueryKeys: [
        ['matches'],
        ['dashboard', 'matches'],
        QUERY_KEYS.interestsBadgeCount,
        QUERY_KEYS.interestsSent,
      ],
      custom: async (variables, client) => {
        const id =
          variables.data?.receiverProfileId ||
          variables.data?.receiverCandidateId ||
          variables.data?.candidateId ||
          initialCandidateId ||
          '';

        if (id) {
          // 1. Mark interestSent & isConnected in all match feeds & dashboard
          updateItemInQueryCache(['matches'], id, { interestSent: true, isConnected: true }, client);
          updateItemInQueryCache(['dashboard', 'matches'], id, { interestSent: true, isConnected: true }, client);
          updateQueryCache(QUERY_KEYS.userProfile(id), { interestSent: true, isConnected: true }, client);

          // 2. Increment sent badge count optimistically
          updateQueryCache(
            QUERY_KEYS.interestsBadgeCount,
            (old: any) => {
              if (!old) return old;
              const current = old.data || old;
              const nextSent = (Number(current.sent) || 0) + 1;
              return old.data ? { ...old, data: { ...current, sent: nextSent } } : { ...current, sent: nextSent };
            },
            client,
          );
        }
      },
    },
    invalidateQueries: [QUERY_KEYS.interestsSent, QUERY_KEYS.interestsBadgeCount],
  });
};

/**
 * ⚡ 3. Shortlist Candidate Mutation (Full Optimistic Update)
 * Instantly toggles isShortlisted on candidate card in all match feeds and dashboard, rolls back on error!
 */
export const useShortlistMutation = (initialCandidateId?: string) => {
  return useApiMutation({
    defaultUrl: ApiURL.getShortlist,
    defaultMethod: 'POST',
    optimisticUpdate: {
      snapshotQueryKeys: [
        ['matches'],
        ['dashboard', 'matches'],
        ['dashboard', 'home'],
        QUERY_KEYS.shortlist,
      ],
      custom: async (variables, client) => {
        const id =
          variables.data?.candidateId ||
          variables.params?.candidateId ||
          initialCandidateId ||
          (typeof variables.url === 'string' && variables.url.split('/').pop()) ||
          '';

        const willShortlist =
          variables.data?.shortlist !== undefined
            ? Boolean(variables.data.shortlist)
            : variables.data?.action === 'REMOVE'
            ? false
            : true;

        if (id) {
          // 1. Update in all match feeds (all, recommended, new, etc.)
          updateItemInQueryCache(['matches'], id, { isShortlisted: willShortlist }, client);
          // 2. Update in dashboard matches
          updateItemInQueryCache(['dashboard', 'matches'], id, { isShortlisted: willShortlist }, client);
          // 3. Update candidate profile view if open
          updateQueryCache(QUERY_KEYS.userProfile(id), { isShortlisted: willShortlist }, client);

          // 4. Update shortlist cache: if removed, remove from shortlist list
          if (!willShortlist) {
            removeItemFromQueryCache(QUERY_KEYS.shortlist, id, client);
          }
        }
      },
    },
    invalidateQueries: [QUERY_KEYS.shortlist],
  });
};

/**
 * ⚡ 4. Accept Interest Mutation (Full Optimistic Update)
 * Instantly marks item as ACCEPTED, decrements pending badge count, rolls back on error!
 */
export const useAcceptInterestMutation = (initialInterestId?: string) => {
  return useApiMutation({
    defaultMethod: 'PUT',
    optimisticUpdate: {
      snapshotQueryKeys: [
        QUERY_KEYS.interestsReceived,
        ['interests'],
        QUERY_KEYS.interestsBadgeCount,
      ],
      custom: async (variables, client) => {
        const id =
          variables.data?.interestId ||
          initialInterestId ||
          (typeof variables.url === 'string' && variables.url.split('/')[variables.url.split('/').length - 2]) ||
          '';

        if (id) {
          updateItemInQueryCache(['interests'], id, { status: 'ACCEPTED' }, client);

          updateQueryCache(
            QUERY_KEYS.interestsBadgeCount,
            (old: any) => {
              if (!old) return old;
              const current = old.data || old;
              const nextReceived = Math.max(0, (Number(current.received) || 0) - 1);
              return old.data
                ? { ...old, data: { ...current, received: nextReceived } }
                : { ...current, received: nextReceived };
            },
            client,
          );
        }
      },
    },
    invalidateQueries: [QUERY_KEYS.interestsBadgeCount, QUERY_KEYS.conversations],
  });
};

/**
 * ⚡ 5. Decline Interest Mutation (Full Optimistic Update)
 * Instantly marks item as DECLINED, decrements pending badge count, rolls back on error!
 */
export const useDeclineInterestMutation = (initialInterestId?: string) => {
  return useApiMutation({
    defaultMethod: 'PUT',
    optimisticUpdate: {
      snapshotQueryKeys: [
        QUERY_KEYS.interestsReceived,
        ['interests'],
        QUERY_KEYS.interestsBadgeCount,
      ],
      custom: async (variables, client) => {
        const id =
          variables.data?.interestId ||
          initialInterestId ||
          (typeof variables.url === 'string' && variables.url.split('/')[variables.url.split('/').length - 2]) ||
          '';

        if (id) {
          updateItemInQueryCache(['interests'], id, { status: 'DECLINED' }, client);

          updateQueryCache(
            QUERY_KEYS.interestsBadgeCount,
            (old: any) => {
              if (!old) return old;
              const current = old.data || old;
              const nextReceived = Math.max(0, (Number(current.received) || 0) - 1);
              return old.data
                ? { ...old, data: { ...current, received: nextReceived } }
                : { ...current, received: nextReceived };
            },
            client,
          );
        }
      },
    },
    invalidateQueries: [QUERY_KEYS.interestsBadgeCount],
  });
};

/**
 * ⚡ 6. Block User Mutation (Full Optimistic Update)
 * Instantly removes candidate from all match feeds
 */
export const useBlockUserMutation = (initialUserId?: string) => {
  return useApiMutation({
    defaultUrl: ApiURL.blockUser,
    defaultMethod: 'POST',
    optimisticUpdate: {
      snapshotQueryKeys: [['matches'], ['dashboard', 'matches']],
      custom: async (variables, client) => {
        const id = variables.data?.userId || variables.data?.candidateId || initialUserId || '';
        if (id) {
          removeItemFromQueryCache(['matches'], id, client);
          removeItemFromQueryCache(['dashboard', 'matches'], id, client);
        }
      },
    },
  });
};

/**
 * ⚡ 7. Request Photo Mutation (Full Optimistic Update)
 * Instantly marks photoRequested: true on candidate card
 */
export const useRequestPhotoMutation = (candidateId?: string) => {
  return useApiMutation({
    optimisticUpdate: {
      snapshotQueryKeys: [['matches'], ['dashboard', 'matches']],
      custom: async (variables, client) => {
        const id = variables.data?.candidateId || candidateId || '';
        if (id) {
          updateItemInQueryCache(['matches'], id, { photoRequested: true }, client);
          updateItemInQueryCache(['dashboard', 'matches'], id, { photoRequested: true }, client);
          updateQueryCache(QUERY_KEYS.userProfile(id), { photoRequested: true }, client);
        }
      },
    },
  });
};

/**
 * ⚡ 8. Save Preferred Rashi Mutation
 */
export const useSaveRashiMutation = () => {
  return useApiMutation({
    defaultUrl: ApiURL.saveRashi,
    defaultMethod: 'POST',
    invalidateQueries: [QUERY_KEYS.dashboard, ['dashboard', 'horoscope']],
  });
};

/**
 * ⚡ 9. Submit User Review Mutation
 */
export const useSubmitReviewMutation = () => {
  return useApiMutation({
    defaultUrl: ApiURL.reviewsPublicList,
    defaultMethod: 'POST',
    optimisticUpdate: {
      snapshotQueryKeys: [QUERY_KEYS.reviews],
      addItem: {
        queryKey: QUERY_KEYS.reviews,
        item: (vars) => ({
          _id: `temp_${Date.now()}`,
          rating: 5,
          status: 'PENDING',
          createdAt: new Date().toISOString(),
          ...(vars.data || {}),
        }),
        prepend: true,
      },
    },
    invalidateQueries: [QUERY_KEYS.reviews],
  });
};

/**
 * ⚡ 10. Share Success Story Mutation
 */
export const useShareSuccessStoryMutation = () => {
  return useApiMutation({
    defaultUrl: ApiURL.shareSuccessStory,
    defaultMethod: 'POST',
    optimisticUpdate: {
      snapshotQueryKeys: [['dashboard', 'success-stories']],
      addItem: {
        queryKey: QUERY_KEYS.successStories(),
        item: (vars) => ({
          _id: `temp_story_${Date.now()}`,
          status: 'PENDING',
          createdAt: new Date().toISOString(),
          ...(vars.data || {}),
        }),
        prepend: true,
      },
    },
    invalidateQueries: [['dashboard', 'success-stories']],
  });
};
