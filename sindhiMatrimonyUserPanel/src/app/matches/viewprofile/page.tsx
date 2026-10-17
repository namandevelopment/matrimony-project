import React, { Suspense } from "react";
import type { Metadata } from "next";
import { createMetadata } from "@/metadata";
import ProfileViewClient from "@/app/profile/view/ProfileViewClient";

export const metadata: Metadata = createMetadata({
  title: "View Profile | SindhiMatrimony.com",
  description: "View verified member profile details.",
  canonicalPath: "/matches/viewprofile",
});

export default function MatchesViewProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5F7F9]" />}>
      <ProfileViewClient />
    </Suspense>
  );
}
