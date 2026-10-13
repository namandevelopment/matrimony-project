import React, { useEffect, useState } from 'react';
import {
  PhoneCall,
  Clock,
  Calendar,
  CheckCircle2,
  X,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';
import type { Lead, CallOutcome, CallStatus, LeadStatus } from '../types/crm.types';
import { useInputs } from '../customHooks/useInputs';
import { CustomTextInput } from '../components/CustomTextInput';
import { CustomDropDown } from '../components/CustomDropDown';

export interface CallResponseFormValues {
  callStatus: CallStatus;
  outcome: CallOutcome;
  durationSec: number;
  userResponse: string;
  conversationNotes: string;
  nextFollowUp: string;
  newLeadStatus: LeadStatus;
}

const INITIAL_CALL_VALUES: CallResponseFormValues = {
  callStatus: 'CONNECTED',
  outcome: 'INTERESTED',
  durationSec: 120,
  userResponse: '',
  conversationNotes: '',
  nextFollowUp: 'Tomorrow, 11:00 AM',
  newLeadStatus: 'INTERESTED',
};

interface CallResponseModalProps {
  lead: Lead;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    status: CallStatus;
    outcome: CallOutcome;
    durationSec: number;
    userResponse: string;
    conversationNotes?: string;
    nextFollowUp?: string;
    newLeadStatus?: LeadStatus;
  }) => void;
}

const OUTCOME_OPTIONS: { outcome: CallOutcome; label: string; desc: string; defaultStatus: LeadStatus; color: string }[] = [
  {
    outcome: 'INTERESTED',
    label: 'Interested in Matchmaking',
    desc: 'Customer wants to view profiles & proceed',
    defaultStatus: 'INTERESTED',
    color: 'bg-emerald-50 text-emerald-800 border-emerald-300',
  },
  {
    outcome: 'MEMBERSHIP_INQUIRY',
    label: 'Assisted Membership Inquiry',
    desc: 'Interested in paid manager plan / pricing',
    defaultStatus: 'INTERESTED',
    color: 'bg-amber-50 text-amber-800 border-amber-300',
  },
  {
    outcome: 'WANTS_MORE_PROFILES',
    label: 'Needs Specific Matches',
    desc: 'Wants specific gotra / CA / NRI profiles',
    defaultStatus: 'INTERESTED',
    color: 'bg-blue-50 text-blue-800 border-blue-300',
  },
  {
    outcome: 'REQUESTED_CALLBACK',
    label: 'Callback Requested',
    desc: 'Asked to call at another time/date',
    defaultStatus: 'CONTACTED',
    color: 'bg-sky-50 text-sky-800 border-sky-300',
  },
  {
    outcome: 'NO_RESPONSE',
    label: 'Ringing No Response (RNR)',
    desc: 'Phone rang, no one answered',
    defaultStatus: 'CONTACTED',
    color: 'bg-slate-100 text-slate-800 border-slate-300',
  },
  {
    outcome: 'NOT_INTERESTED',
    label: 'Not Interested / Match Found',
    desc: 'Already engaged or does not want service',
    defaultStatus: 'LOST',
    color: 'bg-rose-50 text-rose-800 border-rose-300',
  },
  {
    outcome: 'WRONG_NUMBER',
    label: 'Invalid / Wrong Number',
    desc: 'Person reached says wrong contact',
    defaultStatus: 'LOST',
    color: 'bg-red-50 text-red-800 border-red-300',
  },
  {
    outcome: 'OTHER',
    label: 'Other Response',
    desc: 'Special case or general discussion',
    defaultStatus: 'CONTACTED',
    color: 'bg-purple-50 text-purple-800 border-purple-300',
  },
];

const QUICK_RESPONSE_TEMPLATES = [
  'Spoke with father. Ready to review 2-3 shortlisted biodatas on WhatsApp.',
  'Spoke with candidate directly. Looking for CA/Engineer in Mumbai/Pune.',
  'Discussing membership fees with family tonight, asked to call tomorrow.',
  'Requested call back tomorrow at 11:30 AM after office hours.',
  'Interested in Gold Assisted Plan, requested 10% community discount approval.',
  'Phone kept ringing, no answer. Left follow-up message on WhatsApp.',
  'Already found match outside portal, asked to close inquiry.',
];

export const CallResponseModal: React.FC<CallResponseModalProps> = ({
  lead,
  isOpen,
  onClose,
  onSave,
}) => {
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const {
    values,
    setFieldValue,
    setValues,
    bind,
    reset,
    errors,
    touched,
    validateForm,
  } = useInputs<CallResponseFormValues>(INITIAL_CALL_VALUES, {
    validate: (vals) => {
      const errs: Partial<Record<keyof CallResponseFormValues, string>> = {};
      if (!vals.userResponse.trim()) {
        errs.userResponse = 'Please record what response came from the customer during the call.';
      }
      return errs;
    },
    validateOnChange: true,
  });

  useEffect(() => {
    if (isOpen) {
      setSubmitAttempted(false);
      reset(INITIAL_CALL_VALUES);
    }
  }, [isOpen, reset]);

  if (!isOpen) return null;

  const handleOutcomeSelect = (selectedOutcome: CallOutcome) => {
    const option = OUTCOME_OPTIONS.find((o) => o.outcome === selectedOutcome);
    setValues((prev) => ({
      ...prev,
      outcome: selectedOutcome,
      ...(option ? { newLeadStatus: option.defaultStatus } : {}),
    }));
  };

  const handleQuickTemplateClick = (templateText: string) => {
    setFieldValue('userResponse', (prev) => (prev ? `${prev} ${templateText}` : templateText));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    if (!validateForm()) {
      return;
    }

    onSave({
      status: values.callStatus,
      outcome: values.outcome,
      durationSec: values.durationSec,
      userResponse: values.userResponse.trim(),
      conversationNotes: values.conversationNotes.trim() || undefined,
      nextFollowUp: values.nextFollowUp.trim() || undefined,
      newLeadStatus: values.newLeadStatus,
    });
    onClose();
  };

  const activeError = (submitAttempted || touched.userResponse) ? errors.userResponse : undefined;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-red-900 via-[#88131B] to-red-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
              <PhoneCall className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="text-base font-extrabold flex items-center gap-2">
                <span>Call Response Log</span>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-mono font-normal">
                  {lead.leadId}
                </span>
              </div>
              <div className="text-xs text-white/80">
                Customer: <strong className="text-white">{lead.name}</strong> • {lead.mobile} ({lead.subcaste || 'Sindhi'})
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          {activeError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{activeError}</span>
            </div>
          )}

          {/* Call Connection Status */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 flex items-center justify-between">
              <span>1. Telephony Connection Status</span>
              <span className="text-[11px] text-slate-400 font-normal">Did the customer answer?</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(
                [
                  { id: 'CONNECTED', label: 'Connected', desc: 'Spoke with user' },
                  { id: 'NO_ANSWER', label: 'RNR / No Ans', desc: 'Phone rang' },
                  { id: 'BUSY', label: 'Busy', desc: 'Line engaged' },
                  { id: 'WRONG_NUMBER', label: 'Invalid / Wrong', desc: 'Incorrect #' },
                ] as const
              ).map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setFieldValue('callStatus', st.id)}
                  className={`p-2.5 rounded-xl text-center border font-bold transition-all cursor-pointer ${
                    values.callStatus === st.id
                      ? 'bg-[#88131B] text-white border-[#88131B] shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="text-xs font-extrabold">{st.label}</div>
                  <div className={`text-[10px] ${values.callStatus === st.id ? 'text-white/80' : 'text-slate-400'}`}>
                    {st.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Call Duration if connected */}
          {values.callStatus === 'CONNECTED' && (
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-700">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span className="font-bold">Call Duration:</span>
                <span className="font-mono text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {Math.floor(values.durationSec / 60)}m {values.durationSec % 60}s
                </span>
              </div>
              <div className="flex items-center gap-1">
                {[30, 60, 120, 240, 360].map((secs) => (
                  <button
                    key={secs}
                    type="button"
                    onClick={() => setFieldValue('durationSec', secs)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold border cursor-pointer ${
                      values.durationSec === secs
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {Math.floor(secs / 60)}m {secs % 60 ? `${secs % 60}s` : ''}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Outcome / Disposition Category */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 flex items-center justify-between">
              <span>2. Customer Outcome & Disposition</span>
              <span className="text-[11px] text-slate-400 font-normal">Categorize outcome</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {OUTCOME_OPTIONS.map((opt) => (
                <button
                  key={opt.outcome}
                  type="button"
                  onClick={() => handleOutcomeSelect(opt.outcome)}
                  className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                    values.outcome === opt.outcome
                      ? `${opt.color} ring-2 ring-amber-400 shadow-xs font-bold`
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold text-xs">{opt.label}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* USER RESPONSE INPUT (The core requirement) */}
          <div className="space-y-2">
            <label className="font-bold text-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-900">
                <MessageSquare className="w-4 h-4 text-[#88131B]" />
                3. What Did the Customer Respond? (User Response) *
              </span>
              <span className="text-[10px] text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded">
                Mandatory for Audit
              </span>
            </label>

            {/* Quick Templates */}
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[10px] font-semibold text-slate-400 self-center">Quick Chips:</span>
              {QUICK_RESPONSE_TEMPLATES.map((tmpl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickTemplateClick(tmpl)}
                  className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-medium transition cursor-pointer border border-slate-200"
                >
                  + {tmpl.length > 35 ? tmpl.substring(0, 35) + '...' : tmpl}
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              {...bind('userResponse')}
              placeholder="e.g. Spoke with mother (Mrs. Sunita). Looking for well-settled boy in Mumbai/Pune, CA or MBA preferred. Asked to send 3 profiles on WhatsApp today evening."
              className={`w-full p-3 rounded-2xl border text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#88131B] text-xs leading-relaxed font-medium bg-amber-50/20 ${
                activeError ? 'border-rose-400 ring-1 ring-rose-300' : 'border-slate-300'
              }`}
            />
          </div>

          {/* Next Follow-up & Status Update */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <div>
              <CustomTextInput
                size="sm"
                label="Next Follow-up Date/Time"
                leftIcon={<Calendar className="w-3.5 h-3.5 text-slate-400" />}
                placeholder="e.g. Tomorrow, 11:00 AM"
                value={values.nextFollowUp}
                onChange={(e) => setFieldValue('nextFollowUp', e.target.value)}
              />
            </div>

            <div>
              <CustomDropDown
                size="sm"
                label="Update Lead Status"
                value={values.newLeadStatus}
                onChange={(val) => setFieldValue('newLeadStatus', val as LeadStatus)}
                options={[
                  { label: 'CONTACTED (Follow-up In Progress)', value: 'CONTACTED' },
                  { label: 'INTERESTED (Active Warm Prospect)', value: 'INTERESTED' },
                  { label: 'CONVERTED (Paid Member)', value: 'CONVERTED' },
                  { label: 'ON_HOLD (Customer Requested Pause)', value: 'ON_HOLD' },
                  { label: 'LOST (Closed / Not Interested)', value: 'LOST' },
                  { label: 'NEW (Unassigned / Reset)', value: 'NEW' },
                ]}
              />
            </div>
          </div>

          {/* Optional Internal Notes */}
          <div>
            <CustomTextInput
              size="sm"
              label="Additional Internal Notes (Optional)"
              placeholder="e.g. Discuss with Super Admin for customized package discount"
              value={values.conversationNotes}
              onChange={(e) => setFieldValue('conversationNotes', e.target.value)}
            />
          </div>
        </form>

        {/* Modal Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save Call Response to Lead</span>
          </button>
        </div>
      </div>
    </div>
  );
};
