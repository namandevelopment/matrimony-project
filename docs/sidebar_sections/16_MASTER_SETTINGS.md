# 🎛️ Section 16: Master Settings (`/master-settings`)

## 1. 📌 Overview & Theoretical Foundation (Theory)

### Business Purpose
Master Settings portal ka **top-tier global governance, legal compliance, tax structure, aur cultural policy engine** hai. Yeh screen exclusively **SUPER_ADMIN** ke liye reserved hoti hai (even standard Admins ko bhi yahan access nahi hota). Is screen me portal ki core business identity, legal head office addresses, tax rates (GST 18%), refund window timelines, cultural matchmaking constraints (minimum groom/bride age, gotra exogamy), watermarking, aur SMS/WhatsApp gateways configure kiye jaate hain.

### Key Conceptual Pillars
1. **Super Admin Exclusive Authority:** Standard settings (`/settings`) day-to-day operations handle karti hain, jabki Master Settings portal ki root operational DNA ko define karti hai.
2. **Five Comprehensive Governance Domains:**
   - **Portal Identity & Head Office:** Official legal entity name, corporate headquarters address, customer helplines.
   - **Cultural Matchmaking Rules:** Minimum legal marriage ages, maximum age difference threshold, strict Gotra exogamy rule, horoscope kundli matching policy.
   - **Privacy, Photos & Safeguards:** Dynamic watermarking, photo blurring for free users, mandatory KYC gate, screenshot prevention on mobile apps.
   - **Finance, Tax & Invoicing Rules:** Currency, GST tax percentage, automated tax invoice generation, refund window validity.
   - **Gateway Integrations:** DLT SMS Sender ID, SMTP email relay, WhatsApp Business Cloud API.

---

## 2. 🔄 Complete Step-by-Step Flow (End-to-End Workflow)

```
[User Navigates to /master-settings]
               │
               ▼
[Strict RBAC Check: Is effectiveRole === 'SUPER_ADMIN'?]
  ├── NO  ──► 403 Forbidden Screen ("Restricted to Super Admin only")
  └── YES ──► Mount MasterSettingsScreen
               │
               ├─► Read Stored Settings from localStorage ('sm_admin_master_settings_v1')
               ├─► Fallback to DEFAULT_SETTINGS if first time
               └─► Render Master Settings Workspace & Quick Section Filter Chips
               │
[Super Admin Configures Settings]
  ├── Section: Identity (Update portal name, helpline, head office)
  ├── Section: Matchmaking (Set Gotra rule toggle, age limits, Kundli mode)
  ├── Section: Privacy & Photos (Toggle watermarking, mobile masking style)
  ├── Section: Finance & Tax (Configure GST %, currency, refund window days)
  └── Section: Gateways (Set SMS Sender ID, SMTP host, WhatsApp API active)
               │
[Save / Reset Actions]
  ├── Click "Save Master Settings" ──► Validates inputs, persists to storage, shows toast
  └── Click "Reset Defaults" ────────► Reverts all parameters to factory defaults
```

---

## 3. 🛠️ Features & Admin Capabilities (इस स्क्रीन में क्या-क्या कर सकते हैं)

### A. Section Filter Navigation Chips
- Filter view by domain: `All Settings`, `Portal Identity`, `Matchmaking Rules`, `Privacy & Safeguards`, `Finance & Tax`.

### B. Domain 1: Portal Identity & Head Office
- **Portal Brand Name:** Default: *"Sindhi Matrimony Admin Portal"*.
- **Support Helpline Phone:** Multi-line phone number displayed across user invoices and footers.
- **WhatsApp Support Number:** Direct WhatsApp helpline.
- **Support Email:** Contact email for grievances.
- **Corporate Head Office Address:** Legal registered address (e.g. *Bandra West, Mumbai, Maharashtra 400050*).

### C. Domain 2: Cultural Matchmaking Rules
- **Minimum Groom Age:** Enforced legal age (Default: `21`).
- **Minimum Bride Age:** Enforced legal age (Default: `18`).
- **Maximum Age Difference Threshold:** Maximum age gap allowed between prospective matches (Default: `5 years`).
- **Strict Gotra Exogamy Rule (`strictGotraExogamy`):** Toggle switch. When enabled, matchmaking engine hard-blocks recommendations where candidate and client share the same Gotra.
- **Horoscope Kundli Mode:** Dropdown: `MANDATORY`, `OPTIONAL`, `OFF`.
- **Daily Match Recommendation Quota:** Daily limit of proposals sent per member (Default: `10`).

### D. Domain 3: Privacy, Photos & Safeguards
- **Photo Watermarking (`photoWatermarking`):** Toggle switch. Auto-overlays semi-transparent "Sindhi Matrimony" brand watermark across uploaded images to prevent theft.
- **Blur Photos for Unpaid Visitors (`blurPhotosUnpaid`):** Toggle switch. Free members see blurred portrait thumbnails until they purchase a paid subscription.
- **Mandatory KYC Before Publishing (`mandatoryKycPublishing`):** Requires Aadhaar/Government ID verification before profile becomes discoverable in search.
- **Mobile Masking Style:** `PARTIAL` (e.g. `+91 98200 *****`) vs `STRICT` (Completely hidden until contact view credit is debited).
- **Allow Mobile App Screenshots (`allowAppScreenshots`):** Toggle switch enabling or disabling FLAG_SECURE on mobile apps.

### E. Domain 4: Finance, Tax & Invoicing Rules
- **Base Operational Currency:** Dropdown: `INR (₹)`, `USD ($)`, `AED (AED)`.
- **GST Rate Percentage:** Tax percentage added to subscriptions (Default: `18%`).
- **Auto-Invoicing on Payment:** Automatically generates and emails GST tax invoice upon gateway webhook confirmation.
- **Refund Window Policy (Days):** Number of days within which a subscriber can claim a refund (Default: `7 Days`).

### F. Domain 5: Gateway Integrations
- **SMS Sender ID:** Approved DLT 6-character sender ID (Default: `SINDHI`).
- **SMTP Mail Relay Host:** Corporate mail server (Default: `smtp.sendgrid.net`).
- **WhatsApp Cloud API Active:** Toggle connecting official WhatsApp Business API for proposal alerts.

---

## 4. 📊 Master Configuration Schema

```typescript
export interface MasterSettingsState {
  // Identity
  portalName: string;
  supportPhone: string;
  supportWhatsapp: string;
  supportEmail: string;
  headOffice: string;

  // Matchmaking
  maxAgeDifference: number;
  minGroomAge: number;
  minBrideAge: number;
  strictGotraExogamy: boolean;
  horoscopeMode: 'MANDATORY' | 'OPTIONAL' | 'OFF';
  dailyRecommendationLimit: number;

  // Privacy & Safeguards
  photoWatermarking: boolean;
  blurPhotosUnpaid: boolean;
  mandatoryKycPublishing: boolean;
  mobileMaskingStyle: 'PARTIAL' | 'STRICT';
  allowAppScreenshots: boolean;

  // Finance & Tax
  currency: string;
  gstRate: number;
  autoInvoicing: boolean;
  refundWindowDays: number;

  // Gateway IDs
  smsSenderId: string;
  smtpHost: string;
  whatsappApiActive: boolean;
}
```

---

## 5. 🔐 RBAC & Security Matrix

- **Allowed Role:** Strictly `SUPER_ADMIN` only.
- **Security Check:** Even `ADMIN` and `CRM_MANAGER` receive 403 Forbidden.
- **Tamper Resistance:** Changes are stored in secured browser storage key `sm_admin_master_settings_v1` and logged in compliance audits.

---

## 6. ⚡ Edge Cases & Error Handling

1. **Underage Configuration:** Validation prevents setting groom age < 21 or bride age < 18 to comply with Indian matrimonial law.
2. **Negative GST / Refund Days:** Input limits ensure tax and refund days cannot be set to negative values.
3. **Reset to Factory Defaults:** Confirmation dialog prevents accidental overwrite of customized business parameters.

---

## 7. 🔌 Associated Services & Data Entities

- **Screen Component:** `src/screens/masterSettingsScreen/MasterSettingsScreen.tsx`
- **Storage Key:** `sm_admin_master_settings_v1`
- **RBAC Validator:** `src/utils/rbac.ts`
- **Global Toast:** `src/toastMessage/toast.ts`
