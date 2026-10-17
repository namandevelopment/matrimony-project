import React, { Suspense } from "react";
import type { Metadata } from "next";
import { EditProfileScreen } from "@/screens/editProfileScreen";
import {
  createMetadata,
  JsonLd,
  generateWebPageSchema,
} from "@/metadata";

export const metadata: Metadata = createMetadata({
  title: "Edit Profile | SindhiMatrimony.com",
  description:
    "Update your Sindhi Matrimony profile details, upload photos, manage caste, gothra, education, lifestyle and horoscope preferences.",
  canonicalPath: "/profile/edit",
  keywords: [
    "Edit Profile",
    "Sindhi Matrimony Profile",
    "Update Matrimony Details",
    "Upload Photos",
    "Kundali Details",
    "Partner Preferences",
  ],
});

function EditProfileSkeleton() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] animate-pulse">
      <div className="h-16 bg-white border-b border-stone-200" />
      <div className="h-10 bg-amber-50 border-b border-amber-200" />
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="h-8 w-48 bg-stone-200 rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-4">
            <div className="h-64 bg-white rounded-xl border border-stone-200" />
            <div className="h-72 bg-white rounded-xl border border-stone-200" />
          </div>
          <div className="lg:col-span-8 space-y-4">
            <div className="h-[600px] bg-white rounded-xl border border-stone-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EditProfilePage() {
  const webPageSchema = generateWebPageSchema({
    title: "Edit Profile | SindhiMatrimony.com",
    description:
      "Update your Sindhi Matrimony profile details, upload photos, manage caste, gothra, education, lifestyle and horoscope preferences.",
    path: "/profile/edit",
    datePublished: "2026-01-01",
    dateModified: "2026-10-17",
  });

  return (
    <>
      <JsonLd data={webPageSchema} />
      <EditProfileScreen initialSection="basic_info" />
    </>
  );
}
