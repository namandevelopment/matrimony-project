# 📞 Section 02: CRM Leads (`/leads`)

## 1. 📌 Overview & Theoretical Foundation (Theory)

### Business Purpose
CRM Leads matrimony business ki **primary revenue & conversion engine** hai. Jab koi prospective groom, bride, ya unke parents website, Facebook ad campaigns, WhatsApp bot, ya referrals ke through contact form bharte hain, toh wo CRM Lead bante hain. Leads Screen ka maksad in inquiries ko capture karna, call center agents ko systematically distribute karna, calling dispositions track karna, follow-ups schedule karna, aur high-intent leads ko paid matrimonial members me convert karna hai.

### Key Conceptual Pillars
1. **The 20-Batch Exclusivity Rule (एंटी-होर्डिंग नियम):** Ek telecaller ek waqt me 20 se zyada fresh unassigned leads allocate nahi kar sakta. Jab tak agent previous leads ko call karke status update (disposition) na kare, new batch allot nahi hota. Yeh agent lead-hoarding prevent karta hai aur instant SLA compliance ensure karta hai.
2. **Lead Lifecycle Progression:**
   ```
   [NEW / UNASSIGNED] ──► [ASSIGNED TO AGENT (MY BUCKET)]
                                    │
                                    ▼
                          [CALL INITIATED]
                                    │
      ┌─────────────────────────────┼─────────────────────────────┐
      ▼                             ▼                             ▼
[CONNECTED: FOLLOW-UP]       [CONNECTED: CONVERTED]         [DEAD / JUNK]
  (Auto Task Scheduled)      (Redirect to Add Member/Pay)   (Archived with Reason)
   ```
3. **Data Privacy & Number Masking:** Telecallers ko shuru me phone number masked format (`+91 98200 *****`) me dikhta hai. Click-to-reveal ya click-to-call action log hota hai taaki internal customer data theft prevent ho sake.

---

## 2. 🔄 Complete Step-by-Step Flow (End-to-End Workflow)

```
[Agent/Manager Navigates to /leads]
         │
         ▼
[Role Check: Is User SuperAdmin or CRM Agent?]
  ├── Super Admin ──► Can view "ALL" & "UNASSIGNED" tabs, full batch assign toolbar
  └── CRM Agent   ──► Locked to "MY BUCKET" tab (only leads assigned to self)
         │
         ▼
[Live Sync with crmDataService via useEffect]
         │
         ├─► Load leads, active employees & calling statuses
         ├─► Apply Search & Dropdown Filters (Subcaste, Source, Staff)
         └─► Paginate Records (Page size: 20 per page)
         │
[Core Actions Available on Row / Header]
  ├── Click "Click-to-Call" Button ──► Opens CallResponseModal with WebRTC Audio Simulation
  ├── Click "Eye" Icon ──────────────► Toggle Mobile Masking Reveal (Logged)
  ├── Click "Lead Name / 360°" ──────► Opens LeadDetailModal (Timeline, Notes, Previous Calls)
  ├── Select Checkboxes (Batch) ─────► Opens AssignLeadsModal (Assign max 20 to eligible staff)
  └── Click "Reassign Lead" ─────────► Opens ReassignLeadModal (Preset reason + handover notes)
```

### Detailed Operational Steps:
1. **Auto-Tab Selection by Role:** Agar user `CRM_AGENT` hai, toh screen automatically `MY_BUCKET` par lock ho jaati hai taaki wo kisi dusre agent ki leads access na kar sake. Super Admin sabhi tabs (`ALL`, `UNASSIGNED`, `IN_FOLLOWUP`, `CONVERTED`, `DEAD`) dekh sakta hai.
2. **Batch Selection:** Manager unassigned tab me ja kar checkboxes select karta hai. Selection toolbar total selected count dikhata hai. Agar 20 se zyada select kiye jayein, toh limit warning aati hai.
3. **Batch Allocation:** "Assign Selected Leads" par click karne par popup khulta hai jisme eligible active staff select hota hai aur manager notes add kar sakta hai. Save hone par lead status turant `ASSIGNED` ho jata hai aur target agent ko notification chali jaati hai.
4. **Call Simulation & Disposition:** Agent lead row par phone icon dabata hai. `CallResponseModal` active hota hai:
   - Call duration timer chalta hai.
   - Call complete hone par disposition select karna mandatory hota hai: *Connected (Interested)*, *Connected (Call Back Later)*, *Connected (Not Interested)*, *Busy / Not Reachable*, *Wrong Number*, *Invalid Lead*.
   - Remarks/Notes input kiye jaate hain.
   - Agar Call Back select kiya ho, toh Follow-up date aur time choose hota hai, jo automatically `TasksScreen` me new task schedule kar deta hai.
5. **Reassignment Protocol:** Agar agent leave par hai ya lead kisi specific language specialist ko hand over karni hai, toh Reassign modal ke through reason (e.g. *Customer Requested Different Agent*, *Language Barrier*, *Agent on Leave*) select karke transition kiya jata hai.

---

## 3. 🛠️ Features & Admin Capabilities (इस स्क्रीन में क्या-क्या कर सकते हैं)

### A. Persona & Simulation Banner (`SessionPersonaBanner`)
- Super Admin kisi bhi employee ke perspective ko simulate karke check kar sakta hai ki us agent ko kaun si leads aur interface dikh raha hai.
- Quick switch dropdown between Super Admin and individual call agents.

### B. Tabs Filter Section (`LeadsTabsSection`)
- **ALL:** System ki sabhi leads ka master pool.
- **UNASSIGNED:** Nayi leads jinka koi telecaller alloted nahi hai.
- **MY BUCKET:** Logged-in agent ko assign ki gayi exclusive leads.
- **IN FOLLOW-UP:** Jin par call ho chuki hai aur next call date scheduled hai.
- **CONVERTED:** Jin leads ne registration/membership plan purchase kar liya.
- **DEAD:** Not interested, wrong numbers, ya spam leads with audit logs.

### C. Advanced Filter Bar (`LeadsFilterSection`)
- **Search Input:** Lead ID (`#LD-1001`), candidate name, phone number, city, ya email se instant client-side search.
- **Subcaste Dropdown:** Filter by Sindhi subcaste (Amil, Baibhand, Sahiti, Larkana, Shikarpuri, etc.).
- **Lead Source Dropdown:** Website organic, Meta/Facebook Ads, Google Search, Offline Camp, WhatsApp bot.
- **Assigned Staff Dropdown:** (Super Admin view) Filter by individual telecaller.

### D. 20-Batch Operations Toolbar (`LeadsBatchToolbar`)
- Select All checkbox for current page.
- Selected counter badge.
- Single-click "Assign 20 to Staff" CTA button.

### E. Telecalling & Action Modals
- **CallResponseModal:** Telecalling timer, audio waveform visualizer, 6 mandatory disposition options, follow-up scheduler, call notes.
- **AssignLeadsModal:** Target agent selection, max-capacity warnings, batch assignment confirmation.
- **ReassignLeadModal:** Reassignment preset reasons, handover briefing notes.
- **LeadDetailModal:** 360° lead dossier showing complete chronological interaction timeline, budget preferences, age, gotra, family background, and call logs.

---

## 4. 📊 KPI Cards & Lead Status Matrix

| Lead Status | Visual Badge | Meaning & Next Action |
|---|---|---|
| **NEW** | Blue | Fresh submission, calling pending |
| **ASSIGNED** | Purple | Allocated to an agent bucket |
| **CONTACTED** | Amber | Call done, details discussed |
| **FOLLOW_UP** | Indigo | Follow-up scheduled with active calendar task |
| **CONVERTED** | Emerald | Converted to paid customer |
| **LOST / DEAD** | Rose | Not interested / Budget mismatch |
| **JUNK** | Slate | Fake number / Test entry |

---

## 5. 🔐 RBAC & Security Matrix

- **SUPER_ADMIN:** Full access across all leads, reassignments, deletion, bulk assignment, and all telecaller buckets.
- **CRM_MANAGER:** Can view all team leads, reassign leads across team members, and monitor SLA response times.
- **CRM_AGENT:** Strict `OWN` record scope — can only view and call leads in their personal bucket (`MY_BUCKET`). Cannot see leads assigned to other agents.
- **Mobile Number Masking:** Default view masks 5 digits (`+91 98200 *****`). Revealing the full number logs an audit event in system storage.

---

## 6. ⚡ Edge Cases & Error Handling

1. **Exceeding 20 Leads Batch:** Agar user bulk assign me 21 ya zyada leads select karne ki koshish kare, toh system limit error throw karta hai taaki workload imbalance na ho.
2. **Agent Max Capacity Reached:** Agar kisi agent ka `activeLeadsCount >= maxLeadCapacity`, modal me warning icon appear hota hai aur assignment block ho jaati hai.
3. **Concurrent Calling Protection:** Ek hi lead ko do agents simultaneously call na kar sakein iske liye call state me lock flag set hota hai.

---

## 7. 🔌 Associated Services & Data Entities

- **Screen File:** `src/screens/leadsScreen/LeadsScreen.tsx`
- **Subcomponents:** `src/screens/leadsScreen/component/`
- **Primary Data Service:** `src/services/crmDataService.ts`
- **Types & Interfaces:** `src/types/crm.types.ts` (`Lead`, `LeadStatus`, `CallLog`, `LeadSource`)
- **Modals Used:** `CallResponseModal.tsx`, `ReasonModal.tsx`
