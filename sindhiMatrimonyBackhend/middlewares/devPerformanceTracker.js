import { devTrackerStorage } from "../utils/devTrackerContext.js";
import { redactSensitiveData } from "../utils/sensitiveDataRedactor.js";

export const MAX_DEV_LOG_ENTRIES = 500;
export const devMetricsStore = [];

/**
 * Clears the in-memory circular performance log buffer.
 */
export const clearMetricsStore = () => {
  devMetricsStore.length = 0;
};

/**
 * Returns a clone of all logged entries or a sliced recent view.
 */
export const getMetricsStore = (limit = 100, slowOnly = false) => {
  let list = [...devMetricsStore];
  if (slowOnly) {
    list = list.filter((item) => item.durationMs >= 50);
  }
  return list.slice(-limit).reverse();
};

/**
 * Computes aggregated summary statistics across tracked requests.
 */
export const getMetricsSummary = () => {
  const total = devMetricsStore.length;
  if (total === 0) {
    return {
      totalRequests: 0,
      avgDurationMs: 0,
      p95DurationMs: 0,
      p99DurationMs: 0,
      slowRequestsCount: 0,
      errorCount: 0,
      statusCodes: {},
      avgDbTimeMs: 0,
      totalDbQueries: 0,
      memoryHeapMB: parseFloat((process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)),
      uptimeSeconds: Math.floor(process.uptime()),
    };
  }

  const durations = devMetricsStore.map((e) => e.durationMs).sort((a, b) => a - b);
  const sumDuration = durations.reduce((a, b) => a + b, 0);
  const p95Index = Math.min(Math.floor(total * 0.95), total - 1);
  const p99Index = Math.min(Math.floor(total * 0.99), total - 1);

  const statusCodes = {};
  let slowRequestsCount = 0;
  let errorCount = 0;
  let totalDbQueries = 0;
  let totalDbTime = 0;

  for (const entry of devMetricsStore) {
    statusCodes[entry.statusCode] = (statusCodes[entry.statusCode] || 0) + 1;
    if (entry.durationMs >= 50) slowRequestsCount++;
    if (entry.statusCode >= 400) errorCount++;
    totalDbQueries += entry.dbQueryCount || 0;
    totalDbTime += entry.dbTimeMs || 0;
  }

  return {
    totalRequests: total,
    avgDurationMs: parseFloat((sumDuration / total).toFixed(2)),
    p95DurationMs: parseFloat((durations[p95Index] || 0).toFixed(2)),
    p99DurationMs: parseFloat((durations[p99Index] || 0).toFixed(2)),
    slowRequestsCount,
    errorCount,
    statusCodes,
    totalDbQueries,
    avgDbTimeMs: parseFloat((totalDbTime / total).toFixed(2)),
    memoryHeapMB: parseFloat((process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)),
    uptimeSeconds: Math.floor(process.uptime()),
  };
};

/**
 * Express High-Resolution Development Performance Profiler Middleware.
 * HARD SAFETY: Zero execution overhead in production environment.
 */
export const devPerformanceTracker = (req, res, next) => {
  // 🛑 HARD SAFETY GUARD: Never execute or allocate memory in production!
  if (process.env.NODE_ENV === "production") {
    return next();
  }

  const startTimeNs = process.hrtime.bigint();
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  const trackerContext = {
    requestId,
    startTimeNs,
    queries: [],
    redisCalls: [],
    middlewareTimings: {},
  };
  req.trackerContext = trackerContext;

  // Intercept response write and end streams to measure transferred byte count
  let responseBytes = 0;
  const originalWrite = res.write;
  const originalEnd = res.end;

  res.write = function (chunk, ...args) {
    if (chunk) {
      responseBytes += Buffer.isBuffer(chunk) ? chunk.length : Buffer.byteLength(chunk);
    }
    return originalWrite.apply(res, [chunk, ...args]);
  };

  res.end = function (chunk, ...args) {
    if (chunk) {
      responseBytes += Buffer.isBuffer(chunk) ? chunk.length : Buffer.byteLength(chunk);
    }

    const endTimeNs = process.hrtime.bigint();
    const durationMs = Number(endTimeNs - startTimeNs) / 1e6;

    const dbTimeMs = trackerContext.queries.reduce((acc, q) => acc + (q.durationMs || 0), 0);
    const redisTimeMs = trackerContext.redisCalls.reduce((acc, r) => acc + (r.durationMs || 0), 0);

    let requestPayloadBytes = 0;
    if (req.headers["content-length"]) {
      requestPayloadBytes = parseInt(req.headers["content-length"], 10) || 0;
    } else if (req.body && Object.keys(req.body).length > 0) {
      try {
        requestPayloadBytes = Buffer.byteLength(JSON.stringify(req.body));
      } catch {
        requestPayloadBytes = 0;
      }
    }

    const logEntry = {
      id: requestId,
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl || req.url,
      path: req.path,
      statusCode: res.statusCode,
      durationMs: parseFloat(durationMs.toFixed(2)),
      dbTimeMs: parseFloat(dbTimeMs.toFixed(2)),
      redisTimeMs: parseFloat(redisTimeMs.toFixed(2)),
      dbQueryCount: trackerContext.queries.length,
      requestPayloadBytes,
      responsePayloadBytes: responseBytes,
      memoryHeapUsedMB: parseFloat((process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)),
      queries: trackerContext.queries,
      redisCalls: trackerContext.redisCalls,
      requestBody: redactSensitiveData(req.body),
      queryParams: redactSensitiveData(req.query),
      clientIp: req.ip || req.headers["x-forwarded-for"] || "127.0.0.1",
    };

    // Circular rolling buffer management
    if (devMetricsStore.length >= MAX_DEV_LOG_ENTRIES) {
      devMetricsStore.shift();
    }
    devMetricsStore.push(logEntry);

    // Development Console Log with Visual Color Highlighting (suppressed during unit test runs)
    if (process.env.NODE_ENV !== "test" && !process.env.SILENT_TEST) {
      const color = durationMs > 100 ? "\x1b[31m" : durationMs > 50 ? "\x1b[33m" : "\x1b[32m";
      console.log(
        `⚡ [DEV-PERF] ${color}${req.method} ${req.originalUrl || req.url}\x1b[0m | ${res.statusCode} | ${durationMs.toFixed(1)}ms (DB: ${dbTimeMs.toFixed(1)}ms, ${trackerContext.queries.length} queries) | Resp: ${(responseBytes / 1024).toFixed(1)}KB`
      );
    }

    return originalEnd.apply(res, [chunk, ...args]);
  };

  // Run downstream chain within the thread-safe AsyncLocalStorage context
  devTrackerStorage.run({ trackerContext }, () => {
    next();
  });
};

export default devPerformanceTracker;
