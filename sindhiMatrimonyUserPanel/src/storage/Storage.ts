/**
 * Web High-Performance Storage Engine
 * Sindhi Matrimony Application (Web / Next.js)
 *
 * Full synchronous and asynchronous API with localStorage parity,
 * robust try-catch boundaries, in-memory SSR fallback, and auto-parsing for JSON objects and primitives.
 */

export type StorageValue = string | number | boolean | object | null;

const memoryStore = new Map<string, string>();

const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export const Storage = {
  /**
   * Synchronous getter for instant reads (e.g. Auth guards, token lookup).
   */
  getItemSync<T = string>(key: string, defaultValue?: T): T | null {
    try {
      if (!key) return defaultValue ?? null;
      let strVal: string | null = null;
      if (isBrowser) {
        strVal = window.localStorage.getItem(key);
      } else {
        strVal = memoryStore.get(key) ?? null;
      }

      if (strVal === null || strVal === undefined) {
        return defaultValue ?? null;
      }

      try {
        const parsed = JSON.parse(strVal);
        if (parsed !== null) return parsed as T;
      } catch {
        // Fall back to plain string
      }
      return strVal as unknown as T;
    } catch {
      return defaultValue ?? null;
    }
  },

  /**
   * Synchronous setter for instant writes.
   */
  setItemSync(key: string, value: StorageValue): boolean {
    try {
      if (!key) return false;
      if (value === null || value === undefined) {
        return this.removeItemSync(key);
      }
      const stringified = typeof value === 'object' ? JSON.stringify(value) : String(value);
      if (isBrowser) {
        window.localStorage.setItem(key, stringified);
      }
      memoryStore.set(key, stringified);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Synchronous removal of a key.
   */
  removeItemSync(key: string): boolean {
    try {
      if (!key) return false;
      if (isBrowser) {
        window.localStorage.removeItem(key);
      }
      memoryStore.delete(key);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Asynchronous getter.
   */
  async getItem<T = string>(key: string, defaultValue?: T): Promise<T | null> {
    return this.getItemSync<T>(key, defaultValue);
  },

  /**
   * Asynchronous setter.
   */
  async setItem(key: string, value: StorageValue): Promise<boolean> {
    return this.setItemSync(key, value);
  },

  /**
   * Asynchronous removal of a key.
   */
  async removeItem(key: string): Promise<boolean> {
    return this.removeItemSync(key);
  },

  /**
   * Check if a key exists in storage.
   */
  async contains(key: string): Promise<boolean> {
    try {
      if (!key) return false;
      if (isBrowser) {
        return window.localStorage.getItem(key) !== null;
      }
      return memoryStore.has(key);
    } catch {
      return false;
    }
  },

  /**
   * Clear all storage.
   */
  async clear(): Promise<boolean> {
    try {
      if (isBrowser) {
        window.localStorage.clear();
      }
      memoryStore.clear();
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Get all keys currently stored.
   */
  async getAllKeys(): Promise<string[]> {
    try {
      if (isBrowser) {
        return Object.keys(window.localStorage);
      }
      return Array.from(memoryStore.keys());
    } catch {
      return [];
    }
  },
};

export default Storage;
