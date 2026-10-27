import express from "express";
import validationMiddleware from "../../middlewares/validationMiddleware.js";
import {
  otpRateLimiter,
  registerRateLimiter,
  authRateLimiter,
} from "../../middlewares/rateLimiter.js";
import {
  sendOtpSchema,
  registerUserSchema,
  verifyOtpSchema,
  resendOtpSchema,
  checkPhoneSchema,
  registrationStatusSchema,
  createSecondaryProfileSchema,
  switchProfileSchema,
  updateProfileStatusSchema,
  grantAccessSchema,
  transferProfileSchema,
  loginWithPasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshTokenSchema,
} from "../../validators/auth/users.js";
import {
  sendOtp,
  register,
  registerStep,
  loginWithPassword,
  forgotPassword,
  resetPassword,
  verifyLoginOtp,
  resendOtp,
  checkPhoneExists,
  completeRegistration,
  logout,
  createSecondaryProfile,
  getMyProfiles,
  switchActiveProfile,
  updateProfileStatus,
  grantProfileAccess,
  listProfileGrants,
  revokeProfileGrant,
  transferProfileOwnership,
  refreshTokenHandler,
} from "../../controllers/auth/users.js";

const router = express.Router();

/**
 * @route   POST /api/v1/auth/users/refresh-token
 * @desc    Renew Access Token using valid Refresh Token
 * @access  Public
 */
router.post("/refresh-token", validationMiddleware(refreshTokenSchema), refreshTokenHandler);
router.post("/refreshToken", validationMiddleware(refreshTokenSchema), refreshTokenHandler);

/**
 * @route   POST /api/v1/auth/users/login
 * @desc    Candidate Login with Mobile Number and Password
 * @access  Public
 */
router.post("/login", authRateLimiter, validationMiddleware(loginWithPasswordSchema), loginWithPassword);

/**
 * @route   POST /api/v1/auth/users/send-otp
 * @desc    Request OTP strictly for Registration
 * @access  Public
 */
router.post("/send-otp", otpRateLimiter, validationMiddleware(sendOtpSchema), sendOtp);

/**
 * @route   POST /api/v1/auth/users/register
 * @desc    Complete Quick Registration with OTP & Password
 * @access  Public
 */
router.post("/register", registerRateLimiter, validationMiddleware(registerUserSchema), register);
router.post("/register-step", registerRateLimiter, registerStep);
router.post("/registerStep", registerRateLimiter, registerStep);

/**
 * @route   POST /api/v1/auth/users/forgot-password
 * @desc    Send OTP to reset candidate password
 * @access  Public
 */
router.post("/forgot-password", otpRateLimiter, validationMiddleware(forgotPasswordSchema), forgotPassword);

/**
 * @route   POST /api/v1/auth/users/reset-password
 * @desc    Verify OTP and set new password
 * @access  Public
 */
router.post("/reset-password", authRateLimiter, validationMiddleware(resetPasswordSchema), resetPassword);

/**
 * @route   POST /api/v1/auth/users/verify-otp
 * @desc    Verify OTP for Existing User Login (Optional Fallback)
 * @access  Public
 */
router.post("/verify-otp", authRateLimiter, validationMiddleware(verifyOtpSchema), verifyLoginOtp);

/**
 * @route   POST /api/v1/auth/users/resend-otp
 * @desc    Resend OTP to Mobile
 * @access  Public
 */
router.post("/resend-otp", otpRateLimiter, validationMiddleware(resendOtpSchema), resendOtp);

/**
 * @route   POST /api/v1/auth/users/check-phone
 * @desc    Ultra-fast check if phone is already registered
 * @access  Public
 */
router.post("/check-phone", validationMiddleware(checkPhoneSchema), checkPhoneExists);

router.post("/complete-registration", registerRateLimiter, completeRegistration);
router.post("/completeRegistration", registerRateLimiter, completeRegistration);

/**
 * @route   POST /api/v1/auth/users/logout
 * @desc    Logout User & Blacklist Token in Redis
 * @access  Private (JWT Required)
 */
router.post("/logout", logout);

/**
 * --------------------------------------------------------------------------
 * 💍 MULTI-PROFILE & FAMILY DELEGATION ARCHITECTURE ROUTES
 * --------------------------------------------------------------------------
 */

/**
 * @route   GET /api/v1/auth/users/my-profiles
 * @desc    List all candidate profiles owned or delegated to this account
 * @access  Private (JWT Required)
 */
router.get("/my-profiles", getMyProfiles);

/**
 * @route   POST /api/v1/auth/users/profiles
 * @desc    Create secondary candidate profile (e.g. Sibling, Child, Self)
 * @access  Private (JWT Required)
 */
router.post(
  "/profiles",
  registerRateLimiter,
  validationMiddleware(createSecondaryProfileSchema),
  createSecondaryProfile
);

/**
 * @route   POST /api/v1/auth/users/switch-profile
 * @desc    Switch active profile context and receive fresh JWT
 * @access  Private (JWT Required)
 */
router.post(
  "/switch-profile",
  validationMiddleware(switchProfileSchema),
  switchActiveProfile
);

/**
 * @route   PATCH /api/v1/auth/users/profiles/:profileId/status
 * @desc    Update profile status (ACTIVE, DEACTIVATED, HIDDEN)
 * @access  Private (JWT Required, Owner only)
 */
router.patch(
  "/profiles/:profileId/status",
  validationMiddleware(updateProfileStatusSchema),
  updateProfileStatus
);

/**
 * @route   POST /api/v1/auth/users/profiles/:profileId/grants
 * @desc    Grant profile delegation access to family member
 * @access  Private (JWT Required, Owner only)
 */
router.post(
  "/profiles/:profileId/grants",
  validationMiddleware(grantAccessSchema),
  grantProfileAccess
);

/**
 * @route   GET /api/v1/auth/users/profiles/:profileId/grants
 * @desc    List all active access delegation grants for a profile
 * @access  Private (JWT Required)
 */
router.get("/profiles/:profileId/grants", listProfileGrants);

/**
 * @route   DELETE /api/v1/auth/users/profiles/:profileId/grants/:grantId
 * @desc    Revoke family delegation access grant
 * @access  Private (JWT Required, Owner only)
 */
router.delete("/profiles/:profileId/grants/:grantId", revokeProfileGrant);

/**
 * @route   POST /api/v1/auth/users/profiles/:profileId/transfer
 * @desc    Transfer profile ownership to candidate's own registered account
 * @access  Private (JWT Required, Owner only)
 */
router.post(
  "/profiles/:profileId/transfer",
  validationMiddleware(transferProfileSchema),
  transferProfileOwnership
);

export default router;
