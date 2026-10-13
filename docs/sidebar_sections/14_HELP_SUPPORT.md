# 🆘 Section 14: Help & Support (`/help-support`)

## 1. 📌 Overview & Theoretical Foundation (Theory)

### Business Purpose
Help & Support screen portal staff aur relationship managers ke liye **direct operational assistance, emergency technical hotline, ticketing helpdesk, aur knowledge base** hai. Admin portal par daily operation ke dauran agents ko technical glitches (e.g. VoIP call drop, payment gateway failure, missing Gotra records, unreceived customer OTPs) ka samna karna pad sakta hai. Help & Support screen instant escalation pathways provide karti hai taaki client deals delay na hon.

### Key Conceptual Pillars
1. **Multi-Tier Support Architecture:**
   - **Emergency Hotline:** Immediate phone assistance for business-critical blockers.
   - **Direct WhatsApp Executive Chat:** 1-click WhatsApp web launch for rapid query clearing.
   - **Formal Ticket Raising Desk:** Audited support tickets for bug reports, billing adjustments, and permission requests.
   - **Self-Service Knowledge Base (FAQ):** Accordion-based troubleshooting guides covering portal SOPs (Standard Operating Procedures).
2. **Contextual Staff Dossier:** Jab koi agent ticket raise karta hai, ticket automatically agent ka name, email, role, aur timestamp capture kar leta hai bina redundant data entry ke.

---

## 2. 🔄 Complete Step-by-Step Flow (End-to-End Workflow)

```
[Staff Member Opens /help-support]
         │
         ▼
[Mount HelpSupportScreen & Fetch supportService Data]
         │
         ├─► Render Direct Emergency Hotline & WhatsApp Contact Cards
         ├─► Render "Raise a Support Ticket" Form
         ├─► Render "Active Tickets & Escalations" List
         └─► Render Searchable FAQ Knowledge Base
         │
[User Actions]
  ├── Click "Copy Phone / Email" ────► Copies to clipboard with toast feedback
  ├── Click "Open WhatsApp" ─────────► Opens WhatsApp chat in new browser tab
  ├── Fill Ticket Form & Submit ─────► Generates unique SupportTicket, emits update
  ├── Click Any Existing Ticket ─────► Opens Ticket Conversation Modal
  │                                    ├─► Read admin replies
  │                                    ├─► Send reply message
  │                                    └─► Click "Mark as Resolved"
  └── Search FAQ Accordion ──────────► Instant filter on questions and answers
```

---

## 3. 🛠️ Features & Admin Capabilities (इस स्क्रीन में क्या-क्या कर सकते हैं)

### A. Direct Emergency Contact Cards
- **Emergency Phone Hotline:** Number with copy-to-clipboard button (`+91 98200 99881`).
- **Direct WhatsApp Executive Chat:** Clickable link opening WhatsApp chat (`+91 98200 99882`).
- **Priority Email Support:** Copyable email (`helpdesk@sindhimatrimony.com`).

### B. Ticket Raising Desk (`handleCreateTicket`)
- **Category Selector Dropdown:**
  - `CRM_LEADS`: Calling glitches, unassigned lead bugs, 20-batch issues.
  - `MATCHMAKING`: Compatibility engine discrepancies, wrong Gotra alert.
  - `BILLING_PAYMENT`: Payment gateway reconciliation, refund escalation.
  - `SYSTEM_BUG`: UI glitches, slow loading, login failures.
  - `ACCESS_PERMISSION`: Requesting access to additional sidebar sections.
- **Priority Selector:** `LOW`, `NORMAL`, `HIGH`, `URGENT`.
- **Subject Input:** Concise title of the problem.
- **Description Textarea:** Detailed explanation of the issue with error notes.
- **Submit Button:** Single tap creates ticket, shows toast confirmation, and clears form.

### C. Active Tickets & Escalation Desk
- Displays all tickets created by the logged-in staff member or open across the system.
- Ticket ID (`TICK-901`), Subject, Category Tag, Priority Badge.
- Status indicator: `OPEN` (Amber), `IN_PROGRESS` (Blue), `RESOLVED` (Green), `CLOSED` (Slate).
- **Interactive Ticket Thread Modal:**
  - View chronological replies between agent and technical admin.
  - Reply input box to add updates or screenshots.
  - "Mark Resolved" button.

### D. Searchable FAQ Knowledge Base (`FAQ_LIST`)
- Search bar to search across FAQs by keyword.
- Expandable / Collapsible accordions with smooth toggle animation.
- Topics covered:
  - *How does the 20-lead allocation limit work?*
  - *What should I do if a payment is deducted but member is not upgraded?*
  - *How do I request access to additional sidebar modules?*
  - *How are Gotra compatibility rules verified?*
  - *What is the standard procedure for refund approvals?*

---

## 4. 📊 Support Ticket Lifecycle

```
[OPEN] ──► [IN_PROGRESS] ──► [RESOLVED] ──► [CLOSED]
```

---

## 5. 🔐 RBAC & Security Matrix

- **Allowed Roles:** All authenticated roles (`ALL_ROLES`).
- **View Scope:** Staff members see their own submitted tickets; `SUPER_ADMIN` and `ADMIN` see all organizational support tickets.

---

## 6. ⚡ Edge Cases & Error Handling

1. **Empty Fields:** Form enforces non-empty subject and description before submitting.
2. **Clipboard Permissions:** Graceful fallback if browser clipboard API is blocked.

---

## 7. 🔌 Associated Services & Data Entities

- **Screen Component:** `src/screens/helpSupportScreen/HelpSupportScreen.tsx`
- **Data Service:** `src/services/supportService.ts` (`getTickets`, `createTicket`, `replyTicket`, `resolveTicket`)
- **Data Models:** `SupportTicket`, `TicketCategory`, `TicketPriority`
