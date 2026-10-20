import type { Metadata } from "next";
import { SafetyTips } from "@/screens/SafetyTips";
import { SAFETY_FAQS } from "@/screens/SafetyTips/data/safetyData";
import {
  createMetadata,
  JsonLd,
  generateWebPageSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
} from "@/metadata";

export const metadata: Metadata = createMetadata({
  title: "Safety Tips & Fraud Prevention Guidelines | Sindhimarriage.in",
  description:
    "Official Matrimonial Safety Guidelines, Scam Prevention Advice, and Cyber Helplines for Sindhimarriage.in. Learn the 4 Golden Rules: zero money transfer, safe public meetings, and reference verification.",
  canonicalPath: "/safety-tips",
  keywords: [
    "Sindhi Matrimony Safety Tips",
    "Matrimonial Fraud Prevention",
    "Shaadi Scam Warning",
    "Matrimony Cyber Crime Helpline 1930",
    "Safe Matrimonial Meeting Guidelines",
    "Sindhi Matchmaking Security",
    "Fake Matrimony Profile Detection",
    "Matrimonial Customs Scam Alert",
    "Online Marriage Portal Safety India",
    "Grievance Officer Sindhi Matrimony",
  ],
});

export default function SafetyTipsPage() {
  const webPageSchema = generateWebPageSchema({
    title: "Official Safety Tips & Matrimonial Fraud Prevention Guidelines | Sindhimarriage.in",
    description:
      "Comprehensive matrimonial safety precautions, zero-money transfer rules, red flags checklist, and emergency reporting helplines for Sindhimarriage.in.",
    path: "/safety-tips",
    datePublished: "2026-01-01",
    dateModified: "2026-10-14",
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Safety Tips", path: "/safety-tips" },
  ]);

  const faqSchema = generateFAQSchema(
    SAFETY_FAQS.map((f) => ({
      question: f.question,
      answer: f.answer,
    }))
  );

  return (
    <>
      <JsonLd data={[webPageSchema, breadcrumbSchema, faqSchema]} />
      <SafetyTips />
    </>
  );
}
