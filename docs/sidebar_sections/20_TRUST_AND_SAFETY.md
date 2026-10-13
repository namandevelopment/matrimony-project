# 🛡️ Section 20: Trust & Safety / Abuse Moderation Desk (`/safety`)

## 1. 📌 Overview & Theoretical Foundation (Theory)

### Business Purpose
Matrimonial platforms par authenticity, safety aur member trust sabse bada critical asset hota hai. Serious rishton ke platform par fake accounts, romance scams, financial fraud ("Asking for money / Emergency Hospital Loan"), stalking aur abusive behavior se platform ki reputation aur user safety par seedha threat hota hai.
**Trust & Safety / Abuse Moderation Desk (`/safety`)** platform ka digital policing and dispute adjudication desk hai, jahan administrators member reports, chats, call logs, verified identity credentials aur hardware telemetry inspect karke decisive **1-Click Actions** lete hain:
1. **Warning Nudge:** Account standard violate karne par formal warning push notification aur flag.
2. **7-Day Shadow Freeze:** Suspect member matchmaking search, recommendations aur chat messages se 7 dino ke liye invisible ho jata hai.
3. **Permanent Blacklist (Phone + Aadhaar + Device ID):** Multi-factor permanent blacklisting jo candidate ka Phone number, 12-digit Aadhaar hash aur Device ID hardware fingerprint teeno ko block list me lock kar deta hai taaki wo new phone ya sim se bhi account na bana sake.

### Key Conceptual Pillars
1. **Evidence-Based Adjudication:** Admin arbitrary action nahi leta; reporter aur suspect dono ki cross-examination, chat transcripts, aur RM/telephony call notes dekh kar decision leta hai.
2. **Multi-Vector Blacklist Vault:** Sim badalna ya phone number change karna aam baat hai. Platform device hardware signature aur Aadhaar hash ko bhi blacklisting layer me bind karta hai.
3. **Automatic Collateral Cleanup:** Blacklist hone par suspect ke sabhi active matchmaking proposals terminate aur status `CLOSED` kar diye jaate hain, aur candidate status `BLACKLISTED` mark hota hai.

---

## 2. 🔄 Complete Step-by-Step Flow (End-to-End Workflow)

```
[Member Reports Another User on Mobile App / Web]
  ("Asking for money", "Fake profile", "Misbehavior on call", etc.)
                         │
                         ▼
[Queued in Abuse Moderation Desk (/safety)]
  - Priority auto-calculated (Extortion = CRITICAL, Misbehavior = HIGH)
  - Telephony logs & Chat transcript snippets auto-attached
                         │
                         ▼
[Admin Opens /safety — Active Grievances Tab]
  - Reviews 4 Key Metric KPIs (Open Complaints, Critical Extortion, Shadow Frozen, Vault Count)
  - Filters by Status (All, Open, In Review, Resolved) or Reason
                         │
                         ▼
[Admin Inspects Evidence Card]
  ├── Reporter Metadata (Name, Profile ID, Trust Badge)
  ├── Suspect Metadata (Name, Phone, Aadhaar Hash, Device Fingerprint)
  ├── Chat Snippet Evidence Box
  └── Telephony / Audio Call Log Notes
                         │
                         ▼
[Admin Takes 1-Click Action]
  ├── 1. "Warning Nudge" (Yellow)
  │      └─► Formal Warning logged, push alert sent, status set to WARNED
  │
  ├── 2. "7-Day Shadow Freeze" (Orange)
  │      └─► Suspect masked from search & recommendations for 7 days
  │
  ├── 3. "Permanent Blacklist" (Crimson)
  │      ├─► Opens Confirmation Modal with Mandatory Reason Input
  │      ├─► Locks Phone, Aadhaar Hash & Device ID in Blacklist Vault
  │      ├─► Immediate Match Pairing Termination (Status: CLOSED)
  │      └─► Account Status set to BLACKLISTED
  │
  └── 4. "Dismiss" (Gray)
         └─► False complaint marked dismissed with audit log note
```

---

## 3. 🛠️ Features & Admin Capabilities (इस स्क्रीन में क्या-क्या कर सकते हैं)

### A. Real-Time KPI Cards (Top Bar)
1. **Open Complaints:** Total unresolved disputes awaiting moderator decision.
2. **Critical Extortion:** High-risk financial scam reports requiring under-15-minute SLA intervention.
3. **Shadow Frozen:** Currently restricted members under 7-day algorithmic shadow silence.
4. **Blacklist Vault:** Total multi-vector banned identities permanently locked out of the ecosystem.

### B. Two-Tab Operations System
- **Tab 1: Active Grievances (`Grievances`):** Interactive queue of pending dispute cards with inline evidence viewer and action triggers.
- **Tab 2: Blacklist Vault (`Vault`):** Searchable table of permanently blocked records, exhibiting Phone, Aadhaar Hash, Device ID, Blacklist Timestamp, Action Taken By, and 1-Click "Unblock / Restore" override.

### C. Rich Evidence Cards
- **Reporter vs Suspect Dossier:** Comparative badges showing Member IDs, Phone Numbers, Verification Shields, and Device hashes.
- **Report Categorization Badges:** Color-coded tags for `ASKING_MONEY` (Red), `FAKE_PROFILE` (Orange), `CALL_MISBEHAVIOR` (Yellow), `MARRIED_CLAIMING_SINGLE` (Purple), and `HARASSMENT` (Rose).
- **Incident Severity:** `CRITICAL`, `HIGH`, `MEDIUM`, `LOW`.
- **Evidence Snapshot:** Actual chat snippet extracted from in-app messaging context.
- **Call Telephony Notes:** Timestamped notes from IVR / Relationship Manager phone interaction logs.

### D. 1-Click Action Modal & Enforcement
- Clicking **Warning Nudge**, **Shadow Freeze**, or **Permanent Blacklist** launches a dedicated confirmation modal.
- Admin must enter internal reasoning / regulatory justification note.
- Automatic toast notifications provide instant operational feedback.

---

## 4. 📊 Action Decision Matrix

| Violation Type | Severity | Recommended Admin Action | System Impact |
|---|---|---|---|
| **Asking for Money / Extortion** | CRITICAL | Permanent Blacklist | Phone, Aadhaar & Device Hash banned; matchings terminated; police dossier ready |
| **Fake Profile / Photo Stolen** | HIGH | 7-Day Shadow Freeze / Blacklist | Photos de-indexed; forced re-verification; hidden from search |
| **Misbehavior on Audio Call** | HIGH | Warning Nudge / Freeze | Warning banner on dashboard; 2nd strike results in permanent ban |
| **Married Claiming Single** | CRITICAL | Permanent Blacklist | Profile flagged `BLACKLISTED`; marital verification notice saved |
| **Minor Profile Inaccuracy** | LOW | Warning Nudge | Prompt to update bio or age documentation |

---

## 5. 🔐 RBAC & Security Clearances

- **Allowed Roles:** `SUPER_ADMIN`, `ADMIN`, `MODERATOR`, `CRM_MANAGER`.
- **Restricted from Access:** Standard `CRM_AGENT`, `FINANCE_STAFF`, `ANALYST` (Sensitive chats and hardware hashes masked for general calling staff).
- **Audit Immutability:** Any action taken (Freeze/Blacklist) is permanently written to the candidate's CRM timeline history with the operator's ID and timestamp.

---

## 6. ⚡ Edge Cases & Error Handling

1. **Simultaneous Moderation Collision:** Agar do admins same complaint par action lein, first execution wins aur subsequent action gracefully alert karta hai ki record already adjudicated ho chuka hai.
2. **False Malicious Reporting:** Agar koi member jealous ya malicious hokar fake complaint kare, Admin "Dismiss" par click karke false report ko discard kar sakta hai bina suspect ko penalize kiye.
3. **Accidental Blacklist Recovery:** Blacklist Vault tab me Super Admin ko "Unblock" button milta hai jisse legitimate candidate ki blacklist entry lift ho sakti hai.
4. **Device ID Spoofing Defense:** System hardware fingerprint (UUID + canvas hash) use karta hai jo browser storage wipe karne par bhi persistent rehta hai.

---

## 7. 🔌 Underlying Architecture

### TypeScript Models ([crm.types.ts](file:///Users/naman/Documents/CRM%20Landing%20Projects/Matrimony%20Project/sindiMatrimonyAdmin/src/types/crm.types.ts))
- `AbuseReportReason`: `'ASKING_MONEY' | 'FAKE_PROFILE' | 'CALL_MISBEHAVIOR' | 'HARASSMENT' | 'MARRIED_CLAIMING_SINGLE' | 'OTHER'`
- `AbuseReportStatus`: `'OPEN' | 'IN_REVIEW' | 'WARNED' | 'SHADOW_FROZEN' | 'BLACKLISTED' | 'DISMISSED'`
- `SafetyActionType`: `'WARN' | 'SHADOW_FREEZE' | 'PERMANENT_BLACKLIST' | 'DISMISS'`
- `AbuseReport`: Full grievance object with reporter, suspect, chat evidence, and audio logs.
- `BlacklistedIdentity`: Vault record retaining phone, Aadhaar hash, device ID, reason, and admin actor.

### Reactive Data Service ([crmDataService.ts](file:///Users/naman/Documents/CRM%20Landing%20Projects/Matrimony%20Project/sindiMatrimonyAdmin/src/services/crmDataService.ts))
- `getAbuseReports()`
- `getSafetyKPIs()`
- `executeSafetyAction(reportId, action, notes, adminName)`
- `getBlacklistedIdentities()`
- `removeBlacklist(blacklistId)`
