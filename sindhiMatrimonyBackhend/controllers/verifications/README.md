# 🪪 Controllers: KYC Verifications (`controllers/verifications/`)

## 🎯 Kaam aur Zimmedari (Work & Responsibilities)
Candidate profile trust badhane ke liye Aadhaar, Government ID, aur Selfie verification ka complete flow. Isme **Mobile App (React Native)** aur **User Web** se aane wali candidate submission APIs ke sath-sath **Admin CRM** moderation desk dono shamil hain.

## 📄 Expected Files
- `index.js`: Module barrel exporter.
- `users.js`: 📱 **Mobile App & Web User APIs**:
  - `POST /api/v1/kyc/selfie` (ya `/api/v1/verifications/selfie`): Mobile app camera se live selfie capture upload karna.
  - `POST /api/v1/kyc/aadhaar` (ya `/api/v1/verifications/aadhaar`): Front/Back Aadhaar ya Govt ID proof submit karna.
  - `GET /api/v1/kyc/status` (ya `/api/v1/verifications/status`): Candidate ka current verification status (`PENDING`, `VERIFIED`, `REJECTED` with reason) check karna.
- `admin.js`: 🛡️ **Admin CRM Moderation APIs**:
  - `GET /api/v1/admin/verifications/queue`: Pending KYC review list with pagination & filters.
  - `PUT /api/v1/admin/verifications/:id/approve`: Verification approve karna -> Profile par Green Verified Shield badge activate karna & push notification dispatch karna.
  - `PUT /api/v1/admin/verifications/:id/reject`: Reason code ke sath reject karna (e.g. Blur Photo, Name Mismatch) taaki user dobara submit kar sake.

## ⚙️ Key Actions & Flows
1. **Candidate Submission (Mobile App)**:
   - User mobile app me Verify Profile screen par jata hai.
   - Presigned S3/R2 URL par direct secure photo upload hoti hai.
   - `users.js` controller `VerificationRequest` record create karta hai status `PENDING` ke sath.
2. **KYC Review Desk (Admin CRM)**:
   - Admin CRM reviewer side-by-side profile picture aur uploaded selfie/Aadhaar ko match karta hai.
3. **Approval / Rejection Action**:
   - Approve hone par `user.isVerified = true` aur `profile.verificationBadge = 'VERIFIED'` update hota hai.
   - Reject hone par rejection reason candidate ko push notification aur mobile app banner me show hota hai.
