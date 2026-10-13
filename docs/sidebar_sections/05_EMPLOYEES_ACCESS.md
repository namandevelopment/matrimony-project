# 🛡️ Section 05: Employees & Access (`/employees`, `/employees/:id`)

## 1. 📌 Overview & Theoretical Foundation (Theory)

### Business Purpose
Employees & Access portal ka **Identity, Governance, and Role-Based Access Control (RBAC)** powerhouse hai. Matrimonial CRM me employee access ko tightly control karna sabse critical compliance requirement hoti hai — kyunki platform par hazaron Sindhi parivaron ke private phone numbers, photographs, financial income brackets, aur sensitive family biodatas hote hain. Kisi call center agent ko finance ledger dekhne ki permission nahi honi chahiye, aur kisi moderator ko employee passwords reset karne ka access nahi hona chahiye.

### Key Conceptual Pillars
1. **Three-Tier Access Architecture:**
   - **Role Hierarchy:** System standard roles define karta hai (`SUPER_ADMIN`, `ADMIN`, `CRM_MANAGER`, `CRM_AGENT`, `FINANCE_MANAGER`, `FINANCE_STAFF`, `MODERATOR`, `ANALYST`).
   - **Record Scope Isolation:** Record visibility teen levels par lock hoti hai:
     - `OWN`: Agent sirf apni assigned leads/members dekh sakta hai.
     - `TEAM`: Manager apni poori team ke records inspect kar sakta hai.
     - `ALL`: Super Admin platform ke sabhi records access kar sakta hai.
   - **Granular Sidebar Section Clearance:** Har employee ke profile par individually configure kiya ja sakta hai ki uske sidebar me kaun se sections dikhenge (e.g. only `leads` and `tasks`).
2. **Simulation & Impersonation Engine:** Super Admin kisi bhi employee ke "Simulate Login" button par click karke us employee ka live view dekh sakta hai. Isse verify hota hai ki permission restrictions sahi se kaam kar rahi hain ya nahi.
3. **Audit Trails for Permission Changes:** Har permission ya role change immutable audit log (`PermissionChangeAudit`) me record hoti hai (Admin name, timestamp, previous permission vs new permission).

---

## 2. 🔄 Complete Step-by-Step Flow (End-to-End Workflow)

```
[Super Admin Opens /employees]
         │
         ▼
[Mount Employee Directory & RBAC Matrix]
         │
         ├─► Render KPI Metric Cards (Active Staff, Admins, CRM Agents, Inactive)
         ├─► Render Search & Filters (Department, Role, Status)
         └─► Render Employee DataTable with Action Buttons
         │
[Actions Available on Employee Record]
  ├── Click "+ Add Employee" ───────► Opens Add Employee Wizard (7 fields + sidebar checkboxes)
  ├── Click "Permissions / Lock" ───► Opens Granular RBAC Permissions Modal (View/Edit/Export matrix)
  ├── Click "Simulate Login" ───────► Enters impersonation mode (Sidebar re-renders instantly)
  ├── Click "Toggle Active/Deactivate"► Prompts reason modal, revokes login credentials
  ├── Click "Chat Icon" ────────────► Redirects to /chat?empId=... for direct team messaging
  └── Click "Employee Name" ────────► Navigates to /employees/:id (Employee 360° Management)
```

### Detailed Operational Steps:
1. **Add Employee Flow:**
   - Admin "+ Add Employee" button click karta hai.
   - Form inputs: Full Name, Employee ID (auto or custom), Official Email, Mobile Number, Department, Reporting Manager, Max Lead Capacity (e.g. 25), Regions (e.g. Mumbai, Pune), Languages spoken (Sindhi, Hindi, English).
   - Roles selection (Supports single role or multi-role union).
   - Sidebar Section Selection: Checkboxes for which sections should appear in the employee's sidebar.
   - Client-side validation: E.164 phone validation, email format, and unique employee ID check.
   - Save hone par employee record reactive store me persist ho jata hai.
2. **Granular Permission Customization Flow:**
   - Row par "Shield / Lock" icon click karne par modal open hota hai.
   - Matrix me har module (Leads, Members, Finance, Verifications, Settings) ke aage 5 checkboxes hote hain: *Can View*, *Can Create*, *Can Edit*, *Can Delete*, *Can Export*.
   - Record Scope Radio: `OWN` vs `TEAM` vs `ALL`.
   - Save karne par diff calculate hota hai aur toast ke saath audit log record ho jata hai.
3. **Impersonation Flow:**
   - Admin kisi agent (jaise Manoj Varma) ke aage "Simulate" dabata hai.
   - Top bar par yellow notice show hota hai: *"You are currently simulating Manoj Varma (CRM Agent)"*.
   - Sidebar turant adjust ho kar sirf Manoj ke allowed sections dikhata hai.
   - "Exit Simulation" dabane par Super Admin access restore ho jata hai.

---

## 3. 🛠️ Features & Admin Capabilities (इस स्क्रीन में क्या-क्या कर सकते हैं)

### A. Staff Directory Overview (`EmployeeScreen`)
- **Search Bar:** Real-time filter by employee name, ID (`EMP003`), email, phone, or region.
- **Department Dropdown:** Filter by Sales & CRM, Operations, Finance, Verification & Moderation, Executive.
- **Role Dropdown:** Filter by Super Admin, Admin, Manager, Agent, Moderator, Finance Staff.
- **Status Tabs:** Active Employees vs Deactivated / Suspended Staff.

### B. Add Employee Modal
- Full Name, Email, Phone, Employee ID.
- Primary Role & Secondary Roles (multi-role capability).
- Daily Max Lead Capacity throttle (prevents lead assignment overload).
- Allowed Sidebar Sections multi-select chips with "Select All" and "Clear All" helpers.

### C. Granular RBAC Matrix Modal
- Full control over 8 system modules:
  - *Leads CRM*: View, Create, Edit, Delete, Export.
  - *Members Directory*: View, Create, Edit, Delete, Export.
  - *Verification Desk*: View, Approve/Reject.
  - *Finance & Payments*: View Ledger, Issue Refunds, Export CSV.
  - *System Settings*: View, Modify Config.
- Scope selection: `OWN`, `TEAM`, `ALL`.

### D. Employee 360° Management Screen (`/employees/:id`)
- **Staff Dossier:** Contact info, joining date, reporting manager, assigned regions.
- **Performance Telemetry:** Total leads processed, conversion success rate %, average call duration, completed follow-up tasks.
- **Assigned Leads Table:** Direct view of all leads currently sitting in this agent's bucket.
- **Assigned Members Table:** Paid members allotted to this relationship manager.
- **Audit History Log:** Chronological timeline of permission grants, role promotions, and profile changes.

---

## 4. 📊 Role Definitions & Default Permission Matrix

| Role Code | Role Label | Record Scope | Default Sidebar Clearance |
|---|---|---|---|
| `SUPER_ADMIN` | Super Administrator | `ALL` | All 16 Sections (Unrestricted) |
| `ADMIN` | Operations Admin | `ALL` | 15 Sections (Excludes Master Settings) |
| `CRM_MANAGER` | CRM Operations Manager | `TEAM` | Leads, Tasks, Members, Chat, Notifications, Matchmaking |
| `CRM_AGENT` | Telecaller / CRM Agent | `OWN` | Leads, Tasks, Member Search, Chat, Matchmaking, Notifications |
| `FINANCE_MANAGER` | Finance & Accounts Head | `ALL` | Dashboard, Finance, Members, Settings, Notifications |
| `FINANCE_STAFF` | Billing & Accounts Executive | `ALL` | Dashboard, Finance, Notifications |
| `MODERATOR` | Content & KYC Moderator | `ALL` | Verification Desk, Member Search, Notifications |
| `ANALYST` | Business Intelligence Analyst | `ALL` | Dashboard, Finance (Read-only), Reports |

---

## 5. 🔐 RBAC & Security Matrix

- **Minimum Access Role:** `SUPER_ADMIN` and `ADMIN`.
- **Privilege Escalation Protection:** Only `SUPER_ADMIN` can assign or promote someone to `SUPER_ADMIN`.
- **Deactivation Lockdown:** Jab kisi employee ko deactivate kiya jata hai, unke existing active authentication tokens expire ho jaate hain aur portal sessions terminate ho jaate hain.

---

## 6. ⚡ Edge Cases & Error Handling

1. **Self-Deactivation Guard:** Super Admin khud ke account ko deactivate ya delete nahi kar sakta.
2. **Duplicate Employee ID or Email:** Add employee form instant collision detection karta hai aur duplicate entry reject karta hai.
3. **Orphaned Leads on Deactivation:** Jab koi agent deactivate hota hai, system warning deta hai ki uske bucket me 12 active leads hain jinhe reassign karna zaroori hai.

---

## 7. 🔌 Associated Services & Data Entities

- **Screen Files:**
  - `src/screens/employeeScreen/EmployeeScreen.tsx`
  - `src/screens/employeeScreen/Employee360Screen.tsx`
- **Data Service:** `src/services/crmDataService.ts`
- **Types:** `src/types/employee.types.ts`, `src/types/auth.types.ts`
- **Storage Utilities:** `src/storage/index.ts` (`setSimulatedUser`, `clearSimulatedUser`)
