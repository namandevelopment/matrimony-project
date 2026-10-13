import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, Method } from 'axios';
import { BASE_URL, ApiURL } from './endpoint';
import { getToken, getRefreshToken, setToken, clearTokens } from '../../storage';
import { perfMonitor } from '../../utils/perfMonitor';
import { toast } from '../../toastMessage/toast';
import { networkService } from '../../network/networkService';

export { BASE_URL, ApiURL };
export const API_BASE = BASE_URL;

// ============================================================================
// 1. Silent Refresh Queue Management
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
// 2. Base Axios Client with Request & Response Interceptors
// ============================================================================
export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Bearer Token and Perf Start Time
apiClient.interceptors.request.use(
  (config) => {
    (config as any)._startTime = performance.now();
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: 401 Silent Refresh Queue and Perf Recording
apiClient.interceptors.response.use(
  (response) => {
    const config = response.config as any;
    if (config?._startTime) {
      const duration = performance.now() - config._startTime;
      perfMonitor.recordApi(config.url || 'unknown', config.method || 'GET', duration, response.status || 200);
    }
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        clearTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      try {
        const res: any = await axios.post(ApiURL.refreshToken, { refreshToken });
        const newToken = res.data?.accessToken;
        setToken(newToken);
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        clearTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    const errConfig = error.config as any;
    if (errConfig?._startTime) {
      const duration = performance.now() - errConfig._startTime;
      perfMonitor.recordApi(errConfig.url || 'unknown', errConfig.method || 'GET', duration, error.response?.status || 'ERR');
    }

    return Promise.reject(error);
  }
);

// ============================================================================
// 3. Types & Interfaces for apiFetch
// ============================================================================
export type HttpMethod = Method | 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | string;

export interface ApiFetchOptions {
  /** Target API URL or Endpoint constant */
  url: string;
  /** Request body / payload (e.g. { email, password }, form data, etc.) */
  payload?: any;
  /** Alias for payload */
  data?: any;
  /** HTTP Method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' (defaults to POST if payload exists, else GET) */
  method?: HttpMethod;
  /** Attach Authorization Bearer token (defaults to true) */
  isToken?: boolean;
  /** Explicit query parameters (or falls back to payload for GET requests) */
  params?: any;
  /** Automatically format as FormData for file uploads */
  isMultipart?: boolean;
  /** Request timeout in ms (default: 15000) */
  timeout?: number;
  /** Automatically display error toast on failure (default: true) */
  showErrorToast?: boolean;
  /** Automatically display success toast on success (default: false) */
  showSuccessToast?: boolean;
  /** Custom success toast message */
  successMessage?: string;
  /** Custom request headers */
  headers?: Record<string, string>;
  /** AbortSignal for request cancellation */
  signal?: AbortSignal;
  /** Throw Error instead of returning error result */
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

// Helper to convert objects to FormData in web environments
export const createFormData = (payload: any): FormData => {
  if (payload instanceof FormData) return payload;
  const formData = new FormData();
  if (payload && typeof payload === 'object') {
    Object.entries(payload).forEach(([key, val]: [string, any]) => {
      if (val == null) return;
      if (val instanceof File || val instanceof Blob) {
        formData.append(key, val);
      } else if (Array.isArray(val)) {
        val.forEach((item, index) => {
          if (item instanceof File || item instanceof Blob) {
            formData.append(`${key}[${index}]`, item);
          } else {
            formData.append(`${key}[]`, typeof item === 'object' ? JSON.stringify(item) : String(item));
          }
        });
      } else if (typeof val === 'object') {
        formData.append(key, JSON.stringify(val));
      } else {
        formData.append(key, String(val));
      }
    });
  }
  return formData;
};

// ============================================================================
// 4. Universal, Fully-Optimized apiFetch (Zero Re-render)
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

  // 1. Instant Offline Fast-Fail (Guarantees zero UI lag when network drops)
  if (!networkService.isOnline()) {
    const offlineMsg = 'No internet connection. Please verify your connection.';
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

  // Resolve payload / data and determine default method
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

  // 3. Headers Assembly
  const token = isToken ? getToken() : null;
  const reqHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(!isGet && !isMultipart ? { 'Content-Type': 'application/json' } : {}),
    ...(isMultipart ? { 'Content-Type': 'multipart/form-data' } : {}),
    ...headers,
  };

  const queryParams = params || (isGet ? requestPayload : undefined);
  const bodyData = !isGet && requestPayload !== undefined && requestPayload !== null
    ? (isMultipart ? createFormData(requestPayload) : requestPayload)
    : undefined;

  try {
    const resData: any = await apiClient.request({
      url: normalizedUrl,
      method: normalizedMethod,
      headers: reqHeaders,
      timeout,
      signal,
      params: queryParams,
      data: bodyData,
    });

    const hasPayloadError =
      Boolean(resData) &&
      (resData.error === true ||
        (typeof resData.error === 'string' && resData.error.trim().length > 0) ||
        resData.success === false);

    if (hasPayloadError) {
      const errMsg =
        typeof resData.error === 'string' && resData.error.trim()
          ? resData.error.trim()
          : resData.message || 'Operation failed. Please try again.';

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
        code: resData?.status || 'ERROR',
        status: resData?.status,
        raw: resData,
      };
    }

    if (showSuccessToast) {
      toast.success(successMessage || resData?.message || 'Action completed successfully');
    }

    const finalData = (resData?.data !== undefined ? resData.data : resData) as T;

    return {
      error: false,
      message: resData?.message || 'Success',
      data: finalData,
      code: 200,
      status: 200,
      raw: resData,
    };
  } catch (error: any) {
    const status = error?.response?.status;
    const resData = error?.response?.data;

    const isTimeout =
      error?.code === 'ECONNABORTED' ||
      error?.message?.toLowerCase().includes('timeout');
    const isNetwork =
      error?.message === 'Network Error' ||
      error?.code === 'ERR_NETWORK' ||
      !error?.response;

    let message = 'Something went wrong. Please check your connection and try again.';

    if (isTimeout) {
      message = 'Request timed out. Server is taking too long to respond.';
    } else if (isNetwork) {
      message = 'Unable to connect to server. Please check your internet connection.';
    } else if (resData) {
      if (typeof resData === 'string') {
        message = resData.startsWith('<') ? `Server error (${status || 500})` : resData;
      } else if (typeof resData.message === 'string') {
        message = resData.message;
      } else if (typeof resData.error === 'string') {
        message = resData.error;
      }
    } else if (status) {
      message = `Request failed with status code ${status}.`;
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
      code: isTimeout ? 'TIMEOUT' : isNetwork ? 'NETWORK_ERROR' : status || 'ERROR',
      status: status || 0,
      data: resData ?? null,
      raw: resData,
    };
  }
};

// ============================================================================
// 5. Static Shorthands on apiFetch
// ============================================================================
apiFetch.get = <T = any>(
  url: string,
  paramsOrPayload?: any,
  options?: Omit<ApiFetchOptions, 'url' | 'method' | 'params' | 'payload' | 'data'>
): Promise<ApiResponse<T>> => {
  return apiFetch<T>({ url, method: 'GET', payload: paramsOrPayload, ...options });
};

apiFetch.post = <T = any>(
  url: string,
  payload?: any,
  options?: Omit<ApiFetchOptions, 'url' | 'method' | 'payload' | 'data'>
): Promise<ApiResponse<T>> => {
  return apiFetch<T>({ url, method: 'POST', payload, ...options });
};

apiFetch.put = <T = any>(
  url: string,
  payload?: any,
  options?: Omit<ApiFetchOptions, 'url' | 'method' | 'payload' | 'data'>
): Promise<ApiResponse<T>> => {
  return apiFetch<T>({ url, method: 'PUT', payload, ...options });
};

apiFetch.delete = <T = any>(
  url: string,
  payload?: any,
  options?: Omit<ApiFetchOptions, 'url' | 'method' | 'payload' | 'data'>
): Promise<ApiResponse<T>> => {
  return apiFetch<T>({ url, method: 'DELETE', payload, ...options });
};

apiFetch.patch = <T = any>(
  url: string,
  payload?: any,
  options?: Omit<ApiFetchOptions, 'url' | 'method' | 'payload' | 'data'>
): Promise<ApiResponse<T>> => {
  return apiFetch<T>({ url, method: 'PATCH', payload, ...options });
};

// ============================================================================
// 6. Backward Compatible Exports
// ============================================================================
export const ApiFetch = apiFetch;
export const apiRequest = apiFetch;

export const apiGet = <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
  apiClient.get(url, config) as unknown as Promise<T>;

export const apiPost = <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
  apiClient.post(url, data, config) as unknown as Promise<T>;

export const apiPut = <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
  apiClient.put(url, data, config) as unknown as Promise<T>;

export const apiDelete = <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
  apiClient.delete(url, config) as unknown as Promise<T>;

export default apiFetch;
