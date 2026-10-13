import React, { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { memoWithDeepEqual } from '../../../utils/memoUtils';

export interface DailyActivityItem {
  day: string;
  deposit: number; // New / Active Members
  withdraw: number; // Inactive / Expired
}

export interface MembersBarChartProps {
  title?: string;
  data?: DailyActivityItem[];
}

export const defaultDailyActivity: DailyActivityItem[] = [
  { day: 'Sat', deposit: 490, withdraw: 210 },
  { day: 'Sun', deposit: 260, withdraw: 310 },
  { day: 'Mon', deposit: 310, withdraw: 290 },
  { day: 'Tue', deposit: 450, withdraw: 410 },
  { day: 'Wed', deposit: 180, withdraw: 310 },
  { day: 'Thu', deposit: 340, withdraw: 460 },
  { day: 'Fri', deposit: 395, withdraw: 380 },
];

export const MembersBarChart: React.FC<MembersBarChartProps> = memoWithDeepEqual(({
  title = 'Members Overview',
  data = defaultDailyActivity,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const maxVal = 500;
  const chartHeight = 175;

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs flex flex-col justify-between h-full min-h-[380px]">
      {/* Header & Legends */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-100">
            <BarChart3 className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">{title}</h2>
        </div>

        {/* Legend pills matching screenshot */}
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-[#2DD4BF]" />
            <span className="text-slate-600">Active / Join</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-[#A855F7]" />
            <span className="text-slate-600">Withdraw / Exp</span>
          </div>
        </div>
      </div>

      {/* SVG Bar Chart Visualization (Centered & Flex-1) */}
      <div className="relative flex-1 flex flex-col justify-end pt-2 pb-2">
        {/* Y Axis Guide Lines */}
        <div className="absolute inset-x-8 top-0 bottom-8 flex flex-col justify-between pointer-events-none text-[10px] text-slate-300 font-mono">
          {[500, 400, 300, 200, 100, 0].map((val) => (
            <div key={val} className="w-full flex items-center gap-2">
              <span className="w-6 text-right text-slate-400 font-medium">{val}</span>
              <div className="flex-1 border-b border-slate-100" />
            </div>
          ))}
        </div>

        {/* Bar Columns Container */}
        <div className="pl-10 pr-2 pb-2 h-[200px] flex items-end justify-between gap-2 sm:gap-4 relative z-10">
          {data.map((item, idx) => {
            const depositHeight = (item.deposit / maxVal) * chartHeight;
            const withdrawHeight = (item.withdraw / maxVal) * chartHeight;
            const isHovered = hoveredIdx === idx;

            return (
              <div
                key={item.day}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer relative"
              >
                {/* Tooltip on hover */}
                {isHovered && (
                  <div className="absolute -top-10 bg-slate-900 text-white text-[10px] px-2 py-1 rounded-md shadow-lg pointer-events-none whitespace-nowrap z-20 font-mono">
                    Act: <b className="text-teal-300">{item.deposit}</b> | Exp:{' '}
                    <b className="text-purple-300">{item.withdraw}</b>
                  </div>
                )}

                {/* Bars side by side */}
                <div className="w-full flex items-end justify-center gap-1 sm:gap-2">
                  {/* Teal Bar */}
                  <div
                    style={{ height: `${depositHeight}px` }}
                    className="w-3 sm:w-5 bg-[#2DD4BF] hover:bg-[#14B8A6] rounded-t-sm transition-all duration-300"
                  />
                  {/* Purple Bar */}
                  <div
                    style={{ height: `${withdrawHeight}px` }}
                    className="w-3 sm:w-5 bg-[#A855F7] hover:bg-[#9333EA] rounded-t-sm transition-all duration-300"
                  />
                </div>

                {/* X Axis Label */}
                <span className="text-xs font-semibold text-slate-500 mt-2 block">
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Symmetrical Bottom Footer (Ensures exact height matching with PlansPieChart) */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
        <span>Weekly Interaction Flow</span>
        <span className="font-bold text-slate-900">
          {hoveredIdx !== null ? (
            <span className="text-rose-600">{data[hoveredIdx].day}: {data[hoveredIdx].deposit} Joined, {data[hoveredIdx].withdraw} Expired</span>
          ) : (
            '4,495 Weekly Interactions'
          )}
        </span>
      </div>
    </div>
  );
});

MembersBarChart.displayName = 'MembersBarChart';
