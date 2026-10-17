import React, { Suspense } from "react";
import type { Metadata } from "next";
import { DashboardScreen } from "@/screens/dashboardScreen";
import {
  createMetadata,
  JsonLd,
  generateWebPageSchema,
} from "@/metadata";

export const metadata: Metadata = createMetadata({
  title: "Messages & Chats – Connect with Matches | SindhiMatrimony.com",
  description:
    "Communicate directly with compatible Sindhi prospects and Matrimony experts. Read messages, send responses, and find your life partner.",
  canonicalPath: "/messages",
  keywords: [
    "Sindhi Matrimony Messages",
    "Matrimony Chat",
    "Assisted Service",
    "Direct Messaging",
    "Prospect Conversations",
  ],
  noIndex: true,
});

function MessagesSkeleton() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] animate-pulse">
      <div className="h-16 bg-white border-b border-stone-200" />
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-96 h-[500px] bg-white rounded-2xl border border-stone-200" />
        <div className="flex-1 h-[500px] bg-white rounded-2xl border border-stone-200" />
      </div>
    </div>
  );
}

export default function MessagesPage() {
  const webPageSchema = generateWebPageSchema({
    title: "Messages | SindhiMatrimony.com",
    description: "Communicate directly with prospective matches and matrimony counselors.",
    path: "/messages",
    datePublished: "2026-01-01",
    dateModified: "2026-10-16",
  });

  return (
    <>
      <JsonLd data={webPageSchema} />
      <DashboardScreen initialTab="messages" />
    </>
  );
}
