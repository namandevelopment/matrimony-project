# 💍 Sindhi Matrimony - Active Backend APIs Documentation

> **Status:** Live & Implemented in Backend Codebase  
> **Production Base URL (Vercel):** `https://sindhi-matrimony-backend.vercel.app`  
> **Production API V1:** `https://sindhi-matrimony-backend.vercel.app/api/v1`  
> **Local Base URL:** `http://localhost:5001`  
> **API Version Prefix:** `/api/v1`  
> **Testing HTTP Client File:** [`api_requests.http`](file:///Users/naman/Documents/CRM%20Landing%20Projects/Matrimony%20Project/sindhiMatrimonyBackhend/api_requests.http)  
> **Vercel Project:** `sindhi-matrimony-backend` (Account: `namandevelopment-9594`)

---

## 📊 Executive API Status Tracker

| Category / Module | Implemented (Live) | Upcoming (In Pipeline) | Status | Target Speed SLA |
| :--- | :---: | :---: | :---: | :---: |
| **1. System & Gateway** | **1** | 0 | 🟢 Live & Tested | `< 5ms` |
| **2. Authentication & Accounts** | **6** | 0 | 🟢 Live & Tested | `< 15ms` |
| **3. Multi-Profile & Family Delegation** | **8** | 0 | 🟢 Live & Tested | `< 15ms` |
| **4. Candidate Profile Management** | **9** | 0 | 🟢 Live & Tested | `< 20ms` |
| **5. Dev Telemetry & Profiler** | **2** | 0 | 🟢 Live & Tested | `< 5ms` |
| **6. Sindhi Master Data & Dropdowns** | **8** | 0 | 🟢 Live & Tested | `< 2ms` (ETag Cached) |
| **7. Mobile HomeScreen Suite (12 Sections)** | **10** | 0 | 🟢 Live & Tested | `< 15ms` (Redis / Single Flight) |
| **8. Search, Feed & Discovery Engine** | 0 | **7** | 🟡 Next (Phase 1) | `< 25ms` (Redis / Index) |
| **9. Connect Requests & Interests** | 0 | **6** | 🟡 Next (Phase 2) | `< 15ms` |
| **10. Chat & Contact Unlocking** | 0 | **5** | ⚪ Planned (Phase 3) | `< 15ms` |
| **11. Kundli & Horoscope Matching** | 0 | **2** | ⚪ Planned (Phase 4) | `< 30ms` |
| **12. Trust, Safety & KYC** | 0 | **4** | ⚪ Planned (Phase 5) | `< 20ms` |
| **13. Plans, Subscriptions & Payments** | 0 | **3** | ⚪ Planned (Phase 6) | `< 25ms` |
| **14. Notifications & Push Alerts** | 0 | **4** | ⚪ Planned (Phase 7) | `< 10ms` |
| **TOTAL API SURFACE** | **44 Live** | **31 Upcoming** | **75 Endpoints** | **Sub-15ms Target** |

---

## 📌 Table of Contents
1. [Global Conventions & Response Format](#1-global-conventions--response-format)
2. [Quick Developer Testing Notes (Master OTP)](#2-quick-developer-testing-notes)
3. [System & Health APIs (1 Live)](#3-system--health-apis)
4. [Authentication & Account Module (6 Live)](#4-authentication--account-module)
5. [Multi-Profile & Family Delegation Module (8 Live)](#5-multi-profile--family-delegation-module)
6. [Candidate Profile Management Module (9 Live)](#6-candidate-profile-management-module)
7. [Developer Telemetry & Profiler (2 Live)](#7-developer-telemetry--profiler)
8. [Sindhi Master Data & Dropdowns Module (8 Live)](#8-sindhi-master-data--dropdowns-module)
9. [Mobile HomeScreen API Suite (10 Live - Sub-15ms & Crash-Less)](#9-mobile-homescreen-api-suite-10-live-apis)
10. [Enums & Cultural Constants Reference](#10-enums--cultural-constants-reference)
11. [Upcoming & Pending APIs Blueprint (31 In Pipeline)](#11-upcoming--pending-apis-blueprint)


---

## 1. Global Conventions & Response Format

### Standard Success Response
Sabhi APIs ek structured response envelope return karti hain:
```json
{
  "code": "OK",
  "message": "Human readable success message",
  "data": { ... },
  "error": false
}
```

### Standard Error Response
```json
{
  "code": "BAD_REQUEST",
  "message": "Validation failed: Phone number must be 10 digits.",
  "data": null,
  "error": true
}
```

### Authentication Header
Jin endpoints par **Private (JWT Required)** likha hai, unke headers me token bhejna anivarya hai:
```http
Authorization: Bearer <your_jwt_access_token>
Content-Type: application/json
```

---

## 2. Quick Developer Testing Notes

- **Master OTP in Development Mode:**
  Development mode (`NODE_ENV=development`) me SMS/WhatsApp aane ka wait kiye bina testing ke liye **Master OTP `123456`** allow kiya gaya hai.
- **Token Handling:**
  `/api/v1/auth/verify-otp` ya `/api/v1/auth/register` hit karne par response me `token` milta hai. Use copy karke `.http` file ke `@authToken` variable me daal kar saari private APIs hit ki ja sakti hain.

---

## 3. System & Health APIs

### 3.1 Health Check
Server ki liveness, uptime aur environment check karne ke liye.

- **Method & Route:** `GET /api/v1/health`
- **Access:** Public (No Token Required)
- **Headers:** `Content-Type: application/json`
- **Success Response (200 OK):**
```json
{
  "code": "OK",
  "message": "Sindhi Matrimony Unified API Gateway is healthy and running.",
  "data": {
    "uptime": 124.52,
    "timestamp": 1740000000000,
    "environment": "development"
  },
  "error": false
}
```

---

## 4. Authentication & Account Module

Base Path: `/api/v1/auth`

> **Authentication Policy:**
> - **Login:** Mobile Number + Password (`POST /api/v1/auth/login`)
> - **Registration:** Mobile Number + OTP verification + Password creation (`POST /api/v1/auth/send-otp` -> `POST /api/v1/auth/register`)
> - **Forgot Password:** OTP verification -> Reset password (`POST /api/v1/auth/forgot-password` -> `POST /api/v1/auth/reset-password`)

---

### 4.1 Send OTP (Registration Only)
Naye user registration ke liye candidate ke phone number par OTP bhejna.

- **Method & Route:** `POST /api/v1/auth/send-otp`  
  *(Legacy alias: `POST /api/v1/auth/sendOtp` ya `POST /api/v1/auth/users/send-otp`)*
- **Access:** Public
- **Rate Limit:** 5 requests per 10 minutes per IP/Phone
- **Request Body:**
```json
{
  "phone": "9829012345",
  "countryCode": "+91",
  "purpose": "REGISTER"
}
```
- **Success Response (200 OK):**
```json
{
  "code": "OK",
  "message": "OTP has been sent successfully to your mobile number.",
  "data": {
    "phone": "9829012345",
    "countryCode": "+91",
    "isExistingUser": false,
    "purpose": "REGISTER"
  },
  "error": false
}
```
- **Error (409 Conflict):** Agar number already registered hai to login karne ka sandesh aayega.
- **Error (400 Bad Request):** Agar `purpose: "LOGIN"` bheja jaye, to system bataega ki login ke liye password use karein.

---

### 4.2 Candidate Quick Registration (Phone + OTP + Password)
Naya user account banana + candidate profile & partner preference document banana.

- **Method & Route:** `POST /api/v1/auth/register`  
  *(Alias: `POST /api/v1/auth/users/register`)*
- **Access:** Public
- **Request Body:**
```json
{
  "phone": "9829012345",
  "otp": "123456",
  "password": "Password123@",
  "name": "Rohan Advani",
  "gender": "MALE",
  "profileFor": "MYSELF",
  "countryCode": "+91",
  "clientPlatform": "WEB",
  "subcaste": "Bhaiband",
  "dob": "1997-06-15",
  "maritalStatus": "NEVER_MARRIED",
  "height": 178,
  "education": "B.Tech Computer Science",
  "profession": "Software Engineer",
  "annualIncome": 1800000,
  "city": "Jaipur",
  "state": "Rajasthan",
  "nativePlace": "Ajmer"
}
```
- **Success Response (201 Created):**
```json
{
  "code": 1201,
  "message": "Registration completed successfully.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "refreshToken": "eyJhbGci...",
    "user": {
      "_id": "67b34a12c8e312a0f8...",
      "phone": "9829012345",
      "role": 6,
      "activeProfileId": "67b34a12c8e312a0f9..."
    },
    "profile": {
      "_id": "67b34a12c8e312a0f9...",
      "name": "Rohan Advani",
      "gender": "MALE",
      "subcaste": "Bhaiband"
    }
  },
  "error": false
}
```

---

### 4.3 Candidate Login (Mobile Number + Password)
Registered mobile number aur password se login karke JWT access token aur profile context prapt karna.

- **Method & Route:** `POST /api/v1/auth/login`  
  *(Alias: `POST /api/v1/auth/users/login`)*
- **Access:** Public
- **Request Body:**
```json
{
  "phone": "9829012345",
  "password": "Password123@",
  "countryCode": "+91",
  "clientPlatform": "WEB"
}
```
- **Success Response (200 OK):**
```json
{
  "code": 1200,
  "message": "Logged in successfully.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI...",
    "user": {
      "_id": "67b34a12c8e312a0f8...",
      "phone": "9829012345",
      "email": "rohan@example.com",
      "role": 6,
      "activeProfileId": "67b34a12c8e312a0f9...",
      "onboardingStep": 4,
      "isOnboardingComplete": true
    },
    "profile": {
      "_id": "67b34a12c8e312a0f9...",
      "name": "Rohan Advani",
      "gender": "MALE",
      "subcaste": "Bhaiband",
      "age": 29,
      "status": "ACTIVE",
      "membershipTier": "FREE",
      "verificationBadge": "NOT_SUBMITTED"
    }
  },
  "error": false
}
```

---

### 4.4 Forgot Password (Send OTP)
Password bhool jane par registered mobile number par OTP bhejna.

- **Method & Route:** `POST /api/v1/auth/forgot-password`  
- **Access:** Public
- **Request Body:**
```json
{
  "phone": "9829012345",
  "countryCode": "+91"
}
```

---

### 4.5 Reset Password (Verify OTP & Set New Password)
OTP verify karke naya password set karna.

- **Method & Route:** `POST /api/v1/auth/reset-password`  
- **Access:** Public
- **Request Body:**
```json
{
  "phone": "9829012345",
  "otp": "123456",
  "newPassword": "NewSecretPassword123@",
  "countryCode": "+91"
}
```
      "_id": "67b34a12c8e312a0f8...",
      "phone": "9876543210",
      "role": "MEMBER"
    },
    "profile": {
      "_id": "67b34a12c8e312a0f9...",
      "name": "Rohan Advani",
      "gender": "MALE",
      "subcaste": "Bhaiband"
    }
  },
  "error": false
}
```

---

### 4.6 Resend Registration OTP
- **Method & Route:** `POST /api/v1/auth/resend-otp`  
  *(Legacy alias: `POST /api/v1/auth/reSendOtp`)*
- **Access:** Public
- **Request Body:**
```json
{
  "phone": "9829012345",
  "countryCode": "+91",
  "purpose": "REGISTER"
}
```
- **Success Response (200 OK):**
```json
{
  "code": "OK",
  "message": "OTP has been resent successfully.",
  "data": { "phone": "9829012345" },
  "error": false
}
```

---

### 4.7 Check Phone Registered
Registration screen par instant typing check ke liye (Redis/MongoDB index).

- **Method & Route:** `POST /api/v1/auth/check-phone`
- **Access:** Public
- **Request Body:**
```json
{
  "phone": "9829012345",
  "countryCode": "+91"
}
```
- **Success Response (200 OK):**
```json
{
  "code": "OK",
  "message": "Phone number is available for registration.",
  "data": {
    "phone": "9829012345",
    "exists": false
  },
  "error": false
}
```

---

### 4.8 Logout & Token Blacklist
Logged-in session ko invalidate karna aur Redis me JWT blacklist karna.

- **Method & Route:** `POST /api/v1/auth/logout`  
  *(Legacy alias: `POST /api/v1/auth/userLogout`)*
- **Access:** Private (Bearer JWT Required)
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Request Body:** `{}` (Empty JSON)
- **Success Response (200 OK):**
```json
{
  "code": "OK",
  "message": "User logged out successfully.",
  "data": null,
  "error": false
}
```

---

## 5. Multi-Profile & Family Delegation Module

Parent account ek hi mobile number se bete, beti ya khud ki profiles create, switch aur manage kar sakte hain.

### 5.1 List All My Managed Profiles
- **Method & Route:** `GET /api/v1/auth/my-profiles`  
  *(Alias: `GET /api/v1/auth/users/my-profiles`)*
- **Access:** Private (Bearer JWT Required)
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Success Response (200 OK):**
```json
{
  "code": "OK",
  "message": "Candidate profiles fetched successfully.",
  "data": {
    "activeProfileId": "67b34a12c8e312a0f9...",
    "profiles": [
      {
        "_id": "67b34a12c8e312a0f9...",
        "name": "Rohan Advani",
        "gender": "MALE",
        "profileFor": "MYSELF",
        "subcaste": "Bhaiband",
        "status": "ACTIVE",
        "isOwner": true
      }
    ]
  },
  "error": false
}
```

---

### 5.2 Create Secondary Profile Under Same Account
- **Method & Route:** `POST /api/v1/auth/profiles`  
  *(Alias: `POST /api/v1/auth/users/profiles`)*
- **Access:** Private (Bearer JWT Required)
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Request Body:**
```json
{
  "name": "Simran Advani",
  "profileFor": "DAUGHTER",
  "gender": "FEMALE",
  "subcaste": "Bhaiband",
  "dob": "1999-09-20",
  "maritalStatus": "NEVER_MARRIED",
  "height": 165,
  "education": "MBA Finance",
  "profession": "Financial Analyst",
  "annualIncome": 1200000,
  "city": "Mumbai",
  "state": "Maharashtra"
}
```
- **Success Response (200 OK):** Returns newly created secondary profile details.

---

### 5.3 Switch Active Profile Context
App me dusri profile switch karna aur naye profile context ke sath fresh JWT lena.

- **Method & Route:** `POST /api/v1/auth/switch-profile`  
  *(Alias: `POST /api/v1/auth/users/switch-profile`)*
- **Access:** Private (Bearer JWT Required)
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Request Body:**
```json
{
  "targetProfileId": "67b34a12c8e312a0f9..."
}
```
- **Success Response (200 OK):**
```json
{
  "code": "OK",
  "message": "Switched active profile context successfully.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "activeProfileId": "67b34a12c8e312a0f9...",
    "profile": {
      "_id": "67b34a12c8e312a0f9...",
      "name": "Simran Advani"
    }
  },
  "error": false
}
```

---

### 5.4 Update Profile Status (Active / Hide / Deactivate)
- **Method & Route:** `PATCH /api/v1/auth/users/profiles/:profileId/status`
- **Access:** Private (Owner Only)
- **Request Body:**
```json
{
  "status": "HIDDEN"
}
```
*(Options: `"ACTIVE"`, `"DEACTIVATED"`, `"HIDDEN"`)*

---

### 5.5 Grant Profile Access to Family Member
- **Method & Route:** `POST /api/v1/auth/users/profiles/:profileId/grants`
- **Access:** Private (Owner Only)
- **Request Body:**
```json
{
  "granteePhone": "9829012345",
  "accessRole": "CO_MANAGER",
  "relationshipToCandidate": "PARENT"
}
```
*(accessRole: `"OWNER"`, `"CO_MANAGER"`, `"VIEWER"`)*

---

### 5.6 List Active Profile Delegation Grants
- **Method & Route:** `GET /api/v1/auth/users/profiles/:profileId/grants`
- **Access:** Private

---

### 5.7 Revoke Family Delegation Grant
- **Method & Route:** `DELETE /api/v1/auth/users/profiles/:profileId/grants/:grantId`
- **Access:** Private (Owner Only)

---

### 5.8 Transfer Profile Ownership
Candidate ki profile uske khud ke phone number par permanent transfer karna.
- **Method & Route:** `POST /api/v1/auth/users/profiles/:profileId/transfer`
- **Access:** Private (Owner Only)
- **Request Body:**
```json
{
  "candidatePhone": "9829099999",
  "otp": "123456"
}
```

---

## 6. Candidate Profile Management Module

Base Path: `/api/v1/profile` *(ya `/api/v1/members`)*

### 6.1 Get My Profile (Full Hydrated Profile)
Logged-in candidate ki complete details, education, career, family, horoscope aur partner preferences fetch karna.

- **Method & Route:** `GET /api/v1/profile/me`  
  *(Alias: `GET /api/v1/members/me`)*
- **Access:** Private (Bearer JWT Required)
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Success Response (200 OK):**
```json
{
  "code": "OK",
  "message": "Candidate profile retrieved successfully.",
  "data": {
    "profile": {
      "_id": "67b34a12c8e312a0f9...",
      "name": "Rohan Advani",
      "gender": "MALE",
      "maritalStatus": "NEVER_MARRIED",
      "subcaste": "Bhaiband",
      "gotra": "Advani",
      "motherGotra": "Chhabria",
      "height": 178,
      "location": {
        "city": "Jaipur",
        "state": "Rajasthan",
        "country": "India",
        "nativePlace": "Ajmer"
      },
      "education": {
        "degree": "B.Tech",
        "field": "Computer Science",
        "college": "MNIT Jaipur"
      },
      "profession": {
        "occupation": "Software Engineer",
        "companyName": "Tech Corp",
        "annualIncome": 1800000,
        "currency": "INR"
      },
      "family": {
        "fatherName": "Rajesh Advani",
        "fatherOccupation": "Business",
        "familyType": "NUCLEAR"
      },
      "horoscope": {
        "nakshatra": "Rohini",
        "rashi": "Vrishabha",
        "charan": 2
      },
      "manglik": "NON_MANGLIK",
      "photos": []
    },
    "partnerPreference": {
      "ageMin": 22,
      "ageMax": 28,
      "heightMin": 155,
      "heightMax": 175,
      "subcastes": ["Bhaiband", "Sindhi"]
    }
  },
  "error": false
}
```

---

### 6.2 Update Basic Details
- **Method & Route:** `PUT /api/v1/profile/basic`
- **Access:** Private (Bearer JWT Required)
- **Request Body:**
```json
{
  "maritalStatus": "NEVER_MARRIED",
  "height": 178,
  "subcaste": "Bhaiband",
  "gotra": "Advani",
  "motherGotra": "Chhabria",
  "aboutMe": "Passionate software architect, fond of Sindhi cuisine and travel.",
  "location": {
    "city": "Jaipur",
    "state": "Rajasthan",
    "country": "India",
    "nativePlace": "Ajmer"
  }
}
```

---

### 6.3 Update Education & Profession
- **Method & Route:** `PUT /api/v1/profile/education-career`
- **Access:** Private (Bearer JWT Required)
- **Request Body:**
```json
{
  "education": {
    "degree": "B.Tech",
    "field": "Computer Science",
    "college": "MNIT Jaipur"
  },
  "profession": {
    "occupation": "Software Engineer",
    "companyName": "Tech Corp",
    "annualIncome": 1800000,
    "currency": "INR"
  }
}
```

---

### 6.4 Update Family Details
- **Method & Route:** `PUT /api/v1/profile/family`
- **Access:** Private (Bearer JWT Required)
- **Request Body:**
```json
{
  "family": {
    "fatherName": "Rajesh Advani",
    "fatherOccupation": "Business (Textiles)",
    "motherName": "Kavita Advani",
    "motherOccupation": "Homemaker",
    "brothersCount": 1,
    "sistersCount": 0,
    "familyType": "NUCLEAR",
    "familyValues": "MODERATE"
  }
}
```

---

### 6.5 Update Astro / Kundli Details
- **Method & Route:** `PUT /api/v1/profile/horoscope`
- **Access:** Private (Bearer JWT Required)
- **Request Body:**
```json
{
  "manglik": "NON_MANGLIK",
  "horoscope": {
    "nakshatra": "Rohini",
    "rashi": "Vrishabha",
    "charan": 2,
    "birthTime": "10:30 AM",
    "birthPlace": "Ajmer"
  }
}
```

---

### 6.6 Update Partner Preferences
- **Method & Route:** `PUT /api/v1/profile/partner-preferences`
- **Access:** Private (Bearer JWT Required)
- **Request Body:**
```json
{
  "ageMin": 22,
  "ageMax": 28,
  "heightMin": 155,
  "heightMax": 175,
  "maritalStatus": ["NEVER_MARRIED"],
  "subcastes": ["Bhaiband", "Sindhi", "Sahiti"],
  "manglikPreference": ["NON_MANGLIK", "DON_T_KNOW"],
  "preferredCities": ["Jaipur", "Mumbai", "Pune", "Ahmedabad"],
  "minAnnualIncome": 500000
}
```

---

### 6.7 Save Onboarding Step (Steps 1 to 7)
Registration ke baad 7-step onboarding progress save karne ke liye.

- **Method & Route:** `POST /api/v1/profile/onboarding/step`
- **Access:** Private (Bearer JWT Required)
- **Request Body:**
```json
{
  "step": 2,
  "data": {
    "subcaste": "Bhaiband",
    "gotra": "Advani",
    "motherGotra": "Chhabria"
  }
}
```
*Steps Reference:*
- `1`: Basic Info (dob, height, maritalStatus)
- `2`: Subcaste, Gotra, Cultural identity
- `3`: Education & Career
- `4`: Family Background
- `5`: Kundli & Horoscope
- `6`: Partner Preferences
- `7`: Profile Photos & Completion

---

### 6.8 Upload Profile Photo
- **Method & Route:** `POST /api/v1/profile/photos`
- **Access:** Private (Bearer JWT Required)
- **Request Body:**
```json
{
  "url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600",
  "isMain": true
}
```

---

### 6.9 Delete Profile Photo
- **Method & Route:** `DELETE /api/v1/profile/photos/:photoId`
- **Access:** Private (Bearer JWT Required)

---

## 7. Developer Telemetry & Profiler

Development mode me API performance aur mongoose queries trace karne ke liye.

### 7.1 Visual Performance Dashboard (HTML)
Browser me open karke API latency aur metrics dekhein:
- **URL:** `http://localhost:5000/dev/dashboard`
- **Method:** `GET`

### 7.2 Performance Metrics (JSON)
- **Method & Route:** `GET /api/v1/dev/metrics`
- **Access:** Public (Non-production only)

### 7.3 Reset Performance Metrics
- **Method & Route:** `DELETE /api/v1/dev/metrics`
- **Access:** Public (Non-production only)

---

## 8. Sindhi Master Data & Dropdowns Module (8 Live APIs)

Base Path: `/api/v1/master`  
Access: **Public (No JWT Token Required - Open for Registration & Landing Filters)**  
Performance: **Sub-2ms (In-Memory Precomputed with MD5 ETag Conditional Caching)**

### 8.0 Selective Dropdowns API via Query Parameters (`?select=...`)
Form ke particular step ke liye sirf specific dropdowns fetch karne ke liye (e.g. `subcastes,maritalStatuses,heights`). Isse payload size **< 0.5 KB** ho jata hai aur parsing instantaneous hoti hai!

- **Method & Route:** `GET /api/v1/master/dropdowns?select=subcastes,maritalStatuses,heights`
- **Aliases:** `GET /api/v1/master/bootstrap?select=...`
- **Access:** Public
- **Supported Query Parameters:**
  - `select`: Comma-separated keys (e.g. `subcastes,maritalStatuses,heights,diets,educationCategories,incomeSlabs,gotras,cities`)
  - `subcaste`: When selecting `gotras`, filters gotras belonging to this subcaste (e.g. `?select=gotras&subcaste=Bhaiband`)
  - `q` / `search`: Filters gotras or cities by prefix/search query (e.g. `?select=gotras&subcaste=Bhaiband&q=baj`)
- **Success Response (200 OK):**
```json
{
  "code": 1200,
  "message": "Requested dropdown options retrieved successfully.",
  "data": {
    "subcastes": [ ... ],
    "maritalStatuses": [ ... ],
    "heights": [ ... ]
  },
  "error": false
}
```

---

### 8.1 Unified Bootstrap Dropdowns Bundle (The One-Call Master API)
Frontend app ya web panel start hote hi saare static dropdowns ka data ek sath lene ke liye. ETag conditional caching support karta hai.

- **Method & Route:** `GET /api/v1/master/bootstrap`
- **Access:** Public
- **Headers:** `Content-Type: application/json`, `If-None-Match: <etag>` (optional)
- **Response Headers:** `ETag: "4c357e37591f8a5813cbf9efbf3521d7"`, `Cache-Control: public, max-age=86400`
- **Cache Hit (If-None-Match Matches):** `304 Not Modified` (< 0.5ms)
- **Success Response (200 OK):**
```json
{
  "code": 1200,
  "message": "Master dropdown configurations loaded successfully.",
  "data": {
    "subcastes": [
      { "id": "Bhaiband", "name": "Bhaiband", "description": "Historically international traders...", "historicalRegion": "Hyderabad (Sindh), Karachi" },
      { "id": "Amil", "name": "Amil", "description": "Historically scholars and executives...", "historicalRegion": "Hyderabad (Sindh)" }
    ],
    "sampradayas": [
      { "id": "SINDHI_HINDU", "label": "Sindhi Hindu / Sanatan Dharma" },
      { "id": "JHULELAL_PANTHI", "label": "Jhulelal / Varun Dev Upasak" }
    ],
    "profileFor": [
      { "id": "MYSELF", "label": "Myself" },
      { "id": "SON", "label": "Son" }
    ],
    "maritalStatuses": [
      { "id": "NEVER_MARRIED", "label": "Never Married" },
      { "id": "DIVORCED", "label": "Divorced" }
    ],
    "heights": [
      { "cm": 152, "label": "5 ft 0 in (152 cm)" },
      { "cm": 178, "label": "5 ft 10 in (178 cm)" }
    ],
    "diets": [
      { "id": "VEGETARIAN", "label": "Pure Vegetarian" },
      { "id": "EGGETARIAN", "label": "Eggetarian" }
    ],
    "educationCategories": [ ... ],
    "employmentSectors": [ ... ],
    "popularOccupations": [ ... ],
    "incomeSlabs": { "INR": [ ... ], "USD": [ ... ], "AED": [ ... ] },
    "diasporaCountries": [ ... ],
    "quickCities": [ ... ],
    "horoscope": { "manglikOptions": [ ... ], "raasOptions": [ ... ], "nakshatras": [ ... ] },
    "family": { "values": [ ... ], "types": [ ... ], "status": [ ... ] },
    "version": "1.0.0"
  },
  "error": false
}
```

---

### 8.2 Get Sindhi Subcastes
Sindhi subcastes ki list aur unke cultural historical background ke sath.

- **Method & Route:** `GET /api/v1/master/subcastes`
- **Access:** Public

---

### 8.3 Get Gotras & Nukh List
Subcaste ke basis par filtered ya prefix search ke sath Gotras list.

- **Method & Route:** `GET /api/v1/master/gotras`
- **Access:** Public
- **Query Params:** `?subcaste=Bhaiband&q=baj`
- **Success Response (200 OK):**
```json
{
  "code": 1200,
  "message": "Gotras list retrieved successfully.",
  "data": {
    "total": 1,
    "gotras": [
      { "gotra": "Bajaj", "subcaste": "Bhaiband", "exampleSurname": "Bajaj" }
    ]
  },
  "error": false
}
```

---

### 8.4 Smart Surname Auto-Detection Lookup
Candidate ka surname type karte hi automatically Subcaste aur Gotra recommend karta hai.

- **Method & Route:** `GET /api/v1/master/surnames/lookup?surname=Advani`
- **Access:** Public
- **Success Response (200 OK):**
```json
{
  "code": 1200,
  "message": "Matched Sindhi lineage for Advani: Subcaste Amil",
  "data": {
    "matched": true,
    "detectedSurname": "Advani",
    "recommendedSubcaste": "Amil",
    "recommendedGotra": "Advani",
    "suggestions": [ ... ]
  },
  "error": false
}
```

---

### 8.5 Get Education, Occupations & Income Slabs
Degrees list, employment sectors, popular occupations aur multi-currency income brackets.

- **Method & Route:** `GET /api/v1/master/occupations`
- **Access:** Public

---

### 8.6 Get Diaspora Countries
Global countries with high Sindhi population (India, UAE, USA, UK, Singapore, Spain, etc.).

- **Method & Route:** `GET /api/v1/master/locations/countries`
- **Access:** Public

---

### 8.7 Search Major Cities
City auto-complete search with Country and State filters.

- **Method & Route:** `GET /api/v1/master/locations/cities?country=India&state=Maharashtra&search=Ulhas`
- **Access:** Public

---

### 8.8 Get Horoscope & Astrology Reference
Manglik status options, 12 Moon Signs (Raas), and 27 Vedic Nakshatras.

- **Method & Route:** `GET /api/v1/master/horoscope`
- **Access:** Public

---

## 9. Mobile HomeScreen API Suite (10 Live APIs)

> **SLA:** `< 15ms` response time across 4G/5G mobile networks  
> **Caching:** Redis L2 Cache with in-memory L1 Map fallback (`120s TTL`)  
> **Crash-Less Guarantee:** Built-in fault tolerance ensures that if MongoDB or Redis is momentarily slow or disconnected, curated fallback data matching exact mobile UI interfaces is served immediately without any 500 error or crash.

### 9.1 Consolidated Mobile Home Feed (Single-Flight Master API)
Delivers all 12 visual sections of the React Native HomeScreen in a single network roundtrip.

- **Method & Route:** `GET /api/v1/dashboard/mobile-home`  
- **Route Alias:** `GET /api/v1/dashboard/home-feed` or `GET /api/v1/feed/home`  
- **Access:** Private (Candidate JWT) / Public Resilient Fallback  
- **Cache Strategy:** Redis key `cache:mobile-home:{userId}` (TTL 120s). Countdown timer to next midnight IST is calculated dynamically on every call.

#### Response Envelope:
```json
{
  "code": "OK",
  "message": "Mobile home feed retrieved successfully.",
  "data": {
    "profileTab": {
      "userId": "6ad3c0ff51bbaafbad99f39b",
      "name": "Naman",
      "matrimonyId": "SM4517087",
      "membershipStatus": "Free member",
      "activeMode": "REGULAR",
      "avatarUrl": "",
      "isVerified": true
    },
    "celebratingBanner": {
      "title": "Celebrating 26 Years of Trust",
      "subtitle": "Find your ideal Sindhi life partner with India's most trusted matrimony",
      "badge": "26 Years Milestone",
      "ctaText": "Upgrade Now",
      "ctaUrl": "/subscription"
    },
    "completeness": {
      "score": 84,
      "pendingCount": 1,
      "actions": [
        {
          "id": "photo",
          "title": "Add Photo(s)",
          "iconType": "photo",
          "completed": false,
          "href": "/profile/edit"
        }
      ]
    },
    "dailyRecommendations": {
      "countdown": {
        "hours": 14,
        "minutes": 22,
        "seconds": 18,
        "totalSeconds": 51738,
        "formatted": "14h : 22m : 18s"
      },
      "matchCount": 3,
      "items": [
        {
          "id": "rec_1",
          "name": "Dr. Simran Advani",
          "age": 25,
          "height": "5'3\"",
          "city": "Jaipur",
          "caste": "Bhaiband",
          "education": "MBBS / General Physician",
          "profession": "Doctor",
          "photoUrl": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80",
          "isSilhouette": false,
          "isVerified": true,
          "matchScore": 96,
          "badge": "96% Match",
          "matrimonyId": "SM4517088"
        }
      ]
    },
    "allMatches": {
      "matchCount": 497,
      "subtitle": "Matches matching your partner preference",
      "items": [
        {
          "id": "67b34a12c8e312a0f9000010",
          "name": "Riya Dubey",
          "age": 24,
          "height": "5'1\"",
          "city": "Lucknow",
          "caste": "Bhaiband",
          "education": "B.Tech / IT Professional",
          "profession": "Software Engineer",
          "photoUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
          "isSilhouette": false,
          "isVerified": true,
          "matrimonyId": "SM4486236"
        }
      ]
    },
    "planAdBanner": {
      "planName": "Silver - 1 month",
      "originalPrice": 1800,
      "discountedPrice": 990,
      "discountPercent": 45,
      "discountEndsInSeconds": 86400,
      "perks": [
        "View 25 verified phone numbers directly",
        "Unlimited messaging & chat conversations",
        "Detailed Vedic Horoscope & Kundli Milan",
        "Profile highlighted to 3X more matches"
      ]
    },
    "newMatches": {
      "matchCount": 17,
      "items": [
        {
          "id": "new_1",
          "name": "Roshni Chhabria",
          "age": 23,
          "height": "5'4\"",
          "city": "Pune",
          "caste": "Bhaiband",
          "profession": "Interior Designer",
          "photoUrl": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop&q=80",
          "joinedDaysAgo": "Joined 2 days ago",
          "isVerified": true,
          "matrimonyId": "SM4517091"
        }
      ]
    },
    "assistedServiceBanner": {
      "title": "Assisted Service Luxury",
      "subtitle": "Find matches 3X faster with a dedicated Relationship Manager",
      "badge": "Personalized VIP Service",
      "benefits": [
        "Dedicated Matchmaker handpicks curated profiles",
        "Facilitates family introductions & meetings",
        "100% Confidential and background-verified"
      ],
      "ctaText": "Explore Assisted",
      "ctaUrl": "/subscription?plan=assisted"
    },
    "whoViewedYou": {
      "count": 10,
      "items": [
        {
          "id": "viewed_you_1",
          "name": "Mehek Hinduja",
          "age": 25,
          "height": "5'3\"",
          "city": "Delhi",
          "caste": "Amil",
          "profession": "Software Engineer",
          "photoUrl": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80",
          "viewedAt": "Today, 10:15 AM",
          "viewCount": 3,
          "matrimonyId": "SM4517094"
        }
      ]
    },
    "profilesYouViewed": {
      "count": 27,
      "items": [
        {
          "id": "you_viewed_1",
          "name": "Riya Dubey",
          "age": 24,
          "height": "5'1\"",
          "city": "Lucknow",
          "profession": "Software Engineer",
          "photoUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
          "viewedAt": "Today, 09:30 AM",
          "matrimonyId": "SM4486236"
        }
      ]
    },
    "limcaRecordBanner": {
      "title": "Limca Book of Records",
      "subtitle": "Officially recognized for facilitating the maximum number of documented marriages",
      "statText": "Over 2.8 Lakh+ Happy Sindhi Marriages",
      "trustRating": "4.9 / 5"
    },
    "successStories": {
      "count": 3,
      "items": [
        {
          "id": "story_1",
          "coupleName": "Saravana sharma & Srinika",
          "postedOn": "14 Oct 2026",
          "storySnippet": "I was looking for a partner who will understand me and stand by my side through all phases of life.",
          "imageUrl": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80",
          "badge": "Just Married",
          "city": "Mumbai"
        }
      ]
    },
    "footerSupport": {
      "weddingPlatform": {
        "title": "SindhiMatrimony Wedding Services",
        "subtitle": "Plan your dream wedding with 2.8 Lakh+ verified vendors across India",
        "vendorCount": "2.8 Lakh+",
        "categories": [
          { "name": "Venues", "icon": "home" },
          { "name": "Photographers", "icon": "camera" },
          { "name": "Catering", "icon": "coffee" },
          { "name": "Bridal Wear", "icon": "heart" }
        ]
      },
      "customerSupport": {
        "title": "Need help finding a match?",
        "phone": "+91 98765 43210",
        "formattedPhone": "+91-9876543210",
        "whatsapp": "+91 98765 43210",
        "whatsappUrl": "https://wa.me/919876543210?text=Hello%20SindhiMatrimony%20Support",
        "email": "support@sindhimatrimony.co.in",
        "workingHours": "9:00 AM to 8:00 PM (Mon - Sun)",
        "tollFree": "1800-419-6287",
        "helpCenterUrl": "https://sindhimatrimony.co.in/help"
      }
    }
  },
  "error": false
}
```

---

### 9.2 Daily Recommendations Feed
Fetches the current candidate's daily curated matches carousel alongside the dynamic countdown until tomorrow's refresh.

- **Method & Route:** `GET /api/v1/dashboard/daily-recommendations`
- **Access:** Private / Public (Resilient)
- **Response Data:**
  ```json
  {
    "code": "OK",
    "message": "Daily recommendations retrieved successfully.",
    "data": {
      "countdown": {
        "hours": 14,
        "minutes": 22,
        "seconds": 18,
        "totalSeconds": 51738,
        "formatted": "14h : 22m : 18s"
      },
      "matchCount": 3,
      "items": [ ... ]
    },
    "error": false
  }
  ```

---

### 9.3 All Matches Paginated Feed
Fetches the full matching candidates feed with support for optional query filtering (caste, city, age bracket).

- **Method & Route:** `GET /api/v1/dashboard/all-matches`
- **Query Parameters:**
  - `page` *(optional, default: 1)*
  - `limit` *(optional, default: 10, max: 50)*
  - `caste` *(optional, e.g. `Bhaiband`)*
  - `city` *(optional, e.g. `Jaipur`)*
  - `minAge` *(optional, e.g. `21`)*
  - `maxAge` *(optional, e.g. `28`)*
- **Response Data:**
  ```json
  {
    "code": "OK",
    "message": "All matches retrieved successfully.",
    "data": {
      "matchCount": 497,
      "page": 1,
      "limit": 10,
      "items": [ ... ]
    },
    "error": false
  }
  ```

---

### 9.4 New Matches Feed
Fetches candidates who have recently joined the platform (default within last 30 days) with relative `joinedDaysAgo` text.

- **Method & Route:** `GET /api/v1/dashboard/new-matches`
- **Query Parameters:**
  - `page` *(optional, default: 1)*
  - `limit` *(optional, default: 10)*
  - `maxDays` *(optional, default: 30)*
- **Response Data:**
  ```json
  {
    "code": "OK",
    "message": "New matches retrieved successfully.",
    "data": {
      "matchCount": 17,
      "page": 1,
      "limit": 10,
      "items": [
        {
          "id": "new_1",
          "name": "Roshni Chhabria",
          "age": 23,
          "height": "5'4\"",
          "city": "Pune",
          "caste": "Bhaiband",
          "profession": "Interior Designer",
          "photoUrl": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
          "joinedDaysAgo": "Joined 2 days ago",
          "isVerified": true,
          "matrimonyId": "SM4517091"
        }
      ]
    },
    "error": false
  }
  ```

---

### 9.5 Who Viewed You Feed
Fetches candidate profiles that have viewed the logged-in candidate's profile, including view timestamps and cumulative view count.

- **Method & Route:** `GET /api/v1/dashboard/who-viewed-you`
- **Access:** Private (Candidate JWT)
- **Query Parameters:** `page=1&limit=10`
- **Response Data:**
  ```json
  {
    "code": "OK",
    "message": "Who viewed you retrieved successfully.",
    "data": {
      "count": 10,
      "page": 1,
      "limit": 10,
      "items": [
        {
          "id": "67b34a12c8e312a0f9000010",
          "name": "Mehek Hinduja",
          "age": 25,
          "height": "5'3\"",
          "city": "Delhi",
          "caste": "Amil",
          "profession": "Software Engineer",
          "photoUrl": "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
          "viewedAt": "Today, 10:15 AM",
          "viewCount": 3,
          "matrimonyId": "SM4517094"
        }
      ]
    },
    "error": false
  }
  ```

---

### 9.6 Profiles You Viewed Feed
Fetches candidates that the logged-in user has viewed, with human-readable relative timestamps.

- **Method & Route:** `GET /api/v1/dashboard/profiles-you-viewed`
- **Access:** Private (Candidate JWT)
- **Query Parameters:** `page=1&limit=10`
- **Response Data:**
  ```json
  {
    "code": "OK",
    "message": "Profiles you viewed retrieved successfully.",
    "data": {
      "count": 27,
      "page": 1,
      "limit": 10,
      "items": [
        {
          "id": "67b34a12c8e312a0f9000010",
          "name": "Riya Dubey",
          "age": 24,
          "height": "5'1\"",
          "city": "Lucknow",
          "profession": "Software Engineer",
          "photoUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
          "viewedAt": "Today, 09:30 AM",
          "matrimonyId": "SM4486236"
        }
      ]
    },
    "error": false
  }
  ```

---

### 9.7 Track Profile View (Real-Time Upsert & Cache Invalidation)
Triggered whenever a candidate taps or opens another candidate's profile in the mobile app. Atomically updates the database and immediately invalidates the home feed Redis cache for both candidates.

- **Method & Route:** `POST /api/v1/dashboard/profile-views/track`
- **Access:** Private (Candidate JWT)
- **Request Body:**
  ```json
  {
    "viewedProfileId": "67b34a12c8e312a0f9000010",
    "viewedUserId": "67b34a12c8e312a0f9000020"
  }
  ```
- **Response Data:**
  ```json
  {
    "code": "OK",
    "message": "Profile view tracked successfully.",
    "data": {
      "tracked": true,
      "viewedProfileId": "67b34a12c8e312a0f9000010",
      "viewedAt": "2026-10-19T02:00:00.000Z"
    },
    "error": false
  }
  ```

---

### 9.8 Wedding Success Stories Feed
Fetches verified testimonials of happy Sindhi couples married via SindhiMatrimony.

- **Method & Route:** `GET /api/v1/dashboard/success-stories`
- **Access:** Public / Private
- **Query Parameters:** `page=1&limit=10`
- **Response Data:**
  ```json
  {
    "code": "OK",
    "message": "Success stories retrieved successfully.",
    "data": {
      "count": 3,
      "page": 1,
      "limit": 10,
      "items": [
        {
          "id": "story_1",
          "coupleName": "Saravana sharma & Srinika",
          "postedOn": "14 Oct 2026",
          "storySnippet": "I was looking for a partner who will understand me and stand by my side through all phases of life.",
          "imageUrl": "https://images.unsplash.com/photo-1610030469983-98e550d6193c",
          "badge": "Just Married",
          "city": "Mumbai"
        }
      ]
    },
    "error": false
  }
  ```

---

### 9.9 Promotional & Trust Banners Feed
Fetches all active marketing, upgrade, and social proof banners for the mobile app.

- **Method & Route:** `GET /api/v1/dashboard/banners`
- **Access:** Public / Private
- **Response Data:**
  ```json
  {
    "code": "OK",
    "message": "Home banners retrieved successfully.",
    "data": {
      "celebratingBanner": {
        "title": "Celebrating 26 Years of Trust",
        "subtitle": "Find your ideal Sindhi life partner with India's most trusted matrimony",
        "badge": "26 Years Milestone",
        "ctaText": "Upgrade Now",
        "ctaUrl": "/subscription"
      },
      "planAdBanner": {
        "planName": "Silver - 1 month",
        "originalPrice": 1800,
        "discountedPrice": 990,
        "discountPercent": 45,
        "discountEndsInSeconds": 86400,
        "perks": [ ... ]
      },
      "assistedServiceBanner": {
        "title": "Assisted Service Luxury",
        "subtitle": "Find matches 3X faster with a dedicated Relationship Manager",
        "badge": "Personalized VIP Service",
        "benefits": [ ... ],
        "ctaText": "Explore Assisted",
        "ctaUrl": "/subscription?plan=assisted"
      },
      "limcaRecordBanner": {
        "title": "Limca Book of Records",
        "subtitle": "Officially recognized for facilitating the maximum number of documented marriages",
        "statText": "Over 2.8 Lakh+ Happy Sindhi Marriages",
        "trustRating": "4.9 / 5"
      }
    },
    "error": false
  }
  ```

---

### 9.10 Customer Support & Wedding Platform Directory
Fetches direct customer support contacts, WhatsApp link, operational hours, and wedding directory metadata.

- **Method & Route:** `GET /api/v1/dashboard/support-info`
- **Access:** Public / Private
- **Response Data:**
  ```json
  {
    "code": "OK",
    "message": "Support info retrieved successfully.",
    "data": {
      "weddingPlatform": {
        "title": "SindhiMatrimony Wedding Services",
        "subtitle": "Plan your dream wedding with 2.8 Lakh+ verified vendors across India",
        "vendorCount": "2.8 Lakh+",
        "categories": [
          { "name": "Venues", "icon": "home" },
          { "name": "Photographers", "icon": "camera" },
          { "name": "Catering", "icon": "coffee" },
          { "name": "Bridal Wear", "icon": "heart" }
        ]
      },
      "customerSupport": {
        "title": "Need help finding a match?",
        "phone": "+91 98765 43210",
        "formattedPhone": "+91-9876543210",
        "whatsapp": "+91 98765 43210",
        "whatsappUrl": "https://wa.me/919876543210?text=Hello%20SindhiMatrimony%20Support",
        "email": "support@sindhimatrimony.co.in",
        "workingHours": "9:00 AM to 8:00 PM (Mon - Sun)",
        "tollFree": "1800-419-6287",
        "helpCenterUrl": "https://sindhimatrimony.co.in/help"
      }
    },
    "error": false
  }
  ```

---

## 10. Enums & Cultural Constants Reference

### Sindhi Subcastes Enum
`"Bhaiband"`, `"Amil"`, `"Sahiti"`, `"Larkano"`, `"Shikarpuri"`, `"Dadu"`, `"Sakhar"`, `"Thattai"`, `"Sindhi"`, `"Other"`

### Marital Status Enum
`"NEVER_MARRIED"`, `"DIVORCED"`, `"WIDOWED"`, `"AWAITING_DIVORCE"`, `"ANNULLED"`

### Manglik Status Enum
`"MANGLIK"`, `"NON_MANGLIK"`, `"ANSHIK_MANGLIK"`, `"DON_T_KNOW"`

### Relationship (`profileFor`) Enum
`"MYSELF"`, `"SON"`, `"DAUGHTER"`, `"BROTHER"`, `"SISTER"`, `"FRIEND"`, `"RELATIVE"`

### Multi-Profile Access Role Enum
`"OWNER"`, `"CO_MANAGER"`, `"VIEWER"`

---

## 11. Upcoming & Pending APIs Blueprint (31 In Pipeline)


Ye wo 31 critical APIs hain jo system ko full-fledged enterprise matrimony platform banayengi aur sabhi APIs **Sub-25ms response time** target ke liye optimize ki jayengi.

### 9.1 Phase 1: Search, Discovery & Matchmaking (7 APIs)
*Database Strategy: Compound Indexes on `{ gender: 1, isDeleted: 1, subcaste: 1, "profileDetails.dob": -1 }` with Redis Cache.*

1. **Daily Smart Feed / Recommendations**
   - **Route:** `GET /api/v1/matchmaking/feed`
   - **Access:** Private
   - **Target Latency:** `< 20ms` (Cached per profile in Redis for 4 hours)
   - **Query Params:** `?page=1&limit=20`
   - **Description:** User ke `partnerPreferences` (age, height, subcaste, gotra exclusion, education, income) ke basis par top scored profiles return karta hai.

2. **Advanced Multi-Criteria Search**
   - **Route:** `POST /api/v1/matchmaking/search`
   - **Access:** Private
   - **Target Latency:** `< 25ms`
   - **Request Body:**
     ```json
     {
       "subcaste": ["Bhaiband", "Amil"],
       "gotraNot": ["Advani"],
       "ageMin": 24,
       "ageMax": 29,
       "heightMin": 160,
       "heightMax": 185,
       "maritalStatus": ["NEVER_MARRIED"],
       "manglik": ["NON_MANGLIK", "ANSHIK_MANGLIK"],
       "annualIncomeMin": 1000000,
       "city": ["Mumbai", "Pune", "Jaipur", "Dubai"],
       "photoOnly": true,
       "cursor": null,
       "limit": 20
     }
     ```

3. **Homepage Quick Search Strip**
   - **Route:** `GET /api/v1/matchmaking/quick-search`
   - **Access:** Public / Private
   - **Target Latency:** `< 15ms`
   - **Query Params:** `?subcaste=Bhaiband&ageMin=22&ageMax=28&photoOnly=true`

4. **Profile Visitors / Who Viewed My Profile**
   - **Route:** `GET /api/v1/matchmaking/viewed-my-profile`
   - **Access:** Private
   - **Target Latency:** `< 15ms`

5. **Shortlist / Bookmark Candidate**
   - **Route:** `POST /api/v1/matchmaking/shortlist/:candidateId`
   - **Access:** Private
   - **Target Latency:** `< 10ms`
   - **Request Body:** `{ "action": "ADD" }` or `{ "action": "REMOVE" }`

6. **Get My Shortlisted Candidates**
   - **Route:** `GET /api/v1/matchmaking/shortlist`
   - **Access:** Private
   - **Target Latency:** `< 15ms`

7. **Mutual Matches (Two-Way Compatibility)**
   - **Route:** `GET /api/v1/matchmaking/mutual-matches`
   - **Access:** Private
   - **Target Latency:** `< 25ms`

---

### 9.2 Phase 2: Connect Requests & Interests (6 APIs)
*Strategy: Optimistic UI updates with BullMQ async notifications.*

1. **Send Interest / Connect Request**
   - **Route:** `POST /api/v1/matchmaking/interests/send`
   - **Access:** Private
   - **Target Latency:** `< 15ms`
   - **Request Body:**
     ```json
     {
       "receiverProfileId": "67b34a12c8e312a0f9000001",
       "personalizedNote": "Namaste, we liked your profile for our son/myself. Please accept if interested."
     }
     ```

2. **Accept Interest**
   - **Route:** `PUT /api/v1/matchmaking/interests/:interestId/accept`
   - **Access:** Private
   - **Target Latency:** `< 15ms`

3. **Decline Interest**
   - **Route:** `PUT /api/v1/matchmaking/interests/:interestId/decline`
   - **Access:** Private
   - **Target Latency:** `< 10ms`

4. **Get Received Interests (Pending / Accepted / Declined Tabs)**
   - **Route:** `GET /api/v1/matchmaking/interests/received?status=PENDING&page=1&limit=20`
   - **Access:** Private
   - **Target Latency:** `< 15ms`

5. **Get Sent Interests**
   - **Route:** `GET /api/v1/matchmaking/interests/sent?status=ALL&page=1&limit=20`
   - **Access:** Private
   - **Target Latency:** `< 15ms`

6. **Interests Real-Time Badge Count**
   - **Route:** `GET /api/v1/matchmaking/interests/badge-count`
   - **Access:** Private
   - **Target Latency:** `< 5ms` (Redis HGET counter)

---

### 9.3 Phase 3: Sindhi Master Data & Dropdowns (4 APIs)
*Strategy: Stored in Redis memory with HTTP Cache Headers (ETag / Max-Age 24h).*

1. **Get Sindhi Subcastes**
   - **Route:** `GET /api/v1/master/subcastes`
   - **Access:** Public
   - **Target Latency:** `< 5ms`

2. **Get Sindhi Gotras & Nukh List**
   - **Route:** `GET /api/v1/master/gotras?subcaste=Bhaiband`
   - **Access:** Public
   - **Target Latency:** `< 5ms`

3. **Get Occupations & Educational Qualifications**
   - **Route:** `GET /api/v1/master/occupations`
   - **Access:** Public
   - **Target Latency:** `< 5ms`

4. **Get Cities & NRI Diasporas (Dubai, USA, Spain, UK, etc.)**
   - **Route:** `GET /api/v1/master/locations`
   - **Access:** Public
   - **Target Latency:** `< 5ms`

---

### 9.4 Phase 4: Chat, Messaging & Contact Unlocking (5 APIs)

1. **View / Unlock Candidate Verified Phone & WhatsApp**
   - **Route:** `POST /api/v1/members/view-contact/:candidateId`
   - **Access:** Private
   - **Target Latency:** `< 20ms` (Atomically decrements contact view credits)

2. **Check Remaining Contact View Credits**
   - **Route:** `GET /api/v1/profile/contact-credits`
   - **Access:** Private
   - **Target Latency:** `< 10ms`

3. **Get Active Conversations List**
   - **Route:** `GET /api/v1/chat/conversations`
   - **Access:** Private
   - **Target Latency:** `< 15ms`

4. **Get Chat Message History (Cursor Pagination)**
   - **Route:** `GET /api/v1/chat/messages/:conversationId?beforeMessageId=...&limit=30`
   - **Access:** Private
   - **Target Latency:** `< 15ms`

5. **Mark Conversation Messages as Read**
   - **Route:** `PUT /api/v1/chat/messages/read`
   - **Access:** Private
   - **Target Latency:** `< 10ms`
   - **Request Body:** `{ "conversationId": "..." }`

---

### 9.5 Phase 5: Kundli & Horoscope Matching (2 APIs)

1. **Calculate Guna Milan (36 Points Vedic Compatibility)**
   - **Route:** `POST /api/v1/horoscope/guna-milan`
   - **Access:** Private
   - **Target Latency:** `< 30ms` (Algorithmic or cached)
   - **Request Body:** `{ "partnerProfileId": "67b34a12c8e312a0f9000001" }`

2. **Get Candidate Kundli & Planetary Chart**
   - **Route:** `GET /api/v1/horoscope/chart/:candidateId`
   - **Access:** Private
   - **Target Latency:** `< 15ms`

---

### 9.6 Phase 6: Trust, Safety & Verifications (4 APIs)

1. **Upload Identity Proof (Aadhaar / Passport / Voter ID)**
   - **Route:** `POST /api/v1/verifications/id-proof`
   - **Access:** Private
   - **Target Latency:** `< 100ms` (Cloud upload)
   - **Request Body:** `{ "docType": "AADHAAR", "docUrl": "...", "idNumberMasked": "XXXX-XXXX-1234" }`

2. **Report Suspicious or Fake Profile**
   - **Route:** `POST /api/v1/safety/report`
   - **Access:** Private
   - **Target Latency:** `< 15ms`
   - **Request Body:** `{ "reportedProfileId": "...", "reason": "FAKE_PROFILE", "description": "..." }`

3. **Block Candidate (Instant Removal from Feeds & Search)**
   - **Route:** `POST /api/v1/safety/block`
   - **Access:** Private
   - **Target Latency:** `< 10ms`
   - **Request Body:** `{ "blockedProfileId": "..." }`

4. **Get Blocked Candidates List & Unblock**
   - **Route:** `GET /api/v1/safety/blocked-list`
   - **Access:** Private
   - **Target Latency:** `< 15ms`

---

### 9.7 Phase 7: Plans, Subscriptions & Payments (3 APIs)

1. **Get Membership Plans & Feature Matrix**
   - **Route:** `GET /api/v1/plans`
   - **Access:** Public
   - **Target Latency:** `< 5ms`

2. **Create Payment Order (Razorpay / Cashfree)**
   - **Route:** `POST /api/v1/payments/create-order`
   - **Access:** Private
   - **Target Latency:** `< 50ms`
   - **Request Body:** `{ "planId": "PLAN_GOLD_3_MONTHS", "currency": "INR" }`

3. **Payment Webhook (Instant Plan & Credit Activation)**
   - **Route:** `POST /api/v1/payments/webhook`
   - **Access:** Public (Webhook Signature Verified)
   - **Target Latency:** `< 20ms`

---

### 9.8 Phase 8: Notifications & Push Alerts (4 APIs)

1. **Get Notifications Feed**
   - **Route:** `GET /api/v1/notifications?page=1&limit=20`
   - **Access:** Private
   - **Target Latency:** `< 15ms`

2. **Get Unread Notification Count Badge**
   - **Route:** `GET /api/v1/notifications/unread-count`
   - **Access:** Private
   - **Target Latency:** `< 5ms`

3. **Mark Notifications as Read**
   - **Route:** `PUT /api/v1/notifications/mark-read`
   - **Access:** Private
   - **Target Latency:** `< 10ms`
   - **Request Body:** `{ "notificationId": "ALL" }`

4. **Register Mobile Device Token for Push (FCM / APNs)**
   - **Route:** `POST /api/v1/notifications/fcm-token`
   - **Access:** Private
   - **Target Latency:** `< 10ms`
   - **Request Body:** `{ "token": "fcm_token_device_abc...", "platform": "ANDROID" }`

---
*Document automatically compiled for the Sindhi Matrimony Core Engineering Team.*

