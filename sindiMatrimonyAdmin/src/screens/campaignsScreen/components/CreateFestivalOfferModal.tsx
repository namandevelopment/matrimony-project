import React, { useMemo, useEffect } from 'react';
import {
  X,
  Sparkles,
  Percent,
  Gift,
  CheckCircle2,
} from 'lucide-react';
import {
  type FestivalOffer,
  type DiscountType,
  type PlanRateOverride,
  campaignService,
} from '../../../services/campaignService';
import { useInputs } from '../../../customHooks/useInputs';

interface CreateFestivalOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (offerData: Omit<FestivalOffer, 'id' | 'createdAt' | 'currentRedemptions'>) => void;
  initialData?: FestivalOffer | null;
}

const FESTIVAL_PRESETS = [
  'Diwali Mahotsav',
  'Cheti Chand (Sindhi New Year)',
  'Holi Dhuleti Special',
  'Navratri Vivah Utsav',
  'Raksha Bandhan Mahasale',
  'New Year Special Pass',
  'Independence Day Offer',
  'Eid Celebrations',
  'Teej Festival Special',
  'Custom Occasion',
];

const DEFAULT_MEMBERSHIP_PLANS: PlanRateOverride[] = [
  {
    planId: 'gold_3m',
    planName: 'Sindhi Gold (3 Months)',
    originalPrice: 4999,
    festivalPrice: 1999,
    discountPercentage: 60,
    validityDays: 90,
  },
  {
    planId: 'platinum_6m',
    planName: 'Royal Sindhi Platinum (6 Months)',
    originalPrice: 9999,
    festivalPrice: 3499,
    discountPercentage: 65,
    validityDays: 180,
  },
  {
    planId: 'diamond_12m',
    planName: 'Sindhi Diamond VIP (12 Months)',
    originalPrice: 15999,
    festivalPrice: 5999,
    discountPercentage: 62,
    validityDays: 365,
  },
];

const SAMPLE_FESTIVAL_BANNERS = [
  {
    name: 'Diwali Festive Lights',
    url: 'https://images.unsplash.com/photo-1605705658604-582c6ec35b71?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Royal Sindhi Wedding Vivah',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Cheti Chand Jhulelal Celebrations',
    url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Golden Diyas Festive Joy',
    url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80',
  },
];

export interface FestivalOfferFormValues {
  festivalPreset: string;
  customFestivalName: string;
  tagline: string;
  badge: string;
  offerTitle: string;
  discountType: DiscountType;
  discountValue: number;
  couponCode: string;
  maxDiscount: number | '';
  minPurchaseAmount: number | '';
  bannerUrl: string;
  startDate: string;
  endDate: string;
  maxRedemptions: number | '';
  perUserLimit: number;
  isActive: boolean;
  termsText: string;
  autoCreateNotification: boolean;
  autoCreatePush: boolean;
  autoCreatePopup: boolean;
}

const getInitialOfferValues = (initialData?: FestivalOffer | null): FestivalOfferFormValues => ({
  festivalPreset: initialData?.festivalName || FESTIVAL_PRESETS[0],
  customFestivalName: '',
  tagline: initialData?.tagline || 'Special festive discounts on all verified matchmaking packages',
  badge: initialData?.badge || 'Festive Dhamaka 🔥',
  offerTitle: initialData?.offerTitle || 'Flat 60% Festive Discount on Elite Plans',
  discountType: initialData?.discountType || 'PERCENTAGE',
  discountValue: initialData?.discountValue ?? 60,
  couponCode: initialData?.couponCode || 'DIWALI60',
  maxDiscount: initialData?.maxDiscount ?? 10000,
  minPurchaseAmount: initialData?.minPurchaseAmount ?? 1999,
  bannerUrl: initialData?.bannerUrl || SAMPLE_FESTIVAL_BANNERS[0].url,
  startDate: initialData?.startDate
    ? initialData.startDate.split('T')[0]
    : new Date().toISOString().split('T')[0],
  endDate: initialData?.endDate
    ? initialData.endDate.split('T')[0]
    : new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString().split('T')[0],
  maxRedemptions: initialData?.maxRedemptions ?? 1000,
  perUserLimit: initialData?.perUserLimit ?? 1,
  isActive: initialData?.isActive ?? true,
  termsText:
    initialData?.terms?.join('\n') ||
    'Offer valid strictly till the countdown ends.\nIncludes unlimited verified mobile number access & Kundli matching.\nInstant activation upon online UPI / Netbanking payment.',
  autoCreateNotification: true,
  autoCreatePush: true,
  autoCreatePopup: true,
});

export const CreateFestivalOfferModal: React.FC<CreateFestivalOfferModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const {
    values,
    setFieldValue,
    validateForm,
    reset,
  } = useInputs<FestivalOfferFormValues>(() => getInitialOfferValues(initialData), {
    validate: (vals) => {
      const errs: Partial<Record<keyof FestivalOfferFormValues, string>> = {};
      if (!vals.festivalPreset.trim()) {
        errs.festivalPreset = 'Festival name is required';
      }
      if (!vals.tagline.trim()) {
        errs.tagline = 'Tagline is required';
      }
      return errs;
    },
    validateOnChange: true,
    validateOnBlur: true,
  });

  useEffect(() => {
    if (isOpen) {
      reset(getInitialOfferValues(initialData));
    }
  }, [initialData, isOpen, reset]);

  // Dynamic calculated plan overrides based on discount rules
  const calculatedPlanOverrides: PlanRateOverride[] = useMemo(() => {
    return DEFAULT_MEMBERSHIP_PLANS.map((plan) => {
      const calc = campaignService.calculateDiscountedPrice(
        plan.originalPrice,
        values.discountType,
        Number(values.discountValue) || 0,
        values.maxDiscount !== '' ? Number(values.maxDiscount) : undefined
      );
      return {
        ...plan,
        festivalPrice: calc.finalPrice,
        discountPercentage: calc.discountPercentage,
      };
    });
  }, [values.discountType, values.discountValue, values.maxDiscount]);

  if (!isOpen) return null;

  const effectiveFestivalName =
    values.festivalPreset === 'Custom Occasion'
      ? values.customFestivalName || 'Special Occasion'
      : values.festivalPreset;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!effectiveFestivalName.trim() || !values.tagline.trim()) {
      alert('Please fill Festival Name and Tagline');
      return;
    }

    const termsArray = values.termsText
      .split('\n')
      .map((t) => t.trim())
      .filter(Boolean);

    onSave({
      festivalName: effectiveFestivalName.trim(),
      tagline: values.tagline.trim(),
      badge: values.badge.trim() || 'Festive Offer',
      offerTitle: values.offerTitle.trim(),
      discountType: values.discountType,
      discountValue: Number(values.discountValue) || 0,
      couponCode: values.couponCode.trim().toUpperCase() || undefined,
      maxDiscount: values.maxDiscount !== '' ? Number(values.maxDiscount) : undefined,
      minPurchaseAmount: values.minPurchaseAmount !== '' ? Number(values.minPurchaseAmount) : undefined,
      eligibleSegments: ['ALL', 'FREE_USERS', 'EXPIRED_MEMBERS'],
      maxRedemptions: values.maxRedemptions !== '' ? Number(values.maxRedemptions) : undefined,
      perUserLimit: Number(values.perUserLimit) || 1,
      bannerUrl: values.bannerUrl.trim(),
      startDate: new Date(values.startDate).toISOString(),
      endDate: new Date(values.endDate).toISOString(),
      isActive: values.isActive,
      planOverrides: calculatedPlanOverrides,
      terms: termsArray,
      autoCreateNotification: values.autoCreateNotification,
      autoCreatePush: values.autoCreatePush,
      autoCreatePopup: values.autoCreatePopup,
      createdBy: 'Super Admin',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[94vh] flex flex-col overflow-hidden my-auto animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 bg-gradient-to-r from-amber-600 via-rose-600 to-[#C81E28] text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center text-amber-200 font-bold shadow-inner">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                {initialData ? 'Edit Festival Campaign' : 'Create Festival & Special Offer Campaign'}
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-rose-800 shadow-2xs">
                  Offer Engine
                </span>
              </h2>
              <p className="text-xs text-white/80 font-medium">
                Automated plan price calculation, coupon validation and client sync
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/15 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Row 1: Festival Preset & Title */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Festival / Occasion *
              </label>
              <select
                value={values.festivalPreset}
                onChange={(e) => setFieldValue('festivalPreset', e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-[#C81E28] font-bold text-slate-900 bg-white"
              >
                {FESTIVAL_PRESETS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>

              {values.festivalPreset === 'Custom Occasion' && (
                <input
                  type="text"
                  value={values.customFestivalName}
                  onChange={(e) => setFieldValue('customFestivalName', e.target.value)}
                  placeholder="Enter custom festival name..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 mt-2 font-semibold"
                  required
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Badge / Promotional Tagline *
              </label>
              <input
                type="text"
                value={values.badge}
                onChange={(e) => setFieldValue('badge', e.target.value)}
                placeholder="e.g. Diwali Dhamaka 🔥 or Auspicious 50% Off"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 font-bold text-rose-700"
                required
              />
            </div>
          </div>

          {/* Tagline & Offer Title */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Offer Title / Headline *
              </label>
              <input
                type="text"
                value={values.offerTitle}
                onChange={(e) => setFieldValue('offerTitle', e.target.value)}
                placeholder="e.g. Flat 60% Festive Discount on All Elite Plans"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 font-bold text-slate-900"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Campaign Subtitle / Tagline *
              </label>
              <input
                type="text"
                value={values.tagline}
                onChange={(e) => setFieldValue('tagline', e.target.value)}
                placeholder="e.g. Deepavali Special Flat 60% Off on all Sindhi Elite Membership Plans"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 text-slate-700 font-medium"
                required
              />
            </div>
          </div>

          {/* Pricing & Discount Engine */}
          <div className="bg-gradient-to-br from-amber-500/10 via-rose-50 to-orange-50 border border-amber-200 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-950 uppercase tracking-wider flex items-center gap-2">
                <Percent className="w-4 h-4 text-amber-600" />
                Backend Pricing & Discount Validation Rules
              </span>
              <span className="text-[11px] font-bold text-rose-800 bg-white px-2.5 py-0.5 rounded-full border border-rose-200 shadow-2xs">
                Recalculated on Server
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Discount Type *
                </label>
                <select
                  value={values.discountType}
                  onChange={(e) => setFieldValue('discountType', e.target.value as DiscountType)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-bold"
                >
                  <option value="PERCENTAGE">Percentage (%)</option>
                  <option value="FIXED_AMOUNT">Fixed Amount (₹)</option>
                  <option value="SPECIAL_PRICE">Special Price Flat (₹)</option>
                  <option value="FREE_TRIAL">100% Free Promotional</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Discount Value *
                </label>
                <input
                  type="number"
                  value={values.discountValue}
                  onChange={(e) => setFieldValue('discountValue', Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-extrabold text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Coupon Code (Optional)
                </label>
                <input
                  type="text"
                  value={values.couponCode}
                  onChange={(e) => setFieldValue('couponCode', e.target.value.toUpperCase())}
                  placeholder="e.g. DIWALI60"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-mono font-bold text-[#C81E28] uppercase"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Max Discount Cap (₹)
                </label>
                <input
                  type="number"
                  value={values.maxDiscount}
                  onChange={(e) => setFieldValue('maxDiscount', e.target.value ? Number(e.target.value) : '')}
                  placeholder="Optional Cap"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                />
              </div>
            </div>

            {/* Price Preview Table */}
            <div>
              <div className="text-[11px] font-bold text-slate-700 mb-2 flex items-center justify-between">
                <span>Calculated Real-Time Plan Rates Preview:</span>
                <span className="text-emerald-700 font-extrabold">Never Hardcoded</span>
              </div>
              <div className="bg-white rounded-xl border border-amber-200 overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-amber-100/60 border-b border-amber-200 text-slate-700 font-bold">
                    <tr>
                      <th className="py-2 px-3">Membership Plan</th>
                      <th className="py-2 px-3">Original Rate</th>
                      <th className="py-2 px-3">Applied Discount</th>
                      <th className="py-2 px-3">Calculated Offer Rate</th>
                      <th className="py-2 px-3">Member Savings</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {calculatedPlanOverrides.map((plan) => (
                      <tr key={plan.planId} className="hover:bg-amber-50/40">
                        <td className="py-2 px-3 font-bold text-slate-900">{plan.planName}</td>
                        <td className="py-2 px-3 text-slate-500 line-through">
                          ₹{plan.originalPrice.toLocaleString('en-IN')}
                        </td>
                        <td className="py-2 px-3 font-semibold text-rose-600">
                          {plan.discountPercentage}% OFF
                        </td>
                        <td className="py-2 px-3 font-black text-emerald-700 text-sm">
                          ₹{plan.festivalPrice.toLocaleString('en-IN')}
                        </td>
                        <td className="py-2 px-3 text-emerald-600 font-semibold">
                          Save ₹{(plan.originalPrice - plan.festivalPrice).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Banner Graphics */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Festive Banner Creative *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
              {SAMPLE_FESTIVAL_BANNERS.map((banner) => (
                <button
                  key={banner.name}
                  type="button"
                  onClick={() => setFieldValue('bannerUrl', banner.url)}
                  className={`relative rounded-xl overflow-hidden border-2 aspect-video transition cursor-pointer ${
                    values.bannerUrl === banner.url
                      ? 'border-[#C81E28] ring-2 ring-rose-300'
                      : 'border-slate-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={banner.url} alt={banner.name} className="w-full h-full object-cover" />
                  {values.bannerUrl === banner.url && (
                    <div className="absolute top-1 right-1 bg-[#C81E28] text-white p-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" />
                    </div>
                  )}
                </button>
              ))}
            </div>
            <input
              type="url"
              value={values.bannerUrl}
              onChange={(e) => setFieldValue('bannerUrl', e.target.value)}
              placeholder="Or enter custom image URL..."
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200"
              required
            />
          </div>

          {/* Dates, Redemptions & Limits */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Start Date *</label>
              <input
                type="date"
                value={values.startDate}
                onChange={(e) => setFieldValue('startDate', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">End Date *</label>
              <input
                type="date"
                value={values.endDate}
                onChange={(e) => setFieldValue('endDate', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Max Redemptions
              </label>
              <input
                type="number"
                value={values.maxRedemptions}
                onChange={(e) => setFieldValue('maxRedemptions', e.target.value ? Number(e.target.value) : '')}
                placeholder="e.g. 1000"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Per-User Limit *
              </label>
              <input
                type="number"
                value={values.perUserLimit}
                onChange={(e) => setFieldValue('perUserLimit', Number(e.target.value))}
                min={1}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                required
              />
            </div>
          </div>

          {/* Automation Integration Options */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#C81E28]" />
              Festival Campaign Automation Coordinates
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-2 cursor-pointer hover:border-slate-300">
                <input
                  type="checkbox"
                  checked={values.autoCreateNotification}
                  onChange={(e) => setFieldValue('autoCreateNotification', e.target.checked)}
                  className="rounded text-[#C81E28] focus:ring-[#C81E28]"
                />
                <span className="text-xs font-bold text-slate-800">
                  Auto-create In-App Bell Alert
                </span>
              </label>

              <label className="p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-2 cursor-pointer hover:border-slate-300">
                <input
                  type="checkbox"
                  checked={values.autoCreatePush}
                  onChange={(e) => setFieldValue('autoCreatePush', e.target.checked)}
                  className="rounded text-[#C81E28] focus:ring-[#C81E28]"
                />
                <span className="text-xs font-bold text-slate-800">
                  Auto-create Mobile Push (FCM)
                </span>
              </label>

              <label className="p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-2 cursor-pointer hover:border-slate-300">
                <input
                  type="checkbox"
                  checked={values.autoCreatePopup}
                  onChange={(e) => setFieldValue('autoCreatePopup', e.target.checked)}
                  className="rounded text-[#C81E28] focus:ring-[#C81E28]"
                />
                <span className="text-xs font-bold text-slate-800">
                  Auto-link Promotional Modal
                </span>
              </label>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Terms & Conditions (One per line)
            </label>
            <textarea
              value={values.termsText}
              onChange={(e) => setFieldValue('termsText', e.target.value)}
              rows={3}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 text-slate-700 leading-relaxed"
            />
          </div>

          {/* Footer */}
          <div className="bg-slate-50 border-t border-slate-200 -mx-6 -mb-6 p-4 px-6 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-amber-600 via-rose-600 to-[#C81E28] hover:opacity-95 shadow-md shadow-rose-900/20 active:scale-95 transition cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>{initialData ? 'Update Festival Campaign' : 'Save & Publish Festival Campaign'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
