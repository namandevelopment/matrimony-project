import mongoose from "mongoose";
import { User, Profile, PartnerPreference } from "../models/index.js";
import { REGISTRATION_STATUS, ACCOUNT_STATUS } from "../utils/variables.js";
import { hashPassword, logMessage } from "../utils/globalFunction.js";
import { signToken, generateRefreshToken } from "../utils/jwtTokenUtils.js";

/**
 * Authoritative Onboarding & Registration State Machine Service
 * All step evaluation and progress is strictly calculated from persisted MongoDB records.
 */
export const onboardingService = {
  /**
   * Authoritative progress calculation from persisted User and Profile records.
   */
  getRegistrationProgress: (user, profile) => {
    if (!user) {
      return {
        registrationStatus: REGISTRATION_STATUS.DRAFT,
        isPhoneVerified: false,
        hasPassword: false,
        isOnboardingComplete: false,
        isRegistered: false,
        currentStep: 1,
        nextStep: 1,
        nextRoute: "/registration",
        completedSteps: [],
        requiredActions: ["INITIAL_REGISTRATION"],
      };
    }

    const completedSteps = [];

    // Step 1: User record exists with phone
    if (user.phone) {
      completedSteps.push(1);
    }

    // Step 2: Phone verified via OTP
    if (user.isPhoneVerified) {
      completedSteps.push(2);
    }

    // Step 3: Basic details (password set, gender, dob)
    const hasPassword = Boolean(user.password);
    const hasGender = Boolean(profile?.gender || user.gender);
    const hasDob = Boolean(profile?.dateOfBirth || profile?.dob || user.dob);
    if (completedSteps.includes(2) && hasPassword && hasGender && hasDob) {
      completedSteps.push(3);
    }

    // Step 4: Personal & Religious details (height, maritalStatus, subcaste/caste)
    const hasHeight = Boolean(profile?.height);
    const hasMaritalStatus = Boolean(profile?.maritalStatus);
    const hasCaste = Boolean(profile?.subcaste || profile?.caste);
    if (completedSteps.includes(3) && hasHeight && hasMaritalStatus && hasCaste) {
      completedSteps.push(4);
    }

    // Step 5: Location & Professional details (city, state, education/profession)
    const hasCity = Boolean(profile?.location?.city || profile?.city);
    const hasEducation = Boolean(profile?.education?.degree || profile?.highestEducation || profile?.education);
    const hasProfession = Boolean(profile?.profession?.occupation || profile?.profession || profile?.occupation);
    if (completedSteps.includes(4) && hasCity && (hasEducation || hasProfession)) {
      completedSteps.push(5);
    }

    // Step 6 / Completion
    if (user.isOnboardingComplete && user.registrationStatus === REGISTRATION_STATUS.COMPLETE) {
      completedSteps.push(6);
    }

    let nextStep = 1;
    let nextRoute = "/registration";

    if (!completedSteps.includes(1)) {
      nextStep = 1;
      nextRoute = "/registration";
    } else if (!completedSteps.includes(2)) {
      nextStep = 2;
      nextRoute = "/registration/otp";
    } else if (!completedSteps.includes(3)) {
      nextStep = 3;
      nextRoute = "/registration/basic-info";
    } else if (!completedSteps.includes(4)) {
      nextStep = 4;
      nextRoute = "/registration/personal-religious-info";
    } else if (!completedSteps.includes(5)) {
      nextStep = 5;
      nextRoute = "/registration/location-professional-info";
    } else if (!completedSteps.includes(6)) {
      nextStep = 6;
      nextRoute = "/registration/additional-info";
    } else {
      nextStep = 7;
      nextRoute = "/dashboard";
    }

    const isRegistered = Boolean(
      user.isOnboardingComplete &&
      (user.registrationStatus === REGISTRATION_STATUS.COMPLETE || user.status === ACCOUNT_STATUS.ACTIVE)
    );

    return {
      registrationStatus: user.registrationStatus || (user.isOnboardingComplete ? REGISTRATION_STATUS.COMPLETE : REGISTRATION_STATUS.ONBOARDING_IN_PROGRESS),
      isPhoneVerified: Boolean(user.isPhoneVerified),
      hasPassword,
      isOnboardingComplete: Boolean(user.isOnboardingComplete),
      isRegistered,
      currentStep: completedSteps.length > 0 ? Math.max(...completedSteps) : 1,
      nextStep,
      nextRoute,
      completedSteps,
      requiredActions: user.isOnboardingComplete ? [] : [`STEP_${nextStep}`],
    };
  },

  /**
   * Save registration step with whitelisting and predecessor validation.
   */
  saveRegistrationStep: async (user, requestedStep, payload) => {
    const stepNum = Number(requestedStep);
    let profile = await Profile.findOne({ userId: user._id, isPrimary: true });

    // Validate predecessor progress
    const currentProgress = onboardingService.getRegistrationProgress(user, profile);

    if (stepNum > 2 && !user.isPhoneVerified) {
      const err = new Error("Phone verification required before proceeding.");
      err.statusCode = 403;
      err.code = "PHONE_NOT_VERIFIED";
      throw err;
    }

    if (stepNum === 4 && !currentProgress.completedSteps.includes(3)) {
      const err = new Error("Cannot save Step 4 before completing Step 3 (Basic Details).");
      err.statusCode = 400;
      err.code = "PREDECESSOR_INCOMPLETE";
      throw err;
    }

    if (stepNum === 5 && !currentProgress.completedSteps.includes(4)) {
      const err = new Error("Cannot save Step 5 before completing Step 4 (Personal Details).");
      err.statusCode = 400;
      err.code = "PREDECESSOR_INCOMPLETE";
      throw err;
    }

    if (!profile) {
      profile = new Profile({
        userId: user._id,
        isPrimary: true,
        name: user.name || payload.name || "Candidate",
        profileFor: user.profileFor || payload.profileFor || "MYSELF",
        gender: payload.gender || "MALE",
      });
    }

    // Step 3: Basic Details
    if (stepNum === 3) {
      const { gender, day, month, year, motherTongue, email, password } = payload;

      if (!gender) throw new Error("Gender is required.");
      if (!day || !month || !year) throw new Error("Complete Date of Birth is required.");

      const birthDate = new Date(`${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`);
      if (isNaN(birthDate.getTime())) throw new Error("Invalid Date of Birth.");

      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }

      if (calculatedAge < 18) {
        const err = new Error("Candidate must be at least 18 years old to register.");
        err.statusCode = 400;
        throw err;
      }

      if (password) {
        if (password.length < 8) {
          const err = new Error("Password must be at least 8 characters.");
          err.statusCode = 400;
          throw err;
        }
        user.password = await hashPassword(password);
      }

      if (email) {
        user.email = String(email).trim().toLowerCase();
      }

      user.registrationStatus = REGISTRATION_STATUS.ONBOARDING_IN_PROGRESS;
      user.onboardingStep = Math.max(user.onboardingStep || 1, 3);
      await user.save();

      profile.gender = gender;
      profile.dateOfBirth = birthDate.getTime();
      profile.age = calculatedAge;
      if (motherTongue) profile.motherTongue = motherTongue;
      await profile.save();

      user.activeProfileId = profile._id;
      await user.save();
    }

    // Step 4: Personal & Religious Details
    else if (stepNum === 4) {
      const { height, maritalStatus, caste, subcaste, gotra, motherGotra, manglik } = payload;

      if (!height) throw new Error("Height is required.");
      if (!maritalStatus) throw new Error("Marital status is required.");

      profile.height = Number(height);
      profile.maritalStatus = maritalStatus;
      profile.subcaste = subcaste || caste || "Amil";
      if (gotra) profile.gotra = gotra;
      if (motherGotra) profile.motherGotra = motherGotra;
      if (manglik) profile.manglik = manglik;
      await profile.save();

      user.onboardingStep = Math.max(user.onboardingStep || 1, 4);
      user.registrationStatus = REGISTRATION_STATUS.ONBOARDING_IN_PROGRESS;
      await user.save();
    }

    // Step 5: Location & Professional Details
    else if (stepNum === 5) {
      const { city, state, country, highestEducation, degree, occupation, profession, annualIncome, companyName } = payload;

      if (!city) throw new Error("City is required.");

      profile.location = {
        city: String(city).trim(),
        state: state ? String(state).trim() : "",
        country: country ? String(country).trim() : "India",
        nativePlace: profile.location?.nativePlace || "",
      };

      profile.education = {
        degree: degree || highestEducation || "",
        field: payload.field || profile.education?.field || "",
        college: payload.college || profile.education?.college || "",
      };

      profile.profession = {
        occupation: occupation || profession || "",
        companyName: companyName || profile.profession?.companyName || "",
        annualIncome: Number(annualIncome) || 0,
        currency: profile.profession?.currency || "INR",
      };

      await profile.save();

      user.onboardingStep = Math.max(user.onboardingStep || 1, 5);
      user.registrationStatus = REGISTRATION_STATUS.ONBOARDING_IN_PROGRESS;
      await user.save();
    }

    // Step 6: Additional Information / Final step details
    else if (stepNum === 6) {
      const { aboutMe, avatar, photos } = payload;

      if (aboutMe) profile.aboutMe = String(aboutMe).trim();
      if (avatar) profile.avatar = avatar;
      if (Array.isArray(photos)) profile.photos = photos;

      await profile.save();
      user.onboardingStep = Math.max(user.onboardingStep || 1, 6);
      await user.save();
    }

    const updatedUser = await User.findById(user._id).select("+password");
    const updatedProfile = await Profile.findById(profile._id);

    return onboardingService.getRegistrationProgress(updatedUser, updatedProfile);
  },

  /**
   * Complete registration atomically and issue full-access credentials.
   */
  completeRegistration: async (userId) => {
    const user = await User.findById(userId).select("+password");
    if (!user) {
      const err = new Error("User not found.");
      err.statusCode = 404;
      throw err;
    }

    const profile = await Profile.findOne({ userId: user._id, isPrimary: true });
    if (!profile) {
      const err = new Error("Primary profile not found. Please complete previous registration steps.");
      err.statusCode = 400;
      throw err;
    }

    if (!user.isPhoneVerified) {
      const err = new Error("Phone must be verified before completing registration.");
      err.statusCode = 403;
      throw err;
    }

    if (!user.password) {
      const err = new Error("Password must be set before completing registration.");
      err.statusCode = 400;
      throw err;
    }

    // Validate mandatory fields
    const missing = [];
    if (!profile.gender) missing.push("gender");
    if (!profile.dateOfBirth) missing.push("dateOfBirth");
    if (!profile.height) missing.push("height");
    if (!profile.maritalStatus) missing.push("maritalStatus");
    if (!profile.location?.city) missing.push("city");

    if (missing.length > 0) {
      const err = new Error(`Cannot complete registration. Missing required fields: ${missing.join(", ")}`);
      err.statusCode = 400;
      err.code = "MISSING_MANDATORY_FIELDS";
      err.missingFields = missing;
      throw err;
    }

    // Snapshot previous state for compensating rollback if transactions are unsupported
    const previousUserState = {
      isOnboardingComplete: user.isOnboardingComplete,
      registrationStatus: user.registrationStatus,
      status: user.status,
      onboardingStep: user.onboardingStep,
    };
    const previousProfileStatus = profile.status;
    let prefCreated = null;

    // Detect deployment topology and session transaction capability
    let session = null;
    let isTransactional = false;
    try {
      if (mongoose.connection.readyState === 1) {
        session = await mongoose.startSession();
        session.startTransaction();
        isTransactional = true;
      }
    } catch (sessionErr) {
      // Standalone MongoDB without replica set cannot run multi-document transactions
      session = null;
      isTransactional = false;
      logMessage("Notice: Standalone MongoDB detected. Multi-document transactions unsupported; engaging compensating rollback safeguard.", null, "warn");
    }

    try {
      user.isOnboardingComplete = true;
      user.registrationStatus = REGISTRATION_STATUS.COMPLETE;
      user.status = ACCOUNT_STATUS.ACTIVE;
      user.onboardingStep = 7;
      await user.save(session ? { session } : {});

      profile.status = "ACTIVE";
      await profile.save(session ? { session } : {});

      // Ensure default PartnerPreference exists
      let pref = await PartnerPreference.findOne({ userId: user._id }).session(session || null);
      if (!pref) {
        pref = new PartnerPreference({
          userId: user._id,
          profileId: profile._id,
          preferredGender: profile.gender === "MALE" ? "FEMALE" : "MALE",
          minAge: Math.max(18, (profile.age || 25) - 5),
          maxAge: (profile.age || 25) + 5,
        });
        await pref.save(session ? { session } : {});
        prefCreated = pref;
      }

      if (session) {
        await session.commitTransaction();
      }
    } catch (saveErr) {
      if (session) {
        try {
          await session.abortTransaction();
        } catch (_) {}
      } else if (mongoose.connection.readyState === 1) {
        // Deliberate compensating rollback for standalone MongoDB
        try {
          await User.updateOne({ _id: user._id }, { $set: previousUserState });
          await Profile.updateOne({ _id: profile._id }, { $set: { status: previousProfileStatus } });
          if (prefCreated?._id) {
            await PartnerPreference.deleteOne({ _id: prefCreated._id });
          }
          logMessage("Compensating rollback successfully reverted user, profile, and preferences after write failure.", null, "info");
        } catch (rollbackErr) {
          logMessage("Critical: Compensating rollback encountered error:", rollbackErr, "error");
        }
      }
      logMessage("Error completing registration in DB:", saveErr, "error");
      throw saveErr;
    } finally {
      if (session) {
        try {
          session.endSession();
        } catch (_) {}
      }
    }

    const tokenPayload = {
      userId: user._id,
      profileId: profile._id,
      role: user.role,
      status: user.status,
      scope: "FULL_ACCESS",
    };

    const token = signToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    return {
      success: true,
      message: "Registration completed successfully.",
      user: {
        _id: user._id,
        phone: user.phone,
        email: user.email,
        name: user.name,
        isOnboardingComplete: true,
        registrationStatus: REGISTRATION_STATUS.COMPLETE,
      },
      profile,
      token,
      refreshToken,
      isTransactional,
      progress: onboardingService.getRegistrationProgress(user, profile),
    };
  },
};

export default onboardingService;
