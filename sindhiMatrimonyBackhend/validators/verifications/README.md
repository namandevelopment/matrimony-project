# 🪪 Validators: KYC Verifications (`validators/verifications/`)

## 📌 Overview
Joi validation schemas for KYC data sanitization.

## 📄 Expected Validator Files
- `index.js`: Validator resolver.
- `users.js`: 📱 **Mobile App Input Schemas**:
  - `selfieVerificationSchema`: Selfie image URL and liveness metadata.
  - `aadhaarVerificationSchema`: Aadhaar/Govt ID document URLs and document number format.
- `admin.js`: 🛡️ **Admin CRM Schemas**:
  - `approveVerificationSchema`: Target verification ID validation.
  - `rejectVerificationSchema`: Reason code and rejection comments validation.
