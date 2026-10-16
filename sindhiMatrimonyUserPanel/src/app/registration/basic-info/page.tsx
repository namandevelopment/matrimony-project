import React, { Suspense } from "react";
import type { Metadata } from "next";
import { RegistrationBasicInfoScreen } from "@/screens/registrationBasicInfoScreen";
import {
  createMetadata,
  JsonLd,
  generateWebPageSchema,
  generateBreadcrumbSchema,
} from "@/metadata";

export const metadata: Metadata = createMetadata({
  title: "Basic Details (Step 1/4) | SindhiMatrimony.com",
  description:
    "Enter your date of birth, mother tongue, email, and password to complete Step 1 of your SindhiMatrimony registration.",
  canonicalPath: "/registration/basic-info",
  keywords: [
    "Sindhi Matrimony Registration",
    "Basic Details Matrimony",
    "Step 1 Matrimony Registration",
    "Sindhi Matrimony Account Creation",
  ],
});

/**
 * Fast Streaming Skeleton Fallback for Suspense Boundary
 */
function RegistrationBasicInfoSkeleton() {
  return (
    <div className="flex-1 w-full flex flex-col items-center justify-start pt-6 sm:pt-10 px-4">
      <div className="w-full max-w-xl mx-auto space-y-4 animate-pulse">
        <div className="flex justify-between items-center mb-4">
          <div className="h-6 w-36 bg-stone-200 rounded-md" />
          <div className="h-5 w-20 bg-stone-200 rounded-md" />
        </div>
        <div className="w-full bg-white rounded-3xl p-8 border border-stone-200 space-y-6">
          <div className="h-5 w-28 bg-stone-200 rounded-md" />
          <div className="grid grid-cols-3 gap-3">
            <div className="h-12 bg-stone-100 rounded-xl" />
            <div className="h-12 bg-stone-100 rounded-xl" />
            <div className="h-12 bg-stone-100 rounded-xl" />
          </div>
          <div className="h-12 bg-stone-100 rounded-xl" />
          <div className="h-12 bg-stone-100 rounded-xl" />
          <div className="h-12 bg-stone-100 rounded-xl" />
          <div className="h-12 bg-stone-200 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export default function RegistrationBasicInfoPage() {
  const webPageSchema = generateWebPageSchema({
    title: "Basic Details (Step 1/4) | SindhiMatrimony.com",
    description:
      "Enter your date of birth, mother tongue, email, and password to complete Step 1 of your SindhiMatrimony registration.",
    path: "/registration/basic-info",
    datePublished: "2026-01-01",
    dateModified: "2026-10-15",
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Registration", path: "/#register" },
    { name: "Verify OTP", path: "/registration/otp" },
    { name: "Basic Details", path: "/registration/basic-info" },
  ]);

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema]} />
      <Suspense fallback={<RegistrationBasicInfoSkeleton />}>
        <RegistrationBasicInfoScreen />
      </Suspense>
    </>
  );
}
