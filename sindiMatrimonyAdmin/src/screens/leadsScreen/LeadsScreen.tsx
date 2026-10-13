import React, { useEffect, useMemo, useCallback, useRef } from 'react';
import { crmDataService } from '../../services/crmDataService';
import type { Lead, LeadStatus } from '../../types/crm.types';
import { toast } from '../../toastMessage/toast';
import { CallResponseModal } from '../../customModals/CallResponseModal';
import {
  getStoredUser,
  getSimulatedUser,
  getActiveRole,
  setSimulatedUser,
  setActiveRole,
} from '../../storage';
import { memoWithDeepEqual } from '../../utils/memoUtils';
import { usePerformanceTracker } from '../../customHooks/usePerformanceTracker';

// Modular subcomponents from ./component folder
import {
  PAGE_SIZE,
  REASSIGN_REASON_PRESETS,
  type LeadsTabType,
  type LeadsScreenState,
  SessionPersonaBanner,
  LeadsNoticeBanners,
  LeadsPageHeader,
  LeadsTabsSection,
  LeadsFilterSection,
  LeadsBatchToolbar,
  LeadsTableSection,
  AssignLeadsModal,
  ReassignLeadModal,
  LeadDetailModal,
} from './component';
import { useInputs } from '../../customHooks/useInputs';

const FALLBACK_USER = Object.freeze({ fullName: 'Rajesh Mulchandani', role: 'SUPER_ADMIN', id: 'emp_001' });

export const LeadsScreen: React.FC = memoWithDeepEqual(() => {
  usePerformanceTracker('LeadsScreen');

  // Timer ref for auto-clearing success banners safely without leaks
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cached session & role detection
  const storedUser = useMemo(() => getStoredUser() || FALLBACK_USER, []);
  const simulatedUser = getSimulatedUser();
  const activeRoleOverride = getActiveRole();
  const effectiveUser = simulatedUser || storedUser;
  const effectiveRole = activeRoleOverride || effectiveUser.role || 'SUPER_ADMIN';
  const isSuperAdmin = effectiveRole === 'SUPER_ADMIN';

  /**
   * Single consolidated state object managing all LeadsScreen reactive state.
   * Managed via useInputs to provide zero-glitch reactive form and UI state management.
   */
  const {
    values: state,
    setValues,
  } = useInputs<LeadsScreenState>(() => ({
    leads: crmDataService.getLeads(),
    employees: crmDataService.getEmployees(),
    activeTab: isSuperAdmin ? 'UNASSIGNED' : 'MY_BUCKET',
    search: '',
    subcasteFilter: 'ALL',
    sourceFilter: 'ALL',
    staffFilter: 'ALL',
    selectedLeads: [],
    currentPage: 1,
    revealedMobiles: {},
    assignSuccessMessage: null,
    isAssignModalOpen: false,
    selectedTargetEmployeeId: '',
    assignmentNote: '',
    assignError: null,
    isReassignModalOpen: false,
    reassigningLead: null,
    reassignReason: REASSIGN_REASON_PRESETS[0],
    reassignHandoverNotes: '',
    activeLeadDetail: null,
    callingLead: null,
  }));

  // Clean updater callback using useInputs
  const updateState = useCallback(
    (updater: Partial<LeadsScreenState> | ((prev: LeadsScreenState) => Partial<LeadsScreenState>)) => {
      setValues((prev) => {
        const patch = typeof updater === 'function' ? updater(prev) : updater;
        return { ...prev, ...patch };
      });
    },
    [setValues]
  );

  // Subscribe to reactive CRM data service
  useEffect(() => {
    const unsubscribe = crmDataService.subscribe(() => {
      updateState({
        leads: crmDataService.getLeads(),
        employees: crmDataService.getEmployees(),
      });
    });
    return unsubscribe;
  }, [updateState]);

  // Clean up auto-dismiss timer on unmount
  useEffect(() => {
    return () => {
      if (successTimerRef.current) {
        clearTimeout(successTimerRef.current);
      }
    };
  }, []);

  // Lock non-SuperAdmin view to MY_BUCKET
  useEffect(() => {
    if (!isSuperAdmin && state.activeTab !== 'MY_BUCKET') {
      updateState({ activeTab: 'MY_BUCKET' });
    }
  }, [isSuperAdmin, state.activeTab, updateState]);

  // Eligible employees for assignment/reassignment (Active staff)
  const eligibleEmployees = useMemo(() => {
    return state.employees.filter(
      (e) =>
        e.isActive &&
        (e.role === 'CRM_AGENT' ||
          e.role === 'CRM_MANAGER' ||
          e.role === 'SUPPORT_AGENT' ||
          e.role === 'ADMIN' ||
          e.role === 'SUPER_ADMIN')
    );
  }, [state.employees]);

  // Current logged in agent ID
  const currentAgentId = useMemo(() => {
    const found = state.employees.find(
      (e) => e.id === effectiveUser.id || e.employeeId === effectiveUser.employeeId || e.fullName === effectiveUser.fullName
    );
    return found ? found.id : effectiveUser.id || 'emp_003';
  }, [state.employees, effectiveUser]);

  // Toggle mask for a mobile number
  const toggleMobileReveal = useCallback((leadId: string) => {
    updateState((prev) => ({
      revealedMobiles: {
        ...prev.revealedMobiles,
        [leadId]: !prev.revealedMobiles[leadId],
      },
    }));
  }, [updateState]);

  // Quick switch simulated employee
  const handleSwitchSimulatedEmployee = useCallback((empId: string) => {
    if (empId === 'SUPER_ADMIN') {
      setSimulatedUser(null);
      setActiveRole('SUPER_ADMIN');
      updateState({ activeTab: 'ALL', currentPage: 1, selectedLeads: [] });
    } else {
      const emp = state.employees.find((e) => e.id === empId);
      if (emp) {
        setSimulatedUser({
          id: emp.id,
          employeeId: emp.employeeId,
          fullName: emp.fullName,
          email: emp.email,
          mobile: emp.mobile,
          role: emp.role,
          department: emp.department,
          recordScope: emp.recordScope,
          permissions: emp.permissions,
          isChatEnabled: emp.isChatEnabled,
        });
        setActiveRole(emp.role);
        updateState({ activeTab: 'MY_BUCKET', currentPage: 1, selectedLeads: [] });
      }
    }
  }, [state.employees, updateState]);

  // High-performance single-pass Tab Counts calculation (replaces 6 separate filter passes)
  const tabCounts = useMemo(() => {
    let unassigned = 0;
    let myBucket = 0;
    let assigned = 0;
    let transferred = 0;
    let today = 0;
    let high = 0;
    const leads = state.leads;
    const all = leads.length;

    for (let i = 0; i < all; i++) {
      const l = leads[i];
      const isMine = l.assignedEmployeeId === currentAgentId || l.assignedEmployeeId === effectiveUser.id;
      const isNewOrNoEmp = l.status === 'NEW' || !l.assignedEmployeeId;

      if (isNewOrNoEmp) unassigned++;
      if (isMine) myBucket++;
      if (!isNewOrNoEmp) assigned++;
      if (l.assignmentHistory && l.assignmentHistory.length > 0) transferred++;
      if (l.nextFollowUp && l.nextFollowUp.toLowerCase().includes('today')) today++;
      if (l.priority === 'HIGH' || l.priority === 'URGENT') high++;
    }

    return {
      all,
      unassigned,
      myBucket,
      assigned,
      transferred,
      today,
      high,
    };
  }, [state.leads, currentAgentId, effectiveUser.id]);

  // Fast filtered leads calculation with short-circuiting and pre-lowercased query
  const filteredLeads = useMemo(() => {
    const q = state.search.trim().toLowerCase();
    const leads = state.leads;
    const activeTab = state.activeTab;
    const subcasteFilter = state.subcasteFilter;
    const sourceFilter = state.sourceFilter;
    const staffFilter = state.staffFilter;
    const myId = effectiveUser.id;

    return leads.filter((lead) => {
      // Non-SuperAdmin employee: strictly restrict to assigned leads!
      if (!isSuperAdmin) {
        const isAssignedToMe = lead.assignedEmployeeId === currentAgentId || lead.assignedEmployeeId === myId;
        if (!isAssignedToMe) return false;
      } else if (staffFilter !== 'ALL') {
        if (staffFilter === 'UNASSIGNED') {
          if (lead.assignedEmployeeId) return false;
        } else if (lead.assignedEmployeeId !== staffFilter) {
          return false;
        }
      }

      // Tab filter
      if (activeTab === 'UNASSIGNED') {
        if (lead.status !== 'NEW' && lead.assignedEmployeeId) return false;
      } else if (activeTab === 'MY_BUCKET') {
        const isAssignedToMe = lead.assignedEmployeeId === currentAgentId || lead.assignedEmployeeId === myId;
        if (!isAssignedToMe) return false;
      } else if (activeTab === 'ASSIGNED') {
        if (lead.status === 'NEW' || !lead.assignedEmployeeId) return false;
      } else if (activeTab === 'TRANSFERRED') {
        if (!lead.assignmentHistory || lead.assignmentHistory.length === 0) return false;
      } else if (activeTab === 'TODAY') {
        if (!lead.nextFollowUp || !lead.nextFollowUp.toLowerCase().includes('today')) return false;
      } else if (activeTab === 'HIGH') {
        if (lead.priority !== 'HIGH' && lead.priority !== 'URGENT') return false;
      }

      // Subcaste filter
      if (subcasteFilter !== 'ALL' && lead.subcaste !== subcasteFilter) {
        return false;
      }

      // Source filter
      if (sourceFilter !== 'ALL' && lead.source !== sourceFilter) {
        return false;
      }

      // Search keyword with early short-circuit evaluation
      if (q) {
        const match =
          lead.name.toLowerCase().includes(q) ||
          lead.leadId.toLowerCase().includes(q) ||
          lead.mobile.includes(q) ||
          (lead.subcaste && lead.subcaste.toLowerCase().includes(q)) ||
          (lead.city && lead.city.toLowerCase().includes(q)) ||
          (lead.profession && lead.profession.toLowerCase().includes(q));
        if (!match) return false;
      }

      return true;
    });
  }, [
    state.leads,
    isSuperAdmin,
    state.staffFilter,
    state.activeTab,
    currentAgentId,
    effectiveUser.id,
    state.subcasteFilter,
    state.sourceFilter,
    state.search,
  ]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredLeads.length / PAGE_SIZE) || 1;
  const paginatedLeads = useMemo(() => {
    const start = (state.currentPage - 1) * PAGE_SIZE;
    return filteredLeads.slice(start, start + PAGE_SIZE);
  }, [filteredLeads, state.currentPage]);

  // Single-pass Selected leads composition info with O(1) Set lookup
  const selectedLeadsInfo = useMemo(() => {
    if (state.selectedLeads.length === 0) {
      return { total: 0, alreadyAssignedCount: 0, unassignedCount: 0, hasAssigned: false, hasUnassigned: false };
    }
    const selectedSet = new Set(state.selectedLeads);
    let alreadyAssignedCount = 0;
    let unassignedCount = 0;

    for (let i = 0; i < state.leads.length; i++) {
      const l = state.leads[i];
      if (selectedSet.has(l.id)) {
        if (l.status !== 'NEW' && l.assignedEmployeeId) {
          alreadyAssignedCount++;
        } else {
          unassignedCount++;
        }
      }
    }

    return {
      total: state.selectedLeads.length,
      alreadyAssignedCount,
      unassignedCount,
      hasAssigned: alreadyAssignedCount > 0,
      hasUnassigned: unassignedCount > 0,
    };
  }, [state.selectedLeads, state.leads]);

  // Batch Selection Handlers
  const handleSelectFirst20Unassigned = useCallback(() => {
    const unassignedList = state.leads.filter((l) => l.status === 'NEW' || !l.assignedEmployeeId);
    const first20 = unassignedList.slice(0, PAGE_SIZE).map((l) => l.id);
    updateState({
      selectedLeads: first20,
      activeTab: 'UNASSIGNED',
      currentPage: 1,
    });
  }, [state.leads, updateState]);

  const handleSelectAllOnCurrentPage = useCallback(() => {
    const pageIds = paginatedLeads.map((l) => l.id);
    updateState({ selectedLeads: pageIds });
  }, [paginatedLeads, updateState]);

  // Filter change handlers (resets page and clears selection atomically)
  const handleSearchChange = useCallback((val: string) => {
    updateState({ search: val, currentPage: 1, selectedLeads: [] });
  }, [updateState]);

  const handleTabChange = useCallback((tab: LeadsTabType) => {
    updateState({ activeTab: tab, currentPage: 1, selectedLeads: [] });
  }, [updateState]);

  const handleStaffFilterChange = useCallback((val: string) => {
    updateState({ staffFilter: val, currentPage: 1, selectedLeads: [] });
  }, [updateState]);

  const handleSubcasteFilterChange = useCallback((val: string) => {
    updateState({ subcasteFilter: val, currentPage: 1, selectedLeads: [] });
  }, [updateState]);

  const handleSourceFilterChange = useCallback((val: string) => {
    updateState({ sourceFilter: val, currentPage: 1, selectedLeads: [] });
  }, [updateState]);

  const handleClearSelection = useCallback(() => {
    updateState({ selectedLeads: [] });
  }, [updateState]);

  const handlePageChange = useCallback((page: number) => {
    updateState({ currentPage: page });
  }, [updateState]);

  const handleSelectionChange = useCallback((ids: string[]) => {
    updateState({ selectedLeads: ids });
  }, [updateState]);

  // Modal Open / Close Handlers
  const handleOpenAssignModal = useCallback(() => {
    updateState({
      assignError: null,
      isAssignModalOpen: true,
      selectedTargetEmployeeId: '',
      assignmentNote: '',
    });
  }, [updateState]);

  const handleCloseAssignModal = useCallback(() => {
    updateState({ isAssignModalOpen: false });
  }, [updateState]);

  const handleOpenReassignSingle = useCallback((lead: Lead) => {
    updateState({
      reassigningLead: lead,
      selectedTargetEmployeeId: '',
      reassignReason: REASSIGN_REASON_PRESETS[0],
      reassignHandoverNotes: '',
      assignError: null,
      isReassignModalOpen: true,
    });
  }, [updateState]);

  const handleOpenReassignBatch = useCallback(() => {
    updateState({
      reassigningLead: null,
      selectedTargetEmployeeId: '',
      reassignReason: REASSIGN_REASON_PRESETS[0],
      reassignHandoverNotes: '',
      assignError: null,
      isReassignModalOpen: true,
    });
  }, [updateState]);

  const handleCloseReassignModal = useCallback(() => {
    updateState({ isReassignModalOpen: false });
  }, [updateState]);

  const handleViewLeadDetail = useCallback((lead: Lead) => {
    updateState({ activeLeadDetail: lead });
  }, [updateState]);

  const handleCloseLeadDetail = useCallback(() => {
    updateState({ activeLeadDetail: null });
  }, [updateState]);

  const handleStartCall = useCallback((lead: Lead) => {
    updateState({ callingLead: lead });
  }, [updateState]);

  const handleCloseCallModal = useCallback(() => {
    updateState({ callingLead: null });
  }, [updateState]);

  const handleDismissSuccessNotice = useCallback(() => {
    updateState({ assignSuccessMessage: null });
  }, [updateState]);

  // Execute Reassignment with Mandatory Audit Logging
  const handleConfirmReassignment = useCallback(() => {
    updateState({ assignError: null });

    if (!state.selectedTargetEmployeeId) {
      const err = 'Please select a new recipient employee.';
      updateState({ assignError: err });
      toast.error(err);
      return;
    }

    if (!state.reassignReason || state.reassignReason.trim() === '') {
      const err = 'Please provide a mandatory reassignment reason for audit logs.';
      updateState({ assignError: err });
      toast.warning(err);
      return;
    }

    const authorizedBy = `${effectiveUser.fullName} (${effectiveRole})`;
    const targetEmp = state.employees.find((e) => e.id === state.selectedTargetEmployeeId);

    if (state.reassigningLead) {
      // Single Lead Reassign
      const res = crmDataService.reassignLead(
        state.reassigningLead.id,
        state.selectedTargetEmployeeId,
        authorizedBy,
        state.reassignReason,
        state.reassignHandoverNotes
      );

      if (!res.success) {
        const err = res.error || 'Reassignment failed.';
        updateState({ assignError: err });
        toast.error(err);
        return;
      }

      const msg = `🔄 Reassigned ${state.reassigningLead.name} (${state.reassigningLead.leadId}) to ${targetEmp?.fullName}. Audit log saved!`;
      toast.success(msg);

      const updated = crmDataService.getLeadById(state.reassigningLead.id);
      updateState((prev) => ({
        assignSuccessMessage: msg,
        isReassignModalOpen: false,
        activeLeadDetail:
          prev.activeLeadDetail && prev.activeLeadDetail.id === prev.reassigningLead?.id
            ? updated || null
            : prev.activeLeadDetail,
      }));
    } else {
      // Batch Reassign
      const res = crmDataService.reassignLeadsBatch(
        state.selectedLeads,
        state.selectedTargetEmployeeId,
        authorizedBy,
        state.reassignReason,
        state.reassignHandoverNotes
      );

      if (!res.success) {
        const err = res.error || 'Batch reassignment failed.';
        updateState({ assignError: err });
        toast.error(err);
        return;
      }

      const msg = `🔄 Successfully transferred & reassigned ${res.reassignedCount} leads to ${targetEmp?.fullName}!`;
      toast.success(msg);

      updateState({
        assignSuccessMessage: msg,
        selectedLeads: [],
        isReassignModalOpen: false,
      });
    }

    if (successTimerRef.current) {
      clearTimeout(successTimerRef.current);
    }
    successTimerRef.current = setTimeout(() => {
      updateState({ assignSuccessMessage: null });
    }, 5000);
  }, [
    state.selectedTargetEmployeeId,
    state.reassignReason,
    state.reassigningLead,
    state.reassignHandoverNotes,
    state.selectedLeads,
    state.employees,
    effectiveUser.fullName,
    effectiveRole,
    updateState,
  ]);

  // Execute Initial Batch Assignment
  const handleConfirmAssignment = useCallback(() => {
    updateState({ assignError: null });

    if (!state.selectedTargetEmployeeId) {
      const err = 'Please select an employee to assign leads to.';
      updateState({ assignError: err });
      toast.error(err);
      return;
    }

    const result = crmDataService.assignLeadsBatch(
      state.selectedLeads,
      state.selectedTargetEmployeeId,
      `${effectiveUser.fullName} (${effectiveRole})`,
      state.assignmentNote
    );

    if (!result.success) {
      const err = result.error || 'Failed to assign leads.';
      updateState({ assignError: err });
      toast.error(err);
      return;
    }

    const targetEmp = state.employees.find((e) => e.id === state.selectedTargetEmployeeId);
    const msg = `🎉 Successfully assigned ${result.assignedCount} leads to ${targetEmp?.fullName || 'the employee'}!`;
    toast.success(msg);

    updateState({
      assignSuccessMessage: msg,
      selectedLeads: [],
      isAssignModalOpen: false,
      assignmentNote: '',
      selectedTargetEmployeeId: '',
    });

    if (successTimerRef.current) {
      clearTimeout(successTimerRef.current);
    }
    successTimerRef.current = setTimeout(() => {
      updateState({ assignSuccessMessage: null });
    }, 5000);
  }, [
    state.selectedTargetEmployeeId,
    state.selectedLeads,
    state.assignmentNote,
    state.employees,
    effectiveUser.fullName,
    effectiveRole,
    updateState,
  ]);

  // Lead Status Update handler
  const handleUpdateLeadStatus = useCallback(
    (leadId: string, newStatus: LeadStatus) => {
      crmDataService.updateLeadStatus(leadId, newStatus, `Status updated by ${effectiveUser.fullName}`);
      toast.success(`Lead status updated to ${newStatus}`);
      updateState((prev) => ({
        activeLeadDetail:
          prev.activeLeadDetail && prev.activeLeadDetail.id === leadId
            ? { ...prev.activeLeadDetail, status: newStatus }
            : prev.activeLeadDetail,
      }));
    },
    [effectiveUser.fullName, updateState]
  );

  // Call response save handler
  const handleSaveCallResponse = useCallback(
    (callData: {
      status: any;
      outcome: any;
      durationSec: number;
      userResponse: string;
      conversationNotes?: string;
      nextFollowUp?: string;
      newLeadStatus?: any;
    }) => {
      if (!state.callingLead) return;

      const res = crmDataService.logLeadCallResponse({
        leadId: state.callingLead.id,
        employeeId: currentAgentId,
        employeeName: effectiveUser.fullName || 'CRM Executive',
        durationSec: callData.durationSec,
        status: callData.status,
        outcome: callData.outcome,
        userResponse: callData.userResponse,
        conversationNotes: callData.conversationNotes,
        nextFollowUp: callData.nextFollowUp,
        newLeadStatus: callData.newLeadStatus,
      });

      if (res.success) {
        toast.success(`Call response saved for ${state.callingLead.name}!`);
        const updated = crmDataService.getLeads().find((l) => l.id === state.callingLead?.id);
        updateState((prev) => ({
          callingLead: null,
          activeLeadDetail:
            prev.activeLeadDetail?.id === prev.callingLead?.id && updated ? updated : prev.activeLeadDetail,
        }));
      } else {
        toast.error(res.error || 'Failed to save call response.');
        updateState({ callingLead: null });
      }
    },
    [state.callingLead, currentAgentId, effectiveUser.fullName, updateState]
  );

  // Export CSV
  const handleExportCSV = useCallback(() => {
    const headers = [
      'Lead ID',
      'Name',
      'Mobile',
      'Subcaste',
      'City',
      'Profession',
      'Source',
      'Status',
      'Assigned Agent',
      'Reassignments Count',
      'SLA Target',
    ];
    const rows = filteredLeads.map((l) => [
      l.leadId,
      `"${l.name}"`,
      `"${l.mobile}"`,
      l.subcaste,
      l.city,
      `"${l.profession}"`,
      l.source,
      l.status,
      `"${l.assignedEmployeeName || 'Unassigned'}"`,
      l.assignmentHistory ? l.assignmentHistory.length : 0,
      `"${l.slaStatus}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `crm_leads_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${filteredLeads.length} leads to CSV file.`);
  }, [filteredLeads]);

  return (
    <div className="space-y-5">
      {/* 1. Simulation / Persona View Switcher Banner */}
      <SessionPersonaBanner
        effectiveUser={effectiveUser}
        effectiveRole={effectiveRole}
        simulatedUser={simulatedUser}
        activeTab={state.activeTab}
        myBucketCount={tabCounts.myBucket}
        onSwitchSimulatedEmployee={handleSwitchSimulatedEmployee}
      />

      {/* 2. Success & Employee Scoped Guidance Banners */}
      <LeadsNoticeBanners
        assignSuccessMessage={state.assignSuccessMessage}
        onDismissSuccess={handleDismissSuccessNotice}
        isSuperAdmin={isSuperAdmin}
        effectiveUserFullName={effectiveUser.fullName}
      />

      {/* 3. Page Header with Action buttons */}
      <LeadsPageHeader
        isSuperAdmin={isSuperAdmin}
        selectedCount={state.selectedLeads.length}
        hasAssignedSelected={selectedLeadsInfo.hasAssigned}
        onSelectFirst20Unassigned={handleSelectFirst20Unassigned}
        onOpenReassignBatch={handleOpenReassignBatch}
        onOpenAssignBatch={handleOpenAssignModal}
        onExportCSV={handleExportCSV}
      />

      {/* 4. Tabs Header with dynamic counts */}
      <LeadsTabsSection
        activeTab={state.activeTab}
        isSuperAdmin={isSuperAdmin}
        tabCounts={tabCounts}
        onTabChange={handleTabChange}
      />

      {/* 5. Filter Bar with Staff, Subcaste & Source dropdowns */}
      <LeadsFilterSection
        search={state.search}
        onSearchChange={handleSearchChange}
        isSuperAdmin={isSuperAdmin}
        staffFilter={state.staffFilter}
        onStaffFilterChange={handleStaffFilterChange}
        subcasteFilter={state.subcasteFilter}
        onSubcasteFilterChange={handleSubcasteFilterChange}
        sourceFilter={state.sourceFilter}
        onSourceFilterChange={handleSourceFilterChange}
        selectedCount={state.selectedLeads.length}
        onClearSelection={handleClearSelection}
        eligibleEmployees={eligibleEmployees}
      />

      {/* 6. Quick Selection & Pagination Summary Toolbar */}
      <LeadsBatchToolbar
        currentPage={state.currentPage}
        totalPages={totalPages}
        currentPageCount={paginatedLeads.length}
        onSelectAllOnCurrentPage={handleSelectAllOnCurrentPage}
        onSelectFirst20Unassigned={handleSelectFirst20Unassigned}
      />

      {/* 7. Dedicated Memoized Leads Table Section (managed via fast-deep-equal) */}
      <LeadsTableSection
        leads={paginatedLeads}
        totalRecords={filteredLeads.length}
        currentPage={state.currentPage}
        totalPages={totalPages}
        selectedLeads={state.selectedLeads}
        revealedMobiles={state.revealedMobiles}
        activeTab={state.activeTab}
        onSelectChange={handleSelectionChange}
        onPageChange={handlePageChange}
        onToggleMobileReveal={toggleMobileReveal}
        onViewLeadDetail={handleViewLeadDetail}
        onOpenReassignSingle={handleOpenReassignSingle}
        onStartCall={handleStartCall}
      />

      {/* 8. Initial Assignment Modal (Rendered only when open) */}
      {state.isAssignModalOpen && (
        <AssignLeadsModal
          isOpen={state.isAssignModalOpen}
          selectedLeads={state.selectedLeads}
          leads={state.leads}
          eligibleEmployees={eligibleEmployees}
          selectedTargetEmployeeId={state.selectedTargetEmployeeId}
          assignmentNote={state.assignmentNote}
          assignError={state.assignError}
          onClose={handleCloseAssignModal}
          onSelectTargetEmployee={(id) => updateState({ selectedTargetEmployeeId: id })}
          onChangeAssignmentNote={(note) => updateState({ assignmentNote: note })}
          onConfirmAssignment={handleConfirmAssignment}
        />
      )}

      {/* 9. Reassignment Modal with Mandatory Audit Trail Logging (Rendered only when open) */}
      {state.isReassignModalOpen && (
        <ReassignLeadModal
          isOpen={state.isReassignModalOpen}
          reassigningLead={state.reassigningLead}
          selectedLeadsCount={state.selectedLeads.length}
          eligibleEmployees={eligibleEmployees}
          selectedTargetEmployeeId={state.selectedTargetEmployeeId}
          reassignReason={state.reassignReason}
          reassignHandoverNotes={state.reassignHandoverNotes}
          assignError={state.assignError}
          effectiveUserFullName={effectiveUser.fullName}
          effectiveRole={effectiveRole}
          onClose={handleCloseReassignModal}
          onSelectTargetEmployee={(id) => updateState({ selectedTargetEmployeeId: id })}
          onChangeReason={(reason) => updateState({ reassignReason: reason })}
          onChangeHandoverNotes={(notes) => updateState({ reassignHandoverNotes: notes })}
          onConfirmReassignment={handleConfirmReassignment}
        />
      )}

      {/* 10. 360° Lead Detail Modal with Reassignment Audit Trail Log (Rendered only when active) */}
      {Boolean(state.activeLeadDetail) && (
        <LeadDetailModal
          lead={state.activeLeadDetail}
          isSuperAdmin={isSuperAdmin}
          onClose={handleCloseLeadDetail}
          onOpenReassign={handleOpenReassignSingle}
          onStartCall={handleStartCall}
          onUpdateStatus={handleUpdateLeadStatus}
        />
      )}

      {/* 11. Customer Call & Log Response Modal (Rendered only when calling) */}
      {Boolean(state.callingLead) && (
        <CallResponseModal
          lead={state.callingLead!}
          isOpen={Boolean(state.callingLead)}
          onClose={handleCloseCallModal}
          onSave={handleSaveCallResponse}
        />
      )}
    </div>
  );
});

LeadsScreen.displayName = 'LeadsScreen';
export default LeadsScreen;
