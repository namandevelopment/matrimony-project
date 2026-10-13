import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  Send,
} from 'lucide-react';
import { type NotificationCampaign } from '../../../services/campaignService';

interface AudienceConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  campaignData: Partial<NotificationCampaign>;
  isProcessing?: boolean;
  processingProgress?: number;
}

export const AudienceConfirmationModal: React.FC<AudienceConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  campaignData,
  isProcessing = false,
  processingProgress = 0,
}) => {
  const [hasConfirmed, setHasConfirmed] = useState(false);

  if (!isOpen) return null;

  const estimatedRecipients = campaignData.estimatedRecipients || 38400;
  const estimatedBatches = Math.ceil(estimatedRecipients / 5000);
  const estimatedDuration = `${Math.ceil(estimatedBatches * 4.5)} seconds`;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-xl overflow-hidden my-auto transform transition-all animate-scale-up">
        {/* Accent Banner */}
        <div className="h-2 w-full bg-gradient-to-r from-[#88131B] via-[#C81E28] to-amber-500" />

        <div className="p-6 sm:p-7 space-y-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-[#C81E28] shadow-xs">
                <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  Confirm Bulk Dispatch
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Verify recipient segment and batch queue parameters
                </p>
              </div>
            </div>
            {!isProcessing && (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Recipient Count Highlight */}
          <div className="bg-gradient-to-br from-amber-500/10 via-rose-50 to-orange-50 border border-amber-200/80 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Targeted Audience Segment
              </span>
              <span className="text-sm font-extrabold text-slate-900 mt-0.5 block">
                {campaignData.targetAudience?.replace(/_/g, ' ') || 'All Active Members'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Total Recipient Scale
              </span>
              <span className="text-xl font-black text-[#C81E28]">
                {estimatedRecipients.toLocaleString('en-IN')} Users
              </span>
            </div>
          </div>

          {/* Campaign Payload Review */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-500 font-semibold text-[11px] pb-1 border-b border-slate-200">
              <span>Campaign Title:</span>
              <span className="font-mono text-slate-700">{campaignData.campaignName}</span>
            </div>
            <div className="pt-1">
              <div className="font-bold text-slate-900 text-sm">
                {campaignData.title || 'Untitled Notification'}
              </div>
              <p className="text-slate-600 mt-0.5 line-clamp-2">
                {campaignData.message || 'No short message provided.'}
              </p>
            </div>
          </div>

          {/* Workload & Queue Estimation */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">
                Background Batch Queue
              </span>
              <span className="font-extrabold text-slate-800 mt-0.5 block">
                {estimatedBatches} Batches (5k per batch)
              </span>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">
                Estimated Processing Time
              </span>
              <span className="font-extrabold text-emerald-700 mt-0.5 block">
                ~{estimatedDuration}
              </span>
            </div>
          </div>

          {/* Live Progress Bar if Currently Processing */}
          {isProcessing ? (
            <div className="p-4 bg-slate-900 rounded-2xl text-white space-y-3">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Dispatching Batches to Notification Providers...
                </span>
                <span className="font-mono text-amber-300">{processingProgress}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-400 to-[#C81E28] h-full transition-all duration-300"
                  style={{ width: `${processingProgress}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Please keep this window open while background workers complete provider dispatches.
              </p>
            </div>
          ) : (
            <>
              {/* Mandatory Confirmation Checkbox */}
              <div className="bg-rose-50/70 border border-rose-200/80 rounded-2xl p-4 space-y-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasConfirmed}
                    onChange={(e) => setHasConfirmed(e.target.checked)}
                    className="mt-0.5 rounded text-[#C81E28] focus:ring-[#C81E28] w-4 h-4"
                  />
                  <div className="text-xs text-rose-950 leading-relaxed font-medium">
                    <strong>Irreversible Action:</strong> I understand that already-delivered mobile push, in-app bell and web notifications <u>cannot be recalled</u>. I authorize dispatching this marketing campaign to all{' '}
                    <strong>{estimatedRecipients.toLocaleString('en-IN')}</strong> eligible members.
                  </div>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
                >
                  Go Back & Edit
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={!hasConfirmed}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#991B1B] via-[#C81E28] to-[#E11D48] hover:opacity-95 shadow-lg shadow-rose-900/25 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2 transition-all font-black"
                >
                  <Send className="w-4 h-4 text-amber-300" />
                  <span>Authorize & Dispatch Now</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
