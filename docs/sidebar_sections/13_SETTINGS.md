# ⚙️ Section 13: Settings (`/settings`)

## 1. 📌 Overview & Theoretical Foundation (Theory)

### Business Purpose
Settings portal ka **operational configuration, security governance, business catalog, aur Sindhi community master taxonomy hub** hai. Matrimonial CRM ko chalane ke liye system policies regularly calibrate karni padti hain — jaise subscription packages ki pricing badalna, staff ke credentials aur MFA password policies manage karna, portal helpline numbers update karna, aur Sindhi samaj ke 50+ Gotras, Subcastes aur Surnames ka relationship map maintain karna.

### Key Conceptual Pillars
1. **Four Specialized Management Modules:**
   - **Membership Plans (`/settings/membership-plans`):** Pricing tiers, validity days, contact views limit, chat allowances, feature toggles.
   - **Change Password (`/settings/password`):** Admin password update, current password validation, password strength analyzer, MFA security.
   - **Admin Config (`/settings?tab=admin_config`):** Operational toggles, helpline phone number, support email, auto-verification toggle, max photo uploads, watermark enforcement.
   - **Subcaste & Gotra (`/settings/gotras`):** Comprehensive Sindhi community hierarchy, Vedic lineage mappings, same-gotra marriage restriction rules, and surname associations.
2. **Deep-linking & Canonical Routing:** Har setting tab canonical route (e.g. `/settings/gotras`, `/settings/membership-plans`, `/settings/password`) ya query parameter (`/settings?tab=admin_config`) dono se access ho sakta hai, jisse sidebar submenu items direct open ho sakte hain.

---

## 2. 🔄 Complete Step-by-Step Flow (End-to-End Workflow)

```
[Admin Clicks "Settings" or Submenu Item in Sidebar]
                       │
                       ▼
[resolveSettingsTab: Resolves Active Tab from URL]
  ├── /settings/membership-plans ──► Tab: 'membership_plans'
  ├── /settings/password ─────────► Tab: 'password'
  ├── /settings?tab=admin_config ──► Tab: 'admin_config'
  └── /settings/gotras ───────────► Tab: 'gotras'
                       │
                       ▼
[RBAC Authorization Check for Tab]
  ├── canAccessRoute(effectiveRole, targetTabRoute)?
  │     ├── NO  ──► Hide tab or show 403 Permission Denied notice
  │     └── YES ──► Render corresponding memoized subcomponent
  │
[User Operations inside Tabs]
  ├── Membership Plans: Edit price, validity days, features -> Save to store
  ├── Change Password: Enter current, new, confirm -> Validate complexity -> Update
  ├── Admin Config: Update helpline, toggle watermarking -> Save portal config
  └── Subcaste & Gotra: Add new Gotra, map to Subcaste, toggle exogamy prohibition
```

---

## 3. 🛠️ Sub-Modules & Admin Capabilities

### Tab 1: Membership Plans (`MembershipPlansSection.tsx`)
- **Plan Cards Overview:** Free, Silver, Gold, Platinum, Diamond, Till Marriage VIP.
- **Configurable Parameters per Plan:**
  - Plan Title & Display Name.
  - Price in INR (`₹`) & Discounted offer price.
  - Duration in Days (e.g. 30, 90, 180, 365, Unlimited).
  - Contact Views Quota (e.g. 25, 75, 200, Unlimited).
  - Feature Toggles (Chat enabled, Dedicated Matchmaker assigned, WhatsApp alert notifications, Horoscope Kundli matching included).
  - "Popular" or "VIP" Badge highlight toggle.

### Tab 2: Change Password (`ChangePasswordScreen.tsx`)
- Current Password Verification input with show/hide eye toggle.
- New Password Input with live Password Strength Indicator (Length, Uppercase, Numbers, Special characters).
- Confirm Password matching validation.
- Password Guidelines checklist (Minimum 8 chars, mixed case, non-repeating).
- Security Logout on Reset option.

### Tab 3: Admin Config (`AdminConfigSection.tsx`)
- **Portal Communication Channels & General Policies:**
  - Official Support Helpline (`+91 98765 43210`).
  - Helpdesk Email (`support@sindhimatrimony.com`).
  - Headquarters City (`Mumbai / Ahmedabad`).
  - OTP Mobile Verification toggle.
  - Auto-Approve Candidate Profiles toggle.
  - System Maintenance Mode broadcast.
- **Religions Master Management (धर्म प्रबंधन):**
  - Super Admin managed centralized religion directory (Hindu, Sikh, Jain, Buddhist, Christian, Other).
  - Add, edit, toggle active status, and delete religions with foreign key protection (cannot delete if castes are mapped).
  - Directly dictates which religions appear on user registration and mobile app.
- **Castes & Communities Master Management (जाति एवं समुदाय प्रबंधन):**
  - Super Admin managed centralized caste directory (Sindhi Lohana, Sindhi Amil, Sindhi Bhaibhand, Sindhi Sahiti, Sindhi Brahmin, Sindhi Bhatia, Sindhi Chhapru, etc.).
  - Mapped directly to parent religion.
  - Add new caste, edit details, toggle active/inactive status, and delete.
  - Filter by parent religion with real-time search.
  - Directly controls caste selection options across user panel, Add Member wizard, and Edit Profile modal.

### Tab 4: Subcaste & Gotra Master Desk (`SubcasteGotraSection.tsx` & `subcasteGotraService.ts`)
- **Sindhi Subcastes Master:**
  - Master list: *Amil*, *Baibhand*, *Sahiti*, *Larkana*, *Shikarpuri*, *Sakhar*, *Dadu*, *Thattai*, *Kutchi Sindhi*, *Bhatia*, *Sindi Brahmin*.
  - Add / Edit Subcaste: Name, Historical Sindh Region, Description, Priority Weight.
- **Gotras Master Directory:**
  - Vedic Clans: *Kashyap*, *Vashishta*, *Bharadwaj*, *Gautam*, *Sandilya*, *Agastya*, *Parashar*, *Vishwamitra*, etc.
  - Vedic Seer Lineage & Alternate spellings.
  - **Same-Gotra Marriage Restriction (`prohibitedSameGotra`):** Strict Hindu Vedic exogamy rule toggle.
  - Subcaste Mapping: Multiple Gotras can be mapped to specific subcastes.
- **Surnames Association Master:**
  - Sindhi Surnames ending in *-ani* (e.g. *Advani, Advani, Chandnani, Gurnani, Khemlani, Ramani*) associated with root Gotras.

---

## 5. 🔐 RBAC & Security Matrix

- **Membership Plans:** `SUPER_ADMIN`, `ADMIN`, `FINANCE_MANAGER`.
- **Change Password:** `ALL_ROLES` (Every employee can update their own personal password).
- **Admin Config:** `SUPER_ADMIN`, `ADMIN`.
- **Subcaste & Gotra Master:** `SUPER_ADMIN`, `ADMIN`.

---

## 6. ⚡ Edge Cases & Error Handling

1. **Weak Password Rejection:** Passwords shorter than 8 characters or lacking numbers/symbols cannot be submitted.
2. **Same Current and New Password:** Form blocks setting a new password identical to the current one.
3. **Orphaned Gotra Association:** Deleting a Gotra that is currently assigned to active member profiles triggers a safety warning prompt.

---

## 7. 🔌 Associated Services & Data Entities

- **Screen Components:**
  - `src/screens/settingsScreen/SettingsScreen.tsx`
  - `src/screens/settingsScreen/components/membershipPlans/`
  - `src/screens/settingsScreen/components/AdminConfigSection.tsx`
  - `src/screens/settingsScreen/ChangePasswordScreen.tsx`
  - `src/screens/settingsScreen/components/SubcasteGotraSection.tsx`
  - `src/screens/settingsScreen/SubcasteGotraScreen.tsx`
- **Data Services:** `src/services/subcasteGotraService.ts`, `src/services/memberDataService.ts`
- **RBAC Validator:** `src/utils/rbac.ts` (`canAccessRoute`)
