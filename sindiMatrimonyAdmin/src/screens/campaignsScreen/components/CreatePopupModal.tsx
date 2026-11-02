import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Sparkles,
  Percent,
  ShieldCheck,
  Smartphone,
  RotateCcw,
  Wifi,
  Battery,
  Bell,
  Heart,
  Search as SearchIcon,
  User,
  Home,
  CheckCircle2,
} from 'lucide-react';
import {
  type InAppPopup,
  type TargetAudience,
  type PlatformTarget,
  type PopupPlacement,
  type FrequencyPolicy,
  type DismissalPolicy,
  campaignService,
} from '../../../services/campaignService';
import { CustomTextInput } from '../../../components/CustomTextInput';
import { CustomDropDown } from '../../../components/CustomDropDown';
import { useInputs } from '../../../customHooks/useInputs';

interface CreatePopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    popupData: Omit<
      InAppPopup,
      'id' | 'createdAt' | 'impressionsCount' | 'uniqueUsersReached' | 'dismissCount' | 'ctaClicksCount'
    >
  ) => void;
  initialData?: InAppPopup | null;
}

const SAMPLE_BANNERS = [
  {
    name: 'Diwali Festive Lights',
    url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Royal Wedding Sindhi',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Celebration Sparkles Gold',
    url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Trust & Shield Protection',
    url: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=800&q=80',
  },
];

export interface PopupFormValues {
  internalName: string;
  title: string;
  subtitle: string;
  message: string;
  bannerImageUrl: string;
  originalPrice: number | '';
  discountedPrice: number | '';
  discountLabel: string;
  couponCode: string;
  ctaText: string;
  ctaLink: string;
  ctaType: 'INTERNAL_SCREEN' | 'MEMBERSHIP_PLANS' | 'OFFER_DETAILS' | 'PROFILE_VERIFY' | 'EXTERNAL_URL';
  targetAudience: TargetAudience;
  platform: PlatformTarget;
  placement: PopupPlacement;
  priority: number;
  frequencyPolicy: FrequencyPolicy;
  maxImpressionsPerUser: number;
  dismissalPolicy: DismissalPolicy;
  linkedCampaignId: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

const getInitialPopupValues = (initialData?: InAppPopup | null): PopupFormValues => {
  if (initialData) {
    return {
      internalName: initialData.internalName || initialData.title,
      title: initialData.title,
      subtitle: initialData.subtitle || '',
      message: initialData.message,
      bannerImageUrl: initialData.bannerImageUrl,
      originalPrice: initialData.originalPrice ?? '',
      discountedPrice: initialData.discountedPrice ?? '',
      discountLabel: initialData.discountLabel || 'SPECIAL OFFER',
      couponCode: initialData.couponCode || '',
      ctaText: initialData.ctaText,
      ctaLink: initialData.ctaLink,
      ctaType: initialData.ctaType || 'MEMBERSHIP_PLANS',
      targetAudience: initialData.targetAudience,
      platform: initialData.platform,
      placement: initialData.placement || 'DASHBOARD',
      priority: initialData.priority,
      frequencyPolicy: initialData.frequencyPolicy || 'ONCE_PER_USER',
      maxImpressionsPerUser: initialData.maxImpressionsPerUser || 3,
      dismissalPolicy: initialData.dismissalPolicy || 'CROSS_DEVICE_PERSISTENT',
      linkedCampaignId: initialData.campaignId || '',
      startDate: initialData.startDate.split('T')[0],
      endDate: initialData.endDate.split('T')[0],
      isActive: initialData.isActive,
    };
  }
  return {
    internalName: 'Diwali 60% Gold Festive Banner',
    title: '🎆 Diwali Vivah Special — 60% OFF!',
    subtitle: 'Exclusive Sindhi Community Promotion',
    message:
      'Unlock unlimited parent contact numbers, instant Kundli match view & direct WhatsApp messaging at special festival rates.',
    bannerImageUrl: SAMPLE_BANNERS[0].url,
    originalPrice: 4999,
    discountedPrice: 1999,
    discountLabel: 'FLAT 60% OFF',
    couponCode: 'DIWALI60',
    ctaText: 'Claim Festive Plan @ ₹1,999',
    ctaLink: '/settings/membership-plans',
    ctaType: 'MEMBERSHIP_PLANS',
    targetAudience: 'FREE_USERS',
    platform: 'BOTH',
    placement: 'DASHBOARD',
    priority: 1,
    frequencyPolicy: 'ONCE_PER_DAY',
    maxImpressionsPerUser: 3,
    dismissalPolicy: 'CROSS_DEVICE_PERSISTENT',
    linkedCampaignId: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString().split('T')[0],
    isActive: true,
  };
};

export const CreatePopupModal: React.FC<CreatePopupModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const {
    values,
    setFieldValue,
    errors,
    touched,
    validateForm,
    reset,
  } = useInputs<PopupFormValues>(() => getInitialPopupValues(initialData), {
    validate: (vals) => {
      const errs: Partial<Record<keyof PopupFormValues, string>> = {};
      if (!vals.title.trim()) {
        errs.title = 'Title is required';
      }
      if (!vals.message.trim()) {
        errs.message = 'Message body is required';
      }
      if (!vals.bannerImageUrl.trim()) {
        errs.bannerImageUrl = 'Banner image is required';
      }
      return errs;
    },
    validateOnChange: true,
    validateOnBlur: true,
  });

  // Mobile Preview dismissal state simulation
  const [isPreviewDismissed, setIsPreviewDismissed] = useState(false);
  const lastOpenedIdRef = useRef<string | null | undefined>(undefined);
  const wasOpenRef = useRef<boolean>(false);

  // Available offers for linking
  const offers = campaignService.getOffers();

  useEffect(() => {
    const currentId = initialData ? (initialData.id || (initialData as any)._id) : 'create_new';
    if (isOpen && (!wasOpenRef.current || lastOpenedIdRef.current !== currentId)) {
      reset(getInitialPopupValues(initialData));
      setIsPreviewDismissed(false);
      lastOpenedIdRef.current = currentId;
    }
    wasOpenRef.current = isOpen;
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const discountPercent =
    values.originalPrice && values.discountedPrice && Number(values.originalPrice) > Number(values.discountedPrice)
      ? Math.round(((Number(values.originalPrice) - Number(values.discountedPrice)) / Number(values.originalPrice)) * 100)
      : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    onSave({
      internalName: values.internalName.trim() || values.title.trim(),
      title: values.title.trim(),
      subtitle: values.subtitle.trim(),
      message: values.message.trim(),
      bannerImageUrl: values.bannerImageUrl.trim(),
      originalPrice: values.originalPrice ? Number(values.originalPrice) : undefined,
      discountedPrice: values.discountedPrice ? Number(values.discountedPrice) : undefined,
      discountPercentage: discountPercent ?? undefined,
      currency: 'INR',
      discountLabel: values.discountLabel.trim() || 'SPECIAL OFFER',
      couponCode: values.couponCode.trim() || undefined,
      ctaText: values.ctaText.trim() || 'Claim Offer Now',
      ctaLink: values.ctaLink.trim() || '/settings/membership-plans',
      ctaType: values.ctaType,
      targetAudience: values.targetAudience,
      platform: values.platform,
      placement: values.placement,
      priority: Number(values.priority) || 1,
      frequencyPolicy: values.frequencyPolicy,
      maxImpressionsPerUser: Number(values.maxImpressionsPerUser) || 3,
      dismissalPolicy: values.dismissalPolicy,
      campaignId: values.linkedCampaignId || undefined,
      startDate: new Date(values.startDate).toISOString(),
      endDate: new Date(values.endDate).toISOString(),
      isActive: values.isActive,
      status: values.isActive ? 'ACTIVE' : 'PAUSED',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[94vh] flex flex-col overflow-hidden my-auto animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-300/30 flex items-center justify-center text-amber-300 font-bold shadow-inner">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                {initialData ? 'Edit In-App Popup' : 'Create Dynamic Promotional Popup'}
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#C81E28] text-white">
                  Modal Engine
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                Server-persisted dismissal, frequency capping, and live priority queues
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Left Form + Right Live Visual Mockup */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form: 7 cols */}
          <form onSubmit={handleSubmit} id="popup-form" className="lg:col-span-7 space-y-4">
            {/* Internal Name & Linked Campaign */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <CustomTextInput
                label="Internal Popup Name"
                value={values.internalName}
                onChange={(e) => setFieldValue('internalName', e.target.value)}
                error={touched.internalName ? errors.internalName : undefined}
                placeholder="e.g. Diwali Flash Gold 60%"
                size="sm"
                required
              />

              <div>
                <CustomDropDown
                  label="Linked Festival Campaign (Optional)"
                  value={values.linkedCampaignId}
                  onChange={(val) => setFieldValue('linkedCampaignId', String(val))}
                  options={[
                    { value: '', label: 'None (Independent Popup)' },
                    ...offers.map((o) => ({ value: o.id, label: o.festivalName })),
                  ]}
                  size="sm"
                />
              </div>
            </div>

            {/* Title & Subtitle */}
            <CustomTextInput
              label="Popup Headline Title"
              value={values.title}
              onChange={(e) => setFieldValue('title', e.target.value)}
              error={touched.title ? errors.title : undefined}
              placeholder="e.g. 🎆 Diwali Vivah Special — 60% OFF!"
              size="sm"
              required
            />

            <CustomTextInput
              label="Subtitle / Pill Tagline"
              value={values.subtitle}
              onChange={(e) => setFieldValue('subtitle', e.target.value)}
              placeholder="e.g. Exclusive Sindhi Community Offer"
              size="sm"
            />

            {/* Message Body */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Message Body *</label>
              <textarea
                value={values.message}
                onChange={(e) => setFieldValue('message', e.target.value)}
                rows={2}
                placeholder="Describe value proposition and festival perks..."
                className={`w-full px-3 py-2 text-xs rounded-xl border text-slate-700 leading-relaxed ${
                  touched.message && errors.message ? 'border-red-500' : 'border-slate-200'
                }`}
                required
              />
              {touched.message && errors.message && (
                <p className="text-[11px] text-red-600 mt-1">{errors.message}</p>
              )}
            </div>

            {/* Banner Creative */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Banner Image Creative *</label>
              <div className="grid grid-cols-4 gap-2 mb-2">
                {SAMPLE_BANNERS.map((banner) => (
                  <button
                    key={banner.name}
                    type="button"
                    onClick={() => setFieldValue('bannerImageUrl', banner.url)}
                    className={`relative rounded-xl overflow-hidden border-2 aspect-video transition cursor-pointer ${
                      values.bannerImageUrl === banner.url
                        ? 'border-[#C81E28] ring-2 ring-rose-300'
                        : 'border-slate-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={banner.url} alt={banner.name} className="w-full h-full object-cover" />
                    {values.bannerImageUrl === banner.url && (
                      <div className="absolute top-1 right-1 bg-[#C81E28] text-white p-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <CustomTextInput
                type="url"
                value={values.bannerImageUrl}
                onChange={(e) => setFieldValue('bannerImageUrl', e.target.value)}
                error={touched.bannerImageUrl ? errors.bannerImageUrl : undefined}
                placeholder="Or enter custom banner image URL (e.g. https://...)"
                size="sm"
                required
              />
            </div>

            {/* Pricing Override Box */}
            <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <Percent className="w-4 h-4 text-amber-600" />
                  Price Comparison & Discount Badge
                </span>
                {discountPercent && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#C81E28] text-white shadow-2xs">
                    Save {discountPercent}%
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <CustomTextInput
                  label="Original Price (₹)"
                  type="number"
                  value={values.originalPrice}
                  onChange={(e) => setFieldValue('originalPrice', e.target.value === '' ? '' : Number(e.target.value))}
                  size="sm"
                />
                <CustomTextInput
                  label="Festive Price (₹)"
                  type="number"
                  value={values.discountedPrice}
                  onChange={(e) => setFieldValue('discountedPrice', e.target.value === '' ? '' : Number(e.target.value))}
                  size="sm"
                />
                <CustomTextInput
                  label="Discount Badge Label"
                  value={values.discountLabel}
                  onChange={(e) => setFieldValue('discountLabel', e.target.value)}
                  placeholder="e.g. FLAT 60% OFF"
                  size="sm"
                />
              </div>
            </div>

            {/* CTA Configuration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <CustomTextInput
                label="CTA Button Text"
                value={values.ctaText}
                onChange={(e) => setFieldValue('ctaText', e.target.value)}
                placeholder="e.g. Claim Offer @ ₹1,999"
                size="sm"
                required
              />

              <CustomTextInput
                label="CTA Destination Route"
                value={values.ctaLink}
                onChange={(e) => setFieldValue('ctaLink', e.target.value)}
                placeholder="e.g. /settings/membership-plans"
                size="sm"
                required
              />
            </div>

            {/* Placements, Target Audience & Priority */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <CustomDropDown
                  label="Display Placement *"
                  value={values.placement}
                  onChange={(val) => setFieldValue('placement', val as PopupPlacement)}
                  options={[
                    { value: 'DASHBOARD', label: 'User Web Dashboard' },
                    { value: 'MOBILE_HOME', label: 'Mobile Home Screen' },
                    { value: 'MEMBERSHIP_SCREEN', label: 'Pricing Plans Screen' },
                    { value: 'PROFILE_SCREEN', label: 'Member Profile Screen' },
                  ]}
                  size="sm"
                />
              </div>

              <div>
                <CustomDropDown
                  label="Target Audience *"
                  value={values.targetAudience}
                  onChange={(val) => setFieldValue('targetAudience', val as TargetAudience)}
                  options={[
                    { value: 'ALL', label: 'All Users' },
                    { value: 'FREE_USERS', label: 'Free Non-Subscribers' },
                    { value: 'EXPIRED_MEMBERS', label: 'Expired VIP Profiles' },
                    { value: 'UNVERIFIED_PROFILES', label: 'Unverified KYC' },
                    { value: 'INACTIVE_30_DAYS', label: 'Inactive 30+ Days' },
                  ]}
                  size="sm"
                />
              </div>

              <div>
                <CustomDropDown
                  label="Priority Rank (1 = Top) *"
                  value={values.priority}
                  onChange={(val) => setFieldValue('priority', Number(val))}
                  options={[
                    { value: 1, label: 'Rank 1 (Highest / Overrides)' },
                    { value: 2, label: 'Rank 2 (Medium High)' },
                    { value: 3, label: 'Rank 3 (Standard)' },
                    { value: 4, label: 'Rank 4 (Low)' },
                  ]}
                  size="sm"
                />
              </div>
            </div>

            {/* Frequency Rules & Dismissal Persistence */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Dismissal Policy & Frequency Capping Rules
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <CustomDropDown
                    label="Frequency Rule"
                    value={values.frequencyPolicy}
                    onChange={(val) => setFieldValue('frequencyPolicy', val as FrequencyPolicy)}
                    options={[
                      { value: 'ONCE_PER_USER', label: 'Once Per User (Persistent)' },
                      { value: 'ONCE_PER_SESSION', label: 'Once Per Session' },
                      { value: 'ONCE_PER_DAY', label: 'Once Per Day' },
                      { value: 'EVERY_LOGIN', label: 'Every Eligible Login' },
                      { value: 'UNTIL_DISMISSED', label: 'Until Dismissed' },
                    ]}
                    size="sm"
                  />
                </div>

                <div>
                  <CustomDropDown
                    label="Dismissal Scope"
                    value={values.dismissalPolicy}
                    onChange={(val) => setFieldValue('dismissalPolicy', val as DismissalPolicy)}
                    options={[
                      { value: 'CROSS_DEVICE_PERSISTENT', label: 'Cross-Device (Server DB)' },
                      { value: 'PER_SESSION', label: 'Session Only' },
                      { value: 'PER_DAY', label: 'Daily Reset' },
                    ]}
                    size="sm"
                  />
                </div>

                <CustomTextInput
                  label="Max Impressions Cap"
                  type="number"
                  value={values.maxImpressionsPerUser}
                  onChange={(e) => setFieldValue('maxImpressionsPerUser', Number(e.target.value))}
                  min="1"
                  max="20"
                  size="sm"
                />
              </div>
            </div>

            {/* Dates & Status */}
            <div className="grid grid-cols-2 gap-3">
              <CustomTextInput
                label="Start Date"
                type="date"
                value={values.startDate}
                onChange={(e) => setFieldValue('startDate', e.target.value)}
                size="sm"
              />

              <CustomTextInput
                label="End Date"
                type="date"
                value={values.endDate}
                onChange={(e) => setFieldValue('endDate', e.target.value)}
                size="sm"
              />
            </div>
          </form>

          {/* Right Live Mobile Client Mockup Preview: 5 cols */}
          <div className="lg:col-span-5 flex flex-col items-center justify-start space-y-3">
            <div className="w-full flex items-center justify-between pb-1.5 border-b border-slate-200">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-[#C81E28]" />
                Interactive Mobile Device Preview
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500 font-bold px-2 py-0.5 rounded-md bg-slate-100">
                  Priority #{values.priority}
                </span>
                {isPreviewDismissed && (
                  <button
                    type="button"
                    onClick={() => setIsPreviewDismissed(false)}
                    className="text-[10px] font-bold text-[#C81E28] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Smartphone Outer Chassis */}
            <div className="relative w-full max-w-[320px] rounded-[48px] bg-slate-950 p-2.5 shadow-2xl border-[6px] border-slate-900 ring-1 ring-slate-800 transition-all select-none">
              {/* Phone Screen Container */}
              <div className="relative w-full h-[580px] bg-slate-900 rounded-[38px] overflow-hidden flex flex-col justify-between">
                
                {/* Dynamic Island Pill */}
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-40 flex items-center justify-between px-2.5 shadow-sm">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-blue-500/80" />
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                </div>

                {/* Status Bar */}
                <div className="relative z-30 pt-3 px-6 flex items-center justify-between text-white text-[10px] font-bold">
                  <span>9:41</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[8px] font-mono px-1 py-0.2 bg-white/20 rounded font-black">5G</span>
                    <Wifi className="w-3 h-3" />
                    <Battery className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                </div>

                {/* Background App Screen (Mini Sindhi Matrimony App Mockup) */}
                <div className="absolute inset-0 pt-10 pb-14 overflow-hidden flex flex-col justify-between bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white">
                  {/* Mini App Header */}
                  <div className="px-4 py-2 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-[#C81E28] flex items-center justify-center text-[10px] font-black text-amber-300 shadow-xs">
                        ੴ
                      </div>
                      <span className="text-xs font-black tracking-tight text-white">Sindhi Matrimony</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/70">
                      <SearchIcon className="w-3.5 h-3.5" />
                      <Bell className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* App Feed Mock Content */}
                  <div className="p-3 space-y-2.5 opacity-40 blur-[0.5px]">
                    <div className="text-[11px] font-extrabold text-white/90">
                      Jai Jhulelal 🙏 <span className="text-amber-400">Rahul Lalwani</span>
                    </div>

                    {/* Match Card Mockup */}
                    <div className="bg-white/10 rounded-2xl p-2.5 border border-white/15 space-y-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white font-bold text-xs shadow-inner">
                          VK
                        </div>
                        <div className="space-y-0.5 text-left">
                          <div className="text-xs font-bold text-white flex items-center gap-1">
                            Vandana K. (26)
                            <span className="text-[9px] text-emerald-400 font-extrabold">94%</span>
                          </div>
                          <div className="text-[10px] text-white/70">CA, Ahmedabad • Gotra: Bakhru</div>
                          <div className="text-[9px] text-amber-300 font-semibold">Verified Sindhi Family</div>
                        </div>
                      </div>
                    </div>

                    {/* Secondary Match Card Mockup */}
                    <div className="bg-white/10 rounded-2xl p-2.5 border border-white/15 space-y-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-inner">
                          PS
                        </div>
                        <div className="space-y-0.5 text-left">
                          <div className="text-xs font-bold text-white flex items-center gap-1">
                            Pooja S. (25)
                            <span className="text-[9px] text-emerald-400 font-extrabold">91%</span>
                          </div>
                          <div className="text-[10px] text-white/70">Software Engineer, Mumbai</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* App Bottom Tab Navigation */}
                  <div className="px-5 py-2 border-t border-white/10 flex items-center justify-between text-white/50 text-[9px] bg-slate-950/80">
                    <div className="flex flex-col items-center gap-0.5 text-[#C81E28] font-bold">
                      <Home className="w-3.5 h-3.5" />
                      <span>Home</span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5">
                      <Heart className="w-3.5 h-3.5" />
                      <span>Matches</span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5">
                      <SearchIcon className="w-3.5 h-3.5" />
                      <span>Search</span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5">
                      <User className="w-3.5 h-3.5" />
                      <span>Profile</span>
                    </div>
                  </div>
                </div>

                {/* Overlaid Promotional Popup Modal */}
                <div className="absolute inset-0 z-30 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3">
                  {isPreviewDismissed ? (
                    /* Dismissed State (Simulating Ludo King Day-Cap Behavior) */
                    <div className="bg-slate-900/95 border border-white/20 rounded-2xl p-4 text-center max-w-[260px] w-full space-y-3 shadow-2xl animate-scale-up text-white">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 mx-auto flex items-center justify-center">
                        <X className="w-5 h-5 stroke-[2.5]" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-black text-white">Popup Dismissed for Today!</h4>
                        <p className="text-[10px] text-slate-300 leading-relaxed">
                          Ludo King Daily Rule Active: This user will not see this popup again today even upon re-login.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsPreviewDismissed(false)}
                        className="w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-[#C81E28] text-white text-[10px] font-black hover:opacity-95 transition shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Re-trigger Live Popup</span>
                      </button>
                    </div>
                  ) : (
                    /* Active Popup Card */
                    <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-[270px] w-full overflow-hidden text-center relative animate-scale-up flex flex-col">
                      {/* [X] Close button */}
                      <button
                        type="button"
                        onClick={() => setIsPreviewDismissed(true)}
                        title="Simulate Cross Dismissal (Ludo King Day Cap)"
                        className="absolute top-2.5 right-2.5 z-40 w-7 h-7 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-xs transition cursor-pointer shadow-md active:scale-90"
                      >
                        <X className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>

                      {/* Banner Image */}
                      <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                        <img
                          src={values.bannerImageUrl || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80'}
                          alt="banner"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        {values.discountLabel && (
                          <div className="absolute top-2 left-2 bg-[#C81E28] text-white px-2 py-0.5 rounded-full text-[9px] font-black shadow-md tracking-wider">
                            {values.discountLabel}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-3.5 space-y-2">
                        {values.subtitle && (
                          <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-100 text-amber-900 border border-amber-200">
                            {values.subtitle}
                          </span>
                        )}

                        <h3 className="text-xs font-black text-slate-900 leading-snug">
                          {values.title || 'Popup Title'}
                        </h3>

                        <p className="text-[10px] text-slate-600 leading-relaxed line-clamp-3">
                          {values.message || 'Your dynamic message text here.'}
                        </p>

                        {/* Pricing Comparison */}
                        {values.discountedPrice && (
                          <div className="bg-slate-50 border border-slate-200/80 rounded-xl py-1 px-2 flex items-center justify-center gap-2">
                            {values.originalPrice && (
                              <span className="text-[10px] text-slate-400 line-through font-semibold">
                                ₹{Number(values.originalPrice).toLocaleString('en-IN')}
                              </span>
                            )}
                            <span className="text-sm font-black text-emerald-600">
                              ₹{Number(values.discountedPrice).toLocaleString('en-IN')}
                            </span>
                            {values.couponCode && (
                              <span className="text-[9px] bg-rose-50 border border-rose-200 text-rose-700 px-1.5 py-0.5 rounded-md font-mono font-bold">
                                {values.couponCode}
                              </span>
                            )}
                          </div>
                        )}

                        {/* CTA Button */}
                        <button
                          type="button"
                          className="w-full py-2 px-3 rounded-xl text-[11px] font-black text-white bg-gradient-to-r from-[#991B1B] via-[#C81E28] to-[#E11D48] shadow-md shadow-rose-900/20 hover:opacity-95 transition cursor-pointer"
                        >
                          {values.ctaText || 'Claim Offer'}
                        </button>

                        <div className="text-[9px] text-slate-400 font-medium">
                          Tap [X] above to test 1-day dismissal
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Home Indicator Bar */}
                <div className="relative z-30 pb-1.5 flex justify-center">
                  <div className="w-28 h-1 bg-white/40 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            form="popup-form"
            className="px-6 py-2.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 hover:bg-black shadow-md transition cursor-pointer flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{initialData ? 'Update Popup' : 'Publish Promotional Popup'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
