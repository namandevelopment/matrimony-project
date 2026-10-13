import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AppState, AppStateStatus } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import equal from 'fast-deep-equal';
import InternetModal from '../customModals/InternetModal';

export const NETWORK_STATES = {
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  UNREACHABLE: 'unreachable',
  UNKNOWN: 'unknown',
} as const;

export type NetworkState = (typeof NETWORK_STATES)[keyof typeof NETWORK_STATES];

export const NETWORK_ERROR_CODES = {
  ABORTED: 'ABORTED',
  TIMEOUT: 'TIMEOUT',
  NETWORK: 'NETWORK',
  HTTP: 'HTTP',
  VALIDATION: 'VALIDATION',
  QUEUE_FULL: 'QUEUE_FULL',
  QUEUE_EXPIRED: 'QUEUE_EXPIRED',
  PROVIDER_UNMOUNTED: 'PROVIDER_UNMOUNTED',
  UNKNOWN: 'UNKNOWN',
} as const;

export type NetworkErrorCode =
  (typeof NETWORK_ERROR_CODES)[keyof typeof NETWORK_ERROR_CODES];

export interface NetworkInfoLike {
  readonly isConnected: boolean | null;
  readonly isInternetReachable: boolean | null;
  readonly type: string;
  readonly details?: unknown;
}

export interface NetworkSnapshot {
  readonly isConnected: boolean | null;
  readonly isInternetReachable: boolean | null;
  readonly isOnline: boolean;
  readonly connectionType: string | null;
  readonly networkState: NetworkState;
  readonly networkInfo: NetworkInfoLike | null;
}

export interface PreviousNetworkState {
  readonly isConnected: boolean | null;
  readonly isInternetReachable: boolean | null;
  readonly connectionType: string | null;
  readonly networkState: NetworkState;
}

export interface NetworkProviderState extends NetworkSnapshot {
  readonly isLoading: boolean;
  readonly previousState: PreviousNetworkState | null;
  readonly lastUpdated: number | null;
  readonly networkCheckRetryCount: number;
  readonly requestRetryCount: number;
  readonly retryCount: number;
}

export type NetworkCallback = (
  value: boolean | null,
  state: NetworkProviderState,
) => void;

export interface NetworkErrorDetails {
  readonly code: NetworkErrorCode;
  readonly status?: number;
  readonly retryable: boolean;
  readonly requestId?: string;
  readonly cause?: unknown;
}

export class NetworkError extends Error implements NetworkErrorDetails {
  readonly code: NetworkErrorCode;
  readonly status?: number;
  readonly retryable: boolean;
  readonly requestId?: string;
  readonly cause?: unknown;

  constructor(message: string, details: NetworkErrorDetails) {
    super(message);
    this.name = 'NetworkError';
    this.code = details.code;
    this.status = details.status;
    this.retryable = details.retryable;
    this.requestId = details.requestId;
    this.cause = details.cause;
  }
}

export interface RequestContext {
  readonly signal: AbortSignal;
  readonly requestId: string;
}

export type NetworkRequest<T> = (
  context: RequestContext,
) => Promise<T> | T;

export interface NetworkRequestOptions<T> {
  readonly id?: string;
  readonly retries?: number;
  readonly retryDelay?: number;
  readonly maxRetryDelay?: number;
  readonly timeout?: number;
  readonly fallback?: T | null;
  readonly throwErrors?: boolean;
  readonly queueWhenOffline?: boolean;
  readonly validateResponse?: (response: T) => boolean;
}

export interface QueuedRequestInfo {
  readonly id: string;
  readonly enqueuedAt: number;
  readonly expiresAt: number;
}

export interface NetworkProviderProps {
  readonly children: ReactNode;
  readonly onNetworkChange?: NetworkCallback;
  readonly onInternetReachableChange?: NetworkCallback;
  readonly pollingInterval?: number | null;
  readonly enableBackgroundCheck?: boolean;
  readonly backgroundRecheck?: boolean;
  readonly autoRetry?: boolean;
  readonly maxRetries?: number;
  readonly retryDelay?: number;
  readonly maxRetryDelay?: number;
  readonly requestTimeout?: number;
  readonly queueMaxSize?: number;
  readonly queueTtl?: number;
  readonly queueConcurrency?: number;
}

export interface NetworkContextValue extends NetworkProviderState {
  readonly isNetworkAvailable: boolean;
  readonly isOffline: boolean;
  readonly getNetworkTypeDisplay: () => string;
  readonly checkNetworkStatus: (
    attempts?: number,
  ) => Promise<NetworkSnapshot | null>;
  readonly getNetworkInfo: (timeout?: number) => Promise<NetworkInfoLike | null>;
  readonly forceRecheck: () => Promise<NetworkSnapshot | null>;
  readonly resetNetworkState: () => void;
  readonly makeNetworkRequest: <T>(
    request: NetworkRequest<T>,
    options?: NetworkRequestOptions<T>,
  ) => Promise<T | null>;
  readonly cancelRequest: (requestId?: string) => void;
  readonly cancelAllRequests: () => void;
  readonly getQueuedRequests: () => readonly QueuedRequestInfo[];
  readonly clearQueue: (reason?: NetworkErrorCode) => void;
  readonly processQueue: () => Promise<void>;
  readonly resetRetryCount: () => void;
}

interface QueueEntry {
  readonly id: string;
  readonly request: NetworkRequest<unknown>;
  readonly options: NetworkRequestOptions<unknown>;
  readonly enqueuedAt: number;
  readonly expiresAt: number;
  readonly resolve: (value: unknown) => void;
  readonly reject: (reason: NetworkError) => void;
  expirationTimer: ReturnType<typeof setTimeout> | null;
}

interface ActiveRequest {
  readonly id: string;
  controller: AbortController;
  cancelled: boolean;
}

interface ErrorRecord {
  readonly code?: unknown;
  readonly message?: unknown;
  readonly name?: unknown;
  readonly status?: unknown;
  readonly response?: unknown;
}

const DEFAULTS = {
  maxRetries: 3,
  retryDelay: 500,
  maxRetryDelay: 10_000,
  requestTimeout: 30_000,
  queueMaxSize: 50,
  queueTtl: 60_000,
  queueConcurrency: 2,
} as const;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const toErrorRecord = (error: unknown): ErrorRecord => {
  if (!isRecord(error)) return {};
  return error as ErrorRecord;
};

const getStatusCode = (error: unknown): number | undefined => {
  const record = toErrorRecord(error);
  if (typeof record.status === 'number') return record.status;
  if (!isRecord(record.response)) return undefined;
  const status = record.response.status;
  return typeof status === 'number' ? status : undefined;
};

const getMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  const message = toErrorRecord(error).message;
  return typeof message === 'string' ? message : 'Network request failed';
};

const getNetworkState = (
  isConnected: boolean | null,
  isInternetReachable: boolean | null,
): NetworkState => {
  if (isConnected === false) return NETWORK_STATES.DISCONNECTED;
  if (isConnected === true && isInternetReachable === false) {
    return NETWORK_STATES.UNREACHABLE;
  }
  if (isConnected === true && isInternetReachable === true) {
    return NETWORK_STATES.CONNECTED;
  }
  return NETWORK_STATES.UNKNOWN;
};

const toNetworkSnapshot = (networkInfo: NetworkInfoLike): NetworkSnapshot => {
  const isConnected = networkInfo.isConnected ?? null;
  const isInternetReachable = networkInfo.isInternetReachable ?? null;

  return {
    isConnected,
    isInternetReachable,
    isOnline: isConnected === true && isInternetReachable === true,
    connectionType: networkInfo.type ?? null,
    networkState: getNetworkState(isConnected, isInternetReachable),
    networkInfo,
  };
};

const createNetworkError = (
  message: string,
  code: NetworkErrorCode,
  options: Omit<NetworkErrorDetails, 'code'>,
): NetworkError => new NetworkError(message, { ...options, code });

const isAbortError = (error: unknown): boolean => {
  const record = toErrorRecord(error);
  return record.name === 'AbortError' || record.code === 'ABORT_ERR';
};

const isRetryableError = (error: unknown): boolean => {
  if (error instanceof NetworkError) return error.retryable;
  if (isAbortError(error)) return false;

  const status = getStatusCode(error);
  if (status !== undefined) {
    return status === 408 || status === 429 || status >= 500;
  }

  const record = toErrorRecord(error);
  const code = record.code;
  return (
    error instanceof TypeError ||
    code === 'ECONNABORTED' ||
    code === 'ETIMEDOUT' ||
    code === 'ERR_NETWORK' ||
    code === 'ENETUNREACH' ||
    code === 'EAI_AGAIN'
  );
};

const normalizeRequestError = (error: unknown, requestId: string): NetworkError => {
  if (error instanceof NetworkError) {
    return new NetworkError(error.message, {
      code: error.code,
      status: error.status,
      retryable: error.retryable,
      requestId,
      cause: error,
    });
  }

  if (isAbortError(error)) {
    return createNetworkError('Network request was cancelled', NETWORK_ERROR_CODES.ABORTED, {
      retryable: false,
      requestId,
      cause: error,
    });
  }

  const status = getStatusCode(error);
  if (status !== undefined) {
    return createNetworkError(
      getMessage(error),
      NETWORK_ERROR_CODES.HTTP,
      {
        status,
        retryable: status === 408 || status === 429 || status >= 500,
        requestId,
        cause: error,
      },
    );
  }

  return createNetworkError(
    getMessage(error),
    isRetryableError(error) ? NETWORK_ERROR_CODES.NETWORK : NETWORK_ERROR_CODES.UNKNOWN,
    {
      retryable: isRetryableError(error),
      requestId,
      cause: error,
    },
  );
};

const wait = (duration: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, duration));

const getBackoffDelay = (
  baseDelay: number,
  maxDelay: number,
  attempt: number,
): number => {
  const exponentialDelay = Math.min(maxDelay, baseDelay * 2 ** attempt);
  const jitter = exponentialDelay * (0.2 * Math.random());
  return Math.round(exponentialDelay + jitter);
};

const createInitialState = (): NetworkProviderState => ({
  isConnected: null,
  isInternetReachable: null,
  isOnline: false,
  connectionType: null,
  networkState: NETWORK_STATES.UNKNOWN,
  networkInfo: null,
  isLoading: true,
  previousState: null,
  lastUpdated: null,
  networkCheckRetryCount: 0,
  requestRetryCount: 0,
  retryCount: 0,
});

const NetworkContext = createContext<NetworkContextValue | null>(null);

export const NetworkProvider = ({
  children,
  onNetworkChange,
  onInternetReachableChange,
  pollingInterval = null,
  enableBackgroundCheck = true,
  backgroundRecheck = true,
  autoRetry = true,
  maxRetries = DEFAULTS.maxRetries,
  retryDelay = DEFAULTS.retryDelay,
  maxRetryDelay = DEFAULTS.maxRetryDelay,
  requestTimeout = DEFAULTS.requestTimeout,
  queueMaxSize = DEFAULTS.queueMaxSize,
  queueTtl = DEFAULTS.queueTtl,
  queueConcurrency = DEFAULTS.queueConcurrency,
}: NetworkProviderProps) => {
  const [state, setState] = useState<NetworkProviderState>(createInitialState);
  const stateRef = useRef<NetworkProviderState>(state);
  const mountedRef = useRef(true);
  const callbacksRef = useRef({ onNetworkChange, onInternetReachableChange });
  const queueRef = useRef<QueueEntry[]>([]);
  const queueProcessingRef = useRef(false);
  const activeRequestsRef = useRef<Map<string, ActiveRequest>>(new Map());
  const requestSequenceRef = useRef(0);
  const processQueueRef = useRef<() => Promise<void>>(() => Promise.resolve());
  const networkCheckSequenceRef = useRef(0);

  useEffect(() => {
    callbacksRef.current = { onNetworkChange, onInternetReachableChange };
  }, [onNetworkChange, onInternetReachableChange]);

  const commitState = useCallback((nextState: NetworkProviderState): void => {
    if (!mountedRef.current) return;
    // ⚡️ Bail out if state is deeply identical, avoiding full app re-renders
    if (equal(stateRef.current, nextState)) return;
    stateRef.current = nextState;
    setState(nextState);
  }, []);

  const updateNetworkState = useCallback((snapshot: NetworkSnapshot): void => {
    if (!mountedRef.current) return;

    const previous = stateRef.current;
    const isSameSnapshot =
      !previous.isLoading &&
      previous.isConnected === snapshot.isConnected &&
      previous.isInternetReachable === snapshot.isInternetReachable &&
      previous.connectionType === snapshot.connectionType &&
      previous.networkState === snapshot.networkState &&
      equal(previous.networkInfo?.details, snapshot.networkInfo?.details);

    if (isSameSnapshot) return;

    const nextState: NetworkProviderState = {
      ...previous,
      ...snapshot,
      isLoading: false,
      previousState: {
        isConnected: previous.isConnected,
        isInternetReachable: previous.isInternetReachable,
        connectionType: previous.connectionType,
        networkState: previous.networkState,
      },
      lastUpdated: Date.now(),
      networkCheckRetryCount: 0,
      retryCount: previous.requestRetryCount,
    };

    commitState(nextState);

    if (previous.isConnected !== snapshot.isConnected) {
      callbacksRef.current.onNetworkChange?.(snapshot.isConnected, nextState);
    }
    if (previous.isInternetReachable !== snapshot.isInternetReachable) {
      callbacksRef.current.onInternetReachableChange?.(
        snapshot.isInternetReachable,
        nextState,
      );
    }

    if (!previous.isOnline && snapshot.isOnline) {
      processQueueRef.current().catch(() => undefined);
    }
  }, [commitState]);

  const checkNetworkStatus = useCallback(async (
    attempts = maxRetries,
  ): Promise<NetworkSnapshot | null> => {
    const totalAttempts = Math.max(1, Math.floor(attempts));
    const checkSequence = networkCheckSequenceRef.current + 1;
    networkCheckSequenceRef.current = checkSequence;
    let lastError: unknown = null;

    for (let attempt = 0; attempt < totalAttempts; attempt += 1) {
      if (!mountedRef.current) return null;

      try {
        const networkInfo = (await NetInfo.fetch()) as NetworkInfoLike;
        const snapshot = toNetworkSnapshot(networkInfo);

        if (networkCheckSequenceRef.current === checkSequence) {
          updateNetworkState(snapshot);
        }
        return snapshot;
      } catch (error) {
        lastError = error;
        if (mountedRef.current && networkCheckSequenceRef.current === checkSequence) {
          const nextState: NetworkProviderState = {
            ...stateRef.current,
            networkCheckRetryCount: attempt + 1,
            retryCount: stateRef.current.requestRetryCount,
          };
          commitState(nextState);
        }

        if (attempt < totalAttempts - 1) {
          await wait(getBackoffDelay(retryDelay, maxRetryDelay, attempt));
        }
      }
    }

    if (lastError && mountedRef.current) {
      console.warn('Network status check failed:', getMessage(lastError));
    }
    return null;
  }, [commitState, maxRetryDelay, maxRetries, retryDelay, updateNetworkState]);

  const getNetworkInfo = useCallback(async (
    timeout = 5000,
  ): Promise<NetworkInfoLike | null> => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    try {
      const timeoutPromise = new Promise<NetworkInfoLike>((_, reject) => {
        timer = setTimeout(
          () => reject(new NetworkError('Network info request timed out', {
            code: NETWORK_ERROR_CODES.TIMEOUT,
            retryable: true,
          })),
          Math.max(0, timeout),
        );
      });
      return await Promise.race([NetInfo.fetch() as Promise<NetworkInfoLike>, timeoutPromise]);
    } catch (error) {
      if (mountedRef.current) console.warn('Unable to get network information:', getMessage(error));
      return null;
    } finally {
      if (timer) clearTimeout(timer);
    }
  }, []);

  const executeRequest = useCallback(async <T,>(
    request: NetworkRequest<T>,
    options: NetworkRequestOptions<T>,
    requestId: string,
  ): Promise<T | null> => {
    const retries = Math.max(0, Math.floor(options.retries ?? maxRetries));
    const baseDelay = Math.max(0, options.retryDelay ?? retryDelay);
    const maximumDelay = Math.max(baseDelay, options.maxRetryDelay ?? maxRetryDelay);
    const timeout = Math.max(0, options.timeout ?? requestTimeout);
    const activeRequest: ActiveRequest = {
      id: requestId,
      controller: new AbortController(),
      cancelled: false,
    };
    let lastError: NetworkError | null = null;

    activeRequestsRef.current.set(requestId, activeRequest);

    try {
      for (let attempt = 0; attempt <= retries; attempt += 1) {
        if (!mountedRef.current) {
          throw createNetworkError('Network provider was unmounted', NETWORK_ERROR_CODES.PROVIDER_UNMOUNTED, {
            retryable: false,
            requestId,
          });
        }
        if (activeRequest.cancelled) {
          throw createNetworkError('Network request was cancelled', NETWORK_ERROR_CODES.ABORTED, {
            retryable: false,
            requestId,
          });
        }

        let timedOut = false;
        let timer: ReturnType<typeof setTimeout> | null = null;
        const controller = new AbortController();
        activeRequest.controller = controller;

        try {
          const requestPromise = Promise.resolve(request({
            signal: controller.signal,
            requestId,
          }));
          const timeoutPromise = new Promise<never>((_, reject) => {
            timer = setTimeout(() => {
              timedOut = true;
              controller.abort();
              reject(createNetworkError('Network request timed out', NETWORK_ERROR_CODES.TIMEOUT, {
                retryable: true,
                requestId,
              }));
            }, timeout);
          });

          const response = await Promise.race([requestPromise, timeoutPromise]);
          if (activeRequest.cancelled || controller.signal.aborted) {
            throw createNetworkError('Network request was cancelled', NETWORK_ERROR_CODES.ABORTED, {
              retryable: false,
              requestId,
            });
          }
          if (options.validateResponse && !options.validateResponse(response)) {
            throw createNetworkError('Network response validation failed', NETWORK_ERROR_CODES.VALIDATION, {
              retryable: false,
              requestId,
            });
          }
          return response;
        } catch (error) {
          lastError = timedOut
            ? createNetworkError('Network request timed out', NETWORK_ERROR_CODES.TIMEOUT, {
              retryable: true,
              requestId,
              cause: error,
            })
            : normalizeRequestError(error, requestId);

          if (
            (controller.signal.aborted || activeRequest.cancelled) &&
            !timedOut &&
            lastError.code !== NETWORK_ERROR_CODES.TIMEOUT
          ) {
            lastError = createNetworkError('Network request was cancelled', NETWORK_ERROR_CODES.ABORTED, {
              retryable: false,
              requestId,
              cause: error,
            });
          }

          if (mountedRef.current) {
            const requestRetryCount = attempt + 1;
            commitState({
              ...stateRef.current,
              requestRetryCount,
              retryCount: requestRetryCount,
            });
          }

          if (!autoRetry || !lastError.retryable || attempt >= retries) break;
          await wait(getBackoffDelay(baseDelay, maximumDelay, attempt));
        } finally {
          if (timer) clearTimeout(timer);
        }
      }

      if (options.throwErrors === false) return options.fallback ?? null;
      throw lastError ?? createNetworkError('Network request failed', NETWORK_ERROR_CODES.UNKNOWN, {
        retryable: false,
        requestId,
      });
    } finally {
      activeRequestsRef.current.delete(requestId);
    }
  }, [autoRetry, commitState, maxRetryDelay, maxRetries, requestTimeout, retryDelay]);

  const removeQueueEntry = useCallback((entry: QueueEntry): void => {
    if (entry.expirationTimer) clearTimeout(entry.expirationTimer);
    const index = queueRef.current.indexOf(entry);
    if (index >= 0) queueRef.current.splice(index, 1);
  }, []);

  const processQueue = useCallback(async (): Promise<void> => {
    if (queueProcessingRef.current || !stateRef.current.isOnline || !mountedRef.current) return;
    queueProcessingRef.current = true;

    try {
      while (stateRef.current.isOnline && queueRef.current.length > 0 && mountedRef.current) {
        const concurrency = Number.isFinite(queueConcurrency)
          ? Math.max(1, Math.floor(queueConcurrency))
          : 1;
        const entries = queueRef.current.splice(0, concurrency);
        const validEntries = entries.filter(entry => {
          if (Date.now() < entry.expiresAt) return true;
          if (entry.expirationTimer) clearTimeout(entry.expirationTimer);
          entry.reject(createNetworkError('Queued request expired', NETWORK_ERROR_CODES.QUEUE_EXPIRED, {
            retryable: false,
            requestId: entry.id,
          }));
          return false;
        });

        await Promise.all(validEntries.map(async entry => {
          if (entry.expirationTimer) clearTimeout(entry.expirationTimer);
          try {
            entry.resolve(await executeRequest(entry.request, {
              ...entry.options,
              queueWhenOffline: false,
            }, entry.id));
          } catch (error) {
            entry.reject(normalizeRequestError(error, entry.id));
          }
        }));
      }
    } finally {
      queueProcessingRef.current = false;
      if (stateRef.current.isOnline && queueRef.current.length > 0 && mountedRef.current) {
        processQueueRef.current().catch(() => undefined);
      }
    }
  }, [executeRequest, queueConcurrency]);

  processQueueRef.current = processQueue;

  const makeNetworkRequest = useCallback(async <T,>(
    request: NetworkRequest<T>,
    options: NetworkRequestOptions<T> = {},
  ): Promise<T | null> => {
    const requestId = options.id ?? `request-${++requestSequenceRef.current}`;
    const normalizedOptions = {
      ...options,
      queueWhenOffline: options.queueWhenOffline ?? true,
    };
    const isOnline = stateRef.current.isOnline;

    if (!isOnline && normalizedOptions.queueWhenOffline) {
      if (queueRef.current.length >= Math.max(0, Math.floor(queueMaxSize))) {
        if (normalizedOptions.throwErrors === false) return normalizedOptions.fallback ?? null;
        throw createNetworkError('Offline request queue is full', NETWORK_ERROR_CODES.QUEUE_FULL, {
          retryable: false,
          requestId,
        });
      }

      const enqueuedAt = Date.now();
      const expiresAt = enqueuedAt + Math.max(0, queueTtl);
      return new Promise<T | null>((resolve, reject) => {
        const entry: QueueEntry = {
          id: requestId,
          request: request as NetworkRequest<unknown>,
          options: normalizedOptions as NetworkRequestOptions<unknown>,
          enqueuedAt,
          expiresAt,
          resolve: value => resolve(value as T | null),
          reject,
          expirationTimer: null,
        };
        entry.expirationTimer = setTimeout(() => {
          removeQueueEntry(entry);
          reject(createNetworkError('Queued request expired', NETWORK_ERROR_CODES.QUEUE_EXPIRED, {
            retryable: false,
            requestId,
          }));
        }, Math.max(0, queueTtl));
        queueRef.current.push(entry);
      });
    }

    if (!isOnline && normalizedOptions.throwErrors === false) {
      return normalizedOptions.fallback ?? null;
    }
    if (!isOnline) {
      throw createNetworkError('Network is not online', NETWORK_ERROR_CODES.NETWORK, {
        retryable: true,
        requestId,
      });
    }

    return executeRequest(request, normalizedOptions, requestId);
  }, [executeRequest, queueMaxSize, queueTtl, removeQueueEntry]);

  const cancelRequest = useCallback((requestId?: string): void => {
    const targetIds = requestId
      ? [requestId]
      : Array.from(activeRequestsRef.current.keys());

    targetIds.forEach(id => {
      const activeRequest = activeRequestsRef.current.get(id);
      if (activeRequest) {
        activeRequest.cancelled = true;
        activeRequest.controller.abort();
      }
      const queuedEntry = queueRef.current.find(entry => entry.id === id);
      if (queuedEntry) {
        removeQueueEntry(queuedEntry);
        queuedEntry.reject(createNetworkError('Network request was cancelled', NETWORK_ERROR_CODES.ABORTED, {
          retryable: false,
          requestId: id,
        }));
      }
    });
  }, [removeQueueEntry]);

  const cancelAllRequests = useCallback((): void => {
    cancelRequest();
    const queuedEntries = queueRef.current.splice(0);
    queuedEntries.forEach(entry => {
      if (entry.expirationTimer) clearTimeout(entry.expirationTimer);
      entry.reject(createNetworkError('Network request was cancelled', NETWORK_ERROR_CODES.ABORTED, {
        retryable: false,
        requestId: entry.id,
      }));
    });
  }, [cancelRequest]);

  const clearQueue = useCallback((reason: NetworkErrorCode = NETWORK_ERROR_CODES.ABORTED): void => {
    const queuedEntries = queueRef.current.splice(0);
    queuedEntries.forEach(entry => {
      if (entry.expirationTimer) clearTimeout(entry.expirationTimer);
      entry.reject(createNetworkError('Queued request was cleared', reason, {
        retryable: false,
        requestId: entry.id,
      }));
    });
  }, []);

  const getQueuedRequests = useCallback((): readonly QueuedRequestInfo[] =>
    queueRef.current.map(({ id, enqueuedAt, expiresAt }) => ({ id, enqueuedAt, expiresAt })), []);

  const getNetworkTypeDisplay = useCallback((): string => {
    const connType = stateRef.current.connectionType;
    switch (connType) {
      case 'wifi': return 'WiFi';
      case 'cellular': return 'Cellular';
      case 'ethernet': return 'Ethernet';
      case 'bluetooth': return 'Bluetooth';
      default: return connType ?? 'Unknown';
    }
  }, []);

  const resetNetworkState = useCallback((): void => {
    commitState(createInitialState());
  }, [commitState]);

  const resetRetryCount = useCallback((): void => {
    const curr = stateRef.current;
    if (curr.networkCheckRetryCount === 0 && curr.requestRetryCount === 0 && curr.retryCount === 0) {
      return; // ⚡️ Already 0, bail out!
    }
    commitState({
      ...curr,
      networkCheckRetryCount: 0,
      requestRetryCount: 0,
      retryCount: 0,
    });
  }, [commitState]);

  const forceRecheck = useCallback(() => checkNetworkStatus(2), [checkNetworkStatus]);
  const handleRetry = useCallback(() => {
    checkNetworkStatus(2).catch(() => undefined);
  }, [checkNetworkStatus]);

  const lastNetworkInfoRef = useRef<NetworkInfoLike | null>(null);

  useEffect(() => {
    mountedRef.current = true;

    const applyNetworkInfo = (networkInfo: NetworkInfoLike): void => {
      // ⚡️ Skip redundant NetInfo events if payload is deep equal
      if (lastNetworkInfoRef.current && equal(lastNetworkInfoRef.current, networkInfo)) {
        return;
      }
      lastNetworkInfoRef.current = networkInfo;
      const snapshot = toNetworkSnapshot(networkInfo);
      updateNetworkState(snapshot);
    };

    const initialize = async (): Promise<void> => {
      try {
        applyNetworkInfo((await NetInfo.fetch()) as NetworkInfoLike);
      } catch {
        if (mountedRef.current) {
          commitState({ ...stateRef.current, isLoading: false });
        }
      }
    };

    const unsubscribe = NetInfo.addEventListener(networkInfo => {
      applyNetworkInfo(networkInfo as NetworkInfoLike);
    });
    const appStateSubscription = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      if (backgroundRecheck && nextState === 'active') {
        checkNetworkStatus(2).catch(() => undefined);
      }
    });
    const pollingTimer = pollingInterval && enableBackgroundCheck
      ? setInterval(() => {
        checkNetworkStatus(1).catch(() => undefined);
      }, pollingInterval)
      : null;
    const activeRequests = activeRequestsRef.current;

    initialize().catch(() => undefined);

    return () => {
      mountedRef.current = false;
      unsubscribe();
      appStateSubscription.remove();
      if (pollingTimer) clearInterval(pollingTimer);
      activeRequests.forEach(({ controller }) => controller.abort());
      activeRequests.clear();
      clearQueue(NETWORK_ERROR_CODES.PROVIDER_UNMOUNTED);
    };
  }, [backgroundRecheck, checkNetworkStatus, clearQueue, commitState, enableBackgroundCheck, pollingInterval, updateNetworkState]);

  const contextValue = useMemo<NetworkContextValue>(() => ({
    ...state,
    isNetworkAvailable: state.isOnline,
    isOffline: state.networkState === NETWORK_STATES.DISCONNECTED || state.networkState === NETWORK_STATES.UNREACHABLE,
    getNetworkTypeDisplay,
    checkNetworkStatus,
    getNetworkInfo,
    forceRecheck,
    resetNetworkState,
    makeNetworkRequest,
    cancelRequest,
    cancelAllRequests,
    getQueuedRequests,
    clearQueue,
    processQueue,
    resetRetryCount,
  }), [
    cancelAllRequests,
    cancelRequest,
    checkNetworkStatus,
    clearQueue,
    forceRecheck,
    getNetworkInfo,
    getNetworkTypeDisplay,
    getQueuedRequests,
    makeNetworkRequest,
    processQueue,
    resetNetworkState,
    resetRetryCount,
    state,
  ]);

  const isOffline =
    state.networkState === NETWORK_STATES.DISCONNECTED ||
    state.networkState === NETWORK_STATES.UNREACHABLE;

  return (
    <NetworkContext.Provider value={contextValue}>
      {children}
      <InternetModal
        visible={isOffline}
        onRetry={handleRetry}
      />
    </NetworkContext.Provider>
  );
};

export const useNetwork = (
  options: { readonly throwOnError?: boolean; readonly silent?: boolean } = {},
): NetworkContextValue => {
  const context = useContext(NetworkContext);
  if (context) return context;

  const error = new Error('useNetwork must be used within a NetworkProvider');
  if (options.throwOnError) throw error;
  if (!options.silent) console.warn(error.message);

  const fallbackState = createInitialState();
  return {
    ...fallbackState,
    isNetworkAvailable: false,
    isOffline: false,
    getNetworkTypeDisplay: () => 'Unknown',
    checkNetworkStatus: async () => null,
    getNetworkInfo: async () => null,
    forceRecheck: async () => null,
    resetNetworkState: () => undefined,
    makeNetworkRequest: async <T,>(request: NetworkRequest<T>) => request({
      signal: new AbortController().signal,
      requestId: 'fallback-request',
    }),
    cancelRequest: () => undefined,
    cancelAllRequests: () => undefined,
    getQueuedRequests: () => [],
    clearQueue: () => undefined,
    processQueue: async () => undefined,
    resetRetryCount: () => undefined,
  };
};

export default NetworkContext;