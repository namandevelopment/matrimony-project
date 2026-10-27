import express from "express";
import userRoutes from "./users.js";
import adminRoutes from "./admin.js";

// Shorthand imports from controllers and validators for direct /auth/... endpoints
import validationMiddleware from "../../middlewares/validationMiddleware.js";
import {
  otpRateLimiter,
  registerRateLimiter,
  authRateLimiter,
} from "../../middlewares/rateLimiter.js";
import {
  sendOtpSchema,
  registerUserSchema,
  loginWithPasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyOtpSchema,
  resendOtpSchema,
  checkPhoneSchema,
  registrationStatusSchema,
  createSecondaryProfileSchema,
  switchProfileSchema,
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
  refreshTokenHandler,
} from "../../controllers/auth/users.js";

const router = express.Router();

// 1. Nested Staff/Admin & User Routes: /api/v1/auth/admin/... & /api/v1/auth/users/...
router.use("/admin", adminRoutes);
router.use("/users", userRoutes);

// 2. Candidate Authentication Routes:
// Mobile + Password Login
router.post("/login", authRateLimiter, validationMiddleware(loginWithPasswordSchema), loginWithPassword);

// Registration strictly with OTP + Password
router.post("/send-otp", otpRateLimiter, validationMiddleware(sendOtpSchema), sendOtp);
router.post("/sendOtp", otpRateLimiter, validationMiddleware(sendOtpSchema), sendOtp); // Legacy camelCase support
router.post("/register", registerRateLimiter, validationMiddleware(registerUserSchema), register);
router.post("/register-step", registerRateLimiter, registerStep);
router.post("/registerStep", registerRateLimiter, registerStep);

// Password Reset Flow (Forgot Password & Reset)
router.post("/forgot-password", otpRateLimiter, validationMiddleware(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", authRateLimiter, validationMiddleware(resetPasswordSchema), resetPassword);

// OTP Verification (Fallback / Phone verification)
router.post("/verify-otp", authRateLimiter, validationMiddleware(verifyOtpSchema), verifyLoginOtp);
router.post("/resend-otp", otpRateLimiter, validationMiddleware(resendOtpSchema), resendOtp);
router.post("/reSendOtp", otpRateLimiter, validationMiddleware(resendOtpSchema), resendOtp); // Legacy camelCase support
router.post("/check-phone", validationMiddleware(checkPhoneSchema), checkPhoneExists);
router.post("/complete-registration", registerRateLimiter, completeRegistration);
router.post("/completeRegistration", registerRateLimiter, completeRegistration);
router.post("/refresh-token", validationMiddleware(refreshTokenSchema), refreshTokenHandler);
router.post("/refreshToken", validationMiddleware(refreshTokenSchema), refreshTokenHandler);
router.post("/logout", logout);
router.post("/userLogout", logout); // Legacy camelCase support

// Shorthand multi-profile endpoints
router.get("/my-profiles", getMyProfiles);
router.post("/profiles", registerRateLimiter, validationMiddleware(createSecondaryProfileSchema), createSecondaryProfile);
router.post("/switch-profile", validationMiddleware(switchProfileSchema), switchActiveProfile);

export default router;
