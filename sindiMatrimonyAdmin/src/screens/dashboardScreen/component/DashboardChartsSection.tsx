import React from 'react';
import { memoWithDeepEqual } from '../../../utils/memoUtils';
import { MembersBarChart, type DailyActivityItem } from './MembersBarChart';
import { PlansPieChart, type PlanSlice } from './PlansPieChart';

export interface DashboardChartsSectionProps {
  barChartTitle?: string;
  barChartData?: DailyActivityItem[];
  pieChartTitle?: string;
  pieChartSlices?: PlanSlice[];
}

export const DashboardChartsSection: React.FC<DashboardChartsSectionProps> = memoWithDeepEqual(({
  barChartTitle,
  barChartData,
  pieChartTitle,
  pieChartSlices,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
      {/* Members Overview: 7-Day Dual Bar Chart (2 cols) */}
      <div className="lg:col-span-2 h-full flex flex-col">
        <MembersBarChart title={barChartTitle} data={barChartData} />
      </div>

      {/* Content & Plans: Segmented Donut / Pie Chart (1 col) */}
      <div className="lg:col-span-1 h-full flex flex-col">
        <PlansPieChart title={pieChartTitle} slices={pieChartSlices} />
      </div>
    </div>
  );
});

DashboardChartsSection.displayName = 'DashboardChartsSection';
