"use client";

import React, { memo } from "react";
import Link from "next/link";
import { LimcaBookBadge } from "./DashboardIcons";
import type { MarriageSuccessStory } from "../types";

export interface HappyMarriagesSectionProps {
  stories?: MarriageSuccessStory[];
  className?: string;
}

const defaultSuccessStories: MarriageSuccessStory[] = [
  {
    id: "story-1",
    coupleNames: "Saravana sharma & Srinika",
    photoUrl: "/images/dashboard/couple_1.jpg",
    postedDate: "14 Oct 2026",
    testimonial: "I was looking for a partner who will understand me and stand by me in every step of life...",
  },
  {
    id: "story-2",
    coupleNames: "Chamarthi Sai Harish Kumar & Dhawala Sweta",
    photoUrl: "/images/dashboard/couple_2.jpg",
    postedDate: "11 Oct 2026",
    testimonial: "I was looking for a partner who will understand me and stand by me in every step of life...",
  },
  {
    id: "story-3",
    coupleNames: "Sai Virinchi & Mani Malavika",
    photoUrl: "/images/dashboard/couple_3.jpg",
    postedDate: "08 Oct 2026",
    testimonial: "I was looking for a partner who will understand me and stand by me in every step of life...",
  },
];

const SuccessStoryCard = memo<{ story: MarriageSuccessStory }>(({ story }) => {
  return (
    <Link
      href={`/success-stories#${story.id}`}
      className="group flex flex-col bg-white rounded-xl overflow-hidden cursor-pointer"
    >
      {/* Wedding Photo with rounded corners */}
      <div className="relative w-full h-48 sm:h-52 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shadow-2xs">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={story.photoUrl}
          alt={story.coupleNames}
          className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Couple Names & Story Snippet */}
      <div className="pt-3 px-0.5 text-left">
        <h4 className="text-xs sm:text-sm font-bold text-[#1A1A1A] group-hover:text-[#15803D] transition-colors truncate">
          {story.coupleNames}
        </h4>
        {story.postedDate && (
          <p className="text-[11px] text-[#777777] mt-0.5 font-normal">
            Posted on: {story.postedDate}
          </p>
        )}
        {story.testimonial && (
          <p className="text-[11px] text-[#444444] mt-1.5 leading-snug line-clamp-2">
            {story.testimonial}
          </p>
        )}
        <span className="inline-block text-[11px] font-semibold text-[#DB2F3C] hover:underline mt-1">
          Read more...
        </span>
      </div>
    </Link>
  );
});
SuccessStoryCard.displayName = "SuccessStoryCard";

const HappyMarriagesSectionComponent: React.FC<HappyMarriagesSectionProps> = ({
  stories = defaultSuccessStories,
  className = "",
}) => {
  return (
    <section
      aria-label="Lakhs of Happy Marriages Section"
      className={`relative overflow-hidden w-full bg-white rounded-2xl border border-stone-200 shadow-xs p-5 sm:p-7 ${className}`}
    >
      {/* Top Header: Title, Limca Book Records note & Logo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-100">
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-[#15803D] font-heading tracking-tight">
            Lakhs of Happy Marriages!
          </h3>
          <p className="text-xs sm:text-sm text-[#444444] mt-1 max-w-xl leading-relaxed">
            Featured in the{" "}
            <strong className="text-[#1A1A1A] font-semibold">
              Limca Book of Records
            </strong>{" "}
            for highest number of documented marriages online
          </p>
        </div>

        {/* Limca Book of Records badge */}
        <div className="shrink-0 self-start sm:self-auto">
          <LimcaBookBadge className="w-24 h-12 border-stone-300" />
        </div>
      </div>

      {/* 3 Happy Couples Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 pt-5 pb-6">
        {stories.map((story) => (
          <SuccessStoryCard key={story.id} story={story} />
        ))}
      </div>

      {/* Centered View Success Stories CTA */}
      <div className="flex justify-center pt-4 border-t border-stone-100">
        <Link
          href="/success-stories"
          className="inline-flex items-center justify-center px-10 py-2.5 rounded-full border border-[#DB2F3C] text-xs sm:text-sm font-semibold text-[#DB2F3C] hover:bg-gradient-to-r hover:from-[#FF4D5A] hover:via-[#DB2F3C] hover:to-[#B71F2A] hover:text-white hover:border-transparent active:scale-[0.98] shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer"
        >
          View success stories &gt;
        </Link>
      </div>
    </section>
  );
};

export const HappyMarriagesSection = memo(HappyMarriagesSectionComponent);
HappyMarriagesSection.displayName = "HappyMarriagesSection";
export default HappyMarriagesSection;
