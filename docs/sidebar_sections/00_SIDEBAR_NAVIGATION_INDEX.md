# 🗺️ Sindhi Matrimony Admin Portal — Sidebar Sections Master Index

Yeh documentation portal ke sidebar me maujood sabhi **21 sections** ka central navigation and architecture index hai. Har section ki alag-alag detailed `.md` file banayi gayi hai jisme screen ka complete flow, theory, features, actions aur edge-cases detailed format me explain kiye gaye hain.

> 📖 **Master Blueprint Reference:** Admin ke 3 levels, Matchmaking Exception Review, Deduplication Engine, Photo Privacy, aur 5 Production Rules ke liye refer karein: [ADMIN_OPERATIONS_AND_GOVERNANCE_ARCHITECTURE.md](../ADMIN_OPERATIONS_AND_GOVERNANCE_ARCHITECTURE.md).

---

## 📑 Sidebar Sections Master Directory

| # | Section Name | Route Path | Category | Min Role | Documentation File Link |
|---|---|---|---|---|---|
| **01** | **Dashboard** | `/` | CRM & Calling | `ANALYST`+ | [01_DASHBOARD.md](file:///Users/naman/Documents/CRM%20Landing%20Projects/Matrimony%20Project/docs/sidebar_sections/01_DASHBOARD.md) |
| **02** | **CRM Leads** | `/leads` | CRM & Calling | `CRM_AGENT`+ | [02_CRM_LEADS.md](file:///Users/naman/Documents/CRM%20Landing%20Projects/Matrimony%20Project/docs/sidebar_sections/02_CRM_LEADS.md) |
| **03** | **Team Chat** | `/chat` | Operations & Comm. | `ALL_ROLES` | [03_TEAM_CHAT.md](file:///Users/naman/Documents/CRM%20Landing%20Projects/Matrimony%20Project/docs/sidebar_sections/03_TEAM_CHAT.md) |
| **04** | **Notifications** | `/notifications` | Operations & Comm. | `ALL_ROLES` | [04_NOTIFICATIONS.md](file:///Users/naman/Documents/CRM%20Landing%20Projects/Matrimony%20Project/docs/sidebar_sections/04_NOTIFICATIONS.md) |
| **05** | **Employees & Access** | `/employees`, `/employees/:id` | Administration & Settings | `SUPER_ADMIN`, `ADMIN` | [05_EMPLOYEES_ACCESS.md](file:///Users/naman/Documents/CRM%20Landing%20Projects/Matrimony%20Project/docs/sidebar_sections/05_EMPLOYEES_ACCESS.md) |
| **06** | **Assisted Matchmaking** | `/matchmaking` | Members & Profiles | `CRM_AGENT`+ | [06_ASSISTED_MATCHMAKING.md](file:///Users/naman/Documents/CRM%20Landing%20Projects/Matrimony%20Project/docs/sidebar_sections/06_ASSISTED_MATCHMAKING.md) |
| **07** | **Match Responses** | `/match-responses` | Members & Profiles | `CRM_AGENT`+ | [07_MATCH_RESPONSES.md](file:///Users/naman/Documents/CRM%20Landing%20Projects/Matrimony%20Project/docs/sidebar_sections/07_MATCH_RESPONSES.md) |
| **08** | **Tasks & Follow-ups** | `/tasks` | CRM & Calling | `CRM_AGENT`+ | [08_TASKS_FOLLOWUPS.md](file:///Users/naman/Documents/CRM%20Landing%20Projects/Matrimony%20Project/docs/sidebar_sections/08_TASKS_FOLLOWUPS.md) |
| **09** | **Member Search** | `/members/search` | Members & Profiles | `CRM_AGENT`+ | [09_MEMBER_SEARCH.md](file:///Users/naman/Documents/CRM%20Landing%20Projects/Matrimony%20Project/docs/sidebar_sections/09_MEMBER_SEARCH.md) |
| **10** | **Payment Report (Finance)** | `/finance` | Operations & Comm. | `FINANCE_STAFF`+ | [10_PAYMENT_REPORT_FINANCE.md](file:///Users/naman/Documents/CRM%20Landing%20Projects/Matrimony%20Project/docs/sidebar_sections/10_PAYMENT_REPORT_FINANCE.md) |
| **11** | **Members Management** | `/members` (All, Paid, Inactive, Add, 360°) | Members & Profiles | `ADMIN`+, `CRM_AGENT`+ | [11_MEMBERS_MANAGEMENT.md](file:///Users/naman/Documents/CRM%20Landing%20Projects/Matrimony%20Project/docs/sidebar_sections/11_MEMBERS_MANAGEMENT.md) |
| **12** | **Verification Desk** | `/verifications` | Members & Profiles | `MODERATOR`+ | [12_VERIFICATION_DESK.md](file:///Users/naman/Documents/CRM%20Landing%20Projects/Matrimony%20Project/docs/sidebar_sections/12_VERIFICATION_DESK.md) |
| **13** | **Settings** | `/settings` (Plans, Password, Config, Gotras) | Administration & Settings | `ALL_ROLES` (Scoped) | [13_SETTINGS.md](file:///Users/naman/Documents/CRM%20Landing%20Projects/Matrimony%20Project/docs/sidebar_sections/13_SETTINGS.md) |
| **14** | **Help & Support** | `/help-support`, `/support` | Operations & Comm. | `ALL_ROLES` | [14_HELP_SUPPORT.md](file:///Users/naman/Documents/CRM%20Landing%20Projects/Matrimony%20Project/docs/sidebar_sections/14_HELP_SUPPORT.md) |
| **15** | **Admin Tools** | `/tools` | Administration & Settings | `SUPER_ADMIN`, `ADMIN` | [15_ADMIN_TOOLS.md](file:///Users/naman/Documents/CRM%20Landing%20Projects/Matrimony%20Project/docs/sidebar_sections/15_ADMIN_TOOLS.md) |
| **16** | **Master Settings** | `/master-settings` | Administration & Settings | `SUPER_ADMIN` | [16_MASTER_SETTINGS.md](file:///Users/naman/Documents/CRM%20Landing%20Projects/Matrimony%20Project/docs/sidebar_sections/16_MASTER_SETTINGS.md) |
| **17** | **Horoscope & Kundli** | `/horoscope` | Members & Profiles | `CRM_AGENT`+ | [17_HOROSCOPE_KUNDLI.md](file:///Users/naman/Documents/CRM%20Landing%20Projects/Matrimony%20Project/docs/sidebar_sections/17_HOROSCOPE_KUNDLI.md) |
| **18** | **Success Stories** | `/success-stories` | Members & Profiles | `CRM_AGENT`+ | [18_SUCCESS_STORIES.md](file:///Users/naman/Documents/CRM%20Landing%20Projects/Matrimony%20Project/docs/sidebar_sections/18_SUCCESS_STORIES.md) |
| **19** | **Reviews & Ratings** | `/reviews` | Operations & Comm. | `MODERATOR`+ | [19_REVIEWS_RATINGS.md](file:///Users/naman/Documents/CRM%20Landing%20Projects/Matrimony%20Project/docs/sidebar_sections/19_REVIEWS_RATINGS.md) |
| **20** | **Trust & Safety (Abuse Desk)** | `/safety` | Operations & Comm. | `MODERATOR`+, `CRM_MANAGER`+ | [20_TRUST_AND_SAFETY.md](file:///Users/naman/Documents/CRM%20Landing%20Projects/Matrimony%20Project/docs/sidebar_sections/20_TRUST_AND_SAFETY.md) |
| **21** | **WhatsApp Biodata Maker** | `Member 360° -> Biodata` | Members & Profiles | `ALL_ROLES` (Blind), `CRM_MANAGER`+ (Full) | [21_WHATSAPP_BIODATA_MAKER.md](file:///Users/naman/Documents/CRM%20Landing%20Projects/Matrimony%20Project/docs/sidebar_sections/21_WHATSAPP_BIODATA_MAKER.md) |

---

## 🏛️ Sidebar Structure & Layout System

### 1. Visual Design & Theme
- **Theme:** Royal Ruby Crimson (`#88131B` primary, `#C81E28` accent, slate backdrop).
- **Responsive Width:** Desktop expanded width is `16rem` (`w-64`), desktop collapsed width is `5rem` (`w-20`), mobile is animated sliding drawer with backdrop overlay (`z-50`).
- **CSS Variable Contract:** `--admin-sidebar-width` is dynamically emitted on root container (`5rem` vs `16rem`) to ensure floating widgets, fixed modal backdrops, and loaders adjust without layout shifts.

### 2. Role-Based Access Control (RBAC) Filtering
Portal sidebar menu items render dynamically based on two evaluation layers:
1. **Role Base Clearance (`canAccessRoute(role, path)`):** Checks if the employee's role meets the minimum required authority in `ROUTE_PERMISSIONS`.
2. **Granular Allowed Sections Clearance (`user.allowedSections`):** Even if an employee is `CRM_AGENT`, Super Admin can grant custom clearance to only 2 or 3 sections (e.g., only `leads` and `tasks`). The sidebar filters out all sections whose `id` is not included in `user.allowedSections`.

### 3. Submenu Accordion Engine
- **Members Submenu:** Expands to show *All Members*, *Paid Members*, *Inactive Members*, *Add Member*, *Male Profiles*, *Female Profiles*.
- **Settings Submenu:** Expands to show *Membership Plan*, *Admin Config*, *Change Password*, *Subcaste & Gotra*.
- **Auto-Expansion:** When user visits any sub-route (e.g. `/settings/gotras` or `/members/paid`), sidebar automatically highlights the active child and opens the parent accordion.

### 4. Real-time Indicators & Counters
- **Team Chat Badge:** Shows unread chat count synced with `crmDataService.getUnreadMessageCount()`.
- **Notifications Badge:** Shows unread alerts count synced with `notificationService.getUnreadCount()`.
- **Active Role Simulator:** Super Admin can simulate any employee or role directly from header/employee directory, dynamically adjusting the sidebar preview in real-time.

---

## 📂 Documentation Structure Standard
Each section file adheres to a strict 7-part architecture:
1. **Overview & Theoretical Foundation:** Purpose, domain importance, business rationale.
2. **Complete Step-by-Step Flow:** From landing, data fetching, filtering to mutations.
3. **Features & Admin Capabilities:** Comprehensive breakdown of every button, filter, table, and modal.
4. **KPI Metrics & Calculations:** Explanation of numbers, formula, and trends.
5. **RBAC & Security Clearances:** Role restrictions, record scope, data masking rules.
6. **Edge Cases & Error Handling:** Network fails, validation, empty states, concurrency.
7. **Underlying Architecture:** TypeScript models, reactive services, and storage keys.
