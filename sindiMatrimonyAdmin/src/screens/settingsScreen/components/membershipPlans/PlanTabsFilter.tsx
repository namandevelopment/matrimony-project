import React, { memo } from 'react';
import type { PlanCategory } from './types';

interface PlanTabsFilterProps {
  activeCategory: PlanCategory;
  onSelectCategory: (category: PlanCategory) => void;
  selfServiceCount: number;
  assistPlansCount: number;
}

export const PlanTabsFilter: React.FC<PlanTabsFilterProps> = memo(({
  activeCategory,
  onSelectCategory,
  selfServiceCount,
  assistPlansCount,
}) => {
  return (
    <div className="flex items-center">
      {/* Pill Toggle matching Screenshot 1 */}
      <div className="inline-flex p-1 bg-white border border-slate-200/80 rounded-full shadow-xs gap-1">
        <button
          type="button"
          onClick={() => onSelectCategory('SELF_SERVICE')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
            activeCategory === 'SELF_SERVICE'
              ? 'bg-[#C81E28] text-white shadow-md shadow-red-900/20'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <span>Self Service</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              activeCategory === 'SELF_SERVICE'
                ? 'bg-white/20 text-white'
                : 'bg-slate-200 text-slate-700'
            }`}
          >
            {selfServiceCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSelectCategory('ASSIST_PLAN')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
            activeCategory === 'ASSIST_PLAN'
              ? 'bg-[#C81E28] text-white shadow-md shadow-red-900/20'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <span>Assist Plans</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              activeCategory === 'ASSIST_PLAN'
                ? 'bg-white/20 text-white'
                : 'bg-slate-200 text-slate-700'
            }`}
          >
            {assistPlansCount}
          </span>
        </button>
      </div>
    </div>
  );
});

PlanTabsFilter.displayName = 'PlanTabsFilter';
