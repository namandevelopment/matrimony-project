"use client";

import React, { useState, useEffect } from "react";
import { HelpCircle } from "lucide-react";
import { TERMS_META, TERMS_SECTIONS } from "./data/termsData";
import { TermsSection, TermsMetaInfo } from "./types";
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
import { apiFetch } from "@/redux/apiService";
import { ApiURL } from "@/redux/apiService/endpoint";

export const TermsAndCondition: React.FC = () => {
  const [meta, setMeta] = useState<TermsMetaInfo>(TERMS_META);
  const [sections, setSections] = useState<TermsSection[]>([...TERMS_SECTIONS]);

  // Fetch dynamic terms content from unified backend API (?type=terms-and-conditions)
  useEffect(() => {
    let isMounted = true;
    apiFetch.get<any>(ApiURL.termsAndConditions)
      .then((res) => {
        if (!isMounted || !res?.data) return;
        const apiData = res.data;

        // Merge dynamic metadata if present
        if (apiData.lastUpdatedDate || apiData.effectiveDate) {
          setMeta((prev: TermsMetaInfo) => ({
            ...prev,
            lastUpdatedDate: apiData.lastUpdatedDate || prev.lastUpdatedDate,
            effectiveDate: apiData.effectiveDate || prev.effectiveDate,
            targetAudience:
              apiData.meta?.targetAudience || prev.targetAudience,
          }));
        }

        // If backend returned custom structured sections
        if (Array.isArray(apiData.sections) && apiData.sections.length > 0) {
          const mapped: TermsSection[] = apiData.sections.map((s: any) => ({
            id: s.id,
            number: s.number,
            title: s.title,
            badge: s.badge || undefined,
            content: (
              <div className="space-y-4">
                {s.summary && (
                  <p className="text-stone-700 leading-relaxed font-medium">
                    {s.summary}
                  </p>
                )}
                {Array.isArray(s.paragraphs) &&
                  s.paragraphs.map((p: string, pIdx: number) => (
                    <p key={pIdx} className="text-stone-700 leading-relaxed">
                      {p}
                    </p>
                  ))}
                {Array.isArray(s.bullets) && s.bullets.length > 0 && (
                  <ul className="space-y-2 pl-4 list-disc text-stone-700">
                    {s.bullets.map((b: string, bIdx: number) => (
                      <li key={bIdx}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ),
          }));
          setSections(mapped);
        }
      })
      .catch(() => {
        // Fallback silently to pre-bundled TERMS_SECTIONS
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-[#1A1A1A] selection:bg-red-100 selection:text-red-900 font-sans">
      {/* 1. Sticky Navigation Header & Login Island */}
      <TermsHeader />

      {/* 2. Main Page Container */}
      <main className="flex-1 w-full pt-16 sm:pt-18">
        <TermsBreadcrumb />
        <TermsHeroHeader meta={meta} />

        {/* 3. Core Content Body (Sidebar Navigation + Clauses) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Sidebar: Sticky Table of Contents (Desktop) */}
            <aside className="lg:col-span-4 hidden lg:block sticky top-24 space-y-5">
              <TermsSidebarNav sections={sections} />
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

              {/* Render dynamic sections or pre-rendered static fallback */}
              {sections.map((sec) => (
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
