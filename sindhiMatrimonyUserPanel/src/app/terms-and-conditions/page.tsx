import type { Metadata } from "next";
import { TermsAndCondition } from "@/screens/termsAndCondition";
import {
  createMetadata,
  JsonLd,
  generateWebPageSchema,
  generateBreadcrumbSchema,
} from "@/metadata";

export const metadata: Metadata = createMetadata({
  title: "Terms & Conditions | SindhiMatrimony.com - User Agreement & Policies",
  description:
    "Official Terms and Conditions, User Agreement, and Community Guidelines for SindhiMatrimony.com (Matrimony.com Group). Understand member eligibility, verification standards, refund policies, and grievance redressal.",
  canonicalPath: "/terms-and-conditions",
  keywords: [
    "Sindhi Matrimony Terms and Conditions",
    "Sindhi Matrimony User Agreement",
    "Matrimony Terms of Service",
    "Sindhi Marriage Portal Rules",
    "Matrimony Refund Policy",
    "Grievance Officer Sindhi Matrimony",
    "Sindhi Matrimony Safety Policy",
    "Dowry Prohibition Compliance",
    "Matrimony Code of Conduct",
  ],
});

export default function TermsAndConditionsPage() {
  const webPageSchema = generateWebPageSchema({
    title: "Terms and Conditions & Service Agreement | SindhiMatrimony.com",
    description:
      "Read the official Terms and Conditions, Member Code of Conduct, and Grievance Redressal framework for SindhiMatrimony.com.",
    path: "/terms-and-conditions",
    datePublished: "2026-01-01",
    dateModified: "2026-10-14",
  });
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Terms & Conditions", path: "/terms-and-conditions" },
  ]);

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema]} />
      <TermsAndCondition />
    </>
  );
}
