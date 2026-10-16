# 🛡️ Admin Portal — Screen-by-Screen API Mapping
## Har Screen Pe Konsi APIs Lagengi, Data Kaise Aayega, Kya Manage Hoga

> **Admin URL Base:** `https://admin.sindhimatrimony.com`  
> **API Base:** `https://api.sindhimatrimony.com/api/v1`  
> **Auth Header:** `Authorization: Bearer <employeeAccessToken>`  
> **Role Check:** Har API pe backend independently role + permission verify karta hai

---

## 📋 Admin Screens List

| # | Screen | Route | Min Role |
|:--|:--|:--|:--|
| 1 | Login | `/login` | — |
| 2 | Dashboard | `/dashboard` | ANALYST+ |
| 3 | Employee List | `/employees` | SUPER_ADMIN |
| 4 | Employee Detail / Edit | `/employees/:id` | SUPER_ADMIN |
| 5 | Lead List (CRM) | `/leads` | CRM_AGENT+ |
| 6 | Lead Detail (360°) | `/leads/:id` | CRM_AGENT+ |
| 7 | Bulk Assign Leads | `/leads/bulk-assign` | CRM_MANAGER+ |
| 8 | Member List | `/members` | ADMIN+ |
| 9 | Member Detail (360°) | `/members/:id` | ADMIN+ |
| 10 | Verification Queue | `/verifications` | MODERATOR+ |
| 11 | Call Reports | `/calls/reports` | CRM_MANAGER+ |
| 12 | Chat Management | `/chats` | SUPPORT_AGENT+ |
| 13 | Subscription Plans | `/plans` | ADMIN+ |
| 14 | Subscriptions List | `/subscriptions` | FINANCE_STAFF+ |
| 15 | Finance Summary | `/finance` | FINANCE_STAFF+ |
| 16 | Transaction Ledger | `/finance/transactions` | FINANCE_STAFF+ |
| 17 | Refund Management | `/finance/refunds` | FINANCE_STAFF+ |
| 18 | Campaign List | `/campaigns` | AD_MANAGER+ |
| 19 | Campaign Detail/Create | `/campaigns/:id` | AD_MANAGER+ |
| 20 | Reports & Export | `/reports` | ANALYST+ |
| 21 | Moderation Queue | `/moderation` | MODERATOR+ |
| 22 | Notification Templates | `/notifications` | ADMIN+ |
| 23 | Audit Logs | `/audit-logs` | SUPER_ADMIN |
| 24 | Master Data (Subcastes) | `/settings/master-data` | SUPER_ADMIN |
| 25 | System Settings | `/settings` | SUPER_ADMIN |

---

---

# SCREEN 1 — Login Page
**Route:** `/login`

## UI Elements
- Email / Employee ID input
- Password input
- "Login" button
- MFA / OTP field (appears after step 1 for privileged roles)
- "Forgot Password" link

## APIs Called

### Step 1: Submit credentials
```
POST /api/v1/auth/admin/login
Body: { email, password }

Response (if MFA not required):
{
  success: true,
  data: {
    accessToken: "...",
    refreshToken: "...",
    employee: { id, name, role, permissions, department }
  }
}

Response (if MFA required for SUPER_ADMIN / FINANCE_MANAGER):
{
  success: true,
  data: { requiresMFA: true, tempToken: "...", message: "Enter your TOTP code" }
}
```

### Step 2: MFA Verification (SUPER_ADMIN + FINANCE_MANAGER only)
```
POST /api/v1/auth/admin/verify-mfa
Body: { tempToken, totpCode }

Response:
{
  success: true,
  data: { accessToken, refreshToken, employee: { id, name, role, permissions } }
}
```

### Step 3: Refresh Token (silent, auto-called when access token expires)
```
POST /api/v1/auth/refresh-token
Body: { refreshToken }
Response: { accessToken (new 15-min token) }
```

## Data Flow
```
[Employee enters email+password]
        ↓
POST /auth/admin/login
        ↓
Role = SUPER_ADMIN or FINANCE_MANAGER?
  YES → Return requiresMFA:true + tempToken
       → Employee enters TOTP code
       → POST /auth/admin/verify-mfa
  NO  → Return accessToken + refreshToken directly
        ↓
Store tokens in httpOnly cookie or secure localStorage
        ↓
Redirect → /dashboard
```

## Error Handling
| Error | Message |
|:--|:--|
| Wrong password | "Invalid credentials. X attempts remaining." |
| Account locked | "Account locked. Contact Super Admin." |
| Invalid MFA | "Invalid code. Try again." |
| Account inactive | "Your account has been deactivated." |

---

---

# SCREEN 2 — Dashboard
**Route:** `/dashboard`  
**Min Role:** ANALYST

## UI Elements
- **Top Bar:** Date filter (Today/7d/Month/Custom), Employee filter, Team filter
- **KPI Cards Row:** 6-8 cards with counts and % change vs previous period
- **Charts:** Line chart, Bar chart, Funnel chart, Pie chart
- **Tables:** Top CRM agents, Recent leads, Today's follow-ups

## APIs Called (All parallel on page load)

### 1. KPI Stats
```
GET /api/v1/admin/dashboard/stats
Query: ?from=2024-01-01&to=2024-01-31&employeeId=&teamId=&source=

Response:
{
  data: {
    totalRegistrations: { value: 1250, change: +12.5 },
    activeMembers: { value: 8430, change: +3.2 },
    newLeadsToday: { value: 47, change: -5.1 },
    convertedLeads: { value: 89, change: +22.4 },
    conversionRate: { value: "7.12%", change: +1.8 },
    totalRevenue: { value: 285000, currency: "INR", change: +18.3 },
    activeSubscriptions: { value: 423, change: +8.7 },
    pendingVerifications: { value: 12, change: null },
    avgFirstContactMin: { value: 24, change: -8.5 },
    slaBreachCount: { value: 6, change: +2 }
  }
}
```

### 2. Charts Data
```
GET /api/v1/admin/dashboard/charts/registrations
Query: ?days=30
Response: { labels: ["Jan 1", ...], data: [42, 38, 51, ...] }

GET /api/v1/admin/dashboard/charts/lead-status
Response: { labels: ["New","Assigned",...], data: [120, 89, 45, ...] }

GET /api/v1/admin/dashboard/charts/revenue-by-plan
Response: { labels: ["Free","Silver","Gold","Platinum"], data: [0, 45000, 120000, 120000] }

GET /api/v1/admin/dashboard/charts/funnel
Response: {
  steps: [
    { label: "Website Visits", count: 15420 },
    { label: "Registrations Started", count: 3241 },
    { label: "Profile Complete", count: 1820 },
    { label: "Subscription Checkout", count: 312 },
    { label: "Paid Conversion", count: 89 }
  ]
}

GET /api/v1/admin/dashboard/charts/lead-heatmap
Response: { data: [[mon_0h: 2, mon_1h: 0, ...], [tue_0h: 1, ...]] }
```

### 3. Tables
```
GET /api/v1/admin/dashboard/top-agents?limit=10
Response: [{ employeeId, name, leadsAssigned, converted, conversionRate, avgFirstContact }]

GET /api/v1/admin/dashboard/recent-leads?limit=10
Response: [{ leadId, name, source, status, assignedTo, createdAt }]

GET /api/v1/admin/dashboard/todays-followups?limit=20
Response: [{ leadId, name, mobile (masked), followUpTime, assignedTo, priority }]
```

## Data Flow
```
[Page Load]
       ↓
Read date filter from URL params (or default: Last 30 days)
       ↓
Fire all API calls in PARALLEL using Promise.all():
  - GET /dashboard/stats
  - GET /dashboard/charts/registrations
  - GET /dashboard/charts/lead-status
  - GET /dashboard/charts/revenue-by-plan
  - GET /dashboard/charts/funnel
  - GET /dashboard/top-agents
  - GET /dashboard/recent-leads
  - GET /dashboard/todays-followups
       ↓
Show skeleton loading → Replace with data
       ↓
Date filter changes → Re-fetch all stats + charts (debounce 300ms)
```

## KPI Card Click → Drill-Down
| Card Click | Navigates To |
|:--|:--|
| Total Registrations | `/members?filter=date_range&from=X&to=Y` |
| New Leads Today | `/leads?filter=today` |
| Pending Verifications | `/verifications` |
| Today's Follow-ups | `/leads?view=todays-followups` |

---

---

# SCREEN 3 — Employee List
**Route:** `/employees`  
**Min Role:** SUPER_ADMIN

## UI Elements
- Search bar (by name, email, employee ID)
- Filters: Role, Department, Status (Active/Inactive), Team
- Table: EmpID, Name, Email, Role, Department, Team, Lead Count, Last Login, Status
- Action buttons: View, Edit, Deactivate, Force Logout
- "Add Employee" button (top right)

## APIs Called

### Load employee list
```
GET /api/v1/admin/employees
Query: ?page=1&limit=20&search=&role=CRM_AGENT&department=&status=ACTIVE&teamId=

Response:
{
  data: {
    employees: [
      {
        _id, employeeId, fullName, email, mobile, role, department,
        teamName, isActive, lastLoginAt, assignedLeadCount,
        isChatEnabled, createdAt
      }
    ],
    pagination: { total: 47, page: 1, limit: 20, totalPages: 3 }
  }
}
```

### Deactivate employee (from list action)
```
PUT /api/v1/admin/employees/:id/status
Body: { status: "INACTIVE", reason: "Employee resigned" }
Response: { success: true, message: "Employee deactivated" }
```

### Force Logout (from list action)
```
POST /api/v1/admin/employees/:id/force-logout
Response: { success: true, message: "All sessions terminated" }
→ Backend: adds all employee tokens to Redis blacklist
```

---

---

# SCREEN 4 — Employee Detail / Create / Edit
**Route:** `/employees/:id` (Edit) | `/employees/new` (Create)

## UI Elements
- **Left Column:** Basic info form (name, email, mobile, department, team, manager)
- **Right Column:** Permission matrix (module-by-module toggles)
- **Bottom:** Chat shift schedule, Record scope selector, Max lead capacity input
- **Tabs:** Overview | Permissions | Activity History | Assigned Leads

## APIs Called

### Load employee detail
```
GET /api/v1/admin/employees/:id
Response:
{
  data: {
    _id, employeeId, fullName, email, mobile, role, department,
    managerId, teamId, isActive, isChatEnabled,
    permissions: {
      leads: { view, assign, export, call },
      members: { view, edit, verify },
      finance: { view, refund, export },
      ads: { view, create, publish, pause },
      reports: { view, export },
      chat: { receive, initiate, viewHistory },
      settings: { manage }
    },
    recordScope, regions[], languages[],
    maxLeadCapacity, tempAccessExpiry,
    chatShifts: [{ startTime, endTime, days[] }],
    mfaEnabled, lastLoginAt, lastActiveAt,
    createdBy: { name, employeeId }, createdAt
  }
}
```

### Load teams dropdown
```
GET /api/v1/admin/teams
Response: [{ _id, name, managerId, memberCount }]
```

### Create new employee
```
POST /api/v1/admin/employees
Body: {
  fullName, email, mobile, role, department, teamId, managerId,
  recordScope, maxLeadCapacity, permissions: { ... },
  isChatEnabled, chatShifts[], tempAccessExpiry
}
Response:
{
  success: true,
  data: { _id, employeeId, ...created data }
  message: "Employee created. Secure setup link sent to email."
}
→ Backend: sends secure password-setup link to employee email (never shows password)
```

### Update employee
```
PUT /api/v1/admin/employees/:id
Body: { fullName, mobile, department, teamId, managerId, maxLeadCapacity }
Response: { success: true }
```

### Update permissions (separate call — requires reason)
```
PUT /api/v1/admin/employees/:id/permissions
Body: {
  permissions: { leads: { view: true, assign: false, ... }, ... },
  reason: "Role change: promoted to CRM Manager"
}
Response: { success: true }
→ Backend: creates AuditLog entry with before/after diff
```

### "View as Employee" preview (SUPER_ADMIN only)
```
GET /api/v1/admin/employees/:id/access-preview
Response: { simulatedPermissions, recordScope, visibleModules[], restrictedModules[] }
→ Backend: creates AuditLog: { action: "VIEW_AS_EMPLOYEE", target: employeeId }
→ Admin sees: read-only preview showing what this employee can see/do
```

### Permission change history tab
```
GET /api/v1/admin/employees/:id/audit?type=PERMISSION_CHANGE
Response: [{
  timestamp, changedBy: { name }, previousRole, newRole,
  permissionsAdded: [], permissionsRemoved: [], reason
}]
```

## Data Flow
```
[Admin opens employee page]
       ↓
Parallel: GET /employees/:id + GET /teams
       ↓
Render form with current data
       ↓
Admin changes permissions toggle
       ↓
"Reason" modal appears (mandatory text input)
       ↓
PUT /employees/:id/permissions { permissions, reason }
       ↓
AuditLog created → Success toast
```

---

---

# SCREEN 5 — Lead List (CRM)
**Route:** `/leads`  
**Min Role:** CRM_AGENT (sees own leads), CRM_MANAGER+ (sees all/team)

## UI Elements
- **Top:** Saved Views tabs (My Leads | Unassigned | Today's Follow-ups | Overdue | New | High Priority | Converted)
- **Search:** Lead ID, name, mobile (masked), email, city
- **Filters:** Status, Owner/Employee, Team, Source, Campaign, Date Range, Priority, Plan Interest, Subcaste
- **Table:** Lead ID, Name, Mobile (masked), Source, Status, Priority, Owner, Last Contact, Next Follow-up
- **Bulk select:** Checkboxes + "Assign Selected" button
- **Export button** (permission-checked)

## APIs Called

### Load lead list
```
GET /api/v1/admin/leads
Query: ?page=1&limit=25&view=MY_LEADS&status=ASSIGNED&source=&ownerId=
       &search=&priority=HIGH&dateFrom=&dateTo=&campaign=

Response:
{
  data: {
    leads: [
      {
        _id, leadId, name,
        mobile: "+91 98****5678",  // masked for CRM_AGENT
        source, status, priority,
        owner: { _id, name },
        nextFollowUp, lastContactedAt,
        slaStatus: "ON_TIME | BREACH | APPROACHING",
        createdAt
      }
    ],
    pagination: { total: 234, page: 1 }
  }
}
```

### Saved Views (pre-filtered shortcuts)
```
GET /api/v1/admin/leads/saved-views
Response: [
  { key: "MY_LEADS",           label: "My Leads",           count: 47 },
  { key: "UNASSIGNED",         label: "Unassigned",         count: 12 },
  { key: "TODAYS_FOLLOWUPS",   label: "Today's Follow-ups", count: 8  },
  { key: "OVERDUE",            label: "Overdue",            count: 3  },
  { key: "HIGH_PRIORITY",      label: "High Priority",      count: 15 },
  { key: "SUBSCRIPTION_PENDING", label: "Sub. Pending",     count: 21 },
  { key: "CONVERTED",          label: "Converted",          count: 89 }
]
```

### Quick status change from list
```
PUT /api/v1/admin/leads/:id/status
Body: { status: "CONTACTED", reason: "" }
Response: { success: true }
```

### Export leads
```
GET /api/v1/admin/leads/export
Query: ?format=csv&status=CONVERTED&from=2024-01-01&to=2024-01-31
→ Returns: jobId (async export)
→ Poll: GET /api/v1/admin/reports/export/:jobId/status
→ Download: GET /api/v1/admin/reports/export/:jobId/download
```

---

---

# SCREEN 6 — Lead Detail (360° View)
**Route:** `/leads/:id`  
**Min Role:** CRM_AGENT (own leads only), CRM_MANAGER+ (all)

## UI Elements
- **Header:** Lead ID, Name, Status badge, Priority badge, SLA timer
- **Left Panel:** Contact info, Source, Campaign, Linked member profile
- **Center Panel:** Activity Timeline (chronological all events)
- **Right Panel:** Quick Actions (Call, Add Note, Set Follow-up, Change Status, Reassign)
- **Bottom Tabs:** Notes | Call History | Messages | Follow-ups | Subscription History

## APIs Called

### Load lead detail
```
GET /api/v1/admin/leads/:id
Response:
{
  data: {
    _id, leadId, name,
    mobile: "+91 9876543210",  // Full number for ADMIN+, masked for CRM_AGENT
    email, dialCode, city, gender, ageRange, subcaste,
    source, campaignId, referralCode,
    status, priority,
    owner: { _id, name, mobile },
    previousOwners: [{ employee, assignedAt, removedAt, reason }],
    teamId, assignedBy, assignedAt, assignmentRule,
    nextFollowUp, followUpChannel, slaTarget,
    firstContactAt, slaStatus,
    planInterest, budget, objection,
    conversionValue, convertedAt,
    isDuplicate, isDoNotContact,
    linkedMember: { _id, name, profileUrl },
    createdAt
  }
}
```

### Load activity timeline
```
GET /api/v1/admin/leads/:id/timeline?page=1&limit=50
Response:
{
  data: [
    {
      _id, type: "CALL_CONNECTED",
      actor: { name, role },
      callDuration: 184,
      callOutcome: "ANSWERED",
      callDisposition: "INTERESTED",
      createdAt: "2024-01-15T10:30:00Z"
    },
    {
      type: "NOTE_ADDED",
      noteText: "Interested in Gold plan. Budget concern — offer EMI option.",
      isInternal: true,
      actor: { name },
      createdAt: "2024-01-15T10:35:00Z"
    },
    {
      type: "STATUS_CHANGED",
      previousStatus: "CONTACTED",
      newStatus: "INTERESTED",
      actor: { name },
      createdAt: "2024-01-15T10:36:00Z"
    },
    {
      type: "FOLLOW_UP_SET",
      followUpDate: "2024-01-17T11:00:00Z",
      followUpChannel: "CALL",
      createdAt: "2024-01-15T10:37:00Z"
    }
  ],
  pagination: { total: 23, page: 1 }
}
```

### Add note
```
POST /api/v1/admin/leads/:id/notes
Body: {
  noteText: "Interested in Gold plan, wants EMI option. Call back Monday 11am.",
  isInternal: true,
  attachments: []
}
Response: { success: true, data: { activityId, createdAt } }
→ Creates LeadActivity { type: "NOTE_ADDED" }
```

### Set / Reschedule Follow-up
```
POST /api/v1/admin/leads/:id/follow-up
Body: {
  followUpDate: "2024-01-17T11:00:00Z",
  timezone: "Asia/Kolkata",
  channel: "CALL",
  priority: "HIGH",
  reason: "Needs time to discuss with family"
}
Response: { success: true }
→ Creates LeadActivity { type: "FOLLOW_UP_SET" }
→ Notification job scheduled for employee at followUpDate - 15min
```

### Change status
```
PUT /api/v1/admin/leads/:id/status
Body: { status: "INTERESTED", note: "Ready to buy after family discussion" }
Response: { success: true }
→ Creates LeadActivity { type: "STATUS_CHANGED", previousStatus, newStatus }
```

### Reassign to another employee
```
POST /api/v1/admin/leads/:id/reassign
Body: { newOwnerId: "emp_id_456", reason: "Previous agent on leave" }
Response: { success: true }
→ Creates LeadActivity { type: "REASSIGNED" }
→ Old owner removed, previousOwners[] updated
→ New owner notified via push + in-app
```

### Initiate call from lead detail
```
POST /api/v1/admin/calls/initiate
Body: { leadId: ":id", targetMobile: "+919876543210" }
Response: { callId: "call_xyz", status: "INITIATED" }
→ Backend calls Exotel API → Provider connects employee phone → member phone
→ Webhook fires on events: RINGING, CONNECTED, ENDED
→ After call: disposition form appears mandatorily
```

### Submit call disposition (mandatory after call)
```
POST /api/v1/admin/calls/:callId/disposition
Body: {
  outcome: "ANSWERED",
  disposition: "INTERESTED",
  note: "Very interested, call back in 2 days",
  nextFollowUpDate: "2024-01-17T11:00:00Z"
}
Response: { success: true }
→ Updates CallLog, creates LeadActivity { type: "CALL_CONNECTED" }
```

## Data Flow on Screen Load
```
GET /leads/:id  (main data)
GET /leads/:id/timeline?page=1  (activity feed)
GET /leads/:id/calls  (call history tab — lazy)
     ↓
Render header + timeline simultaneously
     ↓
User clicks "Call" button
  → POST /calls/initiate
  → Show "Calling..." overlay with live status
  → Webhook events update status: RINGING → CONNECTED → ENDED
  → ENDED: Show disposition modal (cannot dismiss without submitting)
     ↓
User adds note → POST /leads/:id/notes → Timeline refreshes (poll or Socket)
User sets follow-up → POST /leads/:id/follow-up → Timeline updates
User changes status → PUT /leads/:id/status → Header badge updates
```

---

---

# SCREEN 7 — Bulk Assign Leads
**Route:** `/leads/bulk-assign` (or modal on Lead List)  
**Min Role:** CRM_MANAGER

## UI Elements
- **Step 1:** Lead selection (checkboxes on list OR filter-based "select all matching")
- **Step 2:** Assignment method selector (Round-robin / Even distribute / Single / By team)
- **Step 3:** Employee selector (multi-select with current load shown)
- **Step 4:** Rules toggles (capacity limit, business hours, no-duplicate)
- **Step 5:** Preview table (employee name, current load, new leads, total)
- **Confirm button** + success/failure summary

## APIs Called

### Preview assignment distribution (before confirm)
```
POST /api/v1/admin/leads/bulk-assign/preview
Body: {
  leadIds: ["lead1", "lead2", "lead3"],
  allMatchingFilter: false,
  filterParams: { status: "UNASSIGNED", source: "WEBSITE_FORM" },
  method: "ROUND_ROBIN",
  employeeIds: ["emp1", "emp2", "emp3"],
  rules: {
    respectCapacityLimit: true,
    businessHoursOnly: false,
    noDuplicateOwnership: true,
    workloadBalancing: true
  }
}

Response (PREVIEW — no DB changes yet):
{
  data: {
    totalLeads: 45,
    distribution: [
      { employee: { id, name, currentLoad: 12, maxCapacity: 20 }, newLeads: 15, totalAfter: 27 },
      { employee: { id, name, currentLoad: 8,  maxCapacity: 20 }, newLeads: 15, totalAfter: 23 },
      { employee: { id, name, currentLoad: 14, maxCapacity: 20 }, newLeads: 15, totalAfter: 29 }
    ],
    warnings: ["emp3 will exceed 80% capacity"],
    unassignable: 2  // leads that couldn't be assigned (duplicate ownership)
  }
}
```

### Confirm and execute bulk assignment
```
POST /api/v1/admin/leads/bulk-assign
Body: { ...same as preview... }

Response:
{
  data: {
    assigned: 43,
    failed: 2,
    failures: [
      { leadId: "lead_x", reason: "Employee at capacity" },
      { leadId: "lead_y", reason: "Duplicate ownership rule" }
    ]
  }
}
→ For each lead: LeadActivity { type: "ASSIGNED" } created
→ Each employee notified: "15 new leads assigned to you"
→ Downloadable error report for partial failures
```

## Data Flow
```
[CRM Manager on Lead List]
Select leads using checkboxes (or "Select all 234 matching filter")
       ↓
Click "Bulk Assign" → Drawer/Modal opens
       ↓
Choose method + select employees
       ↓
Click "Preview" → POST /bulk-assign/preview (no DB change)
       ↓
Review distribution table + warnings
       ↓
Click "Confirm Assign" → POST /bulk-assign (actual DB changes)
       ↓
Show: "43 leads assigned, 2 failed" + download failure report
```

---

---

# SCREEN 8 — Member List
**Route:** `/members`  
**Min Role:** ADMIN

## UI Elements
- Search: Name, Profile ID, Mobile, Email
- Filters: Status, Verification, Subcaste, Plan, City, Gender, Age Range, Date Joined
- Table: Profile ID, Name, Mobile (masked), Gender, City, Plan, Verified, Status, Joined Date
- Action: View, Edit, Suspend/Activate
- "Add Member" button (Admin+)

## APIs Called

### Load member list
```
GET /api/v1/admin/members
Query: ?page=1&limit=25&search=&status=ACTIVE&isVerified=true
       &membershipTier=GOLD&gender=FEMALE&city=Mumbai&subcaste=Amil

Response:
{
  data: {
    members: [
      {
        _id, profileId: "SIND001234",
        fullName, mobile: "+91 98****5678",
        gender, city, subcaste,
        membershipTier, membershipExpiresAt,
        isProfileVerified,
        status, lastActiveAt, createdAt
      }
    ],
    pagination: { total: 1250, page: 1 }
  }
}
```

### Quick actions from list
```
PUT /api/v1/admin/members/:id/status
Body: { status: "SUSPENDED", reason: "Multiple spam reports received" }

POST /api/v1/admin/members/:id/send-reset-link
Response: { success: true, message: "Reset link sent to registered email" }
```

---

---

# SCREEN 9 — Member Detail (360° View)
**Route:** `/members/:id`  
**Min Role:** ADMIN

## UI Elements
- **Header:** Name, Profile ID, Age, City, Subcaste, Status badge, Verification badge, Plan badge
- **Profile Photo Gallery:** With moderation status per photo
- **Tabs:**
  - Profile (all fields: basic, religious, career, family, lifestyle)
  - Partner Preference
  - Linked Leads
  - Subscription & Payments
  - Interests (Sent/Received)
  - Call & Chat History
  - Edit History (audit)
  - Reports/Blocks

## APIs Called

### Member full profile
```
GET /api/v1/admin/members/:id
Response:
{
  data: {
    user: {
      _id, profileId, mobile, email, dialCode,
      membershipTier, membershipExpiresAt,
      isMobileVerified, isEmailVerified, isProfileVerified,
      status, accountType, lastActiveAt, createdAt
    },
    profile: {
      fullName, gender, dob, heightCm, maritalStatus,
      country, state, city, citizenship,
      religion, caste, subcaste, gotra, rashi, nakshatra, manglik,
      horoscopeFileUrl, highestEducation, employedIn, occupation,
      annualIncome, familyType, familyStatus, fatherOccupation,
      brothersCount, sistersCount, diet, smoking, drinking,
      hobbies, bio, avatar,
      photos: [{ url, isApproved, isPrivate, rejectionReason }],
      profileCompletionPercentage
    },
    partnerPreference: { ageMin, ageMax, subcastes[], cities[], diet[] },
    linkedLeads: [{ leadId, source, status, ownedBy }],
    activeSubscription: { plan, expiresAt, contactsRemaining },
    stats: {
      interestsSent: 12, interestsReceived: 34,
      shortlisted: 8, blockedUsers: 0, reportsReceived: 0
    }
  }
}
```

### Edit profile field (Admin)
```
PUT /api/v1/admin/members/:id/basic
Body: { city: "Pune", highestEducation: "MBA", reason: "User requested correction via support" }
Response: { success: true }
→ AuditLog: { field: "city", oldValue: "Mumbai", newValue: "Pune", changedBy, reason }
→ If mobile/email changed: re-verification triggered, old value stored
```

### Verify member (KYC approved)
```
POST /api/v1/admin/members/:id/verify
Body: { verificationNote: "Aadhaar verified successfully", verificationDocRef: "doc_id" }
Response: { success: true }
→ user.isProfileVerified = true
→ AuditLog created
→ Member gets: Push notification "🎉 Your profile is now verified!"
               + Email: "Congratulations, your profile has been verified"
```

### Suspend member
```
PUT /api/v1/admin/members/:id/status
Body: { status: "SUSPENDED", reason: "Fake photos uploaded, 3 valid reports received" }
Response: { success: true }
→ User cannot login → All active sessions cleared
→ AuditLog: requires second approver if configured
```

### Edit history tab
```
GET /api/v1/admin/members/:id/edit-history
Response: [
  {
    field: "city", oldValue: "Mumbai", newValue: "Pune",
    changedBy: { name, role }, reason, timestamp
  },
  {
    field: "isProfileVerified", oldValue: false, newValue: true,
    changedBy: { name }, reason: "Aadhaar verified", timestamp
  }
]
```

### Subscription + payments tab
```
GET /api/v1/admin/members/:id/subscriptions
Response: [{ plan, status, purchasedAt, expiresAt, amountPaid, paymentId }]

GET /api/v1/admin/members/:id/transactions
Response: [{ transactionId, type, amount, status, gateway, createdAt }]
```

---

---

# SCREEN 10 — Verification Queue
**Route:** `/verifications`  
**Min Role:** MODERATOR

## UI Elements
- **Tabs:** Pending Photos | Pending ID Proofs | Pending Both
- **Cards per item:** Member name, uploaded at, photo/doc preview, Approve/Reject buttons
- **Rejection modal:** Reason text (mandatory)
- Count badge on tab headers

## APIs Called

### Load pending queue
```
GET /api/v1/admin/verifications/pending
Query: ?type=PHOTO|ID_PROOF|ALL&page=1&limit=20

Response:
{
  data: [
    {
      _id, type: "PHOTO",
      member: { _id, profileId, fullName, gender },
      fileUrl: "https://cdn.../photo.jpg",
      uploadedAt: "2024-01-15T08:20:00Z"
    },
    {
      _id, type: "ID_PROOF",
      member: { _id, profileId, fullName },
      fileUrl: "https://cdn.../aadhaar.jpg",
      idType: "AADHAAR",
      uploadedAt: "2024-01-15T09:10:00Z"
    }
  ],
  counts: { photos: 8, idProofs: 4, total: 12 }
}
```

### Approve
```
POST /api/v1/admin/verifications/:id/approve
Body: { note: "Clear photo, approved" }
Response: { success: true }
→ Photo: profile.photos[n].isApproved = true
→ ID Proof: user.isProfileVerified = true
→ Member notified via push: "✅ Your profile photo has been approved!"
→ AuditLog created
```

### Reject
```
POST /api/v1/admin/verifications/:id/reject
Body: { reason: "Photo is blurry / watermarked / not a real photo" }
Response: { success: true }
→ Photo: profile.photos[n].isApproved = false + rejectionReason set
→ Member notified via push: "Your photo was rejected: [reason]. Please upload a clearer photo."
→ AuditLog created
```

## Data Flow
```
[Moderator opens verification queue]
       ↓
GET /verifications/pending → Load cards with photos/docs
       ↓
Moderator reviews photo/document
       ↓
Click "Approve" → POST /verifications/:id/approve → Card removed from queue
Click "Reject" → Modal: enter reason → POST /verifications/:id/reject → Card removed
       ↓
Count badge updates in real-time (Socket event or refetch)
```

---

---

# SCREEN 11 — Call Reports
**Route:** `/calls/reports`  
**Min Role:** CRM_MANAGER

## UI Elements
- Date range filter, Employee filter
- KPI Cards: Total Calls, Connected, Not Answered, Avg Talk Time, Connect Rate
- Table: Employee name, Calls Made, Connected, Not Answered, Avg Talk Time, Conversion Rate
- Bar chart: Calls by hour of day
- Donut: Disposition breakdown (Interested/Follow-up/Not Interested/etc)

## APIs Called

### Call summary stats
```
GET /api/v1/admin/calls/reports
Query: ?from=2024-01-01&to=2024-01-31&employeeId=&teamId=

Response:
{
  data: {
    summary: {
      totalCalls: 428, connected: 312, noAnswer: 89, busy: 27, failed: 0,
      connectRate: "72.9%", avgTalkTimeSeconds: 184, totalTalkTimeHours: 15.9
    },
    byEmployee: [
      {
        employee: { id, name },
        totalCalls: 47, connected: 38, noAnswer: 9,
        avgTalkSec: 210, dispositions: { interested: 12, followUp: 18, notInterested: 8 },
        callToConversion: 3, conversionRate: "6.4%"
      }
    ],
    byHour: [{ hour: 9, calls: 42 }, { hour: 10, calls: 67 }, ...],
    byDisposition: [
      { disposition: "INTERESTED", count: 89 },
      { disposition: "FOLLOW_UP", count: 156 },
      { disposition: "NOT_INTERESTED", count: 67 }
    ]
  }
}
```

### Call history (click employee row → detail)
```
GET /api/v1/admin/calls?employeeId=emp1&from=2024-01-01&to=2024-01-31&page=1
Response: [
  {
    callId, leadId, leadName, mobile: "masked",
    direction, status, durationSeconds,
    disposition, dispositionNote,
    startedAt, endedAt
  }
]
```

### Access recording (permission-gated)
```
GET /api/v1/admin/calls/:callId/recording
→ If employee has permission: returns signed URL (expires 30 min)
→ If no permission: 403 Forbidden
→ AuditLog: { action: "RECORDING_ACCESSED", callId, actor }
```

---

---

# SCREEN 12 — Chat Management
**Route:** `/chats`  
**Min Role:** SUPPORT_AGENT (own chats), ADMIN+ (all)

## UI Elements
- Left sidebar: Conversation list (queued, active, waiting, resolved)
- Center: Chat window with message history
- Right panel: Lead/Member info linked to this conversation
- Top: Status toggle (Available / Busy / Offline)

## APIs Called

### Load conversations
```
GET /api/v1/admin/chats
Query: ?status=ACTIVE&assignedTo=ME&page=1

Response: [
  {
    _id, type: "SUPPORT",
    member: { name, profileId, membershipTier },
    lastMessage: { content, createdAt },
    unreadCount: 3,
    status: "ACTIVE",
    assignedTo: { name },
    firstResponseTime: null,
    createdAt
  }
]
```

### Load chat transcript
```
GET /api/v1/admin/chats/:conversationId
Response: {
  conversation: { _id, status, member, assignedTo },
  messages: [
    { _id, senderId, senderType: "MEMBER|EMPLOYEE", content, createdAt, isRead }
  ]
}
```

### Send message
```
POST /api/v1/admin/chats/:conversationId/send
Body: { content: "Hello! How can I help you today?" }
→ Also sent via Socket.io for real-time delivery
```

### Transfer chat
```
POST /api/v1/admin/chats/:conversationId/transfer
Body: { toEmployeeId: "emp_456", reason: "Language preference" }
Response: { success: true }
→ New employee gets push notification: "Chat transferred to you"
→ Transcript preserved, ownership history logged
```

### Resolve chat
```
POST /api/v1/admin/chats/:conversationId/resolve
Body: { resolutionNote: "Query resolved. Upgraded to Gold plan." }
Response: { success: true }
```

### Toggle availability (employee status)
```
PUT /api/v1/admin/employees/me/chat-status
Body: { status: "AVAILABLE | BUSY | OFFLINE" }
→ Affects routing: BUSY/OFFLINE employees do not receive new chats
```

---

---

# SCREEN 13 — Subscription Plans Management
**Route:** `/plans`  
**Min Role:** ADMIN

## UI Elements
- Cards for each plan (Free, Silver, Gold, Platinum)
- Each card: Price, Validity, Features list, Contact limit, Toggle (Active/Inactive)
- "Edit Plan" button opens modal
- "Add New Plan" button

## APIs Called

### Load all plans
```
GET /api/v1/admin/plans
Response: [
  {
    _id, name: "Gold", tier: "GOLD",
    priceINR: 2999, priceUSD: 36, validityDays: 90,
    contactsViewLimit: 50, chatEnabled: true,
    profileBoostCredits: 3, canViewPhone: true, canViewEmail: true,
    prioritySupport: true, features: ["Priority placement", "Unlimited search"],
    taxPercent: 18, isActive: true, displayOrder: 3
  }
]
```

### Create new plan
```
POST /api/v1/admin/plans
Body: {
  name: "Platinum Plus", tier: "PLATINUM",
  priceINR: 5999, validityDays: 180,
  contactsViewLimit: 200, chatEnabled: true,
  profileBoostCredits: 10, canViewPhone: true, canViewEmail: true,
  features: ["VIP support", "Profile spotlight", "Unlimited contacts"],
  taxPercent: 18, isActive: true, displayOrder: 5
}
```

### Toggle plan active/inactive
```
PUT /api/v1/admin/plans/:id/toggle
Body: { isActive: false }
Response: { success: true }
→ Inactive plan: not shown to users but existing subscriptions unaffected
```

---

---

# SCREEN 14 — Subscriptions List
**Route:** `/subscriptions`  
**Min Role:** FINANCE_STAFF

## UI Elements
- Filters: Status, Plan Tier, Date Range, Auto-renew, Payment Gateway
- Table: Member Name, Plan, Purchase Date, Expiry, Status, Amount, Auto-renew
- Action: View detail, Extend, Cancel, Grant Manual

## APIs Called

### Load subscriptions
```
GET /api/v1/admin/subscriptions
Query: ?page=1&status=ACTIVE&planTier=GOLD&from=2024-01-01&to=2024-01-31

Response: [
  {
    _id, userId: { name, profileId, mobile: "masked" },
    plan: { name, tier }, status, purchasedAt, expiresAt,
    autoRenew, amountPaid, paymentGateway,
    couponCode, discountAmount, contactsViewedRemaining
  }
]
```

### Grant manual subscription (FM permission required)
```
POST /api/v1/admin/subscriptions/manual-entitle
Body: {
  userId: "user_123",
  planId: "plan_gold",
  validityDays: 30,
  reason: "Compensating for payment gateway issue on 2024-01-10"
}
Response: { success: true }
→ isManualEntitlement: true, grantedBy: currentEmployee
→ AuditLog: { action: "MANUAL_SUBSCRIPTION_GRANTED", reason }
→ Transaction NOT created (no actual payment — clearly marked as manual)
```

### Extend subscription
```
PUT /api/v1/admin/subscriptions/:id/extend
Body: { additionalDays: 15, reason: "Compensation for app downtime" }
→ AuditLog entry
→ Member notified: "Your subscription has been extended by 15 days"
```

---

---

# SCREEN 15 — Finance Summary
**Route:** `/finance`  
**Min Role:** FINANCE_STAFF

## UI Elements
- Date range selector (preset + custom)
- **Summary cards:** Gross | Net | Refunds | Gateway Fees | GST | Discounts
- **Bar chart:** Daily revenue for selected period
- **Pie chart:** Revenue by plan tier
- **Table:** Recent transactions (last 10)

## APIs Called

### Finance overview
```
GET /api/v1/admin/finance/summary
Query: ?from=2024-01-01&to=2024-01-31

Response:
{
  data: {
    grossCollection: 485000,
    successfulPayments: 470000,
    refunded: 12000,
    partiallyRefunded: 3000,
    gatewayFees: 14100,
    taxCollected: 71694,
    discountsApplied: 28500,
    netRevenue: 420206,
    failedPaymentsCount: 23,
    pendingPayments: 5000,
    currency: "INR",
    byPlan: [
      { tier: "SILVER", revenue: 89000, count: 89 },
      { tier: "GOLD",   revenue: 267000, count: 89 },
      { tier: "PLATINUM", revenue: 114000, count: 19 }
    ],
    dailyRevenue: [
      { date: "2024-01-01", amount: 15000 },
      { date: "2024-01-02", amount: 22000 }
    ]
  }
}
```

---

---

# SCREEN 16 — Transaction Ledger
**Route:** `/finance/transactions`  
**Min Role:** FINANCE_STAFF

## UI Elements
- Search: Transaction ID, Member name, Order ID, Payment ID
- Filters: Type, Status, Gateway, Date Range, Amount range
- Table: Txn ID, Member, Plan, Amount, Type, Status, Gateway, Created Date
- Row click → Transaction Detail drawer
- Export button

## APIs Called

### Transaction list
```
GET /api/v1/admin/finance/transactions
Query: ?page=1&type=PAYMENT&status=SUCCESS&gateway=RAZORPAY
       &from=2024-01-01&to=2024-01-31&search=

Response: [
  {
    _id, transactionId,
    member: { name, profileId },
    plan: { name, tier },
    type, status, amount, currency,
    discountAmount, taxAmount, gatewayFee, netAmount,
    gatewayOrderId, gatewayPaymentId,
    refundId, refundAmount,
    invoiceUrl, reconciled, createdAt
  }
]
```

### Transaction detail (drawer)
```
GET /api/v1/admin/finance/transactions/:id
Response: { ...all fields + gatewayResponse (raw) }
```

### Download invoice
```
GET /api/v1/admin/finance/invoices/:transactionId
→ Returns signed PDF URL (30 min expiry)
```

---

---

# SCREEN 17 — Refund Management
**Route:** `/finance/refunds`  
**Min Role:** FINANCE_STAFF (request) | FINANCE_MANAGER (approve)

## UI Elements
- **Tabs:** Pending Approval | Processing | Completed | Rejected
- Each refund card: Member, Transaction amount, Reason, Requested by, Date
- Finance Manager tab: Approve/Reject buttons with reason
- Finance Staff tab: "Raise New Refund" button only

## APIs Called

### Raise refund request
```
POST /api/v1/admin/finance/refunds/request
Body: {
  transactionId: "txn_123",
  refundAmount: 2999,
  refundType: "FULL | PARTIAL",
  reason: "Member complained: payment gateway double charged"
}
Response: { success: true, refundRequestId: "refund_req_456" }
→ Finance Manager gets in-app notification: "New refund request awaiting approval"
```

### Load pending approvals (Finance Manager)
```
GET /api/v1/admin/finance/refunds/pending
Response: [
  {
    _id, transaction: { id, member, plan, amount },
    refundAmount, reason, requestedBy: { name },
    requestedAt
  }
]
```

### Approve refund
```
POST /api/v1/admin/finance/refunds/:id/approve
Body: { approverNote: "Valid complaint. Approved full refund." }
Response: { success: true }
→ Backend calls: Razorpay Refund API (razorpay.refunds.create)
→ Razorpay fires webhook → Backend verifies signature
→ Transaction.status = REFUNDED
→ Subscription.status = REFUNDED → member access revoked
→ Member notified: "Refund of ₹2,999 initiated. 5-7 business days."
→ AuditLog: { action: "REFUND_APPROVED", approver, amount, reason }
```

### Reject refund
```
POST /api/v1/admin/finance/refunds/:id/reject
Body: { reason: "Outside refund policy window (30 days). Cannot process." }
→ Requester notified with reason
→ AuditLog created
```

---

---

# SCREEN 18 — Campaign List
**Route:** `/campaigns`  
**Min Role:** AD_MANAGER

## UI Elements
- **Pipeline columns (Kanban style) OR Table:**
  NEW_REQUEST | REVIEW | APPROVED | SCHEDULED | LIVE | PAUSED | COMPLETED
- Card: Campaign name, Advertiser, Placement, Dates, Budget, Impressions
- Filter by platform (WEB/MOBILE), placement, date, status
- "New Campaign" button

## APIs Called

### Load campaigns
```
GET /api/v1/admin/campaigns
Query: ?status=LIVE&placement=HOME_POPUP&platform=WEB&page=1

Response: [
  {
    _id, campaignId, name, advertiserName, status,
    placement, targetPlatform, startDate, endDate,
    impressions, clicks, ctaConversions,
    ctr: "2.4%", price, amountReceived,
    approvedBy: { name }, createdAt
  }
]
```

### Emergency pause live campaign
```
POST /api/v1/admin/campaigns/:id/pause
Body: { reason: "Creative violates policy — pending review" }
Response: { success: true }
→ Campaign.status = PAUSED
→ Frontend stops serving this campaign immediately (next cache refresh <1 min)
```

---

---

# SCREEN 19 — Campaign Create / Detail
**Route:** `/campaigns/new` | `/campaigns/:id`  
**Min Role:** AD_MANAGER

## UI Elements
- **Step 1:** Advertiser info + campaign objective
- **Step 2:** Creative upload + destination URL + CTA + dimensions check
- **Step 3:** Placement + targeting (location, login state, page context)
- **Step 4:** Schedule (start/end date, timezone, frequency cap, dismiss behavior)
- **Step 5:** Billing (pricing model, price, invoice status)
- **Preview button:** Shows device-specific preview (desktop/tablet/mobile)
- **Submit for Approval button**

## APIs Called

### Create campaign
```
POST /api/v1/admin/campaigns
Body: {
  name: "New Year Special",
  advertiserName: "XYZ Jewellery", advertiserEmail: "contact@xyz.com",
  objective: "Brand awareness + lead generation",
  creativeType: "IMAGE",
  creativeUrl: "https://s3.../creative.jpg",
  destinationUrl: "https://xyzjewellery.com/offer",
  cta: "Explore Collection",
  placement: "HOME_POPUP",
  targetPlatform: "BOTH",
  targeting: {
    locations: ["Maharashtra", "Gujarat"],
    loginState: "LOGGED_IN",
    pageContext: ["HOME", "SEARCH"]
  },
  startDate: "2024-01-26T00:00:00Z",
  endDate: "2024-02-05T23:59:59Z",
  timezone: "Asia/Kolkata",
  frequencyCap: { count: 1, per: "DAY" },
  dismissBehavior: "CLOSE_BUTTON",
  priority: 1,
  pricingModel: "FIXED_PLACEMENT",
  price: 25000
}
Response: { campaignId, status: "NEW_REQUEST" }
```

### Upload creative to S3
```
POST /api/v1/admin/campaigns/upload-creative
Body: FormData { file, campaignId }
Response: { url: "https://cdn.../creative.jpg", dimensions: "1200x628" }
```

### Submit for approval
```
POST /api/v1/admin/campaigns/:id/submit
Response: { status: "REVIEW" }
→ Ad Manager with approval rights gets in-app notification
```

### Approve campaign
```
POST /api/v1/admin/campaigns/:id/approve
Body: { approvalNote: "Creative verified, landing page active, billing confirmed" }
Response: { status: "APPROVED" }
→ At startDate: cron job sets status = LIVE
→ Frontend immediately serves this ad on matching placements
```

### Device preview
```
GET /api/v1/admin/campaigns/:id/preview
Response: {
  desktop: { previewHtml, dimensions },
  mobile: { previewHtml, dimensions },
  app: { previewHtml, dimensions }
}
```

### Campaign analytics
```
GET /api/v1/admin/campaigns/:id/analytics
Response: {
  eligibleViews: 15420, impressions: 12340,
  clicks: 296, dismissals: 3044,
  ctaConversions: 48, campaignLeads: 31,
  ctr: "2.4%", conversionRate: "0.39%",
  dailyBreakdown: [{ date, impressions, clicks }],
  deviceBreakdown: { web: 7440, mobile: 4900 }
}
```

---

---

# SCREEN 20 — Reports & Export Centre
**Route:** `/reports`  
**Min Role:** ANALYST

## UI Elements
- Report type selector (sidebar)
- Date range + filters per report
- Preview table / chart
- "Export" button (CSV/XLSX/PDF based on report type)
- Download history (previously generated exports)

## APIs Called

### Report data (example: Lead Funnel)
```
GET /api/v1/admin/reports/leads/funnel
Query: ?from=2024-01-01&to=2024-01-31&source=WEBSITE_FORM

Response: {
  data: [
    { stage: "Total Leads", count: 450 },
    { stage: "Assigned", count: 420 },
    { stage: "First Contact Made", count: 312 },
    { stage: "Qualified", count: 198 },
    { stage: "Subscription Pending", count: 89 },
    { stage: "Converted", count: 47 }
  ],
  conversionRate: "10.4%"
}
```

### Trigger async export
```
POST /api/v1/admin/reports/export
Body: {
  reportType: "LEAD_FUNNEL",
  format: "CSV",
  filters: { from: "2024-01-01", to: "2024-01-31" }
}
Response: { jobId: "export_job_789", status: "QUEUED" }
```

### Poll export status
```
GET /api/v1/admin/reports/export/:jobId/status
Response: { status: "PROCESSING | DONE | FAILED", progress: "60%" }
```

### Download export
```
GET /api/v1/admin/reports/export/:jobId/download
→ Returns signed S3 URL (expires 1 hour)
→ AuditLog: { action: "DATA_EXPORTED", reportType, filters, actor }
```

---

---

# SCREEN 21 — Moderation Queue
**Route:** `/moderation`  
**Min Role:** MODERATOR

## Sub-sections
- **Photos Queue:** New profile photos needing review
- **Abuse Reports:** User-reported members

## APIs Called (same as Screen 10 + below)

### Load abuse/spam reports
```
GET /api/v1/admin/moderation/reports
Query: ?status=OPEN&page=1

Response: [
  {
    _id, reportedMember: { profileId, name, photos },
    reportedBy: { profileId, name },
    reason: "SPAM | FAKE_PROFILE | HARASSMENT | INAPPROPRIATE_CONTENT",
    description, evidence: [{ type, url }],
    status: "OPEN",
    reportedAt
  }
]
```

### Resolve report
```
POST /api/v1/admin/moderation/reports/:id/resolve
Body: {
  action: "DISMISSED | WARNED | SUSPENDED | BANNED",
  moderatorNote: "Profile photos verified genuine. Report dismissed.",
  notifyReporter: true
}
Response: { success: true }
→ If SUSPENDED/BANNED: user.status updated → sessions cleared
→ AuditLog created
```

---

---

# SCREEN 22 — Notification Templates
**Route:** `/notifications`  
**Min Role:** ADMIN

## APIs Called

### Load templates
```
GET /api/v1/admin/notifications/templates
Response: [
  {
    _id, trigger: "LEAD_ASSIGNED", channel: "PUSH",
    title: "New Lead Assigned",
    body: "You have {{count}} new leads assigned. Check your CRM queue.",
    variables: ["count"],
    isActive: true, lastModifiedBy: { name }, updatedAt
  }
]
```

### Update template
```
PUT /api/v1/admin/notifications/templates/:id
Body: { title, body, isActive }
→ AuditLog: before/after template content
```

### Send broadcast (SUPER_ADMIN only)
```
POST /api/v1/admin/notifications/broadcast
Body: {
  channel: "PUSH",
  targetAudience: "ALL_ACTIVE_USERS | GOLD_SUBSCRIBERS | FREE_USERS",
  title: "🎉 New Year Offer!",
  body: "Upgrade to Gold this week and get 20% off. Limited time!",
  deepLink: "/upgrade"
}
Response: { jobId, estimatedRecipients: 2450 }
→ Queued as BullMQ job → processed in batches → delivery log updated
```

### Notification delivery logs
```
GET /api/v1/admin/notifications/logs
Query: ?channel=PUSH&status=FAILED&from=2024-01-01

Response: [
  { recipient: { name, profileId }, channel, title, status, failureReason, sentAt }
]
```

---

---

# SCREEN 23 — Audit Logs
**Route:** `/audit-logs`  
**Min Role:** SUPER_ADMIN

## UI Elements
- Filters: Actor (employee), Action type, Module, Date range, Target type
- Table: Timestamp, Actor, Action, Module, Target, Result
- Row click → Detail drawer with before/after diff

## APIs Called

### Load audit logs
```
GET /api/v1/admin/audit-logs
Query: ?actorId=&module=FINANCE&action=REFUND_APPROVED&from=2024-01-01&page=1

Response: [
  {
    _id, timestamp,
    actor: { name, role, ip },
    action: "REFUND_APPROVED",
    module: "FINANCE",
    targetType: "Transaction",
    targetId: "txn_123",
    result: "SUCCESS"
  }
]
```

### Audit log detail
```
GET /api/v1/admin/audit-logs/:id
Response: {
  ...all fields...
  beforeData: { status: "PENDING", refundAmount: null },
  afterData: { status: "REFUNDED", refundAmount: 2999 },
  changedFields: ["status", "refundAmount"],
  reason: "Valid complaint. Approved full refund.",
  requestId: "req_abc123"
}
```

---

---

# SCREEN 24 — Master Data (Subcastes, Gotras)
**Route:** `/settings/master-data`  
**Min Role:** SUPER_ADMIN

## APIs Called

### Load subcastes (Sindhi community master list)
```
GET /api/v1/admin/master-data/subcastes
Response: [
  { _id, name: "Amil", aliases: ["Amils"], isActive: true, displayOrder: 1 },
  { _id, name: "Baibhand", aliases: ["Bhaibhand"], isActive: true, displayOrder: 2 },
  { _id, name: "Sahiti", isActive: true, displayOrder: 3 },
  { _id, name: "Larkana", isActive: true, displayOrder: 4 },
  { _id, name: "Shikarpuri", isActive: true, displayOrder: 5 },
  { _id, name: "Dadu", isActive: true, displayOrder: 6 },
  { _id, name: "Sehwani", isActive: true, displayOrder: 7 },
  { _id, name: "Sindhi Sikh", isActive: true, displayOrder: 8 }
]
```

### Add / Edit subcaste
```
POST /api/v1/admin/master-data/subcastes
Body: { name: "Rochiram", aliases: [], isActive: true, displayOrder: 9 }

PUT /api/v1/admin/master-data/subcastes/:id
Body: { name: "Larkana (Larkani)", aliases: ["Larkani"], displayOrder: 4 }
→ Note: Existing profile values NOT auto-changed when label is edited
→ AuditLog created for all master data changes
```

---

---

# SCREEN 25 — System Settings
**Route:** `/settings`  
**Min Role:** SUPER_ADMIN

## Sections & APIs

### Telephony provider config
```
GET /api/v1/admin/settings/telephony
Response: {
  provider: "EXOTEL",
  accountSid: "****masked****",
  apiKeyLastUpdated: "2024-01-10",
  defaultCallerIdNumber: "+91-80-XXXXX",
  recordingEnabled: false,
  workingHoursStart: "09:00",
  workingHoursEnd: "20:00"
}

PUT /api/v1/admin/settings/telephony
Body: { provider: "EXOTEL", accountSid: "...", apiKey: "...", defaultCallerId: "..." }
→ Credentials stored in environment/secrets vault — never in DB
```

### Website chat widget config
```
GET /api/v1/admin/settings/chat/widget
PUT /api/v1/admin/settings/chat/widget
Body: { isEnabled: true, greetingMessage: "Hello! How can we help you?" }

GET /api/v1/admin/settings/chat/routing
PUT /api/v1/admin/settings/chat/routing
Body: { method: "ROUND_ROBIN | LEAST_ACTIVE | SKILL_BASED", queue: "SUPPORT" }

GET /api/v1/admin/settings/chat/business-hours
PUT /api/v1/admin/settings/chat/business-hours
Body: { 
  hours: { mon: { start: "09:00", end: "18:00" }, ... },
  offlineMessage: "We're offline. Leave your number and we'll call back.",
  createLeadWhenOffline: true
}
```

### SLA config
```
GET /api/v1/admin/settings/sla
PUT /api/v1/admin/settings/sla
Body: {
  bySource: {
    WEBSITE_FORM: { firstContactMinutes: 30 },
    ADVERTISEMENT: { firstContactMinutes: 15 },
    MANUAL_IMPORT: { firstContactMinutes: 120 }
  },
  escalateAfterMinutes: 60,
  escalateTo: "TEAM_LEAD"
}
```

---

## 🔌 Real-time Socket.io Events (Admin Portal)

### Admin connects to Socket
```javascript
// Admin portal connects on login
socket.emit("admin:join", { employeeId, token })
```

### Events admin receives in real-time
```javascript
// New lead assigned to this employee
socket.on("lead:assigned", (data) => {
  // { leadId, leadName, source, assignedBy }
  → Show toast notification + update "My Leads" count badge
})

// Follow-up reminder
socket.on("lead:followup_due", (data) => {
  // { leadId, leadName, followUpTime, channel }
  → Show urgent reminder notification
})

// SLA breach alert
socket.on("lead:sla_breach", (data) => {
  // { leadId, leadName, hoursOverdue }
  → Show red alert (for CRM Manager)
})

// New chat routed to this employee
socket.on("chat:new", (data) => {
  // { conversationId, memberName }
  → Show chat popup, increment badge
})

// New message in active chat
socket.on("chat:message", (data) => {
  // { conversationId, message }
  → Append to chat window
})

// Verification queue updated
socket.on("verification:new", (data) => {
  // { count } new pending
  → Update badge on Verification menu item
})

// Live call status updates
socket.on("call:status_update", (data) => {
  // { callId, status: "RINGING|CONNECTED|ENDED" }
  → Update call overlay UI
})
```

---

## ⚡ API Response Standard Format

All APIs return:
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional human-readable message",
  "meta": {
    "requestId": "req_abc123",
    "timestamp": "2024-01-15T10:30:00Z",
    "pagination": { "total": 250, "page": 1, "limit": 25, "totalPages": 10 }
  }
}
```

Error responses:
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "You don't have permission to perform this action",
    "field": null
  },
  "meta": { "requestId": "req_abc123" }
}
```

Common error codes:
| HTTP | Code | When |
|:--|:--|:--|
| 401 | UNAUTHORIZED | Token missing/expired |
| 403 | FORBIDDEN | Role/permission check failed |
| 404 | NOT_FOUND | Record not found |
| 422 | VALIDATION_ERROR | Invalid request body (Zod) |
| 429 | RATE_LIMITED | Too many requests |
| 500 | INTERNAL_ERROR | Server error |

