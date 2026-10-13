import React, { useState, useMemo } from 'react';
import {
  Search,
  Download,
  RotateCcw,
  CheckCircle2,
  Clock,
  Smartphone,
  Bell,
  Globe,
  Mail,
} from 'lucide-react';
import {
  campaignService,
} from '../../../services/campaignService';
import { toast } from '../../../toastMessage/toast';
import { CustomTextInput } from '../../../components/CustomTextInput';
import { CustomDropDown } from '../../../components/CustomDropDown';

export const DeliveryLogsSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [channelFilter, setChannelFilter] = useState<string>('ALL');

  const logs = campaignService.getRecipientDeliveryLogs();

  const filteredLogs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return logs.filter((log) => {
      if (statusFilter !== 'ALL' && log.status !== statusFilter) return false;
      if (channelFilter !== 'ALL' && log.channel !== channelFilter) return false;

      if (q) {
        return (
          log.userName.toLowerCase().includes(q) ||
          log.userId.toLowerCase().includes(q) ||
          log.campaignName.toLowerCase().includes(q) ||
          log.providerMessageId.toLowerCase().includes(q) ||
          (log.userPhone && log.userPhone.includes(q))
        );
      }
      return true;
    });
  }, [logs, searchQuery, statusFilter, channelFilter]);

  const handleRetry = (logId: string) => {
    const success = campaignService.retryFailedDelivery(logId);
    if (success) {
      toast.success('Retry dispatched to provider successfully');
    } else {
      toast.error('Unable to retry delivery');
    }
  };

  const handleExportCSV = () => {
    if (filteredLogs.length === 0) {
      toast.info('No logs to export');
      return;
    }

    const headers = [
      'Log ID',
      'Campaign Name',
      'Member ID',
      'Member Name',
      'Phone/Email',
      'Channel',
      'Status',
      'Provider ID',
      'Attempted At',
      'Delivered At',
      'Opened At',
      'Error Code',
    ];

    const rows = filteredLogs.map((l) => [
      l.id,
      `"${l.campaignName.replace(/"/g, '""')}"`,
      l.userId,
      `"${l.userName.replace(/"/g, '""')}"`,
      l.userPhone || l.userEmail || '',
      l.channel,
      l.status,
      l.providerMessageId,
      l.attemptedAt,
      l.deliveredAt || '',
      l.openedAt || '',
      l.errorCode || '',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Notification_Delivery_Logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Delivery logs exported to CSV');
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex-1">
            <CustomTextInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search delivery logs by recipient name, user ID, phone, or FCM message ID..."
              leftIcon={<Search className="w-4 h-4 text-slate-400" />}
              size="sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="w-40">
              <CustomDropDown
                value={statusFilter}
                onChange={(val) => setStatusFilter(String(val))}
                options={[
                  { value: 'ALL', label: 'All Statuses' },
                  { value: 'DELIVERED', label: 'Delivered' },
                  { value: 'OPENED', label: 'Opened' },
                  { value: 'FAILED', label: 'Failed' },
                  { value: 'SENT_TO_PROVIDER', label: 'Sent to Provider' },
                  { value: 'QUEUED', label: 'Queued' },
                ]}
                size="sm"
              />
            </div>

            <div className="w-44">
              <CustomDropDown
                value={channelFilter}
                onChange={(val) => setChannelFilter(String(val))}
                options={[
                  { value: 'ALL', label: 'All Channels' },
                  { value: 'MOBILE_PUSH', label: 'Mobile Push (FCM)' },
                  { value: 'IN_APP', label: 'In-App Bell' },
                  { value: 'WEB_PUSH', label: 'Web Push' },
                  { value: 'EMAIL', label: 'Email' },
                ]}
                size="sm"
              />
            </div>

            <button
              type="button"
              onClick={handleExportCSV}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Recipient Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Recipient</th>
                <th className="py-3 px-4">Campaign Name</th>
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-4">Provider Message ID</th>
                <th className="py-3 px-4">Status & Timeline</th>
                <th className="py-3 px-4">Error Reason</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Clock className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    No delivery log entries matching filters.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-extrabold text-slate-900">{log.userName}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {log.userId} • {log.userPhone || log.userEmail || 'N/A'}
                      </div>
                    </td>

                    <td className="py-3 px-4 max-w-xs truncate font-bold text-slate-800">
                      {log.campaignName}
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                        {log.channel === 'MOBILE_PUSH' && <Smartphone className="w-3 h-3" />}
                        {log.channel === 'IN_APP' && <Bell className="w-3 h-3" />}
                        {log.channel === 'WEB_PUSH' && <Globe className="w-3 h-3" />}
                        {log.channel === 'EMAIL' && <Mail className="w-3 h-3" />}
                        <span>{log.channel}</span>
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono text-[10px] text-slate-600 truncate max-w-xs">
                      {log.providerMessageId}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          log.status === 'DELIVERED'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : log.status === 'OPENED'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : log.status === 'FAILED'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {log.status}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-1">
                        {new Date(log.attemptedAt).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-600">
                      {log.errorCode ? (
                        <div className="text-rose-600 text-[11px] font-semibold">
                          {log.errorCode}
                          {log.errorMessage && (
                            <div className="text-[10px] text-slate-500 font-normal line-clamp-1">
                              {log.errorMessage}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">—</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      {log.status === 'FAILED' ? (
                        <button
                          type="button"
                          onClick={() => handleRetry(log.id)}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-rose-600 text-white hover:bg-rose-700 transition flex items-center gap-1 ml-auto shadow-2xs cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Retry</span>
                        </button>
                      ) : (
                        <span className="text-emerald-600 font-bold text-[10px] flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>OK</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
