"use client";

import React, { memo, useState, useEffect, useCallback } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Calendar,
  MapPin,
  Heart,
  Share2,
  Check,
} from "lucide-react";
import type { MarriageSuccessStory } from "../types";

export interface SuccessStoryModalProps {
  story: MarriageSuccessStory | null;
  isOpen: boolean;
  onClose: () => void;
  onLikeToggle?: (storyId: string) => void;
  isLiked?: boolean;
}

export const SuccessStoryModal = memo<SuccessStoryModalProps>(
  ({ story, isOpen, onClose, onLikeToggle, isLiked = false }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [copied, setCopied] = useState(false);

    // Get array of photos or fallback to single photoUrl
    const photos =
      story?.photoUrls && story.photoUrls.length > 0
        ? story.photoUrls
        : story?.photoUrl
        ? [story.photoUrl]
        : [];

    const hasMultiplePhotos = photos.length > 1;

    // Reset image index when opening a new story
    useEffect(() => {
      setCurrentImageIndex(0);
      setCopied(false);
    }, [story?.id, isOpen]);

    // Handle Keyboard navigation (Escape to close, Left/Right for photos)
    useEffect(() => {
      if (!isOpen) return;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        } else if (hasMultiplePhotos && e.key === "ArrowLeft") {
          setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
        } else if (hasMultiplePhotos && e.key === "ArrowRight") {
          setCurrentImageIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, hasMultiplePhotos, photos.length, onClose]);

    const handlePrev = useCallback((e: React.MouseEvent) => {
      e.stopPropagation();
      setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
    }, [photos.length]);

    const handleNext = useCallback((e: React.MouseEvent) => {
      e.stopPropagation();
      setCurrentImageIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
    }, [photos.length]);

    const handleShare = useCallback(() => {
      if (typeof window !== "undefined") {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    }, []);

    if (!isOpen || !story) return null;

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="success-story-modal-title"
      >
        <div
          className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Bar with Title, Verified Badge, and Close Button */}
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-stone-100 bg-white sticky top-0 z-20">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Match</span>
              </span>
              <span className="text-xs text-stone-500 hidden sm:inline">
                Documented on SindhiMatrimony
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto">
            {/* 1. Photo Showcase Container (Swiper IF multiple photos, single view IF only one photo) */}
            <div className="relative w-full bg-stone-950 flex items-center justify-center select-none overflow-hidden aspect-4/3 sm:aspect-16/10 max-h-[380px] sm:max-h-[420px]">
              {/* Main Photo with smooth cross-fade */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={photos[currentImageIndex]}
                src={photos[currentImageIndex]}
                alt={`${story.coupleNames} - Photo ${currentImageIndex + 1}`}
                className="w-full h-full object-contain object-center transition-all duration-300"
                loading="eager"
              />

              {/* Swiper Controls: ONLY SHOWN IF MULTIPLE PHOTOS! */}
              {hasMultiplePhotos && (
                <>
                  {/* Left Swiper Arrow */}
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Previous photo"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center backdrop-blur-md transition-all shadow-md active:scale-95 cursor-pointer z-10"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  {/* Right Swiper Arrow */}
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next photo"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center backdrop-blur-md transition-all shadow-md active:scale-95 cursor-pointer z-10"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  {/* Top Right Counter Badge (e.g. "2 / 3 Photos") */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-black/60 text-white backdrop-blur-md shadow-xs pointer-events-none">
                    {currentImageIndex + 1} / {photos.length} Photos
                  </div>

                  {/* Bottom Swiper Thumbnail Indicators / Dots */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/45 backdrop-blur-md">
                    {photos.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIndex(idx);
                        }}
                        aria-label={`Jump to photo ${idx + 1}`}
                        className={`h-2 rounded-full transition-all duration-200 cursor-pointer ${
                          idx === currentImageIndex
                            ? "w-6 bg-white"
                            : "w-2 bg-white/50 hover:bg-white/80"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* 2. Couple Information & Narrative Section */}
            <div className="p-5 sm:p-7 space-y-5 bg-white">
              {/* Couple Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <h2
                    id="success-story-modal-title"
                    className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight font-heading"
                  >
                    {story.coupleNames}
                  </h2>

                  {/* Meta Chips: Wedding Date & Location */}
                  <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 mt-2 text-xs sm:text-sm text-stone-600">
                    {story.weddingDate && (
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-[#DB2F3C]" />
                        <span>Married on {story.weddingDate}</span>
                      </span>
                    )}
                    {story.location && (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-emerald-600" />
                        <span>{story.location}</span>
                      </span>
                    )}
                    {story.postedDate && (
                      <span className="text-stone-400">
                        • Shared on {story.postedDate}
                      </span>
                    )}
                  </div>
                </div>

                {/* Matrimony Profile IDs (if present) */}
                {(story.groomMatrimonyId || story.brideMatrimonyId) && (
                  <div className="shrink-0 px-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200/80 text-[11px] text-stone-600">
                    <p className="font-semibold text-stone-800">Verified IDs:</p>
                    <p className="font-mono text-stone-600">
                      {story.groomMatrimonyId} &amp; {story.brideMatrimonyId}
                    </p>
                  </div>
                )}
              </div>

              {/* Quotation / Full Story Text */}
              <div className="relative p-5 rounded-2xl bg-gradient-to-b from-stone-50 to-stone-50/50 border border-stone-100">
                <span className="absolute top-2 left-3 text-4xl font-serif text-stone-200 select-none">
                  “
                </span>
                <p className="relative z-10 text-stone-700 text-sm sm:text-base leading-relaxed pl-3 font-normal whitespace-pre-line">
                  {story.fullStory || story.testimonial}
                </p>
              </div>

              {/* Trust & Verification Footnote */}
              <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Verified &amp; Authenticated by SindhiMatrimony Quality Desk
                  </span>
                </span>
                <span className="font-semibold text-emerald-700 hidden sm:inline">
                  100% Genuine Couple Story
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Action Footer: Congratulate / Like + Share */}
          <div className="flex items-center justify-between px-5 sm:px-7 py-3.5 border-t border-stone-100 bg-stone-50/80 shrink-0">
            <button
              type="button"
              onClick={() => onLikeToggle?.(story.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all active:scale-95 cursor-pointer ${
                isLiked
                  ? "bg-red-50 text-[#DB2F3C] border border-red-200"
                  : "bg-white text-stone-700 hover:text-[#DB2F3C] border border-stone-200 hover:border-red-200 shadow-2xs"
              }`}
            >
              <Heart
                className={`w-4 h-4 ${
                  isLiked ? "fill-[#DB2F3C] text-[#DB2F3C]" : "text-stone-500"
                }`}
              />
              <span>
                {isLiked ? "Congratulated!" : "Congratulate"} ({story.likesCount ? (isLiked ? story.likesCount + 1 : story.likesCount) : 100})
              </span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-stone-700 hover:text-stone-900 border border-stone-200 hover:border-stone-300 shadow-2xs text-xs sm:text-sm font-medium transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-stone-500" />
                    <span>Share</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-full bg-stone-800 hover:bg-stone-900 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

SuccessStoryModal.displayName = "SuccessStoryModal";
export default SuccessStoryModal;
