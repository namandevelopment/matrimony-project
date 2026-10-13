"use client";

import React from "react";
import Image from "next/image";
import { QuickRegisterForm } from "./QuickRegisterForm";

interface HeroSectionProps {
  onLoginClick?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onLoginClick }) => {
  return (
    <section className="relative w-full overflow-hidden bg-stone-950 text-white flex flex-col justify-center items-center min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-4.5rem)]">
      {/* Background Couples Collage Grid (Confined strictly to Hero Section) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <Image
          src="/images/couples-collage.jpg"
          alt="Happy Sindhi Wedding Couples and Newlyweds"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center transform scale-105 filter brightness-90 contrast-105"
        />
        {/* Cinematic subtle dark gradient vignette overlays for contrast & luxury feel */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-black/55" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.45)_100%)]" />
      </div>

      {/* Main Hero Container: fills full viewport height so on initial view there is zero bottom gap */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 md:py-14 lg:py-16 flex flex-col items-center justify-center flex-1">
        {/* DESKTOP HERO CARD (Matching Photo 5) */}
        <div className="hidden lg:flex flex-col items-center text-center w-full max-w-6xl bg-black/40 backdrop-blur-[1px] border border-white/20 rounded-2xl p-8 sm:p-10 shadow-2xl animate-fade-in my-auto">
          <h1 className="text-2xl lg:text-[28px] xl:text-[33px] 2xl:text-[36px] font-extrabold text-white tracking-tight leading-snug drop-shadow-md lg:whitespace-nowrap">
            No. 1 and official matrimony service exclusively for Sindhis
          </h1>
          <p className="mt-2 text-lg sm:text-xl text-stone-200 font-medium drop-shadow-xs">
            Meet your soulmate here!
          </p>

          <div className="mt-8 w-full">
            <QuickRegisterForm variant="desktop" />
          </div>
        </div>

        {/* TABLET VIEW */}
        <div className="hidden sm:flex lg:hidden flex-col items-center text-center w-full max-w-2xl bg-black/45 backdrop-blur-[1px] border border-white/20 rounded-2xl p-6 sm:p-8 shadow-2xl my-auto">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
            No. 1 and official matrimony service exclusively for Sindhis
          </h1>
          <p className="mt-2 text-base text-stone-200 font-medium">
            Meet your soulmate here!
          </p>
          <div className="mt-6 w-full">
            <QuickRegisterForm variant="mobile" />
          </div>
        </div>

        {/* MOBILE VIEW (Matching Photos 3 & 4) */}
        <div className="sm:hidden w-full flex flex-col items-center py-4">
          {/* Mobile Dark Banner */}
          <div className="w-full bg-black/45 backdrop-blur-[1px] border border-white/20 rounded-xl p-5 shadow-xl mb-4 text-center">
            <h1 className="text-xl font-extrabold text-white tracking-tight leading-snug">
              No. 1 and official matrimony service exclusively for Sindhis
            </h1>
            <p className="mt-1.5 text-sm text-stone-200 font-medium">
              Meet your soulmate here!
            </p>
            <div className="mt-3 pt-2.5 border-t border-white/20">
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
          </div>

          {/* Mobile Registration Card Form - seamless with zero empty gap */}
          <div className="w-full">
            <QuickRegisterForm variant="mobile" />
          </div>
        </div>
      </div>
    </section>
  );
};

