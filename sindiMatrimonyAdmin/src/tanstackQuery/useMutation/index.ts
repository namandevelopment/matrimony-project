import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';
import { apiRequest } from '../../redux/apiService';
import { QUERY_KEYS } from '../keys';
import {
  updateQueryCache,
  updateItemInQueryCache,
  removeItemFromQueryCache,
  addItemToQueryCache,
} from '../optimisticUpdate';

// =============================================================================
// BASE MUTATION WRAPPER (Matching User Panel & Mobile)
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

  // ⚡ Direct List Item Update (e.g. Matches Card / Lead Card) - NO GET call needed!
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
    mutationFn: ({
      url,
      method = 'POST',
      data = {},
      params = {},
      isToken = true,
    }: TVariables) =>
      apiRequest<TResponse>({
        url,
        method: method as any,
        data,
        params,
        isToken,
      }),

    onMutate: async (variables) => {
      if (options?.onMutate) {
        return await options.onMutate(variables);
      }
    },

    onSuccess: (resData, variables, context) => {
      // 1. Direct Object Cache Update
      if (options?.updateCache) {
        const { queryKey, data } = options.updateCache;
        const updatePayload =
          typeof data === 'function'
            ? (old: any) => data(old, resData, variables)
            : data ?? variables.data ?? resData;

        updateQueryCache(queryKey, updatePayload, queryClient);
      }

      // 2. Direct List Item Update
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
        options.invalidateQueries.forEach((qKey) => {
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
// SHARED SINDHI MATRIMONY MUTATION HOOKS (Exact same as User Panel & Mobile)
// =============================================================================

/**
 * ⚡ 1. Update Profile Mutation
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
 */
export const useSendInterestMutation = (candidateId?: string) => {
  return useApiMutation({
    invalidateQueries: [QUERY_KEYS.interestsSent, QUERY_KEYS.interestsBadgeCount],
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
 */
export const useShortlistMutation = (candidateId: string) => {
  return useApiMutation({
    invalidateQueries: [QUERY_KEYS.shortlist],
    updateItem: {
      queryKey: QUERY_KEYS.allMatches(),
      id: candidateId,
      data: (vars) => ({ isShortlisted: vars.data?.shortlist ?? true }),
    },
  });
};

/**
 * ⚡ 4. Accept Interest Mutation
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
 */
export const useBlockUserMutation = (userId: string) => {
  return useApiMutation({
    removeItem: {
      queryKey: QUERY_KEYS.allMatches(),
      id: userId,
    },
  });
};

// =============================================================================
// ADMIN SPECIFIC MUTATION HOOKS
// =============================================================================

/** Update Lead Status */
export const useUpdateLeadStatusMutation = (leadId?: string) => {
  return useApiMutation({
    invalidateQueries: [QUERY_KEYS.dashboardStats, QUERY_KEYS.leads()],
    updateItem: leadId
      ? {
          queryKey: QUERY_KEYS.leads(),
          id: leadId,
          data: (vars) => ({ status: vars.data?.status }),
        }
      : undefined,
  });
};

/** Add Lead Note */
export const useAddLeadNoteMutation = (leadId: string) => {
  return useApiMutation({
    invalidateQueries: [QUERY_KEYS.leadDetail(leadId)],
  });
};

/** Set Lead Follow-Up */
export const useSetFollowUpMutation = (leadId: string) => {
  return useApiMutation({
    invalidateQueries: [QUERY_KEYS.leadDetail(leadId), QUERY_KEYS.leads()],
  });
};

/** Bulk Assign Leads */
export const useBulkAssignLeadsMutation = () => {
  return useApiMutation({
    invalidateQueries: [QUERY_KEYS.leads()],
  });
};

/** Update Member Status */
export const useUpdateMemberStatusMutation = (memberId?: string) => {
  return useApiMutation({
    invalidateQueries: [QUERY_KEYS.members()],
    updateItem: memberId
      ? {
          queryKey: QUERY_KEYS.members(),
          id: memberId,
          data: (vars) => ({ status: vars.data?.status }),
        }
      : undefined,
  });
};

/** Verify Member */
export const useVerifyMemberMutation = (memberId: string) => {
  return useApiMutation({
    invalidateQueries: [QUERY_KEYS.memberDetail(memberId), QUERY_KEYS.members(), QUERY_KEYS.pendingVerifications],
  });
};

/** Approve Verification */
export const useApproveVerificationMutation = () => {
  return useApiMutation({
    invalidateQueries: [QUERY_KEYS.pendingVerifications, QUERY_KEYS.members()],
  });
};

/** Reject Verification */
export const useRejectVerificationMutation = () => {
  return useApiMutation({
    invalidateQueries: [QUERY_KEYS.pendingVerifications, QUERY_KEYS.members()],
  });
};

/** Approve Refund */
export const useApproveRefundMutation = () => {
  return useApiMutation({
    invalidateQueries: [QUERY_KEYS.pendingRefunds, QUERY_KEYS.financeSummary, QUERY_KEYS.transactions()],
  });
};

/** Reject Refund */
export const useRejectRefundMutation = () => {
  return useApiMutation({
    invalidateQueries: [QUERY_KEYS.pendingRefunds],
  });
};

/** Create Campaign */
export const useCreateCampaignMutation = () => {
  return useApiMutation({
    invalidateQueries: [QUERY_KEYS.campaigns],
  });
};

/** Pause Campaign */
export const usePauseCampaignMutation = () => {
  return useApiMutation({
    invalidateQueries: [QUERY_KEYS.campaigns],
  });
};

/** Update Employee Permissions */
export const useUpdateEmployeePermissionsMutation = (employeeId?: string) => {
  return useApiMutation({
    invalidateQueries: employeeId ? [QUERY_KEYS.employeeDetail(employeeId), QUERY_KEYS.employees()] : [QUERY_KEYS.employees()],
  });
};
