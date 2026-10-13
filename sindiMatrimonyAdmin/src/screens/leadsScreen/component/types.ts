import type { Lead } from '../../../types/crm.types';
import type { Employee } from '../../../types/employee.types';

export const PAGE_SIZE = 20;

export const REASSIGN_REASON_PRESETS = [
  'Agent unable to convince / Customer follow-up stalled',
  'Customer requested senior matchmaker / manager intervention',
  'Regional / Subcaste network expertise required',
  'Communication gap or language preference mismatch',
  'Agent on leave / Portfolio rebalancing',
] as const;

export type LeadsTabType =
  | 'ALL'
  | 'UNASSIGNED'
  | 'MY_BUCKET'
  | 'ASSIGNED'
  | 'TRANSFERRED'
  | 'TODAY'
  | 'HIGH';

export interface TabCounts {
  all: number;
  unassigned: number;
  myBucket: number;
  assigned: number;
  transferred: number;
  today: number;
  high: number;
}

export interface SelectedLeadsInfo {
  total: number;
  alreadyAssignedCount: number;
  unassignedCount: number;
  hasAssigned: boolean;
  hasUnassigned: boolean;
}

/**
 * Consolidated single state object for the entire LeadsScreen.
 * Eliminates 20+ disconnected useState hooks and prevents cascading re-renders.
 */
export interface LeadsScreenState {
  // Synced CRM store data
  leads: Lead[];
  employees: Employee[];

  // Navigation, Tabs & Filtering
  activeTab: LeadsTabType;
  search: string;
  subcasteFilter: string;
  sourceFilter: string;
  staffFilter: string;
  currentPage: number;
  selectedLeads: string[];

  // Privacy: Masked phone reveal toggles
  revealedMobiles: Record<string, boolean>;

  // Feedback notifications
  assignSuccessMessage: string | null;

  // Assignment Modal
  isAssignModalOpen: boolean;
  selectedTargetEmployeeId: string;
  assignmentNote: string;
  assignError: string | null;

  // Reassignment Modal
  isReassignModalOpen: boolean;
  reassigningLead: Lead | null;
  reassignReason: string;
  reassignHandoverNotes: string;

  // Detail & Interactive Modals
  activeLeadDetail: Lead | null;
  callingLead: Lead | null;
}
