import type { Role, RecordScope, EmployeePermissions } from './auth.types';

export interface Employee {
  id: string;
  employeeId: string; // e.g. 'EMP001'
  fullName: string;
  email: string;
  mobile: string;
  role: Role;
  roles?: Role[];
  department: string;
  managerId?: string;
  managerName?: string;
  recordScope: RecordScope;
  permissions: EmployeePermissions;
  allowedSections?: string[];
  isActive: boolean;
  isChatEnabled: boolean;
  maxLeadCapacity: number;
  activeLeadsCount: number;
  regions: string[];
  languages: string[];
  designation?: string;
  team?: string;
  joiningDate?: string;
  employmentStatus?: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'SUSPENDED';
  targetLeadsMonthly?: number;
  targetCallsDaily?: number;
  targetSalesMonthly?: number;
  lastLoginAt?: string;
  lastActiveAt?: string;
  createdAt: string;
  avatarUrl?: string;
}

export interface EmployeeFilter {
  search: string;
  role: string;
  department: string;
  status: 'ALL' | 'ACTIVE' | 'INACTIVE';
  recordScope: string;
}

export interface PermissionChangeAudit {
  id: string;
  employeeId: string;
  changedBy: string;
  changedAt: string;
  reason: string;
  oldRole: Role;
  newRole: Role;
  permissionDiff: string;
}
