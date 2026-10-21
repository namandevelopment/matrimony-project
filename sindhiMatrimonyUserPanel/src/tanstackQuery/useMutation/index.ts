import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { apiFetch, apiRequest } from '../../redux/apiService';
import { ApiURL } from '../../redux/apiService/endpoint';
import { QUERY_KEYS } from '../keys';
import {
  updateQueryCache,
  updateItemInQueryCache,
  removeItemFromQueryCache,
  addItemToQueryCache,
} from '../optimisticUpdate';

// =============================================================================
// BASE MUTATION WRAPPER (Equivalent to useDispatch / Thunk invoker)
// =============================================================================

export interface MutationParams {
  url: string;
  method?: 'POST' | 'PUT' | 'PATCH' | 'DELETE' | string;
  data?: any;
  params?: Record<string, any>;
  isToken?: boolean;
}

export interface UseApiMutationOptions<TResponse = any, TVariables extends MutationParams = MutationParams> {
  invalidateQueries?: (readonly any[] | any[])[];

  // ⚡ Direct Object Cache Update (e.g. Profile) - NO GET call needed!
  updateCache?: {
    queryKey: readonly any[] | any[];
    data?: Record<string, any> | ((old: any, res: TResponse, variables: TVariables) => any);
  };

  // ⚡ Direct List Item Update (e.g. Matches Card) - NO GET call needed!
  updateItem?: {
    queryKey: readonly any[] | any[];
    id: string | ((variables: TVariables) => string);
    data: Record<string, any> | ((variables: TVariables, res: TResponse) => Record<string, any>);
  };

  // ⚡ Direct Remove from List
  removeItem?: {
    queryKey: readonly any[] | any[];
    id: string | ((variables: TVariables) => string);
  };

  // ⚡ Direct Add to List
  addItem?: {
    queryKey: readonly any[] | any[];
    item: Record<string, any> | ((res: TResponse, variables: TVariables) => Record<string, any>);
    prepend?: boolean;
  };

  onMutate?: (variables: TVariables) => Promise<any> | any;
  onSuccess?: (data: TResponse, variables: TVariables, context: unknown) => void;
  onError?: (error: any, variables: TVariables, context: unknown) => void;
  mutationOptions?: Omit<UseMutationOptions<TResponse, any, TVariables>, 'mutationFn'>;
}

export const useApiMutation = <TResponse = any, TVariables extends MutationParams = MutationParams>(
  options?: UseApiMutationOptions<TResponse, TVariables>,
) => {
  const queryClient = useQueryClient();

  return useMutation<TResponse, any, TVariables>({
    mutationFn: async ({
      url,
      method = 'POST',
      data = {},
      params = {},
      isToken = true,
    }: TVariables) => {
      const res = await apiFetch<TResponse>({
        url,
        method: method as any,
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

    onMutate: async variables => {
      if (options?.onMutate) {
        return await options.onMutate(variables);
      }
    },

    onSuccess: (resData, variables, context) => {
      // 1. Direct Object Cache Update (e.g. Profile)
      if (options?.updateCache) {
        const { queryKey, data } = options.updateCache;
        const updatePayload =
          typeof data === 'function'
            ? (old: any) => data(old, resData, variables)
            : data ?? variables.data ?? resData;

        updateQueryCache(queryKey, updatePayload, queryClient);
      }

      // 2. Direct List Item Update (e.g. Matches Card)
      if (options?.updateItem) {
        const { queryKey, id, data } = options.updateItem;
        const resolvedId = typeof id === 'function' ? id(variables) : id;
        const resolvedData = typeof data === 'function' ? data(variables, resData) : data;

        if (resolvedId) {
          updateItemInQueryCache(queryKey, resolvedId, resolvedData, queryClient);
        }
      }

      // 3. Direct Remove Item from List Cache
      if (options?.removeItem) {
        const { queryKey, id } = options.removeItem;
        const resolvedId = typeof id === 'function' ? id(variables) : id;
        if (resolvedId) {
          removeItemFromQueryCache(queryKey, resolvedId, queryClient);
        }
      }

      // 4. Direct Add Item to List Cache
      if (options?.addItem) {
        const { queryKey, item, prepend = true } = options.addItem;
        const resolvedItem = typeof item === 'function' ? item(resData, variables) : item;
        if (resolvedItem) {
          addItemToQueryCache(queryKey, resolvedItem, prepend, queryClient);
        }
      }

      // 5. Invalidate Queries if specified
      if (options?.invalidateQueries && Array.isArray(options.invalidateQueries)) {
        options.invalidateQueries.forEach(qKey => {
          queryClient.invalidateQueries({ queryKey: qKey as any });
        });
      }

      options?.onSuccess?.(resData, variables, context);
    },

    onError: (error, variables, context) => {
      options?.onError?.(error, variables, context);
    },

    ...options?.mutationOptions,
  });
};

// =============================================================================
// SINDHI MATRIMONY SPECIFIC MUTATION HOOKS (Equivalent to useDispatch Actions)
// =============================================================================

/**
 * ⚡ 1. Update Profile Mutation
 * Automatically updates 'profile' cache directly - NO GET call needed!
 */
export const useUpdateProfileMutation = (onSuccessCallback?: (data: any) => void) => {
  return useApiMutation({
    updateCache: {
      queryKey: QUERY_KEYS.profile,
    },
    onSuccess: (data) => {
      onSuccessCallback?.(data);
    },
  });
};

/**
 * ⚡ 2. Send Interest Mutation
 * Automatically updates candidate status and invalidates sent interests list
 */
export const useSendInterestMutation = (candidateId?: string) => {
  return useApiMutation({
    invalidateQueries: [QUERY_KEYS.interestsSent, QUERY_KEYS.interestsBadgeCount, QUERY_KEYS.dashboardMatches],
    updateItem: candidateId
      ? {
          queryKey: QUERY_KEYS.allMatches(),
          id: candidateId,
          data: { interestSent: true, isConnected: true },
        }
      : undefined,
  });
};

/**
 * ⚡ 3. Shortlist Candidate Mutation
 * Toggles shortlist status on candidate card in all matches and dashboard matches
 */
export const useShortlistMutation = (candidateId?: string) => {
  return useApiMutation({
    invalidateQueries: [QUERY_KEYS.shortlist, QUERY_KEYS.dashboardMatches],
    updateItem: candidateId
      ? {
          queryKey: QUERY_KEYS.allMatches(),
          id: candidateId,
          data: (vars) => ({ isShortlisted: vars.data?.shortlist ?? true }),
        }
      : undefined,
  });
};

/**
 * ⚡ 4. Accept Interest Mutation
 * Removes request from 'interests-received' list instantly
 */
export const useAcceptInterestMutation = (interestId: string) => {
  return useApiMutation({
    removeItem: {
      queryKey: QUERY_KEYS.interestsReceived,
      id: interestId,
    },
    invalidateQueries: [QUERY_KEYS.interestsBadgeCount, QUERY_KEYS.conversations],
  });
};

/**
 * ⚡ 5. Decline Interest Mutation
 * Removes request from 'interests-received' list instantly
 */
export const useDeclineInterestMutation = (interestId: string) => {
  return useApiMutation({
    removeItem: {
      queryKey: QUERY_KEYS.interestsReceived,
      id: interestId,
    },
    invalidateQueries: [QUERY_KEYS.interestsBadgeCount],
  });
};

/**
 * ⚡ 6. Block User Mutation
 * Removes candidate from all matches feeds
 */
export const useBlockUserMutation = (userId: string) => {
  return useApiMutation({
    removeItem: {
      queryKey: QUERY_KEYS.allMatches(),
      id: userId,
    },
  });
};

/**
 * ⚡ 7. Save Preferred Rashi Mutation
 */
export const useSaveRashiMutation = () => {
  return useApiMutation({
    invalidateQueries: [QUERY_KEYS.dashboard, QUERY_KEYS.horoscope()],
  });
};

/**
 * ⚡ 8. Submit User Review Mutation
 */
export const useSubmitReviewMutation = () => {
  return useApiMutation({
    invalidateQueries: [QUERY_KEYS.reviews],
  });
};

/**
 * ⚡ 9. Share Success Story Mutation
 */
export const useShareSuccessStoryMutation = () => {
  return useApiMutation({
    invalidateQueries: [QUERY_KEYS.successStories()],
  });
};
