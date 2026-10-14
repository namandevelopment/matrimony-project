# Sindhi Matrimony – Comprehensive Technical SEO & Performance Optimization Guide

This document is the authoritative engineering and optimization manual for **SindhiMatrimony** (`sindhimatrimony.com`). It covers technical architecture, metadata standards, JSON-LD structured data, crawler governance, Core Web Vitals optimization, and guidelines for fast, lightweight, and responsive rendering.

---

## 1. Executive Summary & Current Architecture

* **Framework:** Next.js 16.4.0 (Turbopack Engine) with React 19.3.0
* **Router:** Next.js App Router (`src/app/`)
* **Language & Styling:** TypeScript 5.x, TailwindCSS 4.x
* **Rendering Strategy:** Static Pre-rendering (SSG/ISR) with hybrid Client Component boundaries
* **Font Delivery:** `next/font/google` (`Plus_Jakarta_Sans` & `Outfit`) with zero Cumulative Layout Shift (CLS)
* **Image Delivery:** `next/image` with automatic WebP/AVIF compression and LCP preloading

---

## 2. Public vs. Private Page Indexing Matrix

| Route | Purpose | Google Indexing | Priority | Change Frequency |
| :--- | :--- | :--- | :--- | :--- |
| `/` | Primary Landing Page | `index, follow` | 1.0 | Weekly |
| `/terms-and-conditions` | Legal & User Agreement | `index, follow` | 0.5 | Monthly |
| `/privacy-policy` | Data Protection & DPDP Act | `index, follow` | 0.5 | Monthly |
| `/about-us` *(Planned)* | Brand Story & Community Credibility | `index, follow` | 0.7 | Monthly |
| `/sindhi-matrimony-[city]` *(Planned)* | High-Intent Localized Pages | `index, follow` | 0.8 | Weekly |
| `/dashboard/*` | User Private Area | `noindex, nofollow` | Excluded | Never |
| `/messages/*` | Private Member Communications | `noindex, nofollow` | Excluded | Never |
| `/settings/*` | Account & Security Controls | `noindex, nofollow` | Excluded | Never |
| `/billing/*` | Payments & Invoices | `noindex, nofollow` | Excluded | Never |
| `/auth/*` | OTP / Login / Token Handlers | `noindex, nofollow` | Excluded | Never |
| `/api/*` | Backend Endpoints & Webhooks | `noindex, nofollow` | Excluded | Never |

---

## 3. Metadata Standards & Canonical Configuration

### 3.1 Metadata Architecture (`src/metadata/createMetadata.ts`)
The site utilizes a centralized helper `createMetadata()` providing:
1. **Title Deduplication:** Automatically avoids redundant site name appending if the page title already includes `"Sindhi Matrimony"` or `"SindhiMatrimony"`.
2. **Canonical URLs:** Strongly typed via `alternates.canonical` pointing to the production domain.
3. **Open Graph & Twitter Cards:** Configured with `summary_large_image` and standard 1200x630px social previews.
4. **GoogleBot Directives:** Enforces `max-snippet:-1`, `max-image-preview:large`, and `max-video-preview:-1`.

### 3.2 Homepage Metadata Implementation (`src/app/page.tsx`)
```typescript
export const metadata: Metadata = createMetadata({
  title: "Sindhi Matrimony – Find Your Perfect Sindhi Life Partner",
  description:
    "Discover Sindhi matrimonial profiles and connect with compatible life partners from the Sindhi community. Explore meaningful matches with SindhiMatrimony.",
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
    "Sindhi NRI Matrimony",
    "Verified Sindhi Profiles",
  ],
});
```

---

## 4. Structured Data (Schema.org / JSON-LD)

To prevent duplicate schemas in the DOM, schemas are strictly segregated:

### 4.1 Global Schemas (`src/app/layout.tsx`)
Injected once across the entire application in the document `<head>`:
1. **`Organization` Schema:** Represents the Sindhi Matrimony legal identity, verified site URL, logo (`/images/logo.webp`), support email, and verified social channels. (No invented phone numbers or addresses).
2. **`WebSite` Schema:** Establishes the website identity and Google Sitelinks Searchbox (`potentialAction`).

### 4.2 Page-Specific Schemas
* **Homepage (`src/app/page.tsx`):** Injects only `Service` schema (`serviceType: "Sindhi Matrimonial and Matchmaking Services"`).
* **Policy Pages (`/privacy-policy`, `/terms-and-conditions`):** Inject `WebPage` and `BreadcrumbList` schemas.

---

## 5. Crawler Governance (`robots.ts` & `sitemap.ts`)

### 5.1 `src/app/robots.ts`
* Disallows private paths (`/api/`, `/dashboard/`, `/messages/`, `/settings/`, `/billing/`, `/auth/`).
* Allows public root `/` and static assets needed by Googlebot for page rendering.
* Explicitly links to `https://sindhimatrimony.com/sitemap.xml`.

### 5.2 `src/app/sitemap.ts`
* Contains **only implemented, publicly accessible 200-OK routes** (`/`, `/terms-and-conditions`, `/privacy-policy`).
* Excludes unbuilt pages to protect crawl budget and prevent Google 404 indexing penalties.
* Includes explicit ISO timestamps (`lastmod`) and appropriate priorities.

---

## 6. Heading Hierarchy & Accessibility

The landing page maintains a strict semantic document outline:
* **Single `<h1>`:**
  `<h1 className="text-xl sm:text-2xl md:text-3xl lg:text-[28px] xl:text-[33px] 2xl:text-[36px] font-extrabold text-white tracking-tight leading-snug drop-shadow-md lg:whitespace-nowrap">`
  *Headline:* `No. 1 and official matrimony service exclusively for Sindhis`
* **Logical `<h2>` Sub-sections:**
  * Quick Register Form: `Register for free to find your perfect partner`
  * About Section: `India's Most Trusted Sindhi Matrimonial Network`
  * Trust Section: Labeled with `aria-label="Trust and Achievements"`
* **Descriptive Links & Form Inputs:**
  * All input fields contain explicit `id` attributes matched with `<label for="...">` or `aria-label`.
  * All SVG icons use `aria-hidden="true"`.
  * CTA buttons specify explicit `type="button"` or `type="submit"`.

---

## 7. Performance & Core Web Vitals (CWV)

### 7.1 Largest Contentful Paint (LCP) Optimization
* **Hero Background:** Utilizes `next/image` with `priority`, `sizes="100vw"`, and `fill`.
* **Format Negotiation:** Configured in `next.config.ts` for modern `image/avif` and `image/webp` formats.
* **Preloading:** Font files (`Plus_Jakarta_Sans` & `Outfit`) are preloaded via Next.js Google Font optimizer with zero layout shift.

### 7.2 Cumulative Layout Shift (CLS) Prevention
* Header is fixed with consistent height `h-16 sm:h-18` and matched page padding `pt-16 sm:pt-18`.
* Hero section enforces minimum height `min-h-[calc(100vh-4rem)]` to ensure no shifts during hydration.
* SVG icons have explicit width and height dimensions.

### 7.3 Interaction to Next Paint (INP) & JavaScript Footprint
* Static sections (`AboutSection`, `Footer`) are lightweight memoized components.
* Modals (`LoginModal`) and animated dropdowns (`ProfileForDropdown`) render conditionally and utilize hardware-accelerated CSS transitions.

---

## 8. Strategic Recommendations for Higher Rankings & Extreme Speed

### Recommendation 1: Programmatic SEO Landing Pages
As the user base expands, build high-intent programmatic landing pages:
* **City Pages:** `/sindhi-matrimony-mumbai`, `/sindhi-matrimony-delhi`, `/sindhi-matrimony-ahmedabad`, `/sindhi-matrimony-dubai`.
* **Sub-Caste Pages:** `/sindhi-bhaiband-matrimony`, `/sindhi-amil-matrimony`, `/sindhi-lohana-matrimony`, `/sindhi-sahiti-matrimony`.
* *Rule:* Ensure each page features 300+ words of unique, localized text and verified statistics (avoid thin auto-generated doorway pages).

### Recommendation 2: Cloudflare Edge Caching & Full-Page Caching
* Deploy the site on Vercel or behind Cloudflare with `Cache-Control: public, max-age=3600, stale-while-revalidate=86400`.
* This delivers TTFB (Time to First Byte) under 50ms worldwide for the static landing page.

### Recommendation 3: Convert Collage Image to Compressed WebP/AVIF
* The current collage image `public/images/couples-collage.jpg` is ~1.18 MB.
* Generating a pre-compressed AVIF/WebP asset of ~180 KB saves bandwidth and speeds up mobile cold loads on 4G networks.

### Recommendation 4: Sindhi Community FAQ Rich Snippets
* Add an interactive FAQ accordion to the landing page with 5-6 frequently asked questions regarding Sindhi matchmaking, privacy, and verification.
* Inject `FAQPage` schema to gain rich expandable snippets directly in Google SERP results.

---

## 9. Google Search Console (GSC) Setup Checklist

1. **Domain Verification:**
   * Go to [Google Search Console](https://search.google.com/search-console).
   * Add Property using **Domain** verification: `sindhimatrimony.com`.
   * Add the provided TXT record to your DNS provider (e.g. Cloudflare, GoDaddy).
2. **Submit Sitemap:**
   * Under **Indexing > Sitemaps**, enter: `https://sindhimatrimony.com/sitemap.xml`.
   * Verify status changes to "Success" with 3 discovered URLs.
3. **URL Inspection:**
   * Run the root URL `https://sindhimatrimony.com/` in the URL Inspection tool.
   * Click **Test Live URL** to confirm Googlebot renders the page and detects the `WebSite`, `Organization`, and `Service` structured data.
   * Click **Request Indexing**.
4. **Core Web Vitals Monitoring:**
   * Check the Core Web Vitals report after 28 days of real-world user data (CrUX) to confirm all URLs pass Good thresholds (LCP < 2.5s, CLS < 0.1, INP < 200ms).

