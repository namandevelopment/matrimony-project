# 👤 Controllers: Admin Management (`controllers/admin/`)

## 🎯 Kaam aur Zimmedari (Work & Responsibilities)
Is folder me administrative staff, sub-admins, matchmakers, aur telecallers ke lifecycle management ka controller logic rahega.

## 📄 Expected Files
- `index.js`: Module barrel exporter.
- `admin.js`: Super Admin controls, profile update, security settings, audit view.
- `employees.js`: Staff onboarding, role assignment, branch mapping, password reset, deactivation.

## ⚙️ Key Actions & Flows
1. **Staff Onboarding**:
   - New employee register karna (Name, Email, Phone, Role, Branch).
   - Temporary password generate karna & email dispatch karna.
2. **Role & Permission Management**:
   - Role change karna (`MATCHMAKER`, `TELECALLER`, `ACCOUNTS`, `SUPER_ADMIN`).
   - Granular screen clearances set karna.
3. **Staff Listing & Filters**:
   - `crudService.findAll` ke sath employee list paginate karna with search & role filter.
4. **Audit Trail Logging**:
   - Har sensitive change (role edit, status toggle) par `AuditLog` me entry trigger karna.
