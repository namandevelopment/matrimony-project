"use client";

import React, { memo } from "react";
import {
  ShieldCheck,
  BadgeCheck,
  Lock,
  Sparkles,
  Headset,
  Globe,
  LucideIcon,
} from "lucide-react";
import { AboutPillarItem } from "../types";

const PILLAR_ICONS: Record<string, LucideIcon> = {
  ShieldCheck,
  BadgeCheck,
  Lock,
  Sparkles,
  Headset,
  Globe,
};

interface AboutPillarsProps {
  pillars: AboutPillarItem[];
}

export const AboutPillars: React.FC<AboutPillarsProps> = memo(({ pillars }) => {
  return (
    <section className="py-12 sm:py-16 bg-stone-50 border-b border-stone-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-10 sm:mb-12">
          <span className="text-xs font-bold tracking-wider text-[#DB2F3C] uppercase">
            Our Guiding Principles
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] tracking-tight mt-1 font-heading">
            Why Over 50,000 Sindhi Families Place Their Trust in Us
          </h2>
          <p className="text-sm sm:text-base text-stone-600 mt-2 leading-relaxed">
            Finding a life partner isn&apos;t just about biodatas; it is about family compatibility, shared culture, and peaceful security. Here is how we ensure your journey is honorable and protected.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar) => {
            const IconComponent = PILLAR_ICONS[pillar.icon] || ShieldCheck;

            return (
              <div
                key={pillar.id}
                className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs hover:shadow-md hover:border-red-200 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-red-50 text-[#DB2F3C] flex items-center justify-center border border-red-100">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-[#DB2F3C] bg-red-50/70 px-2.5 py-1 rounded-full border border-red-100">
                      {pillar.highlight}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#1A1A1A] mb-2 leading-snug">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
});

AboutPillars.displayName = "AboutPillars";
