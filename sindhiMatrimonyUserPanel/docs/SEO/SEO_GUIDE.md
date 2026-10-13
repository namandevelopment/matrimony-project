# Sindhi Matrimony - Comprehensive SEO Strategy & Implementation Guide

Yeh document Sindhi Matrimony User Panel ko Google Search results me top ranking dilane ke liye step-by-step roadmap aur implementation details provide karta hai.

---

## 1. Indexing Architecture (Public vs Private Pages)

Matrimony portal me sensitive user data hota hai, isliye Google crawlers ke liye clear boundaries hona zaroori hai.

| Page Type | Route / URL | Google Indexing | Priority |
| :--- | :--- | :--- | :--- |
| **Landing Page** | `/` | `index, follow` | 1.0 |
| **City Landing Pages** | `/sindhi-matrimony-[city]` | `index, follow` | 0.9 |
| **Success Stories** | `/success-stories` | `index, follow` | 0.8 |
| **About Us / Contact** | `/about-us`, `/contact-us` | `index, follow` | 0.6 |
| **FAQ & Guidelines** | `/faq`, `/community-guidelines` | `index, follow` | 0.6 |
| **User Dashboard** | `/dashboard/*` | `noindex, nofollow` | Do Not Index |
| **Chat & Messages** | `/messages/*` | `noindex, nofollow` | Do Not Index |
| **Account / Settings** | `/settings/*`, `/billing/*` | `noindex, nofollow` | Do Not Index |

---

## 2. Next.js App Router Metadata Configuration

### 2.1 Root Layout Setup (`src/app/layout.tsx`)
Root level par canonical domain, title template, aur fallback metadata define karein:

```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://sindhimatrimony.com"),
  title: {
    default: "Sindhi Matrimony - Trusted Matchmaking for the Sindhi Community",
    template: "%s | Sindhi Matrimony",
  },
  description:
    "Find your verified life partner on Sindhi Matrimony. Browse 100% verified Sindhi brides and grooms worldwide. Register free today!",
  keywords: [
    "Sindhi Matrimony",
    "Sindhi Rishtey",
    "Sindhi Brides",
    "Sindhi Grooms",
    "Sindhi Marriage Bureau",
    "Bhaiband Matrimony",
    "Amil Matrimony",
  ],
  authors: [{ name: "Sindhi Matrimony Team" }],
  creator: "Sindhi Matrimony",
  publisher: "Sindhi Matrimony",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Sindhi Matrimony - Trusted Matchmaking Portal",
    description: "Find verified Sindhi brides & grooms worldwide. Register free today!",
    url: "https://sindhimatrimony.com",
    siteName: "Sindhi Matrimony",
    images: [
      {
        url: "/og-image.jpg", // 1200x630 banner in public folder
        width: 1200,
        height: 630,
        alt: "Sindhi Matrimony Portal",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sindhi Matrimony - Find Your Perfect Partner",
    description: "Browse verified Sindhi profiles worldwide.",
    images: ["/og-image.jpg"],
  },
  robots: {
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
```

---

## 3. Crawler Control: `robots.ts` & `sitemap.ts`

Next.js App Router automatic crawler discovery provide karta hai bina manual XML maintain kiye:

### 3.1 `src/app/robots.ts`
```typescript
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sindhimatrimony.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/dashboard/",
        "/messages/",
        "/settings/",
        "/billing/",
        "/auth/",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
```

### 3.2 `src/app/sitemap.ts`
```typescript
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sindhimatrimony.com";

  // Static Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/success-stories`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Dynamic / City landing pages can be fetched from database or list:
  const majorCities = ["mumbai", "delhi", "ahmedabad", "jaipur", "pune", "indore"];
  const cityRoutes: MetadataRoute.Sitemap = majorCities.map((city) => ({
    url: `${baseUrl}/sindhi-matrimony-${city}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...cityRoutes];
}
```

---

## 4. Structured Data (Schema.org / JSON-LD)

Google crawlers ko site context explain karne ke liye Homepage (`src/app/page.tsx`) me Structured Data Script inject karein:

### 4.1 Organization & WebSite Schema
```html
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": "https://sindhimatrimony.com/#organization",
          "name": "Sindhi Matrimony",
          "url": "https://sindhimatrimony.com",
          "logo": "https://sindhimatrimony.com/logo.png",
          "sameAs": [
            "https://www.facebook.com/sindhimatrimony",
            "https://www.instagram.com/sindhimatrimony"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+91-XXXXXXXXXX",
            "contactType": "customer service",
            "areaServed": "IN",
            "availableLanguage": ["English", "Hindi", "Sindhi"]
          }
        },
        {
          "@type": "WebSite",
          "@id": "https://sindhimatrimony.com/#website",
          "url": "https://sindhimatrimony.com",
          "name": "Sindhi Matrimony",
          "publisher": {
            "@id": "https://sindhimatrimony.com/#organization"
          }
        }
      ]
    })
  }}
/>
```

### 4.2 FAQPage Schema
Landing page FAQs ke liye FAQ Schema lagane se Google search results me direct expandable questions dikhte hain, jisse **Click-Through-Rate (CTR)** 30-40% badh jata hai.

---

## 5. Programmatic SEO (High-Volume Keywords)

Sindhi community me log specific keywords search karte hain:
1. **City Based:** `Sindhi Matrimony Mumbai`, `Sindhi Rishtey Ahmedabad`, `Sindhi Grooms Pune`
2. **Community/Sub-caste Based:** `Bhaiband Sindhi Matrimony`, `Amil Sindhi Rishtey`, `Sahiti Sindhi Profiles`
3. **Profession Based:** `Sindhi Doctor Matrimony`, `Sindhi CA Rishtey`, `Sindhi NRI Matrimony USA/Dubai`

**Strategy:**
* Inke liye dynamic static-generation pages (e.g. `/matrimony/[community]/[city]`) banayein.
* Har page par 6-8 sample blurred/verified profile preview cards aur Quick Registration Form rakhein.

---

## 6. Technical SEO & Core Web Vitals (CWV)

1. **Avoid full `'use client'` on public pages:**
   * Homepage ka main shell Server Component rehna chahiye taaki Google bot ko pre-rendered HTML mile.
   * Sirf interactive widgets (sliders, modals, filters) ko alag client component banayein.
2. **Next.js `<Image />` optimization:**
   * Hero banner par `priority` flag lagayein (Largest Contentful Paint improve karne ke liye).
   * Har image me accurate `alt="Sindhi Bride and Groom Matchmaking"` attribute dein.
3. **Google Fonts Optimization:**
   * `next/font/google` use karein taaki zero Cumulative Layout Shift (CLS) rahe.
4. **Clean Semantic HTML:**
   * Har page par sirf ek `<h1>` tag hona chahiye jisme primary target keyword ho (e.g., `<h1>Trusted Sindhi Matrimony & Matchmaking</h1>`).

---

## 7. Launch & Google Search Console Checklist

1. **Production Domain Setup & SSL:** Ensure karein ki HTTPS configured ho aur non-www se www (ya vice-versa) ka 301 redirect clean ho.
2. **Google Search Console (GSC):**
   * Domain property verify karein.
   * `https://yourdomain.com/sitemap.xml` submit karein.
3. **Manual URL Inspection:**
   * Homepage aur top 5 landing pages ko GSC me "Request Indexing" karein.
4. **Google Business Profile (GMB):**
   * Local Search (Google Maps / Local 3-Pack) me list hone ke liye Google Business Profile setup karein.
5. **Backlinks Strategy:**
   * Sindhi community trusts, Sindhi associations, directories, aur press releases se high authority backlink profile build karein.
