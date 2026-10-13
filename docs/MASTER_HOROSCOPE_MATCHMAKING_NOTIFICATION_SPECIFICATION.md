# 📜 Master Architecture Specification
# Sindhi Matrimony — Horoscope, Automated Matchmaking & Notification Management System

---

## 1. Executive Summary & Architecture Boundaries

This document defines the complete technical, algorithmic, and operational architecture for the **Horoscope, Automated Matchmaking, and Multi-Channel Notification System** for Sindhi Matrimony.

### Role Separation & System Boundaries

```
┌────────────────────────────────────────────────────────────────────────┐
│                      SYSTEM ARCHITECTURE BOUNDARIES                     │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  [📱 CLIENT: React Native App]                                          │
│  - User registration & profile completion progress (65% → 100%)        │
│  - Optional birth details input (DoB, Time with 'Unknown' flag, City)  │
│  - Partner & horoscope preference configuration                        │
│  - Viewing curated matches with '28/36 Guna' & Gotra badges            │
│  - Push notifications via Firebase Cloud Messaging (FCM) & Notifee     │
│                                                                        │
│  [⚡ BACKEND CORE: Node.js + Express + TypeScript + MongoDB + Redis]    │
│  - Vedic Ashtakoota 36-Guna calculation engine (Lahiri Ayanamsha)      │
│  - Gotra exogamy collision detector & Kuja / Manglik Dosha evaluator   │
│  - Caching & deduplication of astronomical charts (Janam Kundli)       │
│  - Automated matchmaking pipeline with 10-step eligibility filters     │
│  - Daily match digest cron worker (paginated, batched, rate-limited)   │
│  - Transactional event outbox & retry queue with exponential backoff   │
│                                                                        │
│  [🛡️ ADMIN PANEL: React + Vite + Tailwind]                             │
│  - Direct Horoscope Dispatch Desk: Send Kundli directly to user via    │
│    WhatsApp, In-App Push, Email, or SMS                                │
│  - Assisted Matchmaking: Relationship managers verify candidate pairs  │
│  - Policy settings: Configure minimum Guna threshold (18–32)           │
│  - Automated event toggles, template management & campaign delivery    │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Complete Member Profile Flow

### Step 1: Member Registration & Verification
1. Mobile number collection and OTP validation using the existing SMS gateway.
2. Account creation with default `status = PENDING_VERIFICATION` and `accountType = SELF | PARENT | SIBLING`.
3. Profile completion meter dynamically calculating weight:
   - Basic Info (Name, Gender, Marital Status): 25%
   - Community & Subcaste (Sindhi, Gotra): 20%
   - Education & Career: 20%
   - Partner Preferences: 15%
   - Photographs (KYC / Trust Badge): 10%
   - Horoscope Information (Optional): 10%
4. **Non-Mandatory Rule:** Horoscope details remain strictly optional. Users without horoscope data are never blocked from registration or discovery.

### Step 2: Partner & Horoscope Preferences
Members configure:
- **Demographics:** Age range (e.g. 24–30), Height (e.g. 5'2"–5'10"), Marital Status (`Unmarried`, `Divorced`, `Widowed`).
- **Location:** Home city, state, country, or radius in km.
- **Community:** Sindhi subcaste preference (`Baibhand`, `Amil`, `Sahiti`, `Larkana`, `Shikarpuri`, or `All Sindhi`).
- **Gotra Exogamy:** Checkbox `Exclude Same Gotra` (Default: `true` for traditional families).
- **Manglik Preference:** `Doesn't matter`, `Only Non-Manglik`, `Only Manglik`, `Anshik Manglik Ok`.
- **Horoscope Matching Toggle:** `Enable Horoscope Compatibility Scoring` (Default: `true`).
- **Notification Preferences:** Daily Match Digest (`Enabled`), Instant Match Alerts (`Enabled`), Channel selection (`Push`, `WhatsApp`, `Email`).

### Step 3: Horoscope Birth Details Collection
When the user opts to add horoscope details:
- **Date of Birth:** `YYYY-MM-DD`
- **Birth Time:** `HH:mm AM/PM` with a clear checkbox: `[ ] I don't know my exact birth time`.
  - *Fallback Rule:* When birth time is unknown, the system generates a **Surya Kundli (Sun Chart)** and calculates Moon Sign / Rashi, but safely disables Nadi & Lagna-dependent predictions rather than fabricating a fake time.
- **Birth Place:** City and Country with geocoding (Latitude, Longitude) and Timezone offset (e.g., `Asia/Kolkata`, `+05:30`).
- **Privacy Notice:** "Birth details are securely encrypted and used strictly for astrological calculations. Exact birth coordinates are never exposed publicly to other members."

---

## 3. Horoscope & Kundli Engine Architecture

### Calculation Architecture & Caching
```mermaid
flowchart TD
    REQ[Client Submits Birth Details] --> VAL[Backend Input Validation]
    VAL --> HASH[Compute Deterministic Key: Hash(DoB + Time + Lat + Lng + Ayanamsha)]
    HASH --> CACHE{Existing Horoscope Calculation in DB?}
    CACHE -- Yes --> RET[Return Cached Janam Kundli & Rashi/Nakshatra]
    CACHE -- No --> ENGINE[Execute Vedic Ephemeris Engine]
    ENGINE --> SAVE[Persist in HoroscopeProfile & HoroscopeCalculation Collection]
    SAVE --> EVENT[Emit HOROSCOPE_READY Event]
    EVENT --> RET
```

### Ashtakoota 36-Guna Milan Algorithm
The engine evaluates 8 Kootas based on Moon Nakshatra (1–27) and Moon Rashi (1–12):

| Koota (कूट) | Max Score | Astrological Dimension | Implementation Calculation |
|---|---|---|---|
| **Varna** | 1 | Ego & spiritual temperament | Brahmin (Water) > Kshatriya (Fire) > Vaishya (Earth) > Shudra (Air) |
| **Vashya** | 2 | Attraction & power dynamics | Quadruped, Human, Water, Wild, Insect signs matrix |
| **Tara** | 3 | Health, destiny & longevity | Distance from Groom Nakshatra to Bride modulo 9 |
| **Yoni** | 4 | Physical intimacy & compatibility | 14 Animal Totems (Ashwa, Gaja, Mesh, Sarpa, etc.) |
| **Graha Maitri** | 5 | Psychological friendship | Moon Lord friendship matrix (Sun, Moon, Mars, etc.) |
| **Gana** | 6 | Behavioral temperament | Deva (Divine), Manushya (Human), Rakshasa (Demonic) |
| **Bhakoot** | 7 | Family growth & progeny | Moon sign distance (Avoid 2/12, 6/8, 9/5 doshas) |
| **Nadi** | 8 | Genetic lineage & physiological vitality | Adi, Madhya, Antya Nadi (Same Nadi creates Nadi Dosha) |
| **Total** | **36** | **Comprehensive Vedic Score** | `>= 18: Auspicious, >= 25: Highly Recommended` |

### Manglik (Kuja) Dosha & Cancellation Matrix
- **Mars Positions:** Evaluated for Mars in houses 1, 4, 7, 8, or 12 from Lagna, Moon, and Venus.
- **Mutual Cancellation Rule:** If **both Groom and Bride are Manglik**, the Kuja Dosha cancels out mutually and compatibility verdict remains positive.
- **Anshik Manglik:** Soft cancellation applied if Jupiter aspects Mars or partner is above 28 years.

---

## 4. Automated Matchmaking Engine

### The 10-Step Profile Filtration Pipeline

```
[Candidate Pool: All Active Members]
       ↓ (1) Exclude Current Member ID
       ↓ (2) Filter Opposite Gender (Male ↔ Female)
       ↓ (3) Exclude Blocked & Reported Profiles
       ↓ (4) Exclude Deactivated, Suspended or Hidden Profiles
       ↓ (5) Apply Privacy Exclusions (e.g., Hidden Contacts)
       ↓ (6) Apply Hard Age Range Filter (e.g. 24–29)
       ↓ (7) Apply Marital Status Filter (e.g., Never Married)
       ↓ (8) Apply Community Preference (Sindhi / Subcaste)
       ↓ (9) Apply Gotra Exogamy Policy (Exclude same Gotra if requested)
       ↓ (10) Exclude Already Rejected / Dismissed Recommendations
[Eligible Match Candidate Pool]
```

### Two-Tier Scoring Architecture
Compatibility is split into **General Profile Relevance (0–100%)** and **Horoscope Guna Milan (0–36 Gunas)**:

$$\text{Profile Relevance Score} = w_{\text{pref}} \cdot S_{\text{pref}} + w_{\text{age}} \cdot S_{\text{age}} + w_{\text{loc}} \cdot S_{\text{loc}} + w_{\text{caste}} \cdot S_{\text{caste}} + w_{\text{complete}} \cdot S_{\text{complete}}$$

- **Mutual Preference (35 pts):** Both candidates satisfy each other's criteria.
- **Age Proximity (20 pts):** Difference $\le 3$ years = 20 pts; $\le 5$ years = 15 pts.
- **Location Proximity (15 pts):** Same city = 15 pts; Same state = 10 pts.
- **Community Alignment (15 pts):** Matching subcaste preference = 15 pts.
- **Profile Completeness (15 pts):** Verified photos + verified phone = 15 pts.
- **Horoscope Score (Separate):** Displayed as `28/36 Gunas` badge. **A missing horoscope never rejects a profile.**

---

## 5. Match Storage, Versioning & Deduplication

### Normalized Match Record Structure (`MatchEvaluation`)
```json
{
  "_id": "match_8920_7741_v2",
  "pairKey": "SM-1042:SM-7741", // Lexicographically sorted for symmetry
  "memberAId": "SM-1042",
  "memberBId": "SM-7741",
  "relevanceScore": 88,
  "scoringBreakdown": {
    "preferenceMatch": 35,
    "ageProximity": 18,
    "locationMatch": 15,
    "communityMatch": 15,
    "completeness": 5
  },
  "horoscopeEvaluation": {
    "calculated": true,
    "gunas": 28,
    "maxGunas": 36,
    "verdict": "AUSPICIOUS",
    "sameGotra": false,
    "manglikStatus": "COMPATIBLE"
  },
  "generationSource": "AUTOMATED_DAILY_CRON",
  "includedInDigest": true,
  "digestDeliveredAt": "2026-10-13T08:00:00Z",
  "lastEvaluatedAt": "2026-10-13T07:45:00Z",
  "engineVersion": "2.1.0"
}
```

### Targeted Invalidation Triggers
Matches are only re-evaluated when:
1. Member updates partner preferences (age, city, subcaste).
2. Member corrects birth details.
3. Member toggles horoscope matching on/off.
4. Member deactivates or blocks a candidate.
*Mass recalculations across the entire database are strictly prevented.*

---

## 6. Notification Event Bus & Processing Pipeline

### System Events
- `MEMBER_REGISTERED`: Triggers welcome onboarding & profile completion push.
- `HOROSCOPE_READY`: Alerts user that their Janam Kundli is generated.
- `NEW_MATCH_AVAILABLE`: Real-time alert when a 90%+ match registers.
- `DAILY_MATCH_DIGEST_READY`: Morning push digest with curated matches.
- `INTEREST_RECEIVED`: Immediate alert when someone clicks "Connect".
- `INTEREST_ACCEPTED`: Immediate alert when mutual connection is established.
- `ADMIN_HOROSCOPE_DISPATCHED`: When admin sends Kundli directly to user.

### Processing Pipeline (Transactional Outbox)
```
[Business Event Trigger]
         ↓
[Save NotificationEvent to Outbox (Atomic DB Transaction)]
         ↓
[Background Worker Polls / Consumes Outbox Event]
         ↓
[Eligibility & Consent Checks: Is Account Active? Push Opt-in = True?]
         ↓
[Frequency Capping Check: < 3 pushes in last 24h?]
         ↓
[Template Rendering (Localized in English / Hindi / Sindhi)]
         ↓
[Send through Channel: FCM / Notifee / WhatsApp / SMS]
         ↓
[Log Delivery Status: SUCCESS / RETRY_QUEUED / FAILED]
```

---

## 7. Daily Match Digest Cron & Anti-Spam Controls

### Scheduled Job Specification
- **Schedule:** Daily at `08:00 AM IST` (Configurable via Admin Settings).
- **Execution Strategy:** Cursor-based pagination in batches of 100 members.
- **Grouping Rule:** Matches are bundled into a single digest message:
  > *"Namaste Priya! Aaj aapke liye 5 naye compatible matches available hain (incl. 28/36 Guna match). Dekhne ke liye app open karein."*
- **No-Spam Safeguard:** If no meaningful new matches exist ($\text{new matches} = 0$), **no digest is sent**.
- **Global Frequency Limit:** Maximum 1 digest per user per 24 hours.

---

## 8. Admin Direct Horoscope Dispatch Desk (कुंडली प्रेषण डेस्क)

In the Admin Panel under **`Horoscope & Kundli` → `Send Horoscope to User` (`/horoscope`)**, administrators and Relationship Managers have a dedicated dispatch station:

### Capabilities:
1. **Target Selection:** Search and select any registered member by Name or Member ID.
2. **Report Type Selection:**
   - 📜 **Personal Janam Kundli Report:** Dispatches the member's own birth chart, planetary placements, Rashi, Nakshatra, and Manglik status.
   - 💖 **Kundli Milan Match Report:** Admin selects a candidate partner; the system computes the 36-Gunas and Gotra compatibility live, generating a match scorecard.
3. **Multi-Channel Dispatch:**
   - 🔔 **In-App Push (FCM):** Delivered instantly to user's phone with deep link.
   - 💬 **WhatsApp:** Formatted message with PDF download preview link.
   - ✉️ **Email:** HTML summary with full planetary chart attached.
   - 📱 **SMS:** Concise text alert with verified web viewer link.
4. **Relationship Manager Remarks:** Custom notes (e.g. *"Pandit Ji dwara verified Kundli Milan report: 28/36 Gunas matched."*).
5. **Live Device Preview:** Side-by-side preview showing the exact layout of the notification before clicking Send.
6. **Recent Dispatches Audit Log:** Historical audit trail of all dispatched horoscopes with delivery receipts.

---

## 9. Mobile App Push Integration & Deep Linking

### Tech Stack & Libraries
- Push Provider: Firebase Cloud Messaging (`@react-native-firebase/messaging`)
- Local & Foreground Notifications: Notifee (`@notifee/react-native`)
- State: Redux Toolkit (`@reduxjs/toolkit`) & React Navigation v7

### Deep Link Mapping Table
| Notification Event | Payload Data | Target Screen |
|---|---|---|
| `NEW_MATCH_AVAILABLE` | `{"type": "match", "matchId": "mtc_102", "memberId": "SM-7741"}` | `MatchesScreen` / `ProfileDetail` |
| `DAILY_MATCH_DIGEST_READY`| `{"type": "digest", "date": "2026-10-13"}` | `MatchesScreen` (Filter: 'For you') |
| `HOROSCOPE_READY` | `{"type": "horoscope", "memberId": "SM-1042"}` | `EditProfile` (Kundli Sheet) |
| `ADMIN_HOROSCOPE_DISPATCHED`| `{"type": "kundli_report", "reportId": "knd_99"}` | `KundliReportViewerModal` |
| `INTEREST_RECEIVED` | `{"type": "interest", "senderId": "SM-8920"}` | `InterestsScreen` |

---

## 10. Database Schema (MongoDB / Mongoose Collections)

### 1. `HoroscopeProfile`
```typescript
interface IHoroscopeProfile {
  userId: ObjectId;
  dateOfBirth: Date;
  birthTime: string;           // "14:30"
  isTimeUnknown: boolean;
  birthPlace: {
    city: string;
    state?: string;
    country: string;
    latitude: number;
    longitude: number;
    timezone: string;          // "Asia/Kolkata"
  };
  rashi: string;               // e.g. "Simha (Leo)"
  nakshatra: string;           // e.g. "Poorvaphalguni"
  charanPada: number;          // 1, 2, 3, or 4
  gotra: string;               // e.g. "Kashyap"
  manglikStatus: 'NON_MANGLIK' | 'MANGLIK' | 'ANSHIK_MANGLIK' | 'UNKNOWN';
  chartSvgUrl?: string;
  calculationHash: string;     // Sha256 for idempotency cache
  createdAt: Date;
  updatedAt: Date;
}
```

### 2. `MatchEvaluation`
```typescript
interface IMatchEvaluation {
  pairKey: string;             // "USER_A_ID:USER_B_ID"
  memberA: ObjectId;
  memberB: ObjectId;
  overallScore: number;        // 0 to 100
  gunaMilan?: {
    totalGunas: number;        // 0 to 36
    verdict: 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'POOR';
    sameGotraCollision: boolean;
    manglikCompatible: boolean;
    breakdown: {
      varna: number;
      vashya: number;
      tara: number;
      yoni: number;
      grahaMaitri: number;
      gana: number;
      bhakoot: number;
      nadi: number;
    };
  };
  status: 'SUGGESTED' | 'REVIEWED_BY_RM' | 'SHARED' | 'INTEREST_EXPRESSED' | 'DISMISSED';
  reviewedByEmployeeId?: string;
  lastCalculatedAt: Date;
}
```

### 3. `NotificationJob`
```typescript
interface INotificationJob {
  _id: ObjectId;
  recipientId: ObjectId;
  event: string;               // "DAILY_MATCH_DIGEST_READY"
  channel: 'PUSH' | 'WHATSAPP' | 'EMAIL' | 'SMS';
  title: string;
  body: string;
  payload: Record<string, any>;
  status: 'PENDING' | 'SENT' | 'FAILED' | 'SKIPPED_OPTED_OUT';
  retryCount: number;
  maxRetries: number;
  scheduledFor: Date;
  sentAt?: Date;
  failureReason?: string;
}
```

---

## 11. Reliability, Error Handling & Dead-Letter Queue

1. **Idempotency Keys:** Every notification job uses a deterministic idempotency key (`hash(userId + event + date)`) to guarantee that running the scheduler twice never delivers duplicate notifications.
2. **Exponential Backoff Retry Policy:**
   - Attempt 1: Immediate
   - Attempt 2: After 2 minutes
   - Attempt 3: After 10 minutes
   - Attempt 4: After 1 hour
   - Exhausted: Moved to `DeadLetterQueue` for admin inspection.
3. **Invalid Token Auto-Pruning:** When FCM responds with `messaging/registration-token-not-registered` or `messaging/invalid-registration-token`, the dead token is automatically purged from the user's `fcmTokens` array.

---

## 12. Security, Privacy & Compliance (DPDP Act India)

- **PII Encryption:** Date, exact time, and birthplace are encrypted at rest using AES-256.
- **Payload Privacy:** Sensitive birth times and charts are **never sent in push notification payloads**. Pushes contain only abstract titles and an ID link that requires authenticated access inside the app.
- **Granular Consent:** Users can toggle marketing and daily match digests off at any time while retaining essential transactional security notifications (OTP, Account Login).
