# 📄 Section 21: 1-Click WhatsApp Biodata Maker & Formatter (`Member 360° -> Biodata`)

## 1. 📌 Overview & Theoretical Foundation (Theory)

### Business Purpose
Indian aur Sindhi matrimonial matchmaking me **Biodata PDF** sabse pehla aur sabse critical decision-making document hota hai jo families WhatsApp par aapas me exchange karti hain.
Lekin traditional matrimonial portals me 3 bade risk hote hain:
1. **Uncontrolled PII Leaks (Privacy Risk):** Kisi stranger ya unvetted lead ko direct phone number, email ya residential street address share karne se candidate stalk ya harass ho sakta hai.
2. **Ugly / Cluttered Formatting:** Generic text messages ya screenshot images print aur review karne me unprofessional lagte hain.
3. **WhatsApp Web "Fake Attachment" Fallback Confusion:** WhatsApp Web API (`wa.me` ya `web.whatsapp.com`) text prefill toh karti hai, lekin browser security sandbox ki wajah se local storage se bina user confirmation ke file auto-attach nahi kar sakti. Portal ko clear, step-by-step guidance deni chahiye taaki operator ko exact process pata ho.

**1-Click WhatsApp Biodata Maker & Formatter** in teeno samasyaon ko permanently solve karta hai:
- **Two High-Fidelity A4 Templates:** Traditional (Royal Maroon & Gold with optional Om/Ganesh motif) aur Modern Minimal (Clean White & Slate).
- **Two Privacy Modes:** Blind Biodata (Server-side allowlist: phone/email/address masked) aur Full Biodata (Authorized RM / Super Admin only).
- **1-Click WhatsApp Dispatch:** A4 PDF download karke WhatsApp Web open karta hai with candidate essentials and clear attachment guidance.

---

## 2. 🔄 Complete Step-by-Step Flow (End-to-End Workflow)

```
[Relationship Manager / Admin Opens Member Profile 360°]
                         │
                         ▼
[Clicks "Generate Biodata PDF" Button (Emerald Action)]
                         │
                         ▼
[Interactive Biodata Generator Modal Opens]
  ├── Shows Member Verification Badge & Completeness Score (e.g. 95%)
  ├── Displays Missing Field Warnings (if any non-critical fields empty)
  │
  ├── Step 1: Select Template
  │     ├── Traditional (Cream, Maroon #88131B, Gold #C59B27 borders)
  │     └── Modern Minimal (White, Slate #0F172A, Ruby red badges)
  │
  ├── Step 2: Select Privacy Protection Mode
  │     ├── Blind Biodata (Default): Phone, Email, Street Address physically masked
  │     └── Full Biodata: Requires Super Admin / RM Manager role + member consent
  │
  ├── Step 3: Toggle Auspicious Motif (Om / Shree Ganeshaya Namah)
  │
  ├── Step 4: Live 1:1 A4 Preview Updates in Real-Time
  │
  └── Step 5: Choose Output Action:
        ├── A. "Download PDF" ──► Instant A4 jsPDF vector export
        ├── B. "Print" ──► Opens browser print preview dialog
        ├── C. "Copy WhatsApp Text" ──► Copies formatted summary to clipboard
        └── D. "Download & Share on WhatsApp":
               ├─► Generates & downloads PDF file to Downloads folder
               ├─► Copies formatted candidate message
               ├─► Launches WhatsApp Web with prefilled message
               ├─► Opens Guidance Dialog ("Click paperclip 📎 to attach PDF")
               └─► Writes immutable audit log & CRM timeline event
```

---

## 3. 🛠️ Features & Admin Capabilities

### A. Template Visual Systems
1. **Traditional Matrimonial Template:**
   - Background: Warm Cream (`#FDFBF7`).
   - Accents: Royal Ruby Maroon (`#88131B`) title ribbons, Gold ornamental borders (`#C59B27`).
   - Header: Optional Auspicious Om / Ganesh Shlok (`|| श्री गणेशाय नमः ||`).
   - Clear sections: Personal Profile, Education & Profession, Astro & Kundli, Family Heritage, RM Contact Desk.
2. **Modern Minimalist Template:**
   - Background: Pure White (`#FFFFFF`).
   - Accents: Slate-900 typography, Ruby accent line, clean 3-column metric cards.
   - Professional corporate & contemporary aesthetic.

### B. Server-Enforced Field Allowlist (Never Just UI Hidden)
- Privacy is enforced at data payload construction time (`biodataService.buildBiodataPayload`).
- Sensitive fields (`mobile`, `email`, `address`, CRM staff notes) are omitted from the object payload in Blind mode so they can never leak in PDF metadata or network calls.

### C. Live Interactive A4 Simulation Preview
- Modal exhibits a 1:1 scaled aspect ratio `1 : 1.414` (A4 standard) canvas showing exactly how the document will print.
- Dynamic updates when changing template, switching privacy mode, or toggling auspicious symbols.

### D. WhatsApp Sharing & Telephony Workflow
- Formatted bold WhatsApp markdown text with candidate age, height, subcaste, gotra, education, profession, location, and RM contact.
- Formats `https://web.whatsapp.com/send?phone=...&text=...` or general `https://web.whatsapp.com/send?text=...`.
- Honest attachment instructions prompt ensures staff attaches the generated PDF smoothly.

---

## 4. 📊 Privacy Protection Allowlist Matrix

| Field Category | Field Name | Blind Biodata Mode | Full Biodata Mode |
|---|---|:---:|:---:|
| **Identity** | Candidate Full Name | ✅ Included | ✅ Included |
| **Identity** | Profile Unique ID | ✅ Included | ✅ Included |
| **Identity** | Age & Date of Birth | ✅ Included | ✅ Included |
| **Community** | Sindhi Subcaste & Gotra | ✅ Included | ✅ Included |
| **Physical** | Height & Diet Preference | ✅ Included | ✅ Included |
| **Academic** | Highest Education Degree | ✅ Included | ✅ Included |
| **Career** | Profession & Company Type | ✅ Included | ✅ Included |
| **Finance** | Annual Income Bracket | ✅ Included | ✅ Included |
| **Astro** | Manglik Status & Birth City | ✅ Included | ✅ Included |
| **Family** | Father/Mother Names & Occupations | ✅ Included | ✅ Included |
| **Family** | Siblings Count & Native City | ✅ Included | ✅ Included |
| **Contact** | Direct Mobile Number | ❌ **Masked / Excluded** | ✅ **Included (Authorized)** |
| **Contact** | Direct Email Address | ❌ **Masked / Excluded** | ✅ **Included (Authorized)** |
| **Contact** | Detailed Home Street Address | ❌ **Masked / Excluded** | ✅ **Included (Authorized)** |
| **Internal** | CRM Staff Notes & Call Logs | ❌ **Strictly Blocked** | ❌ **Strictly Blocked** |
| **Internal** | Passwords & Auth Tokens | ❌ **Strictly Blocked** | ❌ **Strictly Blocked** |

---

## 5. 🔐 RBAC & Security Clearances

- **Blind Biodata Generation:** `ALL_ROLES` (Super Admin, Operations Admin, CRM Manager, CRM Agent, Moderator).
- **Full Biodata Generation:** `SUPER_ADMIN`, `ADMIN`, `CRM_MANAGER` only.
- **Unauthorized Downgrade Defense:** If a standard `CRM_AGENT` attempts to forge an API call requesting `FULL` mode, `BiodataService` immediately downgrades the payload to `BLIND` mode and logs a `BIODATA_ACCESS_DENIED` security audit event.
- **Immutable Audit Trail:** All PDF generation and WhatsApp share actions record:
  - Event Type (`BIODATA_GENERATION_REQUESTED`, `BIODATA_DOWNLOAD_REQUESTED`, `BIODATA_SHARE_INITIATED`)
  - Employee ID & Name
  - Member Unique ID
  - Privacy Mode & Template
  - Recipient Phone Number
  - Unique Correlation ID (`req_...`)

---

## 6. ⚡ Edge Cases & Error Handling

1. **Extreme String Lengths:** Multi-line occupations or 800+ character family bios are dynamically wrapped using jsPDF `splitTextToSize` without text clipping or overlapping.
2. **Missing Optional Fields:** Handled gracefully with clean em-dash (`—`) placeholders without breaking document structure.
3. **No Photograph:** Renders clean placeholder avatar box maintaining exact A4 aspect ratio.
4. **WhatsApp Web Sandbox:** Clearly instructs user on how to attach the downloaded PDF file, avoiding false promises of auto-attachment.

---

## 7. 🔌 Underlying Architecture

### TypeScript Types ([biodata.types.ts](file:///Users/naman/Documents/CRM%20Landing%20Projects/Matrimony%20Project/sindiMatrimonyAdmin/src/types/biodata.types.ts))
- `BiodataTemplateId`: `'TRADITIONAL' | 'MODERN_MINIMAL'`
- `BiodataPrivacyMode`: `'BLIND' | 'FULL'`
- `BiodataRenderPayload`: Sanitized allowlisted export payload.
- `BiodataAuditLogEntry`: Audit record model.

### Service Layer ([biodataService.ts](file:///Users/naman/Documents/CRM%20Landing%20Projects/Matrimony%20Project/sindiMatrimonyAdmin/src/services/biodataService.ts))
- `calculateCompleteness(member)`
- `buildBiodataPayload(member, privacyMode, empId, empName, role, templateId)`
- `generateBiodataPdf(templateId, payload, config)`
- `formatWhatsAppBiodataMessage(payload, customNote)`
- `generateWhatsAppShareUrl(recipientPhone, messageText)`
- `recordAuditEvent(entry)`

### UI Modal ([BiodataGeneratorModal.tsx](file:///Users/naman/Documents/CRM%20Landing%20Projects/Matrimony%20Project/sindiMatrimonyAdmin/src/customModals/BiodataGeneratorModal.tsx))
- Scaled live A4 interactive preview canvas.
- Real-time template & privacy mode toggling.
- 1-Click WhatsApp download & share pipeline with instructions modal.
