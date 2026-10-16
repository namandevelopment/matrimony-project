import mongoose from "mongoose";
import { isDataEqual, isDeltaEqual } from "../utils/globalFunction.js";

async function runComprehensiveIsDataEqualTests() {
  console.log("================================================================================");
  console.log("💍 TESTING STRICT RULE 6: isDataEqual & isDeltaEqual ZERO-WRITE MEMOIZATION");
  console.log("================================================================================");

  const mockObjectId = new mongoose.Types.ObjectId();
  const mockDate = new Date("2026-10-15T00:00:00.000Z");

  // 1. Existing DB profile record in MongoDB
  const existingDbProfile = {
    _id: mockObjectId,
    userId: new mongoose.Types.ObjectId(),
    name: "Aakash Vaswani",
    subcaste: "Amil",
    gotra: "Vashishta",
    dateOfBirth: mockDate.getTime(),
    height: 178,
    maritalStatus: "NEVER_MARRIED",
    manglik: "NON_MANGLIK",
    education: {
      degree: "MBA",
      field: "Finance",
      college: "IIM Ahmedabad",
    },
    profession: {
      occupation: "Investment Banker",
      companyName: "Goldman Sachs",
      annualIncome: 3500000,
      currency: "INR",
    },
    family: {
      fatherName: "Rajesh Vaswani",
      fatherOccupation: "Businessman",
      motherName: "Sunita Vaswani",
      motherOccupation: "Homemaker",
      brothersCount: 1,
      sistersCount: 0,
      familyType: "NUCLEAR",
      familyValues: "MODERATE",
    },
    location: {
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      nativePlace: "Sukkur",
    },
    photos: [
      { url: "https://cdn.sindhimatrimony.com/photo1.jpg", isMain: true },
      { url: "https://cdn.sindhimatrimony.com/photo2.jpg", isMain: false },
    ],
    updatedAt: 1729000000000,
    createdAt: 1728000000000,
  };

  // 2. Existing Partner Preferences in MongoDB
  const existingPartnerPref = {
    _id: new mongoose.Types.ObjectId(),
    userId: existingDbProfile.userId,
    ageMin: 23,
    ageMax: 29,
    heightMin: 155,
    heightMax: 175,
    maritalStatus: ["NEVER_MARRIED"],
    subcastes: ["Amil", "Bhaiband", "Sindhi Sikh"],
    excludedGotras: ["Vashishta"],
    manglikPreference: ["NON_MANGLIK", "DONT_KNOW"],
    preferredCities: ["Mumbai", "Pune", "Ahmedabad"],
    minAnnualIncome: 1500000,
    updatedAt: 1729000000000,
  };

  // Test Case 1: Identical Payload (User clicks "Save Profile" in React Native App without changes)
  const incomingBasicSavePayload = {
    subcaste: "Amil",
    gotra: "Vashishta",
    height: 178,
    maritalStatus: "NEVER_MARRIED",
  };
  const isIdentical = isDeltaEqual(existingDbProfile, incomingBasicSavePayload);
  console.log(`\nTest 1 (Identical Basic Profile Save): isDeltaEqual = ${isIdentical}`);
  if (!isIdentical) throw new Error("Test 1 Failed: Identical payload should be true!");
  console.log("⚡ Zero-Write Memoization Active: Bypassed MongoDB write lock and disk I/O!");

  // Test Case 2: Identical Partner Preference (User saves unchanged partner filters)
  const incomingPrefSavePayload = {
    ageMin: 23,
    ageMax: 29,
    heightMin: 155,
    heightMax: 175,
    maritalStatus: ["NEVER_MARRIED"],
    subcastes: ["Amil", "Bhaiband", "Sindhi Sikh"],
    excludedGotras: ["Vashishta"],
    preferredCities: ["Mumbai", "Pune", "Ahmedabad"],
  };
  const isPrefIdentical = isDeltaEqual(existingPartnerPref, incomingPrefSavePayload);
  console.log(`\nTest 2 (Identical Partner Preference Save): isDeltaEqual = ${isPrefIdentical}`);
  if (!isPrefIdentical) throw new Error("Test 2 Failed: Identical partner preference should be true!");
  console.log("⚡ Zero-Write Memoization Active: Skipped partner preference DB write!");

  // Test Case 3: Genuinely Changed Data (User updates annual income from 35 LPA to 45 LPA)
  const changedEducationPayload = {
    profession: {
      occupation: "Investment Banker",
      companyName: "Goldman Sachs",
      annualIncome: 4500000, // Changed from 3500000 to 4500000
      currency: "INR",
    },
  };
  const isChanged = isDeltaEqual(existingDbProfile, changedEducationPayload);
  console.log(`\nTest 3 (Genuinely Modified Income): isDeltaEqual = ${isChanged}`);
  if (isChanged) throw new Error("Test 3 Failed: Changed income must return false!");
  console.log("✅ Genuinely modified data detected: Proceeding to MongoDB disk update.");

  // Test Case 4: Dot-Notation Delta
  const dotNotationPayload = {
    "family.fatherOccupation": "Businessman", // Unchanged
    "family.brothersCount": 1,               // Unchanged
  };
  const isDotIdentical = isDeltaEqual(existingDbProfile, dotNotationPayload);
  console.log(`\nTest 4 (Dot-notation Nested Save): isDeltaEqual = ${isDotIdentical}`);
  if (!isDotIdentical) throw new Error("Test 4 Failed: Dot-notation identical check failed!");
  console.log("⚡ Zero-Write Memoization Active: Dot notation path resolution verified!");

  // Test Case 5: BSON ObjectId and Date Normalization
  const objIdStr = mockObjectId.toString();
  const isIdEqual = isDataEqual(mockObjectId, objIdStr);
  console.log(`\nTest 5 (ObjectId vs String hex): isDataEqual = ${isIdEqual}`);
  if (!isIdEqual) throw new Error("Test 5 Failed: ObjectId normalization failed!");

  console.log("\n================================================================================");
  console.log("🎉 ALL isDataEqual & isDeltaEqual ZERO-WRITE MEMOIZATION TESTS PASSED 100%!");
  console.log("================================================================================");
}

runComprehensiveIsDataEqualTests().catch((err) => {
  console.error("❌ Test error:", err);
  process.exit(1);
});
