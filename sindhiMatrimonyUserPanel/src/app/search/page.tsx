import React, { Suspense } from "react";
import type { Metadata } from "next";
import { DashboardScreen } from "@/screens/dashboardScreen";
import {
  createMetadata,
  JsonLd,
  generateWebPageSchema,
} from "@/metadata";

export const metadata: Metadata = createMetadata({
  title: "Search Profiles – Advanced Partner Search | SindhiMatrimony.com",
  description:
    "Find your dream life partner using advanced search filters by age, height, caste, education, occupation, and location on SindhiMatrimony.",
  canonicalPath: "/search",
  keywords: [
    "Sindhi Matrimony Search",
    "Partner Search",
    "Caste Filter",
    "Gothra Search",
    "Education Search",
    "Horoscope Search",
  ],
});

function SearchSkeleton() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] animate-pulse">
      <div className="h-16 bg-white border-b border-stone-200" />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="w-full h-[600px] bg-white rounded-2xl border border-stone-200" />
      </div>
    </div>
  );
}

export default function SearchPage() {
  const webPageSchema = generateWebPageSchema({
    title: "Search Profiles | SindhiMatrimony.com",
    description: "Search and filter compatible matches by personal, religious, and lifestyle criteria.",
    path: "/search",
    datePublished: "2026-01-01",
    dateModified: "2026-10-16",
  });

  return (
    <>
      <JsonLd data={webPageSchema} />
      <DashboardScreen initialTab="search" />
    </>
  );
}
