import React, { Suspense } from "react";
import type { Metadata } from "next";
import { RegistrationAdditionalInfoScreen } from "@/screens/registrationAdditionalInfoScreen";
import {
  createMetadata,
  JsonLd,
  generateWebPageSchema,
  generateBreadcrumbSchema,
} from "@/metadata";

export const metadata: Metadata = createMetadata({
  title: "Additional Details (Step 4/4) | SindhiMatrimony.com",
  description:
    "Complete Step 4 of your SindhiMatrimony registration by selecting your family status and writing a few words about yourself.",
  canonicalPath: "/registration/additional-info",
  keywords: [
    "Sindhi Matrimony Additional Details",
    "Family Status",
    "About Myself",
    "Step 4 Matrimony Registration",
    "Sindhi Marriage Registration",
  ],
});

/**
 * Fast Streaming Skeleton Fallback for Suspense Boundary
 */
function RegistrationAdditionalInfoSkeleton() {
  return (
    <div className="flex-1 w-full flex flex-col items-center justify-start pt-6 sm:pt-10 px-4">
      <div className="w-full max-w-xl mx-auto space-y-4 animate-pulse">
        <div className="flex justify-between items-center mb-4">
          <div className="h-6 w-56 bg-stone-200 rounded-md" />
          <div className="h-5 w-20 bg-stone-200 rounded-md" />
        </div>
        <div className="w-full bg-white rounded-3xl p-8 border border-stone-200 space-y-6">
          <div className="h-5 w-36 bg-stone-200 rounded-md" />
          <div className="flex gap-3">
            <div className="h-10 w-28 bg-stone-100 rounded-full" />
            <div className="h-10 w-36 bg-stone-100 rounded-full" />
          </div>
          <div className="h-5 w-44 bg-stone-200 rounded-md" />
          <div className="h-32 bg-stone-100 rounded-xl" />
          <div className="h-12 bg-red-100/50 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export default function RegistrationAdditionalInfoPage() {
  const webPageSchema = generateWebPageSchema({
    title: "Additional Details (Step 4/4) | SindhiMatrimony.com",
    description:
      "Complete Step 4 of your SindhiMatrimony registration by selecting your family status and writing a few words about yourself.",
    path: "/registration/additional-info",
    datePublished: "2026-01-01",
    dateModified: "2026-10-15",
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Verify OTP", path: "/registration/otp" },
    { name: "Basic Details (Step 1/4)", path: "/registration/basic-info" },
    {
      name: "Personal & Religious Details (Step 2/4)",
      path: "/registration/personal-religious-info",
    },
    {
      name: "Location & Professional Details (Step 3/4)",
      path: "/registration/location-professional-info",
    },
    {
      name: "Additional Details (Step 4/4)",
      path: "/registration/additional-info",
    },
  ]);

  return (
    <>
      <JsonLd data={webPageSchema} />
      <JsonLd data={breadcrumbSchema} />
      <Suspense fallback={<RegistrationAdditionalInfoSkeleton />}>
        <RegistrationAdditionalInfoScreen />
      </Suspense>
    </>
  );
}
