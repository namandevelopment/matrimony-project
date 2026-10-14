"use client";

import React, { memo } from "react";
import {
  MedalRibbonIcon,
  InterlockedRingsIcon,
  TrophyStarIcon,
  VerifiedShieldIcon,
  LocationBranchIcon,
} from "./Icons";

interface TrustBadgesProps {
  communityName?: string;
}

const TrustBadgesComponent: React.FC<TrustBadgesProps> = ({
  communityName = "Sindhis",
}) => {
  const badges = [
    {
      id: "years-service",
      icon: <MedalRibbonIcon className="w-12 h-12 sm:w-14 sm:h-14" color="#FF4A57" />,
      text: `10+ years of service in helping ${communityName} cherish the meaning of Happy Marriage`,
    },
    {
      id: "happy-couples",
      icon: <InterlockedRingsIcon className="w-12 h-12 sm:w-14 sm:h-14" color="#FF4A57" />,
      text: "2 Lakh+ people have found their life partner using our services",
    },
    {
      id: "growth-award",
      icon: <TrophyStarIcon className="w-12 h-12 sm:w-14 sm:h-14" color="#FF4A57" />,
      text: "2020's winner of 'India's Growth Champions Award' by The Economic Times",
    },
    {
      id: "verified-profiles",
      icon: <VerifiedShieldIcon className="w-12 h-12 sm:w-14 sm:h-14" color="#FF4A57" />,
      text: "1 Lakh+ genuine profiles with 100% verified phone numbers",
    },
    {
      id: "branches",
      icon: <LocationBranchIcon className="w-12 h-12 sm:w-14 sm:h-14" color="#FF4A57" />,
      text: "130+ branches across India to serve you better",
    },
  ];

  return (
    <section
      aria-label="Trust and Achievements"
      className="w-full bg-white border-y border-[#E9E9E9] py-8 sm:py-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* DESKTOP 5-COLUMN ROW (Matching Photo 2) */}
        <div className="hidden md:grid md:grid-cols-5 gap-6 lg:gap-8 items-start">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className="flex flex-col items-center text-center group p-2 transition-transform duration-200 hover:-translate-y-1"
            >
              <div className="mb-4 transition-transform duration-200 group-hover:scale-105">
                {badge.icon}
              </div>
              <p className="text-[13px] lg:text-[14px] text-[#333333] leading-relaxed font-normal">
                {badge.text}
              </p>
            </div>
          ))}
        </div>

        {/* MOBILE & TABLET STACKED LIST (Matching Photo 4) */}
        <div className="md:hidden space-y-6 sm:space-y-7">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className="flex items-center gap-4 sm:gap-5 p-2"
            >
              <div className="shrink-0">
                {badge.icon}
              </div>
              <p className="text-sm sm:text-base text-[#1A1A1A] font-medium leading-snug">
                {badge.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const TrustBadges = memo(TrustBadgesComponent);
TrustBadges.displayName = "TrustBadges";
