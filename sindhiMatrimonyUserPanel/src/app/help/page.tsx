import type { Metadata } from "next";
import { HelpSupportScreen, HELP_FAQS } from "@/screens/helpSupportScreen";
import {
  createMetadata,
  JsonLd,
  generateContactPageSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
} from "@/metadata";

export const metadata: Metadata = createMetadata({
  title: "Help & Support Center | SindhiMatrimony.com - 24/7 Member Care & FAQs",
  description:
    "Official Help & Support Center for SindhiMatrimony.com. Get step-by-step assistance with profile creation, Aadhaar ID verification, Kundali matching, photo & phone privacy shields, billing, and direct 24/7 member care helpline.",
  canonicalPath: "/help",
  keywords: [
    "Sindhi Matrimony Help",
    "Sindhi Matrimony Support",
    "Sindhi Matrimony Customer Care",
    "Sindhi Matrimony Helpline 8144-77-88-66",
    "Sindhi Matchmaking Assistance",
    "Aadhaar Verification Matrimony",
    "Sindhi Sub-Caste Search Guide",
    "Kundali Matching Support",
    "Phone Privacy Matrimony",
    "Grievance Officer Sindhi Matrimony",
    "Matrimonial Fraud Prevention 1930",
  ],
});

export default function HelpPage() {
  const contactPageSchema = generateContactPageSchema({
    title: "Official Customer Support & Member Helpline | SindhiMatrimony.com",
    description:
      "24/7 dedicated member helpline, live chat, email assistance, and step-by-step matchmaking guides for SindhiMatrimony.com.",
    path: "/help",
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Help & Support", path: "/help" },
  ]);

  const faqSchema = generateFAQSchema(
    HELP_FAQS.map((f) => ({
      question: f.question,
      answer: f.answer,
    }))
  );

  return (
    <>
      <JsonLd data={[contactPageSchema, breadcrumbSchema, faqSchema]} />
      <HelpSupportScreen />
    </>
  );
}
