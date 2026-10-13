# 🔍 Section 09: Member Search (`/members/search`)

## 1. 📌 Overview & Theoretical Foundation (Theory)

### Business Purpose
Member Search screen staff aur matchmakers ke liye **fast retrieval and profile discovery search engine** hai. Jab koi parent call par aata hai aur bolta hai: *"Hamare bete ke liye Mumbai me rehne wali Amil subcaste ki Chartered Accountant ladki chahiye,"* matchmaker ko bina poora directory browse kiye seconds me matching verified profiles dhundhni hoti hain. Member Search screen ultra-fast multi-parameter querying allow karti hai.

### Key Conceptual Pillars
1. **Multi-Field Instant Indexing:** Search engine ek saath candidate ke Full Name, Unique Member ID (`SIND001` ya `SM-2026-9081`), Mobile Number, City, Subcaste, aur Occupation me query run karta hai.
2. **Cultural Dimension Filtering:** Sindhi community ke specific criteria (Subcaste, Gotra compatibility, Vegetarian diet, Education tier) ke hisaab se instant filter chips provide karta hai.
3. **Verified Profiles Prioritization:** Search results me KYC verified aur photo-verified profiles ko top ranking di jaati hai taaki telecaller confident proposals pitch kar sake.

---

## 2. 🔄 Complete Step-by-Step Flow (End-to-End Workflow)

```
[Staff Navigates to /members/search]
         │
         ▼
[Mount Search View & Load memberDataService Pool]
         │
         ├─► Render Global Search Input (Auto-focused)
         ├─► Render Filter Dropdowns (Subcaste, Plan Tier, Gender)
         └─► Render Results Counter Badge & Action Buttons
         │
[User Enters Query or Adjusts Filters]
         │
         ├─► Instant Client-Side Reactive Search (No page reload)
         ├─► Multi-Column Filtering (Gender, Subcaste, Plan, City)
         └─► Render Matrimonial Profiles DataTable
         │
[Actions on Search Results]
  ├── Click Member Name / ID ──────► Opens Full User Profile Modal Drawer
  ├── Click "Profile 360°" Link ───► Navigates to /members/profile/:id
  └── Click "Export to CSV" ───────► Downloads filtered search results to CSV
```

---

## 3. 🛠️ Features & Admin Capabilities (इस स्क्रीन में क्या-क्या कर सकते हैं)

### A. Universal Search Input
- Instant debounced search bar.
- Supports inputting partial names (e.g. "Karan"), partial phone numbers (e.g. "98200"), city (e.g. "Pune"), or unique profile codes (e.g. "SIND005").

### B. Filter Dimension Controls
- **Subcaste Filter Dropdown:** Select from all registered Sindhi subcastes (Amil, Baibhand, Sahiti, Larkana, Shikarpuri, Sakhar, Dadu, etc.) populated dynamically from `subcasteGotraService`.
- **Plan Tier Filter:** All Plans, Free, Silver, Gold, Platinum, Till Marriage.
- **Gender Toggle:** Male (Grooms) vs Female (Brides) toggle buttons.

### C. Search Results Table
- **Profile ID & Candidate Name:** Clickable hyperlink opening full dossier.
- **Gender & Age:** Age in years, Bride vs Groom indicator.
- **Sindhi Subcaste:** Highlighted subcaste tag.
- **Location:** City and State.
- **Membership Tier Badge:** Styled badge with Crown icon for Platinum/VIP members.
- **Verification Status:** Green `Verified` badge with ShieldCheck icon.
- **Action Buttons:** Quick preview drawer and external link to full edit page.

### D. Export Filtered Pool Tool
- Downloads current active search subset as CSV file (`members_directory.csv`) for offline review during community matrimonial meets.

---

## 4. 📊 Search Performance & Indexing Logic

- **Client-Side Latency:** Sub-millisecond response time (< 5ms) across thousands of active records using memoized multi-predicate filters (`useMemo`).
- **Sanitization:** Case-insensitive trimming prevents leading/trailing whitespace errors.

---

## 5. 🔐 RBAC & Security Matrix

- **Allowed Roles:** `SUPER_ADMIN`, `ADMIN`, `CRM_MANAGER`, `CRM_AGENT`, `MODERATOR`.
- **Phone Privacy:** Junior callers see partial masked numbers until explicit profile engagement is initiated.

---

## 6. ⚡ Edge Cases & Error Handling

1. **Zero Results Found:** Displays friendly empty state: *"No matching Sindhi profiles found for query — try clearing filters or broadening search criteria."*
2. **Special Characters in Search:** Query sanitizer regex injection prevent karta hai.

---

## 7. 🔌 Associated Services & Data Entities

- **Screen Component:** `src/screens/membersScreen/MembersScreen.tsx`
- **Data Service:** `src/services/memberDataService.ts` (`getMembers`, `exportMembersCSV`)
- **Subcaste Service:** `src/services/subcasteGotraService.ts`
- **Global Modal Context:** `useGlobalModal().openUserProfile`
