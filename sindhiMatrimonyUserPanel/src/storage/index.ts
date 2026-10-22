/**
 * High-Performance Unified Storage and Session Purge Engine
 * Sindhi Matrimony User Panel
 */

import { Storage } from './Storage';
export { Storage };

const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';
const SINDHI_USER_KEY = 'sindhi_matrimony_user';
const SINDHI_AUTH_FLAG = 'sindhi_matrimony_is_authenticated';

export const getToken = (): string | null => Storage.getItemSync<string>(TOKEN_KEY);
export const setToken = (token: string): boolean => Storage.setItemSync(TOKEN_KEY, token);

export const getRefreshToken = (): string | null => Storage.getItemSync<string>(REFRESH_TOKEN_KEY);
export const setRefreshToken = (token: string): boolean => Storage.setItemSync(REFRESH_TOKEN_KEY, token);

let cachedUserRaw: string | null = null;
let cachedUserObj: any = null;

export const getStoredUser = (): any => {
  const data = Storage.getItemSync<string | object>(USER_KEY) || Storage.getItemSync<string | object>(SINDHI_USER_KEY);
  if (!data) {
    cachedUserRaw = null;
    cachedUserObj = null;
    return null;
  }
  if (typeof data === 'object') {
    return data;
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

export const setStoredUser = (user: any): void => {
  cachedUserObj = user;
  cachedUserRaw = typeof user === 'string' ? user : JSON.stringify(user);
  Storage.setItemSync(USER_KEY, user);
  Storage.setItemSync(SINDHI_USER_KEY, user);
};

/**
 * Removes individual authentication tokens
 */
export const clearTokens = (): void => {
  Storage.removeItemSync(TOKEN_KEY);
  Storage.removeItemSync(REFRESH_TOKEN_KEY);
  Storage.removeItemSync('auth_token');
  Storage.removeItemSync('admin_auth_token');
};

/**
 * Universal, clean, deep storage purge routine:
 * - Wipes all authentication tokens (access + refresh)
 * - Wipes all cached user profiles & authentication markers
 * - Wipes all registration drafts & OTP states
 * - Wipes edit profile & search drafts
 * - Clears entire browser localStorage & sessionStorage
 * - Clears in-memory cache stores
 * - Erases client-side auth cookies
 */
export const clearAllUserStorage = (): void => {
  cachedUserRaw = null;
  cachedUserObj = null;

  const targetKeys = [
    TOKEN_KEY,
    REFRESH_TOKEN_KEY,
    USER_KEY,
    SINDHI_USER_KEY,
    SINDHI_AUTH_FLAG,
    'auth_token',
    'admin_auth_token',
    'admin_refresh_token',
    'admin_auth_user',
    'sindhi_matrimony_edit_profile',
    'sindhi_reg_otp',
    'sindhi_reg_draft',
    'sindhi_matrimony_reg_step1',
    'sindhi_matrimony_reg_step2',
    'sindhi_matrimony_reg_step3',
    'sindhi_matrimony_reg_step4',
    'sindhi_matrimony_reg_step5',
    'chat_teaser_dismissed',
  ];

  targetKeys.forEach((key) => {
    try {
      Storage.removeItemSync(key);
      if (typeof window !== 'undefined') {
        window.localStorage?.removeItem(key);
        window.sessionStorage?.removeItem(key);
      }
    } catch (_) {}
  });

  if (typeof window !== 'undefined') {
    // 1. Clear window localStorage completely
    try {
      if (typeof window.localStorage !== 'undefined') {
        window.localStorage.clear();
      }
    } catch (_) {}

    // 2. Clear window sessionStorage completely
    try {
      if (typeof window.sessionStorage !== 'undefined') {
        window.sessionStorage.clear();
      }
    } catch (_) {}

    // 3. Clear client cookies
    try {
      if (typeof document !== 'undefined' && document.cookie) {
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
          const eqPos = cookie.indexOf('=');
          const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
          if (name) {
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`;
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname};`;
          }
        }
      }
    } catch (_) {}
  }

  // 4. Clear Storage engine memory store
  try {
    Storage.clear();
  } catch (_) {}
};

export default Storage;
