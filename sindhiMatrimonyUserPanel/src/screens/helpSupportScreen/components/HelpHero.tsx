"use client";

import React, { memo } from "react";
import { Search, X, Sparkles, ShieldCheck } from "lucide-react";

interface HelpHeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onQuickChipClick: (query: string) => void;
}

const QUICK_CHIPS = [
  "Aadhaar Verification",
  "Sub-Caste Selection",
  "Kundali Matching",
  "Phone Privacy",
  "Payment & Refunds",
  "Report Profile",
];

export const HelpHero: React.FC<HelpHeroProps> = memo(
  ({ searchQuery, onSearchChange, onQuickChipClick }) => {
    return (
      <header className="relative w-full bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 text-white overflow-hidden py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-stone-800">
        {/* Subtle Decorative Ambient Background Glows */}
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-20 right-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          {/* Top Trust & Status Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-stone-200 shadow-xs">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-semibold text-white tracking-wide">
              Official Help &amp; Support Hub
            </span>
            <span className="text-stone-400">•</span>
            <span className="text-stone-300">SindhiMatrimony Care Desk</span>
          </div>

          {/* Main Canonical H1 */}
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white font-heading leading-tight">
              How Can We Help You{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B76] via-[#FF4A57] to-[#FFA07A]">
                Today?
              </span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-stone-300 max-w-2xl mx-auto leading-relaxed">
              Step-by-step matchmaking guides, photo &amp; phone privacy controls,
              horoscope matching assistance, and 24/7 dedicated member helpline.
            </p>
          </div>

          {/* Live Search Input Box */}
          <div className="max-w-2xl mx-auto pt-2">
            <div className="relative flex items-center bg-white rounded-2xl shadow-xl shadow-black/30 border border-white/20 p-1.5 focus-within:ring-3 focus-within:ring-[#DB2F3C]/50 transition-all">
              <div className="pl-3.5 pr-2 text-stone-400 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-stone-500" />
              </div>
              <input
                id="help-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search by topic, e.g. verification, sub-caste, refund, delete profile..."
                aria-label="Search help articles and topics"
                className="w-full py-2.5 px-1 text-sm sm:text-base text-stone-900 placeholder:text-stone-400 focus:outline-hidden bg-transparent"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors mr-1 cursor-pointer"
                  aria-label="Clear search query"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Keyword Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-4 text-xs text-stone-300">
              <span className="flex items-center gap-1 text-stone-400 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Popular:
              </span>
              {QUICK_CHIPS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => onQuickChipClick(chip)}
                  className={`px-3 py-1 rounded-full border transition-all text-xs font-medium cursor-pointer ${
                    searchQuery.toLowerCase() === chip.toLowerCase()
                      ? "bg-[#DB2F3C] border-[#DB2F3C] text-white shadow-xs"
                      : "bg-white/5 border-white/10 text-stone-300 hover:bg-white/15 hover:border-white/25 hover:text-white"
                  }`}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>
    );
  }
);

HelpHero.displayName = "HelpHero";
