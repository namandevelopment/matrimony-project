import { createClient } from "redis";
import { logMessage } from "../utils/globalFunction.js";
import { REDIS_KEYS } from "../utils/constants.js";

const {
  REDIS_HOST = "127.0.0.1",
  REDIS_PORT = 6379,
  REDIS_PASSWORD,
} = process.env;

const redisOptions = {
  socket: {
    host: REDIS_HOST,
    port: Number(REDIS_PORT),
    connectTimeout: 2000,
    reconnectStrategy: (retries) => {
      if (retries > 1) {
        return false;
      }
      return 500;
    },
  },
  ...(REDIS_PASSWORD ? { password: REDIS_PASSWORD } : {}),
};

let isRedisInitialized = false;

export const client = createClient(redisOptions);
export const publisher = createClient(redisOptions);
export const subscriber = createClient(redisOptions);

client.on("error", (err) => logMessage("Redis Client Error:", err?.message || err, "warn"));
publisher.on("error", (err) => logMessage("Redis Publisher Error:", err?.message || err, "warn"));
subscriber.on("error", (err) => logMessage("Redis Subscriber Error:", err?.message || err, "warn"));

export const initializeRedis = async () => {
  try {
    if (isRedisInitialized && client.isReady) {
      logMessage("ℹ️ Redis already initialized", null, "info");
      return;
    }

    if (!client.isReady) {
      await client.connect();
      logMessage("✅ Redis client connected", null, "info");
    }
    if (!publisher.isReady) {
      await publisher.connect();
      logMessage("✅ Redis publisher connected", null, "info");
    }
    if (!subscriber.isReady) {
      await subscriber.connect();
      logMessage("✅ Redis subscriber connected", null, "info");
    }

    isRedisInitialized = true;
  } catch (error) {
    logMessage("⚠️ Redis connection failed (running in fallback/standalone mode):", error?.message || error, "warn");
  }
};

// In-memory fallback cache when Redis is down or unavailable
const memoryCache = new Map();

// Periodic expired key sweeper every 60s
setInterval(() => {
  const now = Date.now();
  for (const [key, item] of memoryCache.entries()) {
    if (item.expiresAt && item.expiresAt <= now) {
      memoryCache.delete(key);
    }
  }
}, 60000).unref();

export const getKey = async (key) => {
  try {
    if (client.isReady) {
      return await client.get(key);
    }
  } catch (err) {
    logMessage(`Error getting Redis key ${key}:`, err, "error");
  }

  // Fallback to local memory store
  const cached = memoryCache.get(key);
  if (cached) {
    if (!cached.expiresAt || cached.expiresAt > Date.now()) {
      return cached.value;
    }
    memoryCache.delete(key);
  }
  return null;
};

export const setKeyWithTime = async (key, value, seconds) => {
  const strValue = typeof value === "object" ? JSON.stringify(value) : String(value);
  try {
    if (client.isReady) {
      return await client.set(key, strValue, { EX: seconds });
    }
  } catch (err) {
    logMessage(`Error setting Redis key with expiry ${key}:`, err, "error");
  }

  // Fallback to local memory store
  memoryCache.set(key, {
    value: strValue,
    expiresAt: Date.now() + seconds * 1000,
  });
  return "OK";
};

export const setKeyNoTime = async (key, value) => {
  const strValue = typeof value === "object" ? JSON.stringify(value) : String(value);
  try {
    if (client.isReady) {
      return await client.set(key, strValue);
    }
  } catch (err) {
    logMessage(`Error setting Redis key ${key}:`, err, "error");
  }

  memoryCache.set(key, {
    value: strValue,
    expiresAt: null,
  });
  return "OK";
};

export const removeKey = async (key) => {
  try {
    if (client.isReady) {
      return await client.del(key);
    }
  } catch (err) {
    logMessage(`Error removing Redis key ${key}:`, err, "error");
  }

  return memoryCache.delete(key) ? 1 : 0;
};

export const isTokenRevoked = async (token) => {
  try {
    if (!token) return false;
    const key = `${REDIS_KEYS.TOKEN_BLACKLIST_PREFIX}${token}`;
    if (client.isReady) {
      const exists = await client.get(key);
      return Boolean(exists);
    }
    return Boolean(memoryCache.get(key));
  } catch (err) {
    logMessage("Error checking token blacklist in Redis:", err, "error");
    return false;
  }
};

