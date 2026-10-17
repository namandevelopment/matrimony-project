import { AsyncLocalStorage } from "node:async_hooks";

/**
 * AsyncLocalStorage container for request-scoped development performance telemetry.
 * Safe across concurrent asynchronous Node.js operations without shared global state.
 */
export const devTrackerStorage = new AsyncLocalStorage();

/**
 * Retrieves the current request's active performance tracking context.
 * Returns null if outside an HTTP request context or in production mode.
 */
export const getDevTrackerContext = () => {
  return devTrackerStorage.getStore()?.trackerContext || null;
};

/**
 * Helper to record a database query inside the active request context.
 */
export const recordDatabaseQuery = (queryDetails) => {
  const ctx = getDevTrackerContext();
  if (ctx && Array.isArray(ctx.queries)) {
    ctx.queries.push(queryDetails);
  }
};

/**
 * Helper to record a Redis cache call inside the active request context.
 */
export const recordRedisCall = (redisDetails) => {
  const ctx = getDevTrackerContext();
  if (ctx && Array.isArray(ctx.redisCalls)) {
    ctx.redisCalls.push(redisDetails);
  }
};

export default {
  devTrackerStorage,
  getDevTrackerContext,
  recordDatabaseQuery,
  recordRedisCall,
};
