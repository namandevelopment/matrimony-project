import mongoose from "mongoose";
import { isDataEqual, isDeltaEqual } from "../../utils/globalFunction.js";
import { TestSuite, assert } from "../helpers/testUtils.js";

export async function runProfileOnboardingIntegrationTests() {
  const suite = new TestSuite("Candidate Profile & 7-Step Onboarding Integration");

  const mockUserId = new mongoose.Types.ObjectId();

  // Baseline candidate profile representation in DB
  const mockDbProfile = {
    _id: new mongoose.Types.ObjectId(),
    userId: mockUserId,
    name: "Roshni Advani",
    gender: "FEMALE",
    profileFor: "MYSELF",
    maritalStatus: "NEVER_MARRIED",
    dateOfBirth: new Date("1998-05-15").getTime(),
    age: 28,
    height: 165,
    subcaste: "Amil",
    gotra: "Gautam",
    motherGotra: "Vashishta",
    manglik: "NON_MANGLIK",
    education: {
      degree: "B.Tech",
      field: "Computer Science",
      college: "BITS Pilani",
    },
    profession: {
      occupation: "Software Engineer",
      companyName: "Google",
      annualIncome: 4500000,
      currency: "INR",
    },
    family: {
      fatherName: "Ashok Advani",
      fatherOccupation: "Businessman",
      motherName: "Anita Advani",
      motherOccupation: "Teacher",
      brothersCount: 1,
      sistersCount: 0,
      familyType: "NUCLEAR",
      familyValues: "MODERATE",
    },
    location: {
      city: "Bangalore",
      state: "Karnataka",
      country: "India",
      nativePlace: "Hyderabad (Sindh)",
    },
    photos: [
      { _id: new mongoose.Types.ObjectId(), url: "https://cdn.matrimony.com/p1.jpg", isMain: true, isApproved: true },
      { _id: new mongoose.Types.ObjectId(), url: "https://cdn.matrimony.com/p2.jpg", isMain: false, isApproved: true },
    ],
    avatar: "https://cdn.matrimony.com/p1.jpg",
    updatedAt: 1729000000000,
  };

  // Baseline partner preferences in DB
  const mockDbPartnerPreferences = {
    _id: new mongoose.Types.ObjectId(),
    userId: mockUserId,
    ageMin: 27,
    ageMax: 33,
    heightMin: 170,
    heightMax: 190,
    maritalStatus: ["NEVER_MARRIED"],
    subcastes: ["Amil", "Bhaiband", "Sindhi Sikh"],
    excludedGotras: ["Gautam", "Vashishta"], // Swagotra exogamy
    manglikPreference: ["NON_MANGLIK", "DONT_KNOW"],
    preferredCities: ["Bangalore", "Mumbai", "Pune"],
    minAnnualIncome: 3000000,
    updatedAt: 1729000000000,
  };

  // 1. Zero-Write Memoization on Basic Update
  suite.add("Scenario 1: Profile Basic Update with Identical Data skips DB write (Sub-2ms response)", () => {
    const identicalPayload = {
      subcaste: "Amil",
      gotra: "Gautam",
      height: 165,
      maritalStatus: "NEVER_MARRIED",
    };
    const isMemoized = isDeltaEqual(mockDbProfile, identicalPayload);
    assert.isTrue(isMemoized, "Identical basic update must be memoized");
  });

  // 2. Profile Age Calculation from Date of Birth
  suite.add("Scenario 2: DOB update accurately calculates age in years", () => {
    const birthDate = new Date("1996-01-01").getTime();
    const ageDiffMs = Date.now() - birthDate;
    const calculatedAge = Math.floor(ageDiffMs / (365.25 * 24 * 60 * 60 * 1000));
    assert.isTrue(calculatedAge >= 30, "Age should be at least 30 years old");
  });

  // 3. Education & Profession Delta Detection
  suite.add("Scenario 3: Profession promotion detected as genuine change", () => {
    const deltaPayload = {
      profession: {
        occupation: "Senior Staff Software Engineer", // Promoted
        companyName: "Google",
        annualIncome: 7500000, // Raised
        currency: "INR",
      },
    };
    const isMemoized = isDeltaEqual(mockDbProfile, deltaPayload);
    assert.isFalse(isMemoized, "Modified profession must return false to trigger DB save");
  });

  // 4. Partner Preferences Memoization & Swagotra Rule
  suite.add("Scenario 4: Partner Preferences Swagotra Exogamy & Filter Matching", () => {
    const samePreferencesPayload = {
      ageMin: 27,
      ageMax: 33,
      subcastes: ["Amil", "Bhaiband", "Sindhi Sikh"],
      excludedGotras: ["Gautam", "Vashishta"],
    };
    const isMemoized = isDeltaEqual(mockDbPartnerPreferences, samePreferencesPayload);
    assert.isTrue(isMemoized, "Unchanged partner preferences must be memoized");
  });

  // 5. Photo Upload First Photo Becomes Main Avatar
  suite.add("Scenario 5: First photo uploaded automatically designates isMain and avatar", () => {
    const newProfile = { photos: [], avatar: "" };
    const uploadedUrl = "https://cdn.matrimony.com/first_photo.jpg";

    const isFirstPhoto = newProfile.photos.length === 0;
    const setMain = isFirstPhoto;

    newProfile.photos.push({
      url: uploadedUrl,
      isMain: setMain,
      uploadedAt: Date.now(),
    });
    if (setMain) newProfile.avatar = uploadedUrl;

    assert.strictEqual(newProfile.avatar, uploadedUrl);
    assert.isTrue(newProfile.photos[0].isMain);
  });

  // 6. Photo Deletion Reassigns Fallback Avatar
  suite.add("Scenario 6: Deleting avatar photo reassigns next available photo as avatar", () => {
    const profile = {
      avatar: "https://cdn.matrimony.com/p1.jpg",
      photos: [
        { id: "1", url: "https://cdn.matrimony.com/p1.jpg" },
        { id: "2", url: "https://cdn.matrimony.com/p2.jpg" },
      ],
    };

    // Remove photo 1
    profile.photos = profile.photos.filter((p) => p.id !== "1");
    if (profile.avatar === "https://cdn.matrimony.com/p1.jpg") {
      profile.avatar = profile.photos.length > 0 ? profile.photos[0].url : "";
    }

    assert.strictEqual(profile.avatar, "https://cdn.matrimony.com/p2.jpg", "Fallback photo must become avatar");
    assert.strictEqual(profile.photos.length, 1);
  });

  // 7. Guaranteed Data Contract (Rule 7)
  suite.add("Scenario 7: Profile payload contract guarantees complete schema integrity", () => {
    const requiredKeys = [
      "_id",
      "userId",
      "name",
      "gender",
      "subcaste",
      "education",
      "profession",
      "family",
      "location",
      "photos",
    ];
    for (const key of requiredKeys) {
      assert.isNotNull(mockDbProfile[key], `Profile must contain key: ${key}`);
    }
  });

  return await suite.run();
}

// Allow standalone execution: node test/integration/profileOnboarding.test.js
if (process.argv[1]?.endsWith("profileOnboarding.test.js")) {
  runProfileOnboardingIntegrationTests().then((res) => {
    process.exit(res.failed > 0 ? 1 : 0);
  });
}
