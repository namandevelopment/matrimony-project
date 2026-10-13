import axios, { AxiosInstance, Method } from 'axios';
import NetInfo from '@react-native-community/netinfo';
import { Storage } from '../../storage/Storage';
import { toast } from '../../toastMessage/toast';
import { reset } from '../../navigation/navigationService';
import { BASE_URL, ApiURL } from './endpoint';

export { BASE_URL, ApiURL };
export const API_BASE = BASE_URL;

// ============================================================================
// 1. Interfaces & Types
// ============================================================================
export type HttpMethod = Method | 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface ApiFetchOptions {
  url: string;
  payload?: any;
  data?: any;
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

export interface ApiResponse<T = any> {
  error: boolean;
  message: string;
  data: T | null;
  code: number | string;
  status?: number;
  raw?: any;
}

export type ApiRequestOptions<TData = unknown> = ApiFetchOptions & {
  data?: TData;
};

// ============================================================================
// 2. Token Helpers (Synchronous & Zero-Delay via MMKV)
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
// 4. Real-time Network Connectivity Tracking
// ============================================================================
let isNetworkConnected = true;

NetInfo.addEventListener((state) => {
  isNetworkConnected = state.isConnected !== false && state.isInternetReachable !== false;
});

NetInfo.fetch()
  .then((state) => {
    isNetworkConnected = state.isConnected !== false && state.isInternetReachable !== false;
  })
  .catch(() => {});

// ============================================================================
// 5. Session Expiry & Auto-Logout Handler (Debounced)
// ============================================================================
const isSessionExpired = (status?: number, data?: any): boolean => {
  if (status === 401) return true;
  const code = data?.code;
  const msg = typeof data?.message === 'string' ? data.message.toLowerCase() : '';
  return (
    code === 401 ||
    code === 1401 ||
    msg === 'send valid token' ||
    msg === 'invalid session' ||
    msg.includes('jwt expired') ||
    msg.includes('token expired') ||
    msg.includes('session expired') ||
    msg.includes('unauthorized')
  );
};

let isLoggingOut = false;
const handleSessionExpired = <T = any>(): ApiResponse<T> => {
  if (!isLoggingOut) {
    isLoggingOut = true;
    try {
      clearTokens();
      Storage.removeItemSync('user');
    } catch {}

    toast.error('Session expired. Please login again.');
    reset('LoginScreen');

    setTimeout(() => {
      isLoggingOut = false;
    }, 2500);
  }
  return {
    error: true,
    message: 'Session expired. Please login again.',
    code: 401,
    status: 401,
    data: null,
  };
};

// ============================================================================
// 6. React-Native Multipart FormData Creator
// ============================================================================
export const createFormData = (payload: any): FormData => {
  if (payload instanceof FormData) return payload;
  const formData = new FormData();
  if (payload && typeof payload === 'object') {
    Object.entries(payload).forEach(([key, val]: [string, any]) => {
      if (val == null) return;
      if (Array.isArray(val)) {
        val.forEach((item, index) => {
          if (item && typeof item === 'object' && (item.uri || item.path)) {
            const uri = item.uri || item.path;
            formData.append(`${key}[${index}]`, {
              uri,
              type: item.type || item.mime || 'image/jpeg',
              name: item.name || item.fileName || uri.split('/').pop() || `${key}_${index}.jpg`,
            } as any);
          } else {
            formData.append(`${key}[]`, item);
          }
        });
      } else if (typeof val === 'object' && (val.uri || val.path)) {
        const uri = val.uri || val.path;
        formData.append(key, {
          uri,
          type: val.type || val.mime || 'image/jpeg',
          name: val.name || val.fileName || uri.split('/').pop() || `${key}.jpg`,
        } as any);
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
export const apiFetch = async <T = any>(
  options: ApiFetchOptions
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
  if (!isNetworkConnected) {
    const offlineMsg = 'No internet connection. Please check your network and try again.';
    if (showErrorToast) {
      toast.error(offlineMsg);
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
    ...(isMultipart ? { 'Content-Type': 'multipart/form-data' } : {}),
    ...headers,
  };

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
    if (isToken && isSessionExpired(res.status, resData)) {
      return handleSessionExpired();
    }

    // Check for payload errors (e.g. { error: true, message: '...' })
    const hasPayloadError =
      Boolean(resData) &&
      (resData.error === true ||
        (typeof resData.error === 'string' && resData.error.trim().length > 0) ||
        resData.success === false ||
        (typeof resData.status === 'string' && resData.status.toLowerCase() === 'error'));

    if (hasPayloadError) {
      const errMsg =
        typeof resData.error === 'string' && resData.error.trim()
          ? resData.error.trim()
          : resData.message || 'Operation failed. Please try again.';

      if (__DEV__) {
        console.warn(`[apiFetch ERROR] ${normalizedMethod} ${normalizedUrl}:`, resData);
      }

      if (showErrorToast && errMsg) {
        toast.error(errMsg);
      }

      if (throwOnError) {
        throw new Error(errMsg);
      }

      return {
        error: true,
        message: errMsg,
        data: (resData?.data !== undefined ? resData.data : resData) as T,
        code: res.status || 'ERROR',
        status: res.status,
        raw: resData,
      };
    }

    if (showSuccessToast) {
      const msg = successMessage || resData?.message || 'Success';
      toast.success(msg);
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

    // 401 Session Expired from server error response
    if (isToken && isSessionExpired(status, resData)) {
      return handleSessionExpired();
    }

    const isTimeout =
      error?.code === 'ECONNABORTED' ||
      error?.message?.toLowerCase().includes('timeout');
    const isNetwork =
      error?.message === 'Network Error' ||
      error?.code === 'ERR_NETWORK' ||
      error?.code === 'ENOTFOUND' ||
      error?.code === 'ECONNREFUSED' ||
      !error?.response;

    let message = 'Something went wrong. Please check your connection and try again.';

    if (isTimeout) {
      message = 'Request timed out. Server is taking too long to respond.';
    } else if (isNetwork) {
      message = 'Unable to connect to server. Please check your internet connection.';
    } else if (resData) {
      if (typeof resData === 'string') {
        if (resData.trim().startsWith('<') || resData.includes('<!DOCTYPE')) {
          message = status ? `Server error (${status}). Please try again later.` : 'Unexpected server response.';
        } else {
          message = resData;
        }
      } else if (typeof resData.message === 'string' && resData.message.trim()) {
        message = resData.message.trim();
      } else if (typeof resData.error === 'string' && resData.error.trim()) {
        message = resData.error.trim();
      } else if (Array.isArray(resData.errors) && resData.errors.length > 0) {
        const firstErr = resData.errors[0];
        message = typeof firstErr === 'string' ? firstErr : firstErr?.message || 'Validation error.';
      } else if (typeof resData.errors === 'object' && resData.errors !== null) {
        const firstKey = Object.keys(resData.errors)[0];
        message = String(resData.errors[firstKey] || 'Validation error.');
      }
    } else if (status) {
      switch (status) {
        case 400:
          message = 'Bad request. Please verify your input details.';
          break;
        case 401:
          message = 'Unauthorized or session expired. Please log in again.';
          break;
        case 403:
          message = 'Access forbidden. You do not have permission.';
          break;
        case 404:
          message = 'Requested service or resource not found.';
          break;
        case 429:
          message = 'Too many requests. Please slow down and try again.';
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          message = 'Server is currently experiencing issues. Please try again shortly.';
          break;
        default:
          message = `Request failed with status code ${status}.`;
      }
    }

    const code = isTimeout ? 'TIMEOUT' : isNetwork ? 'NETWORK_ERROR' : status || 'ERROR';

    if (__DEV__) {
      console.warn(`[apiFetch CATCH] ${normalizedMethod} ${normalizedUrl}:`, {
        code,
        status,
        message,
        resData,
      });
    }

    if (showErrorToast && message) {
      toast.error(message);
    }

    if (throwOnError) {
      throw new Error(message);
    }

    return {
      error: true,
      message,
      code,
      status: status || 0,
      data: resData ?? null,
      raw: resData,
    };
  }
};

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

apiFetch.post = <T = any>(
  url: string,
  data?: any,
  options?: Omit<ApiFetchOptions, 'url' | 'method' | 'data'>
): Promise<ApiResponse<T>> => {
  return apiFetch<T>({ url, method: 'POST', data, ...options });
};

apiFetch.put = <T = any>(
  url: string,
  data?: any,
  options?: Omit<ApiFetchOptions, 'url' | 'method' | 'data'>
): Promise<ApiResponse<T>> => {
  return apiFetch<T>({ url, method: 'PUT', data, ...options });
};

apiFetch.delete = <T = any>(
  url: string,
  params?: any,
  options?: Omit<ApiFetchOptions, 'url' | 'method' | 'params'>
): Promise<ApiResponse<T>> => {
  return apiFetch<T>({ url, method: 'DELETE', params, ...options });
};

apiFetch.patch = <T = any>(
  url: string,
  data?: any,
  options?: Omit<ApiFetchOptions, 'url' | 'method' | 'data'>
): Promise<ApiResponse<T>> => {
  return apiFetch<T>({ url, method: 'PATCH', data, ...options });
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
    throw {
      message: res.message,
      status: res.status,
      code: res.code,
      data: res.data,
      raw: res.raw,
    };
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