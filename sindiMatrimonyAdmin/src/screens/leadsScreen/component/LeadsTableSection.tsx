import React, { useMemo } from 'react';
import {
  Phone,
  Clock,
  MoreVertical,
  Lock,
  Eye,
  EyeOff,
  ArrowRightLeft,
  History,
} from 'lucide-react';
import fastDeepEqual from 'fast-deep-equal';
import { DataTable, type Column } from '../../../components/DataTable';
import { StatusBadge } from '../../../components/StatusBadge';
import type { Lead } from '../../../types/crm.types';
import type { LeadsTabType } from './types';
import { usePerformanceTracker } from '../../../customHooks/usePerformanceTracker';

// Static frozen source labels dictionary to prevent allocation on cell renders
const SOURCE_LABELS: Record<string, { label: string; bg: string; text: string }> = Object.freeze({
  WEBSITE_FORM: { label: 'Website Form', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  MOBILE_APP: { label: 'Mobile App', bg: 'bg-blue-50', text: 'text-blue-700' },
  AD_CAMPAIGN: { label: 'Paid Ad', bg: 'bg-purple-50', text: 'text-purple-700' },
  CALLBACK_REQ: { label: 'Callback Req', bg: 'bg-amber-50', text: 'text-amber-700' },
  ORGANIC_SEARCH: { label: 'Organic Search', bg: 'bg-cyan-50', text: 'text-cyan-700' },
});

const DEFAULT_SOURCE = Object.freeze({ label: 'Direct', bg: 'bg-slate-50', text: 'text-slate-600' });

// ==========================================
// MEMOIZED ATOMIC CELL COMPONENTS
// Ensures fast sub-16ms VDOM reconciliation
// ==========================================

interface LeadCandidateCellProps {
  lead: Lead;
  onViewLeadDetail: (lead: Lead) => void;
}

const LeadCandidateCell = React.memo<LeadCandidateCellProps>(({ lead, onViewLeadDetail }) => {
  return (
    <div
      className="cursor-pointer group flex flex-col gap-1 min-w-[210px]"
      onClick={() => onViewLeadDetail(lead)}
      title="Click to view candidate 360° details & audit trail"
    >
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
          {lead.name}
        </span>
        <span className="text-[11px] text-slate-400 font-normal shrink-0">
          ({lead.age} yrs, {lead.gender === 'FEMALE' ? 'F' : 'M'})
        </span>
        {lead.assignmentHistory && lead.assignmentHistory.length > 0 && (
          <span
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-purple-50 text-purple-700 border border-purple-200 shrink-0 shadow-2xs"
            title={`Lead reassigned ${lead.assignmentHistory.length} time(s). Click to view audit log.`}
          >
            <History className="w-2.5 h-2.5" /> Reassigned ({lead.assignmentHistory.length})
          </span>
        )}
      </div>
      <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
        <span className="text-slate-600 font-medium">{lead.leadId}</span>
        <span className="text-slate-300">•</span>
        <span className="text-slate-500">{lead.city}</span>
      </div>
    </div>
  );
}, (prev, next) => {
  return (
    prev.lead.id === next.lead.id &&
    prev.lead.name === next.lead.name &&
    prev.lead.age === next.lead.age &&
    prev.lead.gender === next.lead.gender &&
    prev.lead.city === next.lead.city &&
    prev.lead.assignmentHistory?.length === next.lead.assignmentHistory?.length
  );
});

interface LeadMobileCellProps {
  leadId: string;
  mobile: string;
  isRevealed: boolean;
  onToggleMobileReveal: (leadId: string) => void;
}

const LeadMobileCell = React.memo<LeadMobileCellProps>(({
  leadId,
  mobile,
  isRevealed,
  onToggleMobileReveal,
}) => {
  const displayMobile = isRevealed
    ? mobile
    : mobile.replace(/(\+91\s\d{2})\d{4}(\d{4})/, '$1****$2');

  return (
    <div className="flex items-center gap-2 whitespace-nowrap min-w-[155px]">
      <span className="font-mono font-semibold text-slate-700 text-xs tracking-tight">
        {displayMobile}
      </span>
      <button
        type="button"
        onClick={() => onToggleMobileReveal(leadId)}
        className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer shrink-0"
        title={isRevealed ? 'Hide number' : 'Click to unmask with security log'}
      >
        {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-amber-500" />}
      </button>
    </div>
  );
}, (prev, next) => {
  return (
    prev.leadId === next.leadId &&
    prev.mobile === next.mobile &&
    prev.isRevealed === next.isRevealed
  );
});

interface LeadSubcasteCellProps {
  subcaste: string;
  profession?: string;
}

const LeadSubcasteCell = React.memo<LeadSubcasteCellProps>(({ subcaste, profession }) => {
  return (
    <div className="flex flex-col min-w-[125px] whitespace-nowrap">
      <span className="font-semibold text-slate-800 text-xs">{subcaste}</span>
      <div className="text-[10px] text-slate-400 truncate max-w-[130px] font-normal" title={profession}>
        {profession || 'Not Specified'}
      </div>
    </div>
  );
});

interface LeadSourceCellProps {
  source: string;
}

const LeadSourceCell = React.memo<LeadSourceCellProps>(({ source }) => {
  const s = SOURCE_LABELS[source] || DEFAULT_SOURCE;
  return (
    <div className="whitespace-nowrap min-w-[110px] text-center">
      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${s.bg} ${s.text} border border-slate-200/50 shadow-2xs`}>
        {s.label}
      </span>
    </div>
  );
});

interface LeadOwnerCellProps {
  status: string;
  assignedEmployeeId?: string;
  assignedEmployeeName?: string;
  assignedTeam?: string;
}

const LeadOwnerCell = React.memo<LeadOwnerCellProps>(({
  status,
  assignedEmployeeId,
  assignedEmployeeName,
  assignedTeam,
}) => {
  const isAssigned = status !== 'NEW' && assignedEmployeeId;
  return isAssigned ? (
    <div className="flex items-center gap-2 min-w-[170px]">
      <div className="w-6 h-6 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 shadow-2xs" title="Assigned exclusively to this employee">
        <Lock className="w-3 h-3 text-emerald-600" />
      </div>
      <div className="min-w-0">
        <div className="font-semibold text-slate-800 text-xs truncate">
          {assignedEmployeeName}
        </div>
        <div className="text-[10px] text-slate-400 font-mono truncate">
          {assignedTeam || 'Assigned'}
        </div>
      </div>
    </div>
  ) : (
    <div className="flex items-center gap-2 text-amber-600 min-w-[170px]">
      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0"></span>
      <span className="text-xs font-semibold whitespace-nowrap">Unassigned Queue</span>
    </div>
  );
});

interface LeadFollowUpCellProps {
  nextFollowUp?: string;
  slaStatus?: string;
}

const LeadFollowUpCell = React.memo<LeadFollowUpCellProps>(({ nextFollowUp, slaStatus }) => {
  return (
    <div className="flex items-center gap-1.5 text-slate-700 font-medium whitespace-nowrap min-w-[130px]">
      <Clock className={`w-3.5 h-3.5 shrink-0 ${slaStatus === 'URGENT' ? 'text-rose-500 animate-bounce' : 'text-amber-500'}`} />
      <span className="text-xs">{nextFollowUp || 'Pending'}</span>
    </div>
  );
});

interface LeadResponseCellProps {
  latestResponse?: {
    outcome: string;
    calledAt?: string;
    userResponse: string;
  };
}

const LeadResponseCell = React.memo<LeadResponseCellProps>(({ latestResponse }) => {
  if (!latestResponse) {
    return (
      <div className="text-[11px] text-slate-400 italic min-w-[210px]">
        No calls logged yet
      </div>
    );
  }
  return (
    <div className="min-w-[210px] max-w-[260px] space-y-1">
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100/80 text-amber-900 border border-amber-200 shrink-0">
          {latestResponse.outcome}
        </span>
        {latestResponse.calledAt && (
          <span className="text-[9px] text-slate-400 font-mono shrink-0">
            {latestResponse.calledAt.split(' ').slice(1).join(' ')}
          </span>
        )}
      </div>
      <p className="text-[11px] font-medium text-slate-700 truncate italic" title={latestResponse.userResponse}>
        "{latestResponse.userResponse}"
      </p>
    </div>
  );
});

interface LeadActionsCellProps {
  lead: Lead;
  onViewLeadDetail: (lead: Lead) => void;
  onOpenReassignSingle: (lead: Lead) => void;
  onStartCall: (lead: Lead) => void;
}

const LeadActionsCell = React.memo<LeadActionsCellProps>(({
  lead,
  onViewLeadDetail,
  onOpenReassignSingle,
  onStartCall,
}) => {
  return (
    <div className="flex items-center justify-end gap-1.5 whitespace-nowrap min-w-[130px]">
      <button
        type="button"
        onClick={() => onViewLeadDetail(lead)}
        title="View 360° Lead & Reassignment History"
        className="p-1.5 rounded-lg bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200 cursor-pointer shadow-2xs"
      >
        <Eye className="w-3.5 h-3.5" />
      </button>

      {lead.assignedEmployeeId && (
        <button
          type="button"
          onClick={() => onOpenReassignSingle(lead)}
          title="Reassign to another employee with audit record"
          className="p-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors border border-purple-200 flex items-center gap-1 cursor-pointer shadow-2xs"
        >
          <ArrowRightLeft className="w-3.5 h-3.5" />
        </button>
      )}

      <button
        type="button"
        title="Call Customer & Log User Response"
        className="px-2 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-2xs flex items-center gap-1 cursor-pointer"
        onClick={() => onStartCall(lead)}
      >
        <Phone className="w-3.5 h-3.5" />
        <span className="text-[10px] font-bold">Call</span>
      </button>

      <button
        type="button"
        title="More Options"
        onClick={() => onViewLeadDetail(lead)}
        className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
      >
        <MoreVertical className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}, (prev, next) => {
  return (
    prev.lead.id === next.lead.id &&
    prev.lead.assignedEmployeeId === next.lead.assignedEmployeeId
  );
});

// ==========================================
// LEADS TABLE SECTION COMPONENT
// ==========================================

export interface LeadsTableSectionProps {
  leads: Lead[];
  totalRecords: number;
  currentPage: number;
  totalPages: number;
  selectedLeads: string[];
  revealedMobiles: Record<string, boolean>;
  activeTab: LeadsTabType;
  onSelectChange: (selectedIds: string[]) => void;
  onPageChange: (page: number) => void;
  onToggleMobileReveal: (leadId: string) => void;
  onViewLeadDetail: (lead: Lead) => void;
  onOpenReassignSingle: (lead: Lead) => void;
  onStartCall: (lead: Lead) => void;
}

const LeadsTableSectionComponent: React.FC<LeadsTableSectionProps> = ({
  leads,
  totalRecords,
  currentPage,
  totalPages,
  selectedLeads,
  revealedMobiles,
  activeTab,
  onSelectChange,
  onPageChange,
  onToggleMobileReveal,
  onViewLeadDetail,
  onOpenReassignSingle,
  onStartCall,
}) => {
  usePerformanceTracker('LeadsTableSection', {
    recordCount: leads.length,
    page: currentPage,
    selectedCount: selectedLeads.length,
  });

  // Memoized columns definition with minimal dependency graph
  const columns = useMemo<Column<Lead>[]>(() => {
    return [
      {
        key: 'lead',
        header: 'Lead ID & Candidate',
        className: 'min-w-[210px]',
        render: (lead) => (
          <LeadCandidateCell lead={lead} onViewLeadDetail={onViewLeadDetail} />
        ),
      },
      {
        key: 'mobile',
        header: 'Mobile (Masked / Reveal)',
        className: 'min-w-[155px] whitespace-nowrap',
        render: (lead) => (
          <LeadMobileCell
            leadId={lead.id}
            mobile={lead.mobile}
            isRevealed={Boolean(revealedMobiles[lead.id])}
            onToggleMobileReveal={onToggleMobileReveal}
          />
        ),
      },
      {
        key: 'subcaste',
        header: 'Sindhi Subcaste',
        className: 'min-w-[130px] whitespace-nowrap',
        render: (lead) => (
          <LeadSubcasteCell subcaste={lead.subcaste} profession={lead.profession} />
        ),
      },
      {
        key: 'source',
        header: 'Lead Source',
        align: 'center',
        className: 'min-w-[120px] whitespace-nowrap',
        render: (lead) => <LeadSourceCell source={lead.source} />,
      },
      {
        key: 'status',
        header: 'Status',
        align: 'center',
        className: 'min-w-[110px] whitespace-nowrap',
        render: (lead) => <StatusBadge status={lead.status} />,
      },
      {
        key: 'owner',
        header: 'Assigned Agent & Reassign Audit',
        className: 'min-w-[170px]',
        render: (lead) => (
          <LeadOwnerCell
            status={lead.status}
            assignedEmployeeId={lead.assignedEmployeeId}
            assignedEmployeeName={lead.assignedEmployeeName}
            assignedTeam={lead.assignedTeam}
          />
        ),
      },
      {
        key: 'nextFollowUp',
        header: 'Next SLA & Follow-up',
        className: 'min-w-[135px] whitespace-nowrap',
        render: (lead) => (
          <LeadFollowUpCell nextFollowUp={lead.nextFollowUp} slaStatus={lead.slaStatus} />
        ),
      },
      {
        key: 'latestResponse',
        header: 'Latest User Response',
        className: 'min-w-[210px]',
        render: (lead) => {
          const latest = lead.callResponses && lead.callResponses[0];
          return <LeadResponseCell latestResponse={latest} />;
        },
      },
      {
        key: 'actions',
        header: 'Actions',
        align: 'right',
        className: 'min-w-[130px] whitespace-nowrap',
        render: (lead) => (
          <LeadActionsCell
            lead={lead}
            onViewLeadDetail={onViewLeadDetail}
            onOpenReassignSingle={onOpenReassignSingle}
            onStartCall={onStartCall}
          />
        ),
      },
    ];
  }, [
    revealedMobiles,
    onToggleMobileReveal,
    onViewLeadDetail,
    onOpenReassignSingle,
    onStartCall,
  ]);

  // Contextual empty state message
  const emptyMessage = useMemo(() => {
    switch (activeTab) {
      case 'MY_BUCKET':
        return 'No leads currently in your personal bucket.';
      case 'TRANSFERRED':
        return 'No reassigned leads found.';
      case 'UNASSIGNED':
        return 'No unassigned leads in queue. All leads currently allocated.';
      default:
        return 'No leads found matching your criteria.';
    }
  }, [activeTab]);

  return (
    <DataTable
      columns={columns}
      data={leads}
      minWidth="min-w-[1260px]"
      selectedIds={selectedLeads}
      onSelectChange={onSelectChange}
      page={currentPage}
      totalPages={totalPages}
      totalRecords={totalRecords}
      onPageChange={onPageChange}
      emptyMessage={emptyMessage}
    />
  );
};

// Custom deep comparison memoizer powered by fast-deep-equal
export const LeadsTableSection = React.memo(
  LeadsTableSectionComponent,
  (prevProps, nextProps) => {
    // 1. Primitive O(1) checks
    if (prevProps.currentPage !== nextProps.currentPage) return false;
    if (prevProps.totalPages !== nextProps.totalPages) return false;
    if (prevProps.totalRecords !== nextProps.totalRecords) return false;
    if (prevProps.activeTab !== nextProps.activeTab) return false;

    // 2. Selected IDs check (length + fast deep equality)
    if (prevProps.selectedLeads !== nextProps.selectedLeads) {
      if (prevProps.selectedLeads.length !== nextProps.selectedLeads.length) return false;
      if (!fastDeepEqual(prevProps.selectedLeads, nextProps.selectedLeads)) return false;
    }

    // 3. Revealed mobiles check
    if (prevProps.revealedMobiles !== nextProps.revealedMobiles) {
      if (!fastDeepEqual(prevProps.revealedMobiles, nextProps.revealedMobiles)) return false;
    }

    // 4. Leads data check (length + fast deep equality)
    if (prevProps.leads !== nextProps.leads) {
      if (prevProps.leads.length !== nextProps.leads.length) return false;
      if (!fastDeepEqual(prevProps.leads, nextProps.leads)) return false;
    }

    // 5. Action callbacks
    if (prevProps.onSelectChange !== nextProps.onSelectChange) return false;
    if (prevProps.onPageChange !== nextProps.onPageChange) return false;
    if (prevProps.onToggleMobileReveal !== nextProps.onToggleMobileReveal) return false;
    if (prevProps.onViewLeadDetail !== nextProps.onViewLeadDetail) return false;
    if (prevProps.onOpenReassignSingle !== nextProps.onOpenReassignSingle) return false;
    if (prevProps.onStartCall !== nextProps.onStartCall) return false;

    return true;
  }
);
