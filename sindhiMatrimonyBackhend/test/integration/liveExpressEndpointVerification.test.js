import http from "http";
import assert from "assert";
import app from "../../app.js";
import { signToken } from "../../utils/jwtTokenUtils.js";

export async function runLiveExpressEndpointVerification() {
  console.log("\n🌐 Running Live Express Endpoint Integration Verification...");
  let passed = 0;
  let failed = 0;

  let server;
  let baseUrl;

  // Spin up actual Express app on dynamic port
  await new Promise((resolve) => {
    server = http.createServer(app);
    server.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });

  async function test(name, fn) {
    try {
      await fn();
      passed++;
      console.log(`  ✅ [PASS] ${name}`);
    } catch (err) {
      failed++;
      console.error(`  ❌ [FAIL] ${name}: ${err.message}`);
    }
  }

  try {
    // 1. Missing Token Rejection
    await test("EP-1: POST /api/v1/auth/register-step with MISSING token returns HTTP 401", async () => {
      const res = await fetch(`${baseUrl}/api/v1/auth/register-step`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: "9829012345",
          step: 3,
          gender: "MALE",
          dob: "1995-05-15",
        }),
      });

      assert.strictEqual(res.status, 401, `Expected 401, got ${res.status}`);
      const body = await res.json();
      assert.strictEqual(body.error, true);
    });

    // 2. Phone-only fallback elimination check
    await test("EP-2: Phone-only payload cannot authorize write (No fallback)", async () => {
      const res = await fetch(`${baseUrl}/api/v1/auth/register-step`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile: "9829012345",
          phone: "9829012345",
          step: 3,
          password: "HackedPassword123!",
        }),
      });

      assert.strictEqual(res.status, 401, "Phone-only attempt must be rejected with 401");
      const body = await res.json();
      assert.strictEqual(body.error, true);
    });

    // 3. Expired Token Rejection
    await test("EP-3: POST /api/v1/auth/register-step with EXPIRED token returns HTTP 401", async () => {
      const expiredToken = signToken(
        { userId: "660000000000000000000001", phone: "9829012345", scope: "ONBOARDING" },
        "0s"
      );

      const res = await fetch(`${baseUrl}/api/v1/auth/register-step`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${expiredToken}`,
        },
        body: JSON.stringify({ step: 3, gender: "MALE" }),
      });

      assert.strictEqual(res.status, 401, `Expected 401 for expired token, got ${res.status}`);
      const body = await res.json();
      assert.strictEqual(body.error, true);
    });

    // 4. Malformed Token Rejection
    await test("EP-4: POST /api/v1/auth/register-step with MALFORMED token returns HTTP 401", async () => {
      const res = await fetch(`${baseUrl}/api/v1/auth/register-step`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer invalid.token.payload",
        },
        body: JSON.stringify({ step: 3 }),
      });

      assert.strictEqual(res.status, 401);
      const body = await res.json();
      assert.strictEqual(body.error, true);
    });

    // 5. Wrong-Scope Token Rejection
    await test("EP-5: POST /api/v1/auth/register-step with FULL_ACCESS token returns HTTP 403", async () => {
      const wrongScopeToken = signToken({
        userId: "660000000000000000000001",
        phone: "9829012345",
        scope: "FULL_ACCESS",
      });

      const res = await fetch(`${baseUrl}/api/v1/auth/register-step`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${wrongScopeToken}`,
        },
        body: JSON.stringify({ step: 3 }),
      });

      assert.strictEqual(res.status, 403, `Expected 403, got ${res.status}`);
      const body = await res.json();
      assert.strictEqual(body.error, true);
      assert.strictEqual(
        body.message,
        "Forbidden: Invalid token scope for registration onboarding."
      );
    });

    // 6. Wrong-User / Phone Mismatch Rejection
    await test("EP-6: User A token attempting to update User B returns HTTP 403", async () => {
      const userAToken = signToken({
        userId: "660000000000000000000001",
        phone: "+919829011111",
        scope: "ONBOARDING",
      });

      const res = await fetch(`${baseUrl}/api/v1/auth/register-step`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userAToken}`,
        },
        body: JSON.stringify({
          phone: "9829099999", // Different phone from token
          step: 3,
        }),
      });

      assert.strictEqual(res.status, 403, `Expected 403 for mismatched phone, got ${res.status}`);
      const body = await res.json();
      assert.strictEqual(body.error, true);
      assert.strictEqual(
        body.message,
        "Forbidden: Token does not match the provided phone number."
      );
    });

    // 7. GET /api/v1/auth/registration-status with valid token returns aligned contract
    await test("EP-7: GET /api/v1/auth/registration-status returns isRegistered in response contract", async () => {
      const validToken = signToken({
        userId: "660000000000000000000001",
        phone: "9829099999",
        scope: "ONBOARDING",
      });

      const res = await fetch(`${baseUrl}/api/v1/auth/registration-status`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${validToken}`,
        },
      });

      assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
      const body = await res.json();
      assert.strictEqual(body.error, false);
      assert.strictEqual(typeof body.data.isRegistered, "boolean");
      assert.strictEqual(body.data.isRegistered, false);
      assert.strictEqual(body.data.isOnboardingComplete, false);
      assert.strictEqual(body.data.nextStep, 3);
      assert.strictEqual(body.data.nextRoute, "/registration/basic-info");
    });

    // 8. Onboarding Token Restricted by app.js Route Guard
    await test("EP-8: Onboarding token is blocked from protected member endpoints (/api/v1/profile/me) with HTTP 403", async () => {
      const onboardingToken = signToken({
        userId: "660000000000000000000001",
        scope: "ONBOARDING",
      });

      const res = await fetch(`${baseUrl}/api/v1/profile/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${onboardingToken}`,
        },
      });

      assert.strictEqual(res.status, 403, `Expected 403 for onboarding token on member route, got ${res.status}`);
      const body = await res.json();
      assert.strictEqual(body.error, true);
      assert.strictEqual(body.data?.scope, "ONBOARDING");
    });
  } finally {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  }

  console.log(`\n📊 Live Express Endpoint Verification: ${passed} passed, ${failed} failed.\n`);
  return { passed, failed, total: passed + failed };
}

// Direct execution support
if (process.argv[1]?.endsWith("liveExpressEndpointVerification.test.js")) {
  runLiveExpressEndpointVerification().then(({ failed }) => {
    process.exit(failed > 0 ? 1 : 0);
  });
}
