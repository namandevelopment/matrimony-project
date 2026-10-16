"use client";

import React, { memo, useRef, useCallback } from "react";
import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { MatchCard } from "./MatchCard";
import type { MatchProfile } from "../types";

export interface DashboardMatchesSectionProps {
  matches?: MatchProfile[];
  totalMatchesCount?: number;
  className?: string;
}

const defaultMatches: MatchProfile[] = [
  {
    id: "snd-1",
    name: "Shivangi Tiwari",
    age: 25,
    height: "4'6\"",
    city: "Mumbai",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
  },
  {
    id: "snd-2",
    name: "Vaishnavi Sharma",
    age: 22,
    height: "4'6\"",
    city: "Pune",
    photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80",
  },
  {
    id: "snd-3",
    name: "Aisha Pandit",
    age: 24,
    height: "4'6\"",
    city: "Ahmedabad",
    isSilhouette: true,
  },
  {
    id: "snd-4",
    name: "S Sreyashi",
    age: 25,
    height: "4'7\"",
    city: "Delhi",
    isSilhouette: true,
  },
  {
    id: "snd-5",
    name: "Kajal Kumari",
    age: 25,
    height: "4'6\"",
    city: "Jaipur",
    isSilhouette: true,
  },
  {
    id: "snd-6",
    name: "Simran Motwani",
    age: 26,
    height: "5'2\"",
    city: "Bangalore",
    photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80",
  },
  {
    id: "snd-7",
    name: "Pooja Vazirani",
    age: 24,
    height: "5'3\"",
    city: "Indore",
    photoUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80",
  },
];

const DashboardMatchesSectionComponent: React.FC<DashboardMatchesSectionProps> = ({
  matches = defaultMatches,
  totalMatchesCount = 28,
  className = "",
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -260, behavior: "smooth" });
    }
  }, []);

  const scrollRight = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 260, behavior: "smooth" });
    }
  }, []);

  return (
    <section
      aria-label="Partner Matches Carousel Section"
      className={`w-full bg-white rounded-2xl border border-stone-200 shadow-xs p-5 ${className}`}
    >
      {/* Title & Subtitle */}
      <div className="pb-3">
        <h3 className="text-base sm:text-lg font-bold text-[#1A1A1A] font-heading">
          All Matches ({totalMatchesCount})
        </h3>
        <p className="text-xs text-[#666666] mt-0.5">
          Members who match your partner preferences
        </p>
      </div>

      {/* Carousel Container */}
      <div className="relative group/carousel my-2">
        {/* Left Scroll Button */}
        <button
          type="button"
          onClick={scrollLeft}
          aria-label="Scroll matches left"
          className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -ml-3 z-10 w-8 h-8 rounded-full bg-white border border-stone-200 shadow-md items-center justify-center text-stone-600 hover:text-[#DB2F3C] hover:scale-105 transition-all cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Scrollable Row */}
        <div
          ref={scrollContainerRef}
          className="flex items-start gap-3 sm:gap-4 overflow-x-auto pb-3 pt-1 scroll-smooth no-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {matches.map((profile) => (
            <MatchCard key={profile.id} profile={profile} />
          ))}
        </div>

        {/* Right Scroll Button */}
        <button
          type="button"
          onClick={scrollRight}
          aria-label="Scroll matches right"
          className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 -mr-3 z-10 w-8 h-8 rounded-full bg-white border border-stone-200 shadow-md items-center justify-center text-stone-600 hover:text-[#DB2F3C] hover:scale-105 transition-all cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Centered View All CTA */}
      <div className="flex justify-center pt-3 border-t border-stone-100">
        <Link
          href="/matches"
          className="inline-flex items-center justify-center px-8 py-2 rounded-full border border-[#DB2F3C] text-xs sm:text-sm font-semibold text-[#DB2F3C] hover:bg-red-50 active:scale-[0.98] transition-all duration-200"
        >
          View all &gt;
        </Link>
      </div>
    </section>
  );
};

export const DashboardMatchesSection = memo(DashboardMatchesSectionComponent);
DashboardMatchesSection.displayName = "DashboardMatchesSection";
export default DashboardMatchesSection;
