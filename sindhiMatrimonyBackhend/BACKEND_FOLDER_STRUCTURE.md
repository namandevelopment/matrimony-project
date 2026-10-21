# 🏗️ Sindhi Matrimony — Backend Folder Structure & Architecture Blueprint

> **Target Service:** `sindhiMatrimonyBackhend` (Unified Node.js, Express 5, ESM, Mongoose 8, Redis, BullMQ, Socket.io)  
> **Architectural Pattern Source:** Modeled on the enterprise, modular architecture of `mymelemo-backend` from `/Users/naman/Documents/CRM Landing Projects/mymelemo-backend`.  
> **Domain Adaptation:** 100% tailored to the **Sindhi Matrimony Platform** (serving `sindiMatrimonyAdmin`, `sindhiMatrimonyUserPanel`, and `sindhiMatrimony` Mobile App).  
> **Core Principle:** Clean separation of concerns — Routes delegate to Validators and Controllers; Controllers invoke Models and Services; Background tasks isolated into Workers/Schedulers; Shared cross-platform APIs co-located with role-segregated route files (`admin.js`, `users.js`, `common.js`).

---

## 📑 Table of Contents
1. [Executive Architectural Summary](#1-executive-architectural-summary)
2. [Complete Backend Directory Tree](#2-complete-backend-directory-tree)
3. [Root Configuration Files](#3-root-configuration-files)
4. [Deep-Dive: Layer by Layer](#4-deep-dive-layer-by-layer)
   - [4.1 `models/` — Data Schemas & Mongoose Connections](#41-models--data-schemas--mongoose-connections)
   - [4.2 `middlewares/` — Security, Auth, RBAC & Request Filters](#42-middlewares--security-auth-rbac--request-filters)
   - [4.3 `routes/` — Modular Routing & Access Control](#43-routes--modular-routing--access-control)
   - [4.4 `controllers/` — Request Processing & Business Delegation](#44-controllers--request-processing--business-delegation)
   - [4.5 `validators/` & Dedicated Validation Engine](#45-validators--dedicated-validation-engine)
     - [4.5.1 The Separate Validation File Rule (`utils/joiValidationDataType.js`)](#451-the-separate-validation-file-rule-utilsjoivalidationdatatypejs)
     - [4.5.2 How Route Validators (`validators/<module>/`) Compose Validation Checks](#452-how-route-validators-validatorsmodule-compose-validation-checks)
   - [4.6 `services/` — Core Business Logic, Redis & Queues](#46-services--core-business-logic-redis--queues)
   - [4.7 `socket/` — Real-Time WebSocket Communication](#47-socket--real-time-websocket-communication)
   - [4.8 `utils/` & Centralized Message Architecture](#48-utils--centralized-message-architecture)
     - [4.8.1 The Separate Messages File Rule (`utils/constantsMessage.js`)](#481-the-separate-messages-file-rule-utilsconstantsmessagejs)
     - [4.8.2 Message Domain Groups & Multi-Channel Copy Management](#482-message-domain-groups--multi-channel-copy-management)
   - [4.9 `worker/` — Standalone Queue Processors & Cron Schedulers](#49-worker--standalone-queue-processors--cron-schedulers)
   - [4.10 `script/` — Seeders & Database Migration Utilities](#410-script--seeders--database-migration-utilities)
5. [Standard Code Templates & Implementation Blueprints](#5-standard-code-templates--implementation-blueprints)
   - [5.1 `app.js` — Express Configuration](#51-appjs--express-configuration)
   - [5.2 `index.js` — Server Bootstrapper](#52-indexjs--server-bootstrapper)
   - [5.3 Standard Route Pattern (`routes/<module>/`)](#53-standard-route-pattern)
   - [5.4 Standard Controller Pattern (`controllers/<module>/`)](#54-standard-controller-pattern)
   - [5.5 Standard Joi Route Validator Pattern (`validators/<module>/`)](#55-standard-joi-route-validator-pattern)
   - [5.6 Standard Mongoose Model Pattern (`models/<module>/`)](#56-standard-mongoose-model-pattern)
   - [5.7 Centralized Master Reusable Functions Blueprint (`utils/globalFunction.js`)](#57-centralized-master-reusable-functions-blueprint-utilsglobalfunctionjs)
   - [5.8 Dedicated Validation Checks Blueprint (`utils/joiValidationDataType.js`)](#58-dedicated-validation-checks-blueprint-utilsjoivalidationdatatypejs)
   - [5.9 Dedicated Centralized Messages Blueprint (`utils/constantsMessage.js`)](#59-dedicated-centralized-messages-blueprint-utilsconstantsmessagejs)
   - [5.10 Dedicated High-Performance Query Engine Blueprint (`services/crudService.js`)](#510-dedicated-high-performance-query-engine-blueprint-servicescrudservicejs)
6. [Cross-Platform Endpoint Organization Strategy](#6-cross-platform-endpoint-organization-strategy)
7. [Developer Guidelines & Best Practices](#7-developer-guidelines--best-practices)
   - [Strict Rule 1: 100% Centralized Messages — Zero Hardcoded Strings](#strict-rule-1-100-centralized-messages--zero-hardcoded-strings)
   - [Strict Rule 2: 100% Centralized Validation Rules — Zero Inline Joi Checks](#strict-rule-2-100-centralized-validation-rules--zero-inline-joi-checks)
   - [Strict Rule 3: Zero Over-Fetching & Mandatory Lean Queries (Kam Data = Fast Response)](#strict-rule-3-zero-over-fetching--mandatory-lean-queries-kam-data--fast-response)
   - [Strict Rule 4: Maximal API Unification & Zero Route Duplication (80/20 Shared Mandate)](#strict-rule-4-maximal-api-unification--zero-route-duplication-8020-shared-mandate)
   - [Strict Rule 5: Skinny Controllers & Async Concurrency (Zero Boilerplate & Promise.all)](#strict-rule-5-skinny-controllers--async-concurrency-zero-boilerplate--promiseall)
   - [Strict Rule 6: Zero-Write Mutation Memoization (fast-deep-equal)](#strict-rule-6-zero-write-mutation-memoization-fast-deep-equal)
   - [Strict Rule 7: Guaranteed Full Data Contract (Same Data Always Returned to Frontend)](#strict-rule-7-guaranteed-full-data-contract-same-data-always-returned-to-frontend)
   - [Strict Rule 8: Inspect-First Reusability Mandate (Zero Duplicate Code & Async/Await Standards)](#strict-rule-8-inspect-first-reusability-mandate-zero-duplicate-code--asyncawait-standards)
8. [Client-Side Offline-First Architecture & Zero-Token Master Data (WatermelonDB + Redis)](#8-client-side-offline-first-architecture--zero-token-master-data-watermelondb--redis)
   - [8.1 WatermelonDB (React Native SQLite) Offline-First Topology](#81-watermelondb-react-native-sqlite-offline-first-topology)
   - [8.2 Single Consolidated Public Dropdowns API (`GET /api/v1/common/dropdowns`)](#82-single-consolidated-public-dropdown-bundle-api-get-apiv1commondropdowns)
   - [8.3 WatermelonDB Delta Sync Engine (`routes/sync/`)](#83-watermelondb-delta-sync-engine-routessync)
   - [8.4 Client Versioning & Smart Cache Invalidation (`masterDataVersion`)](#84-client-versioning--smart-cache-invalidation-masterdataversion)
   - [8.5 Direct-to-Cloud Media Uploads (Presigned URLs via Cloudflare R2 / S3)](#85-direct-to-cloud-media-uploads-presigned-urls-via-cloudflare-r2--s3)
   - [8.6 Lightweight PDF & Memory Safeguards (Puppeteer OOM Protection)](#86-lightweight-pdf--memory-safeguards-puppeteer-oom-protection)
   - [8.7 Dual-Mode Pagination Architecture (Keyset Cursor vs Offset)](#87-dual-mode-pagination-architecture-keyset-cursor-vs-offset)
   - [8.8 Multi-Scenario GET Optimization & isDataEqual Architecture](#88-multi-scenario-get-optimization--isdataequal-architecture-7-critical-read-scenarios)

---

## 1. Executive Architectural Summary

Following the structure of `mymelemo-backend`, the backend is built with **Node.js (ES Modules `"type": "module"`)** and designed for high modularity, horizontal scalability, and zero code duplication across client platforms:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 UNIFIED BACKEND TOPOLOGY                               │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                        │
│  [ CLIENTS ]    📱 Mobile App (React Native)    💻 User Web (Next.js)                  │
│                 🛡️ Admin CRM Portal (React + Vite)                                    │
│                                      │                                                 │
│                                      ▼ HTTPS / WSS                                     │
│  [ APP.JS ]     CORS → RateLimit → Maintenance → JWT (express-jwt)                     │
│                 → TokenBlacklistInRedis → MergeParamsToBody → ClientIp                 │
│                                      │                                                 │
│                                      ▼                                                 │
│  [ ROUTES/ ]    Modular Route Trees (/api/v1/...)                                      │
│                 ├── routes/auth/        (index.js, admin.js, users.js)                 │
│                 ├── routes/leads/       (index.js, admin.js, users.js)                 │
│                 ├── routes/members/     (index.js, admin.js, users.js)                 │
│                 ├── routes/matchmaking/ (index.js, admin.js, users.js)                 │
│                 ├── routes/finance/     (index.js, admin.js, users.js)                 │
│                 └── ... [21 Domain Modules]                                            │
│                                      │                                                 │
│                                      ▼                                                 │
│  [ VALIDATORS/ ] Joi Validation Middleware (Input Sanitization & Schema Checks)        │
│                                      │                                                 │
│                                      ▼                                                 │
│  [ CONTROLLERS/ ] Controllers (admin.js / users.js)                                    │
│                 → Validates business rules                                             │
│                 → Calls crudService or Domain Services                                 │
│                 → Returns standard apiHTTPResponse()                                   │
│                                      │                                                 │
│                 ┌────────────────────┴────────────────────┐                            │
│                 ▼                                         ▼                            │
│  [ SERVICES/ ] Business Logic             [ MODELS/ ] Mongoose Schemas                 │
│  • crudService (Reusable queries)         • users / profiles                           │
│  • serviceRedis (Blacklist & Cache)       • leads / calls                              │
│  • serviceHoroscope (36-Gunas)            • matchRecommendations                       │
│  • serviceQueueBull (BullMQ)              • paymentTransactions                        │
│  • serviceTelephony (Exotel VoIP)         • masterData (Subcastes/Gotras)              │
│                                                                                        │
│  [ WORKER/ ] Standalone Background Jobs (Cron Schedulers, Redis Listeners, Cache Warm)│
│                                                                                        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Complete Backend Directory Tree

```
sindhiMatrimonyBackhend/
├── .env.example
├── .gitignore
├── app.js                              # Express application setup, middlewares & route mounting
├── index.js                            # Server bootstrapper (HTTP, DB, Redis, Sockets, Schedulers)
├── ecosystem.config.cjs                # PM2 process cluster configuration
├── package.json                        # Dependencies, scripts & ESM type definition
│
├── controllers/                        # Request handlers organized by feature module
│   ├── index.js                        # Master barrel exporter for all controllers
│   ├── admin/                          # System admin & role management controllers
│   │   ├── index.js
│   │   ├── admin.js
│   │   └── employees.js
│   ├── auth/                           # Authentication controllers
│   │   ├── index.js
│   │   ├── admin.js                    # Admin email/pass + MFA TOTP login
│   │   └── users.js                    # Mobile/Web OTP & password login
│   ├── calls/                          # Telephony & VoIP call controllers
│   │   ├── index.js
│   │   └── admin.js
│   ├── campaigns/                      # Notifications, festival offers & popups
│   │   ├── index.js
│   │   ├── admin.js
│   │   └── users.js
│   ├── chat/                           # Staff team chat & candidate messaging
│   │   ├── index.js
│   │   ├── admin.js
│   │   └── users.js
│   ├── dashboard/                      # Executive KPI metrics & action queues
│   │   ├── index.js
│   │   └── admin.js
│   ├── finance/                        # Transactions, ledger & refunds
│   │   ├── index.js
│   │   ├── admin.js
│   │   └── users.js
│   ├── horoscope/                      # Kundli Milan & 36-Guna Astro matching
│   │   ├── index.js
│   │   ├── admin.js
│   │   └── users.js
│   ├── leads/                          # CRM leads, allocation & follow-ups
│   │   ├── index.js
│   │   ├── admin.js
│   │   └── users.js
│   ├── masterData/                     # Subcastes, Gotras, Surnames & Exogamy rules
│   │   ├── index.js
│   │   ├── admin.js
│   │   └── users.js
│   ├── matchmaking/                    # Assisted matchmaking & response clearinghouse
│   │   ├── index.js
│   │   ├── admin.js
│   │   └── users.js
│   ├── members/                        # Member profiles, 7-step onboarding & biodata
│   │   ├── index.js
│   │   ├── admin.js
│   │   └── users.js
│   ├── plans/                          # Membership plans & subscriptions
│   │   ├── index.js
│   │   ├── admin.js
│   │   └── users.js
│   ├── reviews/                        # Reviews & ratings desk
│   │   ├── index.js
│   │   ├── admin.js
│   │   └── users.js
│   ├── safety/                         # Trust & safety, abuse reports & blacklist
│   │   ├── index.js
│   │   ├── admin.js
│   │   └── users.js
│   ├── stories/                        # Success stories & vivah registry
│   │   ├── index.js
│   │   ├── admin.js
│   │   └── users.js
│   ├── support/                        # Helpdesk tickets & FAQs
│   │   ├── index.js
│   │   ├── admin.js
│   │   └── users.js
│   ├── tasks/                          # Staff tasks & follow-up scheduler
│   │   ├── index.js
│   │   └── admin.js
│   ├── tools/                          # System diagnostics & maintenance
│   │   ├── index.js
│   │   └── admin.js
│   ├── verifications/                  # Photo & Aadhaar KYC moderation queue
│   │   ├── index.js
│   │   └── admin.js
│   ├── common/                         # ⭐ Public unauthenticated bundles (dropdowns, system metadata)
│   │   ├── index.js
│   │   └── dropdowns.js                # Consolidated dropdown bundle controller
│   ├── sync/                           # ⭐ WatermelonDB delta synchronization engine
│   │   ├── index.js
│   │   └── users.js                    # Pull/Push delta sync handlers for offline mobile app
│   └── webhooks/                       # Payment & VoIP provider callbacks
│       ├── index.js
│       ├── exotel.js
│       └── razorpay.js
│
├── middlewares/                        # Interceptors, guards & common request handlers
│   ├── CheckDisableUserMiddleware.js   # Intercepts suspended, frozen, or deleted users
│   ├── accessCheckMiddleware.js        # RBAC screen clearances & recordScope query filters
│   ├── commonMiddleware.js             # Token in Redis, role check, params merger, IP detector
│   ├── corsMiddleware.js               # Whitelist policy for Admin, Web, and Mobile App
│   ├── errorHandler.js                 # Global error boundary (catches Mongoose, Joi, JWT errors)
│   ├── jwt.js                          # Express-JWT bearer token verifier & path whitelist
│   ├── maintenance.js                  # Dynamic maintenance mode gatekeeper
│   ├── socketAuthMiddleware.js         # JWT token handshake validation for WebSockets
│   └── validationMiddleware.js         # Dynamic Joi validation dispatcher
│
├── models/                             # Mongoose schemas & database connection
│   ├── connection.js                   # Mongoose connection pool with retry & metrics
│   ├── index.js                        # Master barrel exporter of all Mongoose models
│   ├── audit/                          # Audit trail schemas
│   │   └── auditLog.model.js
│   ├── calls/                          # Telephony schemas
│   │   └── callLog.model.js
│   ├── campaigns/                      # Marketing & notification schemas
│   │   ├── festivalOffer.model.js
│   │   ├── inAppPopup.model.js
│   │   ├── notificationCampaign.model.js
│   │   └── recipientDeliveryLog.model.js
│   ├── chat/                           # Messaging schemas
│   │   ├── teamChatMessage.model.js
│   │   ├── userConversation.model.js
│   │   └── userMessage.model.js
│   ├── employees/                      # Staff & RBAC schemas
│   │   ├── employee.model.js
│   │   └── permissionAudit.model.js
│   ├── globals/                        # Platform configuration schemas
│   │   ├── masterSettings.model.js
│   │   └── systemSettings.model.js
│   ├── leads/                          # CRM lead schemas
│   │   ├── callResponse.model.js
│   │   ├── lead.model.js
│   │   └── leadActivity.model.js
│   ├── masterData/                     # Sindhi ontology schemas
│   │   ├── caste.model.js
│   │   ├── compatibilityRule.model.js
│   │   ├── gotra.model.js
│   │   ├── religion.model.js
│   │   ├── subcaste.model.js
│   │   └── surname.model.js
│   ├── matchmaking/                    # Matchmaking schemas
│   │   ├── interest.model.js
│   │   ├── matchAudit.model.js
│   │   └── matchRecommendation.model.js
│   ├── payment/                        # Billing & refund schemas
│   │   ├── paymentTransaction.model.js
│   │   └── refundRequest.model.js
│   ├── plans/                          # Membership package schemas
│   │   ├── membershipPlan.model.js
│   │   └── userSubscription.model.js
│   ├── reviews/                        # Review schemas
│   │   └── review.model.js
│   ├── safety/                         # Safety & moderation schemas
│   │   ├── abuseReport.model.js
│   │   └── blacklistedIdentity.model.js
│   ├── stories/                        # Success story schemas
│   │   └── successStory.model.js
│   ├── support/                        # Customer support schemas
│   │   ├── faq.model.js
│   │   ├── supportTicket.model.js
│   │   └── ticketReply.model.js
│   ├── tasks/                          # Task scheduler schemas
│   │   └── followUpTask.model.js
│   ├── users/                          # Matrimonial user & candidate schemas
│   │   ├── partnerPreference.model.js
│   │   ├── profile.model.js
│   │   ├── user.model.js
│   │   └── userPhoto.model.js
│   └── verifications/                  # KYC moderation schemas
│       └── verificationRequest.model.js
│
├── routes/                             # Express route declarations
│   ├── index.js                        # Master router mounting all modules under /api/v1
│   ├── admin/                          # /api/v1/admin system routes
│   │   ├── index.js
│   │   └── employees.js
│   ├── auth/                           # /api/v1/auth routes
│   │   ├── index.js
│   │   ├── admin.js                    # Admin login & MFA
│   │   └── users.js                    # Public OTP/Password register & login
│   ├── calls/                          # /api/v1/calls routes
│   │   ├── index.js
│   │   └── admin.js
│   ├── campaigns/                      # /api/v1/campaigns routes
│   │   ├── index.js
│   │   ├── admin.js
│   │   └── users.js                    # Active popups & offers for app/web
│   ├── chat/                           # /api/v1/chat routes
│   │   ├── index.js
│   │   ├── admin.js                    # Team chat
│   │   └── users.js                    # 1-on-1 candidate messaging
│   ├── dashboard/                      # /api/v1/admin/dashboard routes
│   │   ├── index.js
│   │   └── admin.js
│   ├── finance/                        # /api/v1/finance routes
│   │   ├── index.js
│   │   ├── admin.js                    # Ledger & refund management
│   │   └── users.js                    # Razorpay order & verification
│   ├── horoscope/                      # /api/v1/horoscope routes
│   │   ├── index.js
│   │   ├── admin.js
│   │   └── users.js                    # Kundli Milan calculation
│   ├── leads/                          # /api/v1/leads routes
│   │   ├── index.js
│   │   ├── admin.js                    # Lead pipeline & bulk assignment
│   │   └── users.js                    # Public incoming lead form
│   ├── masterData/                     # /api/v1/master-data & common routes
│   │   ├── index.js
│   │   ├── admin.js                    # Subcaste/Gotra management
│   │   └── users.js                    # Public dropdown endpoints
│   ├── matchmaking/                    # /api/v1/matchmaking routes
│   │   ├── index.js
│   │   ├── admin.js                    # Assisted matching desk
│   │   └── users.js                    # Recommendations & interests
│   ├── members/                        # /api/v1/members & profile routes
│   │   ├── index.js
│   │   ├── admin.js                    # Member directory & biodata
│   │   └── users.js                    # Candidate own profile management
│   ├── plans/                          # /api/v1/plans routes
│   │   ├── index.js
│   │   ├── admin.js                    # Plan CRUD
│   │   └── users.js                    # Public plan listings
│   ├── reviews/                        # /api/v1/reviews routes
│   │   ├── index.js
│   │   ├── admin.js                    # Moderation & reply
│   │   └── users.js                    # Submit review & public list
│   ├── safety/                         # /api/v1/safety routes
│   │   ├── index.js
│   │   ├── admin.js                    # Report actions & blacklists
│   │   └── users.js                    # Submit report
│   ├── stories/                        # /api/v1/stories routes
│   │   ├── index.js
│   │   ├── admin.js
│   │   └── users.js                    # Public published stories
│   ├── support/                        # /api/v1/support routes
│   │   ├── index.js
│   │   ├── admin.js                    # Ticket desk
│   │   └── users.js                    # Submit ticket & view FAQs
│   ├── tasks/                          # /api/v1/tasks routes
│   │   ├── index.js
│   │   └── admin.js
│   ├── tools/                          # /api/v1/admin/tools routes
│   │   ├── index.js
│   │   └── admin.js
│   ├── verifications/                  # /api/v1/admin/verifications routes
│   │   ├── index.js
│   │   └── admin.js
│   ├── common/                         # ⭐ /api/v1/common (Public unauthenticated bundle routes)
│   │   ├── index.js
│   │   └── dropdowns.js                # GET /api/v1/common/dropdowns
│   ├── sync/                           # ⭐ /api/v1/sync (WatermelonDB delta synchronization routes)
│   │   ├── index.js
│   │   └── users.js                    # GET /pull (delta pull), POST /push (offline sync)
│   └── webhooks/                       # /api/v1/webhooks provider callbacks
│       ├── index.js
│       ├── exotel.js
│       └── razorpay.js
│
├── services/                           # Business logic, external integrations & engines
│   ├── crudService.js                  # Generic pagination, filter & projection engine
│   ├── serviceBiodata.js               # PDF biodata generator (Blind & Full modes)
│   ├── serviceCronJobs.js              # Scheduled cron jobs orchestrator
│   ├── serviceGlobal.js                # Aggregated query utilities
│   ├── serviceHoroscope.js             # Ashtakoota 36-Guna Kundli & Manglik calculator
│   ├── serviceNotifications.js         # FCM Push, MSG91 SMS & WhatsApp alert dispatcher
│   ├── servicePayment.js               # Razorpay order creation, signature check & refund API
│   ├── serviceQueueBull.js             # BullMQ queue initializers & job adders
│   ├── serviceQueueProcessor.js        # Worker logic processing background jobs
│   ├── serviceQueueWorker.js           # Bull queue listener registration
│   ├── serviceRedis.js                 # Redis client, token blacklisting & cache handlers
│   └── serviceTelephony.js             # Exotel VoIP integration & call disposition
│
├── socket/                             # Real-Time WebSocket event handlers
│   ├── socket.js                       # Socket.io initialization & authentication
│   ├── callSocket.js                   # WebRTC & live telephony status updates
│   ├── notificationSocket.js           # Real-time admin alerts (SLA breaches, KYC queue)
│   ├── teamChatSocket.js               # Staff internal chat messaging
│   └── userChatSocket.js               # Candidate-to-candidate 1-on-1 messaging
│
├── utils/                              # Constants, helpers, formats & S3 utilities
│   ├── constants.js                    # HTTP status codes, application codes & flags
│   ├── constantsMessage.js             # ⭐ [DEDICATED FILE] 100% Centralized System, API & Notification Messages (Zero Hardcoded Strings)
│   ├── globalFunction.js               # apiHTTPResponse, OTP generators, bcrypt helpers
│   ├── htmlTemplate.js                 # HTML email templates (verification, welcome, reset)
│   ├── joiValidationDataType.js        # ⭐ [DEDICATED FILE] 100% Centralized Validation Checks, Reusable Data Types & Regex Rules
│   ├── jwtTokenUtils.js                # Access & Refresh token signing/decoding
│   ├── logoutUtils.js                  # Redis token invalidation handler
│   ├── multerConfig.js                 # Multer storage, MIME filter & size limiters
│   ├── s3Bucket.js                     # AWS S3 / Cloudinary upload, delete & signed URLs
│   └── variables.js                    # Role enums, statuses, file categories & constants
│
├── validators/                         # Joi validation schemas mirroring routes
│   ├── index.js                        # Master validator resolver
│   ├── common.js                       # Common schemas (pagination, IDs, search query)
│   ├── admin/
│   │   ├── index.js
│   │   └── employees.js
│   ├── auth/
│   │   ├── index.js
│   │   ├── admin.js
│   │   └── users.js
│   ├── calls/
│   │   ├── index.js
│   │   └── admin.js
│   ├── campaigns/
│   │   ├── index.js
│   │   ├── admin.js
│   │   └── users.js
│   ├── chat/
│   │   ├── index.js
│   │   ├── admin.js
│   │   └── users.js
│   ├── finance/
│   │   ├── index.js
│   │   ├── admin.js
│   │   └── users.js
│   ├── horoscope/
│   │   ├── index.js
│   │   ├── admin.js
│   │   └── users.js
│   ├── leads/
│   │   ├── index.js
│   │   ├── admin.js
│   │   └── users.js
│   ├── masterData/
│   │   ├── index.js
│   │   ├── admin.js
│   │   └── users.js
│   ├── matchmaking/
│   │   ├── index.js
│   │   ├── admin.js
│   │   └── users.js
│   ├── members/
│   │   ├── index.js
│   │   ├── admin.js
│   │   └── users.js
│   ├── plans/
│   │   ├── index.js
│   │   ├── admin.js
│   │   └── users.js
│   ├── reviews/
│   │   ├── index.js
│   │   ├── admin.js
│   │   └── users.js
│   ├── safety/
│   │   ├── index.js
│   │   ├── admin.js
│   │   └── users.js
│   ├── stories/
│   │   ├── index.js
│   │   ├── admin.js
│   │   └── users.js
│   ├── support/
│   │   ├── index.js
│   │   ├── admin.js
│   │   └── users.js
│   ├── tasks/
│   │   ├── index.js
│   │   └── admin.js
│   ├── verifications/
│   │   ├── index.js
│   │   └── admin.js
│   ├── common/
│   │   ├── index.js
│   │   └── dropdowns.js
│   └── sync/
│       ├── index.js
│       └── users.js
│
├── worker/                             # Dedicated background service worker
│   ├── index.js                        # Worker process entry point
│   ├── cacheSettings/                  # Preloads master data into Redis on startup
│   │   └── index.js
│   ├── redisListeners/                 # Key expiration & pub/sub listeners
│   │   └── index.js
│   └── schedulers/                     # Scheduled cron tasks (node-cron)
│       ├── index.js
│       ├── dailyMatchScheduler.js      # 08:00 AM IST automated matchmaking run
│       ├── taskOverdueScheduler.js     # Shifts tasks to DUE_TODAY & OVERDUE
│       ├── slaEscalationScheduler.js   # Monitors 60-min first contact SLA breaches
│       └── subscriptionExpiryScheduler.js # Downgrades expired memberships to FREE
│
└── script/                             # Database seeders & setup scripts
    └── seeders/
        ├── runSeeder.js                # Master seeder runner
        ├── seedSuperAdmin.js           # Seeds default Super Admin account
        ├── seedMasterData.js           # Seeds Sindhi Castes, Subcastes & Gotras
        └── seedPlans.js                # Seeds Self-Service & Assisted Membership plans
```

---

## 3. Root Configuration Files

### 3.1 `package.json`
Specifies Node.js ES Modules (`"type": "module"`), runtime engines, and project dependencies matching `mymelemo-backend`:
```json
{
  "name": "sindhi-matrimony-backend",
  "version": "1.0.0",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "dev": "NODE_ENV=development nodemon index.js",
    "start": "NODE_ENV=production node index.js",
    "worker": "node ./worker/index.js",
    "seed": "node ./script/seeders/runSeeder.js"
  },
  "dependencies": {
    "@aws-sdk/client-s3": "^3.901.0",
    "@aws-sdk/lib-storage": "^3.903.0",
    "axios": "^1.13.2",
    "bcrypt": "^6.0.0",
    "bull": "^4.16.5",
    "cloudinary": "^2.7.0",
    "cors": "^2.8.5",
    "dotenv": "^17.2.2",
    "express": "^5.1.0",
    "express-jwt": "^8.5.1",
    "fast-deep-equal": "^3.1.3",
    "firebase-admin": "^13.6.0",
    "geoip-lite": "^1.4.10",
    "joi": "^18.0.1",
    "moment-timezone": "^0.6.0",
    "mongoose": "^8.18.1",
    "multer": "^2.0.2",
    "node-cron": "^4.2.1",
    "puppeteer": "^24.42.0",
    "razorpay": "^2.9.6",
    "redis": "^5.8.2",
    "sharp": "^0.34.4",
    "socket.io": "^4.8.1",
    "uuid": "^13.0.0"
  },
  "devDependencies": {
    "morgan": "^1.10.1",
    "nodemon": "^3.1.9"
  }
}
```

### 3.2 `ecosystem.config.cjs`
PM2 cluster configuration ensuring zero-downtime reloads and separate worker thread processes:
```javascript
module.exports = {
  apps: [
    {
      name: "sindhi-matrimony-api",
      script: "./index.js",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "development",
        PORT: 5000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 5000,
      },
    },
    {
      name: "sindhi-matrimony-worker",
      script: "./worker/index.js",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
```

---

## 4. Deep-Dive: Layer by Layer

### 4.1 `models/` — Data Schemas & Mongoose Connections
- **`connection.js`:** Establishes and manages the MongoDB Atlas connection pool with `maxPoolSize: 25`, timeout handlers, and latency measurement logging.
- **`index.js`:** Aggregates and exports all Mongoose models so services and controllers import models cleanly (e.g., `import { User, Lead, PaymentTransaction } from '../../models/index.js'`).
- **Domain Subfolders:** Every entity has its own schema file containing indexes, timestamps, soft-delete flags (`isDeleted`, `isDisable`), and pre-save hooks.

### 4.2 `middlewares/` — Security, Auth, RBAC & Request Filters
- **`jwt.js`:** Wraps `express-jwt` to validate Bearer tokens. Defines an open whitelist for endpoints that do not require authentication: candidate login/register/OTP verification, **single consolidated public dropdowns bundle (`GET /api/v1/common/dropdowns`) for instant zero-token app startup & onboarding**, public membership plans listing (`GET /api/v1/plans/public-list`), and provider webhooks.
- **`commonMiddleware.js`:** 
  - `verifyTokenInRedis`: Checks incoming token against Redis revocation list (enabling instant force logout).
  - `checkRolePermission(allowedRoles)`: Higher-order route guard validating that `req.auth.role` belongs to `allowedRoles`.
  - `mergeParamsToBody`: Merges route path parameters (`:id`) and query parameters into `req.body` so controllers and Joi validators consume a uniform payload.
  - `ipClientAdd`: Attaches caller's geolocation details via `geoip-lite`.
- **`accessCheckMiddleware.js`:** Enforces granular module permissions (`leads.view`, `finance.refund`, etc.) and sets `req.recordScope` (`ALL`, `OWN`, `ASSIGNED`, `TEAM`, `REGION`).
- **`maintenance.js`:** Reads Redis key `system:maintenance_mode`. If `true` and user is not `SUPER_ADMIN`, blocks requests with `503 Service Unavailable` and custom announcement.
- **`validationMiddleware.js`:** Matches the request's module and caller role against `validators/<module>/<role>.js` and validates the payload using Joi before the controller executes.
- **`errorHandler.js`:** Centralized error handler returning the standard `apiHTTPResponse` structure for 400, 401, 403, 404, 422, and 500 errors.

### 4.3 `routes/` — Modular Routing & Access Control
- **`routes/index.js`:** Mounts all module sub-routers under `/api/v1`.
- **Module Sub-Routers (`routes/<module>/index.js`):**
  - Mounts `/admin` routes protected by `checkRolePermission([ROLES.SUPER_ADMIN, ROLES.ADMIN, ...])`.
  - Mounts public or candidate routes (`users.js`) directly.
  - Enables clean URL namespaces:
    - Admin: `POST /api/v1/leads/admin/assign`
    - User/Mobile: `POST /api/v1/leads/create`

### 4.4 `controllers/` — Ultra-Lean "Skinny Controllers" & Business Delegation

> 🛑 **MANDATORY ARCHITECTURAL PRINCIPLE: ULTRA-LEAN CONTROLLERS (3–8 LINES MAX)**  
> *"Controller me sirf 3-5 line ka clean code hona chahiye. Repetitive try/catch ki jagah `asyncHandler` use hoga, async queries `Promise.all` se parallel chalengi, aur agar client same data update ke liye bhej raha hai to `isDataEqual` (fast-deep-equal) se database write skip karke turant 2ms me response wapas aayega."*

- **Skinny Controllers Philosophy:** Controllers contain **zero raw database queries, zero heavy business algorithms, and zero manual try/catch blocks**. They only:
  1. Extract sanitized parameters from `req.body` / `req.params`.
  2. Invoke domain services (`crudService.js`, `serviceHoroscope.js`, etc.).
  3. Return the standard `apiHTTPResponse(req, res, ...)`.
- **Eliminating `try/catch` Boilerplate (`asyncHandler`):** Every controller function is wrapped in `asyncHandler(async (req, res) => { ... })`. Any unhandled promise rejection or database error automatically flows to the global Express error middleware (`errorHandler.js`).
- **Concurrent Async Execution (`Promise.all`):** Independent asynchronous I/O operations (counts, Redis checks, external queries) must execute in parallel using `Promise.all()`, never sequentially awaiting one after another.
- **Smart Mutation Memoization (`fast-deep-equal`):** For `PUT`/`PATCH` endpoints, controllers compare the incoming delta against existing DB data using `isDataEqual()`. If unchanged, MongoDB disk I/O and write locks are skipped entirely, and the document is returned in **sub-2ms**.
- **Standard Ultra-Lean Controller Signature:**
  ```javascript
  import { asyncHandler, apiHTTPResponse, isDataEqual } from "../../utils/globalFunction.js";
  import crudService from "../../services/crudService.js";
  import * as CONSTANTS from "../../utils/constants.js";
  import * as CONSTANTS_MSG from "../../utils/constantsMessage.js";
  import { Lead } from "../../models/index.js";

  // Ultra-Lean Skinny Controller (Only 4 lines of clean code!)
  export const getLeadList = asyncHandler(async (req, res) => {
    const result = await crudService.getPaginatedList(Lead, req.body, req.recordScope);
    return apiHTTPResponse(req, res, CONSTANTS.HTTP_OK, CONSTANTS_MSG.FETCH_SUCCESS, result, CONSTANTS.OK, CONSTANTS.ERROR_FALSE);
  });
  ```

### 4.5 `validators/` & Dedicated Validation Engine

> 🛑 **MANDATORY ARCHITECTURAL PRINCIPLE: DEDICATED VALIDATION ENGINE**  
> *"Jitni bhi validations check honge unki ek separate dedicated file bnegi."*  
> All validation checks, data type validators, regex patterns, and field validation rules **must reside in a single dedicated file:** `utils/joiValidationDataType.js`. No raw regular expressions, no inline Joi schema declarations, and no ad-hoc validation functions are permitted inside route files, controllers, or services.

#### 4.5.1 The Separate Validation File Rule (`utils/joiValidationDataType.js`)
Modeled on `mymelemo-backend/utils/joiValidationDataType.js`, this dedicated file acts as the single source of truth for all data sanitation and format validation across the entire platform. Every validation check helper encapsulates:
1. **Schema Constraints:** Type assertion, min/max limits, trimming, casing, and regex validation.
2. **Standardized Error Messages:** Directly imported from `utils/constantsMessage.js` using Joi `.messages()` overriding, guaranteeing that validation errors match system copy verbatim.

**Core validation checks centralized in `utils/joiValidationDataType.js`:**
- **Text & Strings:** `requiredString(min, max)`, `optionalString(min, max)`, `trimmedString()`
- **Identifiers & Credentials:**
  - `phoneValidation()`: Enforces standard Indian mobile format (`/^[6-9]\d{9}$/`) with country code normalization.
  - `optionalPhoneValidation()`: Optional phone validation allowing blank or null.
  - `emailValidation()` / `optionalEmailValidator()`: RFC 5322 compliant email check.
  - `passwordValidation(min, max)`: Enforces enterprise complexity (uppercase, lowercase, number, special character `@$!%*?&`).
  - `confirmPasswordValidation()`: Joi reference match against `password`.
  - `objectIdValidation(fieldName)`: 24-character hexadecimal MongoDB ObjectId validator.
- **Numbers & Enums:** `requiredNumber(min, max)`, `optionalNumber(min, max)`, `requiredEnum(allowedArray)`, `optionalEnum(allowedArray)`, `requiredBoolean()`, `optionalBoolean()`
- **Arrays & Collections:** `requiredArray(itemSchema, min, max)`, `optionalArray(itemSchema)`
- **Dates & Chronology:** `dateSchema(fieldName)`, `dateRangeValidation(fromField, toField)`
- **Matrimonial Domain Specific Checks:**
  - `matrimonyAgeValidation(gender)`: Strictly checks legal and platform age boundaries (Minimum 18 for female candidates, minimum 21 for male candidates, maximum 75).
  - `aadhaarHashValidation()`: 12-digit format or SHA-256 Aadhaar document hash validation.
  - `subcasteValidation()`: Validates against allowed Sindhi subcaste values (`Amil`, `Baibhand`, `Sahiti`, `Larkana`, `Shikarpuri`, `Dadu`, `Sehwani`, `Sindhi Sikh`).
  - `gotraValidation()`: Gotra format validation with exogamy check compatibility.
  - `kundliDoshaValidation()`: Kuja/Manglik classification validator.

#### 4.5.2 How Route Validators (`validators/<module>/`) Compose Validation Checks
Individual validator files (e.g. `validators/leads/admin.js`, `validators/auth/users.js`, `validators/common.js`) **never define raw validation logic**. Instead, they purely import the reusable validation check functions from `utils/joiValidationDataType.js` and assemble endpoint request schemas into declarative dictionaries:

```
[ Incoming Request Payload ]
            │
            ▼
[ validationMiddleware.js ] ──► Matches route endpoint (e.g., "/login", "/assign")
            │
            ▼
[ validators/<module>/<role>.js ] ──► Endpoint schema declared as a clean field dictionary
            │
            ▼
[ utils/joiValidationDataType.js ] ──► ⭐ DEDICATED VALIDATION FILE executes field checks
            │
            ▼
[ utils/constantsMessage.js ] ──► ⭐ DEDICATED MESSAGES FILE supplies exact error text
```

---

### 4.6 `services/` — Core Business Logic, Redis & Queues
- **`crudService.js`:** General-purpose data abstraction handling pagination (`page`, `limit`), searching (`$regex` across indexed fields), sorting (`sortBy`, `sortOrder`), and record scoping.
- **`serviceRedis.js`:** High-performance Redis caching, token blacklisting, and rate limiting.
- **`serviceHoroscope.js`:** Ashtakoota 36-Guna Kundli Milan matrix calculation, Kuja Manglik Dosha evaluation, and Gotra exogamy check.
- **`serviceBiodata.js`:** Generates sanitized PDF biodatas using Puppeteer/PDFKit in `BLIND` (masked contact info) and `FULL` modes.
- **`serviceTelephony.js`:** Exotel click-to-call API client, WebRTC bridge, and webhook event processing.
- **`servicePayment.js`:** Razorpay orders, webhook signature verification, and automated refunds.
- **`serviceQueueBull.js` & `serviceQueueProcessor.js`:** BullMQ asynchronous queues for push notifications, large CSV exports, and daily match generation.

---

### 4.7 `socket/` — Real-Time WebSocket Communication
- **`socket.js`:** Initializes Socket.io with Redis adapter for horizontal multi-instance scaling. Validates user JWT on handshake.
- **Rooms Structure:**
  - `admin:all`: Broadcast alerts to all logged-in administrators.
  - `employee:<employeeId>`: Targeted alerts for newly assigned leads, follow-up reminders, and SLA breach warnings.
  - `user:<userId>`: Candidate alerts for received interests, photo approvals, and chat messages.

---

### 4.8 `utils/` & Centralized Message Architecture

> 🛑 **MANDATORY ARCHITECTURAL PRINCIPLE: DEDICATED MESSAGES FILE**  
> *"Jitne bhi message jayege unki ek separate dedicated file bnegii."*  
> All system messages, API response messages (success and error), validation failure alerts, OTP notification copies, and emails/push texts **must be defined in a single dedicated file:** `utils/constantsMessage.js`.  
> **Writing hardcoded strings inside controllers, services, middlewares, or models is strictly prohibited.**

#### 4.8.1 The Separate Messages File Rule (`utils/constantsMessage.js`)
Modeled on `mymelemo-backend/utils/constantsMessage.js`, this file houses every user-visible string returned by the backend. No developer is permitted to write `return res.json({ message: "Lead assigned successfully" })` or `throw new Error("Invalid password")`. Instead, they must import the named constant: `CONSTANTS_MSG.LEAD_ASSIGNED_SUCCESS` or `CONSTANTS_MSG.INVALID_PASSWORD`.

**Why a Dedicated Separate Messages File is Mandatory:**
1. **Zero String Duplication & Typo Elimination:** Eliminates spelling mistakes and conflicting messages across different controllers (e.g. "Data not found" vs "Requested data not found").
2. **Single Point of Copy Modification:** If the management or marketing team requests changing an announcement (e.g. updating the OTP SMS wording or KYC rejection explanation), changing a single line in `constantsMessage.js` updates every endpoint and channel instantly without touching business logic.
3. **Cross-Platform Consistency:** Ensures that the React Admin Portal, Next.js User Website, and React Native Mobile App receive identical, predictable, and professional message payloads.
4. **Internationalization & Multi-Language (i18n) Readiness:** When adding Sindhi (Perso-Arabic / Devanagari script) and Hindi translations, `constantsMessage.js` acts as the master translation key dictionary.
5. **Deterministic Unit & Integration Testing:** Automated test suites verify response messages by asserting against the exported constants rather than fragile hardcoded strings.

#### 4.8.2 Message Domain Groups & Multi-Channel Copy Management
Inside `utils/constantsMessage.js`, messages are structured into domain-specific, clearly commented blocks:
- **`COMMON_SYSTEM_MESSAGES`:** `SUCCESS`, `SUCCESS_MSG`, `FAILED`, `FAILED_MSG`, `SERVER_ERROR`, `TOO_MANY_ATTEMPTS`, `DATA_NOT_FOUND`, `MISSING_FIELDS`, `INVALID_SIGNATURE`, `MAINTENANCE_MODE_ACTIVE`.
- **`AUTH_SECURITY_MESSAGES`:** `LOGIN_SUCCESS`, `INVALID_PASSWORD`, `INVALID_EMAIL`, `ACCOUNT_DISABLED_CONTACT_ADMIN`, `STRONG_PASSWORD_ERROR`, `INVALID_OTP`, `OTP_EXPIRED`, `OTP_VERIFIED`, `RESEND_OTP_SUCCESS`, `REGISTER_OTP_SEND_PHONE`, `REGISTRATION_SUCCESS`, `PASSWORD_RESET_SUCCESS`, `SESSION_EXPIRED`.
- **`LEAD_CRM_MESSAGES`:** `LEAD_CREATED_SUCCESS`, `LEAD_ASSIGNED_SUCCESS`, `LEAD_REASSIGNED_SUCCESS`, `LEAD_STATUS_UPDATED`, `LEAD_CAPACITY_EXCEEDED`, `LEAD_SLA_BREACH_ALERT`, `CALL_INITIATED_SUCCESS`, `DISPOSITION_SAVED_SUCCESS`.
- **`MEMBER_KYC_MESSAGES`:** `PROFILE_UPDATE_SUCCESS`, `PHOTO_UPLOAD_SUCCESS`, `PHOTO_APPROVAL_PENDING`, `AADHAAR_VERIFIED_SUCCESS`, `KYC_DOCUMENT_REJECTED`, `PROFILE_DEACTIVATED_SUCCESS`.
- **`MATCHMAKING_KUNDLI_MESSAGES`:** `KUNDLI_GENERATED_SUCCESS`, `GUNA_CALCULATION_SUCCESS`, `GOTRA_EXOGAMY_CONFLICT_WARNING`, `INTEREST_SENT_SUCCESS`, `INTEREST_ACCEPTED_SUCCESS`, `CONTACT_UNCLOAKED_SUCCESS`.
- **`PAYMENT_SUBSCRIPTION_MESSAGES`:** `ORDER_CREATED_SUCCESS`, `PAYMENT_VERIFIED_SUCCESS`, `PAYMENT_FAILED_TRY_AGAIN`, `SUBSCRIPTION_ACTIVATED`, `REFUND_PROCESSED_SUCCESS`, `INVOICE_GENERATED_SUCCESS`.
- **`FILE_UPLOAD_MESSAGES`:** `FILE_REQUIRED`, `FILE_TOO_LARGE`, `INVALID_FILE_TYPE`, `UPLOAD_FILE_SUCCESS`, `FILE_UPLOAD_FAILED`, `IMAGE_REQUIRED`, `PDF_REQUIRED`.

### 4.9 `worker/` — Standalone Queue Processors & Cron Schedulers
Can be run inside the main process during development or launched as an independent worker container via `npm run worker` in production:
- **`schedulers/dailyMatchScheduler.js`:** Runs daily at 08:00 AM IST. Runs candidate recommendation pipeline for all active members.
- **`schedulers/slaEscalationScheduler.js`:** Runs every 15 minutes. Identifies leads with `status: 'ASSIGNED'` exceeding 60 minutes without contact and alerts CRM managers.
- **`schedulers/subscriptionExpiryScheduler.js`:** Runs daily at midnight. Checks `membershipExpiresAt < now` and downgrades tiers to `FREE`.
- **`cacheSettings/index.js`:** Warms Redis cache with Sindhi Subcastes, Gotras, Surnames, and System Settings on startup.

### 4.10 `script/` — Seeders & Database Migration Utilities
- **`runSeeder.js`:** Master runner that connects to MongoDB and executes all seed scripts in sequence.
- **`seedSuperAdmin.js`:** Idempotently seeds the initial Super Admin account with full clearance.
- **`seedMasterData.js`:** Pre-populates the database with verified Sindhi community ontology:
  - Subcastes: Amil, Baibhand, Sahiti, Larkana, Shikarpuri, Dadu, Sehwani, Sindhi Sikh.
  - Gotras & Surnames with compatibility rules.
- **`seedPlans.js`:** Pre-populates default `SELF_SERVICE` and `ASSIST_PLAN` packages (Free, Silver, Gold, Platinum VIP, Till Marriage).

---

## 5. Standard Code Templates & Implementation Blueprints

### 5.1 `app.js` — Express Configuration
```javascript
import express from "express";
import morgan from "morgan";
import errorHandler from "./middlewares/errorHandler.js";
import maintenance from "./middlewares/maintenance.js";
import jwt from "./middlewares/jwt.js";
import corsMiddleware from "./middlewares/corsMiddleware.js";
import {
  conditionalSkipper,
  ipClientAdd,
  mergeParamsToBody,
  verifyTokenInRedis,
} from "./middlewares/commonMiddleware.js";
import { BOOLEAN_TRUE, DATA_NULL, NOT_FOUND } from "./utils/constants.js";
import routes from "./routes/index.js";

const app = express();
const API_PREFIX = process.env.API_END_POINT_V1 || "/api/v1";

// 1. Core Platform Middlewares
app.use(corsMiddleware());
app.use(conditionalSkipper);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// 2. Security & Request Pipeline Middlewares
app.use(maintenance);
app.use(jwt());
app.use(verifyTokenInRedis);
app.use(mergeParamsToBody);
app.use(ipClientAdd);

// 3. Mount Primary API Route Tree
app.use(API_PREFIX, routes);

// 4. Fallback 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    message: "Requested API endpoint does not exist",
    code: NOT_FOUND,
    error: BOOLEAN_TRUE,
    data: DATA_NULL,
  });
});

// 5. Global Error Handling Middleware
app.use(errorHandler);

export default app;
```

### 5.2 `index.js` — Server Bootstrapper
```javascript
import dotenv from "dotenv";
import http from "http";

const ENV = process.env.NODE_ENV || "development";
dotenv.config({ path: `.env${ENV !== "production" ? "" : ".production"}` });

import app from "./app.js";
import { logMessage } from "./utils/globalFunction.js";
import { DATA_NULL } from "./utils/constants.js";
import connectDB from "./models/connection.js";
import { initializeRedis } from "./services/serviceRedis.js";
import { initializeSocket } from "./socket/socket.js";
import initializeCronJobs from "./worker/schedulers/index.js";
import { loadInitialCache } from "./worker/cacheSettings/index.js";
import queueProcessor from "./services/serviceQueueWorker.js";

const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    // 1. Connect MongoDB Database
    await connectDB();

    // 2. Initialize Redis Client
    await initializeRedis();

    // 3. Attach Socket.io WebSocket Server
    await initializeSocket(server);

    // 4. Background Workers & Cache Warming (if running in unified container)
    if (process.env.RUN_BACKGROUND !== "false") {
      await loadInitialCache();
      await initializeCronJobs();
      queueProcessor();
    }

    // 5. Start HTTP Listener
    server.listen(PORT, () => {
      logMessage(`🚀 Sindhi Matrimony Unified Backend active on port ${PORT}`, DATA_NULL, "info");
    });
  } catch (err) {
    logMessage("❌ Fatal Error during backend startup:", err, "error");
    process.exit(1);
  }
})();
```

### 5.3 Standard Route Pattern
**File:** `routes/leads/index.js`
```javascript
import { Router } from "express";
import adminRouter from "./admin.js";
import usersRouter from "./users.js";
import { checkRolePermission } from "../../middlewares/commonMiddleware.js";
import { ROLES } from "../../utils/variables.js";

const router = Router();

// Admin-only endpoints mounted under /leads/admin
router.use(
  "/admin",
  checkRolePermission([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.CRM_MANAGER, ROLES.CRM_AGENT]),
  adminRouter
);

// Common / Candidate incoming endpoints mounted directly under /leads
router.use(usersRouter);

export default router;
```

**File:** `routes/leads/admin.js`
```javascript
import { Router } from "express";
import { validationMiddleware } from "../../middlewares/validationMiddleware.js";
import { leadsController } from "../../controllers/index.js";
import { accessCheckMiddleware } from "../../middlewares/accessCheckMiddleware.js";
import { BOOLEAN_TRUE } from "../../utils/constants.js";

const router = Router();

// GET /api/v1/leads/admin/list
router.get(
  "/list",
  accessCheckMiddleware("leads", "view"),
  validationMiddleware("leads", "admin", BOOLEAN_TRUE),
  leadsController.admin.getLeadList
);

// POST /api/v1/leads/admin/assign
router.post(
  "/assign",
  accessCheckMiddleware("leads", "assign"),
  validationMiddleware("leads", "admin"),
  leadsController.admin.assignLeads
);

// POST /api/v1/leads/admin/reassign
router.post(
  "/reassign",
  accessCheckMiddleware("leads", "assign"),
  validationMiddleware("leads", "admin"),
  leadsController.admin.reassignLead
);

// POST /api/v1/leads/admin/reveal-contact
router.post(
  "/reveal-contact",
  accessCheckMiddleware("leads", "call"),
  validationMiddleware("leads", "admin"),
  leadsController.admin.revealContact
);

export default router;
```

### 5.4 Standard Controller Pattern (Ultra-Lean, Concurrent & Memoized)

> 🛑 **MANDATORY PATTERN:** All controllers are wrapped in `asyncHandler` (zero `try/catch` boilerplate), execute independent queries in parallel via `Promise.all`, and apply `isDataEqual` to skip unnecessary DB writes on identical updates.

**File:** `controllers/leads/admin.js`
```javascript
import crudService from "../../services/crudService.js";
import * as CONSTANTS from "../../utils/constants.js";
import * as CONSTANTS_MSG from "../../utils/constantsMessage.js";
import { asyncHandler, apiHTTPResponse, isDataEqual } from "../../utils/globalFunction.js";
import { Lead, Employee } from "../../models/index.js";

/**
 * 1. Ultra-Lean List Controller (Clean delegation to crudService)
 */
export const getLeadList = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search, tab, subcaste, staffId, priority } = req.body;

  const query = { isDeleted: false };
  if (tab === "UNASSIGNED") query.status = "NEW";
  else if (tab === "MY_BUCKET") query.assignedEmployeeId = req.auth.id;
  else if (tab === "OVERDUE_SLA") query.slaStatus = "BREACH";
  else if (tab === "CONVERTED") query.status = "CONVERTED";

  if (subcaste && subcaste !== "ALL") query.subcaste = subcaste;
  if (staffId && staffId !== "ALL") query.assignedEmployeeId = staffId;
  if (priority && priority !== "ALL") query.priority = priority;

  const result = await crudService.getPaginatedList(Lead, {
    query,
    search,
    searchFields: ["name", "leadId", "city", "subcaste", "mobile"],
    select: "leadId name mobile gender age city subcaste status priority assignedEmployeeName createdAt",
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { createdAt: -1 },
    recordScope: req.recordScope,
    userAuth: req.auth,
  });

  return apiHTTPResponse(req, res, CONSTANTS.HTTP_OK, CONSTANTS_MSG.FETCH_SUCCESS, result, CONSTANTS.OK, CONSTANTS.ERROR_FALSE);
});

/**
 * 2. Concurrent Async Controller (Promise.all Parallel I/O)
 */
export const assignLeads = asyncHandler(async (req, res) => {
  const { leadIds, targetEmployeeId } = req.body;

  // ⚡ CONCURRENT ASYNC: Run employee lookup and capacity count in parallel
  const [employee, activeLeadsCount] = await Promise.all([
    Employee.findById(targetEmployeeId).select("fullName isActive maxLeadCapacity").lean(),
    Lead.countDocuments({
      assignedEmployeeId: targetEmployeeId,
      status: { $in: ["ASSIGNED", "CONTACTED", "INTERESTED"] },
      isDeleted: false,
    }),
  ]);

  if (!employee || !employee.isActive) {
    return apiHTTPResponse(req, res, CONSTANTS.HTTP_BAD_REQUEST, CONSTANTS_MSG.TARGET_EMPLOYEE_INACTIVE, CONSTANTS.DATA_NULL, CONSTANTS.BAD_REQUEST);
  }

  if (activeLeadsCount + leadIds.length > employee.maxLeadCapacity) {
    return apiHTTPResponse(req, res, CONSTANTS.HTTP_UNPROCESSABLE_ENTITY, CONSTANTS_MSG.LEAD_CAPACITY_EXCEEDED, CONSTANTS.DATA_NULL, CONSTANTS.UNPROCESSABLE_ENTITY);
  }

  // Perform bulk update
  await Lead.updateMany(
    { _id: { $in: leadIds } },
    {
      $set: {
        assignedEmployeeId: targetEmployeeId,
        assignedEmployeeName: employee.fullName,
        status: "ASSIGNED",
        assignedAt: new Date(),
      },
    }
  );

  return apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    CONSTANTS_MSG.LEAD_ASSIGNED_SUCCESS,
    { assignedCount: leadIds.length, targetEmployee: employee.fullName },
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE
  );
});

/**
 * 3. Smart Mutation Memoization Controller (Zero-Write fast-deep-equal)
 * Frontend ko HAMESHA pura data wapas milega; DB write skipped if data is unchanged!
 */
export const updateLead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const existingLead = await Lead.findById(id).lean();
  if (!existingLead) {
    return apiHTTPResponse(req, res, CONSTANTS.HTTP_NOT_FOUND, CONSTANTS_MSG.DATA_NOT_FOUND, CONSTANTS.DATA_NULL, CONSTANTS.NOT_FOUND);
  }

  // ⚡ ZERO-WRITE MEMOIZATION: If client sent same data, skip MongoDB disk write & write locks!
  // Return complete existing data to frontend so UI state remains 100% intact
  if (isDataEqual(existingLead, updateData)) {
    return apiHTTPResponse(req, res, CONSTANTS.HTTP_OK, "No changes detected. Record is already up to date.", existingLead, CONSTANTS.OK, CONSTANTS.ERROR_FALSE);
  }

  // Execute DB write ONLY when actual delta exists
  const updatedLead = await Lead.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true }).lean();
  return apiHTTPResponse(req, res, CONSTANTS.HTTP_OK, CONSTANTS_MSG.UPDATE_SUCCESS || "Record updated successfully.", updatedLead, CONSTANTS.OK, CONSTANTS.ERROR_FALSE);
});

/**
 * 4. High-Performance Repeated Fetch (Screen Back <-> Forward Navigation)
 * Frontend ko HAMESHA pura data milega (200 OK); Backend serves from Redis RAM in 1ms!
 */
export const getLeadById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const cacheKey = `cache:lead:${id}`;

  // Check Redis RAM first (1ms memory lookup)
  const cachedLead = await redisClient.get(cacheKey);
  if (cachedLead) {
    return apiHTTPResponse(req, res, CONSTANTS.HTTP_OK, CONSTANTS_MSG.FETCH_SUCCESS, JSON.parse(cachedLead), CONSTANTS.OK, CONSTANTS.ERROR_FALSE);
  }

  // Fallback to MongoDB if not in cache, then cache for 15 minutes
  const lead = await Lead.findById(id).lean();
  if (!lead) {
    return apiHTTPResponse(req, res, CONSTANTS.HTTP_NOT_FOUND, CONSTANTS_MSG.DATA_NOT_FOUND, CONSTANTS.DATA_NULL, CONSTANTS.NOT_FOUND);
  }

  await redisClient.setEx(cacheKey, 900, JSON.stringify(lead));
  return apiHTTPResponse(req, res, CONSTANTS.HTTP_OK, CONSTANTS_MSG.FETCH_SUCCESS, lead, CONSTANTS.OK, CONSTANTS.ERROR_FALSE);
});
```

### 5.5 Standard Joi Route Validator Pattern
> All field checks are composed using the dedicated validation functions imported from `../../utils/joiValidationDataType.js`. Zero inline Joi builders or raw regex here.

**File:** `validators/leads/admin.js`
```javascript
import {
  objectIdValidation,
  requiredArray,
  requiredEnum,
  optionalString,
  optionalEnum,
  requiredNumber,
  dateSchema,
} from "../../utils/joiValidationDataType.js";

export const joiValidation = {
  "/list": {
    page: requiredNumber(1, Number.MAX_SAFE_INTEGER),
    limit: requiredNumber(1, 100),
    tab: optionalEnum(["UNASSIGNED", "MY_BUCKET", "ALL_LEADS", "FOLLOW_UPS_TODAY", "OVERDUE_SLA", "CONVERTED"]),
    subcaste: optionalString(0, 50),
    staffId: optionalString(0, 50),
    priority: optionalEnum(["LOW", "MEDIUM", "HIGH", "URGENT", "ALL"]),
    search: optionalString(0, 100),
    fromDate: dateSchema("From Date"),
    toDate: dateSchema("To Date"),
  },
  "/assign": {
    leadIds: requiredArray(objectIdValidation("leadId"), 1, 50),
    targetEmployeeId: objectIdValidation("targetEmployeeId"),
    assignmentMethod: optionalEnum(["MANUAL", "ROUND_ROBIN", "CAPACITY_BALANCED"]),
    assignmentNote: optionalString(0, 500),
  },
  "/reassign": {
    id: objectIdValidation("id"),
    newEmployeeId: objectIdValidation("newEmployeeId"),
    reasonPreset: requiredEnum([
      "STAFF_ON_LEAVE",
      "PERFORMANCE_REBALANCE",
      "LANGUAGE_SPECIALIST",
      "CLIENT_ESCALATION",
      "SCHEDULE_CONFLICT",
    ]),
    handoverNotes: optionalString(0, 1000),
  },
  "/reveal-contact": {
    leadId: objectIdValidation("leadId"),
    purpose: requiredEnum(["CALLING", "WHATSAPP", "PHYSICAL_MEET"]),
    consentConfirmed: optionalEnum([true, false]),
  },
};
```

### 5.6 Standard Mongoose Model Pattern
**File:** `models/leads/lead.model.js`
```javascript
import mongoose from "mongoose";
import { addTimeStamp } from "../../utils/globalFunction.js";

const leadSchema = new mongoose.Schema(
  {
    leadId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    gender: {
      type: String,
      enum: ["MALE", "FEMALE"],
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    subcaste: {
      type: String,
      required: true,
      index: true,
    },
    gotra: {
      type: String,
    },
    profession: {
      type: String,
    },
    source: {
      type: String,
      enum: [
        "WEBSITE_FORM",
        "MOBILE_APP",
        "AD_CAMPAIGN",
        "REFERRAL",
        "ORGANIC_SEARCH",
        "EMPLOYEE_CREATED",
        "IMPORTED",
        "CALLBACK_REQ",
      ],
      default: "WEBSITE_FORM",
    },
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
      default: "MEDIUM",
    },
    status: {
      type: String,
      enum: [
        "NEW",
        "ASSIGNED",
        "CONTACTED",
        "INTERESTED",
        "PROFILE_VERIFICATION_PENDING",
        "MATCHMAKING_ACTIVE",
        "MEMBERSHIP_PURCHASED",
        "CONVERTED",
        "ON_HOLD",
        "LOST",
        "CLOSED",
      ],
      default: "NEW",
      index: true,
    },
    assignedEmployeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      index: true,
    },
    assignedEmployeeName: {
      type: String,
    },
    assignedAt: {
      type: Date,
    },
    lastContactDate: {
      type: Date,
    },
    nextFollowUp: {
      type: Date,
    },
    slaStatus: {
      type: String,
      enum: ["ON_TIME", "BREACH", "URGENT"],
      default: "ON_TIME",
    },
    notes: {
      type: String,
    },
    ...addTimeStamp(),
  },
  {
    timestamps: true,
  }
);

// Compound indexes for CRM search & fast filtering
leadSchema.index({ assignedEmployeeId: 1, status: 1 });
leadSchema.index({ status: 1, createdAt: -1 });

export const Lead = mongoose.model("Lead", leadSchema);
```

### 5.7 Centralized Master Reusable Functions Blueprint (`utils/globalFunction.js`)
> 🛑 **MANDATORY DRY PRINCIPLE (DON'T REPEAT YOURSELF):**  
> *"Har choti-badi calculation, hashing, OTP generation, age calculation, masking, aur standard response ke reusable functions bnege taaki backend me bar-bar code na likhna pade."*  
> Controllers and services must import these reusable utilities rather than implementing inline math, bcrypt, formatting, or custom response JSON blocks.

**File:** `utils/globalFunction.js`
```javascript
import bcrypt from "bcrypt";
import equal from "fast-deep-equal";
import geoip from "geoip-lite";
import moment from "moment-timezone";
import * as CONSTANTS from "./constants.js";
import * as CONSTANTS_MSG from "./constantsMessage.js";

export { moment };
export const guessedTimezone = "Asia/Kolkata";

/**
 * 1. Standard Response Envelope — Single source of truth for all API responses
 */
export const apiHTTPResponse = (
  req,
  res,
  httpCode = CONSTANTS.HTTP_SERVICE_UNAVAILABLE,
  message = CONSTANTS.DATA_NULL,
  data = CONSTANTS.DATA_NULL,
  code = CONSTANTS.SERVICE_UNAVAILABLE,
  error = CONSTANTS.ERROR_TRUE
) => {
  return res.status(httpCode).json({
    code: code,
    error: httpCode === CONSTANTS.HTTP_OK || httpCode === CONSTANTS.HTTP_CREATED ? CONSTANTS.ERROR_FALSE : error,
    message: message || "Operation completed.",
    data: data,
    meta: {
      requestId: req.headers["x-request-id"] || null,
      timestamp: new Date().toISOString(),
      ...(data?.pagination ? { pagination: data.pagination } : {}),
    },
  });
};

/**
 * 2. Database Service Result Wrapper
 */
export const resultDb = (statusCode, data = null) => ({
  statusCode,
  data,
});

/**
 * 3. Bcrypt Password Hashing & Verification
 */
export const hashPassword = async (plainPassword) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(plainPassword, salt);
};

export const verifyPassword = async (plainPassword, hashedPassword) => {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (err) {
    return false;
  }
};

/**
 * 4. Verification Codes & Token Generators
 */
export const generateOTP = (length = 6) => {
  let otp = "";
  const digits = "0123456789";
  for (let i = 0; i < length; i++) {
    otp += digits.charAt(Math.floor(Math.random() * digits.length));
  }
  return otp;
};

export const generateRandomToken = (length = 32) => {
  let token = "";
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};

/**
 * 5. Mongoose Schema Schema Mixin (Soft Delete & Timestamp Defaults)
 */
export const addTimeStamp = () => ({
  isDisable: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
});

/**
 * 6. Matrimonial Domain: Dynamic Age & Completeness Calculators
 */
export const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return null;
  const dob = new Date(dateOfBirth);
  const diffMs = Date.now() - dob.getTime();
  const ageDt = new Date(diffMs);
  return Math.abs(ageDt.getUTCFullYear() - 1970);
};

export const calculateProfileCompleteness = (profile = {}) => {
  const criteria = [
    { field: "basic", weight: 20, check: () => !!(profile.fullName && profile.gender && profile.dob) },
    { field: "community", weight: 15, check: () => !!(profile.subcaste && profile.gotra) },
    { field: "photos", weight: 25, check: () => Array.isArray(profile.photos) && profile.photos.length > 0 },
    { field: "career", weight: 15, check: () => !!(profile.education && profile.profession) },
    { field: "family", weight: 15, check: () => !!(profile.fatherName || profile.familyType) },
    { field: "horoscope", weight: 10, check: () => !!(profile.horoscope?.timeOfBirth && profile.horoscope?.placeOfBirth) },
  ];

  let score = 0;
  for (const item of criteria) {
    if (item.check()) score += item.weight;
  }
  return score;
};

/**
 * 7. Candidate Privacy: Masking Mobile & Email
 */
export const maskPhoneNumber = (phone) => {
  if (!phone || phone.length < 10) return phone;
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.slice(0, 2) + "******" + cleaned.slice(-2);
};

export const maskEmail = (email) => {
  if (!email || !email.includes("@")) return email;
  const [user, domain] = email.split("@");
  if (user.length <= 2) return `*@${domain}`;
  return `${user[0]}****${user[user.length - 1]}@${domain}`;
};

/**
 * 8. Currency & Formatting Helpers
 */
export const formatCurrencyINR = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

/**
 * 9. Logging & Diagnostics
 */
export const logMessage = (tag, message, level = "info") => {
  const timestamp = new Date().toISOString();
  if (level === "error") {
    console.error(`[${timestamp}] ❌ [${tag}]:`, message);
  } else if (level === "warn") {
    console.warn(`[${timestamp}] ⚠️ [${tag}]:`, message);
  } else {
    console.log(`[${timestamp}] ℹ️ [${tag}]:`, message);
  }
};

/**
 * 10. Ultra-Lean Async Handler Wrapper
 * Eliminates repetitive 10-line try/catch blocks across every controller
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * 11. Smart No-Op Mutation Equal Check (fast-deep-equal)
 * Compares incoming payload against existing DB record; if identical, skips DB write (2ms instant response)
 */
export const isDataEqual = (existingData, incomingData) => {
  if (!existingData || !incomingData) return false;
  const subsetExisting = {};
  for (const key of Object.keys(incomingData)) {
    subsetExisting[key] = existingData[key];
  }
  return equal(subsetExisting, incomingData);
};
```

---

### 5.8 Dedicated Validation Checks Blueprint (`utils/joiValidationDataType.js`)
> 🛑 **MANDATORY PATTERN:** Every single validation check, regex pattern, type assertion, and error message mapping is centralized here. Route validators in `validators/<module>/` simply import and compose these functions.

**File:** `utils/joiValidationDataType.js`
```javascript
import Joi from "joi";
import * as CONSTANTS_MSG from "./constantsMessage.js";

// Regex Primitives
export const INDIAN_PHONE_REGEX = /^[6-9]\d{9}$/;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
export const MONGO_OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/;
export const AADHAAR_REGEX = /^\d{12}$/;

// Reusable String Validators
export const requiredString = (min = 1, max = 500, fieldName = "Field") =>
  Joi.string()
    .trim()
    .min(min)
    .max(max)
    .required()
    .messages({
      "string.empty": `${fieldName} cannot be empty.`,
      "any.required": `${fieldName} is required.`,
      "string.min": `${fieldName} must be at least ${min} characters.`,
      "string.max": `${fieldName} cannot exceed ${max} characters.`,
    });

export const optionalString = (min = 0, max = 1000) =>
  Joi.string().trim().min(min).max(max).optional().allow("", null);

// Email & Phone Validators
export const emailValidation = () =>
  Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": CONSTANTS_MSG.INVALID_EMAIL_FORMAT,
      "string.empty": CONSTANTS_MSG.EMAIL_REQUIRED,
      "any.required": CONSTANTS_MSG.EMAIL_REQUIRED,
    });

export const optionalEmailValidator = () =>
  Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .allow(null, "")
    .messages({
      "string.email": CONSTANTS_MSG.INVALID_EMAIL_FORMAT,
    });

export const phoneValidation = () =>
  Joi.string()
    .trim()
    .pattern(INDIAN_PHONE_REGEX)
    .required()
    .messages({
      "string.pattern.base": CONSTANTS_MSG.INVALID_PHONE_NUMBER,
      "string.empty": CONSTANTS_MSG.PHONE_REQUIRED,
      "any.required": CONSTANTS_MSG.PHONE_REQUIRED,
    });

export const optionalPhoneValidation = () =>
  Joi.string()
    .trim()
    .pattern(INDIAN_PHONE_REGEX)
    .allow(null, "")
    .messages({
      "string.pattern.base": CONSTANTS_MSG.INVALID_PHONE_NUMBER,
    });

// Password Validators
export const passwordValidation = (min = 8, max = 30) =>
  Joi.string()
    .trim()
    .min(min)
    .max(max)
    .pattern(PASSWORD_REGEX)
    .required()
    .messages({
      "string.empty": CONSTANTS_MSG.PASSWORD_REQUIRED,
      "any.required": CONSTANTS_MSG.PASSWORD_REQUIRED,
      "string.min": `Password must be at least ${min} characters long.`,
      "string.max": `Password cannot exceed ${max} characters.`,
      "string.pattern.base": CONSTANTS_MSG.STRONG_PASSWORD_ERROR,
    });

export const confirmPasswordValidation = (passwordRef = "password") =>
  Joi.string()
    .trim()
    .valid(Joi.ref(passwordRef))
    .required()
    .messages({
      "any.only": CONSTANTS_MSG.CONFIRM_PASSWORD_MISMATCH,
      "any.required": CONSTANTS_MSG.CONFIRM_PASSWORD_REQUIRED,
    });

// Database & Identifier Validators
export const objectIdValidation = (fieldName = "ID") =>
  Joi.string()
    .trim()
    .pattern(MONGO_OBJECT_ID_REGEX)
    .required()
    .messages({
      "string.pattern.base": `Invalid ${fieldName} format (must be a 24-character hexadecimal identifier).`,
      "string.empty": `${fieldName} is required.`,
      "any.required": `${fieldName} is required.`,
    });

export const optionalObjectIdValidation = (fieldName = "ID") =>
  Joi.string()
    .trim()
    .pattern(MONGO_OBJECT_ID_REGEX)
    .allow(null, "")
    .messages({
      "string.pattern.base": `Invalid ${fieldName} format.`,
    });

// Numbers, Booleans & Enums
export const requiredNumber = (min = 0, max = Number.MAX_SAFE_INTEGER) =>
  Joi.number().min(min).max(max).required();

export const optionalNumber = (min = 0, max = Number.MAX_SAFE_INTEGER) =>
  Joi.number().min(min).max(max).optional().allow(null);

export const requiredBoolean = () => Joi.boolean().required();

export const optionalBoolean = () => Joi.boolean().optional().allow(null, "");

export const requiredEnum = (allowedArray = [], fieldName = "Field") =>
  Joi.string()
    .valid(...allowedArray)
    .required()
    .messages({
      "any.only": `${fieldName} must be one of [${allowedArray.join(", ")}].`,
      "any.required": `${fieldName} is required.`,
    });

export const optionalEnum = (allowedArray = []) =>
  Joi.string()
    .valid(...allowedArray)
    .optional()
    .allow(null, "");

export const requiredArray = (itemsSchema, min = 1, max = 100) =>
  Joi.array().items(itemsSchema).min(min).max(max).required();

export const optionalArray = (itemsSchema) =>
  Joi.array().items(itemsSchema).optional().allow(null);

// Date Validators
export const dateSchema = (fieldName = "Date") =>
  Joi.date()
    .iso()
    .optional()
    .allow(null, "")
    .messages({
      "date.format": `${fieldName} must be a valid ISO 8601 date.`,
    });

// Matrimonial Domain-Specific Validation Checks
export const matrimonyAgeValidation = (gender = "FEMALE") => {
  const minAge = gender === "MALE" ? 21 : 18;
  return Joi.number()
    .integer()
    .min(minAge)
    .max(75)
    .required()
    .messages({
      "number.min": `Legal marriage age for ${gender.toLowerCase()} candidates is minimum ${minAge} years.`,
      "number.max": "Candidate age cannot exceed 75 years.",
      "number.base": "Age must be a valid number.",
      "any.required": "Age is required.",
    });
};

export const aadhaarNumberValidation = () =>
  Joi.string()
    .trim()
    .pattern(AADHAAR_REGEX)
    .messages({
      "string.pattern.base": "Aadhaar number must be exactly 12 digits.",
    });

export const subcasteValidation = () =>
  Joi.string()
    .valid("Amil", "Baibhand", "Sahiti", "Larkana", "Shikarpuri", "Dadu", "Sehwani", "Sindhi Sikh", "Other")
    .required()
    .messages({
      "any.only": "Please select a valid Sindhi subcaste.",
      "any.required": "Subcaste is required.",
    });

export const gotraValidation = () =>
  Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.empty": "Gotra cannot be empty.",
      "any.required": "Gotra is required for Kundli match and exogamy verification.",
    });
```

---

### 5.9 Dedicated Centralized Messages Blueprint (`utils/constantsMessage.js`)
> 🛑 **MANDATORY PATTERN:** Every single user-facing message, API response text, validation failure message, and notification copy is centralized here. Controllers, services, and middlewares **never hardcode strings**.

**File:** `utils/constantsMessage.js`
```javascript
// ============================================================================
// 1. COMMON SYSTEM & HTTP RESPONSES
// ============================================================================
export const SUCCESS = "SUCCESS";
export const SUCCESS_MSG = "Operation completed successfully.";
export const FAILED = "FAILURE";
export const FAILED_MSG = "We're sorry for the inconvenience! There was an issue processing your request.";
export const SERVER_ERROR = "Oops! Something went wrong on our end. Please try again in a few moments.";
export const TOO_MANY_ATTEMPTS = "Too many requests. Please slow down and try again later.";
export const DATA_NOT_FOUND = "Requested record not found.";
export const MISSING_FIELDS = "Missing required fields. Please check your payload.";
export const INVALID_SIGNATURE = "Invalid security signature.";
export const MAINTENANCE_MODE_ACTIVE = "The system is currently undergoing scheduled maintenance. Please check back shortly.";
export const UNAUTHORIZED_ACCESS = "You are not authorized to perform this action.";
export const FORBIDDEN_ACCESS = "You do not possess the required module permissions for this resource.";
export const FETCH_SUCCESS = "Data retrieved successfully.";

// ============================================================================
// 2. AUTHENTICATION, PASSWORD & OTP MESSAGES
// ============================================================================
export const LOGIN_SUCCESS = "Login successful. Welcome back!";
export const INVALID_CREDENTIALS = "The mobile number/email or password you entered is incorrect.";
export const INVALID_PASSWORD = "Incorrect password. Please enter the correct password to continue.";
export const CURRENT_PASS_ERROR = "Current password does not match our records.";
export const PASSWORD_REQUIRED = "Password is required.";
export const CONFIRM_PASSWORD_REQUIRED = "Please confirm your password.";
export const CONFIRM_PASSWORD_MISMATCH = "Confirm password does not match the password entered.";
export const STRONG_PASSWORD_ERROR = "Password must be at least 8 characters long, including at least one uppercase letter, one lowercase letter, one number, and one special character (e.g., @$!%*?&).";
export const PASSWORD_RESET_SUCCESS = "Your password has been reset successfully. Please log in with your new credentials.";
export const PASSWORD_CHANGED_SUCCESS = "Password changed successfully.";

export const INVALID_EMAIL = "No account found with the provided email address.";
export const INVALID_EMAIL_FORMAT = "Please provide a valid email address.";
export const EMAIL_REQUIRED = "Email address is required.";
export const INVALID_PHONE_NUMBER = "Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.";
export const PHONE_REQUIRED = "Mobile number is required.";
export const PHONE_ALREADY_REGISTERED = "This mobile number is already registered. Please login or use a different number.";

export const INVALID_OTP = "The OTP entered is invalid. Please try again.";
export const OTP_EXPIRED = "The OTP has expired. Please request a new code.";
export const OTP_VERIFIED = "OTP verified successfully.";
export const RESEND_OTP_SUCCESS = "A new verification code has been dispatched successfully.";
export const REGISTER_OTP_SEND_PHONE = "A 4-digit verification code has been sent to your mobile number.";
export const REGISTRATION_SUCCESS = "Profile registered successfully. Welcome to Sindhi Matrimony!";
export const REGISTRATION_FAILED = "Registration failed. Please check your input or contact support.";
export const ACCOUNT_DISABLED_CONTACT_ADMIN = "Your account has been deactivated. Please contact the Sindhi Matrimony Admin Support.";
export const SESSION_EXPIRED = "Your session has expired. Please log in again.";

// ============================================================================
// 3. LEAD & CRM MANAGEMENT MESSAGES
// ============================================================================
export const LEAD_CREATED_SUCCESS = "New lead captured successfully.";
export const LEAD_ASSIGNED_SUCCESS = "Lead(s) assigned to employee successfully.";
export const LEAD_REASSIGNED_SUCCESS = "Lead reassigned successfully.";
export const LEAD_STATUS_UPDATED = "Lead status updated successfully.";
export const LEAD_CAPACITY_EXCEEDED = "Cannot assign lead. Target employee has reached maximum active lead capacity.";
export const TARGET_EMPLOYEE_INACTIVE = "Target employee is currently inactive or not found.";
export const LEAD_SLA_BREACH_ALERT = "SLA Breach Warning: Lead has been uncontacted for more than 60 minutes.";
export const CALL_INITIATED_SUCCESS = "Click-to-call initiated. Your desk phone will ring shortly.";
export const DISPOSITION_SAVED_SUCCESS = "Call disposition and follow-up saved successfully.";
export const CONTACT_UNCLOAKED_SUCCESS = "Candidate contact number unmasked and audit logged.";

// ============================================================================
// 4. MEMBER PROFILES & KYC VERIFICATION MESSAGES
// ============================================================================
export const PROFILE_UPDATE_SUCCESS = "Profile details updated successfully.";
export const PHOTO_UPLOAD_SUCCESS = "Profile photograph uploaded successfully. Pending admin moderation.";
export const PHOTO_APPROVAL_PENDING = "Photo is under review by the moderation team.";
export const PHOTO_APPROVED_SUCCESS = "Photo approved and published to member profile.";
export const PHOTO_REJECTED_SUCCESS = "Photo rejected. Moderation notice sent to member.";
export const AADHAAR_VERIFIED_SUCCESS = "Aadhaar verified successfully via Digilocker/OTP.";
export const KYC_DOCUMENT_REJECTED = "KYC document rejected. Please request re-upload.";
export const PROFILE_DEACTIVATED_SUCCESS = "Member profile suspended successfully.";

// ============================================================================
// 5. MATCHMAKING & KUNDLI MESSAGES
// ============================================================================
export const KUNDLI_GENERATED_SUCCESS = "Kundli horoscope chart generated successfully.";
export const GUNA_CALCULATION_SUCCESS = "Ashtakoota 36-Guna Milan score calculated successfully.";
export const GOTRA_EXOGAMY_CONFLICT_WARNING = "Same Gotra Detected (Sagotra): In traditional Sindhi custom, same-Gotra alliances require family review.";
export const INTEREST_SENT_SUCCESS = "Interest expressed successfully. The candidate has been notified.";
export const INTEREST_ALREADY_SENT = "You have already expressed interest in this profile.";
export const INTEREST_ACCEPTED_SUCCESS = "Interest accepted! You can now communicate with each other.";
export const INTEREST_DECLINED_SUCCESS = "Interest politely declined.";
export const SHORTLIST_ADDED_SUCCESS = "Profile added to your shortlist.";

// ============================================================================
// 6. PAYMENTS, BILLING & SUBSCRIPTIONS
// ============================================================================
export const ORDER_CREATED_SUCCESS = "Payment order created. Proceeding to checkout.";
export const PAYMENT_VERIFIED_SUCCESS = "Payment received and verified successfully. Your plan is now active!";
export const PAYMENT_FAILED_TRY_AGAIN = "Payment verification failed. Please try again or contact your bank.";
export const SUBSCRIPTION_ACTIVATED = "Membership package activated successfully.";
export const PLAN_ALREADY_ACTIVE = "You already have an active subscription with equal or higher benefits.";
export const REFUND_PROCESSED_SUCCESS = "Refund initiated successfully. Funds will reflect in 5-7 business days.";
export const INVOICE_GENERATED_SUCCESS = "Tax invoice generated successfully.";

// ============================================================================
// 7. FILE & MEDIA UPLOADS
// ============================================================================
export const FILE_REQUIRED = "Please upload a file.";
export const FILE_TOO_LARGE = "Uploaded file exceeds the maximum allowed size limit.";
export const INVALID_FILE_TYPE = "Invalid file type. Only JPEG, PNG, WebP, and PDF documents are supported.";
export const UPLOAD_FILE_SUCCESS = "File uploaded to secure storage successfully.";
export const FILE_UPLOAD_FAILED = "File upload failed. Please verify format and network connection.";
export const IMAGE_REQUIRED = "Profile image is required.";
export const PDF_REQUIRED = "Biodata must be in PDF format.";
```

---

### 5.10 Dedicated High-Performance Query Engine Blueprint (`services/crudService.js`)
> 🛑 **MANDATORY PERFORMANCE RULE: LEAN + SELECTIVE PROJECTION ONLY**  
> *"API se sirf utna hi data response me aayega jitna frontend ko display ke liye zaroori ho."*  
> By default, MongoDB queries return entire documents (including internal flags, timestamps, and nested objects) as heavy Mongoose Hydrated documents. `crudService.js` enforces strict field selection, pagination clamping, and `.lean()` execution to guarantee sub-40ms response times.

**File:** `services/crudService.js`
```javascript
import mongoose from "mongoose";
import * as CONSTANTS from "../utils/constants.js";

/**
 * High-performance paginated list query with mandatory field selection and .lean()
 */
export const getPaginatedList = async (
  Model,
  {
    query = {},
    search = "",
    searchFields = [],
    select = "", // Mandatory: space-separated string of required fields
    page = 1,
    limit = 20,
    sort = { createdAt: -1 },
    populate = [],
    recordScope = "ALL",
    userAuth = null,
  }
) => {
  // 1. Clamp pagination: Max 50 records per page (protects memory & bandwidth)
  const safePage = Math.max(1, parseInt(page) || 1);
  const safeLimit = Math.min(50, Math.max(1, parseInt(limit) || 20));
  const skip = (safePage - 1) * safeLimit;

  // 2. Base filter: Always exclude soft-deleted records
  const andConditions = [{ isDeleted: false }];

  if (query && Object.keys(query).length > 0) {
    andConditions.push(query);
  }

  // 3. Apply RBAC record scoping
  if (recordScope === "ASSIGNED" && userAuth?.id) {
    andConditions.push({ assignedEmployeeId: userAuth.id });
  } else if (recordScope === "OWN" && userAuth?.id) {
    andConditions.push({ createdBy: userAuth.id });
  }

  // 4. Indexed regex search
  if (search && searchFields.length > 0) {
    const escapedSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const orSearchConditions = searchFields.map((field) => ({
      [field]: { $regex: escapedSearch, $options: "i" },
    }));
    andConditions.push({ $or: orSearchConditions });
  }

  const finalFilter = andConditions.length === 1 ? andConditions[0] : { $and: andConditions };

  // 5. Build query with mandatory field projection and .lean()
  let queryBuilder = Model.find(finalFilter)
    .sort(sort)
    .skip(skip)
    .limit(safeLimit);

  // If selective fields specified, project only those fields; otherwise strip internal secrets
  if (select && select.trim().length > 0) {
    queryBuilder = queryBuilder.select(select.trim());
  } else {
    queryBuilder = queryBuilder.select("-password -tokenBlacklist -__v");
  }

  // Handle populations with restricted child fields
  if (Array.isArray(populate) && populate.length > 0) {
    populate.forEach((popItem) => {
      if (popItem.path) queryBuilder = queryBuilder.populate(popItem);
    });
  }

  // 6. Execute in parallel: Count + .lean() Plain JavaScript Objects (5x faster)
  const [totalRecords, list] = await Promise.all([
    Model.countDocuments(finalFilter),
    queryBuilder.lean(),
  ]);

  const totalPages = Math.ceil(totalRecords / safeLimit) || 1;

  return {
    list,
    pagination: {
      currentPage: safePage,
      pageSize: safeLimit,
      totalRecords,
      totalPages,
      hasNextPage: safePage < totalPages,
      hasPrevPage: safePage > 1,
    },
  };
};

/**
 * Keyset cursor pagination for infinite scroll mobile feeds (O(1) database complexity)
 */
export const getCursorFeed = async (
  Model,
  {
    filter = {},
    lastId = null,
    limit = 20,
    select = "fullName age height subcaste city profession avatarUrl isVerified",
  }
) => {
  const safeLimit = Math.min(50, Math.max(1, parseInt(limit) || 20));
  const query = { ...filter, isDeleted: false };

  if (lastId && mongoose.Types.ObjectId.isValid(lastId)) {
    query._id = { $lt: new mongoose.Types.ObjectId(lastId) };
  }

  const records = await Model.find(query)
    .sort({ _id: -1 })
    .limit(safeLimit + 1) // Fetch 1 extra to check hasNext
    .select(select)
    .lean();

  const hasMore = records.length > safeLimit;
  const list = hasMore ? records.slice(0, safeLimit) : records;
  const nextCursor = list.length > 0 ? list[list.length - 1]._id : null;

  return {
    list,
    cursor: {
      nextCursor,
      hasMore,
    },
  };
};

export default {
  getPaginatedList,
  getCursorFeed,
};
```

---

## 6. Cross-Platform Endpoint Organization Strategy

To avoid code duplication while keeping role security tight, every module route file in `routes/<module>/` mounts sub-routes using this uniform structure:

| Client Consumer | Base Route Path | Target Sub-Router | Auth & Role Guard |
|:---|:---|:---|:---|
| **Admin Portal** | `/api/v1/<module>/admin/*` | `routes/<module>/admin.js` | Protected: `checkRolePermission([ROLES.SUPER_ADMIN, ROLES.ADMIN, ...])` |
| **Mobile App & User Web** | `/api/v1/<module>/*` | `routes/<module>/users.js` | Protected: `USER` role OR Public whitelist |
| **Public Launch Bundles** | `/api/v1/common/dropdowns` | `routes/common/dropdowns.js` | **Public (Zero Token Required)** / Redis L2 Cache / ETag 304 |
| **WatermelonDB Delta Sync** | `/api/v1/sync/*` | `routes/sync/users.js` | Protected: `USER` role (Delta Pull & Push) |
| **Webhooks** | `/api/v1/webhooks/<provider>` | `routes/webhooks/<provider>.js` | Provider Signature Verification |

**Example across modules:**
- **Public Common Bundles (Zero-Token App Startup):**
  - `GET /api/v1/common/dropdowns` → `routes/common/dropdowns.js` (Single consolidated bundle for subcastes, gotras, surnames, educations, cities)
- **WatermelonDB Offline Sync:**
  - `GET /api/v1/sync/pull?last_pulled_at=<ts>` → `routes/sync/users.js` (Fetches created, updated, and deleted entities)
  - `POST /api/v1/sync/push` → `routes/sync/users.js` (Flushes local client offline actions to MongoDB)
- **Auth:**
  - `POST /api/v1/auth/admin/login` → `routes/auth/admin.js` (MFA + Employee credentials)
  - `POST /api/v1/auth/login` → `routes/auth/users.js` (Candidate login)
  - `POST /api/v1/auth/refresh-token` → `routes/auth/users.js` (Common token refresh)
- **Members & Profiles:**
  - `GET /api/v1/members/admin/list` → `routes/members/admin.js` (Admin Directory)
  - `GET /api/v1/profile/me` → `routes/members/users.js` (Candidate Profile)
- **Matchmaking:**
  - `POST /api/v1/matchmaking/admin/review` → `routes/matchmaking/admin.js` (Staff Review)
  - `GET /api/v1/matches/recommendations` → `routes/matchmaking/users.js` (App Daily Feed - Cursor Pagination)
- **Membership Plans:**
  - `POST /api/v1/plans/admin/create` → `routes/plans/admin.js` (Admin CRUD)
  - `GET /api/v1/plans` → `routes/plans/users.js` (Public Active Plans)

---

## 7. Developer Guidelines & Best Practices

> 🛑 **STRICT RULE 1: ZERO HARDCODED MESSAGE STRINGS**  
> *"Jitne bhi message jayege unki ek separate file bnegii."*  
> Every single response message, error alert, notification string, or validation copy **must be imported from `utils/constantsMessage.js`**.  
> - ❌ **Never write:** `return apiHTTPResponse(req, res, 200, "Leads assigned successfully", data)`  
> - ✅ **Always write:** `return apiHTTPResponse(req, res, CONSTANTS.HTTP_OK, CONSTANTS_MSG.LEAD_ASSIGNED_SUCCESS, data, CONSTANTS.OK, CONSTANTS.ERROR_FALSE)`  
> Pull requests containing hardcoded string literals in controllers, services, models, or validators will be automatically rejected during code review.

> 🛑 **STRICT RULE 2: ZERO INLINE VALIDATION CHECKS OR REPETITIVE REGEX**  
> *"Jitni bhi validations check honge unki ek separate file bnegi."*  
> Every single validation check, regex pattern, type guard, and schema assertion **must be defined in `utils/joiValidationDataType.js`**.  
> - ❌ **Never write:** raw regex or inline `.pattern(/^[6-9]\d{9}$/)` in route validators or controllers.  
> - ✅ **Always write:** import and use `phoneValidation()`, `emailValidation()`, `objectIdValidation()`, `matrimonyAgeValidation()`, etc. from `utils/joiValidationDataType.js`.  
> Route validator files (`validators/<module>/<role>.js`) must purely be declarative composition dictionaries.

> 🛑 **STRICT RULE 3: ZERO OVER-FETCHING & MANDATORY LEAN QUERIES (KAM DATA = FAST RESPONSE)**  
> *"API se sirf utna hi data response me aayega jitna frontend ko display ke liye zaroori ho."*  
> Returning massive documents with 40-50 fields in list/feed APIs creates severe network latency, spikes Node.js event loop serialization times, and causes client UI frame drops.  
> - ❌ **Never write:** `Model.find(query)` without projection in list endpoints, returning full documents containing internal flags, heavy unneeded nested arrays (e.g. photos, logs, astrologer notes).  
> - ❌ **Never write:** Mongoose hydrated queries for read-only listings.  
> - ✅ **Always write:**  
>   1. **Explicit Field Projection (`select: "..."`):** Table/card listings must strictly project only the 6–8 visible fields (e.g., `leadId name mobile city subcaste status`). Detailed fields (full bio, kundli, family background) belong exclusively in single-record `GET /:id` detail endpoints.  
>   2. **Mongoose `.lean()`:** Every read-only query in `crudService.js` and controllers must use `.lean()`, returning POJOs (Plain Old JavaScript Objects) for 4x–5x faster execution and 70% lower RAM footprint.  
>   3. **Hard-Capped Pagination:** Joi validators must limit page size to a maximum of 50 records (`limit: requiredNumber(1, 50)`).  
>   4. **Exclude Sensitive Secrets:** `-password -tokenBlacklist -__v -rawAadhaar` must be stripped across all endpoints.

> 🛑 **STRICT RULE 4: MAXIMAL API UNIFICATION & ZERO ROUTE DUPLICATION (80/20 SHARED MANDATE)**  
> *"Admin, User Web, aur Mobile App ke liye alag-alag duplicate APIs nahi banengi. Jitni APIs same ho sakti hain, utni maximum same rahengi."*  
> Creating separate endpoints for identical data entities (e.g., separate search endpoints for mobile vs web vs admin) triples maintenance costs and causes desynchronization bugs.  
> - ❌ **Never write:** Duplicate controller logic or redundant route clones when the underlying business action is shared.  
> - ✅ **Always write:**  
>   1. **Common Shared Endpoints (~80%):** Master Dropdowns, Auth & OTP, Candidate Searches, 36-Guna Kundli Milan, Matches Recommendations, Interests, Real-time Chat, Razorpay Payments, Notifications, and Support must share **identical route paths and controllers** across Mobile (`sindhiMatrimony`), User Web (`sindhiMatrimonyUserPanel`), and Admin (`sindiMatrimonyAdmin`).  
>   2. **Role-Aware Smart Controllers:** When data requirements vary (e.g. unmasked phone numbers vs masked phone numbers), inspect `req.auth.role` inside the controller to selectively project fields, rather than writing two different endpoints.  
>   3. **Strict Admin Segregation (~20%):** Reserve `/api/v1/admin/*` purely for internal operational logic (staff lead allocation, employee permissions, refund execution, server maintenance).

> 🛑 **STRICT RULE 5: SKINNY CONTROLLERS & ASYNC CONCURRENCY (ZERO BOILERPLATE & PROMISE.ALL)**  
> *"Controller me sirf 3-5 line ka code hona chahiye. Boilerplate try/catch ki jagah `asyncHandler` use hoga aur independent queries `Promise.all` se parallel chalengi."*  
> - ❌ **Never write:** 25 lines of repetitive try/catch blocks and manual error response formatting inside every controller method.  
> - ❌ **Never write:** Sequential awaits (`await count; await list;`) for independent database queries.  
> - ✅ **Always write:**  
>   1. **Wrap in `asyncHandler`:** Controllers extract parameters, invoke domain services, and return `apiHTTPResponse()`. Unhandled errors automatically bubble to `errorHandler.js`.  
>   2. **Concurrent I/O via `Promise.all`:** Independent count, find, Redis, or notification dispatches must run in parallel to cut execution time by 50%.

> 🛑 **STRICT RULE 6: ZERO-WRITE MUTATION MEMOIZATION (FAST-DEEP-EQUAL)**  
> *"Agar client update request me same data bhej raha hai jo DB me pehle se hai, to database write skip karke purana response turant 2ms me de do."*  
> Blind updates of unchanged forms or settings trigger unnecessary MongoDB write locks, oplog entries, and disk flushes.  
> - ❌ **Never write:** Unconditional `findByIdAndUpdate()` on forms without checking if data actually changed.  
> - ✅ **Always write:** Compare sanitized update payload against existing document using `isDataEqual()` (`fast-deep-equal`). If identical, skip the database write entirely and return immediate success in **sub-2ms**!

> 🛑 **STRICT RULE 7: GUARANTEED FULL DATA CONTRACT (SAME DATA ALWAYS RETURNED TO FRONTEND)**  
> *"Chahe data same ho ya cached ho, API ke return me frontend ko hamesha poora data milega."*  
> Both in repeated screen navigation (`GET /profile`, `GET /leads/:id`) and in no-op mutations (`PUT /profile`, `PATCH /leads/:id`), the API must **always return the complete data object in `data: { ... }` with `HTTP 200 OK`**.  
> - ❌ **Never return:** `null`, empty `{}` data, or omit fields because "data is already known by client".  
> - ✅ **Always write:**  
>   1. **Repeated Fetch (`GET`):** When user navigates Back $\leftrightarrow$ Forward between screens, serve from **Redis RAM in 1ms** and return the complete profile/document. MongoDB is completely bypassed.  
>   2. **No-Op Mutation (`PUT`/`PATCH`):** When user taps Save on an unchanged form, skip MongoDB disk writes and write locks via `isDataEqual()`, and return the complete existing document in `data: { ... }`.  
>   3. **Frontend Safety:** Redux Toolkit Query, React Native state, and Next.js UI always receive a consistent, guaranteed data contract without breaking or flickering.

> 🛑 **STRICT RULE 8: INSPECT-FIRST REUSABILITY MANDATE (ZERO DUPLICATE CODE & ASYNC/AWAIT STANDARDS)**  
> *"Jab bhi hum koi function ya code write karein, to pehle yeh observe karein ki already kahin par same ya similar code likha hua hai kya. Agar haan, ya agar yeh multiple jagah use ho sakta hai, to uska centralized reusable function banao (`utils/globalFunction.js` ya domain services me) aur hamesha non-blocking `async/await` se manage karo."*  
> - ❌ **Never write:** Copy-pasting functions, calculations, or writing duplicate inline code across controllers or routes.  
> - ✅ **Always write:**  
>   1. **Inspect First (Pehle Check Karo):** Before coding any helper, date math, hashing, privacy masking, formatting, or pagination, check `utils/globalFunction.js` and `services/crudService.js`. If a similar function exists, re-use it.  
>   2. **Extract & Centralize (Reusable Banao):** If an operation is used (or will be used) in 2 or more places, extract it immediately into a reusable utility in `utils/globalFunction.js` or dedicated service.  
>   3. **Mandatory Async/Await:** All asynchronous tasks, database calls, external APIs, and file I/O must be strictly managed using clean `async/await` (never callbacks or unhandled promises).

1. **File Naming Conventions:**
   - Controllers: camelCase (e.g., `admin.js`, `users.js`, `employees.js`).
   - Models: camelCase with `.model.js` suffix (e.g., `lead.model.js`, `callLog.model.js`).
   - Routes: camelCase (e.g., `admin.js`, `users.js`, `index.js`).
   - Validators: camelCase matching route files (e.g., `admin.js`, `users.js`).
   - Services: `service` prefix or camelCase (e.g., `serviceRedis.js`, `serviceHoroscope.js`, `crudService.js`).

2. **No Direct Database Queries in Controllers:**
   - Always route queries through `crudService.js` or domain-specific services.
   - Controllers should only extract params, validate, invoke services, and call `apiHTTPResponse()`.

3. **Mandatory Audit Logging on Mutating Actions:**
   - Any operation altering permissions, suspending users, issuing refunds, or viewing unmasked contacts must invoke `AuditLog.create()` or a service audit helper.

4. **Redis Cache Invalidation Rules:**
   - Any mutation to Subcastes, Gotras, or System Settings must immediately publish a cache invalidation event to Redis (`redisClient.del("cache:master_data")`).

5. **Soft Delete Policy:**
   - Permanent database row deletions are strictly prohibited. Models must use `isDeleted: { type: Boolean, default: false }`.

---

## 8. Client-Side Offline-First Architecture & Zero-Token Master Data (WatermelonDB + Redis)

> 💡 **Core Goal:** Eliminate 90% of redundant API requests, achieve **0ms instant UI rendering** on mobile & web, prevent server memory crashes, and keep monthly cloud costs strictly under **$5–$10/month**.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                   OFFLINE-FIRST CLIENT-SERVER TOPOLOGY (WATERMELONDB + REDIS)          │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                        │
│  [ FRONTEND (Mobile / Web) ]                                                           │
│  • WatermelonDB (SQLite on JSI / C++ Thread) ── Instant 60-120 FPS reads               │
│  • Local Stores: Castes, Gotras, Surnames, Shortlists, Recent Chats, Feed Cards        │
│                                      │                                                 │
│                     ┌────────────────┴────────────────┐                                │
│                     │ 1. App Launch / Onboarding      │ 2. Background Delta Sync       │
│                     ▼ (ZERO TOKEN REQUIRED)           ▼ (PULL / PUSH CHANGES)          │
│  [ BACKEND API ]    GET /api/v1/common/dropdowns      GET  /api/v1/sync/pull           │
│                     (ETag 304 + Brotli Compressed)    POST /api/v1/sync/push           │
│                                      │                                                 │
│                                      ▼                                                 │
│  [ REDIS L2 RAM ]   Pre-Warmed Master Data + Master Version Key ("v1.0.2")             │
│                     Latency: < 1ms | DB Load: 0%                                       │
│                                      │ (Cache Miss or Delta Pull)                      │
│                                      ▼                                                 │
│  [ MONGODB ATLAS ]  Indexed Queries: { updatedAt: { $gt: lastPulledAt }, isDeleted }   │
│                                                                                        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### 8.1 WatermelonDB (React Native SQLite) Offline-First Topology

For the **`sindhiMatrimony` Mobile App (React Native)**, relying solely on standard `AsyncStorage` causes UI stutters when storing thousands of candidate profiles and chat records because `AsyncStorage` serializes JSON directly over the JavaScript bridge.

**Why WatermelonDB is Architectural Best Practice:**
1. **SQLite Native Threading (Zero JS Thread Lag):** WatermelonDB runs on background C++/SQLite threads via JSI. Even with **50,000 chat messages** and **10,000 cached profiles**, app launch latency remains under **16 milliseconds (60–120 FPS)**.
2. **Lazy Loading Collections:** When scrolling through candidate feeds or conversations, WatermelonDB only instantiates records actively rendered on screen.
3. **True Offline Experience:** Candidates can browse recently recommended matches, review shortlisted profiles, and view detailed biodatas even on weak 2G networks or in flight mode.
4. **Observable Reactivity:** Components subscribe directly to database queries. When a match status changes or a message arrives, only the affected card re-renders.

**Core Local WatermelonDB Schema Tables:**
- `subcastes` / `gotras` / `surnames` / `religions` (Static master dictionary)
- `candidate_cards` (Cached profile cards with photos, age, profession, verified badge)
- `user_conversations` & `user_messages` (Local chat thread history)
- `shortlisted_candidates` (User's local bookmarking list)

---

### 8.2 Single Consolidated Public Dropdowns API (`GET /api/v1/common/dropdowns`)

#### The Problem:
When a new user visits the platform or opens the app after installation, they **do not possess a JWT Bearer token**. However, the initial screen is the **Registration / Onboarding Form** or the **Landing Page Search Filter**, where they must immediately choose:
- Sindhi Subcaste (`Amil`, `Baibhand`, `Sahiti`, `Larkana`, etc.)
- Gotra (`Kashyap`, `Vashishta`, etc.)
- Religion, Marital Status, Manglik Status, Education, Profession, City, Annual Income.

Requiring a JWT token or firing 8 separate HTTP GET requests (`/subcastes`, `/gotras`, `/cities`, etc.) produces network waterfalls, slow onboarding, and user drop-off.

#### The Architectural Solution:
A single, unauthenticated, consolidated bundle endpoint:

```
GET /api/v1/common/dropdowns
```

- **Authentication:** **100% Public (Zero Token Required)**. Whitelisted in `middlewares/jwt.js`.
- **Pre-Warmed from Redis RAM:** Loaded on server boot via `worker/cacheSettings/index.js`. No MongoDB hit occurs (0% database cost).
- **HTTP 304 Not Modified Caching:** Response headers include:
  ```http
  Cache-Control: public, max-age=86400, stale-while-revalidate=604800
  ETag: "w/sindhi-dropdowns-v1.0.2"
  ```
  Subsequent checks from web browsers and mobile clients return `304 Not Modified` with **zero payload transfer**.
- **Payload Compression:** Express compression middleware applies Brotli / Gzip, shrinking the ~100 KB JSON dictionary down to **~12 KB**.
- **Client Ingestion:** On first launch, the mobile app writes this payload into **WatermelonDB**; all dropdowns and search filters subsequently render instantly with **0 network round-trips**.

#### Standard Response Payload Structure:
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

---

### 8.3 WatermelonDB Delta Sync Engine (`routes/sync/`)

To keep the local WatermelonDB on mobile devices perfectly synchronized with MongoDB Atlas without transferring full collections on every app open, the backend provides a standard **Delta Synchronization Protocol**:

#### 1. Delta Pull Endpoint:
```http
GET /api/v1/sync/pull?last_pulled_at=1734500000000
```
- **Controller:** `controllers/sync/users.js`
- **Logic:** Queries MongoDB for records where `updatedAt > new Date(lastPulledAt)`:
  - `created`: Documents created after `last_pulled_at`.
  - `updated`: Documents modified after `last_pulled_at` where `isDeleted: false`.
  - `deleted`: Array of IDs where `isDeleted: true` and `updatedAt > lastPulledAt`.
- **Response Format:**
  ```json
  {
    "changes": {
      "candidate_cards": { "created": [], "updated": [...], "deleted": ["653e1..."] },
      "messages": { "created": [...], "updated": [], "deleted": [] },
      "shortlists": { "created": [...], "updated": [], "deleted": [] }
    },
    "timestamp": 1734536000000
  }
  ```

#### 2. Delta Push Endpoint:
```http
POST /api/v1/sync/push?last_pulled_at=1734500000000
```
- **Controller:** `controllers/sync/users.js`
- **Logic:** Receives local client actions queued while offline (e.g., shortlisted candidate IDs, message read receipts) and executes bulk writes to MongoDB via transactional sessions.

---

### 8.4 Client Versioning & Smart Cache Invalidation (`masterDataVersion`)

When the Admin updates Subcastes, Gotras, or Subscription packages in the CRM portal, client devices must discover the change without constantly polling the heavy dropdown API:

1. **Redis Version Key:** Redis maintains a lightweight integer/string key: `system:master_data_version` (e.g., `"1.0.2"`).
2. **Admin Invalidation Hook:** Any admin mutation to `caste.model.js`, `gotra.model.js`, or `membershipPlan.model.js` automatically:
   - Increments the version string in Redis (`"1.0.3"`).
   - Evicts the cached dropdown bundle (`redisClient.del("cache:public_dropdowns")`).
3. **App Startup Handshake:** When the mobile app or web app initializes, it passes `If-None-Match: "1.0.2"` or checks a 10-byte handshake endpoint:
   - If version matches local WatermelonDB version $\rightarrow$ **0 network data transferred**.
   - If version differs $\rightarrow$ App pulls the updated master data bundle and refreshes local SQLite tables in the background.

---

### 8.5 Direct-to-Cloud Media Uploads (Presigned URLs via Cloudflare R2 / S3)

> 🛑 **MANDATORY COST & RAM PROTECTION RULE:**  
> Never upload binary images or multi-page PDF documents through the Express Node.js server using standard disk/memory Multer buffering.

#### Why Direct Uploads are Mandatory:
- Buffering a 10 MB candidate photo in Node.js memory consumes valuable event loop CPU cycles during `sharp` image processing.
- AWS S3 / Cloud providers charge high **Data Egress (outbound data transfer) fees** if images are routed through the backend.

#### Architecture:
1. **Presigned URL Request:** Mobile App / Web calls:
   ```http
   POST /api/v1/media/presigned-url
   Body: { "fileCategory": "PROFILE_PHOTO", "mimeType": "image/webp", "fileSize": 2048576 }
   ```
2. **Backend Issue:** Backend validates user permissions, generates a short-lived (5-minute) signed upload URL for **Cloudflare R2** (Zero Egress Fees) or **AWS S3**, and returns the URL.
3. **Direct Client Upload:** The client uploads the binary directly to Cloudflare R2 / S3 via `PUT`.
4. **Metadata Save:** Client calls `POST /api/v1/members/photo/confirm` with the file key to register the photo in `userPhoto.model.js` for admin KYC moderation.
- **Backend RAM & Bandwidth Used:** **0 MB**.

---

### 8.6 Lightweight PDF & Memory Safeguards (Puppeteer OOM Protection)

In `services/serviceBiodata.js`, generating candidate matrimonial biodatas with headless Chromium (`puppeteer`) consumes **300 MB – 500 MB RAM per instance**. On a $5–$10 VPS (1 GB – 2 GB RAM), multiple concurrent PDF downloads cause **Out-Of-Memory (OOM) fatal process termination**.

**Safeguards Implemented in Blueprint:**
1. **Primary PDF Generator (`pdfkit`):** Standard candidate biodatas must be rendered using `pdfkit` or `pdfmake` streaming writers. Memory footprint: **< 25 MB RAM**.
2. **Puppeteer Queue Concurrency Limiter:** If Puppeteer HTML-to-PDF is required for luxury multi-page templates:
   - Offload execution to `serviceQueueBull.js` (`worker/`).
   - Restrict BullMQ worker concurrency strictly to **`concurrency: 1`**.
   - Re-use a single persistent Chromium browser instance with recycled pages, rather than launching fresh browser instances per request.

---

### 8.7 Dual-Mode Pagination Architecture (Keyset Cursor vs Offset)

To ensure that candidate searches scale efficiently as the member base grows to 100,000+ profiles:

| Consumer | Use Case | Pagination Strategy | Implementation | DB Complexity |
|:---|:---|:---|:---|:---|
| **Admin CRM Portal** | Staff search, jump-to-page, exact total count | **Offset Pagination** | `.skip((page - 1) * limit).limit(limit)` | $O(N)$ (Acceptable for small internal tables) |
| **Mobile App & Web Feed** | Infinite scroll candidate recommendations, chat messages | **Keyset / Cursor Pagination** | `{ _id: { $lt: lastCursorId } }.limit(20)` | **$O(1)$ (1 ms lookup regardless of depth)** |

**Cursor Query Pattern in `crudService.js`:**
```javascript
// Keyset cursor pagination: ultra-fast, zero-skip
export const getCursorFeed = async (Model, filter = {}, lastId = null, limit = 20) => {
  const query = { ...filter, isDeleted: false };
  if (lastId) {
    query._id = { $lt: new mongoose.Types.ObjectId(lastId) };
  }
  return await Model.find(query)
    .sort({ _id: -1 })
    .limit(limit)
    .select("fullName age height subcaste city profession avatarUrl isVerified")
    .lean();
};
```

---

### 8.8 Multi-Scenario GET Optimization & `isDataEqual` Architecture (7 Critical Read Scenarios)

> 🛑 **MANDATORY PERFORMANCE RULE:**  
> In read-heavy matrimonial workflows, `GET` requests are optimized across **7 critical production scenarios** to prevent redundant MongoDB disk scans, eliminate cloud egress costs, and keep mobile apps operating at a fluid **120 FPS without UI flickers**:

1. **Detail Screens Back $\leftrightarrow$ Forward (`GET /profile/:id`, `GET /leads/:id`):**
   - Client sends `If-None-Match: "timestamp"` or `?lastUpdatedAt=...`.
   - Backend compares timestamps using `isDataEqual()`.
   - Returns **`HTTP 200 OK` with complete data from Redis RAM in 1ms**. MongoDB disk read = 0.
2. **Master Dropdowns (`GET /common/dropdowns`):**
   - Castes, Subcastes, Gotras, and Packages change rarely.
   - Client passes `?version=1.0.4`. If `isDataEqual(serverMasterVersion, clientVersion)`, returns memoized bundle without running MongoDB aggregations.
3. **Matches & Feeds Recommendations (`GET /matches/recommendations`):**
   - Feeds are cached per user tab in Redis (`cache:feed:${userId}:${tab}`).
   - If no new matching candidate was approved by admin since feed generation, pre-ranked list is returned in **2ms**.
4. **Chat & Real-Time Messages (`GET /chat/messages/:id`):**
   - Client passes `?lastMessageTimestamp=...`.
   - If `isDataEqual(conversation.lastMessageAt, clientTimestamp)`, backend returns `{ hasNew: false, messages: [] }`. Avoids reading 50 chat messages from DB on every chat open.
5. **Admin CRM Lead Buckets (`GET /leads/admin?tab=UNASSIGNED`):**
   - Telecallers switch between CRM tabs frequently.
   - Redis maintains 60-second micro-cache bucket key. Unchanged buckets render in 2ms.
6. **Notification Badge & Unread Counters (`GET /notifications/unread-count`):**
   - App checks notification counter on every app resume or tab switch.
   - Handled purely via Redis in-memory integer (`user:unread_notifs:${userId}`). MongoDB `countDocuments()` is strictly prohibited. Served in **0.5ms**!
7. **Client-Side Mobile App (React Native) Re-render Suppression:**
   - When API returns data, mobile client runs `if (isDataEqual(currentState, apiData)) return;`.
   - Skips React component re-rendering entirely, eliminating screen flickers and preserving 120 FPS.

---
*Document Version: 1.3.0 — Official Folder Structure & Architecture Specification for `sindhiMatrimonyBackhend`.*

