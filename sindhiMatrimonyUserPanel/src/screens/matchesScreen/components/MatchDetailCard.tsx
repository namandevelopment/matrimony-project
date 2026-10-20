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
      className={`group w-full bg-white rounded-xl border border-stone-200 shadow-2xs hover:shadow-md hover:border-stone-300 transition-all duration-200 overflow-hidden flex flex-col sm:flex-row items-stretch ${className}`}
    >
      {/* 1. Left Column: Compact Photo / Silhouette Container */}
      <div className="relative w-full sm:w-44 md:w-48 shrink-0 min-h-[160px] sm:min-h-0 sm:max-h-[188px] bg-stone-100 flex items-center justify-center overflow-hidden">
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

        {/* Photo Image or Silhouette Avatar */}
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
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
          ) : isFemale ? (
            <FemaleSilhouetteAvatar className="w-full h-full" />
          ) : (
            <MaleSilhouetteAvatar className="w-full h-full" />
          )}
        </Link>

        {/* Overlay button: Request her/him to add photo */}
        {!profile.photoUrl && (
          <div className="absolute inset-x-0 bottom-2.5 flex justify-center px-2 z-10">
            <button
              type="button"
              onClick={() => onRequestPhoto(profile.id)}
              disabled={photoRequested}
              className={`px-2.5 py-1 rounded-full text-[10.5px] font-semibold border shadow-xs transition-all duration-150 backdrop-blur-xs cursor-pointer ${
                photoRequested
                  ? "bg-emerald-50 border-emerald-300 text-emerald-700 cursor-default"
                  : "bg-white/95 hover:bg-white text-stone-700 hover:text-stone-900 border-stone-200 active:scale-95"
              }`}
            >
              {photoRequested
                ? "Requested ✓"
                : `Request ${isFemale ? "Photo" : "Photo"}`}
            </button>
          </div>
        )}
      </div>

      {/* 2. Right Column: Structured Information & Actions */}
      <div className="flex-1 p-3.5 sm:p-4 flex flex-col justify-between gap-2 min-w-0">
        <div>
          {/* Header Row: Name, Age/Height, Badges & Contact Icons */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  href={`/matches/viewprofile/${profile.matrimonyId}`}
                  onClick={(e) => {
                    if (onViewProfile) {
                      e.preventDefault();
                      onViewProfile(profile);
                    }
                  }}
                  className="hover:text-[#DB2F3C] transition-colors"
                >
                  <h3 className="text-base sm:text-[17px] font-bold text-stone-900 tracking-tight leading-tight truncate">
                    {profile.name}
                  </h3>
                </Link>
                <span className="text-[11px] font-semibold text-stone-700 bg-stone-100 px-2 py-0.5 rounded-md">
                  {profile.age} Yrs, {profile.height}
                </span>
                {profile.hasHoroscope && (
                  <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 border border-amber-200/90 px-1.5 py-0.5 rounded">
                    Horoscope
                  </span>
                )}
              </div>
              <p className="text-[11.5px] text-stone-500 font-normal mt-0.5 flex items-center gap-1.5">
                <span>{profile.matrimonyId}</span>
                <span className="text-stone-300">•</span>
                <span className="text-stone-400">{profile.lastSeen}</span>
              </p>
            </div>

            {/* Quick Contact Icons */}
            <MatchContactIcons
              onCallClick={() => onCallClick(profile)}
              onWhatsAppClick={() => onWhatsAppClick(profile)}
            />
          </div>

          {/* Key Attributes 2-Column Specs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-stone-700 py-2 border-t border-b border-stone-100 my-2">
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-[11px] text-stone-400 w-19 shrink-0">Community:</span>
              <span className="font-medium text-stone-800 truncate">
                {profile.caste || "Brahmin / Sindhi"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-[11px] text-stone-400 w-19 shrink-0">Education:</span>
              <span className="font-medium text-stone-800 truncate" title={profile.education}>
                {profile.education}
              </span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-[11px] text-stone-400 w-19 shrink-0">Profession:</span>
              <span className="font-medium text-stone-800 truncate" title={profile.profession}>
                {profile.profession}
              </span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-[11px] text-stone-400 w-19 shrink-0">Location:</span>
              <span className="font-medium text-stone-800 truncate">
                {profile.city}{profile.state ? `, ${profile.state}` : ""}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Actions Row */}
        <div className="flex items-center justify-between gap-3 pt-0.5">
          <div className="flex items-center gap-2">
            {/* Don't Show button */}
            <button
              type="button"
              onClick={() => onDontShow(profile.id)}
              className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-full border border-stone-300 bg-white hover:bg-stone-50 text-xs font-medium text-stone-600 active:scale-95 transition-all cursor-pointer"
            >
              <span className="text-xs leading-none">✕</span>
              <span>Don&apos;t Show</span>
            </button>

            {/* View Profile Link */}
            <Link
              href={`/matches/viewprofile/${profile.matrimonyId}`}
              onClick={(e) => {
                if (onViewProfile) {
                  e.preventDefault();
                  onViewProfile(profile);
                }
              }}
              className="hidden sm:inline-flex text-xs font-semibold text-[#1D68CD] hover:text-[#15509F] hover:underline px-2 py-1 transition-colors"
            >
              View Profile &raquo;
            </Link>
          </div>

          {/* Send Interest button */}
          <button
            type="button"
            onClick={() => onSendInterest(profile.id)}
            className={`inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer shadow-xs active:scale-95 ${
              interestSent
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "bg-gradient-to-r from-[#FF4A57] via-[#DB2F3C] to-[#B71F2A] hover:brightness-105 text-white hover:shadow-md"
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
