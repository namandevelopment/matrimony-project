import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PhoneCall,
  CheckCircle2,
  Search,
  Volume2,
  Lock,
  MessageSquare,
  User,
} from 'lucide-react';
import { crmDataService } from '../../services/crmDataService';
import type { CallLog } from '../../types/crm.types';
import type { Employee } from '../../types/employee.types';
import { PageHeader } from '../../components/PageHeader';
import { CustomTextInput } from '../../components/CustomTextInput';
import { CustomDropDown } from '../../components/CustomDropDown';
import { getStoredUser, getSimulatedUser, getActiveRole } from '../../storage';
import { useInputs } from '../../customHooks/useInputs';

export interface CallsFilterValues {
  filterStatus: string;
  staffFilter: string;
  search: string;
}

export const CallsScreen: React.FC = () => {
  const navigate = useNavigate();

  // Role detection
  const storedUser = getStoredUser() || { fullName: 'Rajesh Mulchandani', role: 'SUPER_ADMIN', id: 'emp_001' };
  const simulatedUser = getSimulatedUser();
  const activeRoleOverride = getActiveRole();
  const effectiveUser = simulatedUser || storedUser;
  const effectiveRole = activeRoleOverride || effectiveUser.role || 'SUPER_ADMIN';
  const isSuperAdmin = effectiveRole === 'SUPER_ADMIN';

  const [calls, setCalls] = useState<CallLog[]>([]);
  const [employees, setEmployees] = useState<Employee[]>(() => crmDataService.getEmployees());
  const { values: filters, setFieldValue } = useInputs<CallsFilterValues>({
    filterStatus: 'ALL',
    staffFilter: 'ALL',
    search: '',
  });
  const [selectedCall, setSelectedCall] = useState<CallLog | null>(null);

  const currentAgentId = useMemo(() => {
    const found = employees.find((e) => e.id === effectiveUser.id || e.employeeId === effectiveUser.employeeId || e.fullName === effectiveUser.fullName);
    return found ? found.id : effectiveUser.id || 'emp_003';
  }, [employees, effectiveUser]);

  const refresh = () => {
    setCalls(crmDataService.getCallLogs());
    setEmployees(crmDataService.getEmployees());
  };

  useEffect(() => {
    refresh();
    return crmDataService.subscribe(refresh);
  }, []);

  const filteredCalls = calls.filter((c) => {
    // If employee (non-SuperAdmin), only show calls handled by them
    if (!isSuperAdmin) {
      const isMine = c.assignedEmployeeId === currentAgentId || c.assignedEmployeeId === effectiveUser.id;
      if (!isMine) return false;
    } else if (filters.staffFilter !== 'ALL') {
      if (c.assignedEmployeeId !== filters.staffFilter) return false;
    }

    if (filters.filterStatus === 'CONNECTED' && c.status !== 'CONNECTED') return false;
    if (filters.filterStatus === 'VERIFIED' && c.verificationStatus !== 'VERIFIED') return false;
    if (filters.filterStatus === 'MANUAL' && c.verificationStatus !== 'MANUAL_ENTRY') return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      return (
        c.clientName.toLowerCase().includes(q) ||
        c.callLogId.toLowerCase().includes(q) ||
        c.assignedEmployeeName.toLowerCase().includes(q) ||
        c.purpose.toLowerCase().includes(q) ||
        (c.clientResponse && c.clientResponse.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const totalConnected = calls.filter((c) => c.status === 'CONNECTED').length;
  const verifiedTelephony = calls.filter((c) => c.verificationStatus === 'VERIFIED').length;
  const totalDurationMin = Math.round(calls.reduce((acc, c) => acc + c.durationSec, 0) / 60);

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Call & Telephony Logs Management"
        description="Comprehensive audit of all client interactions. Distinguishes Exotel verified cloud telephony events from staff manual entries."
        badge={
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
            <PhoneCall className="w-3 h-3 text-blue-600" />
            VoIP & Interaction Audit
          </span>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Total Calls Logged</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{calls.length}</div>
          <span className="text-[11px] text-slate-400">Total voice touches</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Connected Calls</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">{totalConnected}</div>
          <span className="text-[11px] text-emerald-600 font-semibold">
            {calls.length > 0 ? Math.round((totalConnected / calls.length) * 100) : 0}% Connection Rate
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Exotel Telephony Verified</span>
          <div className="text-2xl font-black text-indigo-700 mt-1">{verifiedTelephony}</div>
          <span className="text-[11px] text-slate-400">Audio recordings available</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Total Talk Time</span>
          <div className="text-2xl font-black text-amber-700 mt-1">{totalDurationMin} mins</div>
          <span className="text-[11px] text-slate-400">High touch assisted service</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFieldValue('filterStatus', 'ALL')}
            className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
              filters.filterStatus === 'ALL' ? 'bg-[#88131B] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Calls ({calls.length})
          </button>
          <button
            onClick={() => setFieldValue('filterStatus', 'CONNECTED')}
            className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
              filters.filterStatus === 'CONNECTED' ? 'bg-emerald-700 text-white' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}
          >
            Connected ({totalConnected})
          </button>
          <button
            onClick={() => setFieldValue('filterStatus', 'VERIFIED')}
            className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
              filters.filterStatus === 'VERIFIED' ? 'bg-indigo-700 text-white' : 'bg-indigo-50 text-indigo-800 border border-indigo-200'
            }`}
          >
            Exotel Verified ({verifiedTelephony})
          </button>
          <button
            onClick={() => setFieldValue('filterStatus', 'MANUAL')}
            className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
              filters.filterStatus === 'MANUAL' ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            Manual Entries
          </button>

          {/* Super Admin Staff Filter */}
          {isSuperAdmin ? (
            <div className="w-48 sm:w-60">
              <CustomDropDown
                size="sm"
                icon={<User className="w-3.5 h-3.5 text-slate-400" />}
                value={filters.staffFilter}
                onChange={(val) => setFieldValue('staffFilter', String(val))}
                options={[
                  { label: `All Staff Members (${employees.length})`, value: 'ALL' },
                  ...employees.map((emp) => ({
                    label: `${emp.fullName} (${emp.role})`,
                    value: emp.id,
                  })),
                ]}
              />
            </div>
          ) : (
            <div className="px-2.5 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-800 text-[11px] font-semibold flex items-center gap-1">
              <Lock className="w-3 h-3 text-purple-600" />
              <span>Showing Only My Logged Calls ({effectiveUser.fullName})</span>
            </div>
          )}
        </div>

        <div className="w-64">
          <CustomTextInput
            size="sm"
            leftIcon={<Search className="w-3.5 h-3.5 text-slate-400" />}
            placeholder="Search by Client, ID, Response..."
            value={filters.search}
            onChange={(e) => setFieldValue('search', e.target.value)}
            clearable
            onClear={() => setFieldValue('search', '')}
          />
        </div>
      </div>

      {/* Calls Table */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50/50">
                <th className="py-3 px-3">Call Log ID</th>
                <th className="py-3 px-3">Date & Time</th>
                <th className="py-3 px-3">Client Name & ID</th>
                <th className="py-3 px-3">Dir / Duration</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Outcome</th>
                <th className="py-3 px-3">Customer Response</th>
                <th className="py-3 px-3">Handled By</th>
                <th className="py-3 px-3">Source & Verification</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCalls.map((call) => (
                <tr
                  key={call.id}
                  onClick={() => setSelectedCall(call)}
                  className="hover:bg-slate-50/80 transition cursor-pointer"
                >
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">{call.callLogId}</td>
                  <td className="py-3 px-3 text-slate-600">
                    <div>{call.date}</div>
                    <div className="text-[10px] text-slate-400">{call.startTime}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">{call.clientName}</div>
                    <div className="text-[10px] font-mono text-slate-400">{call.clientPhone}</div>
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
                  <td className="py-3 px-3 max-w-xs">
                    {call.clientResponse ? (
                      <div className="bg-amber-50/90 border border-amber-200 rounded-lg p-1.5 text-[11px] text-amber-950">
                        <span className="font-bold text-amber-800 block text-[9px] uppercase tracking-wider">User Response</span>
                        <p className="line-clamp-2 italic font-serif">"{call.clientResponse}"</p>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">No user quote recorded</span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-700">{call.assignedEmployeeName}</td>
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

      {/* Drawer */}
      {selectedCall && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-2xs flex justify-end animate-in fade-in">
          <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <span className="font-mono text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  {selectedCall.callLogId}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">Call Interaction Record</h3>
              </div>
              <button
                onClick={() => setSelectedCall(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Client</span>
                  <span className="font-bold text-slate-900">{selectedCall.clientName} ({selectedCall.clientId})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Phone</span>
                  <span className="font-mono text-slate-700">{selectedCall.clientPhone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Date & Time</span>
                  <span className="text-slate-800">{selectedCall.date} at {selectedCall.startTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Duration</span>
                  <span className="font-bold text-slate-900">
                    {Math.floor(selectedCall.durationSec / 60)} mins {selectedCall.durationSec % 60} secs
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Outcome</span>
                  <span className="font-bold text-emerald-700">{selectedCall.outcome}</span>
                </div>
              </div>

              {/* Handled By + Direct Chat action */}
              <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-200/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-purple-700 block">Handled By Employee</span>
                  <span className="font-bold text-slate-900 text-xs">{selectedCall.assignedEmployeeName}</span>
                </div>
                {isSuperAdmin && (
                  <button
                    onClick={() => {
                      const empId = selectedCall.assignedEmployeeId || 'emp_003';
                      setSelectedCall(null);
                      navigate(`/chat?empId=${empId}`);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-[11px] flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Chat with Employee
                  </button>
                )}
              </div>

              {/* User Response Highlight */}
              {selectedCall.clientResponse ? (
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs uppercase tracking-wide">
                    <MessageSquare className="w-3.5 h-3.5 text-amber-700" />
                    <span>Customer / User Response</span>
                  </div>
                  <div className="text-xs text-amber-950 font-serif italic bg-white/80 p-3 rounded-xl border border-amber-200 leading-relaxed shadow-2xs">
                    "{selectedCall.clientResponse}"
                  </div>
                </div>
              ) : null}

              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Call Purpose</span>
                <p className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 font-medium">
                  {selectedCall.purpose}
                </p>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Detailed Discussion Notes</span>
                <p className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 leading-relaxed">
                  {selectedCall.notes}
                </p>
              </div>

              {selectedCall.recordingUrl && (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold">
                    <Volume2 className="w-4 h-4 text-emerald-700" />
                    <span>Verified Call Recording</span>
                  </div>
                  <div className="text-[11px] text-emerald-700 font-mono">
                    Cloud audio stored with consent compliance.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CallsScreen;
