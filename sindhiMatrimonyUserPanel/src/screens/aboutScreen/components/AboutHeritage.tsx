"use client";

import React, { memo } from "react";
import { Sparkles, MapPin, Heart } from "lucide-react";
import { AboutSubcasteItem } from "../types";

interface AboutHeritageProps {
  subcastes: AboutSubcasteItem[];
}

export const AboutHeritage: React.FC<AboutHeritageProps> = memo(
  ({ subcastes }) => {
    return (
      <section className="py-12 sm:py-16 bg-white border-b border-stone-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div className="max-w-2xl">
              <span className="text-xs font-bold tracking-wider text-[#DB2F3C] uppercase">
                Community Heritage
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] tracking-tight mt-1 font-heading">
                Serving Every Branch of the Glorious Sindhi Diaspora
              </h2>
              <p className="text-sm sm:text-base text-stone-600 mt-2 leading-relaxed">
                Whether you prefer a match from your specific ancestral gotra or are open across all Sindhi sub-castes, our intelligent community matchmaking preserves your heritage.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800 self-start md:self-auto">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Blessings of Lord Jhulelal • जय झूलेलाल</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subcastes.map((item) => (
              <div
                key={item.name}
                className="bg-stone-50/70 rounded-2xl p-5 border border-stone-200/80 hover:bg-white hover:border-red-200 hover:shadow-xs transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-bold text-[#1A1A1A]">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-1 text-[11px] font-medium text-stone-500">
                    <MapPin className="w-3 h-3 text-[#DB2F3C]" />
                    <span>{item.origin}</span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
);

AboutHeritage.displayName = "AboutHeritage";
