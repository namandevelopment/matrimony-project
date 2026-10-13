# 🛡️ Section 12: Verification Desk (`/verifications`)

## 1. 📌 Overview & Theoretical Foundation (Theory)

### Business Purpose
Verification Desk portal ka **trust, safety, and content moderation firewall** hai. Matrimonial platforms par authenticity sabse bada trust factor hoti hai. Fake accounts, celebrities ke photos, watermarked social media pictures, ya fabricated age/income documents pure portal ki reputation barbad kar sakte hain. Verification Desk ensure karti hai ki koi bhi profile photo ya government KYC identity document public search aur candidate recommendations me dikhne se pehle manual human moderator dwara inspect aur approve kiya jaye.

### Key Conceptual Pillars
1. **Zero-Trust Publishing Gate:** User jab mobile app par photo ya Aadhaar card upload karta hai, toh wo direct public nahi hota. Uska initial status `PENDING_VERIFICATION` hota hai aur wo Verification Desk queue me queue-in ho jata hai.
2. **Dual Moderation Streams:**
   - **Profile Photo Moderation (`PHOTO`):** Inappropriate content, group pictures jisme candidate pehchana na ja sake, low-resolution images, ya copyright violation check.
   - **KYC Document Moderation (`ID_PROOF`):** Government ID (Aadhaar, Passport, PAN Card) par candidate ka Name, Date of Birth, aur Photo profile data se match karna.
3. **Audited Rejection Protocol:** Agar koi document reject hota hai, toh moderator ko mandatory rejection reason provide karna padta hai jo push notification aur email ke through candidate ko bheja jata hai taaki wo correct document dubara upload kare.

---

## 2. 🔄 Complete Step-by-Step Flow (End-to-End Workflow)

```
[Candidate Uploads Photo or Aadhaar on Mobile App]
                         │
                         ▼
[Queued in Verification Desk Queue (Status: PENDING)]
                         │
                         ▼
[Moderator Opens /verifications]
                         │
                         ├─► View Pending Approvals Counter Badge
                         └─► Review Moderation Grid (Cards with Image Previews)
                         │
[Moderator Inspects Document Card]
  ├── Document Matches Standards?
  │     ├── YES ──► Click "Approve" (Green Button)
  │     │           ├─► Removes item from queue
  │     │           ├─► Sets profile verified=true, awards ShieldCheck badge
  │     │           └─► User receives "Photo Verified" notification
  │     │
  │     └── NO  ──► Click "Reject" (Rose Button)
  │                 ├─► Opens ReasonModal
  │                 ├─► Select / type rejection reason (e.g. "Blurry ID", "Group photo")
  │                 ├─► Removes from queue, marks status='REJECTED'
  │                 └─► Push alert to user with re-upload instructions
```

---

## 3. 🛠️ Features & Admin Capabilities (इस स्क्रीन में क्या-क्या कर सकते हैं)

### A. Moderation Queue Header
- Header title and operational guidelines.
- Live Pending Counter Badge (e.g. `3 Pending Approvals`).

### B. Visual Inspection Cards Grid
- **Document Image Preview:** Aspect ratio 4:3 image container with high-clarity viewing.
- **Type Tag:** Badge distinguishing `Profile Photo` vs `KYC Document`.
- **Candidate Metadata:**
  - Full Name.
  - Subcaste (e.g. *Amil*, *Baibhand*, *Sahiti*).
  - Profile ID (e.g. `SIND001`, `SIND003`).
  - Upload Timestamp (e.g. *"10 mins ago"*, *"1 hour ago"*).

### C. Moderation Action Bar
- **Approve Button (`ShieldCheck` icon):**
  - Single tap approves the item.
  - Updates member's verification flag in real-time.
- **Reject Button (`XCircle` icon):**
  - Triggers `ReasonModal` preventing arbitrary rejections without explanation.
  - Records reason in member's audit log.

### D. All Caught Up Empty State
- Jab queue empty ho jaati hai, animated Green Checkmark icon aur *"All Caught Up! There are no pending photos or documents in the moderation queue"* message display hota hai.

---

## 4. 📊 Verification Decision Matrix

| Verification Type | Approval Criteria | Common Rejection Reasons |
|---|---|---|
| **Profile Photo** | Clear face, solo portrait, good lighting, authentic candidate | Group photo, sunglasses covering eyes, celebrity photo, cartoon avatar, watermark |
| **Aadhaar KYC** | Name matches profile, DOB matches age, clear QR code / UID | Blurry image, Name mismatch, DOB discrepancy > 1 year, expired document |
| **Salary Slip** | Company name matches employer, income bracket aligns | Fake payslip format, missing company seal, mismatch with reported LPA |

---

## 5. 🔐 RBAC & Security Matrix

- **Allowed Roles:** `SUPER_ADMIN`, `ADMIN`, `MODERATOR`.
- **PII Data Redaction:** Government Aadhaar numbers ke pehle 8 digits masked hone chahiye (Aadhaar compliance regulations).

---

## 6. ⚡ Edge Cases & Error Handling

1. **Simultaneous Moderation by Two Staff:** Agar do moderators ek hi item ko simultaneously open karein, pehla action accept hota hai aur dusre ke screen se item automatically vanish ho jata hai.
2. **Re-upload Cycle:** Rejected candidate dubara upload kare toh new timestamp ke saath queue ke top par place hota hai.

---

## 7. 🔌 Associated Services & Data Entities

- **Screen Component:** `src/screens/verificationScreen/VerificationScreen.tsx`
- **Data Entities:** `QueueItem` (`id`, `type`, `name`, `subcaste`, `profileId`, `imageUrl`, `uploadedAt`)
- **Modals:** `src/customModals/ReasonModal.tsx`
- **Services:** `src/services/memberDataService.ts`
