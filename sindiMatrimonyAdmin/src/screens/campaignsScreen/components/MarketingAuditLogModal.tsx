import React from 'react';
import { X, ShieldCheck, Clock, User } from 'lucide-react';
import { campaignService } from '../../../services/campaignService';

interface MarketingAuditLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MarketingAuditLogModal: React.FC<MarketingAuditLogModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const logs = campaignService.getMarketingAuditLogs();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[88vh] flex flex-col overflow-hidden my-auto animate-scale-up">
        {/* Header */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-amber-300 font-bold border border-white/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">Marketing Audit Trail</h2>
              <p className="text-xs text-slate-400">
                Immutable event record of campaign creation, pricing overrides and broadcasts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Audit Log Table */}
        <div className="p-6 overflow-y-auto space-y-3 text-xs">
          {logs.length === 0 ? (
            <div className="text-center p-8 text-slate-400">No audit records logged yet.</div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-1.5 hover:bg-slate-100/60 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        log.action.includes('DISPATCH') || log.action.includes('SENT')
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : log.action.includes('DELETE') || log.action.includes('CANCEL')
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}
                    >
                      {log.action.replace(/_/g, ' ')}
                    </span>
                    <span className="font-bold text-slate-800">{log.entityTitle}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" />
                    {new Date(log.timestamp).toLocaleString('en-IN')}
                  </span>
                </div>

                <p className="text-slate-600 leading-relaxed pt-0.5">{log.details}</p>

                <div className="text-[10px] text-slate-400 font-semibold flex items-center gap-1 pt-1">
                  <User className="w-3 h-3 text-slate-400" />
                  <span>Authorized by: {log.performedBy}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition"
          >
            Close Audit Log
          </button>
        </div>
      </div>
    </div>
  );
};
