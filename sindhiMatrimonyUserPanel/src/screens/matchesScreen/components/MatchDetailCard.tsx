"use client";

import React, { memo } from "react";
import Link from "next/link";
import { Heart, Check } from "lucide-react";
import { FemaleSilhouetteAvatar, MaleSilhouetteAvatar } from "@/screens/dashboardScreen/components/DashboardIcons";
import { MatchCardRibbon } from "./MatchCardRibbon";
import { MatchShortlistButton } from "./MatchShortlistButton";
import { MatchContactIcons } from "./MatchContactIcons";
import { MatchDetailProfile } from "../types";

export interface MatchDetailCardProps {
  profile: MatchDetailProfile;
  isShortlisted?: boolean;
  interestSent?: boolean;
  photoRequested?: boolean;
  onToggleShortlist: (id: string) => void;
  onSendInterest: (id: string) => void;
  onDontShow: (id: string) => void;
  onRequestPhoto: (id: string) => void;
  onCallClick: (profile: MatchDetailProfile) => void;
  onWhatsAppClick: (profile: MatchDetailProfile) => void;
  onViewProfile?: (profile: MatchDetailProfile) => void;
  className?: string;
}

const MatchDetailCardComponent: React.FC<MatchDetailCardProps> = ({
  profile,
  isShortlisted = false,
  interestSent = false,
  photoRequested = false,
  onToggleShortlist,
  onSendInterest,
  onDontShow,
  onRequestPhoto,
  onCallClick,
  onWhatsAppClick,
  onViewProfile,
  className = "",
}) => {
  const isFemale = profile.gender !== "female" ? false : true;

  return (
    <article
      aria-label={`Profile card of ${profile.name}`}
      className={`group w-full bg-white rounded-2xl border border-stone-200 shadow-2xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col sm:flex-row items-stretch ${className}`}
    >
      {/* 1. Left Column: Photo / Silhouette Container */}
      <div className="relative w-full sm:w-56 md:w-64 h-60 sm:h-auto min-h-[230px] shrink-0 bg-stone-100 flex items-center justify-center overflow-hidden">
        {/* Ribbon for Newly Joined */}
        {profile.isNewlyJoined && <MatchCardRibbon label="NEWLY JOINED" />}

        {/* Shortlist button in top-right */}
        <MatchShortlistButton
          isShortlisted={isShortlisted}
          onToggle={(e) => {
            e.stopPropagation();
            onToggleShortlist(profile.id);
          }}
        />

        {/* Photo Image or Silhouette Avatar (Clickable to view profile) */}
        <Link
          href={`/matches/viewprofile/${profile.matrimonyId}`}
          onClick={(e) => {
            if (onViewProfile) {
              e.preventDefault();
              onViewProfile(profile);
            }
          }}
          className="w-full h-full block"
          aria-label={`View profile of ${profile.name}`}
        >
          {profile.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.photoUrl}
              alt={profile.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
              loading="lazy"
              decoding="async"
            />
          ) : isFemale ? (
            <FemaleSilhouetteAvatar className="w-full h-full" />
          ) : (
            <MaleSilhouetteAvatar className="w-full h-full" />
          )}
        </Link>

        {/* Overlay button: Request her to add photo */}
        {!profile.photoUrl && (
          <div className="absolute inset-x-0 bottom-4 flex justify-center px-3 z-10">
            <button
              type="button"
              onClick={() => onRequestPhoto(profile.id)}
              disabled={photoRequested}
              className={`px-3 py-1.5 rounded-full text-[11px] font-semibold border shadow-xs transition-all duration-150 backdrop-blur-xs cursor-pointer ${
                photoRequested
                  ? "bg-emerald-50 border-emerald-300 text-emerald-700 cursor-default"
                  : "bg-white/95 hover:bg-white text-stone-700 hover:text-stone-900 border-stone-200 active:scale-95"
              }`}
            >
              {photoRequested
                ? "Photo Requested ✓"
                : `Request ${isFemale ? "her" : "him"} to add photo`}
            </button>
          </div>
        )}
      </div>

      {/* 2. Right Column: Profile Information & Action Buttons */}
      <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between gap-4">
        <div className="space-y-1.5">
          {/* Header Row: Name & Call / WhatsApp Icons */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <Link
                href={`/matches/viewprofile/${profile.matrimonyId}`}
                onClick={(e) => {
                  if (onViewProfile) {
                    e.preventDefault();
                    onViewProfile(profile);
                  }
                }}
                className="inline-block group-hover:text-[#DB2F3C] transition-colors"
              >
                <h3 className="text-base sm:text-lg font-bold text-[#111827] tracking-tight hover:text-[#DB2F3C] transition-colors">
                  {profile.name}
                </h3>
              </Link>
              <p className="text-xs text-[#6B7280] font-normal mt-0.5">
                {profile.matrimonyId} <span className="mx-1 text-stone-300">|</span>{" "}
                {profile.lastSeen}
              </p>
            </div>

            <MatchContactIcons
              onCallClick={() => onCallClick(profile)}
              onWhatsAppClick={() => onWhatsAppClick(profile)}
            />
          </div>

          {/* Key Attributes Line with Bullet Dots */}
          <p className="text-xs sm:text-[13px] text-[#374151] pt-1 leading-relaxed">
            <span>{profile.age} Yrs</span>
            <span className="mx-1.5 text-stone-400">•</span>
            <span>{profile.height}</span>
            <span className="mx-1.5 text-stone-400">•</span>
            <span>{profile.education}</span>
            <span className="mx-1.5 text-stone-400">•</span>
            <span>{profile.profession}</span>
            <span className="mx-1.5 text-stone-400">•</span>
            <span>{profile.city}</span>
          </p>
        </div>

        {/* Bottom Actions Row */}
        <div className="flex items-center gap-3 pt-2">
          {/* Don't Show button */}
          <button
            type="button"
            onClick={() => onDontShow(profile.id)}
            className="inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2 rounded-full border border-stone-300 bg-white hover:bg-stone-50 text-xs sm:text-[13px] font-medium text-stone-700 active:scale-98 transition-colors cursor-pointer"
          >
            <span className="text-sm font-semibold leading-none">✕</span>
            <span>Don&apos;t Show</span>
          </button>

          {/* Send Interest button */}
          <button
            type="button"
            onClick={() => onSendInterest(profile.id)}
            className={`inline-flex items-center justify-center gap-1.5 px-5 sm:px-6 py-2 rounded-full text-xs sm:text-[13px] font-semibold transition-all duration-200 cursor-pointer shadow-xs active:scale-98 ${
              interestSent
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "bg-[#DB2F3C] hover:bg-[#B71F2A] text-white hover:shadow-md"
            }`}
          >
            {interestSent ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-3" />
                <span>Interest Sent</span>
              </>
            ) : (
              <>
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>Send Interest</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};

export const MatchDetailCard = memo(MatchDetailCardComponent);
MatchDetailCard.displayName = "MatchDetailCard";
export default MatchDetailCard;
