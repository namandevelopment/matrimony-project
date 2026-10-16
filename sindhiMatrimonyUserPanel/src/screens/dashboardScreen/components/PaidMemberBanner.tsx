"use client";

import React, { memo } from "react";
import {
  CallWhatsAppFeatureIcon,
  UnlimitedMessagesFeatureIcon,
  HigherResponseFeatureIcon,
  HoroscopeMatchFeatureIcon,
} from "./DashboardIcons";

export interface PaidMemberBannerProps {
  discountPercent?: number;
  onUpgradeClick?: () => void;
  className?: string;
}

const PAID_FEATURES = [
  {
    id: "call_whatsapp",
    title: "Call/WhatsApp matches",
    icon: <CallWhatsAppFeatureIcon size={22} />,
  },
  {
    id: "unlimited_messages",
    title: "Unlimited messages",
    icon: <UnlimitedMessagesFeatureIcon size={22} />,
  },
  {
    id: "higher_response",
    title: "Higher chances of response",
    icon: <HigherResponseFeatureIcon size={22} />,
  },
  {
    id: "horoscope_match",
    title: "View and match horoscopes",
    icon: <HoroscopeMatchFeatureIcon size={22} />,
  },
];

const PaidMemberBannerComponent: React.FC<PaidMemberBannerProps> = ({
  discountPercent = 71,
  onUpgradeClick,
  className = "",
}) => {
  return (
    <section
      aria-label="Become a Paid Member Benefits Banner"
      className={`relative overflow-hidden w-full bg-white rounded-2xl border border-stone-200/90 shadow-sm p-5 sm:p-7 transition-all duration-200 hover:shadow-md ${className}`}
    >
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left Column: Heading, Discount & Features list */}
        <div className="flex-1 max-w-xl">
          <h3 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] font-heading tracking-tight">
            Become a paid member
          </h3>
          <p className="text-sm sm:text-base text-[#222222] mt-1 font-medium">
            Get up to{" "}
            <span className="font-extrabold text-[#DB2F3C] text-lg sm:text-xl">
              {discountPercent}% OFF
            </span>{" "}
            on paid membership!
          </p>

          {/* 4 Feature Items */}
          <div className="mt-4 space-y-2.5 sm:space-y-3">
            {PAID_FEATURES.map((feature) => (
              <div key={feature.id} className="flex items-center gap-3">
                {feature.icon}
                <span className="text-xs sm:text-[13px] font-medium text-[#2B2B2B]">
                  {feature.title}
                </span>
              </div>
            ))}
          </div>

          {/* Action Button: Linear Gradient */}
          <div className="mt-5 sm:mt-6">
            <button
              type="button"
              onClick={onUpgradeClick}
              className="px-8 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#FF4D5A] via-[#E53935] to-[#B71C1C] hover:from-[#FF5E6B] hover:via-[#EF4444] hover:to-[#C62828] active:scale-[0.98] shadow-md hover:shadow-red-500/30 transition-all duration-200 cursor-pointer inline-flex items-center justify-center tracking-wide"
            >
              See membership plans
            </button>
          </div>
        </div>

        {/* Right Column: Woman in peach salwar suit with welcoming gesture */}
        <div className="relative shrink-0 flex items-center justify-center md:justify-end self-center md:self-auto w-full md:w-64 h-60 sm:h-72">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/dashboard/paid_member_woman.jpg"
            alt="Sindhi Matrimony Member"
            className="relative z-10 w-auto h-60 sm:h-72 object-contain object-bottom drop-shadow-sm transition-transform duration-300 hover:scale-[1.02]"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </section>
  );
};

export const PaidMemberBanner = memo(PaidMemberBannerComponent);
PaidMemberBanner.displayName = "PaidMemberBanner";
export default PaidMemberBanner;
