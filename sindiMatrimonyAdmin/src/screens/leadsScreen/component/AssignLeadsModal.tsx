import React from 'react';
import { UserCheck, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { Lead } from '../../../types/crm.types';
import type { Employee } from '../../../types/employee.types';

interface AssignLeadsModalProps {
  isOpen: boolean;
  selectedLeads: string[];
  leads: Lead[];
  eligibleEmployees: Employee[];
  selectedTargetEmployeeId: string;
  assignmentNote: string;
  assignError: string | null;
  onClose: () => void;
  onSelectTargetEmployee: (id: string) => void;
  onChangeAssignmentNote: (note: string) => void;
  onConfirmAssignment: () => void;
}

export const AssignLeadsModal: React.FC<AssignLeadsModalProps> = React.memo(
  ({
    isOpen,
    selectedLeads,
    leads,
    eligibleEmployees,
    selectedTargetEmployeeId,
    assignmentNote,
    assignError,
    onClose,
    onSelectTargetEmployee,
    onChangeAssignmentNote,
    onConfirmAssignment,
  }) => {
    if (!isOpen) return null;

    const selectedLeadObjects = leads.filter((l) => selectedLeads.includes(l.id));

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-amber-50/60 to-rose-50/60 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-[#DB2F3C]" />
                Assign Website Leads to Employee
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Assign {selectedLeads.length} leads without quantity restrictions. Leads will appear in the employee's personal bucket.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto space-y-5">
            {assignError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{assignError}</span>
              </div>
            )}

            {/* Selected Leads Pill Summary */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">
                  Selected Batch: <span className="text-[#DB2F3C]">{selectedLeads.length} Leads</span>
                </span>
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Unlimited Assignment Allowed
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                {selectedLeadObjects.map((l) => (
                  <span
                    key={l.id}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-[11px] font-medium"
                  >
                    {l.name}
                    <span className="text-[9px] text-slate-400">({l.subcaste})</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Employee Selection List */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Select Recipient Employee & Matchmaker:</span>
                <span className="text-[11px] text-emerald-600 font-semibold">No capacity restrictions apply</span>
              </label>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {eligibleEmployees.map((emp) => {
                  const isSelected = selectedTargetEmployeeId === emp.id;

                  return (
                    <div
                      key={emp.id}
                      onClick={() => onSelectTargetEmployee(emp.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2 ${
                        isSelected
                          ? 'bg-amber-50/70 border-amber-400 ring-2 ring-amber-300 shadow-sm'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <input
                            type="radio"
                            name="targetEmployee"
                            checked={isSelected}
                            onChange={() => onSelectTargetEmployee(emp.id)}
                            className="text-amber-500 focus:ring-amber-400 cursor-pointer"
                          />
                          <div>
                            <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                              {emp.fullName}
                              <span className="text-[10px] text-slate-400 font-mono">({emp.employeeId})</span>
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {emp.designation} • {emp.team}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-xs font-bold text-slate-800">
                            {emp.activeLeadsCount} assigned leads
                          </div>
                          <div className="text-[10px] font-semibold text-emerald-600">
                            Ready to Assign (No Limits)
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Assignment Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Instruction / Priority Notes for Employee (Optional):
              </label>
              <textarea
                rows={2}
                value={assignmentNote}
                onChange={(e) => onChangeAssignmentNote(e.target.value)}
                placeholder="e.g., High priority Sindhi Amil leads from website. Call today within SLA target."
                className="w-full text-xs p-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-400 bg-slate-50/40"
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onConfirmAssignment}
              disabled={!selectedTargetEmployeeId}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#DB2F3C] to-amber-600 text-white text-xs font-bold hover:opacity-95 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              Confirm & Assign {selectedLeads.length} Leads
            </button>
          </div>
        </div>
      </div>
    );
  }
);

AssignLeadsModal.displayName = 'AssignLeadsModal';
