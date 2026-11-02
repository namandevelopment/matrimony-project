import type { Employee } from '../types/employee.types';
import type {
  Lead,
  ClientProfile,
  CallLog,
  FollowUpTask,
  MatchRecommendation,
  ClientAssignmentHistory,
  SalesTransaction,
  ActivityTimelineEvent,
  EmployeeSummaryMetrics,
  MatchResponseOption,
  TaskStatus,
  LeadStatus,
  LeadAssignmentRecord,
  LeadCallResponseRecord,
  TeamChatMessage,
  CallOutcome,
  CallStatus,
  MatchSourceType,
  MatchAuditRecord,
  MatchNotificationLog,
  SuccessStory,
  ReviewItem,
  AbuseReport,
  BlacklistedIdentity,
  SafetyActionType,
} from '../types/crm.types';
import { getDefaultAllowedSectionsForRole } from '../utils/rbac';
import { subcasteGotraService } from './subcasteGotraService';

const STORAGE_KEY = 'sindhi_matrimony_crm_state_v1';

export const initialEmployees: Employee[] = [];

export const initialClients: ClientProfile[] = [];
export const initialLeads: Lead[] = [];
export const initialCallLogs: CallLog[] = [];
export const initialTasks: FollowUpTask[] = [];
export const initialMatches: MatchRecommendation[] = [];
export const initialAssignmentsHistory: ClientAssignmentHistory[] = [];
export const initialLeadAssignmentRecords: LeadAssignmentRecord[] = [];
export const initialTransactions: SalesTransaction[] = [];
export const initialActivities: ActivityTimelineEvent[] = [];
export const initialTeamChatMessages: TeamChatMessage[] = [];
export const initialSuccessStories: SuccessStory[] = [];
export const initialReviews: ReviewItem[] = [];
export const initialBlacklistedIdentities: BlacklistedIdentity[] = [];
export const initialAbuseReports: AbuseReport[] = [];

// Central Reactive CRM Store Class
class CRMDataService {
  private employees: Employee[] = initialEmployees;
  private clients: ClientProfile[] = initialClients;
  private leads: Lead[] = initialLeads;
  private callLogs: CallLog[] = initialCallLogs;
  private tasks: FollowUpTask[] = initialTasks;
  private successStories: SuccessStory[] = initialSuccessStories;
  private reviews: ReviewItem[] = initialReviews;
  private abuseReports: AbuseReport[] = initialAbuseReports;
  private blacklistedIdentities: BlacklistedIdentity[] = initialBlacklistedIdentities;
  private matches: MatchRecommendation[] = initialMatches;
  private assignmentHistory: ClientAssignmentHistory[] = initialAssignmentsHistory;
  private leadAssignmentRecords: LeadAssignmentRecord[] = initialLeadAssignmentRecords;
  private transactions: SalesTransaction[] = initialTransactions;
  private activities: ActivityTimelineEvent[] = initialActivities;
  private teamChatMessages: TeamChatMessage[] = initialTeamChatMessages;
  private blockedPairs: Map<string, { blockerId: string; blockedId: string; reason: string; timestamp: string }> = new Map();
  private listeners: Array<() => void> = [];

  constructor() {
    this.loadState();
  }

  private loadState() {
    try {
      if (typeof window === 'undefined') return;
      if (localStorage.getItem('sindi_crm_clean_v2') !== 'true') {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.setItem('sindi_crm_clean_v2', 'true');
        return;
      }
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.employees && Array.isArray(parsed.employees)) {
          this.employees = parsed.employees.map((emp: Employee) => ({
            ...emp,
            allowedSections: emp.allowedSections || getDefaultAllowedSectionsForRole(emp.role),
          }));
        }
        if (parsed.clients && Array.isArray(parsed.clients)) this.clients = parsed.clients;
        if (parsed.leads && Array.isArray(parsed.leads)) {
          this.leads = parsed.leads;
        } else {
          this.leads = [];
        }
        // Ensure callResponses array on each lead
        this.leads.forEach((l) => {
          if (!l.callResponses) {
            l.callResponses = [];
          }
        });
        if (parsed.callLogs && Array.isArray(parsed.callLogs)) this.callLogs = parsed.callLogs;
        if (parsed.tasks && Array.isArray(parsed.tasks)) this.tasks = parsed.tasks;
        if (parsed.matches && Array.isArray(parsed.matches)) {
          this.matches = parsed.matches.map((m: MatchRecommendation) => ({
            ...m,
            pairKey: m.pairKey || [m.clientId, m.candidateId].sort().join(':'),
            primarySource: m.primarySource || 'EMPLOYEE_ASSISTED',
            sources: m.sources || [m.primarySource || 'EMPLOYEE_ASSISTED'],
            auditHistory: m.auditHistory || [],
            notifications: m.notifications || [],
          }));
        }
        if (parsed.blockedPairs && Array.isArray(parsed.blockedPairs)) {
          parsed.blockedPairs.forEach(([k, v]: [string, any]) => this.blockedPairs.set(k, v));
        }
        if (parsed.assignmentHistory && Array.isArray(parsed.assignmentHistory)) this.assignmentHistory = parsed.assignmentHistory;
        if (parsed.leadAssignmentRecords && Array.isArray(parsed.leadAssignmentRecords)) this.leadAssignmentRecords = parsed.leadAssignmentRecords;
        if (parsed.transactions && Array.isArray(parsed.transactions)) this.transactions = parsed.transactions;
        if (parsed.activities && Array.isArray(parsed.activities)) this.activities = parsed.activities;
        if (parsed.teamChatMessages && Array.isArray(parsed.teamChatMessages)) {
          this.teamChatMessages = parsed.teamChatMessages;
        } else {
          this.teamChatMessages = [];
        }
        this.successStories = [];
        this.reviews = [];
        if (parsed.abuseReports && Array.isArray(parsed.abuseReports)) {
          this.abuseReports = parsed.abuseReports;
        } else {
          this.abuseReports = [];
        }
        if (parsed.blacklistedIdentities && Array.isArray(parsed.blacklistedIdentities)) {
          this.blacklistedIdentities = parsed.blacklistedIdentities;
        } else {
          this.blacklistedIdentities = [];
        }
      }
    } catch (e) {
      console.error('Failed to load CRM state from localStorage:', e);
    }
  }

  private saveState() {
    try {
      if (typeof window === 'undefined') return;
      const data = {
        employees: this.employees,
        clients: this.clients,
        leads: this.leads,
        callLogs: this.callLogs,
        tasks: this.tasks,
        matches: this.matches,
        successStories: this.successStories,
        reviews: this.reviews,
        abuseReports: this.abuseReports,
        blacklistedIdentities: this.blacklistedIdentities,
        blockedPairs: Array.from(this.blockedPairs.entries()),
        assignmentHistory: this.assignmentHistory,
        leadAssignmentRecords: this.leadAssignmentRecords,
        transactions: this.transactions,
        activities: this.activities,
        teamChatMessages: this.teamChatMessages,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      this.notifyListeners();
    } catch (e) {
      console.error('Failed to persist CRM state:', e);
    }
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((l) => l());
  }

  // --- Employees ---
  public getEmployees(): Employee[] {
    return [...this.employees];
  }

  public getEmployeeById(id: string): Employee | undefined {
    return this.employees.find((e) => e.id === id || e.employeeId === id);
  }

  public getEmployeeByEmail(email: string): Employee | undefined {
    const clean = email.trim().toLowerCase();
    return this.employees.find((e) => e.email.trim().toLowerCase() === clean);
  }

  public addEmployee(emp: Employee): Employee {
    const idx = this.employees.findIndex((e) => e.id === emp.id || e.employeeId === emp.employeeId);
    if (idx !== -1) {
      this.employees[idx] = { ...this.employees[idx], ...emp };
    } else {
      this.employees.unshift(emp);
    }
    this.saveState();
    return emp;
  }

  public updateEmployee(id: string, updates: Partial<Employee>): Employee | null {
    const idx = this.employees.findIndex((e) => e.id === id || e.employeeId === id);
    if (idx === -1) return null;
    this.employees[idx] = { ...this.employees[idx], ...updates };
    this.saveState();
    return this.employees[idx];
  }

  // --- Clients ---
  public getClients(): ClientProfile[] {
    return [...this.clients];
  }

  public getClientById(id: string): ClientProfile | undefined {
    return this.clients.find((c) => c.id === id || c.clientId === id);
  }

  public getClientsByEmployee(employeeId: string): ClientProfile[] {
    const emp = this.getEmployeeById(employeeId);
    if (!emp) return [];
    return this.clients.filter(
      (c) => c.assignedEmployeeId === emp.id || c.assignedEmployeeId === emp.employeeId
    );
  }

  // --- Leads ---
  public getLeads(): Lead[] {
    return [...this.leads];
  }

  public getUnassignedLeads(): Lead[] {
    return this.leads.filter((l) => l.status === 'NEW' || !l.assignedEmployeeId);
  }

  public getLeadById(id: string): Lead | undefined {
    return this.leads.find((l) => l.id === id || l.leadId === id);
  }

  public getLeadsByEmployee(employeeId: string): Lead[] {
    const emp = this.getEmployeeById(employeeId);
    if (!emp) return [];
    return this.leads.filter(
      (l) => l.assignedEmployeeId === emp.id || l.assignedEmployeeId === emp.employeeId
    );
  }

  /**
   * Batch assign leads to an employee with strict exclusivity and capacity validations
   * Required: "20, 20 data assign honge and jo users ka data employees ko assign ho gya to baki k employees ko assign nhi ho sakta hai"
   */
  public assignLeadsBatch(
    leadIds: string[],
    employeeId: string,
    assignedBy: string,
    notes?: string
  ): {
    success: boolean;
    assignedCount: number;
    error?: string;
    failures?: { leadId: string; reason: string }[];
  } {
    if (!leadIds || leadIds.length === 0) {
      return { success: false, assignedCount: 0, error: 'No leads selected for assignment.' };
    }

    const targetEmp = this.getEmployeeById(employeeId);
    if (!targetEmp) {
      return { success: false, assignedCount: 0, error: 'Selected employee not found.' };
    }

    if (!targetEmp.isActive) {
      return {
        success: false,
        assignedCount: 0,
        error: `${targetEmp.fullName} is currently marked inactive and cannot receive new leads.`,
      };
    }

    // No restriction on lead assignment count as per business rules
    // Admin can assign any number of leads without capacity caps

    // Exclusivity Check: Once assigned, cannot be assigned to another employee
    const alreadyAssigned = this.leads.filter(
      (l) => leadIds.includes(l.id) && l.status !== 'NEW' && l.assignedEmployeeId && l.assignedEmployeeId !== ''
    );

    if (alreadyAssigned.length > 0) {
      const conflictNames = alreadyAssigned
        .map((l) => `${l.name} (${l.leadId} - Assigned to ${l.assignedEmployeeName})`)
        .slice(0, 3)
        .join(', ');
      const extra = alreadyAssigned.length > 3 ? ` and ${alreadyAssigned.length - 3} more` : '';

      return {
        success: false,
        assignedCount: 0,
        error: `Exclusivity Locked: ${alreadyAssigned.length} selected lead(s) are already assigned to employees (${conflictNames}${extra}). Once assigned to an employee, leads cannot be assigned to another employee.`,
      };
    }

    // Execute Assignment
    let assignedCount = 0;
    const nowTime = new Date().toLocaleString();

    this.leads = this.leads.map((l) => {
      if (leadIds.includes(l.id)) {
        assignedCount++;
        return {
          ...l,
          status: 'ASSIGNED',
          assignedEmployeeId: targetEmp.id,
          assignedEmployeeName: targetEmp.fullName,
          assignedTeam: targetEmp.team,
          nextFollowUp: 'Immediate outreach SLA (Today)',
          slaStatus: 'URGENT',
          notes: notes
            ? `${l.notes || ''} [Batch assigned to ${targetEmp.fullName} by ${assignedBy} on ${nowTime}: ${notes}]`
            : l.notes,
        };
      }
      return l;
    });

    // Update Employee lead count
    targetEmp.activeLeadsCount += assignedCount;

    // Log Activity
    this.addActivity({
      employeeId: targetEmp.id,
      timestamp: nowTime,
      type: 'LEAD_ASSIGNED',
      title: `Batch Assigned: ${assignedCount} Website Leads`,
      description: `${assignedCount} leads assigned to ${targetEmp.fullName} (${targetEmp.employeeId}) by ${assignedBy}.`,
      entityType: 'LEAD',
      entityId: `BATCH-${Date.now()}`,
      badgeColor: 'emerald',
    });

    this.saveState();
    return { success: true, assignedCount };
  }

  public getLeadAssignmentHistory(leadId?: string): LeadAssignmentRecord[] {
    if (leadId) {
      return this.leadAssignmentRecords.filter((r) => r.leadId === leadId);
    }
    return [...this.leadAssignmentRecords];
  }

  public reassignLead(
    leadId: string,
    newEmployeeId: string,
    reassignedBy: string,
    reason: string,
    handoverNotes?: string
  ): { success: boolean; error?: string; record?: LeadAssignmentRecord } {
    const lead = this.leads.find((l) => l.id === leadId || l.leadId === leadId);
    if (!lead) return { success: false, error: 'Lead not found.' };

    const newEmp = this.getEmployeeById(newEmployeeId);
    if (!newEmp) return { success: false, error: 'Target employee not found.' };

    if (!reason || reason.trim() === '') {
      return { success: false, error: 'Reassignment reason is mandatory for audit records.' };
    }

    const prevEmp = this.getEmployeeById(lead.assignedEmployeeId);
    const prevEmpName = prevEmp ? prevEmp.fullName : lead.assignedEmployeeName || 'Unassigned';

    // Workload rebalance
    if (prevEmp && prevEmp.activeLeadsCount > 0) {
      prevEmp.activeLeadsCount -= 1;
    }
    newEmp.activeLeadsCount += 1;

    const record: LeadAssignmentRecord = {
      id: `lar_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      leadId: lead.leadId,
      leadName: lead.name,
      previousEmployeeId: lead.assignedEmployeeId || '',
      previousEmployeeName: prevEmpName,
      newEmployeeId: newEmp.id,
      newEmployeeName: newEmp.fullName,
      reassignedAt: new Date().toLocaleString(),
      reassignedBy,
      reason,
      handoverNotes,
      previousStatus: lead.status,
      newStatus: 'ASSIGNED',
    };

    this.leadAssignmentRecords = [record, ...this.leadAssignmentRecords];

    // Append to lead history
    lead.assignmentHistory = [record, ...(lead.assignmentHistory || [])];
    lead.assignedEmployeeId = newEmp.id;
    lead.assignedEmployeeName = newEmp.fullName;
    lead.assignedTeam = newEmp.team;
    lead.status = 'ASSIGNED';
    lead.notes = `${lead.notes || ''} [Reassigned from ${prevEmpName} to ${newEmp.fullName}: ${reason}]`;

    this.addActivity({
      employeeId: newEmp.id,
      timestamp: new Date().toLocaleString(),
      type: 'LEAD_REASSIGNED',
      title: `Lead Reassigned (${lead.leadId})`,
      description: `${lead.name} reassigned from ${prevEmpName} to ${newEmp.fullName}. Reason: ${reason}. Authorized by: ${reassignedBy}.`,
      entityType: 'LEAD',
      entityId: lead.leadId,
      badgeColor: 'amber',
    });

    this.saveState();
    return { success: true, record };
  }

  public reassignLeadsBatch(
    leadIds: string[],
    newEmployeeId: string,
    reassignedBy: string,
    reason: string,
    handoverNotes?: string
  ): { success: boolean; reassignedCount: number; error?: string } {
    if (!leadIds || leadIds.length === 0) {
      return { success: false, reassignedCount: 0, error: 'No leads selected for reassignment.' };
    }

    const newEmp = this.getEmployeeById(newEmployeeId);
    if (!newEmp) return { success: false, reassignedCount: 0, error: 'Target employee not found.' };

    if (!reason || reason.trim() === '') {
      return { success: false, reassignedCount: 0, error: 'Reassignment reason is mandatory for audit compliance.' };
    }

    let reassignedCount = 0;
    for (const id of leadIds) {
      const res = this.reassignLead(id, newEmployeeId, reassignedBy, reason, handoverNotes);
      if (res.success) reassignedCount++;
    }

    return { success: true, reassignedCount };
  }

  public updateLeadStatus(
    leadId: string,
    status: LeadStatus,
    notes?: string
  ): { success: boolean; error?: string } {
    const lead = this.leads.find((l) => l.id === leadId || l.leadId === leadId);
    if (!lead) return { success: false, error: 'Lead not found.' };

    const prevStatus = lead.status;
    lead.status = status;
    if (notes) {
      lead.notes = `${lead.notes || ''} [${new Date().toLocaleDateString()}: ${notes}]`;
    }

    this.addActivity({
      employeeId: lead.assignedEmployeeId || 'emp_001',
      timestamp: new Date().toLocaleString(),
      type: 'LEAD_STATUS_CHANGED',
      title: `Lead Status Changed (${lead.leadId})`,
      description: `${lead.name} status updated from ${prevStatus} to ${status}.`,
      entityType: 'LEAD',
      entityId: lead.leadId,
      badgeColor: status === 'CONVERTED' ? 'emerald' : status === 'LOST' ? 'rose' : 'blue',
    });

    this.saveState();
    return { success: true };
  }

  // --- Calls ---
  public getCallLogs(): CallLog[] {
    return [...this.callLogs];
  }

  public getCallsByEmployee(employeeId: string): CallLog[] {
    const emp = this.getEmployeeById(employeeId);
    if (!emp) return [];
    return this.callLogs.filter(
      (c) => c.assignedEmployeeId === emp.id || c.assignedEmployeeId === emp.employeeId
    );
  }

  public addCallLog(newCall: Omit<CallLog, 'id' | 'callLogId'>): CallLog {
    const id = `clog_${Date.now()}`;
    const callLogId = `CALL-2025-${String(this.callLogs.length + 1).padStart(3, '0')}`;
    const record: CallLog = {
      ...newCall,
      id,
      callLogId,
    };
    this.callLogs = [record, ...this.callLogs];

    // Update client last contact and call counts
    const client = this.clients.find((c) => c.id === newCall.clientId || c.clientId === newCall.clientId);
    if (client) {
      client.lastContactDate = newCall.date;
      client.totalCalls += 1;
      if (newCall.status === 'CONNECTED') {
        client.connectedCalls += 1;
      }
    }

    // Add activity
    this.addActivity({
      employeeId: newCall.assignedEmployeeId,
      timestamp: `${newCall.date} ${newCall.startTime}`,
      type: 'CALL_LOGGED',
      title: `${newCall.direction === 'OUTGOING' ? 'Outbound' : 'Inbound'} Call (${newCall.status})`,
      description: `Logged call with ${newCall.clientName}. Outcome: ${newCall.outcome}. Duration: ${Math.floor(newCall.durationSec / 60)}m ${newCall.durationSec % 60}s.`,
      entityType: 'CALL',
      entityId: callLogId,
      badgeColor: newCall.status === 'CONNECTED' ? 'emerald' : 'amber',
    });

    this.saveState();
    return record;
  }

  // --- Lead Specific Call & User Response Logging ---
  public logLeadCallResponse(params: {
    leadId: string;
    employeeId: string;
    employeeName: string;
    durationSec: number;
    status: CallStatus;
    outcome: CallOutcome;
    userResponse: string;
    conversationNotes?: string;
    nextFollowUp?: string;
    newLeadStatus?: LeadStatus;
  }): { success: boolean; record?: LeadCallResponseRecord; error?: string } {
    const lead = this.leads.find((l) => l.id === params.leadId || l.leadId === params.leadId);
    if (!lead) {
      return { success: false, error: 'Lead not found in database.' };
    }

    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0];
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const callLogId = `CALL-2025-${String(this.callLogs.length + 1).padStart(3, '0')}`;
    const recordId = `cresp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const responseRecord: LeadCallResponseRecord = {
      id: recordId,
      callLogId,
      calledAt: `${formattedDate} ${formattedTime}`,
      callerEmployeeId: params.employeeId,
      callerEmployeeName: params.employeeName,
      callDurationSec: params.durationSec,
      status: params.status,
      outcome: params.outcome,
      userResponse: params.userResponse,
      conversationNotes: params.conversationNotes,
      nextFollowUp: params.nextFollowUp,
      newStatus: params.newLeadStatus || lead.status,
    };

    // Update Lead object
    if (!lead.callResponses) {
      lead.callResponses = [];
    }
    lead.callResponses = [responseRecord, ...lead.callResponses];

    if (params.newLeadStatus) {
      lead.status = params.newLeadStatus;
    }
    if (params.nextFollowUp) {
      lead.nextFollowUp = params.nextFollowUp;
    }

    // Keep notes updated
    const entryNote = `[${formattedDate} ${formattedTime} • ${params.employeeName}]: User Response: "${params.userResponse}" (${params.outcome})`;
    lead.notes = lead.notes ? `${entryNote}\n${lead.notes}` : entryNote;

    // Create CallLog entry so it appears in Call Management Screen & employee stats
    const newCallLog: CallLog = {
      id: `clog_${Date.now()}`,
      callLogId,
      clientId: lead.leadId,
      clientName: lead.name,
      clientPhone: lead.mobile,
      date: formattedDate,
      startTime: formattedTime,
      durationSec: params.durationSec,
      direction: 'OUTGOING',
      status: params.status,
      purpose: 'Lead Verification & Matchmaking Follow-up',
      outcome: params.outcome,
      clientResponse: params.userResponse,
      notes: params.conversationNotes || params.userResponse,
      assignedEmployeeId: params.employeeId,
      assignedEmployeeName: params.employeeName,
      recordedBy: params.employeeName,
      callSource: 'CLOUD_VOIP',
      verificationStatus: 'MANUAL_ENTRY',
      followUpDateTime: params.nextFollowUp,
    };
    this.callLogs = [newCallLog, ...this.callLogs];

    // Activity timeline
    this.addActivity({
      employeeId: params.employeeId,
      timestamp: `${formattedDate} ${formattedTime}`,
      type: 'CALL_LOGGED',
      title: `Call Response: ${lead.name}`,
      description: `${params.employeeName} called ${lead.name} (${params.status}). User response: "${params.userResponse}". Outcome: ${params.outcome}.`,
      entityType: 'LEAD',
      entityId: lead.leadId,
      badgeColor: params.status === 'CONNECTED' ? 'emerald' : 'amber',
    });

    this.saveState();
    return { success: true, record: responseRecord };
  }

  // --- Team Internal Chat (Super Admin <-> Employee) ---
  public getTeamChatMessages(userId1?: string, userId2?: string): TeamChatMessage[] {
    if (!userId1 && !userId2) {
      return [...this.teamChatMessages];
    }
    if (userId1 && !userId2) {
      return this.teamChatMessages.filter(
        (m) => m.senderId === userId1 || m.recipientId === userId1
      );
    }
    return this.teamChatMessages.filter(
      (m) =>
        (m.senderId === userId1 && m.recipientId === userId2) ||
        (m.senderId === userId2 && m.recipientId === userId1)
    );
  }

  public sendTeamChatMessage(msg: Omit<TeamChatMessage, 'id' | 'timestamp' | 'read'>): TeamChatMessage {
    const newMsg: TeamChatMessage = {
      ...msg,
      id: `tmsg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };
    this.teamChatMessages = [...this.teamChatMessages, newMsg];
    this.saveState();
    return newMsg;
  }

  public markMessagesAsRead(senderId: string, recipientId: string): void {
    let changed = false;
    this.teamChatMessages = this.teamChatMessages.map((m) => {
      if (m.senderId === senderId && m.recipientId === recipientId && !m.read) {
        changed = true;
        return { ...m, read: true };
      }
      return m;
    });
    if (changed) {
      this.saveState();
    }
  }

  public getUnreadMessageCount(recipientId: string): number {
    return this.teamChatMessages.filter((m) => m.recipientId === recipientId && !m.read).length;
  }

  // --- Tasks & Follow-ups ---
  public getTasks(): FollowUpTask[] {
    return [...this.tasks];
  }

  public getTasksByEmployee(employeeId: string): FollowUpTask[] {
    const emp = this.getEmployeeById(employeeId);
    if (!emp) return [];
    return this.tasks.filter(
      (t) => t.assignedEmployeeId === emp.id || t.assignedEmployeeId === emp.employeeId
    );
  }

  public addTask(newTask: Omit<FollowUpTask, 'id' | 'taskId'>): FollowUpTask {
    const id = `tsk_${Date.now()}`;
    const taskId = `TSK-2025-${String(this.tasks.length + 1).padStart(3, '0')}`;
    const task: FollowUpTask = {
      ...newTask,
      id,
      taskId,
    };
    this.tasks = [task, ...this.tasks];

    this.addActivity({
      employeeId: newTask.assignedEmployeeId,
      timestamp: `${newTask.createdDate} ${new Date().toLocaleTimeString()}`,
      type: 'FOLLOWUP_CREATED',
      title: `Scheduled Task: ${newTask.taskType}`,
      description: `Task for ${newTask.clientName} due on ${newTask.dueDate} ${newTask.dueTime}.`,
      entityType: 'TASK',
      entityId: taskId,
      badgeColor: 'blue',
    });

    this.saveState();
    return task;
  }

  public updateTaskStatus(taskId: string, status: TaskStatus, outcome?: string): boolean {
    const task = this.tasks.find((t) => t.id === taskId || t.taskId === taskId);
    if (!task) return false;
    task.status = status;
    if (status === 'COMPLETED') {
      task.completionDate = new Date().toISOString().split('T')[0];
      if (outcome) task.outcome = outcome;
      this.addActivity({
        employeeId: task.assignedEmployeeId,
        timestamp: new Date().toLocaleString(),
        type: 'FOLLOWUP_COMPLETED',
        title: `Task Completed: ${task.taskId}`,
        description: `Follow-up with ${task.clientName} finished. Outcome: ${outcome || 'Done'}.`,
        entityType: 'TASK',
        entityId: task.taskId,
        badgeColor: 'emerald',
      });
    }
    this.saveState();
    return true;
  }

  // --- Assisted Matches ---
  public getMatches(): MatchRecommendation[] {
    return [...this.matches];
  }

  public getMatchesByEmployee(employeeId: string): MatchRecommendation[] {
    const emp = this.getEmployeeById(employeeId);
    if (!emp) return [];
    return this.matches.filter(
      (m) => m.reviewedByEmployeeId === emp.id || m.reviewedByEmployeeId === emp.employeeId
    );
  }

  // --- Canonical Hybrid Matchmaking & Deduplication ---

  /**
   * Generates a deterministic, lexicographically sorted canonical pair key.
   * Ensures (A, B) and (B, A) resolve to identical canonical pair identity.
   */
  public getCanonicalPairKey(id1: string, id2: string): string {
    return [id1, id2].sort().join(':');
  }

  /**
   * Finds any existing match for the given pair, regardless of direction.
   */
  public findMatchByPair(id1: string, id2: string): MatchRecommendation | undefined {
    const targetKey = this.getCanonicalPairKey(id1, id2);
    return this.matches.find(
      (m) =>
        (m.pairKey && m.pairKey === targetKey) ||
        this.getCanonicalPairKey(m.clientId, m.candidateId) === targetKey
    );
  }

  /**
   * Checks whether an active recommendation already exists between client and candidate
   */
  public isDuplicateMatch(clientId: string, candidateId: string): boolean {
    return !!this.findMatchByPair(clientId, candidateId);
  }

  /**
   * Blocks a member pair, ensuring no future automatic or manual suggestions bypass it.
   */
  public blockMemberPair(blockerId: string, blockedId: string, reason: string = 'User Blocked'): void {
    const key = `${blockerId}->${blockedId}`;
    this.blockedPairs.set(key, { blockerId, blockedId, reason, timestamp: new Date().toISOString() });
    const match = this.findMatchByPair(blockerId, blockedId);
    if (match) {
      match.isBlocked = true;
      match.blockReason = reason;
      const prevStatus = match.overallStatus;
      match.overallStatus = 'CLOSED';
      this.addMatchAudit(match.matchId, {
        actorId: blockerId,
        actorName: 'Member',
        actorRole: 'USER',
        sourceType: match.primarySource || 'AUTOMATIC_BACKEND',
        actionType: 'BLOCKED',
        reason,
        previousStatus: prevStatus,
        resultingStatus: 'CLOSED',
      });
      this.saveState();
    }
  }

  public unblockMemberPair(blockerId: string, blockedId: string): void {
    this.blockedPairs.delete(`${blockerId}->${blockedId}`);
    this.saveState();
  }

  public isBlockedPair(id1: string, id2: string): boolean {
    return this.blockedPairs.has(`${id1}->${id2}`) || this.blockedPairs.has(`${id2}->${id1}`);
  }

  /**
   * Dismisses a match for a member.
   */
  public dismissMatch(matchId: string, memberId: string): boolean {
    const match = this.matches.find((m) => m.id === matchId || m.matchId === matchId);
    if (!match) return false;
    if (match.clientId === memberId) {
      match.isDismissedByClient = true;
    } else if (match.candidateId === memberId) {
      match.isDismissedByCandidate = true;
    }
    this.addMatchAudit(match.matchId, {
      actorId: memberId,
      actorName: 'Member',
      actorRole: 'USER',
      sourceType: match.primarySource || 'AUTOMATIC_BACKEND',
      actionType: 'DISMISSED',
      reason: 'Member dismissed match recommendation',
      previousStatus: match.overallStatus,
      resultingStatus: match.overallStatus,
    });
    this.saveState();
    return true;
  }

  /**
   * Retrieves immutable audit trail for a match.
   */
  public getMatchAuditHistory(matchId: string): MatchAuditRecord[] {
    const match = this.matches.find((m) => m.id === matchId || m.matchId === matchId);
    return match?.auditHistory ? [...match.auditHistory] : [];
  }

  /**
   * Records an immutable audit log entry for a match.
   */
  public addMatchAudit(matchId: string, audit: Omit<MatchAuditRecord, 'id' | 'timestamp' | 'matchId'>): void {
    const match = this.matches.find((m) => m.id === matchId || m.matchId === matchId);
    if (!match) return;
    const record: MatchAuditRecord = {
      ...audit,
      id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      matchId: match.matchId,
      timestamp: new Date().toISOString(),
    };
    match.auditHistory = [...(match.auditHistory || []), record];
  }

  /**
   * Central Unified Hybrid Matchmaker:
   * Handles Automatic Backend, Admin Suggested, and Employee Assisted matchmaking
   * with unified canonical identity, eligibility validation, and duplicate prevention.
   */
  public suggestHybridMatch(params: {
    client: ClientProfile;
    candidate: ClientProfile;
    actorId: string;
    actorRole?: string;
    sourceType?: MatchSourceType;
    reason?: string;
    notes?: string;
    assignedEmployeeId?: string;
    allowReactivation?: boolean;
  }): {
    success: boolean;
    match?: MatchRecommendation;
    error?: string;
    isExisting?: boolean;
    action?: 'NEW_MATCH_CREATED' | 'EXISTING_MATCH_ATTACHED' | 'REACTIVATED';
    notificationDispatched?: boolean;
  } {
    const { client, candidate, actorId, actorRole = 'ADMIN', sourceType = 'ADMIN_SUGGESTED' } = params;

    // 1. Gender check
    if (client.gender === candidate.gender) {
      return {
        success: false,
        error: 'Cannot pair profiles of the same gender.',
      };
    }

    // 2. Profile Active & Eligibility Validation
    const invalidStatuses = ['SUSPENDED', 'DEACTIVATED', 'DELETED', 'ON_HOLD', 'LOST'];
    if (client.relationshipStatus && invalidStatuses.includes(client.relationshipStatus)) {
      return {
        success: false,
        error: `Client profile is inactive or suspended (Status: ${client.relationshipStatus}).`,
      };
    }
    if (candidate.relationshipStatus && invalidStatuses.includes(candidate.relationshipStatus)) {
      return {
        success: false,
        error: `Candidate profile is inactive or suspended (Status: ${candidate.relationshipStatus}).`,
      };
    }

    // 3. Block Exclusions
    if (this.isBlockedPair(client.clientId, candidate.clientId)) {
      return {
        success: false,
        error: 'Cannot recommend: A block relationship exists between these members.',
      };
    }

    // 4. Cultural & Gotra Policy Validation
    const compatResult = subcasteGotraService.checkMatchCompatibility(client, candidate);
    if (!compatResult.isCompatible) {
      return {
        success: false,
        error: `Matrimonial Rule Violation: ${compatResult.reasons.join(' ')}`,
      };
    }

    // 5. Canonical Match Lookup (Check if already exists)
    const existingMatch = this.findMatchByPair(client.clientId, candidate.clientId);

    if (existingMatch) {
      // Check block flag on record
      if (existingMatch.isBlocked) {
        return {
          success: false,
          error: 'Cannot recommend: A block relationship exists between these members.',
          match: existingMatch,
          isExisting: true,
        };
      }

      // Check if previously declined or dismissed
      const isDeclined =
        existingMatch.clientResponse === 'DECLINED' || existingMatch.candidateResponse === 'DECLINED';
      const isDismissed =
        existingMatch.isDismissedByClient || existingMatch.isDismissedByCandidate;

      if ((isDeclined || isDismissed) && !params.allowReactivation) {
        return {
          success: false,
          error: 'This match was previously declined or dismissed. Reactivation requires explicit authorization.',
          match: existingMatch,
          isExisting: true,
        };
      }

      let actionResult: 'EXISTING_MATCH_ATTACHED' | 'REACTIVATED' = 'EXISTING_MATCH_ATTACHED';
      if ((isDeclined || isDismissed) && params.allowReactivation) {
        existingMatch.isDismissedByClient = false;
        existingMatch.isDismissedByCandidate = false;
        if (existingMatch.clientResponse === 'DECLINED') existingMatch.clientResponse = 'PENDING';
        if (existingMatch.candidateResponse === 'DECLINED') existingMatch.candidateResponse = 'PENDING';
        existingMatch.overallStatus = 'AWAITING_CLIENT_RESPONSE';
        actionResult = 'REACTIVATED';
      }

      // Append new source attribution without overwriting existing sources
      if (!existingMatch.sources) {
        existingMatch.sources = [existingMatch.primarySource || 'AUTOMATIC_BACKEND'];
      }
      if (!existingMatch.sources.includes(sourceType)) {
        existingMatch.sources.push(sourceType);
      }

      if (sourceType === 'ADMIN_SUGGESTED') {
        existingMatch.suggestedByAdminId = actorId;
        const actor = this.getEmployeeById(actorId);
        existingMatch.suggestedByAdminName = actor ? actor.fullName : 'Administrator';
        existingMatch.suggestedReason = params.reason || 'Admin suggested match for assisted follow-up.';
      }

      // Append audit record
      const actor = this.getEmployeeById(actorId);
      const auditEntry: MatchAuditRecord = {
        id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        matchId: existingMatch.matchId,
        actorId,
        actorName: actor ? actor.fullName : 'System Administrator',
        actorRole,
        sourceType,
        actionType: actionResult === 'REACTIVATED' ? 'REACTIVATED' : 'ADMIN_SUGGESTION_ADDED',
        timestamp: new Date().toISOString(),
        reason: params.reason || 'Admin suggested match for assisted follow-up.',
        notes: params.notes,
        previousStatus: existingMatch.overallStatus,
        resultingStatus: existingMatch.overallStatus,
      };
      existingMatch.auditHistory = [...(existingMatch.auditHistory || []), auditEntry];

      // Notification Deduplication (Check if client was already notified of assisted recommendation)
      let notificationDispatched = false;
      if (!existingMatch.notifications) existingMatch.notifications = [];
      const alreadyNotified = existingMatch.notifications.some(
        (n) =>
          n.recipientId === client.clientId &&
          n.event === 'ASSISTED_MATCH_SUGGESTION' &&
          n.status === 'SENT'
      );

      if (!alreadyNotified) {
        existingMatch.notifications.push({
          id: `notif_${Date.now()}`,
          recipientId: client.clientId,
          recipientType: 'CLIENT',
          channel: 'PUSH_FCM',
          event: 'ASSISTED_MATCH_SUGGESTION',
          dispatchedAt: new Date().toISOString(),
          status: 'SENT',
          deliveryNote: `Notified ${client.fullName} about match ${existingMatch.matchId}`,
        });
        notificationDispatched = true;
      } else {
        existingMatch.notifications.push({
          id: `notif_${Date.now()}`,
          recipientId: client.clientId,
          recipientType: 'CLIENT',
          channel: 'PUSH_FCM',
          event: 'ASSISTED_MATCH_SUGGESTION',
          dispatchedAt: new Date().toISOString(),
          status: 'SUPPRESSED_DUPLICATE',
          deliveryNote: 'Duplicate notification suppressed per anti-spam policy.',
        });
      }

      this.saveState();
      return {
        success: true,
        match: existingMatch,
        isExisting: true,
        action: actionResult,
        notificationDispatched,
      };
    }

    // 6. Creating Brand New Match
    let score = 70;
    const reasons: string[] = [];
    score += compatResult.scoreModifier;
    reasons.push(...compatResult.reasons);

    if (client.city === candidate.city) {
      score += 8;
      reasons.push(`Same home city (${client.city})`);
    } else {
      reasons.push(`Different cities (${client.city} & ${candidate.city})`);
    }

    const ageDiff = Math.abs(client.age - candidate.age);
    if (ageDiff <= 4) {
      score += 7;
      reasons.push(`Ideal age proximity (diff of ${ageDiff} years)`);
    }

    const matchId = `MATCH-2025-${String(this.matches.length + 1).padStart(3, '0')}`;
    const actor = this.getEmployeeById(actorId);
    const actorName = actor ? actor.fullName : 'Assisted Matchmaker';
    const pairKey = this.getCanonicalPairKey(client.clientId, candidate.clientId);

    const auditEntry: MatchAuditRecord = {
      id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      matchId,
      actorId,
      actorName,
      actorRole,
      sourceType,
      actionType: 'INITIAL_GENERATION',
      timestamp: new Date().toISOString(),
      reason: params.reason || 'Initial candidate match created.',
      notes: params.notes,
      previousStatus: 'NONE',
      resultingStatus: 'PENDING_REVIEW',
    };

    const notifLog: MatchNotificationLog = {
      id: `notif_${Date.now()}`,
      recipientId: client.clientId,
      recipientType: 'CLIENT',
      channel: 'PUSH_FCM',
      event: 'ASSISTED_MATCH_SUGGESTION',
      dispatchedAt: new Date().toISOString(),
      status: 'SENT',
      deliveryNote: `First-time notification sent to ${client.fullName}`,
    };

    const newMatch: MatchRecommendation = {
      id: `mtc_${Date.now()}`,
      matchId,
      pairKey,
      clientId: client.clientId,
      clientName: client.fullName,
      clientGender: client.gender,
      clientCity: client.city,
      clientSubcaste: client.subcaste,
      candidateId: candidate.clientId,
      candidateName: candidate.fullName,
      candidateGender: candidate.gender,
      candidateCity: candidate.city,
      candidateSubcaste: candidate.subcaste,
      compatibilityScore: Math.min(score, 98),
      compatibilityReasons: reasons,
      primarySource: sourceType,
      sources: [sourceType],
      suggestedByAdminId: sourceType === 'ADMIN_SUGGESTED' ? actorId : undefined,
      suggestedByAdminName: sourceType === 'ADMIN_SUGGESTED' ? actorName : undefined,
      suggestedReason: params.reason,
      reviewedByEmployeeId: params.assignedEmployeeId || actorId,
      reviewedByEmployeeName: actorName,
      reviewStatus: 'PENDING_EMPLOYEE_REVIEW',
      clientResponse: 'PENDING',
      candidateResponse: 'PENDING',
      overallStatus: 'PENDING_REVIEW',
      createdAt: new Date().toISOString().split('T')[0],
      notes: params.notes || 'Generated via Hybrid Matchmaking System.',
      auditHistory: [auditEntry],
      notifications: [notifLog],
    };

    this.matches = [newMatch, ...this.matches];

    this.addActivity({
      employeeId: actorId,
      timestamp: new Date().toLocaleString(),
      type: 'MATCH_GENERATED',
      title: `Generated Match: ${matchId}`,
      description: `Paired ${client.fullName} with ${candidate.fullName} (Score: ${newMatch.compatibilityScore}%).`,
      entityType: 'MATCH',
      entityId: matchId,
      badgeColor: 'teal',
    });

    this.saveState();
    return {
      success: true,
      match: newMatch,
      isExisting: false,
      action: 'NEW_MATCH_CREATED',
      notificationDispatched: true,
    };
  }

  public generateMatch(
    client: ClientProfile,
    candidate: ClientProfile,
    employeeId: string
  ): { success: boolean; match?: MatchRecommendation; error?: string } {
    if (this.isDuplicateMatch(client.clientId, candidate.clientId)) {
      return {
        success: false,
        error: `Active match recommendation already exists between ${client.fullName} and ${candidate.fullName}!`,
      };
    }

    const res = this.suggestHybridMatch({
      client,
      candidate,
      actorId: employeeId,
      actorRole: 'CRM_MANAGER',
      sourceType: 'EMPLOYEE_ASSISTED',
      reason: 'Generated via Assisted Compatibility Engine.',
    });

    if (!res.success) {
      return { success: false, error: res.error };
    }
    return { success: true, match: res.match };
  }

  public reviewMatch(
    matchId: string,
    employeeId: string,
    decision: 'APPROVED' | 'REJECTED_BY_EMPLOYEE',
    notes?: string
  ): boolean {
    const match = this.matches.find((m) => m.id === matchId || m.matchId === matchId);
    if (!match) return false;

    const prevStatus = match.overallStatus;
    match.reviewStatus = decision;
    match.reviewedAt = new Date().toLocaleString();
    if (notes) match.notes = notes;

    if (decision === 'APPROVED') {
      match.overallStatus = 'AWAITING_CLIENT_RESPONSE';
    } else {
      match.overallStatus = 'CLOSED';
    }

    this.addMatchAudit(match.matchId, {
      actorId: employeeId,
      actorName: this.getEmployeeById(employeeId)?.fullName || 'Employee',
      actorRole: 'CRM_MANAGER',
      sourceType: 'EMPLOYEE_ASSISTED',
      actionType: 'EMPLOYEE_REVIEW_SUBMITTED',
      reason: `Assisted review decision: ${decision}`,
      notes,
      previousStatus: prevStatus,
      resultingStatus: match.overallStatus,
    });

    this.addActivity({
      employeeId,
      timestamp: new Date().toLocaleString(),
      type: 'MATCH_REVIEWED',
      title: `Match ${decision === 'APPROVED' ? 'Approved' : 'Rejected'} (${match.matchId})`,
      description: `Assisted review completed for ${match.clientName} & ${match.candidateName}. Decision: ${decision}.`,
      entityType: 'MATCH',
      entityId: match.matchId,
      badgeColor: decision === 'APPROVED' ? 'emerald' : 'rose',
    });

    this.saveState();
    return true;
  }

  public shareMatchWithClient(matchId: string): boolean {
    const match = this.matches.find((m) => m.id === matchId || m.matchId === matchId);
    if (!match) return false;

    const prevStatus = match.overallStatus;
    match.reviewStatus = 'SHARED_WITH_CLIENT';
    match.sharedWithClientAt = new Date().toLocaleString();
    match.overallStatus = 'AWAITING_CLIENT_RESPONSE';

    // Increment client matches shared count
    const client = this.clients.find((c) => c.clientId === match.clientId);
    if (client) client.matchesShared += 1;

    this.addMatchAudit(match.matchId, {
      actorId: match.reviewedByEmployeeId,
      actorName: match.reviewedByEmployeeName,
      actorRole: 'CRM_MANAGER',
      sourceType: 'EMPLOYEE_ASSISTED',
      actionType: 'SHARED_WITH_CLIENT',
      reason: 'Dispatched candidate profile to client',
      previousStatus: prevStatus,
      resultingStatus: match.overallStatus,
    });

    this.addActivity({
      employeeId: match.reviewedByEmployeeId,
      timestamp: new Date().toLocaleString(),
      type: 'PROFILE_SHARED',
      title: `Match Shared with Client (${match.matchId})`,
      description: `Dispatched ${match.candidateName} profile to ${match.clientName}.`,
      entityType: 'MATCH',
      entityId: match.matchId,
      badgeColor: 'indigo',
    });

    this.saveState();
    return true;
  }

  /**
   * Record client's response independently from candidate response
   */
  public recordClientResponse(
    matchId: string,
    response: MatchResponseOption,
    recordedBy: 'CLIENT' | 'EMPLOYEE' = 'EMPLOYEE',
    notes?: string
  ): boolean {
    const match = this.matches.find((m) => m.id === matchId || m.matchId === matchId);
    if (!match) return false;

    const prevStatus = match.overallStatus;
    match.clientResponse = response;
    match.clientResponseAt = new Date().toLocaleString();
    match.clientResponseRecordedBy = recordedBy;
    if (notes) match.notes = `${match.notes || ''} [Client: ${notes}]`;

    // Increment client responses count
    const client = this.clients.find((c) => c.clientId === match.clientId);
    if (client) client.clientResponses += 1;

    // Check mutual status independently
    if (response === 'ACCEPTED' && match.candidateResponse === 'ACCEPTED') {
      match.overallStatus = 'MUTUAL_INTEREST';
    } else if (response === 'DECLINED') {
      match.overallStatus = 'DECLINED_BY_CLIENT';
    } else if (response === 'ACCEPTED') {
      match.overallStatus = 'AWAITING_CANDIDATE_RESPONSE';
    }

    this.addMatchAudit(match.matchId, {
      actorId: recordedBy === 'CLIENT' ? match.clientId : match.reviewedByEmployeeId,
      actorName: recordedBy === 'CLIENT' ? match.clientName : match.reviewedByEmployeeName,
      actorRole: recordedBy === 'CLIENT' ? 'USER' : 'CRM_MANAGER',
      sourceType: match.primarySource || 'EMPLOYEE_ASSISTED',
      actionType: 'CLIENT_RESPONSE_RECORDED',
      reason: `Client responded: ${response}`,
      notes,
      previousStatus: prevStatus,
      resultingStatus: match.overallStatus,
    });

    this.addActivity({
      employeeId: match.reviewedByEmployeeId,
      timestamp: new Date().toLocaleString(),
      type: 'CLIENT_RESPONSE_RECEIVED',
      title: `Client Response: ${response}`,
      description: `${match.clientName} responded: ${response} for ${match.candidateName}. (Recorded by: ${recordedBy})`,
      entityType: 'MATCH',
      entityId: match.matchId,
      badgeColor: response === 'ACCEPTED' ? 'emerald' : 'rose',
    });

    this.saveState();
    return true;
  }

  /**
   * Record candidate's response independently
   */
  public recordCandidateResponse(
    matchId: string,
    response: MatchResponseOption,
    recordedBy: 'CANDIDATE' | 'EMPLOYEE' = 'EMPLOYEE',
    notes?: string
  ): boolean {
    const match = this.matches.find((m) => m.id === matchId || m.matchId === matchId);
    if (!match) return false;

    const prevStatus = match.overallStatus;
    match.candidateResponse = response;
    match.candidateResponseAt = new Date().toLocaleString();
    match.candidateResponseRecordedBy = recordedBy;
    if (notes) match.notes = `${match.notes || ''} [Candidate: ${notes}]`;

    // Check mutual status independently
    if (match.clientResponse === 'ACCEPTED' && response === 'ACCEPTED') {
      match.overallStatus = 'MUTUAL_INTEREST';
    } else if (response === 'DECLINED') {
      match.overallStatus = 'DECLINED_BY_CANDIDATE';
    }

    this.addMatchAudit(match.matchId, {
      actorId: recordedBy === 'CANDIDATE' ? match.candidateId : match.reviewedByEmployeeId,
      actorName: recordedBy === 'CANDIDATE' ? match.candidateName : match.reviewedByEmployeeName,
      actorRole: recordedBy === 'CANDIDATE' ? 'USER' : 'CRM_MANAGER',
      sourceType: match.primarySource || 'EMPLOYEE_ASSISTED',
      actionType: 'CANDIDATE_RESPONSE_RECORDED',
      reason: `Candidate responded: ${response}`,
      notes,
      previousStatus: prevStatus,
      resultingStatus: match.overallStatus,
    });

    this.addActivity({
      employeeId: match.reviewedByEmployeeId,
      timestamp: new Date().toLocaleString(),
      type: 'CANDIDATE_RESPONSE_RECEIVED',
      title: `Candidate Response: ${response}`,
      description: `${match.candidateName} responded: ${response} for ${match.clientName}. (Recorded by: ${recordedBy})`,
      entityType: 'MATCH',
      entityId: match.matchId,
      badgeColor: response === 'ACCEPTED' ? 'emerald' : 'rose',
    });

    this.saveState();
    return true;
  }

  // --- Client Reassignments ---
  public reassignClient(
    clientId: string,
    newEmployeeId: string,
    reassignedBy: string,
    reason: string
  ): { success: boolean; error?: string } {
    const client = this.clients.find((c) => c.id === clientId || c.clientId === clientId);
    if (!client) return { success: false, error: 'Client profile not found' };

    const newEmp = this.getEmployeeById(newEmployeeId);
    if (!newEmp) return { success: false, error: 'Target employee not found' };

    const prevEmp = this.getEmployeeById(client.assignedEmployeeId);
    const prevEmpName = prevEmp ? prevEmp.fullName : client.assignedEmployeeName;

    // Record immutable assignment history
    const historyRecord: ClientAssignmentHistory = {
      id: `asg_${Date.now()}`,
      clientId: client.clientId,
      clientName: client.fullName,
      previousEmployeeId: client.assignedEmployeeId,
      previousEmployeeName: prevEmpName,
      newEmployeeId: newEmp.id,
      newEmployeeName: newEmp.fullName,
      reassignedAt: new Date().toLocaleString(),
      reassignedBy,
      reason,
      previousStatus: client.relationshipStatus,
      newStatus: client.relationshipStatus,
    };

    this.assignmentHistory = [historyRecord, ...this.assignmentHistory];

    // Update client record
    client.assignedEmployeeId = newEmp.id;
    client.assignedEmployeeName = newEmp.fullName;
    client.assignedDate = new Date().toISOString().split('T')[0];

    // Log timeline event
    this.addActivity({
      employeeId: newEmp.id,
      timestamp: new Date().toLocaleString(),
      type: 'LEAD_REASSIGNED',
      title: `Client Reassigned (${client.clientId})`,
      description: `${client.fullName} reassigned from ${prevEmpName} to ${newEmp.fullName}. Reason: ${reason}. Authorized by: ${reassignedBy}.`,
      entityType: 'CLIENT',
      entityId: client.clientId,
      badgeColor: 'amber',
    });

    this.saveState();
    return { success: true };
  }

  public getAssignmentHistory(clientIdOrEmployeeId?: string): ClientAssignmentHistory[] {
    if (!clientIdOrEmployeeId) return [...this.assignmentHistory];
    return this.assignmentHistory.filter(
      (h) =>
        h.clientId === clientIdOrEmployeeId ||
        h.previousEmployeeId === clientIdOrEmployeeId ||
        h.newEmployeeId === clientIdOrEmployeeId
    );
  }

  // --- Transactions & Revenue ---
  public getTransactions(): SalesTransaction[] {
    return [...this.transactions];
  }

  public getTransactionsByEmployee(employeeId: string): SalesTransaction[] {
    const emp = this.getEmployeeById(employeeId);
    if (!emp) return [];
    return this.transactions.filter(
      (t) => t.employeeId === emp.id || t.employeeId === emp.employeeId
    );
  }

  // --- Activities ---
  public getActivities(employeeId?: string): ActivityTimelineEvent[] {
    if (!employeeId) return [...this.activities];
    const emp = this.getEmployeeById(employeeId);
    if (!emp) return [];
    return this.activities.filter(
      (a) => a.employeeId === emp.id || a.employeeId === emp.employeeId
    );
  }

  public addActivity(event: Omit<ActivityTimelineEvent, 'id'>): ActivityTimelineEvent {
    const act: ActivityTimelineEvent = {
      ...event,
      id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    };
    this.activities = [act, ...this.activities];
    return act;
  }

  /**
   * Single authoritative Employee 360° metrics calculator
   * Excludes duplicate records and calculates transparent, audit-ready rates!
   */
  public calculateEmployeeMetrics(
    employeeId: string,
    dateRange: 'TODAY' | 'WEEK' | 'MONTH' | 'ALL' = 'ALL'
  ): EmployeeSummaryMetrics {
    const emp = this.getEmployeeById(employeeId);
    if (!emp) {
      return {
        totalLeadsAssigned: 0,
        totalClientsAssigned: 0,
        activeClients: 0,
        totalCallsLogged: 0,
        connectedCalls: 0,
        successfulConversations: 0,
        followUpsCompleted: 0,
        overdueFollowUps: 0,
        matchesGenerated: 0,
        matchesReviewed: 0,
        clientResponsesReceived: 0,
        positiveResponses: 0,
        membershipSales: 0,
        revenueAttributed: 0,
        conversionRate: 0,
        callsPerDayAverage: 0,
        verifiedConnectedRate: 0,
        followUpCompletionRate: 0,
        matchAcceptanceRate: 0,
        averageResponseTimeHours: 0,
      };
    }

    const leads = this.getLeadsByEmployee(emp.id);
    const clients = this.getClientsByEmployee(emp.id);
    let calls = this.getCallsByEmployee(emp.id);
    let tasks = this.getTasksByEmployee(emp.id);
    let matches = this.getMatchesByEmployee(emp.id);
    let txns = this.getTransactionsByEmployee(emp.id);

    // Filter by Date Range if not ALL
    if (dateRange === 'TODAY') {
      const today = new Date().toISOString().split('T')[0];
      calls = calls.filter((c) => c.date >= today);
      tasks = tasks.filter((t) => t.createdDate >= today);
      matches = matches.filter((m) => m.createdAt >= today);
      txns = txns.filter((t) => t.date >= today);
    } else if (dateRange === 'WEEK') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weekStr = weekAgo.toISOString().split('T')[0];
      calls = calls.filter((c) => c.date >= weekStr);
      tasks = tasks.filter((t) => t.createdDate >= weekStr);
      matches = matches.filter((m) => m.createdAt >= weekStr);
      txns = txns.filter((t) => t.date >= weekStr);
    } else if (dateRange === 'MONTH') {
      const monthAgo = new Date();
      monthAgo.setDate(monthAgo.getDate() - 30);
      const monthStr = monthAgo.toISOString().split('T')[0];
      calls = calls.filter((c) => c.date >= monthStr);
      tasks = tasks.filter((t) => t.createdDate >= monthStr);
      matches = matches.filter((m) => m.createdAt >= monthStr);
      txns = txns.filter((t) => t.date >= monthStr);
    }

    const totalLeadsAssigned = leads.length;
    const totalClientsAssigned = clients.length;
    const activeClients = clients.filter(
      (c) => c.relationshipStatus === 'MATCHMAKING_ACTIVE' || c.relationshipStatus === 'FOLLOW_UP_REQUIRED'
    ).length;

    // Use Set of call IDs to guarantee no double counting
    const callIds = new Set(calls.map((c) => c.id));
    const totalCallsLogged = callIds.size;
    const connectedCalls = calls.filter((c) => c.status === 'CONNECTED').length;
    const successfulConversations = calls.filter(
      (c) =>
        c.status === 'CONNECTED' &&
        (c.outcome === 'MATCH_APPROVED' ||
          c.outcome === 'INTERESTED' ||
          c.outcome === 'MEMBERSHIP_INQUIRY' ||
          c.outcome === 'PROFILE_SHARED')
    ).length;

    const followUpsCompleted = tasks.filter((t) => t.status === 'COMPLETED').length;
    const overdueFollowUps = tasks.filter((t) => t.status === 'OVERDUE').length;

    const matchesGenerated = matches.length;
    const matchesReviewed = matches.filter((m) => m.reviewStatus !== 'GENERATED').length;

    const clientResponsesReceived = matches.filter(
      (m) => m.clientResponse && m.clientResponse !== 'PENDING'
    ).length;
    const positiveResponses = matches.filter(
      (m) => m.clientResponse === 'ACCEPTED' || m.candidateResponse === 'ACCEPTED'
    ).length;

    const successfulTxns = txns.filter((t) => t.paymentStatus === 'SUCCESS');
    const membershipSales = successfulTxns.length;
    const revenueAttributed = successfulTxns.reduce((acc, t) => acc + t.totalAmount, 0);

    const conversionRate =
      totalLeadsAssigned > 0
        ? Math.round((membershipSales / totalLeadsAssigned) * 100)
        : 0;

    const verifiedConnectedRate =
      totalCallsLogged > 0
        ? Math.round((connectedCalls / totalCallsLogged) * 100)
        : 0;

    const totalFollowUps = tasks.length;
    const followUpCompletionRate =
      totalFollowUps > 0
        ? Math.round((followUpsCompleted / totalFollowUps) * 100)
        : 100;

    const matchAcceptanceRate =
      clientResponsesReceived > 0
        ? Math.round((positiveResponses / clientResponsesReceived) * 100)
        : 0;

    return {
      totalLeadsAssigned,
      totalClientsAssigned,
      activeClients,
      totalCallsLogged,
      connectedCalls,
      successfulConversations,
      followUpsCompleted,
      overdueFollowUps,
      matchesGenerated,
      matchesReviewed,
      clientResponsesReceived,
      positiveResponses,
      membershipSales,
      revenueAttributed,
      conversionRate,
      callsPerDayAverage: totalCallsLogged > 0 ? Number((totalCallsLogged / 7).toFixed(1)) : 0,
      verifiedConnectedRate,
      followUpCompletionRate,
      matchAcceptanceRate,
      averageResponseTimeHours: 2.4,
    };
  }

  // --- SUCCESS STORIES API ---
  getSuccessStories(): SuccessStory[] {
    return [...this.successStories];
  }

  getSuccessStoryById(id: string): SuccessStory | undefined {
    return this.successStories.find((s) => s.id === id || s.storyId === id);
  }

  addSuccessStory(story: Omit<SuccessStory, 'id' | 'storyId' | 'createdAt' | 'updatedAt'>): SuccessStory {
    const nextNum = this.successStories.length + 1;
    const newStory: SuccessStory = {
      ...story,
      id: `story_${Date.now()}`,
      storyId: `SUCC-${new Date().getFullYear()}-${String(nextNum).padStart(3, '0')}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    if (story.profilesArchived) {
      this.archiveCoupleProfiles(story.groomId, story.brideId);
    }

    this.successStories = [newStory, ...this.successStories];
    this.saveState();
    return newStory;
  }

  updateSuccessStory(id: string, updates: Partial<SuccessStory>): SuccessStory | null {
    const idx = this.successStories.findIndex((s) => s.id === id || s.storyId === id);
    if (idx === -1) return null;

    const existing = this.successStories[idx];
    const updated: SuccessStory = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString().split('T')[0],
    };

    if (updates.profilesArchived && !existing.profilesArchived) {
      this.archiveCoupleProfiles(updated.groomId, updated.brideId);
    }

    this.successStories[idx] = updated;
    this.saveState();
    return updated;
  }

  togglePublishSuccessStory(id: string): boolean {
    const story = this.successStories.find((s) => s.id === id || s.storyId === id);
    if (!story) return false;
    story.status = story.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    story.updatedAt = new Date().toISOString().split('T')[0];
    this.saveState();
    return true;
  }

  deleteSuccessStory(id: string): boolean {
    const beforeLen = this.successStories.length;
    this.successStories = this.successStories.filter((s) => s.id !== id && s.storyId !== id);
    if (this.successStories.length !== beforeLen) {
      this.saveState();
      return true;
    }
    return false;
  }

  archiveCoupleProfiles(groomId: string, brideId: string): void {
    const groom = this.clients.find((c) => c.id === groomId || c.clientId === groomId);
    if (groom) {
      groom.relationshipStatus = 'MARRIED';
    }
    const bride = this.clients.find((c) => c.id === brideId || c.clientId === brideId);
    if (bride) {
      bride.relationshipStatus = 'MARRIED';
    }
    this.saveState();
  }

  getPendingSuccessStoriesCount(): number {
    return this.successStories.filter((s) => s.status === 'DRAFT').length;
  }

  getPendingReviewsCount(): number {
    return this.reviews.filter((r) => r.status === 'PENDING').length;
  }

  // --- REVIEWS & RATINGS API ---
  getReviews(): ReviewItem[] {
    return [...this.reviews];
  }

  getReviewById(id: string): ReviewItem | undefined {
    return this.reviews.find((r) => r.id === id || r.reviewId === id);
  }

  addReview(review: Omit<ReviewItem, 'id' | 'reviewId' | 'createdAt' | 'helpfulCount'>): ReviewItem {
    const nextNum = this.reviews.length + 1;
    const newReview: ReviewItem = {
      ...review,
      id: `rev_${Date.now()}`,
      reviewId: `REV-${new Date().getFullYear()}-${String(nextNum).padStart(3, '0')}`,
      createdAt: new Date().toISOString().split('T')[0],
      helpfulCount: 0,
    };
    this.reviews = [newReview, ...this.reviews];
    this.saveState();
    return newReview;
  }

  updateReviewStatus(id: string, status: 'APPROVED' | 'PENDING' | 'REJECTED'): boolean {
    const rev = this.reviews.find((r) => r.id === id || r.reviewId === id);
    if (!rev) return false;
    rev.status = status;
    this.saveState();
    return true;
  }

  updateReview(id: string, updates: Partial<ReviewItem>): boolean {
    const rev = this.reviews.find((r) => r.id === id || r.reviewId === id);
    if (!rev) return false;
    Object.assign(rev, updates);
    this.saveState();
    return true;
  }

  addAdminReviewResponse(id: string, adminResponse: string): boolean {
    const rev = this.reviews.find((r) => r.id === id || r.reviewId === id);
    if (!rev) return false;
    rev.adminResponse = adminResponse;
    rev.adminRespondedAt = new Date().toISOString().split('T')[0];
    this.saveState();
    return true;
  }

  deleteReview(id: string): boolean {
    const beforeLen = this.reviews.length;
    this.reviews = this.reviews.filter((r) => r.id !== id && r.reviewId !== id);
    if (this.reviews.length !== beforeLen) {
      this.saveState();
      return true;
    }
    return false;
  }

  getReviewStats() {
    const total = this.reviews.length;
    if (total === 0) {
      return {
        totalReviews: 0,
        averageRating: 0,
        breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        approvedCount: 0,
        pendingCount: 0,
      };
    }
    const sum = this.reviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = Number((sum / total).toFixed(1));
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let approvedCount = 0;
    let pendingCount = 0;

    this.reviews.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
      breakdown[star] = (breakdown[star] || 0) + 1;
      if (r.status === 'APPROVED') approvedCount++;
      if (r.status === 'PENDING') pendingCount++;
    });

    return {
      totalReviews: total,
      averageRating: avg,
      breakdown,
      approvedCount,
      pendingCount,
    };
  }

  // --- TRUST & SAFETY / ABUSE DESK API ---
  getAbuseReports(): AbuseReport[] {
    return [...this.abuseReports];
  }

  getAbuseReportById(id: string): AbuseReport | undefined {
    return this.abuseReports.find((r) => r.id === id || r.reportId === id);
  }

  getBlacklistedIdentities(): BlacklistedIdentity[] {
    return [...this.blacklistedIdentities];
  }

  executeSafetyAction(
    reportId: string,
    actionType: SafetyActionType,
    actedBy: string,
    reasonNotes: string
  ): { success: boolean; message: string; report?: AbuseReport } {
    const report = this.abuseReports.find((r) => r.id === reportId || r.reportId === reportId);
    if (!report) {
      return { success: false, message: 'Abuse report ticket not found' };
    }

    const suspect = this.clients.find(
      (c) => c.id === report.reportedMemberId || c.clientId === report.reportedMemberId
    );

    report.updatedAt = new Date().toISOString().split('T')[0];
    report.adminAction = {
      actionType,
      actedBy,
      actedAt: new Date().toISOString().split('T')[0],
      reasonNotes,
    };

    if (actionType === 'WARNING_NUDGE') {
      report.status = 'WARNED';
      this.addActivity({
        employeeId: 'safety_desk',
        timestamp: new Date().toLocaleString(),
        type: 'CLIENT_STATUS_CHANGED',
        title: `Warning Issued (${report.reportedMemberId})`,
        description: `Formal compliance warning issued to ${report.reportedMemberName} for ${report.reason}. Authorized by ${actedBy}.`,
        entityType: 'CLIENT',
        entityId: report.reportedMemberId,
        badgeColor: 'amber',
      });
      this.saveState();
      return { success: true, message: `Warning nudge dispatched to ${report.reportedMemberName}`, report };
    }

    if (actionType === 'SHADOW_FREEZE_7D') {
      report.status = 'SHADOW_FROZEN';
      if (suspect) {
        suspect.relationshipStatus = 'SHADOW_FROZEN';
      }
      this.addActivity({
        employeeId: 'safety_desk',
        timestamp: new Date().toLocaleString(),
        type: 'CLIENT_STATUS_CHANGED',
        title: `7-Day Shadow Freeze Applied (${report.reportedMemberId})`,
        description: `${report.reportedMemberName} placed on 7-day shadow freeze. Match suggestions and calling suspended.`,
        entityType: 'CLIENT',
        entityId: report.reportedMemberId,
        badgeColor: 'purple',
      });
      this.saveState();
      return { success: true, message: `7-Day Shadow Freeze applied on ${report.reportedMemberName}`, report };
    }

    if (actionType === 'PERMANENT_BLACKLIST') {
      report.status = 'BLACKLISTED';
      if (suspect) {
        suspect.relationshipStatus = 'BLACKLISTED';
      }

      // Add to blacklisted identities vault
      const newBlacklistEntry: BlacklistedIdentity = {
        id: `blk_${Date.now()}`,
        memberId: report.reportedMemberId,
        fullName: report.reportedMemberName,
        phone: report.reportedMemberPhone,
        aadhaarHash: report.reportedMemberAadhaarHash,
        deviceId: report.reportedMemberDeviceId,
        reason: `${report.reason}: ${report.evidenceText}`,
        severity: report.severity === 'CRITICAL' ? 'CRITICAL' : 'HIGH',
        blacklistedBy: actedBy,
        blacklistedAt: new Date().toISOString().split('T')[0],
      };

      this.blacklistedIdentities = [newBlacklistEntry, ...this.blacklistedIdentities];

      // Block all pair relationships with this suspect in match recommendations
      this.matches.forEach((m) => {
        if (m.clientId === report.reportedMemberId || m.candidateId === report.reportedMemberId) {
          m.overallStatus = 'CLOSED';
        }
      });

      this.addActivity({
        employeeId: 'safety_desk',
        timestamp: new Date().toLocaleString(),
        type: 'CLIENT_STATUS_CHANGED',
        title: `Permanent Blacklist Enforced (${report.reportedMemberId})`,
        description: `${report.reportedMemberName} permanently banned. Phone ${report.reportedMemberPhone}, Aadhaar ${report.reportedMemberAadhaarHash}, and Device ${report.reportedMemberDeviceId} blacklisted globally.`,
        entityType: 'CLIENT',
        entityId: report.reportedMemberId,
        badgeColor: 'rose',
      });

      this.saveState();
      return { success: true, message: `Permanent Blacklist enforced on Phone, Aadhaar, and Device ID`, report };
    }

    if (actionType === 'DISMISSED') {
      report.status = 'DISMISSED';
      this.saveState();
      return { success: true, message: `Report dismissed as false alarm / insufficient proof`, report };
    }

    this.saveState();
    return { success: true, message: 'Action recorded successfully', report };
  }

  removeBlacklist(id: string): boolean {
    const beforeLen = this.blacklistedIdentities.length;
    this.blacklistedIdentities = this.blacklistedIdentities.filter((b) => b.id !== id);
    if (this.blacklistedIdentities.length !== beforeLen) {
      this.saveState();
      return true;
    }
    return false;
  }

  getSafetyKPIs() {
    const openReports = this.abuseReports.filter((r) => r.status === 'OPEN').length;
    const criticalCount = this.abuseReports.filter((r) => r.severity === 'CRITICAL' && r.status === 'OPEN').length;
    const shadowFrozen = this.abuseReports.filter((r) => r.status === 'SHADOW_FROZEN').length;
    const totalBlacklisted = this.blacklistedIdentities.length;
    return { openReports, criticalCount, shadowFrozen, totalBlacklisted };
  }
}

export const crmDataService = new CRMDataService();
