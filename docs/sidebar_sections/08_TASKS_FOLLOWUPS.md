# ⏰ Section 08: Tasks & Follow-ups (`/tasks`)

## 1. 📌 Overview & Theoretical Foundation (Theory)

### Business Purpose
Tasks & Follow-ups screen CRM pipeline ka **operational execution calendar aur SLA accountability engine** hai. Matrimonial decision-making long-cycle process hota hai — parents pehli call par turant decision nahi lete. Unhe kundli milani hoti hai, family me discuss karna hota hai, ya salary slips verify karni hoti hain. Agar telecaller timely callback na kare, toh prospect competitor platform par chala jata hai. Tasks screen ensure karti hai ki ek bhi prospective lead ya member follow-up miss na ho.

### Key Conceptual Pillars
1. **SLA Adherence & Overdue Escalation:**
   - Tasks me due date aur specific due time (`11:30 AM`) hota hai.
   - Agar task due time cross hone ke 2 ghante baad tak uncompleted rahe, toh wo automatically `OVERDUE` mark ho jata hai aur Notifications me escalation alert trigger hoti hai.
2. **Multi-Channel Task Modalities:**
   - `CALL`: Telephonic conversation for profile inquiry or closing.
   - `WHATSAPP`: Sending curated biodatas or payment link.
   - `EMAIL`: Formal agreement or invoice dispatch.
   - `MEETING`: Physical or virtual matchmaking family conference.
   - `VERIFICATION_VISIT`: Home/Office visit for high-net-worth VIP profile verification.
3. **Automated vs Manual Creation:**
   - Leads screen par "Call Later" disposition choose karne par system automatically yahan task generate karta hai.
   - Agent kisi bhi waqt "+ New Task" modal se ad-hoc reminder create kar sakta hai.

---

## 2. 🔄 Complete Step-by-Step Flow (End-to-End Workflow)

```
[Agent Navigates to /tasks]
         │
         ▼
[Mount TasksScreen & Sync with crmDataService]
         │
         ├─► Calculate Counts: All Tasks, Due Today, Overdue, Completed
         ├─► Apply Status Filter (ALL / PENDING / OVERDUE / COMPLETED)
         └─► Render Task Cards with Priority Badges
         │
[User Interactions]
  ├── Click "+ Create Task" ──────► Opens New Task Modal
  │                                 ├─► Select Client / Lead ID
  │                                 ├─► Select Task Type (Call, WhatsApp, Meeting, etc.)
  │                                 ├─► Set Due Date, Time, Priority & Assignee
  │                                 └─► Validate & Save (Form validation enforced)
  ├── Click "Mark Complete" ──────► Sets status='COMPLETED', logs completion timestamp
  ├── Search Tasks Input ─────────► Real-time search by Client Name, Task ID, Assignee, Notes
  └── Click "Call Client" ────────► Directly opens telecalling widget for that task
```

---

## 3. 🛠️ Features & Admin Capabilities (इस स्क्रीन में क्या-क्या कर सकते हैं)

### A. Status Filter Bar & Counts
- **All Tasks:** Total count of active and closed tasks.
- **Pending / Due Today:** Action items scheduled for current working day.
- **Overdue (Red Alert):** Tasks whose scheduled deadline has lapsed without completion.
- **Completed:** History of executed tasks with completion timestamps.

### B. Create Task Modal (`isNewTaskModalOpen`)
- **Client Selector:** Select from active client roster (`SIND001`, `SIND002`, etc.).
- **Task Type Dropdown:** Choose between `CALL`, `WHATSAPP`, `EMAIL`, `MEETING`, `VERIFICATION_VISIT`.
- **Due Date & Time Pickers:** Date selection with time slot (e.g. `2:00 PM`).
- **Priority Selector:** `LOW`, `NORMAL`, `HIGH`, `URGENT`.
- **Assignee Dropdown:** Allocate task to self or delegate to another active colleague.
- **Mandatory Notes Field:** Contextual memo (minimum 5 characters required).

### C. Task Cards View
- Visual Channel Icon (`Phone` for Call, `MessageSquare` for WhatsApp, etc.).
- Priority Ribbon (`Crimson` for High/Urgent, `Amber` for Normal).
- Client Name & Unique ID.
- Due Date & Due Time indicator.
- Action Notes explaining the follow-up agenda.
- Assigned Agent name with avatar.
- **One-Click Completion Checkbox:** Single tap marks task as resolved with animated checkmark and green toast notice.

---

## 4. 📊 Task Type & Status Matrix

| Task Type | Icon | Default SLA Duration | Typical Scenario |
|---|---|---|---|
| **CALL** | Phone | 24 Hours | Customer requested callback after 6 PM |
| **WHATSAPP** | MessageSquare | 4 Hours | Share shortlisted candidate biodatas |
| **MEETING** | Users | 48 Hours | Schedule bride & groom families video conference |
| **EMAIL** | Mail | 12 Hours | Dispatch Till-Marriage membership contract |
| **VERIFICATION_VISIT** | ShieldCheck | 72 Hours | On-site address & family background verification |

---

## 5. 🔐 RBAC & Security Matrix

- **Allowed Roles:** `SUPER_ADMIN`, `ADMIN`, `CRM_MANAGER`, `CRM_AGENT`.
- **Scope Restriction:** `CRM_AGENT` sees only tasks assigned to themselves. `CRM_MANAGER` and `SUPER_ADMIN` can inspect and reassign tasks across all team members.

---

## 6. ⚡ Edge Cases & Error Handling

1. **Past Date Selection:** Form validation automatically prevents scheduling a task with a past timestamp.
2. **Auto-Complete on Successful Conversion:** Agar koi lead Convert ho jaati hai, toh uske related pending follow-up call tasks automatically resolve mark ho jaate hain.

---

## 7. 🔌 Associated Services & Data Entities

- **Screen Component:** `src/screens/tasksScreen/TasksScreen.tsx`
- **Data Service:** `src/services/crmDataService.ts` (`getTasks`, `addTask`, `completeTask`)
- **Data Models:** `FollowUpTask` (`taskId`, `clientId`, `clientName`, `taskType`, `dueDate`, `dueTime`, `priority`, `status`, `notes`, `assignedEmployeeId`)
- **Form Hook:** `useInputs` custom hook managing form validation and pristine/touched states.
