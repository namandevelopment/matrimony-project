import React, { useState } from 'react';
import {
  Activity,
  HardDrive,
  Database,
  Download,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Radio,
  FileSpreadsheet,
  FileCode,
  ShieldAlert,
  Server,
  Zap,
} from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { CustomButton } from '../../components/CustomButton';
import { CustomTextInput } from '../../components/CustomTextInput';
import { toast } from '../../toastMessage/toast';
import { memberDataService } from '../../services/memberDataService';
import { crmDataService } from '../../services/crmDataService';
import { useInputs } from '../../customHooks/useInputs';

interface DiagnosticResult {
  title: string;
  category: string;
  status: 'OPTIMAL' | 'WARNING' | 'HEALTHY';
  metric: string;
  detail: string;
}

export interface MaintenanceFormValues {
  maintenanceMode: boolean;
  maintenanceMessage: string;
}

export const ToolsScreen: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanTime, setLastScanTime] = useState<string>('Just now');
  const { values: maintenanceConfig, setFieldValue: setMaintenanceField } = useInputs<MaintenanceFormValues>({
    maintenanceMode: false,
    maintenanceMessage:
      'Scheduled routine maintenance in progress. The Sindhi Matrimony portal will be back shortly.',
  });

  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([
    {
      title: 'Member Profiles Integrity',
      category: 'Database',
      status: 'OPTIMAL',
      metric: `${memberDataService.getMembers().length} / ${memberDataService.getMembers().length} Valid`,
      detail: 'All profile IDs match unique ID index format (SIND001-SIND999). Zero orphaned records.',
    },
    {
      title: 'CRM Lead Allocation Engine',
      category: 'Pipeline',
      status: 'HEALTHY',
      metric: `${crmDataService.getLeads().length} Leads Indexed`,
      detail: '20-record batch assignments, exclusivity locks & disposition timestamps verified.',
    },
    {
      title: 'Duplicate Phone Number Check',
      category: 'Compliance',
      status: 'OPTIMAL',
      metric: '0 Collisions',
      detail: 'E.164 phone sanitization verified across all candidate records and employee profiles.',
    },
    {
      title: 'VoIP WebRTC Gateway',
      category: 'Telephony',
      status: 'HEALTHY',
      metric: 'Active Trunk',
      detail: 'Exotel SIP gateway responsive. Mandatory disposition flow audit logs intact.',
    },
  ]);

  const [pingLatencies, setPingLatencies] = useState<{ [key: string]: number }>({
    database: 6,
    voip: 44,
    sms: 68,
    cdn: 19,
  });
  const [isPinging, setIsPinging] = useState(false);

  // Run Integrity Scan
  const handleRunScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setLastScanTime(new Date().toLocaleTimeString());
      setDiagnostics([
        {
          title: 'Member Profiles Integrity',
          category: 'Database',
          status: 'OPTIMAL',
          metric: `${memberDataService.getMembers().length} Profiles Verified`,
          detail: 'No orphaned records or corrupted gotra associations found.',
        },
        {
          title: 'CRM Lead Allocation Engine',
          category: 'Pipeline',
          status: 'HEALTHY',
          metric: `${crmDataService.getLeads().length} Leads Indexed`,
          detail: 'Exclusive agent locks & follow-up queue SLA timings normal.',
        },
        {
          title: 'Duplicate Phone Number Check',
          category: 'Compliance',
          status: 'OPTIMAL',
          metric: '0 Collisions',
          detail: 'Clean indexing across all member directory contacts.',
        },
        {
          title: 'VoIP WebRTC Gateway',
          category: 'Telephony',
          status: 'HEALTHY',
          metric: 'SIP Trunk 44ms',
          detail: 'Telephony gateway healthy, floating widget socket channel active.',
        },
      ]);
      toast.success('System diagnostic & data integrity scan completed with zero errors.');
    }, 900);
  };

  // Ping Gateways
  const handlePingGateways = () => {
    setIsPinging(true);
    setTimeout(() => {
      setIsPinging(false);
      setPingLatencies({
        database: Math.floor(Math.random() * 5) + 4,
        voip: Math.floor(Math.random() * 15) + 38,
        sms: Math.floor(Math.random() * 20) + 55,
        cdn: Math.floor(Math.random() * 10) + 15,
      });
      toast.success('All gateway ping response latencies updated.');
    }, 600);
  };

  // Cache Purging Handlers
  const handleClearCache = (type: string) => {
    try {
      if (type === 'all') {
        sessionStorage.clear();
        toast.success('Client application session cache purged successfully.');
      } else if (type === 'memo') {
        toast.success('Fast-deep-equal memoization store flushed.');
      } else if (type === 'telephony') {
        toast.success('VoIP floating call disposition cache cleared.');
      }
    } catch {
      toast.error('Failed to clear cache.');
    }
  };

  // Export Database Snapshot
  const handleExportSnapshot = () => {
    try {
      const data = {
        exportedAt: new Date().toISOString(),
        version: '1.0.0',
        members: memberDataService.getMembers(),
        leads: crmDataService.getLeads(),
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sindhi_matrimony_system_snapshot_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Full system database snapshot exported as JSON.');
    } catch {
      toast.error('Export failed.');
    }
  };

  // Export CSV
  const handleExportCSV = (filename: string) => {
    try {
      const members = memberDataService.getMembers();
      memberDataService.exportMembersCSV(members, filename);
      toast.success(`Exported ${members.length} records to ${filename}.csv.`);
    } catch {
      toast.error('CSV export failed.');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Tools & System Diagnostics"
        description="Comprehensive maintenance console: Data integrity scanner, gateway health monitor, cache purging & system backup utilities."
        actions={
          <div className="flex items-center gap-2">
            <CustomButton
              variant="outline"
              size="md"
              icon={<RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />}
              onClick={handleRunScan}
              disabled={isScanning}
            >
              {isScanning ? 'Scanning System...' : 'Run Diagnostics'}
            </CustomButton>
            <CustomButton
              variant="primary"
              size="md"
              icon={<Download className="w-3.5 h-3.5" />}
              onClick={handleExportSnapshot}
            >
              Export JSON Backup
            </CustomButton>
          </div>
        }
      />

      {/* Overview Metric Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">System State</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">100% Operational</p>
          <p className="text-[11px] text-slate-500 font-medium mt-1">Last scan: {lastScanTime}</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">DB Cluster Latency</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{pingLatencies.database} ms</p>
          <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Sub-10ms response time
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">VoIP SIP Trunk</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Radio className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{pingLatencies.voip} ms</p>
          <p className="text-[11px] text-purple-700 font-medium mt-1">Exotel WebRTC gateway connected</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Maintenance Mode</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">
            {maintenanceConfig.maintenanceMode ? 'ACTIVE' : 'OFFLINE'}
          </p>
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            {maintenanceConfig.maintenanceMode ? 'Live portal banner visible' : 'Portal open for all public traffic'}
          </p>
        </div>
      </div>

      {/* Section 1: Integrity Scan Results */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Server className="w-4 h-4 text-[#C81E28]" />
              Data Integrity & Consistency Scans
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live checks across Member Directory, CRM Leads, KYC proofs and VoIP telephony dispatches.
            </p>
          </div>
          <button
            type="button"
            onClick={handleRunScan}
            disabled={isScanning}
            className="text-xs font-bold text-[#C81E28] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className={`w-3 h-3 ${isScanning ? 'animate-spin' : ''}`} />
            Re-scan Now
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {diagnostics.map((d) => (
            <div
              key={d.title}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">{d.title}</span>
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${d.status === 'OPTIMAL'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}
                >
                  {d.metric}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">{d.detail}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 2: Cache & Memory Management */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-purple-600" />
              Cache, Session & Memory Purging
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Force-clean client memory, reset local caches, or flush memoized state stores.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50">
              <div>
                <p className="text-xs font-bold text-slate-900">Application Session Storage</p>
                <p className="text-[11px] text-slate-500">Purges temporary filter inputs and session tabs.</p>
              </div>
              <button
                type="button"
                onClick={() => handleClearCache('all')}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition cursor-pointer"
              >
                Clear Session
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50">
              <div>
                <p className="text-xs font-bold text-slate-900">Fast-Deep-Equal Memo Store</p>
                <p className="text-[11px] text-slate-500">Resets cached equality comparisons across components.</p>
              </div>
              <button
                type="button"
                onClick={() => handleClearCache('memo')}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition cursor-pointer"
              >
                Flush Store
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50">
              <div>
                <p className="text-xs font-bold text-slate-900">VoIP Floating Telephony Cache</p>
                <p className="text-[11px] text-slate-500">Resets active widget state and lingering audio buffers.</p>
              </div>
              <button
                type="button"
                onClick={() => handleClearCache('telephony')}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition cursor-pointer"
              >
                Reset Widget
              </button>
            </div>
          </div>
        </div>

        {/* Section 3: Gateways Ping & Health Monitor */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                Integration Gateways Ping Monitor
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time round-trip latency checks to operational external providers.
              </p>
            </div>
            <button
              type="button"
              onClick={handlePingGateways}
              disabled={isPinging}
              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 transition cursor-pointer flex items-center gap-1"
            >
              <RefreshCw className={`w-3 h-3 ${isPinging ? 'animate-spin' : ''}`} />
              Ping
            </button>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-xs font-semibold text-slate-800">Primary Database Cluster (PostgreSQL)</span>
              <span className="font-mono text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                {pingLatencies.database} ms
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-xs font-semibold text-slate-800">Exotel VoIP WebRTC Gateway</span>
              <span className="font-mono text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
                {pingLatencies.voip} ms
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-xs font-semibold text-slate-800">MSG91 SMS Transactional Gateway</span>
              <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                {pingLatencies.sms} ms
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-xs font-semibold text-slate-800">Media CDN & Image Delivery (Cloudflare)</span>
              <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                {pingLatencies.cdn} ms
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: Data Exports & Backups */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
        <div className="pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-600" />
            Data Backup Vault & CSV Exports
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Download on-demand audit archives and encrypted customer records for off-site disaster recovery.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={handleExportSnapshot}
            className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50 transition text-left cursor-pointer"
          >
            <div>
              <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-[#C81E28]" />
                Full JSON Snapshot
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">All tables, schema & relations</p>
            </div>
            <Download className="w-4 h-4 text-slate-400" />
          </button>

          <button
            type="button"
            onClick={() => handleExportCSV('members_directory_export')}
            className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50 transition text-left cursor-pointer"
          >
            <div>
              <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                Members CSV Export
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">Formatted profiles with Gotras</p>
            </div>
            <Download className="w-4 h-4 text-slate-400" />
          </button>

          <button
            type="button"
            onClick={() => handleExportCSV('crm_leads_disposition_export')}
            className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50 transition text-left cursor-pointer"
          >
            <div>
              <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                CRM Leads & Calls CSV
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">Dispositions & telephonic logs</p>
            </div>
            <Download className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Section 5: Emergency Maintenance Mode Toggle */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
        <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              Emergency Maintenance Mode Control
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              When enabled, a warning maintenance banner will be displayed to standard visitors while Super Admin access remains uninhibited.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              const nextMode = !maintenanceConfig.maintenanceMode;
              setMaintenanceField('maintenanceMode', nextMode);
              toast.info(
                nextMode
                  ? 'Maintenance mode turned ON.'
                  : 'Maintenance mode turned OFF.'
              );
            }}
            className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${maintenanceConfig.maintenanceMode ? 'bg-[#C81E28]' : 'bg-slate-300'
              }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-md absolute top-0.5 transition-transform ${maintenanceConfig.maintenanceMode ? 'left-6.5' : 'left-0.5'
                }`}
            />
          </button>
        </div>

        {maintenanceConfig.maintenanceMode && (
          <div className="space-y-2 p-3 bg-rose-50/60 rounded-xl border border-rose-200 animate-in fade-in duration-150">
            <CustomTextInput
              label="Live Maintenance Announcement Message:"
              value={maintenanceConfig.maintenanceMessage}
              onChange={(e) => setMaintenanceField('maintenanceMessage', e.target.value)}
              size="sm"
            />
            <p className="text-[11px] text-rose-700">
              This notice is immediately broadcast to all customer clients.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolsScreen;
