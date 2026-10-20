import type { Metadata } from "next";
import { OurProcessScreen } from "@/screens/ourProcessScreen";
import {
  createMetadata,
  JsonLd,
  generateWebPageSchema,
  generateBreadcrumbSchema,
} from "@/metadata";

export const metadata: Metadata = createMetadata({
  title: "Our Matchmaking Process | Sindhimarriage.in - 4-Step Vivah Journey",
  description:
    "Discover how Sindhimarriage.in works. A dignified, 4-step matrimony process featuring 100% ID verification, AI-powered Sindhi community matching, horoscope Kundali compatibility, and safe family connections.",
  canonicalPath: "/our-process",
  keywords: [
    "Sindhi Matrimony Process",
    "How Sindhi Matrimony Works",
    "Sindhi Marriage Steps",
    "Verified Sindhi Matrimony",
    "Sindhi Kundali Matching",
    "Sindhi Gotra Matrimony Search",
    "Sindhi Rishtey Registration",
  ],
});

export default function OurProcessPage() {
  const webPageSchema = generateWebPageSchema({
    title: "Our Matchmaking Process | Sindhimarriage.in",
    description:
      "A dignified 4-step matchmaking journey designed exclusively for Sindhi singles and families worldwide.",
    path: "/our-process",
    datePublished: "2026-01-01",
    dateModified: "2026-10-20",
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Our Process", path: "/our-process" },
  ]);

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema]} />
      <OurProcessScreen />
    </>
  );
}
