import { setKeyWithTime } from "../services/serviceRedis.js";
import { REDIS_KEYS } from "./constants.js";
import { logMessage } from "./globalFunction.js";

/**
 * Invalidate an active JWT token by storing it in Redis until its natural expiration
 * @param {string} token - The raw Bearer JWT token to blacklist
 * @param {number} expiryInSeconds - Time-to-live in seconds (default: 86400 / 24h)
 */
export const invalidateTokenInRedis = async (token, expiryInSeconds = 86400) => {
  try {
    if (!token) return;
    const redisKey = `${REDIS_KEYS.TOKEN_BLACKLIST_PREFIX}${token}`;
    await setKeyWithTime(redisKey, "revoked", expiryInSeconds);
    logMessage(`Token successfully blacklisted in Redis for ${expiryInSeconds}s`, null, "info");
  } catch (error) {
    logMessage("Failed to blacklist token in Redis:", error, "error");
  }
};
