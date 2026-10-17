import { asyncHandler, apiHTTPResponse, logMessage, isDeltaEqual, isDataEqual } from "../../utils/globalFunction.js";
import * as CONSTANTS from "../../utils/constants.js";
import * as CONSTANTS_MSG from "../../utils/constantsMessage.js";
import { User, Profile, PartnerPreference } from "../../models/index.js";
import { updateDocumentByQueryAndData } from "../../services/serviceGlobal.js";

const getUserId = (req) => req.user?.id || req.auth?.id || req.user?._id || req.auth?._id || req.user?.userId || req.auth?.userId;

const getProfileQuery = (req, userId) => {
  const activeProfileId = req.headers["x-active-profile-id"] || req.user?.activeProfileId || req.user?.profileId;
  if (activeProfileId) {
    return { _id: activeProfileId, isDeleted: false };
  }
  return { userId, isDeleted: false };
};

/**
 * 👤 Get Full Consolidated Profile (User + Profile + PartnerPreference)
 * GET /api/v1/profile/me
 */
export const getMyProfile = asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  const profileQuery = getProfileQuery(req, userId);

  const [user, profile, partnerPreference] = await Promise.all([
    User.findById(userId).select("-password -verificationToken -passwordResetToken").lean(),
    Profile.findOne(profileQuery).lean(),
    PartnerPreference.findOne({ userId, isDeleted: false }).lean(),
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

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    CONSTANTS_MSG.RECORD_FOUND,
    {
      user,
      profile: profile || {},
      partnerPreference: partnerPreference || {},
    },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 📝 Update Basic & Cultural Details (Subcaste, Gotra, DOB, Height, Location)
 * PUT /api/v1/profile/basic
 * Powered by Strict Rule 6 Zero-Write Mutation Memoization (isDataEqual / isDeltaEqual)
 */
export const updateProfileBasic = asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  const updateData = { ...req.body, updatedAt: Date.now() };

  // Calculate age if dateOfBirth is updated
  if (updateData.dateOfBirth) {
    const diffMs = Date.now() - Number(updateData.dateOfBirth);
    updateData.age = Math.floor(diffMs / (365.25 * 24 * 60 * 60 * 1000));
  }

  const result = await updateDocumentByQueryAndData(
    Profile,
    getProfileQuery(req, userId),
    updateData
  );

  if (result.statusCode !== CONSTANTS.OK) {
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

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    CONSTANTS_MSG.PROFILE_UPDATED,
    result.data,
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 🎓 Update Education & Career Details
 * PUT /api/v1/profile/education-career
 */
export const updateProfileEducationCareer = asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  const updateData = { ...req.body, updatedAt: Date.now() };

  const result = await updateDocumentByQueryAndData(
    Profile,
    getProfileQuery(req, userId),
    updateData
  );

  if (result.statusCode !== CONSTANTS.OK) {
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

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    CONSTANTS_MSG.PROFILE_UPDATED,
    result.data,
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 👨‍👩‍👧 Update Family Background
 * PUT /api/v1/profile/family
 */
export const updateProfileFamily = asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  const updateData = { ...req.body, updatedAt: Date.now() };

  const result = await updateDocumentByQueryAndData(
    Profile,
    getProfileQuery(req, userId),
    updateData
  );

  if (result.statusCode !== CONSTANTS.OK) {
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

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    CONSTANTS_MSG.PROFILE_UPDATED,
    result.data,
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 🔮 Update Horoscope & Kundli Details
 * PUT /api/v1/profile/horoscope
 */
export const updateProfileHoroscope = asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  const updateData = { ...req.body, updatedAt: Date.now() };

  const result = await updateDocumentByQueryAndData(
    Profile,
    getProfileQuery(req, userId),
    updateData
  );

  if (result.statusCode !== CONSTANTS.OK) {
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

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    CONSTANTS_MSG.PROFILE_UPDATED,
    result.data,
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 🎯 Update Partner Preferences (Age, Height, Subcaste, Gotra Exclusions)
 * PUT /api/v1/profile/partner-preferences
 * Powered by Strict Rule 6 Zero-Write Mutation Memoization (isDataEqual / isDeltaEqual)
 */
export const updatePartnerPreferences = asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  const updateData = { ...req.body, updatedAt: Date.now() };

  // Update or upsert partner preferences
  let result = await updateDocumentByQueryAndData(
    PartnerPreference,
    { userId, isDeleted: false },
    updateData
  );

  // If partner preference document does not exist yet, create one
  if (result.statusCode === CONSTANTS.NOT_FOUND) {
    const newDoc = await PartnerPreference.create({ userId, ...updateData });
    result = { statusCode: CONSTANTS.OK, data: newDoc.toObject() };
  }

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Partner preferences updated successfully.",
    result.data,
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 🚀 Multi-Purpose Candidate Onboarding Step Save (Steps 1 to 7)
 * POST /api/v1/profile/onboarding/step
 */
export const saveOnboardingStep = asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  const { step, data } = req.body;

  let updatedRecord = null;

  switch (Number(step)) {
    case 1: // Basic Info
    case 2: // Subcaste, Gotra, Culture
    case 3: // Education & Career
    case 4: // Family Background
    case 5: // Kundli & Horoscope
      {
        const result = await updateDocumentByQueryAndData(
          Profile,
          { userId, isDeleted: false },
          { ...data, updatedAt: Date.now() }
        );
        updatedRecord = result.data;
      }
      break;

    case 6: // Partner Preferences
      {
        let result = await updateDocumentByQueryAndData(
          PartnerPreference,
          { userId, isDeleted: false },
          { ...data, updatedAt: Date.now() }
        );
        if (result.statusCode === CONSTANTS.NOT_FOUND) {
          const created = await PartnerPreference.create({ userId, ...data });
          updatedRecord = created.toObject();
        } else {
          updatedRecord = result.data;
        }
      }
      break;

    case 7: // Final Photos & Verification
      {
        const result = await updateDocumentByQueryAndData(
          Profile,
          { userId, isDeleted: false },
          { ...data, updatedAt: Date.now() }
        );
        updatedRecord = result.data;
      }
      break;

    default:
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_BAD_REQUEST,
        "Invalid onboarding step. Must be between 1 and 7.",
        CONSTANTS.DATA_NULL,
        CONSTANTS.BAD_REQUEST,
        CONSTANTS.ERROR_TRUE
      );
  }

  // Update user onboarding progress
  const userProgressUpdate = {
    $max: { onboardingStep: Number(step) },
    updatedAt: Date.now(),
  };
  if (Number(step) >= 7) {
    userProgressUpdate.isOnboardingComplete = true;
  }
  await User.findByIdAndUpdate(userId, userProgressUpdate);

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    `Onboarding Step ${step} saved successfully.`,
    {
      step: Number(step),
      data: updatedRecord,
    },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 📸 Upload Profile Photo
 * POST /api/v1/profile/photos
 */
export const uploadProfilePhoto = asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  const { url, isMain = false } = req.body;

  if (!url) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      "Photo URL is required.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
      CONSTANTS.ERROR_TRUE
    );
  }

  const profile = await Profile.findOne({ userId, isDeleted: false });
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

  const isFirstPhoto = !profile.photos || profile.photos.length === 0;
  const setMain = isMain || isFirstPhoto;

  // Add photo
  profile.photos.push({
    url,
    isMain: setMain,
    isApproved: true, // Auto-approve or queue for moderation
    uploadedAt: Date.now(),
  });

  if (setMain) {
    profile.avatar = url;
  }

  profile.updatedAt = Date.now();
  await profile.save();

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Photo uploaded successfully.",
    profile.toObject(),
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 🗑️ Delete Profile Photo
 * DELETE /api/v1/profile/photos/:photoId
 */
export const deleteProfilePhoto = asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  const { photoId } = req.params;

  const profile = await Profile.findOne({ userId, isDeleted: false });
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

  const initialCount = profile.photos.length;
  profile.photos = profile.photos.filter((p) => p._id.toString() !== photoId);

  if (profile.photos.length === initialCount) {
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_NOT_FOUND,
      "Photo not found.",
      CONSTANTS.DATA_NULL,
      CONSTANTS.NOT_FOUND,
      CONSTANTS.ERROR_TRUE
    );
  }

  // If deleted photo was avatar, update avatar to first available photo
  if (profile.avatar && !profile.photos.some((p) => p.url === profile.avatar)) {
    profile.avatar = profile.photos.length > 0 ? profile.photos[0].url : "";
  }

  profile.updatedAt = Date.now();
  await profile.save();

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    "Photo deleted successfully.",
    profile.toObject(),
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});
