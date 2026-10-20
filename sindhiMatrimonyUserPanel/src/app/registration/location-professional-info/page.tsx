import React, { Suspense } from "react";
import type { Metadata } from "next";
import { RegistrationLocationProfessionalScreen } from "@/screens/registrationLocationProfessionalScreen";
import {
  createMetadata,
  JsonLd,
  generateWebPageSchema,
  generateBreadcrumbSchema,
} from "@/metadata";

export const metadata: Metadata = createMetadata({
  title: "Location and Professional Details (Step 3/4) | Sindhimarriage.in",
  description:
    "Enter location, education, employment type, occupation, and annual income to complete Step 3 of your SindhiMatrimony registration.",
  canonicalPath: "/registration/location-professional-info",
  keywords: [
    "Sindhi Matrimony Location Details",
    "Sindhi Matrimony Education",
    "Sindhi Matrimony Profession",
    "Step 3 Matrimony Registration",
    "Sindhi Marriage Registration",
  ],
});

/**
 * Fast Streaming Skeleton Fallback for Suspense Boundary
 */
function RegistrationLocationProfessionalSkeleton() {
  return (
    <div className="flex-1 w-full flex flex-col items-center justify-start pt-6 sm:pt-10 px-4">
      <div className="w-full max-w-xl mx-auto space-y-4 animate-pulse">
        <div className="flex justify-between items-center mb-4">
          <div className="h-6 w-56 bg-stone-200 rounded-md" />
          <div className="h-5 w-20 bg-stone-200 rounded-md" />
        </div>
        <div className="w-full bg-white rounded-3xl p-8 border border-stone-200 space-y-6">
          <div className="h-5 w-32 bg-stone-200 rounded-md" />
          <div className="h-12 bg-stone-100 rounded-xl" />
          <div className="h-5 w-32 bg-stone-200 rounded-md" />
          <div className="h-12 bg-stone-100 rounded-xl" />
          <div className="h-12 bg-stone-100 rounded-xl" />
          <div className="h-12 bg-stone-100 rounded-xl" />
          <div className="h-12 bg-red-100/50 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export default function RegistrationLocationProfessionalPage() {
  const webPageSchema = generateWebPageSchema({
    title: "Location and Professional Details (Step 3/4) | Sindhimarriage.in",
    description:
      "Enter location, education, employment type, occupation, and annual income to complete Step 3 of your SindhiMatrimony registration.",
    path: "/registration/location-professional-info",
    datePublished: "2026-01-01",
    dateModified: "2026-10-15",
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Registration", path: "/#register" },
    { name: "Basic Details", path: "/registration/basic-info" },
    { name: "Personal & Religious", path: "/registration/personal-religious-info" },
    { name: "Location & Professional", path: "/registration/location-professional-info" },
  ]);

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema]} />
      <Suspense fallback={<RegistrationLocationProfessionalSkeleton />}>
        <RegistrationLocationProfessionalScreen />
      </Suspense>
    </>
  );
}
