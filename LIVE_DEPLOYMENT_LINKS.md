# 💍 Sindhi Matrimony Platform — Live Deployment & Access Master Guide

> **Official Root Documentation**  
> All live Vercel links, custom domains, API endpoints, test credentials, 4-digit OTP rules, and deployment instructions in one place.  
> **Last Deployed & Verified:** `2026-10-22` | **Status:** 🟢 All Services 100% Live & Healthy (HTTP 200)

---

## 🌐 1. Live Production Links (Vercel & Custom Domains)

| Platform / Service | Technology Stack | Vercel Live URL | Custom Domain URL | HTTP Status |
| :--- | :--- | :--- | :--- | :--- |
| 💍 **User Panel (Web)** | Next.js 16 (App Router) + React 19 + Tailwind | [https://sindhi-matrimony-user-panel.vercel.app](https://sindhi-matrimony-user-panel.vercel.app) | [https://sindhimarriage.in](https://sindhimarriage.in)<br>[https://www.sindhimarriage.in](https://www.sindhimarriage.in) | 🟢 **200 OK** |
| 🛡️ **Admin Panel (CRM)** | Vite 6 + React 19 SPA + Tailwind | [https://sindi-matrimony-admin.vercel.app](https://sindi-matrimony-admin.vercel.app) | [https://admin.sindhimarriage.in](https://admin.sindhimarriage.in) | 🟢 **200 OK** |
| 🔀 **Admin Redirect Route** | Auto 307 Redirect from User Panel | [https://sindhi-matrimony-user-panel.vercel.app/admin](https://sindhi-matrimony-user-panel.vercel.app/admin) | [https://sindhimarriage.in/admin](https://sindhimarriage.in/admin) | 🟢 **307 Redirect** |
| ⚙️ **Backend API Gateway** | Node.js + Express 5 Serverless | [https://sindhi-matrimony-backend.vercel.app](https://sindhi-matrimony-backend.vercel.app) | `api.sindhimarriage.in` | 🟢 **200 OK** |
| 🩺 **API Health Check** | REST Health Endpoint | [https://sindhi-matrimony-backend.vercel.app/api/v1/health](https://sindhi-matrimony-backend.vercel.app/api/v1/health) | — | 🟢 **200 OK** |

---

## 🔢 2. OTP Rules & Configuration

- **OTP Length:** Strictly **4 Digits** (`/^\d{4}$/`).
- **Standard Master Dev OTP:** **`1234`**
- **Where OTP is Used:**
  1. **Admin 2FA / MFA Login:** Prompted when logging into the Admin CRM (`/login`).
  2. **Candidate / User Registration:** Phone verification step during onboarding.
  3. **User Login with OTP:** Instant passwordless phone verification.
  4. **Forgot / Reset Password:** OTP sent to registered phone number.
- **Validation Message:** `"Please enter a valid 4-digit OTP."`

---

## 🔐 3. Valid Test Accounts & Login Credentials

### 🛡️ Admin CRM Panel Credentials
**Login URL:** [https://sindi-matrimony-admin.vercel.app](https://sindi-matrimony-admin.vercel.app) or [https://admin.sindhimarriage.in](https://admin.sindhimarriage.in)

| Role / Designation | Name | Email | Password | 2FA OTP | Permissions & Scope |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Super Admin** | Master Admin | `admin@sindhimarriage.in` | `Admin@1234` | `1234` | **ALL 21 Sections** (Executive access) |
| **Executive Director** | Rajesh Mulchandani | `rajesh.m@sindhimarriage.in` | `Admin@1234` | `1234` | Full access across all modules |
| **Operations Head** | Kavita Chhabria | `kavita.c@sindhimarriage.in` | `Admin@1234` | `1234` | Operations, Leads, Members, Support |
| **Senior CRM Lead** | Priya Sharma | `priya.s@sindhimarriage.in` | `Admin@1234` | `1234` | Matchmaking, Leads, Member calls |
| **KYC Moderator** | Meena Advani | `meena.a@sindhimarriage.in` | `Admin@1234` | `1234` | Document Verification & Trust/Safety |
| **Relationship Manager** | Amit Bhatia | `amit.b@sindhimarriage.in` | `Admin@1234` | `1234` | Assigned Leads & Member follow-ups |

---

### 💍 User Web Panel Credentials
**Login URL:** [https://sindhi-matrimony-user-panel.vercel.app](https://sindhi-matrimony-user-panel.vercel.app) or [https://sindhimarriage.in](https://sindhimarriage.in)

| Account Type | Phone Number | Password | OTP | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Seeded Primary Candidate** | `9829012345` | `Password123@` | `1234` | Male, Amil Sindhi, Verified Profile |
| **Seeded Candidate Pool** | `98290XXXXX` | `Password123@` | `1234` | Any mock candidate profile (150+ pool) |
| **New User Registration** | *Any valid 10-digit number* | *Set your own* | `1234` | Full step-by-step registration flow |

---

## 📁 4. Project Monorepo Structure

```
Matrimony Project/
├── LIVE_DEPLOYMENT_LINKS.md        # 📍 This master reference file
├── Production.md                    # Detailed production guide & troubleshooting
├── CREDENTIALS.md                   # Full credentials registry
│
├── sindhiMatrimonyUserPanel/       # Next.js 16 User Web Application
│   ├── .vercel/project.json         # Project ID: prj_lytAM65vt3N81NCwq7jpML8dmQo9
│   └── src/app/                     # Landing, Dashboard, Matches, Chat, Profile
│
├── sindiMatrimonyAdmin/             # Vite + React 19 Admin CRM Application
│   ├── .vercel/project.json         # Project ID: prj_kM2kpliSrx40SwPqriaHrzUYLqFu
│   └── src/screens/                 # Dashboard, Leads, Members, KYC, Settings
│
├── sindhiMatrimonyBackhend/         # Express 5 Serverless API Gateway
│   ├── .vercel/project.json         # Project ID: prj_Ig1Gq6VTrBvyNSmhqElStH5nCYjY
│   └── api/index.js                 # API routes, CORS, auth, matchmaking
│
└── sindhiMatrimony/                 # React Native Mobile App (iOS / Android)
    └── src/                         # Mobile screens, Redux, navigation
```

---

## ⚡ 5. Redeployment Commands (Whenever changes are made)

### Deploy Backend API:
```bash
cd "sindhiMatrimonyBackhend"
npx vercel --prod --yes
```

### Deploy Admin Panel (Vite):
```bash
cd "sindiMatrimonyAdmin"
npm run build
npx vercel --prod --yes
```

### Deploy User Panel (Next.js):
```bash
cd "sindhiMatrimonyUserPanel"
npm run build
npx vercel --prod --yes
```

---

## 📲 6. Ready-to-Share Client Template (WhatsApp / Email)

```text
Hi Team,

Here are the live deployment links and access credentials for the Sindhi Matrimony Platform:

💍 User Web Portal:
• Link: https://sindhi-matrimony-user-panel.vercel.app
• Custom Domain: https://sindhimarriage.in
• Test Mobile: 9829012345
• Password: Password123@
• OTP: 1234

🛡️ Admin CRM Portal:
• Link: https://sindi-matrimony-admin.vercel.app
• Custom Domain: https://admin.sindhimarriage.in
• Admin Email: admin@sindhimarriage.in
• Password: Admin@1234
• 2FA OTP: 1234 (4 digits)

⚙️ Backend API Gateway:
• Base URL: https://sindhi-matrimony-backend.vercel.app
• Health Status: https://sindhi-matrimony-backend.vercel.app/api/v1/health (200 OK)

Note: All OTP inputs are 4 digits. For testing/demo mode, use master code '1234'.
```
