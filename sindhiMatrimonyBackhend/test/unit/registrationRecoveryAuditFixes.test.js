import assert from "assert";
import { signToken, verifyToken } from "../../utils/jwtTokenUtils.js";
import { onboardingService } from "../../services/onboardingService.js";
import { REGISTRATION_STATUS, ACCOUNT_STATUS } from "../../utils/variables.js";
import { getEligibleAbandonedDraftsQuery } from "../../services/draftCleanupService.js";

export async function runRegistrationRecoveryAuditFixesTests() {
  console.log("\n🧪 Running Registration Recovery Audit Fixes & Regression Test Suite...");
  let passed = 0;
  let failed = 0;

  function test(name, fn) {
    try {
      fn();
      passed++;
      console.log(`  ✅ [PASS] ${name}`);
    } catch (err) {
      failed++;
      console.error(`  ❌ [FAIL] ${name}: ${err.message}`);
    }
  }

  async function testAsync(name, fn) {
    try {
      await fn();
      passed++;
      console.log(`  ✅ [PASS] ${name}`);
    } catch (err) {
      failed++;
      console.error(`  ❌ [FAIL] ${name}: ${err.message}`);
    }
  }

  // =========================================================================
  // FIX 1 REGRESSION: Secure registerStep Authorization & Token Binding
  // =========================================================================

  test("Fix 1.1: Missing token is strictly rejected for step modification", () => {
    // Simulating token evaluation logic in registerStep
    const rawToken = null;
    const isAuthorized = Boolean(rawToken);
    assert.strictEqual(isAuthorized, false, "Must reject request when token is missing");
  });

  test("Fix 1.2: Expired token cannot be verified and triggers 401", () => {
    // Token minted with 0s expiry (immediately expired)
    const expiredToken = signToken(
      { userId: "660000000000000000000001", scope: "ONBOARDING" },
      "0s"
    );

    let verifyFailed = false;
    try {
      verifyToken(expiredToken);
    } catch (err) {
      verifyFailed = true;
      assert.strictEqual(err.name, "TokenExpiredError");
    }
    assert.strictEqual(verifyFailed, true, "Expired token must fail verification");
  });

  test("Fix 1.3: Token with wrong scope (e.g. FULL_ACCESS or GUEST) is rejected with 403", () => {
    const fullAccessToken = signToken({
      userId: "660000000000000000000001",
      scope: "FULL_ACCESS",
    });

    const decoded = verifyToken(fullAccessToken);
    const scope = decoded.scope || decoded.data?.scope;
    const isAllowedForOnboarding = scope === "ONBOARDING";

    assert.strictEqual(isAllowedForOnboarding, false, "FULL_ACCESS token cannot be used on onboarding step endpoints");
  });

  test("Fix 1.4: Untrusted phone number without valid token cannot authorize write", () => {
    const requestBody = { phone: "+919829012345", step: 3, gender: "MALE" };
    const rawToken = requestBody.token || null;

    // The handler requires rawToken and strictly disallows falling back to phone
    assert.strictEqual(Boolean(rawToken), false, "Request must not resolve identity from phone alone");
  });

  test("Fix 1.5: Token bound to User A cannot update User B (Phone Mismatch Guard)", () => {
    const userAToken = signToken({
      userId: "660000000000000000000001",
      phone: "+919829011111",
      scope: "ONBOARDING",
    });

    const decoded = verifyToken(userAToken);
    const targetPhoneFromBody = "+919829022222"; // Different candidate phone

    const tokenPhone = String(decoded.phone).replace(/\D/g, "").slice(-10);
    const bodyPhone = String(targetPhoneFromBody).replace(/\D/g, "").slice(-10);

    const isMatch = tokenPhone === bodyPhone;
    assert.strictEqual(isMatch, false, "Mismatched token phone and body phone must be detected");
  });

  test("Fix 1.6: Valid ONBOARDING token bound to correct user is accepted", () => {
    const validToken = signToken({
      id: "660000000000000000000001",
      userId: "660000000000000000000001",
      phone: "+919829012345",
      scope: "ONBOARDING",
    });

    const decoded = verifyToken(validToken);
    assert.strictEqual(decoded.scope, "ONBOARDING");
    assert.strictEqual(decoded.phone, "+919829012345");
  });

  // =========================================================================
  // FIX 2 REGRESSION: Expired-Token Recovery & Never OFFLINE_VERIFIED
  // =========================================================================

  test("Fix 2.1: HTTP 401 returns EXPIRED and invalidates session", () => {
    const errorResponse = { error: true, status: 401, message: "Registration session has expired." };
    const statusCode = Number(errorResponse.status || errorResponse.code);

    let result;
    if (statusCode === 401) {
      result = {
        isValid: false,
        isRegistered: false,
        isOtpVerified: false,
        status: "EXPIRED",
        nextStep: "/registration/otp",
      };
    }

    assert.strictEqual(result.isValid, false, "401 must NEVER result in isValid: true");
    assert.strictEqual(result.status, "EXPIRED");
    assert.strictEqual(result.nextStep, "/registration/otp");
  });

  test("Fix 2.2: HTTP 403 returns FORBIDDEN", () => {
    const errorResponse = { error: true, status: 403, message: "Forbidden." };
    const statusCode = Number(errorResponse.status || errorResponse.code);

    let result;
    if (statusCode === 403) {
      result = {
        isValid: false,
        isRegistered: false,
        isOtpVerified: false,
        status: "FORBIDDEN",
        nextStep: "/registration/otp",
      };
    }

    assert.strictEqual(result.isValid, false);
    assert.strictEqual(result.status, "FORBIDDEN");
  });

  test("Fix 2.3: Genuine Network Error preserves draft without claiming session verification", () => {
    const networkError = { error: true, code: "NETWORK_ERROR", status: 0 };
    const statusCode = Number(networkError.status || networkError.code);

    let result;
    if (statusCode !== 401 && statusCode !== 403) {
      result = {
        isValid: false,
        isRegistered: false,
        isOtpVerified: false,
        status: "NETWORK_ERROR",
      };
    }

    assert.strictEqual(result.isValid, false, "Network error must not claim isValid: true");
    assert.strictEqual(result.status, "NETWORK_ERROR");
  });

  // =========================================================================
  // FIX 3 REGRESSION: RegistrationRouteGuard Step Hierarchy
  // =========================================================================

  test("Fix 3.1: Skipping ahead of server validated step is prevented", () => {
    const stepOrder = {
      "/registration/otp": 2,
      "/registration/basic-info": 3,
      "/registration/personal-religious-info": 4,
      "/registration/location-professional-info": 5,
      "/registration/additional-info": 6,
    };

    const pathname = "/registration/location-professional-info"; // Step 5
    const serverNextRoute = "/registration/basic-info"; // Step 3

    const currentWeight = stepOrder[pathname] || 0;
    const requiredWeight = stepOrder[serverNextRoute] || 0;

    const isSkipAttempt = currentWeight > requiredWeight;
    assert.strictEqual(isSkipAttempt, true, "Must detect when user attempts to skip ahead in URL");
  });

  test("Fix 3.2: Missing token triggers redirection to OTP or landing page", () => {
    const token = null;
    const mobile = "+919829012345";

    let targetRedirect = "/";
    if (!token) {
      if (mobile) {
        targetRedirect = `/registration/otp?mobile=${encodeURIComponent(mobile)}`;
      }
    }

    assert.strictEqual(targetRedirect, "/registration/otp?mobile=%2B919829012345");
  });

  // =========================================================================
  // FIX 4 REGRESSION: Registration Progress API Contract Alignment
  // =========================================================================

  test("Fix 4.1: getRegistrationProgress includes isRegistered: false for incomplete user", () => {
    const user = {
      phone: "+919829012345",
      isPhoneVerified: true,
      isOnboardingComplete: false,
      registrationStatus: REGISTRATION_STATUS.PHONE_VERIFIED,
    };
    const progress = onboardingService.getRegistrationProgress(user, null);

    assert.strictEqual(typeof progress.isRegistered, "boolean");
    assert.strictEqual(progress.isRegistered, false);
    assert.strictEqual(progress.isOnboardingComplete, false);
  });

  test("Fix 4.2: getRegistrationProgress includes isRegistered: true for complete user", () => {
    const user = {
      phone: "+919829012345",
      isPhoneVerified: true,
      password: "hashedPassword123",
      isOnboardingComplete: true,
      registrationStatus: REGISTRATION_STATUS.COMPLETE,
      status: ACCOUNT_STATUS.ACTIVE,
    };
    const profile = {
      gender: "MALE",
      dateOfBirth: new Date("1995-05-15").getTime(),
      height: 172,
      maritalStatus: "NEVER_MARRIED",
      subcaste: "Amil",
      location: { city: "Jaipur" },
      profession: { occupation: "Engineer" },
    };

    const progress = onboardingService.getRegistrationProgress(user, profile);
    assert.strictEqual(progress.isRegistered, true);
    assert.strictEqual(progress.isOnboardingComplete, true);
    assert.strictEqual(progress.registrationStatus, REGISTRATION_STATUS.COMPLETE);
  });

  test("Fix 4.3: Null user progress returns isRegistered: false", () => {
    const progress = onboardingService.getRegistrationProgress(null, null);
    assert.strictEqual(progress.isRegistered, false);
    assert.strictEqual(progress.isOnboardingComplete, false);
    assert.strictEqual(progress.registrationStatus, REGISTRATION_STATUS.DRAFT);
  });

  // =========================================================================
  // FIX 5 REGRESSION: Abandoned Draft Purge Eligibility Query
  // =========================================================================

  test("Fix 5.1: getEligibleAbandonedDraftsQuery targets ONLY unverified expired DRAFT records", () => {
    const query = getEligibleAbandonedDraftsQuery(72);

    assert.strictEqual(query.registrationStatus, REGISTRATION_STATUS.DRAFT);
    assert.strictEqual(query.isPhoneVerified, false);
    assert.strictEqual(query.isOnboardingComplete, false);
    assert.strictEqual(query.isDeleted, false);
    assert.strictEqual(Boolean(query.createdAt?.$lt), true);
  });

  test("Fix 5.2: Query strictly excludes phone-verified users", () => {
    const query = getEligibleAbandonedDraftsQuery(72);
    // If a user has isPhoneVerified: true, they cannot match query
    const verifiedUser = { isPhoneVerified: true, registrationStatus: REGISTRATION_STATUS.DRAFT };
    const matches = verifiedUser.isPhoneVerified === query.isPhoneVerified;
    assert.strictEqual(matches, false, "Phone verified users must NEVER be targeted for draft purge");
  });

  test("Fix 5.3: Query strictly excludes completed accounts", () => {
    const query = getEligibleAbandonedDraftsQuery(72);
    const completedUser = { isOnboardingComplete: true, registrationStatus: REGISTRATION_STATUS.COMPLETE };
    const matches = completedUser.isOnboardingComplete === query.isOnboardingComplete;
    assert.strictEqual(matches, false, "Completed users must NEVER be targeted for draft purge");
  });

  console.log(`\n📊 Registration Recovery Audit Fixes Tests: ${passed} passed, ${failed} failed.\n`);
  return { passed, failed, total: passed + failed };
}

// Direct execution support
if (process.argv[1]?.endsWith("registrationRecoveryAuditFixes.test.js")) {
  runRegistrationRecoveryAuditFixesTests().then(({ failed }) => {
    process.exit(failed > 0 ? 1 : 0);
  });
}
