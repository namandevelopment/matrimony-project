# 🪪 Routes: KYC Verifications (`routes/verifications/`)

## 📌 Overview
Candidate identity & KYC verification endpoints for both Mobile App candidates and Admin CRM reviewers.

## 📄 Expected Route Files
- `index.js`: Router barrel mounting `/api/v1/verifications` and `/api/v1/kyc`.
- `users.js`: 📱 **Mobile App & Web User Routes**:
  - `POST /api/v1/kyc/selfie`: Candidate selfie submission.
  - `POST /api/v1/kyc/aadhaar`: Candidate Aadhaar/Govt ID submission.
  - `GET /api/v1/kyc/status`: Live verification status check for mobile UI badges.
- `admin.js`: 🛡️ **Admin CRM Routes (Protected by RBAC)**:
  - `GET /api/v1/admin/verifications/queue`: Pending moderation requests.
  - `PUT /api/v1/admin/verifications/:id/approve`: Approve verification.
  - `PUT /api/v1/admin/verifications/:id/reject`: Reject with predefined reason code.
