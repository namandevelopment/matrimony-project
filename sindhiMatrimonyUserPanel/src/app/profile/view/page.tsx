import React, { Suspense } from "react";
import type { Metadata } from "next";
import { createMetadata } from "@/metadata";
import ProfileViewClient from "./ProfileViewClient";

export const metadata: Metadata = createMetadata({
  title: "View Profile | SindhiMatrimony.com",
  description:
    "View full member profile, personal details, education, occupation, horoscope, and partner preferences.",
  canonicalPath: "/profile/view",
});

function ProfileViewFallback() {
  return (
    <div className="min-h-screen bg-[#F5F7F9] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-stone-300 border-t-[#DB2F3C] animate-spin" />
    </div>
  );
}

export default function ProfileViewPage() {
  return (
    <Suspense fallback={<ProfileViewFallback />}>
      <ProfileViewClient />
    </Suspense>
  );
}
