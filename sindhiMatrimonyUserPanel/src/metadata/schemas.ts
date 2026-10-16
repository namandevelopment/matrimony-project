import { siteConfig } from "./siteConfig";
import type { FAQItem, BreadcrumbItem, ProfilePreviewSchemaData } from "./types";

/**
 * Generates Organization Schema (JSON-LD) for Google Knowledge Graph
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}${siteConfig.logo}`,
    description: siteConfig.description,
    email: siteConfig.links.supportEmail,
    sameAs: [
      siteConfig.links.facebook,
      siteConfig.links.instagram,
      siteConfig.links.twitter,
    ].filter(Boolean),
  };
}

/**
 * Generates WebSite Schema with Sitelinks Searchbox support
 */
export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    publisher: {
      "@id": `${siteConfig.url}/#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/search?query={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Generates FAQPage Schema for Google search rich snippets
 */
export function generateFAQSchema(faqs: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generates BreadcrumbList Schema for Google Search breadcrumb navigation
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.path.startsWith("/") ? item.path : `/${item.path}`}`,
    })),
  };
}

/**
 * Generates Matchmaking / Marriage Bureau Service Schema
 */
export function generateServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Sindhi Matrimonial and Matchmaking Services",
    provider: {
      "@id": `${siteConfig.url}/#organization`,
    },
    areaServed: {
      "@type": "Country",
      name: "India",
    },
    description:
      "Online matrimonial and matchmaking services connecting eligible brides and grooms from the Sindhi community.",
  };
}


/**
 * Generates WebPage Schema for static, legal, or informational pages
 */
export function generateWebPageSchema(params: {
  title: string;
  description: string;
  path: string;
  datePublished?: string;
  dateModified?: string;
}) {
  const cleanPath = params.path.startsWith("/") ? params.path : `/${params.path}`;
  const pageUrl = `${siteConfig.url}${cleanPath}`;

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${pageUrl}/#webpage`,
    url: pageUrl,
    name: params.title,
    description: params.description,
    isPartOf: {
      "@id": `${siteConfig.url}/#website`,
    },
    inLanguage: siteConfig.locale,
    datePublished: params.datePublished || "2026-01-01",
    dateModified: params.dateModified || "2026-10-14",
    publisher: {
      "@id": `${siteConfig.url}/#organization`,
    },
  };
}

/**
 * Generates ContactPage Schema (JSON-LD) for Google Search Contact & Help Rich Results
 */
export function generateContactPageSchema(params: {
  title: string;
  description: string;
  path?: string;
}) {
  const cleanPath = params.path ? (params.path.startsWith("/") ? params.path : `/${params.path}`) : "/help";
  const pageUrl = `${siteConfig.url}${cleanPath}`;

  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${pageUrl}/#contactpage`,
    url: pageUrl,
    name: params.title,
    description: params.description,
    mainEntity: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: "+91-8144-77-88-66",
          contactType: "customer support",
          areaServed: "IN",
          availableLanguage: ["English", "Hindi", "Sindhi"],
        },
        {
          "@type": "ContactPoint",
          email: siteConfig.links.supportEmail,
          contactType: "customer service",
          availableLanguage: ["English", "Hindi"],
        },
      ],
    },
  };
}

