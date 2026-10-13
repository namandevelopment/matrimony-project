# 📊 Section 01: Dashboard (`/`)

## 1. 📌 Overview & Theoretical Foundation (Theory)

### Business Purpose
Dashboard portal ka central **mission control** aur high-level telemetry center hai. Matrimony business me daily operational health monitor karna critical hota hai — jaise kitne naye Sindhi candidates register huye, male vs female ratio kya hai, paid subscriptions se kitna revenue collect hua, kitne profiles inactive ya pending verification hain, aur overall customer pipeline kaisa perform kar rahi hai.

### Key Conceptual Pillars
1. **Executive Telemetry:** Super Admin aur Operations Managers ko instant snapshot provide karta hai bina detailed sub-screens me drill kiye.
2. **Gender Ratio Equilibrium:** Matrimonial platform ki success male aur female verified profiles ke swasth ratio par depend karti hai. Dashboard male vs female profiles ko upfront track karta hai.
3. **Revenue & Plan Penetration:** Active paid members aur unke subscription tiers (Silver, Gold, Platinum) ka real-time distribution dikhata hai.
4. **Data Security & Snapshot Integrity:** Quick CSV backup export trigger allow karta hai taaki critical profile records locally safeguard kiye ja sakein.

---

## 2. 🔄 Complete Step-by-Step Flow (End-to-End Workflow)

```
[Admin Logs In / Visits "/"]
         │
         ▼
[RBAC Verification: Can role access "/"?]
  ├── NO  ──► Auto-redirect to first accessible route (e.g. /leads or /tasks)
  └── YES ──► Prefetch all screen chunks in background (prefetchScreens)
         │
         ▼
[Mount DashboardScreen & Performance Tracker]
         │
         ├─► Render Hero Welcome Banner ("Welcome Back, Admin")
         ├─► Compute & Render 8 KPI Metric Cards
         ├─► Render Analytics Visualizations (Overview Bar Chart & Plan Donut)
         └─► Render Recent Member Registrations Table (Latest 5 profiles)
         │
[User Interactions]
  ├── Click "+ Add Member" ──────► Navigate directly to /members
  ├── Click "Export Backup" ─────► Async CSV Generator (Progress Banner -> Download Trigger -> Toast)
  ├── Click any KPI Stat Card ───► Smart Route Dispatcher (/finance or /members)
  └── Click Table Profile ───────► Open User Profile 360° Drawer / Modal
```

### Detailed Steps:
1. **Landing & Initialization:** Component mount hone par `usePerformanceTracker('DashboardScreen')` render cycles aur FPS register karta hai.
2. **Background Prefetching:** `prefetchScreens()` background timer ke through baaki sabhi routes ke bundle chunks prefetch kar leta hai taaki user kisi bhi agle sidebar item par click kare toh page zero-latency load ho.
3. **Hero Banner Actions:** Admin hero banner me total registered members (`39,434`) aur quick action buttons dekhta hai.
4. **KPI Interactions:** User kisi bhi KPI card par click karke direct target screen me enter karta hai:
   - *Total Revenue* ya *Membership Plans* par click karne par `/finance` khulta hai.
   - *Total Members*, *Male Profiles*, *Female Profiles*, *Inactive* par click karne par `/members` khulta hai.
   - *Export CSV Backup* card par click karne par automated CSV download fire hota hai.
5. **Recent Registrations Inspection:** Recent 5 entries ki table me profile status, profession, join date, aur member names inspect kiye ja sakte hain.

---

## 3. 🛠️ Features & Admin Capabilities (इस स्क्रीन में क्या-क्या कर सकते हैं)

### A. Hero Welcome Banner (`DashboardHeroBanner`)
- **Royal Ruby Gradient:** Visual branding with welcome greeting aur current active employee name.
- **Total Members Badge:** Live count (`39,434 Profiles`).
- **Quick Add Member Button:** Direct router shortcut to `/members`.
- **Export CSV Button:** On-demand backup generation button.

### B. 8 KPI Metric Cards Grid (`KPIGrid`)
1. **Total Registered Members:** 39,434 total Sindhi profiles.
2. **Active Male Profiles (Grooms):** Verified groom count with percentage proportion.
3. **Active Female Profiles (Brides):** Verified bride count.
4. **Inactive Profiles:** Profiles deactivated, banned, ya pending manual phone verification.
5. **Total Revenue Collected:** Overall collections (`₹18.42 Lakhs`) with direct link to Finance.
6. **Active Membership Plans:** Breakdown of Silver/Gold/Platinum subscribers.
7. **Matrimonial Blogs / Success Stories:** Published stories engaging community members.
8. **Export CSV Backup Card:** Interactive trigger for offline system backups.

### C. Analytics & Charts Section (`DashboardChartsSection`)
- **Monthly Registrations Bar Chart:** Month-on-month registration volume trends comparing male vs female additions.
- **Subscription Tier Distribution Donut:** Visual breakdown of Free vs Silver vs Gold vs Platinum vs Till Marriage VIP plans.

### D. Recent Registrations Table (`RecentRegistrationsTable`)
- Displays serial number, member name, profession/qualification, email address, joined timestamp, and status badge (`Active` / `Pending`).
- Hover effects with Crimson accenting for fast visual scanning.

### E. Async CSV Backup Utility (`handleExportCsv`)
- Emits progress notification banner (`ExportNoticeBanner`) and toast notification.
- Constructs formatted CSV blob with UTF-8 encoding.
- Auto-triggers browser download (`sindhi-members-export-<timestamp>.csv`).
- Automatically clears background timers on unmount to eliminate memory leaks.

---

## 4. 📊 KPI Cards & Logic Calculations

| KPI Metric Card | Data Source / Logic | Target Click Destination |
|---|---|---|
| **Total Members** | Aggregated count of all non-deleted member records | `/members` |
| **Grooms (Male)** | Filter `gender === 'Male'` from active member pool | `/members?gender=male` |
| **Brides (Female)** | Filter `gender === 'Female'` from active member pool | `/members?gender=female` |
| **Inactive Profiles** | Filter `status !== 'ACTIVE'` (Banned, Suspended, Inactive) | `/members/inactive` |
| **Total Revenue** | Sum of all approved transactions in payment ledger | `/finance` |
| **Membership Plans** | Total active paid memberships active across tiers | `/finance` or `/settings/membership-plans` |
| **Success Stories** | Published verified weddings & community testimonials | Content Management |
| **Backup Trigger** | Client-side CSV generation & export | Auto-download CSV file |

---

## 5. 🔐 RBAC & Security Matrix

- **Minimum Access Role:** `ANALYST`, `CRM_AGENT`, `FINANCE_STAFF`, `ADMIN`, `SUPER_ADMIN`.
- **Access Rule:** Accessible to all authenticated staff who have `'dashboard'` in their `user.allowedSections`.
- **Fallback Behavior:** Agar kisi restricted employee (jaise specific junior caller) ke permissions me `'dashboard'` uncheck hai, toh `AdminLayout` use automatically pehle allowed module (jaise `/leads`) par replace-navigate kar deta hai.

---

## 6. ⚡ Edge Cases & Error Handling

1. **Slow Network / Lazy Chunks:** `prefetchScreens` ensure karta hai ki Dashboard chunks warmup ho jayein; agar lazy-load delay ho toh `Suspense` with Royal Ruby spinner smoothly display hota hai.
2. **Double Clicks on CSV Export:** `exportTimerRef` previous timer ko `clearTimeout` karke debounced single-download guarantee karta hai.
3. **Unmount Safety:** Component unmount hone par timer clean up ho jata hai taaki orphaned setState call na ho.

---

## 7. 🔌 Associated Services & Data Entities

- **Screen Component:** `src/screens/dashboardScreen/DashboardScreen.tsx`
- **Subcomponents:**
  - `src/screens/dashboardScreen/component/DashboardHeroBanner.tsx`
  - `src/screens/dashboardScreen/component/KPIGrid.tsx`
  - `src/screens/dashboardScreen/component/DashboardChartsSection.tsx`
  - `src/screens/dashboardScreen/component/RecentRegistrationsTable.tsx`
  - `src/screens/dashboardScreen/component/ExportNoticeBanner.tsx`
- **Hooks & Utilities:** `usePerformanceTracker`, `memoWithDeepEqual`, `toastMessage/toast`
