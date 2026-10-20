import React, { Suspense } from "react";
import type { Metadata } from "next";
import { RegistrationOtpScreen } from "@/screens/registrationOtpScreen";
import {
  createMetadata,
  JsonLd,
  generateWebPageSchema,
  generateBreadcrumbSchema,
} from "@/metadata";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = createMetadata({
  title: "Verify Mobile Number with OTP | Sindhimarriage.in",
  description:
    "Enter the 4-digit verification code (OTP) sent to your registered mobile phone to activate your free SindhiMatrimony account and connect with verified Sindhi brides and grooms.",
  canonicalPath: "/registration/otp",
  keywords: [
    "Sindhi Matrimony OTP Verification",
    "Enter Registration OTP Sindhi Matrimony",
    "Verify Mobile Number Matrimony",
    "Sindhi Marriage Registration Verification",
    "Sindhi Matrimony Account Activation",
  ],
});

/**
 * Fast Streaming Skeleton Fallback for Suspense Boundary
 */
function RegistrationOtpSkeleton() {
  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-3xl p-10 shadow-xl border border-stone-200 text-center space-y-4 animate-pulse">
        <div className="w-20 h-20 rounded-full bg-stone-100 mx-auto" />
        <div className="h-6 w-48 bg-stone-200 rounded-md mx-auto" />
        <div className="h-4 w-64 bg-stone-100 rounded-md mx-auto" />
        <div className="flex justify-center gap-3 my-6">
          <div className="w-14 h-14 rounded-xl bg-stone-200" />
          <div className="w-14 h-14 rounded-xl bg-stone-200" />
          <div className="w-14 h-14 rounded-xl bg-stone-200" />
          <div className="w-14 h-14 rounded-xl bg-stone-200" />
        </div>
        <div className="h-12 w-64 bg-stone-200 rounded-full mx-auto" />
      </div>
    </div>
  );
}

export default function RegistrationOtpPage() {
  const webPageSchema = generateWebPageSchema({
    title: "Verify Mobile Number with OTP | Sindhimarriage.in",
    description:
      "Enter the 4-digit verification code (OTP) sent to your registered mobile phone to activate your free SindhiMatrimony account.",
    path: "/registration/otp",
    datePublished: "2026-01-01",
    dateModified: "2026-10-14",
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Registration", path: "/#register" },
    { name: "Verify OTP", path: "/registration/otp" },
  ]);

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema]} />
      <Suspense fallback={<RegistrationOtpSkeleton />}>
        <RegistrationOtpScreen />
      </Suspense>
    </>
  );
}
