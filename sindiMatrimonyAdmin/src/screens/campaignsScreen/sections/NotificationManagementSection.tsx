import React, { useState, useMemo } from 'react';
import {
  Bell,
  Search,
  Plus,
  Send,
  Copy,
  Trash2,
  Eye,
  Smartphone,
  Globe,
  Mail,
  Edit,
} from 'lucide-react';
import {
  type NotificationCampaign,
  type DeliveryChannel,
  campaignService,
} from '../../../services/campaignService';
import { toast } from '../../../toastMessage/toast';
import { CreateNotificationModal } from '../components/CreateNotificationModal';
import { AudienceConfirmationModal } from '../components/AudienceConfirmationModal';
import { TestNotificationModal } from '../components/TestNotificationModal';
import { CampaignDetailModal } from '../components/CampaignDetailModal';
import { CustomTextInput } from '../../../components/CustomTextInput';
import { CustomDropDown } from '../../../components/CustomDropDown';
import { useInputs } from '../../../customHooks/useInputs';

export interface NotificationFilterValues {
  searchQuery: string;
  selectedType: string;
  selectedStatus: string;
  selectedAudience: string;
  selectedChannel: string;
}

export const NotificationManagementSection: React.FC = () => {
  const {
    values: filterValues,
    setFieldValue: setFilterField,
  } = useInputs<NotificationFilterValues>({
    searchQuery: '',
    selectedType: 'ALL',
    selectedStatus: 'ALL',
    selectedAudience: 'ALL',
    selectedChannel: 'ALL',
  });

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<NotificationCampaign | null>(null);
  const [detailCampaign, setDetailCampaign] = useState<NotificationCampaign | null>(null);
  const [testCampaign, setTestCampaign] = useState<NotificationCampaign | null>(null);
  const [confirmationCampaign, setConfirmationCampaign] = useState<NotificationCampaign | null>(null);

  // Background dispatch progress
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchProgress, setDispatchProgress] = useState(0);

  const campaigns = campaignService.getCampaigns();

  // Single-pass computation for KPI summary
  const stats = useMemo(() => {
    let total = campaigns.length;
    let drafts = 0;
    let scheduled = 0;
    let completed = 0;
    let processing = 0;
    let failed = 0;
    let totalRecipients = 0;
    let totalDelivered = 0;
    let totalOpened = 0;

    for (let i = 0; i < campaigns.length; i++) {
      const c = campaigns[i];
      if (c.status === 'DRAFT') drafts++;
      else if (c.status === 'SCHEDULED') scheduled++;
      else if (c.status === 'COMPLETED') completed++;
      else if (c.status === 'PROCESSING' || c.status === 'QUEUED') processing++;
      else if (c.status === 'FAILED') failed++;

      totalRecipients += c.sentCount || 0;
      totalDelivered += c.deliveredCount || 0;
      totalOpened += c.openedCount || 0;
    }

    return {
      total,
      drafts,
      scheduled,
      completed,
      processing,
      failed,
      totalRecipients,
      totalDelivered,
      totalOpened,
    };
  }, [campaigns]);

  // Filtered campaigns
  const filteredCampaigns = useMemo(() => {
    const q = filterValues.searchQuery.trim().toLowerCase();

    return campaigns.filter((c) => {
      if (filterValues.selectedType !== 'ALL' && c.notificationType !== filterValues.selectedType) return false;
      if (filterValues.selectedStatus !== 'ALL' && c.status !== filterValues.selectedStatus) return false;
      if (filterValues.selectedAudience !== 'ALL' && c.targetAudience !== filterValues.selectedAudience) return false;
      if (filterValues.selectedChannel !== 'ALL' && !c.channels.includes(filterValues.selectedChannel as DeliveryChannel)) return false;

      if (q) {
        const matchesName = c.campaignName.toLowerCase().includes(q);
        const matchesTitle = c.title.toLowerCase().includes(q);
        const matchesMsg = c.message.toLowerCase().includes(q);
        return matchesName || matchesTitle || matchesMsg;
      }
      return true;
    });
  }, [campaigns, filterValues]);

  // Handlers
  const handleOpenCreate = () => {
    setEditingCampaign(null);
    setIsCreateModalOpen(true);
  };

  const handleEdit = (camp: NotificationCampaign) => {
    setEditingCampaign(camp);
    setIsCreateModalOpen(true);
  };

  const handleSaveDraft = (data: any) => {
    if (editingCampaign) {
      campaignService.updateCampaign(editingCampaign.id, data);
      toast.success('Campaign draft updated');
    } else {
      campaignService.createCampaign(data);
      toast.success('Campaign draft saved');
    }
    setIsCreateModalOpen(false);
  };

  const handleSchedule = (data: any) => {
    if (editingCampaign) {
      campaignService.updateCampaign(editingCampaign.id, { ...data, status: 'SCHEDULED' });
      toast.success('Campaign scheduled');
    } else {
      campaignService.createCampaign({ ...data, status: 'SCHEDULED' });
      toast.success('Campaign scheduled for broadcast');
    }
    setIsCreateModalOpen(false);
  };

  const handleSendNowInitiate = (data: any) => {
    let camp: NotificationCampaign;
    if (editingCampaign) {
      campaignService.updateCampaign(editingCampaign.id, data);
      camp = campaignService.getCampaignById(editingCampaign.id)!;
    } else {
      camp = campaignService.createCampaign(data);
    }
    setIsCreateModalOpen(false);
    setConfirmationCampaign(camp);
  };

  const handleConfirmDispatch = async () => {
    if (!confirmationCampaign) return;
    try {
      setIsDispatching(true);
      setDispatchProgress(0);
      await campaignService.dispatchBulkCampaign(
        confirmationCampaign.id,
        undefined,
        (p) => setDispatchProgress(p)
      );
      toast.success(`Broadcast completed for ${confirmationCampaign.campaignName}!`);
      setConfirmationCampaign(null);
    } catch (err: any) {
      toast.error(err?.message || 'Dispatch failed');
    } finally {
      setIsDispatching(false);
    }
  };

  const handleSendTestInitiate = (camp: NotificationCampaign) => {
    setTestCampaign(camp);
  };

  const handleExecuteTest = (recipient: string) => {
    if (!testCampaign) return;
    campaignService.sendTestNotification({
      campaignId: testCampaign.id,
      title: testCampaign.title,
      message: testCampaign.message,
      channels: testCampaign.channels,
      testRecipient: recipient,
    });
    toast.success(`Test preview alert dispatched to ${recipient}`);
    setTestCampaign(null);
  };

  const handleDuplicate = (id: string) => {
    campaignService.duplicateCampaign(id);
    toast.success('Campaign cloned as new draft');
  };

  const handleCancel = (id: string) => {
    if (window.confirm('Cancel this scheduled campaign dispatch?')) {
      campaignService.cancelCampaign(id);
      toast.info('Scheduled campaign cancelled');
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      campaignService.deleteCampaign(id);
      toast.info('Campaign deleted');
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Module 1 KPI Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Campaigns
          </span>
          <div className="text-xl font-black text-slate-900 mt-1">{stats.total}</div>
          <span className="text-[11px] text-slate-500 font-medium">All Lifetime Records</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
            Scheduled
          </span>
          <div className="text-xl font-black text-blue-700 mt-1">{stats.scheduled}</div>
          <span className="text-[11px] text-slate-500 font-medium">Queued for Auto-Send</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">
            Completed / Sent
          </span>
          <div className="text-xl font-black text-emerald-700 mt-1">{stats.completed}</div>
          <span className="text-[11px] text-slate-500 font-medium">Successfully Dispatched</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">
            Draft Campaigns
          </span>
          <div className="text-xl font-black text-amber-700 mt-1">{stats.drafts}</div>
          <span className="text-[11px] text-slate-500 font-medium">In Preparation</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider block">
            Total Delivered
          </span>
          <div className="text-xl font-black text-purple-700 mt-1">
            {stats.totalDelivered.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Confirmed Receipts</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider block">
            Total Opened
          </span>
          <div className="text-xl font-black text-rose-700 mt-1">
            {stats.totalOpened.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-slate-500 font-medium">User Engagements</span>
        </div>
      </div>

      {/* 2. Top Action Bar: Search, Filters & "Create Campaign" Button */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="flex-1">
            <CustomTextInput
              value={filterValues.searchQuery}
              onChange={(e) => setFilterField('searchQuery', e.target.value)}
              placeholder="Search campaigns by name, headline or message content..."
              leftIcon={<Search className="w-4 h-4 text-slate-400" />}
              size="sm"
            />
          </div>

          {/* New Campaign Button */}
          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-5 py-2.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-[#991B1B] via-[#C81E28] to-[#E11D48] hover:opacity-95 shadow-md shadow-rose-900/20 active:scale-95 transition cursor-pointer flex items-center justify-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4 text-amber-300 stroke-[3]" />
            <span>Create Notification Campaign</span>
          </button>
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-xs">
          <div>
            <CustomDropDown
              label="Campaign Type"
              value={filterValues.selectedType}
              onChange={(val) => setFilterField('selectedType', String(val))}
              options={[
                { value: 'ALL', label: 'All Types' },
                { value: 'FESTIVAL_OFFER', label: 'Festival Offer' },
                { value: 'GENERAL_ANNOUNCEMENT', label: 'General Announcement' },
                { value: 'SUBSCRIPTION_OFFER', label: 'Subscription Offer' },
                { value: 'PROFILE_COMPLETION', label: 'Profile Completion' },
                { value: 'DISCOUNT_CAMPAIGN', label: 'Discount Campaign' },
              ]}
              size="sm"
            />
          </div>

          <div>
            <CustomDropDown
              label="Dispatch Status"
              value={filterValues.selectedStatus}
              onChange={(val) => setFilterField('selectedStatus', String(val))}
              options={[
                { value: 'ALL', label: 'All Statuses' },
                { value: 'COMPLETED', label: 'Completed' },
                { value: 'SCHEDULED', label: 'Scheduled' },
                { value: 'DRAFT', label: 'Draft' },
                { value: 'PROCESSING', label: 'Processing' },
                { value: 'FAILED', label: 'Failed' },
              ]}
              size="sm"
            />
          </div>

          <div>
            <CustomDropDown
              label="Audience Segment"
              value={filterValues.selectedAudience}
              onChange={(val) => setFilterField('selectedAudience', String(val))}
              options={[
                { value: 'ALL', label: 'All Segments' },
                { value: 'FREE_USERS', label: 'Free Users' },
                { value: 'EXPIRED_MEMBERS', label: 'Expired VIPs' },
                { value: 'UNVERIFIED_PROFILES', label: 'Unverified KYC' },
                { value: 'PREMIUM_USERS', label: 'Premium Active' },
              ]}
              size="sm"
            />
          </div>

          <div>
            <CustomDropDown
              label="Delivery Channel"
              value={filterValues.selectedChannel}
              onChange={(val) => setFilterField('selectedChannel', String(val))}
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
        </div>
      </div>

      {/* 3. Notification Campaigns Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Campaign & Creative</th>
                <th className="py-3 px-4">Type & Channels</th>
                <th className="py-3 px-4">Audience</th>
                <th className="py-3 px-4">Status & Dispatch</th>
                <th className="py-3 px-4">Delivery & Open Stats</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCampaigns.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    No notification campaigns found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredCampaigns.map((camp) => {
                  const deliveryRate =
                    camp.sentCount > 0
                      ? ((camp.deliveredCount / camp.sentCount) * 100).toFixed(0)
                      : '0';
                  const openRate =
                    camp.deliveredCount > 0
                      ? ((camp.openedCount / camp.deliveredCount) * 100).toFixed(0)
                      : '0';

                  return (
                    <tr key={camp.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Campaign & Creative */}
                      <td className="py-3 px-4 max-w-xs">
                        <div className="flex items-start gap-3">
                          {camp.imageUrl ? (
                            <img
                              src={camp.imageUrl}
                              alt=""
                              className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 text-[#C81E28] flex items-center justify-center shrink-0 font-bold">
                              <Bell className="w-4 h-4" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="font-extrabold text-slate-900 truncate">
                              {camp.campaignName}
                            </div>
                            <div className="text-[11px] text-slate-600 font-semibold line-clamp-1">
                              {camp.title}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                              ID: {camp.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Type & Channels */}
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 mb-1">
                          {camp.notificationType.replace(/_/g, ' ')}
                        </span>
                        <div className="flex items-center gap-1.5 text-slate-500">
                          {camp.channels.map((ch) => (
                            <span
                              key={ch}
                              className="p-1 rounded-md bg-slate-100 text-slate-600"
                              title={ch}
                            >
                              {ch === 'MOBILE_PUSH' && <Smartphone className="w-3 h-3" />}
                              {ch === 'IN_APP' && <Bell className="w-3 h-3" />}
                              {ch === 'WEB_PUSH' && <Globe className="w-3 h-3" />}
                              {ch === 'EMAIL' && <Mail className="w-3 h-3" />}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Audience */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-800">
                          {camp.targetAudience.replace(/_/g, ' ')}
                        </div>
                        <div className="text-[11px] text-emerald-700 font-extrabold mt-0.5">
                          ~{(camp.sentCount || camp.estimatedRecipients).toLocaleString('en-IN')}{' '}
                          Recipients
                        </div>
                      </td>

                      {/* Status & Dispatch */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            camp.status === 'COMPLETED'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : camp.status === 'SCHEDULED'
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : camp.status === 'DRAFT'
                              ? 'bg-slate-100 text-slate-700 border border-slate-200'
                              : camp.status === 'PROCESSING' || camp.status === 'QUEUED'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200 animate-pulse'
                              : 'bg-rose-100 text-rose-800 border border-rose-200'
                          }`}
                        >
                          {camp.status}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-1">
                          {camp.sentAt
                            ? `Sent: ${new Date(camp.sentAt).toLocaleDateString('en-IN')}`
                            : camp.scheduledAt
                            ? `Sched: ${new Date(camp.scheduledAt).toLocaleDateString('en-IN')}`
                            : 'Unscheduled Draft'}
                        </div>
                      </td>

                      {/* Delivery & Open Stats */}
                      <td className="py-3 px-4">
                        {camp.status === 'COMPLETED' ? (
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5 font-bold text-slate-800">
                              <span className="text-emerald-700">{deliveryRate}% Delivered</span>
                              <span>•</span>
                              <span className="text-blue-700">{openRate}% Opened</span>
                            </div>
                            <div className="text-[10px] text-slate-500">
                              {camp.deliveredCount.toLocaleString('en-IN')} dev /{' '}
                              {camp.openedCount.toLocaleString('en-IN')} opened
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-medium">Pending Dispatch</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Details */}
                          <button
                            type="button"
                            onClick={() => setDetailCampaign(camp)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
                            title="View Campaign Details & Live Preview"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Test Send */}
                          <button
                            type="button"
                            onClick={() => handleSendTestInitiate(camp)}
                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                            title="Dispatch Isolated Test Preview"
                          >
                            <Send className="w-4 h-4" />
                          </button>

                          {/* Send Now (if Draft or Scheduled) */}
                          {camp.status !== 'COMPLETED' && (
                            <button
                              type="button"
                              onClick={() => setConfirmationCampaign(camp)}
                              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#C81E28] text-white hover:bg-[#a61720] transition shadow-2xs"
                              title="Send Bulk Campaign Now"
                            >
                              Send Now
                            </button>
                          )}

                          {/* Edit (if Draft) */}
                          {camp.status === 'DRAFT' && (
                            <button
                              type="button"
                              onClick={() => handleEdit(camp)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
                              title="Edit Draft"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}

                          {/* Cancel (if Scheduled) */}
                          {camp.status === 'SCHEDULED' && (
                            <button
                              type="button"
                              onClick={() => handleCancel(camp.id)}
                              className="px-2 py-1 rounded-lg text-[10px] font-bold bg-amber-100 text-amber-800 hover:bg-amber-200 transition"
                              title="Cancel Scheduled Dispatch"
                            >
                              Cancel
                            </button>
                          )}

                          {/* Clone / Duplicate */}
                          <button
                            type="button"
                            onClick={() => handleDuplicate(camp.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
                            title="Clone Campaign"
                          >
                            <Copy className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleDelete(camp.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                            title="Delete Campaign"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <CreateNotificationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSaveDraft={handleSaveDraft}
        onSchedule={handleSchedule}
        onSendNow={handleSendNowInitiate}
        onSendTest={(payload) => {
          setTestCampaign(payload);
        }}
        initialData={editingCampaign}
      />

      <AudienceConfirmationModal
        isOpen={Boolean(confirmationCampaign)}
        onClose={() => setConfirmationCampaign(null)}
        onConfirm={handleConfirmDispatch}
        campaignData={confirmationCampaign || {}}
        isProcessing={isDispatching}
        processingProgress={dispatchProgress}
      />

      <TestNotificationModal
        isOpen={Boolean(testCampaign)}
        onClose={() => setTestCampaign(null)}
        onSendTest={handleExecuteTest}
        campaignTitle={testCampaign?.title || 'Notification Campaign'}
      />

      <CampaignDetailModal
        isOpen={Boolean(detailCampaign)}
        onClose={() => setDetailCampaign(null)}
        campaign={detailCampaign}
      />
    </div>
  );
};
