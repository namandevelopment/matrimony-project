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

    const reqUrl = (originalRequest?.url || '').toLowerCase();
    const isAuthRoute =
      reqUrl.includes('/login') ||
      reqUrl.includes('/register') ||
      reqUrl.includes('/forgot-password') ||
      reqUrl.includes('/reset-password') ||
      reqUrl.includes('/verify-otp') ||
      reqUrl.includes('/refresh-token');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
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
      throw new ApiError(offlineMsg, { status: 0, code: 'OFFLINE' });
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
        resData.success === false ||
        (typeof resData.status === 'string' && resData.status.toLowerCase() === 'error'));

    if (hasPayloadError) {
      const extracted = extractApiErrorMessage(null, resData, 200);
      const errMsg = extracted.message || 'Operation failed. Please try again.';

      if (showErrorToast && errMsg) {
        toast.error(errMsg);
      }

      if (throwOnError) {
        throw new ApiError(errMsg, {
          status: 200,
          code: resData?.code || resData?.status || 'ERROR',
          data: (resData?.data !== undefined ? resData.data : resData) as T,
          raw: resData,
          errors: extracted.errors,
        });
      }

      return {
        error: true,
        message: errMsg,
        data: (resData?.data !== undefined ? resData.data : resData) as T,
        code: resData?.code || resData?.status || 'ERROR',
        status: 200,
        raw: resData,
        errors: extracted.errors,
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

    const extracted = extractApiErrorMessage(error, resData, status);
    const message = extracted.message;
    const fieldErrors = extracted.errors;

    const isTimeout =
      error?.code === 'ECONNABORTED' ||
      error?.message?.toLowerCase().includes('timeout');
    const isNetwork =
      error?.message === 'Network Error' ||
      error?.code === 'ERR_NETWORK' ||
      (!error?.response && Boolean(error?.request));

    const code = resData?.code || (isTimeout ? 'TIMEOUT' : isNetwork ? 'NETWORK_ERROR' : status || 'ERROR');

    if (showErrorToast && message) {
      toast.error(message);
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
// 6. Backward Compatible Exports & TanStack React Query Wrapper
// ============================================================================
export type ApiRequestOptions<TData = unknown> = ApiFetchOptions & {
  data?: TData;
};

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

export const apiGet = <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
  apiClient.get(url, config) as unknown as Promise<T>;

export const apiPost = <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
  apiClient.post(url, data, config) as unknown as Promise<T>;

export const apiPut = <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
  apiClient.put(url, data, config) as unknown as Promise<T>;

export const apiDelete = <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
  apiClient.delete(url, config) as unknown as Promise<T>;

export default apiFetch;
