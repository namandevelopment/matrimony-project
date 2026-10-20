import express from "express";
import userRoutes from "./users.js";

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
  createSecondaryProfileSchema,
  switchProfileSchema,
  refreshTokenSchema,
} from "../../validators/auth/users.js";
import {
  sendOtp,
  register,
  loginWithPassword,
  forgotPassword,
  resetPassword,
  verifyLoginOtp,
  resendOtp,
  checkPhoneExists,
  logout,
  createSecondaryProfile,
  getMyProfiles,
  switchActiveProfile,
  refreshTokenHandler,
} from "../../controllers/auth/users.js";

const router = express.Router();

// 1. Nested User Routes: /api/v1/auth/users/...
router.use("/users", userRoutes);

// 2. Candidate Authentication Routes:
// Mobile + Password Login
router.post("/login", authRateLimiter, validationMiddleware(loginWithPasswordSchema), loginWithPassword);

// Registration strictly with OTP + Password
router.post("/send-otp", otpRateLimiter, validationMiddleware(sendOtpSchema), sendOtp);
router.post("/sendOtp", otpRateLimiter, validationMiddleware(sendOtpSchema), sendOtp); // Legacy camelCase support
router.post("/register", registerRateLimiter, validationMiddleware(registerUserSchema), register);

// Password Reset Flow (Forgot Password & Reset)
router.post("/forgot-password", otpRateLimiter, validationMiddleware(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", authRateLimiter, validationMiddleware(resetPasswordSchema), resetPassword);

// OTP Verification (Fallback / Phone verification)
router.post("/verify-otp", authRateLimiter, validationMiddleware(verifyOtpSchema), verifyLoginOtp);
router.post("/resend-otp", otpRateLimiter, validationMiddleware(resendOtpSchema), resendOtp);
router.post("/reSendOtp", otpRateLimiter, validationMiddleware(resendOtpSchema), resendOtp); // Legacy camelCase support
router.post("/check-phone", validationMiddleware(checkPhoneSchema), checkPhoneExists);
router.post("/refresh-token", validationMiddleware(refreshTokenSchema), refreshTokenHandler);
router.post("/refreshToken", validationMiddleware(refreshTokenSchema), refreshTokenHandler);
router.post("/logout", logout);
router.post("/userLogout", logout); // Legacy camelCase support

// Shorthand multi-profile endpoints
router.get("/my-profiles", getMyProfiles);
router.post("/profiles", registerRateLimiter, validationMiddleware(createSecondaryProfileSchema), createSecondaryProfile);
router.post("/switch-profile", validationMiddleware(switchProfileSchema), switchActiveProfile);

export default router;
