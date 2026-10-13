# 🛡️ Sindhi Matrimony – Complete Admin Portal Architecture
### Admin CRM + Backend + Database + API – Full Technical Specification
> **Single Backend** → Mobile App (React Native) + User Web Portal + Admin Dashboard
> **Source:** `Matrimony_Admin_Portal_Complete_Requirements.docx` + App Code Analysis

---

## 📋 Table of Contents
1. [System Architecture Overview](#1-system-architecture)
2. [Role-Based Access Control (RBAC)](#2-rbac)
3. [Database Schema – All Models](#3-database-schema)
4. [Admin Modules & APIs](#4-admin-modules)
5. [Backend Folder Structure](#5-folder-structure)
6. [Complete API Reference](#6-api-reference)
7. [Key Workflows](#7-workflows)
8. [Tech Stack](#8-tech-stack)
9. [Implementation Roadmap](#9-roadmap)
10. [Pre-Dev Decisions Required](#10-decisions)
11. [Low-Cost, Zero-Spam & High-Performance Architecture](#11-low-cost-optimization)


---

## 1. System Architecture

```
CLIENT PLATFORMS
  📱 Mobile App (React Native)     sindhiMatrimony
  💻 User Web Portal (Next.js)     sindhiMatrimonyUser
  🛡️ Admin Dashboard (React+Vite)   sindiMatrimonyAdmin
           ↓  HTTPS + JWT Bearer Token
UNIFIED BACKEND  →  sindhiMatrimonyBackhend  (Node.js + Express + TypeScript)
  ├── Middleware: JWT Auth | RBAC Role Check | Rate Limiter | Input Validator
  ├── API Routes: /auth | /profile | /matches | /interests | /chat
  │              /subscriptions | /admin | /admin/crm | /admin/finance
  │              /admin/campaigns | /admin/reports | /common
  └── Real-time: Socket.io (User Chat + Admin Live Notifications)
           ↓
  🍃 MongoDB Atlas          ☁️ AWS S3 / Cloudinary
  - users                   - Profile Photos
  - profiles                - ID Documents
  - employees               - Ad Creatives
  - leads (CRM)             - Call Recordings
  - calls
  - conversations           External Services
  - messages                📲 SMS OTP (MSG91)
  - subscriptions           🔔 Firebase FCM
  - transactions            💳 Razorpay
  - campaigns               📞 Exotel (VoIP)
  - audit_logs              💬 WhatsApp API
  - notifications           📧 SendGrid
```

---

## 2. RBAC – Roles & Permissions

### 2.1 System Roles (11 total)

| Role | Platform | Scope |
|:---|:---|:---|
| `SUPER_ADMIN` | Admin | Full access, manages employees, "View as Employee" |
| `ADMIN` | Admin | All modules except billing config + super settings |
| `CRM_MANAGER` | Admin | Lead assignment, SLA oversight, bulk assign/reassign |
| `CRM_AGENT` | Admin | Own/assigned leads only, call, note, follow-up |
| `FINANCE_MANAGER` | Admin | Approve refunds, full finance access |
| `FINANCE_STAFF` | Admin | View transactions, raise refund requests |
| `MODERATOR` | Admin | Photo approval, KYC review, abuse reports |
| `AD_MANAGER` | Admin | Create, approve, publish, pause campaigns |
| `SUPPORT_AGENT` | Admin | Chat handling, assigned member profiles |
| `ANALYST` | Admin | View-only dashboard + masked data exports |
| `USER` | Mobile+Web | Profile, matches, interests, chat, subscriptions |

### 2.2 Permission Matrix

| Permission | SUPER | ADMIN | CRM_MGR | CRM_AGT | FIN_MGR | MOD | AD_MGR | ANALYST |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| View Users | ✅ | ✅ | ✅ | Own | ✅ | ✅ | ❌ | ✅ masked |
| Edit Users | ✅ | ✅ | ❌ | ❌ | ❌ | Limited | ❌ | ❌ |
| View Leads | ✅ | ✅ | ✅ | Own | ❌ | ❌ | ❌ | ✅ |
| Assign Leads | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Call from CRM | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| View Finance | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | Limited |
| Approve Refund | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Manage Plans | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Moderate Photos | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Manage Campaigns | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Export Data | ✅ | ✅ | ✅ leads | ❌ | ✅ finance | ❌ | ✅ ads | ✅ masked |
| Audit Logs | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage Roles | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

### 2.3 RBAC Principles
- **Least Privilege**: Employee gets minimum access needed
- **Backend-Enforced**: UI hiding is NOT enough — every API validates role independently
- **IDOR Prevention**: Employee A cannot access Employee B's leads by URL manipulation
- **Record Scopes**: `ALL` / `OWN` / `ASSIGNED` / `TEAM` / `REGION`
- **Temp Access**: Auto-revoke on `tempAccessExpiry` date via cron job
- **Reason Mandatory**: Role change, permission override, sensitive action require reason text
- **Immutable Audit**: Every permission change permanently logged — cannot edit/delete


---

## 3. Database Schema – All Models

### 3.1 Employee Schema
```
Employee {
  _id, employeeId (EMP001), fullName, email, mobile, passwordHash
  role: Enum [SUPER_ADMIN, ADMIN, CRM_MANAGER, CRM_AGENT, FINANCE_MANAGER,
              FINANCE_STAFF, MODERATOR, AD_MANAGER, SUPPORT_AGENT, ANALYST]
  department, managerId→Employee, teamId→Team
  permissions: {
    leads:   { view, assign, export, call }
    members: { view, edit, verify }
    finance: { view, refund, export }
    ads:     { view, create, publish, pause }
    reports: { view, export }
    chat:    { receive, initiate, viewHistory }
    settings:{ manage }
  }
  recordScope: Enum [ALL, OWN, ASSIGNED, TEAM, REGION]
  regions[], languages[]
  isActive, isChatEnabled
  chatShifts: [{ startTime, endTime, days:[MON-SUN] }]
  maxLeadCapacity, tempAccessExpiry
  fcmTokens[], lastLoginAt, lastActiveAt, mfaEnabled
  createdBy→Employee, createdAt, updatedAt
}
```

### 3.2 User (Candidate/Parent) Schema
```
User {
  _id, mobile (Unique+Indexed), dialCode, email
  passwordHash, role: USER
  accountType: Enum [SELF, PARENT, SIBLING, RELATIVE]
  status: Enum [ACTIVE, PENDING_VERIFICATION, SUSPENDED, DELETED]
  isMobileVerified, isEmailVerified, isProfileVerified (Blue Tick)
  membershipTier: Enum [FREE, SILVER, GOLD, PLATINUM]
  membershipExpiresAt, fcmTokens[], lastActiveAt
  createdBy→Employee (if admin-created)
  createdAt, updatedAt
}
```

### 3.3 Profile Schema (Matrimony Details — Sindhi Specific)
```
Profile {
  userId→User (Unique)
  
  // Basic
  fullName, gender: [MALE/FEMALE], dob, heightCm
  maritalStatus: [NEVER_MARRIED, DIVORCED, WIDOWED, AWAITING_DIVORCE]
  motherTongue, physicalStatus: [NORMAL, PHYSICALLY_CHALLENGED], bio
  
  // Location
  country, state, city, citizenship
  
  // Sindhi Community (Key Fields)
  religion, caste
  subcaste: String  // Amil, Baibhand, Sahiti, Larkana, Shikarpuri, Dadu, Sehwani, etc.
  gotra, rashi, nakshatra
  manglik: [YES, NO, DONT_KNOW, ANSCHIK]
  horoscopeFileUrl
  
  // Education & Career
  highestEducation, educationDetail
  employedIn: [PRIVATE, GOVERNMENT, BUSINESS, DEFENCE, NOT_WORKING]
  occupation, companyName, annualIncome
  
  // Family
  familyType: [NUCLEAR, JOINT]
  familyStatus: [MIDDLE_CLASS, UPPER_MIDDLE_CLASS, RICH_AFFLUENT]
  fatherOccupation, motherOccupation
  brothersCount, brothersMarried, sistersCount, sistersMarried
  familyNativeCity, aboutFamily
  
  // Lifestyle
  diet: [VEGETARIAN, NON_VEGETARIAN, EGGETARIAN, JAIN]
  smoking, drinking: [NO, OCCASIONALLY, YES]
  hobbies: []
  
  // Media
  avatar: String (URL)
  photos: [{ url, isApproved, isPrivate, approvedBy→Employee,
             rejectionReason, uploadedAt }]
  
  profileCompletionPercentage: Number (0-100)
  completionChecklist: {
    basicDetails, religionDetails, education, family, photos, partnerPreference
  }
}
```

### 3.4 PartnerPreference Schema
```
PartnerPreference {
  userId→User (Unique)
  ageMin, ageMax, heightMinCm, heightMaxCm
  maritalStatus[], subcastes[] (or ['ANY'])
  manglik: [YES, NO, DOES_NOT_MATTER]
  education[], employedIn[], annualIncomeMin
  countries[], states[], cities[]
  diet[]
}
```

### 3.5 Lead (CRM) Schema
```
Lead {
  _id, leadId (LEAD-2024-00001)
  
  // Identity
  userId→User (if registered), name, mobile, dialCode, email
  city, gender, ageRange, subcaste
  
  // Source
  source: Enum [WEBSITE_FORM, MOBILE_APP, CALLBACK_REQUEST, INBOUND_CALL,
                CHAT, ADVERTISEMENT, CAMPAIGN_LANDING, REFERRAL, EVENT, MANUAL_IMPORT]
  campaignId→Campaign, referralCode
  
  // Lifecycle Status
  status: Enum [NEW, UNASSIGNED, ASSIGNED, ATTEMPTED, CONTACTED, QUALIFIED,
                INTERESTED, SUBSCRIPTION_PENDING, CONVERTED, FOLLOW_UP,
                NOT_INTERESTED, INVALID, DUPLICATE, LOST, DO_NOT_CONTACT]
  priority: [LOW, MEDIUM, HIGH, URGENT]
  
  // Ownership & Assignment
  ownerId→Employee
  previousOwners: [{ employeeId, assignedAt, removedAt, reason }]
  teamId→Team, assignedBy→Employee, assignedAt, assignmentRule
  
  // Follow-up & SLA
  nextFollowUp, followUpTimezone
  followUpChannel: [CALL, CHAT, EMAIL, WHATSAPP]
  slaTarget, firstContactAt
  
  // Interest Data
  planInterest, budget, objection, conversionValue, convertedAt
  
  // Flags
  isDuplicate, mergedIntoLeadId→Lead
  isDoNotContact, doNotContactReason
  
  createdAt, updatedAt
}
```

### 3.6 LeadActivity / Timeline Schema
```
LeadActivity {
  leadId→Lead, actorId→Employee, actorType: [EMPLOYEE, SYSTEM, USER]
  
  type: Enum [CALL_ATTEMPT, CALL_CONNECTED, CALL_MISSED, NOTE_ADDED,
              STATUS_CHANGED, ASSIGNED, REASSIGNED, FOLLOW_UP_SET,
              FOLLOW_UP_DONE, CHAT_STARTED, EMAIL_SENT, WHATSAPP_SENT,
              SUBSCRIPTION_LINKED, PAYMENT_EVENT, CONSENT_UPDATED]
  
  // Call fields
  callId→CallLog, callDuration (seconds)
  callOutcome: [ANSWERED, NO_ANSWER, BUSY, FAILED, VOICEMAIL]
  callDisposition: [INTERESTED, FOLLOW_UP, NOT_INTERESTED, WRONG_NUMBER,
                    CONVERTED, DO_NOT_CALL, CUSTOM]
  
  // Note fields
  noteText, isInternal (true=admin only, false=customer visible)
  
  // Status change fields
  previousStatus, newStatus
  
  attachments: [{ url, filename, mimeType, sizeBytes }]
  createdAt (Timestamp only — no updates)
}
```

### 3.7 CallLog Schema
```
CallLog {
  leadId→Lead, employeeId→Employee, memberId→User
  providerCallId (Exotel/VoIP ID)
  direction: [OUTBOUND, INBOUND]
  from (masked), to (masked), callerDisplayId
  status: [INITIATED, RINGING, CONNECTED, NO_ANSWER, BUSY, FAILED, COMPLETED]
  startedAt, connectedAt, endedAt, durationSeconds
  disposition: [INTERESTED, FOLLOW_UP, NOT_INTERESTED, WRONG_NUMBER,
                CONVERTED, DO_NOT_CALL, CUSTOM]
  dispositionNote
  recordingUrl (signed URL — access controlled), transcriptUrl
  isRecordingEnabled
  createdAt
}
```

### 3.8 Conversation & Message Schema
```
Conversation {
  type: [USER_TO_USER, SUPPORT]
  participants: [{ userId, lastReadAt }]
  initiatedByInterestId→Interest
  lastMessage→Message
  unreadCounts: { [userId]: Number }
  isBlocked, blockedBy→User
}

Message {
  conversationId→Conversation, senderId→User
  type: [TEXT, IMAGE, DOCUMENT, SYSTEM]
  content, mediaUrl, isRead, readAt, isDeleted
  createdAt
}
```

### 3.9 Plan & Subscription Schema
```
Plan {
  name, tier: [FREE, SILVER, GOLD, PLATINUM]
  priceINR, priceUSD, validityDays
  contactsViewLimit, chatEnabled, profileBoostCredits
  canViewPhone, canViewEmail, prioritySupport
  features[], taxPercent, isActive, displayOrder
  createdBy→Employee
}

Subscription {
  userId→User, planId→Plan
  status: [PENDING, ACTIVE, RENEWAL_DUE, EXPIRED, CANCELLED, REFUNDED,
           PAYMENT_FAILED, DISPUTED]
  purchasedAt, startsAt, expiresAt, autoRenew
  orderId, paymentId, paymentGateway: [RAZORPAY, CASHFREE]
  amountPaid, currency, couponCode, discountAmount, taxAmount
  contactsViewedRemaining, profileBoostUsed
  isManualEntitlement, grantedBy→Employee, grantReason
}
```

### 3.10 Transaction Schema
```
Transaction {
  transactionId (Unique)
  userId→User, subscriptionId→Subscription
  type: [PAYMENT, REFUND, PARTIAL_REFUND, CHARGEBACK, ADJUSTMENT]
  status: [SUCCESS, PENDING, FAILED, REFUNDED, DISPUTED]
  amount, currency, discountAmount, taxAmount, gatewayFee, netAmount
  gatewayOrderId, gatewayPaymentId, gatewaySignature, gatewayResponse
  refundId, refundAmount, refundReason, refundedBy→Employee, refundedAt
  invoiceUrl, reconciled, reconciledAt
  createdAt (immutable)
}
```

### 3.11 Campaign / Advertisement Schema
```
Campaign {
  campaignId (CAMP-001)
  advertiserName, advertiserContact, advertiserEmail, billingDetails
  contractStartDate, contractEndDate
  name, objective
  status: [NEW_REQUEST, REVIEW, AWAITING_CREATIVE, AWAITING_PAYMENT,
           APPROVED, SCHEDULED, LIVE, PAUSED, COMPLETED, REJECTED]
  creativeType: [IMAGE, RESPONSIVE_IMAGE, HTML_TEMPLATE, VIDEO]
  creativeUrl, destinationUrl, cta, creativeDimensions
  placement: [HOME_POPUP, HOME_BANNER, SEARCH_BANNER, PROFILE_DETAIL,
              APP_HOME_BANNER, IN_APP_MODAL, LANDING_PAGE]
  targetPlatform: [WEB, MOBILE, BOTH]
  targeting: { locations[], loginState, audienceSegment, pageContext[] }
  startDate, endDate, timezone
  frequencyCap: { count, per: [SESSION, DAY, WEEK] }
  dismissBehavior: [CLOSE_BUTTON, AUTO_CLOSE_5S, CLICK_OUTSIDE]
  priority
  pricingModel: [FIXED_PLACEMENT, IMPRESSION_BASED, CLICK_BASED]
  price, invoicedAmount, amountReceived, outstandingBalance
  // Analytics
  eligibleViews, impressions, clicks, dismissals, ctaConversions, campaignLeads
  approvedBy→Employee, rejectionReason, approvedAt
  createdBy→Employee
}
```

### 3.12 AuditLog Schema (IMMUTABLE — never update/delete)
```
AuditLog {
  actor: { id, name, role, ip, userAgent }
  action: String  // "LEAD_ASSIGNED", "MEMBER_SUSPENDED", "REFUND_APPROVED"
  module: [AUTH, EMPLOYEE, LEAD, MEMBER, SUBSCRIPTION, FINANCE, CAMPAIGN, MODERATION]
  targetType, targetId
  beforeData: Object  // Snapshot before change
  afterData: Object   // Snapshot after change
  changedFields: []
  reason: String (mandatory for sensitive actions)
  requestId, sessionId
  result: [SUCCESS, FAILURE, PARTIAL]
  errorMessage
  timestamp: Date (never changeable)
}
```

### 3.13 Notification Schema
```
Notification {
  recipientType: [EMPLOYEE, USER], recipientId
  channel: [IN_APP, EMAIL, SMS, PUSH, WHATSAPP]
  trigger, title, body, templateId→NotificationTemplate, variables
  status: [QUEUED, SENT, DELIVERED, FAILED]
  providerMessageId, retryCount
  linkedEntityType, linkedEntityId
  sentAt, deliveredAt, failedAt, createdAt
}
```


---

## 4. Admin Modules & APIs

### 4.1 Dashboard & Analytics (`/api/v1/admin/dashboard`)

**KPI Cards (Date Filters: Today | Last 7d | Month | Custom)**

| KPI | Formula |
|:---|:---|
| Total Registrations | COUNT(users WHERE createdAt IN range) |
| Active Members | COUNT(users WHERE lastActiveAt > 30d ago) |
| New Leads Today | COUNT(leads WHERE createdAt = today) |
| Converted Leads | COUNT(leads WHERE status=CONVERTED IN range) |
| Conversion Rate | converted ÷ total_leads × 100 |
| Total Revenue | SUM(transactions.netAmount WHERE status=SUCCESS) |
| Active Subscriptions | COUNT(subscriptions WHERE status=ACTIVE) |
| Pending Verifications | COUNT(verificationRequests WHERE status=PENDING) |
| Avg First Contact Time | AVG(firstContactAt - assignedAt) |
| SLA Breach Count | COUNT(leads WHERE firstContactAt > slaTarget) |

**Charts:** Line (daily registrations 30d) | Bar (lead status distribution) | Pie (revenue by tier) | Funnel (Visit→Register→Profile→Subscribe) | Table (top 10 CRM agents by conversion) | Heatmap (hourly leads by day)

**Endpoints:**
```
GET /api/v1/admin/dashboard/stats
GET /api/v1/admin/dashboard/charts/:type
```

---

### 4.2 Employee / Access Management (`/api/v1/admin/employees`)
```
GET    /api/v1/admin/employees                    → List + filters
POST   /api/v1/admin/employees                    → Create employee
GET    /api/v1/admin/employees/:id                → Detail + permissions
PUT    /api/v1/admin/employees/:id                → Update employee
PUT    /api/v1/admin/employees/:id/permissions    → Update permissions (reason required)
PUT    /api/v1/admin/employees/:id/status         → Activate / Deactivate
POST   /api/v1/admin/employees/:id/force-logout   → Revoke all sessions (Redis blacklist)
GET    /api/v1/admin/employees/:id/access-preview → "View as Employee" (SUPER_ADMIN only, audited)
GET    /api/v1/admin/employees/:id/audit          → Permission change history
GET/POST /api/v1/admin/teams                      → Team management
```

**Rules:**
- Admin never sees/sets plaintext password — sends secure reset link only
- Deactivation: immediately invalidates all JWTs via Redis session blacklist
- "View as Employee": explicitly labelled + audit log entry created — no credential sharing
- Temp access: cron job checks & deactivates on `tempAccessExpiry`

---

### 4.3 CRM & Lead Management (`/api/v1/admin/leads`)

**Lead Flow:**
```
Source → Deduplication → Create Lead
  → Auto-assign rules? YES → Assign → Notify Employee → SLA Timer
                       NO  → Unassigned Queue → CRM Manager assigns
```

```
GET    /api/v1/admin/leads                   → List (paginated + filtered)
POST   /api/v1/admin/leads                   → Create manually
GET    /api/v1/admin/leads/:id               → 360° detail + timeline
PUT    /api/v1/admin/leads/:id               → Update fields
PUT    /api/v1/admin/leads/:id/status        → Change status
POST   /api/v1/admin/leads/:id/notes         → Add note (internal/external)
POST   /api/v1/admin/leads/:id/follow-up     → Set/reschedule follow-up
POST   /api/v1/admin/leads/:id/assign        → Assign single
POST   /api/v1/admin/leads/bulk-assign       → Bulk multi-select assign
POST   /api/v1/admin/leads/:id/reassign      → Reassign with reason
GET    /api/v1/admin/leads/:id/timeline      → Full activity timeline
POST   /api/v1/admin/leads/import            → CSV import + dedup
GET    /api/v1/admin/leads/export            → Export (permission checked)
GET    /api/v1/admin/leads/saved-views       → My Leads, Overdue, Today's FU, etc.
```

**Bulk Assign Payload:**
```json
{
  "leadIds": ["id1","id2"],
  "allMatchingFilter": false,
  "filterParams": { "status":"UNASSIGNED", "source":"WEBSITE_FORM" },
  "method": "ROUND_ROBIN | EVEN_DISTRIBUTE | SINGLE_EMPLOYEE | BY_TEAM",
  "employeeIds": ["emp1","emp2"],
  "rules": { "respectCapacityLimit": true, "noDuplicateOwnership": true }
}
```
→ Returns preview (employee name, current load, new leads count) → Confirm

**SLA Defaults (configurable):** Website Form = 30 min | Paid Ad = 15 min | Manual = 2 hrs

---

### 4.4 Calling / Telephony (`/api/v1/admin/calls`)

**Click-to-Call Flow:**
```
Employee → [Call Button] → API checks permission → VoIP Provider (Exotel)
→ Provider fires webhooks (ringing/connected/ended) → CallLog updated
→ After call: Disposition form mandatory → LeadActivity entry created
```

```
POST   /api/v1/admin/calls/initiate           → Click-to-call (returns callId)
GET    /api/v1/admin/calls/:id/status         → Live call status
POST   /api/v1/admin/calls/:id/disposition    → Submit outcome (mandatory)
GET    /api/v1/admin/leads/:id/calls          → Call history for lead
GET    /api/v1/admin/calls/reports            → Analytics
GET    /api/v1/admin/calls/:id/recording      → Signed URL (permission-gated)
POST   /api/v1/webhook/telephony              → Provider webhook (signature-verified)
GET/PUT /api/v1/admin/settings/telephony      → Provider config (SUPER_ADMIN only)
```

**Call Reports:** Attempted | Connected | No-Answer | Busy | Failed | Connect Rate | Avg Talk Time | Employee Comparison | Call→Subscription Conversion

---

### 4.5 Chat & Employee Chat Access

```
PUT    /api/v1/admin/settings/chat/widget          → Toggle website chat on/off
PUT    /api/v1/admin/employees/:id/chat-access     → Enable/disable per employee
PUT    /api/v1/admin/settings/chat/routing         → Routing rules
PUT    /api/v1/admin/settings/chat/business-hours  → Hours + offline form
GET    /api/v1/admin/chats                         → Conversations (role-filtered)
GET    /api/v1/admin/chats/:id                     → Transcript
POST   /api/v1/admin/chats/:id/transfer            → Transfer to employee
POST   /api/v1/admin/chats/:id/resolve             → Mark resolved
```

**Routing:** New chat → Business hours? YES→ Round-robin among isChatEnabled employees | NO→ Offline form → Lead created

**Per-Employee Chat Permissions:**
```json
{
  "canReceiveChats": true,     "canInitiateChats": false,
  "canViewTeamQueue": true,    "canTransferChats": true,
  "canAccessHistory": true
}
```

---

### 4.6 Member / User Management (`/api/v1/admin/members`)

```
GET    /api/v1/admin/members                    → List (search + filters)
POST   /api/v1/admin/members                    → Admin-create member
GET    /api/v1/admin/members/:id                → 360° view (profile + leads + subs + calls + audit)
PUT    /api/v1/admin/members/:id/basic          → Edit fields (reason mandatory)
PUT    /api/v1/admin/members/:id/status         → Suspend / Reactivate / Delete
POST   /api/v1/admin/members/:id/verify         → Mark KYC verified
POST   /api/v1/admin/members/:id/send-reset-link→ Secure password reset
POST   /api/v1/admin/members/merge-duplicates   → Merge with full audit trail
GET    /api/v1/admin/members/:id/edit-history   → Field-level before/after log

GET    /api/v1/admin/verifications/pending      → KYC + photo approval queue
POST   /api/v1/admin/verifications/:id/approve
POST   /api/v1/admin/verifications/:id/reject   → With reason + member notification
```

**Member 360° View Contains:**
Profile details | Photos (moderation status) | Partner Preferences | Linked Leads | Interests Sent/Received | Subscription + Payment History | Call + Chat History | Edit Audit Trail | Block/Report History | Consent Records

**Sensitive Change Rules:**
- `mobile/email` → reason required + re-verification triggered
- `isProfileVerified` → reason + optional second-approver workflow
- `membershipTier` manual override → Finance Manager permission required
- All logged: `{ field, oldValue, newValue, changedBy, reason, timestamp }`

---

### 4.7 Subscription & Plans

```
GET/POST /api/v1/admin/plans                    → Plan list + create
PUT      /api/v1/admin/plans/:id                → Edit plan
PUT      /api/v1/admin/plans/:id/toggle         → Activate/Deactivate
GET      /api/v1/admin/subscriptions            → All subscriptions (filtered)
GET      /api/v1/admin/subscriptions/:id        → Detail view
POST     /api/v1/admin/subscriptions/manual-entitle → Grant manual (reason + FM permission)
PUT      /api/v1/admin/subscriptions/:id/extend → Extend expiry with reason
PUT      /api/v1/admin/subscriptions/:id/cancel → Cancel with reason
```

**Subscription Reports:** Plan-wise sales | Active trend | Renewal rate | Churn | Failed payment recovery | ARPU

---

### 4.8 Finance & Payments

```
GET    /api/v1/admin/finance/summary            → Revenue overview
GET    /api/v1/admin/finance/transactions       → Ledger (filtered, paginated)
GET    /api/v1/admin/finance/transactions/:id   → Detail + gateway raw response
POST   /api/v1/admin/finance/refunds/request    → Raise refund (Finance Staff)
GET    /api/v1/admin/finance/refunds/pending    → Approval queue (Finance Manager)
POST   /api/v1/admin/finance/refunds/:id/approve→ Approve → trigger Razorpay API
POST   /api/v1/admin/finance/refunds/:id/reject → Reject with reason
GET    /api/v1/admin/finance/invoices/:id       → Download invoice PDF
GET    /api/v1/admin/finance/export             → CSV/XLSX/PDF export
POST   /api/v1/webhook/razorpay                 → Payment events (signature-verified, idempotent)
```

**Refund Flow:**
```
Finance Staff → Raise Request → Finance Manager reviews
→ Approve → Call Razorpay Refund API → Webhook confirms
→ Transaction status = REFUNDED → Subscription access revoked
→ Member notified → Audit log entry
```
⚠️ **No direct DB edits to payment status** — always through gateway + webhook

**Finance Summary Includes:** Gross Collections | Successful | Refunded | Gateway Fees | Net Revenue | GST | Discounts | Failed Count | Pending

---

### 4.9 Advertisement & Campaign Management

```
GET    /api/v1/admin/campaigns                   → List (by status filter)
POST   /api/v1/admin/campaigns                   → Create campaign
GET    /api/v1/admin/campaigns/:id               → Detail
PUT    /api/v1/admin/campaigns/:id               → Edit
POST   /api/v1/admin/campaigns/:id/submit        → Submit for approval
POST   /api/v1/admin/campaigns/:id/approve       → Approve
POST   /api/v1/admin/campaigns/:id/reject        → Reject with reason
POST   /api/v1/admin/campaigns/:id/pause         → Emergency pause
POST   /api/v1/admin/campaigns/:id/duplicate     → Clone
GET    /api/v1/admin/campaigns/:id/preview       → Device preview (desktop/mobile/app)
GET    /api/v1/admin/campaigns/:id/analytics     → Impressions, clicks, CTR, leads
```

**Campaign Serving (Frontend calls):**
```
GET /api/v1/common/active-campaigns?placement=HOME_POPUP&platform=WEB
Backend checks: status=LIVE | date range valid | targeting matches | frequency cap OK
Returns: creative data OR null
```

---

### 4.10 Reports & Export Centre

| Report | Min Role | Formats |
|:---|:---|:---|
| Lead Funnel | CRM Manager | CSV |
| Employee Performance | Admin | CSV |
| Conversion Attribution | Admin | CSV |
| SLA Compliance | CRM Manager | CSV |
| Finance Summary | Finance Staff | CSV/XLSX/PDF |
| Transaction Ledger | Finance Staff | CSV |
| Subscription Report | Finance Staff | CSV |
| Campaign Analytics | Ad Manager | CSV |
| Member Growth | Analyst | CSV |
| Moderation History | Moderator | CSV |

```
GET    /api/v1/admin/reports/:type
POST   /api/v1/admin/reports/export          → Async job → returns jobId
GET    /api/v1/admin/reports/export/:jobId/status
GET    /api/v1/admin/reports/export/:jobId/download → Signed URL (expires 1hr)
```

---

### 4.11 Content & Moderation

```
GET/POST /api/v1/admin/moderation/photos/queue       → Pending photos
POST     /api/v1/admin/moderation/photos/:id/approve
POST     /api/v1/admin/moderation/photos/:id/reject  → Reason + notify

GET      /api/v1/admin/moderation/reports            → Abuse/spam reports
POST     /api/v1/admin/moderation/reports/:id/resolve→ Dismiss/Warn/Suspend

GET/POST /api/v1/admin/content/banners               → Homepage banners
PUT      /api/v1/admin/content/banners/:id/toggle    → On/Off

GET/POST/PUT /api/v1/admin/master-data/subcastes     → Sindhi subcaste master list
GET/POST/PUT /api/v1/admin/master-data/gotras        → Gotra master list
GET/POST/PUT /api/v1/admin/master-data/cities        → Cities master data
```

---

### 4.12 Notifications & Communication

**Trigger → Channel Map:**

| Trigger | Employee Channels | Member Channels |
|:---|:---|:---|
| Lead Assigned | In-App + Push | — |
| Follow-up Due | In-App + Push | — |
| SLA Breach | In-App + Email (Manager) | — |
| New Chat | In-App + Push | — |
| Subscription Purchased | — | Email + Push |
| Expiring (7d, 1d) | — | Email + SMS + Push |
| Payment Failed | — | Email + SMS + Push |
| Refund Processed | — | Email + Push |
| Interest Received | — | Push + In-App |
| Profile Verified | — | Email + Push |

```
GET/POST /api/v1/admin/notifications/templates
PUT      /api/v1/admin/notifications/templates/:id
POST     /api/v1/admin/notifications/broadcast   → SUPER_ADMIN only
GET      /api/v1/admin/notifications/logs
```

---

### 4.13 Audit Logs & Security

```
GET /api/v1/admin/audit-logs                    → Filtered viewer (SUPER_ADMIN/ADMIN)
GET /api/v1/admin/audit-logs/:id                → Detail with before/after diff
```

**Security Controls:**
- MFA (TOTP) enforced for SUPER_ADMIN + FINANCE_MANAGER
- JWT: Access = 15 min, Refresh = 7 days
- Force logout: Redis session blacklist invalidates all tokens instantly
- Input validation: Zod schemas on all endpoints
- File upload: MIME sniffing + size limit + virus scan hook
- HTTPS + Helmet.js secure headers
- Secrets: AWS Secrets Manager / env (never in code)
- Rate limiting: Per-employee on all admin APIs
- IDOR prevention: Backend scope filter on every query


---

## 5. Backend Folder Structure

```
sindhiMatrimonyBackhend/
├── package.json
├── tsconfig.json
├── .env.example
├── .gitignore
│
├── src/
│   ├── server.ts                    ← Entry point: HTTP + Socket.io init
│   ├── app.ts                       ← Express app + all middleware
│   │
│   ├── config/
│   │   ├── db.ts                    ← MongoDB Mongoose connection
│   │   ├── env.ts                   ← Env variable validation (Zod)
│   │   ├── firebase.ts              ← Firebase Admin SDK (FCM)
│   │   ├── redis.ts                 ← Redis client (sessions, rate-limit)
│   │   └── logger.ts                ← Winston logger
│   │
│   ├── models/                      ← Mongoose Models
│   │   ├── User.model.ts
│   │   ├── Profile.model.ts
│   │   ├── PartnerPreference.model.ts
│   │   ├── Employee.model.ts
│   │   ├── Team.model.ts
│   │   ├── Lead.model.ts
│   │   ├── LeadActivity.model.ts
│   │   ├── CallLog.model.ts
│   │   ├── Conversation.model.ts
│   │   ├── Message.model.ts
│   │   ├── Interest.model.ts
│   │   ├── Shortlist.model.ts
│   │   ├── Plan.model.ts
│   │   ├── Subscription.model.ts
│   │   ├── Transaction.model.ts
│   │   ├── Campaign.model.ts
│   │   ├── Notification.model.ts
│   │   ├── NotificationTemplate.model.ts
│   │   ├── AuditLog.model.ts
│   │   ├── VerificationRequest.model.ts
│   │   └── MasterData.model.ts      ← Subcastes, Gotras, Cities
│   │
│   ├── routes/
│   │   ├── index.ts                 ← /api/v1 central router
│   │   ├── auth.routes.ts
│   │   ├── profile.routes.ts
│   │   ├── matches.routes.ts
│   │   ├── interest.routes.ts
│   │   ├── chat.routes.ts
│   │   ├── subscription.routes.ts
│   │   ├── common.routes.ts
│   │   └── admin/
│   │       ├── index.ts             ← /api/v1/admin central router
│   │       ├── dashboard.routes.ts
│   │       ├── employee.routes.ts
│   │       ├── lead.routes.ts
│   │       ├── call.routes.ts
│   │       ├── member.routes.ts
│   │       ├── subscription.routes.ts
│   │       ├── finance.routes.ts
│   │       ├── campaign.routes.ts
│   │       ├── moderation.routes.ts
│   │       ├── notification.routes.ts
│   │       ├── report.routes.ts
│   │       ├── audit.routes.ts
│   │       ├── content.routes.ts
│   │       └── masterdata.routes.ts
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── profile.controller.ts
│   │   ├── matches.controller.ts
│   │   ├── interest.controller.ts
│   │   ├── chat.controller.ts
│   │   ├── subscription.controller.ts
│   │   ├── common.controller.ts
│   │   └── admin/
│   │       ├── dashboard.controller.ts
│   │       ├── employee.controller.ts
│   │       ├── lead.controller.ts
│   │       ├── lead-bulk.controller.ts  ← Bulk assign logic
│   │       ├── call.controller.ts
│   │       ├── member.controller.ts
│   │       ├── subscription.controller.ts
│   │       ├── finance.controller.ts
│   │       ├── refund.controller.ts
│   │       ├── campaign.controller.ts
│   │       ├── moderation.controller.ts
│   │       ├── notification.controller.ts
│   │       ├── report.controller.ts
│   │       ├── audit.controller.ts
│   │       └── masterdata.controller.ts
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.ts       ← JWT verify → attach user/employee
│   │   ├── role.middleware.ts       ← requireRole(...roles)
│   │   ├── permission.middleware.ts ← requirePermission(module, action)
│   │   ├── scope.middleware.ts      ← Filter records by employee scope
│   │   ├── upload.middleware.ts     ← Multer + MIME validation
│   │   ├── validate.middleware.ts   ← Zod schema validation
│   │   ├── rateLimit.middleware.ts  ← Per-route rate limiting
│   │   ├── audit.middleware.ts      ← Auto-log sensitive actions
│   │   └── error.middleware.ts      ← Global error handler
│   │
│   ├── services/                    ← External integrations
│   │   ├── otp.service.ts           ← MSG91 SMS OTP
│   │   ├── fcm.service.ts           ← Firebase push
│   │   ├── email.service.ts         ← SendGrid email
│   │   ├── whatsapp.service.ts      ← WhatsApp Business API
│   │   ├── s3.service.ts            ← AWS S3 upload + signed URLs
│   │   ├── payment.service.ts       ← Razorpay order + verify
│   │   ├── telephony.service.ts     ← Exotel click-to-call
│   │   ├── notification.service.ts  ← Central dispatcher → routes to channel
│   │   ├── audit.service.ts         ← Create immutable audit entries
│   │   ├── lead.service.ts          ← Dedup + assignment algorithms
│   │   ├── match.service.ts         ← Recommendation engine
│   │   └── export.service.ts        ← Async CSV/XLSX export jobs (BullMQ)
│   │
│   ├── sockets/
│   │   ├── index.ts                 ← Socket.io init + namespaces
│   │   ├── chat.socket.ts           ← User-to-user real-time chat
│   │   └── admin.socket.ts          ← Admin live notifications + lead alerts
│   │
│   ├── jobs/                        ← Cron background jobs (node-cron)
│   │   ├── followup-reminder.job.ts ← Daily: follow-up due reminders
│   │   ├── sla-escalation.job.ts    ← Hourly: escalate overdue leads
│   │   ├── subscription-expiry.job.ts ← Daily: expiry reminders
│   │   ├── temp-access-revoke.job.ts  ← Daily: deactivate expired temp access
│   │   └── export-cleanup.job.ts    ← Clean expired export files
│   │
│   ├── validators/                  ← Zod request schemas
│   │   ├── auth.validator.ts
│   │   ├── profile.validator.ts
│   │   ├── lead.validator.ts
│   │   ├── employee.validator.ts
│   │   ├── campaign.validator.ts
│   │   └── finance.validator.ts
│   │
│   └── utils/
│       ├── apiResponse.ts           ← { success, data, message } wrapper
│       ├── pagination.ts            ← Cursor/offset pagination
│       ├── masking.ts               ← Mask phone/email for lower roles
│       ├── dateHelper.ts            ← Timezone-aware utilities
│       └── constants.ts             ← Enums, plan limits, SLA defaults
│
└── tests/
    ├── unit/
    ├── integration/
    └── security/                    ← IDOR, privilege escalation, injection
```

---

## 6. Complete API Reference (All Endpoints)

### Auth (`/api/v1/auth`)
```
POST /send-otp                      → Mobile OTP
POST /verify-otp                    → Verify → JWT
POST /login-password                → Email+Password login
POST /admin/login                   → Employee login (MFA check)
POST /refresh-token                 → New access token
POST /logout                        → Invalidate + clear FCM
POST /forgot-password/send-otp
POST /forgot-password/verify-otp
POST /forgot-password/reset
```

### Profile (`/api/v1/profile`)
```
GET    /me
PUT    /basic-details
PUT    /religious-details
PUT    /career-details
PUT    /family-details
PUT    /lifestyle-details
POST   /upload-photo
DELETE /photo/:photoId
PUT    /set-avatar/:photoId
GET    /partner-preference
PUT    /partner-preference
POST   /upload-id-proof
```

### Discovery (`/api/v1/matches`)
```
GET  /daily-recommendations
GET  /just-joined
GET  /near-me
GET  /verified
POST /search
GET  /view/:userId
```

### Interests (`/api/v1/interests`)
```
POST   /send
POST   /respond
POST   /cancel
GET    /received
GET    /sent
POST   /shortlist/:userId
DELETE /shortlist/:userId
GET    /shortlist
```

### Chat (`/api/v1/chat`)
```
GET  /conversations
GET  /messages/:conversationId
POST /send-message
```

### Subscriptions (`/api/v1/subscriptions`)
```
GET  /plans
POST /create-order
POST /verify-payment
GET  /my-subscription
POST /unlock-contact/:userId
```

### Common (`/api/v1/common`)
```
GET /banners
GET /subcastes
GET /gotras
GET /locations
GET /active-campaigns     → Campaign serving for frontend
```

### Admin (all require Employee JWT + Role check)
```
GET    /api/v1/admin/dashboard/stats
GET    /api/v1/admin/dashboard/charts/:type
GET/POST/PUT /api/v1/admin/employees
PUT    /api/v1/admin/employees/:id/permissions
PUT    /api/v1/admin/employees/:id/status
POST   /api/v1/admin/employees/:id/force-logout
GET    /api/v1/admin/employees/:id/access-preview
GET    /api/v1/admin/employees/:id/audit
GET/POST /api/v1/admin/teams
GET/POST/PUT /api/v1/admin/leads
POST   /api/v1/admin/leads/bulk-assign
GET    /api/v1/admin/leads/:id/timeline
POST   /api/v1/admin/leads/:id/notes
POST   /api/v1/admin/leads/:id/follow-up
POST   /api/v1/admin/leads/import
GET    /api/v1/admin/leads/export
POST   /api/v1/admin/calls/initiate
POST   /api/v1/admin/calls/:id/disposition
GET    /api/v1/admin/calls/reports
GET    /api/v1/admin/calls/:id/recording
GET/POST/PUT /api/v1/admin/members
PUT    /api/v1/admin/members/:id/status
POST   /api/v1/admin/members/:id/verify
POST   /api/v1/admin/members/merge-duplicates
GET    /api/v1/admin/members/:id/edit-history
GET/POST/PUT /api/v1/admin/plans
GET/POST/PUT /api/v1/admin/subscriptions
POST   /api/v1/admin/subscriptions/manual-entitle
GET    /api/v1/admin/finance/summary
GET    /api/v1/admin/finance/transactions
POST   /api/v1/admin/finance/refunds/request
POST   /api/v1/admin/finance/refunds/:id/approve
GET/POST/PUT /api/v1/admin/campaigns
POST   /api/v1/admin/campaigns/:id/approve
POST   /api/v1/admin/campaigns/:id/pause
GET    /api/v1/admin/moderation/photos/queue
POST   /api/v1/admin/moderation/photos/:id/approve
POST   /api/v1/admin/moderation/photos/:id/reject
GET    /api/v1/admin/reports/:type
POST   /api/v1/admin/reports/export
GET    /api/v1/admin/reports/export/:jobId/download
GET    /api/v1/admin/audit-logs
GET/POST/PUT /api/v1/admin/notifications/templates
POST   /api/v1/admin/notifications/broadcast
GET/POST/PUT /api/v1/admin/master-data/subcastes
GET/POST/PUT /api/v1/admin/master-data/gotras
```

### Webhooks
```
POST /api/v1/webhook/razorpay       → Payment events (signature-verified, idempotent)
POST /api/v1/webhook/telephony      → Call events (signature-verified)
```

---

## 7. Key Workflows

### 7.1 Lead Full Lifecycle
```
[Source: Website Form / App / Ad / Manual]
     ↓
POST /admin/leads → Deduplication (normalize mobile+email)
     ↓
isDuplicate? YES → Link to existing lead + log entry
isDuplicate? NO  → Create Lead (status: NEW)
     ↓
Auto-assign rules engine:
  Find employee: CRM_AGENT + isActive + capacity < maxLeadCapacity + region/skill match
  Method: ROUND_ROBIN or LEAST_LOADED
  status: ASSIGNED → SLA timer starts → Push notification to employee
     ↓
Employee contacts member → Logs call/disposition → Adds note
     ↓
Status: CONTACTED → QUALIFIED → INTERESTED → SUBSCRIPTION_PENDING
     ↓
Member buys plan → Razorpay payment success webhook
     ↓
status: CONVERTED → Lead.conversionValue set → Subscription linked
     ↓
Attribution report: Source → Employee → Conversion
```

### 7.2 Campaign Publish Flow
```
Admin creates campaign → Upload creative + set schedule/targeting/frequency
     ↓
Submit for Approval (status: REVIEW)
     ↓
Ad Manager reviews → Approve → status: APPROVED
     ↓
Preview on device simulator (desktop/mobile/app)
     ↓
startDate reached → status: LIVE → Cron sets it LIVE
     ↓
Frontend: GET /common/active-campaigns?placement=HOME_POPUP
Backend checks: LIVE + date range + targeting + frequency cap
Returns creative or null
     ↓
Impression/click events tracked via analytics
     ↓
endDate → status: COMPLETED → Final report available
```

### 7.3 Refund Flow
```
Member complains → Support creates ticket
     ↓
Finance Staff opens Transaction → Policy check → Raise Refund Request
     ↓
Finance Manager receives In-App notification → Reviews
     ↓
APPROVE → Call Razorpay Refund API
     ↓
Razorpay fires webhook → Backend verifies signature → idempotency check
     ↓
Transaction.status = REFUNDED → Subscription.status = REFUNDED
     ↓
Member access revoked → Member notified (Email + Push)
     ↓
AuditLog entry: { actor, action:"REFUND_APPROVED", before, after, reason, timestamp }
```

---

## 8. Tech Stack

| Layer | Technology | Purpose |
|:---|:---|:---|
| Runtime | Node.js v20 LTS | Backend server |
| Framework | Express.js + TypeScript | API framework |
| Database | MongoDB Atlas + Mongoose | Primary data store |
| Cache/Sessions | Redis (Upstash) | JWT blacklist, rate-limit, export queue |
| Real-time | Socket.io | User chat + Admin live alerts |
| Auth | JWT + bcrypt | Access + Refresh token auth |
| Validation | Zod | Request schema validation |
| File Storage | AWS S3 / Cloudinary | Photos, docs, ad creatives, recordings |
| OTP / SMS | MSG91 | Mobile OTP for login |
| Push | Firebase FCM | Mobile push notifications |
| Email | SendGrid | Transactional emails |
| WhatsApp | WhatsApp Business API | Marketing + support |
| Payments | Razorpay | Subscriptions + refunds |
| Telephony | Exotel | Click-to-call from CRM |
| Background Jobs | node-cron + BullMQ | Follow-up reminders, exports, SLA checks |
| Logging | Winston + Morgan | App + HTTP logs |
| Monitoring | Sentry | Error tracking |
| API Docs | Swagger | Developer reference |
| Admin Frontend | React + Vite + TypeScript | Admin dashboard |
| User Web | Next.js | SEO-friendly user portal |
| Mobile | React Native (existing) | iOS + Android |

---

## 9. Implementation Roadmap

### Phase 1 — Foundation (Week 1–3)
- [ ] Node.js + Express + TypeScript setup in `sindhiMatrimonyBackhend`
- [ ] MongoDB connection + base models
- [ ] User Auth: OTP login + Password login + JWT + Refresh tokens
- [ ] Employee Auth: Admin login + MFA (TOTP)
- [ ] RBAC middleware: role + permission + scope checks
- [ ] Audit log service (auto-captures sensitive actions)
- [ ] Global error handler + Zod validators

### Phase 2 — Member Features (Week 4–6)
- [ ] Profile CRUD: basic, religious, career, family, lifestyle sections
- [ ] Photo upload + S3 integration + moderation queue
- [ ] Partner preferences
- [ ] Discovery: recommendations + search with filters
- [ ] Interests: send, accept, decline, shortlist

### Phase 3 — Admin CRM (Week 7–10)
- [ ] Employee management: CRUD + permissions + temp access + force logout
- [ ] Lead management: create, list, filter, 360° timeline
- [ ] Lead assignment: single + bulk + round-robin algorithm
- [ ] Follow-up system + SLA engine + escalation cron
- [ ] Telephony: Exotel click-to-call + webhooks + disposition
- [ ] Admin member management: edit + verify + suspend

### Phase 4 — Subscriptions & Finance (Week 11–13)
- [ ] Plan master management
- [ ] Razorpay: create order + verify payment + webhook (idempotent)
- [ ] Subscription lifecycle + contact unlock credits
- [ ] Finance summary + transaction ledger
- [ ] Refund request + approval workflow + gateway call
- [ ] Invoice PDF generation

### Phase 5 — Chat, Campaigns, Notifications (Week 14–17)
- [ ] User-to-user chat (Socket.io)
- [ ] Employee chat access control + routing
- [ ] Campaign management: create + approve + serve + track
- [ ] Notification templates + multi-channel dispatcher
- [ ] FCM push + SendGrid email + MSG91 SMS
- [ ] BullMQ for async export jobs

### Phase 6 — Reports, Moderation, Polish (Week 18–20)
- [ ] Moderation queue: photo approval + abuse reports
- [ ] CMS: banners + subcaste/gotra master data management
- [ ] All reports + async export with expiring signed URLs
- [ ] Dashboard charts + analytics
- [ ] Security hardening: IDOR tests + MFA enforcement + file upload scan
- [ ] API documentation (Swagger)

---

## 10. Pre-Dev Decisions Required

| # | Decision | Owner |
|:---|:---|:---|
| 1 | Subscription plan names, prices, validity days, contact limits | Business |
| 2 | Employee roles hierarchy for pilot team | Business |
| 3 | Lead SLA targets per source (Website=30min? Ad=15min?) | Business |
| 4 | Default assignment algorithm: round-robin or least-loaded? | Business |
| 5 | Telephony provider choice (Exotel / Ozonetel / Twilio) | Tech + Business |
| 6 | Call recording policy — legal consent notice required? | Legal |
| 7 | Payment gateway: Razorpay preferred, supported methods, settlement | Business |
| 8 | Refund policy: timeline, conditions, partial refund rules | Business + Finance |
| 9 | Ad pricing model (fixed placement / CPM / CPC) | Business |
| 10 | Analytics provider (self-hosted / Mixpanel / Amplitude) | Tech |
| 11 | Sindhi subcastes master list — finalize complete list | Business |
| 12 | Who can access subcaste/caste filters & when? | Legal + Business |
| 13 | Data retention periods: calls, chats, leads, payments | Legal |
| 14 | Hosting choice: AWS / GCP / Azure + environments (Dev/Staging/Prod) | Tech |
| 15 | Scale expectation: registrations/month, concurrent users, leads/day | Business |

---

> ⚠️ **Legal Note:** Privacy (DPDP Act 2023), payment (RBI guidelines), call-recording (TRAI),
> and community-data practices must be reviewed against applicable Indian laws before production.


---

## 11. Low-Cost, Zero-Spam & High-Performance Architecture

> **Goal:** Run the entire backend (API + DB + Real-time) on minimum cloud specs (e.g., $5 - $10/mo VM or Free Tiers) with ultra-low latency, zero redundant hits, and zero wasted compute.

### 11.1 Low RAM & CPU Overhead (Mongoose Optimization)
- **Mandatory `.lean()` Execution:** All read queries execute with `.lean()` to return plain JavaScript objects instead of heavy Mongoose Document instances. Reduces Node.js memory footprint by up to **80%** and query latency by **4-5x**.
- **Field Projections (`.select()`):** Data tables and lists fetch only displayed columns. Large fields (e.g. bio, photos array, timeline history) are excluded from high-volume list queries.
- **Compound Database Indexes:** All filtered queries (`ownerId + status + createdAt`, `gender + subcaste + dob`) hit compound indexes to ensure zero full collection scans on MongoDB.
- **TTL (Time-To-Live) Auto-Cleanup Indexes:** Temporary records (SMS OTP tokens, blacklisted tokens, temp export jobs) are deleted at the database engine level via TTL index without background cron CPU usage.

### 11.2 Zero Polling Architecture (Event-Driven Push via Socket.io)
- **Elimination of HTTP Polling:** Neither mobile nor web clients poll the server for new leads, calls, or chat messages.
- **Room-Scoped Push Events:** New leads, SLA warnings, and call updates emit only to the designated employee's socket room (`employee:<id>`).
- **Result:** Decreases server HTTP request volume by **over 90%** compared to traditional 3-second polling.

### 11.3 In-Memory Caching (Zero DB Hits for Static & Master Data)
- **Node-Cache / Redis Layer:** Master datasets (Sindhi Subcastes, Gotras, Cities, Subscription Plans, App Settings) are cached in memory with a 1-hour TTL.
- **Direct Memory Delivery:** Requests for master data and active plan lists resolve in < 1 millisecond without touching MongoDB.

### 11.4 Log Spamming & Cloud Log Cost Prevention
- **Filtered Health & Static Hits:** `/health`, `/ping`, pre-flight `OPTIONS`, and static assets are excluded from HTTP access logs.
- **Production Log Level:** Production logs exclusively record `WARN` and `ERROR` levels (HTTP 4xx and 5xx). Successful `200 OK` transactions are not dumped to disk or paid cloud log ingest services (e.g. AWS CloudWatch, Datadog).
- **Asynchronous Non-blocking Writes:** Winston/Pino file rotation ensures log writes never block the Node.js event loop.

### 11.5 Bandwidth & Network Optimization
- **Gzip / Brotli Compression:** All JSON responses exceeding 1 KB are compressed via `compression` middleware, cutting outgoing data transfer bandwidth by up to **75%**.
- **HTTP Cache & ETags:** Strong ETag headers return `304 Not Modified` (0 bytes payload) when client cached data matches server data.
- **Cursor-Based Pagination:** Uses indexed cursor comparisons (`_id < lastId`) instead of `skip()`, ensuring fast and consistent query performance regardless of dataset depth.

### 11.6 Security Rate Limiting (Abuse & Billing Protection)
- **API Rate Limiter:** 300 requests / 15 minutes per IP to safeguard against scraping.
- **Strict OTP Limiter:** Max 3 OTP requests / minute per IP and mobile number to eliminate SMS gateway billing fraud.

