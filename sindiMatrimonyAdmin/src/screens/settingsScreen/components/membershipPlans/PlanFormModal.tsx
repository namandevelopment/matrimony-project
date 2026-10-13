import React, { useEffect, memo, useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import type { MembershipPlan, PlanCategory, PlanFormValues } from './types';
import { useInputs } from '../../../../customHooks/useInputs';
import { CustomTextInput } from '../../../../components/CustomTextInput';
import { CustomDropDown } from '../../../../components/CustomDropDown';

interface PlanFormModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  initialPlan?: MembershipPlan | null;
  defaultCategory?: PlanCategory;
  onClose: () => void;
  onSave: (values: PlanFormValues, planId?: string) => void;
}

export interface PlanFormInputValues {
  title: string;
  subtitle: string;
  price: string;
  offerPrice: string;
  category: PlanCategory;
  duration: string;
  featuresText: string;
  highlighted: boolean;
  badge: string;
  active: boolean;
}

const getInitialValues = (
  mode: 'create' | 'edit',
  initialPlan?: MembershipPlan | null,
  defaultCategory: PlanCategory = 'SELF_SERVICE'
): PlanFormInputValues => {
  if (mode === 'edit' && initialPlan) {
    return {
      title: initialPlan.title,
      subtitle: initialPlan.subtitle,
      price: String(initialPlan.price),
      offerPrice: String(initialPlan.offerPrice),
      category: initialPlan.category,
      duration: initialPlan.duration,
      featuresText: initialPlan.features.join('\n'),
      highlighted: Boolean(initialPlan.highlighted),
      badge: initialPlan.badge || '',
      active: initialPlan.active,
    };
  }
  return {
    title: '',
    subtitle: '',
    price: '',
    offerPrice: '',
    category: defaultCategory,
    duration: '3 Month',
    featuresText: 'View 100 contacts\nSend 60 interests\nShortlist 40 profiles',
    highlighted: false,
    badge: '',
    active: true,
  };
};

export const PlanFormModal: React.FC<PlanFormModalProps> = memo(({
  isOpen,
  mode,
  initialPlan,
  defaultCategory = 'SELF_SERVICE',
  onClose,
  onSave,
}) => {
  const [submitted, setSubmitted] = useState(false);

  const {
    values,
    setFieldValue,
    errors,
    touched,
    bind,
    bindCheckbox,
    validateForm,
    reset,
  } = useInputs<PlanFormInputValues>(
    () => getInitialValues(mode, initialPlan, defaultCategory),
    {
      validate: (v) => {
        const errs: Partial<Record<keyof PlanFormInputValues, string>> = {};

        if (!v.title.trim()) {
          errs.title = 'Plan title is required';
        }

        if (!v.subtitle.trim()) {
          errs.subtitle = 'Subtitle is required';
        }

        if (v.price === '' || isNaN(Number(v.price)) || Number(v.price) < 0) {
          errs.price = 'Please enter a valid price';
        }

        if (v.offerPrice === '' || isNaN(Number(v.offerPrice)) || Number(v.offerPrice) < 0) {
          errs.offerPrice = 'Please enter a valid offer price';
        } else if (Number(v.offerPrice) > Number(v.price) && Number(v.price) > 0) {
          errs.offerPrice = 'Offer price should typically not exceed regular price';
        }

        if (!v.duration.trim()) {
          errs.duration = 'Duration is required (e.g. 3 Month, 6 Month)';
        }

        const featureLines = v.featuresText
          .split('\n')
          .map((f) => f.trim())
          .filter(Boolean);

        if (featureLines.length === 0) {
          errs.featuresText = 'Please enter at least one plan feature';
        }

        return errs;
      },
      validateOnChange: true,
      validateOnBlur: true,
    }
  );

  useEffect(() => {
    if (isOpen) {
      reset(getInitialValues(mode, initialPlan, defaultCategory));
      setSubmitted(false);
    }
  }, [isOpen, mode, initialPlan, defaultCategory, reset]);

  if (!isOpen) return null;

  const getFieldError = (field: keyof PlanFormInputValues) => {
    return touched[field] || submitted ? errors[field] : undefined;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (!validateForm()) return;

    onSave(
      {
        title: values.title.trim(),
        subtitle: values.subtitle.trim(),
        price: Number(values.price),
        offerPrice: Number(values.offerPrice),
        category: values.category,
        duration: values.duration.trim(),
        featuresText: values.featuresText,
        highlighted: values.highlighted,
        badge: values.badge.trim(),
        active: values.active,
      },
      initialPlan?.id
    );
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-2xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Red Header */}
        <div className="bg-[#C81E28] px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold tracking-tight">
              {mode === 'edit' ? 'Edit Membership Plan' : 'Add New Membership Plan'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} noValidate className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Plan Title */}
          <CustomTextInput
            label="Plan Title"
            value={values.title}
            onChange={(e) => setFieldValue('title', e.target.value)}
            placeholder="e.g. GOLD, SILVER, VIP ELITE"
            error={getFieldError('title')}
            size="sm"
          />

          {/* Subtitle */}
          <CustomTextInput
            label="Subtitle"
            value={values.subtitle}
            onChange={(e) => setFieldValue('subtitle', e.target.value)}
            placeholder="e.g. Best Value! or SILVER or Dedicated Matchmaker"
            error={getFieldError('subtitle')}
            size="sm"
          />

          {/* Price & Offer Price Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CustomTextInput
              label="Price (₹)"
              type="number"
              min="0"
              step="1"
              value={values.price}
              onChange={(e) => setFieldValue('price', e.target.value)}
              placeholder="4600"
              error={getFieldError('price')}
              size="sm"
            />

            <CustomTextInput
              label="OfferPrice (₹)"
              type="number"
              min="0"
              step="1"
              value={values.offerPrice}
              onChange={(e) => setFieldValue('offerPrice', e.target.value)}
              placeholder="2599"
              error={getFieldError('offerPrice')}
              size="sm"
            />
          </div>

          {/* Category Dropdown */}
          <CustomDropDown
            label="Plan Category"
            value={values.category}
            onChange={(val) => setFieldValue('category', val as PlanCategory)}
            options={[
              { value: 'SELF_SERVICE', label: 'Self Service' },
              { value: 'ASSIST_PLAN', label: 'Assist Plan' },
            ]}
            size="sm"
          />

          {/* Duration */}
          <CustomTextInput
            label="Duration"
            value={values.duration}
            onChange={(e) => setFieldValue('duration', e.target.value)}
            placeholder="e.g., 4 months"
            error={getFieldError('duration')}
            size="sm"
          />

          {/* Features */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Features (one per line)
            </label>
            <textarea
              rows={5}
              {...bind('featuresText')}
              placeholder="View 150 contacts&#10;Send 120 interests&#10;Shortlist 60 profiles&#10;Highlighted in match listings&#10;Priority customer support"
              className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition font-mono ${
                getFieldError('featuresText') ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200'
              }`}
            />
            {getFieldError('featuresText') && (
              <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{getFieldError('featuresText')}</span>
              </p>
            )}
            <p className="text-[10px] text-slate-400 mt-1">
              Tip: Prefix with &quot;No &quot; (e.g. &quot;No contact details&quot;) to mark features as excluded.
            </p>
          </div>

          {/* Additional Options */}
          <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200/70 cursor-pointer">
              <input
                {...bindCheckbox('highlighted')}
                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
              />
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  Crimson Red Highlight
                </span>
                <span className="text-[10px] text-slate-500">
                  Styles this card in bold red
                </span>
              </div>
            </label>

            <label className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200/70 cursor-pointer">
              <input
                {...bindCheckbox('active')}
                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
              />
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  Active Tier
                </span>
                <span className="text-[10px] text-slate-500">
                  Visible to users in registration & portal
                </span>
              </div>
            </label>
          </div>

          {/* Badge text */}
          <CustomTextInput
            label="Badge Label (Optional)"
            value={values.badge}
            onChange={(e) => setFieldValue('badge', e.target.value)}
            placeholder="e.g. Best Value! or Most Popular"
            size="sm"
          />

          {/* Buttons Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#C81E28] hover:bg-[#a61720] text-white shadow-sm hover:shadow-md transition cursor-pointer"
            >
              {mode === 'edit' ? 'Update Membership Plan' : 'Save Membership Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

PlanFormModal.displayName = 'PlanFormModal';
