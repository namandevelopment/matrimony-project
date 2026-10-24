"use client";

import React, { memo } from "react";
import { Check, Crown, Zap, ShieldCheck } from "lucide-react";
import { PlanItem } from "../types";

export interface PlanCardProps {
  plan: PlanItem;
  isSelected?: boolean;
  onSelect: (plan: PlanItem) => void;
  isProcessing?: boolean;
}

export const PlanCard: React.FC<PlanCardProps> = memo(
  ({ plan, isSelected = false, onSelect, isProcessing = false }) => {
    const isPopular = Boolean(plan.isPopular || plan.badge === "MOST POPULAR");
    const perMonth = Math.round(plan.priceINR / Math.max(1, plan.durationMonths));

    return (
      <div
        className={`relative flex flex-col justify-between rounded-2xl p-6 transition-all duration-200 border bg-white ${
          isPopular
            ? "border-[#DB2F3C] ring-2 ring-[#DB2F3C]/20 shadow-lg"
            : isSelected
            ? "border-stone-800 shadow-md"
            : "border-stone-200 hover:border-stone-300 shadow-xs"
        }`}
      >
        {plan.badge && (
          <span
            className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider text-white shadow-xs ${
              isPopular ? "bg-[#DB2F3C]" : "bg-stone-800"
            }`}
          >
            {plan.badge}
          </span>
        )}

        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <h3 className="text-lg font-bold text-stone-900">{plan.name}</h3>
            {isPopular ? (
              <Crown className="w-5 h-5 text-amber-500 fill-amber-500" />
            ) : (
              <Zap className="w-5 h-5 text-stone-400" />
            )}
          </div>

          <p className="text-xs text-stone-500 min-h-[32px] leading-relaxed">
            {plan.tagline}
          </p>

          <div className="my-5 pb-5 border-b border-stone-100">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-stone-900 tracking-tight">
                ₹{plan.priceINR.toLocaleString("en-IN")}
              </span>
              {plan.originalPriceINR > plan.priceINR && (
                <span className="text-sm text-stone-400 line-through">
                  ₹{plan.originalPriceINR.toLocaleString("en-IN")}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-semibold text-stone-600">
                ₹{perMonth.toLocaleString("en-IN")}/month
              </span>
              {plan.discountPercentage > 0 && (
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700">
                  {plan.discountPercentage}% OFF
                </span>
              )}
            </div>
          </div>

          <ul className="space-y-3 mb-6">
            {plan.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-stone-700">
                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
                <span className="leading-snug">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <button
          type="button"
          onClick={() => onSelect(plan)}
          disabled={isProcessing}
          className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all shadow-xs cursor-pointer active:scale-[0.98] disabled:opacity-50 ${
            isPopular
              ? "bg-[#DB2F3C] hover:bg-[#B71F2A] text-white hover:shadow-md hover:shadow-red-500/20"
              : "bg-stone-900 hover:bg-stone-800 text-white"
          }`}
        >
          {isProcessing ? "Processing..." : `Upgrade to ${plan.name.split(" ")[0]}`}
        </button>
      </div>
    );
  }
);

PlanCard.displayName = "PlanCard";
