"use client";

import React, { memo, useState, useCallback } from "react";
import Link from "next/link";
import { Heart, MapPin, ShieldCheck, Check } from "lucide-react";
import { FemaleSilhouetteAvatar, MaleSilhouetteAvatar } from "./DashboardIcons";
import type { MatchProfile } from "../types";

export interface MatchCardProps {
  profile: MatchProfile;
  className?: string;
}

const MatchCardComponent: React.FC<MatchCardProps> = ({ profile, className = "" }) => {
  const [isShortlisted, setIsShortlisted] = useState(false);
  const [interestSent, setInterestSent] = useState(false);

  const handleToggleHeart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsShortlisted((prev) => !prev);
    },
    []
  );

  const handleConnect = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setInterestSent(true);
    },
    []
  );

  const profileUrl = profile.id.startsWith("BRH")
    ? `/matches/viewprofile/${profile.id}`
    : `/matches/viewprofile/BRH4486236`;

  return (
    <Link
      href={profileUrl}
      className={`group shrink-0 w-[310px] sm:w-[345px] md:w-[360px] h-[148px] sm:h-[154px] flex flex-row items-stretch bg-white rounded-2xl border border-stone-200/90 hover:border-[#DB2F3C]/45 shadow-2xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden cursor-pointer ${className}`}
    >
      {/* 1. Left: Profile Photo / Silhouette Container */}
      <div className="relative w-28 sm:w-32 md:w-36 shrink-0 h-full overflow-hidden bg-gradient-to-b from-[#FFF5F6] via-[#FCEAEF] to-[#F3D7DF]">
        {/* Verified Badge */}
        <div className="absolute top-2 left-2 z-10 pointer-events-none">
          <span className="inline-flex items-center gap-1 bg-white/95 backdrop-blur-md text-emerald-700 text-[9.5px] font-bold px-1.5 py-0.5 rounded-full shadow-2xs border border-emerald-100">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>Verified</span>
          </span>
        </div>

        {/* Floating Heart / Shortlist Button */}
        <button
          type="button"
          onClick={handleToggleHeart}
          aria-label={isShortlisted ? "Remove from shortlist" : "Add to shortlist"}
          className={`absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-white/90 backdrop-blur-md hover:bg-white shadow-2xs flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer ${
            isShortlisted ? "text-[#DB2F3C]" : "text-stone-400 hover:text-[#DB2F3C]"
          }`}
        >
          <Heart
            className={`w-3 h-3 transition-colors ${
              isShortlisted ? "fill-[#DB2F3C] text-[#DB2F3C]" : "fill-none"
            }`}
          />
        </button>

        {/* Photo Image or Classic Silhouette Avatar */}
        {profile.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.photoUrl}
            alt={profile.name}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
        ) : profile.isSilhouette ? (
          <FemaleSilhouetteAvatar className="transition-transform duration-500 ease-out group-hover:scale-105" />
        ) : (
          <MaleSilhouetteAvatar className="transition-transform duration-500 ease-out group-hover:scale-105" />
        )}

        {/* Subtle Bottom Vignette Gradient */}
        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      </div>

      {/* 2. Right: Profile Information & Connect Button */}
      <div className="flex-1 p-3 sm:p-3.5 flex flex-col justify-between min-w-0 bg-white">
        <div className="space-y-0.5">
          {/* Name */}
          <h4 className="text-[13.5px] sm:text-[14.5px] font-bold text-stone-900 group-hover:text-[#DB2F3C] transition-colors truncate tracking-tight leading-snug">
            {profile.name}
          </h4>

          {/* Age & Height */}
          <p className="text-[11.5px] sm:text-[12px] text-stone-700 font-semibold truncate flex items-center gap-1.5">
            <span>{profile.age} Yrs</span>
            <span className="text-stone-300">•</span>
            <span>{profile.height}</span>
          </p>

          {/* Community / Caste */}
          <p className="text-[11px] sm:text-[11.5px] text-stone-500 font-medium truncate">
            {profile.caste || "Brahmin - Saraswat"}
          </p>

          {/* City & Country */}
          <p className="text-[10.5px] sm:text-[11px] text-stone-400 font-medium truncate flex items-center gap-1">
            <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
            <span>{profile.city || "Mumbai"}, India</span>
          </p>
        </div>

        {/* 3. Connect CTA Button */}
        <button
          type="button"
          onClick={handleConnect}
          className={`mt-1.5 w-full py-1.5 px-3 rounded-full text-[11.5px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs group/btn cursor-pointer ${
            interestSent
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-[#FFF0F2] hover:bg-gradient-to-r hover:from-[#FF4D5A] hover:via-[#DB2F3C] hover:to-[#B71F2A] text-[#DB2F3C] hover:text-white border border-[#FDCED3] hover:border-transparent hover:shadow-xs active:scale-[0.98]"
          }`}
        >
          {interestSent ? (
            <>
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Interest Sent</span>
            </>
          ) : (
            <>
              <Heart className="w-3 h-3 transition-transform group-hover/btn:scale-110 fill-current" />
              <span>Connect</span>
            </>
          )}
        </button>
      </div>
    </Link>
  );
};

export const MatchCard = memo(MatchCardComponent);
MatchCard.displayName = "MatchCard";
export default MatchCard;
