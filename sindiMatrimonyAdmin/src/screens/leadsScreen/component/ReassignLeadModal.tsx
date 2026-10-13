import React from 'react';
import { ArrowRightLeft, X, AlertCircle, User, AlertTriangle, History } from 'lucide-react';
import type { Lead } from '../../../types/crm.types';
import type { Employee } from '../../../types/employee.types';
import { CustomTextInput } from '../../../components/CustomTextInput';
import { REASSIGN_REASON_PRESETS } from './types';

interface ReassignLeadModalProps {
  isOpen: boolean;
  reassigningLead: Lead | null;
  selectedLeadsCount: number;
  eligibleEmployees: Employee[];
  selectedTargetEmployeeId: string;
  reassignReason: string;
  reassignHandoverNotes: string;
  assignError: string | null;
  effectiveUserFullName?: string;
  effectiveRole: string;
  onClose: () => void;
  onSelectTargetEmployee: (id: string) => void;
  onChangeReason: (reason: string) => void;
  onChangeHandoverNotes: (notes: string) => void;
  onConfirmReassignment: () => void;
}

export const ReassignLeadModal: React.FC<ReassignLeadModalProps> = React.memo(
  ({
    isOpen,
    reassigningLead,
    selectedLeadsCount,
    eligibleEmployees,
    selectedTargetEmployeeId,
    reassignReason,
    reassignHandoverNotes,
    assignError,
    effectiveUserFullName,
    effectiveRole,
    onClose,
    onSelectTargetEmployee,
    onChangeReason,
    onChangeHandoverNotes,
    onConfirmReassignment,
  }) => {
    if (!isOpen) return null;

    const availableEmployees = eligibleEmployees.filter(
      (emp) => emp.id !== (reassigningLead ? reassigningLead.assignedEmployeeId : '')
    );

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="px-6 py-4 border-b border-purple-100 bg-gradient-to-r from-purple-50 via-indigo-50 to-amber-50 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-purple-600" />
                Reassign Lead & Record Audit Trail
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Transfer {reassigningLead ? `lead ${reassigningLead.name}` : `${selectedLeadsCount} leads`} when an employee is unable to convince or follow up.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto space-y-4">
            {assignError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{assignError}</span>
              </div>
            )}

            {/* Current Owner Context */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 font-medium">Currently Assigned To:</span>
                <div className="font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  {reassigningLead ? reassigningLead.assignedEmployeeName : 'Selected Employees'}
                </div>
              </div>
              <div className="text-right">
                <span className="text-slate-400 font-medium">Reassigned By:</span>
                <div className="font-bold text-purple-700 mt-0.5">
                  {effectiveUserFullName || 'User'} ({effectiveRole})
                </div>
              </div>
            </div>

            {/* Select New Target Employee */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Transfer To (New Matchmaker / Senior Agent):</span>
                <span className="text-[11px] text-slate-400">Select employee to take over</span>
              </label>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {availableEmployees.map((emp) => {
                  const isSelected = selectedTargetEmployeeId === emp.id;
                  return (
                    <div
                      key={emp.id}
                      onClick={() => onSelectTargetEmployee(emp.id)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-purple-50/80 border-purple-400 ring-2 ring-purple-300'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="newTargetEmployee"
                          checked={isSelected}
                          onChange={() => onSelectTargetEmployee(emp.id)}
                          className="text-purple-600 focus:ring-purple-400 cursor-pointer"
                        />
                        <div>
                          <div className="font-bold text-slate-900 text-xs">
                            {emp.fullName} <span className="text-slate-400 font-mono font-normal">({emp.employeeId})</span>
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {emp.designation} • {emp.team}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs font-semibold text-slate-600">
                        {emp.activeLeadsCount} active leads
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reason Selector (Audit Mandatory) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                Mandatory Reassignment Reason (Recorded in Permanent Audit Log):
              </label>

              <div className="flex flex-wrap gap-1.5">
                {REASSIGN_REASON_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => onChangeReason(preset)}
                    className={`px-2.5 py-1.5 rounded-xl text-[11px] font-medium border text-left transition-colors cursor-pointer ${
                      reassignReason === preset
                        ? 'bg-purple-600 text-white border-purple-600 shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>

              <CustomTextInput
                size="sm"
                value={reassignReason}
                onChange={(e) => onChangeReason(e.target.value)}
                placeholder="Or enter custom reason for transfer..."
                clearable
                onClear={() => onChangeReason('')}
                containerClassName="mt-1"
              />
            </div>

            {/* Handover Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Handover Context & Notes for New Agent (Optional):
              </label>
              <textarea
                rows={2}
                value={reassignHandoverNotes}
                onChange={(e) => onChangeHandoverNotes(e.target.value)}
                placeholder="e.g., Previous agent spoke with father twice but candidate is undecided. Take over with senior assisted plan briefing."
                className="w-full text-xs p-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 bg-slate-50/40"
              />
            </div>

            {/* Audit Trail Guarantee Notice */}
            <div className="p-3 bg-purple-50 border border-purple-200/80 rounded-2xl flex items-start gap-2.5 text-xs text-purple-900">
              <History className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Audit Trail Guarantee:</span> This reassignment will be permanently recorded in the system with timestamp ({new Date().toLocaleTimeString()}), previous employee credentials, and your authorization ID. It will be visible in the candidate's 360° audit timeline.
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onConfirmReassignment}
              disabled={!selectedTargetEmployeeId || !reassignReason.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold hover:opacity-95 disabled:opacity-40 shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowRightLeft className="w-4 h-4" />
              Confirm Reassignment & Save Audit Log
            </button>
          </div>
        </div>
      </div>
    );
  }
);

ReassignLeadModal.displayName = 'ReassignLeadModal';
