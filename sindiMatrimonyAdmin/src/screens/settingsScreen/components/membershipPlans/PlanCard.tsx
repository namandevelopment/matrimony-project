import React, { memo } from 'react';
import {
  Check,
  X,
  Star,
  Edit3,
  Trash2,
  Sparkles,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import type { MembershipPlan } from './types';

interface PlanCardProps {
  plan: MembershipPlan;
  onEdit: (plan: MembershipPlan) => void;
  onDelete: (plan: MembershipPlan) => void;
  onToggleHighlight: (planId: string) => void;
  onToggleActive: (planId: string) => void;
}

export const PlanCard: React.FC<PlanCardProps> = memo(({
  plan,
  onEdit,
  onDelete,
  onToggleHighlight,
  onToggleActive,
}) => {
  const isRedCard = Boolean(plan.highlighted);
  const discountPercent =
    plan.price > 0 && plan.offerPrice < plan.price
      ? Math.round(((plan.price - plan.offerPrice) / plan.price) * 100)
      : 0;

  const formattedOriginalPrice = plan.price.toLocaleString('en-IN');
  const formattedOfferPrice = plan.offerPrice.toLocaleString('en-IN');

  return (
    <div
      className={`relative rounded-3xl transition-all duration-300 flex flex-col justify-between overflow-hidden ${
        isRedCard
          ? 'bg-gradient-to-b from-[#C81E28] via-[#B91C1C] to-[#88131B] text-white shadow-xl shadow-red-950/20 ring-1 ring-red-400/30'
          : 'bg-white text-slate-900 border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-red-200'
      } ${!plan.active ? 'opacity-60 saturate-50' : ''}`}
      style={{ minHeight: '520px' }}
    >
      {/* Top Admin Quick Actions Overlay */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
        {/* Toggle Highlight (Crimson Red Card) */}
        <button
          type="button"
          onClick={() => onToggleHighlight(plan.id)}
          title={isRedCard ? 'Remove red highlight' : 'Highlight in crimson red'}
          className={`p-1.5 rounded-lg transition cursor-pointer ${
            isRedCard
              ? 'bg-white/20 hover:bg-white/30 text-amber-300'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-amber-500'
          }`}
        >
          <Star
            className={`w-3.5 h-3.5 ${isRedCard ? 'fill-amber-300' : ''}`}
          />
        </button>

        {/* Toggle Active Status */}
        <button
          type="button"
          onClick={() => onToggleActive(plan.id)}
          title={plan.active ? 'Mark inactive' : 'Mark active'}
          className={`p-1.5 rounded-lg transition cursor-pointer ${
            isRedCard
              ? 'bg-white/20 hover:bg-white/30 text-white'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
          }`}
        >
          {plan.active ? (
            <ToggleRight className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <ToggleLeft className="w-3.5 h-3.5 text-slate-400" />
          )}
        </button>

        {/* Quick Delete */}
        <button
          type="button"
          onClick={() => onDelete(plan)}
          title="Delete plan"
          className={`p-1.5 rounded-lg transition cursor-pointer ${
            isRedCard
              ? 'bg-white/10 hover:bg-rose-500/80 text-white/80 hover:text-white'
              : 'bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600'
          }`}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Card Content */}
      <div className="p-7 pt-8 flex-1 flex flex-col">
        {/* Header Section: Title & Subtitle matching Screenshot 1 & 2 */}
        <div className="text-center mb-6">
          {plan.badge && (
            <div className="mb-2">
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider ${
                  isRedCard
                    ? 'bg-white/20 text-white border border-white/30'
                    : 'bg-rose-50 text-[#C81E28] border border-rose-200'
                }`}
              >
                <Sparkles className="w-2.5 h-2.5" />
                {plan.badge}
              </span>
            </div>
          )}

          <h2
            className={`text-2xl font-black uppercase tracking-wider ${
              isRedCard ? 'text-white' : 'text-[#C81E28]'
            }`}
          >
            {plan.title}
          </h2>

          <p
            className={`text-xs font-semibold mt-1 uppercase tracking-wider ${
              isRedCard ? 'text-white/80' : 'text-slate-400'
            }`}
          >
            {plan.subtitle}
          </p>
        </div>

        {/* Pricing Block matching Screenshot 1 & 2 */}
        <div className="mb-7 pb-6 border-b text-center relative border-dashed ${isRedCard ? 'border-white/20' : 'border-slate-200'}">
          {/* Strikethrough Original Price */}
          <div className="flex items-center justify-center gap-2 mb-1.5">
            <span
              className={`text-sm font-semibold line-through ${
                isRedCard ? 'text-white/70' : 'text-slate-400'
              }`}
            >
              ₹{formattedOriginalPrice}
            </span>
            <span
              className={`text-xs ${
                isRedCard ? 'text-white/70' : 'text-slate-400'
              }`}
            >
              /{plan.duration}
            </span>

            {discountPercent > 0 && (
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                  isRedCard
                    ? 'bg-amber-400 text-slate-950 font-extrabold'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Offer Price Large Display */}
          <div className="flex items-baseline justify-center gap-1">
            <span
              className={`text-3xl sm:text-4xl font-black tracking-tight ${
                isRedCard ? 'text-white' : 'text-slate-900'
              }`}
            >
              ₹{formattedOfferPrice}
            </span>
            <span
              className={`text-xs font-bold ${
                isRedCard ? 'text-white/80' : 'text-slate-500'
              }`}
            >
              /{plan.duration}
            </span>
          </div>
        </div>

        {/* Features List matching Screenshot 1 & 2 */}
        <div className="flex-1 space-y-3 mb-6">
          {plan.features.map((feature, idx) => {
            const isNegative = feature.trim().toLowerCase().startsWith('no ');

            return (
              <div key={idx} className="flex items-start gap-2.5 text-xs">
                {isNegative ? (
                  <span
                    className={`p-0.5 rounded-full shrink-0 mt-0.5 ${
                      isRedCard
                        ? 'bg-white/20 text-white/70'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    <X className="w-3 h-3" />
                  </span>
                ) : (
                  <span
                    className={`p-0.5 rounded-full shrink-0 mt-0.5 ${
                      isRedCard
                        ? 'bg-white/20 text-white'
                        : 'bg-emerald-50 text-emerald-600'
                    }`}
                  >
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}

                <span
                  className={`leading-relaxed ${
                    isNegative
                      ? isRedCard
                        ? 'text-white/60 line-through'
                        : 'text-slate-400 line-through'
                      : isRedCard
                      ? 'text-white font-medium'
                      : 'text-slate-700 font-medium'
                  }`}
                >
                  {feature}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Action: Edit Button matching Screenshot 1 & 2 */}
      <div className="p-7 pt-0">
        <button
          type="button"
          onClick={() => onEdit(plan)}
          className="w-full py-3 px-6 rounded-xl font-bold text-sm tracking-wide bg-[#FBBF24] hover:bg-[#F59E0B] active:bg-[#D97706] text-slate-950 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer flex items-center justify-center gap-2"
        >
          <Edit3 className="w-4 h-4" />
          <span>Edit</span>
        </button>
      </div>
    </div>
  );
});

PlanCard.displayName = 'PlanCard';
