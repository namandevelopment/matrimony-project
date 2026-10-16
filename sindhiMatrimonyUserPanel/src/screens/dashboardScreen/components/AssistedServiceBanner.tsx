"use client";

import React, { memo } from "react";
import {
  AssistedServiceBadgeIcon,
  HandpickedMatchesIcon,
  RegularFollowupsIcon,
  MonthlyMeetingsIcon,
} from "./DashboardIcons";

export interface AssistedServiceBannerProps {
  onGetAssistedService?: () => void;
  className?: string;
}

const ASSISTED_BENEFITS = [
  {
    id: "handpicked",
    title: "Handpicked Compatible Matches",
    icon: <HandpickedMatchesIcon size={20} color="#F6D580" />,
  },
  {
    id: "followups",
    title: "Regular Follow-ups with Prospects",
    icon: <RegularFollowupsIcon size={20} color="#F6D580" />,
  },
  {
    id: "meetings",
    title: "Guaranteed Monthly Meetings with Interested Prospects",
    icon: <MonthlyMeetingsIcon size={20} color="#F6D580" />,
  },
];

const AssistedServiceBannerComponent: React.FC<AssistedServiceBannerProps> = ({
  onGetAssistedService,
  className = "",
}) => {
  return (
    <section
      aria-label="Assisted Matrimony Service Banner"
      className={`relative overflow-hidden w-full bg-gradient-to-br from-[#062F24] via-[#093D30] to-[#042018] rounded-2xl border border-[#165645] shadow-lg p-5 sm:p-7 ${className}`}
    >
      {/* Decorative subtle mandala / luxury radial background pattern */}
      <div className="absolute -top-16 -right-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left Column: Assisted Service Content */}
        <div className="flex-1 max-w-xl">
          {/* Gold Badge */}
          <div className="inline-flex items-center gap-2 mb-2.5">
            <AssistedServiceBadgeIcon size={22} />
            <span className="text-xs sm:text-sm font-bold tracking-wide text-[#F6D580] uppercase">
              Assisted Service
            </span>
          </div>

          {/* Heading */}
          <h3 className="text-lg sm:text-2xl font-bold text-white font-heading leading-tight">
            Find your match{" "}
            <span className="text-[#FFCA28] font-extrabold">3X Faster</span> with
            a Dedicated Relationship Manager
          </h3>

          {/* Outlined Benefits Box */}
          <div className="mt-4 p-4 sm:p-5 rounded-xl border border-[#1B6350] bg-[#0A3D2F]/70 backdrop-blur-xs space-y-3">
            {ASSISTED_BENEFITS.map((benefit) => (
              <div key={benefit.id} className="flex items-center gap-3">
                <div className="shrink-0">{benefit.icon}</div>
                <span className="text-xs sm:text-[13px] font-medium text-emerald-50">
                  {benefit.title}
                </span>
              </div>
            ))}
          </div>

          {/* Action Button: Gold Linear Gradient */}
          <div className="mt-5 sm:mt-6">
            <button
              type="button"
              onClick={onGetAssistedService}
              className="px-8 py-2.5 rounded-full text-xs sm:text-sm font-bold text-[#11261F] bg-gradient-to-r from-[#FCD34D] via-[#F59E0B] to-[#D97706] hover:from-[#FDE68A] hover:via-[#FBBF24] hover:to-[#B45309] active:scale-[0.98] shadow-lg hover:shadow-amber-500/30 transition-all duration-200 cursor-pointer inline-flex items-center justify-center tracking-wide"
            >
              Get Your Relationship Manager
            </button>
          </div>
        </div>

        {/* Right Column: Professional Relationship Manager in Green Blazer */}
        <div className="relative shrink-0 flex items-center justify-center md:justify-end self-center md:self-auto w-full md:w-64 h-64 sm:h-80">
          {/* Ambient emerald backlight */}
          <div className="absolute inset-0 bg-radial from-emerald-400/25 via-emerald-600/10 to-transparent rounded-full filter blur-2xl" />

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/dashboard/assisted_manager_woman.jpg"
            alt="Relationship Manager"
            className="relative z-10 w-52 sm:w-60 h-64 sm:h-80 object-cover object-top rounded-2xl shadow-2xl border border-emerald-400/20 transition-transform duration-300 hover:scale-[1.02]"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </section>
  );
};

export const AssistedServiceBanner = memo(AssistedServiceBannerComponent);
AssistedServiceBanner.displayName = "AssistedServiceBanner";
export default AssistedServiceBanner;
