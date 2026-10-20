import React, { Suspense } from "react";
import type { Metadata } from "next";
import { DashboardScreen } from "@/screens/dashboardScreen";
import {
  createMetadata,
  JsonLd,
  generateWebPageSchema,
} from "@/metadata";

export const metadata: Metadata = createMetadata({
  title: "Partner Matches – Sindhi Brides & Grooms | Sindhimarriage.in",
  description:
    "Explore 100% verified Sindhi matches based on your preferences. Shortlist, connect via Call and WhatsApp, and find your ideal life partner.",
  canonicalPath: "/matches",
  keywords: [
    "Sindhi Matrimony Matches",
    "Partner Preferences",
    "Sindhi Brides",
    "Sindhi Grooms",
    "Verified Matches",
    "Community Matrimony",
  ],
});

function MatchesSkeleton() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] animate-pulse">
      <div className="h-16 bg-white border-b border-stone-200" />
      <div className="h-12 bg-white border-b border-stone-200" />
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-80 h-96 bg-white rounded-2xl border border-stone-200" />
        <div className="flex-1 space-y-4">
          <div className="h-14 bg-white rounded-2xl border border-stone-200" />
          <div className="h-56 bg-white rounded-2xl border border-stone-200" />
          <div className="h-56 bg-white rounded-2xl border border-stone-200" />
          <div className="h-56 bg-white rounded-2xl border border-stone-200" />
        </div>
      </div>
    </div>
  );
}

export default function MatchesPage() {
  const webPageSchema = generateWebPageSchema({
    title: "All Matches | Sindhimarriage.in",
    description:
      "Explore 100% verified Sindhi matches based on your preferences. Shortlist, connect via Call and WhatsApp, and find your ideal life partner.",
    path: "/matches",
    datePublished: "2026-01-01",
    dateModified: "2026-10-16",
  });

  return (
    <>
      <JsonLd data={webPageSchema} />
      <DashboardScreen initialTab="matches" />
    </>
  );
}
