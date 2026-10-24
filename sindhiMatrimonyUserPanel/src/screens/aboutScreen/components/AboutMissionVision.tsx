"use client";

import React, { memo } from "react";
import { Compass, Eye, HeartHandshake, ShieldCheck } from "lucide-react";
import { AboutContentData } from "../types";

interface AboutMissionVisionProps {
  data: AboutContentData;
}

export const AboutMissionVision: React.FC<AboutMissionVisionProps> = memo(
  ({ data }) => {
    return (
      <section className="py-12 sm:py-16 bg-white border-b border-stone-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Mission Card */}
            <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-red-50/60 to-rose-50/30 border border-red-100 flex flex-col justify-between">
              <div
                className="absolute top-0 right-0 w-32 h-32 bg-red-200/30 rounded-bl-full pointer-events-none"
                aria-hidden="true"
              />
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white border border-red-200 flex items-center justify-center text-[#DB2F3C] shadow-xs">
                  <Compass className="w-6 h-6" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] tracking-tight">
                  {data.mission.title}
                </h2>
                <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                  {data.mission.description}
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-red-100/80 flex items-center gap-2 text-xs font-semibold text-[#DB2F3C]">
                <HeartHandshake className="w-4 h-4" />
                <span>Faith • Family Honor • Cultural Unity</span>
              </div>
            </div>

            {/* Vision Card */}
            <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-amber-50/60 to-orange-50/30 border border-amber-200/70 flex flex-col justify-between">
              <div
                className="absolute top-0 right-0 w-32 h-32 bg-amber-200/30 rounded-bl-full pointer-events-none"
                aria-hidden="true"
              />
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white border border-amber-300/80 flex items-center justify-center text-amber-700 shadow-xs">
                  <Eye className="w-6 h-6" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] tracking-tight">
                  {data.vision.title}
                </h2>
                <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                  {data.vision.description}
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-amber-200/60 flex items-center gap-2 text-xs font-semibold text-amber-800">
                <ShieldCheck className="w-4 h-4" />
                <span>Global Reach • 100% Genuine Families</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
);

AboutMissionVision.displayName = "AboutMissionVision";
