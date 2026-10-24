import React, { Suspense } from "react";
import type { Metadata } from "next";
import { SubscriptionScreen } from "@/screens/subscriptionScreen";
import {
  createMetadata,
  JsonLd,
  generateWebPageSchema,
} from "@/metadata";

export const metadata: Metadata = createMetadata({
  title: "Membership Plans & Subscription Packages | Sindhimarriage.in",
  description:
    "Upgrade your Sindhi Matrimony membership to view contact details, send unlimited messages, and connect directly with verified Sindhi prospects.",
  canonicalPath: "/subscription",
  keywords: [
    "Sindhi Matrimony Plans",
    "Membership Packages",
    "Upgrade Account",
    "VIP Assisted Matchmaking",
    "Sindhi Rishta Contacts",
  ],
});

function SubscriptionSkeleton() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] animate-pulse">
      <div className="h-16 bg-white border-b border-stone-200" />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="h-8 bg-stone-200 rounded-md w-64 mx-auto mb-4" />
        <div className="h-4 bg-stone-200 rounded-md w-96 mx-auto mb-10" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-96 bg-white rounded-2xl border border-stone-200" />
          <div className="h-96 bg-white rounded-2xl border border-stone-200" />
          <div className="h-96 bg-white rounded-2xl border border-stone-200" />
        </div>
      </div>
    </div>
  );
}

export default function SubscriptionPage() {
  const webPageSchema = generateWebPageSchema({
    title: "Membership Plans | Sindhimarriage.in",
    description: "Explore flexible subscription packages for verified Sindhi matchmaking.",
    path: "/subscription",
    datePublished: "2026-01-01",
    dateModified: "2026-10-24",
  });

  return (
    <>
      <JsonLd data={webPageSchema} />
      <Suspense fallback={<SubscriptionSkeleton />}>
        <SubscriptionScreen />
      </Suspense>
    </>
  );
}
