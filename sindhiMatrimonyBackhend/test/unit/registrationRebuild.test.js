import assert from "assert";
import { normalizePhoneNumber } from "../../utils/phoneNormalizer.js";
import { hashOtp, timingSafeCompare, otpService } from "../../services/otpService.js";
import { onboardingService } from "../../services/onboardingService.js";
import { REGISTRATION_STATUS } from "../../utils/variables.js";
import { signToken, verifyToken } from "../../utils/jwtTokenUtils.js";

export async function runRegistrationRebuildUnitTests() {
  console.log("\n🧪 Running Registration Rebuild & Security Unit Tests...");
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

  // --- Suite 1: Phone Normalization ---
  test("Phone Normalization - Indian 10-digit number", () => {
    const res = normalizePhoneNumber("9829012345", "+91");
    assert.strictEqual(res.isValid, true);
    assert.strictEqual(res.e164, "+919829012345");
    assert.strictEqual(res.national, "9829012345");
  });

  test("Phone Normalization - Spaces and hyphens", () => {
    const res = normalizePhoneNumber("98290-12345", "+91");
    assert.strictEqual(res.isValid, true);
    assert.strictEqual(res.e164, "+919829012345");
  });

  test("Phone Normalization - Leading zero removed", () => {
    const res = normalizePhoneNumber("09829012345", "+91");
    assert.strictEqual(res.isValid, true);
    assert.strictEqual(res.e164, "+919829012345");
  });

  test("Phone Normalization - Already E.164 with country code", () => {
    const res = normalizePhoneNumber("+919829012345");
    assert.strictEqual(res.isValid, true);
    assert.strictEqual(res.e164, "+919829012345");
  });

  test("Phone Normalization - Rejects invalid short numbers", () => {
    const res = normalizePhoneNumber("12345", "+91");
    assert.strictEqual(res.isValid, false);
  });

  // --- Suite 2: Keyed HMAC OTP & Timing-Safe Comparison ---
  test("OTP Security - HMAC hashes are reproducible with same secret", () => {
    const h1 = hashOtp("4829");
    const h2 = hashOtp("4829");
    assert.strictEqual(h1, h2);
    assert.notStrictEqual(h1, "4829");
  });

  test("OTP Security - Timing-safe compare matches valid hash and rejects invalid", () => {
    const valid = hashOtp("5555");
    const other = hashOtp("5556");
    assert.strictEqual(timingSafeCompare(valid, valid), true);
    assert.strictEqual(timingSafeCompare(valid, other), false);
  });

  // --- Suite 3: Onboarding State Machine Progress ---
  test("State Machine - New Draft User (Phone unverified)", () => {
    const user = { phone: "+919829012345", isPhoneVerified: false, registrationStatus: REGISTRATION_STATUS.DRAFT };
    const progress = onboardingService.getRegistrationProgress(user, null);
    assert.strictEqual(progress.isPhoneVerified, false);
    assert.strictEqual(progress.nextStep, 2);
    assert.strictEqual(progress.nextRoute, "/registration/otp");
  });

  test("State Machine - Phone Verified, Password Missing", () => {
    const user = { phone: "+919829012345", isPhoneVerified: true, registrationStatus: REGISTRATION_STATUS.PHONE_VERIFIED };
    const progress = onboardingService.getRegistrationProgress(user, null);
    assert.strictEqual(progress.isPhoneVerified, true);
    assert.strictEqual(progress.hasPassword, false);
    assert.strictEqual(progress.nextStep, 3);
    assert.strictEqual(progress.nextRoute, "/registration/basic-info");
  });

  test("State Machine - Basic Info Saved (Password + Gender + DOB)", () => {
    const user = {
      phone: "+919829012345",
      isPhoneVerified: true,
      password: "hashedPassword123",
      registrationStatus: REGISTRATION_STATUS.ONBOARDING_IN_PROGRESS,
    };
    const profile = {
      gender: "MALE",
      dateOfBirth: new Date("1995-05-15").getTime(),
    };
    const progress = onboardingService.getRegistrationProgress(user, profile);
    assert.strictEqual(progress.completedSteps.includes(3), true);
    assert.strictEqual(progress.nextStep, 4);
    assert.strictEqual(progress.nextRoute, "/registration/personal-religious-info");
  });

  test("State Machine - Personal & Religious Saved", () => {
    const user = {
      phone: "+919829012345",
      isPhoneVerified: true,
      password: "hashedPassword123",
    };
    const profile = {
      gender: "MALE",
      dateOfBirth: new Date("1995-05-15").getTime(),
      height: 172,
      maritalStatus: "NEVER_MARRIED",
      subcaste: "Amil",
    };
    const progress = onboardingService.getRegistrationProgress(user, profile);
    assert.strictEqual(progress.completedSteps.includes(4), true);
    assert.strictEqual(progress.nextStep, 5);
    assert.strictEqual(progress.nextRoute, "/registration/location-professional-info");
  });

  test("State Machine - Location & Professional Saved", () => {
    const user = {
      phone: "+919829012345",
      isPhoneVerified: true,
      password: "hashedPassword123",
    };
    const profile = {
      gender: "MALE",
      dateOfBirth: new Date("1995-05-15").getTime(),
      height: 172,
      maritalStatus: "NEVER_MARRIED",
      subcaste: "Amil",
      location: { city: "Jaipur", state: "Rajasthan" },
      profession: { occupation: "Software Engineer" },
    };
    const progress = onboardingService.getRegistrationProgress(user, profile);
    assert.strictEqual(progress.completedSteps.includes(5), true);
    assert.strictEqual(progress.nextStep, 6);
    assert.strictEqual(progress.nextRoute, "/registration/additional-info");
  });

  test("State Machine - Fully Complete User", () => {
    const user = {
      phone: "+919829012345",
      isPhoneVerified: true,
      password: "hashedPassword123",
      isOnboardingComplete: true,
      registrationStatus: REGISTRATION_STATUS.COMPLETE,
    };
    const profile = {
      gender: "MALE",
      dateOfBirth: new Date("1995-05-15").getTime(),
      height: 172,
      maritalStatus: "NEVER_MARRIED",
      subcaste: "Amil",
      location: { city: "Jaipur", state: "Rajasthan" },
      profession: { occupation: "Software Engineer" },
    };
    const progress = onboardingService.getRegistrationProgress(user, profile);
    assert.strictEqual(progress.isOnboardingComplete, true);
    assert.strictEqual(progress.nextStep, 7);
    assert.strictEqual(progress.nextRoute, "/dashboard");
  });

  // --- Suite 4: Scoped Token Architecture ---
  test("Token Security - Onboarding token has scoped ONBOARDING claim", () => {
    const token = signToken({ userId: "660000000000000000000001", scope: "ONBOARDING" });
    const verified = verifyToken(token);
    const scope = verified.scope || verified.data?.scope;
    assert.strictEqual(scope, "ONBOARDING");
    assert.notStrictEqual(scope, "FULL_ACCESS");
  });

  test("Token Security - Full access token has FULL_ACCESS claim", () => {
    const token = signToken({ userId: "660000000000000000000001", scope: "FULL_ACCESS" });
    const verified = verifyToken(token);
    const scope = verified.scope || verified.data?.scope;
    assert.strictEqual(scope, "FULL_ACCESS");
  });

  // --- Suite 5: Failure Recovery & Atomicity Guard ---
  test("Atomicity Guard - Validation failure aborts before modifying state", async () => {
    const user = { _id: "660000000000000000000001", phone: "+919829012345", isOnboardingComplete: false, registrationStatus: REGISTRATION_STATUS.PHONE_VERIFIED };
    const incompleteProfile = { _id: "660000000000000000000002", gender: "MALE" }; // Missing required DOB, subcaste, location, etc.

    let errorThrown = false;
    try {
      await onboardingService.completeOnboarding(user, incompleteProfile);
    } catch (err) {
      errorThrown = true;
      assert.strictEqual(err.message.includes("Cannot complete onboarding: missing required fields"), true);
      assert.strictEqual(user.isOnboardingComplete, false);
      assert.strictEqual(user.registrationStatus, REGISTRATION_STATUS.PHONE_VERIFIED);
    }
    assert.strictEqual(errorThrown, true);
  });

  console.log(`\n📊 Registration Rebuild Unit Tests: ${passed} passed, ${failed} failed.\n`);
  return { passed, failed, total: passed + failed };
}

// Direct execution support
if (process.argv[1]?.endsWith("registrationRebuild.test.js")) {
  runRegistrationRebuildUnitTests().then(({ failed }) => {
    process.exit(failed > 0 ? 1 : 0);
  });
}
