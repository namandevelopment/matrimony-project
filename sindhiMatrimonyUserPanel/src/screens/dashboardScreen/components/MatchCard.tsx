"use client";

import React, { memo } from "react";
import Link from "next/link";
import { FemaleSilhouetteAvatar, MaleSilhouetteAvatar } from "./DashboardIcons";
import type { MatchProfile } from "../types";

export interface MatchCardProps {
  profile: MatchProfile;
  className?: string;
}

const MatchCardComponent: React.FC<MatchCardProps> = ({ profile, className = "" }) => {
  return (
    <Link
      href={`/matches/${profile.id}`}
      className={`group shrink-0 w-36 sm:w-40 flex flex-col bg-white rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-md cursor-pointer ${className}`}
    >
      {/* Profile Photo / Silhouette Container */}
      <div className="relative w-full h-44 sm:h-48 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-2xs">
        {profile.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.photoUrl}
            alt={profile.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
        ) : profile.isSilhouette ? (
          <FemaleSilhouetteAvatar className="transition-transform duration-300 group-hover:scale-105" />
        ) : (
          <MaleSilhouetteAvatar className="transition-transform duration-300 group-hover:scale-105" />
        )}

        {/* Subtle gradient overlay at bottom for contrast */}
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      </div>

      {/* Info: Name & Age, Height */}
      <div className="pt-2 px-1 text-left">
        <h4 className="text-xs sm:text-sm font-bold text-[#1A1A1A] group-hover:text-[#DB2F3C] transition-colors truncate">
          {profile.name}
        </h4>
        <p className="text-[11px] text-[#666666] mt-0.5 truncate">
          {profile.age} Yrs, {profile.height}
        </p>
      </div>
    </Link>
  );
};

export const MatchCard = memo(MatchCardComponent);
MatchCard.displayName = "MatchCard";
export default MatchCard;
