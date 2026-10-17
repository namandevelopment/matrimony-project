import http from "http";
import app from "../../app.js";
import { TestSuite, assert } from "../helpers/testUtils.js";
import {
  devMetricsStore,
  getMetricsStore,
  getMetricsSummary,
  clearMetricsStore,
} from "../../middlewares/devPerformanceTracker.js";
import { redactSensitiveData } from "../../utils/sensitiveDataRedactor.js";
import { devTrackerStorage, recordDatabaseQuery } from "../../utils/devTrackerContext.js";

export async function runDevPerformanceTrackerIntegrationTests() {
  const suite = new TestSuite("Local Development API Performance Tracker (Phase 4 / Task 2)");

  let server;
  let baseUrl;

  // Spin up temporary test HTTP server
  await new Promise((resolve) => {
    server = http.createServer(app);
    server.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });

  try {
    // ------------------------------------------------------------------------
    // TC-24 & UC-11: Performance Tracker Metrics Capture
    // ------------------------------------------------------------------------
    suite.add("TC-24: Dev Tracker captures API response time, status, and payload sizes", async () => {
      clearMetricsStore();

      // 1. Dispatch an API request to generate telemetry
      const apiRes = await fetch(`${baseUrl}/api/v1/health`);
      assert.strictEqual(apiRes.status, 200, "Health check should succeed");

      // 2. Fetch recorded metrics from /dev/metrics
      const metricsRes = await fetch(`${baseUrl}/dev/metrics`);
      assert.strictEqual(metricsRes.status, 200, "Metrics endpoint should return 200 OK in development");

      const body = await metricsRes.json();
      assert.strictEqual(body.error, false, "Metrics error flag should be false");
      assert.isNotNull(body.data, "Metrics data must be present");
      assert.isNotNull(body.data.summary, "Summary object must be present");

      // Verify summary fields
      const { summary, entries } = body.data;
      assert.isTrue(summary.totalRequests >= 1, "Total requests should be at least 1");
      assert.isTrue(typeof summary.avgDurationMs === "number", "avgDurationMs must be a number");
      assert.isTrue(typeof summary.memoryHeapMB === "number", "memoryHeapMB must be a number");

      // Verify entry fields
      assert.isTrue(entries.length >= 1, "Entries list must contain captured requests");
      const healthEntry = entries.find((e) => e.url.includes("/health"));
      assert.isNotNull(healthEntry, "Health check request must be recorded in metrics");
      assert.strictEqual(healthEntry.method, "GET");
      assert.strictEqual(healthEntry.statusCode, 200);
      assert.isTrue(healthEntry.durationMs >= 0, "durationMs must be non-negative");
      assert.isTrue(healthEntry.responsePayloadBytes > 0, "responsePayloadBytes must be measured");
    });

    suite.add("TC-24 Sub-test: Shorthand /api/v1/dev/metrics also serves metrics", async () => {
      const res = await fetch(`${baseUrl}/api/v1/dev/metrics`);
      assert.strictEqual(res.status, 200, "/api/v1/dev/metrics should return 200 OK");
      const body = await res.json();
      assert.strictEqual(body.error, false);
      assert.isNotNull(body.data.summary);
    });

    suite.add("TC-24 Sub-test: Metrics query parameters (limit and slowOnly)", async () => {
      const res = await fetch(`${baseUrl}/dev/metrics?limit=2&slowOnly=false`);
      assert.strictEqual(res.status, 200);
      const body = await res.json();
      assert.isTrue(body.data.entries.length <= 2, "limit parameter should constrain entry count");
    });

    // ------------------------------------------------------------------------
    // TC-25: Sensitive Data Redaction Pipeline
    // ------------------------------------------------------------------------
    suite.add("TC-25: Redacts password, OTP, tokens, and PII from request body and headers", async () => {
      clearMetricsStore();

      // Dispatch request with sensitive fields
      const sensitivePayload = {
        phone: "9876543210",
        password: "SuperSecretPassword123!",
        otp: "654321",
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy",
        refreshToken: "refresh_secret_key_abc",
        aadhaar: "1234-5678-9012",
        cvv: "999",
      };

      await fetch(`${baseUrl}/api/v1/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer sensitive_bearer_token_xyz",
        },
        body: JSON.stringify(sensitivePayload),
      });

      // Retrieve entry from store
      const entries = getMetricsStore(10, false);
      const regEntry = entries.find((e) => e.url.includes("/auth/register"));
      assert.isNotNull(regEntry, "Register request should be recorded in store");

      const reqBody = regEntry.requestBody;
      assert.strictEqual(reqBody.password, "[REDACTED]", "Password must be redacted with [REDACTED]");
      assert.strictEqual(reqBody.otp, "[REDACTED]", "OTP must be redacted with [REDACTED]");
      assert.strictEqual(reqBody.token, "[REDACTED]", "Token must be redacted with [REDACTED]");
      assert.strictEqual(reqBody.refreshToken, "[REDACTED]", "RefreshToken must be redacted");
      assert.strictEqual(reqBody.aadhaar, "[REDACTED]", "Aadhaar must be redacted");
      assert.strictEqual(reqBody.cvv, "[REDACTED]", "CVV must be redacted");

      // Non-sensitive data must remain intact
      assert.strictEqual(reqBody.phone, "9876543210", "Non-sensitive phone number must remain intact");
    });

    suite.add("TC-25 Sub-test: Recursive sensitive data redactor unit tests", () => {
      const nested = {
        user: {
          name: "Karan Advani",
          secret: "vault_pass_xyz",
          profile: {
            apiKey: "live_ak_12345",
            govId: "ABCP1234D",
          },
        },
        tokensList: [
          { token: "tok_1" },
          { token: "tok_2", description: "public" },
        ],
        authString: "Bearer eyJhbGciOiJIUzI1NiIs...",
      };

      const sanitized = redactSensitiveData(nested);

      assert.strictEqual(sanitized.user.name, "Karan Advani", "Normal name preserved");
      assert.strictEqual(sanitized.user.secret, "[REDACTED]", "Secret redacted");
      assert.strictEqual(sanitized.user.profile.apiKey, "[REDACTED]", "apiKey redacted");
      assert.strictEqual(sanitized.user.profile.govId, "[REDACTED]", "govId redacted");
      assert.strictEqual(sanitized.tokensList[0].token, "[REDACTED]", "Array token redacted");
      assert.strictEqual(sanitized.tokensList[1].token, "[REDACTED]", "Array token redacted");
      assert.strictEqual(sanitized.tokensList[1].description, "public", "Normal array field preserved");
      assert.strictEqual(sanitized.authString, "Bearer [REDACTED]", "Bearer token masked");
    });

    // ------------------------------------------------------------------------
    // TC-26: Production Environment Isolation Guard
    // ------------------------------------------------------------------------
    suite.add("TC-26: Production isolation guard returns HTTP 404 and zero profiler overhead", async () => {
      const originalEnv = process.env.NODE_ENV;
      try {
        process.env.NODE_ENV = "production";

        // Call /dev/api-tracker in simulated production
        const trackerRes = await fetch(`${baseUrl}/dev/api-tracker`);
        assert.strictEqual(trackerRes.status, 404, "GET /dev/api-tracker must return 404 in production");

        // Call /dev/metrics in simulated production
        const metricsRes = await fetch(`${baseUrl}/dev/metrics`);
        assert.strictEqual(metricsRes.status, 404, "GET /dev/metrics must return 404 in production");

        // Call /api/v1/dev/metrics in simulated production
        const subMetricsRes = await fetch(`${baseUrl}/api/v1/dev/metrics`);
        assert.strictEqual(subMetricsRes.status, 404, "/api/v1/dev/metrics must return 404 in production");
      } finally {
        process.env.NODE_ENV = originalEnv;
      }
    });

    // ------------------------------------------------------------------------
    // UC-11: HTML Dashboard Render Verification
    // ------------------------------------------------------------------------
    suite.add("UC-11: GET /dev/api-tracker renders interactive dark-theme dashboard HTML", async () => {
      const res = await fetch(`${baseUrl}/dev/api-tracker`);
      assert.strictEqual(res.status, 200, "Dashboard route must return 200 OK in development");
      assert.isTrue(res.headers.get("content-type").includes("text/html"), "Content-Type must be text/html");

      const html = await res.text();
      assert.isTrue(html.includes("DEV PROFILER"), "Dashboard must contain DEV PROFILER brand badge");
      assert.isTrue(html.includes("API Performance & Query Latency Tracker"), "Dashboard must contain title");
      assert.isTrue(html.includes("requestsTable"), "Dashboard must include requests table");
      assert.isTrue(html.includes("statTotal"), "Dashboard must include statTotal counter");
    });

    // ------------------------------------------------------------------------
    // Database Query Profiling Hook and Async Context
    // ------------------------------------------------------------------------
    suite.add("TC-24 Sub-test: AsyncLocalStorage context records query latency and flamegraph", () => {
      const mockContext = {
        requestId: "req_test_123",
        queries: [],
        redisCalls: [],
      };

      devTrackerStorage.run({ trackerContext: mockContext }, () => {
        recordDatabaseQuery({
          collection: "users",
          op: "findOne",
          filter: { phone: "9876543210" },
          durationMs: 3.45,
        });

        recordDatabaseQuery({
          collection: "profiles",
          op: "find",
          filter: { gender: "FEMALE" },
          durationMs: 7.12,
        });

        assert.strictEqual(mockContext.queries.length, 2, "Two queries must be captured in active context");
        assert.strictEqual(mockContext.queries[0].collection, "users");
        assert.strictEqual(mockContext.queries[0].durationMs, 3.45);
        assert.strictEqual(mockContext.queries[1].collection, "profiles");
      });
    });

    // ------------------------------------------------------------------------
    // Metrics Store Cleanup Endpoint
    // ------------------------------------------------------------------------
    suite.add("TC-24 Sub-test: DELETE /dev/metrics flushes the in-memory circular buffer", async () => {
      const delRes = await fetch(`${baseUrl}/dev/metrics`, { method: "DELETE" });
      assert.strictEqual(delRes.status, 200, "DELETE /dev/metrics should return 200 OK");

      const body = await delRes.json();
      assert.strictEqual(body.error, false);

      const checkRes = await fetch(`${baseUrl}/dev/metrics`);
      const checkBody = await checkRes.json();
      // Only the check request itself might be recorded now
      assert.isTrue(checkBody.data.entries.length <= 1, "Store should be reset");
    });

    return await suite.run();
  } finally {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  }
}

export default runDevPerformanceTrackerIntegrationTests;
