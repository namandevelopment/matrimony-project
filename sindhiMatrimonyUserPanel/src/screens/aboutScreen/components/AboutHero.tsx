"use client";

import React, { memo } from "react";
import Link from "next/link";
import { ChevronRight, ShieldCheck, Heart, Sparkles } from "lucide-react";
import { AboutContentData } from "../types";

interface AboutHeroProps {
  data: AboutContentData;
}

export const AboutHero: React.FC<AboutHeroProps> = memo(({ data }) => {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-rose-50/70 via-stone-50 to-white pt-8 pb-14 border-b border-stone-200/70">
      {/* Subtle decorative background circles */}
      <div
        className="absolute -top-24 -right-24 w-96 h-96 bg-red-100/50 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 -left-24 w-80 h-80 bg-amber-100/40 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs text-stone-500 mb-6"
        >
          <Link
            href="/"
            className="hover:text-[#DB2F3C] transition-colors font-medium"
          >
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="text-[#1A1A1A] font-semibold">About Us</span>
        </nav>

        {/* Hero Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-red-200/80 shadow-xs text-xs font-semibold text-[#DB2F3C]">
            <Sparkles className="w-3.5 h-3.5 fill-[#DB2F3C]" />
            <span>{data.hero.badge}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1A1A1A] tracking-tight leading-tight font-heading">
            {data.hero.title}
          </h1>

          <p className="text-sm sm:text-base font-medium text-[#DB2F3C]">
            {data.hero.subtitle}
          </p>

          <p className="text-sm sm:text-base text-stone-600 leading-relaxed pt-1">
            {data.hero.leadParagraph}
          </p>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-10">
          {data.stats.map((stat) => (
            <div
              key={stat.id}
              className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs hover:shadow-md transition-shadow duration-300 flex flex-col justify-between"
            >
              <div className="text-2xl sm:text-3xl font-black text-[#DB2F3C] tracking-tight">
                {stat.value}
              </div>
              <div className="mt-2">
                <div className="text-sm font-bold text-[#1A1A1A] leading-snug">
                  {stat.label}
                </div>
                {stat.sublabel && (
                  <div className="text-xs text-stone-500 mt-1 leading-normal">
                    {stat.sublabel}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

AboutHero.displayName = "AboutHero";
