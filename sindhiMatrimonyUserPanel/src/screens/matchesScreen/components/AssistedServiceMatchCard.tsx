"use client";

import React, { memo } from "react";
import {
  AssistedServiceBadgeIcon,
  HandpickedMatchesIcon,
  RegularFollowupsIcon,
  MonthlyMeetingsIcon,
} from "@/screens/dashboardScreen/components/DashboardIcons";

export interface AssistedServiceMatchCardProps {
  onGetAssistedService?: () => void;
  className?: string;
}

const BENEFITS = [
  {
    id: "handpicked",
    title: "Handpicked Compatible Matches",
    icon: <HandpickedMatchesIcon size={18} color="#F6D580" />,
  },
  {
    id: "followups",
    title: "Regular Follow-ups with Prospects",
    icon: <RegularFollowupsIcon size={18} color="#F6D580" />,
  },
  {
    id: "meetings",
    title: "Guaranteed Monthly Meetings with Interested Prospects",
    icon: <MonthlyMeetingsIcon size={18} color="#F6D580" />,
  },
];

const AssistedServiceMatchCardComponent: React.FC<AssistedServiceMatchCardProps> = ({
  onGetAssistedService,
  className = "",
}) => {
  return (
    <section
      aria-label="Assisted Service Matchmaking Banner"
      className={`relative overflow-hidden w-full bg-gradient-to-br from-[#063326] via-[#094132] to-[#04241A] rounded-2xl border border-[#165645] shadow-md p-5 sm:p-7 ${className}`}
    >
      {/* Background glow effects */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left Column: Information & Points */}
        <div className="flex-1 max-w-xl">
          {/* Gold Badge */}
          <div className="inline-flex items-center gap-2 mb-2">
            <AssistedServiceBadgeIcon size={20} />
            <span className="text-xs sm:text-sm font-bold tracking-wide text-[#F6D580] uppercase">
              Assisted Service
            </span>
          </div>

          {/* Heading */}
          <h3 className="text-base sm:text-xl font-bold text-white font-heading leading-tight">
            Find your match{" "}
            <span className="text-[#FFCA28] font-extrabold">3X Faster</span> with a
            Dedicated Relationship Manager
          </h3>

          {/* Outlined Benefits Box */}
          <div className="mt-3.5 p-3.5 sm:p-4 rounded-xl border border-[#1B6350] bg-[#0A3D2F]/70 backdrop-blur-xs space-y-2.5">
            {BENEFITS.map((benefit) => (
              <div key={benefit.id} className="flex items-center gap-2.5">
                <div className="shrink-0">{benefit.icon}</div>
                <span className="text-xs sm:text-[13px] font-medium text-emerald-50">
                  {benefit.title}
                </span>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <div className="mt-4 sm:mt-5">
            <button
              type="button"
              onClick={onGetAssistedService}
              className="px-6 py-2 rounded-full text-xs sm:text-sm font-bold text-[#11261F] bg-gradient-to-r from-[#FCD34D] via-[#F59E0B] to-[#D97706] hover:from-[#FDE68A] hover:via-[#FBBF24] hover:to-[#B45309] active:scale-[0.98] shadow-md hover:shadow-amber-500/30 transition-all duration-200 cursor-pointer inline-flex items-center justify-center tracking-wide"
            >
              Get Your Relationship Manager
            </button>
          </div>
        </div>

        {/* Right Column: Relationship Manager Photo */}
        <div className="relative shrink-0 flex items-center justify-center md:justify-end self-center md:self-auto w-full md:w-56 h-56 sm:h-64">
          {/* Ambient emerald backlight */}
          <div className="absolute inset-0 bg-radial from-emerald-400/20 via-emerald-600/10 to-transparent rounded-full filter blur-xl" />

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/dashboard/assisted_manager_woman.jpg"
            alt="Relationship Manager"
            className="relative z-10 w-44 sm:w-52 h-56 sm:h-64 object-cover object-top rounded-xl shadow-xl border border-emerald-400/20"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </section>
  );
};

export const AssistedServiceMatchCard = memo(AssistedServiceMatchCardComponent);
AssistedServiceMatchCard.displayName = "AssistedServiceMatchCard";
export default AssistedServiceMatchCard;
