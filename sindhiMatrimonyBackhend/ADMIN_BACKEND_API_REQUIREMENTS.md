# 🛡️ Admin Panel Backend API Requirement Document
## Sindhi Matrimony Platform — Unified Backend Architecture & API Specification

> **Target Backend Service:** `sindhiMatrimonyBackhend` (Node.js, Express, TypeScript, MongoDB Atlas, Redis, Socket.io)  
> **Client Applications:**
> 1. **Admin Portal:** `sindiMatrimonyAdmin` (React + Vite + Tailwind CSS)
> 2. **User Web App:** `sindhiMatrimonyUserPanel` (Next.js App Router)
> 3. **Mobile App:** `sindhiMatrimony` (React Native for Android & iOS)
> 
> **Architectural Mandate:** One common RESTful API (`/api/v1`) shared across Admin, Web, and Mobile wherever functionality is shared (Authentication, Profiles, Preferences, Matches, Membership Plans, Payments, Notifications, Master Data, Reviews, Success Stories). Admin-specific operations use strictly protected endpoints with backend-enforced Role-Based Access Control (RBAC).

---

## 📑 Table of Contents
1. [Global Architecture & API Conventions](#1-global-architecture--api-conventions)
   - [1.5 Payload Minimization (Kam Data = Fast Response)](#15-payload-minimization--high-performance-response-standards-kam-data--fast-response)
   - [1.6 Maximal API Unification (80/20 Shared Mandate)](#16-maximal-api-unification--shared-route-mandate-the-8020-rule)
   - [1.7 Mandatory Reusable Functions & Zero Boilerplate](#17-mandatory-reusable-functions--zero-boilerplate-rule-dry-principle)
   - [1.8 Ultra-Lean Controllers & fast-deep-equal Memoization](#18-ultra-lean-controllers-concurrent-asyncawait--smart-mutation-memoization-fast-deep-equal--etag-304)
   - [1.9 Multi-Scenario GET Optimization & isDataEqual Blueprint (The 7 Critical Read Scenarios)](#19-multi-scenario-get-optimization--isdataequal-blueprint-the-7-critical-read-scenarios)
2. [Security, Authentication & RBAC Engine](#2-security-authentication--rbac-engine)
3. [Module 01: Authentication & Session Management](#module-01-authentication--session-management)
4. [Module 02: Dashboard & Executive KPI Analytics](#module-02-dashboard--executive-kpi-analytics)
5. [Module 03: CRM Leads Management & Allocation Engine](#module-03-crm-leads-management--allocation-engine)
6. [Module 04: Members Directory & Profile 360 Desk](#module-04-members-directory--profile-360-desk)
7. [Module 05: Assisted Matchmaking & Response Clearinghouse](#module-05-assisted-matchmaking--response-clearinghouse)
8. [Module 06: Vedic Horoscope & Ashtakoota Kundli Milan](#module-06-vedic-horoscope--ashtakoota-kundli-milan)
9. [Module 07: Verification & KYC Moderation Desk](#module-07-verification--kyc-moderation-desk)
10. [Module 08: Telephony & Call Interaction Audit Desk](#module-08-telephony--call-interaction-audit-desk)
11. [Module 09: Staff Team Chat & Real-Time Collaboration](#module-09-staff-team-chat--real-time-collaboration)
12. [Module 10: Finance, Ledger & Refund Management](#module-10-finance-ledger--refund-management)
13. [Module 11: Subscription & Membership Plans Management](#module-11-subscription--membership-plans-management)
14. [Module 12: Employee Directory, RBAC & 360 Workspace](#module-12-employee-directory-rbac--360-workspace)
15. [Module 13: Tasks, Follow-ups & SLA Scheduler](#module-13-tasks-follow-ups--sla-scheduler)
16. [Module 14: Campaigns, Marketing & In-App Popups](#module-14-campaigns-marketing--in-app-popups)
17. [Module 15: Trust, Safety & Abuse Moderation Desk](#module-15-trust-safety--abuse-moderation-desk)
18. [Module 16: Success Stories & Vivah Registry](#module-16-success-stories--vivah-registry)
19. [Module 17: Reviews & Ratings Desk](#module-17-reviews--ratings-desk)
20. [Module 18: Master Data Management (Castes, Subcastes, Gotras, Surnames)](#module-18-master-data-management-castes-subcastes-gotras-surnames)
21. [Module 19: System Diagnostics & Maintenance Tools](#module-19-system-diagnostics--maintenance-tools)
22. [Module 20: Help & Direct Support Clearinghouse](#module-20-help--direct-support-clearinghouse)
23. [Module 21: Audit Logs & Security Compliance Desk](#module-21-audit-logs--security-compliance-desk)
24. [Module 22: Offline-First Synchronization Engine & WatermelonDB Architecture](#module-22-offline-first-synchronization-engine--watermelondb-architecture)
25. [Module 23: Mobile App (sindhiMatrimony React Native) Client API Specification](#module-23-mobile-app-sindhimatrimony-react-native-client-api-specification)
26. [API Reuse Matrix (Cross-Platform Common vs Admin-Only)](#25-api-reuse-matrix-cross-platform-common-vs-admin-only)
27. [Final API Inventory & Implementation Roadmap](#26-final-api-inventory--implementation-roadmap)

---

## 1. Global Architecture & API Conventions

### 1.1 Base URLs and Protocol
- **API Base URL:** `https://api.sindhimatrimony.com/api/v1`
- **WebSocket Gateway:** `wss://api.sindhimatrimony.com/socket.io`
- **Transport Security:** Strict TLS 1.3 only, HSTS preloaded (`max-age=31536000; includeSubDomains`).
- **Data Encoding:** JSON (`application/json; charset=utf-8`) for standard payloads; `multipart/form-data` for file uploads (photos, KYC documents, ad banners).

### 1.2 Standard HTTP Headers
Every request must include:
```http
Authorization: Bearer <accessToken>
X-Client-Platform: ADMIN_PORTAL | USER_WEB | MOBILE_APP_ANDROID | MOBILE_APP_IOS
X-Client-Version: 1.0.0
X-Request-Id: <uuidv4>
Content-Type: application/json
```

### 1.3 Standard Response Envelope
All API endpoints return a predictable, unified JSON envelope matching the enterprise `apiHTTPResponse()` specification (modeled on `mymelemo-backend`). Every single response strictly standardizes on numeric `"code"` (HTTP integer code: `200`, `201`, `400`, `401`, `403`, `404`, `422`, `500`), boolean `"error"`, `"message"`, `"data"`, and `"meta"`, **without any `"success"` key**:

#### Success Envelope (200 OK / 201 Created)
```json
{
  "code": 200,
  "error": false,
  "message": "Operation completed successfully.",
  "data": { ... },
  "meta": {
    "requestId": "req_8f149b10-21a4-4df1-8789-98e3b1c6d123",
    "timestamp": "2026-10-15T12:00:00.000Z",
    "pagination": {
      "page": 1,
      "limit": 25,
      "total": 1420,
      "totalPages": 57,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

#### Error Envelope (4xx / 5xx)
```json
{
  "code": 422,
  "error": true,
  "message": "The request body failed schema validation.",
  "data": null,
  "details": [
    {
      "field": "subcaste",
      "message": "Subcaste is required for Sindhi matrimony registration."
    }
  ],
  "meta": {
    "requestId": "req_8f149b10-21a4-4df1-8789-98e3b1c6d123",
    "timestamp": "2026-10-15T12:00:00.000Z"
  }
}
```

### 1.4 Standard Status Codes
| HTTP Status | Numeric `code` | Constant Name | Description |
|:---|:---:|:---|:---|
| `200 OK` | `200` | `CONSTANTS.HTTP_OK` | Successful GET/PUT/PATCH operation |
| `201 Created` | `201` | `CONSTANTS.HTTP_CREATED` | Successful entity creation |
| `400 Bad Request` | `400` | `CONSTANTS.HTTP_BAD_REQUEST` | Malformed JSON or invalid parameter syntax |
| `401 Unauthorized` | `401` | `CONSTANTS.HTTP_UNAUTHORIZED` | Missing, expired, or invalid JWT Bearer token |
| `403 Forbidden` | `403` | `CONSTANTS.HTTP_FORBIDDEN` | Role or permissions do not allow accessing this resource |
| `404 Not Found` | `404` | `CONSTANTS.HTTP_NOT_FOUND` | Entity with specified ID does not exist |
| `409 Conflict` | `409` | `CONSTANTS.HTTP_CONFLICT` | Unique constraint violation (e.g. duplicate phone/email) |
| `422 Unprocessable` | `422` | `CONSTANTS.HTTP_UNPROCESSABLE_ENTITY` | Business rule failed or field validation error |
| `429 Too Many Req` | `429` | `CONSTANTS.HTTP_TOO_MANY_REQUESTS` | API rate limit exceeded (leaky bucket algorithm) |
| `500 Server Error` | `500` | `CONSTANTS.HTTP_INTERNAL_SERVER_ERROR` | Unexpected backend runtime fault (logged to Pino/Sentry) |

### 1.5 Payload Minimization & High-Performance Response Standards (Kam Data = Fast Response)
To guarantee lightning-fast sub-40ms response times and prevent high latency or mobile app stutters:
1. **Zero Over-Fetching (Selective Field Projection):**
   - All listing, search, and table APIs (`/list`, `/search`, `/feed`) must use Mongoose `.select()` to return **only the 6–8 visible fields** required for cards/rows.
   - Heavy nested data (complete horoscope charts, full bio, multi-page notes, audit trails) must **never** be included in list responses.
2. **Strict Separation of List vs Detail APIs:**
   - List View: Returns lightweight summary cards (`_id`, `name`, `age`, `city`, `subcaste`, `avatarUrl`, `status`).
   - Detail View (`GET /:id`): Fetches the complete document only when an administrative staff or candidate explicitly taps/clicks into a specific profile.
3. **Mandatory Mongoose `.lean()`:**
   - Every read-only query must invoke `.lean()`. This strips Mongoose change-tracking, getters, setters, and virtual methods, producing raw JSON that serializes **4x to 5x faster** with 70% lower RAM utilization.
4. **Hard-Capped Pagination (`page`, `limit`):**
   - Default page size: 10 or 20 records.
   - Maximum allowed limit: Strictly locked at **50 records per page** via Joi validation (`limit: requiredNumber(1, 50)`). Requests requesting excessive records are rejected immediately.
5. **Cursor Pagination for Infinite Feeds:**
   - Mobile recommendation feeds and chat history use Keyset Cursor Pagination (`{ _id: { $lt: lastCursorId } }`), ensuring consistent $O(1)$ query speed regardless of scroll depth.
6. **Network Wire Compression:**
   - Express Gzip/Brotli compression middleware (`compression()`) is active on all endpoints, shrinking JSON payloads over the network by 75–85%.

### 1.6 Maximal API Unification & Shared Route Mandate (The 80/20 Rule)
> 🛑 **MANDATORY ARCHITECTURAL PRINCIPLE: ZERO DUPLICATE APIS**  
> *"Admin, User Web, aur Mobile App ke liye alag-alag redundant APIs nahi banengi. Jitni APIs same ho sakti hain, utni maximum same rahengi."*  

1. **The 80/20 Unified API Distribution:**
   - **~80% Common Shared APIs:** Master Dropdowns, Authentication & OTP, Candidate Search, Matches Recommendations, Connection Interests, 36-Guna Kundli Milan, Membership Plans, Razorpay Payment Orders, Real-time Chat, Notifications, Success Stories, and Support info are **100% IDENTICAL** across Mobile App (`sindhiMatrimony`), User Web (`sindhiMatrimonyUserPanel`), and Admin CRM (`sindiMatrimonyAdmin`).
   - **~20% Admin-Exclusive APIs:** Only workflows fundamentally restricted to internal staff (Lead allocation, Employee RBAC permissions, Refund approvals, Telephony VoIP bridge, and Server maintenance) reside under protected `/api/v1/admin/*` namespaces.
2. **Role-Aware Smart Controllers:**
   - Instead of building duplicate endpoints (e.g. `/admin/profile/:id` vs `/user/profile/:id`), controllers inspect `req.auth.role`:
     - If caller is `ADMIN` $\rightarrow$ returns administrative fields (internal CRM notes, assigned staff, KYC documents, raw contact).
     - If caller is `USER` (Candidate) $\rightarrow$ returns public sanitized card details with privacy-masked contacts.
     - **Engineering Outcome:** 1 route, 1 controller, 1 database query, zero code duplication.
3. **Architectural Benefits:**
   - Single source of truth: A backend bug fix or schema update instantly benefits Mobile, Web, and Admin simultaneously.
   - Redis RAM caching is centralized, eliminating cache fragmentation across multiple duplicate endpoints.
   - Drastically simplifies API documentation and frontend team integration.

### 1.7 Mandatory Reusable Functions & Zero Boilerplate Rule (Inspect-First & DRY Mandate)
> 🛑 **MANDATORY CODING RULE (INSPECT-FIRST REUSABILITY MANDATE):**  
> *"Jab bhi hum koi function ya code write karein, to pehle yeh observe karein ki already kahin par same ya similar code likha hua hai kya. Agar haan, ya agar yeh multiple jagah use ho sakta hai, to uska centralized reusable function banao (`utils/globalFunction.js` ya `services/crudService.js`) aur hamesha clean non-blocking `async/await` se manage karo."*

All repeated calculations, security operations, and business logic are extracted into centralized reusable functions in `utils/globalFunction.js` and `services/crudService.js`:
- `apiHTTPResponse(req, res, ...)`: Universal standard JSON response envelope.
- `asyncHandler(fn)`: Express async wrapper eliminating repetitive `try/catch` boilerplate.
- `isDataEqual(existing, incoming)`: Fast delta comparison via `fast-deep-equal` for zero-write memoization.
- `hashPassword(password)` / `verifyPassword(password, hash)`: Reusable Bcrypt hashing using async threads.
- `generateOTP(length = 6)`: Secure numeric OTP generator.
- `calculateAge(dob)`: Universal age calculation from birth date.
- `calculateProfileCompleteness(profile)`: Dynamic 0–100% profile score generator based on weighted criteria.
- `maskPhoneNumber(phone)` / `maskEmail(email)`: Candidate data privacy masking (`+91 98****3210`).
- `addTimeStamp()`: Mongoose schema soft-delete (`isDeleted`, `isDisable`) and timestamp defaults.
- `formatCurrencyINR(amount)`: Standard Indian rupee number formatting.
- `crudService.getPaginatedList(Model, options)`: Reusable pagination, search, selective projection, and `.lean()` query engine.

### 1.8 Ultra-Lean Controllers, Concurrent Async/Await, & Smart Mutation Memoization (`fast-deep-equal` + ETag 304)
> 🛑 **MANDATORY PERFORMANCE RULE: MINIMAL CODE, CONCURRENT I/O & ZERO-WRITE MEMOIZATION**  
> *"Controllers aur routes me bilkul kam code ho. Async/await ko parallel (`Promise.all`) execute karein, aur agar incoming update data same ho to database write skip karke purana response turant 2ms me de dein."*

1. **Ultra-Lean "Skinny Controllers" Pattern:**
   - Routes purely declare the URL path, middleware guards, and Joi validator (1 declarative line).
   - Controllers contain no raw SQL, business loops, or direct database queries; they extract parameters, delegate to domain services, and return `apiHTTPResponse()`.
   - Controllers are wrapped in an `asyncHandler` higher-order function, completely eliminating 8–10 lines of repetitive `try/catch` boilerplate per endpoint.
2. **Concurrent `Promise.all` Async Execution:**
   - Sequential awaits (`await count; await list;`) are strictly banned for independent operations.
   - Independent database operations, counts, Redis lookups, and third-party checks must execute concurrently via `Promise.all()`, reducing endpoint latency by ~50%.
3. **No-Op Mutation Skip via `fast-deep-equal`:**
   - When a client issues a `PUT` or `PATCH` mutation (e.g. updating profile basic details, partner preferences, or system settings), the backend compares the sanitized incoming delta against the existing record using `fast-deep-equal`.
   - If `isDataEqual(existingDoc, newPayload) === true`:
     - **Database Write Skipped:** Zero MongoDB write locks, zero disk I/O, zero index re-computations.
     - **Immediate 2ms Response:** Returns the existing data immediately with `200 OK` and `"No changes detected / Updated successfully"`.
4. **ETag & HTTP 304 Not Modified Caching:**
   - Heavy read endpoints (`/common/dropdowns`, `/plans`, `/feed/home`) generate a weak ETag based on document `updatedAt` / content hash.
   - If the client's `If-None-Match` matches the server ETag, Express immediately returns `304 Not Modified` with **zero bytes of body payload**, rendering instantaneously on mobile & web.
5. **Guaranteed Full Data Contract (Same Data Always Returned to Frontend):**
   - > 🛑 **FRONTEND DATA INTEGRITY GUARANTEE:** *"Chahe data same ho ya cached ho, API ke return me frontend ko hamesha poora data milega."*
   - **Repeated Screen Navigation (`GET /profile/:id`):** When a user views a profile, navigates back, and re-opens the profile, the API returns **HTTP 200 OK with the complete profile object** in `data: { ... }`. Under the hood, this is served directly from **Redis RAM in 1ms**, completely bypassing MongoDB disk reads.
   - **No-Op Form Submissions (`PUT /profile/:id`):** When a user taps Save without modifying fields, the API returns **HTTP 200 OK with the complete existing document** in `data: { ... }`. Under the hood, MongoDB write locks and disk writes are skipped via `isDataEqual()`.
   - **Frontend Safety:** Redux Toolkit Query, React Native state, and Next.js UI **never receive null or partial payloads**. The UI never flickers empty and never breaks.

#### 6. Concrete Implementation Blueprint:
```javascript
// Example: Ultra-Lean, Concurrent & Memoized Controller Pattern
import { asyncHandler, apiHTTPResponse, isDataEqual } from "../../utils/globalFunction.js";
import crudService from "../../services/crudService.js";
import * as CONSTANTS from "../../utils/constants.js";
import * as CONSTANTS_MSG from "../../utils/constantsMessage.js";
import { User, MemberProfile } from "../../models/index.js";
import redisClient from "../../config/redis.js";

// 1. Ultra-Lean Listing (Clean 3-line controller)
export const getMembersList = asyncHandler(async (req, res) => {
  const result = await crudService.getPaginatedList(MemberProfile, req.body, req.recordScope);
  return apiHTTPResponse(req, res, CONSTANTS.HTTP_OK, CONSTANTS_MSG.FETCH_SUCCESS, result, CONSTANTS.OK, CONSTANTS.ERROR_FALSE);
});

// 2. High-Performance Repeated Fetch (Profile Screen Back <-> Forward Navigation)
// Frontend ko HAMESHA pura data milega (200 OK); Backend serves from Redis RAM in 1ms!
export const getMemberProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const cacheKey = `cache:profile:${id}`;

  // ⚡ Check Redis RAM first (1ms)
  const cachedProfile = await redisClient.get(cacheKey);
  if (cachedProfile) {
    const parsedData = JSON.parse(cachedProfile);
    // Return complete data object to frontend
    return apiHTTPResponse(req, res, CONSTANTS.HTTP_OK, CONSTANTS_MSG.FETCH_SUCCESS, parsedData, CONSTANTS.OK, CONSTANTS.ERROR_FALSE);
  }

  // Fallback to MongoDB if not in cache, then cache for 1 hour
  const profile = await MemberProfile.findById(id).lean();
  if (!profile) {
    return apiHTTPResponse(req, res, CONSTANTS.HTTP_NOT_FOUND, CONSTANTS_MSG.DATA_NOT_FOUND, CONSTANTS.DATA_NULL, CONSTANTS.NOT_FOUND);
  }

  await redisClient.setEx(cacheKey, 3600, JSON.stringify(profile));
  return apiHTTPResponse(req, res, CONSTANTS.HTTP_OK, CONSTANTS_MSG.FETCH_SUCCESS, profile, CONSTANTS.OK, CONSTANTS.ERROR_FALSE);
});

// 3. Concurrent I/O with Promise.all
export const getMemberOverview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const [profile, activeInterests, matchScore] = await Promise.all([
    MemberProfile.findById(id).select("fullName age city subcaste avatarUrl").lean(),
    crudService.countDocuments("Interest", { receiverId: id, status: "PENDING" }),
    crudService.getKundliMatchScore(req.auth.id, id),
  ]);
  return apiHTTPResponse(req, res, CONSTANTS.HTTP_OK, CONSTANTS_MSG.FETCH_SUCCESS, { profile, activeInterests, matchScore }, CONSTANTS.OK, CONSTANTS.ERROR_FALSE);
});

// 4. Smart Mutation Memoization via fast-deep-equal (Zero-Write 2ms Return)
// Frontend ko HAMESHA pura data wapas milega; DB write skipped if data is identical!
export const updatePartnerPreferences = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const newPreferences = req.body;

  const currentProfile = await MemberProfile.findById(id).select("partnerPreferences").lean();
  if (!currentProfile) {
    return apiHTTPResponse(req, res, CONSTANTS.HTTP_NOT_FOUND, CONSTANTS_MSG.DATA_NOT_FOUND, CONSTANTS.DATA_NULL, CONSTANTS.NOT_FOUND);
  }

  // ⚡ ZERO-WRITE CHECK: Skip DB write if payload is identical, return complete current data!
  if (isDataEqual(currentProfile.partnerPreferences, newPreferences)) {
    return apiHTTPResponse(req, res, CONSTANTS.HTTP_OK, "No changes detected. Preferences already up to date.", currentProfile, CONSTANTS.OK, CONSTANTS.ERROR_FALSE);
  }

  const updatedProfile = await MemberProfile.findByIdAndUpdate(id, { $set: { partnerPreferences: newPreferences } }, { new: true }).lean();
  
  // Invalidate Redis profile cache so fresh data is loaded
  await redisClient.del(`cache:profile:${id}`);

  return apiHTTPResponse(req, res, CONSTANTS.HTTP_OK, CONSTANTS_MSG.UPDATE_SUCCESS, updatedProfile, CONSTANTS.OK, CONSTANTS.ERROR_FALSE);
});
```

### 1.9 Multi-Scenario GET Optimization & `isDataEqual` Blueprint (The 7 Critical Read Scenarios)

> 🛑 **MANDATORY SYSTEM-WIDE RULE: ELIMINATE REDUNDANT DATABASE READS & SCREEN RE-RENDERS**  
> *"Sirf profile hi nahi, poore system me 7 critical read scenarios hote hain jahan user baar-baar `GET` request call karta hai. Har scenario me caching aur `isDataEqual` ka use hoga taaki database par zero load rahe aur frontend 120 FPS par bina flicker chale."*

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│              7 CRITICAL READ SCENARIOS & DATA EQUALITY COMPARISON MATRIX               │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 1. DETAIL SCREENS    │ Client sends `?lastUpdatedAt=...` or `If-None-Match`.           │
│    (Profile/Lead)    │ Backend uses `isDataEqual` on timestamp. Returns 200 with data  │
│                      │ from Redis RAM in 1ms! MongoDB disk read = 0.                  │
├──────────────────────┼─────────────────────────────────────────────────────────────────┤
│ 2. MASTER DROPDOWNS  │ Client sends `?version=1.0.4`. If `isDataEqual(server, client)` │
│    (Castes/Gotras)   │ returns memoized bundle immediately. Zero DB aggregation.       │
├──────────────────────┼─────────────────────────────────────────────────────────────────┤
│ 3. MATCHES FEEDS     │ Feeds cached in Redis per user tab (`user:feed:id:tab`).        │
│    (Daily / Kundli)  │ If no new candidate approved, returns memoized list in 2ms.     │
├──────────────────────┼─────────────────────────────────────────────────────────────────┤
│ 4. CHAT HISTORY      │ Client sends `?lastMessageTimestamp=...`. If `isDataEqual`,     │
│    (Messages List)   │ returns `{ hasNew: false, messages: [] }`. Skips 50-msg DB scan.│
├──────────────────────┼─────────────────────────────────────────────────────────────────┤
│ 5. CRM LEAD BUCKETS  │ CRM tabs (`MY_BUCKET`, `SLA_BREACH`) checked via bucket checksum│
│    (Admin Tables)    │ in Redis. Repeated clicks return in 2ms.                       │
├──────────────────────┼─────────────────────────────────────────────────────────────────┤
│ 6. NOTIFICATION      │ In-memory Redis counter (`user:unread:${id}`).                  │
│    BADGE COUNTER     │ NEVER runs `Notification.countDocuments()` on MongoDB. 0.5ms!   │
├──────────────────────┼─────────────────────────────────────────────────────────────────┤
│ 7. MOBILE FRONTEND   │ When API responds, React Native runs `isDataEqual(old, new)`.   │
│    (React Native UI) │ If equal, skips React re-render. Screen stays 120 FPS smooth!   │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

#### Detailed Scenario Blueprints:

1. **Scenario 1: Detailed Screen Navigation Back $\leftrightarrow$ Forward (`GET /profile/:id`, `GET /leads/:id`):**
   - **Problem:** User views profile, presses back, taps profile again.
   - **Backend Solution:** Client passes `If-None-Match` header or `?lastUpdatedAt=1734500000`.
   - **Execution:** Backend checks `isDataEqual(new Date(profile.updatedAt).getTime(), Number(clientLastUpdatedAt))`.
   - **Result:** If equal, returns `HTTP 200 OK` with full data from **Redis RAM in 1ms** with meta flag `{ isModified: false }`. Full data is guaranteed; zero MongoDB query.

2. **Scenario 2: Static / Slow-Changing Master Dropdowns (`GET /common/dropdowns`):**
   - **Problem:** Subcastes, Gotras, Surnames, and Membership Plans change once a month, but are called every app launch.
   - **Backend Solution:** Redis holds `system:master_data_version: "1.0.4"`.
   - **Execution:** Client sends `GET /common/dropdowns?version=1.0.4`. If `isDataEqual(serverVersion, clientVersion)` is true, return memoized JSON bundle.
   - **Result:** Saves 100% of MongoDB collection scans and saves ~80 KB per app launch.

3. **Scenario 3: Matches & Candidate Recommendations (`GET /matches/recommendations`):**
   - **Problem:** User switches between `All Matches`, `Kundli Matches`, and `Verified` tabs.
   - **Backend Solution:** Redis caches calculated candidate ID arrays per user: `cache:feed:${userId}:${tab}` (TTL: 30 minutes).
   - **Execution:** If no new profile matching the user's partner preferences was approved by Admin since cache creation, the pre-ranked feed is served from Redis in **2ms**.

4. **Scenario 4: Chat & Conversation History (`GET /chat/messages/:conversationId`):**
   - **Problem:** User opens a chat conversation, goes back to message list, and re-opens the chat.
   - **Backend Solution:** Client passes `?lastMessageTimestamp=1734536000000`.
   - **Execution:** Controller checks if `conversation.lastMessageAt <= clientLastMessageTimestamp`. If `isDataEqual(lastMessageAt, clientTimestamp)`, backend returns `{ hasNew: false, messages: [] }`.
   - **Result:** Skips querying and sorting 50 chat messages from MongoDB Atlas.

5. **Scenario 5: Admin CRM Lead Buckets & Telecaller Tables (`GET /leads/admin`):**
   - **Problem:** Telecallers switch between `UNASSIGNED`, `MY_BUCKET`, and `OVERDUE_SLA` every few seconds.
   - **Backend Solution:** Redis maintains a 60-second micro-cache bucket key: `cache:leads:bucket:${staffId}:${tab}`.
   - **Execution:** If staff hasn't updated or reallocated leads, the table renders from Redis in 2ms.

6. **Scenario 6: Notification Badge & Unread Counters (`GET /notifications/unread-count`):**
   - **Problem:** Mobile app checks notification counter on every app resume or tab switch.
   - **Backend Solution:** MongoDB `countDocuments()` is strictly forbidden here.
   - **Execution:** Redis maintains an integer counter: `user:unread_notifications:${userId}`. On new push, Redis executes `INCR`. On screen view, Redis executes `SET 0`.
   - **Result:** Response served in **0.5ms** with zero database load.

7. **Scenario 7: Client-Side (React Native / Next.js) `isDataEqual` Re-render Suppression:**
   - **Problem:** Even if API returns in 5ms, updating React state triggers component re-render, screen re-paint, and micro-flickers.
   - **Frontend Solution:**
     ```typescript
     // sindhiMatrimony Mobile Client State Manager
     import equal from "fast-deep-equal";

     export const handleProfileResponse = (currentProfile, apiResponse) => {
       // ⚡ Check equality on Mobile device
       if (equal(currentProfile, apiResponse.data)) {
         // Data is identical: Skip setState, keep 120 FPS UI intact!
         return;
       }
       // Only trigger React re-render when actual delta exists
       setProfile(apiResponse.data);
     };
     ```

---

## 2. Security, Authentication & RBAC Engine

### 2.1 Unified Authentication Model
The system uses **one authentication engine** for all client platforms:
- **JWT Access Token:** Short-lived (15 minutes), HMAC-SHA256, contains `{ sub: userId, role, scope, permissions, platform }`.
- **JWT Refresh Token:** Long-lived (7 days for Admin, 30 days for Web/Mobile), stored in Redis with revocation capability on force logout.
- **Two-Factor Authentication (MFA/TOTP):** Mandatory for `SUPER_ADMIN` and `FINANCE_MANAGER` roles.

### 2.2 System Roles Definition
Supported administrative roles discovered from `src/types/auth.types.ts` and `src/utils/rbac.ts`:
1. `SUPER_ADMIN`: Unrestricted system access, employee provisioning, role assignment, "View as Employee" preview, security keys.
2. `ADMIN`: Full operational access across leads, members, campaigns, verification, settings.
3. `CRM_MANAGER`: Lead pool oversight, bulk assignment, reassignments, SLA alerts, employee load balancing.
4. `CRM_AGENT`: Operates only within `OWN` or `ASSIGNED` leads/clients, calls, follow-up scheduling.
5. `FINANCE_MANAGER`: Approve/reject refund requests, financial reconciliation, gateway configuration.
6. `FINANCE_STAFF`: View transactions, view invoices, raise refund requests.
7. `MODERATOR`: Photo review, Aadhaar KYC approval/rejection, abuse report investigation.
8. `AD_MANAGER`: Creation, scheduling, targeting, and analytics of campaigns, festival offers, in-app popups.
9. `SUPPORT_AGENT`: Handles direct customer support tickets and client communication queries.
10. `ANALYST`: Read-only reporting, aggregate analytics, masked data exports.
11. `USER`: Normal public user accessing via mobile app or user web portal.

### 2.3 Record Scopes
Record visibility enforced at database query level:
- `ALL`: Can view/query all records across the platform.
- `OWN`: Can view/query only records created by or assigned to `req.user.id`.
- `ASSIGNED`: Matches records where `assignedEmployeeId === req.user.id`.
- `TEAM`: Can view records assigned to any employee in the same `teamId`.
- `REGION`: Can view records matching the employee's assigned geographic regions.

---

## Module 01: Authentication & Session Management

### 1. Module Overview
- **Name:** Authentication, Handshake & Session Lifecycle
- **Admin Screen:** `/login`, `/settings/password`
- **Actions Available:** Employee login with email/password, MFA step-2 TOTP verification, session handshake, token refreshing, change password, profile & permission recovery, force logout.

### 2. Required APIs
1. `POST /api/v1/auth/login` (Shared across platforms — handles User & Admin login).
2. `POST /api/v1/auth/verify-mfa` (Admin privileged roles MFA verification).
3. `POST /api/v1/auth/refresh-token` (Shared — silent token refresh).
4. `POST /api/v1/auth/logout` (Shared — session termination).
5. `GET /api/v1/auth/me` (Shared — fetches authenticated user profile and permissions).
6. `PUT /api/v1/auth/change-password` (Shared — user/employee password update).

### 3. Request Payloads

#### 3.1 `POST /api/v1/auth/login`
- **Type:** JSON
- **Shared API:** Yes (Role returned in payload differentiates Admin vs User).
```json
{
  "identifier": "rajesh.m@sindhimatrimony.com",
  "password": "StrongPassword123#",
  "platform": "ADMIN_PORTAL",
  "deviceId": "web-chrome-mac-uuid",
  "fcmToken": "optional-admin-fcm-token"
}
```
*Validation:* `identifier` required (valid email or E.164 phone); `password` required (min 8 chars); `platform` enum [`ADMIN_PORTAL`, `USER_WEB`, `MOBILE_APP`].

#### 3.2 `POST /api/v1/auth/verify-mfa`
- **Type:** JSON
- **Access Level:** Admin Only (Requires temp token from Step 1).
```json
{
  "tempToken": "eyJh...temp_session_token",
  "totpCode": "582910"
}
```
*Validation:* `tempToken` required JWT string; `totpCode` required 6-digit numeric string.

#### 3.3 `PUT /api/v1/auth/change-password`
- **Type:** JSON
- **Shared API:** Yes (Protected by JWT Bearer token).
```json
{
  "currentPassword": "OldPassword123#",
  "newPassword": "NewSecurePassword456$",
  "confirmPassword": "NewSecurePassword456$"
}
```
*Validation:* `newPassword` must differ from `currentPassword`, min 8 chars, at least 1 uppercase, 1 lowercase, 1 digit, 1 special character.

### 4. Response Structure

#### 4.1 Login Success (No MFA Required or after MFA verification)
- **Status:** `200 OK`
```json
{
  "code": 200,
  "error": false,
  "data": {
    "accessToken": "eyJh...15_min_jwt",
    "refreshToken": "eyJh...7_day_refresh_jwt",
    "expiresIn": 900,
    "user": {
      "id": "emp_001",
      "employeeId": "EMP001",
      "fullName": "Rajesh Mulchandani",
      "email": "rajesh.m@sindhimatrimony.com",
      "mobile": "+91 98200 11223",
      "role": "SUPER_ADMIN",
      "department": "Executive Management",
      "recordScope": "ALL",
      "permissions": {
        "leads": { "view": true, "assign": true, "export": true, "call": true },
        "members": { "view": true, "edit": true, "verify": true },
        "finance": { "view": true, "refund": true, "export": true },
        "ads": { "view": true, "create": true, "publish": true, "pause": true },
        "reports": { "view": true, "export": true },
        "chat": { "receive": true, "initiate": true, "viewHistory": true },
        "settings": { "manage": true }
      },
      "allowedSections": ["dashboard", "leads", "members", "matchmaking", "finance", "employees", "settings"],
      "isChatEnabled": true,
      "avatarUrl": "https://cdn.sindhimatrimony.com/avatars/emp_001.jpg"
    }
  },
  "message": "Authentication successful.",
  "meta": { "requestId": "req_01", "timestamp": "2026-10-15T12:00:00Z" }
}
```

#### 4.2 Login Step 1 — MFA Challenge
- **Status:** `200 OK`
```json
{
  "code": 200,
  "error": false,
  "data": {
    "requiresMFA": true,
    "tempToken": "eyJh...temp_handshake_jwt",
    "mfaType": "TOTP_AUTHENTICATOR",
    "message": "Enter the 6-digit verification code from your authenticator app."
  },
  "meta": { "requestId": "req_02", "timestamp": "2026-10-15T12:00:00Z" }
}
```

#### 4.3 Error — Invalid Credentials
- **Status:** `401 Unauthorized`
```json
{
  "code": "INVALID_CREDENTIALS",
  "error": true,
  "message": "Invalid email or password. 3 attempts remaining before account lock.",
  "data": null,
  "meta": { "requestId": "req_03", "timestamp": "2026-10-15T12:00:00Z" }
}
```

### 5. Pagination and Search
- Non-paginated auth endpoints.

### 6. Admin Permissions
- Login is unauthenticated; MFA verification requires valid temporary token.
- `PUT /api/v1/auth/change-password` requires valid JWT token for the authenticated caller.

### 7. Database Requirements
- Table/Collection: `employees` (or unified `users` with polymorphic discriminator).
- Required Fields: `email` (indexed unique), `mobile` (indexed unique), `passwordHash`, `role`, `department`, `recordScope`, `permissions` (JSON), `isActive` (boolean), `mfaSecret` (encrypted string), `failedLoginAttempts` (integer), `lockedUntil` (datetime).

### 8. Business Logic and Edge Cases
- Rate limiting: max 5 login attempts per 15 minutes per IP/Account. After 5 failed attempts, lock account for 30 minutes.
- When an employee is deactivated (`isActive: false`), all existing JWT access/refresh tokens in Redis must be immediately blacklisted.

---

## Module 02: Dashboard & Executive KPI Analytics

### 1. Module Overview
- **Name:** Dashboard & Executive KPI Analytics
- **Admin Screen:** `/` (DashboardScreen)
- **Actions Available:** View operational KPI stats cards, drill-down into filtered member lists, view real-time SLA monitored action queues, review registration bar chart and plan distribution donut chart, trigger verified members CSV backup.

### 2. Required APIs
1. `GET /api/v1/admin/dashboard/kpis` (Admin Only — role: `ANALYST+`).
2. `GET /api/v1/admin/dashboard/action-queues` (Admin Only — live counts of pending exceptions).
3. `GET /api/v1/admin/dashboard/charts/registrations` (Admin Only — registration trends).
4. `GET /api/v1/admin/dashboard/charts/revenue-distribution` (Admin Only — plan revenue breakup).
5. `GET /api/v1/admin/dashboard/recent-registrations` (Admin Only — recent verified/unverified signups).
6. `POST /api/v1/admin/dashboard/export-backup` (Admin Only — trigger asynchronous CSV profile backup).

### 3. Request Payloads

#### 3.1 `GET /api/v1/admin/dashboard/kpis`
- **Query Parameters:**
  - `datePreset`: `TODAY | 7_DAYS | 30_DAYS | 1_YEAR | ALL` (Default: `30_DAYS`)
  - `startDate`: ISO Date `2026-09-15` (optional)
  - `endDate`: ISO Date `2026-10-15` (optional)
  - `subcaste`: string (optional filter)

#### 3.2 `POST /api/v1/admin/dashboard/export-backup`
- **Type:** JSON
```json
{
  "exportScope": "VERIFIED_MEMBERS",
  "format": "CSV",
  "includeFields": ["uniqueId", "fullName", "subcaste", "city", "plan", "created"]
}
```

### 4. Response Structure

#### 4.1 `GET /api/v1/admin/dashboard/kpis`
- **Status:** `200 OK`
```json
{
  "code": 200,
  "error": false,
  "data": {
    "totalMembers": { "value": 39434, "growthPercentage": 12.4 },
    "maleMembers": { "value": 21840, "ratio": "55.4%" },
    "femaleMembers": { "value": 17594, "ratio": "44.6%" },
    "inactiveMembers": { "value": 1240, "actionRequired": true },
    "grossRevenueINR": { "value": 4850000, "formatted": "₹48.5 Lakhs" },
    "activePaidPlans": { "value": 4320, "growthPercentage": 8.1 },
    "marriageSuccessStories": { "value": 412, "verifiedCouples": true }
  },
  "meta": { "requestId": "req_dash_01", "timestamp": "2026-10-15T12:00:00Z" }
}
```

#### 4.2 `GET /api/v1/admin/dashboard/action-queues`
- **Status:** `200 OK`
```json
{
  "code": 200,
  "error": false,
  "data": {
    "queues": [
      {
        "id": "kyc_moderation",
        "title": "Photo & KYC Verification",
        "count": 18,
        "badgeText": "12 Urgent",
        "badgeColor": "bg-amber-100 text-amber-800",
        "description": "User uploaded Aadhaar cards, passport scans & profile photos awaiting moderator review.",
        "urgent": true,
        "actionRoute": "/verifications"
      },
      {
        "id": "abuse_reports",
        "title": "Trust & Safety / Abuse Reports",
        "count": 4,
        "badgeText": "High Severity",
        "badgeColor": "bg-rose-100 text-rose-800",
        "description": "User submitted extortion, fake profile or harassment reports requiring review.",
        "urgent": true,
        "actionRoute": "/safety"
      },
      {
        "id": "crm_exceptions",
        "title": "CRM SLA Breaches",
        "count": 7,
        "badgeText": "Overdue Contact",
        "badgeColor": "bg-purple-100 text-purple-800",
        "description": "Assigned leads where first contact time exceeded the 60-minute benchmark.",
        "urgent": false,
        "actionRoute": "/leads"
      },
      {
        "id": "marriage_offboarding",
        "title": "Vivah Registry / Offboarding",
        "count": 9,
        "badgeText": "Archive Pending",
        "badgeColor": "bg-emerald-100 text-emerald-800",
        "description": "Members married via platform pending profile archiving and success story publication.",
        "urgent": false,
        "actionRoute": "/success-stories"
      }
    ]
  },
  "meta": { "requestId": "req_dash_02", "timestamp": "2026-10-15T12:00:00Z" }
}
```

### 5. Pagination and Search
- KPI summaries and Action Queues are aggregated objects (No pagination).
- Recent Registrations endpoint supports pagination (`page=1&limit=10`).

### 6. Admin Permissions
- `ANALYST`, `ADMIN`, `SUPER_ADMIN` can access KPIs and charts.
- Exporting profile backups requires `ADMIN` or `SUPER_ADMIN` clearance.

### 7. Database Requirements
- Relies on MongoDB aggregation pipelines over `members`, `leads`, `abuse_reports`, and `payment_transactions`.
- Uses Redis caching with 60-second TTL to prevent repeated heavy aggregation scans.

### 8. Business Logic and Edge Cases
- All financial metrics must be calculated net of refunds.
- SLA breach count reflects leads with `status: 'ASSIGNED'` and `assignedAt < (now - 60 mins)` where `lastContactDate` is null.

---

## Module 03: CRM Leads Management & Allocation Engine

### 1. Module Overview
- **Name:** CRM Leads Management, Telephony & Auto-Assignment Engine
- **Admin Screen:** `/leads`
- **Actions Available:** Filter by buckets (`UNASSIGNED`, `MY_BUCKET`, `FOLLOW_UPS_TODAY`, `OVERDUE_SLA`, `CONVERTED`), search by name/phone/city, reveal unmasked phone number (permission-checked), assign single lead, batch-assign up to 20 leads using round-robin or balanced capacity, reassign lead with reason preset & handover notes, log call outcome directly.

### 2. Required APIs
1. `GET /api/v1/admin/leads` (Admin Only — paginated lead list with persona scoping).
2. `GET /api/v1/admin/leads/bucket-counts` (Admin Only — tab counter badges).
3. `GET /api/v1/admin/leads/:id` (Admin Only — full 360 lead details).
4. `POST /api/v1/leads` (Shared — incoming lead capture from website form, mobile app, or admin creation).
5. `POST /api/v1/admin/leads/assign` (Admin Only — single & bulk assignment).
6. `POST /api/v1/admin/leads/:id/reassign` (Admin Only — reassign with reason preset and handover notes).
7. `PUT /api/v1/admin/leads/:id/status` (Admin Only — update status).
8. `POST /api/v1/admin/leads/:id/reveal-contact` (Admin Only — logs audit trail before revealing masked phone).
9. `GET /api/v1/admin/leads/:id/activity-timeline` (Admin Only — chronological audit log of calls, notes, reassignment).

### 3. Request Payloads

#### 3.1 `GET /api/v1/admin/leads`
- **Query Parameters:**
  - `page`: integer (Default: `1`)
  - `limit`: integer (Default: `20`, Max: `100`)
  - `tab`: `UNASSIGNED | MY_BUCKET | ALL_LEADS | FOLLOW_UPS_TODAY | OVERDUE_SLA | CONVERTED`
  - `search`: string (query against leadId, name, phone, city)
  - `subcaste`: string (e.g. `Amil`, `Baibhand`, `Sahiti`)
  - `source`: `WEBSITE_FORM | MOBILE_APP | AD_CAMPAIGN | REFERRAL | EMPLOYEE_CREATED | CALLBACK_REQ`
  - `staffId`: string (employee ID filter)
  - `priority`: `LOW | MEDIUM | HIGH | URGENT`

#### 3.2 `POST /api/v1/admin/leads/assign`
- **Type:** JSON
- **Permissions:** `CRM_MANAGER`, `ADMIN`, `SUPER_ADMIN`
```json
{
  "leadIds": ["LD-1049", "LD-1050", "LD-1051"],
  "targetEmployeeId": "emp_003",
  "assignmentMethod": "MANUAL",
  "assignmentNote": "High-priority Sindhi business family leads allocated for morning follow-up."
}
```
*Validation:* `leadIds` array of strings (min 1, max 50); `targetEmployeeId` must be valid active employee; `targetEmployeeId` must have remaining `maxLeadCapacity`.

#### 3.3 `POST /api/v1/admin/leads/:id/reassign`
- **Type:** JSON
- **Permissions:** `CRM_MANAGER`, `ADMIN`, `SUPER_ADMIN`
```json
{
  "newEmployeeId": "emp_004",
  "reasonPreset": "STAFF_ON_LEAVE",
  "handoverNotes": "Candidate requested call back after 7 PM regarding Gold plan EMI options."
}
```
*Validation:* `newEmployeeId` required; `reasonPreset` enum [`STAFF_ON_LEAVE`, `PERFORMANCE_REBALANCE`, `LANGUAGE_SPECIALIST`, `CLIENT_ESCALATION`, `SCHEDULE_CONFLICT`]; `handoverNotes` optional string.

#### 3.4 `POST /api/v1/admin/leads/:id/reveal-contact`
- **Type:** JSON
- **Permissions:** Any authenticated staff with `leads.call` or `leads.view` permission
```json
{
  "reason": "Direct call required to verify parent availability for matrimonial conference."
}
```

### 4. Response Structure

#### 4.1 `GET /api/v1/admin/leads`
- **Status:** `200 OK`
```json
{
  "code": 200,
  "error": false,
  "data": {
    "leads": [
      {
        "id": "lead_1049",
        "leadId": "LD-1049",
        "name": "Kunal Advani",
        "mobile": "+91 98****3210",
        "email": "kunal.advani@example.com",
        "gender": "MALE",
        "age": 29,
        "city": "Mumbai",
        "subcaste": "Amil",
        "gotra": "Kashyap",
        "profession": "Investment Banker",
        "source": "WEBSITE_FORM",
        "priority": "HIGH",
        "status": "ASSIGNED",
        "assignedEmployeeId": "emp_003",
        "assignedEmployeeName": "Priya Sharma",
        "assignedTeam": "West India Matchmaking",
        "nextFollowUp": "2026-10-16T11:00:00.000Z",
        "slaStatus": "ON_TIME",
        "createdAt": "2026-10-15T09:30:00.000Z"
      }
    ]
  },
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 420,
      "totalPages": 21,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

#### 4.2 Contact Reveal Response
- **Status:** `200 OK`
```json
{
  "code": 200,
  "error": false,
  "data": {
    "leadId": "LD-1049",
    "unmaskedMobile": "+91 98765 43210",
    "maskedMobile": "+91 98****3210",
    "revealedAt": "2026-10-15T12:05:00.000Z",
    "auditLogged": true
  }
}
```

### 5. Pagination and Search
- **Paginated:** Yes. Required on `GET /api/v1/admin/leads`. Page size defaults to 20.
- **Searchable fields:** Full-text indexing on `name`, `leadId`, `city`, `subcaste`, and phone suffix.

### 6. Admin Permissions
- `CRM_AGENT`: Can only view leads where `assignedEmployeeId === req.user.id` when recordScope is `OWN`. Phone numbers masked by default (`+91 98****1234`).
- `CRM_MANAGER` / `ADMIN`: Can view all leads, execute single or batch assignments, reassign across teams.
- Reveal phone logs an immutable audit event (`LEAD_PHONE_REVEALED`).

### 7. Database Requirements
- Collection: `leads`.
- Indexes: `{ leadId: 1 }` (unique), `{ assignedEmployeeId: 1, status: 1 }`, `{ status: 1, createdAt: -1 }`, `{ source: 1 }`, `{ mobile: 1 }`.
- Status Enum: `NEW`, `ASSIGNED`, `CONTACTED`, `INTERESTED`, `PROFILE_VERIFICATION_PENDING`, `MATCHMAKING_ACTIVE`, `MEMBERSHIP_PURCHASED`, `CONVERTED`, `ON_HOLD`, `LOST`, `CLOSED`.

### 8. Business Logic and Edge Cases
- **Duplicate Prevention:** Incoming lead with an existing phone number updates the existing lead's interaction count and sets status to `NEW_INQUIRY` instead of creating an orphaned duplicate.
- **Capacity Guard:** Reassign or assign API rejects with `422 Unprocessable Entity` if target employee has exceeded `maxLeadCapacity`.

---

## Module 04: Members Directory & Profile 360 Desk

### 1. Module Overview
- **Name:** Matrimonial Members Directory & 360° Management
- **Admin Screens:** `/members`, `/members/paid`, `/members/inactive`, `/members/search`, `/members/add`, `/members/profile-details-by-id/:id`
- **Actions Available:** Comprehensive 7-step member onboarding (General, Family, Lifestyle, Career, Astrological, Photos, Other), edit profile sections, toggle verification flags (Profile Verified, Aadhaar Verified, Mobile, Email), record manual plan payments, suspend/ban member with reason modal, generate biodatas (Blind vs Full mode, PDF export, WhatsApp web direct share).

### 2. Required APIs
1. `GET /api/v1/admin/members` (Admin Only — filtered & paginated member directory).
2. `GET /api/v1/admin/members/:id` (Admin Only — full 360 member profile).
3. `POST /api/v1/admin/members` (Admin Only — staff-assisted member registration).
4. `PUT /api/v1/admin/members/:id` (Admin Only — admin profile updates).
5. `PUT /api/v1/admin/members/:id/status` (Admin Only — activate, suspend, ban).
6. `POST /api/v1/admin/members/:id/verify` (Admin Only — toggle KYC verification status).
7. `POST /api/v1/admin/members/:id/manual-payment` (Admin Only — record offline / manual plan payment).
8. `POST /api/v1/admin/members/:id/biodata` (Admin Only — sanitize & generate PDF biodata payload).
9. `DELETE /api/v1/admin/members/:id` (Admin Only — GDPR/DPDP compliant anonymization/deletion).

*Shared APIs:*
10. `GET /api/v1/profile/me` (Shared — candidate viewing own profile on Web/App).
11. `PUT /api/v1/profile/me` (Shared — candidate editing own profile).
12. `POST /api/v1/profile/upload-photo` (Shared — upload profile & gallery photos).

### 3. Request Payloads

#### 3.1 `POST /api/v1/admin/members` (Staff-assisted Registration)
- **Type:** JSON (Multipart if images included directly)
```json
{
  "uniqueId": "E10265P1598",
  "fullName": "Manish Kumar Advani",
  "email": "manish.advani@example.com",
  "mobile": "9818022636",
  "password": "InitialTempPassword123#",
  "gender": "Male",
  "dob": "1997-04-12",
  "maritalStatus": "Never Married",
  "religion": "Hindu",
  "community": "Sindhi",
  "subcaste": "Amil",
  "gotra": "Kashyap",
  "city": "Delhi",
  "state": "Delhi",
  "country": "India",
  "height": "5ft 10in",
  "weight": "74 kg",
  "diet": "Vegetarian",
  "education": "B.Tech Computer Science",
  "profession": "Software Engineer",
  "employedIn": "Private Sector",
  "annualIncome": "₹20 - ₹25 Lakhs",
  "fatherName": "Gopichand Advani",
  "fatherOccupation": "Retired Govt Officer",
  "motherName": "Pushpa Advani",
  "motherOccupation": "Homemaker",
  "familyType": "Nuclear",
  "birthPlace": "Delhi",
  "birthTime": "06:45 AM",
  "manglik": "Non-Manglik",
  "plan": "GOLD",
  "status": "ACTIVE",
  "isVerified": true
}
```

#### 3.2 `POST /api/v1/admin/members/:id/manual-payment`
- **Type:** JSON
- **Permissions:** `FINANCE_STAFF+`, `ADMIN`, `SUPER_ADMIN`
```json
{
  "planTier": "GOLD",
  "planName": "Gold Membership (180 Days)",
  "amount": 2999,
  "gateway": "Bank NEFT",
  "paymentMode": "Offline",
  "receiptNo": "REC-2026-9901",
  "notes": "Direct bank transfer received via HDFC Bank reference #NEFT88912."
}
```

#### 3.3 `POST /api/v1/admin/members/:id/biodata`
- **Type:** JSON
- **Permissions:** `CRM_AGENT+` (Blind Mode), `CRM_MANAGER+` (Full Mode)
```json
{
  "templateId": "TRADITIONAL",
  "privacyMode": "BLIND",
  "allowReligiousMotif": true,
  "motif": "GANESH_SHLOK",
  "recipientPhone": "+91 98200 99887",
  "recipientName": "Suresh Chawla",
  "shareMethod": "WHATSAPP_WEB"
}
```
*Business Rule:* When `privacyMode === 'BLIND'`, phone, email, and exact street address are strictly sanitized from generated document.

### 4. Response Structure

#### 4.1 Biodata Generation Payload
- **Status:** `200 OK`
```json
{
  "code": 200,
  "error": false,
  "data": {
    "pdfUrl": "https://cdn.sindhimatrimony.com/biodatas/biodata-SIND001-blind.pdf",
    "whatsappShareUrl": "https://api.whatsapp.com/send?phone=919820099887&text=Greetings%20from%20Sindhi%20Matrimony...",
    "privacyMode": "BLIND",
    "excludedFields": ["mobile", "email", "permanentAddress", "adminComment"],
    "completenessScore": 92
  }
}
```

### 5. Pagination and Search
- **Paginated:** Yes (`page`, `limit=25`, `search`, `subcaste`, `city`, `plan`, `gender`, `status`).
- Specialized endpoints `/members/paid` and `/members/inactive` pre-filter `plan != 'FREE'` and `status === 'INACTIVE'`.

### 6. Admin Permissions
- Changing status to `SUSPENDED` or `DELETED` requires `ADMIN+` and mandatory reason notes logged to audit trail.
- Unmasking passwords or sensitive IDs prohibited; password reset triggers a secure email link.

### 7. Database Requirements
- Collections: `members` (or `users` + `profiles`).
- Indexes: `{ uniqueId: 1 }` (unique), `{ mobile: 1 }` (unique), `{ email: 1 }` (sparse unique), `{ subcaste: 1, gender: 1, status: 1 }`, `{ plan: 1 }`.

### 8. Business Logic and Edge Cases
- Unique ID auto-generation format: `SIND` + zero-padded sequential 6-digit integer (`SIND001408`).
- Modifying a member's phone number revokes `isMobileVerified` and requires OTP re-verification.

---

## Module 05: Assisted Matchmaking & Response Clearinghouse

### 1. Module Overview
- **Name:** Assisted Matchmaking Engine & Dual-Sided Response Desk
- **Admin Screens:** `/matchmaking`, `/match-responses`
- **Actions Available:** Pair candidate with client, calculate compatibility score, review auto-generated recommendations, approve/reject match with matchmaker note, share verified match with client (dispatching Push + WhatsApp), record independent responses for Client vs Candidate, track mutual interest states.

### 2. Required APIs
1. `GET /api/v1/admin/matchmaking/matches` (Admin Only — filtered match pipeline).
2. `POST /api/v1/admin/matchmaking/evaluate-pair` (Admin Only — on-demand compatibility evaluation).
3. `POST /api/v1/admin/matchmaking/:matchId/review` (Admin Only — approve/reject match by matchmaker).
4. `POST /api/v1/admin/matchmaking/:matchId/share` (Admin Only — dispatch match to client via notification channels).
5. `POST /api/v1/admin/matchmaking/:matchId/response` (Admin Only — staff logs phone/verbal response).
6. `GET /api/v1/admin/matchmaking/:matchId/audit-trail` (Admin Only — immutable lifecycle history).

*Shared APIs:*
7. `GET /api/v1/matches/recommendations` (Shared — user app discovery feed).
8. `POST /api/v1/interests/send` (Shared — candidate expresses interest in profile).
9. `POST /api/v1/interests/respond` (Shared — candidate accepts/declines interest).

### 3. Request Payloads

#### 3.1 `POST /api/v1/admin/matchmaking/evaluate-pair`
- **Type:** JSON
```json
{
  "clientId": "SIND001",
  "candidateId": "SIND002",
  "sourceType": "ADMIN_SUGGESTED",
  "suggestedReason": "Both families based in Bandra, Mumbai and seeking Amil/Baibhand matches."
}
```

#### 3.2 `POST /api/v1/admin/matchmaking/:matchId/review`
- **Type:** JSON
```json
{
  "reviewStatus": "APPROVED",
  "reviewNotes": "Horoscope 36-Guna compatibility verified (26/36). Family backgrounds compatible."
}
```
*Validation:* `reviewStatus` enum [`APPROVED`, `REJECTED_BY_EMPLOYEE`]; `reviewNotes` required string.

#### 3.3 `POST /api/v1/admin/matchmaking/:matchId/response`
- **Type:** JSON
```json
{
  "party": "CLIENT",
  "response": "ACCEPTED",
  "feedback": "Spoke to candidate's mother. Both families keen to arrange tea meeting on Sunday.",
  "recordedBy": "EMPLOYEE"
}
```
*Validation:* `party` enum [`CLIENT`, `CANDIDATE`]; `response` enum [`ACCEPTED`, `DECLINED`, `REQUESTED_MORE_INFO`, `CALLBACK_REQUESTED`].

### 4. Response Structure

#### 4.1 Match Compatibility Evaluation
- **Status:** `200 OK`
```json
{
  "code": 200,
  "error": false,
  "data": {
    "matchId": "MATCH-2026-9041",
    "pairKey": "SIND001:SIND002",
    "client": { "id": "SIND001", "name": "Karan Advani", "subcaste": "Amil", "city": "Mumbai" },
    "candidate": { "id": "SIND002", "name": "Simran Chandnani", "subcaste": "Baibhand", "city": "Mumbai" },
    "compatibilityScore": 88,
    "compatibilityReasons": [
      "Both partners reside in Mumbai",
      "Preferred Sindhi Subcastes match exactly",
      "Age difference is 2 years (Within client preference limit of 4 years)",
      "Vedic Kundli Guna score: 26 / 36 (Very Good)"
    ],
    "gotraViolation": false,
    "reviewStatus": "PENDING_EMPLOYEE_REVIEW",
    "overallStatus": "PENDING_REVIEW"
  }
}
```

### 5. Pagination and Search
- **Paginated:** Yes. Searchable by `clientName`, `candidateName`, `matchId`, filtered by `overallStatus` (`MUTUAL_INTEREST`, `AWAITING_CLIENT_RESPONSE`, etc.).

### 6. Admin Permissions
- `CRM_AGENT`, `CRM_MANAGER`, `ADMIN`, `SUPER_ADMIN`.
- Agents can only evaluate or review matches for clients assigned to their employee ID.

### 7. Database Requirements
- Collection: `match_recommendations`.
- Symmetrical Lexicographical PairKey: `pairKey: min(clientId, candidateId) + ":" + max(clientId, candidateId)` (unique index). Prevents reverse duplicate pairing.
- Index: `{ pairKey: 1 }` (unique), `{ clientId: 1, overallStatus: 1 }`, `{ candidateId: 1, overallStatus: 1 }`.

### 8. Business Logic and Edge Cases
- When both Client and Candidate responses reach `ACCEPTED`, the engine atomically updates `overallStatus` to `MUTUAL_INTEREST` and dispatches mutual match push notifications and SMS to both parties.
- Hard Gotra Exogamy Rule: If both share identical Gotra and community exogamy rules apply, system flags warning with `gotraViolation: true` and blocks automated auto-sharing without explicit matchmaker override.

---

## Module 06: Vedic Horoscope & Ashtakoota Kundli Milan

### 1. Module Overview
- **Name:** Vedic Astrological Compatibility & Kundli Milan Engine
- **Admin Screen:** `/horoscope`
- **Actions Available:** Compute 36-Guna Ashtakoota compatibility between any groom and bride, evaluate Manglik Kuja Dosha cancellation rules, identify Gotra exogamy conflicts, export PDF Kundli Milan certificate, update astro matching thresholds.

### 2. Required APIs
1. `POST /api/v1/horoscope/kundli-milan` (Shared across platforms — used in Admin Milan desk and user app profile match screen).
2. `GET /api/v1/admin/horoscope/settings` (Admin Only — astro matching thresholds).
3. `PUT /api/v1/admin/horoscope/settings` (Admin Only — update minimum gunas threshold).

### 3. Request Payloads

#### 3.1 `POST /api/v1/horoscope/kundli-milan`
- **Type:** JSON
- **Shared API:** Yes (Publicly accessible with auth for subscribed members).
```json
{
  "groom": {
    "id": "SIND001",
    "fullName": "Karan Advani",
    "dob": "1995-08-14",
    "birthTime": "06:30",
    "birthPlace": "Mumbai",
    "rashi": "Mesha (Aries)",
    "nakshatra": "Ashwini",
    "gotra": "Kashyap",
    "manglik": "NON_MANGLIK"
  },
  "bride": {
    "id": "SIND002",
    "fullName": "Simran Chandnani",
    "dob": "1997-11-20",
    "birthTime": "14:15",
    "birthPlace": "Pune",
    "rashi": "Simha (Leo)",
    "nakshatra": "Magha",
    "gotra": "Vashishta",
    "manglik": "NON_MANGLIK"
  }
}
```

### 4. Response Structure

#### 4.1 Kundli Milan Compatibility Result
- **Status:** `200 OK`
```json
{
  "code": 200,
  "error": false,
  "data": {
    "totalGunas": 28,
    "maxGunas": 36,
    "percentage": 77.78,
    "verdict": "VERY_GOOD",
    "verdictLabel": "Very Auspicious Match for Matrimony",
    "sameGotraViolation": false,
    "manglikCompatibility": "PERFECT",
    "manglikNote": "Both partners are Non-Manglik. No Kuja Dosha present.",
    "breakdown": {
      "varna": { "max": 1, "obtained": 1, "description": "Work & temperament compatibility" },
      "vashya": { "max": 2, "obtained": 2, "description": "Mutual dominance & power balance" },
      "tara": { "max": 3, "obtained": 3, "description": "Destiny, health and longevity" },
      "yoni": { "max": 4, "obtained": 3, "description": "Biological and sexual affinity" },
      "grahaMaitri": { "max": 5, "obtained": 5, "description": "Planetary friendship and intellectual harmony" },
      "gana": { "max": 6, "obtained": 6, "description": "Behavioral temperament (Deva, Manushya, Rakshasa)" },
      "bhakoot": { "max": 7, "obtained": 0, "description": "Family welfare, emotional bonding and growth" },
      "nadi": { "max": 8, "obtained": 8, "description": "Genetic, physiological compatibility and progeny" }
    },
    "recommendations": [
      "Nadi Koota scores 8/8 which indicates excellent genetic compatibility.",
      "Bhakoot Dosha is present but mitigated by mutual planetary friendship between Mars and Sun."
    ]
  }
}
```

### 5. Pagination and Search
- Calculation endpoint; no pagination required.

### 6. Admin Permissions
- Calculation API: `USER` (Subscribed), `CRM_AGENT`, `ADMIN`, `SUPER_ADMIN`.
- Settings update API: `SUPER_ADMIN` only.

### 7. Database Requirements
- Astrological Ephemeris Reference tables for Nakshatra-Rashi-Gana lookups.
- Settings collection: `system_settings` under key `horoscope_config`.

### 8. Business Logic and Edge Cases
- Strict Gotra Exogamy: When groom's Gotra equals bride's Gotra, `sameGotraViolation` is set to `true`.

---

## Module 07: Verification & KYC Moderation Desk

### 1. Module Overview
- **Name:** Verification & KYC Moderation Desk
- **Admin Screen:** `/verifications`
- **Actions Available:** Review queue of uploaded photos and KYC ID proofs (Aadhaar, Passport, Driving License), inspect zoomed media, approve with moderator note, reject with mandatory rejection reason, count pending items.

### 2. Required APIs
1. `GET /api/v1/admin/verifications/pending` (Admin Only — paginated queue).
2. `POST /api/v1/admin/verifications/:id/approve` (Admin Only — approve photo or KYC).
3. `POST /api/v1/admin/verifications/:id/reject` (Admin Only — reject with reason modal text).
4. `GET /api/v1/admin/verifications/stats` (Admin Only — pending counts by type).

### 3. Request Payloads

#### 3.1 `POST /api/v1/admin/verifications/:id/approve`
- **Type:** JSON
```json
{
  "itemType": "ID_PROOF",
  "approvalNote": "Aadhaar number verified with Govt hash format. Photo and DOB match profile."
}
```

#### 3.2 `POST /api/v1/admin/verifications/:id/reject`
- **Type:** JSON
```json
{
  "itemType": "PHOTO",
  "rejectionReason": "Photo contains watermark/blurriness and face is not clearly identifiable."
}
```
*Validation:* `rejectionReason` required string (min 5 chars).

### 4. Response Structure

#### 4.1 Pending Queue Response
- **Status:** `200 OK`
```json
{
  "code": 200,
  "error": false,
  "data": {
    "queue": [
      {
        "id": "ver_901",
        "type": "ID_PROOF",
        "memberId": "101408",
        "profileId": "SIND001",
        "name": "Karan Advani",
        "subcaste": "Amil",
        "mediaUrl": "https://secure-cdn.sindhimatrimony.com/kyc/aadhaar_901.jpg",
        "documentType": "AADHAAR",
        "uploadedAt": "2026-10-15T10:45:00.000Z"
      }
    ]
  },
  "meta": { "totalPending": 18, "photos": 12, "idProofs": 6 }
}
```

### 5. Pagination and Search
- **Paginated:** Yes (`page`, `limit=20`, filter by `type=PHOTO|ID_PROOF`).

### 6. Admin Permissions
- `MODERATOR`, `ADMIN`, `SUPER_ADMIN`.
- CRM Agents cannot approve KYC documents to maintain separation of duties.

### 7. Database Requirements
- Collection: `verification_requests`.
- Fields: `_id`, `userId`, `itemType`, `mediaUrl`, `status` (`PENDING`, `APPROVED`, `REJECTED`), `reviewedBy`, `reviewNote`, `rejectionReason`, `createdAt`.

### 8. Business Logic and Edge Cases
- Approving an `ID_PROOF` atomically sets `user.isProfileVerified = true` (Blue verified badge) and sends congratulatory push notification.
- Rejecting triggers push notification to user stating exact `rejectionReason` and provides re-upload link.

---

## Module 08: Telephony & Call Interaction Audit Desk

### 1. Module Overview
- **Name:** VoIP Telephony Gateway & Call Interaction Audit
- **Admin Screens:** `/calls`, `/calls/reports`
- **Actions Available:** Filter calls by staff/status/date, listen to verified cloud audio recordings (signed URL), initiate outbound call via Exotel WebRTC, enforce mandatory post-call disposition submission (Outcome, Client Response, Next Follow-up).

### 2. Required APIs
1. `GET /api/v1/admin/calls` (Admin Only — paginated call log history).
2. `POST /api/v1/admin/calls/initiate` (Admin Only — triggers click-to-call bridge).
3. `POST /api/v1/admin/calls/webhook` (Public Webhook — Exotel/telephony callback).
4. `POST /api/v1/admin/calls/:callId/disposition` (Admin Only — mandatory post-call notes).
5. `GET /api/v1/admin/calls/:callId/recording` (Admin Only — signed private S3 URL).
6. `GET /api/v1/admin/calls/reports` (Admin Only — aggregate talk-time & conversion metrics).

### 3. Request Payloads

#### 3.1 `POST /api/v1/admin/calls/initiate`
- **Type:** JSON
```json
{
  "clientId": "SIND001",
  "clientPhone": "+919876543210",
  "purpose": "Matrimonial profile follow-up and family meeting discussion."
}
```

#### 3.2 `POST /api/v1/admin/calls/:callId/disposition`
- **Type:** JSON
```json
{
  "status": "CONNECTED",
  "outcome": "INTERESTED",
  "clientResponse": "Client's father requested biodata of candidate SIND002.",
  "durationSec": 245,
  "followUpDateTime": "2026-10-18T11:00:00.000Z",
  "notes": "Positive discussion. Recommended Gold plan for phone unlock.",
  "newLeadStatus": "INTERESTED"
}
```

### 4. Response Structure

#### 4.1 Call Recording URL Response
- **Status:** `200 OK`
```json
{
  "code": 200,
  "error": false,
  "data": {
    "callLogId": "CALL-2026-001",
    "recordingSignedUrl": "https://s3.ap-south-1.amazonaws.com/sindhi-recordings/call_001.mp3?X-Amz-Expires=1800...",
    "durationSec": 245,
    "expiresInSeconds": 1800
  }
}
```

### 5. Pagination and Search
- **Paginated:** Yes (`page`, `limit=25`, search by client name, phone, employee).

### 6. Admin Permissions
- `CRM_AGENT` sees only own calls; `CRM_MANAGER+` sees all team calls.
- Listening to recordings requires explicit `calls.recordings` permission.

### 7. Database Requirements
- Collection: `call_logs`.
- Indexes: `{ callLogId: 1 }` (unique), `{ assignedEmployeeId: 1, date: -1 }`, `{ clientId: 1 }`.

### 8. Business Logic and Edge Cases
- When telephony provider fires `DISCONNECTED` webhook, system locks agent screen until disposition form is submitted.

---

## Module 09: Staff Team Chat & Real-Time Collaboration

### 1. Module Overview
- **Name:** Internal Staff Team Chat & Lead Escalation Desk
- **Admin Screen:** `/chat`
- **Actions Available:** Real-time 1-on-1 staff chat, attach CRM lead references into chat threads, escalate for discount approvals or supervisor assistance, search conversation transcripts.

### 2. Required APIs
1. `GET /api/v1/admin/chat/conversations` (Admin Only — list of staff conversations).
2. `GET /api/v1/admin/chat/messages/:partnerId` (Admin Only — message history).
3. `POST /api/v1/admin/chat/messages` (Admin Only — send message with optional lead card).
4. `PUT /api/v1/admin/chat/messages/read` (Admin Only — mark thread read).

### 3. Request Payloads

#### 3.1 `POST /api/v1/admin/chat/messages`
- **Type:** JSON
```json
{
  "recipientId": "emp_003",
  "content": "Priya, please review this high-net-worth lead from Dubai requesting custom discount.",
  "leadReference": {
    "leadId": "LD-1049",
    "leadName": "Kunal Advani",
    "status": "INTERESTED",
    "subcaste": "Amil"
  },
  "escalationType": "DISCOUNT_APPROVAL"
}
```

### 4. Response Structure
- **Status:** `201 Created`
```json
{
  "code": 201,
  "error": false,
  "data": {
    "messageId": "msg_8901",
    "senderId": "emp_001",
    "recipientId": "emp_003",
    "content": "Priya, please review this high-net-worth lead...",
    "timestamp": "2026-10-15T12:10:00.000Z",
    "read": false
  }
}
```

### 5. Pagination and Search
- Paginated message history (`cursor` based or `page` + `limit=50`).

### 6. Admin Permissions
- Accessible to all active employees with `isChatEnabled === true`.

### 7. Database Requirements
- Collection: `team_chat_messages`.
- Indexes: `{ senderId: 1, recipientId: 1, timestamp: -1 }`.

### 8. Business Logic and Edge Cases
- Real-time delivery orchestrated over Socket.io channel `staff:chat:message`.

---

## Module 10: Finance, Ledger & Refund Management

### 1. Module Overview
- **Name:** Finance, Payment Ledger & Refund Management
- **Admin Screen:** `/finance`
- **Actions Available:** Filter transaction ledger across payment gateways (Razorpay, Cashfree, UPI, Bank NEFT), view gross/net revenue, initiate refund request (Finance Staff), approve/reject refund with automatic payment gateway reversal (Finance Manager), download tax invoices.

### 2. Required APIs
1. `GET /api/v1/admin/finance/kpis` (Admin Only — financial KPI summary).
2. `GET /api/v1/admin/finance/transactions` (Admin Only — paginated transactions).
3. `GET /api/v1/admin/finance/transactions/:id` (Admin Only — transaction details).
4. `POST /api/v1/admin/finance/refunds/request` (Admin Only — raise refund request).
5. `POST /api/v1/admin/finance/refunds/:id/approve` (Admin Only — approve & execute refund).
6. `POST /api/v1/admin/finance/refunds/:id/reject` (Admin Only — reject refund).
7. `GET /api/v1/admin/finance/invoices/:txnId` (Admin Only — signed PDF invoice).

*Shared APIs:*
8. `POST /api/v1/payments/create-order` (Shared — initiate Razorpay order on Web/Mobile).
9. `POST /api/v1/payments/verify` (Shared — verify gateway signature & entitle membership).

### 3. Request Payloads

#### 3.1 `POST /api/v1/admin/finance/refunds/request`
- **Type:** JSON
- **Permissions:** `FINANCE_STAFF`, `ADMIN`, `SUPER_ADMIN`
```json
{
  "txnId": "TXN-90812",
  "refundAmount": 5999,
  "reason": "Double charged due to payment gateway network timeout. Verified bank statement."
}
```

#### 3.2 `POST /api/v1/admin/finance/refunds/:id/approve`
- **Type:** JSON
- **Permissions:** `FINANCE_MANAGER`, `SUPER_ADMIN`
```json
{
  "approverNote": "Refund approved. Processed automated Razorpay API reversal."
}
```

### 4. Response Structure

#### 4.1 `GET /api/v1/admin/finance/kpis`
- **Status:** `200 OK`
```json
{
  "code": 200,
  "error": false,
  "data": {
    "grossCollections": 4850000,
    "netRevenue": 4680000,
    "refundedAmount": 170000,
    "refundedCount": 24,
    "successfulTransactions": 1412,
    "failedTransactions": 38,
    "totalTransactions": 1474,
    "averageTransactionValue": 3434
  }
}
```

### 5. Pagination and Search
- **Paginated:** Yes (`page`, `limit=25`, search by receiptNo, member name, txnId).

### 6. Admin Permissions
- Dual-Authorization Principle: `FINANCE_STAFF` can only *raise* refunds; only `FINANCE_MANAGER` or `SUPER_ADMIN` can *approve* and trigger financial dispatches.

### 7. Database Requirements
- Collection: `payment_transactions`.
- Indexes: `{ txnId: 1 }` (unique), `{ receiptNo: 1 }` (unique), `{ memberId: 1 }`, `{ status: 1, timestamp: -1 }`.

### 8. Business Logic and Edge Cases
- Approving a refund automatically revokes the member's paid tier and sets `member.plan = 'FREE'`.

---

## Module 11: Subscription & Membership Plans Management

### 1. Module Overview
- **Name:** Subscription & Membership Plans Management
- **Admin Screen:** `/settings/membership-plans`, `/settings`
- **Actions Available:** Create, update, toggle active/inactive, reorder membership plans across `SELF_SERVICE` and `ASSIST_PLAN` categories, configure pricing, offer prices, validity periods, and highlighted marketing badges.

### 2. Required APIs
1. `GET /api/v1/plans` (Shared across platforms — public active plan listings).
2. `GET /api/v1/admin/plans` (Admin Only — includes inactive & draft plans with sales counts).
3. `POST /api/v1/admin/plans` (Admin Only — create plan).
4. `PUT /api/v1/admin/plans/:id` (Admin Only — update plan).
5. `PUT /api/v1/admin/plans/:id/toggle-active` (Admin Only — activate/deactivate plan).
6. `DELETE /api/v1/admin/plans/:id` (Admin Only — delete plan if no active subscriptions).

### 3. Request Payloads

#### 3.1 `POST /api/v1/admin/plans`
- **Type:** JSON
```json
{
  "title": "Till Marriage Assisted Matchmaking",
  "subtitle": "Dedicated Senior Matchmaker until wedding bells ring",
  "price": 85000,
  "offerPrice": 75000,
  "duration": "Unlimited / Till Wedding",
  "category": "ASSIST_PLAN",
  "features": [
    "Personal Relationship Manager",
    "Unlimited Contact Unlocks",
    "Handpicked Weekly Matches",
    "Horoscope 36-Guna Kundli Verification",
    "Direct Family Meeting Arrangements"
  ],
  "highlighted": true,
  "badge": "Elite",
  "active": true
}
```

### 4. Response Structure
- **Status:** `201 Created`
```json
{
  "code": 201,
  "error": false,
  "data": {
    "id": "plan_till_marriage",
    "title": "Till Marriage Assisted Matchmaking",
    "price": 85000,
    "offerPrice": 75000,
    "active": true
  }
}
```

### 5. Pagination and Search
- Small master list (~10 plans); returned as full array without pagination.

### 6. Admin Permissions
- `ADMIN`, `SUPER_ADMIN`.

### 7. Database Requirements
- Collection: `membership_plans`.
- Fields: `title`, `price`, `offerPrice`, `duration`, `category`, `features` (array), `highlighted`, `badge`, `active`, `sortOrder`.

### 8. Business Logic and Edge Cases
- Deleting a plan linked to active subscriptions is blocked (`409 Conflict`). Admin must mark `active = false` instead.

---

## Module 12: Employee Directory, RBAC & 360 Workspace

### 1. Module Overview
- **Name:** Employee Access, RBAC & 360° Management
- **Admin Screens:** `/employees`, `/employees/:id`
- **Actions Available:** Employee roster with search/filters, add new employee with role and allowed sections, edit permissions, change active status, force logout, view simulated permission preview, inspect Employee 360 tabbed workspace (Overview, Leads, Clients, Calls, Tasks, Matches, Sales, Attendance, Timeline).

### 2. Required APIs
1. `GET /api/v1/admin/employees` (Admin Only — paginated employee list).
2. `GET /api/v1/admin/employees/:id` (Admin Only — full employee 360 profile).
3. `POST /api/v1/admin/employees` (Admin Only — create employee).
4. `PUT /api/v1/admin/employees/:id` (Admin Only — update employee).
5. `PUT /api/v1/admin/employees/:id/permissions` (Admin Only — update granular permissions with reason).
6. `PUT /api/v1/admin/employees/:id/status` (Admin Only — activate/suspend).
7. `POST /api/v1/admin/employees/:id/force-logout` (Admin Only — revoke all active sessions).
8. `GET /api/v1/admin/employees/:id/360-metrics` (Admin Only — productivity & performance KPIs).

### 3. Request Payloads

#### 3.1 `POST /api/v1/admin/employees`
- **Type:** JSON
- **Permissions:** `SUPER_ADMIN`
```json
{
  "fullName": "Deepak Wadhwani",
  "employeeId": "EMP012",
  "email": "deepak.w@sindhimatrimony.com",
  "mobile": "+91 98111 22334",
  "role": "CRM_AGENT",
  "department": "Sales & CRM",
  "managerName": "Priya Sharma",
  "recordScope": "OWN",
  "maxLeadCapacity": 30,
  "regions": ["Mumbai", "Pune"],
  "languages": ["Sindhi", "Hindi", "English"],
  "allowedSections": ["leads", "tasks", "calls"]
}
```

#### 3.2 `PUT /api/v1/admin/employees/:id/permissions`
- **Type:** JSON
- **Permissions:** `SUPER_ADMIN`
```json
{
  "permissions": {
    "leads": { "view": true, "assign": false, "export": true, "call": true },
    "finance": { "view": false, "refund": false }
  },
  "reason": "Temporary export clearance granted for quarterly audit."
}
```
*Validation:* `reason` required string (min 10 characters).

### 4. Response Structure

#### 4.1 Employee 360 Metrics Response
- **Status:** `200 OK`
```json
{
  "code": 200,
  "error": false,
  "data": {
    "metrics": {
      "totalLeadsAssigned": 45,
      "activeClients": 18,
      "totalCallsLogged": 182,
      "connectedCalls": 142,
      "conversionRate": 16.5,
      "revenueAttributed": 142000,
      "verifiedConnectedRate": 78.0,
      "followUpCompletionRate": 94.2
    }
  }
}
```

### 5. Pagination and Search
- **Paginated:** Yes (`page`, `limit=20`, search by name, employeeId, email, role).

### 6. Admin Permissions
- `SUPER_ADMIN` exclusively manages employee accounts and permissions.
- Mandatory audit log generated on every permission change.

### 7. Database Requirements
- Collection: `employees`.
- Collection: `permission_change_audits`.

### 8. Business Logic and Edge Cases
- `force-logout` places employee's user ID and token issuance timestamps into Redis revocation cache.

---

## Module 13: Tasks, Follow-ups & SLA Scheduler

### 1. Module Overview
- **Name:** Follow-up Tasks & SLA Reminder Desk
- **Admin Screen:** `/tasks`
- **Actions Available:** Scheduled tasks list, filter by status (`PENDING`, `DUE_TODAY`, `COMPLETED`, `OVERDUE`), create task (Call, Meeting, Profile Share, Payment Follow-up, Verification), mark complete with outcome, auto-link to client.

### 2. Required APIs
1. `GET /api/v1/admin/tasks` (Admin Only — paginated task list).
2. `POST /api/v1/admin/tasks` (Admin Only — create follow-up task).
3. `PUT /api/v1/admin/tasks/:id/complete` (Admin Only — complete task with outcome).
4. `PUT /api/v1/admin/tasks/:id/reschedule` (Admin Only — reschedule due date).
5. `DELETE /api/v1/admin/tasks/:id` (Admin Only — cancel task).

### 3. Request Payloads

#### 3.1 `POST /api/v1/admin/tasks`
- **Type:** JSON
```json
{
  "clientId": "SIND001",
  "taskType": "CALL",
  "dueDate": "2026-10-18",
  "dueTime": "11:30 AM",
  "priority": "HIGH",
  "assignedEmployeeId": "emp_003",
  "notes": "Follow up on matrimonial profile approval and family meeting schedule."
}
```
*Validation:* `dueDate` required ISO date; `taskType` enum [`CALL`, `MEETING`, `PROFILE_SHARE`, `PAYMENT_FOLLOWUP`, `VERIFICATION_CHECK`].

### 4. Response Structure
- **Status:** `201 Created`
```json
{
  "code": 201,
  "error": false,
  "data": {
    "taskId": "TSK-2026-081",
    "status": "PENDING",
    "dueDate": "2026-10-18",
    "assignedEmployeeName": "Priya Sharma"
  }
}
```

### 5. Pagination and Search
- **Paginated:** Yes (`page`, `limit=20`, filter by status and priority).

### 6. Admin Permissions
- `CRM_AGENT` (own tasks), `CRM_MANAGER+` (all tasks).

### 7. Database Requirements
- Collection: `follow_up_tasks`.
- Indexes: `{ assignedEmployeeId: 1, dueDate: 1, status: 1 }`.

### 8. Business Logic and Edge Cases
- Daily cron job runs at 08:00 AM IST to transition `dueDate === today` tasks from `PENDING` to `DUE_TODAY` and notify agents via push.

---

## Module 14: Campaigns, Marketing & In-App Popups

### 1. Module Overview
- **Name:** Marketing Campaigns, Festival Offers & Popups Desk
- **Admin Screen:** `/campaigns` (Sections: Notification Management, Festival Offers, Popup Management, Delivery Logs, Analytics)
- **Actions Available:** Dispatch push/in-app notification campaigns to segmented audiences, configure festival discount offers with plan rate overrides, create in-app banners/popups with targeting and dismissal policies, monitor delivery logs with idempotency keys.

### 2. Required APIs
1. `GET /api/v1/admin/campaigns/notifications` (Admin Only — list notification campaigns).
2. `POST /api/v1/admin/campaigns/notifications` (Admin Only — schedule/dispatch notification).
3. `GET /api/v1/admin/campaigns/offers` (Admin Only — festival offers list).
4. `POST /api/v1/admin/campaigns/offers` (Admin Only — create festival offer).
5. `GET /api/v1/admin/campaigns/popups` (Admin Only — popup banners list).
6. `POST /api/v1/admin/campaigns/popups` (Admin Only — create in-app popup).
7. `GET /api/v1/admin/campaigns/delivery-logs` (Admin Only — recipient level delivery logs).
8. `GET /api/v1/admin/campaigns/analytics` (Admin Only — CTR & conversion metrics).

*Shared APIs:*
9. `GET /api/v1/campaigns/active-popups` (Shared — user web & mobile app fetching popups to display).
10. `GET /api/v1/campaigns/active-offers` (Shared — user web & mobile app fetching current discounts).
11. `POST /api/v1/campaigns/popups/:id/track` (Shared — record impression, click, or dismissal).

### 3. Request Payloads

#### 3.1 `POST /api/v1/admin/campaigns/offers`
- **Type:** JSON
```json
{
  "festivalName": "Diwali Vivah Mahabachat 2026",
  "tagline": "Flat 60% OFF on All Gold Memberships",
  "badge": "Diwali Dhamaka",
  "startDate": "2026-10-20T00:00:00.000Z",
  "endDate": "2026-11-05T23:59:59.000Z",
  "discountType": "PERCENTAGE",
  "discountValue": 60,
  "eligibleSegments": ["FREE_USERS", "EXPIRED_MEMBERS"],
  "bannerUrl": "https://cdn.sindhimatrimony.com/banners/diwali_offer.jpg",
  "terms": ["Valid for first 500 subscriptions", "Cannot be combined with other coupons"],
  "planOverrides": [
    {
      "planId": "plan_gold",
      "planName": "Gold Membership",
      "originalPrice": 2999,
      "festivalPrice": 1199,
      "discountPercentage": 60,
      "validityDays": 90
    }
  ]
}
```

#### 3.2 `POST /api/v1/campaigns/popups/:id/track` (Shared API)
- **Type:** JSON
```json
{
  "action": "CLICK_CTA | IMPRESSION | DISMISS",
  "platform": "MOBILE_APP"
}
```

### 4. Response Structure

#### 4.1 Active Popups for User (Shared API)
- **Status:** `200 OK`
```json
{
  "code": 200,
  "error": false,
  "data": {
    "popups": [
      {
        "id": "popup_diwali_2026",
        "title": "🎆 Auspicious Diwali Vivah Offer",
        "subtitle": "Flat 60% OFF on Gold Membership",
        "message": "Unlock verified Sindhi family phone numbers and get free Kundli Milan.",
        "bannerImageUrl": "https://cdn.sindhimatrimony.com/banners/diwali_popup.jpg",
        "ctaText": "Claim Offer Now",
        "ctaLink": "/membership",
        "ctaType": "MEMBERSHIP_PLANS",
        "placement": "MOBILE_HOME",
        "frequencyPolicy": "ONCE_PER_DAY",
        "dismissalPolicy": "PER_DAY"
      }
    ]
  }
}
```

### 5. Pagination and Search
- Delivery logs paginated (`page`, `limit=50`, search by user phone, filter by delivery status).

### 6. Admin Permissions
- `AD_MANAGER`, `ADMIN`, `SUPER_ADMIN`.

### 7. Database Requirements
- Collections: `notification_campaigns`, `festival_offers`, `in_app_popups`, `campaign_delivery_logs`.

### 8. Business Logic and Edge Cases
- Idempotency key required on broadcast notifications to prevent duplicate push dispatch to thousands of mobile devices during worker retries.

---

## Module 15: Trust, Safety & Abuse Moderation Desk

### 1. Module Overview
- **Name:** Trust, Safety & Abuse Moderation Desk
- **Admin Screen:** `/safety`
- **Actions Available:** Review reported profiles, inspect evidence snippets (chat logs, call notes, photo evidence), filter by reason (Money Extortion, Fake Profile, Misbehavior, Already Married), take safety actions: Warning Nudge, 7-Day Shadow Freeze, Permanent Blacklist (hashes of Aadhaar, Phone, and Device ID), Dismiss report.

### 2. Required APIs
1. `GET /api/v1/admin/safety/reports` (Admin Only — abuse reports queue).
2. `POST /api/v1/admin/safety/reports/:id/action` (Admin Only — enforce safety action).
3. `GET /api/v1/admin/safety/blacklists` (Admin Only — list blacklisted identities).
4. `DELETE /api/v1/admin/safety/blacklists/:id` (Admin Only — revoke blacklist entry).

*Shared APIs:*
5. `POST /api/v1/safety/report` (Shared — mobile/web candidate reporting a profile).

### 3. Request Payloads

#### 3.1 `POST /api/v1/safety/report` (Shared API)
- **Type:** JSON
```json
{
  "reportedMemberId": "SIND003",
  "reason": "MONEY_EXTORTION",
  "evidenceText": "Candidate demanded money transfer before agreeing to arrange parent video meeting.",
  "chatSnippet": "[10:15 AM] User: Please send ₹10,000 via UPI..."
}
```

#### 3.2 `POST /api/v1/admin/safety/reports/:id/action`
- **Type:** JSON
- **Permissions:** `MODERATOR`, `ADMIN`, `SUPER_ADMIN`
```json
{
  "actionType": "PERMANENT_BLACKLIST",
  "reasonNotes": "Clear financial extortion evidence confirmed. Added Aadhaar hash and device ID to blacklist."
}
```
*Validation:* `actionType` enum [`WARNING_NUDGE`, `SHADOW_FREEZE_7D`, `PERMANENT_BLACKLIST`, `DISMISSED`].

### 4. Response Structure
- **Status:** `200 OK`
```json
{
  "code": 200,
  "error": false,
  "data": {
    "reportId": "REP-2026-081",
    "status": "BLACKLISTED",
    "actionTaken": "PERMANENT_BLACKLIST",
    "blacklistedIdentityId": "blk_9012"
  }
}
```

### 5. Pagination and Search
- **Paginated:** Yes (`page`, `limit=20`, filter by reason and status).

### 6. Admin Permissions
- `MODERATOR` can take warning or shadow freeze actions. Permanent Blacklist requires `ADMIN` or `SUPER_ADMIN`.

### 7. Database Requirements
- Collections: `abuse_reports`, `blacklisted_identities`.
- Fields in `blacklisted_identities`: `phoneHash`, `aadhaarHash`, `deviceId`, `reason`, `blacklistedBy`.

### 8. Business Logic and Edge Cases
- When an Aadhaar hash is placed on `blacklisted_identities`, future registration attempts with the same Aadhaar or Device ID fail immediately with `403 Forbidden: Identity blacklisted for safety violations`.

---

## Module 16: Success Stories & Vivah Registry

### 1. Module Overview
- **Name:** Success Stories & Vivah Registry
- **Admin Screen:** `/success-stories`
- **Actions Available:** Manage matrimony success stories, publish new couple story, upload couple photo, toggle featured on home page, auto-archive married member profiles upon story publication.

### 2. Required APIs
1. `GET /api/v1/admin/success-stories` (Admin Only — full list including drafts).
2. `POST /api/v1/admin/success-stories` (Admin Only — create story).
3. `PUT /api/v1/admin/success-stories/:id` (Admin Only — update story).
4. `DELETE /api/v1/admin/success-stories/:id` (Admin Only — delete story).

*Shared APIs:*
5. `GET /api/v1/common/success-stories` (Shared — public published stories on Web/App).

### 3. Request Payloads

#### 3.1 `POST /api/v1/admin/success-stories`
- **Type:** JSON (or Multipart)
```json
{
  "groomName": "Rohan Advani",
  "groomId": "SIND001",
  "brideName": "Neha Vazirani",
  "brideId": "SIND004",
  "couplePhoto": "https://cdn.sindhimatrimony.com/couples/rohan_neha.jpg",
  "weddingDate": "2026-02-14",
  "engagementDate": "2025-10-10",
  "city": "Mumbai",
  "subcaste": "Amil",
  "storyTitle": "Found Love & Family Harmony Through Sindhi Matrimony",
  "storyDescription": "Our families connected through the assisted matchmaking service...",
  "attributedEmployeeName": "Priya Sharma",
  "status": "PUBLISHED",
  "featuredOnHome": true,
  "profilesArchived": true
}
```

### 4. Response Structure
- **Status:** `201 Created`
```json
{
  "code": 201,
  "error": false,
  "data": {
    "storyId": "STORY-2026-012",
    "status": "PUBLISHED",
    "profilesArchived": true
  }
}
```

### 5. Pagination and Search
- **Paginated:** Yes on public endpoint (`page`, `limit=10`). Admin table supports search.

### 6. Admin Permissions
- `ADMIN`, `SUPER_ADMIN`, `CRM_MANAGER`.

### 7. Database Requirements
- Collection: `success_stories`.
- Indexes: `{ status: 1, weddingDate: -1 }`, `{ featuredOnHome: 1 }`.

### 8. Business Logic and Edge Cases
- When `profilesArchived === true`, backend automatically sets `status = 'MARRIED'` on both Groom and Bride member records, removes them from search discovery indexes, and clears pending interests.

---

## Module 17: Reviews & Ratings Desk

### 1. Module Overview
- **Name:** Reviews, Testimonials & Ratings Desk
- **Admin Screen:** `/reviews`
- **Actions Available:** Review queue of member feedback, filter by rating (1-5 stars) and source (Google, In-App, Website, RM), approve/reject reviews for public display, post official admin response.

### 2. Required APIs
1. `GET /api/v1/admin/reviews` (Admin Only — full list with moderation filters).
2. `POST /api/v1/admin/reviews/:id/moderation` (Admin Only — approve/reject review).
3. `POST /api/v1/admin/reviews/:id/reply` (Admin Only — post official admin response).
4. `DELETE /api/v1/admin/reviews/:id` (Admin Only — remove fake/spam review).

*Shared APIs:*
5. `GET /api/v1/common/reviews` (Shared — public approved reviews on Web/App).
6. `POST /api/v1/reviews` (Shared — member submits feedback from Web/App).

### 3. Request Payloads

#### 3.1 `POST /api/v1/admin/reviews/:id/reply`
- **Type:** JSON
```json
{
  "adminResponse": "Thank you for your kind words! We are delighted that Priya Sharma helped your family connect successfully."
}
```

### 4. Response Structure
- **Status:** `200 OK`
```json
{
  "code": 200,
  "error": false,
  "data": {
    "reviewId": "REV-2026-041",
    "status": "APPROVED",
    "adminResponse": "Thank you for your kind words...",
    "adminRespondedAt": "2026-10-15T12:15:00.000Z"
  }
}
```

### 5. Pagination and Search
- **Paginated:** Yes (`page`, `limit=20`, filter by rating `1-5`).

### 6. Admin Permissions
- `ADMIN`, `SUPER_ADMIN`.

### 7. Database Requirements
- Collection: `reviews`.
- Indexes: `{ status: 1, rating: -1 }`, `{ memberId: 1 }`.

---

## Module 18: Master Data Management (Castes, Subcastes, Gotras, Surnames)

### 1. Module Overview
- **Name:** Master Data Management (Sindhi Heritage Ontology)
- **Admin Screen:** `/settings/master-data`, `/settings/gotras`, `/settings` (SubcasteGotraSection)
- **Actions Available:** Comprehensive CRUD for Religions, Castes, Subcastes, Gotras, Surnames, and Gotra Compatibility Rules; configure verification status, aliases, historical regions, and strict same-gotra prohibition rules.

### 2. Required APIs
1. `GET /api/v1/common/dropdowns` (Shared Public — Single consolidated dropdown bundle for zero-token app startup, onboarding & landing page search, served directly from Redis RAM with HTTP 304 ETag caching).
2. `GET /api/v1/common/master-data/religions` (Shared — dropdown list).
3. `GET /api/v1/common/master-data/subcastes` (Shared — Sindhi subcaste list).
4. `GET /api/v1/common/master-data/gotras` (Shared — Vedic gotra list).
5. `GET /api/v1/common/master-data/surnames` (Shared — Sindhi surnames with subcaste mappings).
6. `POST /api/v1/admin/master-data/subcastes` (Admin Only — create subcaste).
7. `PUT /api/v1/admin/master-data/subcastes/:id` (Admin Only — update subcaste).
8. `POST /api/v1/admin/master-data/gotras` (Admin Only — create gotra).
9. `PUT /api/v1/admin/master-data/gotras/:id` (Admin Only — update gotra).
10. `POST /api/v1/admin/master-data/surnames` (Admin Only — create surname).
11. `PUT /api/v1/admin/master-data/rules` (Admin Only — update gotra compatibility rules).

### 3. Request Payloads

#### 3.1 `POST /api/v1/admin/master-data/subcastes`
- **Type:** JSON
```json
{
  "name": "Amil",
  "aliases": ["Amils"],
  "region": "Hyderabad / Sindh",
  "description": "Traditional administrative, literary and professional Sindhi community.",
  "surnames": ["Advani", "Gidwani", "Kripalani", "Mansukhani", "Shahani", "Thadhani"],
  "allowedGotraIds": ["gotra_kashyap", "gotra_vashishta"],
  "priorityWeight": 10,
  "verificationStatus": "VERIFIED",
  "active": true
}
```

#### 3.2 `PUT /api/v1/admin/master-data/rules`
- **Type:** JSON
```json
{
  "strictSameGotraRule": true,
  "subcastePriorityMatching": true,
  "maternalGotraCheck": false
}
```

### 4. Response Structure

#### 4.1 `GET /api/v1/common/dropdowns` (Public Bundle)
- **Status:** `200 OK`
- **Cache Headers:** `Cache-Control: public, max-age=86400, stale-while-revalidate=604800`, `ETag: "w/sindhi-dropdowns-v1.0.2"`
- **Response Format:**
```json
{
  "code": 200,
  "error": false,
  "message": "Public master dropdowns retrieved successfully.",
  "data": {
    "version": "1.0.2",
    "subcastes": [
      { "id": "amil", "label": "Amil", "traditionalRegion": "Hyderabad / Sindh" },
      { "id": "baibhand", "label": "Baibhand", "traditionalRegion": "Karachi / Sindh" },
      { "id": "sahiti", "label": "Sahiti", "traditionalRegion": "Sahiti Pargana" },
      { "id": "larkana", "label": "Larkana", "traditionalRegion": "Larkana" },
      { "id": "shikarpuri", "label": "Shikarpuri", "traditionalRegion": "Shikarpur" },
      { "id": "dadu", "label": "Dadu", "traditionalRegion": "Dadu" },
      { "id": "sehwani", "label": "Sehwani", "traditionalRegion": "Sehwan" },
      { "id": "sindhi_sikh", "label": "Sindhi Sikh", "traditionalRegion": "Across Sindh" },
      { "id": "other", "label": "Other Sindhi", "traditionalRegion": "General" }
    ],
    "gotras": ["Kashyap", "Vashishta", "Bharadwaj", "Gautam", "Parashar", "Atri", "Vishwamitra", "Other"],
    "surnames": ["Advani", "Bhavnani", "Gidwani", "Hingorani", "Jagwani", "Kripalani", "Lalwani", "Makhija", "Mirchandani", "Rupani", "Shahani", "Thadhani"],
    "religions": ["HINDU", "SIKH"],
    "maritalStatuses": ["NEVER_MARRIED", "DIVORCED", "WIDOWED", "AWAITING_DIVORCE"],
    "manglikStatuses": ["NOT_MANGLIK", "MANGLIK", "ANSHIK_MANGLIK", "DONT_KNOW"],
    "dietOptions": ["VEGETARIAN", "NON_VEGETARIAN", "EGGETARIAN", "JAIN"],
    "educations": ["B.Tech / B.E.", "MBA / PGDM", "CA / CS", "MBBS / MD", "B.Com / M.Com", "LLB / LLM", "Master's Degree", "Doctorate / Ph.D.", "Other"],
    "occupations": ["Software / IT Professional", "Business / Entrepreneur", "Finance / Banking", "Doctor / Healthcare", "Govt / Civil Services", "Chartered Accountant", "Teacher / Professor", "Other"],
    "annualIncomes": ["Below 5 LPA", "5 - 10 LPA", "10 - 20 LPA", "20 - 35 LPA", "35 - 50 LPA", "50 LPA+"]
  }
}
```

#### 4.2 `POST /api/v1/admin/master-data/subcastes` Response
- **Status:** `200 OK`
```json
{
  "code": 200,
  "error": false,
  "data": {
    "id": "sub_amil",
    "name": "Amil",
    "active": true,
    "surnamesCount": 6
  }
}
```

### 5. Pagination and Search
- Public shared dropdown APIs return active records cached in Redis. Admin lists support full text search.

### 6. Admin Permissions
- `SUPER_ADMIN` exclusively manages master data.

### 7. Database Requirements
- Collections: `master_religions`, `master_subcastes`, `master_gotras`, `master_surnames`, `master_rules`.

---

## Module 19: System Diagnostics & Maintenance Tools

### 1. Module Overview
- **Name:** System Diagnostics, Telephony Pings & Maintenance Desk
- **Admin Screens:** `/tools`, `/master-settings`
- **Actions Available:** Real-time database integrity scan, duplicate phone collision check, WebRTC gateway health check, ping latency measurements (Database, VoIP, SMS, CDN), toggle system maintenance mode with custom broadcast message.

### 2. Required APIs
1. `GET /api/v1/admin/tools/diagnostics` (Admin Only — run integrity diagnostics).
2. `GET /api/v1/admin/tools/pings` (Admin Only — latency test across microservices).
3. `GET /api/v1/admin/settings/master` (Admin Only — fetch portal configuration).
4. `PUT /api/v1/admin/settings/master` (Admin Only — update portal configuration).
5. `PUT /api/v1/admin/settings/maintenance` (Admin Only — toggle maintenance mode).

*Shared APIs:*
6. `GET /api/v1/common/system-status` (Shared — mobile app/web health check & maintenance check).

### 3. Request Payloads

#### 3.1 `PUT /api/v1/admin/settings/maintenance`
- **Type:** JSON
- **Permissions:** `SUPER_ADMIN`
```json
{
  "maintenanceMode": true,
  "maintenanceMessage": "Scheduled server maintenance in progress. The portal will be back online by 04:00 PM IST."
}
```

### 4. Response Structure
- **Status:** `200 OK`
```json
{
  "code": 200,
  "error": false,
  "data": {
    "maintenanceMode": true,
    "maintenanceMessage": "Scheduled server maintenance in progress...",
    "updatedAt": "2026-10-15T12:20:00.000Z"
  }
}
```

### 5. Pagination and Search
- Configuration endpoints; non-paginated.

### 6. Admin Permissions
- `SUPER_ADMIN` only.

---

## Module 20: Help & Direct Support Clearinghouse

### 1. Module Overview
- **Name:** Customer Help & Support Clearinghouse
- **Admin Screen:** `/help-support`
- **Actions Available:** Customer support ticket queue, categorize by department (`CRM_LEADS`, `TECHNICAL`, `BILLING`, `PROFILE_VERIFY`), reply to ticket, resolve ticket, manage FAQ list.

### 2. Required APIs
1. `GET /api/v1/admin/support/tickets` (Admin Only — paginated support tickets).
2. `GET /api/v1/admin/support/tickets/:id` (Admin Only — ticket thread).
3. `POST /api/v1/admin/support/tickets/:id/reply` (Admin Only — agent response).
4. `PUT /api/v1/admin/support/tickets/:id/status` (Admin Only — resolve/close ticket).

*Shared APIs:*
5. `POST /api/v1/support/tickets` (Shared — member creates ticket from Web/App).
6. `GET /api/v1/common/faqs` (Shared — public matrimonial FAQs).

### 3. Request Payloads

#### 3.1 `POST /api/v1/support/tickets` (Shared API)
- **Type:** JSON
```json
{
  "category": "BILLING",
  "priority": "HIGH",
  "subject": "Payment deducted but Gold membership not activated",
  "description": "I paid ₹2,999 via UPI at 10:30 AM today but profile still shows Free tier."
}
```

#### 3.2 `POST /api/v1/admin/support/tickets/:id/reply`
- **Type:** JSON
```json
{
  "replyText": "We have verified your payment reference #UPI8892 and activated your Gold Membership for 180 days."
}
```

### 4. Response Structure
- **Status:** `200 OK`
```json
{
  "code": 200,
  "error": false,
  "data": {
    "ticketId": "TCK-2026-019",
    "status": "RESOLVED",
    "updatedAt": "2026-10-15T12:22:00.000Z"
  }
}
```

### 5. Pagination and Search
- **Paginated:** Yes (`page`, `limit=20`, filter by `status=OPEN|RESOLVED` and `category`).

### 6. Admin Permissions
- `SUPPORT_AGENT`, `ADMIN`, `SUPER_ADMIN`.

---

## Module 21: Audit Logs & Security Compliance Desk

### 1. Module Overview
- **Name:** Security Compliance & Immutable Audit Logs Desk
- **Admin Screen:** `/audit-logs`
- **Actions Available:** Search and inspect chronological audit trail of all sensitive operations (Permissions modified, refunds approved, profile edited, members suspended, call recordings played, phone revealed), view before/after JSON diffs.

### 2. Required APIs
1. `GET /api/v1/admin/audit-logs` (Admin Only — paginated audit trail).
2. `GET /api/v1/admin/audit-logs/:id` (Admin Only — before/after change diff).

### 3. Request Payloads
- **Query Parameters on `GET /api/v1/admin/audit-logs`:**
  - `page`: integer (Default: `1`)
  - `limit`: integer (Default: `25`)
  - `actorId`: string (employee ID filter)
  - `module`: `AUTH | LEADS | MEMBERS | FINANCE | SAFETY | MASTER_DATA | RBAC`
  - `action`: string (e.g. `REFUND_APPROVED`, `PERMISSION_CHANGED`, `PHONE_REVEALED`)
  - `startDate`: ISO Date
  - `endDate`: ISO Date

### 4. Response Structure
- **Status:** `200 OK`
```json
{
  "code": 200,
  "error": false,
  "data": {
    "logs": [
      {
        "id": "audit_9012",
        "timestamp": "2026-10-15T12:05:00.000Z",
        "actor": {
          "id": "emp_001",
          "name": "Rajesh Mulchandani",
          "role": "SUPER_ADMIN",
          "ipAddress": "103.21.124.5"
        },
        "action": "REFUND_APPROVED",
        "module": "FINANCE",
        "targetEntity": "PaymentTransaction",
        "targetId": "TXN-90812",
        "reason": "Double charged due to payment gateway network timeout.",
        "beforeData": { "status": "PENDING_REFUND", "refundAmount": null },
        "afterData": { "status": "REFUNDED", "refundAmount": 5999 }
      }
    ]
  },
  "meta": { "pagination": { "page": 1, "limit": 25, "total": 842 } }
}
```

### 5. Pagination and Search
- **Paginated:** Mandatory pagination. Audit logs cannot be deleted or mutated by any user, including Super Admin.

### 6. Admin Permissions
- `SUPER_ADMIN` only.

---

## Module 22: Offline-First Synchronization Engine & WatermelonDB Architecture

### 1. Module Overview
- **Name:** Offline-First Client Architecture & WatermelonDB Delta Synchronization Engine
- **Client Applications:** `sindhiMatrimony` (React Native Mobile App) and `sindhiMatrimonyUserPanel` (Next.js Web App)
- **Primary Objective:** Provide instant 0ms app boot and offline access to candidate matches, chat history, and master dropdowns without freezing the JavaScript thread; synchronize mutations and delta changes bidirectionally between local SQLite and MongoDB Atlas via low-bandwidth delta packets.
- **Client Data Separation Architecture:**
  - **WatermelonDB (Local SQLite via C++/JSI):** Persistent data store for 100,000+ records (Matches, Biodata cards, Chat history, Shortlists, Dropdowns). Survives app termination, enables offline viewing, and renders at 60–120 FPS.
  - **Zustand / Redux Toolkit:** In-memory transient UI states only (`isModalOpen`, `activeFilterTab`, `authSessionToken`, `unreadBadgeCount`). Never used for large array persistence, preventing main thread JSON serialization lag.

### 2. Required APIs
1. `GET /api/v1/sync/pull` (Shared Auth — fetch delta changes since last sync timestamp).
2. `POST /api/v1/sync/push` (Shared Auth — push queued offline client mutations to MongoDB).
3. `GET /api/v1/sync/version` (Shared Public — 10-byte lightweight cache invalidation handshake).

### 3. Request Payloads

#### 3.1 `GET /api/v1/sync/pull`
- **Query Parameters:**
  - `last_pulled_at`: integer (Unix timestamp in milliseconds, e.g. `1734500000000`).
  - `tables`: optional comma-separated list of tables to pull (`candidate_cards,messages,shortlists`).
- **Validation:** `last_pulled_at` required integer (min: 0).

#### 3.2 `POST /api/v1/sync/push`
- **Query Parameters:**
  - `last_pulled_at`: integer (timestamp of the pull immediately preceding this push).
- **Body Type:** JSON
```json
{
  "changes": {
    "shortlists": {
      "created": [
        {
          "id": "shortlist_local_1",
          "candidateId": "SIND002",
          "shortlistedAt": 1734536000000
        }
      ],
      "updated": [],
      "deleted": ["shortlist_local_old"]
    },
    "messages": {
      "created": [
        {
          "id": "msg_local_89",
          "conversationId": "conv_991",
          "receiverId": "usr_402",
          "messageText": "Jai Jhulelal! Interested in connecting.",
          "createdAt": 1734536050000
        }
      ],
      "updated": [],
      "deleted": []
    }
  }
}
```

### 4. Response Structure

#### 4.1 `GET /api/v1/sync/pull` Response
- **Status:** `200 OK`
```json
{
  "code": 200,
  "error": false,
  "data": {
    "changes": {
      "candidate_cards": {
        "created": [
          {
            "id": "653e1...",
            "userId": "SIND099",
            "fullName": "Simran Advani",
            "age": 24,
            "height": 165,
            "subcaste": "Amil",
            "city": "Mumbai",
            "profession": "Chartered Accountant",
            "avatarUrl": "https://cdn.sindhimatrimony.com/photos/simran.webp",
            "isVerified": true,
            "updatedAt": 1734536100000
          }
        ],
        "updated": [],
        "deleted": ["653e0..."]
      },
      "messages": {
        "created": [],
        "updated": [
          {
            "id": "msg_102",
            "isRead": true,
            "readAt": 1734536080000
          }
        ],
        "deleted": []
      },
      "shortlists": {
        "created": [],
        "updated": [],
        "deleted": []
      }
    },
    "timestamp": 1734536200000
  }
}
```

### 5. Backend Delta Resolution Logic
- **`created`:** Documents where `createdAt > new Date(lastPulledAt) && isDeleted === false`.
- **`updated`:** Documents where `updatedAt > new Date(lastPulledAt) && createdAt <= new Date(lastPulledAt) && isDeleted === false`.
- **`deleted`:** Array of string IDs where `updatedAt > new Date(lastPulledAt) && isDeleted === true`.
- **Compound Query Indexes:** All synced collections enforce `{ updatedAt: 1, isDeleted: 1 }` indexes so delta scans execute in `IXSCAN` mode in under 15ms.

### 6. Cache Invalidation & Master Data Versioning Handshake
- Redis maintains `system:master_data_version` (e.g. `"1.0.2"`).
- `GET /api/v1/sync/version` returns `{ "version": "1.0.2" }` with `Cache-Control: public, max-age=300`.
- Client compares with local SQLite `master_data_version`. If identical, client skips master data fetch entirely.

---

## Module 23: Mobile App (`sindhiMatrimony` React Native) Client API Specification

### 1. Architectural Alignment with React Native App
The `sindhiMatrimony` mobile app (built with React Native, TypeScript, FlashList, Redux Toolkit, and Firebase Cloud Messaging) connects to the common backend API. To guarantee instant screen render and zero mobile lag, all mobile endpoints strictly enforce **Section 1.5 Payload Minimization** (Mongoose `.lean()`, explicit `.select()` field projection, and max 50-limit or keyset cursor pagination).

### 2. Screen-to-API Mapping Matrix
This matrix directly aligns every screen discovered in `sindhiMatrimony/src/screens/` with its corresponding backend API:

| React Native Screen (`src/screens/`) | Feature & Flow | HTTP Method & Route Path | Request Payload / Query Params | Response Data Shape |
|:---|:---|:---:|:---|:---|
| **`LoginScreen`** | Send Mobile OTP | `POST /api/v1/auth/send-otp` | `{ mobile: "9876543210", dialCode: "+91" }` | `{ otpSent: true, expiresIn: 600 }` |
| **`ValidateOTPScreen`** | Verify 6-Digit OTP | `POST /api/v1/auth/verify-otp` | `{ mobile, dialCode, otp: "123456", fcmToken }` | `{ token, refreshToken, user, isNewUser }` |
| **`LoginWithPassword`** | Password Fallback Login | `POST /api/v1/auth/login` | `{ identifier: "9876543210", password: "..." }` | `{ token, refreshToken, user }` |
| **`ResetPassword`** | Forgot Password Recovery | `POST /api/v1/auth/forgot-password/send-otp`<br>`POST /api/v1/auth/forgot-password/verify-otp`<br>`POST /api/v1/auth/forgot-password/reset` | `{ mobile }`<br>`{ mobile, otp }`<br>`{ resetToken, newPassword }` | Standard success envelope |
| **`RegisterScreen`** | Multi-Step Candidate Onboarding | `POST /api/v1/auth/register` | `{ fullName, gender, dob, subcaste, gotra, city, mobile, password }` | `{ token, user, profileId }` |
| **App Launch / Startup** | Zero-Token Master Data Bundle | `GET /api/v1/common/dropdowns` | None (Public, ETag 304, Redis L2 Pre-warmed) | Complete Subcastes, Gotras, Surnames, Cities, Educations, Occupations, Incomes |
| **`HomeScreen`** | Dashboard Feed & Metrics | `GET /api/v1/feed/home` | None | `{ profileCompleteness: 65, dailyMatchesCount: 12, whoLikedMeCount: 5, savedProfilesCount: 3, recommendedProfiles: [...], dailyQuote: {...} }` |
| **`MatchesScreen`** | Curated Matches Discovery Feed | `GET /api/v1/matches/recommendations` | `?filter=FOR_YOU\|NEW_THIS_WEEK\|NEARBY&lastId=...&limit=20` | `{ list: [profileCards], cursor: { nextCursor, hasMore } }` (Cursor Paginated) |
| **`InterestsScreen`** | Incoming & Sent Interests | `GET /api/v1/interests/received`<br>`GET /api/v1/interests/sent`<br>`POST /api/v1/interests/send`<br>`POST /api/v1/interests/:id/accept`<br>`POST /api/v1/interests/:id/decline` | `?page=1&limit=20`<br>`{ candidateId, note }`<br>`{}` | Paginated interest items with sender/recipient profile previews |
| **`MessagesScreen`** | Real-Time Conversations & Chat | `GET /api/v1/chat/conversations`<br>`GET /api/v1/chat/messages/:conversationId`<br>`POST /api/v1/chat/messages/send` | `?lastMessageId=...&limit=30`<br>`{ conversationId, text }` | Active chat threads with avatars, last message, unread count; message timeline |
| **`SearchScreen`** | Advanced Community Search | `POST /api/v1/members/search` | `{ query, minAge, maxAge, subcaste, gotra, city, education, profession, isVerifiedOnly, manglikStatus, page, limit }` | `{ list: [projectedCards], pagination: {...} }` |
| **`UpgradeScreen`** | Membership Plans & Razorpay | `GET /api/v1/plans`<br>`POST /api/v1/payments/create-order`<br>`POST /api/v1/payments/verify` | `{ planId, billingCycle }`<br>`{ razorpayOrderId, razorpayPaymentId, razorpaySignature }` | Active plans (Silver, Gold, Platinum VIP); Razorpay order ID; verified tier activation |
| **`ProfileScreen`** | Candidate Profile 360 & Settings | `GET /api/v1/profile/me`<br>`PUT /api/v1/settings/privacy`<br>`PUT /api/v1/settings/notifications`<br>`DELETE /api/v1/account/delete` | `{ photoVisibility, phoneVisibility }`<br>`{ pushEnabled, emailEnabled }`<br>`{ reason }` | Full profile overview, completeness audit, and privacy flags |
| **`EditProfile`** | Modular Section Profile Editor | `PUT /api/v1/profile/basic`<br>`PUT /api/v1/profile/education-career`<br>`PUT /api/v1/profile/family`<br>`PUT /api/v1/profile/horoscope`<br>`PUT /api/v1/profile/partner-preferences`<br>`POST /api/v1/profile/photos`<br>`DELETE /api/v1/profile/photos/:photoId` | Modular section payloads | Updated section object and recalculated `profileCompleteness` score |
| **`VerifyYourProfile`** | Selfie Match & Aadhaar KYC | `POST /api/v1/kyc/selfie`<br>`POST /api/v1/kyc/aadhaar`<br>`GET /api/v1/kyc/status` | `{ selfieUrl }`<br>`{ aadhaarNumber, documentUrl }` | `{ aadhaarStatus, selfieStatus, isFullyVerified }` |
| **`NotificationScreen`** | In-App Alerts & Push Management | `GET /api/v1/notifications`<br>`PATCH /api/v1/notifications/:id/read`<br>`PATCH /api/v1/notifications/mark-all-read`<br>`DELETE /api/v1/notifications/:id`<br>`POST /api/v1/notifications/fcm-token` | `?category=ALL\|INTERESTS\|MATCHES\|MESSAGES\|SYSTEM`<br>`{ fcmToken, platform: 'ANDROID'\|'IOS' }` | Paginated notification items grouped by Today, Yesterday, Earlier |
| **`HelpCenter`** | 24x7 Support Clearinghouse | `GET /api/v1/support/config`<br>`POST /api/v1/support/tickets` | `{ subject, message, category }` | Support telephone lines, emails, branch addresses, FAQs; ticket reference ID |

---

## 25. API Reuse Matrix (Cross-Platform Common vs Admin-Only)

This matrix proves architectural reuse across the **Admin Portal**, **User Web Portal**, and **Mobile App**. No duplicated endpoints are created for different clients.

| Endpoint URL | Method | Module | Shared Across Clients? | Allowed Clients / Roles | Purpose |
|:---|:---:|:---|:---:|:---|:---|
| `/api/v1/auth/login` | `POST` | Auth | **COMMON** | Admin, Web, Mobile (All) | Unified login with identifier & password |
| `/api/v1/auth/verify-mfa` | `POST` | Auth | **ADMIN ONLY** | Admin (`SUPER_ADMIN`, `FINANCE_MGR`) | Verify TOTP 2FA code |
| `/api/v1/auth/refresh-token` | `POST` | Auth | **COMMON** | Admin, Web, Mobile | Refresh expired JWT access token |
| `/api/v1/auth/logout` | `POST` | Auth | **COMMON** | Admin, Web, Mobile | Terminate session & clear FCM token |
| `/api/v1/auth/me` | `GET` | Auth | **COMMON** | Authenticated User / Staff | Fetch current identity & permissions |
| `/api/v1/auth/change-password` | `PUT` | Auth | **COMMON** | Authenticated User / Staff | Update account password |
| `/api/v1/admin/dashboard/kpis` | `GET` | Dashboard | **ADMIN ONLY** | `ANALYST+`, `ADMIN` | Operational KPI metrics |
| `/api/v1/admin/dashboard/action-queues` | `GET` | Dashboard | **ADMIN ONLY** | `ADMIN`, `SUPER_ADMIN` | Real-time SLA pending queues |
| `/api/v1/admin/leads` | `GET` | CRM Leads | **ADMIN ONLY** | `CRM_AGENT+`, `ADMIN` | Paginated lead repository |
| `/api/v1/admin/leads/assign` | `POST` | CRM Leads | **ADMIN ONLY** | `CRM_MANAGER+` | Single & batch lead assignment |
| `/api/v1/admin/leads/:id/reassign` | `POST` | CRM Leads | **ADMIN ONLY** | `CRM_MANAGER+` | Reassign lead with reason preset |
| `/api/v1/admin/leads/:id/reveal-contact`| `POST` | CRM Leads | **ADMIN ONLY** | Staff with `leads.call` | Unmask phone number with audit |
| `/api/v1/leads` | `POST` | CRM Leads | **COMMON** | Public / Web / Mobile / Admin | Incoming lead registration form |
| `/api/v1/admin/members` | `GET` | Members | **ADMIN ONLY** | `ADMIN+` | Full member directory |
| `/api/v1/admin/members/:id` | `GET` | Members | **ADMIN ONLY** | `ADMIN+` | Member 360 profile & logs |
| `/api/v1/admin/members` | `POST` | Members | **ADMIN ONLY** | `ADMIN+` | Staff-assisted member registration |
| `/api/v1/profile/me` | `GET` | Members | **COMMON** | `USER` (Web & Mobile) | Candidate viewing own profile |
| `/api/v1/profile/me` | `PUT` | Members | **COMMON** | `USER` (Web & Mobile) | Candidate editing own profile |
| `/api/v1/profile/upload-photo` | `POST` | Members | **COMMON** | `USER` (Web & Mobile) | Upload photos to S3/Cloudinary |
| `/api/v1/admin/members/:id/biodata` | `POST` | Members | **ADMIN ONLY** | `CRM_AGENT+` | Generate Blind/Full PDF biodata |
| `/api/v1/admin/matchmaking/matches` | `GET` | Matchmaking | **ADMIN ONLY** | `CRM_AGENT+` | Assisted matchmaking pipeline |
| `/api/v1/admin/matchmaking/:id/review`| `POST` | Matchmaking | **ADMIN ONLY** | `CRM_AGENT+` | Matchmaker approve/reject pair |
| `/api/v1/admin/matchmaking/:id/share` | `POST` | Matchmaking | **ADMIN ONLY** | `CRM_AGENT+` | Dispatch match recommendation |
| `/api/v1/matches/recommendations` | `GET` | Matchmaking | **COMMON** | `USER` (Web & Mobile) | User app daily match discovery feed |
| `/api/v1/interests/send` | `POST` | Matchmaking | **COMMON** | `USER` (Web & Mobile) | Send connection interest |
| `/api/v1/interests/respond` | `POST` | Matchmaking | **COMMON** | `USER` (Web & Mobile) | Accept or decline interest |
| `/api/v1/horoscope/kundli-milan` | `POST` | Horoscope | **COMMON** | All Subscribed Users & Staff | Ashtakoota 36-Guna Kundli check |
| `/api/v1/admin/verifications/pending` | `GET` | Verification| **ADMIN ONLY** | `MODERATOR+` | Review pending photos & KYC |
| `/api/v1/admin/verifications/:id/approve`|`POST`| Verification| **ADMIN ONLY** | `MODERATOR+` | Approve KYC / Photo |
| `/api/v1/admin/verifications/:id/reject` |`POST`| Verification| **ADMIN ONLY** | `MODERATOR+` | Reject KYC / Photo with reason |
| `/api/v1/admin/calls` | `GET` | Telephony | **ADMIN ONLY** | `CRM_AGENT+` | Call logs and duration records |
| `/api/v1/admin/calls/initiate` | `POST` | Telephony | **ADMIN ONLY** | `CRM_AGENT+` | Click-to-call bridge |
| `/api/v1/admin/calls/:id/disposition` | `POST` | Telephony | **ADMIN ONLY** | `CRM_AGENT+` | Mandatory call disposition notes |
| `/api/v1/admin/chat/messages` | `POST` | Staff Chat | **ADMIN ONLY** | All Staff | Internal team chat message |
| `/api/v1/admin/finance/kpis` | `GET` | Finance | **ADMIN ONLY** | `FINANCE_STAFF+`, `ADMIN` | Gross collections & net revenue |
| `/api/v1/admin/finance/transactions` | `GET` | Finance | **ADMIN ONLY** | `FINANCE_STAFF+`, `ADMIN` | Transaction ledger table |
| `/api/v1/admin/finance/refunds/request`|`POST` | Finance | **ADMIN ONLY** | `FINANCE_STAFF+` | Raise refund request |
| `/api/v1/admin/finance/refunds/:id/approve`|`POST`| Finance | **ADMIN ONLY** | `FINANCE_MANAGER`, `SUPER_ADMIN`| Approve refund & execute gateway API |
| `/api/v1/payments/create-order` | `POST` | Finance | **COMMON** | `USER` (Web & Mobile) | Razorpay order creation |
| `/api/v1/payments/verify` | `POST` | Finance | **COMMON** | `USER` (Web & Mobile) | Razorpay signature verification |
| `/api/v1/plans` | `GET` | Plans | **COMMON** | Public (Web, Mobile, Admin) | Active membership plans listing |
| `/api/v1/admin/plans` | `POST`/`PUT`| Plans | **ADMIN ONLY** | `ADMIN`, `SUPER_ADMIN` | CRUD on membership packages |
| `/api/v1/admin/employees` | `GET`/`POST`| Employees | **ADMIN ONLY** | `SUPER_ADMIN` | Employee management & RBAC |
| `/api/v1/admin/employees/:id/permissions`|`PUT`| Employees | **ADMIN ONLY** | `SUPER_ADMIN` | Granular permission overrides |
| `/api/v1/admin/tasks` | `GET`/`POST`| Tasks | **ADMIN Only** | `CRM_AGENT+` | Follow-up task scheduling |
| `/api/v1/admin/campaigns/offers` | `POST` | Marketing | **ADMIN ONLY** | `AD_MANAGER`, `ADMIN` | Create festival discounts & offers |
| `/api/v1/campaigns/active-popups` | `GET` | Marketing | **COMMON** | `USER` (Web & Mobile) | Fetch active banners & popups |
| `/api/v1/campaigns/active-offers` | `GET` | Marketing | **COMMON** | `USER` (Web & Mobile) | Fetch festival plan discounts |
| `/api/v1/safety/report` | `POST` | Safety | **COMMON** | `USER` (Web & Mobile) | Candidate reporting profile |
| `/api/v1/admin/safety/reports/:id/action`|`POST`| Safety | **ADMIN ONLY** | `MODERATOR`, `ADMIN` | Enforce Shadow Freeze or Blacklist |
| `/api/v1/common/success-stories` | `GET` | Stories | **COMMON** | Public (Web & Mobile) | Published wedding success stories |
| `/api/v1/admin/success-stories` | `POST`/`PUT`| Stories | **ADMIN ONLY** | `ADMIN`, `SUPER_ADMIN` | Publish story & archive profiles |
| `/api/v1/common/reviews` | `GET` | Reviews | **COMMON** | Public (Web & Mobile) | Public approved testimonials |
| `/api/v1/reviews` | `POST` | Reviews | **COMMON** | `USER` (Web & Mobile) | Submit matrimonial review |
| `/api/v1/common/dropdowns` | `GET` | Master Data | **COMMON** | Public (All platforms) | Consolidated master dropdown bundle (Zero Token) |
| `/api/v1/common/master-data/subcastes` | `GET` | Master Data | **COMMON** | Public (All platforms) | Sindhi subcaste dropdown master |
| `/api/v1/common/master-data/gotras` | `GET` | Master Data | **COMMON** | Public (All platforms) | Vedic gotra dropdown master |
| `/api/v1/sync/pull` | `GET` | Sync Engine | **COMMON** | `USER` (Web & Mobile) | WatermelonDB delta sync pull changes |
| `/api/v1/sync/push` | `POST` | Sync Engine | **COMMON** | `USER` (Web & Mobile) | WatermelonDB delta sync push offline changes |
| `/api/v1/admin/settings/maintenance` | `PUT` | Settings | **ADMIN ONLY** | `SUPER_ADMIN` | Toggle maintenance downtime |
| `/api/v1/admin/audit-logs` | `GET` | Audit | **ADMIN ONLY** | `SUPER_ADMIN` | Immutable compliance audit log |

---

## 26. Final API Inventory & Implementation Roadmap

### 26.1 Consolidated Master Inventory by Implementation Priority

| Module | Method | Endpoint | Access Level | Paginated? | Payload Type | Priority |
|:---|:---:|:---|:---|:---:|:---:|:---:|
| **Master**| `GET` | `/api/v1/common/dropdowns` | Common (Public) | No | None | **P0 (Blocker)** |
| **Auth** | `POST` | `/api/v1/auth/login` | Common (Public) | No | JSON | **P0 (Blocker)** |
| **Auth** | `POST` | `/api/v1/auth/verify-mfa` | Admin Only | No | JSON | **P0 (Blocker)** |
| **Auth** | `POST` | `/api/v1/auth/refresh-token` | Common (Public) | No | JSON | **P0 (Blocker)** |
| **Auth** | `GET` | `/api/v1/auth/me` | Common (Auth) | No | None | **P0 (Blocker)** |
| **Master**| `GET` | `/api/v1/common/master-data/subcastes` | Common (Public) | No | None | **P0 (Blocker)** |
| **Master**| `GET` | `/api/v1/common/master-data/gotras` | Common (Public) | No | None | **P0 (Blocker)** |
| **Members**| `GET` | `/api/v1/admin/members` | Admin Only | **Yes** | None | **P0 (Blocker)** |
| **Members**| `GET` | `/api/v1/admin/members/:id` | Admin Only | No | None | **P0 (Blocker)** |
| **Members**| `POST` | `/api/v1/admin/members` | Admin Only | No | JSON/Form | **P0 (Blocker)** |
| **Members**| `PUT` | `/api/v1/admin/members/:id` | Admin Only | No | JSON | **P0 (Blocker)** |
| **Leads** | `GET` | `/api/v1/admin/leads` | Admin Only | **Yes** | None | **P0 (Blocker)** |
| **Leads** | `POST` | `/api/v1/admin/leads/assign` | Admin Only | No | JSON | **P0 (Blocker)** |
| **Leads** | `POST` | `/api/v1/admin/leads/:id/reassign` | Admin Only | No | JSON | **P0 (Blocker)** |
| **Dashboard**| `GET` | `/api/v1/admin/dashboard/kpis` | Admin Only | No | None | **P0 (Blocker)** |
| **Dashboard**| `GET` | `/api/v1/admin/dashboard/action-queues` | Admin Only | No | None | **P0 (Blocker)** |
| **Verify** | `GET` | `/api/v1/admin/verifications/pending` | Admin Only | **Yes** | None | **P0 (Blocker)** |
| **Verify** | `POST` | `/api/v1/admin/verifications/:id/approve` | Admin Only | No | JSON | **P0 (Blocker)** |
| **Verify** | `POST` | `/api/v1/admin/verifications/:id/reject` | Admin Only | No | JSON | **P0 (Blocker)** |
| **Plans** | `GET` | `/api/v1/plans` | Common (Public) | No | None | **P0 (Blocker)** |
| **Plans** | `POST`/`PUT` | `/api/v1/admin/plans` | Admin Only | No | JSON | **P1 (High)** |
| **Finance**| `GET` | `/api/v1/admin/finance/transactions` | Admin Only | **Yes** | None | **P1 (High)** |
| **Finance**| `POST` | `/api/v1/admin/finance/refunds/request`| Admin Only | No | JSON | **P1 (High)** |
| **Finance**| `POST` | `/api/v1/admin/finance/refunds/:id/approve`| Admin Only | No | JSON | **P1 (High)** |
| **Match** | `GET` | `/api/v1/admin/matchmaking/matches` | Admin Only | **Yes** | None | **P1 (High)** |
| **Match** | `POST` | `/api/v1/admin/matchmaking/:id/review` | Admin Only | No | JSON | **P1 (High)** |
| **Match** | `POST` | `/api/v1/admin/matchmaking/:id/share` | Admin Only | No | None | **P1 (High)** |
| **Horoscope**| `POST` | `/api/v1/horoscope/kundli-milan` | Common (Auth) | No | JSON | **P1 (High)** |
| **Employees**| `GET`/`POST`| `/api/v1/admin/employees` | Admin Only | **Yes** | JSON | **P1 (High)** |
| **Employees**| `PUT` | `/api/v1/admin/employees/:id/permissions`| Admin Only | No | JSON | **P1 (High)** |
| **Tasks** | `GET`/`POST`| `/api/v1/admin/tasks` | Admin Only | **Yes** | JSON | **P1 (High)** |
| **Safety** | `GET` | `/api/v1/admin/safety/reports` | Admin Only | **Yes** | None | **P1 (High)** |
| **Safety** | `POST` | `/api/v1/admin/safety/reports/:id/action` | Admin Only | No | JSON | **P1 (High)** |
| **Calls** | `GET` | `/api/v1/admin/calls` | Admin Only | **Yes** | None | **P1 (High)** |
| **Calls** | `POST` | `/api/v1/admin/calls/initiate` | Admin Only | No | JSON | **P1 (High)** |
| **Calls** | `POST` | `/api/v1/admin/calls/:id/disposition` | Admin Only | No | JSON | **P1 (High)** |
| **Sync** | `GET` | `/api/v1/sync/pull` | Common (Auth) | No | None | **P1 (High)** |
| **Sync** | `POST` | `/api/v1/sync/push` | Common (Auth) | No | JSON | **P1 (High)** |
| **Campaigns**| `GET` | `/api/v1/campaigns/active-popups` | Common (Public) | No | None | **P2 (Normal)** |
| **Campaigns**| `POST` | `/api/v1/admin/campaigns/offers` | Admin Only | No | JSON | **P2 (Normal)** |
| **Stories** | `GET` | `/api/v1/common/success-stories` | Common (Public) | **Yes** | None | **P2 (Normal)** |
| **Stories** | `POST` | `/api/v1/admin/success-stories` | Admin Only | No | JSON/Form | **P2 (Normal)** |
| **Reviews** | `GET` | `/api/v1/common/reviews` | Common (Public) | **Yes** | None | **P2 (Normal)** |
| **Reviews** | `POST` | `/api/v1/admin/reviews/:id/reply` | Admin Only | No | JSON | **P2 (Normal)** |
| **Chat** | `POST` | `/api/v1/admin/chat/messages` | Admin Only | No | JSON | **P2 (Normal)** |
| **Support** | `GET` | `/api/v1/admin/support/tickets` | Admin Only | **Yes** | None | **P2 (Normal)** |
| **Tools** | `GET` | `/api/v1/admin/tools/diagnostics` | Admin Only | No | None | **P2 (Normal)** |
| **Audit** | `GET` | `/api/v1/admin/audit-logs` | Admin Only | **Yes** | None | **P2 (Normal)** |

### 26.2 Recommended Implementation Order
1. **Sprint 1 (Core Infrastructure, Auth & Offline-First Foundation):**
   - Database connection setup (MongoDB Atlas & Redis).
   - Unified Authentication middleware, password hashing, JWT generation, and RBAC guard middleware (`RBACScreenGuard` server equivalent).
   - Consolidated Public Dropdown Bundle API (`GET /api/v1/common/dropdowns`) with Redis RAM caching and ETag 304 support.
   - Master Data endpoints (`subcastes`, `gotras`, `surnames`, `religions`) and WatermelonDB delta sync engine (`routes/sync/`).
2. **Sprint 2 (Members & Verification Engine):**
   - Member CRUD, 7-step registration model, Direct Cloudflare R2 / AWS S3 Presigned URL integration.
   - Verification queue APIs, KYC document moderation, Aadhaar hash generation.
3. **Sprint 3 (CRM Leads Pipeline & Staff Management):**
   - CRM Leads collection, batch assignment logic, capacity checks, and phone masking.
   - Employee directory, permission matrices, and force-logout token invalidation.
4. **Sprint 4 (Matchmaking & Astrological Engine):**
   - Ashtakoota 36-Guna calculation engine & Kuja Manglik Dosha evaluator.
   - Symmetrical pairKey match persistence, matchmaker review workflows, and mutual interest state machine.
   - Keyset cursor pagination for high-volume candidate recommendation feeds.
5. **Sprint 5 (Billing, Subscriptions & Telephony):**
   - Membership plans CRUD, Razorpay webhook & order verification, Transaction ledger.
   - Dual-authorization refund workflow and manual plan entitlement.
   - Exotel click-to-call integration and mandatory call disposition enforcement.
6. **Sprint 6 (Engagement, Safety & Audit Compliance):**
   - Marketing campaigns, festival offers, and in-app popup targeting.
   - Abuse reports desk, automated blacklist prevention for phone/device hashes.
   - Immutable audit logging on all sensitive operations.

---
*Document Version: 1.2.0 — Production Blueprint for Sindhi Matrimony Backend Engineering Team.*
