import React, { useState, useMemo, useCallback } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  UserX, 
  Clock, 
  Search, 
  PhoneCall, 
  MessageSquare, 
  Lock, 
  AlertOctagon 
} from 'lucide-react';
import { crmDataService } from '../../services/crmDataService';
import type { AbuseReport, BlacklistedIdentity, SafetyActionType, AbuseReportReason } from '../../types/crm.types';
import { toast } from '../../toastMessage/toast';
import { memoWithDeepEqual } from '../../utils/memoUtils';
import { CustomTextInput } from '../../components/CustomTextInput';
import { CustomDropDown } from '../../components/CustomDropDown';
import { useInputs } from '../../customHooks/useInputs';

export interface SafetyFilterValues {
  searchQuery: string;
  reasonFilter: 'ALL' | AbuseReportReason;
  statusFilter: 'ALL' | 'OPEN' | 'WARNED' | 'SHADOW_FROZEN' | 'BLACKLISTED';
}

export interface SafetyActionFormValues {
  reasonNotes: string;
}

export const SafetyScreen: React.FC = memoWithDeepEqual(() => {
  const [reports, setReports] = useState<AbuseReport[]>(() => crmDataService.getAbuseReports());
  const [blacklists, setBlacklists] = useState<BlacklistedIdentity[]>(() => crmDataService.getBlacklistedIdentities());
  
  const [activeTab, setActiveTab] = useState<'REPORTS' | 'BLACKLIST'>('REPORTS');

  const {
    values: filters,
    setFieldValue: setFilterField,
  } = useInputs<SafetyFilterValues>({
    searchQuery: '',
    reasonFilter: 'ALL',
    statusFilter: 'ALL',
  });

  const {
    values: actionForm,
    setFieldValue: setActionFormField,
    setValues: setActionFormValues,
    reset: resetActionForm,
  } = useInputs<SafetyActionFormValues>({
    reasonNotes: '',
  });

  // Action Confirmation Modal
  const [actionModal, setActionModal] = useState<{
    isOpen: boolean;
    report: AbuseReport | null;
    actionType: SafetyActionType | null;
  }>({
    isOpen: false,
    report: null,
    actionType: null,
  });

  const refreshData = useCallback(() => {
    setReports(crmDataService.getAbuseReports());
    setBlacklists(crmDataService.getBlacklistedIdentities());
  }, []);

  const kpis = useMemo(() => {
    return crmDataService.getSafetyKPIs();
  }, [reports, blacklists]);

  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const matchesSearch = 
        r.reportedMemberName.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        r.reportedMemberId.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        r.reporterName.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        r.evidenceText.toLowerCase().includes(filters.searchQuery.toLowerCase());
      
      const matchesReason = filters.reasonFilter === 'ALL' || r.reason === filters.reasonFilter;
      const matchesStatus = filters.statusFilter === 'ALL' || r.status === filters.statusFilter;

      return matchesSearch && matchesReason && matchesStatus;
    });
  }, [reports, filters.searchQuery, filters.reasonFilter, filters.statusFilter]);

  const filteredBlacklists = useMemo(() => {
    return blacklists.filter((b) => 
      b.fullName.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      b.phone.includes(filters.searchQuery) ||
      b.memberId.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      b.reason.toLowerCase().includes(filters.searchQuery.toLowerCase())
    );
  }, [blacklists, filters.searchQuery]);

  const handleOpenActionModal = (report: AbuseReport, actionType: SafetyActionType) => {
    let defaultReason = '';
    if (actionType === 'WARNING_NUDGE') defaultReason = 'First strike compliance warning for inappropriate behavior.';
    if (actionType === 'SHADOW_FREEZE_7D') defaultReason = '7-day silent suspension pending family verification audit.';
    if (actionType === 'PERMANENT_BLACKLIST') defaultReason = 'Confirmed fraudulent conduct. Global blacklist on Phone, Aadhaar, and Device.';
    if (actionType === 'DISMISSED') defaultReason = 'Insufficient evidence / false alarm confirmed upon calling reporter.';

    setActionFormValues({ reasonNotes: defaultReason });
    setActionModal({
      isOpen: true,
      report,
      actionType,
    });
  };

  const handleConfirmAction = () => {
    if (!actionModal.report || !actionModal.actionType) return;

    const res = crmDataService.executeSafetyAction(
      actionModal.report.id,
      actionModal.actionType,
      'Operations Admin (Safety Desk)',
      actionForm.reasonNotes
    );

    if (res.success) {
      toast.success(res.message);
      refreshData();
      setActionModal({ isOpen: false, report: null, actionType: null });
      resetActionForm();
    } else {
      toast.error(res.message);
    }
  };

  const handleRemoveBlacklist = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to unblock ${name}? Their Phone and Device fingerprint will be reinstated.`)) {
      crmDataService.removeBlacklist(id);
      refreshData();
      toast.success(`Blacklist removed for ${name}`);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-rose-950 to-slate-900 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="p-2.5 bg-rose-500/20 border border-rose-500/30 rounded-xl">
              <ShieldAlert className="w-6 h-6 text-rose-300" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight">Trust & Safety / Abuse Moderation Desk</h1>
          </div>
          <p className="text-rose-200/80 text-sm max-w-2xl">
            Protect members against financial extortion, impersonation, and verbal harassment. Enforce 1-click warning nudges, 7-day shadow freezes, or global permanent blacklists.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-700/60 p-1.5 rounded-xl self-start md:self-auto">
          <button
            onClick={() => setActiveTab('REPORTS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'REPORTS'
                ? 'bg-rose-900 text-white shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Active Grievances ({reports.filter(r => r.status === 'OPEN').length})</span>
          </button>

          <button
            onClick={() => setActiveTab('BLACKLIST')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'BLACKLIST'
                ? 'bg-rose-900 text-white shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-rose-400" />
            <span>Blacklist Vault ({blacklists.length})</span>
          </button>
        </div>
      </div>

      {/* 2. Safety KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Open Complaints</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{kpis.openReports}</p>
            <span className="text-xs text-rose-600 font-medium mt-1 inline-block">Requires Immediate Review</span>
          </div>
          <div className="w-12 h-12 bg-rose-50 text-rose-700 rounded-xl flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-rose-200 bg-rose-50/20 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-rose-800 uppercase tracking-wider">Critical Extortion</p>
            <p className="text-2xl font-bold text-rose-900 mt-1">{kpis.criticalCount}</p>
            <span className="text-xs text-rose-700 font-semibold mt-1 inline-block">Financial Fraud Flags</span>
          </div>
          <div className="w-12 h-12 bg-rose-100 text-rose-800 rounded-xl flex items-center justify-center">
            <AlertOctagon className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Shadow Frozen</p>
            <p className="text-2xl font-bold text-purple-700 mt-1">{kpis.shadowFrozen}</p>
            <span className="text-xs text-purple-600 font-medium mt-1 inline-block">7-Day Cooling Off</span>
          </div>
          <div className="w-12 h-12 bg-purple-50 text-purple-700 rounded-xl flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Blacklist Vault</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{kpis.totalBlacklisted}</p>
            <span className="text-xs text-slate-500 font-medium mt-1 inline-block">Banned Phone & Aadhaar</span>
          </div>
          <div className="w-12 h-12 bg-slate-100 text-slate-700 rounded-xl flex items-center justify-center">
            <UserX className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3. Search & Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex-1">
          <CustomTextInput
            type="text"
            placeholder={activeTab === 'REPORTS' ? "Search reports by member name, ID, or incident..." : "Search blacklist vault by name, phone, or Aadhaar..."}
            value={filters.searchQuery}
            onChange={(e) => setFilterField('searchQuery', e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            size="sm"
          />
        </div>

        {activeTab === 'REPORTS' && (
          <div className="flex flex-wrap items-center gap-2">
            <div className="w-48">
              <CustomDropDown
                value={filters.reasonFilter}
                onChange={(val) => setFilterField('reasonFilter', val as any)}
                size="sm"
                options={[
                  { label: 'All Grievance Types', value: 'ALL' },
                  { label: 'Money Extortion / Fraud', value: 'MONEY_EXTORTION' },
                  { label: 'Fake Profile / Photo Theft', value: 'FAKE_PROFILE' },
                  { label: 'Misbehavior on Call', value: 'MISBEHAVIOR_CALL' },
                  { label: 'Already Married Claim', value: 'ALREADY_MARRIED' },
                  { label: 'Inappropriate Photos', value: 'INAPPROPRIATE_PHOTOS' },
                ]}
              />
            </div>

            <div className="w-44">
              <CustomDropDown
                value={filters.statusFilter}
                onChange={(val) => setFilterField('statusFilter', val as any)}
                size="sm"
                options={[
                  { label: 'All Statuses', value: 'ALL' },
                  { label: 'Open (Pending Triage)', value: 'OPEN' },
                  { label: 'Warned', value: 'WARNED' },
                  { label: 'Shadow Frozen (7D)', value: 'SHADOW_FROZEN' },
                  { label: 'Blacklisted', value: 'BLACKLISTED' },
                ]}
              />
            </div>
          </div>
        )}
      </div>

      {/* 4. Tab Content: Active Grievances */}
      {activeTab === 'REPORTS' && (
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className={`bg-white rounded-2xl border p-6 shadow-sm hover:shadow-md transition-all space-y-4 ${
                report.severity === 'CRITICAL' && report.status === 'OPEN'
                  ? 'border-rose-300 ring-1 ring-rose-200/50'
                  : 'border-slate-200'
              }`}
            >
              {/* Ticket Top bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                    {report.reportId}
                  </span>

                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    report.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-800' :
                    report.severity === 'HIGH' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {report.severity} Severity
                  </span>

                  <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-slate-100 text-slate-700">
                    {report.reason.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Reported on: <strong>{report.createdAt}</strong></span>
                  <span className={`ml-2 px-2.5 py-0.5 rounded-full font-bold text-xs uppercase ${
                    report.status === 'OPEN' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                    report.status === 'WARNED' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    report.status === 'SHADOW_FROZEN' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                    report.status === 'BLACKLISTED' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {report.status}
                  </span>
                </div>
              </div>

              {/* Profiles Row: Reporter vs Suspect */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                {/* Suspect Column */}
                <div className="space-y-1.5">
                  <p className="text-[11px] font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                    <UserX className="w-3.5 h-3.5 text-rose-600" />
                    Reported Suspect Profile
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0">
                      {report.reportedMemberPhoto ? (
                        <img src={report.reportedMemberPhoto} alt={report.reportedMemberName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-slate-600">
                          {report.reportedMemberName.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{report.reportedMemberName}</h4>
                      <p className="text-xs text-slate-500">
                        ID: <strong className="text-slate-700">{report.reportedMemberId}</strong> • Mobile: {report.reportedMemberPhone}
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                        Aadhaar: {report.reportedMemberAadhaarHash} • Device: {report.reportedMemberDeviceId}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Reporter Column */}
                <div className="space-y-1.5 md:border-l md:border-slate-200 md:pl-4">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Aggrieved Reporter
                  </p>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{report.reporterName}</h4>
                    <p className="text-xs text-slate-500">
                      ID: <strong className="text-slate-700">{report.reporterId}</strong> • Mobile: {report.reporterPhone || 'Verified'}
                    </p>
                    <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
                      ✓ Active Paid Membership
                    </p>
                  </div>
                </div>
              </div>

              {/* Incident Statement */}
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-700">Reporter's Verified Statement:</p>
                <p className="text-xs text-slate-700 bg-rose-50/40 p-3.5 rounded-xl border border-rose-100 leading-relaxed">
                  "{report.evidenceText}"
                </p>
              </div>

              {/* Chat & Call Log Proof Accordion */}
              {(report.chatSnippet || report.callLogSnippet) && (
                <div className="space-y-2 pt-1">
                  {report.chatSnippet && (
                    <div className="bg-slate-100/70 p-3 rounded-lg text-xs font-mono text-slate-700 flex items-start gap-2">
                      <MessageSquare className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-800">Chat Evidence Log: </span>
                        {report.chatSnippet}
                      </div>
                    </div>
                  )}

                  {report.callLogSnippet && (
                    <div className="bg-slate-100/70 p-3 rounded-lg text-xs font-mono text-slate-700 flex items-start gap-2">
                      <PhoneCall className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-800">Telephony Audit Recording: </span>
                        {report.callLogSnippet}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Admin Action History if already acted */}
              {report.adminAction && (
                <div className="bg-slate-900 text-white p-3 rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-300">
                      Admin Action Enforced: {report.adminAction.actionType.replace('_', ' ')}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Acted by {report.adminAction.actedBy} on {report.adminAction.actedAt}
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px]">{report.adminAction.reasonNotes}</p>
                </div>
              )}

              {/* 1-Click Action Buttons Bar */}
              {report.status !== 'BLACKLISTED' && (
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-slate-500 font-medium">
                    Enforce Immediate Sanction:
                  </span>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* 1. Warning Nudge */}
                    <button
                      onClick={() => handleOpenActionModal(report, 'WARNING_NUDGE')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                      <span>Warning Nudge</span>
                    </button>

                    {/* 2. 7-Day Shadow Freeze */}
                    <button
                      onClick={() => handleOpenActionModal(report, 'SHADOW_FREEZE_7D')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-purple-300 bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Clock className="w-3.5 h-3.5 text-purple-700" />
                      <span>7-Day Shadow Freeze</span>
                    </button>

                    {/* 3. Permanent Blacklist */}
                    <button
                      onClick={() => handleOpenActionModal(report, 'PERMANENT_BLACKLIST')}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-rose-900 hover:bg-rose-800 text-white text-xs font-bold transition-colors shadow cursor-pointer"
                    >
                      <Lock className="w-3.5 h-3.5 text-rose-300" />
                      <span>Permanent Blacklist</span>
                    </button>

                    {/* 4. Dismiss */}
                    <button
                      onClick={() => handleOpenActionModal(report, 'DISMISSED')}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-medium transition-colors cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {filteredReports.length === 0 && (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
              <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-800">Clean Grievance Inbox</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No open complaints match your filter. The platform safety monitoring engine is active.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 5. Tab Content: Blacklist Vault */}
      {activeTab === 'BLACKLIST' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm">Permanent Blacklist Vault</h3>
              <p className="text-xs text-slate-400">
                Blocked Phone numbers, Aadhaar hashes, and Device fingerprints are strictly rejected from registration
              </p>
            </div>
            <span className="text-xs px-3 py-1 bg-rose-900 text-rose-200 font-bold rounded-full">
              {blacklists.length} Permanently Barred
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Member / Name</th>
                  <th className="py-3 px-4">Phone Number</th>
                  <th className="py-3 px-4">Aadhaar Hash</th>
                  <th className="py-3 px-4">Device Fingerprint</th>
                  <th className="py-3 px-4">Sanction Reason</th>
                  <th className="py-3 px-4">Enforced By</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBlacklists.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {b.fullName}
                      <span className="block text-[11px] font-normal text-slate-400">{b.memberId}</span>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-rose-700">
                      {b.phone}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {b.aadhaarHash}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                      {b.deviceId}
                    </td>
                    <td className="py-3 px-4 text-slate-700 max-w-xs truncate" title={b.reason}>
                      {b.reason}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {b.blacklistedBy}
                      <span className="block text-[11px] text-slate-400">{b.blacklistedAt}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleRemoveBlacklist(b.id, b.fullName)}
                        className="text-xs px-2.5 py-1 text-slate-600 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 rounded-lg hover:bg-emerald-50 transition-colors font-medium cursor-pointer"
                        title="Unblock Identity"
                      >
                        Unblock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredBlacklists.length === 0 && (
            <div className="p-8 text-center text-slate-400 text-xs">
              No blacklisted identities match your search query.
            </div>
          )}
        </div>
      )}

      {/* 6. Action Confirmation Modal */}
      {actionModal.isOpen && actionModal.report && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  actionModal.actionType === 'PERMANENT_BLACKLIST' ? 'bg-rose-100 text-rose-800' :
                  actionModal.actionType === 'SHADOW_FREEZE_7D' ? 'bg-purple-100 text-purple-800' :
                  actionModal.actionType === 'WARNING_NUDGE' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'
                }`}>
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Confirm {actionModal.actionType?.replace('_', ' ')}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Suspect: <strong>{actionModal.report.reportedMemberName}</strong> ({actionModal.report.reportedMemberId})
                  </p>
                </div>
              </div>

              <button 
                onClick={() => {
                  setActionModal({ isOpen: false, report: null, actionType: null });
                  resetActionForm();
                }}
                className="text-slate-400 hover:text-slate-600 p-1 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Explanation box */}
            <div className={`p-3.5 rounded-xl text-xs mb-4 ${
              actionModal.actionType === 'PERMANENT_BLACKLIST'
                ? 'bg-rose-50 text-rose-950 border border-rose-200'
                : actionModal.actionType === 'SHADOW_FREEZE_7D'
                ? 'bg-purple-50 text-purple-950 border border-purple-200'
                : 'bg-amber-50 text-amber-950 border border-amber-200'
            }`}>
              {actionModal.actionType === 'PERMANENT_BLACKLIST' && (
                <div>
                  <p className="font-bold mb-1">🚫 Severe Permanent Action:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Suspends account and revokes active matchmaking immediately.</li>
                    <li>Permanently blocks Phone Number ({actionModal.report.reportedMemberPhone}).</li>
                    <li>Blacklists Aadhaar Hash & Device ID from future re-registration.</li>
                  </ul>
                </div>
              )}

              {actionModal.actionType === 'SHADOW_FREEZE_7D' && (
                <div>
                  <p className="font-bold mb-1">⏳ 7-Day Shadow Freeze:</p>
                  <p>Candidate will be silently hidden from search and match recommendations for 7 days. Incoming interests and calling will be paused.</p>
                </div>
              )}

              {actionModal.actionType === 'WARNING_NUDGE' && (
                <div>
                  <p className="font-bold mb-1">⚠️ Formal Warning:</p>
                  <p>Dispatches compliance notification to candidate's mobile and displays a cautionary notice banner in their app.</p>
                </div>
              )}
            </div>

            <div className="space-y-2 mb-4">
              <label className="block text-xs font-semibold text-slate-700">
                Official Regulatory Note & Justification:
              </label>
              <textarea
                rows={3}
                value={actionForm.reasonNotes}
                onChange={(e) => setActionFormField('reasonNotes', e.target.value)}
                className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                placeholder="Enter regulatory reasoning for audit logs..."
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setActionModal({ isOpen: false, report: null, actionType: null });
                  resetActionForm();
                }}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                className={`px-5 py-2 text-white rounded-lg text-xs font-bold shadow transition-colors cursor-pointer ${
                  actionModal.actionType === 'PERMANENT_BLACKLIST' ? 'bg-rose-900 hover:bg-rose-800' :
                  actionModal.actionType === 'SHADOW_FREEZE_7D' ? 'bg-purple-900 hover:bg-purple-800' : 'bg-amber-600 hover:bg-amber-700'
                }`}
              >
                Confirm & Enforce Action
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

SafetyScreen.displayName = 'SafetyScreen';
export default SafetyScreen;
