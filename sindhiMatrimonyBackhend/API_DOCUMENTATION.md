# 💍 Sindhi Matrimony - Active Backend APIs Documentation

> **Status:** Live & Implemented in Backend Codebase  
> **Base URL (Local):** `http://localhost:5000`  
> **API Version Prefix:** `/api/v1`  
> **Full Base API:** `http://localhost:5000/api/v1`  
> **Testing HTTP Client File:** [`api_requests.http`](file:///Users/naman/Documents/CRM%20Landing%20Projects/Matrimony%20Project/sindhiMatrimonyBackhend/api_requests.http)

---

## 📌 Table of Contents
1. [Global Conventions & Response Format](#1-global-conventions--response-format)
2. [Quick Developer Testing Notes (Master OTP)](#2-quick-developer-testing-notes)
3. [System & Health APIs](#3-system--health-apis)
4. [Authentication & Account Module](#4-authentication--account-module)
5. [Multi-Profile & Family Delegation Module](#5-multi-profile--family-delegation-module)
6. [Candidate Profile Management Module](#6-candidate-profile-management-module)
7. [Developer Telemetry & Profiler (Dev Only)](#7-developer-telemetry--profiler)
8. [Enums & Cultural Constants Reference](#8-enums--cultural-constants-reference)

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

### 4.1 Send OTP
Login ya Register ke liye candidate ke phone number par OTP bhejna.

- **Method & Route:** `POST /api/v1/auth/send-otp`  
  *(Legacy alias: `POST /api/v1/auth/sendOtp` ya `POST /api/v1/auth/users/send-otp`)*
- **Access:** Public
- **Rate Limit:** 5 requests per 10 minutes per IP/Phone
- **Request Body:**
```json
{
  "phone": "9876543210",
  "countryCode": "+91",
  "purpose": "LOGIN"
}
```
*Note: `purpose` can be `"LOGIN"`, `"REGISTER"`, or `"RESET_PASSWORD"`.*
- **Success Response (200 OK):**
```json
{
  "code": "OK",
  "message": "OTP has been sent successfully to your mobile number.",
  "data": {
    "phone": "9876543210",
    "countryCode": "+91",
    "isExistingUser": true,
    "purpose": "LOGIN"
  },
  "error": false
}
```
- **Error (409 Conflict):** Agar `purpose: "REGISTER"` hai aur number already exist karta hai.

---

### 4.2 Verify OTP & Login
OTP verify karke JWT access token aur profile context prapt karna.

- **Method & Route:** `POST /api/v1/auth/verify-otp`  
  *(Legacy alias: `POST /api/v1/auth/login` ya `POST /api/v1/auth/users/verify-otp`)*
- **Access:** Public
- **Request Body:**
```json
{
  "phone": "9876543210",
  "otp": "123456",
  "countryCode": "+91",
  "clientPlatform": "WEB",
  "fcmToken": "optional_firebase_push_token"
}
```
- **Success Response (200 OK):**
```json
{
  "code": "OK",
  "message": "OTP verified successfully. Welcome to Sindhi Matrimony!",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI...",
    "user": {
      "_id": "67b34a12c8e312a0f8...",
      "phone": "9876543210",
      "role": "MEMBER",
      "status": "ACTIVE",
      "activeProfileId": "67b34a12c8e312a0f9..."
    },
    "profile": {
      "_id": "67b34a12c8e312a0f9...",
      "name": "Rohan Advani",
      "gender": "MALE",
      "subcaste": "Bhaiband",
      "avatar": ""
    }
  },
  "error": false
}
```

---

### 4.3 Complete Registration & Profile Creation
Naya user account banana + candidate profile & partner preference document banana.

- **Method & Route:** `POST /api/v1/auth/register`  
  *(Alias: `POST /api/v1/auth/users/register`)*
- **Access:** Public
- **Request Body:**
```json
{
  "phone": "9876543210",
  "otp": "123456",
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
- **Success Response (200 OK / 201 Created):**
```json
{
  "code": "OK",
  "message": "Registration completed successfully.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "refreshToken": "eyJhbGci...",
    "user": {
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

### 4.4 Resend OTP
- **Method & Route:** `POST /api/v1/auth/resend-otp`  
  *(Legacy alias: `POST /api/v1/auth/reSendOtp`)*
- **Access:** Public
- **Request Body:**
```json
{
  "phone": "9876543210",
  "countryCode": "+91",
  "purpose": "LOGIN"
}
```
- **Success Response (200 OK):**
```json
{
  "code": "OK",
  "message": "OTP has been resent successfully.",
  "data": { "phone": "9876543210" },
  "error": false
}
```

---

### 4.5 Check Phone Registered
Registration screen par instant typing check ke liye (Redis/MongoDB index).

- **Method & Route:** `POST /api/v1/auth/check-phone`
- **Access:** Public
- **Request Body:**
```json
{
  "phone": "9876543210",
  "countryCode": "+91"
}
```
- **Success Response (200 OK):**
```json
{
  "code": "OK",
  "message": "Phone number is available for registration.",
  "data": {
    "phone": "9876543210",
    "exists": false
  },
  "error": false
}
```

---

### 4.6 Logout & Token Blacklist
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

## 8. Enums & Cultural Constants Reference

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
*Document automatically compiled for the Sindhi Matrimony Core Engineering Team.*
