# 🔧 Section 15: Admin Tools & Diagnostics (`/tools`)

## 1. 📌 Overview & Theoretical Foundation (Theory)

### Business Purpose
Admin Tools & Diagnostics portal ka **engineering health monitor, maintenance console, data integrity auditor, aur emergency operations desk** hai. High-volume matrimonial platform par continuous database operations, lead assignments, aur gateway webhooks chalte rehte hain. Kabhi kabhi browser cache stale ho jati hai, search indexes ko rebuild karna padta hai, ya database integrity scan run karna padta hai taaki duplicate phone numbers ya corrupted gotra associations catch ki ja sakein. Admin Tools screen technical admins ko deep diagnostic tools provide karti hai.

### Key Conceptual Pillars
1. **Four Diagnostic Inspection Pillars:**
   - **Member Profiles Integrity:** Verifies that all profiles have valid primary IDs (`SIND001`-`SIND999`) and zero orphaned records.
   - **CRM Lead Allocation Engine:** Validates that 20-batch exclusivity locks and disposition timestamps are functioning.
   - **Duplicate Phone Number Check:** E.164 phone number sanitization and collision detection across candidate records.
   - **VoIP WebRTC Gateway:** Validates SIP trunk latency and call audio recording pipeline.
2. **Maintenance Mode Protocol:** Scheduled database upgrades ya major version releases ke dauran portal par maintenance mode activate kiya ja sakta hai jo user applications par friendly maintenance notice display karta hai.

---

## 2. 🔄 Complete Step-by-Step Flow (End-to-End Workflow)

```
[Super Admin Opens /tools]
         │
         ▼
[Mount ToolsScreen & Initialize Diagnostics]
         │
         ├─► Render System Health Diagnostics Grid (4 Cards)
         ├─► Render Real-time Network Latency Meters (DB, VoIP, SMS, CDN)
         ├─► Render Data Export & System Backup Tools
         ├─► Render Cache & Index Maintenance Controls
         └─► Render Maintenance Mode Broadcast Switch
         │
[Admin Operations]
  ├── Click "Run Integrity Scan" ──────► Triggers automated audit across all collections
  ├── Click "Ping Network Gateways" ───► Measures millisecond latencies across endpoints
  ├── Click "Export DB JSON Snapshot" ─► Downloads full serialized JSON snapshot
  ├── Click "Purge Browser Cache" ─────► Flushes local caches, clears prefetch memory
  ├── Click "Rebuild Search Indexes" ──► Re-indexes subcastes, gotras & phone numbers
  └── Toggle "Maintenance Mode" ───────► Broadcasts emergency maintenance banner
```

---

## 3. 🛠️ Features & Admin Capabilities (इस स्क्रीन में क्या-क्या कर सकते हैं)

### A. System Diagnostics & Integrity Scan
- **Run Scan Button (`RefreshCw` icon):** Runs comprehensive validation loop across profiles, leads, transactions, and employee records.
- **Diagnostic Result Cards:**
  - *Member Profiles Integrity:* Metric (e.g. `12 / 12 Valid`), Status (`OPTIMAL`), Details.
  - *CRM Lead Allocation Engine:* Metric (`35 Leads Indexed`), Status (`HEALTHY`), Details.
  - *Duplicate Phone Number Check:* Metric (`0 Collisions`), Status (`OPTIMAL`), Details.
  - *VoIP WebRTC Gateway:* Metric (`Active Trunk`), Status (`HEALTHY`), Details.

### B. Network Latencies & Ping Monitor
- Real-time latency meters in milliseconds (ms):
  - **Database Cluster:** ~6ms (Ultra-fast).
  - **VoIP Telephony Trunk:** ~44ms.
  - **SMS Gateway (OTP/Alerts):** ~68ms.
  - **CDN Assets (Photos/Media):** ~19ms.
- "Test Latencies" CTA to refresh network pings.

### C. Data Backup & Export Suite
1. **Full Database Snapshot (JSON):** Serializes all collections (Members, Leads, Calls, Employees, Settings) into a single downloadable `.json` backup file.
2. **Members Directory (CSV):** Downloads all verified member profiles as a spreadsheet.
3. **CRM Leads & Call Logs (CSV):** Downloads lead pipeline and historical call disposition logs.

### D. Cache & Index Maintenance
- **Purge Browser Cache & Memory:** Clears stored localStorage caches, revokes orphaned object URLs, and resets runtime stores.
- **Rebuild Search Indexes:** Re-generates tokenized search trie for instant candidate lookups.
- **Reset Mock Demonstration Data:** Restores all sample members, leads, and employees back to factory demo state.

### E. Emergency Maintenance Mode
- **Master Toggle Switch:** Activates or deactivates maintenance lockdown.
- **Custom Broadcast Message Input:** Editable announcement text (e.g. *"Scheduled routine maintenance in progress. The Sindhi Matrimony portal will be back online shortly."*).
- **Banner Preview:** Shows exactly how the banner will look to users on mobile and web apps.

---

## 4. 🔐 RBAC & Security Matrix

- **Allowed Roles:** `SUPER_ADMIN` and `ADMIN`.
- **Restricted from:** All junior staff (`CRM_AGENT`, `FINANCE_STAFF`, `MODERATOR`).
- **Audit Logging:** Any cache purge, index rebuild, or maintenance mode toggle is logged to the system security ledger.

---

## 5. ⚡ Edge Cases & Error Handling

1. **Accidental Demo Reset:** Reset mock records requires explicit confirmation modal to prevent accidental data loss.
2. **Maintenance Mode Lockout:** Super Admin sessions are whitelisted so administrators can still access the portal even while maintenance mode is active for general users.

---

## 6. 🔌 Associated Services & Data Entities

- **Screen Component:** `src/screens/toolsScreen/ToolsScreen.tsx`
- **Data Services:** `src/services/memberDataService.ts`, `src/services/crmDataService.ts`, `src/services/paymentDataService.ts`
- **Diagnostic Types:** `DiagnosticResult` (`title`, `category`, `status`, `metric`, `detail`)
