# 🔔 Section 04: Notifications & Alerts (`/notifications`)

## 1. 📌 Overview & Theoretical Foundation (Theory)

### Business Purpose
Notifications & Alerts portal ka **centralized nervous system & incident stream** hai. Matrimonial CRM me time-sensitive incidents lagatar hote rehte hain — jaise high-net-worth lead ka inbound registration hona, customer dwara payment settlement complete hona, SLA breach hone par lead escalation, ya security anomalies detect hona. Yeh screen sabhi events ko categorize karke display karti hai taaki admin aur staff ka reaction time minimal rahe.

### Key Conceptual Pillars
1. **Event Priority Tiers:** Alerts ko teen urgency levels me segment kiya jata hai:
   - `URGENT`: Immediate attention required (e.g. High-value lead SLA breach, payment dispute).
   - `NORMAL`: Standard operational notices (e.g. Daily settlement report, profile verification review).
   - `LOW`: Routine housekeeping & compliance audits (e.g. SSL renewal, automated backup completion).
2. **Contextual Action Links:** Notification sirf plain text nahi hoti; har notification ke saath direct deeplink aur action label (jaise *"Open Lead #LD-1099"* ya *"View Ledger"*) hota hai jo user ko 1-click me target screen par le jata hai.
3. **Synchronized Telemetry:** Unread notification count portal header aur sidebar bell icon ke saath reactive subscription ke through real-time sync rehta hai.

---

## 2. 🔄 Complete Step-by-Step Flow (End-to-End Workflow)

```
[System Event Occurs (e.g. New Payment or Lead Escalate)]
         │
         ▼
[notificationService.addNotification() Invoked]
         │
         ├─► Emits Event to Subscribers
         ├─► Header & Sidebar Bell Badge Increments (+1)
         └─► Sound / Visual Toast Dispatched
         │
[User Opens /notifications Screen]
         │
         ▼
[Mount NotificationsScreen]
         │
         ├─► Single-Pass O(N) Calculation of Counts & KPIs
         ├─► Render KPI Summary Cards (Unread, Urgent, Archived)
         ├─► Render Category Tabs (ALL, UNREAD, LEAD, PAYMENT, SYSTEM, SECURITY)
         └─► Render Search Input & Notification List
         │
[User Actions]
  ├── Click Notification Item ──────► Marks as READ & navigates to linked screen
  ├── Click Category Filter Tab ───► Filters list (e.g. only PAYMENT or LEAD alerts)
  ├── Click "Mark All as Read" ─────► Updates all records to isRead=true, zeroes badges
  ├── Click "Clear All Alerts" ─────► Purges notification history with confirmation
  ├── Click Trash Can on Item ──────► Removes single notification from local store
  └── Click "Simulate Test Alert" ──► Generates mock urgent/normal notification for testing
```

---

## 3. 🛠️ Features & Admin Capabilities (इस स्क्रीन में क्या-क्या कर सकते हैं)

### A. Notifications Page Header (`NotificationsPageHeader`)
- **Title & Description:** Central feed overview with time indicators.
- **Mark All Read Button:** Instant single-click resolution of all pending unread badges.
- **Clear All Button:** Clears all completed alerts to keep workspace clutter-free.
- **Simulate Test Alert Button:** QA & testing tool that fires sample urgent leads, payments, or security events.

### B. KPI Metrics Section (`NotificationKPISection`)
- **Unread Alerts Card:** Number of action-pending alerts currently in queue.
- **Urgent Priority Card:** High-impact escalations highlighted with Crimson red badge.
- **Archived / Resolved Card:** Handled historical notifications count.

### C. Category Filter Bar (`NotificationFilterBar`)
- **Filter Tabs:**
  - `ALL`: Complete historical alert stream.
  - `UNREAD`: Only items requiring review.
  - `LEAD`: New inbound leads, follow-up SLA alarms, lead reassignments.
  - `PAYMENT`: Membership purchases, refund approvals, ledger settlements.
  - `SYSTEM`: Database integrity notices, cache reindexing, batch cron completions.
  - `SECURITY`: Login anomalies, role updates, permission modifications.
- **Search Query Input:** Filter alerts by keyword (e.g. `#LD-1099`, `NEFT`, `Kunal Advani`).

### D. Notification Card List (`NotificationListSection`)
- Icon badge indicating category and urgency.
- Timestamp (e.g. "Just now", "10 mins ago", "2 hours ago").
- Subject title and detailed incident description.
- Interactive deep-link action button (navigates directly to target screen).
- Individual delete button (`Trash2`).

---

## 4. 📊 Notification Categories & Routing Matrix

| Category | Typical Event Trigger | Deeplink Target |
|---|---|---|
| **LEAD** | New high-value lead registered, follow-up overdue | `/leads` |
| **PAYMENT** | ₹25,000 NEFT subscription verified, refund requested | `/finance` |
| **SYSTEM** | Weekly profile backup completed, cache reindexed | `/tools` |
| **SECURITY** | Staff password changed, role permissions modified | `/employees` |

---

## 5. 🔐 RBAC & Security Matrix

- **Allowed Roles:** All authenticated roles (`SUPER_ADMIN`, `ADMIN`, `CRM_MANAGER`, `CRM_AGENT`, `FINANCE_STAFF`, `MODERATOR`).
- **Scope Filtering:** Sensitive financial and security notifications are restricted to privileged roles (`SUPER_ADMIN`, `ADMIN`, `FINANCE_MANAGER`). General staff only receives operational lead and follow-up notices.

---

## 6. ⚡ Edge Cases & Error Handling

1. **Performance at Scale (O(N) vs multiple loops):** Summary KPI counts 7 alag-alag `array.filter()` lagane ke bajaye single-pass `for` loop se calculate hoti hain, jisse hazaron notifications hone par bhi 60 FPS rendering ensure hoti hai.
2. **Orphaned Deeplinks:** Agar notification kisi aise resource ko point kare jo delete ho chuka hai, navigation fallback gracefully safe listing page par open hota hai.

---

## 7. 🔌 Associated Services & Data Entities

- **Screen Component:** `src/screens/notificationsScreen/NotificationsScreen.tsx`
- **Subcomponents:** `src/screens/notificationsScreen/component/`
- **Service:** `src/services/notificationService.ts`
- **Types:** `AppNotification` (`id`, `title`, `message`, `category`, `priority`, `timestamp`, `isRead`, `link`, `actionLabel`)
