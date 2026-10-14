# Sindhi Matrimony - User Panel Web Application

Modern, high-performance web application and public portal for the **Sindhi Matrimony Platform**, built with **Next.js 16 (App Router)**, **React 19**, and **Tailwind CSS v4**.

---

## 🌐 Live Production Deployment

- **Live URL:** [https://sindhi-matrimony-user-panel.vercel.app](https://sindhi-matrimony-user-panel.vercel.app)
- **Deployment Platform:** [Vercel](https://vercel.com)
- **Vercel Account:** `namandevelopment-9594` (`naman.development@gmail.com`)
- **Project Name:** `sindhi-matrimony-user-panel`
- **Framework Preset:** Next.js
- **Status:** 🟢 200 OK (Live & Publicly Accessible)

### Public Routes
- **`/`** - Main Landing Screen (Hero Section, Trust Badges, About Section, Footer, Login & Registration Modal)
- **`/terms-and-conditions`** - SEO-Friendly Terms & Conditions
- **`/privacy-policy`** - Privacy Policy Page
- **`/sitemap.xml`** - Auto-generated SEO Sitemap
- **`/robots.txt`** - Web Crawler Directives

---

## 🛠️ Technology Stack

| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **Next.js** | `16.4.0` | React Framework (App Router, Turbopack, Server-Side / Static Prerendering) |
| **React** | `19.3.0` | Core UI Library |
| **React DOM** | `19.3.0` | DOM Rendering |
| **Tailwind CSS** | `^4.3.3` | Modern utility-first styling with `@tailwindcss/postcss` & Turbopack |
| **@tanstack/react-query** | `^5.104.1`| Async Server State Management and Caching |
| **Axios** | `^1.20.0` | HTTP Client for Backend API Integration |
| **Lucide React** | `^1.55.0` | Clean & Modern SVG Icons |
| **TypeScript** | `^5` | Strict Type Safety |

---

## 📁 Directory Structure

```text
sindhiMatrimonyUserPanel/
├── public/                    # Static assets (images, icons, logos, banners)
├── src/
│   ├── app/                   # Next.js App Router (layout, page, route definitions)
│   │   ├── layout.tsx         # Root layout with fonts & metadata
│   │   ├── page.tsx           # Home page entry
│   │   ├── privacy-policy/    # Privacy Policy route
│   │   ├── terms-and-conditions/ # Terms & Conditions route
│   │   ├── robots.ts          # Dynamic robots.txt
│   │   └── sitemap.ts         # Dynamic sitemap.xml
│   │
│   ├── components/            # Reusable UI primitives (buttons, inputs, modals)
│   ├── hooks/                 # Custom React hooks (forms, validations, state)
│   ├── screens/
│   │   └── landingScreen/     # Landing page modules
│   │       ├── LandingScreen.tsx
│   │       └── components/    # Header, HeroSection, TrustBadges, AboutSection, Footer, LoginModal
│   │
│   ├── styles/                # Global CSS & Tailwind imports
│   └── types/                 # Shared TypeScript interfaces & types
│
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
└── next.config.ts             # Next.js configuration
```

---

## 💻 Local Development Workflow

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Dev Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser.

### 3. Build for Production Locally
```bash
npm run build
```

### 4. Test Production Build Locally
```bash
npm run start
```

---

## 🚀 How to Deploy Updates to Vercel

### Method 1: Using Vercel CLI (Immediate)
From inside `sindhiMatrimonyUserPanel/` directory:
```bash
npx vercel --prod
```
The CLI automatically uploads changed files, compiles the production build, and aliases it directly to [https://sindhi-matrimony-user-panel.vercel.app](https://sindhi-matrimony-user-panel.vercel.app).

### Method 2: Git Push (GitHub Integration)
Changes pushed to the `main` branch of the GitHub repository will sync to GitHub:
```bash
git add .
git commit -m "feat: your feature description"
git push origin main
```
