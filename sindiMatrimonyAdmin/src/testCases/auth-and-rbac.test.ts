import assert from 'assert';
import { Role, AuthEmployee, EmployeePermissions } from '../types/auth.types';

// ========================================================
// 🛡️ Test Suite 1: Authentication & Role-Based Access Control
// ========================================================

// 1. Helper to simulate permission evaluation
function checkPermission(
  user: AuthEmployee | null,
  module: string,
  action: string
): boolean {
  if (!user) return false;
  if (user.role === 'SUPER_ADMIN') return true; // Super admin has global bypass
  const mod = user.permissions?.[module];
  return Boolean(mod && (mod as any)[action]);
}

function checkRole(user: AuthEmployee | null, ...allowedRoles: Role[]): boolean {
  if (!user) return false;
  if (user.role === 'SUPER_ADMIN') return true;
  return allowedRoles.includes(user.role);
}

// Scenario A: Super Admin Permissions
const superAdmin: AuthEmployee = {
  id: 'emp_001',
  employeeId: 'EMP001',
  fullName: 'Super Administrator',
  email: 'admin@sindhimatrimony.com',
  mobile: '+91 9876543210',
  role: 'SUPER_ADMIN',
  department: 'Operations',
  recordScope: 'ALL',
  isChatEnabled: true,
  permissions: {},
};

assert.strictEqual(checkPermission(superAdmin, 'leads', 'view'), true);
assert.strictEqual(checkPermission(superAdmin, 'finance', 'refund'), true);
assert.strictEqual(checkPermission(superAdmin, 'members', 'delete'), true);
assert.strictEqual(checkRole(superAdmin, 'CRM_AGENT'), true); // Super Admin passes any role gate

// Scenario B: CRM Agent with Restricted Permissions
const crmAgent: AuthEmployee = {
  id: 'emp_003',
  employeeId: 'EMP003',
  fullName: 'Priya Sharma',
  email: 'priya@sindhimatrimony.com',
  mobile: '+91 9876543212',
  role: 'CRM_AGENT',
  department: 'Sales',
  recordScope: 'OWN',
  isChatEnabled: true,
  permissions: {
    leads: { view: true, call: true, edit: true, assign: false, export: false },
    members: { view: true, edit: false, verify: false },
    finance: { view: false, refund: false },
  },
};

assert.strictEqual(checkPermission(crmAgent, 'leads', 'view'), true);
assert.strictEqual(checkPermission(crmAgent, 'leads', 'call'), true);
assert.strictEqual(checkPermission(crmAgent, 'leads', 'assign'), false, 'CRM Agent cannot assign leads');
assert.strictEqual(checkPermission(crmAgent, 'leads', 'export'), false, 'CRM Agent cannot export leads');
assert.strictEqual(checkPermission(crmAgent, 'finance', 'refund'), false, 'CRM Agent cannot issue refunds');
assert.strictEqual(checkRole(crmAgent, 'SUPER_ADMIN'), false);
assert.strictEqual(checkRole(crmAgent, 'CRM_AGENT', 'CRM_MANAGER'), true);

// Scenario C: MFA Requirement based on Role
function isMfaRequired(role: Role): boolean {
  const sensitiveRoles: Role[] = ['SUPER_ADMIN', 'FINANCE_MANAGER'];
  return sensitiveRoles.includes(role);
}

assert.strictEqual(isMfaRequired('SUPER_ADMIN'), true);
assert.strictEqual(isMfaRequired('FINANCE_MANAGER'), true);
assert.strictEqual(isMfaRequired('CRM_AGENT'), false);
assert.strictEqual(isMfaRequired('MODERATOR'), false);

// Scenario D: Phone Number Masking according to Role
function maskPhoneNumber(phone: string, role: Role): string {
  if (role === 'SUPER_ADMIN' || role === 'ADMIN' || role === 'CRM_MANAGER') {
    return phone; // Full unmasked number
  }
  // Mask middle 4 digits for agents: +91 98****3210
  const cleaned = phone.replace(/\s+/g, '');
  if (cleaned.length >= 10) {
    return cleaned.slice(0, 5) + '****' + cleaned.slice(-4);
  }
  return phone;
}

const rawPhone = '+91 9876543210';
assert.strictEqual(maskPhoneNumber(rawPhone, 'SUPER_ADMIN'), '+91 9876543210');
assert.strictEqual(maskPhoneNumber(rawPhone, 'CRM_AGENT'), '+9198****3210');

// Scenario E: Route-level RBAC and Employee Screen Access
import { canAccessRoute, getDefaultPermissionsForRole } from '../utils/rbac';

assert.strictEqual(canAccessRoute('SUPER_ADMIN', '/employees'), true, 'Super Admin can access Employees');
assert.strictEqual(canAccessRoute('ADMIN', '/employees'), true, 'Admin can access Employees');
assert.strictEqual(canAccessRoute('CRM_AGENT', '/employees'), false, 'CRM Agent cannot access Employees');
assert.strictEqual(canAccessRoute('FINANCE_MANAGER', '/employees'), false, 'Finance Manager cannot access Employees');
assert.strictEqual(canAccessRoute('CRM_AGENT', '/finance'), false, 'CRM Agent cannot access Finance');
assert.strictEqual(canAccessRoute('FINANCE_MANAGER', '/finance'), true, 'Finance Manager can access Finance');
assert.strictEqual(canAccessRoute('MODERATOR', '/verifications'), true, 'Moderator can access Verification Desk');
assert.strictEqual(canAccessRoute('MODERATOR', '/finance'), false, 'Moderator cannot access Finance');

// Scenario F: Default Permissions Presets
const crmPerms = getDefaultPermissionsForRole('CRM_AGENT');
assert.strictEqual(crmPerms.leads?.call, true);
assert.strictEqual(crmPerms.leads?.assign, undefined);
assert.strictEqual(crmPerms.finance?.refund, undefined);

// Scenario G: Granular Employee-Level Sidebar Section Access Control (Custom 2-3 Sections)
import {
  SIDEBAR_SECTIONS,
  getSectionIdForPath,
  getDefaultAllowedSectionsForRole,
} from '../utils/rbac';
import { crmDataService } from '../services/crmDataService';

// 1. Verify getSectionIdForPath mappings
assert.strictEqual(getSectionIdForPath('/'), 'dashboard');
assert.strictEqual(getSectionIdForPath('/leads'), 'leads');
assert.strictEqual(getSectionIdForPath('/tasks'), 'tasks');
assert.strictEqual(getSectionIdForPath('/chat'), 'chat');
assert.strictEqual(getSectionIdForPath('/members'), 'members');
assert.strictEqual(getSectionIdForPath('/members/paid'), 'members');
assert.strictEqual(getSectionIdForPath('/settings/membership-plans'), 'settings');

// 2. An Employee granted ONLY 2 or 3 sections (e.g. Leads and Tasks)
const customSections = ['leads', 'tasks'];
assert.strictEqual(
  canAccessRoute('EMPLOYEE', '/leads', customSections),
  true,
  'Employee with [leads, tasks] can access CRM Leads'
);
assert.strictEqual(
  canAccessRoute('EMPLOYEE', '/tasks', customSections),
  true,
  'Employee with [leads, tasks] can access Tasks'
);
assert.strictEqual(
  canAccessRoute('EMPLOYEE', '/chat', customSections),
  false,
  'Employee with [leads, tasks] CANNOT access Team Chat (not allowed)'
);
assert.strictEqual(
  canAccessRoute('EMPLOYEE', '/finance', customSections),
  false,
  'Employee with [leads, calls] CANNOT access Finance (not allowed)'
);
assert.strictEqual(
  canAccessRoute('EMPLOYEE', '/settings', customSections),
  false,
  'Employee with [leads, calls] CANNOT access Settings (not allowed)'
);

// 3. Super Admin always retains uninhibited clearance across all routes
assert.strictEqual(
  canAccessRoute('SUPER_ADMIN', '/settings', customSections),
  true,
  'Super Admin always retains full system access'
);
assert.strictEqual(
  canAccessRoute('SUPER_ADMIN', '/finance', customSections),
  true,
  'Super Admin always retains finance access'
);

// 4. Employee persistence and lookup via crmDataService
const testEmployee = {
  id: 'emp_test_user_99',
  employeeId: 'EMP099',
  fullName: 'Rohan Vazirani',
  email: 'rohan.v@sindhimatrimony.com',
  mobile: '+91 99887 76655',
  role: 'EMPLOYEE' as const,
  department: 'Sales & CRM',
  recordScope: 'OWN' as const,
  permissions: getDefaultPermissionsForRole('EMPLOYEE'),
  allowedSections: ['leads', 'tasks', 'chat'],
  isActive: true,
  isChatEnabled: true,
  maxLeadCapacity: 20,
  activeLeadsCount: 0,
  regions: ['Pune'],
  languages: ['Sindhi', 'English'],
  createdAt: '2026-10-12',
};

crmDataService.addEmployee(testEmployee);
const retrievedEmp = crmDataService.getEmployeeByEmail('rohan.v@sindhimatrimony.com');
assert.ok(retrievedEmp, 'Newly added employee can be retrieved by email');
assert.strictEqual(retrievedEmp?.allowedSections?.length, 3, 'Employee retains 3 allowed sections');
assert.deepStrictEqual(retrievedEmp?.allowedSections, ['leads', 'tasks', 'chat']);

console.log('✅ [1/6] auth-and-rbac.test.ts: Passed all 36 authentication, RBAC, and granular sidebar section clearance scenarios successfully!');


