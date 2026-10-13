export type Role =
  | 'SUPER_ADMIN'
  | 'EMPLOYEE'
  | 'ADMIN'
  | 'CRM_MANAGER'
  | 'CRM_AGENT'
  | 'FINANCE_MANAGER'
  | 'FINANCE_STAFF'
  | 'MODERATOR'
  | 'AD_MANAGER'
  | 'SUPPORT_AGENT'
  | 'ANALYST';

export type RecordScope = 'ALL' | 'OWN' | 'ASSIGNED' | 'TEAM' | 'REGION';

export interface ModulePermission {
  view?: boolean;
  edit?: boolean;
  create?: boolean;
  delete?: boolean;
  assign?: boolean;
  export?: boolean;
  call?: boolean;
  refund?: boolean;
  publish?: boolean;
  pause?: boolean;
  receive?: boolean;
  initiate?: boolean;
  viewHistory?: boolean;
  manage?: boolean;
  verify?: boolean;
  [key: string]: boolean | undefined;
}

export interface EmployeePermissions {
  leads?: ModulePermission;
  members?: ModulePermission;
  finance?: ModulePermission;
  ads?: ModulePermission;
  reports?: ModulePermission;
  chat?: ModulePermission;
  settings?: ModulePermission;
  [key: string]: ModulePermission | undefined;
}

export interface AuthEmployee {
  id: string;
  employeeId: string;
  fullName: string;
  email: string;
  mobile: string;
  role: Role;
  department: string;
  recordScope: RecordScope;
  permissions: EmployeePermissions;
  allowedSections?: string[];
  isChatEnabled: boolean;
  avatarUrl?: string;
  isSimulated?: boolean;
}

export interface AuthState {
  user: AuthEmployee | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
