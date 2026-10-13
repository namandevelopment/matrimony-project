import type { Metadata } from "next";
import { LandingScreen } from "@/screens/landingScreen";
import {
  createMetadata,
  JsonLd,
  generateOrganizationSchema,
  generateWebSiteSchema,
  generateServiceSchema,
} from "@/metadata";

export const metadata: Metadata = createMetadata({
  title: "No. 1 Sindhi Matrimony Service | Official Sindhi Marriage Portal",
  description:
    "Register Free on SindhiMatrimony.com - The official & most trusted matchmaking portal exclusively for Sindhis worldwide. 1 Lakh+ verified profiles, 2 Lakh+ success stories.",
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
    "Free Matrimony Registration",
    "Verified Sindhi Profiles",
  ],
});

export default function Home() {
  const organizationSchema = generateOrganizationSchema();
  const webSiteSchema = generateWebSiteSchema();
  const serviceSchema = generateServiceSchema();

  return (
    <>
      <JsonLd data={[organizationSchema, webSiteSchema, serviceSchema]} />
      <LandingScreen />
    </>
  );
}
