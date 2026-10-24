"use client";

import React, { memo, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { MatchCard } from "./MatchCard";
import { useDashboardNav, defaultNavContext } from "../context/DashboardNavContext";
import type { MatchProfile } from "../types";

export interface DashboardMatchesSectionProps {
  matches?: MatchProfile[];
  totalMatchesCount?: number;
  className?: string;
}

const defaultMatches: MatchProfile[] = [
  {
    id: "SND4486236",
    name: "Roshni Advani",
    age: 24,
    height: "5'3\"",
    city: "Mumbai",
    caste: "Sindhi - Bhaiband",
    education: "B.Tech / Senior Software Eng.",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
  },
  {
    id: "SND4486237",
    name: "Aisha Bhavnani",
    age: 25,
    height: "5'2\"",
    city: "Pune",
    caste: "Sindhi - Amil",
    education: "MBA / Investment Banker",
    photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80",
  },
  {
    id: "SND4486238",
    name: "Simran Motwani",
    age: 26,
    height: "5'4\"",
    city: "Bangalore",
    caste: "Sindhi - Bhaiband",
    education: "MS / Data Scientist",
    photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80",
  },
  {
    id: "SND4486239",
    name: "Kajal Mirchandani",
    age: 24,
    height: "5'1\"",
    city: "Ahmedabad",
    caste: "Sindhi - Lohana",
    education: "CA / Financial Consultant",
    photoUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80",
  },
  {
    id: "SND4486240",
    name: "Pooja Hingorani",
    age: 25,
    height: "5'3\"",
    city: "Dubai, UAE",
    caste: "Sindhi - Sahiti",
    education: "B.Arch / Interior Architect",
    photoUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=500&auto=format&fit=crop&q=80",
  },
  {
    id: "SND4486241",
    name: "Muskan Chawla",
    age: 23,
    height: "5'2\"",
    city: "Jaipur",
    caste: "Sindhi - Sakhrani",
    education: "M.Com / Corporate HR",
    photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80",
  },
];

const DashboardMatchesSectionComponent: React.FC<DashboardMatchesSectionProps> = ({
  matches = defaultMatches,
  totalMatchesCount = 23,
  className = "",
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const navContext = useDashboardNav();

  const handleViewAllClick = useCallback(
    (e: React.MouseEvent) => {
      if (
        navContext.isInsideProvider &&
        navContext.onTabChange &&
        navContext.onTabChange !== defaultNavContext.onTabChange
      ) {
        e.preventDefault();
        navContext.onTabChange("matches");
        if (typeof window !== "undefined") {
          window.history.pushState(null, "", "/matches");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
        return;
      }
      router.push("/matches");
    },
    [navContext, router]
  );

  const scrollLeft = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -360, behavior: "smooth" });
    }
  }, []);

  const scrollRight = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 360, behavior: "smooth" });
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
          className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-20 w-9 h-9 rounded-full bg-white/95 backdrop-blur-md border border-stone-200 shadow-md items-center justify-center text-stone-700 hover:text-[#DB2F3C] hover:scale-110 active:scale-95 transition-all cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Scrollable Row */}
        <div
          ref={scrollContainerRef}
          className="flex items-stretch gap-3.5 sm:gap-4 overflow-x-auto pb-3 pt-1 px-0.5 scroll-smooth no-scrollbar"
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
          className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-20 w-9 h-9 rounded-full bg-white/95 backdrop-blur-md border border-stone-200 shadow-md items-center justify-center text-stone-700 hover:text-[#DB2F3C] hover:scale-110 active:scale-95 transition-all cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Centered View All CTA */}
      <div className="flex justify-center pt-3 border-t border-stone-100">
        <Link
          href="/matches"
          onClick={handleViewAllClick}
          className="inline-flex items-center justify-center px-10 py-2 rounded-full border border-[#DB2F3C] text-xs sm:text-sm font-semibold text-[#DB2F3C] hover:bg-gradient-to-r hover:from-[#FF4D5A] hover:via-[#DB2F3C] hover:to-[#B71F2A] hover:text-white hover:border-transparent active:scale-[0.98] shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer"
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
