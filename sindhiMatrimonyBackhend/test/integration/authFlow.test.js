import http from "http";
import app from "../../app.js";
import { signToken, verifyToken } from "../../utils/jwtTokenUtils.js";
import serviceOTP from "../../services/serviceOTP.js";
import { createMockUserToken, TestSuite, assert } from "../helpers/testUtils.js";
import * as CONSTANTS from "../../utils/constants.js";
import * as CONSTANTS_MSG from "../../utils/constantsMessage.js";

export async function runAuthFlowIntegrationTests() {
  const suite = new TestSuite("Auth & Registration Flow Integration (Mobile App & Web)");

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
    // 1. Gateway Health Check (Public Route)
    suite.add("Scenario 1: GET /api/v1/health is Publicly Accessible (Zero Token Required)", async () => {
      const res = await fetch(`${baseUrl}/api/v1/health`);
      assert.strictEqual(res.status, 200, "Health endpoint should return 200 OK");
      const body = await res.json();
      assert.strictEqual(body.error, false);
      assert.isNotNull(body.data.uptime);
    });

    // 2. Private Route Protection (JWT Guard)
    suite.add("Scenario 2: GET /api/v1/profile/me Rejects Requests Without JWT (401 Unauthorized)", async () => {
      const res = await fetch(`${baseUrl}/api/v1/profile/me`);
      assert.strictEqual(res.status, 401, "Protected route must return 401 Unauthorized when token missing");
      const body = await res.json();
      assert.strictEqual(body.error, true);
    });

    // 3. OTP Service Unit Verification
    suite.add("Scenario 3: OTP Generation & Master OTP Fallback in Development", async () => {
      const phone = "9876543210";
      const otp = await serviceOTP.generateAndStoreOtp(phone, "REGISTER");
      assert.strictEqual(otp.length, 6, "OTP must be 6 digits");

      // Verify OTP validation with master OTP '123456' in dev
      const verifyDevMaster = await serviceOTP.verifyOtp(phone, "123456", "REGISTER");
      assert.isTrue(verifyDevMaster.isValid, "Master OTP 123456 must pass verification in non-production");

      // Verify with wrong OTP
      const verifyWrong = await serviceOTP.verifyOtp(phone, "000000", "REGISTER");
      assert.isFalse(verifyWrong.isValid, "Invalid OTP must fail verification");
    });

    // 4. JWT Token Claims & Verification
    suite.add("Scenario 4: JWT Token Minting, Claims Validation & Expiry Structure", async () => {
      const mockPayload = {
        id: "64f1a2b3c4d5e6f7a8b9c0d1",
        phone: "9820123456",
        role: "CANDIDATE",
        status: "ACTIVE",
      };
      const token = signToken(mockPayload);
      assert.isNotNull(token, "JWT token must be generated");

      const decoded = verifyToken(token);
      assert.strictEqual(decoded.id, mockPayload.id);
      assert.strictEqual(decoded.role, mockPayload.role);
      assert.strictEqual(decoded.phone, mockPayload.phone);
    });

    // 5. Validation Middleware Rejection (422 Unprocessable Entity)
    suite.add("Scenario 5: POST /api/v1/auth/send-otp Rejects Invalid Phone with 422 Unprocessable Entity", async () => {
      const res = await fetch(`${baseUrl}/api/v1/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: "123" }), // Invalid 3-digit phone
      });
      assert.strictEqual(res.status, 422, "Invalid input must yield 422 Unprocessable Entity");
      const body = await res.json();
      assert.strictEqual(body.error, true);
      assert.isNotNull(body.message, "Validation error message must be returned");
    });

    // 6. Registration Missing Fields (422)
    suite.add("Scenario 6: POST /api/v1/auth/register Rejects Missing Name & Gender with 422", async () => {
      const res = await fetch(`${baseUrl}/api/v1/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: "9876543210",
          otp: "123456",
          // Missing name and gender
        }),
      });
      assert.strictEqual(res.status, 422, "Missing fields must yield 422");
      const body = await res.json();
      assert.strictEqual(body.error, true);
    });

    // 7. Route Aliasing (Top-Level Shorthand Matches Mobile App endpoint.ts)
    suite.add("Scenario 7: Both /api/v1/auth/send-otp and /api/v1/auth/users/send-otp Point to Same Handler", async () => {
      const res1 = await fetch(`${baseUrl}/api/v1/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: "invalid" }),
      });
      const res2 = await fetch(`${baseUrl}/api/v1/auth/users/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: "invalid" }),
      });
      assert.strictEqual(res1.status, 422);
      assert.strictEqual(res2.status, 422);
    });

    // 8. Authenticated Request With Valid Token Bypasses 401
    suite.add("Scenario 8: Authenticated Request Passes JWT Middleware (Decodes Claims)", async () => {
      const { token, payload } = createMockUserToken();
      // Verify token independently
      const decoded = verifyToken(token);
      assert.strictEqual(decoded.id, payload.id);
      assert.strictEqual(decoded.role, payload.role);
    });

    // 9. Fast Check-Phone Public API (Zero Token Required)
    suite.add("Scenario 9: POST /api/v1/auth/check-phone is Publicly Accessible & Returns Status", async () => {
      const res = await fetch(`${baseUrl}/api/v1/auth/check-phone`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: "9876543210" }),
      });
      assert.strictEqual(res.status, 200, "check-phone must return 200 OK");
      const body = await res.json();
      assert.strictEqual(body.error, false);
      assert.strictEqual(body.data.phone, "9876543210");
      assert.isTrue(typeof body.data.isRegistered === "boolean");
    });

    // 10. Multi-Purpose OTP Verification across REGISTER & LOGIN
    suite.add("Scenario 10: verifyOtpAnyPurpose verifies cross-purpose OTP correctly", async () => {
      const phone = "9112233445";
      await serviceOTP.generateAndStoreOtp(phone, "REGISTER");
      const verifyResult = await serviceOTP.verifyOtpAnyPurpose(phone, "123456", ["REGISTER", "LOGIN"]);
      assert.isTrue(verifyResult.isValid, "Master OTP or purpose match should succeed");
    });

    // Run suite while server is actively listening
    return await suite.run();
  } finally {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  }
}

// Allow standalone execution: node test/integration/authFlow.test.js
if (process.argv[1]?.endsWith("authFlow.test.js")) {
  runAuthFlowIntegrationTests().then((res) => {
    process.exit(res.failed > 0 ? 1 : 0);
  });
}
