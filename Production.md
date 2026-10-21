# 💍 Sindhi Matrimony Platform — Complete Production Master Guide

> **All-In-One Production & Operations Reference Document**  
> Covers live URLs, custom domain DNS, Vercel deployments, active routes, environment variables, security configurations, bug fixes, deployment commands, and client communication templates.

---

## 📑 Table of Contents
1. [Live Production URLs & Status Dashboard](#-1-live-production-urls--status-dashboard)
2. [Custom Domain Setup (`sindhimarriage.in`)](#-2-custom-domain-setup-sindhimarriagein)
3. [Vercel Projects & Account Configurations](#-3-vercel-projects--account-configurations)
4. [Routing Architecture & Page Index](#-4-routing-architecture--page-index)
5. [Environment Variables Matrix](#-5-environment-variables-matrix)
6. [Security & CORS Hardening](#-6-security--cors-hardening)
7. [Key Fixes & System Optimizations](#-7-key-fixes--system-optimizations)
8. [Maintenance & Redeployment Commands](#-8-maintenance--redeployment-commands)
9. [Mobile App (React Native) Overview](#-9-mobile-app-react-native-overview)
10. [Git Monorepo & Version Control](#-10-git-monorepo--version-control)
11. [Client Sharing Templates (WhatsApp / Email Ready)](#-11-client-sharing-templates)

---

## 🌐 1. Live Production URLs & Status Dashboard

| Service / Component | Live Production URL | Custom Domain URL | Platform | Technology Stack | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **User Panel (Web)** | [https://sindhi-matrimony-user-panel.vercel.app](https://sindhi-matrimony-user-panel.vercel.app) | [https://sindhimarriage.in](https://sindhimarriage.in)<br>[https://www.sindhimarriage.in](https://www.sindhimarriage.in) | Vercel | Next.js 16 (App Router) + React 19 + Tailwind v4 | 🟢 **Live (200 OK)** |
| **Admin Route (`/admin`)** | [https://sindhi-matrimony-user-panel.vercel.app/admin](https://sindhi-matrimony-user-panel.vercel.app/admin) | [https://sindhimarriage.in/admin](https://sindhimarriage.in/admin) | Auto Redirect | HTTP 307 Redirect (Next.js config + page fallback) | 🟢 **Live (Redirects to Admin)** |
| **Admin Panel (CRM)** | [https://sindi-matrimony-admin.vercel.app](https://sindi-matrimony-admin.vercel.app) | [https://admin.sindhimarriage.in](https://admin.sindhimarriage.in) | Vercel | Vite 6 + React 19 SPA + Tailwind CSS + TanStack | 🟢 **Live (200 OK)** |
| **Backend API Gateway** | [https://sindhi-matrimony-backend.vercel.app](https://sindhi-matrimony-backend.vercel.app) | `api.sindhimarriage.in` *(optional)* | Vercel Serverless | Node.js + Express 5 REST API Gateway | 🟢 **Live (200 OK)** |
| **API Health Check** | [https://sindhi-matrimony-backend.vercel.app/api/v1/health](https://sindhi-matrimony-backend.vercel.app/api/v1/health) | — | REST Endpoint | `{"status":"UP","timestamp":"..."}` | 🟢 **Healthy (JSON 200)** |

---

## 🔑 2. Custom Domain Setup (`sindhimarriage.in`)

Aapke domain provider (**GoDaddy, Hostinger, Namecheap, BigRock**, etc.) ke control panel mein login karke **Option 1** ya **Option 2** mein se koi ek select karein:

### ⭐ Option 1 (Recommended — Sabse Aasan): Nameservers Switch
Domain Registrar ke **DNS / Nameservers** section mein jaakar existing nameservers ko badalkar Vercel ke do nameservers set kar dein:

1. `ns1.vercel-dns.com`
2. `ns2.vercel-dns.com`

> **Kyun Recommended Hai?**  
> Is option se `sindhimarriage.in`, `www.sindhimarriage.in`, aur `admin.sindhimarriage.in` teeno automatic Vercel se connect ho jate hain, auto-renewing SSL certificate ban jata hai, aur manual DNS record manage karne ki jarurat nahi padti.

---

### 🌐 Option 2: Manual DNS Records Setup
Agar aap existing nameservers change nahi karna chahte, toh apne domain registrar ke **DNS Management / DNS Records** table mein ye records add karein:

| Record Type | Host / Name | Target / Points To / Value | TTL | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **A** | `@` | `216.198.79.1` *(ya `76.76.21.21`)* | Auto / 3600 | Main root domain (`https://sindhimarriage.in`) |
| **CNAME** | `www` | `cname.vercel-dns.com` | Auto / 3600 | Subdomain redirect (`https://www.sindhimarriage.in`) |
| **CNAME** | `admin` | `5217f8db0d632ac0.vercel-dns-017.com` | Auto / 3600 | Admin CRM portal (`https://admin.sindhimarriage.in`) |

---

### 🔍 DNS Verification Commands
DNS update karne ke baad propagation check karne ke liye:
```bash
# Apex domain check
dig sindhimarriage.in +short

# Admin subdomain check
dig admin.sindhimarriage.in +short

# Vercel domain verification command
npx vercel domains verify sindhimarriage.in
npx vercel domains verify admin.sindhimarriage.in
```
*(DNS propagation usually takes 5 minutes to a couple of hours depending on registrar).*

---

## 🏢 3. Vercel Projects & Account Configurations

- **Vercel Account:** `namandevelopment-9594`
- **Email:** `naman.development@gmail.com`
- **Plan:** Hobby (Unlimited global edge bandwidth, free SSL, zero maintenance)

### Connected Projects:
1. **User Panel (Next.js 16)**
   - **Project Name:** `sindhi-matrimony-user-panel`
   - **Project ID:** `prj_lytAM65vt3N81NCwq7jpML8dmQo9`
   - **Directory:** `/sindhiMatrimonyUserPanel`
   - **Domains Linked:**
     - `sindhimarriage.in` (Production Apex)
     - `www.sindhimarriage.in` (Redirect to apex)
     - `sindhi-matrimony-user-panel.vercel.app` (Vercel Default)

2. **Admin Panel (Vite + React 19)**
   - **Project Name:** `sindi-matrimony-admin`
   - **Project ID:** `prj_kM2kpliSrx40SwPqriaHrzUYLqFu`
   - **Directory:** `/sindiMatrimonyAdmin`
   - **Domains Linked:**
     - `admin.sindhimarriage.in` (Production Subdomain)
     - `sindi-matrimony-admin.vercel.app` (Vercel Default)

3. **Backend API Gateway (Express 5 Serverless)**
   - **Project Name:** `sindhi-matrimony-backend`
   - **Directory:** `/sindhiMatrimonyBackhend`
   - **Domains Linked:**
     - `sindhi-matrimony-backend.vercel.app`

---

## 🧭 4. Routing Architecture & Page Index

### User Panel (Next.js App Router):
- **`/`** — Main Landing Page (Hero banner, Trust badges, Quick Register form, About, Success stories, Login modal)
- **`/admin`** — Direct **307 Redirect** to Admin CRM (`https://sindi-matrimony-admin.vercel.app`)
- **`/dashboard`** — User Dashboard (Prime/Classic switcher, Matches carousel, Horoscope card, Happy marriages)
- **`/matches`** — Match Discovery, search filters, age/height/caste/city criteria, Profile cards
- **`/interests`** — Interests Hub (Received, Sent, Accepted, Declined tabs with Mailbox search)
- **`/messages`** — Real-time Chat, conversation threads, messaging interface
- **`/notifications`** — Alerts, match requests, profile views, preference settings
- **`/profile` & `/profile/edit`** — Multi-step profile editor (Basic info, Family background, Education, Career, Hobbies, Lifestyle)
- **`/profile/horoscope`** — Vedic Horoscope analysis, Kundali matching widget, Guna Milan
- **`/help`** — Help Center, FAQs, and Customer Support ticket form
- **`/terms-and-conditions`** — Legal and user agreement policy
- **`/privacy-policy`** — Privacy and data protection policy
- **`/sitemap.xml` & `/robots.txt`** — SEO search crawler index & directives

### Admin Portal (React SPA):
- **`/login`** — Admin Staff & Super Admin Authentication
- **`/dashboard`** — KPI cards, system metrics, pending approval counters, active matches
- **`/members`** — Member registry, profile verification, document checks, KYC approval workflow
- **`/leads`** — Lead intake CRM, status pipeline (New, Contacted, Converted, Dropped)
- **`/plans` & `/finance`** — Membership packages, payments, Razorpay transaction records
- **`/masters`** — Religion, Caste, Sub-caste, Education, Occupation master databases
- **`/reports` & `/trust-safety`** — Moderation, user abuse reports, blocked accounts

---

## 🔐 5. Environment Variables Matrix

### User Panel (`sindhiMatrimonyUserPanel/.env.production`):
```ini
NEXT_PUBLIC_APP_NAME="Sindhi Matrimony"
NEXT_PUBLIC_API_URL="https://sindhi-matrimony-backend.vercel.app"
NEXT_PUBLIC_SOCKET_URL="https://sindhi-matrimony-backend.vercel.app"
```

### Admin Panel (`sindiMatrimonyAdmin/.env.production`):
```ini
VITE_APP_NAME="Sindhi Matrimony Admin"
VITE_API_BASE_URL="https://sindhi-matrimony-backend.vercel.app/api/v1"
```

### Backend API Gateway (`sindhiMatrimonyBackhend/.env`):
```ini
# Application
NODE_ENV=production
PORT=5001
IS_PRODUCTION=true
API_END_POINT_V1=/api/v1/

# Database (MongoDB Atlas)
DB_STRING=mongodb+srv://<username>:<password>@cluster0.mongodb.net/sindhi_matrimony?retryWrites=true&w=majority

# Redis (Upstash / Cloud Redis)
REDIS_HOST=...
REDIS_PORT=6379
REDIS_PASSWORD=...

# JWT Authentication
JWT_SECRET_KEY=sindhi_matrimony_jwt_super_secret_access_key_2026
REFRESH_JWT_SECRET_KEY=sindhi_matrimony_jwt_super_secret_refresh_key_2026
JWT_EXPIRATION=86400
REFRESH_TOKEN_EXPIRATION=604800

# CORS Whitelist (Comma-separated)
ALLOWED_ORIGINS=https://sindhimarriage.in,https://www.sindhimarriage.in,https://admin.sindhimarriage.in,https://sindhi-matrimony-user-panel.vercel.app,https://sindi-matrimony-admin.vercel.app
ALLOW_THIRD_PARTY_API_CLIENTS=true

# Third-Party Integrations
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=ap-south-1
AWS_S3_BUCKET_NAME=sindhi-matrimony-assets
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
EXOTEL_SID=
EXOTEL_API_KEY=
MSG91_AUTH_KEY=
MSG91_SENDER_ID=SINDHI
FIREBASE_SERVICE_ACCOUNT_JSON=
```

---

## 🛡️ 6. Security & CORS Hardening

1. **Backend CORS Middleware (`corsMiddleware.js`)**:
   - Production whitelisting specifically permits:
     - `https://sindhimarriage.in`
     - `https://www.sindhimarriage.in`
     - `https://admin.sindhimarriage.in`
     - `https://sindhi-matrimony-user-panel.vercel.app`
     - `https://sindi-matrimony-admin.vercel.app`
   - Handles `OPTIONS` preflight requests cleanly with HTTP 200 and credentials support (`Access-Control-Allow-Credentials: true`).

2. **HTTP 307 Automatic `/admin` Redirection**:
   - Configured in `next.config.ts`:
     ```ts
     async redirects() {
       return [
         {
           source: '/admin',
           destination: 'https://sindi-matrimony-admin.vercel.app',
           permanent: false,
         },
         {
           source: '/admin/:path*',
           destination: 'https://sindi-matrimony-admin.vercel.app/:path*',
           permanent: false,
         },
       ];
     }
     ```
   - Backed by fallback page `src/app/admin/page.tsx` with instant `window.location.replace()` for client-side navigation.

---

## 🛠️ 7. Key Fixes & System Optimizations

### 1. Login Modal "Jerk / Jump" Elimination:
- **Problem:** Clicking "Log In" repeatedly caused the modal to bounce up and down noticeably.
- **Root Cause:**
  - `setGeneralError(null)` was called at the start of `handleSubmit`, unmounting the error banner.
  - 60ms later the API error returned and remounted the banner, causing a 45px height fluctuation.
  - Flexbox container vertical centering recalculated the modal position by 22.5px repeatedly, compounded by CSS `transition-all animate-scale-up`.
- **Permanent Solution:**
  - Added concurrent click guard: `if (isLoading) return;`.
  - Removed `setGeneralError(null)` from submit trigger (errors now smoothly clear when user types in inputs).
  - Removed layout-thrashing classes `transform transition-all animate-scale-up` from the modal container.
  - Modal is now rock solid with 0px jumping.

### 2. Single Active Toast Notification Guard:
- **Problem:** Rapid clicks produced stacks of duplicate toast notifications.
- **Root Cause:** Toast trigger did not check whether a notification was already visible on screen.
- **Permanent Solution (`toast.ts`):**
  - Added `isAnyToastActive()` inspection combining internal flag and `#web-toast-container` child count.
  - New toast creation is blocked while one is active.
  - Resets cleanly after the 350ms exit animation finishes.

### 3. Generic API Fetch & Error Toast Standard:
- Implemented `apiFetch` standardized function matching mobile app architecture.
- Errors automatically feed into `showToast({ type: 'error', message: ... })`.
- Single right-side close button with clean padding and no duplicate icons.

### 4. Complete Registration Flow `apiFetch` Integration:
- **Landing Page (`QuickRegisterForm.tsx`)**:
  - Connected to `ApiURL.sendOtp` via `apiFetch`.
  - Sends 4-digit OTP to mobile with purpose `REGISTER`.
  - Persists registration draft in `sessionStorage` and navigates to OTP verification.
- **OTP Verification (`RegistrationOtpScreen.tsx` & `OtpInputBoxes.tsx`)**:
  - Dynamic 4-digit input box with auto-focus and auto-advance.
  - Connected to `ApiURL.resendOtp` for instantaneous OTP resending.
  - Stores verified OTP in session draft.
- **Wizard Steps (Basic, Personal/Religious, Location/Career)**:
  - Collects comprehensive community data (DOB, gender, subcaste, height, education, occupation, income, city).
  - Clean state preservation across page navigations via `sessionStorage`.
- **Final Submission (`RegistrationAdditionalInfoScreen.tsx`)**:
  - Consolidates all 4 steps into unified registration payload.
  - Calls `ApiURL.register` via `apiFetch`.
  - On HTTP 201 Created: automatically sets access/refresh tokens (`setToken`, `setRefreshToken`), stores user profile in `localStorage` and `Storage.setItemSync`, shows celebratory feedback, and directs user into the dashboard.

---

## ⚡ 8. Maintenance & Redeployment Commands

Whenever code changes are made, run the corresponding command to update production instantly:

### 🚀 Deploy User Panel:
```bash
cd "sindhiMatrimonyUserPanel"
npm run build          # Optional local verification
npx vercel --prod --yes
```

### 🚀 Deploy Admin Panel:
```bash
cd "sindiMatrimonyAdmin"
npm run build          # Builds Vite production bundle to dist/
npx vercel --prod --yes
```

### 🚀 Deploy Backend API:
```bash
cd "sindhiMatrimonyBackhend"
npx vercel --name sindhi-matrimony-backend --prod --yes
```

### 💻 Local Development Servers:
```bash
# Terminal 1 - User Panel (Next.js)
cd "sindhiMatrimonyUserPanel"
npm run dev            # http://localhost:3000

# Terminal 2 - Admin Panel (Vite)
cd "sindiMatrimonyAdmin"
npm run dev            # http://localhost:5173

# Terminal 3 - Backend API (Express)
cd "sindhiMatrimonyBackhend"
npm run dev            # http://localhost:5001
```

---

## 📱 9. Mobile App (React Native) Overview

- **Directory:** `/sindhiMatrimony`
- **Framework:** React Native + Redux Toolkit
- **Connected API Base URL:** Configured to target `https://sindhi-matrimony-backend.vercel.app/api/v1`
- **Start Metro Bundler:**
  ```bash
  cd "sindhiMatrimony"
  npm start
  ```
- **Run on Android / iOS:**
  ```bash
  npm run android
  npm run ios
  ```

---

## 🐙 10. Git Monorepo & Version Control

- **Repository URL:** [https://github.com/namandevelopment/matrimony-project](https://github.com/namandevelopment/matrimony-project)
- **Account:** `namandevelopment`
- **Email:** `naman.development@gmail.com`
- **Branch:** `main`

### Routine Git Push Steps:
```bash
cd "/Users/naman/Documents/CRM Landing Projects/Matrimony Project"
git status
git add .
git commit -m "feat: updates and optimizations"
git push origin main
```

*(Note: Never allow nested `.git` folders inside subfolders to keep all files properly tracked).*

---

## 📩 11. Client Sharing Templates

### Template 1: User Matrimony Website
```text
Namaste! 🙏

The official Sindhi Matrimony web portal is live:
🌐 Website: https://sindhimarriage.in
(Backup: https://sindhi-matrimony-user-panel.vercel.app)

Highlights:
✨ Verified profiles for the Sindhi community
✨ Kundali & Vedic Horoscope matching
✨ Secure chat, match discovery & preference filters
✨ Clean, fast & mobile-friendly experience

Please visit and explore!
```

### Template 2: Admin CRM Panel
```text
Hi,

Here is the link to access the Sindhi Matrimony Management & CRM Admin Portal:
🔐 Admin Portal: https://admin.sindhimarriage.in
(Shortcut: https://sindhimarriage.in/admin)
(Direct: https://sindi-matrimony-admin.vercel.app)

Access Permissions:
- Member KYC & Profile Verification
- Lead Intake & Follow-ups
- Membership Plans & Payment Logs
- Master Data Management (Caste, Gotra, Cities)
```

---

*Document maintained & verified by Antigravity Engineering.*
