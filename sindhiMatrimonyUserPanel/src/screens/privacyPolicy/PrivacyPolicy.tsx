import React from "react";
import { HelpCircle } from "lucide-react";
import { PRIVACY_META, PRIVACY_SECTIONS } from "./data/privacyData";
import {
  PrivacyHeader,
  PrivacyBreadcrumb,
  PrivacyHeroHeader,
  PrivacySidebarNav,
  PrivacySupportCard,
  PrivacySectionCard,
  PrivacyAssuranceCard,
  PrivacyFooter,
} from "./components";

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-[#1A1A1A] selection:bg-red-100 selection:text-red-900 font-sans">
      {/* 1. Sticky Navigation Header & Login Island */}
      <PrivacyHeader />

      {/* 2. Main Page Container */}
      <main className="flex-1 w-full pt-16 sm:pt-18">
        <PrivacyBreadcrumb />
        <PrivacyHeroHeader meta={PRIVACY_META} />

        {/* 3. Core Content Body (Sidebar + Clauses) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Sidebar Table of Contents */}
            <aside className="lg:col-span-4 hidden lg:block sticky top-24 space-y-5">
              <PrivacySidebarNav sections={PRIVACY_SECTIONS} />
              <PrivacySupportCard />
            </aside>

            {/* Right Main Column: Policy Articles */}
            <article className="lg:col-span-8 space-y-8">
              {/* Dynamic Empty Search Notice */}
              <div
                id="privacy-empty-search-notice"
                style={{ display: "none" }}
                className="bg-white rounded-2xl border border-stone-200 p-8 text-center space-y-3"
              >
                <HelpCircle className="w-10 h-10 text-stone-400 mx-auto" />
                <h3 className="font-heading font-bold text-stone-800 text-base">
                  No policy clause matched your search keyword
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Try searching for keywords such as encryption, photos, deletion, cookies, or DPO.
                </p>
              </div>

              {/* 100% Pre-rendered Server Content for Immediate Googlebot Indexing */}
              {PRIVACY_SECTIONS.map((sec) => (
                <PrivacySectionCard key={sec.id} section={sec} />
              ))}

              <PrivacyAssuranceCard />
            </article>
          </div>
        </div>
      </main>

      {/* 4. Footer */}
      <PrivacyFooter />
    </div>
  );
};

export default PrivacyPolicy;
