import React, { Suspense } from "react";
import type { Metadata } from "next";
import { DashboardScreen } from "@/screens/dashboardScreen";
import {
  createMetadata,
  JsonLd,
  generateWebPageSchema,
} from "@/metadata";

export const metadata: Metadata = createMetadata({
  title: "Pending Interests – Sindhi Matrimony Mailbox | SindhiMatrimony.com",
  description:
    "Manage your received and sent matrimony interest requests. Accept, reply, or decline prospective matches on SindhiMatrimony.",
  canonicalPath: "/interests",
  keywords: [
    "Sindhi Matrimony Interests",
    "Pending Interests",
    "Received Interests",
    "Sent Interests",
    "Matrimony Mailbox",
  ],
});

function InterestsSkeleton() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] animate-pulse">
      <div className="h-16 bg-white border-b border-stone-200" />
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-72 h-80 bg-white rounded-2xl border border-stone-200" />
        <div className="flex-1 h-96 bg-white rounded-2xl border border-stone-200" />
      </div>
    </div>
  );
}

export default function InterestsPage() {
  const webPageSchema = generateWebPageSchema({
    title: "Interests Mailbox | SindhiMatrimony.com",
    description: "Manage your received and sent matrimony interest requests.",
    path: "/interests",
    datePublished: "2026-01-01",
    dateModified: "2026-10-16",
  });

  return (
    <>
      <JsonLd data={webPageSchema} />
      <DashboardScreen initialTab="interests" />
    </>
  );
}
