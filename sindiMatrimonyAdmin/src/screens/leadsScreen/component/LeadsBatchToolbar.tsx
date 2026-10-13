import React from 'react';
import { Sparkles } from 'lucide-react';

interface LeadsBatchToolbarProps {
  currentPage: number;
  totalPages: number;
  currentPageCount: number;
  onSelectAllOnCurrentPage: () => void;
  onSelectFirst20Unassigned: () => void;
}

export const LeadsBatchToolbar: React.FC<LeadsBatchToolbarProps> = React.memo(
  ({
    currentPage,
    totalPages,
    currentPageCount,
    onSelectAllOnCurrentPage,
    onSelectFirst20Unassigned,
  }) => {
    return (
      <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">Batching Controls:</span>
          <button
            type="button"
            onClick={onSelectAllOnCurrentPage}
            className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 font-medium text-slate-700 transition-colors cursor-pointer"
          >
            Select Current Page ({currentPageCount})
          </button>
          <button
            type="button"
            onClick={onSelectFirst20Unassigned}
            className="px-2.5 py-1 bg-amber-50 border border-amber-300 rounded-lg hover:bg-amber-100 font-semibold text-amber-800 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-amber-600" /> Select 20 Unassigned
          </button>
        </div>

        <div className="text-slate-500 font-medium flex items-center gap-3">
          <span>
            Showing <span className="font-bold text-slate-800">20 per page</span> (Page {currentPage} of {totalPages})
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-emerald-700 font-semibold">No Lead Assignment Limit</span>
        </div>
      </div>
    );
  }
);

LeadsBatchToolbar.displayName = 'LeadsBatchToolbar';
