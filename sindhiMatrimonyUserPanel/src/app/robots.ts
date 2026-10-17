import { MetadataRoute } from "next";
import { siteConfig } from "@/metadata";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/dashboard/",
        "/messages/",
        "/notifications/",
        "/interests/",
        "/profile/",
        "/onboarding/",
        "/registration/",
        "/settings/",
        "/billing/",
        "/auth/",
      ],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
