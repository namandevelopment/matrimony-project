import React, { useMemo } from 'react';
import { TabsHeader } from '../../../components/TabsHeader';
import type { LeadsTabType, TabCounts } from './types';

interface LeadsTabsSectionProps {
  activeTab: LeadsTabType;
  isSuperAdmin: boolean;
  tabCounts: TabCounts;
  onTabChange: (tab: LeadsTabType) => void;
}

export const LeadsTabsSection: React.FC<LeadsTabsSectionProps> = React.memo(
  ({ activeTab, isSuperAdmin, tabCounts, onTabChange }) => {
    const tabs = useMemo(() => {
      if (isSuperAdmin) {
        return [
          { key: 'ALL', label: 'All Website Leads', count: tabCounts.all },
          { key: 'UNASSIGNED', label: 'Unassigned Queue', count: tabCounts.unassigned },
          { key: 'ASSIGNED', label: 'All Assigned Leads', count: tabCounts.assigned },
          { key: 'MY_BUCKET', label: 'My Leads', count: tabCounts.myBucket },
          { key: 'TODAY', label: "Today's Follow-ups", count: tabCounts.today },
          { key: 'HIGH', label: 'High Priority & Urgent', count: tabCounts.high },
          { key: 'TRANSFERRED', label: 'Transferred / Reassigned', count: tabCounts.transferred },
        ];
      }
      return [
        { key: 'MY_BUCKET', label: 'My Assigned Leads', count: tabCounts.myBucket },
        { key: 'TODAY', label: "Today's Follow-ups", count: tabCounts.today },
        { key: 'HIGH', label: 'High Priority & Urgent', count: tabCounts.high },
      ];
    }, [isSuperAdmin, tabCounts]);

    return (
      <TabsHeader
        activeTab={activeTab}
        onChange={(tab) => onTabChange(tab as LeadsTabType)}
        tabs={tabs}
      />
    );
  }
);

LeadsTabsSection.displayName = 'LeadsTabsSection';
