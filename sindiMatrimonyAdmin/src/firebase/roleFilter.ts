/**
 * Role-Based Notification Filtering Engine for Admin CRM
 * Ensures staff members only receive alerts designated for their operational roles.
 */

export const ROLE_ALLOWED_CATEGORIES: Record<string, string[]> = {
  SUPER_ADMIN: ['*'],
  ADMIN: ['*'],
  CRM_MANAGER: ['CRM_LEAD', 'LEAD', 'PAYMENT', 'GENERAL', 'MATCH'],
  CRM_AGENT: ['CRM_LEAD', 'LEAD', 'GENERAL'],
  EMPLOYEE: ['CRM_LEAD', 'LEAD', 'GENERAL'],
  FINANCE_MANAGER: ['PAYMENT', 'FINANCE', 'GENERAL'],
  FINANCE_STAFF: ['PAYMENT', 'FINANCE', 'GENERAL'],
  MODERATOR: ['VERIFICATION', 'ABUSE_REPORT', 'SAFETY', 'GENERAL'],
  SUPPORT_AGENT: ['SUPPORT', 'GENERAL', 'CRM_LEAD'],
  ANALYST: ['SYSTEM', 'GENERAL'],
  AD_MANAGER: ['MARKETING', 'GENERAL'],
};

export interface RoleFilterOptions {
  category?: string;
  targetRole?: string;
  allowedRoles?: string[] | string;
  targetEmployeeId?: string;
}

export const isNotificationPermittedForRole = (
  options: RoleFilterOptions,
  activeRole: string,
  employeeId?: string
): boolean => {
  if (!activeRole) return false;
  if (activeRole === 'SUPER_ADMIN') return true;

  // 1. Direct Employee ID assignment
  if (options.targetEmployeeId && employeeId) {
    if (options.targetEmployeeId !== employeeId && options.targetEmployeeId !== 'ALL') {
      return false;
    }
  }

  // 2. Direct Target Role filter
  if (options.targetRole && options.targetRole !== 'ALL' && options.targetRole !== activeRole) {
    return false;
  }

  // 3. Multi-role whitelist
  if (options.allowedRoles) {
    const roles = Array.isArray(options.allowedRoles)
      ? options.allowedRoles
      : options.allowedRoles.split(',').map((r) => r.trim());
    if (!roles.includes('ALL') && !roles.includes(activeRole)) {
      return false;
    }
  }

  // 4. Functional Category matrix
  if (options.category) {
    const cat = options.category.toUpperCase();
    const allowed = ROLE_ALLOWED_CATEGORIES[activeRole] || ['GENERAL'];
    if (!allowed.includes('*') && !allowed.includes(cat)) {
      return false;
    }
  }

  return true;
};
