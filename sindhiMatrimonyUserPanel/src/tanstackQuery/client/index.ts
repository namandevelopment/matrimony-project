import { QueryClient } from '@tanstack/react-query';

// =============================================================================
// GLOBAL QUERY CLIENT (Equivalent to Redux Store/store.ts)
// =============================================================================

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 3 minutes fresh cache (instant page navigation without re-fetching)
      staleTime: 1000 * 60 * 3,

      // Inactive data garbage collection after 15 minutes
      gcTime: 1000 * 60 * 15,

      // Auto retry once on network glitch
      retry: 1,

      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

export default queryClient;
