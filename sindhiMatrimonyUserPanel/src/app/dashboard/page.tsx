import React, { Suspense } from "react";
import type { Metadata } from "next";
import { DashboardScreen } from "@/screens/dashboardScreen";
import {
  createMetadata,
  JsonLd,
  generateWebPageSchema,
} from "@/metadata";

export const metadata: Metadata = createMetadata({
  title: "Dashboard – Matrimony Matches & Profile | SindhiMatrimony.com",
  description:
    "Explore compatible Sindhi matches, complete your profile, and connect with prospective brides and grooms on SindhiMatrimony.",
  canonicalPath: "/dashboard",
  keywords: [
    "Sindhi Matrimony Dashboard",
    "Partner Matches",
    "Sindhi Brides",
    "Sindhi Grooms",
    "Matrimonial Profile",
  ],
});

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] animate-pulse">
      <div className="h-16 bg-white border-b border-stone-200" />
      <div className="h-12 bg-white border-b border-stone-200" />
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-80 h-96 bg-white rounded-2xl border border-stone-200" />
        <div className="flex-1 space-y-6">
          <div className="h-44 bg-white rounded-2xl border border-stone-200" />
          <div className="h-64 bg-white rounded-2xl border border-stone-200" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const webPageSchema = generateWebPageSchema({
    title: "Dashboard | SindhiMatrimony.com",
    description:
      "Explore compatible Sindhi matches, complete your profile, and connect with prospective partners.",
    path: "/dashboard",
    datePublished: "2026-01-01",
    dateModified: "2026-10-16",
  });

  return (
    <>
      <JsonLd data={webPageSchema} />
      <DashboardScreen />
    </>
  );
}
