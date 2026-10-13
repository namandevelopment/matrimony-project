import React from 'react';
import { CheckCircle2, X, Lock, MessageSquare } from 'lucide-react';

interface LeadsNoticeBannersProps {
  assignSuccessMessage: string | null;
  onDismissSuccess: () => void;
  isSuperAdmin: boolean;
  effectiveUserFullName?: string;
}

export const LeadsNoticeBanners: React.FC<LeadsNoticeBannersProps> = React.memo(
  ({ assignSuccessMessage, onDismissSuccess, isSuperAdmin, effectiveUserFullName }) => {
    return (
      <>
        {/* Success Banner */}
        {assignSuccessMessage && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-2xs animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{assignSuccessMessage}</span>
            </div>
            <button
              onClick={onDismissSuccess}
              className="text-emerald-600 hover:text-emerald-900 cursor-pointer p-0.5"
              title="Dismiss message"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Employee Mode Guidance Banner */}
        {!isSuperAdmin && (
          <div className="p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-900 rounded-2xl text-xs font-semibold flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-2xs">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                <strong>Employee Scoped Mode:</strong> You are viewing only leads assigned directly to you (
                <strong>{effectiveUserFullName || 'Agent'}</strong>). Super Admin has full view of all leads and your call response logs.
              </span>
            </div>
            <a
              href="/chat"
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[11px] font-bold shrink-0 transition flex items-center gap-1 shadow-2xs"
            >
              <MessageSquare className="w-3 h-3" />
              Chat with Super Admin
            </a>
          </div>
        )}
      </>
    );
  }
);

LeadsNoticeBanners.displayName = 'LeadsNoticeBanners';
