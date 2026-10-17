import React, { Suspense } from "react";
import type { Metadata } from "next";
import { DashboardScreen } from "@/screens/dashboardScreen";
import {
  createMetadata,
  JsonLd,
  generateWebPageSchema,
} from "@/metadata";

export const metadata: Metadata = createMetadata({
  title: "Notifications & Activity Alerts | SindhiMatrimony.com",
  description:
    "Stay updated with real-time interest alerts, messages, profile views, Kundali requests, and daily partner matches on SindhiMatrimony.",
  canonicalPath: "/notifications",
  keywords: [
    "Sindhi Matrimony Notifications",
    "Interest Alerts",
    "Profile Views",
    "Kundali Requests",
    "Sindhi Matches Activity",
    "Verified Matches",
  ],
  noIndex: true,
});

function NotificationsSkeleton() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] animate-pulse">
      <div className="h-16 bg-white border-b border-stone-200" />
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="h-28 bg-white rounded-2xl border border-stone-200" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-4">
            <div className="h-12 bg-white rounded-2xl border border-stone-200" />
            <div className="h-10 bg-white rounded-xl border border-stone-200" />
            <div className="h-44 bg-white rounded-2xl border border-stone-200" />
            <div className="h-44 bg-white rounded-2xl border border-stone-200" />
            <div className="h-44 bg-white rounded-2xl border border-stone-200" />
          </div>
          <div className="lg:col-span-4 space-y-4">
            <div className="h-64 bg-white rounded-2xl border border-stone-200" />
            <div className="h-44 bg-stone-900 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  const webPageSchema = generateWebPageSchema({
    title: "Notifications & Alerts | SindhiMatrimony.com",
    description:
      "Stay updated with real-time interest alerts, messages, profile views, Kundali requests, and daily partner matches on SindhiMatrimony.",
    path: "/notifications",
    datePublished: "2026-01-01",
    dateModified: "2026-10-17",
  });

  return (
    <>
      <JsonLd data={webPageSchema} />
      <DashboardScreen initialTab="notifications" />
    </>
  );
}
