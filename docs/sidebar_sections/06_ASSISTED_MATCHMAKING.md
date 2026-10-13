# 💍 Section 06: Assisted Matchmaking (`/matchmaking`)

## 1. 📌 Overview & Theoretical Foundation (Theory)

### Business Purpose
Assisted Matchmaking Sindhi Matrimony ka **core value proposition aur algorithmic heart** hai. General matrimonial apps sirf automated search filters dete hain, lekin elite Sindhi parivar VIP assisted matchmaking expect karte hain — jisme professional relationship managers (Matchmakers) candidate profiles ko deeply verify karte hain, gotra aur subcaste traditions validate karte hain, aur personalized proposals curate karte hain.

### Key Conceptual Pillars
1. **Hybrid AI + Human-in-the-Loop Architecture:**
   - **Algorithmic Compatibility Score:** System Gotra rules, age difference, subcaste preferences, education, aur location ke basis par 0% se 100% compatibility calculate karta hai.
   - **Human Matchmaker Verification:** Koi bhi recommendation bina relationship manager ke human review aur approval ke directly client ko forward nahi ki jaati.
2. **Sindhi Cultural Compatibility Rules:**
   - **Gotra Exogamy Rule (गोत्र बहिष्कार नियम):** Ek hi Gotra (paternal lineage) me shaadi Sindhi sanskriti me prohibited hoti hai. Agar dono candidate ka Gotra identical hai, toh system recommendation block ya heavily penalize karta hai.
   - **Subcaste Affinity & Alliances:** Amil, Baibhand, Sahiti, Larkana, Shikarpuri aadi subcastes ki mutual compatibility weights factor-in hoti hain.
3. **Recommendation Lifecycle:**
   ```
   [GENERATE RECOMMENDATION]
               │
               ▼
   [PENDING MATCHMAKER REVIEW]
         │              │
         ▼              ▼
   [REJECTED]      [APPROVED BY MATCHMAKER]
                           │
                           ▼
                 [SHARED WITH CLIENT / CANDIDATE]
                           │
                           ▼
                 [MATCH RESPONSES TRACKING]
   ```

---

## 2. 🔄 Complete Step-by-Step Flow (End-to-End Workflow)

```
[Matchmaker Opens /matchmaking]
         │
         ▼
[Mount MatchmakingScreen]
         │
         ├─► Render KPI Summary Cards (Pending Review, Awaiting Response, Mutual, Total)
         ├─► Render Operational Tabs:
         │     ├── Tab 1: Pending Review (Awaiting Matchmaker decision)
         │     ├── Tab 2: Awaiting Client Response (Sent to clients)
         │     ├── Tab 3: Mutual Interests (Accepted by both sides)
         │     └── Tab 4: Matchmaking Engine (Generate bespoke match)
         │
[Actions in Screen]
  ├── In Pending Tab:
  │     ├── Click "Approve Match" ──► Sets reviewStatus='APPROVED', ready to share
  │     └── Click "Reject Match" ───► Logs reason, archives recommendation
  ├── In Awaiting Tab:
  │     └── Click "Share with Client" ──► Dispatches proposal via WhatsApp/Email/Portal
  └── In Engine Tab:
        ├── Select Client Profile (e.g. SIND001)
        ├── Select Candidate Profile (e.g. SIND002)
        └── Click "Run Compatibility Engine" ──► Calculates score %, generates match ID
```

---

## 3. 🛠️ Features & Admin Capabilities (इस स्क्रीन में क्या-क्या कर सकते हैं)

### A. KPI Metric Cards
- **Pending Review:** Unreviewed matches awaiting staff vetting.
- **Awaiting Response:** Matches approved by matchmaker and dispatched to clients.
- **Mutual Interests:** Both groom and bride sides have responded with "Interested" (High-priority closing stage!).
- **Total Curated Matches:** Lifetime count of curated matches generated.

### B. Curated Matches Queue (Pending Tab)
- Card-based comparison view:
  - Client side (Left) vs Candidate side (Right).
  - Profile Photos, Names, Ages, Subcastes, Gotras, Occupations, Annual Incomes.
  - Compatibility Score badge (e.g., `92% Match`).
  - Compatibility highlights (e.g. *Both Sindhi Amil, Non-matching Gotras, Same city Mumbai*).
- **One-Click Action Buttons:**
  - `Approve`: Confirms cultural and profile alignment.
  - `Reject`: Discards match with reason logging.

### C. Assisted Match Generator Engine (Engine Tab)
- **Client Selector Dropdown:** Search and pick any active client.
- **Candidate Selector Dropdown:** Search and pick prospective match.
- **Algorithm Execution Trigger:**
  - Evaluates Gotra collision (`sameGotraViolationCheck`).
  - Evaluates Age variance against client preferences.
  - Evaluates Education and Income expectations.
  - Produces instant result banner with score and detailed rationale.
  - Auto-switches to "Pending Review" tab upon successful generation.

### D. Sharing & Dispatch Tool
- Once a match is approved, matchmaker clicks "Share with Client".
- Formatted proposal biodata is made visible on the client's mobile app and dispatch logs are recorded.

---

## 4. 📊 Compatibility Scoring Engine Formula

$$\text{Score} = W_{\text{gotra}} \times S_{\text{gotra}} + W_{\text{subcaste}} \times S_{\text{subcaste}} + W_{\text{age}} \times S_{\text{age}} + W_{\text{education}} \times S_{\text{edu}} + W_{\text{city}} \times S_{\text{city}}$$

- **Gotra Exogamy:** If same Gotra $\rightarrow$ Hard Block or -50% penalty (configurable in Master Settings).
- **Subcaste Affinity:** Same subcaste or mutually accepted subcaste preferences $\rightarrow$ +30%.
- **Age Window:** Within preferred $\pm 3$ years $\rightarrow$ +25%.
- **City / Region:** Same metro or accepted NRI status $\rightarrow$ +20%.
- **Education / Profession:** Matching degree tiers $\rightarrow$ +25%.

---

## 5. 🔐 RBAC & Security Matrix

- **Allowed Roles:** `SUPER_ADMIN`, `ADMIN`, `CRM_MANAGER`, `CRM_AGENT`.
- **Matchmaker Notes Privacy:** Internal notes recorded during match review are confidential and never exposed to the client or candidate on user apps.

---

## 6. ⚡ Edge Cases & Error Handling

1. **Self-Matching Guard:** System blocks selecting the same profile ID as both client and candidate.
2. **Duplicate Recommendation Prevention:** Agar do profiles ke beech pehle se active recommendation exist karti hai, toh engine error return karta hai taaki client ko duplicate proposals na bheje jayein.
3. **Gender Compatibility:** Engine strictly validates Groom (Male) vs Bride (Female) alignment.

---

## 7. 🔌 Associated Services & Data Entities

- **Screen Component:** `src/screens/matchmakingScreen/MatchmakingScreen.tsx`
- **Data Service:** `src/services/crmDataService.ts` (`getMatches`, `generateMatch`, `reviewMatch`, `shareMatchWithClient`)
- **Data Models:** `MatchRecommendation` (`matchId`, `clientId`, `candidateId`, `compatibilityScore`, `reviewStatus`, `overallStatus`)
- **Subcaste Service:** `src/services/subcasteGotraService.ts`
