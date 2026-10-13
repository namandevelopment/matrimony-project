# 👥 Section 11: Members Management (`/members`)

## 1. 📌 Overview & Theoretical Foundation (Theory)

### Business Purpose
Members Management portal ka **core customer repository and matrimonial biodata lifecycle management suite** hai. Yeh module un sabhi Sindhi candidates ko manage karta hai jo platform par register ho chuke hain — chahe unka registration self-service mobile app se hua ho ya relationship manager dwara office me kiya gaya ho. Module me All Members, Paid VIP Members, Inactive/Suspended Members, 7-Step Add Member Registration Wizard, aur Comprehensive 360° Profile Details Desk shamil hain.

### Key Conceptual Pillars
1. **Submenu Hierarchy & Views:**
   - **All Members (`/members`):** Complete master member roster with filters and export.
   - **Paid Members (`/members/paid`):** Active paying subscribers with assisted allotment management.
   - **Inactive Members (`/members/inactive`):** Deactivated, banned, suspended, or draft accounts with one-click reactivation.
   - **Add Member (`/members/add`):** Comprehensive 7-step wizard to create complete profiles with family, astrological, and partner preferences.
   - **Profile Details 360° (`/members/profile/:id`):** Complete dossier, photo gallery, offline payment recording, password reveal, and status management.
   - **Gender Fast-Toggles:** `/members?gender=male` (Grooms) & `/members?gender=female` (Brides).
2. **Assisted Allotments Protocol (आवंटित रिश्ते):** Paid members ko unke package ke hisaab se human matchmaker assign kiya jata hai jo unhe tailored candidate profiles allot karta hai.

---

## 2. 🔄 Complete Step-by-Step Flow (End-to-End Workflow)

```
[Admin / Matchmaker Expands "Members" in Sidebar]
         │
         ├─► [1. All Members (/members)]
         │     ├── Filter by Subcaste, Plan Tier, Gender
         │     ├── Search by Name, ID, Mobile, City
         │     └── Click Profile Name ──► Opens Profile Details 360°
         │
         ├─► [2. Paid Members (/members/paid)]
         │     ├── Filter by Plan (Silver, Gold, Platinum, Till Marriage)
         │     ├── Click "View Allotted" ──► Opens AllottedMembersModal
         │     └── Click "Download Excel" ──► Exports paid subscribers backup
         │
         ├─► [3. Inactive Members (/members/inactive)]
         │     ├── Filter by Inactivity Status (Suspended, Inactive, Banned)
         │     ├── Click "Reactivate" ──► Restores account status to ACTIVE
         │     └── Click "Delete" ──────► ReasonModal -> Soft deletes profile
         │
         ├─► [4. Add Member (/members/add)]
         │     └── 7-Step Registration Wizard:
         │           Step 1: General Info (Name, Gender, DOB, Subcaste, Contact)
         │           Step 2: Family Info (Parents, Occupation, Living type)
         │           Step 3: Lifestyle (Height, Diet, Habits)
         │           Step 4: Education & Work (Degree, Profession, Income)
         │           Step 5: Astrological (Gotra, Manglik, Kundli details)
         │           Step 6: Images (Profile photo & photo album)
         │           Step 7: Other Info (Partner preferences, Initial Plan)
         │           └── Submit ──► Generates Unique ID, redirects to Profile
         │
         └─► [5. Profile Details 360° (/members/profile/:id)]
               ├── View Complete Biodata Tabs (Personal, Family, Career, Horoscope)
               ├── Edit Profile Modal (Multi-tab granular editor)
               ├── Record Manual Payment (Offline UPI/Cash -> Upgrades Plan & updates Ledger)
               ├── Toggle Account Status (Activate, Deactivate, Ban with reason)
               └── Reveal / Reset Password (For customer support assistance)
```

---

## 3. 🛠️ Sub-Screen Features & Admin Capabilities

### Sub-Screen A: All Members Directory (`MembersScreen.tsx`)
- **Interactive DataTable:**
  - Profile ID & Member Name (Clickable link).
  - Gender & Age (e.g. *Groom (28 yrs)* / *Bride (25 yrs)*).
  - Sindhi Subcaste badge.
  - City / Location.
  - Plan Tier badge with visual crown icon.
  - Verification badge (`ShieldCheck`).
  - Action buttons: View Drawer and External Link.
- **Filter Controls:** Filter by Subcaste, Plan Tier, Gender query parameter.
- **CSV Export:** One-click export of current filtered member directory.

### Sub-Screen B: Paid Members Desk (`PaidMembersScreen.tsx`)
- **Subscription Overview:** Highlights active paying subscribers.
- **Plan Filter:** Filter by `SILVER`, `GOLD`, `PLATINUM`, `TILL_MARRIAGE`.
- **Allotted Members Modal (`AllottedMembersModal`):**
  - Shows which prospective profiles have been allotted to this paid member by the matchmaking team.
  - Review allotment statuses: *Proposed*, *Contact Shared*, *Meeting Fixed*.
- **Download Paid Members Excel:** Exports financial subscription roster with validity expiry dates.

### Sub-Screen C: Inactive Members Desk (`InactiveMembersScreen.tsx`)
- **Status Filter:** Filter by `INACTIVE`, `SUSPENDED`, `BANNED`.
- **Reactivate Member CTA (`handleActivate`):** Restores account to active status with instant toast feedback.
- **Permanent / Soft Delete CTA:** Triggers `ReasonModal` requiring deletion rationale before purging record.
- **Reason Tooltip:** Displays why the profile was originally suspended (e.g. *Incorrect age documentation*, *Disputed marital status*).

### Sub-Screen D: Add Member Wizard (`AddMemberScreen.tsx`)
- **Step 1 — General Info:** Unique ID, Official Email, Temporary Password, Full Name, Mobile Number, Profile Created By (Self, Parents, Sibling), Gender, Date of Birth, Marital Status (Never Married, Divorced, Widowed), Mother Tongue, Religion, Community, Subcaste, City, State, Country.
- **Step 2 — Family Info:** Father's Name & Occupation, Mother's Name & Occupation, Family Structure (Nuclear vs Joint), Living arrangements, Number of Brothers & Sisters, Family Values description.
- **Step 3 — Lifestyle:** Height, Weight, Body Type, Complexion, Blood Group, Dietary Habits (Vegetarian, Non-Veg), Smoking & Drinking habits.
- **Step 4 — Education & Work:** Highest Education Level, Degree, College/University, Employment Sector (Corporate, Business, Govt, Self-Employed), Designation, Company Name, Annual Income Bracket (e.g. ₹15-25 LPA).
- **Step 5 — Astrological Info:** Sindhi Gotra selection, Manglik status (Yes, No, Anshik/Partial), Time of Birth, Place of Birth, Nakshatra, Rashi.
- **Step 6 — Images & Album:** Profile photo upload with primary photo badge, multi-photo album gallery preview.
- **Step 7 — Other Info & Partner Preferences:** Preferred Age Range, Preferred Height Range, Subcastes Accepted, Education expectations, Membership Plan allotment (Free, Silver, Gold, Platinum).
- **Validation Engine:** Validates required fields, E.164 phone formats, email patterns, and XSS sanitization before submission.

### Sub-Screen E: Profile Details 360° (`ProfileDetailsByIdScreen.tsx`)
- **Header Actions:** Back arrow, Download Biodata PDF, Edit Profile, Record Manual Payment, Change Account Status.
- **Summary Header Card:** Profile avatar, Verification badge, Full Name, Age, Marital status, Subcaste, City, Member ID, and Plan Tier.
- **Tabbed Dossier Content:**
  - *Personal & Contact:* Mobile (with copy CTA), Email, Alternate numbers, Full residential address.
  - *Career & Education:* Degree, College, Company, Designation, Annual Income.
  - *Family Background:* Parents, Siblings, Family status, Native ancestral city in Sindh/India.
  - *Astrology & Religion:* Gotra, Manglik status, Horoscope charts.
  - *Partner Preferences:* Comprehensive wishlist for expected life partner.
  - *Photo Gallery:* High-resolution photo viewer with primary image toggle.
- **Manual Payment / Upgrade Tool:**
  - Direct offline payment entry: Amount, Plan Tier, Payment Mode (UPI, NetBanking, Cash), Gateway, and Receipt Number.
  - Submitting automatically upgrades member's plan and creates transaction record in Finance Ledger.
- **Password Reveal Tool:** Admin can view or regenerate temporary password for customer login assistance.

---

## 4. 📊 Membership Tiers & Allotment Quotas

| Plan Tier | Price | Validity | Contact Views | Matchmaker Assistance |
|---|---|---|---|---|
| **FREE** | ₹0 | 30 Days | 5 Profiles | Self-Service |
| **SILVER** | ₹999 | 90 Days | 25 Profiles | Standard |
| **GOLD** | ₹2,999 | 180 Days | 75 Profiles | Priority Matchmaker |
| **PLATINUM** | ₹5,999 | 365 Days | 200 Profiles | Dedicated Relationship Manager |
| **TILL MARRIAGE** | ₹85,000 | Unlimited | Unlimited | VIP Matchmaking till Wedding |

---

## 5. 🔐 RBAC & Security Matrix

- **Allowed Roles:** `SUPER_ADMIN`, `ADMIN`, `CRM_MANAGER`, `CRM_AGENT`.
- **Sensitive Fields:** Passwords are never stored in plain text in production; phone numbers are subject to masking rules.
- **Deletion Authority:** Only `SUPER_ADMIN` and `ADMIN` can permanently delete a profile.

---

## 6. ⚡ Edge Cases & Error Handling

1. **Duplicate Unique ID:** System checks that unique profile codes (`SIND001`) remain collision-free.
2. **Gotra-Subcaste Validation:** Form ensures that the selected Gotra is historically aligned with the selected Subcaste based on `subcasteGotraService` records.
3. **Invalid Photos:** Upload validator rejects non-image formats or files exceeding size thresholds.

---

## 7. 🔌 Associated Services & Data Entities

- **Screen Components:**
  - `src/screens/membersScreen/MembersScreen.tsx`
  - `src/screens/membersScreen/PaidMembersScreen.tsx`
  - `src/screens/membersScreen/InactiveMembersScreen.tsx`
  - `src/screens/membersScreen/AddMemberScreen.tsx`
  - `src/screens/membersScreen/ProfileDetailsByIdScreen.tsx`
- **Data Service:** `src/services/memberDataService.ts`
- **Subcaste Service:** `src/services/subcasteGotraService.ts`
- **Payment Service:** `src/services/paymentDataService.ts`
