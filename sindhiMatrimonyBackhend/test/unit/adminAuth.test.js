import assert from "assert";
import http from "http";
import app from "../../app.js";

export async function runAdminAuthTests() {
  console.log("\n================================================================================");
  console.log("🧪 SUITE: ADMIN & STAFF AUTHENTICATION (SUPER ADMIN & MFA)");
  console.log("================================================================================");

  let passed = 0;
  let failed = 0;
  let server;
  let baseUrl;

  await new Promise((resolve) => {
    server = http.createServer(app);
    server.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });

  try {
    // TC-A1: Direct Super Admin Login with default seeded credentials
    try {
      const res = await fetch(`${baseUrl}/api/v1/auth/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "admin@sindhimarriage.in",
          password: "Admin@1234",
        }),
      });

      const body = await res.json();
      assert.strictEqual(res.status, 200, `Expected status 200, got ${res.status}`);
      assert.strictEqual(body.error, false, "Expected error to be false");
      assert(body.data.accessToken, "Expected accessToken to be present");
      assert(body.data.refreshToken, "Expected refreshToken to be present");
      assert.strictEqual(body.data.employee.email, "admin@sindhimarriage.in");
      assert.strictEqual(body.data.employee.role, "SUPER_ADMIN");
      assert.strictEqual(body.data.employee.recordScope, "ALL");
      assert(Array.isArray(body.data.employee.allowedSections), "Expected allowedSections array");

      console.log("  ✅ [1/4] TC-A1: Direct Super Admin Login returns tokens and role permissions");
      passed++;
    } catch (err) {
      console.error("  ❌ [1/4] TC-A1 Failed:", err.message);
      failed++;
    }

    // TC-A2: Wrong Password Rejection
    try {
      const res = await fetch(`${baseUrl}/api/v1/auth/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "admin@sindhimarriage.in",
          password: "WrongPassword999!",
        }),
      });

      const body = await res.json();
      assert.strictEqual(res.status, 401, `Expected status 401, got ${res.status}`);
      assert.strictEqual(body.error, true, "Expected error to be true");

      console.log("  ✅ [2/4] TC-A2: Wrong Password correctly rejected with HTTP 401");
      passed++;
    } catch (err) {
      console.error("  ❌ [2/4] TC-A2 Failed:", err.message);
      failed++;
    }

    // TC-A3: MFA Flow with Step 1 (Challenge) and Step 2 (Verification)
    try {
      // Step 1: Login with requireMfaCheck: true
      const res1 = await fetch(`${baseUrl}/api/v1/auth/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "admin@sindhimarriage.in",
          password: "Admin@1234",
          requireMfaCheck: true,
        }),
      });

      const body1 = await res1.json();
      assert.strictEqual(res1.status, 200);
      assert.strictEqual(body1.data.requiresMFA, true);
      assert(body1.data.tempToken, "Expected tempToken for MFA");

      // Step 2: Verify MFA with 4-digit code 1234
      const res2 = await fetch(`${baseUrl}/api/v1/auth/admin/verify-mfa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tempToken: body1.data.tempToken,
          totpCode: "1234",
        }),
      });

      const body2 = await res2.json();
      assert.strictEqual(res2.status, 200);
      assert.strictEqual(body2.error, false);
      assert(body2.data.accessToken);
      assert.strictEqual(body2.data.employee.role, "SUPER_ADMIN");

      console.log("  ✅ [3/4] TC-A3: Two-step MFA challenge and verification succeeds");
      passed++;
    } catch (err) {
      console.error("  ❌ [3/4] TC-A3 Failed:", err.message);
      failed++;
    }

    // TC-A4: Protected Endpoint with Admin Token
    try {
      const loginRes = await fetch(`${baseUrl}/api/v1/auth/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "admin@sindhimarriage.in",
          password: "Admin@1234",
        }),
      });

      const loginBody = await loginRes.json();
      const token = loginBody.data.accessToken;

      const meRes = await fetch(`${baseUrl}/api/v1/auth/admin/me`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const meBody = await meRes.json();
      assert.strictEqual(meRes.status, 200);
      assert.strictEqual(meBody.data.email, "admin@sindhimarriage.in");

      console.log("  ✅ [4/4] TC-A4: Authenticated /api/v1/auth/admin/me returns staff identity");
      passed++;
    } catch (err) {
      console.error("  ❌ [4/4] TC-A4 Failed:", err.message);
      failed++;
    }
  } finally {
    if (server) {
      server.close();
    }
  }

  console.log("--------------------------------------------------------------------------------");
  console.log(`📊 Suite Results: ${passed} Passed, ${failed} Failed`);
  console.log("================================================================================");

  return { passed, failed, total: passed + failed };
}

// Auto run if executed directly
if (process.argv[1]?.endsWith("adminAuth.test.js")) {
  runAdminAuthTests().then(({ failed }) => {
    process.exit(failed > 0 ? 1 : 0);
  });
}
