"use client";

import React, { memo } from "react";
import Image from "next/image";
import { QuickRegisterForm } from "./QuickRegisterForm";

interface HeroSectionProps {
  onLoginClick?: () => void;
}

const HeroSectionComponent: React.FC<HeroSectionProps> = ({ onLoginClick }) => {
  return (
    <section className="relative w-full overflow-hidden bg-stone-950 text-white flex flex-col justify-center items-center min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-4.5rem)]">
      {/* Background Couples Collage Grid (Absolute GPU composited, zero scroll repaints) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <Image
          src="/images/couples-collage.webp"
          alt="Happy Sindhi Wedding Couples and Newlyweds"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Cinematic dark gradient overlays for crystal-clear readability & contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/65" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.45)_100%)]" />
      </div>

      {/* Main Hero Container: fills full viewport height so on initial view there is zero bottom gap */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 md:py-14 lg:py-16 flex flex-col items-center justify-center flex-1">
        {/* Unified Responsive Hero Card */}
        <div className="w-full max-w-full sm:max-w-2xl lg:max-w-6xl mx-auto flex flex-col items-center text-center my-auto">
          {/* Main Card / Banner (Zero backdrop-blur for buttery 60/120 FPS scrolling) */}
          <div className="w-full bg-black/60 lg:bg-black/50 border border-white/20 rounded-xl sm:rounded-2xl p-5 sm:p-8 lg:p-10 shadow-xl sm:shadow-2xl mb-4 sm:mb-0">
            {/* Single Canonical H1 for SEO & Accessibility across all viewports */}
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-[28px] xl:text-[33px] 2xl:text-[36px] font-extrabold text-white tracking-tight leading-snug drop-shadow-md lg:whitespace-nowrap">
              No. 1 and official matrimony service exclusively for Sindhis
            </h1>
            <p className="mt-1.5 sm:mt-2 text-sm sm:text-base lg:text-xl text-stone-200 font-medium drop-shadow-xs">
              Meet your soulmate here!
            </p>

            {/* Mobile login prompt (only on mobile screens) */}
            <div className="sm:hidden mt-3 pt-2.5 border-t border-white/20">
              <span className="text-xs text-stone-300">
                Already a member?{" "}
                <button
                  type="button"
                  onClick={onLoginClick}
                  className="font-bold text-white underline underline-offset-4 active:text-[#FF4A57]"
                >
                  LOGIN
                </button>
              </span>
            </div>

            {/* Desktop Form (>= 1024px) */}
            <div className="hidden lg:block mt-8 w-full">
              <QuickRegisterForm variant="desktop" />
            </div>

            {/* Tablet Form (640px - 1023px) */}
            <div className="hidden sm:block lg:hidden mt-6 w-full">
              <QuickRegisterForm variant="mobile" />
            </div>
          </div>

          {/* Mobile Registration Card Form (< 640px) */}
          <div className="sm:hidden w-full">
            <QuickRegisterForm variant="mobile" />
          </div>
        </div>
      </div>
    </section>
  );
};

export const HeroSection = memo(HeroSectionComponent);
HeroSection.displayName = "HeroSection";

