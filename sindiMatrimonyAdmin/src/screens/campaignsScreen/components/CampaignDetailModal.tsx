import React from 'react';
import {
  X,
  Bell,
} from 'lucide-react';
import { type NotificationCampaign } from '../../../services/campaignService';

interface CampaignDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: NotificationCampaign | null;
}

export const CampaignDetailModal: React.FC<CampaignDetailModalProps> = ({
  isOpen,
  onClose,
  campaign,
}) => {
  if (!isOpen || !campaign) return null;

  const deliveryRate =
    campaign.sentCount > 0
      ? ((campaign.deliveredCount / campaign.sentCount) * 100).toFixed(1)
      : '0.0';
  const openRate =
    campaign.deliveredCount > 0
      ? ((campaign.openedCount / campaign.deliveredCount) * 100).toFixed(1)
      : '0.0';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden my-auto animate-scale-up max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-amber-300 font-bold border border-white/20">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-white tracking-tight">
                  {campaign.campaignName}
                </h2>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    campaign.status === 'COMPLETED'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : campaign.status === 'PROCESSING' || campaign.status === 'QUEUED'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : campaign.status === 'SCHEDULED'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {campaign.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Created by {campaign.createdBy} on {new Date(campaign.createdAt).toLocaleDateString('en-IN')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {/* Performance KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Total Dispatched
              </span>
              <span className="text-lg font-black text-slate-900 mt-1 block">
                {(campaign.sentCount || campaign.estimatedRecipients).toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-slate-500">Target Recipients</span>
            </div>

            <div className="bg-emerald-50/70 rounded-2xl p-3.5 border border-emerald-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                Delivered
              </span>
              <span className="text-lg font-black text-emerald-800 mt-1 block">
                {campaign.deliveredCount.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-emerald-700 font-bold">{deliveryRate}% Delivery Rate</span>
            </div>

            <div className="bg-blue-50/70 rounded-2xl p-3.5 border border-blue-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">
                Opened & Engaged
              </span>
              <span className="text-lg font-black text-blue-800 mt-1 block">
                {campaign.openedCount.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-blue-700 font-bold">{openRate}% Open Rate</span>
            </div>

            <div className="bg-rose-50/70 rounded-2xl p-3.5 border border-rose-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block">
                Delivery Failed
              </span>
              <span className="text-lg font-black text-rose-800 mt-1 block">
                {campaign.failedCount.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-rose-600">FCM Token / Unreachable</span>
            </div>
          </div>

          {/* Message Content & Preview */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-2xs">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Payload & Creative
            </h3>

            <div className="text-sm font-bold text-slate-900 leading-snug">
              {campaign.title}
            </div>

            <p className="text-slate-700 leading-relaxed">
              {campaign.message}
            </p>

            {campaign.detailedMessage && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 text-[11px] leading-relaxed">
                <strong>Detailed Body:</strong> {campaign.detailedMessage}
              </div>
            )}

            {campaign.imageUrl && (
              <div className="rounded-2xl overflow-hidden aspect-video max-h-56 border border-slate-200">
                <img src={campaign.imageUrl} alt="banner" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Configuration Attributes */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Audience Segment
              </span>
              <span className="font-bold text-slate-800 mt-0.5 block">
                {campaign.targetAudience.replace(/_/g, ' ')}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Priority
              </span>
              <span className="font-bold text-slate-800 mt-0.5 block">
                {campaign.priority}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Channels
              </span>
              <span className="font-bold text-slate-800 mt-0.5 block">
                {campaign.channels.join(', ')}
              </span>
            </div>

            {campaign.deepLink && (
              <div className="sm:col-span-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Deep Link
                </span>
                <span className="font-mono font-bold text-[#C81E28] mt-0.5 block truncate">
                  {campaign.deepLink}
                </span>
              </div>
            )}

            {campaign.tags && campaign.tags.length > 0 && (
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Tags
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {campaign.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-md text-[10px] bg-slate-200 text-slate-700 font-semibold"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
