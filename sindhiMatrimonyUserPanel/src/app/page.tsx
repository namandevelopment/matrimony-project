import React, { Suspense } from "react";
import type { Metadata } from "next";
import { LandingScreen } from "@/screens/landingScreen";
import {
  createMetadata,
  JsonLd,
  generateServiceSchema,
} from "@/metadata";

export const metadata: Metadata = createMetadata({
  title: "Sindhi Matrimony – Find Your Perfect Sindhi Life Partner",
  description:
    "Discover Sindhi matrimonial profiles and connect with compatible life partners from the Sindhi community. Explore meaningful matches with SindhiMatrimony.",
  canonicalPath: "/",
  keywords: [
    "Sindhi Matrimony",
    "Sindhi Marriage",
    "Sindhi Brides",
    "Sindhi Grooms",
    "Sindhi Matchmaking",
    "Bhaiband Matrimony",
    "Amil Matrimony",
    "Lohana Matrimony",
    "Sahiti Sindhi",
    "Larkana Sindhi",
    "Sindhi NRI Matrimony",
    "Verified Sindhi Profiles",
  ],
});

export default function Home() {
  const serviceSchema = generateServiceSchema();

  return (
    <>
      <JsonLd data={[serviceSchema]} />
      <LandingScreen />
    </>
  );
}

