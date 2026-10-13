import React, { useState } from 'react';
import { PieChart as PieIcon } from 'lucide-react';
import { memoWithDeepEqual } from '../../../utils/memoUtils';

export interface PlanSlice {
  label: string;
  percentage: number;
  count: number;
  color: string;
}

export interface PlansPieChartProps {
  title?: string;
  slices?: PlanSlice[];
}

export const defaultPlanSlices: PlanSlice[] = [
  { label: 'Free Tier', percentage: 40, count: 15774, color: '#0F172A' },
  { label: 'Silver Plan', percentage: 15, count: 5915, color: '#F97316' },
  { label: 'Gold Royal', percentage: 25, count: 9858, color: '#D946EF' },
  { label: 'Diamond / NRI', percentage: 20, count: 7887, color: '#4F46E5' },
];

export const PlansPieChart: React.FC<PlansPieChartProps> = memoWithDeepEqual(({
  title = 'Content & Plans',
  slices = defaultPlanSlices,
}) => {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  // Calculate SVG stroke dashes for circle-based donut segments
  const size = 160;
  const strokeWidth = 48;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs flex flex-col justify-between h-full min-h-[380px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
            <PieIcon className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">{title}</h2>
        </div>
      </div>

      {/* Legend list matching screenshot */}
      <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-semibold mb-2">
        {slices.map((slice, i) => (
          <div
            key={slice.label}
            onMouseEnter={() => setActiveIdx(i)}
            onMouseLeave={() => setActiveIdx(null)}
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg cursor-pointer transition ${
              activeIdx === i ? 'bg-slate-100 font-bold' : ''
            }`}
          >
            <span
              className="w-2.5 h-2.5 rounded-xs shrink-0"
              style={{ backgroundColor: slice.color }}
            />
            <span className="text-slate-600 truncate">{slice.label}</span>
          </div>
        ))}
      </div>

      {/* Circular Donut Visualization (Centered in flex-1) */}
      <div className="relative flex-1 flex items-center justify-center py-2">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
          {slices.map((slice, idx) => {
            const strokeDasharray = `${(slice.percentage / 100) * circumference} ${circumference}`;
            const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
            accumulatedPercent += slice.percentage;
            const isHovered = activeIdx === idx;

            return (
              <circle
                key={slice.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={slice.color}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setActiveIdx(idx)}
                onMouseLeave={() => setActiveIdx(null)}
              />
            );
          })}
        </svg>

        {/* Center label */}
        <div className="absolute text-center pointer-events-none">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total</div>
          <div className="text-sm font-black text-slate-900">100%</div>
        </div>
      </div>

      {/* Symmetrical Bottom Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
        <span>Active Breakdown</span>
        {activeIdx !== null ? (
          <span className="font-bold text-slate-900">
            {slices[activeIdx].label}: {slices[activeIdx].percentage}% ({slices[activeIdx].count.toLocaleString()})
          </span>
        ) : (
          <span className="text-slate-400">Hover slice for count</span>
        )}
      </div>
    </div>
  );
});

PlansPieChart.displayName = 'PlansPieChart';
