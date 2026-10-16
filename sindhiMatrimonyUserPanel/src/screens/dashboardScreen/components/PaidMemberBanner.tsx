"use client";

import React, { memo } from "react";
import { CrownIcon } from "./DashboardIcons";

export interface PaidMemberBannerProps {
  discountPercent?: number;
  onUpgradeClick?: () => void;
  className?: string;
}

const PaidMemberBannerComponent: React.FC<PaidMemberBannerProps> = ({
  discountPercent = 71,
  onUpgradeClick,
  className = "",
}) => {
  return (
    <section
      aria-label="Paid Membership Special Offer"
      className={`relative overflow-hidden w-full bg-gradient-to-r from-[#FFF5F5] via-[#FFF8F6] to-white rounded-2xl border border-rose-200/60 shadow-xs p-5 sm:p-6 ${className}`}
    >
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-lg">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-100 text-[#DB2F3C] text-[11px] font-bold uppercase tracking-wider mb-2">
            <CrownIcon size={12} color="#DB2F3C" />
            <span>Limited Period Offer</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-[#1A1A1A] font-heading">
            Become a paid member
          </h3>
          <p className="text-sm text-[#444444] mt-1">
            Get up to{" "}
            <span className="font-extrabold text-[#DB2F3C] text-base">
              {discountPercent}% OFF
            </span>{" "}
            on paid membership!
          </p>

          <button
            type="button"
            onClick={onUpgradeClick}
            className="mt-4 px-6 py-2 rounded-full text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#FF4A57] via-[#DB2F3C] to-[#B71F2A] hover:brightness-105 active:scale-[0.98] shadow-md hover:shadow-red-500/20 transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <span>Upgrade Membership</span>
            <span>&rarr;</span>
          </button>
        </div>
      </div>

      {/* Right side illustration / bride photo graphic */}
      <div className="absolute right-0 bottom-0 top-0 w-36 sm:w-48 overflow-hidden pointer-events-none flex items-end justify-end">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80"
          alt="Sindhi Matrimony Member"
          className="w-32 sm:w-40 h-36 sm:h-44 object-cover rounded-tl-3xl opacity-90 shadow-lg"
          loading="lazy"
        />
        {/* Decorative ambient gradient */}
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/20 to-white pointer-events-none" />
      </div>
    </section>
  );
};

export const PaidMemberBanner = memo(PaidMemberBannerComponent);
PaidMemberBanner.displayName = "PaidMemberBanner";
export default PaidMemberBanner;
