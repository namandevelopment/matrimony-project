"use client";

import React, { memo } from "react";
import {
  HelpCategoryId,
  HelpCategory,
  HelpGuideline,
} from "../types";
import {
  CheckCircle2,
  Lightbulb,
  Tag,
  ChevronRight,
  UserCheck,
  Search,
  CreditCard,
  Lock,
  ShieldAlert,
  HelpCircle,
} from "lucide-react";

interface HelpGuidelinesSectionProps {
  categories: HelpCategory[];
  guidelines: HelpGuideline[];
  activeCategory: HelpCategoryId;
  onSelectCategory: (category: HelpCategoryId) => void;
  searchQuery: string;
  onResetSearch: () => void;
}

export const HelpGuidelinesSection: React.FC<HelpGuidelinesSectionProps> = memo(
  ({
    categories,
    guidelines,
    activeCategory,
    onSelectCategory,
    searchQuery,
    onResetSearch,
  }) => {
    const getCategoryIcon = (id: HelpCategoryId) => {
      switch (id) {
        case "profile-verification":
          return <UserCheck className="w-4 h-4" />;
        case "matchmaking-search":
          return <Search className="w-4 h-4" />;
        case "membership-billing":
          return <CreditCard className="w-4 h-4" />;
        case "privacy-security":
          return <Lock className="w-4 h-4" />;
        case "safety-fraud":
          return <ShieldAlert className="w-4 h-4" />;
        default:
          return <HelpCircle className="w-4 h-4" />;
      }
    };

    return (
      <section
        id="guidelines-section"
        aria-label="Support Guidelines and Step-by-Step Instructions"
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        <div className="space-y-8">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#DB2F3C]">
                Official User Manual
              </span>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-stone-900 font-heading mt-1">
                Help Topics &amp; Step-by-Step Guides
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl">
                Comprehensive step-by-step instructions to get the most out of SindhiMatrimony features, privacy shields, and matchmaking services.
              </p>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onSelectCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#DB2F3C] text-white shadow-sm shadow-red-500/20"
                      : "bg-white text-stone-600 border border-stone-200 hover:border-stone-300 hover:bg-stone-50"
                  }`}
                >
                  <span className={isActive ? "text-white" : "text-[#DB2F3C]"}>
                    {getCategoryIcon(cat.id)}
                  </span>
                  <span>{cat.shortTitle}</span>
                  {cat.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-red-100 text-[#DB2F3C]"
                      }`}
                    >
                      {cat.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Guidelines Grid / List */}
          {guidelines.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-10 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 mx-auto flex items-center justify-center">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-heading font-bold text-stone-800 text-lg">
                  No guidelines found matching &quot;{searchQuery}&quot;
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
                  Try searching for keywords like verification, sub-caste, phone privacy, photo blur, refund, or contact.
                </p>
              </div>
              <button
                type="button"
                onClick={onResetSearch}
                className="px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-xl hover:bg-stone-800 transition-colors cursor-pointer"
              >
                Clear Search &amp; Show All Guides
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {guidelines.map((guide) => (
                <article
                  key={guide.id}
                  id={guide.id}
                  className="bg-white rounded-2xl border border-stone-200 shadow-xs hover:border-stone-300 transition-all overflow-hidden"
                >
                  {/* Article Header Banner */}
                  <div className="p-6 sm:p-7 border-b border-stone-100 bg-gradient-to-r from-stone-50/80 via-white to-white">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-[11px] font-semibold text-[#DB2F3C] uppercase tracking-wider bg-red-50 border border-red-100 px-2.5 py-0.5 rounded-full">
                        {categories.find((c) => c.id === guide.categoryId)?.shortTitle ||
                          "Guide"}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-stone-900 font-heading">
                      {guide.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 mt-1.5 leading-relaxed">
                      {guide.summary}
                    </p>
                  </div>

                  {/* Step-by-Step Content */}
                  <div className="p-6 sm:p-7 space-y-5">
                    <div className="space-y-4">
                      {guide.steps.map((step) => (
                        <div
                          key={step.stepNumber}
                          className="flex items-start gap-3.5 sm:gap-4 group"
                        >
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-red-50 border border-red-200 text-[#DB2F3C] text-xs sm:text-sm font-bold flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#DB2F3C] group-hover:text-white transition-colors">
                            {step.stepNumber}
                          </div>
                          <div className="flex-1 space-y-1">
                            <h4 className="text-sm font-bold text-stone-800">
                              {step.title}
                            </h4>
                            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pro Tips Box */}
                    {guide.tips && guide.tips.length > 0 && (
                      <div className="mt-5 p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                          <Lightbulb className="w-4 h-4 text-amber-600" />
                          <span>Pro-Tips from SindhiMatrimony Advisors:</span>
                        </div>
                        <ul className="space-y-1.5 text-xs text-amber-900/90 pl-5 list-disc">
                          {guide.tips.map((tip, idx) => (
                            <li key={idx} className="leading-relaxed">
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Tags Footer */}
                    <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center gap-1.5 text-[11px] text-stone-400">
                      <Tag className="w-3.5 h-3.5" />
                      {guide.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }
);

HelpGuidelinesSection.displayName = "HelpGuidelinesSection";
