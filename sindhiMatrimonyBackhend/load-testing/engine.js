import http from "http";
import https from "https";
import { performance } from "perf_hooks";
import app from "../app.js";
import { User, Profile, PartnerPreference } from "../models/index.js";
import { signToken } from "../utils/jwtTokenUtils.js";

/**
 * ⚡ Universal Multi-Target Load & Security Benchmark Engine
 * Supports:
 * 1. Sindhi Matrimony Core APIs (In-memory mock or live backend)
 * 2. Any Custom External API / Project (Rider App, Cab CRM, Staging, Production)
 * 3. Multi-Scenario Attacks: Steady Concurrent, Spike Flood, DDoS Rate-Limit Stress, Endurance Soak
 * 4. Real-time SSE streaming, latency percentiles, error reasons & historical persistence
 */

export const testHistory = [];

export function setupDatabaseMocks() {
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

export function calculatePercentiles(latencies) {
  if (!latencies || latencies.length === 0) return { p50: 0, p90: 0, p95: 0, p99: 0, min: 0, max: 0, mean: 0 };
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
  testMode = "STEADY", // "STEADY" | "SPIKE" | "DDOS" | "SOAK"
  targetHost = "INTERNAL", // "INTERNAL" | "http://localhost:5000" | custom URL
  customUrl = "",
  customMethod = "GET",
  customHeaders = {},
  customBody = "",
  onProgress = () => {},
  abortSignal = { aborted: false },
}) {
  let server = null;
  let baseUrl = targetHost;

  setupDatabaseMocks();

  // If internal target, spin up ephemeral server
  if (targetHost === "INTERNAL") {
    await new Promise((resolve) => {
      server = http.createServer(app);
      server.listen(0, "127.0.0.1", () => {
        const port = server.address().port;
        baseUrl = `http://127.0.0.1:${port}`;
        resolve();
      });
    });
  }

  const isHttps = (customUrl || baseUrl).startsWith("https");
  const httpAgent = isHttps
    ? new https.Agent({ keepAlive: true, maxSockets: concurrency, rejectUnauthorized: false })
    : new http.Agent({ keepAlive: true, maxSockets: concurrency });

  const testToken = signToken({
    id: "67b34a12c8e312a0f8000001",
    phone: "9876543210",
    role: "MEMBER",
    status: "ACTIVE",
    activeProfileId: "67b34a12c8e312a0f8000002",
    profileRole: "OWNER",
  });

  const masterStart = performance.now();
  const initialMemory = process.memoryUsage();
  const latencies = [];
  const statusCodes = {};
  let completed = 0;
  let successCount = 0;
  let failedCount = 0;
  let currentIndex = 0;
  let sampleResponse = null;
  let lastReportTime = masterStart;
  let lastReportCompleted = 0;

  // Request builder factory
  const getRequestConfig = (index) => {
    // 1. If Custom External Project Mode:
    if (targetHost === "CUSTOM" && customUrl) {
      let body = customBody;
      // Interpolate {{index}}, {{phone}}, {{random}}
      if (body) {
        body = body
          .replace(/\{\{index\}\}/g, String(index))
          .replace(/\{\{phone\}\}/g, `98${String(10000000 + (index % 10000000)).padStart(8, "0")}`)
          .replace(/\{\{random\}\}/g, String(Math.floor(Math.random() * 1000000)));
      }

      return {
        url: customUrl,
        method: customMethod.toUpperCase(),
        headers: {
          "Content-Type": "application/json",
          ...customHeaders,
          ...(testMode === "DDOS" ? { "x-forwarded-for": "203.0.113.195" } : {}),
        },
        body: ["POST", "PUT", "PATCH"].includes(customMethod.toUpperCase()) ? body : undefined,
      };
    }

    // 2. Built-in Sindhi Matrimony Endpoints:
    // If DDoS mode: all requests come from simulated same IP to trigger rate limiter
    const simulatedIp = testMode === "DDOS" ? "203.0.113.195" : `192.168.1.${(index % 250) + 1}`;
    const phone = testMode === "DDOS"
      ? "9876543210" // Identical phone causes rate limiter trigger
      : `98${String(10000000 + (index % 10000000)).padStart(8, "0")}`;

    const defaultHeaders = {
      "Content-Type": "application/json",
      "x-forwarded-for": simulatedIp,
    };

    switch (apiEndpoint) {
      case "LOGIN":
        return {
          url: `${baseUrl}/api/v1/auth/verify-otp`,
          method: "POST",
          headers: defaultHeaders,
          body: JSON.stringify({ phone, otp: "123456", clientPlatform: "WEB" }),
        };

      case "SEND_OTP":
        return {
          url: `${baseUrl}/api/v1/auth/send-otp`,
          method: "POST",
          headers: defaultHeaders,
          body: JSON.stringify({ phone, purpose: "LOGIN", countryCode: "+91" }),
        };

      case "REGISTER":
        return {
          url: `${baseUrl}/api/v1/auth/register`,
          method: "POST",
          headers: defaultHeaders,
          body: JSON.stringify({
            phone,
            otp: "123456",
            name: `Candidate ${index + 1}`,
            gender: index % 2 === 0 ? "MALE" : "FEMALE",
            profileFor: "MYSELF",
            subcaste: "Bhaiband",
            dob: "1998-05-12",
            city: "Jaipur",
            state: "Rajasthan",
          }),
        };

      case "GET_PROFILE":
        return {
          url: `${baseUrl}/api/v1/profile/me`,
          method: "GET",
          headers: {
            ...defaultHeaders,
            Authorization: `Bearer ${testToken}`,
          },
        };

      case "UPDATE_PROFILE":
        return {
          url: `${baseUrl}/api/v1/profile/basic`,
          method: "PUT",
          headers: {
            ...defaultHeaders,
            Authorization: `Bearer ${testToken}`,
          },
          body: JSON.stringify({
            maritalStatus: "NEVER_MARRIED",
            height: 178,
            subcaste: "Bhaiband",
            gotra: "Advani",
            motherGotra: "Chhabria",
            location: { city: "Jaipur", state: "Rajasthan" },
          }),
        };

      case "HEALTH":
      default:
        return {
          url: `${baseUrl}/api/v1/health`,
          method: "GET",
          headers: defaultHeaders,
        };
    }
  };

  async function worker() {
    while (currentIndex < totalUsers && !abortSignal.aborted) {
      const reqIdx = currentIndex++;
      const config = getRequestConfig(reqIdx);
      const reqStart = performance.now();

      try {
        const res = await fetch(config.url, {
          method: config.method,
          agent: httpAgent,
          headers: {
            ...config.headers,
            "user-agent": "AegisLoadStudio/3.0",
          },
          body: config.body,
        });

        const duration = performance.now() - reqStart;
        latencies.push(duration);

        statusCodes[res.status] = (statusCodes[res.status] || 0) + 1;
        if (res.status >= 200 && res.status < 400) {
          successCount++;
        } else {
          failedCount++;
        }

        const text = await res.text();
        if (!sampleResponse || (res.status !== 200 && !sampleResponse.hasErrorSample)) {
          try {
            sampleResponse = {
              status: res.status,
              statusText: res.statusText,
              headers: Object.fromEntries(res.headers.entries()),
              body: JSON.parse(text),
              hasErrorSample: res.status !== 200,
            };
          } catch {
            sampleResponse = {
              status: res.status,
              statusText: res.statusText,
              body: text,
              hasErrorSample: res.status !== 200,
            };
          }
        }
      } catch (err) {
        const duration = performance.now() - reqStart;
        latencies.push(duration);
        failedCount++;
        statusCodes["ERR"] = (statusCodes["ERR"] || 0) + 1;
        if (!sampleResponse) {
          sampleResponse = {
            status: "NETWORK_ERROR",
            body: { error: err.message },
          };
        }
      }

      completed++;

      const now = performance.now();
      if (completed % 1000 === 0 || completed >= totalUsers || now - lastReportTime > 350) {
        const intervalDuration = (now - lastReportTime) / 1000;
        const intervalCompleted = completed - lastReportCompleted;
        const currentRps = intervalDuration > 0 ? Math.round(intervalCompleted / intervalDuration) : 0;
        const percent = Math.min(100, Number(((completed / totalUsers) * 100).toFixed(1)));
        const currentMemory = process.memoryUsage();

        onProgress({
          type: "PROGRESS",
          completed,
          total: totalUsers,
          percent,
          currentRps,
          successCount,
          failedCount,
          statusCodes: { ...statusCodes },
          recentLatencies: calculatePercentiles(latencies.slice(-500)),
          memoryMb: Number((currentMemory.heapUsed / (1024 * 1024)).toFixed(1)),
          sampleResponse,
        });

        lastReportTime = now;
        lastReportCompleted = completed;
      }
    }
  }

  try {
    const workers = Array.from({ length: concurrency }, () => worker());
    await Promise.all(workers);
  } finally {
    if (server) server.close();
    httpAgent.destroy();
  }

  const totalTimeMs = performance.now() - masterStart;
  const totalTimeSec = totalTimeMs / 1000;
  const avgRps = totalTimeSec > 0 ? Math.round(completed / totalTimeSec) : 0;
  const finalPercentiles = calculatePercentiles(latencies);
  const finalMemory = process.memoryUsage();

  const diagnosticReasons = [];
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
      title: "Rate Limited (429 Too Many Requests)",
      type: "WARNING",
      count: statusCodes["429"],
      explanation: "Dual-layer rate limiter successfully mitigated volumetric flood: abusive requests blocked in sub-0.1ms.",
    });
  }
  if (statusCodes["422"]) {
    diagnosticReasons.push({
      status: 422,
      title: "Validation Failure (422 Unprocessable)",
      type: "ERROR",
      count: statusCodes["422"],
      explanation: "Payload fields violated schema constraints (e.g. invalid phone format, missing required attributes).",
    });
  }
  if (statusCodes["401"]) {
    diagnosticReasons.push({
      status: 401,
      title: "Unauthorized (401)",
      type: "ERROR",
      count: statusCodes["401"],
      explanation: "Protected route rejected request because JWT Bearer token was either missing, expired, or revoked in Redis.",
    });
  }
  if (statusCodes["500"] || statusCodes["ERR"]) {
    diagnosticReasons.push({
      status: 500,
      title: "Server / Connection Error",
      type: "DANGER",
      count: (statusCodes["500"] || 0) + (statusCodes["ERR"] || 0),
      explanation: "Application exception, unhandled promise, or socket exhaustion occurred during stress benchmark.",
    });
  }

  const report = {
    id: `bench_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    projectName,
    type: "COMPLETED",
    totalUsers,
    completed,
    concurrency,
    apiEndpoint: targetHost === "CUSTOM" ? customUrl : apiEndpoint,
    testMode,
    targetHost,
    aborted: abortSignal.aborted,
    totalTimeSec: Number(totalTimeSec.toFixed(2)),
    totalTimeMs: Number(totalTimeMs.toFixed(0)),
    avgRps,
    successCount,
    failedCount,
    statusCodes,
    percentiles: finalPercentiles,
    memory: {
      initialHeapMb: Number((initialMemory.heapUsed / (1024 * 1024)).toFixed(1)),
      finalHeapMb: Number((finalMemory.heapUsed / (1024 * 1024)).toFixed(1)),
      deltaMb: Number(((finalMemory.heapUsed - initialMemory.heapUsed) / (1024 * 1024)).toFixed(1)),
      rssMb: Number((finalMemory.rss / (1024 * 1024)).toFixed(1)),
    },
    sampleResponse,
    diagnosticReasons,
  };

  // Keep last 30 reports in history
  testHistory.unshift(report);
  if (testHistory.length > 30) testHistory.pop();

  return report;
}
