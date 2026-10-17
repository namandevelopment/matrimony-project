import { expressjwt as jwt } from "express-jwt";

const getJwtSecret = () => process.env.JWT_SECRET_KEY || "sindhi_matrimony_default_jwt_secret";

export const publicPaths = [
  // System Health & Liveness
  /^\/api\/v1\/health$/,

  // Candidate Auth (Supports both /auth/send-otp and /auth/users/send-otp)
  /^\/api\/v1\/auth\/(users\/)?(send-otp|sendOtp|verify-otp|login|register|resend-otp|reSendOtp|check-phone)$/,

  // Admin Auth
  /^\/api\/v1\/auth\/admin\/(login|forgot-password|reset-password)$/,

  // Single Consolidated Public Dropdowns Bundle (Zero-Token Master Data)
  /^\/api\/v1\/common\/dropdowns$/,

  // Public Catalog & Stories
  /^\/api\/v1\/plans\/public-list$/,
  /^\/api\/v1\/stories\/public-list$/,
  /^\/api\/v1\/reviews\/public-list$/,

  // Public Lead Intake (Landing pages & Meta ads)
  /^\/api\/v1\/leads\/public\/submit$/,

  // External Webhooks (Razorpay & Exotel)
  /^\/api\/v1\/webhooks\/.*$/,

  // Dev API Tracker & Telemetry (Dev Mode Only)
  /^\/api\/v1\/dev(\/.*)?$/,

  // API Documentation (Swagger UI)
  /^\/api-docs(\/.*)?$/,
  /^\/api\/v1\/api-docs(\/.*)?$/,
];

const jwtMiddleware = () => {
  return jwt({
    secret: getJwtSecret(),
    algorithms: ["HS256"],
    requestProperty: "auth", // req.auth holds the decoded JWT payload
  }).unless({
    path: publicPaths,
  });
};

export default jwtMiddleware;
