# Sindhi Matrimony: Multi-Profile & Family Matchmaking Architecture Specification

## 1. Executive Summary & Problem Definition

In traditional matrimonial ecosystems (specifically within close-knit Indian communities like the Sindhi community), marriage matchmaking is predominantly a **family-driven collective decision**. 

A single user account holder frequently manages multiple candidates across different stages:
1. **Day 1:** User (e.g., *Rahul Advani*) registers for **"Myself"** (`Gender: MALE`, looking for a bride).
2. **Day 2:** User also needs to find a suitable groom for his **"Sister"** (`Gender: FEMALE`, looking for a groom), or for his **Brother**, **Son**, **Daughter**, or **Cousin/Relative**.

### The Core Dilemma
In a conventional dating or simple single-profile web app, 1 Mobile Number = 1 Biodata. However, in matrimony:
- **Two-way Matchmaking Requirement:** Matrimonial discovery is strictly bi-directional. When a proposal or interest is sent to a groom, the recipient's family must evaluate the **Bride's biodata** (photo, age, Kundali, Gotra, education, profession) — not the brother's profile.
- **Account Continuity & Authentication:** The brother should **not** have to log out, buy separate SIM cards, or manage separate passwords.
- **Persona Distinction:** The platform must clearly distinguish between:
  - **Account Holder / Manager:** *Rahul Advani (Brother)* — handles chats, calls, and initial vetting.
  - **Candidate / Bride:** *Simran Advani (Sister)* — the person seeking marriage.

---

## 2. Core Architecture: 1 Account to N-Profiles (1:N Domain Model)

To cleanly solve this without duplicate accounts or messy data leaks, the architecture decouples **Account & Authentication** from **Candidate Biodata**.

```
                           ┌──────────────────────────────────────────────┐
                           │            User (Account Entity)             │
                           │  - _id: ObjectId("usr_101")                  │
                           │  - phone: "+91 9829012345"                   │
                           │  - activeProfileId: ObjectId("prof_sister")  │
                           │  - maxProfilesAllowed: 4                     │
                           │  - billingPlan: "GOLD_MEMBER"                │
                           └──────────────────────┬───────────────────────┘
                                                  │ 1-to-Many
                  ┌───────────────────────────────┴───────────────────────────────┐
                  ▼                                                               ▼
   ┌──────────────────────────────┐                                ┌──────────────────────────────┐
   │    Profile 1: Rahul (Self)   │                                │   Profile 2: Simran (Sister) │
   │  - _id: ObjectId("prof_self")│                                │  - _id: ObjectId("prof_sis") │
   │  - userId: ObjectId("usr_101)│                                │  - userId: ObjectId("usr_101)│
   │  - profileFor: "MYSELF"      │                                │  - profileFor: "SISTER"      │
   │  - gender: "MALE"            │                                │  - gender: "FEMALE"          │
   │  - candidateName: "Rahul"    │                                │  - candidateName: "Simran"   │
   │  - partnerPref: Brides       │                                │  - partnerPref: Grooms       │
   │  - isPrimary: true           │                                │  - isPrimary: false          │
   └──────────────────────────────┘                                └──────────────────────────────┘
```

### Supported Kin Relationships (`profileFor`)
| Value | Relation in Indian Family | Target Search Gender | Attribution Tag in UI |
| :--- | :--- | :--- | :--- |
| `MYSELF` | Candidate self-registration | Opposite of Self | *Self Managed* |
| `SISTER` | Badi Behan / Choti Behan | Looking for Male (Groom) | *Managed by Brother / Sibling* |
| `BROTHER` | Bada Bhai / Chota Bhai | Looking for Female (Bride) | *Managed by Brother / Sibling* |
| `DAUGHTER` | Beti (Parent login) | Looking for Male (Groom) | *Managed by Parent (Father/Mother)* |
| `SON` | Beta (Parent login) | Looking for Female (Bride) | *Managed by Parent (Father/Mother)* |
| `RELATIVE` | Chacha/Mama/Bua ka beta/beti (Cousin) | Dynamic (Male/Female) | *Managed by Relative* |
| `FRIEND` | Close family friend | Dynamic (Male/Female) | *Managed by Friend* |

---

## 3. End-to-End User Experience & Flow

```
[ Rahul logs in ] ──► Header Dropdown: "Active: Rahul (Self)" ──► Dashboard shows BRIDES (Females)
                               │
                               ▼ User clicks "+ Add Family Profile"
                  ┌──────────────────────────────────────────┐
                  │ Modal: Create Profile for SISTER         │
                  │ Name: Simran, DOB, Subcaste: Bhaiband    │
                  └────────────────────┬─────────────────────┘
                                       ▼ API: POST /api/v1/auth/profiles
                  ┌──────────────────────────────────────────┐
                  │ Switch to Simran: POST /switch-profile   │
                  └────────────────────┬─────────────────────┘
                                       │
                                       ▼
[ Dashboard Reloads ] ──► Header Dropdown: "Active: Simran (Sister)" ──► Dashboard shows GROOMS (Males)
```

### Detailed Screen-by-Screen Walkthrough:
1. **Profile Switching (1-Click Switcher):**
   - In the header navigation bar, the user avatar dropdown displays all associated profiles.
   - A single click on **"Simran Advani (Sister)"** issues a profile switch request.
   - The UI stays logged in; only the context token / `activeProfileId` changes.
2. **Feed & Recommendation Engine Re-indexing:**
   - Once switched to Sister's profile, the algorithm re-queries candidates:
     - Target Gender: `MALE` (Grooms)
     - Age Filter: Tailored to Sister's partner preference (e.g., 26–30 years)
     - Gotra Exclusions: Excludes Sister's self-gotra and mother's gotra (Sindhi exogamy rule).
     - Horoscope: Gun Milan / Astrological compatibility matched against Sister's planetary chart.
3. **Switching Back to Self:**
   - Rahul can switch back to **"Rahul (Myself)"** at any point to view brides for himself with separate shortlisted profiles and unread counters.

---

## 4. Communication & Chat Flow ("Who Talks to Whom?")

A frequent concern is: *When the brother chats, how does the other party perceive it?*

```
┌────────────────────────────────────────────────────────────────────────┐
│ Groom's Phone (Recipient)                                              │
├────────────────────────────────────────────────────────────────────────┤
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ ◄  [Photo: Simran]  Simran Advani, 25 yrs, Pune                    │ │
│ │    🟢 Active Now  •  🏷️ Profile Managed by Brother (Rahul)         │ │
│ └────────────────────────────────────────────────────────────────────┘ │
│                                                                        │
│                                ┌─────────────────────────────────────┐ │
│                                │ Namaste Amit ji, I am Rahul,        │ │
│                                │ Simran's brother. We liked your     │ │
│                                │ profile and family background.      │ │
│                                │ 10:42 AM  ✓✓                        │ │
│                                └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐                                │
│ │ Namaste Rahul ji, thank you for      │                                │
│ │ reaching out. My parents and I have │                                │
│ │ reviewed Simran ji's biodata.       │                                │
│ │ 10:45 AM                            │                                │
│ └─────────────────────────────────────┘                                │
└────────────────────────────────────────────────────────────────────────┘
```

### Rules of Engagement:
1. **Candidate Card Displays the Bride:** The recipient always sees the bride's photos, education, profession, and family background.
2. **Sender Attribution Badge:** Above the chat input and in the header, a badge clearly states:
   `🏷️ Managed by Brother (Rahul Advani)`.
3. **Contact Number Safeguards:**
   - When contact details are unlocked, the contact card lists:
     - **Contact Person:** Rahul Advani (Brother)
     - **Contact Number:** Brother's verified phone number
     - **Calling Preference:** Evenings / Weekends
   - The Sister's direct mobile number is **not** exposed unless explicitly granted in privacy settings.
4. **Separate Chat Inboxes:**
   - Messages sent regarding Sister are tagged under `profileId: prof_sister`.
   - Messages sent regarding Rahul are tagged under `profileId: prof_self`.
   - Conversations never collide or bleed across profiles.

---

## 5. Duplicate Profile Conflict & Sister Independent Registration

### Scenario:
*Brother registers Sister's profile on Day 2. One month later, Sister decides to download the app and register from her own phone.*

```
                 [ Brother's Account: +91 98290XXXXX ]
                                   │
                                   ▼
                    Profile: Simran Advani (Sister)
                    DOB: 14-Aug-1998, Subcaste: Bhaiband
                                   │
                    ┌──────────────┴──────────────┐
                    │ System Deduplication Hash   │
                    │ SHA256(Name+DOB+Gender+Sub) │
                    └──────────────┬──────────────┘
                                   │ MATCH DETECTED!
                                   ▼
                 [ Sister's Phone: +91 98765YYYYY ]
                 Sister tries to register same details
```

### How the System Resolves This:

#### Step 1: Intelligent Deduplication Check
Backend computes `identityDeduplicationHash` for every candidate:
$$\text{Hash} = \text{SHA256}(\text{lowercase}(name) + dobTimestamp + gender + subcaste)$$
When Sister attempts registration, backend intercepts with:
`HTTP 409 Conflict`: *"A candidate with identical details is already registered under your family account."*

#### Step 2: Resolution Options Offered to Sister & Brother

```
                           Conflict Detected
                                  │
         ┌────────────────────────┴────────────────────────┐
         ▼                                                 ▼
   Option A: Family Co-Management                   Option B: Profile Handover
   (Shared Access)                                  (Ownership Transfer)
   ─────────────────────────────────                ─────────────────────────────────
   - Sister enters her mobile.                      - Sister requests full control.
   - Brother gets an in-app prompt:                 - Brother confirms with OTP.
     "Simran wants to access her profile."          - Profile is detached from Brother
   - Brother approves. Sister gets login.             and linked to Sister's account.
   - Both can view matches & chats.                 - History & shortlists preserved.
```

1. **Option A: Family Co-Management (`ProfileAccessGrant`)**
   - Sister is granted `CO_MANAGER` access.
   - Both Brother and Sister can view matches simultaneously from their respective phones.
   - Real-time updates reflect for both parties.
2. **Option B: Full Ownership Handover**
   - Brother initiates **"Transfer Profile Ownership to Candidate"**.
   - Dual-OTP handshake (Brother confirms + Sister confirms).
   - Profile `userId` re-pointers to Sister's `User` record. No chat data or shortlisted proposals are lost.

---

## 6. Backend API & Database Implementation Details

### Database Schemas (Mongoose)

#### 1. `User` Schema Updates (`models/users/user.model.js`)
```javascript
{
  phone: { type: String, required: true, unique: true, index: true },
  countryCode: { type: String, default: "+91" },
  role: { type: Number, default: 1 },
  // Active Profile pointer (Current active candidate context)
  activeProfileId: {
    type: Schema.Types.ObjectId,
    ref: "Profile",
    default: null,
  },
  // Maximum candidate profiles per mobile account (prevents spam brokers)
  maxProfilesAllowed: {
    type: Number,
    default: 4,
    max: 6,
  },
  status: { type: String, default: "ACTIVE" }
}
```

#### 2. `Profile` Schema (`models/users/profile.model.js`)
```javascript
{
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true, // Non-unique to allow 1 User -> Many Profiles
  },
  isPrimary: { type: Boolean, default: false },
  name: { type: String, required: true, trim: true },
  profileFor: {
    type: String,
    enum: ["MYSELF", "SON", "DAUGHTER", "BROTHER", "SISTER", "FRIEND", "RELATIVE"],
    default: "MYSELF",
  },
  gender: { type: String, enum: ["MALE", "FEMALE"], required: true },
  subcaste: { type: String, default: "Amil" },
  dateOfBirth: { type: Number },
  age: { type: Number },
  identityDeduplicationHash: { type: String, index: true },
  status: { type: String, enum: ["ACTIVE", "DEACTIVATED", "HIDDEN"], default: "ACTIVE" }
}
```

#### 3. `ProfileAccessGrant` Schema (`models/users/profileAccessGrant.model.js`)
```javascript
{
  profileId: { type: Schema.Types.ObjectId, ref: "Profile", required: true },
  granteeUserId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Sister
  grantedByUserId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Brother
  accessRole: {
    type: String,
    enum: ["OWNER", "CO_MANAGER", "VIEWER"],
    default: "CO_MANAGER",
  },
  relationshipToCandidate: { type: String, default: "SELF" },
  status: { type: String, enum: ["ACTIVE", "REVOKED"], default: "ACTIVE" }
}
```

---

### API Endpoints Reference

#### 1. Fetch All Profiles Under Logged-in Account
* **Endpoint:** `GET /api/v1/auth/my-profiles`
* **Headers:** `Authorization: Bearer <token>`
* **Response:**
```json
{
  "code": "OK",
  "data": {
    "totalProfiles": 2,
    "maxProfilesAllowed": 4,
    "activeProfileId": "67b34a12c8e312a0f9000002",
    "profiles": [
      {
        "_id": "67b34a12c8e312a0f9000001",
        "name": "Rahul Advani",
        "profileFor": "MYSELF",
        "gender": "MALE",
        "subcaste": "Bhaiband",
        "isActive": false,
        "role": "OWNER"
      },
      {
        "_id": "67b34a12c8e312a0f9000002",
        "name": "Simran Advani",
        "profileFor": "SISTER",
        "gender": "FEMALE",
        "subcaste": "Bhaiband",
        "isActive": true,
        "role": "OWNER"
      }
    ]
  }
}
```

#### 2. Create Secondary Profile (Sister / Brother / Son)
* **Endpoint:** `POST /api/v1/auth/profiles`
* **Headers:** `Authorization: Bearer <token>`
* **Body:**
```json
{
  "name": "Simran Advani",
  "profileFor": "SISTER",
  "gender": "FEMALE",
  "dateOfBirth": 903052800000,
  "subcaste": "Bhaiband",
  "maritalStatus": "NEVER_MARRIED",
  "height": 165,
  "education": "MBA - Marketing",
  "occupation": "Brand Strategist",
  "annualIncome": 1200000,
  "city": "Pune",
  "state": "Maharashtra"
}
```
* **Status:** `201 Created`

#### 3. Seamless Profile Switch
* **Endpoint:** `POST /api/v1/auth/switch-profile`
* **Headers:** `Authorization: Bearer <token>`
* **Body:**
```json
{
  "targetProfileId": "67b34a12c8e312a0f9000002"
}
```
* **Response:** Returns updated JWT containing the new `activeProfileId`.

---

## 7. Frontend User Panel Implementation Plan (`sindhiMatrimonyUserPanel`)

### Components to Build & Wire:

| Component | Location | Responsibility |
| :--- | :--- | :--- |
| **`ProfileSwitcherSection`** | `src/screens/dashboardScreen/components/ProfileDropdown.tsx` | Displays current active candidate with checkmark, list of other family profiles, and switch handler. |
| **`AddMemberProfileModal`** | `src/components/modals/AddMemberProfileModal.tsx` | Clean modal popup with fields (`profileFor`, `name`, `gender`, `dob`, `subcaste`). |
| **Context Header Interceptor** | `src/redux/apiService/index.ts` | Attaches `headers['x-active-profile-id'] = currentActiveProfileId` to every outgoing API request. |
| **Chat Attributed Header** | `src/screens/chatsScreen/components/ChatHeader.tsx` | Displays Candidate avatar + `Managed by Brother (Rahul)` subtitle. |

---

## 8. Summary Checklist

- [x] **Database Model:** 1 User to Many Profiles supported without database lock-in.
- [x] **Backend Handlers:** `myProfiles`, `createSecondaryProfile`, `switchProfile` fully implemented.
- [x] **Deduplication Engine:** SHA-256 fingerprinting prevents twin registration spam.
- [x] **Access Control:** `ProfileAccessGrant` allows collaborative family co-management.
- [ ] **Frontend User Panel UI:** Profile Switcher in Dropdown + Add Profile Modal (Ready for implementation).
