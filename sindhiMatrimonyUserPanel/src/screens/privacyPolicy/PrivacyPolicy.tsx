"use client";

import React, { useState, useEffect } from "react";
import { HelpCircle } from "lucide-react";
import { PRIVACY_META, PRIVACY_SECTIONS } from "./data/privacyData";
import { PolicySection, PolicyMetaInfo } from "./types";
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
import { apiFetch } from "@/redux/apiService";
import { ApiURL } from "@/redux/apiService/endpoint";

export const PrivacyPolicy: React.FC = () => {
  const [meta, setMeta] = useState<PolicyMetaInfo>(PRIVACY_META);
  const [sections, setSections] = useState<PolicySection[]>([...PRIVACY_SECTIONS]);

  // Fetch dynamic legal content from unified backend API (?type=privacy-policy)
  useEffect(() => {
    let isMounted = true;
    apiFetch.get<any>(ApiURL.privacyPolicy)
      .then((res) => {
        if (!isMounted || !res?.data) return;
        const apiData = res.data;

        // Merge dynamic metadata if present
        if (apiData.lastUpdatedDate || apiData.effectiveDate) {
          setMeta((prev) => ({
            ...prev,
            lastUpdatedDate: apiData.lastUpdatedDate || prev.lastUpdatedDate,
            effectiveDate: apiData.effectiveDate || prev.effectiveDate,
            complianceStandard:
              apiData.meta?.complianceStandard || prev.complianceStandard,
            securityStandard:
              apiData.meta?.securityStandard || prev.securityStandard,
          }));
        }

        // If backend returned custom structured sections
        if (Array.isArray(apiData.sections) && apiData.sections.length > 0) {
          const mapped: PolicySection[] = apiData.sections.map((s: any) => ({
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
        // Fallback silently to pre-bundled PRIVACY_SECTIONS
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-[#1A1A1A] selection:bg-red-100 selection:text-red-900 font-sans">
      {/* 1. Sticky Navigation Header & Login Island */}
      <PrivacyHeader />

      {/* 2. Main Page Container */}
      <main className="flex-1 w-full pt-16 sm:pt-18">
        <PrivacyBreadcrumb />
        <PrivacyHeroHeader meta={meta} />

        {/* 3. Core Content Body (Sidebar + Clauses) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Sidebar Table of Contents */}
            <aside className="lg:col-span-4 hidden lg:block sticky top-24 space-y-5">
              <PrivacySidebarNav sections={sections} />
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

              {/* Render dynamic sections or pre-rendered static fallback */}
              {sections.map((sec) => (
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
