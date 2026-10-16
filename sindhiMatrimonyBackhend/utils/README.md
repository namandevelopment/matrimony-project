# 🧰 Utils Layer — Centralized Helpers, Messages & Rules

## 📌 Overview
Utils layer platform ke reusable components, validation rules, aur response helpers contain karta hai.

## ⭐ Strict Architectural Rules
1. **`constantsMessage.js` (Dedicated File)**:
   - 100% Centralized messages. Controller ya service me ek bhi raw string hardcode nahi hoga.
2. **`joiValidationDataType.js` (Dedicated File)**:
   - 100% Centralized Joi validation data types, regex patterns, aur reusable checks.
3. **`globalFunction.js`**:
   - `apiHTTPResponse(res, status, code, message, data, metadata)` uniform standard response builder.
   - Password hashing (bcrypt), OTP generation, string sanitization.
4. **`constants.js`**:
   - HTTP status codes (200, 201, 400, 401, 403, 404, 422, 500) aur application error codes.
5. **`variables.js`**:
   - Roles enum (`SUPER_ADMIN`, `MATCHMAKER`, `TELECALLER`, `USER`), Lead stages, KYC statuses.
6. **`jwtTokenUtils.js` & `logoutUtils.js`**:
   - Access & refresh token signing, verification, and Redis invalidation.
7. **`s3Bucket.js` & `multerConfig.js`**:
   - AWS S3 / Cloudflare R2 direct-to-cloud presigned URL generator & memory buffer configurations.
8. **`htmlTemplate.js`**:
   - Branded transactional email templates (Welcome email, Password reset, Verification approved).
