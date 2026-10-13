import { useState, useCallback, useMemo, useRef } from 'react';

export type LoaderKey = string;

/**
 * Smart loading accessor supporting:
 * 1. Function invocation: `loading('profile')` or `loading()`
 * 2. Property access: `loading.profile`, `loading.default`, `loading.any`
 */
export type LoadingAccessor<K extends string = string> = {
  /**
   * Check a specific loader ID, or check default loader if called without args.
   * - `loading('profile')` -> boolean
   * - `loading()` -> boolean (evaluates default loader)
   */
  (key?: K | string): boolean;

  /**
   * Boolean state for default single-API loader: `loading.default`
   */
  default: boolean;

  /**
   * True if ANY loader is active: `loading.any`
   */
  any: boolean;

  /**
   * True if ANY loader is active: `loading.isLoading`
   */
  isLoading: boolean;
} & {
  /**
   * Property access for any named loader:
   * e.g. `loading.profile`, `loading.matches`, `loading.submit`
   */
  [key in K]: boolean;
} & {
  [key: string]: boolean;
};

export interface UseLoaderReturn<K extends string = string> {
  /**
   * Smart `loading` variable!
   * Use it however you like:
   * - Single API: `loading={loading}`
   * - Specific API: `loading={loading('matches')}` or `loading.matches`
   * - Global screen overlay: `loading.any`
   */
  loading: LoadingAccessor<K>;

  /**
   * Pure primitive boolean (true if any loader is active).
   * Perfect for `<FullScreenLoader visible={isLoading} />`.
   */
  isLoading: boolean;

  /**
   * True if any loader key is currently active.
   */
  isAnyLoading: boolean;

  /**
   * Raw record mapping each loader key to its current boolean state.
   */
  loaders: Record<K | 'default', boolean>;

  /**
   * Optional loading status message (e.g. "Uploading photo...").
   */
  message: string;

  /**
   * Activate a loader. Stable callback reference across re-renders.
   * - Single API usage: `showLoader()`
   * - Multiple API usage: `showLoader('profile')`
   */
  showLoader: (loaderIdOrMsg?: K | string, msg?: string) => void;

  /**
   * Deactivate a loader. Stable callback reference across re-renders.
   * - Single API usage: `hideLoader()`
   * - Multiple API usage: `hideLoader('profile')`
   */
  hideLoader: (loaderId?: K | string) => void;

  /**
   * Check if a specific named loader is active (alias to `loading(key)`).
   */
  isLoaderActive: (loaderId?: K | string) => boolean;

  /**
   * Alias for `isLoaderActive`.
   */
  isLoadingFor: (loaderId: K | string) => boolean;

  /**
   * Wrap an async API call with automatic show/hide lifecycle & error safety.
   * Stable callback reference across re-renders.
   */
  withLoading: <T>(fn: () => Promise<T>, loaderId?: K | string) => Promise<T>;

  /**
   * Reset all loaders back to false and clear message.
   * Stable callback reference across re-renders.
   */
  resetLoaders: () => void;
}

/**
 * Highly optimized universal loader hook with zero-cost bailout guards.
 * Avoids unnecessary re-renders when:
 * 1. An already-active loader is called with `showLoader` again (bailed out).
 * 2. An inactive/false loader is called with `hideLoader` again (bailed out).
 * 3. `resetLoaders` is called when no loader was active (bailed out).
 * 4. All returned action functions (`showLoader`, `hideLoader`, `withLoading`) maintain 100% stable references.
 */
export const useLoader = <K extends string = string>(
  initialState: boolean | Record<K, boolean> = false,
): UseLoaderReturn<K> => {
  const [loaders, setLoaders] = useState<Record<string, boolean>>(() => {
    if (typeof initialState === 'boolean') {
      return { default: initialState };
    }
    if (typeof initialState === 'object' && initialState !== null) {
      return { default: false, ...initialState };
    }
    return { default: false };
  });

  const [message, setMessage] = useState<string>('');

  // Refs for tracking latest state without causing callback re-creation
  const loadersRef = useRef<Record<string, boolean>>(loaders);
  loadersRef.current = loaders;

  const messageRef = useRef<string>(message);
  messageRef.current = message;

  // ─── 1. showLoader (Bails out if already active) ───────────────────────────
  const showLoader = useCallback((loaderIdOrMsg: K | string = 'default', msg?: string) => {
    const isId = typeof msg === 'string' || loaderIdOrMsg === 'default' || !loaderIdOrMsg.includes(' ');
    const id = isId ? loaderIdOrMsg : 'default';
    const messageText = isId ? (msg || '') : loaderIdOrMsg;

    if (messageText && messageText !== messageRef.current) {
      setMessage(messageText);
    }

    setLoaders(prev => {
      // ⚡️ Bail out of re-render if this loader is already true
      if (prev[id] === true) return prev;
      return {
        ...prev,
        [id]: true,
      };
    });
  }, []);

  // ─── 2. hideLoader (Bails out if already inactive) ─────────────────────────
  const hideLoader = useCallback((loaderId: K | string = 'default') => {
    if (messageRef.current !== '') {
      setMessage('');
    }

    setLoaders(prev => {
      // ⚡️ Bail out of re-render if loader is already inactive/false
      if (!prev[loaderId]) return prev;
      return {
        ...prev,
        [loaderId]: false,
      };
    });
  }, []);

  // ─── 3. resetLoaders (Bails out if nothing is active) ──────────────────────
  const resetLoaders = useCallback(() => {
    if (messageRef.current !== '') {
      setMessage('');
    }

    setLoaders(prev => {
      const hasAnyActive = Object.values(prev).some(Boolean);
      // ⚡️ Bail out if already all false
      if (!hasAnyActive) return prev;
      return { default: false };
    });
  }, []);

  // ─── 4. isLoaderActive (Stable callback via ref) ───────────────────────────
  const isLoaderActive = useCallback((loaderId: K | string = 'default'): boolean => {
    return Boolean(loadersRef.current[loaderId]);
  }, []);

  const isLoadingFor = isLoaderActive;

  // ─── 5. Computed States ───────────────────────────────────────────────────
  const isAnyLoading = useMemo(() => {
    return Object.values(loaders).some(Boolean);
  }, [loaders]);

  const isLoading = isAnyLoading;

  // ─── 6. Smart Loading Accessor (Proxy + Function) ─────────────────────────
  const loading = useMemo(() => {
    const isDefault = Boolean(loaders.default);

    const loadingFn = (key?: K | string): boolean => {
      if (!key) return isDefault;
      return Boolean(loaders[key]);
    };

    loadingFn.valueOf = () => isDefault;
    loadingFn.toString = () => String(isDefault);
    (loadingFn as any)[Symbol.toPrimitive] = () => isDefault;

    return new Proxy(loadingFn, {
      apply(target, _thisArg, argArray) {
        const key = argArray[0];
        if (!key) return isDefault;
        return Boolean(loaders[key]);
      },
      get(target, prop, receiver) {
        if (prop === 'default') return isDefault;
        if (prop === 'any' || prop === 'isLoading') return isAnyLoading;
        if (prop === 'valueOf') return () => isDefault;
        if (prop === 'toString') return () => String(isDefault);
        if (prop === Symbol.toPrimitive) return () => isDefault;
        if (typeof prop === 'string') {
          if (prop in target) {
            return (target as any)[prop];
          }
          return Boolean(loaders[prop]);
        }
        return Reflect.get(target, prop, receiver);
      },
    }) as unknown as LoadingAccessor<K>;
  }, [loaders, isAnyLoading]);

  // ─── 7. withLoading Helper (Stable callback) ──────────────────────────────
  const withLoading = useCallback(
    async <T>(fn: () => Promise<T>, loaderId: K | string = 'default'): Promise<T> => {
      showLoader(loaderId);
      try {
        return await fn();
      } finally {
        hideLoader(loaderId);
      }
    },
    [showLoader, hideLoader],
  );

  return {
    loading,
    isLoading,
    isAnyLoading,
    loaders: loaders as Record<K | 'default', boolean>,
    message,
    showLoader,
    hideLoader,
    isLoaderActive,
    isLoadingFor,
    withLoading,
    resetLoaders,
  };
};

export default useLoader;