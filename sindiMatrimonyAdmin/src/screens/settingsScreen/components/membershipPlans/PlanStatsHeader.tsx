import React, { memo } from 'react';
import { Plus, Search, RotateCcw, Sparkles } from 'lucide-react';
import type { MembershipPlanStats } from './types';
import { CustomTextInput } from '../../../../components/CustomTextInput';

interface PlanStatsHeaderProps {
  stats: MembershipPlanStats;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddNewPlan: () => void;
  onResetDefaults: () => void;
}

export const PlanStatsHeader: React.FC<PlanStatsHeaderProps> = memo(({
  stats,
  searchQuery,
  onSearchChange,
  onAddNewPlan,
  onResetDefaults,
}) => {
  return (
    <div className="space-y-4">
      {/* Top Banner / Main Header matching Screenshot 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Membership Plans
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
              <Sparkles className="w-3 h-3 text-rose-500" />
              {stats.activePlans} Active Tiers
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure pricing packages, profile contact quotas, match-listings visibility and assisted concierge services.
          </p>
        </div>

        {/* Right Action: + Add New Plan button matching Screenshot 1 */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onResetDefaults}
            title="Reset to default plans"
            className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          
          <button
            type="button"
            onClick={onAddNewPlan}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C81E28] hover:bg-[#a61720] text-white text-xs font-bold transition shadow-sm hover:shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add New Plan</span>
          </button>
        </div>
      </div>

      {/* Quick Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
        <div className="flex-1 max-w-md">
          <CustomTextInput
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by plan name or feature (e.g., contacts, interests)..."
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            clearable={true}
            onClear={() => onSearchChange('')}
            size="sm"
          />
        </div>
      </div>
    </div>
  );
});

PlanStatsHeader.displayName = 'PlanStatsHeader';
