import React, { Suspense } from "react";
import type { Metadata } from "next";
import { EditProfileScreen } from "@/screens/editProfileScreen";
import { createMetadata } from "@/metadata";

export const metadata: Metadata = createMetadata({
  title: "Partner Preferences | SindhiMatrimony.com",
  description: "Set your partner preferences for age, height, education, caste, and location.",
  canonicalPath: "/profile/preferences",
});

export default function PreferencesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8F9FA]" />}>
      <EditProfileScreen initialSection="partner_preference" />
    </Suspense>
  );
}
