import type { Metadata } from "next";
import { siteConfig } from "./siteConfig";
import type { MetadataOptions } from "./types";

/**
 * Creates dynamic, strongly-typed Next.js metadata for any page
 * with canonical tags, Open Graph, Twitter cards, and robot directives.
 */
export function createMetadata(options: MetadataOptions = {}): Metadata {
  const {
    title,
    description = siteConfig.description,
    keywords = [],
    canonicalPath = "/",
    image = siteConfig.ogImage,
    imageAlt = `${siteConfig.name} Portal`,
    noIndex = false,
    type = "website",
    publishedTime,
    modifiedTime,
    authors,
  } = options;

  // Format full canonical URL
  const cleanPath = canonicalPath.startsWith("/") ? canonicalPath : `/${canonicalPath}`;
  const canonicalUrl = `${siteConfig.url}${cleanPath === "/" ? "" : cleanPath}`;
  const imageUrl = image.startsWith("http") ? image : `${siteConfig.url}${image.startsWith("/") ? image : `/${image}`}`;

  const mergedKeywords = Array.from(
    new Set([...siteConfig.keywords, ...keywords])
  );

  return {
    title: title
      ? {
          default: `${title} | ${siteConfig.name}`,
          template: `%s | ${siteConfig.name}`,
        }
      : {
          default: `${siteConfig.name} - Find Your Perfect Life Partner`,
          template: `%s | ${siteConfig.name}`,
        },
    description,
    keywords: mergedKeywords,
    authors: (authors || [siteConfig.author]).map((name) => ({ name })),
    creator: siteConfig.creator,
    publisher: siteConfig.creator,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: title ? `${title} | ${siteConfig.name}` : siteConfig.name,
      description,
      url: canonicalUrl,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: type === "article" ? "article" : "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: "summary_large_image",
      title: title ? `${title} | ${siteConfig.name}` : siteConfig.name,
      description,
      images: [imageUrl],
      creator: "@sindhimatrimony",
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          nocache: true,
          googleBot: {
            index: false,
            follow: false,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
  };
}
