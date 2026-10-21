"use client";

import React, { memo, useState, useCallback, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Heart,
  ShieldCheck,
  Calendar,
  MapPin,
  Camera,
  PlusCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { LimcaBookBadge } from "./DashboardIcons";
import { SuccessStoryModal } from "./SuccessStoryModal";
import { ShareStoryModal } from "./ShareStoryModal";
import { defaultSuccessStoriesList } from "../data/successStoriesData";
import type { MarriageSuccessStory } from "../types";
import { apiFetch, ApiURL } from "@/redux/apiService";
import { useSuccessStoriesQuery } from "@/tanstackQuery";

export interface HappyMarriagesSectionProps {
  stories?: MarriageSuccessStory[];
  className?: string;
  defaultExpanded?: boolean;
}

interface SuccessStoryCardProps {
  story: MarriageSuccessStory;
  onOpenModal: (story: MarriageSuccessStory) => void;
  onLikeToggle: (storyId: string) => void;
  isLiked: boolean;
}

const SuccessStoryCard = memo<SuccessStoryCardProps>(
  ({ story, onOpenModal, onLikeToggle, isLiked }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const photos =
      story.photoUrls && story.photoUrls.length > 0
        ? story.photoUrls
        : [story.photoUrl];
    const hasMultiplePhotos = photos.length > 1;

    const toggleExpand = useCallback((e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsExpanded((prev) => !prev);
    }, []);

    const handleCardClick = useCallback(() => {
      onOpenModal(story);
    }, [story, onOpenModal]);

    const handleHeartClick = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onLikeToggle(story.id);
      },
      [story.id, onLikeToggle]
    );

    const currentLikes = story.likesCount
      ? isLiked
        ? story.likesCount + 1
        : story.likesCount
      : isLiked
        ? 1
        : 0;

    return (
      <div
        onClick={handleCardClick}
        className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-stone-200/90 hover:border-[#DB2F3C]/40 shadow-2xs hover:shadow-xl transition-all duration-300 cursor-pointer"
      >
        {/* Wedding Photo Container */}
        <div className="relative w-full h-48 sm:h-52 overflow-hidden bg-stone-100">
          {/* Main Photo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={story.photoUrl}
            alt={story.coupleNames}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />

          {/* Top Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent pointer-events-none" />

          {/* Top Left: Verified Badge */}
          <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
            <span className="inline-flex items-center gap-1 bg-white/95 backdrop-blur-md text-emerald-800 text-[10px] sm:text-[10.5px] font-bold px-2 py-0.5 rounded-full shadow-2xs border border-emerald-100">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified Match</span>
            </span>
          </div>

          {/* Top Right: Multi-Photo Indicator Badge (if multi photos) */}
          {hasMultiplePhotos && (
            <div className="absolute top-2.5 right-2.5 z-10 pointer-events-none">
              <span className="inline-flex items-center gap-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-medium px-2 py-0.5 rounded-full shadow-2xs">
                <Camera className="w-3 h-3" />
                <span>{photos.length} Photos</span>
              </span>
            </div>
          )}

          {/* Floating Heart / Congratulate Button */}
          <button
            type="button"
            onClick={handleHeartClick}
            aria-label={isLiked ? "Unlike" : "Congratulate couple"}
            className={`absolute bottom-2.5 right-2.5 z-10 px-2.5 py-1 rounded-full backdrop-blur-md shadow-xs flex items-center gap-1.5 text-xs font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer ${isLiked
              ? "bg-red-500 text-white"
              : "bg-white/90 hover:bg-white text-stone-700 hover:text-[#DB2F3C]"
              }`}
          >
            <Heart
              className={`w-3.5 h-3.5 ${isLiked ? "fill-white text-white" : "text-[#DB2F3C]"
                }`}
            />
            <span className="text-[11px] font-bold">{currentLikes}</span>
          </button>

          {/* Bottom Left on Photo: Location chip */}
          {story.location && (
            <div className="absolute bottom-2.5 left-2.5 z-10 pointer-events-none text-white text-[11px] font-medium flex items-center gap-1 drop-shadow-sm">
              <MapPin className="w-3 h-3 text-red-300" />
              <span className="truncate max-w-[170px] sm:max-w-[200px]">
                {story.location}
              </span>
            </div>
          )}
        </div>

        {/* Story Body */}
        <div className="p-4 sm:p-4.5 flex-1 flex flex-col justify-between">
          <div>
            {/* Couple Names */}
            <h4 className="text-sm sm:text-[15px] font-bold text-stone-900 group-hover:text-[#DB2F3C] transition-colors leading-snug line-clamp-1 font-heading">
              {story.coupleNames}
            </h4>

            {/* Date Info */}
            <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-1">
              {story.weddingDate ? (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-stone-400" />
                  <span>Married: {story.weddingDate}</span>
                </span>
              ) : story.postedDate ? (
                <span>Posted on: {story.postedDate}</span>
              ) : null}
            </div>

            {/* Testimonial / Story Snippet with In-Place Read More / Read Less */}
            {story.testimonial && (
              <div className="mt-2.5">
                <p
                  className={`text-xs text-stone-600 leading-relaxed transition-all duration-200 ${isExpanded ? "" : "line-clamp-2"
                    }`}
                >
                  {story.testimonial}
                </p>

                {/* Read More / Read Less Toggle button */}
                <button
                  type="button"
                  onClick={toggleExpand}
                  className="mt-1 text-[11.5px] font-bold text-[#DB2F3C] hover:text-[#B71F2A] hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                >
                  <span>{isExpanded ? "Read less" : "Read more..."}</span>
                  {isExpanded ? (
                    <ChevronUp className="w-3 h-3" />
                  ) : (
                    <ChevronDown className="w-3 h-3" />
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Card Footer: View Full Story Trigger */}
          <div className="mt-3.5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
            <span className="text-[11px] text-stone-500 font-medium">
              {hasMultiplePhotos ? "📸 Click for album" : "Click for story"}
            </span>
            <span className="font-bold text-[#DB2F3C] group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
              <span>View Details</span>
              <span>&rarr;</span>
            </span>
          </div>
        </div>
      </div>
    );
  }
);
SuccessStoryCard.displayName = "SuccessStoryCard";

const HappyMarriagesSectionComponent: React.FC<HappyMarriagesSectionProps> = ({
  stories: propStories,
  className = "",
  defaultExpanded = false,
}) => {
  // Store stories list in state so user submissions appear live
  const [storiesList, setStoriesList] = useState<MarriageSuccessStory[]>(() => {
    return propStories && propStories.length >= 12
      ? propStories
      : defaultSuccessStoriesList;
  });

  // Fetch live success stories from TanStack Query (10 mins fresh cache, zero duplicate requests)
  const { data: storiesData } = useSuccessStoriesQuery(1, 12);

  useEffect(() => {
    if (!storiesData) return;
    const rawStories =
      (storiesData as any)?.stories ||
      (storiesData as any)?.items ||
      (Array.isArray(storiesData) ? storiesData : (storiesData as any)?.data?.stories || (storiesData as any)?.data || []);

    if (Array.isArray(rawStories) && rawStories.length > 0) {
      const loaded: MarriageSuccessStory[] = rawStories.map((s: any) => ({
        id: s.id || s._id || `story_${Date.now()}`,
        coupleNames: s.coupleNames || s.coupleName || "Sindhi Couple",
        photoUrl: s.photoUrl || s.imageUrl || s.couplePhoto || "/images/dashboard/couple_1.jpg",
        photoUrls: Array.isArray(s.photoUrls) && s.photoUrls.length > 0 ? s.photoUrls : [s.photoUrl || s.imageUrl || "/images/dashboard/couple_1.jpg"],
        weddingDate: s.weddingDate || "14 Feb 2026",
        postedDate: s.postedDate || s.postedOn || "Recently",
        location: s.location || (s.city ? `${s.city}, India` : "India"),
        groomMatrimonyId: s.groomMatrimonyId || s.groomId || "SND882914",
        brideMatrimonyId: s.brideMatrimonyId || s.brideId || "SND772183",
        isVerified: s.isVerified !== false,
        verifiedBy: s.verifiedBy || "SindhiMatrimony Trust & Safety",
        likesCount: Number(s.likesCount) || 120,
        testimonial: s.testimonial || s.storySnippet || s.storyDescription || "A blessed journey together.",
        fullStory: s.fullStory || s.storySnippet || s.storyDescription,
      }));
      setStoriesList(loaded);
    }
  }, [storiesData]);

  // Modal states
  const [selectedStory, setSelectedStory] = useState<MarriageSuccessStory | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Likes tracking state
  const [likedStoryIds, setLikedStoryIds] = useState<Set<string>>(new Set());

  // Category filter state: "all" | "multi_photo" | "recent"
  const [categoryFilter, setCategoryFilter] = useState<"all" | "multi_photo" | "recent">("all");

  // View count: 3 vs all (12+)
  const [showAllStories, setShowAllStories] = useState(defaultExpanded);

  // Pagination index for 3-at-a-time pagination
  const [currentPage, setCurrentPage] = useState(0);

  const handleLikeToggle = useCallback((storyId: string) => {
    setLikedStoryIds((prev) => {
      const next = new Set(prev);
      if (next.has(storyId)) {
        next.delete(storyId);
      } else {
        next.add(storyId);
      }
      return next;
    });
  }, []);

  const handleNewStorySubmitted = useCallback((newStory: MarriageSuccessStory) => {
    setStoriesList((prev) => [newStory, ...prev]);
  }, []);

  // Filtered stories
  const filteredStories = useMemo(() => {
    if (categoryFilter === "multi_photo") {
      return storiesList.filter(
        (s) => s.photoUrls && s.photoUrls.length > 1
      );
    }
    if (categoryFilter === "recent") {
      return storiesList.filter(
        (s) => s.weddingDate?.includes("2026") || s.postedDate?.includes("2026")
      );
    }
    return storiesList;
  }, [storiesList, categoryFilter]);

  // Total available pages (3 per page)
  const totalPages = Math.ceil(filteredStories.length / 3);

  // Paginated or All visible stories
  const visibleStories = useMemo(() => {
    if (showAllStories) {
      return filteredStories;
    }
    const startIndex = currentPage * 3;
    return filteredStories.slice(startIndex, startIndex + 3);
  }, [filteredStories, showAllStories, currentPage]);

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  return (
    <section
      aria-label="Lakhs of Happy Marriages Section"
      className={`relative overflow-hidden w-full bg-white rounded-3xl border border-stone-200/90 shadow-xs p-5 sm:p-7 md:p-8 ${className}`}
    >
      {/* 1. Header: Title, Limca Record Badge, Counter & Share Story Button */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-stone-100">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-[#DB2F3C] border border-red-100">
              <Sparkles className="w-3.5 h-3.5" />
              <span>1,20,000+ Documented Marriages</span>
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-[#15803D] font-heading tracking-tight">
            Lakhs of Happy Marriages!
          </h3>

          <p className="text-xs sm:text-sm text-[#444444] max-w-xl leading-relaxed">
            Featured in the{" "}
            <strong className="text-stone-900 font-semibold">
              Limca Book of Records
            </strong>{" "}
            for highest number of documented marriages online.
          </p>
        </div>

        {/* Right Header Actions: Limca Badge + Share Story Button */}
        <div className="flex flex-wrap items-center gap-3 shrink-0 self-start lg:self-auto">
          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#DB2F3C] to-[#B71F2A] hover:from-[#B71F2A] hover:to-[#961720] text-white text-xs sm:text-sm font-bold shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Share Your Story</span>
          </button>

          <LimcaBookBadge className="w-24 sm:w-28 h-12 border-stone-200 shadow-2xs" />
        </div>
      </div>

      {/* 2. Filter Bar & Interactive Navigation Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-5 pb-3">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setCategoryFilter("all");
              setCurrentPage(0);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${categoryFilter === "all"
              ? "bg-stone-900 text-white"
              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
          >
            All Stories ({storiesList.length})
          </button>

          <button
            type="button"
            onClick={() => {
              setCategoryFilter("recent");
              setCurrentPage(0);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${categoryFilter === "recent"
              ? "bg-stone-900 text-white"
              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
          >
            Recent 2026 Weddings
          </button>

          <button
            type="button"
            onClick={() => {
              setCategoryFilter("multi_photo");
              setCurrentPage(0);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${categoryFilter === "multi_photo"
              ? "bg-stone-900 text-white"
              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
          >
            📸 Multi-Photo Albums
          </button>
        </div>

        {/* Pagination / View Toggle Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
          {!showAllStories && totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePrevPage}
                aria-label="Previous 3 stories"
                className="p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="text-stone-500 font-medium px-1">
                {currentPage + 1} of {totalPages}
              </span>

              <button
                type="button"
                onClick={handleNextPage}
                aria-label="Next 3 stories"
                className="p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowAllStories((prev) => !prev)}
            className="px-3 py-1.5 rounded-full border border-stone-300 hover:border-stone-400 text-stone-700 font-semibold hover:bg-stone-50 transition-colors cursor-pointer"
          >
            {showAllStories
              ? "Show 3 Stories View"
              : `View All ${filteredStories.length} Stories`}
          </button>
        </div>
      </div>

      {/* 3. Success Stories Grid (Displays 3 or full 12 stories) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 pt-3 pb-6">
        {visibleStories.map((story) => (
          <SuccessStoryCard
            key={story.id}
            story={story}
            onOpenModal={setSelectedStory}
            onLikeToggle={handleLikeToggle}
            isLiked={likedStoryIds.has(story.id)}
          />
        ))}
      </div>

      {/* 4. Bottom Footer with View Success Stories CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 border-t border-stone-100">
        <p className="text-xs text-stone-500 text-center sm:text-left">
          Are you married through SindhiMatrimony? Submit your story and get
          featured on our official Limca Book records.
        </p>

        <div className="flex items-center gap-3">
          <Link
            href="/success-stories"
            className="inline-flex items-center justify-center px-8 py-2.5 rounded-full border border-[#DB2F3C] text-xs sm:text-sm font-semibold text-[#DB2F3C] hover:bg-gradient-to-r hover:from-[#FF4D5A] hover:via-[#DB2F3C] hover:to-[#B71F2A] hover:text-white hover:border-transparent active:scale-[0.98] shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            View all 12+ success stories &gt;
          </Link>
        </div>
      </div>

      {/* Interactive Modal 1: Complete Story Details with Image Swiper */}
      <SuccessStoryModal
        story={selectedStory}
        isOpen={Boolean(selectedStory)}
        onClose={() => setSelectedStory(null)}
        onLikeToggle={handleLikeToggle}
        isLiked={selectedStory ? likedStoryIds.has(selectedStory.id) : false}
      />

      {/* Interactive Modal 2: Share Your Story (User Submission & Admin Verification) */}
      <ShareStoryModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onSubmit={handleNewStorySubmitted}
      />
    </section>
  );
};

export const HappyMarriagesSection = memo(HappyMarriagesSectionComponent);
HappyMarriagesSection.displayName = "HappyMarriagesSection";
export default HappyMarriagesSection;
