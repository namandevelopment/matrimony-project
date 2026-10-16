"use client";

import React, { memo, useRef, useCallback, useState } from "react";
import { ChevronRight, ChevronLeft, Check, Headphones, ShieldCheck, Building2, MapPin, Camera, Users, Award } from "lucide-react";

export interface OtherServicesSectionProps {
  className?: string;
}

const OtherServicesSectionComponent: React.FC<OtherServicesSectionProps> = ({
  className = "",
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activePageIndex, setActivePageIndex] = useState(0);

  const scrollRight = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 360, behavior: "smooth" });
      setActivePageIndex(1);
    }
  }, []);

  const scrollLeft = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -360, behavior: "smooth" });
      setActivePageIndex(0);
    }
  }, []);

  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      const scrollPos = scrollRef.current.scrollLeft;
      setActivePageIndex(scrollPos > 180 ? 1 : 0);
    }
  }, []);

  return (
    <section
      aria-label="Matrimony.com Other Services Section"
      className={`w-full bg-white rounded-2xl border border-stone-200 shadow-xs p-5 sm:p-7 ${className}`}
    >
      {/* Title */}
      <div className="pb-5">
        <h3 className="text-lg sm:text-xl font-bold text-[#1A1A1A] font-heading">
          Matrimony.com - Other services
        </h3>
      </div>

      {/* Carousel Container */}
      <div className="relative group/carousel">
        {/* Scroll Left Button */}
        <button
          type="button"
          onClick={scrollLeft}
          aria-label="Scroll other services left"
          className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -ml-3 z-10 w-9 h-9 rounded-full bg-white border border-stone-200 shadow-md items-center justify-center text-stone-600 hover:text-[#DB2F3C] hover:scale-105 transition-all cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Scrollable Row of Cards */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex items-stretch gap-4 sm:gap-6 overflow-x-auto pb-4 pt-1 scroll-smooth no-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* Card 1: AstroFreeChat */}
          <div className="shrink-0 w-[300px] sm:w-[340px] flex flex-col justify-between bg-gradient-to-b from-[#FFF9F5] to-white rounded-2xl border border-amber-200/70 p-5 shadow-xs">
            <div>
              {/* Header Logo */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  ✨
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#EA580C] leading-none">
                    Astro<span className="text-[#1A1A1A]">FreeChat</span>
                  </h4>
                  <span className="text-[10px] text-[#777777]">
                    From Matrimony.com Group
                  </span>
                </div>
              </div>

              {/* Headline */}
              <h5 className="text-xs sm:text-[13px] font-bold text-[#1A1A1A] leading-snug mt-2">
                Looking for astrology guidance in love, relationships, career, or health?
              </h5>
              <p className="text-[11px] text-[#555555] mt-1 leading-relaxed">
                Connect instantly with expert astrologers on AstroFreeChat.
              </p>

              {/* Feature Checklist */}
              <div className="mt-3.5 space-y-2">
                <div className="flex items-center gap-2 text-xs text-[#2B2B2B]">
                  <Check className="w-4 h-4 text-[#EA580C] shrink-0" />
                  <span>Instant Astrology Insights</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#2B2B2B]">
                  <Check className="w-4 h-4 text-[#EA580C] shrink-0" />
                  <span>Chat Anytime, Anywhere</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#2B2B2B]">
                  <Check className="w-4 h-4 text-[#EA580C] shrink-0" />
                  <span>
                    First 5 Minutes <strong className="font-extrabold text-[#EA580C]">FREE</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Row: Button & Graphic */}
            <div className="mt-5 pt-3 border-t border-amber-100 flex items-center justify-between gap-3">
              <button
                type="button"
                className="px-4 sm:px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-[#FF7A00] via-[#F97316] to-[#EA580C] hover:from-[#FFA040] hover:to-[#C2410C] active:scale-[0.98] shadow-sm hover:shadow-orange-500/25 transition-all cursor-pointer"
              >
                Download AstroFreeChat
              </button>

              <div className="relative shrink-0 w-20 h-20 rounded-2xl overflow-hidden border border-orange-200/80 shadow-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/dashboard/astro_chat_woman.jpg"
                  alt="AstroFreeChat"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute -bottom-1 -left-1 bg-gradient-to-r from-[#FF4D5A] to-[#DC2626] text-white text-[8px] font-black px-1.5 py-0.5 rounded-full shadow-xs tracking-wider">
                  1st chat FREE
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Mandap.com */}
          <div className="shrink-0 w-[300px] sm:w-[340px] flex flex-col justify-between bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
            <div>
              {/* Header Logo */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-sm border border-rose-200">
                  🏛️
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#DB2F3C] leading-none">
                    mandap<span className="text-[#333333]">.com</span>
                  </h4>
                  <span className="text-[10px] text-[#777777]">
                    from matrimony.com group
                  </span>
                </div>
              </div>

              {/* Headline */}
              <h5 className="text-xs sm:text-[13px] font-bold text-[#1A1A1A] leading-snug mt-2">
                India&apos;s Largest Wedding Venue Booking Platform
              </h5>

              {/* Feature Checklist */}
              <div className="mt-3.5 space-y-2.5">
                <div className="flex items-center gap-2.5 text-xs text-[#2B2B2B]">
                  <Headphones className="w-4 h-4 text-[#DB2F3C] shrink-0" />
                  <span>Free assistance in finding your venue</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[#2B2B2B]">
                  <ShieldCheck className="w-4 h-4 text-[#DB2F3C] shrink-0" />
                  <span>100% verified venues</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[#2B2B2B]">
                  <Building2 className="w-4 h-4 text-[#DB2F3C] shrink-0" />
                  <span>40,000+ venues</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[#2B2B2B]">
                  <MapPin className="w-4 h-4 text-[#DB2F3C] shrink-0" />
                  <span>Service available over 20+ cities</span>
                </div>
              </div>
            </div>

            {/* Bottom Button */}
            <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-center">
              <button
                type="button"
                className="w-full py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#FF4D5A] via-[#E53935] to-[#B71C1C] hover:from-[#FF5E6B] hover:via-[#EF4444] hover:to-[#C62828] active:scale-[0.98] shadow-sm hover:shadow-red-500/25 transition-all cursor-pointer"
              >
                Know more
              </button>
            </div>
          </div>

          {/* Card 3: WeddingBazaar */}
          <div className="shrink-0 w-[300px] sm:w-[340px] flex flex-col justify-between bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
            <div>
              {/* Header Logo */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center font-bold text-sm border border-pink-200">
                  🛍️
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#E11D48] leading-none">
                    Wedding<span className="text-[#333333]">Bazaar</span>
                  </h4>
                  <span className="text-[10px] text-[#777777]">
                    from matrimony.com group
                  </span>
                </div>
              </div>

              {/* Headline */}
              <h5 className="text-xs sm:text-[13px] font-bold text-[#1A1A1A] leading-snug mt-2">
                India&apos;s Largest Wedding Services Marketplace
              </h5>

              {/* Feature Checklist */}
              <div className="mt-3.5 space-y-2.5">
                <div className="flex items-center gap-2.5 text-xs text-[#2B2B2B]">
                  <Camera className="w-4 h-4 text-[#E11D48] shrink-0" />
                  <span>Photography, Makeup, Decor & Catering</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[#2B2B2B]">
                  <ShieldCheck className="w-4 h-4 text-[#E11D48] shrink-0" />
                  <span>Trusted & verified wedding vendors</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[#2B2B2B]">
                  <Users className="w-4 h-4 text-[#E11D48] shrink-0" />
                  <span>2.8 Lakh+ successful weddings facilitated</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[#2B2B2B]">
                  <Award className="w-4 h-4 text-[#E11D48] shrink-0" />
                  <span>40+ cities across India</span>
                </div>
              </div>
            </div>

            {/* Bottom Button */}
            <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-center">
              <button
                type="button"
                className="w-full py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#FF4D5A] via-[#E53935] to-[#B71C1C] hover:from-[#FF5E6B] hover:via-[#EF4444] hover:to-[#C62828] active:scale-[0.98] shadow-sm hover:shadow-red-500/25 transition-all cursor-pointer"
              >
                Know more
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Right Button */}
        <button
          type="button"
          onClick={scrollRight}
          aria-label="Scroll other services right"
          className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 -mr-3 z-10 w-9 h-9 rounded-full bg-white border border-stone-200 shadow-md items-center justify-center text-stone-600 hover:text-[#DB2F3C] hover:scale-105 transition-all cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Pagination Indicator Dots */}
      <div className="flex items-center justify-center gap-2 pt-2">
        <span
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            activePageIndex === 0 ? "bg-[#DB2F3C] w-4" : "bg-stone-300"
          }`}
        />
        <span
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            activePageIndex === 1 ? "bg-[#DB2F3C] w-4" : "bg-stone-300"
          }`}
        />
      </div>
    </section>
  );
};

export const OtherServicesSection = memo(OtherServicesSectionComponent);
OtherServicesSection.displayName = "OtherServicesSection";
export default OtherServicesSection;
