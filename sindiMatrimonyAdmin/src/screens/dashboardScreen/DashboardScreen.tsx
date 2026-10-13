import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardHeroBanner } from './component/DashboardHeroBanner';
import { KPIGrid } from './component/KPIGrid';
import { AdminActionQueues } from './component/AdminActionQueues';
import { DashboardChartsSection } from './component/DashboardChartsSection';
import { RecentRegistrationsTable } from './component/RecentRegistrationsTable';
import { ExportNoticeBanner } from './component/ExportNoticeBanner';
import { memoWithDeepEqual } from '../../utils/memoUtils';
import { toast } from '../../toastMessage/toast';
import { usePerformanceTracker } from '../../customHooks/usePerformanceTracker';

// Static CSV export payload hoisted outside component to prevent recurring memory allocation
const CSV_EXPORT_DATA = [
  'S.No,Name,Profession,Email,JoinedOn,Status',
  '1,JITAMITRA DHARMADHIKARY,Software Architect,jitamitra@example.com,10 Oct 2026,Active',
  '2,ABHISHEK SINGH RAIZADA,Real Estate,abhishek.r@example.com,08 Oct 2026,Active',
  '3,SACHIN CHAUHAN,Civil Services,sachin.c@example.com,08 Oct 2026,Active',
  '4,HARSHIT PUROHIT,Chartered Accountant,harshit.p@example.com,08 Oct 2026,Active',
  '5,MANISH KUMAR,Data Scientist,manish.k@example.com,07 Oct 2026,Active',
].join('\n');

export const DashboardScreen: React.FC = memoWithDeepEqual(() => {
  // Track render cycle & durations inside Performance Profiler
  usePerformanceTracker('DashboardScreen');

  const navigate = useNavigate();
  const [exportNotice, setExportNotice] = useState<string | null>(null);
  const exportTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up any ongoing timer on component unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (exportTimerRef.current) {
        clearTimeout(exportTimerRef.current);
      }
    };
  }, []);

  // Stable callback: navigation to members
  const handleAddMember = useCallback(() => {
    navigate('/members');
  }, [navigate]);

  // Stable callback: CSV export trigger with async simulation
  const handleExportCsv = useCallback(() => {
    setExportNotice('Exporting CSV backup of verified Sindhi profiles...');
    toast.info('Exporting CSV backup of verified Sindhi profiles...');

    if (exportTimerRef.current) {
      clearTimeout(exportTimerRef.current);
    }

    exportTimerRef.current = setTimeout(() => {
      const blob = new Blob([CSV_EXPORT_DATA], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sindhi-members-export-${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      setExportNotice(null);
      toast.success('CSV backup downloaded successfully!');
    }, 800);
  }, []);

  // Stable callback: KPI card interaction router
  const handleCardClick = useCallback((id: string) => {
    if (id === 'export_backup') {
      handleExportCsv();
    } else if (id === 'total_revenue' || id === 'membership_plans') {
      navigate('/finance');
    } else {
      navigate('/members');
    }
  }, [navigate, handleExportCsv]);

  return (
    <div className="space-y-6 pb-8">
      {/* 1. Royal Ruby Red Hero Welcome Banner */}
      <DashboardHeroBanner
        adminName="Admin"
        totalMembers="39,434"
        onAddMember={handleAddMember}
        onExportCsv={handleExportCsv}
      />

      {/* Export notification toast if triggered */}
      {exportNotice && <ExportNoticeBanner notice={exportNotice} />}

      {/* 2. 8 KPI Stat Cards Grid (Total Members, Male, Female, Inactive, Revenue, Plans, Blogs, Backup) */}
      <KPIGrid onCardClick={handleCardClick} />

      {/* 3. Operational Action Queues (Verification, Exceptions, Abuse, Marriage Offboarding) */}
      <AdminActionQueues />

      {/* 4. Charts & Analytics Row (Members Overview Bar Chart & Content Plans Donut Chart) */}
      <DashboardChartsSection />

      {/* 4. Recent Member Registrations Table (With Crimson Red Header Row) */}
      <RecentRegistrationsTable />
    </div>
  );
});

DashboardScreen.displayName = 'DashboardScreen';
export default DashboardScreen;
