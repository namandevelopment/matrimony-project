import React from 'react';
import {
  X,
  ArrowRightLeft,
  Lock,
  History,
  MessageSquare,
  PhoneCall,
  Phone,
  Clock,
} from 'lucide-react';
import { StatusBadge } from '../../../components/StatusBadge';
import type { Lead, LeadStatus, LeadAssignmentRecord } from '../../../types/crm.types';

interface LeadDetailModalProps {
  lead: Lead | null;
  isSuperAdmin: boolean;
  onClose: () => void;
  onOpenReassign: (lead: Lead) => void;
  onStartCall: (lead: Lead) => void;
  onUpdateStatus: (leadId: string, status: LeadStatus) => void;
}

const LEAD_STATUS_OPTIONS: LeadStatus[] = [
  'NEW',
  'ASSIGNED',
  'CONTACTED',
  'INTERESTED',
  'CONVERTED',
  'LOST',
];

export const LeadDetailModal: React.FC<LeadDetailModalProps> = React.memo(
  ({
    lead,
    isSuperAdmin,
    onClose,
    onOpenReassign,
    onStartCall,
    onUpdateStatus,
  }) => {
    if (!lead) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-amber-50/60 to-rose-50/60 flex items-center justify-between">
            <div>
              <div className="text-base font-bold text-slate-900 flex items-center gap-2">
                {lead.name}
                <StatusBadge status={lead.status} />
              </div>
              <div className="text-xs text-slate-500 font-mono mt-0.5">{lead.leadId}</div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 overflow-y-auto space-y-4 text-xs">
            {/* Candidate Info Grid */}
            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div>
                <span className="text-slate-400 font-medium">Mobile Phone:</span>
                <div className="font-mono font-bold text-slate-800 text-sm mt-0.5">{lead.mobile}</div>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Sindhi Subcaste:</span>
                <div className="font-bold text-slate-800 text-sm mt-0.5">{lead.subcaste}</div>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Age & Gender:</span>
                <div className="font-semibold text-slate-800 mt-0.5">
                  {lead.age} yrs • {lead.gender}
                </div>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Location:</span>
                <div className="font-semibold text-slate-800 mt-0.5">{lead.city}</div>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Profession:</span>
                <div className="font-semibold text-slate-800 mt-0.5">{lead.profession}</div>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Source:</span>
                <div className="font-semibold text-slate-800 mt-0.5">{lead.source}</div>
              </div>
            </div>

            {/* Assignment & Bucket Status with Reassign Quick Action */}
            <div className="border border-slate-200 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Bucket Assignment Status:</span>
                {lead.assignedEmployeeId && (
                  <button
                    type="button"
                    onClick={() => onOpenReassign(lead)}
                    className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 font-bold border border-amber-300 text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <ArrowRightLeft className="w-3 h-3 text-amber-600" /> Reassign / Transfer
                  </button>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">
                    {lead.assignedEmployeeName || 'Unassigned Queue'}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {lead.assignedTeam || 'Waiting for assignment'}
                  </div>
                </div>
                {lead.assignedEmployeeId ? (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 text-[11px] flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Exclusive
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200 text-[11px]">
                    Open for Assignment
                  </span>
                )}
              </div>
            </div>

            {/* Permanent Reassignment Audit Trail Log */}
            {lead.assignmentHistory && lead.assignmentHistory.length > 0 && (
              <div className="border border-purple-200 bg-purple-50/40 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-900 flex items-center gap-1.5 text-xs">
                    <History className="w-4 h-4 text-purple-600" />
                    Reassignment Audit Log ({lead.assignmentHistory.length} Transfers Recorded)
                  </span>
                  <span className="text-[10px] text-purple-600 font-semibold">Audit Compliant</span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {lead.assignmentHistory.map((rec: LeadAssignmentRecord) => (
                    <div key={rec.id} className="p-3 bg-white border border-purple-100 rounded-xl space-y-1.5 shadow-2xs">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-800 flex items-center gap-1.5">
                          <span className="text-rose-600">{rec.previousEmployeeName}</span>
                          <ArrowRightLeft className="w-3 h-3 text-purple-500" />
                          <span className="text-emerald-700">{rec.newEmployeeName}</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{rec.reassignedAt}</span>
                      </div>
                      <div className="text-[11px] text-slate-700">
                        <span className="font-semibold text-slate-500">Reason:</span> {rec.reason}
                      </div>
                      {rec.handoverNotes && (
                        <div className="text-[10px] text-slate-500 bg-slate-50 p-1.5 rounded-lg border border-slate-100 flex items-start gap-1">
                          <MessageSquare className="w-3 h-3 text-slate-400 mt-0.5 shrink-0" />
                          <span>Handover Notes: {rec.handoverNotes}</span>
                        </div>
                      )}
                      <div className="text-[9px] text-slate-400 font-mono text-right">
                        Authorized By: {rec.reassignedBy}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Customer Call Responses & Conversation History */}
            <div className="border border-emerald-200 bg-emerald-50/40 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-950 flex items-center gap-1.5 text-xs">
                  <PhoneCall className="w-4 h-4 text-emerald-600" />
                  Customer Call Responses ({lead.callResponses?.length || 0} Recorded)
                </span>
                <button
                  type="button"
                  onClick={() => onStartCall(lead)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] flex items-center gap-1 transition shadow-2xs cursor-pointer"
                >
                  <Phone className="w-3 h-3" />
                  + Log Call Response
                </button>
              </div>

              {lead.callResponses && lead.callResponses.length > 0 ? (
                <div className="space-y-2.5 max-h-56 overflow-y-auto">
                  {lead.callResponses.map((resp) => (
                    <div
                      key={resp.id}
                      className="p-3 bg-white border border-emerald-100 rounded-xl space-y-2 shadow-2xs"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900">
                            {resp.callerEmployeeName}
                          </span>
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            {resp.outcome}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {resp.calledAt} • {Math.floor(resp.callDurationSec / 60)}m {resp.callDurationSec % 60}s
                        </span>
                      </div>

                      {/* Customer Response Highlight Box */}
                      <div className="p-2.5 bg-gradient-to-r from-amber-50/90 to-emerald-50/60 rounded-lg border border-amber-200/80 text-[11px] text-slate-800 space-y-0.5">
                        <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block">
                          Customer Response Received:
                        </span>
                        <p className="font-semibold text-slate-900 italic leading-relaxed">
                          "{resp.userResponse}"
                        </p>
                      </div>

                      {resp.conversationNotes && (
                        <div className="text-[10px] text-slate-500">
                          <span className="font-semibold text-slate-700">Internal Note:</span> {resp.conversationNotes}
                        </div>
                      )}

                      {resp.nextFollowUp && (
                        <div className="text-[10px] text-emerald-700 font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Next Follow-up Scheduled: <strong>{resp.nextFollowUp}</strong></span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-white/80 rounded-xl border border-dashed border-emerald-200 text-center space-y-1.5">
                  <p className="text-slate-500 text-[11px]">
                    No phone calls or customer responses logged yet for {lead.name}.
                  </p>
                  <button
                    type="button"
                    onClick={() => onStartCall(lead)}
                    className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px] hover:bg-emerald-100 cursor-pointer"
                  >
                    Call Customer & Log First Response
                  </button>
                </div>
              )}
            </div>

            {/* Status Updater */}
            <div className="border border-slate-200 rounded-2xl p-4 space-y-2">
              <span className="text-slate-400 font-medium">Update Lead Disposition:</span>
              <div className="flex flex-wrap gap-1.5">
                {LEAD_STATUS_OPTIONS.map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => onUpdateStatus(lead.id, st)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                      lead.status === st
                        ? 'bg-[#DB2F3C] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            {lead.notes && (
              <div className="bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200 text-amber-900">
                <span className="font-bold block mb-1">Inquiry History & Notes:</span>
                <p className="text-[11px] leading-relaxed whitespace-pre-wrap">{lead.notes}</p>
              </div>
            )}
          </div>

          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            {lead.assignedEmployeeId && isSuperAdmin ? (
              <button
                type="button"
                onClick={() => onOpenReassign(lead)}
                className="px-3.5 py-2 rounded-xl bg-purple-50 text-purple-800 hover:bg-purple-100 font-bold border border-purple-200 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowRightLeft className="w-3.5 h-3.5 text-purple-600" />
                Reassign to Another Employee
              </button>
            ) : <div />}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }
);

LeadDetailModal.displayName = 'LeadDetailModal';
