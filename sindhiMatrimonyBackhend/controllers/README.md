# 🎮 Controllers Layer — Architecture & Responsibilities

## 📌 Overview
Controllers request lifecycle ka central orchestrator hote hain. Ye HTTP requests receive karte hain, business logic ko services aur models ke through trigger karte hain, aur standard format me JSON response return karte hain.

## 🎯 Core Principles & Rules
1. **Skinny Controllers**: Controller me direct heavy business logic ya raw SQL/complex mongoose pipeline nahi likhte. Complex calculations Services me hongi.
2. **Zero Hardcoded Strings**: Sabhi success aur failure messages `utils/constantsMessage.js` se aayenge.
3. **Uniform Response**: Response hamesha `apiHTTPResponse(res, status, code, message, data, metadata)` ke through hi send hoga.
4. **Zero-Write Mutation (fast-deep-equal)**: Update APIs me DB write tabhi hoga jab request data existing record se actual me different ho.
5. **Role Segregation**:
   - `admin.js`: Admin CRM & Telecalling staff ke dedicated actions.
   - `users.js`: Mobile App & Web Portal user ke self-service actions.
   - `index.js`: Barrel exporter.

---
## 📂 Folder Breakdown
- `admin/`: Staff & RBAC management.
- `auth/`: Login, signup, MFA, OTP verification.
- `calls/`: Telephony Click-to-Call & call log dispositions.
- `campaigns/`: Marketing popups, festival offers & push notifications.
- `chat/`: Staff team chat & Member-to-member moderated chat.
- `common/`: Public unauthenticated dropdown bundles (Zero-token master data).
- `dashboard/`: Admin KPI counters, queues, conversion graphs.
- `finance/`: Razorpay order creation, payments, invoices, refunds.
- `horoscope/`: 36-Guna Kundli Milan calculator & Manglik checks.
- `leads/`: CRM pipeline, lead allocation, stage transitions.
- `masterData/`: Sindhi Castes, Subcastes, Gotras, Surnames CRUD.
- `matchmaking/`: Automated & Assisted matchmaking proposals.
- `members/`: 7-Step candidate profile onboarding, biodata PDF, gallery.
- `plans/`: Membership plans, pricing & feature matrices.
- `reviews/`: Success reviews & public ratings moderation.
- `safety/`: User blocking, report abuse, blacklisted identities.
- `stories/`: Vivah success stories registry.
- `support/`: Customer support tickets & FAQ management.
- `sync/`: WatermelonDB delta sync (Pull/Push) for offline mobile app.
- `tasks/`: Staff daily follow-up task manager.
- `tools/`: System health diagnostics, cache clearing, index monitor.
- `verifications/`: KYC moderation queue (Aadhaar & photo selfie approvals).
- `webhooks/`: Payment & Telephony provider incoming event handlers.
