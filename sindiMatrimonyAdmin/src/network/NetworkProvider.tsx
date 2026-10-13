import React, { useSyncExternalStore } from 'react';
import { networkService } from './networkService';
import type { NetworkStateSnapshot } from './networkService';
import { NoInternetModal } from './NoInternetModal';

export interface NetworkContextValue extends NetworkStateSnapshot {
  checkConnection: () => Promise<boolean>;
}

export interface NetworkProviderProps {
  children: React.ReactNode;
  /** Disable automatic modal overlay if handled elsewhere */
  showModal?: boolean;
}

/**
 * Universal NetworkProvider Wrapper.
 * Mount at the root level in App.tsx.
 *
 * Performance Features:
 * - Children are passed directly and NEVER re-rendered when network states fluctuate.
 * - Mounts the isolated <NoInternetModal /> overlay automatically.
 * - Provides synchronous access and subscription via useNetwork() hook.
 */
export const NetworkProvider: React.FC<NetworkProviderProps> = ({
  children,
  showModal = true,
}) => {
  return (
    <>
      {children}
      {showModal && <NoInternetModal />}
    </>
  );
};

/**
 * High-performance useNetwork hook.
 * Uses useSyncExternalStore to subscribe to networkService with 0 unnecessary re-renders.
 */
export function useNetwork(): NetworkContextValue {
  const snapshot = useSyncExternalStore(
    networkService.subscribe,
    networkService.getSnapshot,
    networkService.getSnapshot
  );

  return {
    ...snapshot,
    checkConnection: () => networkService.checkConnectivity(),
  };
}

export default NetworkProvider;
