import React, { useEffect } from 'react';
import {
  X,
  Bell,
  Smartphone,
  Globe,
  Mail,
  Users,
  Sparkles,
  Clock,
  ShieldAlert,
  Send,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import {
  type NotificationCampaign,
  type NotificationType,
  type DeliveryChannel,
  type TargetAudience,
  type CampaignPriority,
  campaignService,
} from '../../../services/campaignService';
import { CustomTextInput } from '../../../components/CustomTextInput';
import { CustomDropDown } from '../../../components/CustomDropDown';
import { useInputs } from '../../../customHooks/useInputs';

interface CreateNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveDraft: (data: any) => void;
  onSchedule: (data: any) => void;
  onSendNow: (data: any) => void;
  onSendTest: (data: any) => void;
  initialData?: NotificationCampaign | null;
}

const SAMPLE_NOTIFICATION_IMAGES = [
  {
    name: 'Diwali Sparkle Gold',
    url: 'https://images.unsplash.com/photo-1605705658604-582c6ec35b71?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Royal Wedding Vivah',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Trust & Verification Shield',
    url: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Festive Lights & Diyas',
    url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80',
  },
];

export interface NotificationFormValues {
  campaignName: string;
  title: string;
  message: string;
  detailedMessage: string;
  imageUrl: string;
  notificationType: NotificationType;
  channels: DeliveryChannel[];
  targetAudience: TargetAudience;
  selectedUserIds: string;
  deepLink: string;
  priority: CampaignPriority;
  tagsInput: string;
  isScheduled: boolean;
  scheduledDate: string;
  scheduledTime: string;
  expiresAt: string;
}

const getInitialNotificationValues = (
  initialData?: NotificationCampaign | null
): NotificationFormValues => ({
  campaignName: initialData?.campaignName || 'Diwali Special Vivah Dhamaka',
  title: initialData?.title || '🎆 Exclusive Diwali Vivah Offer — Flat 60% OFF!',
  message:
    initialData?.message ||
    'Celebrate this festive season by unlocking verified Sindhi life partner profiles. Limited festive rates active now!',
  detailedMessage: initialData?.detailedMessage || '',
  imageUrl: initialData?.imageUrl || SAMPLE_NOTIFICATION_IMAGES[0].url,
  notificationType: initialData?.notificationType || 'FESTIVAL_OFFER',
  channels: initialData?.channels || ['IN_APP', 'MOBILE_PUSH'],
  targetAudience: initialData?.targetAudience || 'FREE_USERS',
  selectedUserIds: initialData?.selectedUserIds?.join(', ') || '',
  deepLink: initialData?.deepLink || '/settings/membership-plans',
  priority: initialData?.priority || 'HIGH',
  tagsInput: initialData?.tags?.join(', ') || 'Diwali, Sale, PremiumPass',
  isScheduled: Boolean(initialData?.scheduledAt),
  scheduledDate: initialData?.scheduledAt
    ? initialData.scheduledAt.split('T')[0]
    : new Date(Date.now() + 86400000).toISOString().split('T')[0],
  scheduledTime: initialData?.scheduledAt
    ? initialData.scheduledAt.split('T')[1].slice(0, 5)
    : '18:00',
  expiresAt: initialData?.expiresAt ? initialData.expiresAt.split('T')[0] : '',
});

export const CreateNotificationModal: React.FC<CreateNotificationModalProps> = ({
  isOpen,
  onClose,
  onSaveDraft,
  onSchedule,
  onSendNow,
  onSendTest,
  initialData,
}) => {
  const {
    values,
    setFieldValue,
    errors,
    touched,
    reset,
    validateForm,
  } = useInputs<NotificationFormValues>(
    () => getInitialNotificationValues(initialData),
    {
      validate: (vals) => {
        const errs: Partial<Record<keyof NotificationFormValues, string>> = {};
        if (!vals.campaignName.trim()) {
          errs.campaignName = 'Campaign internal name is required';
        }
        if (!vals.title.trim()) {
          errs.title = 'Headline / title is required';
        }
        if (!vals.message.trim()) {
          errs.message = 'Short message is required';
        }
        return errs;
      },
      validateOnChange: true,
      validateOnBlur: true,
    }
  );

  useEffect(() => {
    if (isOpen) {
      reset(getInitialNotificationValues(initialData));
    }
  }, [isOpen, initialData, reset]);

  if (!isOpen) return null;

  const estimatedReach = campaignService.estimateAudience(values.targetAudience);

  const toggleChannel = (channel: DeliveryChannel) => {
    const current = values.channels;
    if (current.includes(channel)) {
      if (current.length > 1) {
        setFieldValue('channels', current.filter((c) => c !== channel));
      }
    } else {
      setFieldValue('channels', [...current, channel]);
    }
  };

  const buildPayload = (status: 'DRAFT' | 'SCHEDULED' | 'QUEUED') => {
    const scheduledDateTime = values.isScheduled
      ? new Date(`${values.scheduledDate}T${values.scheduledTime}:00`).toISOString()
      : undefined;

    return {
      campaignName: values.campaignName.trim(),
      title: values.title.trim(),
      message: values.message.trim(),
      detailedMessage: values.detailedMessage.trim() || undefined,
      imageUrl: values.imageUrl.trim() || undefined,
      notificationType: values.notificationType,
      channels: values.channels,
      targetAudience: values.targetAudience,
      selectedUserIds:
        values.targetAudience === 'SELECTED_IDS'
          ? values.selectedUserIds
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
          : undefined,
      deepLink: values.deepLink.trim() || undefined,
      priority: values.priority,
      tags: values.tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      scheduledAt: scheduledDateTime,
      expiresAt: values.expiresAt ? new Date(`${values.expiresAt}T23:59:59`).toISOString() : undefined,
      status,
      createdBy: 'Super Admin',
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[94vh] flex flex-col overflow-hidden my-auto animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 bg-gradient-to-r from-[#991B1B] via-[#C81E28] to-[#E11D48] text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white font-bold shadow-inner">
              <Bell className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                {initialData ? 'Edit Notification Campaign' : 'Create Notification Campaign'}
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950">
                  Broadcast Engine
                </span>
              </h2>
              <p className="text-xs text-white/80 font-medium">
                Push FCM, In-App Bell, Web Push & Email multi-channel dispatch
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/15 transition cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Left Form + Right Live Visual Previews */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form Side (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Campaign Name */}
            <CustomTextInput
              label="Campaign Internal Name *"
              value={values.campaignName}
              onChange={(e) => setFieldValue('campaignName', e.target.value)}
              error={touched.campaignName ? errors.campaignName : undefined}
              placeholder="e.g. Diwali Vivah Mahabachat 2026"
              size="sm"
              required
            />

            {/* Notification Title & Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <CustomDropDown
                  label="Notification Type *"
                  value={values.notificationType}
                  onChange={(val) => setFieldValue('notificationType', val as NotificationType)}
                  options={[
                    { value: 'GENERAL_ANNOUNCEMENT', label: 'General Announcement' },
                    { value: 'FESTIVAL_GREETINGS', label: 'Festival Greetings' },
                    { value: 'FESTIVAL_OFFER', label: 'Festival Offer' },
                    { value: 'SUBSCRIPTION_OFFER', label: 'Subscription Offer' },
                    { value: 'DISCOUNT_CAMPAIGN', label: 'Discount Campaign' },
                    { value: 'NEW_FEATURE', label: 'New Feature Announcement' },
                    { value: 'PROFILE_COMPLETION', label: 'Profile Completion Reminder' },
                    { value: 'CUSTOM', label: 'Custom Notification' },
                  ]}
                  size="sm"
                />
              </div>

              <div>
                <CustomDropDown
                  label="Priority Level *"
                  value={values.priority}
                  onChange={(val) => setFieldValue('priority', val as CampaignPriority)}
                  options={[
                    { value: 'URGENT', label: '🔴 Urgent (Immediate Push)' },
                    { value: 'HIGH', label: '🟠 High Priority' },
                    { value: 'NORMAL', label: '🔵 Normal (Standard Queue)' },
                    { value: 'LOW', label: '⚪ Low Priority (Digest)' },
                  ]}
                  size="sm"
                />
              </div>
            </div>

            {/* Notification Title */}
            <CustomTextInput
              label="Notification Headline / Title *"
              value={values.title}
              onChange={(e) => setFieldValue('title', e.target.value)}
              error={touched.title ? errors.title : undefined}
              placeholder="e.g. 🎆 Diwali Vivah Special — 60% OFF!"
              size="sm"
              required
            />

            {/* Short Message */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Short Message (Push & Banner) *
              </label>
              <textarea
                value={values.message}
                onChange={(e) => setFieldValue('message', e.target.value)}
                rows={2}
                placeholder="Concise, captivating text for push notifications..."
                className={`w-full px-3.5 py-2 text-xs rounded-xl border focus:outline-hidden focus:ring-2 focus:ring-[#C81E28]/20 focus:border-[#C81E28] text-slate-700 ${
                  touched.message && errors.message ? 'border-red-500' : 'border-slate-200'
                }`}
                required
              />
              {touched.message && errors.message && (
                <p className="text-[11px] text-red-600 mt-1">{errors.message}</p>
              )}
            </div>

            {/* Detailed Message (Optional) */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Detailed Message (Optional In-App Expanded View)
              </label>
              <textarea
                value={values.detailedMessage}
                onChange={(e) => setFieldValue('detailedMessage', e.target.value)}
                rows={2}
                placeholder="Extended message when user expands the in-app notification..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#C81E28]/20 focus:border-[#C81E28] text-slate-700"
              />
            </div>

            {/* Delivery Channels Multi-Select */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Delivery Channels (Select All Applicable) *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'IN_APP', label: 'In-App Bell', icon: Bell },
                  { id: 'MOBILE_PUSH', label: 'Mobile Push (FCM)', icon: Smartphone },
                  { id: 'WEB_PUSH', label: 'Web Push', icon: Globe },
                  { id: 'EMAIL', label: 'Email Alert', icon: Mail },
                ].map((item) => {
                  const Icon = item.icon;
                  const isChecked = values.channels.includes(item.id as DeliveryChannel);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleChannel(item.id as DeliveryChannel)}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition cursor-pointer text-left ${
                        isChecked
                          ? 'border-[#C81E28] bg-rose-50/80 text-[#991B1B] shadow-2xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Target Audience */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#C81E28]" />
                  Audience Segmentation & Targeting
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                  ~{estimatedReach.toLocaleString('en-IN')} Members Reached
                </span>
              </div>

              <CustomDropDown
                value={values.targetAudience}
                onChange={(val) => setFieldValue('targetAudience', val as TargetAudience)}
                options={[
                  { value: 'ALL', label: 'All Eligible Active Users (48,500+)' },
                  { value: 'FREE_USERS', label: 'Free Non-Subscribed Members (38,400+)' },
                  { value: 'PREMIUM_USERS', label: 'Active Premium Members (10,100+)' },
                  { value: 'EXPIRED_MEMBERS', label: 'Expired VIP Members (6,200+)' },
                  { value: 'INACTIVE_30_DAYS', label: 'Inactive Profiles > 30 Days (4,100+)' },
                  { value: 'UNVERIFIED_PROFILES', label: 'Pending Aadhaar / KYC Profiles (3,200+)' },
                  { value: 'INCOMPLETE_PROFILES', label: 'Incomplete Biodatas (2,800+)' },
                  { value: 'RECENT_REGISTRATIONS', label: 'Recent Registrations < 7 Days (1,900+)' },
                  { value: 'SELECTED_IDS', label: 'Custom Specific User IDs' },
                ]}
                size="sm"
              />

              {values.targetAudience === 'SELECTED_IDS' && (
                <CustomTextInput
                  label="Comma-Separated Member IDs:"
                  value={values.selectedUserIds}
                  onChange={(e) => setFieldValue('selectedUserIds', e.target.value)}
                  placeholder="e.g. MBR-1001, MBR-1002, MBR-2099"
                  size="sm"
                />
              )}
            </div>

            {/* Banner Image Picker */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Notification Graphic Banner (Optional)
              </label>
              <div className="grid grid-cols-4 gap-2 mb-2">
                {SAMPLE_NOTIFICATION_IMAGES.map((img) => (
                  <button
                    key={img.name}
                    type="button"
                    onClick={() => setFieldValue('imageUrl', img.url)}
                    className={`relative rounded-xl overflow-hidden border-2 aspect-video transition cursor-pointer ${
                      values.imageUrl === img.url
                        ? 'border-[#C81E28] ring-2 ring-rose-300'
                        : 'border-slate-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                    {values.imageUrl === img.url && (
                      <div className="absolute top-1 right-1 bg-[#C81E28] text-white p-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <CustomTextInput
                type="url"
                value={values.imageUrl}
                onChange={(e) => setFieldValue('imageUrl', e.target.value)}
                placeholder="Or paste custom image URL..."
                size="sm"
              />
            </div>

            {/* Deep Link & Expiry */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <CustomTextInput
                label="Destination Deep Link"
                value={values.deepLink}
                onChange={(e) => setFieldValue('deepLink', e.target.value)}
                placeholder="e.g. /settings/membership-plans"
                size="sm"
              />

              <CustomTextInput
                label="Campaign Expiry Date (Optional)"
                type="date"
                value={values.expiresAt}
                onChange={(e) => setFieldValue('expiresAt', e.target.value)}
                size="sm"
              />
            </div>

            {/* Campaign Tags */}
            <CustomTextInput
              label="Campaign Tags (Comma-separated)"
              value={values.tagsInput}
              onChange={(e) => setFieldValue('tagsInput', e.target.value)}
              placeholder="e.g. Diwali, Festival, ElitePass"
              size="sm"
            />

            {/* Scheduling Options */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={values.isScheduled}
                  onChange={(e) => setFieldValue('isScheduled', e.target.checked)}
                  className="rounded text-[#C81E28] focus:ring-[#C81E28]"
                />
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#C81E28]" />
                  Schedule this campaign for a future date/time
                </span>
              </label>

              {values.isScheduled && (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <CustomTextInput
                    label="Dispatch Date"
                    type="date"
                    value={values.scheduledDate}
                    onChange={(e) => setFieldValue('scheduledDate', e.target.value)}
                    size="sm"
                  />
                  <CustomTextInput
                    label="Dispatch Time (IST)"
                    type="time"
                    value={values.scheduledTime}
                    onChange={(e) => setFieldValue('scheduledTime', e.target.value)}
                    size="sm"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Live Mockup Previews (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-[#C81E28]" />
                Live Multi-Channel Previews
              </span>
              <span className="text-[10px] text-slate-500 font-medium">Real-time Simulation</span>
            </div>

            {/* 1. Mobile Phone Push Notification Card */}
            <div className="bg-slate-900 rounded-3xl p-4 text-white shadow-xl border border-slate-800">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium pb-2 border-b border-slate-800 mb-3">
                <span className="flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-rose-400" />
                  Android & iOS Push Notification
                </span>
                <span className="font-mono text-[10px]">Just now</span>
              </div>

              {/* Push Banner Item */}
              <div className="bg-slate-800/90 rounded-2xl p-3 border border-slate-700/80 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-[#C81E28] flex items-center justify-center text-white text-[10px] font-black">
                    S
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-bold text-slate-200 truncate block">
                      Sindhi Matrimony
                    </span>
                  </div>
                  <span className="text-[9px] bg-amber-400/20 text-amber-300 font-bold px-1.5 py-0.5 rounded">
                    {values.priority}
                  </span>
                </div>

                <div className="text-xs font-extrabold text-white leading-snug">
                  {values.title || 'Notification Title'}
                </div>
                <div className="text-[11px] text-slate-300 leading-relaxed line-clamp-2">
                  {values.message || 'Your short message content will appear right here on user phones.'}
                </div>

                {values.imageUrl && (
                  <div className="rounded-xl overflow-hidden aspect-video max-h-32 w-full mt-2 border border-slate-700">
                    <img src={values.imageUrl} alt="preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            {/* 2. In-App Notification Bell Card */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-md space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 pb-1.5 border-b border-slate-100">
                <span className="flex items-center gap-1.5 text-slate-800">
                  <Bell className="w-3.5 h-3.5 text-amber-500" />
                  In-App Notification Drawer
                </span>
                <span className="text-[10px] text-emerald-600 font-bold">Unread</span>
              </div>

              <div className="flex items-start gap-3 pt-1">
                <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-[#C81E28] shrink-0 font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-900 leading-tight">
                    {values.title || 'Notification Title'}
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                    {values.message || 'Short message details.'}
                  </p>
                  {values.deepLink && (
                    <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-[#C81E28]">
                      <span>Destination: {values.deepLink}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Campaign Summary Box */}
            <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-3.5 text-xs text-amber-950 space-y-1.5">
              <div className="font-bold flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                Dispatch Safeguards Active
              </div>
              <p className="text-[11px] text-amber-900 leading-relaxed">
                Bulk sending is protected by campaign idempotency keys, duplicate execution locks, and background batch queues. Delivered notifications cannot be recalled.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer with Actions */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition cursor-pointer"
          >
            Cancel
          </button>

          <div className="flex flex-wrap items-center gap-2">
            {/* Test Send Button */}
            <button
              type="button"
              onClick={() => {
                if (validateForm()) {
                  onSendTest(buildPayload('DRAFT'));
                }
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <Send className="w-3.5 h-3.5 text-blue-600" />
              <span>Send Test</span>
            </button>

            {/* Save Draft Button */}
            <button
              type="button"
              onClick={() => {
                if (validateForm()) {
                  onSaveDraft(buildPayload('DRAFT'));
                }
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white transition cursor-pointer shadow-xs"
            >
              Save Draft
            </button>

            {/* Schedule or Send Now */}
            {values.isScheduled ? (
              <button
                type="button"
                onClick={() => {
                  if (validateForm()) {
                    onSchedule(buildPayload('SCHEDULED'));
                  }
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition cursor-pointer flex items-center gap-1.5 shadow-md font-black"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Schedule Campaign</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (validateForm()) {
                    onSendNow(buildPayload('QUEUED'));
                  }
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#C81E28] hover:bg-[#a61720] text-white transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-rose-900/20 font-black active:scale-95"
              >
                <Send className="w-3.5 h-3.5 text-amber-300" />
                <span>Send to {estimatedReach.toLocaleString('en-IN')} Users</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
