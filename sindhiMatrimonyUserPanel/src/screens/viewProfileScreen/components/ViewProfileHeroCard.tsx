"use client";

import React, { memo, useState, useCallback, useRef, useEffect } from "react";
import { Bookmark, MoreVertical, Heart, Check, X, Phone, MessageSquare, Ban, Flag } from "lucide-react";
import { ViewProfilePhotoGallery } from "./ViewProfilePhotoGallery";
import { ViewUserProfile } from "../types";

export interface ViewProfileHeroCardProps {
  profile: ViewUserProfile;
  isShortlisted?: boolean;
  interestSent?: boolean;
  onToggleShortlist: (id: string) => void;
  onSendInterest: (id: string) => void;
  onDontShow: (id: string) => void;
  onCallClick: (profile: ViewUserProfile) => void;
  onWhatsAppClick: (profile: ViewUserProfile) => void;
  onSendMessage?: (profile: ViewUserProfile) => void;
  onPhotoClick?: (index: number) => void;
  onShareProfile?: (profile: ViewUserProfile) => void;
  onReportProfile?: (profile: ViewUserProfile) => void;
  onBlockProfile?: (profile: ViewUserProfile) => void;
  className?: string;
}

const ViewProfileHeroCardComponent: React.FC<ViewProfileHeroCardProps> = ({
  profile,
  isShortlisted = false,
  interestSent = false,
  onToggleShortlist,
  onSendInterest,
  onDontShow,
  onCallClick,
  onWhatsAppClick,
  onSendMessage,
  onPhotoClick,
  onShareProfile,
  onReportProfile,
  onBlockProfile,
  className = "",
}) => {
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  // Close more menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        moreMenuRef.current &&
        !moreMenuRef.current.contains(event.target as Node)
      ) {
        setIsMoreMenuOpen(false);
      }
    };
    if (isMoreMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMoreMenuOpen]);

  const handleShortlistClick = useCallback(() => {
    onToggleShortlist(profile.id);
  }, [onToggleShortlist, profile.id]);

  const handleSendInterestClick = useCallback(() => {
    onSendInterest(profile.id);
  }, [onSendInterest, profile.id]);

  const handleDontShowClick = useCallback(() => {
    onDontShow(profile.id);
  }, [onDontShow, profile.id]);

  const handleCall = useCallback(() => {
    onCallClick(profile);
  }, [onCallClick, profile]);

  const handleWhatsApp = useCallback(() => {
    onWhatsAppClick(profile);
  }, [onWhatsAppClick, profile]);

  const handleSendMessage = useCallback(() => {
    if (onSendMessage) {
      onSendMessage(profile);
    } else {
      onCallClick(profile);
    }
  }, [onSendMessage, onCallClick, profile]);

  return (
    <section
      id="profile-hero-card"
      aria-label={`Profile overview for ${profile.name}`}
      className={`w-full bg-white rounded-2xl border border-stone-200 shadow-2xs p-4 sm:p-6 transition-all ${className}`}
    >
      <div className="flex flex-col md:flex-row items-stretch gap-6 lg:gap-8">
        {/* Left Column: Photo Gallery Carousel */}
        <div className="w-full md:w-72 lg:w-80 shrink-0">
          <ViewProfilePhotoGallery
            photos={profile.photoUrls}
            name={profile.name}
            gender={profile.gender}
            onPhotoClick={onPhotoClick}
          />
        </div>

        {/* Right Column: Profile Details & Actions */}
        <div className="flex-1 flex flex-col justify-between py-1">
          <div>
            {/* Top Row: Name on Left, Actions on Right */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight font-heading">
                  {profile.name}
                </h1>
                <p className="text-xs sm:text-[13px] text-stone-500 font-normal mt-1">
                  <span className="font-medium text-stone-700">{profile.matrimonyId}</span>
                  <span className="mx-2 text-stone-300">|</span>
                  <span>{profile.lastSeen}</span>
                </p>
              </div>

              {/* Right cluster: Shortlist / 3-dots, and Call / WhatsApp */}
              <div className="flex flex-col items-end gap-2 shrink-0">
                <div className="flex items-center gap-2">
                  {/* Shortlist Button */}
                  <button
                    type="button"
                    onClick={handleShortlistClick}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all duration-150 cursor-pointer shadow-2xs ${
                      isShortlisted
                        ? "bg-rose-50 border-rose-200 text-rose-600"
                        : "bg-white border-stone-200 text-stone-700 hover:bg-stone-50 hover:border-stone-300"
                    }`}
                    aria-label={isShortlisted ? "Remove from shortlist" : "Shortlist profile"}
                  >
                    <Bookmark
                      className={`w-3.5 h-3.5 ${
                        isShortlisted ? "fill-rose-600 stroke-rose-600" : "stroke-stone-600"
                      }`}
                    />
                    <span>Shortlist</span>
                  </button>

                  {/* More Menu 3-dots */}
                  <div className="relative" ref={moreMenuRef}>
                    <button
                      type="button"
                      onClick={() => setIsMoreMenuOpen((prev) => !prev)}
                      className="w-8 h-8 rounded-full border border-stone-200 bg-white hover:bg-stone-50 flex items-center justify-center text-stone-600 hover:text-stone-900 transition-colors cursor-pointer shadow-2xs"
                      aria-label="More options"
                      aria-expanded={isMoreMenuOpen}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {/* Dropdown popup (Exact match to Screenshot 1) */}
                    {isMoreMenuOpen && (
                      <div className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-xl shadow-lg border border-stone-200 py-1 z-30 animate-in fade-in-50 zoom-in-95">
                        {/* 1. Send Message */}
                        <button
                          type="button"
                          onClick={() => {
                            setIsMoreMenuOpen(false);
                            handleSendMessage();
                          }}
                          className="w-full px-4 py-2.5 text-left text-xs sm:text-[13px] font-medium text-stone-800 hover:bg-stone-50 flex items-center gap-3 cursor-pointer transition-colors"
                        >
                          <MessageSquare className="w-4 h-4 text-stone-500 shrink-0" />
                          <span>Send Message</span>
                        </button>

                        <div className="border-t border-stone-100" />

                        {/* 2. Block Profile */}
                        <button
                          type="button"
                          onClick={() => {
                            setIsMoreMenuOpen(false);
                            onBlockProfile?.(profile);
                          }}
                          className="w-full px-4 py-2.5 text-left text-xs sm:text-[13px] font-medium text-stone-800 hover:bg-stone-50 flex items-center gap-3 cursor-pointer transition-colors"
                        >
                          <Ban className="w-4 h-4 text-stone-500 shrink-0" />
                          <span>Block Profile</span>
                        </button>

                        <div className="border-t border-stone-100" />

                        {/* 3. Report Profile */}
                        <button
                          type="button"
                          onClick={() => {
                            setIsMoreMenuOpen(false);
                            onReportProfile?.(profile);
                          }}
                          className="w-full px-4 py-2.5 text-left text-xs sm:text-[13px] font-medium text-stone-800 hover:bg-stone-50 flex items-center gap-3 cursor-pointer transition-colors"
                        >
                          <Flag className="w-4 h-4 text-stone-500 shrink-0" />
                          <span>Report Profile</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Call & WhatsApp Icon Circles (Aligned neatly below Shortlist / 3-dots as in Screenshot 2) */}
                <div className="flex items-center gap-2 pt-1">
                  {/* Phone Call Circle */}
                  <button
                    type="button"
                    onClick={handleCall}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-orange-300 bg-orange-50/70 hover:bg-orange-100 flex items-center justify-center text-[#EA580C] transition-all active:scale-95 cursor-pointer shadow-2xs"
                    aria-label={`Call ${profile.name}`}
                    title="View phone number"
                  >
                    <Phone className="w-4 h-4 stroke-2" />
                  </button>

                  {/* WhatsApp Circle */}
                  <button
                    type="button"
                    onClick={handleWhatsApp}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-emerald-300 bg-emerald-50/70 hover:bg-emerald-100 flex items-center justify-center text-[#059669] transition-all active:scale-95 cursor-pointer shadow-2xs"
                    aria-label={`WhatsApp ${profile.name}`}
                    title="Contact on WhatsApp"
                  >
                    <MessageSquare className="w-4 h-4 stroke-2" />
                  </button>
                </div>
              </div>
            </div>

            {/* Bulleted Highlights Line (Exactly matching screenshot) */}
            <div className="mt-4 pt-1">
              <p className="text-xs sm:text-sm text-stone-700 font-normal leading-relaxed">
                <span>{profile.maritalStatus}</span>
                <span className="mx-2 text-stone-400 font-bold">•</span>
                <span>Profile created by {profile.profileCreatedBy}</span>
                <span className="mx-2 text-stone-400 font-bold">•</span>
                <span>{profile.age} Yrs</span>
                <span className="mx-2 text-stone-400 font-bold">•</span>
                <span>{profile.height}</span>
                <span className="mx-2 text-stone-400 font-bold">•</span>
                <span>{profile.casteSummary}</span>
                <span className="mx-2 text-stone-400 font-bold">•</span>
                <span>{profile.education}</span>
                <span className="mx-2 text-stone-400 font-bold">•</span>
                <span>{profile.profession}</span>
                <span className="mx-2 text-stone-400 font-bold">•</span>
                <span>{profile.city}</span>
              </p>
            </div>
          </div>

          {/* Bottom Action Buttons: Don't Show & Send Interest */}
          <div className="flex items-center gap-3 pt-6 mt-4 border-t border-stone-100 sm:border-0 sm:mt-0">
            {/* Don't Show Button */}
            <button
              type="button"
              onClick={handleDontShowClick}
              className="inline-flex items-center justify-center gap-1.5 px-4 sm:px-6 py-2.5 rounded-full border border-stone-300 bg-white hover:bg-stone-50 text-xs sm:text-[13px] font-semibold text-stone-700 transition-all active:scale-98 cursor-pointer shadow-2xs"
            >
              <X className="w-3.5 h-3.5 text-stone-500 stroke-2.5" />
              <span>Don&apos;t Show</span>
            </button>

            {/* Send Interest Button */}
            <button
              type="button"
              onClick={handleSendInterestClick}
              className={`inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-2.5 rounded-full text-xs sm:text-[13px] font-semibold transition-all duration-200 cursor-pointer shadow-xs active:scale-98 ${
                interestSent
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-[#DB2F3C] hover:bg-[#B71F2A] text-white hover:shadow-md"
              }`}
            >
              {interestSent ? (
                <>
                  <Check className="w-4 h-4 stroke-3" />
                  <span>Interest Sent</span>
                </>
              ) : (
                <>
                  <Heart className="w-4 h-4 fill-current" />
                  <span>Send Interest</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export const ViewProfileHeroCard = memo(ViewProfileHeroCardComponent);
ViewProfileHeroCard.displayName = "ViewProfileHeroCard";
