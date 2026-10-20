import React, { Suspense } from "react";
import type { Metadata } from "next";
import { HoroscopeScreen } from "@/screens/horoscopeScreen";
import { createMetadata } from "@/metadata";

export const metadata: Metadata = createMetadata({
  title: "View & Edit Horoscope | Sindhimarriage.in",
  description: "View and edit your horoscope, birth details, Raasi, Nakshatra, and Kundali chart.",
  canonicalPath: "/profile/horoscope",
});

export default function HoroscopePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5F7F9]" />}>
      <HoroscopeScreen />
    </Suspense>
  );
}
