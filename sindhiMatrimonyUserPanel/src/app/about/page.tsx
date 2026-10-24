import type { Metadata } from "next";
import { AboutScreen } from "@/screens/aboutScreen";
import {
  createMetadata,
  JsonLd,
  generateWebPageSchema,
  generateBreadcrumbSchema,
  generateOrganizationSchema,
} from "@/metadata";

export const metadata: Metadata = createMetadata({
  title: "About Us | Sindhimarriage.in - India's Trusted Sindhi Matrimony Network",
  description:
    "Learn about Sindhimarriage.in, part of the CommunityMatrimony network. Discover our mission to unite global Sindhi brides and grooms with 100% ID verification, Kundali matching, and trusted community matchmaking.",
  canonicalPath: "/about",
  keywords: [
    "About Sindhi Matrimony",
    "About Sindhimarriage.in",
    "Sindhi Community Matrimony",
    "Sindhi Marriage Network",
    "Verified Sindhi Rishtey",
    "Sindhi Matrimony Portal",
    "Bhaiband Amil Matrimony",
    "Sindhi Kundali Matching",
    "Global Sindhi NRI Matchmaking",
  ],
});

export default function AboutPage() {
  const organizationSchema = generateOrganizationSchema();

  const webPageSchema = generateWebPageSchema({
    title: "About Us | Sindhimarriage.in - Trusted Sindhi Matrimony",
    description:
      "Official About Us page for Sindhimarriage.in. Dedicated to preserving Sindhi wedding traditions and connecting compatible brides and grooms worldwide.",
    path: "/about",
    datePublished: "2026-01-01",
    dateModified: "2026-10-24",
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
  ]);

  return (
    <>
      <JsonLd data={[organizationSchema, webPageSchema, breadcrumbSchema]} />
      <AboutScreen />
    </>
  );
}
