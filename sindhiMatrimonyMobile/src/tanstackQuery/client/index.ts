import { AppState, AppStateStatus, Platform } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { QueryClient, focusManager, onlineManager } from '@tanstack/react-query';

// =============================================================================
// REACT NATIVE NETWORK & APP STATE LISTENERS
// =============================================================================

// Automatically refetch queries when device regains internet connectivity
onlineManager.setEventListener(setOnline => {
  return NetInfo.addEventListener(state => {
    setOnline(state.isConnected !== false);
  });
});

// Automatically refetch stale queries when app comes back to foreground
AppState.addEventListener('change', (status: AppStateStatus) => {
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }
});

// =============================================================================
// GLOBAL QUERY CLIENT (Equivalent to Redux Store/store.ts)
// =============================================================================

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 3 minutes fresh cache (0ms instant screen transitions)
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
