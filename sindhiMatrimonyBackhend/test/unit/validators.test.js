import {
  sendOtpSchema,
  registerUserSchema,
  checkPhoneSchema,
  loginWithPasswordSchema,
} from "../../validators/auth/users.js";
import {
  basicProfileSchema,
  educationCareerSchema,
  familySchema,
  horoscopeSchema,
  partnerPreferenceSchema,
  onboardingStepSchema,
} from "../../validators/members/profile.js";
import { TestSuite, assert } from "../helpers/testUtils.js";

export async function runValidatorsUnitTests() {
  const suite = new TestSuite("Joi Validation Rules & Matrimonial Domain Constraints");

  // 1. Auth & OTP Validation
  suite.add("Valid Send OTP Payload Passes", async () => {
    const payload = { phone: "9876543210", countryCode: "+91", purpose: "LOGIN" };
    const validated = await sendOtpSchema.validateAsync(payload);
    assert.strictEqual(validated.phone, "9876543210");
  });

  suite.add("Check Phone Number Schema Passes for 10-digit Indian Mobile", async () => {
    const payload = { phone: "9876543210" };
    const validated = await checkPhoneSchema.validateAsync(payload);
    assert.strictEqual(validated.phone, "9876543210");
    assert.strictEqual(validated.countryCode, "+91");
  });

  suite.add("Invalid Phone Number (Short Length) Fails Validation", async () => {
    const payload = { phone: "12345" };
    try {
      await sendOtpSchema.validateAsync(payload);
      throw new Error("Should have failed validation");
    } catch (err) {
      assert.isTrue(err.details?.[0]?.path?.includes("phone"), "Error path should target phone");
    }
  });

  suite.add("Invalid Phone Number (Non-numeric characters) Fails", async () => {
    const payload = { phone: "98765abcde" };
    try {
      await sendOtpSchema.validateAsync(payload);
      throw new Error("Should have failed validation");
    } catch (err) {
      assert.isTrue(err.details?.[0]?.path?.includes("phone"), "Error path should target phone");
    }
  });

  suite.add("Valid Quick Register Payload Passes & Auto-Normalizes Case", async () => {
    const payload = {
      phone: "9820123456",
      otp: "123456",
      password: "Password123@",
      name: "Komal Motwani",
      gender: "female", // Lowercase input
      profileFor: "myself", // Lowercase input
      email: "komal@example.com",
      subcaste: "Larkana",
      city: "Mumbai",
    };
    const validated = await registerUserSchema.validateAsync(payload);
    assert.strictEqual(validated.name, "Komal Motwani");
    assert.strictEqual(validated.gender, "FEMALE");
    assert.strictEqual(validated.profileFor, "MYSELF");
    assert.strictEqual(validated.subcaste, "Larkana");
    assert.strictEqual(validated.city, "Mumbai");
  });

  suite.add("Quick Register Missing OTP Fails", async () => {
    const payload = {
      phone: "9820123456",
      name: "Komal Motwani",
      gender: "FEMALE",
    };
    try {
      await registerUserSchema.validateAsync(payload);
      throw new Error("Should have failed validation");
    } catch (err) {
      assert.isTrue(err.details?.[0]?.path?.includes("otp"), "Error path should target otp");
    }
  });

  // 2. Cultural & Matrimonial Profile Validation
  suite.add("Valid Sindhi Subcastes Pass Validation", async () => {
    const validSubcastes = ["Amil", "Bhaiband", "Sindhi Sikh", "Larkana", "Sahiti"];
    for (const subcaste of validSubcastes) {
      const payload = { subcaste, height: 165, age: 26, maritalStatus: "NEVER_MARRIED" };
      const validated = await basicProfileSchema.validateAsync(payload);
      assert.strictEqual(validated.subcaste, subcaste);
    }
  });

  suite.add("Invalid Non-Sindhi Subcaste Fails Validation", async () => {
    const payload = { subcaste: "RandomNonSindhiCaste", age: 26 };
    try {
      await basicProfileSchema.validateAsync(payload);
      throw new Error("Should have failed validation");
    } catch (err) {
      assert.includes(err.message, "subcaste");
    }
  });

  suite.add("Underage Candidate (< 18) Fails Matrimonial Age Rule", async () => {
    const payload = { age: 16, subcaste: "Amil" };
    try {
      await basicProfileSchema.validateAsync(payload);
      throw new Error("Should have failed validation");
    } catch (err) {
      assert.includes(err.message, "age");
    }
  });

  // 3. Education & Profession Validation
  suite.add("Valid Education & Career Payload Passes", async () => {
    const payload = {
      education: { degree: "B.Com", field: "Accounting", college: "HR College Mumbai" },
      profession: { occupation: "Chartered Accountant", companyName: "EY", annualIncome: 1800000, currency: "INR" },
    };
    const validated = await educationCareerSchema.validateAsync(payload);
    assert.strictEqual(validated.profession.annualIncome, 1800000);
  });

  // 4. Family Details Validation
  suite.add("Valid Family Background Passes", async () => {
    const payload = {
      family: {
        fatherName: "Haresh Motwani",
        fatherOccupation: "Businessman",
        motherName: "Kavita Motwani",
        familyType: "NUCLEAR",
        familyValues: "MODERATE",
        brothersCount: 1,
        sistersCount: 0,
      },
    };
    const validated = await familySchema.validateAsync(payload);
    assert.strictEqual(validated.family.familyType, "NUCLEAR");
  });

  // 5. Kundli & Manglik Validation
  suite.add("Valid Horoscope & Manglik Status Passes", async () => {
    const payload = {
      manglik: "NON_MANGLIK",
      horoscope: { nakshatra: "Rohini", rashi: "Vrishabha", charan: 2 },
    };
    const validated = await horoscopeSchema.validateAsync(payload);
    assert.strictEqual(validated.manglik, "NON_MANGLIK");
  });

  suite.add("Invalid Manglik Status Fails", async () => {
    const payload = { manglik: "SUPER_MANGLIK_INVALID" };
    try {
      await horoscopeSchema.validateAsync(payload);
      throw new Error("Should have failed validation");
    } catch (err) {
      assert.includes(err.message, "manglik");
    }
  });

  // 6. Partner Preferences Validation
  suite.add("Valid Partner Preferences Passes", async () => {
    const payload = {
      ageMin: 22,
      ageMax: 28,
      heightMin: 150,
      heightMax: 180,
      maritalStatus: ["NEVER_MARRIED"],
      subcastes: ["Amil", "Bhaiband"],
      excludedGotras: ["Vashishta"],
      preferredCities: ["Mumbai", "Ulhasnagar", "Pune"],
      minAnnualIncome: 1000000,
    };
    const validated = await partnerPreferenceSchema.validateAsync(payload);
    assert.strictEqual(validated.ageMin, 22);
    assert.strictEqual(validated.subcastes.length, 2);
  });

  // 7. Onboarding Step Validator
  suite.add("Valid Onboarding Step 1-7 Passes", async () => {
    for (let step = 1; step <= 7; step++) {
      const payload = { step, data: { sampleKey: "sampleValue" } };
      const validated = await onboardingStepSchema.validateAsync(payload);
      assert.strictEqual(validated.step, step);
    }
  });

  suite.add("Invalid Onboarding Step (e.g. Step 8) Fails", async () => {
    const payload = { step: 8, data: {} };
    try {
      await onboardingStepSchema.validateAsync(payload);
      throw new Error("Should have failed validation");
    } catch (err) {
      assert.includes(err.message, "step");
    }
  });

  // 8. Candidate Login with Password Schema
  suite.add("Valid Login Payload (phone + password) Passes & Normalizes Phone", async () => {
    const payload = { phone: "9829012345", password: "Password123@" };
    const validated = await loginWithPasswordSchema.validateAsync(payload);
    assert.strictEqual(validated.phone, "9829012345");
    assert.strictEqual(validated.password, "Password123@");
  });

  suite.add("Valid Login Payload with mobileNumber alias Passes", async () => {
    const payload = { mobileNumber: "9829012345", password: "Password123@" };
    const validated = await loginWithPasswordSchema.validateAsync(payload);
    assert.strictEqual(validated.phone, "9829012345");
  });

  suite.add("Valid Login Payload with identifier alias and +91 formatted string Sanitizes to 10 digits", async () => {
    const payload = { identifier: "+91 98290 12345", password: "Password123@" };
    const validated = await loginWithPasswordSchema.validateAsync(payload);
    assert.strictEqual(validated.phone, "9829012345");
  });

  suite.add("Login Payload with Missing Password Fails with Descriptive Error", async () => {
    const payload = { phone: "9829012345" };
    try {
      await loginWithPasswordSchema.validateAsync(payload);
      throw new Error("Should have failed validation");
    } catch (err) {
      assert.isTrue(err.message.includes("Password is required"), "Error must mention password required");
    }
  });

  suite.add("Login Payload with Invalid Short Phone Fails with 10-digit Validation Error", async () => {
    const payload = { phone: "98290", password: "Password123@" };
    try {
      await loginWithPasswordSchema.validateAsync(payload);
      throw new Error("Should have failed validation");
    } catch (err) {
      assert.isTrue(err.message.includes("valid 10-digit mobile number"), "Error must mention 10-digit number");
    }
  });

  suite.add("Login Payload with Missing Mobile Number Fails", async () => {
    const payload = { password: "Password123@" };
    try {
      await loginWithPasswordSchema.validateAsync(payload);
      throw new Error("Should have failed validation");
    } catch (err) {
      assert.isTrue(err.message.includes("Mobile number is required"), "Error must mention mobile number required");
    }
  });

  return await suite.run();
}

// Allow standalone execution: node test/unit/validators.test.js
if (process.argv[1]?.endsWith("validators.test.js")) {
  runValidatorsUnitTests().then((res) => {
    process.exit(res.failed > 0 ? 1 : 0);
  });
}
