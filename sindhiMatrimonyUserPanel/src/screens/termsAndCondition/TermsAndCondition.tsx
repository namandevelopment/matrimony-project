import React from "react";
import { HelpCircle } from "lucide-react";
import { TERMS_META, TERMS_SECTIONS } from "./data/termsData";
import {
  TermsHeader,
  TermsBreadcrumb,
  TermsHeroHeader,
  TermsSidebarNav,
  TermsSupportCard,
  TermsSectionCard,
  TermsAssuranceCard,
  TermsFooter,
} from "./components";

export const TermsAndCondition: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-[#1A1A1A] selection:bg-red-100 selection:text-red-900 font-sans">
      {/* 1. Sticky Navigation Header & Login Island */}
      <TermsHeader />

      {/* 2. Main Page Container */}
      <main className="flex-1 w-full pt-16 sm:pt-18">
        <TermsBreadcrumb />
        <TermsHeroHeader meta={TERMS_META} />

        {/* 3. Core Content Body (Sidebar Navigation + Clauses) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Sidebar: Sticky Table of Contents (Desktop) */}
            <aside className="lg:col-span-4 hidden lg:block sticky top-24 space-y-5">
              <TermsSidebarNav sections={TERMS_SECTIONS} />
              <TermsSupportCard />
            </aside>

            {/* Right Main Column: Legal Clauses Content */}
            <article className="lg:col-span-8 space-y-8">
              {/* Dynamic Empty Search Notice */}
              <div
                id="terms-empty-search-notice"
                style={{ display: "none" }}
                className="bg-white rounded-2xl border border-stone-200 p-8 text-center space-y-3"
              >
                <HelpCircle className="w-10 h-10 text-stone-400 mx-auto" />
                <h3 className="font-heading font-bold text-stone-800 text-base">
                  No clauses matched your search keyword
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Try searching for different keywords such as eligibility, refund, dowry, verification, or grievance.
                </p>
              </div>

              {/* 100% Pre-rendered Server Content for Immediate Googlebot Indexing */}
              {TERMS_SECTIONS.map((sec) => (
                <TermsSectionCard key={sec.id} section={sec} />
              ))}

              <TermsAssuranceCard />
            </article>
          </div>
        </div>
      </main>

      {/* 4. Footer */}
      <TermsFooter />
    </div>
  );
};

export default TermsAndCondition;
