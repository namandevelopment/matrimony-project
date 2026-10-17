import mongoose from "mongoose";
import { asyncHandler, apiHTTPResponse, hashPassword, logMessage, generateCandidateDeduplicationHash } from "../../utils/globalFunction.js";
import * as CONSTANTS from "../../utils/constants.js";
import * as CONSTANTS_MSG from "../../utils/constantsMessage.js";
import { ROLES, ACCOUNT_STATUS, MEMBERSHIP_TIERS, KYC_STATUS } from "../../utils/variables.js";
import { User, Profile, PartnerPreference, ProfileAccessGrant, ACCESS_ROLES } from "../../models/index.js";
import serviceOTP from "../../services/serviceOTP.js";
import { sendMultiChannelNotification } from "../../services/serviceNotifications.js";
import { signToken, generateRefreshToken } from "../../utils/jwtTokenUtils.js";
import { invalidateTokenInRedis } from "../../utils/logoutUtils.js";

/**
 * 📲 Send OTP to Candidate Mobile (Mobile App & Web Registration / Login)
 * POST /api/v1/auth/users/send-otp (or /api/v1/auth/send-otp)
 * 
 * Optimizations:
 * 1. Checks account suspension.
 * 2. If purpose is 'REGISTER' and account already exists, fails fast with 409 Conflict to save SMS cost.
 * 3. Dispatches SMS/WhatsApp notifications asynchronously without blocking HTTP response time.
 */
export const sendOtp = asyncHandler(async (req, res) => {
  const { phone, countryCode = "+91", purpose = "LOGIN" } = req.body;
  const upperPurpose = String(purpose).trim().toUpperCase();

  // 1. Fast indexed check for candidate account
  const existingUser = await User.findOne({ phone, isDeleted: false })
    .select("status role")
    .lean();

  if (existingUser && existingUser.status === ACCOUNT_STATUS.SUSPENDED) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_FORBIDDEN,
      CONSTANTS_MSG.ACCOUNT_SUSPENDED,
      CONSTANTS.DATA_NULL,
      CONSTANTS.FORBIDDEN,
      CONSTANTS.ERROR_TRUE
    );
  }

  // 2. Anti-waste check: If purpose is explicitly REGISTER and user exists, fail fast
  if (upperPurpose === "REGISTER" && existingUser) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_CONFLICT,
      "An account with this mobile number already exists. Please log in directly.",
      { phone, countryCode, isExistingUser: true },
      CONSTANTS.CONFLICT,
      CONSTANTS.ERROR_TRUE
    );
  }

  // 3. Generate 6-digit OTP and store with 10-minute expiry
  const otp = await serviceOTP.generateAndStoreOtp(phone, upperPurpose);

  // 4. Dispatch SMS / WhatsApp alert in background (non-blocking for sub-20ms latency)
  sendMultiChannelNotification({
    phone: `${countryCode}${phone}`,
    channels: ["SMS", "WHATSAPP"],
    title: "Sindhi Matrimony Verification Code",
    body: `Your Sindhi Matrimony verification code is ${otp}. Valid for 10 minutes. Please do not share this OTP with anyone.`,
  }).catch((err) => {
    logMessage("Non-blocking OTP notification dispatch error:", err, "warn");
  });

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    CONSTANTS_MSG.OTP_SENT_PHONE,
    {
      phone,
      countryCode,
      isExistingUser: Boolean(existingUser),
      purpose: upperPurpose,
    },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 💍 Complete Quick Registration & Multi-Step Wizard Hydration
 * POST /api/v1/auth/users/register (or /api/v1/auth/register)
 * 
 * Optimizations:
 * 1. Lean indexed duplicate verification.
 * 2. Safe dual-purpose OTP verification (REGISTER or LOGIN).
 * 3. Parallel creation of Profile and PartnerPreference documents (Promise.all).
 * 4. Atomic rollback on profile creation failure to prevent orphaned user records.
 * 5. Supports initial wizard hydration (DOB, calculated age, subcaste, location, career).
 */
export const register = asyncHandler(async (req, res) => {
  const {
    phone,
    otp,
    name,
    profileFor = "MYSELF",
    gender,
    countryCode = "+91",
    email,
    password,
    fcmToken,
    clientPlatform = "WEB",
    // Optional initial onboarding details from registration wizard:
    subcaste,
    dateOfBirth,
    dob,
    maritalStatus,
    height,
    education,
    profession,
    occupation,
    annualIncome,
    city,
    state,
    nativePlace,
    aboutMe,
    aboutMyself,
  } = req.body;

  // 1. Fast indexed check: user already exists
  const existingUser = await User.findOne({ phone, isDeleted: false })
    .select("_id")
    .lean();

  if (existingUser) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_CONFLICT,
      "An account with this mobile number already exists. Please log in directly.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.CONFLICT,
      CONSTANTS.ERROR_TRUE
    );
  }

  // 2. Verify OTP (Accepts purpose 'REGISTER' or 'LOGIN')
  const otpResult = await serviceOTP.verifyOtpAnyPurpose(phone, otp, ["REGISTER", "LOGIN"]);
  if (!otpResult.isValid) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      otpResult.message || CONSTANTS_MSG.INVALID_OTP,
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  // 3. Hash password if provided
  let passwordHash = undefined;
  if (password) {
    passwordHash = await hashPassword(password);
  }

  // 4. Calculate Age if DOB is supplied (timestamp or date string)
  let dobTimestamp = undefined;
  let calculatedAge = undefined;
  if (dateOfBirth) {
    dobTimestamp = Number(dateOfBirth);
  } else if (dob) {
    const parsedDate = new Date(dob);
    if (!isNaN(parsedDate.getTime())) {
      dobTimestamp = parsedDate.getTime();
    }
  }

  if (dobTimestamp) {
    const diffMs = Date.now() - dobTimestamp;
    calculatedAge = Math.floor(diffMs / (365.25 * 24 * 60 * 60 * 1000));
  }

  const normalizedGender = String(gender).trim().toUpperCase();
  const normalizedProfileFor = String(profileFor).trim().toUpperCase();
  const normalizedPlatform = String(clientPlatform || req.clientInfo?.platform || "WEB").toUpperCase();

  // 4.5 Deduplication Check (Name + DOB + Gender + Subcaste)
  const identityHash = generateCandidateDeduplicationHash({
    name,
    dateOfBirth: dobTimestamp,
    dob,
    gender: normalizedGender,
    subcaste: subcaste || "Amil",
  });

  const duplicateCandidate = await Profile.findOne({
    identityDeduplicationHash: identityHash,
    isDeleted: false,
  }).lean();

  if (duplicateCandidate) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_CONFLICT,
      "A candidate with identical details (Name, DOB, Gender, Subcaste) is already registered.",
      { duplicateProfileId: duplicateCandidate._id },
      CONSTANTS.CONFLICT,
      CONSTANTS.ERROR_TRUE
    );
  }

  // 5. Create Core User Account Document
  const user = await User.create({
    phone,
    countryCode,
    email: email ? String(email).trim().toLowerCase() : undefined,
    password: passwordHash,
    role: ROLES.USER,
    status: ACCOUNT_STATUS.ACTIVE,
    isPhoneVerified: true,
    fcmTokens: fcmToken ? [fcmToken] : [],
    clientPlatform: normalizedPlatform,
    onboardingStep: (education || occupation || city || subcaste) ? 4 : 1,
    isOnboardingComplete: false,
    maxProfilesAllowed: 4,
    lastLoginAt: Date.now(),
    lastActiveAt: Date.now(),
  });

  let profile = null;
  let partnerPreference = null;

  try {
    // 6. Concurrently create Profile & Default Partner Preferences in parallel
    const [createdProfile, createdPreferences] = await Promise.all([
      Profile.create({
        userId: user._id,
        name: name.trim(),
        profileFor: normalizedProfileFor,
        gender: normalizedGender,
        subcaste: subcaste || "Amil",
        dateOfBirth: dobTimestamp,
        age: calculatedAge,
        maritalStatus: maritalStatus || "NEVER_MARRIED",
        height: height ? Number(height) : undefined,
        education: education ? { degree: education } : undefined,
        profession: (occupation || profession || annualIncome) ? {
          occupation: occupation || profession || undefined,
          annualIncome: annualIncome ? Number(annualIncome) : 0,
        } : undefined,
        location: (city || state || nativePlace) ? {
          city: city || undefined,
          state: state || undefined,
          country: "India",
          nativePlace: nativePlace || undefined,
        } : undefined,
        aboutMe: (aboutMe || aboutMyself) ? String(aboutMe || aboutMyself).trim() : undefined,
        isPrimary: true,
        status: "ACTIVE",
        membershipTier: MEMBERSHIP_TIERS.FREE,
        verificationBadge: KYC_STATUS.NOT_SUBMITTED,
        identityDeduplicationHash: identityHash,
      }),
      PartnerPreference.create({
        userId: user._id,
        ageMin: normalizedGender === "MALE" ? 18 : 21,
        ageMax: 35,
        subcastes: subcaste ? [subcaste] : [],
        preferredCities: city ? [city] : [],
      }),
    ]);

    profile = createdProfile;
    partnerPreference = createdPreferences;

    // Set activeProfileId on the user account
    user.activeProfileId = profile._id;
    await user.save();
  } catch (creationError) {
    // Rollback: delete orphaned User document to preserve database consistency
    await User.deleteOne({ _id: user._id }).catch(() => {});
    logMessage("Profile creation failed, rolled back newly created User record:", creationError, "error");
    throw creationError;
  }

  // 7. Issue JWT Access & Refresh Tokens carrying both userId and activeProfileId
  const tokenPayload = {
    userId: user._id.toString(),
    role: ROLES.USER,
    phone: user.phone,
    profileId: profile._id.toString(),
    activeProfileId: profile._id.toString(),
    profileRole: "OWNER",
  };

  const token = signToken(tokenPayload, "1d");
  const refreshToken = generateRefreshToken(tokenPayload, "7d");

  // Non-blocking welcome alert dispatch
  sendMultiChannelNotification({
    phone: `${countryCode}${phone}`,
    channels: ["SMS", "WHATSAPP"],
    title: "Welcome to Sindhi Matrimony!",
    body: `Namaste ${name.trim()}, your Sindhi Matrimony profile is successfully created. Find your perfect life partner today!`,
  }).catch((err) => logMessage("Non-blocking welcome notification error:", err, "warn"));

  logMessage(`🎉 New Matrimonial Candidate Registered: ${name} (${phone}) on ${normalizedPlatform}`, null, "info");

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_CREATED,
    CONSTANTS_MSG.REGISTRATION_SUCCESS,
    {
      token,
      refreshToken,
      user: {
        _id: user._id,
        phone: user.phone,
        email: user.email,
        role: user.role,
        activeProfileId: profile._id,
        maxProfilesAllowed: user.maxProfilesAllowed || 4,
        onboardingStep: user.onboardingStep,
        isOnboardingComplete: user.isOnboardingComplete,
      },
      profile: {
        _id: profile._id,
        name: profile.name,
        profileFor: profile.profileFor,
        gender: profile.gender,
        subcaste: profile.subcaste,
        age: profile.age,
        location: profile.location,
        isPrimary: profile.isPrimary,
        status: profile.status,
        membershipTier: profile.membershipTier,
        verificationBadge: profile.verificationBadge,
      },
    },
    CONSTANTS.CREATED,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 🔑 Verify OTP for Existing User Login
 * POST /api/v1/auth/users/verify-otp (or /api/v1/auth/verify-otp, /api/v1/auth/login)
 * 
 * Optimizations:
 * 1. Validates OTP.
 * 2. Uses atomic updateOne for session metadata and FCM tokens.
 * 3. Concurrent retrieval of Candidate Profile via Promise.all.
 */
export const verifyLoginOtp = asyncHandler(async (req, res) => {
  const { phone, otp, fcmToken, clientPlatform = "WEB" } = req.body;

  // 1. Verify OTP
  const otpResult = await serviceOTP.verifyOtp(phone, otp, "LOGIN");
  if (!otpResult.isValid) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      otpResult.message || CONSTANTS_MSG.INVALID_OTP,
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  // 2. Fetch User
  const user = await User.findOne({ phone, isDeleted: false });
  if (!user) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_NOT_FOUND,
      "No registered account found with this mobile number. Please register first.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.NOT_FOUND,
      CONSTANTS.ERROR_TRUE
    );
  }

  if (user.status === ACCOUNT_STATUS.SUSPENDED) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_FORBIDDEN,
      CONSTANTS_MSG.ACCOUNT_SUSPENDED,
      CONSTANTS.DATA_NULL,
      CONSTANTS.FORBIDDEN,
      CONSTANTS.ERROR_TRUE
    );
  }

  // 3. Resolve active profile context
  let activeProfile = null;
  if (user.activeProfileId) {
    activeProfile = await Profile.findOne({ _id: user.activeProfileId, isDeleted: false }).lean();
  }
  if (!activeProfile) {
    activeProfile = await Profile.findOne({ userId: user._id, isDeleted: false }).lean();
  }

  const updateQuery = {
    $set: {
      lastLoginAt: Date.now(),
      lastActiveAt: Date.now(),
      clientPlatform: clientPlatform || user.clientPlatform || "WEB",
    },
  };
  if (activeProfile && (!user.activeProfileId || user.activeProfileId.toString() !== activeProfile._id.toString())) {
    updateQuery.$set.activeProfileId = activeProfile._id;
  }
  if (fcmToken) {
    updateQuery.$addToSet = { fcmTokens: fcmToken };
  }

  await User.updateOne({ _id: user._id }, updateQuery);

  // 4. Issue Tokens carrying activeProfileId
  const tokenPayload = {
    userId: user._id.toString(),
    role: ROLES.USER,
    phone: user.phone,
    profileId: activeProfile?._id?.toString() || "",
    activeProfileId: activeProfile?._id?.toString() || "",
    profileRole: "OWNER",
  };

  const token = signToken(tokenPayload, "1d");
  const refreshToken = generateRefreshToken(tokenPayload, "7d");

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    CONSTANTS_MSG.LOGIN_SUCCESS,
    {
      token,
      refreshToken,
      user: {
        _id: user._id,
        phone: user.phone,
        email: user.email,
        role: user.role,
        activeProfileId: activeProfile?._id || null,
        maxProfilesAllowed: user.maxProfilesAllowed || 4,
        onboardingStep: user.onboardingStep,
        isOnboardingComplete: user.isOnboardingComplete,
      },
      profile: activeProfile || null,
    },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 🔁 Resend OTP to Mobile
 * POST /api/v1/auth/users/resend-otp (or /api/v1/auth/resend-otp)
 */
export const resendOtp = asyncHandler(async (req, res) => {
  const { phone, countryCode = "+91", purpose = "LOGIN" } = req.body;
  const upperPurpose = String(purpose).trim().toUpperCase();

  const existingUser = await User.findOne({ phone, isDeleted: false })
    .select("status")
    .lean();

  if (existingUser && existingUser.status === ACCOUNT_STATUS.SUSPENDED) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_FORBIDDEN,
      CONSTANTS_MSG.ACCOUNT_SUSPENDED,
      CONSTANTS.DATA_NULL,
      CONSTANTS.FORBIDDEN,
      CONSTANTS.ERROR_TRUE
    );
  }

  const otp = await serviceOTP.generateAndStoreOtp(phone, upperPurpose);

  // Non-blocking notification dispatch
  sendMultiChannelNotification({
    phone: `${countryCode}${phone}`,
    channels: ["SMS", "WHATSAPP"],
    title: "Sindhi Matrimony New Verification Code",
    body: `Your new Sindhi Matrimony verification code is ${otp}. Valid for 10 minutes.`,
  }).catch((err) => {
    logMessage("Non-blocking resend OTP notification error:", err, "warn");
  });

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    CONSTANTS_MSG.RESEND_OTP_SUCCESS,
    { phone, countryCode },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * ⚡ Fast Pre-Check: Check if phone number is already registered
 * POST /api/v1/auth/check-phone
 * Sub-5ms response for live registration input typing.
 */
export const checkPhoneExists = asyncHandler(async (req, res) => {
  const { phone, countryCode = "+91" } = req.body;

  let exists = false;
  if (mongoose.connection.readyState === 1) {
    exists = await User.exists({ phone, isDeleted: false });
  }

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    exists ? "Mobile number already registered." : "Mobile number available for registration.",
    {
      phone,
      countryCode,
      isRegistered: Boolean(exists),
    },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 🚪 Logout Candidate (Invalidate JWT in Redis / Memory)
 * POST /api/v1/auth/users/logout (or /api/v1/auth/logout)
 */
export const logout = asyncHandler(async (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7).trim();
    await invalidateTokenInRedis(token);
  }

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    CONSTANTS_MSG.LOGOUT_SUCCESS,
    CONSTANTS.DATA_NULL,
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * ➕ Create Secondary Profile Under Existing Account
 * POST /api/v1/auth/users/profiles (or /api/v1/auth/profiles)
 */
export const createSecondaryProfile = asyncHandler(async (req, res) => {
  const userId = req.user?.userId || req.user?.id || req.user?._id;
  const {
    name,
    profileFor = "MYSELF",
    gender,
    subcaste,
    dateOfBirth,
    dob,
    maritalStatus,
    height,
    education,
    profession,
    occupation,
    annualIncome,
    city,
    state,
    nativePlace,
    aboutMe,
  } = req.body;

  // 1. Fetch user and check max profile limit
  const user = await User.findById(userId);
  if (!user) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_NOT_FOUND,
      CONSTANTS_MSG.USER_NOT_FOUND,
      CONSTANTS.DATA_NULL,
      CONSTANTS.NOT_FOUND,
      CONSTANTS.ERROR_TRUE
    );
  }

  const existingProfileCount = await Profile.countDocuments({
    userId: user._id,
    isDeleted: false,
  });
  const maxAllowed = user.maxProfilesAllowed || 4;
  if (existingProfileCount >= maxAllowed) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      `Maximum profile limit reached (${maxAllowed}). You cannot create more profiles under this mobile number.`,
      { existingProfileCount, maxAllowed },
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  // 2. Normalization & Age calculation
  const normalizedGender = String(gender).trim().toUpperCase();
  const normalizedProfileFor = String(profileFor).trim().toUpperCase();

  let dobTimestamp = undefined;
  let calculatedAge = undefined;
  if (dateOfBirth) {
    dobTimestamp = Number(dateOfBirth);
  } else if (dob) {
    const parsedDate = new Date(dob);
    if (!isNaN(parsedDate.getTime())) {
      dobTimestamp = parsedDate.getTime();
    }
  }

  if (dobTimestamp) {
    const diffMs = Date.now() - dobTimestamp;
    calculatedAge = Math.floor(diffMs / (365.25 * 24 * 60 * 60 * 1000));
  }

  // 3. Deduplication Check (Name + DOB + Gender + Subcaste)
  const identityHash = generateCandidateDeduplicationHash({
    name,
    dateOfBirth: dobTimestamp,
    dob,
    gender: normalizedGender,
    subcaste: subcaste || "Amil",
  });

  const duplicateCandidate = await Profile.findOne({
    identityDeduplicationHash: identityHash,
    isDeleted: false,
  }).lean();

  if (duplicateCandidate) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_CONFLICT,
      "A candidate with identical details (Name, DOB, Gender, Subcaste) is already registered.",
      { duplicateProfileId: duplicateCandidate._id },
      CONSTANTS.CONFLICT,
      CONSTANTS.ERROR_TRUE
    );
  }

  // 4. Create secondary profile & partner preferences
  const [newProfile, newPreferences] = await Promise.all([
    Profile.create({
      userId: user._id,
      name: name.trim(),
      profileFor: normalizedProfileFor,
      gender: normalizedGender,
      subcaste: subcaste || "Amil",
      dateOfBirth: dobTimestamp,
      age: calculatedAge,
      maritalStatus: maritalStatus || "NEVER_MARRIED",
      height: height ? Number(height) : undefined,
      education: education ? { degree: education } : undefined,
      profession: (occupation || profession || annualIncome) ? {
        occupation: occupation || profession || undefined,
        annualIncome: annualIncome ? Number(annualIncome) : 0,
      } : undefined,
      location: (city || state || nativePlace) ? {
        city: city || undefined,
        state: state || undefined,
        country: "India",
        nativePlace: nativePlace || undefined,
      } : undefined,
      aboutMe: aboutMe ? String(aboutMe).trim() : undefined,
      isPrimary: false,
      status: "ACTIVE",
      membershipTier: MEMBERSHIP_TIERS.FREE,
      verificationBadge: KYC_STATUS.NOT_SUBMITTED,
      identityDeduplicationHash: identityHash,
    }),
    PartnerPreference.create({
      userId: user._id,
      ageMin: normalizedGender === "MALE" ? 18 : 21,
      ageMax: 35,
      subcastes: subcaste ? [subcaste] : [],
      preferredCities: city ? [city] : [],
    }),
  ]);

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_CREATED,
    "Secondary candidate profile created successfully.",
    {
      profile: newProfile,
      partnerPreference: newPreferences,
    },
    CONSTANTS.CREATED,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 📋 List All Owned and Delegated Profiles
 * GET /api/v1/auth/users/my-profiles (or /api/v1/auth/my-profiles)
 */
export const getMyProfiles = asyncHandler(async (req, res) => {
  const userId = req.user?.userId || req.user?.id || req.user?._id;

  const [user, ownedProfiles, grants] = await Promise.all([
    User.findById(userId).select("activeProfileId maxProfilesAllowed phone").lean(),
    Profile.find({ userId, isDeleted: false }).lean(),
    ProfileAccessGrant.find({ granteeUserId: userId, status: "ACTIVE", isDeleted: false }).lean(),
  ]);

  if (!user) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_NOT_FOUND,
      CONSTANTS_MSG.USER_NOT_FOUND,
      CONSTANTS.DATA_NULL,
      CONSTANTS.NOT_FOUND,
      CONSTANTS.ERROR_TRUE
    );
  }

  // Fetch granted profiles if any
  let grantedProfiles = [];
  if (grants && grants.length > 0) {
    const grantMap = new Map(grants.map((g) => [g.profileId.toString(), g]));
    const profileDocs = await Profile.find({
      _id: { $in: grants.map((g) => g.profileId) },
      isDeleted: false,
    }).lean();

    grantedProfiles = profileDocs.map((p) => ({
      ...p,
      role: grantMap.get(p._id.toString())?.accessRole || "VIEWER",
      relationshipToCandidate: grantMap.get(p._id.toString())?.relationshipToCandidate || "RELATIVE",
      isOwner: false,
      isActive: user.activeProfileId ? p._id.toString() === user.activeProfileId.toString() : false,
    }));
  }

  const activeIdStr = user.activeProfileId?.toString();
  const formattedOwned = ownedProfiles.map((p) => ({
    ...p,
    role: "OWNER",
    isOwner: true,
    isActive: activeIdStr ? p._id.toString() === activeIdStr : Boolean(p.isPrimary),
  }));

  const allProfiles = [...formattedOwned, ...grantedProfiles];

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    CONSTANTS_MSG.RECORD_FOUND,
    {
      totalProfiles: allProfiles.length,
      maxProfilesAllowed: user.maxProfilesAllowed || 4,
      activeProfileId: user.activeProfileId || (ownedProfiles[0]?._id ?? null),
      profiles: allProfiles,
    },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 🔄 Seamless Active Profile Context Switching
 * POST /api/v1/auth/users/switch-profile (or /api/v1/auth/switch-profile)
 */
export const switchActiveProfile = asyncHandler(async (req, res) => {
  const userId = req.user?.userId || req.user?.id || req.user?._id;
  const { targetProfileId } = req.body;

  const profile = await Profile.findOne({ _id: targetProfileId, isDeleted: false }).lean();
  if (!profile) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_NOT_FOUND,
      "Target profile not found or has been deactivated.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.NOT_FOUND,
      CONSTANTS.ERROR_TRUE
    );
  }

  // Check direct ownership or delegation grant
  const isDirectOwner = profile.userId.toString() === userId.toString();
  let accessRole = "OWNER";

  if (!isDirectOwner) {
    const grant = await ProfileAccessGrant.findOne({
      profileId: targetProfileId,
      granteeUserId: userId,
      status: "ACTIVE",
      isDeleted: false,
    }).lean();

    if (!grant) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_FORBIDDEN,
        "You do not have permission to access or switch to this profile.",
        CONSTANTS.DATA_NULL,
        CONSTANTS.FORBIDDEN,
        CONSTANTS.ERROR_TRUE
      );
    }
    accessRole = grant.accessRole;
  }

  // Update activeProfileId in user account
  await User.updateOne({ _id: userId }, { activeProfileId: targetProfileId });

  // Issue fresh JWT token with targetProfileId and profileRole
  const tokenPayload = {
    userId: userId.toString(),
    role: req.user?.role || ROLES.USER,
    phone: req.user?.phone,
    profileId: targetProfileId.toString(),
    activeProfileId: targetProfileId.toString(),
    profileRole: accessRole,
  };

  const token = signToken(tokenPayload, "1d");
  const refreshToken = generateRefreshToken(tokenPayload, "7d");

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Profile context switched successfully.",
    {
      token,
      refreshToken,
      activeProfileId: targetProfileId,
      profileRole: accessRole,
      profile,
    },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 🔒 Update Profile Status (Deactivate, Hide, Reactivate)
 * PATCH /api/v1/auth/users/profiles/:profileId/status
 */
export const updateProfileStatus = asyncHandler(async (req, res) => {
  const userId = req.user?.userId || req.user?.id || req.user?._id;
  const { profileId } = req.params;
  const { status } = req.body;

  const profile = await Profile.findOne({ _id: profileId, isDeleted: false });
  if (!profile) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_NOT_FOUND,
      CONSTANTS_MSG.PROFILE_NOT_FOUND,
      CONSTANTS.DATA_NULL,
      CONSTANTS.NOT_FOUND,
      CONSTANTS.ERROR_TRUE
    );
  }

  if (profile.userId.toString() !== userId.toString()) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_FORBIDDEN,
      "Only the primary profile owner can update profile status.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.FORBIDDEN,
      CONSTANTS.ERROR_TRUE
    );
  }

  profile.status = status;
  if (status === "DEACTIVATED") {
    profile.isDisable = true;
  } else if (status === "ACTIVE") {
    profile.isDisable = false;
  }
  profile.updatedAt = Date.now();
  await profile.save();

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    `Profile status updated to ${status}.`,
    { profile },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 🤝 Grant Profile Delegation Access to Family Member
 * POST /api/v1/auth/users/profiles/:profileId/grants
 */
export const grantProfileAccess = asyncHandler(async (req, res) => {
  const userId = req.user?.userId || req.user?.id || req.user?._id;
  const { profileId } = req.params;
  const { granteePhone, accessRole = "VIEWER", relationshipToCandidate = "PARENT" } = req.body;

  const profile = await Profile.findOne({ _id: profileId, isDeleted: false });
  if (!profile) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_NOT_FOUND,
      CONSTANTS_MSG.PROFILE_NOT_FOUND,
      CONSTANTS.DATA_NULL,
      CONSTANTS.NOT_FOUND,
      CONSTANTS.ERROR_TRUE
    );
  }

  if (profile.userId.toString() !== userId.toString()) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_FORBIDDEN,
      "Only the primary profile owner can grant access delegation.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.FORBIDDEN,
      CONSTANTS.ERROR_TRUE
    );
  }

  const granteeUser = await User.findOne({ phone: granteePhone, isDeleted: false });
  if (!granteeUser) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_NOT_FOUND,
      "No account found with this mobile number. Family member must register first.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.NOT_FOUND,
      CONSTANTS.ERROR_TRUE
    );
  }

  if (granteeUser._id.toString() === userId.toString()) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "You cannot grant access delegation to yourself.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  const grant = await ProfileAccessGrant.findOneAndUpdate(
    { profileId, granteeUserId: granteeUser._id },
    {
      grantedByUserId: userId,
      accessRole,
      relationshipToCandidate,
      status: "ACTIVE",
      isDeleted: false,
      updatedAt: Date.now(),
    },
    { upsert: true, new: true }
  );

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_CREATED,
    `Successfully granted ${accessRole} access to ${granteePhone}.`,
    { grant },
    CONSTANTS.CREATED,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 👥 List Delegation Grants for Profile
 * GET /api/v1/auth/users/profiles/:profileId/grants
 */
export const listProfileGrants = asyncHandler(async (req, res) => {
  const userId = req.user?.userId || req.user?.id || req.user?._id;
  const { profileId } = req.params;

  const profile = await Profile.findOne({ _id: profileId, isDeleted: false });
  if (!profile) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_NOT_FOUND,
      CONSTANTS_MSG.PROFILE_NOT_FOUND,
      CONSTANTS.DATA_NULL,
      CONSTANTS.NOT_FOUND,
      CONSTANTS.ERROR_TRUE
    );
  }

  const isOwner = profile.userId.toString() === userId.toString();
  if (!isOwner) {
    const userGrant = await ProfileAccessGrant.findOne({
      profileId,
      granteeUserId: userId,
      status: "ACTIVE",
      isDeleted: false,
    });
    if (!userGrant) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_FORBIDDEN,
        "Access denied.",
        CONSTANTS.DATA_NULL,
        CONSTANTS.FORBIDDEN,
        CONSTANTS.ERROR_TRUE
      );
    }
  }

  const grants = await ProfileAccessGrant.find({ profileId, isDeleted: false })
    .populate("granteeUserId", "phone email")
    .lean();

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    CONSTANTS_MSG.RECORD_FOUND,
    { grants },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * ❌ Revoke Family Member Access Delegation
 * DELETE /api/v1/auth/users/profiles/:profileId/grants/:grantId
 */
export const revokeProfileGrant = asyncHandler(async (req, res) => {
  const userId = req.user?.userId || req.user?.id || req.user?._id;
  const { profileId, grantId } = req.params;

  const profile = await Profile.findOne({ _id: profileId, isDeleted: false });
  if (!profile || profile.userId.toString() !== userId.toString()) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_FORBIDDEN,
      "Only the primary profile owner can revoke delegation grants.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.FORBIDDEN,
      CONSTANTS.ERROR_TRUE
    );
  }

  const grant = await ProfileAccessGrant.findOneAndUpdate(
    { _id: grantId, profileId },
    { status: "REVOKED", isDeleted: true, updatedAt: Date.now() },
    { new: true }
  );

  if (!grant) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_NOT_FOUND,
      "Access grant not found.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.NOT_FOUND,
      CONSTANTS.ERROR_TRUE
    );
  }

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Access grant successfully revoked.",
    CONSTANTS.DATA_NULL,
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 🔀 Transfer Candidate Profile Ownership to Candidate's Own Account
 * POST /api/v1/auth/users/profiles/:profileId/transfer
 */
export const transferProfileOwnership = asyncHandler(async (req, res) => {
  const userId = req.user?.userId || req.user?.id || req.user?._id;
  const { profileId } = req.params;
  const { candidatePhone } = req.body;

  const profile = await Profile.findOne({ _id: profileId, isDeleted: false });
  if (!profile) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_NOT_FOUND,
      CONSTANTS_MSG.PROFILE_NOT_FOUND,
      CONSTANTS.DATA_NULL,
      CONSTANTS.NOT_FOUND,
      CONSTANTS.ERROR_TRUE
    );
  }

  if (profile.userId.toString() !== userId.toString()) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_FORBIDDEN,
      "Only profile owner can initiate profile transfer.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.FORBIDDEN,
      CONSTANTS.ERROR_TRUE
    );
  }

  const targetUser = await User.findOne({ phone: candidatePhone, isDeleted: false });
  if (!targetUser) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_NOT_FOUND,
      "Target candidate account not found. Candidate must create an account first.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.NOT_FOUND,
      CONSTANTS.ERROR_TRUE
    );
  }

  if (targetUser._id.toString() === userId.toString()) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "Cannot transfer profile to the same user account.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  // Atomically re-point profile ownership
  profile.userId = targetUser._id;
  profile.isPrimary = true;
  profile.updatedAt = Date.now();
  await profile.save();

  // Point target user's activeProfileId to this transferred profile
  targetUser.activeProfileId = profile._id;
  await targetUser.save();

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    `Profile '${profile.name}' ownership successfully transferred to ${candidatePhone}.`,
    { profileId: profile._id, newOwnerUserId: targetUser._id },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

export default {
  sendOtp,
  register,
  verifyLoginOtp,
  resendOtp,
  checkPhoneExists,
  logout,
  createSecondaryProfile,
  getMyProfiles,
  switchActiveProfile,
  updateProfileStatus,
  grantProfileAccess,
  listProfileGrants,
  revokeProfileGrant,
  transferProfileOwnership,
};

