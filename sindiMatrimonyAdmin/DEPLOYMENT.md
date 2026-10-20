# 🚀 Sindhi Matrimony Admin — Vercel Deployment Guide & Info

Complete deployment details, live URLs, configuration, and future maintenance instructions for the Sindhi Matrimony Admin Portal.

---

## 🌐 1. Live URLs

| Type | URL | Purpose |
| :--- | :--- | :--- |
| **Primary Production URL** | [https://sindi-matrimony-admin.vercel.app](https://sindi-matrimony-admin.vercel.app) | **Client ko share karne ke liye main link** (Always points to latest prod) |
| **Direct Deployment URL** | [https://sindi-matrimony-admin-iszvj8p0l-namandevelopment-9594.vercel.app](https://sindi-matrimony-admin-iszvj8p0l-namandevelopment-9594.vercel.app) | Unique immutable deployment snapshot |
| **Vercel Project Dashboard** | [https://vercel.com/namandevelopment-9594/sindi-matrimony-admin](https://vercel.com/namandevelopment-9594/sindi-matrimony-admin) | Analytics, logs, domain settings & environment variables |

---

## 📋 2. Project Metadata

- **Project Name (Vercel):** `sindi-matrimony-admin`
- **Team / Account:** `namandevelopment-9594`
- **Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS, TanStack Query & Table
- **Framework Preset:** Vite
- **Build Output Directory:** `dist`
- **Build Command:** `tsc -b && vite build`

---

## ⚙️ 3. SPA Routing Configuration (`vercel.json`)

Vite ek Single Page Application (SPA) hai. React Router ke routes (jaise `/members`, `/settings`, `/profile`) par direct refresh karne par 404 error na aaye, iske liye admin root par `vercel.json` banaya gaya hai:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

> **Benefit:** Client kisi bhi page par refresh kare ya direct link open kare, page bina kisi error ke instantly render hoga.

---

## 🔄 4. Future Updates / Redeployment Steps

Jab bhi aap code me changes karein aur naye version ko live karna ho, yeh steps follow karein:

### Step 1: Local Build & Test Check (Recommended)
```bash
# 1. Admin directory me jaayein
cd "sindiMatrimonyAdmin"

# 2. Check karein ki TypeScript aur build bina error ke pass ho rahe hain
npm run build
npm test
```

### Step 2: Live Deploy to Production
```bash
# Direct production deploy command:
npx vercel --prod
```
- Deployment **20-30 seconds** me live ho jayegi.
- Same primary URL (`https://sindi-matrimony-admin.vercel.app`) automatically update ho jayega.

---

## 📩 5. Client Sharing Template (Ready to Copy)

Aap client ko direct yeh message WhatsApp ya Email par send kar sakte hain:

```text
Hi,

Here is the live demo link for the Sindhi Matrimony Admin Portal:
🔗 https://sindi-matrimony-admin.vercel.app

Key Highlights:
- Fully responsive modern interface
- Comprehensive forms with auto-validation
- Interactive tables with multi-filter and actions
- Optimized loading speeds & SSL security

Please test it out and share your feedback!
```

---

## 🛠️ 6. Troubleshooting & Useful Commands

| Command | Description |
| :--- | :--- |
| `npx vercel logs` | Live server & request logs dekhne ke liye |
| `npx vercel inspect <deployment-url>` | Build errors ya deployment details inspect karne ke liye |
| `npx vercel domains` | Custom domain attach karne ke liye (e.g. `admin.sindhimarriage.in`) |
