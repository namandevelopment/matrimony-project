import React, { useState } from 'react';
import {
  X,
  Send,
  Bell,
  Smartphone,
  MessageSquare,
} from 'lucide-react';
import {
  type TargetAudience,
  type FestivalOffer,
} from '../../../services/campaignService';
import { CustomTextInput } from '../../../components/CustomTextInput';
import { CustomDropDown } from '../../../components/CustomDropDown';
import { toast } from '../../../toastMessage/toast';

interface BroadcastOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (params: {
    title: string;
    message: string;
    targetAudience: TargetAudience;
    channels: ('PUSH_FCM' | 'IN_APP_BELL' | 'WHATSAPP')[];
    discountHighlight?: string;
  }) => void;
  availableOffers: FestivalOffer[];
}

export const BroadcastOfferModal: React.FC<BroadcastOfferModalProps> = ({
  isOpen,
  onClose,
  onSend,
  availableOffers,
}) => {
  const [selectedOfferId, setSelectedOfferId] = useState<string>(
    availableOffers[0]?.id || ''
  );
  const [title, setTitle] = useState(
    '🎆 Diwali Mahabachat Vivah Offer — Flat 60% OFF!'
  );
  const [message, setMessage] = useState(
    'Celebrate this festive season with your life partner! 3 Months Gold Plan now ₹1,999 only. Tap to unlock verified contacts.'
  );
  const [discountHighlight, setDiscountHighlight] = useState('60% OFF (₹1,999)');
  const [targetAudience, setTargetAudience] = useState<TargetAudience>('FREE_USERS');
  const [sendPushFcm, setSendPushFcm] = useState(true);
  const [sendInAppBell, setSendInAppBell] = useState(true);
  const [sendWhatsApp, setSendWhatsApp] = useState(false);

  if (!isOpen) return null;

  const handleSelectOffer = (offerId: string) => {
    setSelectedOfferId(offerId);
    const offer = availableOffers.find((o) => o.id === offerId);
    if (offer) {
      setTitle(`🎆 ${offer.festivalName} — Special Rates!`);
      const lowestPlan = offer.planOverrides[0];
      const rateText = lowestPlan
        ? `${lowestPlan.planName} @ ₹${lowestPlan.festivalPrice} (Save ${lowestPlan.discountPercentage}%)`
        : 'Special Festival Rates';
      setMessage(
        `${offer.tagline}. Limited period festive pass active. Tap to claim before expiry!`
      );
      setDiscountHighlight(rateText);
    }
  };

  const getAudienceCount = (aud: TargetAudience): number => {
    switch (aud) {
      case 'ALL':
        return 48500;
      case 'FREE_USERS':
        return 38400;
      case 'EXPIRED_MEMBERS':
        return 6200;
      case 'INACTIVE_30_DAYS':
        return 4100;
      case 'UNVERIFIED_PROFILES':
        return 3200;
      default:
        return 38400;
    }
  };

  const audienceReach = getAudienceCount(targetAudience);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      toast.warning('Please provide title and notification message');
      return;
    }

    const channels: ('PUSH_FCM' | 'IN_APP_BELL' | 'WHATSAPP')[] = [];
    if (sendPushFcm) channels.push('PUSH_FCM');
    if (sendInAppBell) channels.push('IN_APP_BELL');
    if (sendWhatsApp) channels.push('WHATSAPP');

    if (channels.length === 0) {
      toast.warning('Please select at least one delivery channel (Push / Bell)');
      return;
    }

    onSend({
      title: title.trim(),
      message: message.trim(),
      targetAudience,
      channels,
      discountHighlight: discountHighlight.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-linear-to-r from-[#DB2F3C] to-[#b71f2a] text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Broadcast Festival Offer & Push Notification
              </h2>
              <p className="text-xs text-white/85">
                Send instant mobile push alerts and in-app bell notifications to user accounts.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Quick Preset Offer Selector */}
          {availableOffers.length > 0 && (
            <div>
              <CustomDropDown
                label="Select Existing Festival Offer Campaign (Auto-fills text & rates)"
                value={selectedOfferId}
                onChange={(val) => handleSelectOffer(String(val))}
                options={availableOffers.map((offer) => ({
                  value: offer.id,
                  label: `${offer.festivalName} (${offer.badge})`,
                }))}
                size="sm"
              />
            </div>
          )}

          {/* Notification Title */}
          <CustomTextInput
            label="Notification Title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. 🎆 Diwali Mahabachat Vivah Offer Active!"
            size="sm"
            required
          />

          {/* Message */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Push Message Body *</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="Enter push notification content..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#DB2F3C]/20 focus:border-[#DB2F3C]"
              required
            />
          </div>

          {/* Rates Highlight */}
          <CustomTextInput
            label="Discount Highlight Badge"
            value={discountHighlight}
            onChange={(e) => setDiscountHighlight(e.target.value)}
            placeholder="e.g. 60% OFF (₹1,999) or Code: DIWALI60"
            size="sm"
          />

          {/* Target Audience & Estimated Reach Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div>
              <CustomDropDown
                label="Target Audience"
                value={targetAudience}
                onChange={(val) => setTargetAudience(val as TargetAudience)}
                options={[
                  { value: 'ALL', label: 'All Registered Users (Complete Base)' },
                  { value: 'FREE_USERS', label: 'Free / Unpaid Profiles (Highest Conversion)' },
                  { value: 'EXPIRED_MEMBERS', label: 'Expired Paid Members (Win-Back)' },
                  { value: 'INACTIVE_30_DAYS', label: 'Inactive Users (30+ Days)' },
                  { value: 'UNVERIFIED_PROFILES', label: 'Unverified KYC Profiles' },
                ]}
                size="sm"
              />
            </div>

            <div className="p-3 bg-indigo-50/70 border border-indigo-200/60 rounded-xl">
              <div className="text-[11px] font-semibold text-indigo-700">Estimated Target Reach</div>
              <div className="text-lg font-extrabold text-indigo-950">
                {audienceReach.toLocaleString('en-IN')}{' '}
                <span className="text-xs font-medium text-indigo-600">Active Mobile Tokens</span>
              </div>
            </div>
          </div>

          {/* Channels Selection */}
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-bold text-slate-700">Broadcast Channels</label>
            <div className="grid grid-cols-3 gap-3">
              <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100 transition">
                <input
                  type="checkbox"
                  checked={sendPushFcm}
                  onChange={(e) => setSendPushFcm(e.target.checked)}
                  className="w-4 h-4 text-[#DB2F3C] rounded-sm cursor-pointer"
                />
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <Smartphone className="w-3.5 h-3.5 text-blue-600" /> Mobile Push
                  </div>
                  <div className="text-[10px] text-slate-500">Firebase FCM</div>
                </div>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100 transition">
                <input
                  type="checkbox"
                  checked={sendInAppBell}
                  onChange={(e) => setSendInAppBell(e.target.checked)}
                  className="w-4 h-4 text-[#DB2F3C] rounded-sm cursor-pointer"
                />
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <Bell className="w-3.5 h-3.5 text-amber-600" /> In-App Bell
                  </div>
                  <div className="text-[10px] text-slate-500">Notification Center</div>
                </div>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100 transition opacity-80">
                <input
                  type="checkbox"
                  checked={sendWhatsApp}
                  onChange={(e) => setSendWhatsApp(e.target.checked)}
                  className="w-4 h-4 text-[#DB2F3C] rounded-sm cursor-pointer"
                />
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" /> WhatsApp
                  </div>
                  <div className="text-[10px] text-slate-500">API Queue (Optional)</div>
                </div>
              </label>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-linear-to-r from-[#DB2F3C] to-[#B71F2A] hover:from-[#c22430] hover:to-[#991720] text-white text-xs font-bold shadow-md shadow-[#DB2F3C]/20 transition cursor-pointer flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send Live Broadcast Now ({audienceReach.toLocaleString('en-IN')} Users)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
