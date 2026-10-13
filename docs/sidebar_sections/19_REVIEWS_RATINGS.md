# ⭐ Section 19: Reviews & Ratings Moderation Desk (`/reviews`)

## 1. 📌 Overview & Theoretical Foundation (Theory)

### Business Purpose
Customer satisfaction, RM service ratings aur platform feedback brand equity ki backbone hote hain. Jab prospective brides, grooms aur unke parents feedback dekhte hain, toh wo genuine experience dhoondte hain.
**Reviews & Ratings Desk (`/reviews`)** admin ko platform par submit kiye gaye sabhi member reviews ko moderate karne, abusive/spam content filter out karne, aur 5-star ratings ko public website/app par approve/publish karne ka complete control deta hai.

### Key Conceptual Pillars
1. **Moderated Publishing Pipeline:** Reviews default roop se direct live nahi hote. Unka status `PENDING` hota hai, jab tak moderator unhe check karke `APPROVED` ya `REJECTED` na kare.
2. **Sentiment & Rating Analytics:** Platform average rating (e.g. 4.8 / 5.0) aur rating breakdown (5★, 4★, 3★, 2★, 1★) track karta hai.
3. **Verified Member Attribution:** Har review ke saath member profile ID, relationship type (Self, Parent, Sibling), aur plan type link hota hai.

---

## 2. 🔄 Complete Step-by-Step Flow (End-to-End Workflow)

```
[Member Submits Rating & Review on Mobile App]
                         │
                         ▼
[Queued in Reviews Moderation Queue (/reviews)]
  - Initial Status: 'PENDING'
                         │
                         ▼
[Moderator Inspects Review Card]
  ├── Star Rating (1 to 5 Stars)
  ├── Reviewer Profile ID & Subcaste
  ├── Review Text & Title
  └── Submission Timestamp
                         │
                         ▼
[Moderation Decision]
  ├── Approve (Green Button) ──► Status becomes 'APPROVED' (Visible on web)
  ├── Reject (Rose Button)   ──► Status becomes 'REJECTED' (Suppressed)
  └── Delete (Trash)         ──► Permanently removed
```

---

## 3. 🛠️ Features & Admin Capabilities

### A. Real-Time Rating KPIs
- **Average Rating:** Out of 5.0 scale with star visualizer.
- **Total Reviews:** Total feedback counts across the platform.
- **Pending Moderation Badge:** Count of new reviews awaiting human approval.

### B. Filter Bar
- **Status Filter:** All, Pending, Approved, Rejected.
- **Rating Filter:** 5 Stars down to 1 Star.
- **Search:** Search by reviewer name, profile ID, or review text keywords.

### C. 1-Click Moderation Actions
- **1-Click Approve:** Instantly publishes verified positive review to public landing pages.
- **1-Click Reject:** Hides spam, irrelevant, or inappropriate submissions without deleting audit record.

---

## 4. 🔐 RBAC & Security Clearances

- **Allowed Roles:** `SUPER_ADMIN`, `ADMIN`, `MODERATOR`.
- **Restricted:** Standard calling agents cannot alter or approve reviews.

---

## 5. 🔌 Associated Services & Data Entities

- Types: `MemberReview` in `crm.types.ts`.
- Service: `crmDataService.getMemberReviews()`, `updateReviewStatus()`, `deleteReview()`.
