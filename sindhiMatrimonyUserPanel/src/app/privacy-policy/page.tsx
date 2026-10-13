import type { Metadata } from "next";
import { PrivacyPolicy } from "@/screens/privacyPolicy";
import {
  createMetadata,
  JsonLd,
  generateOrganizationSchema,
  generateWebPageSchema,
  generateBreadcrumbSchema,
} from "@/metadata";

export const metadata: Metadata = createMetadata({
  title: "Privacy Policy | SindhiMatrimony.com - Data Protection & Confidentiality",
  description:
    "Learn how SindhiMatrimony.com (Matrimony.com Group) protects your personal data, photos, horoscope, and contact information under the DPDP Act 2023. Granular privacy controls and 256-bit encryption.",
  canonicalPath: "/privacy-policy",
  keywords: [
    "Sindhi Matrimony Privacy Policy",
    "Matrimony Data Protection",
    "DPDP Act Matrimony Compliance",
    "Sindhi Matrimony Photo Privacy",
    "Phone Masking Matrimony",
    "Data Protection Officer Sindhi Matrimony",
    "Matrimony Security Standards",
    "Sindhi Marriage Portal Privacy",
  ],
});

export default function PrivacyPolicyPage() {
  const organizationSchema = generateOrganizationSchema();
  const webPageSchema = generateWebPageSchema({
    title: "Privacy Policy & Personal Data Protection | SindhiMatrimony.com",
    description:
      "Official Privacy Policy and Data Protection guidelines for SindhiMatrimony.com, outlining user privacy controls, data retention, and DPDP Act 2023 adherence.",
    path: "/privacy-policy",
    datePublished: "2026-01-01",
    dateModified: "2026-10-14",
  });
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Privacy Policy", path: "/privacy-policy" },
  ]);

  return (
    <>
      <JsonLd data={[organizationSchema, webPageSchema, breadcrumbSchema]} />
      <PrivacyPolicy />
    </>
  );
}
