"use client";

import React, { memo, useCallback } from "react";
import { Heart, Check, X, ChevronRight } from "lucide-react";
import { ViewUserProfile } from "../types";

export interface ViewProfileStickyHeaderProps {
  profile: ViewUserProfile;
  interestSent?: boolean;
  isVisible: boolean;
  nextProfilePhotoUrl?: string;
  nextProfileName?: string;
  onSendInterest: (id: string) => void;
  onDontShow: (id: string) => void;
  onNext: () => void;
  className?: string;
}

const ViewProfileStickyHeaderComponent: React.FC<ViewProfileStickyHeaderProps> = ({
  profile,
  interestSent = false,
  isVisible,
  nextProfilePhotoUrl,
  nextProfileName = "Next",
  onSendInterest,
  onDontShow,
  onNext,
  className = "",
}) => {
  const handleSendInterestClick = useCallback(() => {
    onSendInterest(profile.id);
  }, [onSendInterest, profile.id]);

  const handleDontShowClick = useCallback(() => {
    onDontShow(profile.id);
  }, [onDontShow, profile.id]);

  if (!isVisible) return null;

  const photo = profile.photoUrls?.[0];

  return (
    <div
      className={`fixed top-0 inset-x-0 z-[60] bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm transition-transform duration-200 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      } ${className}`}
      aria-label={`Sticky actions for ${profile.name}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-3">
        {/* Left: Mini Avatar, Name & Action Buttons (matching screenshot) */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-stone-200 shrink-0 border border-stone-200">
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photo}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-stone-300 text-stone-600 text-xs font-bold">
                {profile.name.charAt(0)}
              </div>
            )}
          </div>
          <span className="font-bold text-stone-900 text-sm sm:text-base truncate">
            {profile.name}
          </span>

          {/* Action Buttons: Don't Show & Send Interest right next to name */}
          <div className="hidden sm:flex items-center gap-2.5 ml-2">
            <button
              type="button"
              onClick={handleDontShowClick}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-full border border-stone-300 bg-white hover:bg-stone-50 text-xs font-semibold text-stone-700 transition-all active:scale-98 cursor-pointer shadow-2xs"
            >
              <X className="w-3 h-3 text-stone-500 stroke-2.5" />
              <span>Don&apos;t Show</span>
            </button>

            <button
              type="button"
              onClick={handleSendInterestClick}
              className={`inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer shadow-xs active:scale-98 ${
                interestSent
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-[#DB2F3C] hover:bg-[#B71F2A] text-white hover:shadow-xs"
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

        {/* Mobile Action Buttons (Visible only on mobile) */}
        <div className="flex sm:hidden items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleSendInterestClick}
            className={`inline-flex items-center justify-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
              interestSent
                ? "bg-emerald-600 text-white"
                : "bg-[#DB2F3C] text-white"
            }`}
          >
            {interestSent ? "Sent" : "Interest"}
          </button>
        </div>

        {/* Right: Next Profile Button */}
        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center gap-1.5 pl-1 pr-2.5 py-1 rounded-full border border-stone-300 bg-white hover:bg-stone-50 text-xs font-semibold text-stone-800 shadow-2xs transition-all active:scale-97 cursor-pointer group"
          aria-label={`Next profile: ${nextProfileName}`}
        >
          <div className="w-5 h-5 rounded-full overflow-hidden bg-stone-200 shrink-0 border border-stone-200">
            {nextProfilePhotoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={nextProfilePhotoUrl}
                alt={nextProfileName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-stone-300 text-stone-600 text-[9px] font-bold">
                {nextProfileName.charAt(0)}
              </div>
            )}
          </div>
          <span className="hidden sm:inline">Next</span>
          <div className="flex items-center -space-x-1 text-stone-600 group-hover:text-stone-900">
            <ChevronRight className="w-3.5 h-3.5" />
            <ChevronRight className="w-3.5 h-3.5 -ml-2" />
          </div>
        </button>
      </div>
    </div>
  );
};

export const ViewProfileStickyHeader = memo(ViewProfileStickyHeaderComponent);
ViewProfileStickyHeader.displayName = "ViewProfileStickyHeader";
