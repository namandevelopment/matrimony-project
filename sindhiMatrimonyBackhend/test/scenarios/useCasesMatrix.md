# 📋 Sindhi Matrimony Backend: Use Cases, Scenarios & SLA Matrix

This document provides a comprehensive specification of all business use cases, end-to-end user scenarios, test conditions, expected status codes, and latency SLAs across the unified backend serving the **React Native Mobile App**, **Next.js Web Portal**, and **Admin CRM**.

---

## 🏛️ 1. Architecture Testing Matrix Summary

| Suite Name | Scope | Test File | Test Count | Target SLA |
| :--- | :--- | :--- | :---: | :---: |
| **Strict Rule 6 Engine** | `isDataEqual` & `isDeltaEqual` Zero-Write Memoization | `test/unit/isDataEqual.test.js` | 15 | < 2ms |
| **Domain Validators** | Joi Schemas & Sindhi Cultural Constraints | `test/unit/validators.test.js` | 15 | < 5ms |
| **Auth & Onboarding** | OTP lifecycle, Quick Register, JWT Claims, Whitelist | `test/integration/authFlow.test.js` | 8 | < 35ms |
| **Profile & Onboarding** | 7-Step Profile Builder, Swagotra & Preferences | `test/integration/profileOnboarding.test.js` | 7 | < 5ms |
| **Resiliency & Middlewares**| Error Boundary, 404, 401, 422, CORS, User-Agent | `test/integration/errorBoundary.test.js` | 6 | < 10ms |
| **Total Test Coverage** | **Master Suite** | `test/runAllTests.js` | **51** | **< 100ms** |

---

## 📱 2. Authentication & Quick Registration Scenarios

### Use Case UC-AUTH-01: Candidate Send OTP (Mobile / Web)
- **Actor:** Unauthenticated Candidate (Mobile App or Web Landing Page)
- **Endpoint:** `POST /api/v1/auth/send-otp` (or `/api/v1/auth/users/send-otp`)
- **Headers:** `x-client-platform: mobile` | `Content-Type: application/json`
- **Payload:** `{ "phone": "9820123456", "countryCode": "+91", "purpose": "LOGIN" }`
- **Scenarios:**
  1. **Success (Valid Indian Mobile):** Generates 4-digit OTP, saves in Redis with 10-minute TTL, dispatches multi-channel notification (SMS + WhatsApp), returns `HTTP 200 OK`.
  2. **Suspended Account:** Candidate mobile is registered but flagged `status: "SUSPENDED"`. Returns `HTTP 403 Forbidden` with `"Your account has been suspended. Please contact support."`.
  3. **Invalid Phone (Validation Error):** Phone length < 10 digits or contains alphabets. Returns `HTTP 422 Unprocessable Entity` in < 2ms with `"Please enter a valid 10-digit mobile number."`.

---

### Use Case UC-AUTH-02: Quick Registration
- **Actor:** New Candidate
- **Endpoint:** `POST /api/v1/auth/register` (or `/api/v1/auth/users/register`)
- **Payload:**
  ```json
  {
    "phone": "9820123456",
    "otp": "123456",
    "name": "Komal Motwani",
    "gender": "FEMALE",
    "profileFor": "MYSELF",
    "countryCode": "+91",
    "email": "komal@example.com"
  }
  ```
- **Scenarios:**
  1. **Success:** Verifies OTP in Redis. Hashes default credentials, creates `User` document, creates baseline `Profile` and `PartnerPreference` records, signs JWT + Refresh tokens, returns `HTTP 201 Created` with full user profile contract.
  2. **Duplicate Phone:** Number already registered in MongoDB. Returns `HTTP 409 Conflict` with `"An account with this mobile number already exists."`.
  3. **Wrong OTP:** OTP does not match Redis cache or master dev code. Returns `HTTP 400 Bad Request` with `"Invalid or expired OTP."`.
  4. **Missing Mandatory Fields:** Missing `gender` or `name`. Caught by Joi before controller executes, returns `HTTP 422 Unprocessable Entity`.

---

## 💍 3. Profile & Matrimonial Onboarding Scenarios (7 Steps)

### Use Case UC-PROF-01: Consolidated Profile Contract (Rule 7)
- **Actor:** Authenticated Candidate
- **Endpoint:** `GET /api/v1/profile/me`
- **Headers:** `Authorization: Bearer <jwt_token>`
- **Scenarios:**
  1. **Single-Round-Trip Retrieval:** Fetches `User`, `Profile`, and `PartnerPreference` in parallel (`Promise.all`), returns consolidated object in `data: { user, profile, partnerPreference }` in < 15ms.
  2. **Guaranteed Contract:** All expected keys exist, preventing Redux and React Query state flicker.

---

### Use Case UC-PROF-02: Strict Rule 6 Zero-Write Mutation Memoization
- **Actor:** Candidate reviewing profile in Mobile App and clicking "Save" without making changes
- **Endpoint:** `PUT /api/v1/profile/basic` | `PUT /api/v1/profile/partner-preferences`
- **Scenarios:**
  1. **Zero-Write Memoization (Identical Data):**
     - Client submits identical payload: `{ "subcaste": "Amil", "gotra": "Vashishta", "height": 178 }`.
     - `isDeltaEqual` compares incoming fields against MongoDB `.lean()` document.
     - Detects match, skips MongoDB write lock and disk I/O completely.
     - Returns `HTTP 200 OK` in **< 2ms**.
  2. **Genuine Modification:**
     - Client changes annual income from `3500000` to `4500000`.
     - `isDeltaEqual` detects modification.
     - Executes MongoDB `$set` atomic update.
     - Returns `HTTP 200 OK` with updated profile.

---

### Use Case UC-PROF-03: Sindhi Cultural Swagotra Exogamy & Partner Filters
- **Actor:** Candidate setting partner preferences
- **Endpoint:** `PUT /api/v1/profile/partner-preferences`
- **Business Rule:** In Sindhi tradition, marriage within the same paternal Gotra (*Swagotra*) and maternal Gotra (*Mother Gotra*) is traditionally prohibited.
- **Scenarios:**
  1. Candidate specifies `excludedGotras: ["Vashishta", "Gautam"]`.
  2. `isDeltaEqual` correctly compares array order and elements without false-positive writes.
  3. Returns updated preferences object.

---

### Use Case UC-PROF-04: Photo Gallery & Avatar Management
- **Actor:** Candidate uploading/managing photos
- **Endpoints:**
  - `POST /api/v1/profile/photos` (Upload)
  - `DELETE /api/v1/profile/photos/:photoId` (Delete)
- **Scenarios:**
  1. **First Photo Upload:** First uploaded picture automatically sets `isMain: true` and updates `avatar` field.
  2. **Delete Avatar Photo:** When the active avatar photo is deleted, the system automatically falls back to the next available approved photo in `photos[]`.
  3. **Empty Gallery:** When all photos are deleted, `avatar` resets cleanly to `""`.

---

## 🛡️ 4. Middlewares & Resiliency Scenarios

### Use Case UC-SYS-01: Centralized Error Boundary
- **Endpoint:** Any invalid or failing endpoint
- **Scenarios:**
  1. **404 Fallback:** Requesting an undefined route returns:
     ```json
     {
       "message": "API endpoint '/api/v1/unknown' not found.",
       "code": 1404,
       "error": true,
       "data": null
     }
     ```
  2. **401 Unauthorized:** Private endpoint called without `Authorization: Bearer <token>` header returns `HTTP 401`.
  3. **500 Resiliency:** Database timeout or unhandled exception caught by `middlewares/errorHandler.js` without crashing the Node.js / PM2 worker process.

### Use Case UC-SYS-02: Device & Platform Merging
- **Middleware:** `conditionalSkipper` & `mergeParamsToBody`
- **Scenarios:**
  1. Mobile user-agents (`okhttp`, `CFNetwork`, or `x-client-platform: mobile`) flagged as `req.clientInfo.platform = "MOBILE"`.
  2. URL path parameters (`:id`) and query parameters (`?filter=active`) merged into `req.body` transparently for skinny controllers.
