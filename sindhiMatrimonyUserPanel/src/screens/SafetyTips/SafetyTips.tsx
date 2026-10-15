import React from "react";
import { HelpCircle } from "lucide-react";
import {
  SAFETY_META,
  SAFETY_QUICK_RULES,
  SAFETY_SECTIONS,
} from "./data/safetyData";
import {
  SafetyHeader,
  SafetyBreadcrumb,
  SafetyHeroHeader,
  SafetyQuickRules,
  SafetySidebarNav,
  SafetySupportCard,
  SafetyEmergencyCard,
  SafetySectionCard,
  SafetyFAQSection,
  SafetyAssuranceCard,
  SafetyFooter,
} from "./component";

export const SafetyTips: React.FC = React.memo(() => {
  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-[#1A1A1A] selection:bg-red-100 selection:text-red-900 font-sans">
      {/* 1. Sticky Navigation Header & Login Island */}
      <SafetyHeader />

      {/* 2. Main Page Container */}
      <main className="flex-1 w-full pt-16 sm:pt-18">
        <SafetyBreadcrumb />
        <SafetyHeroHeader meta={SAFETY_META} />

        {/* 3. Core Content Body */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Quick Rules Highlight Banner */}
          <SafetyQuickRules rules={SAFETY_QUICK_RULES} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Sidebar: Sticky Table of Contents & Emergency Numbers (Desktop) */}
            <aside className="lg:col-span-4 hidden lg:block sticky top-24 space-y-5">
              <SafetySidebarNav sections={SAFETY_SECTIONS} />
              <SafetySupportCard />
              <SafetyEmergencyCard />
            </aside>

            {/* Right Main Column: Safety Articles & Guidelines */}
            <article className="lg:col-span-8 space-y-8">
              {/* Dynamic Empty Search Notice */}
              <div
                id="safety-empty-search-notice"
                style={{ display: "none" }}
                className="bg-white rounded-2xl border border-stone-200 p-8 text-center space-y-3"
              >
                <HelpCircle className="w-10 h-10 text-stone-400 mx-auto" />
                <h3 className="font-heading font-bold text-stone-800 text-base">
                  No safety guidelines matched your search keyword
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Try searching for keywords such as money, transfer, meeting, video call, verification, cyber, or police.
                </p>
              </div>

              {/* 100% Pre-rendered Server Content for Immediate Googlebot Crawling */}
              {SAFETY_SECTIONS.map((sec) => (
                <SafetySectionCard key={sec.id} section={sec} />
              ))}

              {/* On-Page FAQs (Synced with Google FAQ Schema) */}
              <SafetyFAQSection />

              {/* Mobile Emergency Card View */}
              <div className="block lg:hidden">
                <SafetyEmergencyCard />
              </div>

              {/* Trust & Verification Assurance Card */}
              <SafetyAssuranceCard />
            </article>
          </div>
        </div>
      </main>

      {/* 4. Footer */}
      <SafetyFooter />
    </div>
  );
});

SafetyTips.displayName = "SafetyTips";

export default SafetyTips;
