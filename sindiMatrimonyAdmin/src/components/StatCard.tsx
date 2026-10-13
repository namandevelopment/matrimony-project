import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { memoWithDeepEqual } from '../utils/memoUtils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  subtext?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = memoWithDeepEqual(({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
  subtext,
  className = '',
}) => {
  return (
    <div
      className={`bg-white rounded-2xl p-4 md:p-5 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500 truncate mr-2">{title}</span>
        <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-100">
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-2">
        <div className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">{value}</div>
        {change && (
          <div
            className={`flex items-center text-xs font-semibold shrink-0 ${
              isPositive ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            {change}
          </div>
        )}
      </div>
      {subtext && <div className="text-[11px] text-slate-400 mt-1">{subtext}</div>}
    </div>
  );
});

StatCard.displayName = 'StatCard';
