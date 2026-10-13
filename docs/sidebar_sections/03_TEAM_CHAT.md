# 💬 Section 03: Team Chat (`/chat`)

## 1. 📌 Overview & Theoretical Foundation (Theory)

### Business Purpose
Team Chat portal ka internal, secure real-time messaging hub hai. Matrimonial agency me lead handovers, customer escalations, verification exceptions, aur urgent matchmaker briefings ke liye employees ko instant communication channel ki zaroorat hoti hai. External tools (jaise personal WhatsApp ya Telegram) par customer data leak hone ka risk hota hai. Team Chat portal ke andar rehte huye 100% audited internal collaboration allow karta hai.

### Key Conceptual Pillars
1. **Confidential Internal Collaboration:** Super Admin, CRM Managers, Matchmakers, aur Call Agents ke beech direct 1-on-1 communication bina third-party platform dependancy ke.
2. **Contextual Lead Attachment:** Chat message ke saath direct kisi CRM Lead ka reference card attach kiya ja sakta hai taaki samne wale colleague ko context samajhne ke liye lead ID manually search na karni pade.
3. **Real-time Badge Telemetry:** Jab koi naya message receive hota hai, sidebar ke "Team Chat" icon par dynamic red badge increment hota hai. Jaise hi user chat open karta hai, status auto `READ` mark hota hai.

---

## 2. 🔄 Complete Step-by-Step Flow (End-to-End Workflow)

```
[User Navigates to /chat or Clicks Chat Icon from Employee Directory]
         │
         ▼
[Resolve Session User & Partner]
  ├── Default for Super Admin ──► Priya Sharma (CRM Manager)
  ├── Default for Employee    ──► Rajesh Mulchandani (Super Admin)
  └── Query Param ?empId=...  ──► Auto-select targeted colleague
         │
         ▼
[Load Colleague Directory (Left Pane) & Message Thread (Right Pane)]
         │
         ├─► Mark incoming messages from active partner as READ
         ├─► Decrement sidebar unread counter badge
         └─► Auto-scroll thread container smoothly to latest message
         │
[User Interactions in Chat]
  ├── Type Message & Hit Enter/Send ──► Saves message to crmDataService, emits live event
  ├── Click Canned Response Chip ─────► Instantly prefills or sends common operational message
  ├── Click Paperclip (Attach Lead) ──► Opens lead selector modal, pins Lead Dossier Card
  ├── Search Colleague Directory ─────► Instant live filter by name, department, role
  └── Mobile Screen ──────────────────► Back arrow toggles between Colleague List & Chat Pane
```

---

## 3. 🛠️ Features & Admin Capabilities (इस स्क्रीन में क्या-क्या कर सकते हैं)

### A. Colleague Directory (Left Pane)
- **Directory Search Input:** Name, department (Operations, Sales, Moderation), ya designation se filter.
- **Colleague List Item:**
  - Colleague avatar with status indicator (Green dot for online).
  - Colleague full name, role badge (`CRM_AGENT`, `FINANCE_MANAGER`, etc.).
  - Last message preview and timestamp.
  - Red unread messages counter bubble.

### B. Chat Header & Partner Dossier
- Active colleague's avatar, full name, role, email, and department.
- "Verified Staff" badge.
- Mobile view Back Button (`ChevronLeft`) to return to colleague directory.

### C. Message Conversation Thread (Center Pane)
- **Message Bubbles:** Royal Ruby Crimson (`#88131B`) styling for sent messages; Slate grey for received messages.
- **Timestamp & Read Receipt:** Delivery time and double-check read receipts.
- **Embedded Lead Dossier Card:**
  - Agar kisi message me lead attach ki gayi hai, toh chat bubble ke andar ek interactive lead card render hota hai.
  - Lead ID, Name, Subcaste, Budget, aur Status show hota hai.
  - "Open in CRM" link par click karke direct us lead ki detail open ki ja sakti hai.

### D. Message Input Toolbar (Bottom)
- **Multi-line Text Input:** Custom input with `Enter` to send support.
- **Paperclip Lead Attachment Tool (`Paperclip` icon):**
  - Opens searchable modal of all active leads.
  - Select lead -> Attaches lead reference chip above text input.
- **Canned Responses / Quick Chips:**
  - *"Please prioritize lead follow-up today."*
  - *"Verification docs approved for this candidate."*
  - *"Client requested callback at 4 PM."*
- **Send Button:** Royal Ruby rounded button with `Send` icon.

---

## 4. 🔐 RBAC & Security Matrix

- **Allowed Roles:** All authenticated roles (`SUPER_ADMIN`, `ADMIN`, `CRM_MANAGER`, `CRM_AGENT`, `FINANCE_STAFF`, `MODERATOR`).
- **Data Isolation:** Employees can only see conversations where they are either sender or recipient.
- **Audit Trails:** Super Admin can audit conversation logs in case of dispute or compliance verification.
- **External Export Ban:** Copying messages with sensitive customer phone numbers is monitored by internal portal policies.

---

## 5. ⚡ Edge Cases & Error Handling

1. **Auto-Scroll Isolation:** Chat auto-scroll exclusively messages container ke andar chalta hai (`chatMessagesContainerRef.current.scrollTo`). Window ya left-hand directory list kabhi jump ya jitter nahi karti.
2. **Deep-linking from Employee Directory:** Employee screen se chat icon dabane par `/chat?empId=emp_005` open hota hai. Screen query param read karke auto-select karti hai bina manual search kiye.
3. **Empty Message Validation:** Blank spaces ya whitespace-only messages send button se block hote hain.

---

## 6. 🔌 Associated Services & Data Entities

- **Screen Component:** `src/screens/chatsScreen/TeamChatScreen.tsx`
- **Data Service:** `src/services/crmDataService.ts` (`getTeamChatMessages`, `sendTeamChatMessage`, `markMessagesAsRead`)
- **Data Models:** `TeamChatMessage` (`id`, `senderId`, `recipientId`, `message`, `attachedLeadId`, `timestamp`, `isRead`)
- **Storage/Event Subscriptions:** `crmDataService.subscribe()`
