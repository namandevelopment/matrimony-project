import { QueryClient } from '@tanstack/react-query';

// =============================================================================
// GLOBAL QUERY CLIENT (Equivalent to Redux Store/store.ts)
// =============================================================================

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 5 minutes fresh cache (instant page navigation without re-fetching)
      staleTime: 1000 * 60 * 5,

      // Inactive data garbage collection after 30 minutes
      gcTime: 1000 * 60 * 30,

      // Auto retry once on network glitch
      retry: 1,

      // Do NOT refetch on remount if data already exists in cache
      refetchOnMount: false,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

export default queryClient;
