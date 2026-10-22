// =============================================================================
// TANSTACK QUERY MAIN ENTRY POINT (Mirroring Redux Architecture)
// =============================================================================

// 1. Client / Store (Equivalent to Redux Store/store.ts)
export { queryClient, queryClient as default, default as defaultQueryClient } from './client';

// 2. Query Keys (Equivalent to Redux slices state keys)
export { QUERY_KEYS } from './keys';

// 3. Query Hooks (Equivalent to Redux useSelector/index.tsx)
export {
  useApiQuery,
  useApiInfiniteQuery,
  useProfileQuery,
  useCandidateProfileQuery,
  useDashboardQuery,
  useDashboardFeedQuery,
  useDashboardMatchesQuery,
  useSuccessStoriesQuery,
  useReviewsQuery,
  useHoroscopeQuery,
  useMasterDropdownsQuery,
  useCountriesQuery,
  useAllMatchesQuery,
  useRecommendedMatchesQuery,
  useNewMatchesQuery,
  useWhoViewedYouQuery,
  useProfilesYouViewedQuery,
  useShortlistQuery,
  useInterestsReceivedQuery,
  useInterestsSentQuery,
  useInterestsBadgeCountQuery,
  useInterestsTabQuery,
  useConversationsQuery,
  useNotificationsQuery,
} from './useQuery';

// 4. Mutation Hooks (Equivalent to Redux useDispatch/index.tsx)
export {
  useApiMutation,
  useUpdateProfileMutation,
  useUploadProfilePhotoMutation,
  useDeleteProfilePhotoMutation,
  useSendInterestMutation,
  useShortlistMutation,
  useAcceptInterestMutation,
  useDeclineInterestMutation,
  useBlockUserMutation,
  useRequestPhotoMutation,
  useSaveRashiMutation,
  useSubmitReviewMutation,
  useShareSuccessStoryMutation,
} from './useMutation';

// 5. Optimistic & Cache Updaters (Equivalent to Redux Action/optimisticUpdate.ts)
export {
  updateQueryCache,
  updateItemInQueryCache,
  removeItemFromQueryCache,
  addItemToQueryCache,
  snapshotQueries,
  rollbackQueries,
  isItemMatch,
  useUpdateQueryCache,
} from './optimisticUpdate';

