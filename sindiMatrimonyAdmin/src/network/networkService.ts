import fastDeepEqual from 'fast-deep-equal';

export interface NetworkStateSnapshot {
  isOnline: boolean;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  lastChecked: number;
}

type NetworkListener = (state: NetworkStateSnapshot) => void;

class NetworkService {
  private state: NetworkStateSnapshot;
  private listeners = new Set<NetworkListener>();
  private isChecking = false;

  constructor() {
    const isOnline = typeof window !== 'undefined' ? window.navigator.onLine : true;
    this.state = {
      isOnline,
      lastChecked: Date.now(),
      effectiveType: this.getConnectionInfo()?.effectiveType,
      downlink: this.getConnectionInfo()?.downlink,
      rtt: this.getConnectionInfo()?.rtt,
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('online', this.handleOnline);
      window.addEventListener('offline', this.handleOffline);

      // Listen to NetworkInformation API if supported in modern browsers
      const connection = this.getConnection();
      if (connection && typeof connection.addEventListener === 'function') {
        connection.addEventListener('change', this.handleConnectionChange);
      }
    }
  }

  private getConnection(): any {
    if (typeof navigator !== 'undefined') {
      return (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    }
    return null;
  }

  private getConnectionInfo() {
    const conn = this.getConnection();
    if (!conn) return undefined;
    return {
      effectiveType: conn.effectiveType,
      downlink: conn.downlink,
      rtt: conn.rtt,
    };
  }

  private handleOnline = () => {
    this.checkConnectivity();
  };

  private handleOffline = () => {
    this.updateState({
      isOnline: false,
      lastChecked: Date.now(),
    });
  };

  private handleConnectionChange = () => {
    const connInfo = this.getConnectionInfo();
    this.updateState({
      ...connInfo,
      lastChecked: Date.now(),
    });
  };

  private updateState(partial: Partial<NetworkStateSnapshot>) {
    const nextState: NetworkStateSnapshot = {
      ...this.state,
      ...partial,
      lastChecked: Date.now(),
    };

    // Deep equality check: If state hasn't meaningfully changed, DO NOT notify listeners (0 re-renders!)
    if (!fastDeepEqual(this.state, nextState)) {
      this.state = nextState;
      this.listeners.forEach((listener) => {
        try {
          listener(this.state);
        } catch (err) {
          console.error('[NetworkService] Listener error:', err);
        }
      });
    }
  }

  /**
   * Fast, non-blocking synchronous check (0ms delay, zero re-renders)
   */
  public isOnline(): boolean {
    return this.state.isOnline;
  }

  /**
   * Get immutable snapshot of current network state
   */
  public getSnapshot = (): NetworkStateSnapshot => {
    return this.state;
  };

  /**
   * Subscribe to network changes with an un-subscribe cleanup function
   */
  public subscribe = (listener: NetworkListener): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  /**
   * Active verification ping (validates actual internet connectivity beyond simple browser flag)
   */
  public async checkConnectivity(): Promise<boolean> {
    if (this.isChecking) return this.state.isOnline;
    this.isChecking = true;

    if (typeof window !== 'undefined' && !window.navigator.onLine) {
      this.updateState({ isOnline: false });
      this.isChecking = false;
      return false;
    }

    try {
      // Lightweight cache-busted fetch to test real network throughput
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      // Ping favicon or lightweight origin endpoint
      await fetch(`/favicon.ico?_ping=${Date.now()}`, {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-store',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      this.updateState({ isOnline: true });
      this.isChecking = false;
      return true;
    } catch {
      // If head request fails or aborts, fallback to browser state or false
      const online = typeof window !== 'undefined' ? window.navigator.onLine : false;
      this.updateState({ isOnline: online });
      this.isChecking = false;
      return online;
    }
  }
}

export const networkService = new NetworkService();
export default networkService;
