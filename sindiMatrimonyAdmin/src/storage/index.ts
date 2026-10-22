const TOKEN_KEY = 'admin_auth_token';
const REFRESH_TOKEN_KEY = 'admin_refresh_token';
const USER_KEY = 'admin_auth_user';

import { Storage } from './Storage';
export { Storage };

const memoryStore = new Map<string, string>();

export const storage = {
  getString: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        return localStorage.getItem(key);
      }
      return memoryStore.get(key) ?? null;
    } catch {
      return memoryStore.get(key) ?? null;
    }
  },
  set: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem(key, value);
      }
      memoryStore.set(key, value);
    } catch {
      memoryStore.set(key, value);
    }
  },
  remove: (key: string): void => {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.removeItem(key);
      }
      memoryStore.delete(key);
    } catch {
      memoryStore.delete(key);
    }
  },
  clear: (): void => {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.clear();
      }
      memoryStore.clear();
    } catch {
      memoryStore.clear();
    }
  },
};

export const getToken = () => storage.getString(TOKEN_KEY);
export const setToken = (token: string) => storage.set(TOKEN_KEY, token);

export const getRefreshToken = () => storage.getString(REFRESH_TOKEN_KEY);
export const setRefreshToken = (token: string) => storage.set(REFRESH_TOKEN_KEY, token);

let cachedUserRaw: string | null = null;
let cachedUserObj: any = null;

export const getStoredUser = () => {
  const data = storage.getString(USER_KEY);
  if (!data) {
    cachedUserRaw = null;
    cachedUserObj = null;
    return null;
  }
  if (data === cachedUserRaw && cachedUserObj) {
    return cachedUserObj;
  }
  try {
    cachedUserObj = JSON.parse(data);
    cachedUserRaw = data;
    return cachedUserObj;
  } catch {
    return null;
  }
};
export const setStoredUser = (user: any) => {
  cachedUserObj = user;
  cachedUserRaw = JSON.stringify(user);
  storage.set(USER_KEY, cachedUserRaw);
};

const SIMULATED_USER_KEY = 'admin_simulated_user';
const ACTIVE_ROLE_KEY = 'admin_active_role';

let cachedSimUserRaw: string | null = null;
let cachedSimUserObj: any = null;

export const getSimulatedUser = () => {
  const data = storage.getString(SIMULATED_USER_KEY);
  if (!data) {
    cachedSimUserRaw = null;
    cachedSimUserObj = null;
    return null;
  }
  if (data === cachedSimUserRaw && cachedSimUserObj) {
    return cachedSimUserObj;
  }
  try {
    cachedSimUserObj = JSON.parse(data);
    cachedSimUserRaw = data;
    return cachedSimUserObj;
  } catch {
    return null;
  }
};
export const setSimulatedUser = (user: any) => {
  if (user) {
    cachedSimUserObj = user;
    cachedSimUserRaw = JSON.stringify(user);
    storage.set(SIMULATED_USER_KEY, cachedSimUserRaw);
  } else {
    cachedSimUserObj = null;
    cachedSimUserRaw = null;
    storage.remove(SIMULATED_USER_KEY);
  }
};
export const clearSimulatedUser = () => {
  cachedSimUserObj = null;
  cachedSimUserRaw = null;
  storage.remove(SIMULATED_USER_KEY);
};

export const getActiveRole = (): string | null => storage.getString(ACTIVE_ROLE_KEY);
export const setActiveRole = (role: string | null) => {
  if (role) {
    storage.set(ACTIVE_ROLE_KEY, role);
  } else {
    storage.remove(ACTIVE_ROLE_KEY);
  }
};

export const clearAllAdminStorage = () => {
  cachedUserRaw = null;
  cachedUserObj = null;
  cachedSimUserRaw = null;
  cachedSimUserObj = null;

  const keysToRemove = [
    TOKEN_KEY,
    REFRESH_TOKEN_KEY,
    USER_KEY,
    SIMULATED_USER_KEY,
    ACTIVE_ROLE_KEY,
    'token',
    'refreshToken',
    'user',
  ];

  keysToRemove.forEach((k) => {
    try {
      storage.remove(k);
      Storage.removeItemSync(k);
    } catch (_) {}
  });

  if (typeof window !== 'undefined') {
    try {
      if (typeof window.localStorage !== 'undefined') {
        window.localStorage.clear();
      }
    } catch (_) {}

    try {
      if (typeof window.sessionStorage !== 'undefined') {
        window.sessionStorage.clear();
      }
    } catch (_) {}

    try {
      if (typeof document !== 'undefined' && document.cookie) {
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
          const eqPos = cookie.indexOf('=');
          const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
          if (name) {
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`;
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname};`;
          }
        }
      }
    } catch (_) {}
  }

  storage.clear();
};

export const clearTokens = () => {
  clearAllAdminStorage();
};

