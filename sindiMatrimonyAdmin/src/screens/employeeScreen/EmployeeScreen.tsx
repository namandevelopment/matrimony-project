import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  UserPlus,
  Shield,
  ShieldCheck,
  Eye,
  CheckCircle2,
  XCircle,
  Phone,
  Mail,
  Building2,
  Clock,
  Sparkles,
  Sliders,
  History,
  Lock,
  AlertTriangle,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import { crmDataService } from '../../services/crmDataService';
import { PageHeader } from '../../components/PageHeader';
import { TabsHeader } from '../../components/TabsHeader';
import { FilterBar } from '../../components/FilterBar';
import { DataTable, type Column } from '../../components/DataTable';
import { CustomButton } from '../../components/CustomButton';
import { CustomTextInput } from '../../components/CustomTextInput';
import { CustomDropDown } from '../../components/CustomDropDown';
import { CustomMultiSelect } from '../../components/CustomMultiSelect';
import { StatusBadge } from '../../components/StatusBadge';
import { ReasonModal } from '../../customModals/ReasonModal';
import {
  ROLE_DEFINITIONS,
  ALL_ROLES,
  getDefaultPermissionsForRole,
  getDefaultAllowedSectionsForRole,
  SIDEBAR_SECTIONS,
} from '../../utils/rbac';
import type { Role, RecordScope, EmployeePermissions } from '../../types/auth.types';
import type { Employee, PermissionChangeAudit } from '../../types/employee.types';
import { setSimulatedUser } from '../../storage';
import { toast } from '../../toastMessage/toast';
import { validateName, validateEmail, validateMobileNumber } from '../../utils/ValidationsFuctions';
import { useInputs } from '../../customHooks/useInputs';

export interface EmployeeFormValues {
  fullName: string;
  employeeId: string;
  email: string;
  mobile: string;
  role: Role;
  roles: Role[];
  department: string;
  managerName: string;
  recordScope: RecordScope;
  maxLeadCapacity: number;
  regions: string;
  languages: string;
  allowedSections: string[];
}

const INITIAL_EMPLOYEE_VALUES: EmployeeFormValues = {
  fullName: '',
  employeeId: '',
  email: '',
  mobile: '',
  role: 'CRM_AGENT',
  roles: ['CRM_AGENT'],
  department: 'Sales & CRM',
  managerName: 'Priya Sharma',
  recordScope: 'OWN',
  maxLeadCapacity: 25,
  regions: 'Mumbai, Pune',
  languages: 'Sindhi, Hindi, English',
  allowedSections: ['leads', 'tasks'],
};

const initialMockEmployees: Employee[] = [
  {
    id: 'emp_001',
    employeeId: 'EMP001',
    fullName: 'Rajesh Mulchandani',
    email: 'rajesh.m@sindhimatrimony.com',
    mobile: '+91 98200 11223',
    role: 'SUPER_ADMIN',
    department: 'Executive Management',
    recordScope: 'ALL',
    permissions: getDefaultPermissionsForRole('SUPER_ADMIN'),
    isActive: true,
    isChatEnabled: true,
    maxLeadCapacity: 100,
    activeLeadsCount: 0,
    regions: ['Mumbai', 'Pune', 'Dubai'],
    languages: ['Sindhi', 'English', 'Hindi'],
    lastActiveAt: '2 mins ago',
    createdAt: '2025-01-15',
  },
  {
    id: 'emp_002',
    employeeId: 'EMP002',
    fullName: 'Kavita Chhabria',
    email: 'kavita.c@sindhimatrimony.com',
    mobile: '+91 98211 44556',
    role: 'ADMIN',
    department: 'Operations',
    managerName: 'Rajesh Mulchandani',
    recordScope: 'ALL',
    permissions: getDefaultPermissionsForRole('ADMIN'),
    isActive: true,
    isChatEnabled: true,
    maxLeadCapacity: 80,
    activeLeadsCount: 12,
    regions: ['Mumbai', 'Ahmedabad'],
    languages: ['Sindhi', 'Hindi'],
    lastActiveAt: '15 mins ago',
    createdAt: '2025-02-01',
  },
  {
    id: 'emp_003',
    employeeId: 'EMP003',
    fullName: 'Priya Sharma',
    email: 'priya.s@sindhimatrimony.com',
    mobile: '+91 98333 77889',
    role: 'CRM_MANAGER',
    department: 'Sales & CRM',
    managerName: 'Kavita Chhabria',
    recordScope: 'TEAM',
    permissions: getDefaultPermissionsForRole('CRM_MANAGER'),
    isActive: true,
    isChatEnabled: true,
    maxLeadCapacity: 50,
    activeLeadsCount: 38,
    regions: ['Mumbai', 'Delhi NCR'],
    languages: ['Sindhi', 'English', 'Hindi'],
    lastActiveAt: 'Just now',
    createdAt: '2025-02-10',
  },
  {
    id: 'emp_004',
    employeeId: 'EMP004',
    fullName: 'Amit Bajaj',
    email: 'amit.b@sindhimatrimony.com',
    mobile: '+91 98765 43210',
    role: 'CRM_AGENT',
    department: 'Sales & CRM',
    managerName: 'Priya Sharma',
    recordScope: 'OWN',
    permissions: getDefaultPermissionsForRole('CRM_AGENT'),
    isActive: true,
    isChatEnabled: true,
    maxLeadCapacity: 25,
    activeLeadsCount: 22,
    regions: ['Pune', 'Nagpur'],
    languages: ['Sindhi', 'Hindi', 'Marathi'],
    lastActiveAt: '5 mins ago',
    createdAt: '2025-03-01',
  },
  {
    id: 'emp_005',
    employeeId: 'EMP005',
    fullName: 'Neha Lulla',
    email: 'neha.l@sindhimatrimony.com',
    mobile: '+91 98450 99887',
    role: 'CRM_AGENT',
    department: 'Sales & CRM',
    managerName: 'Priya Sharma',
    recordScope: 'OWN',
    permissions: getDefaultPermissionsForRole('CRM_AGENT'),
    isActive: true,
    isChatEnabled: true,
    maxLeadCapacity: 25,
    activeLeadsCount: 19,
    regions: ['Indore', 'Bhopal'],
    languages: ['Sindhi', 'Hindi'],
    lastActiveAt: '25 mins ago',
    createdAt: '2025-03-05',
  },
  {
    id: 'emp_006',
    employeeId: 'EMP006',
    fullName: 'Sunil Wadhwani',
    email: 'sunil.w@sindhimatrimony.com',
    mobile: '+91 98111 22334',
    role: 'FINANCE_MANAGER',
    department: 'Accounts & Billing',
    managerName: 'Rajesh Mulchandani',
    recordScope: 'ALL',
    permissions: getDefaultPermissionsForRole('FINANCE_MANAGER'),
    isActive: true,
    isChatEnabled: false,
    maxLeadCapacity: 0,
    activeLeadsCount: 0,
    regions: ['All India'],
    languages: ['English', 'Hindi'],
    lastActiveAt: '1 hour ago',
    createdAt: '2025-02-15',
  },
  {
    id: 'emp_007',
    employeeId: 'EMP007',
    fullName: 'Meena Advani',
    email: 'meena.a@sindhimatrimony.com',
    mobile: '+91 98999 55667',
    role: 'MODERATOR',
    department: 'Trust & Safety',
    managerName: 'Kavita Chhabria',
    recordScope: 'ALL',
    permissions: getDefaultPermissionsForRole('MODERATOR'),
    isActive: true,
    isChatEnabled: true,
    maxLeadCapacity: 0,
    activeLeadsCount: 0,
    regions: ['All Regions'],
    languages: ['Sindhi', 'English', 'Hindi'],
    lastActiveAt: '12 mins ago',
    createdAt: '2025-02-20',
  },
  {
    id: 'emp_008',
    employeeId: 'EMP008',
    fullName: 'Vikram Talreja',
    email: 'vikram.t@sindhimatrimony.com',
    mobile: '+91 98777 88990',
    role: 'SUPPORT_AGENT',
    department: 'Member Care',
    managerName: 'Priya Sharma',
    recordScope: 'ASSIGNED',
    permissions: getDefaultPermissionsForRole('SUPPORT_AGENT'),
    isActive: true,
    isChatEnabled: true,
    maxLeadCapacity: 20,
    activeLeadsCount: 14,
    regions: ['Global NRI Support'],
    languages: ['Sindhi', 'English'],
    lastActiveAt: '3 mins ago',
    createdAt: '2025-03-10',
  },
  {
    id: 'emp_009',
    employeeId: 'EMP009',
    fullName: 'Ritu Jhangiani',
    email: 'ritu.j@sindhimatrimony.com',
    mobile: '+91 98666 11224',
    role: 'AD_MANAGER',
    department: 'Marketing',
    managerName: 'Kavita Chhabria',
    recordScope: 'ALL',
    permissions: getDefaultPermissionsForRole('AD_MANAGER'),
    isActive: true,
    isChatEnabled: false,
    maxLeadCapacity: 0,
    activeLeadsCount: 0,
    regions: ['Pan India & UAE'],
    languages: ['English', 'Hindi'],
    lastActiveAt: '4 hours ago',
    createdAt: '2025-02-28',
  },
  {
    id: 'emp_010',
    employeeId: 'EMP010',
    fullName: 'Harish Makhija',
    email: 'harish.m@sindhimatrimony.com',
    mobile: '+91 98555 33445',
    role: 'CRM_AGENT',
    department: 'Sales & CRM',
    managerName: 'Priya Sharma',
    recordScope: 'OWN',
    permissions: getDefaultPermissionsForRole('CRM_AGENT'),
    isActive: false,
    isChatEnabled: false,
    maxLeadCapacity: 25,
    activeLeadsCount: 0,
    regions: ['Jaipur'],
    languages: ['Sindhi', 'Hindi'],
    lastActiveAt: '3 days ago',
    createdAt: '2025-01-20',
  },
];

export const EmployeeScreen: React.FC = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>(
    () => (crmDataService.getEmployees().length > 0 ? crmDataService.getEmployees() : initialMockEmployees)
  );
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  useEffect(() => {
    setEmployees(crmDataService.getEmployees());
    const unsub = crmDataService.subscribe(() => {
      setEmployees(crmDataService.getEmployees());
    });
    return unsub;
  }, []);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<PermissionChangeAudit[]>([
    {
      id: 'aud_1',
      employeeId: 'EMP004',
      changedBy: 'Rajesh Mulchandani (EMP001)',
      changedAt: '2025-03-12 14:30',
      reason: 'Promoted to CRM Senior Agent - lead quota expanded to 25',
      oldRole: 'CRM_AGENT',
      newRole: 'CRM_AGENT',
      permissionDiff: 'maxLeadCapacity: 15 → 25',
    },
    {
      id: 'aud_2',
      employeeId: 'EMP010',
      changedBy: 'Kavita Chhabria (EMP002)',
      changedAt: '2025-03-15 10:15',
      reason: 'Employee on medical leave - temporarily suspended',
      oldRole: 'CRM_AGENT',
      newRole: 'CRM_AGENT',
      permissionDiff: 'isActive: true → false',
    },
  ]);

  // useInputs Form State for Add / Provision Employee
  const [employeeSubmitAttempted, setEmployeeSubmitAttempted] = useState(false);
  const {
    values: formData,
    setValues: setFormData,
    setFieldValue: setEmployeeFieldValue,
    reset: resetEmployeeForm,
    errors: employeeErrors,
    touched: employeeTouched,
    validateForm: validateEmployeeForm,
  } = useInputs<EmployeeFormValues>(INITIAL_EMPLOYEE_VALUES, {
    validate: (vals) => {
      const errs: Partial<Record<keyof EmployeeFormValues, string>> = {};
      const nameErr = validateName(vals.fullName);
      if (nameErr) errs.fullName = nameErr;

      const emailErr = validateEmail(vals.email);
      if (emailErr) errs.email = emailErr;

      const mobileErr = validateMobileNumber(vals.mobile);
      if (mobileErr) errs.mobile = mobileErr;

      if (!vals.employeeId.trim()) {
        errs.employeeId = 'Employee code is required.';
      }

      if (!vals.roles || vals.roles.length === 0) {
        errs.role = 'Please select at least one role.';
      }
      return errs;
    },
    validateOnChange: true,
  });

  // Granular Permissions State for Permission Modal
  const [editablePermissions, setEditablePermissions] = useState<EmployeePermissions>({});
  const [editableAllowedSections, setEditableAllowedSections] = useState<string[]>([]);
  const [pendingPermissionSave, setPendingPermissionSave] = useState<{
    employeeId: string;
    newPermissions: EmployeePermissions;
    newAllowedSections: string[];
    newRole: Role;
  } | null>(null);

  // Tabs Definition
  const tabs = useMemo(
    () => [
      { key: 'ALL', label: 'All Staff', count: employees.length },
      {
        key: 'CRM',
        label: 'Sales & CRM',
        count: employees.filter((e) => {
          const roles = e.roles && e.roles.length > 0 ? e.roles : [e.role];
          return roles.some((r) => r === 'CRM_MANAGER' || r === 'CRM_AGENT');
        }).length,
      },
      {
        key: 'TRUST',
        label: 'Trust & Moderation',
        count: employees.filter((e) => {
          const roles = e.roles && e.roles.length > 0 ? e.roles : [e.role];
          return roles.includes('MODERATOR');
        }).length,
      },
      {
        key: 'FINANCE',
        label: 'Finance & Accounts',
        count: employees.filter((e) => {
          const roles = e.roles && e.roles.length > 0 ? e.roles : [e.role];
          return roles.some((r) => r.startsWith('FINANCE'));
        }).length,
      },
      {
        key: 'ADMIN',
        label: 'Admins & Leadership',
        count: employees.filter((e) => {
          const roles = e.roles && e.roles.length > 0 ? e.roles : [e.role];
          return roles.some((r) => r === 'SUPER_ADMIN' || r === 'ADMIN');
        }).length,
      },
    ],
    [employees]
  );

  // Filtered List
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const empRoles = emp.roles && emp.roles.length > 0 ? emp.roles : [emp.role];

      // Tab filter
      if (activeTab === 'CRM' && !empRoles.some((r) => r === 'CRM_MANAGER' || r === 'CRM_AGENT'))
        return false;
      if (activeTab === 'TRUST' && !empRoles.includes('MODERATOR')) return false;
      if (activeTab === 'FINANCE' && !empRoles.some((r) => r.startsWith('FINANCE'))) return false;
      if (activeTab === 'ADMIN' && !empRoles.some((r) => r === 'SUPER_ADMIN' || r === 'ADMIN'))
        return false;

      // Dropdown Role filter
      if (roleFilter !== 'ALL' && !empRoles.includes(roleFilter as Role)) return false;

      // Status filter
      if (statusFilter === 'ACTIVE' && !emp.isActive) return false;
      if (statusFilter === 'INACTIVE' && emp.isActive) return false;

      // Search
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesName = emp.fullName.toLowerCase().includes(query);
        const matchesEmpId = emp.employeeId.toLowerCase().includes(query);
        const matchesEmail = emp.email.toLowerCase().includes(query);
        const matchesMobile = emp.mobile.includes(query);
        if (!matchesName && !matchesEmpId && !matchesEmail && !matchesMobile) return false;
      }

      return true;
    });
  }, [employees, activeTab, roleFilter, statusFilter, search]);

  // Handlers
  const handleRolesChange = (selectedRoleStrings: string[]) => {
    const selectedRoles = selectedRoleStrings as Role[];
    if (selectedRoles.length === 0) {
      setEmployeeFieldValue('roles', []);
      return;
    }
    const primaryRole = selectedRoles[0];
    // Automatically calculate union of all allowed sections for all selected roles!
    const combinedSections = Array.from(
      new Set(selectedRoles.flatMap((r) => getDefaultAllowedSectionsForRole(r)))
    );
    setFormData((prev) => ({
      ...prev,
      role: primaryRole,
      roles: selectedRoles,
      department: ROLE_DEFINITIONS[primaryRole]?.department || prev.department,
      recordScope: ROLE_DEFINITIONS[primaryRole]?.defaultScope || prev.recordScope,
      allowedSections: combinedSections.length > 0 ? combinedSections : prev.allowedSections,
    }));
  };

  const handleOpenAdd = () => {
    const nextCode = `EMP${String(employees.length + 1).padStart(3, '0')}`;
    setEmployeeSubmitAttempted(false);
    resetEmployeeForm({
      ...INITIAL_EMPLOYEE_VALUES,
      employeeId: nextCode,
      role: 'CRM_AGENT',
      roles: ['CRM_AGENT'],
      allowedSections: ['leads', 'tasks'],
    });
    setIsAddModalOpen(true);
  };

  const handleSaveNewEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    setEmployeeSubmitAttempted(true);
    if (!validateEmployeeForm()) {
      if (employeeErrors.fullName) {
        toast.error(employeeErrors.fullName);
      } else if (employeeErrors.email) {
        toast.error(employeeErrors.email);
      } else if (employeeErrors.mobile) {
        toast.error(employeeErrors.mobile);
      } else if (employeeErrors.employeeId) {
        toast.error(employeeErrors.employeeId);
      } else if (employeeErrors.role) {
        toast.error(employeeErrors.role);
      }
      return;
    }

    const assignedRoles =
      formData.roles && formData.roles.length > 0
        ? formData.roles
        : [formData.role];
    const primaryRole = assignedRoles[0] || formData.role;

    const assignedSections =
      formData.allowedSections && formData.allowedSections.length > 0
        ? formData.allowedSections
        : Array.from(new Set(assignedRoles.flatMap((r) => getDefaultAllowedSectionsForRole(r))));

    const newEmp: Employee = {
      id: `emp_${Date.now()}`,
      employeeId: formData.employeeId.trim() || `EMP${String(employees.length + 1).padStart(3, '0')}`,
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      mobile: formData.mobile.trim(),
      role: primaryRole,
      roles: assignedRoles,
      department: formData.department.trim(),
      managerName: formData.managerName.trim(),
      recordScope: formData.recordScope,
      permissions: getDefaultPermissionsForRole(primaryRole),
      allowedSections: assignedSections,
      isActive: true,
      isChatEnabled: true,
      maxLeadCapacity: Number(formData.maxLeadCapacity) || 0,
      activeLeadsCount: 0,
      regions: formData.regions.split(',').map((s) => s.trim()).filter(Boolean),
      languages: formData.languages.split(',').map((s) => s.trim()).filter(Boolean),
      lastActiveAt: 'Never',
      createdAt: new Date().toISOString().split('T')[0],
    };

    crmDataService.addEmployee(newEmp);
    setEmployees(crmDataService.getEmployees());
    setIsAddModalOpen(false);
    toast.success(`Employee ${newEmp.fullName} (${newEmp.employeeId}) created with ${assignedRoles.length} roles & ${assignedSections.length} sections!`);
  };

  const handleToggleStatus = useCallback((emp: Employee) => {
    const nextState = !emp.isActive;
    crmDataService.updateEmployee(emp.id, { isActive: nextState });
    setEmployees(crmDataService.getEmployees());

    // Audit log
    setAuditLogs((prev) => [
      {
        id: `aud_${Date.now()}`,
        employeeId: emp.employeeId,
        changedBy: 'Super Administrator (EMP001)',
        changedAt: new Date().toLocaleString(),
        reason: nextState ? 'Account manually re-activated' : 'Account temporarily deactivated',
        oldRole: emp.role,
        newRole: emp.role,
        permissionDiff: `isActive: ${emp.isActive} → ${nextState}`,
      },
      ...prev,
    ]);

    toast.info(`Employee ${emp.fullName} is now ${nextState ? 'Active' : 'Suspended'}`);
  }, []);

  const handleOpenPermissions = useCallback((emp: Employee) => {
    setSelectedEmployee(emp);
    setEditablePermissions(JSON.parse(JSON.stringify(emp.permissions || {})));
    setEditableAllowedSections(
      emp.allowedSections ? [...emp.allowedSections] : getDefaultAllowedSectionsForRole(emp.role)
    );
    setIsPermissionModalOpen(true);
  }, []);

  const handleRequestSavePermissions = () => {
    if (!selectedEmployee) return;
    setPendingPermissionSave({
      employeeId: selectedEmployee.id,
      newPermissions: editablePermissions,
      newAllowedSections: editableAllowedSections,
      newRole: selectedEmployee.role,
    });
    setIsPermissionModalOpen(false);
    setIsReasonModalOpen(true);
  };

  const handleConfirmPermissionReason = (reasonText: string) => {
    if (!pendingPermissionSave || !selectedEmployee) return;

    crmDataService.updateEmployee(pendingPermissionSave.employeeId, {
      permissions: pendingPermissionSave.newPermissions,
      allowedSections: pendingPermissionSave.newAllowedSections,
    });
    setEmployees(crmDataService.getEmployees());

    setAuditLogs((prev) => [
      {
        id: `aud_${Date.now()}`,
        employeeId: selectedEmployee.employeeId,
        changedBy: 'Super Administrator (EMP001)',
        changedAt: new Date().toLocaleString(),
        reason: reasonText,
        oldRole: selectedEmployee.role,
        newRole: selectedEmployee.role,
        permissionDiff: `Sidebar sections: ${pendingPermissionSave.newAllowedSections.length} active; RBAC matrix updated`,
      },
      ...prev,
    ]);

    toast.success(`Custom permissions updated for ${selectedEmployee.fullName}! (${pendingPermissionSave.newAllowedSections.length} sidebar sections active)`);
    setPendingPermissionSave(null);
    setSelectedEmployee(null);
  };

  const handleSimulateEmployee = useCallback((emp: Employee) => {
    const simUser = {
      id: emp.id,
      employeeId: emp.employeeId,
      fullName: emp.fullName,
      email: emp.email,
      role: emp.role,
      department: emp.department,
      recordScope: emp.recordScope,
      permissions: emp.permissions,
      allowedSections: emp.allowedSections || getDefaultAllowedSectionsForRole(emp.role),
      isSimulated: true,
    };
    setSimulatedUser(simUser);
    toast.info(`Simulating access as ${emp.fullName} (${emp.role}) — ${simUser.allowedSections.length} sections active`);
    window.dispatchEvent(new Event('storage'));
    window.location.reload();
  }, []);

  // Table Columns
  const columns = useMemo<Column<Employee>[]>(() => [
    {
      key: 'employee',
      header: 'Employee Details',
      render: (emp) => (
        <div
          onClick={() => navigate(`/employees/${emp.id}`)}
          className="flex items-center gap-3 cursor-pointer group"
          title="Click to view Employee 360° Management Profile"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#88131B] to-amber-500 text-white font-extrabold flex items-center justify-center text-xs shadow-xs shrink-0 group-hover:scale-105 transition">
            {emp.fullName
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-slate-900 group-hover:text-rose-700 transition">
                {emp.fullName}
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-semibold border border-slate-200">
                {emp.employeeId}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 flex items-center gap-3 mt-0.5">
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3 text-slate-400" />
                {emp.email}
              </span>
              <span className="flex items-center gap-1 hidden sm:flex">
                <Phone className="w-3 h-3 text-slate-400" />
                {emp.mobile}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Assigned Role(s)',
      render: (emp) => {
        const empRoles = emp.roles && emp.roles.length > 0 ? emp.roles : [emp.role];
        return (
          <div className="flex flex-col gap-1 max-w-[220px]">
            <div className="flex flex-wrap gap-1">
              {empRoles.map((r, idx) => {
                const meta = ROLE_DEFINITIONS[r] || {
                  label: r,
                  badgeBg: 'bg-slate-50',
                  badgeText: 'text-slate-700',
                  badgeBorder: 'border-slate-200',
                };
                return (
                  <span
                    key={r}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold border shadow-2xs ${meta.badgeBg} ${meta.badgeText} ${meta.badgeBorder}`}
                  >
                    <Shield className="w-2.5 h-2.5 shrink-0" />
                    <span>{meta.label}</span>
                    {idx === 0 && empRoles.length > 1 && (
                      <span className="text-[8px] uppercase font-extrabold bg-black/10 px-1 py-0.2 rounded ml-0.5">
                        Primary
                      </span>
                    )}
                  </span>
                );
              })}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 font-medium">
              {emp.department}
            </div>
          </div>
        );
      },
    },
    {
      key: 'scope',
      header: 'Data Scope',
      render: (emp) => {
        const scopeColors: Record<RecordScope, string> = {
          ALL: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          TEAM: 'bg-amber-50 text-amber-700 border-amber-200',
          REGION: 'bg-purple-50 text-purple-700 border-purple-200',
          ASSIGNED: 'bg-sky-50 text-sky-700 border-sky-200',
          OWN: 'bg-blue-50 text-blue-700 border-blue-200',
        };
        return (
          <div>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold border ${
                scopeColors[emp.recordScope] || 'bg-slate-50 text-slate-600 border-slate-200'
              }`}
            >
              SCOPE: {emp.recordScope}
            </span>
            {emp.maxLeadCapacity > 0 && (
              <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                <Users className="w-3 h-3 text-slate-400" />
                <span>
                  {emp.activeLeadsCount} / {emp.maxLeadCapacity} Leads
                </span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: 'allowedSections',
      header: 'Sidebar Access',
      render: (emp) => {
        const sections = emp.allowedSections || getDefaultAllowedSectionsForRole(emp.role);
        const isAll = emp.role === 'SUPER_ADMIN' || sections.length === SIDEBAR_SECTIONS.length;
        const sectionNames = sections.map((id) => SIDEBAR_SECTIONS.find((s) => s.id === id)?.name || id);

        return (
          <div className="max-w-[200px]">
            {isAll ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 shadow-2xs">
                All 19 Sections (Full Access)
              </span>
            ) : (
              <div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs">
                  {sections.length} Sections Active
                </span>
                <p className="text-[10px] text-slate-500 truncate mt-0.5" title={sectionNames.join(', ')}>
                  {sectionNames.slice(0, 3).join(', ')}
                  {sectionNames.length > 3 && ` +${sectionNames.length - 3} more`}
                </p>
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      render: (emp) => (
        <div className="flex flex-col items-center">
          <StatusBadge status={emp.isActive ? 'ACTIVE' : 'SUSPENDED'} />
          <span className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" />
            {emp.lastActiveAt || 'Offline'}
          </span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions & RBAC',
      align: 'right',
      render: (emp) => (
        <div className="flex items-center justify-end gap-1.5">
          {/* Chat with Employee */}
          <button
            onClick={() => navigate(`/chat?empId=${emp.id}`)}
            title={`Open Team Chat with ${emp.fullName}`}
            className="p-1.5 rounded-lg text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition text-[11px] flex items-center gap-1 font-bold shadow-2xs cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Chat</span>
          </button>

          {/* 360 Degree Detail Profile */}
          <button
            onClick={() => navigate(`/employees/${emp.id}`)}
            title="Open Dedicated Employee 360° Management Profile"
            className="p-1.5 rounded-lg text-white bg-[#88131B] hover:bg-rose-900 border border-rose-950 transition text-[11px] flex items-center gap-1 font-bold shadow-2xs cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">360° Profile</span>
          </button>

          {/* View As / Impersonate */}
          <button
            onClick={() => handleSimulateEmployee(emp)}
            title="View as Employee (Simulate Permissions)"
            className="p-1.5 rounded-lg text-slate-600 hover:text-amber-700 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 transition text-[11px] flex items-center gap-1 font-semibold"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden lg:inline">View As</span>
          </button>

          {/* Manage Permissions */}
          <button
            onClick={() => handleOpenPermissions(emp)}
            title="Customize Permissions Matrix"
            className="p-1.5 rounded-lg text-slate-600 hover:text-rose-700 hover:bg-rose-50 border border-slate-200 hover:border-rose-300 transition text-[11px] flex items-center gap-1 font-semibold"
          >
            <Sliders className="w-3.5 h-3.5 text-[#DB2F3C]" />
            <span className="hidden lg:inline">Perms</span>
          </button>

          {/* Status Toggle */}
          <button
            onClick={() => handleToggleStatus(emp)}
            title={emp.isActive ? 'Deactivate Employee' : 'Activate Employee'}
            className={`p-1.5 rounded-lg border text-[11px] transition font-semibold flex items-center gap-1 ${
              emp.isActive
                ? 'text-rose-600 border-rose-200 hover:bg-rose-50'
                : 'text-emerald-600 border-emerald-200 hover:bg-emerald-50'
            }`}
          >
            {emp.isActive ? (
              <XCircle className="w-3.5 h-3.5" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">{emp.isActive ? 'Suspend' : 'Activate'}</span>
          </button>
        </div>
      ),
    },
  ], [navigate, handleSimulateEmployee, handleOpenPermissions, handleToggleStatus]);

  return (
    <div className="space-y-5">
      {/* Page Title & Top Actions */}
      <PageHeader
        title="Employee & Role-Based Access (RBAC)"
        description="Configure organization staff, role assignments, hierarchical access scopes, and granular module permissions."
        badge={
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[#DB2F3C]" />
            RBAC Enabled
          </span>
        }
        actions={
          <>
            <CustomButton
              variant="outline"
              size="sm"
              icon={<History className="w-3.5 h-3.5 text-slate-600" />}
              onClick={() => setIsAuditModalOpen(true)}
            >
              Audit Trail
            </CustomButton>
            <CustomButton
              variant="primary"
              size="sm"
              icon={<UserPlus className="w-3.5 h-3.5 text-slate-950" />}
              onClick={handleOpenAdd}
            >
              Add Employee
            </CustomButton>
          </>
        }
      />

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Total Staff</span>
            <span className="p-2 rounded-xl bg-slate-100 text-slate-700">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="text-xl font-extrabold text-slate-900 mt-2">{employees.length}</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            {employees.filter((e) => e.isActive).length} Active Today
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Sales & CRM Team</span>
            <span className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <Phone className="w-4 h-4" />
            </span>
          </div>
          <div className="text-xl font-extrabold text-slate-900 mt-2">
            {employees.filter((e) => e.role === 'CRM_MANAGER' || e.role === 'CRM_AGENT').length}
          </div>
          <div className="text-[10px] text-amber-700 font-semibold mt-0.5">
            Avg 22 Leads / Exec
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Trust & Safety</span>
            <span className="p-2 rounded-xl bg-purple-50 text-purple-700">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="text-xl font-extrabold text-slate-900 mt-2">
            {employees.filter((e) => e.role === 'MODERATOR').length}
          </div>
          <div className="text-[10px] text-purple-700 font-semibold mt-0.5">
            Photo & KYC Verification
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Finance & Billing</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <Building2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-xl font-extrabold text-slate-900 mt-2">
            {employees.filter((e) => e.role.startsWith('FINANCE')).length}
          </div>
          <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
            Ledger & Refund Controls
          </div>
        </div>
      </div>

      {/* Tabs */}
      <TabsHeader tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Filters Bar */}
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        placeholder="Search staff by Name, EMP ID (e.g. EMP001), mobile or email..."
        onClear={() => {
          setSearch('');
          setRoleFilter('ALL');
          setStatusFilter('ALL');
        }}
        filters={
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
            <CustomDropDown
              value={roleFilter}
              onChange={(val) => setRoleFilter(String(val))}
              options={[
                { value: 'ALL', label: `All Roles (${ALL_ROLES.length})` },
                ...ALL_ROLES.map((r) => ({
                  value: r,
                  label: ROLE_DEFINITIONS[r]?.label || r,
                })),
              ]}
              icon={<Shield className="w-3.5 h-3.5 text-slate-400" />}
              size="sm"
              variant="outline"
              containerClassName="w-full sm:w-52 shrink-0"
              triggerClassName="bg-white border-slate-200 text-xs shadow-2xs font-medium"
            />

            <CustomDropDown
              value={statusFilter}
              onChange={(val) => setStatusFilter(String(val))}
              options={[
                { value: 'ALL', label: 'All Status' },
                { value: 'ACTIVE', label: 'Active Staff' },
                { value: 'INACTIVE', label: 'Suspended / Inactive' },
              ]}
              icon={<CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />}
              size="sm"
              variant="outline"
              containerClassName="w-full sm:w-40 shrink-0"
              triggerClassName="bg-white border-slate-200 text-xs shadow-2xs font-medium"
            />
          </div>
        }
      />

      {/* Staff Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <DataTable
          columns={columns}
          data={filteredEmployees}
          keyField="id"
          emptyMessage="No employees matching the current filters."
        />
      </div>

      {/* ================= ADD / EDIT EMPLOYEE MODAL ================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-8 animate-scale-up">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#DB2F3C]" />
                <h3 className="text-sm font-bold text-slate-900">Add New Organization Employee</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNewEmployee} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomTextInput
                  label="Full Name *"
                  value={formData.fullName}
                  onChange={(e) => setEmployeeFieldValue('fullName', e.target.value)}
                  placeholder="e.g. Suresh Hingorani"
                  error={(employeeSubmitAttempted || employeeTouched.fullName) ? employeeErrors.fullName : undefined}
                  size="sm"
                />

                <CustomTextInput
                  label="Employee Code *"
                  value={formData.employeeId}
                  onChange={(e) => setEmployeeFieldValue('employeeId', e.target.value)}
                  placeholder="EMP011"
                  error={(employeeSubmitAttempted || employeeTouched.employeeId) ? employeeErrors.employeeId : undefined}
                  size="sm"
                />

                <CustomTextInput
                  label="Official Email *"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setEmployeeFieldValue('email', e.target.value)}
                  placeholder="suresh.h@sindhimatrimony.com"
                  error={(employeeSubmitAttempted || employeeTouched.email) ? employeeErrors.email : undefined}
                  size="sm"
                />

                <CustomTextInput
                  label="Mobile Number *"
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => setEmployeeFieldValue('mobile', e.target.value)}
                  placeholder="+91 98200 00000"
                  error={(employeeSubmitAttempted || employeeTouched.mobile) ? employeeErrors.mobile : undefined}
                  size="sm"
                />

                <div className="md:col-span-2">
                  <CustomMultiSelect
                    label="Assign Role(s) (RBAC Multi-Select) *"
                    optionalBadge={`${formData.roles?.length || 0} of ${ALL_ROLES.length} Roles Selected`}
                    value={formData.roles || [formData.role]}
                    onChange={handleRolesChange}
                    options={ALL_ROLES.map((r) => {
                      const meta = ROLE_DEFINITIONS[r];
                      return {
                        value: r,
                        label: `${meta?.label || r} (${r})`,
                        description: meta?.description,
                        badge: meta?.department,
                        badgeBg: meta?.badgeBg,
                        badgeText: meta?.badgeText,
                      };
                    })}
                    placeholder="Select one or multiple roles..."
                    searchable
                    searchPlaceholder="Search roles (e.g. CRM, Moderator, Finance)..."
                    showSelectAll
                    size="sm"
                    error={
                      employeeSubmitAttempted && (!formData.roles || formData.roles.length === 0)
                        ? 'Please select at least one role.'
                        : undefined
                    }
                    helperText={
                      formData.roles && formData.roles.length > 1
                        ? `Primary Role: ${ROLE_DEFINITIONS[formData.roles[0]]?.label || formData.roles[0]}. Portal sidebar sections will union all ${formData.roles.length} roles automatically.`
                        : ROLE_DEFINITIONS[formData.role]?.description
                    }
                  />
                </div>

                <CustomDropDown
                  label="Record Data Scope *"
                  value={formData.recordScope}
                  onChange={(val) => setEmployeeFieldValue('recordScope', val as RecordScope)}
                  options={[
                    { value: 'ALL', label: 'ALL — Full database records access' },
                    { value: 'TEAM', label: 'TEAM — Team members data only' },
                    { value: 'ASSIGNED', label: 'ASSIGNED — Assigned customers only' },
                    { value: 'OWN', label: 'OWN — Strictly self-created leads only' },
                    { value: 'REGION', label: 'REGION — Assigned territories only' },
                  ]}
                  size="sm"
                />

                <CustomTextInput
                  label="Department"
                  value={formData.department}
                  onChange={(e) => setEmployeeFieldValue('department', e.target.value)}
                  size="sm"
                />

                <CustomTextInput
                  label="Reporting Manager"
                  value={formData.managerName}
                  onChange={(e) => setEmployeeFieldValue('managerName', e.target.value)}
                  size="sm"
                />

                <CustomTextInput
                  label="Max Lead Capacity"
                  type="number"
                  value={String(formData.maxLeadCapacity ?? '')}
                  onChange={(e) => setEmployeeFieldValue('maxLeadCapacity', e.target.value ? Number(e.target.value) : 0)}
                  size="sm"
                />

                <CustomTextInput
                  label="Assigned Region(s)"
                  value={formData.regions}
                  onChange={(e) => setEmployeeFieldValue('regions', e.target.value)}
                  placeholder="Mumbai, Pune, Dubai"
                  size="sm"
                />

                <CustomTextInput
                  label="Spoken Languages"
                  value={formData.languages}
                  onChange={(e) => setEmployeeFieldValue('languages', e.target.value)}
                  placeholder="Sindhi, Hindi, English"
                  size="sm"
                />
              </div>

              {/* ================= SIDEBAR SECTIONS ACCESS ================= */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/70 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 pb-2">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-[#DB2F3C]" />
                      Sidebar Sections Access (साइडबार सेक्शंस अनुमति)
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      When this employee logs in, ONLY the selected sidebar sections will be visible to them.
                    </p>
                  </div>
                  <span className="self-start sm:self-auto px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800 border border-rose-200 shadow-2xs">
                    {formData.allowedSections?.length || 0} of {SIDEBAR_SECTIONS.length} Sections Selected
                  </span>
                </div>

                {/* Quick Presets */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                    Presets:
                  </span>
                  <button
                    type="button"
                    onClick={() => setEmployeeFieldValue('allowedSections', SIDEBAR_SECTIONS.map((s) => s.id))}
                    className="px-2 py-1 text-[10px] font-bold rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition cursor-pointer"
                  >
                    Select All (19)
                  </button>
                  <button
                    type="button"
                    onClick={() => setEmployeeFieldValue('allowedSections', ['leads', 'tasks', 'chat'])}
                    className="px-2 py-1 text-[10px] font-bold rounded-lg bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-800 transition cursor-pointer"
                  >
                    CRM Exec (3)
                  </button>
                  <button
                    type="button"
                    onClick={() => setEmployeeFieldValue('allowedSections', ['matchmaking', 'match_responses', 'member_search', 'chat'])}
                    className="px-2 py-1 text-[10px] font-bold rounded-lg bg-purple-50 border border-purple-200 hover:bg-purple-100 text-purple-800 transition cursor-pointer"
                  >
                    Matchmaker (4)
                  </button>
                  <button
                    type="button"
                    onClick={() => setEmployeeFieldValue('allowedSections', ['verifications', 'member_search'])}
                    className="px-2 py-1 text-[10px] font-bold rounded-lg bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-800 transition cursor-pointer"
                  >
                    Verification (2)
                  </button>
                  <button
                    type="button"
                    onClick={() => setEmployeeFieldValue('allowedSections', [])}
                    className="px-2 py-1 text-[10px] font-bold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>

                {/* Section Checkboxes Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-56 overflow-y-auto p-1 custom-scrollbar">
                  {SIDEBAR_SECTIONS.map((sec) => {
                    const isChecked = Boolean(formData.allowedSections?.includes(sec.id));
                    return (
                      <label
                        key={sec.id}
                        className={`flex items-start gap-2 p-2 rounded-xl border text-xs cursor-pointer transition select-none ${
                          isChecked
                            ? 'bg-white border-rose-300 ring-1 ring-rose-200 shadow-2xs'
                            : 'bg-white/60 border-slate-200 hover:bg-white text-slate-600'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            const cur = formData.allowedSections || [];
                            const updated = e.target.checked
                              ? [...cur, sec.id]
                              : cur.filter((id) => id !== sec.id);
                            setEmployeeFieldValue('allowedSections', updated);
                          }}
                          className="mt-0.5 rounded text-[#DB2F3C] focus:ring-[#DB2F3C]"
                        />
                        <div className="min-w-0">
                          <span className={`block font-bold truncate ${isChecked ? 'text-slate-900' : 'text-slate-700'}`}>
                            {sec.name}
                          </span>
                          <span className="block text-[10px] text-slate-400 line-clamp-1">
                            {sec.description}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <CustomButton
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </CustomButton>
                <CustomButton variant="primary" size="sm" type="submit">
                  Save & Provision Access
                </CustomButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= GRANULAR PERMISSION MATRIX MODAL ================= */}
      {isPermissionModalOpen && selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden my-8 animate-scale-up">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#DB2F3C]" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Fine-Grained Permission Matrix:{' '}
                    <span className="text-[#DB2F3C]">{selectedEmployee.fullName}</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Role: {ROLE_DEFINITIONS[selectedEmployee.role]?.label} ({selectedEmployee.role})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPermissionModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Reset to Role Default */}
              <div className="flex items-center justify-between bg-amber-50 p-3 rounded-xl border border-amber-200">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-700" />
                  <span className="text-xs font-semibold text-amber-900">
                    Use Standard Preset for {selectedEmployee.role}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditablePermissions(getDefaultPermissionsForRole(selectedEmployee.role));
                    setEditableAllowedSections(getDefaultAllowedSectionsForRole(selectedEmployee.role));
                  }}
                  className="px-2.5 py-1 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg shadow-2xs cursor-pointer"
                >
                  Reset Defaults
                </button>
              </div>

              {/* Sidebar Sections Access Card */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/70">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 pb-2 mb-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-[#DB2F3C]" />
                      Visible Sidebar Sections (साइडबार में दिखने वाले सेक्शंस)
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      When {selectedEmployee.fullName} logs in, only these selected sections will be visible in their sidebar.
                    </p>
                  </div>
                  <span className="self-start sm:self-auto px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800 border border-rose-200 shadow-2xs">
                    {editableAllowedSections.length} of {SIDEBAR_SECTIONS.length} Sections Active
                  </span>
                </div>

                {/* Quick Presets */}
                <div className="flex flex-wrap items-center gap-1.5 mb-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                    Presets:
                  </span>
                  <button
                    type="button"
                    onClick={() => setEditableAllowedSections(SIDEBAR_SECTIONS.map((s) => s.id))}
                    className="px-2 py-0.5 text-[10px] font-bold rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition cursor-pointer"
                  >
                    All Sections (19)
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditableAllowedSections(['leads', 'tasks', 'chat'])}
                    className="px-2 py-0.5 text-[10px] font-bold rounded-lg bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-800 transition cursor-pointer"
                  >
                    CRM Exec (3)
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditableAllowedSections(['matchmaking', 'match_responses', 'member_search', 'chat'])}
                    className="px-2 py-0.5 text-[10px] font-bold rounded-lg bg-purple-50 border border-purple-200 hover:bg-purple-100 text-purple-800 transition cursor-pointer"
                  >
                    Matchmaker (4)
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditableAllowedSections(['verifications', 'member_search'])}
                    className="px-2 py-0.5 text-[10px] font-bold rounded-lg bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-800 transition cursor-pointer"
                  >
                    Verification (2)
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditableAllowedSections([])}
                    className="px-2 py-0.5 text-[10px] font-bold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-56 overflow-y-auto p-1 custom-scrollbar">
                  {SIDEBAR_SECTIONS.map((sec) => {
                    const isChecked = editableAllowedSections.includes(sec.id);
                    return (
                      <label
                        key={sec.id}
                        className={`flex items-start gap-2 p-2 rounded-xl border text-xs cursor-pointer transition select-none ${
                          isChecked
                            ? 'bg-white border-rose-300 ring-1 ring-rose-200 shadow-2xs'
                            : 'bg-white/60 border-slate-200 hover:bg-white text-slate-600'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            const updated = e.target.checked
                              ? [...editableAllowedSections, sec.id]
                              : editableAllowedSections.filter((id) => id !== sec.id);
                            setEditableAllowedSections(updated);
                          }}
                          className="mt-0.5 rounded text-[#DB2F3C] focus:ring-[#DB2F3C]"
                        />
                        <div className="min-w-0">
                          <span className={`block font-bold truncate ${isChecked ? 'text-slate-900' : 'text-slate-700'}`}>
                            {sec.name}
                          </span>
                          <span className="block text-[10px] text-slate-400 line-clamp-1">
                            {sec.description}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Modules Matrix */}
              <div className="space-y-4">
                {/* Leads Module */}
                <div className="border border-slate-200 rounded-xl p-4">
                  <h4 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                    CRM Leads & Calling
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['view', 'edit', 'assign', 'call', 'export'] as const).map((act) => (
                      <label
                        key={act}
                        className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100 hover:bg-slate-100 cursor-pointer text-xs"
                      >
                        <input
                          type="checkbox"
                          checked={Boolean(editablePermissions.leads?.[act])}
                          onChange={(e) => {
                            const val = e.target.checked;
                            setEditablePermissions((prev) => ({
                              ...prev,
                              leads: { ...prev.leads, [act]: val },
                            }));
                          }}
                          className="rounded text-[#DB2F3C] focus:ring-[#DB2F3C]"
                        />
                        <span className="capitalize text-slate-700 font-medium">{act} Leads</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Members Module */}
                <div className="border border-slate-200 rounded-xl p-4">
                  <h4 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-purple-600" />
                    Members & Profiles
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['view', 'edit', 'verify', 'delete'] as const).map((act) => (
                      <label
                        key={act}
                        className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100 hover:bg-slate-100 cursor-pointer text-xs"
                      >
                        <input
                          type="checkbox"
                          checked={Boolean(editablePermissions.members?.[act])}
                          onChange={(e) => {
                            const val = e.target.checked;
                            setEditablePermissions((prev) => ({
                              ...prev,
                              members: { ...prev.members, [act]: val },
                            }));
                          }}
                          className="rounded text-[#DB2F3C] focus:ring-[#DB2F3C]"
                        />
                        <span className="capitalize text-slate-700 font-medium">
                          {act} Profiles
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Finance Module */}
                <div className="border border-slate-200 rounded-xl p-4">
                  <h4 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                    Finance, Payments & Refunds
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['view', 'refund', 'export'] as const).map((act) => (
                      <label
                        key={act}
                        className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100 hover:bg-slate-100 cursor-pointer text-xs"
                      >
                        <input
                          type="checkbox"
                          checked={Boolean(editablePermissions.finance?.[act])}
                          onChange={(e) => {
                            const val = e.target.checked;
                            setEditablePermissions((prev) => ({
                              ...prev,
                              finance: { ...prev.finance, [act]: val },
                            }));
                          }}
                          className="rounded text-[#DB2F3C] focus:ring-[#DB2F3C]"
                        />
                        <span className="capitalize text-slate-700 font-medium">{act} Finance</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Settings & Admin Tools */}
                <div className="border border-slate-200 rounded-xl p-4">
                  <h4 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-rose-600" />
                    Governance & Settings
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100 hover:bg-slate-100 cursor-pointer text-xs">
                      <input
                        type="checkbox"
                        checked={Boolean(editablePermissions.settings?.manage)}
                        onChange={(e) => {
                          const val = e.target.checked;
                          setEditablePermissions((prev) => ({
                            ...prev,
                            settings: { ...prev.settings, manage: val },
                          }));
                        }}
                        className="rounded text-[#DB2F3C] focus:ring-[#DB2F3C]"
                      />
                      <span className="text-slate-700 font-medium">Manage System Settings</span>
                    </label>

                    <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100 hover:bg-slate-100 cursor-pointer text-xs">
                      <input
                        type="checkbox"
                        checked={Boolean(editablePermissions.reports?.export)}
                        onChange={(e) => {
                          const val = e.target.checked;
                          setEditablePermissions((prev) => ({
                            ...prev,
                            reports: { ...prev.reports, export: val },
                          }));
                        }}
                        className="rounded text-[#DB2F3C] focus:ring-[#DB2F3C]"
                      />
                      <span className="text-slate-700 font-medium">Export Compliance Reports</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
              <span className="text-[11px] text-amber-700 font-medium flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                Audit compliance requires reason text before saving.
              </span>
              <div className="flex items-center gap-2">
                <CustomButton
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setIsPermissionModalOpen(false)}
                >
                  Cancel
                </CustomButton>
                <CustomButton
                  variant="primary"
                  size="sm"
                  type="button"
                  onClick={handleRequestSavePermissions}
                >
                  Proceed to Reason Verification
                </CustomButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= REASON MANDATORY MODAL ================= */}
      <ReasonModal
        isOpen={isReasonModalOpen}
        title="Permission Override Reason Required"
        description="Every manual alteration of staff access or role capabilities must be accompanied by an immutable audit rationale."
        confirmText="Sign & Save Changes"
        onClose={() => {
          setIsReasonModalOpen(false);
          setPendingPermissionSave(null);
        }}
        onConfirm={handleConfirmPermissionReason}
      />

      {/* ================= AUDIT LOGS MODAL ================= */}
      {isAuditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden my-8 animate-scale-up">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Staff Role & Permission Audit History
                </h3>
              </div>
              <button
                onClick={() => setIsAuditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-3">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 font-mono">
                      Target: {log.employeeId}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">{log.changedAt}</span>
                  </div>
                  <div className="text-xs text-slate-700">
                    <span className="font-semibold text-slate-900">Reason:</span> {log.reason}
                  </div>
                  <div className="text-[11px] text-indigo-700 font-mono bg-indigo-50/80 px-2 py-0.5 rounded border border-indigo-100 inline-block">
                    {log.permissionDiff}
                  </div>
                  <div className="text-[10px] text-slate-400">Changed by: {log.changedBy}</div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-end">
              <CustomButton
                variant="secondary"
                size="sm"
                onClick={() => setIsAuditModalOpen(false)}
              >
                Close Audit Viewer
              </CustomButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeScreen;
