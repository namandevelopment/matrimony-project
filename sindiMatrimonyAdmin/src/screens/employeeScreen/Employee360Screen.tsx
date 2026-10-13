import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Phone,
  Mail,
  Shield,
  ShieldCheck,
  Building2,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  HeartHandshake,
  Users,
  Plus,
  MessageSquare,
  TrendingUp,
  Sparkles,
  X,
  Volume2,
} from 'lucide-react';
import { crmDataService } from '../../services/crmDataService';
import type { Employee } from '../../types/employee.types';
import type {
  ClientProfile,
  Lead,
  CallLog,
  FollowUpTask,
  MatchRecommendation,
  ClientAssignmentHistory,
  SalesTransaction,
  ActivityTimelineEvent,
  EmployeeSummaryMetrics,
  CallOutcome,
  CallStatus,
  CallDirection,
  CallSource,
  TaskType,
  LeadPriority,
} from '../../types/crm.types';
import { ROLE_DEFINITIONS } from '../../utils/rbac';
import { toast } from '../../toastMessage/toast';
import { CustomTextInput } from '../../components/CustomTextInput';
import { CustomDropDown } from '../../components/CustomDropDown';
import { useInputs } from '../../customHooks/useInputs';

type TabKey =
  | 'overview'
  | 'leads'
  | 'clients'
  | 'calls'
  | 'communications'
  | 'tasks'
  | 'matchmaking'
  | 'responses'
  | 'sales'
  | 'attendance'
  | 'assignments'
  | 'timeline';

interface TabItem {
  key: TabKey;
  label: string;
  badge?: number | string;
}

export const Employee360Screen: React.FC = () => {
  const params = useParams<{ employeeId?: string; id?: string }>();
  const navigate = useNavigate();
  const rawId = params.employeeId || params.id || 'emp_003';

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [dateRange, setDateRange] = useState<'TODAY' | 'WEEK' | 'MONTH' | 'ALL'>('ALL');

  // Modals & Drawers
  const [isLogCallModalOpen, setIsLogCallModalOpen] = useState(false);
  const [isReassignModalOpen, setIsReassignModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [selectedCallForDrawer, setSelectedCallForDrawer] = useState<CallLog | null>(null);
  const [clientToReassign, setClientToReassign] = useState<ClientProfile | null>(null);

  // Form states for modals with useInputs
  const {
    values: callForm,
    setFieldValue: setCallField,
  } = useInputs<{
    clientId: string;
    direction: CallDirection;
    status: CallStatus;
    durationSec: number;
    purpose: string;
    outcome: CallOutcome;
    clientResponse: string;
    nextAction: string;
    followUpDateTime: string;
    notes: string;
    source: CallSource;
  }>({
    clientId: 'SIND001',
    direction: 'OUTGOING',
    status: 'CONNECTED',
    durationSec: 360,
    purpose: 'Match Feedback Follow-up',
    outcome: 'MATCH_APPROVED',
    clientResponse: 'Client agreed to proceed with proposal.',
    nextAction: 'Schedule candidate contact call.',
    followUpDateTime: '2025-10-14 11:00 AM',
    notes: 'Exotel verified call.',
    source: 'TELEPHONY_EXOTEL',
  });

  const {
    values: reassignForm,
    setFieldValue: setReassignField,
  } = useInputs<{
    targetEmployeeId: string;
    reason: string;
  }>({
    targetEmployeeId: 'emp_004',
    reason: 'Portfolio balancing and territory realignment.',
  });

  const {
    values: taskForm,
    setFieldValue: setTaskField,
  } = useInputs<{
    clientId: string;
    taskType: TaskType;
    dueDate: string;
    dueTime: string;
    priority: LeadPriority;
    notes: string;
  }>({
    clientId: 'SIND001',
    taskType: 'PROFILE_SHARE',
    dueDate: '2025-10-15',
    dueTime: '11:00 AM',
    priority: 'HIGH',
    notes: 'Send 2 shortlisted Amil candidate profiles with horoscopes.',
  });

  // State from CRM Data Service
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [clients, setClients] = useState<ClientProfile[]>([]);
  const [calls, setCalls] = useState<CallLog[]>([]);
  const [tasks, setTasks] = useState<FollowUpTask[]>([]);
  const [matches, setMatches] = useState<MatchRecommendation[]>([]);
  const [assignments, setAssignments] = useState<ClientAssignmentHistory[]>([]);
  const [transactions, setTransactions] = useState<SalesTransaction[]>([]);
  const [activities, setActivities] = useState<ActivityTimelineEvent[]>([]);
  const [metrics, setMetrics] = useState<EmployeeSummaryMetrics | null>(null);

  const refreshData = () => {
    const emp = crmDataService.getEmployeeById(rawId);
    setEmployee(emp || null);
    setAllEmployees(crmDataService.getEmployees());
    if (emp) {
      setLeads(crmDataService.getLeadsByEmployee(emp.id));
      setClients(crmDataService.getClientsByEmployee(emp.id));
      setCalls(crmDataService.getCallsByEmployee(emp.id));
      setTasks(crmDataService.getTasksByEmployee(emp.id));
      setMatches(crmDataService.getMatchesByEmployee(emp.id));
      setAssignments(crmDataService.getAssignmentHistory(emp.id));
      setTransactions(crmDataService.getTransactionsByEmployee(emp.id));
      setActivities(crmDataService.getActivities(emp.id));
      setMetrics(crmDataService.calculateEmployeeMetrics(emp.id, dateRange));
    }
  };

  useEffect(() => {
    refreshData();
    const unsubscribe = crmDataService.subscribe(() => {
      refreshData();
    });
    return unsubscribe;
  }, [rawId, dateRange]);

  const tabs: TabItem[] = useMemo(
    () => [
      { key: 'overview', label: '1. Overview' },
      { key: 'leads', label: '2. Assigned Leads', badge: leads.length },
      { key: 'clients', label: '3. Client Portfolio', badge: clients.length },
      { key: 'calls', label: '4. Call History', badge: calls.length },
      { key: 'communications', label: '5. Communications', badge: activities.filter((a) => a.type === 'CALL_LOGGED' || a.type === 'PROFILE_SHARED').length },
      { key: 'tasks', label: '6. Follow-ups & Tasks', badge: tasks.filter((t) => t.status === 'PENDING' || t.status === 'DUE_TODAY' || t.status === 'OVERDUE').length },
      { key: 'matchmaking', label: '7. Assisted Matches', badge: matches.length },
      { key: 'responses', label: '8. Match Responses', badge: matches.filter((m) => m.clientResponse !== 'PENDING').length },
      { key: 'sales', label: '9. Sales & Revenue', badge: `₹${((metrics?.revenueAttributed || 0) / 1000).toFixed(0)}k` },
      { key: 'attendance', label: '10. Work Sessions' },
      { key: 'assignments', label: '11. Assignment History', badge: assignments.length },
      { key: 'timeline', label: '12. Activity Timeline', badge: activities.length },
    ],
    [leads.length, clients.length, calls.length, tasks, matches, metrics, assignments.length, activities.length]
  );

  const handleSaveCallLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employee) return;
    const client = clients.find((c) => c.clientId === callForm.clientId || c.id === callForm.clientId) || clients[0];
    crmDataService.addCallLog({
      clientId: client ? client.clientId : 'SIND001',
      clientName: client ? client.fullName : 'Roshni Motwani',
      clientPhone: '+91 98200 44321',
      date: new Date().toISOString().split('T')[0],
      startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      durationSec: Number(callForm.durationSec) || 300,
      direction: callForm.direction,
      status: callForm.status,
      purpose: callForm.purpose,
      outcome: callForm.outcome,
      clientResponse: callForm.clientResponse,
      nextAction: callForm.nextAction,
      followUpDateTime: callForm.followUpDateTime,
      assignedEmployeeId: employee.id,
      assignedEmployeeName: employee.fullName,
      notes: callForm.notes,
      recordedBy: `${employee.fullName} (${employee.employeeId})`,
      callSource: callForm.source,
      verificationStatus: callForm.source === 'TELEPHONY_EXOTEL' ? 'VERIFIED' : 'MANUAL_ENTRY',
    });
    setIsLogCallModalOpen(false);
    toast.success('Call log recorded successfully!');
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employee) return;
    const client = clients.find((c) => c.clientId === taskForm.clientId) || clients[0];
    crmDataService.addTask({
      clientId: client ? client.clientId : 'SIND001',
      clientName: client ? client.fullName : 'Roshni Motwani',
      taskType: taskForm.taskType,
      createdDate: new Date().toISOString().split('T')[0],
      dueDate: taskForm.dueDate,
      dueTime: taskForm.dueTime,
      priority: taskForm.priority,
      status: 'PENDING',
      assignedEmployeeId: employee.id,
      assignedEmployeeName: employee.fullName,
      notes: taskForm.notes,
    });
    setIsAddTaskModalOpen(false);
    toast.success('Follow-up task scheduled successfully!');
  };

  const handleConfirmReassign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientToReassign || !employee) return;
    crmDataService.reassignClient(
      clientToReassign.clientId,
      reassignForm.targetEmployeeId,
      `${employee.fullName} (Super Admin / Manager)`,
      reassignForm.reason
    );
    setIsReassignModalOpen(false);
    toast.success(`Client ${clientToReassign.fullName} reassigned with permanent audit record!`);
    setClientToReassign(null);
  };

  if (!employee) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-slate-200">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-900">Employee Not Found</h2>
        <p className="text-slate-500 text-sm mt-1">
          No employee matching ID <code className="bg-slate-100 px-2 py-0.5 rounded text-rose-600">{rawId}</code> was found in CRM.
        </p>
        <button
          onClick={() => navigate('/employees')}
          className="mt-4 px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-400 transition"
        >
          Return to Employee Directory
        </button>
      </div>
    );
  }

  const roleMeta = ROLE_DEFINITIONS[employee.role] || {
    label: employee.role,
    badgeBg: 'bg-slate-50',
    badgeText: 'text-slate-700',
    badgeBorder: 'border-slate-200',
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/employees')}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition shadow-2xs"
            title="Back to Employee Directory"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Employee 360° Management</span>
              <span className="text-slate-300">•</span>
              <span className="font-mono text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
                {employee.employeeId}
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              {employee.fullName}
              {employee.isActive ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active Staff
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                  Suspended
                </span>
              )}
            </h1>
          </div>
        </div>

        {/* Global Actions */}
        <div className="flex items-center gap-2.5">
          {/* Date Range Selector */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-2xs text-xs font-bold text-slate-600">
            {(['TODAY', 'WEEK', 'MONTH', 'ALL'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  dateRange === range
                    ? 'bg-gradient-to-r from-[#88131B] to-rose-700 text-white shadow-2xs font-extrabold'
                    : 'hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {range === 'TODAY' && 'Today'}
                {range === 'WEEK' && 'This Week'}
                {range === 'MONTH' && 'This Month'}
                {range === 'ALL' && 'All Time'}
              </button>
            ))}
          </div>

          <button
            onClick={() => navigate(`/chat?empId=${employee.id}`)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs transition shadow-xs cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Team Chat</span>
          </button>

          <button
            onClick={() => setIsLogCallModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#88131B] text-white hover:bg-rose-900 font-bold text-xs transition shadow-xs cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Log Call</span>
          </button>

          <button
            onClick={() => setIsAddTaskModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* SECTION A: Employee Overview Hero Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-40 bg-gradient-to-bl from-rose-50/80 via-amber-50/40 to-transparent pointer-events-none rounded-tr-3xl" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          {/* Left Avatar & Identity */}
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#88131B] via-rose-700 to-amber-500 text-white font-black text-2xl flex items-center justify-center shadow-md shrink-0 border-2 border-white">
              {employee.fullName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">{employee.fullName}</h2>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold border ${roleMeta.badgeBg} ${roleMeta.badgeText} ${roleMeta.badgeBorder}`}
                >
                  <Shield className="w-3 h-3" />
                  {roleMeta.label}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                  {employee.designation || 'Relationship Executive'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-1 mt-2 text-xs text-slate-600 font-medium">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{employee.email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{employee.mobile}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{employee.department} • {employee.team || 'General Team'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Joined: {employee.joiningDate || employee.createdAt}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-3 text-[11px] text-slate-500">
                <span>
                  Reporting Manager:{' '}
                  <strong className="text-slate-800">{employee.managerName || 'Rajesh Mulchandani (Director)'}</strong>
                </span>
                <span>•</span>
                <span>
                  Data Access Scope:{' '}
                  <span className="font-mono font-bold text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                    {employee.recordScope}
                  </span>
                </span>
                <span>•</span>
                <span>
                  Active Workload:{' '}
                  <strong className="text-slate-800">
                    {clients.length} / {employee.maxLeadCapacity || 50} Clients
                  </strong>
                </span>
                <span>•</span>
                <span>
                  Last Active: <span className="text-emerald-600 font-semibold">{employee.lastActiveAt || 'Just now'}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right Workload Progress Gauge */}
          <div className="w-full lg:w-64 bg-slate-50 border border-slate-200 rounded-2xl p-4 shrink-0">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
              <span>Workload Capacity</span>
              <span>{Math.round((clients.length / (employee.maxLeadCapacity || 50)) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-rose-600 to-amber-500 h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, Math.round((clients.length / (employee.maxLeadCapacity || 50)) * 100))}%`,
                }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
              <span>{clients.length} Active Clients</span>
              <span>Cap: {employee.maxLeadCapacity || 50}</span>
            </div>
          </div>
        </div>

        {/* 14 High-Impact KPI Summary Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mt-6 pt-6 border-t border-slate-100">
          <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Assigned Leads</span>
            <div className="text-xl font-black text-slate-900 mt-1">{metrics?.totalLeadsAssigned || 0}</div>
            <span className="text-[10px] text-slate-400 font-medium">In CRM pipeline</span>
          </div>

          <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Active Clients</span>
            <div className="text-xl font-black text-rose-700 mt-1">{metrics?.activeClients || 0}</div>
            <span className="text-[10px] text-slate-400 font-medium">Under management</span>
          </div>

          <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Calls Logged</span>
            <div className="text-xl font-black text-blue-700 mt-1">{metrics?.totalCallsLogged || 0}</div>
            <span className="text-[10px] text-emerald-600 font-bold">{metrics?.connectedCalls || 0} Connected</span>
          </div>

          <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Success Convos</span>
            <div className="text-xl font-black text-emerald-700 mt-1">{metrics?.successfulConversations || 0}</div>
            <span className="text-[10px] text-slate-400 font-medium">Positive outcomes</span>
          </div>

          <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Tasks Done</span>
            <div className="text-xl font-black text-teal-700 mt-1">{metrics?.followUpsCompleted || 0}</div>
            <span className="text-[10px] text-rose-600 font-bold">{metrics?.overdueFollowUps || 0} Overdue</span>
          </div>

          <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Matches Curated</span>
            <div className="text-xl font-black text-purple-700 mt-1">{metrics?.matchesGenerated || 0}</div>
            <span className="text-[10px] text-purple-600 font-bold">{metrics?.positiveResponses || 0} Accepted</span>
          </div>

          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-3">
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">Revenue Attributed</span>
            <div className="text-xl font-black text-amber-900 mt-1">
              ₹{((metrics?.revenueAttributed || 0) / 1000).toLocaleString()}k
            </div>
            <span className="text-[10px] text-amber-700 font-bold">{metrics?.conversionRate || 0}% Conversion</span>
          </div>
        </div>
      </div>

      {/* SECTION B: 12 Activity Tabs Navigation */}
      <div className="border-b border-slate-200 bg-white rounded-2xl px-3 py-1 shadow-2xs">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-[#88131B] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-md ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB CONTENT PANELS */}
      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quality & Productivity Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Verified Connect Rate</span>
                <Phone className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">{metrics?.verifiedConnectedRate}%</div>
              <div className="text-xs text-slate-400 mt-1">Exotel Telephony Handshake Verified</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Follow-up SLA Rate</span>
                <Clock className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">{metrics?.followUpCompletionRate}%</div>
              <div className="text-xs text-slate-400 mt-1">Completed within scheduled window</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Match Acceptance Rate</span>
                <HeartHandshake className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">{metrics?.matchAcceptanceRate}%</div>
              <div className="text-xs text-slate-400 mt-1">Positive client/candidate responses</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Sales Conversion</span>
                <TrendingUp className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">{metrics?.conversionRate}%</div>
              <div className="text-xs text-slate-400 mt-1">Leads to Paid Membership ratio</div>
            </div>
          </div>

          {/* Quick Priorities Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Urgent Follow-ups */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  Upcoming & Overdue Follow-ups
                </h3>
                <button
                  onClick={() => setActiveTab('tasks')}
                  className="text-xs font-bold text-rose-700 hover:underline"
                >
                  View All ({tasks.length})
                </button>
              </div>
              <div className="space-y-3">
                {tasks.slice(0, 4).map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{t.clientName}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white text-slate-600 border border-slate-200">
                          {t.taskType}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{t.notes}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          t.status === 'OVERDUE'
                            ? 'bg-rose-100 text-rose-800'
                            : t.status === 'DUE_TODAY'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {t.status}
                      </span>
                      <div className="text-[11px] text-slate-400 mt-0.5">{t.dueDate} {t.dueTime}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Assisted Match Recommendations */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-rose-600" />
                  Recent Assisted Matches Curated
                </h3>
                <button
                  onClick={() => setActiveTab('matchmaking')}
                  className="text-xs font-bold text-rose-700 hover:underline"
                >
                  View All ({matches.length})
                </button>
              </div>
              <div className="space-y-3">
                {matches.slice(0, 4).map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">
                          {m.clientName} & {m.candidateName}
                        </span>
                        <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {m.compatibilityScore}% Compatible
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                        {m.compatibilityReasons.join(' • ')}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                        {m.overallStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. ASSIGNED LEADS TAB */}
      {activeTab === 'leads' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Inquiry Leads Assigned to {employee.fullName}</h3>
            <span className="text-xs text-slate-500 font-medium">{leads.length} Active CRM Leads</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50/50">
                  <th className="py-3 px-3">Lead ID & Name</th>
                  <th className="py-3 px-3">Contact</th>
                  <th className="py-3 px-3">Subcaste / City</th>
                  <th className="py-3 px-3">Source</th>
                  <th className="py-3 px-3">Priority</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Next Action</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{l.name}</div>
                      <div className="font-mono text-[10px] text-slate-400">{l.leadId}</div>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-600">{l.mobile}</td>
                    <td className="py-3 px-3 text-slate-600">
                      {l.subcaste} • {l.city}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {l.source}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          l.priority === 'URGENT'
                            ? 'bg-rose-100 text-rose-800'
                            : l.priority === 'HIGH'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {l.priority}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {l.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500">{l.nextFollowUp || 'None'}</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => {
                          setCallField('purpose', `Inquiry Follow-up: ${l.name}`);
                          setIsLogCallModalOpen(true);
                        }}
                        className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-lg text-xs font-bold transition border border-amber-200"
                      >
                        Call
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. CLIENT PORTFOLIO TAB */}
      {activeTab === 'clients' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Active Matrimonial Client Portfolio</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Full client portfolio under relationship management. Reassigning a client permanently archives assignment history.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-700">{clients.length} Clients Managed</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50/50">
                  <th className="py-3 px-3">Client ID & Name</th>
                  <th className="py-3 px-3">Profile Attributes</th>
                  <th className="py-3 px-3">Plan & Expiry</th>
                  <th className="py-3 px-3">Relationship Status</th>
                  <th className="py-3 px-3">Calls (Done/Conn)</th>
                  <th className="py-3 px-3">Matches Shared</th>
                  <th className="py-3 px-3">Next Scheduled Call</th>
                  <th className="py-3 px-3 text-right">Portfolio Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {clients.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        {c.fullName}
                        {c.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />}
                      </div>
                      <div className="font-mono text-[10px] text-slate-400">{c.clientId}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      <div>{c.subcaste} ({c.gotra})</div>
                      <div className="text-[10px] text-slate-400">{c.city} • {c.profession}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-50 text-amber-900 border border-amber-300">
                        {c.membershipPlan}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-0.5">Exp: {c.membershipExpiry}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {c.relationshipStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-700 font-bold">
                      {c.totalCalls} / <span className="text-emerald-700">{c.connectedCalls}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-700 font-bold">
                      {c.matchesShared} shared / <span className="text-purple-700">{c.clientResponses} resp</span>
                    </td>
                    <td className="py-3 px-3 text-slate-500 font-medium">{c.nextFollowUp || 'None'}</td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setCallField('clientId', c.clientId);
                            setCallField('purpose', `Portfolio Call: ${c.fullName}`);
                            setIsLogCallModalOpen(true);
                          }}
                          className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-lg text-xs font-bold transition border border-amber-200"
                        >
                          Call
                        </button>
                        <button
                          onClick={() => {
                            setClientToReassign(c);
                            setIsReassignModalOpen(true);
                          }}
                          className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-lg text-xs font-bold transition border border-rose-200"
                        >
                          Reassign
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. CALL HISTORY TAB */}
      {activeTab === 'calls' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Complete Telephony & Interaction Log</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Displays verified telephony events alongside manually logged calls. Click any record to inspect call drawer details.
              </p>
            </div>
            <button
              onClick={() => setIsLogCallModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#88131B] text-white hover:bg-rose-900 font-bold text-xs shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record New Call</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50/50">
                  <th className="py-3 px-3">Call ID & Date</th>
                  <th className="py-3 px-3">Client Name</th>
                  <th className="py-3 px-3">Dir / Duration</th>
                  <th className="py-3 px-3">Call Status</th>
                  <th className="py-3 px-3">Outcome</th>
                  <th className="py-3 px-3">Purpose & Notes</th>
                  <th className="py-3 px-3">Verification Source</th>
                  <th className="py-3 px-3 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {calls.map((call) => (
                  <tr
                    key={call.id}
                    onClick={() => setSelectedCallForDrawer(call)}
                    className="hover:bg-slate-50/80 transition cursor-pointer"
                  >
                    <td className="py-3 px-3">
                      <div className="font-mono font-bold text-slate-900">{call.callLogId}</div>
                      <div className="text-[10px] text-slate-400">{call.date} {call.startTime}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{call.clientName}</div>
                      <div className="text-[10px] text-slate-400">{call.clientPhone}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-slate-700">{call.direction}</span>
                      <div className="text-[10px] text-slate-400">
                        {Math.floor(call.durationSec / 60)}m {call.durationSec % 60}s
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          call.status === 'CONNECTED'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {call.status}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-300">
                        {call.outcome}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 max-w-xs truncate">
                      <span className="font-bold text-slate-800">{call.purpose}</span>
                      <p className="text-[11px] text-slate-400 truncate">{call.notes}</p>
                    </td>
                    <td className="py-3 px-3">
                      {call.verificationStatus === 'VERIFIED' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Exotel Telephony
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                          Manual Entry
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button className="text-xs font-bold text-rose-700 hover:text-rose-900">
                        Inspect →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. COMMUNICATIONS TAB */}
      {activeTab === 'communications' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">Omnichannel Communication Stream</h3>
          <div className="space-y-3">
            {activities
              .filter((a) => a.type === 'CALL_LOGGED' || a.type === 'PROFILE_SHARED' || a.type === 'CLIENT_CONTACTED')
              .map((act) => (
                <div key={act.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#88131B] to-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-slate-900">{act.title}</h4>
                      <span className="text-[11px] font-mono text-slate-400">{act.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{act.description}</p>
                    <div className="mt-2 text-[10px] font-mono text-slate-400">Ref: {act.entityId}</div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 6. FOLLOW-UPS & TASKS TAB */}
      {activeTab === 'tasks' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Action Tasks & Due Reminders</h3>
            <button
              onClick={() => setIsAddTaskModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold text-xs shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Task</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50/50">
                  <th className="py-3 px-3">Task ID</th>
                  <th className="py-3 px-3">Client</th>
                  <th className="py-3 px-3">Task Type</th>
                  <th className="py-3 px-3">Due Date & Time</th>
                  <th className="py-3 px-3">Priority</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Notes</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">{task.taskId}</td>
                    <td className="py-3 px-3 font-bold text-slate-800">{task.clientName}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {task.taskType}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{task.dueDate} {task.dueTime}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          task.priority === 'URGENT'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          task.status === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : task.status === 'OVERDUE'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500 max-w-xs truncate">{task.notes}</td>
                    <td className="py-3 px-3 text-right">
                      {task.status !== 'COMPLETED' && (
                        <button
                          onClick={() => crmDataService.updateTaskStatus(task.taskId, 'COMPLETED', 'Successfully followed up')}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold transition border border-emerald-200"
                        >
                          Mark Complete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. ASSISTED MATCHMAKING TAB */}
      {activeTab === 'matchmaking' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Curated Match Recommendations</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Matches suggested and reviewed by {employee.fullName}. Unique constraints prevent duplicate pairs.
              </p>
            </div>
            <button
              onClick={() => navigate('/matchmaking')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#88131B] text-white hover:bg-rose-900 font-bold text-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Launch Matchmaker Engine</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50/50">
                  <th className="py-3 px-3">Match ID</th>
                  <th className="py-3 px-3">Client Profile</th>
                  <th className="py-3 px-3">Candidate Profile</th>
                  <th className="py-3 px-3">Compatibility Score</th>
                  <th className="py-3 px-3">Employee Review</th>
                  <th className="py-3 px-3">Client Response</th>
                  <th className="py-3 px-3">Candidate Response</th>
                  <th className="py-3 px-3">Overall Stage</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {matches.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">{m.matchId}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">
                      {m.clientName}
                      <div className="text-[10px] text-slate-400 font-normal">{m.clientSubcaste} • {m.clientCity}</div>
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900">
                      {m.candidateName}
                      <div className="text-[10px] text-slate-400 font-normal">{m.candidateSubcaste} • {m.candidateCity}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {m.compatibilityScore}%
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          m.reviewStatus === 'APPROVED'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {m.reviewStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          m.clientResponse === 'ACCEPTED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : m.clientResponse === 'DECLINED'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {m.clientResponse}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          m.candidateResponse === 'ACCEPTED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : m.candidateResponse === 'DECLINED'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {m.candidateResponse}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-purple-50 text-purple-800 border border-purple-200">
                        {m.overallStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {m.reviewStatus === 'APPROVED' && m.clientResponse === 'PENDING' && (
                        <button
                          onClick={() => crmDataService.shareMatchWithClient(m.matchId)}
                          className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 rounded-lg text-xs font-bold transition border border-indigo-200"
                        >
                          Share Profile
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 8. MATCH RESPONSES TAB */}
      {activeTab === 'responses' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Separate Client & Candidate Responses Audit</h3>
            <span className="text-xs text-slate-500 font-medium">Independent Response Tracking</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matches.map((m) => (
              <div key={m.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-900">{m.matchId}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-purple-50 text-purple-800 border border-purple-200">
                    {m.overallStatus}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 p-3 bg-white rounded-xl border border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Client Response</span>
                    <div className="font-bold text-xs text-slate-800 mt-0.5">{m.clientName}</div>
                    <span
                      className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                        m.clientResponse === 'ACCEPTED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : m.clientResponse === 'DECLINED'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {m.clientResponse}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-1">Source: {m.clientResponseRecordedBy || 'Client'}</div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Candidate Response</span>
                    <div className="font-bold text-xs text-slate-800 mt-0.5">{m.candidateName}</div>
                    <span
                      className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                        m.candidateResponse === 'ACCEPTED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : m.candidateResponse === 'DECLINED'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {m.candidateResponse}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-1">Source: {m.candidateResponseRecordedBy || 'Candidate'}</div>
                  </div>
                </div>

                {/* Response Action Helpers */}
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => crmDataService.recordClientResponse(m.matchId, 'ACCEPTED', 'EMPLOYEE', 'Client accepted via phone')}
                    className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-[11px] font-bold border border-emerald-200"
                  >
                    Accept (Client)
                  </button>
                  <button
                    onClick={() => crmDataService.recordCandidateResponse(m.matchId, 'ACCEPTED', 'EMPLOYEE', 'Candidate accepted via phone')}
                    className="px-2 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-lg text-[11px] font-bold border border-teal-200"
                  >
                    Accept (Candidate)
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 9. SALES & REVENUE TAB */}
      {activeTab === 'sales' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Membership Revenue & Sales Attributed</h3>
            <span className="text-xs font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
              Total Attributed: ₹{((metrics?.revenueAttributed || 0) / 1000).toFixed(1)}k
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50/50">
                  <th className="py-3 px-3">Transaction ID</th>
                  <th className="py-3 px-3">Client</th>
                  <th className="py-3 px-3">Plan</th>
                  <th className="py-3 px-3">Amount + Tax</th>
                  <th className="py-3 px-3">Total Attributed</th>
                  <th className="py-3 px-3">Gateway</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">{t.transactionId}</td>
                    <td className="py-3 px-3 font-bold text-slate-800">{t.clientName}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-50 text-amber-900 border border-amber-300">
                        {t.planName}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">₹{t.amount.toLocaleString()} + ₹{t.tax}</td>
                    <td className="py-3 px-3 font-extrabold text-slate-900">₹{t.totalAmount.toLocaleString()}</td>
                    <td className="py-3 px-3 text-slate-500 font-mono text-[10px]">{t.paymentGateway}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {t.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500">{t.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 10. ATTENDANCE / WORK SESSIONS TAB */}
      {activeTab === 'attendance' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">Work Sessions & Access Verification</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
              <span className="text-xs font-semibold text-slate-500">Today's First Login</span>
              <div className="text-lg font-bold text-slate-900 mt-1">09:30 AM (IST)</div>
              <span className="text-[10px] text-emerald-600 font-bold">Online Session Active</span>
            </div>
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
              <span className="text-xs font-semibold text-slate-500">Total Active Hours (Today)</span>
              <div className="text-lg font-bold text-slate-900 mt-1">6 hrs 45 mins</div>
              <span className="text-[10px] text-slate-400">Standard shift 8 hrs</span>
            </div>
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
              <span className="text-xs font-semibold text-slate-500">Security MFA Status</span>
              <div className="text-lg font-bold text-emerald-700 mt-1">Verified Device</div>
              <span className="text-[10px] text-slate-400">IP: 103.24.88.12 (Mumbai)</span>
            </div>
          </div>
        </div>
      )}

      {/* 11. ASSIGNMENT HISTORY TAB */}
      {activeTab === 'assignments' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Historical Portfolio Reassignment Log</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Every client reassignment preserves the original interaction log and attributes previous work permanently.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50/50">
                  <th className="py-3 px-3">Client</th>
                  <th className="py-3 px-3">From Employee</th>
                  <th className="py-3 px-3">To Employee</th>
                  <th className="py-3 px-3">Reassigned At</th>
                  <th className="py-3 px-3">Authorized By</th>
                  <th className="py-3 px-3">Mandatory Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {assignments.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-3 font-bold text-slate-900">
                      {a.clientName}
                      <div className="text-[10px] font-mono text-slate-400">{a.clientId}</div>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-600">{a.previousEmployeeName}</td>
                    <td className="py-3 px-3 font-bold text-rose-800">{a.newEmployeeName}</td>
                    <td className="py-3 px-3 text-slate-500">{a.reassignedAt}</td>
                    <td className="py-3 px-3 font-semibold text-slate-700">{a.reassignedBy}</td>
                    <td className="py-3 px-3 text-slate-600 max-w-sm">{a.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 12. ACTIVITY TIMELINE TAB */}
      {activeTab === 'timeline' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">Unified Chronological Activity Timeline</h3>
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
            {activities.map((act) => (
              <div key={act.id} className="relative flex items-start gap-4">
                <div className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-[#88131B] border-2 border-white shadow-xs" />
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 w-full">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-slate-900">{act.title}</h4>
                    <span className="text-[11px] font-mono text-slate-400">{act.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{act.description}</p>
                  <div className="mt-2 text-[10px] font-mono text-slate-400">
                    Entity: {act.entityType} • Ref: {act.entityId}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: Log Call Modal */}
      {isLogCallModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#88131B]" />
                Log Telephony Interaction
              </h3>
              <button
                onClick={() => setIsLogCallModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCallLog} className="space-y-4 mt-4 text-xs">
              <div>
                <CustomDropDown
                  size="sm"
                  label="Select Client"
                  value={callForm.clientId}
                  onChange={(val) => setCallField('clientId', String(val))}
                  options={clients.map((c) => ({
                    label: `${c.fullName} (${c.clientId}) - ${c.membershipPlan}`,
                    value: c.clientId,
                  }))}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <CustomDropDown
                    size="sm"
                    label="Direction"
                    value={callForm.direction}
                    onChange={(val) => setCallField('direction', val as CallDirection)}
                    options={[
                      { label: 'Outgoing (Outbound)', value: 'OUTGOING' },
                      { label: 'Incoming (Inbound)', value: 'INCOMING' },
                    ]}
                  />
                </div>
                <div>
                  <CustomDropDown
                    size="sm"
                    label="Status"
                    value={callForm.status}
                    onChange={(val) => setCallField('status', val as CallStatus)}
                    options={[
                      { label: 'Connected', value: 'CONNECTED' },
                      { label: 'No Answer', value: 'NO_ANSWER' },
                      { label: 'Busy', value: 'BUSY' },
                      { label: 'Failed', value: 'FAILED' },
                    ]}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <CustomDropDown
                    size="sm"
                    label="Outcome"
                    value={callForm.outcome}
                    onChange={(val) => setCallField('outcome', val as CallOutcome)}
                    options={[
                      { label: 'Interested', value: 'INTERESTED' },
                      { label: 'Match Approved', value: 'MATCH_APPROVED' },
                      { label: 'Match Rejected', value: 'MATCH_REJECTED' },
                      { label: 'Wants More Profiles', value: 'WANTS_MORE_PROFILES' },
                      { label: 'Requested Callback', value: 'REQUESTED_CALLBACK' },
                      { label: 'Membership Inquiry', value: 'MEMBERSHIP_INQUIRY' },
                    ]}
                  />
                </div>
                <div>
                  <CustomTextInput
                    size="sm"
                    type="number"
                    label="Duration (Seconds)"
                    value={callForm.durationSec}
                    onChange={(e) => setCallField('durationSec', Number(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <CustomTextInput
                  size="sm"
                  label="Call Purpose & Discussion"
                  value={callForm.purpose}
                  onChange={(e) => setCallField('purpose', e.target.value)}
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Client Response & Notes</label>
                <textarea
                  rows={2}
                  value={callForm.notes}
                  onChange={(e) => setCallField('notes', e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-xs focus:outline-none focus:border-[#88131B]"
                />
              </div>

              <div>
                <CustomTextInput
                  size="sm"
                  label="Next Follow-up Date/Time"
                  value={callForm.followUpDateTime}
                  onChange={(e) => setCallField('followUpDateTime', e.target.value)}
                  placeholder="e.g. 2025-10-15 03:00 PM"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsLogCallModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#88131B] text-white font-bold hover:bg-rose-900"
                >
                  Save Call Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Reassign Client Modal */}
      {isReassignModalOpen && clientToReassign && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-rose-700" />
                Reassign Client Portfolio
              </h3>
              <button
                onClick={() => setIsReassignModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmReassign} className="space-y-4 mt-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Target Client</span>
                <div className="font-bold text-sm text-slate-900 mt-0.5">{clientToReassign.fullName}</div>
                <div className="text-[11px] text-slate-500">Currently assigned to: {employee.fullName}</div>
              </div>

              <div>
                <CustomDropDown
                  label="New Assigned Employee"
                  value={reassignForm.targetEmployeeId}
                  onChange={(val) => setReassignField('targetEmployeeId', String(val))}
                  options={allEmployees
                    .filter((e) => e.id !== employee.id)
                    .map((emp) => ({
                      value: emp.id,
                      label: `${emp.fullName} (${emp.employeeId}) — ${emp.role}`,
                    }))}
                  size="sm"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Mandatory Reassignment Reason</label>
                <textarea
                  required
                  rows={3}
                  value={reassignForm.reason}
                  onChange={(e) => setReassignField('reason', e.target.value)}
                  placeholder="Explain reason for reassigning (required for permanent audit record)..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsReassignModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-700 text-white font-bold hover:bg-rose-800"
                >
                  Confirm Reassignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Add Task Modal */}
      {isAddTaskModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                Schedule Follow-up Task
              </h3>
              <button
                onClick={() => setIsAddTaskModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTask} className="space-y-4 mt-4 text-xs">
              <div>
                <CustomDropDown
                  label="Client"
                  value={taskForm.clientId}
                  onChange={(val) => setTaskField('clientId', String(val))}
                  options={clients.map((c) => ({
                    value: c.clientId,
                    label: `${c.fullName} (${c.clientId})`,
                  }))}
                  size="sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <CustomDropDown
                  label="Task Type"
                  value={taskForm.taskType}
                  onChange={(val) => setTaskField('taskType', val as TaskType)}
                  options={[
                    { value: 'CALL', label: 'Call Follow-up' },
                    { value: 'PROFILE_SHARE', label: 'Profile Share' },
                    { value: 'MEETING', label: 'Video Meeting' },
                    { value: 'PAYMENT_FOLLOWUP', label: 'Payment Follow-up' },
                  ]}
                  size="sm"
                />
                <CustomDropDown
                  label="Priority"
                  value={taskForm.priority}
                  onChange={(val) => setTaskField('priority', val as LeadPriority)}
                  options={[
                    { value: 'LOW', label: 'Low' },
                    { value: 'MEDIUM', label: 'Medium' },
                    { value: 'HIGH', label: 'High' },
                    { value: 'URGENT', label: 'Urgent' },
                  ]}
                  size="sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <CustomTextInput
                  label="Due Date"
                  type="date"
                  value={taskForm.dueDate}
                  onChange={(e) => setTaskField('dueDate', e.target.value)}
                  size="sm"
                />
                <CustomTextInput
                  label="Due Time"
                  type="text"
                  value={taskForm.dueTime}
                  onChange={(e) => setTaskField('dueTime', e.target.value)}
                  placeholder="e.g. 11:30 AM"
                  size="sm"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Task Description</label>
                <textarea
                  rows={2}
                  value={taskForm.notes}
                  onChange={(e) => setTaskField('notes', e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddTaskModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Schedule Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DRAWER: Call Details Drawer */}
      {selectedCallForDrawer && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-2xs flex justify-end animate-in fade-in">
          <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <span className="font-mono text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  {selectedCallForDrawer.callLogId}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">Call Interaction Details</h3>
              </div>
              <button
                onClick={() => setSelectedCallForDrawer(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Client Name</span>
                  <span className="font-bold text-slate-900">{selectedCallForDrawer.clientName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Masked Phone</span>
                  <span className="font-mono text-slate-700">{selectedCallForDrawer.clientPhone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Call Date & Time</span>
                  <span className="text-slate-800">{selectedCallForDrawer.date} at {selectedCallForDrawer.startTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Call Duration</span>
                  <span className="font-bold text-slate-900">
                    {Math.floor(selectedCallForDrawer.durationSec / 60)} mins {selectedCallForDrawer.durationSec % 60} secs
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Status & Outcome</span>
                  <span className="font-bold text-emerald-700">{selectedCallForDrawer.status} ({selectedCallForDrawer.outcome})</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Call Purpose</span>
                <p className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 font-medium">
                  {selectedCallForDrawer.purpose}
                </p>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Client Feedback & Recorded Notes</span>
                <p className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 leading-relaxed">
                  {selectedCallForDrawer.notes}
                </p>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Next Scheduled Action</span>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 font-semibold">
                  {selectedCallForDrawer.nextAction || 'None'}
                  <div className="text-[10px] text-amber-700 mt-1">Due: {selectedCallForDrawer.followUpDateTime}</div>
                </div>
              </div>

              {selectedCallForDrawer.recordingUrl && (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold">
                    <Volume2 className="w-4 h-4 text-emerald-700" />
                    <span>Telephony VoIP Recording</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-emerald-700">
                    <span>exotel-rec-2025-001.mp3</span>
                    <span className="font-bold">Play Audio (09:00)</span>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-400">
                Logged By: {selectedCallForDrawer.recordedBy} • Source: {selectedCallForDrawer.callSource}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employee360Screen;
