import http from "http";
import https from "https";
import { performance } from "perf_hooks";

// Keep-Alive Agents for ultra-high throughput without TCP handshake bottleneck
const httpAgent = new http.Agent({ keepAlive: true, maxSockets: 1000, keepAliveMsecs: 60000 });
const httpsAgent = new https.Agent({ keepAlive: true, maxSockets: 1000, keepAliveMsecs: 60000 });

// History store for all tests executed in current session
export const testHistory = [];

// Try to dynamically load backend models & app for in-memory direct testing
let backendApp = null;
let User = null;
let Profile = null;
let PartnerPreference = null;
let signToken = null;

try {
  const appModule = await import("../sindhiMatrimonyBackhend/app.js");
  backendApp = appModule.default || appModule;

  const modelsModule = await import("../sindhiMatrimonyBackhend/models/index.js");
  User = modelsModule.User;
  Profile = modelsModule.Profile;
  PartnerPreference = modelsModule.PartnerPreference;

  const jwtModule = await import("../sindhiMatrimonyBackhend/utils/jwtTokenUtils.js");
  signToken = jwtModule.signToken;
} catch (err) {
  console.log("ℹ️ In-memory backend import optional:", err.message);
}

/**
 * Setup database mocks for in-memory backend testing
 * Ensures zero database locks or buffer timeouts occur during high-scale benchmark runs
 */
export function setupDatabaseMocks() {
  if (!User || !Profile || !PartnerPreference) return;

  const mockUser = {
    _id: "67b34a12c8e312a0f8000001",
    phone: "9876543210",
    role: "MEMBER",
    status: "ACTIVE",
    activeProfileId: "67b34a12c8e312a0f8000002",
    toObject() { return { ...this }; },
  };

  const mockProfile = {
    _id: "67b34a12c8e312a0f8000002",
    userId: "67b34a12c8e312a0f8000001",
    name: "Rohan Advani",
    gender: "MALE",
    subcaste: "Bhaiband",
    gotra: "Advani",
    motherGotra: "Chhabria",
    height: 178,
    maritalStatus: "NEVER_MARRIED",
    location: { city: "Jaipur", state: "Rajasthan", country: "India" },
    education: { degree: "B.Tech", field: "Computer Science", college: "MNIT Jaipur" },
    profession: { occupation: "Software Engineer", companyName: "Tech Corp", annualIncome: 1800000 },
    family: { fatherName: "Rajesh Advani", familyType: "NUCLEAR" },
    photos: [],
    toObject() { return { ...this }; },
    save() { return Promise.resolve(this); },
  };

  const mockPartnerPreference = {
    _id: "67b34a12c8e312a0f8000003",
    userId: "67b34a12c8e312a0f8000001",
    ageMin: 22,
    ageMax: 28,
    subcastes: ["Bhaiband", "Sindhi"],
    toObject() { return { ...this }; },
  };

  const createQueryChain = (data) => ({
    select: () => createQueryChain(data),
    lean: () => Promise.resolve(data),
    then: (resolve, reject) => Promise.resolve(data).then(resolve, reject),
  });

  User.findOne = (query) => createQueryChain({ ...mockUser, phone: query?.phone || mockUser.phone });
  User.findById = () => createQueryChain(mockUser);
  User.updateOne = () => Promise.resolve({ acknowledged: true, modifiedCount: 1 });
  User.create = (doc) => Promise.resolve({ ...mockUser, ...doc, toObject() { return this; } });

  Profile.findOne = () => createQueryChain(mockProfile);
  Profile.findOneAndUpdate = (q, u) => createQueryChain({ ...mockProfile, ...(u?.$set || {}) });
  Profile.create = (doc) => Promise.resolve({ ...mockProfile, ...doc, toObject() { return this; } });

  PartnerPreference.findOne = () => createQueryChain(mockPartnerPreference);
  PartnerPreference.findOneAndUpdate = (q, u) => createQueryChain({ ...mockPartnerPreference, ...(u?.$set || {}) });
  PartnerPreference.create = (doc) => Promise.resolve({ ...mockPartnerPreference, ...doc, toObject() { return this; } });
}

/**
 * High-precision percentile calculations
 */
export function calculatePercentiles(latencies) {
  if (!latencies || latencies.length === 0) {
    return { min: 0, mean: 0, p50: 0, p90: 0, p95: 0, p99: 0, max: 0 };
  }
  const sorted = [...latencies].sort((a, b) => a - b);
  const sum = sorted.reduce((acc, val) => acc + val, 0);
  const getP = (p) => sorted[Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length))];

  return {
    min: Number(sorted[0].toFixed(2)),
    mean: Number((sum / sorted.length).toFixed(2)),
    p50: Number(getP(50).toFixed(2)),
    p90: Number(getP(90).toFixed(2)),
    p95: Number(getP(95).toFixed(2)),
    p99: Number(getP(99).toFixed(2)),
    max: Number(sorted[sorted.length - 1].toFixed(2)),
  };
}

/**
 * Universal Load Testing Execution Engine
 */
export async function executeLoadTest({
  projectName = "Sindhi Matrimony",
  totalUsers = 50000,
  concurrency = 100,
  apiEndpoint = "LOGIN",
  testMode = "STEADY",
  targetHost = "INTERNAL",
  customUrl = "",
  customMethod = "GET",
  customHeaders = {},
  customBody = "",
  onProgress = () => {},
  abortSignal = { aborted: false },
}) {
  setupDatabaseMocks();

  // Attack Mode adjustments
  let activeConcurrency = concurrency;
  let simulatedClientIp = null;

  if (testMode === "SPIKE") {
    activeConcurrency = Math.min(500, concurrency * 2);
  } else if (testMode === "DDOS") {
    // Single IP flood to trigger and verify HTTP 429 Rate Limiting
    simulatedClientIp = "192.168.1.99";
    activeConcurrency = Math.min(500, concurrency * 2);
  }

  // Pre-generate a test JWT for endpoints that require Bearer token
  let sampleBearerToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.demo";
  if (signToken) {
    sampleBearerToken = signToken({
      userId: "67b34a12c8e312a0f8000001",
      role: 6,
      phone: "9876543210",
      profileId: "67b34a12c8e312a0f8000002",
      activeProfileId: "67b34a12c8e312a0f8000002",
      profileRole: "OWNER",
    });
  }

  // Start internal server if in-memory mode is selected
  let internalServer = null;
  let targetBaseUrl = "";

  if (targetHost === "INTERNAL" && backendApp) {
    await new Promise((resolve) => {
      internalServer = http.createServer(backendApp);
      internalServer.listen(0, "127.0.0.1", () => {
        const port = internalServer.address().port;
        targetBaseUrl = `http://127.0.0.1:${port}`;
        resolve();
      });
    });
  }

  const initialHeap = process.memoryUsage().heapUsed;
  const startTime = performance.now();

  const statusCodes = {};
  const latencies = [];
  const diagnosticReasons = [];
  let sampleResponse = null;
  let completed = 0;
  let successCount = 0;
  let failedCount = 0;
  let currentIndex = 0;

  // 🚨 Crash Forensics & Root Cause Intelligence Store
  const failureForensics = {
    hasCrashes: false,
    firstCrash: null,
    errorBuckets: {},
  };

  function recordCrashEvent({ idx, reqDuration, status, statusText, headers, body, err, reqUrl, reqMethod, reqHeaders, reqPayload }) {
    failureForensics.hasCrashes = true;

    let signature = "HTTP_ERROR";
    let errorTitle = `HTTP ${status} Error`;
    let rca = "API endpoint returned an error response under concurrent stress.";
    let fix = "Review server controller error handlers and application logs.";

    if (err) {
      const code = err.code || "EXCEPTION";
      signature = `SOCKET_${code}`;
      errorTitle = `Socket Failure: ${code}`;
      if (code === "ECONNREFUSED") {
        rca = "Connection refused by target host. The backend Node.js process crashed or stopped listening on port.";
        fix = "Check if backend server crashed. Run in PM2 cluster mode ('pm2 start -i max') with auto-restart on uncaught exceptions.";
      } else if (code === "ETIMEDOUT" || code === "ERR_SOCKET_TIMEOUT" || err.message?.includes("Timeout")) {
        rca = "Request timed out after 10,000ms. Node.js Event Loop was frozen by heavy synchronous computations, or MongoDB queries without indexes blocked the worker queue.";
        fix = "Add compound MongoDB indexes (phone, userId). Eliminate blocking crypto (bcrypt.hashSync). Move heavy tasks to worker threads or BullMQ.";
      } else if (code === "ECONNRESET") {
        rca = "TCP connection abruptly reset by upstream. Server hit OS file descriptor limit or crashed during response serialization.";
        fix = "Increase system file descriptor limits ('ulimit -n 65535'). Tune Linux TCP backlog ('net.core.somaxconn = 65535').";
      } else {
        rca = `Network Exception: ${err.message}`;
        fix = "Verify target host DNS resolution, firewall rules, and network connectivity.";
      }
    } else {
      switch (status) {
        case 500:
          signature = "HTTP_500_INTERNAL_SERVER_ERROR";
          errorTitle = "500 Internal Server Error (Backend Crash)";
          rca = "Controller handler threw an uncaught exception, unhandled promise rejection, or MongoDB connection timed out under write load.";
          fix = "Wrap async routes with try/catch or 'express-async-errors'. Disable Mongoose bufferCommands. Check server logs for exact stack trace.";
          break;
        case 504:
          signature = "HTTP_504_GATEWAY_TIMEOUT";
          errorTitle = "504 Gateway Timeout (Event Loop Bottleneck)";
          rca = "Upstream server failed to respond within gateway timeout. Database queries queued up waiting for collection locks.";
          fix = "Implement Redis caching for hot reads. Ensure MongoDB connection pool maxPoolSize >= 50. Optimize slow query explain plans.";
          break;
        case 502:
          signature = "HTTP_502_BAD_GATEWAY";
          errorTitle = "502 Bad Gateway (Proxy Upstream Dropped)";
          rca = "Nginx or Cloudflare reverse proxy could not reach the backend process because Node.js crashed or exceeded memory limit (OOM).";
          fix = "Check Linux kernel OOM kills ('dmesg -T | grep -i oom'). Increase Express server.keepAliveTimeout to 65000ms.";
          break;
        case 503:
          signature = "HTTP_503_SERVICE_UNAVAILABLE";
          errorTitle = "503 Service Unavailable (Capacity Overloaded)";
          rca = "Server or database connection pool refused new connections to prevent catastrophic hardware panic.";
          fix = "Implement connection backpressure. Scale backend horizontally behind load balancer across multiple CPU cores.";
          break;
        case 429:
          signature = "HTTP_429_TOO_MANY_REQUESTS";
          errorTitle = "429 Rate Limited (DDoS Guard Active)";
          rca = "Dual-layer rate limiter throttled incoming traffic to protect API infrastructure from DDoS flood.";
          fix = "If this is legitimate spike traffic, increase rateLimiter.js window limits or configure distributed Redis token bucket.";
          break;
        case 422:
        case 400:
          signature = `HTTP_${status}_VALIDATION_REJECTION`;
          errorTitle = `${status} Validation Rejection`;
          rca = "Client sent request payload that failed Joi schema validation or missing required parameters.";
          fix = "Inspect rejected request body schema in sample payload. Update payload fields to match backend Joi rules.";
          break;
        default:
          signature = `HTTP_${status}_RESPONSE`;
          errorTitle = `HTTP ${status} Response`;
          rca = `Server returned status code ${status} with message: ${statusText || 'N/A'}`;
          fix = "Check application route logs and API documentation for status code specifications.";
          break;
      }
    }

    const errMessage = err ? err.message : (typeof body === "object" && body?.message ? body.message : statusText || "Request failed");

    // 1. Record Exact Tipping Point (First failure in benchmark)
    if (!failureForensics.firstCrash) {
      failureForensics.firstCrash = {
        requestIndex: idx + 1,
        elapsedSec: Number(((performance.now() - startTime) / 1000).toFixed(2)),
        rpsAtCrash: completed > 0 ? Math.round(completed / ((performance.now() - startTime) / 1000)) : 0,
        statusCode: status || 500,
        signature,
        errorTitle,
        errorMessage: errMessage,
        request: {
          url: reqUrl,
          method: reqMethod,
          headers: reqHeaders,
          payload: reqPayload,
        },
        response: {
          status: status || 500,
          statusText: statusText || (err ? err.code : "Error"),
          headers: headers || {},
          body: body || (err ? { error: true, code: err.code, message: err.message } : null),
        },
      };
    }

    // 2. Aggregate into Distinct Error Buckets
    if (!failureForensics.errorBuckets[signature]) {
      failureForensics.errorBuckets[signature] = {
        signature,
        statusCode: status || 500,
        errorTitle,
        count: 0,
        rcaAnalysis: rca,
        fixRecommendation: fix,
        sampleRequest: {
          url: reqUrl,
          method: reqMethod,
          headers: reqHeaders,
          payload: reqPayload,
        },
        sampleResponse: {
          status: status || 500,
          statusText: statusText || (err ? err.code : "Error"),
          headers: headers || {},
          body: body || (err ? { error: true, code: err.code, message: err.message } : null),
        },
      };
    }
    failureForensics.errorBuckets[signature].count++;
  }

  // Stream progress reporting throttle
  let lastProgressReportTime = performance.now();
  const PROGRESS_INTERVAL_MS = 120;

  async function worker(workerId) {
    while (currentIndex < totalUsers && !abortSignal.aborted) {
      const idx = currentIndex++;
      const userPhone = `981${String(idx).padStart(7, "0")}`;

      // Build target request
      let reqUrl = "";
      let reqMethod = "GET";
      let reqHeaders = { "Content-Type": "application/json" };
      let reqPayload = null;
      let isSimulated = false;
      let simulatedResponse = null;

      if (targetHost === "CUSTOM" && customUrl) {
        reqUrl = customUrl.trim();
        if (!reqUrl.startsWith("http://") && !reqUrl.startsWith("https://")) {
          reqUrl = "https://" + reqUrl;
        }
        reqMethod = (customMethod || "GET").toUpperCase();
        reqHeaders = {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 AegisLoad/2.0",
          "Accept": "text/html,application/xhtml+xml,application/xml,application/json;q=0.9,*/*;q=0.8",
          ...customHeaders,
        };

        if (customBody && ["POST", "PUT", "PATCH"].includes(reqMethod)) {
          let interpolatedBody = customBody
            .replace(/\{\{index\}\}/g, String(idx))
            .replace(/\{\{phone\}\}/g, userPhone)
            .replace(/\{\{timestamp\}\}/g, String(Date.now()));
          reqPayload = interpolatedBody;
        }
      } else {
        // Built-in Sindhi Matrimony endpoints & Crash Simulators
        const base = targetBaseUrl || "http://localhost:5000";

        switch (apiEndpoint) {
          case "SEND_OTP":
            reqUrl = `${base}/api/v1/auth/send-otp`;
            reqMethod = "POST";
            reqPayload = JSON.stringify({ phone: userPhone, reason: "LOGIN" });
            break;

          case "REGISTER":
            reqUrl = `${base}/api/v1/auth/register`;
            reqMethod = "POST";
            reqPayload = JSON.stringify({
              phone: userPhone,
              otp: "123456",
              accountFor: "SELF",
              name: `Candidate ${idx}`,
              gender: idx % 2 === 0 ? "MALE" : "FEMALE",
              subcaste: "Bhaiband",
              maritalStatus: "NEVER_MARRIED",
              height: 175,
              education: { degree: "B.Tech", field: "Computer Science" },
              profession: { occupation: "Software Engineer", annualIncome: 1200000 },
              family: { fatherName: "Rajesh Advani", familyType: "NUCLEAR" },
              location: { city: "Jaipur", state: "Rajasthan", country: "India" },
            });
            break;

          case "GET_PROFILE":
            reqUrl = `${base}/api/v1/profile/me`;
            reqMethod = "GET";
            reqHeaders["Authorization"] = `Bearer ${sampleBearerToken}`;
            break;

          case "UPDATE_PROFILE":
            reqUrl = `${base}/api/v1/profile/basic`;
            reqMethod = "PUT";
            reqHeaders["Authorization"] = `Bearer ${sampleBearerToken}`;
            reqPayload = JSON.stringify({
              name: `Candidate ${idx} Updated`,
              height: 180,
              subcaste: "Sindhi",
            });
            break;

          case "HEALTH":
            reqUrl = `${base}/api/v1/health`;
            reqMethod = "GET";
            break;

          case "SIMULATE_CRASH_500":
            // Simulated 500 Server Crash for RCA testing
            isSimulated = true;
            simulatedResponse = {
              status: 500,
              statusText: "Internal Server Error",
              headers: { "content-type": "application/json" },
              body: {
                error: true,
                code: "MONGOOSE_LOCK_CRASH",
                name: "MongoTimeoutError",
                message: "Server Crash: Operation `users.findOne()` buffering timed out after 10000ms. MongoDB write lock saturation under high concurrency.",
                stack: "MongoTimeoutError: Operation users.findOne() timed out\n    at ConnectionPool.checkout (/app/node_modules/mongodb/lib/cmap/connection_pool.js:142)\n    at users.findOne (/app/controllers/auth/users.js:84)"
              }
            };
            break;

          case "SIMULATE_TIMEOUT_504":
            // Simulated 504 Gateway Timeout for RCA testing
            isSimulated = true;
            simulatedResponse = {
              status: 504,
              statusText: "Gateway Timeout",
              headers: { "content-type": "application/json" },
              body: {
                error: true,
                code: "GATEWAY_TIMEOUT",
                name: "GatewayTimeoutError",
                message: "504 Gateway Timeout: Upstream Node.js event loop did not respond within 10,000ms. Event Loop was starved by heavy synchronous processing."
              }
            };
            break;

          case "CHAOS_FAULT_INJECTION":
            // Chaos mode: 35% chance of crash/timeout
            if (idx % 3 === 0) {
              isSimulated = true;
              simulatedResponse = {
                status: 500,
                statusText: "Internal Server Error",
                headers: { "content-type": "application/json" },
                body: { error: true, code: "CHAOS_ERR_500", message: "Chaos Injected: Controller threw uncaught reference exception under memory stress." }
              };
            } else if (idx % 5 === 0) {
              isSimulated = true;
              simulatedResponse = {
                status: 504,
                statusText: "Gateway Timeout",
                headers: { "content-type": "application/json" },
                body: { error: true, code: "CHAOS_TIMEOUT", message: "Chaos Injected: Event loop lag exceeded 8,500ms." }
              };
            } else {
              reqUrl = `${base}/api/v1/auth/verify-otp`;
              reqMethod = "POST";
              reqPayload = JSON.stringify({ phone: userPhone, otp: "123456" });
            }
            break;

          case "LOGIN":
          default:
            reqUrl = `${base}/api/v1/auth/verify-otp`;
            reqMethod = "POST";
            reqPayload = JSON.stringify({ phone: userPhone, otp: "123456" });
            break;
        }
      }

      if (simulatedClientIp) {
        reqHeaders["x-forwarded-for"] = simulatedClientIp;
      } else {
        reqHeaders["x-forwarded-for"] = `10.0.${Math.floor(idx / 256) % 256}.${idx % 256}`;
      }

      // Execute HTTP request
      const reqStart = performance.now();
      try {
        let response;
        if (isSimulated && simulatedResponse) {
          response = simulatedResponse;
        } else {
          response = await dispatchRequest({
            url: reqUrl,
            method: reqMethod,
            headers: reqHeaders,
            body: reqPayload,
          });
        }

        const reqDuration = performance.now() - reqStart;
        latencies.push(reqDuration);

        const status = response.status;
        statusCodes[status] = (statusCodes[status] || 0) + 1;

        if (status >= 200 && status < 300) {
          successCount++;
        } else {
          failedCount++;
          recordCrashEvent({
            idx,
            reqDuration,
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
            body: response.body,
            err: null,
            reqUrl,
            reqMethod,
            reqHeaders,
            reqPayload,
          });
        }

        // Capture sample response
        if (!sampleResponse || (response.status !== 200 && !sampleResponse.hasErrorSample)) {
          sampleResponse = {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
            body: response.body,
            hasErrorSample: response.status !== 200,
          };
        }
      } catch (err) {
        const reqDuration = performance.now() - reqStart;
        latencies.push(reqDuration);
        statusCodes["500"] = (statusCodes["500"] || 0) + 1;
        failedCount++;

        recordCrashEvent({
          idx,
          reqDuration,
          status: 500,
          statusText: err.code || "Network Exception",
          headers: {},
          body: { error: true, code: err.code, message: err.message },
          err,
          reqUrl,
          reqMethod,
          reqHeaders,
          reqPayload,
        });

        if (!sampleResponse) {
          sampleResponse = {
            status: 500,
            statusText: "Client Exception / Network Error",
            headers: {},
            body: { error: true, code: err.code, message: err.message },
            hasErrorSample: true,
          };
        }
      }

      completed++;

      // Emit Progress event over SSE
      const now = performance.now();
      if (now - lastProgressReportTime > PROGRESS_INTERVAL_MS || completed >= totalUsers) {
        lastProgressReportTime = now;
        const currentElapsedSec = (now - startTime) / 1000;
        const currentRps = currentElapsedSec > 0 ? Math.round(completed / currentElapsedSec) : 0;
        const recentPercentiles = calculatePercentiles(latencies.slice(-500));

        onProgress({
          type: "PROGRESS",
          completed,
          total: totalUsers,
          percent: Number(((completed / totalUsers) * 100).toFixed(1)),
          currentRps,
          successCount,
          failedCount,
          statusCodes,
          recentLatencies: recentPercentiles,
          memoryMb: Number(((process.memoryUsage().heapUsed - initialHeap) / 1024 / 1024).toFixed(1)),
          sampleResponse,
          crashAlert: failureForensics.hasCrashes ? {
            hasCrashes: true,
            failedCount,
            firstCrash: failureForensics.firstCrash,
          } : null,
        });
      }
    }
  }

  // Spawn parallel concurrent workers
  const workerPool = [];
  for (let i = 0; i < activeConcurrency; i++) {
    workerPool.push(worker(i));
  }
  await Promise.all(workerPool);

  const totalTimeMs = performance.now() - startTime;
  const totalTimeSec = Number((totalTimeMs / 1000).toFixed(2));
  const avgRps = totalTimeSec > 0 ? Math.round(completed / totalTimeSec) : 0;
  const finalHeap = process.memoryUsage().heapUsed;
  const heapDeltaMb = Number(((finalHeap - initialHeap) / 1024 / 1024).toFixed(1));
  const rssMb = Number((process.memoryUsage().rss / 1024 / 1024).toFixed(1));
  const percentiles = calculatePercentiles(latencies);

  // Close internal in-memory test server
  if (internalServer) {
    await new Promise((resolve) => internalServer.close(resolve));
  }

  // Compute Overall Crash Severity & RCA Buckets
  const errorBucketList = Object.values(failureForensics.errorBuckets).map(b => ({
    ...b,
    percentage: Number(((b.count / totalUsers) * 100).toFixed(1)),
  }));

  let crashSeverity = "HEALTHY";
  if (failedCount > 0) {
    const failureRatio = failedCount / totalUsers;
    if (failureRatio >= 0.5) crashSeverity = "CATASTROPHIC_CRASH";
    else if (failureRatio >= 0.1) crashSeverity = "HIGH_INSTABILITY";
    else crashSeverity = "MINOR_DEGRADATION";
  }

  const crashForensicsReport = {
    hasCrashes: failureForensics.hasCrashes,
    severity: crashSeverity,
    breakingPoint: failureForensics.firstCrash,
    errorBuckets: errorBucketList,
    totalFailures: failedCount,
    failureRatePercent: Number(((failedCount / totalUsers) * 100).toFixed(2)),
  };

  // Synthesize diagnostic reasons
  if (statusCodes["200"]) {
    diagnosticReasons.push({
      status: 200,
      title: "Success (200 OK)",
      type: "SUCCESS",
      count: statusCodes["200"],
      explanation: "Requests passed through Express routing, validation, security guards, and returned successfully.",
    });
  }
  if (statusCodes["429"]) {
    diagnosticReasons.push({
      status: 429,
      title: "Rate Limit Triggered (429 Too Many Requests)",
      type: "WARNING",
      count: statusCodes["429"],
      explanation: "DDoS rate limiting protection activated! Dual-layer token bucket prevented server exhaustion.",
    });
  }
  if (statusCodes["422"] || statusCodes["400"]) {
    const c = (statusCodes["422"] || 0) + (statusCodes["400"] || 0);
    diagnosticReasons.push({
      status: 422,
      title: "Validation / Client Rejection (400 / 422)",
      type: "WARNING",
      count: c,
      explanation: "Joi schema validation or client parameters blocked invalid payload format.",
    });
  }
  if (statusCodes["500"]) {
    diagnosticReasons.push({
      status: 500,
      title: "Internal Server Error (500)",
      type: "ERROR",
      count: statusCodes["500"],
      explanation: "Unhandled exception or backend error occurred during execution.",
    });
  }

  const finalReport = {
    id: `bench_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    projectName,
    type: "COMPLETED",
    totalUsers,
    completed,
    concurrency: activeConcurrency,
    apiEndpoint: targetHost === "CUSTOM" ? customUrl : apiEndpoint,
    testMode,
    targetHost,
    aborted: abortSignal.aborted,
    totalTimeSec,
    totalTimeMs: Math.round(totalTimeMs),
    avgRps,
    successCount,
    failedCount,
    statusCodes,
    percentiles,
    memory: {
      initialHeapMb: Number((initialHeap / 1024 / 1024).toFixed(1)),
      finalHeapMb: Number((finalHeap / 1024 / 1024).toFixed(1)),
      deltaMb: heapDeltaMb,
      rssMb,
    },
    sampleResponse,
    diagnosticReasons,
    crashForensics: crashForensicsReport,
  };

  testHistory.unshift(finalReport);
  if (testHistory.length > 50) testHistory.pop();

  return finalReport;
}

/**
 * High-performance HTTP/HTTPS dispatcher with connection reuse
 */
function dispatchRequest({ url, method, headers, body }) {
  return new Promise((resolve, reject) => {
    try {
      const parsedUrl = new URL(url);
      const isHttps = parsedUrl.protocol === "https:";
      const lib = isHttps ? https : http;
      const agent = isHttps ? httpsAgent : httpAgent;

      const options = {
        protocol: parsedUrl.protocol,
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || (isHttps ? 443 : 80),
        path: parsedUrl.pathname + parsedUrl.search,
        method: method,
        headers: headers,
        agent: agent,
        timeout: 10000,
      };

      const req = lib.request(options, (res) => {
        let rawData = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => { rawData += chunk; });
        res.on("end", () => {
          let parsedBody = rawData;
          try {
            parsedBody = JSON.parse(rawData);
          } catch (e) {
            if (typeof rawData === "string" && rawData.length > 5000) {
              parsedBody = rawData.substring(0, 5000) + "\n... [TRUNCATED - HTML CONTENT]";
            }
          }
          resolve({
            status: res.statusCode,
            statusText: res.statusMessage,
            headers: res.headers,
            body: parsedBody,
          });
        });
      });

      req.on("error", (err) => { reject(err); });
      req.on("timeout", () => {
        req.destroy();
        reject(new Error("Socket Timeout (10,000ms exceeded)"));
      });

      if (body) {
        req.write(body);
      }
      req.end();
    } catch (err) {
      reject(err);
    }
  });
}
