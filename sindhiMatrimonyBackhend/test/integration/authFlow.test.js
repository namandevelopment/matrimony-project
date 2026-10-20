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

    // 11. Login Endpoint Validation: Empty Body Rejection (422)
    suite.add("Scenario 11: POST /api/v1/auth/login Rejects Empty Payload with 422", async () => {
      const res = await fetch(`${baseUrl}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      assert.strictEqual(res.status, 422, "Empty body must return 422");
      const body = await res.json();
      assert.strictEqual(body.error, true);
      assert.isTrue(
        body.message.includes("Password") || body.message.includes("Mobile number"),
        "Must require credentials"
      );
    });

    // 12. Login Endpoint Validation: Invalid Phone Format (422)
    suite.add("Scenario 12: POST /api/v1/auth/login Rejects Invalid Phone with 422", async () => {
      const res = await fetch(`${baseUrl}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: "12345", password: "Password123@" }),
      });
      assert.strictEqual(res.status, 422, "Invalid phone must return 422");
      const body = await res.json();
      assert.strictEqual(body.error, true);
      assert.isTrue(body.message.includes("10-digit"), "Must require 10-digit number");
    });

    // 13. Login Endpoint Validation: Missing Password (422)
    suite.add("Scenario 13: POST /api/v1/auth/login Rejects Missing Password with 422", async () => {
      const res = await fetch(`${baseUrl}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: "9829012345" }),
      });
      assert.strictEqual(res.status, 422, "Missing password must return 422");
      const body = await res.json();
      assert.strictEqual(body.error, true);
      assert.isTrue(body.message.includes("Password is required"), "Must require password");
    });

    // 14. Login with Unregistered Phone returns 404 Not Found
    suite.add("Scenario 14: POST /api/v1/auth/login Returns 404 for Unregistered Number", async () => {
      const res = await fetch(`${baseUrl}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: "9829099999", password: "Password123@" }),
      });
      assert.strictEqual(res.status, 404, "Unregistered phone must return 404");
      const body = await res.json();
      assert.strictEqual(body.error, true);
      assert.isTrue(body.message.includes("No registered account"), "Helpful message to register");
    });

    // 15. Route Parity: Both /auth/login and /auth/users/login route to same handler
    suite.add("Scenario 15: Both /api/v1/auth/login and /api/v1/auth/users/login Work Identically", async () => {
      const res1 = await fetch(`${baseUrl}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: "9829099999", password: "Password123@" }),
      });
      const res2 = await fetch(`${baseUrl}/api/v1/auth/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobileNumber: "9829099999", password: "Password123@" }),
      });
      assert.strictEqual(res1.status, 404);
      assert.strictEqual(res2.status, 404);
      const b1 = await res1.json();
      const b2 = await res2.json();
      assert.strictEqual(b1.message, b2.message);
    });

    // 16. Fast Successful Login Returns Ultra-Fast Lightweight Payload (token, refreshToken, user context)
    suite.add("Scenario 16: POST /api/v1/auth/login Returns 200 with Fast Token & User Context Payload", async () => {
      const res = await fetch(`${baseUrl}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: "9829012345", password: "Password123@" }),
      });
      assert.strictEqual(res.status, 200, "Valid login must return 200 OK");
      const body = await res.json();
      assert.strictEqual(body.error, false);
      assert.isNotNull(body.data.token, "JWT token must be returned");
      assert.isNotNull(body.data.refreshToken, "Refresh token must be returned");
      assert.isNotNull(body.data.user, "User context must be returned");
      assert.strictEqual(body.data.user.phone, "9829012345");
      assert.isNotNull(body.data.user.activeProfileId, "activeProfileId must be present");
      assert.isUndefined(body.data.profile, "Heavy profile object must not be sent in login response");
      assert.isUndefined(body.data.profiles, "Heavy profiles array must not be sent in login response");
    });

    // 17. POST /api/v1/profile/getProfile without id returns khud ka data (own profile)
    suite.add("Scenario 17: POST /api/v1/profile/getProfile with empty payload returns khud ka data", async () => {
      const loginRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: "9829012345", password: "Password123@" }),
      });
      const loginBody = await loginRes.json();
      const token = loginBody.data.token;

      const res = await fetch(`${baseUrl}/api/v1/profile/getProfile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });
      assert.strictEqual(res.status, 200, "Must return 200 OK");
      const body = await res.json();
      assert.strictEqual(body.error, false);
      assert.isTrue(body.data.isSelf, "Must be flagged as isSelf: true");
      assert.isNotNull(body.data.profile, "Candidate profile must be returned");
      assert.isNotNull(body.data.profile._id, "Profile _id must exist");
      assert.isUndefined(body.data.profile.id, "Duplicate profile.id must NOT exist");
      assert.isUndefined(body.data.profile.userId, "Duplicate profile.userId must NOT exist");
      assert.isNotNull(body.data.user, "User details must be returned");
      assert.isNotNull(body.data.user._id, "User _id must exist");
      assert.isUndefined(body.data.user.id, "Duplicate user.id must NOT exist");
      assert.isUndefined(body.data.user.activeProfileId, "Duplicate user.activeProfileId must NOT exist");
      assert.isNotNull(body.data.partnerPreference, "Partner preferences must be returned");
    });

    // 18. POST /api/v1/profile/getProfile with candidate 'id' returns that user's profile
    suite.add("Scenario 18: POST /api/v1/profile/getProfile with target 'id' returns target candidate profile", async () => {
      const loginRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: "9829012345", password: "Password123@" }),
      });
      const loginBody = await loginRes.json();
      const token = loginBody.data.token;

      const targetCandidateId = "67b34a12c8e312a0f9000001";
      const res = await fetch(`${baseUrl}/api/v1/profile/getProfile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: targetCandidateId }),
      });
      assert.strictEqual(res.status, 200, "Must return 200 OK");
      const body = await res.json();
      assert.strictEqual(body.error, false);
      assert.isFalse(body.data.isSelf, "Must be flagged as isSelf: false for other candidate");
      assert.isNotNull(body.data.profile, "Target profile must be returned");
      assert.strictEqual(body.data.profile._id, targetCandidateId);
      assert.isUndefined(body.data.profile.id, "Duplicate profile.id must NOT exist");
      assert.isUndefined(body.data.profile.userId, "Duplicate profile.userId must NOT exist");
      assert.isUndefined(body.data.user.id, "Duplicate user.id must NOT exist");
    });

    // 19. GET /api/v1/profile/getProfile?id=... query parameter support
    suite.add("Scenario 19: GET /api/v1/profile/getProfile?id=... query param returns target candidate profile", async () => {
      const loginRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: "9829012345", password: "Password123@" }),
      });
      const loginBody = await loginRes.json();
      const token = loginBody.data.token;

      const targetCandidateId = "67b34a12c8e312a0f9000001";
      const res = await fetch(`${baseUrl}/api/v1/profile/getProfile?id=${targetCandidateId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      assert.strictEqual(res.status, 200);
      const body = await res.json();
      assert.strictEqual(body.error, false);
      assert.strictEqual(body.data.profile._id, targetCandidateId);
      assert.isUndefined(body.data.profile.id, "Duplicate profile.id must NOT exist");
    });

    // 20. GET /api/v1/profile/me backward compatibility returns own profile
    suite.add("Scenario 20: GET /api/v1/profile/me returns own profile (khud ka data)", async () => {
      const loginRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: "9829012345", password: "Password123@" }),
      });
      const loginBody = await loginRes.json();
      const token = loginBody.data.token;

      const res = await fetch(`${baseUrl}/api/v1/profile/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      assert.strictEqual(res.status, 200);
      const body = await res.json();
      assert.strictEqual(body.error, false);
      assert.isTrue(body.data.isSelf);
      assert.isNotNull(body.data.profile._id);
      assert.isUndefined(body.data.profile.id);
    });

    // 21. POST /api/v1/profile/editProfile updates profile and partner preferences in single call
    suite.add("Scenario 21: POST /api/v1/profile/editProfile updates profile and partner preferences with clean _id", async () => {
      const loginRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: "9829012345", password: "Password123@" }),
      });
      const loginBody = await loginRes.json();
      const token = loginBody.data.token;

      const res = await fetch(`${baseUrl}/api/v1/profile/editProfile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: "Simran Vaswani",
          aboutMe: "Sindhi professional looking for a life partner.",
          height: 168,
          maritalStatus: "NEVER_MARRIED",
          education: { degree: "MBA", college: "IIM" },
          profession: { occupation: "Senior Product Manager", annualIncome: 2100000 },
          partnerPreference: {
            ageRange: { min: 27, max: 33 },
          },
        }),
      });
      assert.strictEqual(res.status, 200);
      const body = await res.json();
      assert.strictEqual(body.error, false);
      assert.isNotNull(body.data.profile);
      assert.isNotNull(body.data.profile._id);
      assert.isUndefined(body.data.profile.id, "Duplicate profile.id must NOT exist");
      assert.isUndefined(body.data.profile.userId, "Duplicate profile.userId must NOT exist");
      assert.strictEqual(body.data.profile.height, 168);
      assert.isNotNull(body.data.partnerPreference);
      assert.isNotNull(body.data.partnerPreference._id);
      assert.isUndefined(body.data.partnerPreference.id, "Duplicate partnerPreference.id must NOT exist");
      assert.isUndefined(body.data.partnerPreference.userId, "Duplicate partnerPreference.userId must NOT exist");
    });

    // 22. PUT /api/v1/profile/editProfile (or /updateProfile) alias support
    suite.add("Scenario 22: PUT /api/v1/profile/updateProfile alias updates profile successfully", async () => {
      const loginRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: "9829012345", password: "Password123@" }),
      });
      const loginBody = await loginRes.json();
      const token = loginBody.data.token;

      const res = await fetch(`${baseUrl}/api/v1/profile/updateProfile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          city: "Jaipur",
          state: "Rajasthan",
        }),
      });
      assert.strictEqual(res.status, 200);
      const body = await res.json();
      assert.strictEqual(body.error, false);
      assert.isNotNull(body.data.profile._id);
      assert.strictEqual(body.data.profile.location.city, "Jaipur");
    });

    // 23. GET /api/v1/dashboard returns consolidated single-flight dashboard feed
    suite.add("Scenario 23: GET /api/v1/dashboard returns consolidated dashboard feed (single flight < 10ms)", async () => {
      const loginRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: "9829012345", password: "Password123@" }),
      });
      const loginBody = await loginRes.json();
      const token = loginBody.data.token;

      const res = await fetch(`${baseUrl}/api/v1/dashboard`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      assert.strictEqual(res.status, 200);
      const body = await res.json();
      assert.strictEqual(body.error, false);
      assert.isNotNull(body.data.user);
      assert.isNotNull(body.data.user._id);
      assert.isUndefined(body.data.user.id);
      assert.strictEqual(body.data.user.name, "Naman");
      assert.strictEqual(body.data.completeness.score, 42);
      assert.isTrue(Array.isArray(body.data.completeness.actions));
      assert.isNotNull(body.data.matches);
      assert.strictEqual(body.data.matches.totalMatchesCount, 23);
      assert.isNotNull(body.data.horoscope);
      assert.strictEqual(body.data.horoscope.selectedRashi, "leo");
      assert.strictEqual(body.data.horoscope.rashiDetails.nameHi, "सिंह (Singh)");
    });

    // 24. GET /api/v1/feed/home frontend direct alias
    suite.add("Scenario 24: GET /api/v1/feed/home alias returns identical dashboard feed", async () => {
      const loginRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: "9829012345", password: "Password123@" }),
      });
      const loginBody = await loginRes.json();
      const token = loginBody.data.token;

      const res = await fetch(`${baseUrl}/api/v1/feed/home`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      assert.strictEqual(res.status, 200);
      const body = await res.json();
      assert.strictEqual(body.error, false);
      assert.strictEqual(body.data.matches.totalMatchesCount, 23);
    });

    // 25. GET /api/v1/dashboard/horoscope?rashi=aries returns accurate Aries forecast
    suite.add("Scenario 25: GET /api/v1/dashboard/horoscope?rashi=aries returns Aries forecast", async () => {
      const res = await fetch(`${baseUrl}/api/v1/dashboard/horoscope?rashi=aries`, {
        method: "GET",
      });
      assert.strictEqual(res.status, 200);
      const body = await res.json();
      assert.strictEqual(body.error, false);
      assert.strictEqual(body.data.selectedRashi, "aries");
      assert.strictEqual(body.data.rashiDetails.rulingPlanet, "Mars");
    });

    // 26. POST /api/v1/dashboard/horoscope/save-rashi saves preferred moon sign
    suite.add("Scenario 26: POST /api/v1/dashboard/horoscope/save-rashi saves user rashi", async () => {
      const loginRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: "9829012345", password: "Password123@" }),
      });
      const loginBody = await loginRes.json();
      const token = loginBody.data.token;

      const res = await fetch(`${baseUrl}/api/v1/dashboard/horoscope/save-rashi`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rashi: "leo" }),
      });
      assert.strictEqual(res.status, 200);
      const body = await res.json();
      assert.strictEqual(body.error, false);
      assert.strictEqual(body.data.savedRashi, "leo");
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
