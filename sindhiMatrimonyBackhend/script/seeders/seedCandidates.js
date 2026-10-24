import dotenv from "dotenv";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { User, Profile, PartnerPreference, ProfileView, SuccessStory } from "../../models/index.js";
import { SEED_CANDIDATE_POOL, SEED_SUCCESS_STORIES } from "../../constants/seedCandidateData.js";
import { logMessage } from "../../utils/globalFunction.js";

/**
 * 🌱 Seed 150+ Realistic Sindhi Matrimonial Candidates into MongoDB
 */
export async function seedCandidates() {
  logMessage("Starting candidate profiles & users seeding...", null, "info");

  const defaultHashedPassword = await bcrypt.hash("Password123@", 10);

  let createdUsers = 0;
  let createdProfiles = 0;
  let createdPreferences = 0;

  for (const candidate of SEED_CANDIDATE_POOL) {
    const candidateUserId = new mongoose.Types.ObjectId(candidate.userId);
    const candidateProfileId = new mongoose.Types.ObjectId(candidate._id);

    // 1. Upsert User Account
    const phoneNum = `98290${candidate._id.slice(-5)}`;
    await User.findByIdAndUpdate(
      candidateUserId,
      {
        $setOnInsert: {
          _id: candidateUserId,
          phone: phoneNum,
          countryCode: "+91",
          email: `${candidate.name.toLowerCase().replace(/[^a-z]/g, "")}${candidate._id.slice(-3)}@sindhimarriage.in`,
          password: defaultHashedPassword,
          role: 1,
          status: "ACTIVE",
          activeProfileId: candidateProfileId,
          isPhoneVerified: true,
          isEmailVerified: true,
          isKycVerified: candidate.isVerified,
          onboardingStep: 7,
          isOnboardingComplete: true,
          clientPlatform: "MOBILE",
          isDeleted: false,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    createdUsers++;

    // 2. Upsert Candidate Profile
    await Profile.findByIdAndUpdate(
      candidateProfileId,
      {
        $set: {
          userId: candidateUserId,
          isPrimary: true,
          name: candidate.name,
          profileFor: candidate.profileFor || "MYSELF",
          gender: candidate.gender,
          dateOfBirth: candidate.dateOfBirth,
          age: candidate.age,
          height: candidate.height,
          maritalStatus: candidate.maritalStatus,
          subcaste: candidate.subcaste,
          gotra: candidate.gotra,
          motherGotra: candidate.motherGotra,
          manglik: candidate.manglik,
          education: candidate.education,
          profession: candidate.profession,
          location: candidate.location,
          family: candidate.family,
          aboutMe: candidate.aboutMe,
          avatar: candidate.avatar,
          photos: candidate.photos,
          verificationBadge: candidate.verificationBadge,
          membershipTier: candidate.membershipTier,
          isFeatured: candidate.isFeatured,
          status: "ACTIVE",
          isDeleted: false,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    createdProfiles++;

    // 3. Upsert Partner Preference
    await PartnerPreference.findOneAndUpdate(
      { userId: candidateUserId },
      {
        $set: {
          userId: candidateUserId,
          ageMin: candidate.partnerPreference.ageMin,
          ageMax: candidate.partnerPreference.ageMax,
          heightMin: candidate.partnerPreference.heightMin,
          heightMax: candidate.partnerPreference.heightMax,
          maritalStatus: candidate.partnerPreference.maritalStatus,
          subcastes: candidate.partnerPreference.subcastes,
          manglikPreference: candidate.partnerPreference.manglikPreference,
          preferredCities: candidate.partnerPreference.preferredCities,
          minAnnualIncome: candidate.partnerPreference.minAnnualIncome,
          isDeleted: false,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    createdPreferences++;
  }

  // 4. Seed Success Stories
  let createdStories = 0;
  for (const story of SEED_SUCCESS_STORIES) {
    const storyId = new mongoose.Types.ObjectId(story._id);
    await SuccessStory.findByIdAndUpdate(
      storyId,
      {
        $set: {
          coupleName: story.coupleName,
          groomName: story.groomName,
          brideName: story.brideName,
          postedOn: story.postedOn,
          city: story.city,
          storySnippet: story.storySnippet,
          fullStory: story.fullStory,
          imageUrl: story.imageUrl,
          badge: story.badge,
          displayOrder: story.displayOrder,
          isFeatured: story.isFeatured,
          isActive: true,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    createdStories++;
  }

  // 5. Seed Profile Views
  let createdViews = 0;
  for (let i = 0; i < 40; i++) {
    const viewerIdx = i % SEED_CANDIDATE_POOL.length;
    const viewedIdx = (i + 5) % SEED_CANDIDATE_POOL.length;
    const viewer = SEED_CANDIDATE_POOL[viewerIdx];
    const viewed = SEED_CANDIDATE_POOL[viewedIdx];

    await ProfileView.findOneAndUpdate(
      {
        viewerUserId: new mongoose.Types.ObjectId(viewer.userId),
        viewedProfileId: new mongoose.Types.ObjectId(viewed._id),
      },
      {
        $set: {
          viewerUserId: new mongoose.Types.ObjectId(viewer.userId),
          viewerProfileId: new mongoose.Types.ObjectId(viewer._id),
          viewedUserId: new mongoose.Types.ObjectId(viewed.userId),
          viewedProfileId: new mongoose.Types.ObjectId(viewed._id),
          viewedAt: new Date(Date.now() - i * 3600000 * 4),
          viewCount: 1 + (i % 3),
        },
      },
      { upsert: true, new: true }
    );
    createdViews++;
  }

  logMessage(`✅ Successfully seeded: ${createdUsers} Users, ${createdProfiles} Profiles, ${createdPreferences} Preferences, ${createdStories} Stories, and ${createdViews} Profile Views!`, null, "info");
}

export default seedCandidates;

if (process.argv[1]?.includes("seedCandidates.js")) {
  dotenv.config();
  const DB_URI = process.env.DB_STRING || "mongodb://127.0.0.1:27017/sindhi_matrimony";
  mongoose
    .connect(DB_URI)
    .then(async () => {
      await seedCandidates();
      await mongoose.disconnect();
      process.exit(0);
    })
    .catch((err) => {
      console.error("Seeding failed:", err);
      process.exit(1);
    });
}
