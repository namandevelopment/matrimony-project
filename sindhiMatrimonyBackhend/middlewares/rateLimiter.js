import { apiHTTPResponse, logMessage } from "../utils/globalFunction.js";
import { HTTP_TOO_MANY_REQUESTS, TOO_MANY_REQUESTS, DATA_NULL, ERROR_TRUE } from "../utils/constants.js";
import { client } from "../services/serviceRedis.js";

/**
 * High-Performance Dual-Layer Rate Limiter (Redis + In-Memory Fallback)
 * Protects against SMS billing drain, registration spam, and brute-force attacks.
 */
const inMemoryLimiterStore = new Map();

// Periodic sweep for local in-memory records
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of inMemoryLimiterStore.entries()) {
    if (record.resetAt <= now) {
      inMemoryLimiterStore.delete(key);
    }
  }
}, 60000).unref();

export const createRateLimiter = ({
  windowSeconds = 600, // 10 minutes default
  maxRequests = 5,
  keyPrefix = "rate",
  message = "Too many requests. Please wait before trying again.",
  keyGenerator = (req) => req.ip || req.headers["x-forwarded-for"] || "global",
}) => {
  return async (req, res, next) => {
    // In automated test environments, bypass rate limiter to maintain sub-millisecond execution
    if (process.env.NODE_ENV === "test") {
      return next();
    }

    try {
      const identifier = keyGenerator(req);
      const limiterKey = `${keyPrefix}:${identifier}`;

      // 1. Try Redis first if connected
      if (client.isReady) {
        try {
          const count = await client.incr(limiterKey);
          if (count === 1) {
            await client.expire(limiterKey, windowSeconds);
          }

          if (count > maxRequests) {
            const ttl = await client.ttl(limiterKey);
            res.setHeader("Retry-After", ttl > 0 ? ttl : windowSeconds);
            return apiHTTPResponse(
              req,
              res,
              HTTP_TOO_MANY_REQUESTS,
              message,
              DATA_NULL,
              TOO_MANY_REQUESTS,
              ERROR_TRUE
            );
          }
          return next();
        } catch (redisErr) {
          logMessage("Redis rate limiter error, falling back to local memory:", redisErr, "warn");
        }
      }

      // 2. In-Memory fallback store
      const now = Date.now();
      let record = inMemoryLimiterStore.get(limiterKey);

      if (!record || record.resetAt <= now) {
        record = {
          count: 1,
          resetAt: now + windowSeconds * 1000,
        };
        inMemoryLimiterStore.set(limiterKey, record);
      } else {
        record.count += 1;
      }

      if (record.count > maxRequests) {
        const retrySec = Math.ceil((record.resetAt - now) / 1000);
        res.setHeader("Retry-After", Math.max(1, retrySec));
        return apiHTTPResponse(
          req,
          res,
          HTTP_TOO_MANY_REQUESTS,
          message,
          DATA_NULL,
          TOO_MANY_REQUESTS,
          ERROR_TRUE
        );
      }

      next();
    } catch (error) {
      logMessage("Critical rateLimiter middleware error:", error, "error");
      next(); // On unexpected limiter failure, fail-open so users aren't blocked
    }
  };
};

/**
 * 📲 Strict OTP Request Limiter
 * Maximum 5 OTP requests per mobile/IP within 10 minutes.
 */
export const otpRateLimiter = createRateLimiter({
  windowSeconds: 600,
  maxRequests: 5,
  keyPrefix: "rate:otp",
  message: "OTP request limit reached. Please wait 10 minutes before requesting a new code.",
  keyGenerator: (req) => `${req.body?.phone || ""}_${req.ip || "unknown"}`,
});

/**
 * 💍 Registration Endpoint Limiter
 * Maximum 10 registration attempts per IP within 15 minutes.
 */
export const registerRateLimiter = createRateLimiter({
  windowSeconds: 900,
  maxRequests: 10,
  keyPrefix: "rate:register",
  message: "Too many registration attempts. Please wait 15 minutes before retrying.",
  keyGenerator: (req) => `${req.ip || "unknown"}`,
});

/**
 * 🔑 Login / Verify OTP Brute-Force Limiter
 * Maximum 20 verification attempts per IP/Mobile within 15 minutes.
 */
export const authRateLimiter = createRateLimiter({
  windowSeconds: 900,
  maxRequests: 20,
  keyPrefix: "rate:auth",
  message: "Too many verification attempts. Please wait 15 minutes before retrying.",
  keyGenerator: (req) =>
    `${req.body?.phone || req.body?.mobileNumber || req.body?.mobile || req.body?.identifier || ""}_${req.ip || "unknown"}`,
});

export default {
  createRateLimiter,
  otpRateLimiter,
  registerRateLimiter,
  authRateLimiter,
};
