/**
 * MMKV High-Performance Storage Engine
 * Sindhi Matrimony Application
 *
 * Full async/await API with AsyncStorage parity, rock-solid try-catch blocks,
 * robust error boundaries, and auto-parsing for JSON objects and primitives.
 */

import { createMMKV } from 'react-native-mmkv';

// ----------------------------------------------------------------------------
// 1. MMKV Core Instance
// ----------------------------------------------------------------------------
export const mmkv = createMMKV({
  id: 'app-storage',
});

// ----------------------------------------------------------------------------
// 2. Types & Interfaces
// ----------------------------------------------------------------------------
export type StorageValue = string | number | boolean | object | null;

export interface StoredUserProfile {
  id: string;
  phone: string;
  fullName?: string;
  email?: string;
  gender?: string;
  avatar?: string;
  token?: string;
  [key: string]: any;
}

const safeDelete = (key: string): boolean => {
  try {
    if (typeof (mmkv as any).delete === 'function') {
      (mmkv as any).delete(key);
      return true;
    } else if (typeof (mmkv as any).remove === 'function') {
      (mmkv as any).remove(key);
      return true;
    }
    return false;
  } catch (err) {
    console.error(`🚨 [Storage.safeDelete] Failed to delete key "${key}":`, err);
    return false;
  }
};

// ----------------------------------------------------------------------------
// 3. Storage Service with Async/Await & Comprehensive Error Handling
// ----------------------------------------------------------------------------
export const Storage = {
  /**
   * Save a key-value pair asynchronously.
   * Automatically serializes objects and detects numbers, booleans, and strings.
   * Passing `null` or `undefined` safely deletes the key.
   *
   * @example
   * await Storage.setItem('token', 'eyJhbGciOi...');
   * await Storage.setItem('user', { id: '123', name: 'Simran' });
   */
  async setItem(key: string, value: StorageValue): Promise<boolean> {
    try {
      if (!key || typeof key !== 'string') {
        console.warn('⚠️ [Storage.setItem] Invalid key provided. Key must be a non-empty string.');
        return false;
      }

      if (value === null || value === undefined) {
        return safeDelete(key);
      }

      if (typeof value === 'string') {
        mmkv.set(key, value);
      } else if (typeof value === 'number') {
        mmkv.set(key, value);
      } else if (typeof value === 'boolean') {
        mmkv.set(key, value);
      } else if (typeof value === 'object') {
        const serialized = JSON.stringify(value);
        mmkv.set(key, serialized);
      } else {
        mmkv.set(key, String(value));
      }

      return true;
    } catch (error) {
      console.error(`🚨 [Storage.setItem] Error saving key "${key}":`, error);
      return false;
    }
  },

  /**
   * Retrieve a value asynchronously.
   * Automatically parses JSON strings into typed objects or primitives.
   *
   * @example
   * const token = await Storage.getItem<string>('token');
   * const user = await Storage.getItem<StoredUserProfile>('user');
   */
  async getItem<T = string>(key: string, defaultValue?: T): Promise<T | null> {
    try {
      if (!key || typeof key !== 'string') {
        console.warn('⚠️ [Storage.getItem] Invalid key provided. Key must be a non-empty string.');
        return defaultValue ?? null;
      }

      if (!mmkv.contains(key)) {
        return defaultValue ?? null;
      }

      // 1. Try string / JSON (most common)
      const stringVal = mmkv.getString(key);
      if (typeof stringVal === 'string') {
        try {
          const parsed = JSON.parse(stringVal);
          if (typeof parsed === 'object' && parsed !== null) {
            return parsed as T;
          }
          if (typeof parsed === 'boolean' || typeof parsed === 'number') {
            return parsed as unknown as T;
          }
        } catch {
          // Plain string token or unquoted text
        }
        return stringVal as unknown as T;
      }

      // 2. Try boolean
      const boolVal = mmkv.getBoolean(key);
      if (typeof boolVal === 'boolean') {
        return boolVal as unknown as T;
      }

      // 3. Try number
      const numVal = mmkv.getNumber(key);
      if (typeof numVal === 'number') {
        return numVal as unknown as T;
      }

      return defaultValue ?? null;
    } catch (error) {
      console.error(`🚨 [Storage.getItem] Error fetching key "${key}":`, error);
      return defaultValue ?? null;
    }
  },

  /**
   * Synchronous getter for instant reads (e.g. Navigation guards, splash checks).
   */
  getItemSync<T = string>(key: string, defaultValue?: T): T | null {
    try {
      if (!key || !mmkv.contains(key)) return defaultValue ?? null;
      const strVal = mmkv.getString(key);
      if (typeof strVal === 'string') {
        try {
          const parsed = JSON.parse(strVal);
          if (parsed !== null) return parsed as T;
        } catch {}
        return strVal as unknown as T;
      }
      const boolVal = mmkv.getBoolean(key);
      if (typeof boolVal === 'boolean') return boolVal as unknown as T;
      const numVal = mmkv.getNumber(key);
      if (typeof numVal === 'number') return numVal as unknown as T;
      return defaultValue ?? null;
    } catch {
      return defaultValue ?? null;
    }
  },

  /**
   * Synchronous setter for instant writes.
   */
  setItemSync(key: string, value: StorageValue): boolean {
    try {
      if (value === null || value === undefined) return safeDelete(key);
      if (typeof value === 'object') mmkv.set(key, JSON.stringify(value));
      else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') mmkv.set(key, value);
      else mmkv.set(key, String(value));
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Remove a single key from storage.
   *
   * @example
   * await Storage.removeItem('token');
   */
  async removeItem(key: string): Promise<boolean> {
    try {
      if (!key) return false;
      return safeDelete(key);
    } catch (error) {
      console.error(`🚨 [Storage.removeItem] Error removing key "${key}":`, error);
      return false;
    }
  },

  /**
   * Synchronous removal of a key.
   */
  removeItemSync(key: string): boolean {
    try {
      if (!key) return false;
      return safeDelete(key);
    } catch {
      return false;
    }
  },

  /**
   * Check if a key exists in storage.
   */
  async contains(key: string): Promise<boolean> {
    try {
      if (!key) return false;
      return mmkv.contains(key);
    } catch (error) {
      console.error(`🚨 [Storage.contains] Error checking key "${key}":`, error);
      return false;
    }
  },

  /**
   * Clear all key-value pairs stored in MMKV.
   */
  async clear(): Promise<boolean> {
    try {
      mmkv.clearAll();
      console.log('🧹 [Storage.clear] All MMKV storage data wiped successfully.');
      return true;
    } catch (error) {
      console.error('🚨 [Storage.clear] Failed to clear storage:', error);
      return false;
    }
  },

  /**
   * Get an array of all keys currently stored.
   */
  async getAllKeys(): Promise<string[]> {
    try {
      return mmkv.getAllKeys();
    } catch (error) {
      console.error('🚨 [Storage.getAllKeys] Failed to retrieve keys:', error);
      return [];
    }
  },

  // --------------------------------------------------------------------------
  // Bulk Operations (AsyncStorage Parity)
  // --------------------------------------------------------------------------

  /**
   * Set multiple key-value pairs in a single operation.
   */
  async multiSet(pairs: [string, StorageValue][]): Promise<boolean> {
    try {
      for (const [key, value] of pairs) {
        await Storage.setItem(key, value);
      }
      return true;
    } catch (error) {
      console.error('🚨 [Storage.multiSet] Error executing batch save:', error);
      return false;
    }
  },

  /**
   * Get multiple key-value pairs at once.
   */
  async multiGet<T = string>(keys: string[]): Promise<[string, T | null][]> {
    try {
      const results: [string, T | null][] = [];
      for (const key of keys) {
        const val = await Storage.getItem<T>(key);
        results.push([key, val]);
      }
      return results;
    } catch (error) {
      console.error('🚨 [Storage.multiGet] Error executing batch fetch:', error);
      return keys.map((k) => [k, null]);
    }
  },

  /**
   * Remove multiple keys at once.
   */
  async multiRemove(keys: string[]): Promise<boolean> {
    try {
      for (const key of keys) {
        safeDelete(key);
      }
      return true;
    } catch (error) {
      console.error('🚨 [Storage.multiRemove] Error executing batch remove:', error);
      return false;
    }
  },
};

export default Storage;
