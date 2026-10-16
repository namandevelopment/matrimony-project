import { MetadataRoute } from "next";
import { siteConfig } from "@/metadata";

/**
 * Production Sitemap Generator for SindhiMatrimony
 * Adheres strictly to Google Search Console best practices:
 * - Only includes valid, existing, 200-OK canonical URLs.
 * - Does not include pending/unimplemented routes or 404s.
 * - Does not include private/auth/member dashboard routes.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  // Currently developed & publicly indexable canonical routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date("2026-10-14T00:00:00.000Z"),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/terms-and-conditions`,
      lastModified: new Date("2026-10-14T00:00:00.000Z"),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date("2026-10-14T00:00:00.000Z"),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/safety-tips`,
      lastModified: new Date("2026-10-14T00:00:00.000Z"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/help`,
      lastModified: new Date("2026-10-15T00:00:00.000Z"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  /*
   * ARCHITECTURAL NOTE FOR FUTURE EXPANSION:
   * When future public routes (e.g. About Us, City landing pages, Sindhi sub-caste pages)
   * are implemented, import their slug arrays or query their DB models and append them here:
   *
   * Example:
   * const futureRoutes: MetadataRoute.Sitemap = [
   *   { url: `${baseUrl}/about-us`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
   *   ...cityPages.map(city => ({ url: `${baseUrl}/sindhi-matrimony-${city.slug}`, ... })),
   * ];
   * return [...routes, ...futureRoutes];
   */

  return routes;
}

