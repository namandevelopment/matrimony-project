import React, { Suspense } from "react";
import type { Metadata } from "next";
import { RegistrationPersonalReligiousScreen } from "@/screens/registrationPersonalReligiousScreen";
import {
  createMetadata,
  JsonLd,
  generateWebPageSchema,
  generateBreadcrumbSchema,
} from "@/metadata";

export const metadata: Metadata = createMetadata({
  title: "Personal and Religious Details (Step 2/4) | SindhiMatrimony.com",
  description:
    "Enter height, marital status, physical status, religion, and caste to complete Step 2 of your SindhiMatrimony registration.",
  canonicalPath: "/registration/personal-religious-info",
  keywords: [
    "Sindhi Matrimony Personal Details",
    "Sindhi Matrimony Caste",
    "Step 2 Matrimony Registration",
    "Sindhi Marriage Registration",
  ],
});

/**
 * Fast Streaming Skeleton Fallback for Suspense Boundary
 */
function RegistrationPersonalReligiousSkeleton() {
  return (
    <div className="flex-1 w-full flex flex-col items-center justify-start pt-6 sm:pt-10 px-4">
      <div className="w-full max-w-xl mx-auto space-y-4 animate-pulse">
        <div className="flex justify-between items-center mb-4">
          <div className="h-6 w-48 bg-stone-200 rounded-md" />
          <div className="h-5 w-20 bg-stone-200 rounded-md" />
        </div>
        <div className="w-full bg-white rounded-3xl p-8 border border-stone-200 space-y-6">
          <div className="h-5 w-32 bg-stone-200 rounded-md" />
          <div className="h-12 bg-stone-100 rounded-xl" />
          <div className="flex gap-3">
            <div className="h-10 w-24 bg-stone-100 rounded-full" />
            <div className="h-10 w-36 bg-stone-100 rounded-full" />
          </div>
          <div className="grid grid-cols-2 gap-3 max-w-sm">
            <div className="h-10 bg-stone-100 rounded-full" />
            <div className="h-10 bg-stone-100 rounded-full" />
            <div className="h-10 bg-stone-100 rounded-full" />
            <div className="h-10 bg-stone-100 rounded-full" />
          </div>
          <div className="h-5 w-24 bg-stone-200 rounded-md" />
          <div className="h-12 bg-stone-100 rounded-xl" />
          <div className="h-12 bg-stone-100 rounded-xl" />
          <div className="h-12 bg-stone-200 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export default function RegistrationPersonalReligiousPage() {
  const webPageSchema = generateWebPageSchema({
    title: "Personal and Religious Details (Step 2/4) | SindhiMatrimony.com",
    description:
      "Enter height, marital status, physical status, religion, and caste to complete Step 2 of your SindhiMatrimony registration.",
    path: "/registration/personal-religious-info",
    datePublished: "2026-01-01",
    dateModified: "2026-10-15",
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Registration", path: "/#register" },
    { name: "Basic Details", path: "/registration/basic-info" },
    { name: "Personal & Religious", path: "/registration/personal-religious-info" },
  ]);

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema]} />
      <Suspense fallback={<RegistrationPersonalReligiousSkeleton />}>
        <RegistrationPersonalReligiousScreen />
      </Suspense>
    </>
  );
}
