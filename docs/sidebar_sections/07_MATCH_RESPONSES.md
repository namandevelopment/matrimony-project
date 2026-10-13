# 🤝 Section 07: Match Responses (`/match-responses`)

## 1. 📌 Overview & Theoretical Foundation (Theory)

### Business Purpose
Match Responses screen assisted matchmaking pipeline ka **response tracking and conversion clearinghouse** hai. Jab matchmaker kisi proposal ko dono parties ke saath share karta hai, toh do independent response streams generate hoti hain:
1. **Client's Feedback** (Groom side interest)
2. **Candidate's Feedback** (Bride side interest)

Kayi CRM systems dono responses ko ek hi status field me mix kar dete hain, jisse confusion create hoti hai ki kis party ne accept kiya aur kaun abhi soch raha hai. Match Responses screen **Independent Dual-Response State Machine** follow karti hai taaki har side ka status crystal clear rahe.

### Key Conceptual Pillars
1. **Independent Dual-Party State Machine:**
   - Client Response: `PENDING` | `ACCEPTED` | `DECLINED`
   - Candidate Response: `PENDING` | `ACCEPTED` | `DECLINED`
   - Overall Match State:
     - Dono `ACCEPTED` $\rightarrow$ `MUTUAL_INTEREST` (Milestone reached! 🎉)
     - Ek `DECLINED` $\rightarrow$ `DECLINED_BY_CLIENT` ya `DECLINED_BY_CANDIDATE`
     - Dono ya koi ek `PENDING` $\rightarrow$ `AWAITING_RESPONSE`
2. **Facilitated Contact Exchange Protocol:** Matrimonial privacy policy ke mutabik direct phone numbers tab tak share nahi kiye jaate jab tak `MUTUAL_INTEREST` status achieve na ho jaye. Mutual interest aate hi relationship manager dono parivaron ki conference call ya meeting coordinate karta hai.

---

## 2. 🔄 Complete Step-by-Step Flow (End-to-End Workflow)

```
[Proposal Shared with Client & Candidate]
                 │
                 ▼
[Match Recommendation Appears in /match-responses]
                 │
                 ▼
[Real-Time Tracking of Both Parties]
  ├── Party A (Client) Opens App ──────► Clicks "Interested" or "Pass"
  └── Party B (Candidate) Opens App ───► Clicks "Interested" or "Pass"
                 │
                 ▼
[Automated State Evaluator]
  ├── Both Accepted? ──────────► Overall Status = MUTUAL_INTEREST
  │                              ├─► Urgent Notification to Matchmaker
  │                              ├─► Contact Exchange Unlocked
  │                              └─► Follow-up Task Scheduled ("Arrange Meeting")
  ├── Any Party Declined? ─────► Overall Status = DECLINED
  │                              └─► Proposal Archived with Rejection Feedback
  └── Any Party Pending? ──────► Overall Status = AWAITING_RESPONSE
                                 └─► Reminder Prompt Scheduled after 48h
```

---

## 3. 🛠️ Features & Admin Capabilities (इस स्क्रीन में क्या-क्या कर सकते हैं)

### A. Filter Status Bar
- **All Filter:** Sabhi dispatched proposals ka total count.
- **Mutual Interests Filter:** Sirf wahi matches jisme dono sides ne green signal de diya hai.
- **Pending Client Filter:** Bride/Groom side ne abhi tak proposal review nahi kiya.
- **Pending Candidate Filter:** Candidate side ka response pending hai.
- **Declined Filter:** Jin proposals ko reject kar diya gaya.

### B. Instant Search Engine
- Search input supporting Match ID (`MATCH-9021`), Client Name, ya Candidate Name.

### C. Match Response Dossier Cards
- **Dual Party Split View:**
  - **Client Section:** Photo, Full Name, ID, Subcaste, Response Badge (`Pending`, `Accepted`, `Declined`), and response timestamp.
  - **Candidate Section:** Photo, Full Name, ID, Subcaste, Response Badge, and response timestamp.
- **Compatibility Badge:** Visual badge showing compatibility % and primary affinities.
- **Facilitation Action Buttons:**
  - For `MUTUAL_INTEREST`: Green button to *"Exchange Family Contacts"* and schedule meeting.
  - For `PENDING`: Blue button to *"Send WhatsApp / SMS Reminder"*.
  - For `DECLINED`: Option to view feedback reason (e.g. *Horoscope mismatch*, *Location constraint*).

---

## 4. 📊 Response State Progression Matrix

| Client Response | Candidate Response | Overall Outcome | Next Matchmaker Action |
|---|---|---|---|
| `PENDING` | `PENDING` | `AWAITING_RESPONSES` | Wait / Auto-reminder after 48 hours |
| `ACCEPTED` | `PENDING` | `AWAITING_CANDIDATE` | Call candidate relationship manager |
| `PENDING` | `ACCEPTED` | `AWAITING_CLIENT` | Call client to review the proposal |
| `ACCEPTED` | `ACCEPTED` | **`MUTUAL_INTEREST`** | **Coordinate family meeting / Exchange contacts** |
| `DECLINED` | `ACCEPTED` | `DECLINED_BY_CLIENT` | Archive match & suggest alternative candidate |
| `ACCEPTED` | `DECLINED` | `DECLINED_BY_CANDIDATE`| Archive match & comfort client with new options |

---

## 5. 🔐 RBAC & Security Matrix

- **Allowed Roles:** `SUPER_ADMIN`, `ADMIN`, `CRM_MANAGER`, `CRM_AGENT`.
- **Contact Privacy Safeguard:** Client and candidate contact numbers remain masked on this screen until mutual acceptance is recorded.

---

## 6. ⚡ Edge Cases & Error Handling

1. **Stale Proposals (> 7 Days Pending):** System alerts matchmaker to follow-up via phone before the proposal expires.
2. **Accidental Decline Reversal:** Agar kisi client ne mistake se "Decline" dabaya aur baad me call karke interest express kiya, Super Admin response state ko manual audit reason ke saath `ACCEPTED` override kar sakta hai.

---

## 7. 🔌 Associated Services & Data Entities

- **Screen Component:** `src/screens/matchmakingScreen/MatchResponsesScreen.tsx`
- **Data Service:** `src/services/crmDataService.ts` (`getMatches`, `subscribe`)
- **Data Model:** `MatchRecommendation` with `clientResponse`, `candidateResponse`, `overallStatus`, `responseTimestamps`
