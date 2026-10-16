import express from "express";
import validationMiddleware from "../../middlewares/validationMiddleware.js";
import {
  basicProfileSchema,
  educationCareerSchema,
  familySchema,
  horoscopeSchema,
  partnerPreferenceSchema,
  onboardingStepSchema,
} from "../../validators/members/profile.js";
import {
  getMyProfile,
  updateProfileBasic,
  updateProfileEducationCareer,
  updateProfileFamily,
  updateProfileHoroscope,
  updatePartnerPreferences,
  saveOnboardingStep,
  uploadProfilePhoto,
  deleteProfilePhoto,
} from "../../controllers/members/profileController.js";

const router = express.Router();

/**
 * @route   GET /api/v1/profile/me
 * @desc    Get complete candidate profile + user details + partner preferences
 * @access  Private (Candidate JWT Required)
 */
router.get("/me", getMyProfile);

/**
 * @route   PUT /api/v1/profile/basic
 * @desc    Update basic & cultural details (subcaste, gotra, dob, height, location)
 * @access  Private
 */
router.put("/basic", validationMiddleware(basicProfileSchema), updateProfileBasic);

/**
 * @route   PUT /api/v1/profile/education-career
 * @desc    Update education & profession
 * @access  Private
 */
router.put(
  "/education-career",
  validationMiddleware(educationCareerSchema),
  updateProfileEducationCareer
);

/**
 * @route   PUT /api/v1/profile/family
 * @desc    Update family background details
 * @access  Private
 */
router.put("/family", validationMiddleware(familySchema), updateProfileFamily);

/**
 * @route   PUT /api/v1/profile/horoscope
 * @desc    Update kundli & manglik status
 * @access  Private
 */
router.put("/horoscope", validationMiddleware(horoscopeSchema), updateProfileHoroscope);

/**
 * @route   PUT /api/v1/profile/partner-preferences
 * @desc    Update partner preferences
 * @access  Private
 */
router.put(
  "/partner-preferences",
  validationMiddleware(partnerPreferenceSchema),
  updatePartnerPreferences
);

/**
 * @route   POST /api/v1/profile/onboarding/step
 * @desc    Candidate 7-step onboarding save
 * @access  Private
 */
router.post(
  "/onboarding/step",
  validationMiddleware(onboardingStepSchema),
  saveOnboardingStep
);

/**
 * @route   POST /api/v1/profile/photos
 * @desc    Upload candidate profile photo
 * @access  Private
 */
router.post("/photos", uploadProfilePhoto);

/**
 * @route   DELETE /api/v1/profile/photos/:photoId
 * @desc    Delete candidate profile photo
 * @access  Private
 */
router.delete("/photos/:photoId", deleteProfilePhoto);

export default router;
