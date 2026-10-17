import React, { Suspense } from "react";
import type { Metadata } from "next";
import { OnboardingScreen } from "@/screens/onboardingScreen";
import {
  createMetadata,
  JsonLd,
  generateWebPageSchema,
  generateBreadcrumbSchema,
} from "@/metadata";

export const metadata: Metadata = createMetadata({
  title: "Complete Your Profile Onboarding | SindhiMatrimony.com",
  description:
    "Add your horoscope, star, and lifestyle interests to find your most compatible Sindhi match.",
  canonicalPath: "/onboarding",
  keywords: [
    "Sindhi Matrimony Horoscope",
    "Sindhi Kundali Matching",
    "Star Nakshatra",
    "Sindhi Matrimony Hobbies",
    "Sindhi Matrimony Onboarding",
  ],
  noIndex: true,
});

function OnboardingSkeleton() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-[#F7F8FA] pt-10 px-4">
      <div className="w-full max-w-xl mx-auto space-y-4 animate-pulse">
        <div className="flex justify-between items-center mb-4">
          <div className="h-6 w-56 bg-stone-200 rounded-md" />
          <div className="h-5 w-20 bg-stone-200 rounded-md" />
        </div>
        <div className="w-full bg-white rounded-3xl p-8 border border-stone-200 space-y-6">
          <div className="w-20 h-20 bg-stone-100 rounded-2xl mx-auto" />
          <div className="h-12 bg-stone-100 rounded-xl" />
          <div className="h-12 bg-stone-100 rounded-xl" />
          <div className="h-12 bg-stone-100 rounded-xl" />
          <div className="h-12 bg-red-100/50 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  const webPageSchema = generateWebPageSchema({
    title: "Complete Your Profile Onboarding | SindhiMatrimony.com",
    description:
      "Add your horoscope, star, and lifestyle interests to find your most compatible Sindhi match.",
    path: "/onboarding",
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
    {
      name: "Profile Onboarding",
      path: "/onboarding",
    },
  ]);

  return (
    <>
      <JsonLd data={webPageSchema} />
      <JsonLd data={breadcrumbSchema} />
      <Suspense fallback={<OnboardingSkeleton />}>
        <OnboardingScreen />
      </Suspense>
    </>
  );
}
