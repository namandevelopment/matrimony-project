import axios, { AxiosInstance, Method } from 'axios';
import { Storage } from '../../storage/Storage';
import { toast, showToast, hideToast, type ToastOptions, type ToastType } from '../../toastMessage/toast';
import { reset } from '../../navigation/navigationService';
import { BASE_URL, ApiURL } from './endpoint';

export { BASE_URL, ApiURL, toast, showToast, hideToast, type ToastOptions, type ToastType };
export const API_BASE = BASE_URL;

const isDev = typeof process !== 'undefined' && process.env ? process.env.NODE_ENV !== 'production' : false;

// ============================================================================
// 1. Interfaces & Types
// ============================================================================
export type HttpMethod = Method | 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface ApiFetchOptions<TBody = any> {
  url: string;
  payload?: TBody;
  data?: TBody;
  method?: HttpMethod | string;
  params?: any;
  isToken?: boolean;
  isMultipart?: boolean;
  timeout?: number;
  showErrorToast?: boolean;
  showSuccessToast?: boolean;
  successMessage?: string;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  throwOnError?: boolean;
}

export interface ApiFetchFunction {
  <T = any, TBody = any>(options: ApiFetchOptions<TBody>): Promise<ApiResponse<T>>;
  get: <T = any>(
    url: string,
    params?: any,
    options?: Omit<ApiFetchOptions, 'url' | 'method' | 'params'>
  ) => Promise<ApiResponse<T>>;
  post: <T = any, TBody = any>(
    url: string,
    data?: TBody,
    options?: Omit<ApiFetchOptions<TBody>, 'url' | 'method' | 'data'>
  ) => Promise<ApiResponse<T>>;
  put: <T = any, TBody = any>(
    url: string,
    data?: TBody,
    options?: Omit<ApiFetchOptions<TBody>, 'url' | 'method' | 'data'>
  ) => Promise<ApiResponse<T>>;
  delete: <T = any>(
    url: string,
    params?: any,
    options?: Omit<ApiFetchOptions, 'url' | 'method' | 'params'>
  ) => Promise<ApiResponse<T>>;
  patch: <T = any, TBody = any>(
    url: string,
    data?: TBody,
    options?: Omit<ApiFetchOptions<TBody>, 'url' | 'method' | 'data'>
  ) => Promise<ApiResponse<T>>;
}

export interface ApiResponse<T = any> {
  error: boolean;
  message: string;
  data: T | null;
  code: number | string;
  status?: number;
  raw?: any;
  errors?: Record<string, any> | any[];
}

export class ApiError extends Error {
  status: number;
  code: number | string;
  data: any;
  raw: any;
  errors?: Record<string, any> | any[];

  constructor(
    message: string,
    options?: {
      status?: number;
      code?: number | string;
      data?: any;
      raw?: any;
      errors?: Record<string, any> | any[];
    }
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = options?.status ?? 0;
    this.code = options?.code ?? 'ERROR';
    this.data = options?.data ?? null;
    this.raw = options?.raw ?? null;
    this.errors = options?.errors;

    if (typeof (Error as any).captureStackTrace === 'function') {
      (Error as any).captureStackTrace(this, ApiError);
    }
  }
}

export type ApiRequestOptions<TData = unknown> = ApiFetchOptions & {
  data?: TData;
};

// ============================================================================
// 2. Token Helpers (Synchronous & Zero-Delay via Storage)
// ============================================================================
export const getToken = (): string | null => Storage.getItemSync<string>('token');
export const getRefreshToken = (): string | null => Storage.getItemSync<string>('refreshToken');
export const setToken = (token: string): boolean => Storage.setItemSync('token', token);
export const setRefreshToken = (token: string): boolean => Storage.setItemSync('refreshToken', token);
export const clearTokens = (): void => {
  Storage.removeItemSync('token');
  Storage.removeItemSync('refreshToken');
};

// ============================================================================
// 2.1 Silent Refresh Queue Management
// ============================================================================
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string | null) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// ============================================================================
// 3. Shared Axios Instance
// ============================================================================
export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// ============================================================================
// 4. Real-time Network Connectivity Tracking (Web Native & SSR-Safe)
// ============================================================================
let isNetworkConnected = typeof navigator !== 'undefined' ? navigator.onLine : true;

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    isNetworkConnected = true;
  });
  window.addEventListener('offline', () => {
    isNetworkConnected = false;
  });
}

// ============================================================================
// 5. Universal Backend Error Extractor
// ============================================================================
/**
 * Systematically extracts the real, actionable error message and field-level validation errors
 * from any backend API response. Never drops backend details or masks them with generic strings.
 */
export const extractApiErrorMessage = (
  error: any,
  resData: any,
  status?: number
): { message: string; errors?: Record<string, any> | any[] } => {
  let extractedMessage = '';
  let fieldErrors: Record<string, any> | any[] | undefined = undefined;

  // 1. Inspect response body payload if present
  if (resData !== undefined && resData !== null) {
    if (typeof resData === 'string') {
      const trimmed = resData.trim();
      if (trimmed.startsWith('<') || trimmed.includes('<!DOCTYPE') || trimmed.includes('<html')) {
        const match =
          trimmed.match(/<pre[^>]*>([\s\S]*?)<\/pre>/i) ||
          trimmed.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
        if (match && match[1] && !match[1].toLowerCase().includes('error')) {
          extractedMessage = match[1].replace(/<[^>]+>/g, '').trim();
        } else {
          extractedMessage = status ? `Server error (${status}). Please try again later.` : 'Unexpected server response.';
        }
      } else {
        extractedMessage = trimmed;
      }
    } else if (typeof resData === 'object') {
      // 1.1 Extract field-level errors (resData.errors or resData.data?.errors)
      const rawErrors = resData.errors || resData.data?.errors;
      if (rawErrors) {
        fieldErrors = rawErrors;
        if (Array.isArray(rawErrors) && rawErrors.length > 0) {
          const list = rawErrors
            .map((item: any) => {
              if (typeof item === 'string') return item;
              if (item && typeof item === 'object') {
                return item.message || item.msg || item.detail || item.errorMessage || JSON.stringify(item);
              }
              return String(item);
            })
            .filter(Boolean);
          if (list.length > 0) {
            extractedMessage = list.join(', ');
          }
        } else if (typeof rawErrors === 'object') {
          const list = Object.entries(rawErrors)
            .map(([field, val]) => {
              if (typeof val === 'string') return val;
              if (Array.isArray(val)) return val.filter((v) => typeof v === 'string').join(', ');
              if (val && typeof val === 'object' && typeof (val as any).message === 'string') return (val as any).message;
              return `${field}: ${String(val)}`;
            })
            .filter(Boolean);
          if (list.length > 0) {
            extractedMessage = list.join(', ');
          }
        }
      }

      // 1.2 Inspect resData.message
      const candidateMsg = resData.message ?? resData.data?.message;
      if (candidateMsg) {
        let msgString = '';
        if (typeof candidateMsg === 'string') {
          msgString = candidateMsg.trim();
        } else if (Array.isArray(candidateMsg)) {
          msgString = candidateMsg.filter((m) => typeof m === 'string').join(', ').trim();
        } else if (typeof candidateMsg === 'object') {
          msgString = candidateMsg.message || candidateMsg.msg || candidateMsg.detail || '';
        }

        if (msgString) {
          const isGenericTitle =
            /^(validation\s*error|validation\s*failed|bad\s*request|unprocessable\s*entity|invalid\s*input|error|request\s*failed)$/i.test(
              msgString
            );
          if (!isGenericTitle || !extractedMessage) {
            extractedMessage = msgString;
          }
        }
      }

      // 1.3 Inspect resData.error
      if (!extractedMessage && resData.error) {
        if (typeof resData.error === 'string' && resData.error.trim().length > 0 && resData.error !== 'true') {
          extractedMessage = resData.error.trim();
        } else if (typeof resData.error === 'object') {
          const errObj = resData.error;
          extractedMessage = errObj.message || errObj.msg || errObj.description || errObj.detail || '';
        }
      }

      // 1.4 Inspect resData.msg
      if (!extractedMessage && typeof resData.msg === 'string' && resData.msg.trim()) {
        extractedMessage = resData.msg.trim();
      }

      // 1.5 Inspect resData.detail (FastAPI / RFC 7807)
      if (!extractedMessage && resData.detail) {
        if (typeof resData.detail === 'string') {
          extractedMessage = resData.detail.trim();
        } else if (Array.isArray(resData.detail)) {
          extractedMessage = resData.detail
            .map((d: any) => (d.msg ? `${d.loc ? d.loc.join('.') + ': ' : ''}${d.msg}` : String(d)))
            .join(', ');
        }
      }

      // 1.6 Inspect OAuth2 error_description
      if (!extractedMessage && typeof resData.error_description === 'string' && resData.error_description.trim()) {
        extractedMessage = resData.error_description.trim();
      }
    }
  }

  // 2. Transport & Network fallback only if no message extracted from backend response
  if (!extractedMessage) {
    const isTimeout =
      error?.code === 'ECONNABORTED' ||
      error?.message?.toLowerCase().includes('timeout');
    const isNetwork =
      error?.message === 'Network Error' ||
      error?.code === 'ERR_NETWORK' ||
      error?.code === 'ENOTFOUND' ||
      error?.code === 'ECONNREFUSED' ||
      (!error?.response && Boolean(error?.request));
    const isCanceled = axios.isCancel(error) || error?.name === 'CanceledError';

    if (isTimeout) {
      extractedMessage = 'Request timed out. Server is taking too long to respond.';
    } else if (isNetwork) {
      extractedMessage = 'Unable to connect to server. Please check your internet connection.';
    } else if (isCanceled) {
      extractedMessage = 'Request was cancelled.';
    } else if (status) {
      switch (status) {
        case 400:
          extractedMessage = 'Bad request. Please verify your input details.';
          break;
        case 401:
          extractedMessage = 'Unauthorized. Please check your credentials or log in again.';
          break;
        case 403:
          extractedMessage = 'Access forbidden. You do not have permission to perform this action.';
          break;
        case 404:
          extractedMessage = 'Requested service or resource not found.';
          break;
        case 409:
          extractedMessage = 'Conflict. The requested resource or entry already exists.';
          break;
        case 422:
          extractedMessage = 'Validation failed. Please verify required fields.';
          break;
        case 429:
          extractedMessage = 'Too many requests. Please slow down and try again.';
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          extractedMessage = `Server error (${status}). Please try again shortly.`;
          break;
        default:
          extractedMessage = `Request failed with status code ${status}.`;
      }
    } else if (error?.message && typeof error.message === 'string' && error.message.trim()) {
      extractedMessage = error.message.trim();
    } else {
      extractedMessage = 'Something went wrong. Please check your connection and try again.';
    }
  }

  return { message: extractedMessage, errors: fieldErrors };
};

// ============================================================================
// 6. Session Expiry & Auto-Logout Handler (Precise & Protected)
// ============================================================================
export const isSessionExpired = (
  status?: number,
  data?: any,
  url?: string,
  options?: ApiFetchOptions
): boolean => {
  // If the request was made to an auth route, 401 is NOT session expiry.
  const cleanUrl = (url || '').toLowerCase();
  const isAuthRoute =
    cleanUrl.includes('/auth/login') ||
    cleanUrl.includes('/auth/register') ||
    cleanUrl.includes('/auth/send-otp') ||
    cleanUrl.includes('/auth/sendotp') ||
    cleanUrl.includes('/auth/verify-otp') ||
    cleanUrl.includes('/auth/forgot-password') ||
    cleanUrl.includes('/auth/reset-password') ||
    cleanUrl.includes('/auth/check-phone');

  if (isAuthRoute) {
    return false;
  }

  if (options && options.isToken === false) {
    return false;
  }

  const code = data?.code;
  if (status !== 401 && code !== 401 && code !== 1401) {
    return false;
  }

  const msg = typeof data?.message === 'string'
    ? data.message.toLowerCase()
    : typeof data?.error === 'string'
      ? data.error.toLowerCase()
      : '';

  // If message clearly indicates wrong credentials, don't treat as session expired
  if (
    msg.includes('password') ||
    msg.includes('credentials') ||
    msg.includes('otp') ||
    msg.includes('mobile') ||
    msg.includes('phone')
  ) {
    return false;
  }

  return (
    code === 1401 ||
    msg.includes('jwt expired') ||
    msg.includes('token expired') ||
    msg.includes('session expired') ||
    msg.includes('session has expired') ||
    msg.includes('session has been terminated') ||
    msg.includes('invalid or expired authentication token') ||
    msg.includes('send valid token') ||
    msg.includes('invalid session') ||
    msg.includes('jwt malformed') ||
    msg.includes('no token provided') ||
    msg === '' ||
    msg === 'unauthorized' ||
    msg === 'unauthorized.'
  );
};

let isLoggingOut = false;
export const handleSessionExpired = <T = any>(serverMessage?: string): ApiResponse<T> => {
  const displayMsg = serverMessage || 'Session expired. Please login again.';
  if (!isLoggingOut) {
    isLoggingOut = true;
    try {
      clearTokens();
      Storage.removeItemSync('user');
    } catch { }

    showToast({
      type: 'error',
      message: displayMsg,
    });
    reset('LoginScreen');

    setTimeout(() => {
      isLoggingOut = false;
    }, 2500);
  }
  return {
    error: true,
    message: displayMsg,
    code: 401,
    status: 401,
    data: null,
  };
};

// ============================================================================
// 6. Web Multipart FormData Creator
// ============================================================================
export const createFormData = (payload: any): FormData => {
  if (typeof FormData !== 'undefined' && payload instanceof FormData) {
    return payload;
  }
  const formData = new FormData();
  if (payload && typeof payload === 'object') {
    Object.entries(payload).forEach(([key, val]: [string, any]) => {
      if (val == null) return;
      if (Array.isArray(val)) {
        val.forEach((item, index) => {
          if (item == null) return;
          if (typeof Blob !== 'undefined' && (item instanceof Blob || (typeof File !== 'undefined' && item instanceof File))) {
            formData.append(`${key}[${index}]`, item);
          } else if (typeof item === 'object' && (item.uri || item.path)) {
            if (item.file instanceof Blob) {
              formData.append(`${key}[${index}]`, item.file, item.name || `${key}_${index}`);
            } else {
              formData.append(`${key}[${index}]`, JSON.stringify(item));
            }
          } else {
            formData.append(`${key}[]`, typeof item === 'object' ? JSON.stringify(item) : String(item));
          }
        });
      } else if (typeof Blob !== 'undefined' && (val instanceof Blob || (typeof File !== 'undefined' && val instanceof File))) {
        formData.append(key, val);
      } else if (typeof val === 'object' && (val.uri || val.path)) {
        if (val.file instanceof Blob) {
          formData.append(key, val.file, val.name || key);
        } else {
          formData.append(key, JSON.stringify(val));
        }
      } else {
        formData.append(key, typeof val === 'object' ? JSON.stringify(val) : String(val));
      }
    });
  }
  return formData;
};

// ============================================================================
// 7. Universal, Fully-Optimized apiFetch (Zero Re-render)
// ============================================================================
export const apiFetch = (async <T = any, TBody = any>(
  options: ApiFetchOptions<TBody>
): Promise<ApiResponse<T>> => {
  const {
    url,
    payload,
    data = null,
    method,
    params,
    isToken = true,
    isMultipart = false,
    timeout = 15000,
    showErrorToast = true,
    showSuccessToast = false,
    successMessage,
    headers = {},
    signal,
    throwOnError = false,
  } = options;

  // 1. Instant Offline Guard
  const isOnline = isNetworkConnected && (typeof navigator === 'undefined' || navigator.onLine);
  if (!isOnline) {
    const offlineMsg = 'No internet connection. Please check your network and try again.';
    if (showErrorToast) {
      showToast({
        type: 'error',
        message: offlineMsg,
      });
    }
    if (throwOnError) {
      throw new Error(offlineMsg);
    }
    return {
      error: true,
      message: offlineMsg,
      data: null,
      code: 'OFFLINE',
      status: 0,
    };
  }

  const requestPayload = payload !== undefined ? payload : data;
  const inferredMethod = method || (requestPayload && typeof requestPayload === 'object' && Object.keys(requestPayload).length > 0 ? 'POST' : 'GET');
  const normalizedMethod = inferredMethod.toString().toUpperCase() as Method;
  const isGet = normalizedMethod === 'GET';

  // 2. URL Normalization
  let normalizedUrl = (url || '').toString().trim();
  if (normalizedUrl.startsWith(BASE_URL)) {
    normalizedUrl = normalizedUrl.slice(BASE_URL.length);
  }
  if (!normalizedUrl.startsWith('/') && !normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
    normalizedUrl = '/' + normalizedUrl;
  }

  // 3. Synchronous Token & Headers Assembly (Zero Re-render)
  const token = isToken ? getToken() : null;
  const reqHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(!isGet && !isMultipart ? { 'Content-Type': 'application/json' } : {}),
    ...headers,
  };

  // If explicit Content-Type is given for multipart, apply it; otherwise Axios/browser handles boundary automatically
  if (isMultipart && headers['Content-Type']) {
    reqHeaders['Content-Type'] = headers['Content-Type'];
  }

  const queryParams = params || (isGet ? requestPayload : undefined);
  const bodyData = !isGet && requestPayload ? (isMultipart ? createFormData(requestPayload) : requestPayload) : undefined;

  try {
    const res = await apiClient.request({
      url: normalizedUrl,
      method: normalizedMethod,
      headers: reqHeaders,
      timeout,
      signal,
      params: queryParams,
      data: bodyData,
    });

    const resData = res?.data;

    // Check for 200 payload containing session expiration
    if (isToken && isSessionExpired(res.status, resData, normalizedUrl, options)) {
      const extracted = extractApiErrorMessage(null, resData, res.status);
      return handleSessionExpired(extracted.message);
    }

    // Check for payload errors (e.g. { error: true, message: '...' })
    const hasPayloadError =
      Boolean(resData) &&
      (resData.error === true ||
        (typeof resData.error === 'string' && resData.error.trim().length > 0) ||
        resData.success === false ||
        (typeof resData.status === 'string' && resData.status.toLowerCase() === 'error'));

    if (hasPayloadError) {
      const extracted = extractApiErrorMessage(null, resData, res.status);
      const errMsg = extracted.message || 'Operation failed. Please try again.';

      if (isDev) {
        console.warn(`[apiFetch ERROR] ${normalizedMethod} ${normalizedUrl}:`, resData);
      }

      if (showErrorToast && errMsg) {
        showToast({
          type: 'error',
          message: errMsg,
        });
      }

      if (throwOnError) {
        throw new ApiError(errMsg, {
          status: res.status,
          code: resData?.code || res.status || 'ERROR',
          data: (resData?.data !== undefined ? resData.data : resData) as T,
          raw: resData,
          errors: extracted.errors,
        });
      }

      return {
        error: true,
        message: errMsg,
        data: (resData?.data !== undefined ? resData.data : resData) as T,
        code: resData?.code || res.status || 'ERROR',
        status: res.status,
        raw: resData,
        errors: extracted.errors,
      };
    }

    if (showSuccessToast) {
      const msg = successMessage || resData?.message || 'Success';
      showToast({
        type: 'success',
        message: msg,
      });
    }

    const finalData = (resData?.data !== undefined ? resData.data : resData) as T;

    return {
      error: false,
      message: resData?.message || 'Success',
      data: finalData,
      code: res.status,
      status: res.status,
      raw: resData,
    };
  } catch (error: any) {
    const status = error?.response?.status;
    const resData = error?.response?.data;

    // 401 Session Expired guard: attempt silent token renewal using refreshToken before logout
    if (isToken && isSessionExpired(status, resData, normalizedUrl, options)) {
      const isRetry = Boolean((options as any)._retry);
      const currentRefreshToken = getRefreshToken();

      if (!isRetry && currentRefreshToken && !normalizedUrl.includes('/auth/refresh-token')) {
        if (isRefreshing) {
          return new Promise<string | null>((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((newToken) => {
              return apiFetch<T>({
                ...options,
                headers: {
                  ...headers,
                  Authorization: `Bearer ${newToken}`,
                },
                _retry: true,
              } as any);
            })
            .catch(() => {
              const extracted = extractApiErrorMessage(error, resData, status);
              return handleSessionExpired(extracted.message);
            });
        }

        isRefreshing = true;

        try {
          const refreshResponse = await axios.post(
            ApiURL.refreshToken,
            { refreshToken: currentRefreshToken },
            { timeout: 10000, headers: { 'Content-Type': 'application/json' } }
          );

          const resBody = refreshResponse.data;
          const newToken = resBody?.data?.token || resBody?.data?.accessToken || resBody?.token || resBody?.accessToken;
          const newRefreshToken = resBody?.data?.refreshToken || resBody?.refreshToken;

          if (newToken) {
            setToken(newToken);
            if (newRefreshToken) {
              setRefreshToken(newRefreshToken);
            }
            processQueue(null, newToken);

            return apiFetch<T>({
              ...options,
              headers: {
                ...headers,
                Authorization: `Bearer ${newToken}`,
              },
              _retry: true,
            } as any);
          } else {
            throw new Error('No new token in refresh response');
          }
        } catch (refreshErr) {
          processQueue(refreshErr, null);
          const extracted = extractApiErrorMessage(error, resData, status);
          return handleSessionExpired(extracted.message);
        } finally {
          isRefreshing = false;
        }
      }

      const extracted = extractApiErrorMessage(error, resData, status);
      return handleSessionExpired(extracted.message);
    }

    const extracted = extractApiErrorMessage(error, resData, status);
    const message = extracted.message;
    const fieldErrors = extracted.errors;
    const isTimeout =
      error?.code === 'ECONNABORTED' ||
      error?.message?.toLowerCase().includes('timeout');
    const isNetwork =
      error?.message === 'Network Error' ||
      error?.code === 'ERR_NETWORK' ||
      error?.code === 'ENOTFOUND' ||
      error?.code === 'ECONNREFUSED' ||
      (!error?.response && Boolean(error?.request));

    const code = resData?.code || (isTimeout ? 'TIMEOUT' : isNetwork ? 'NETWORK_ERROR' : status || 'ERROR');

    if (isDev) {
      console.warn(`[apiFetch CATCH] ${normalizedMethod} ${normalizedUrl}:`, {
        code,
        status,
        message,
        errors: fieldErrors,
        resData,
      });
    }

    if (showErrorToast && message) {
      showToast({
        type: 'error',
        message,
      });
    }

    if (throwOnError) {
      throw new ApiError(message, {
        status: status || 0,
        code,
        data: resData ?? null,
        raw: resData,
        errors: fieldErrors,
      });
    }

    return {
      error: true,
      message,
      code,
      status: status || 0,
      data: resData ?? null,
      raw: resData,
      errors: fieldErrors,
    };
  }
}) as unknown as ApiFetchFunction;

// ============================================================================
// 8. Static Shorthands on apiFetch
// ============================================================================
apiFetch.get = <T = any>(
  url: string,
  params?: any,
  options?: Omit<ApiFetchOptions, 'url' | 'method' | 'params'>
): Promise<ApiResponse<T>> => {
  return apiFetch<T>({ url, method: 'GET', params, ...options });
};

apiFetch.post = <T = any, TBody = any>(
  url: string,
  data?: TBody,
  options?: Omit<ApiFetchOptions<TBody>, 'url' | 'method' | 'data'>
): Promise<ApiResponse<T>> => {
  return apiFetch<T, TBody>({ url, method: 'POST', data, ...options });
};

apiFetch.put = <T = any, TBody = any>(
  url: string,
  data?: TBody,
  options?: Omit<ApiFetchOptions<TBody>, 'url' | 'method' | 'data'>
): Promise<ApiResponse<T>> => {
  return apiFetch<T, TBody>({ url, method: 'PUT', data, ...options });
};

apiFetch.delete = <T = any>(
  url: string,
  params?: any,
  options?: Omit<ApiFetchOptions, 'url' | 'method' | 'params'>
): Promise<ApiResponse<T>> => {
  return apiFetch<T>({ url, method: 'DELETE', params, ...options });
};

apiFetch.patch = <T = any, TBody = any>(
  url: string,
  data?: TBody,
  options?: Omit<ApiFetchOptions<TBody>, 'url' | 'method' | 'data'>
): Promise<ApiResponse<T>> => {
  return apiFetch<T, TBody>({ url, method: 'PATCH', data, ...options });
};

// ============================================================================
// 9. Backward Compatibility: apiRequest & Aliases for TanStack React Query
// ============================================================================
export const apiRequest = async <TResponse = any, TData = unknown>(
  options: ApiRequestOptions<TData>
): Promise<TResponse> => {
  const res = await apiFetch<TResponse>({
    ...options,
    throwOnError: false,
  });

  if (res.error) {
    throw new ApiError(res.message, {
      status: res.status,
      code: res.code,
      data: res.data,
      raw: res.raw,
      errors: res.errors || (res.raw as any)?.errors || (res.data as any)?.errors,
    });
  }

  return (res.data !== undefined && res.data !== null ? res.data : res.raw) as TResponse;
};

export const ApiFetch = apiFetch;
export const apiGet = apiFetch.get;
export const apiPost = apiFetch.post;
export const apiPut = apiFetch.put;
export const apiDelete = apiFetch.delete;
export const apiPatch = apiFetch.patch;

export default apiFetch;