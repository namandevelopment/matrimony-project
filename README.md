# Matrimony Project - Monorepo

Welcome to the centralized repository for the **Matrimony Project**. This repository contains the entire codebase for admin panels, user portals, backend services, mobile apps, and architectural documentation.

---

## 📌 Repository Details

- **GitHub Repository:** [https://github.com/namandevelopment/matrimony-project](https://github.com/namandevelopment/matrimony-project)
- **Account:** `namandevelopment`
- **Email:** `naman.development@gmail.com`
- **Default Branch:** `main`
- **Initial Setup Date:** 13 October 2026

---

## 📁 Repository Structure

```text
matrimony-project/
├── .gitignore                                 # Root Git ignore rules (node_modules, .env, builds)
├── README.md                                  # This documentation file
│
├── sindiMatrimonyAdmin/                       # Admin Portal (Vite + React / TypeScript)
│   ├── src/                                   # Screens (Leads, Members, CRM, Settings, Verification)
│   ├── package.json
│   └── vite.config.ts
│
├── sindhiMatrimony/                           # Main Application Frontend / Mobile App
│   ├── src/
│   └── package.json
│
├── sindhiMatrimonyBackhend/                   # Backend API Services & Database Logics
│
├── sindhiMatrimonyUserPanel/                  # User Portal & Public Landing Web App (Next.js 16 + React 19 + Tailwind v4)
│   ├── src/                                   # Screens, Components, Modals, Hooks
│   ├── package.json
│   └── next.config.ts
│
├── docs/                                      # Operational & Architecture Guides
│   ├── ADMIN_OPERATIONS_AND_GOVERNANCE_ARCHITECTURE.md
│   ├── BACKEND_AUTO_MATCHMAKING_ENGINE.md
│   └── sidebar_sections/                      # Component-by-component documentation
│
└── *.md                                       # High-level architecture specification files
```

---

## 🌐 Live Deployments

### User Panel (Public Web Portal)
- **Status:** 🟢 Live in Production
- **Live URL:** [https://sindhi-matrimony-user-panel.vercel.app](https://sindhi-matrimony-user-panel.vercel.app)
- **Platform:** Vercel (Hobby)
- **Account:** `namandevelopment-9594` (`naman.development@gmail.com`)
- **Project Name:** `sindhi-matrimony-user-panel`
- **Framework:** Next.js (App Router, Turbopack)
- **Root Directory:** `sindhiMatrimonyUserPanel`
- **Public Routes:**
  - `/` - Main Landing Page (Hero, Trust Badges, About, Footer, Login/Register Modal)
  - `/terms-and-conditions` - SEO-optimized Terms & Conditions
  - `/privacy-policy` - Privacy Policy Screen
- **Deploy Command:**
  ```bash
  cd sindhiMatrimonyUserPanel
  npx vercel --prod
  ```

---

## ⚙️ Initial Setup & Fixes Summary

During the initial Git initialization and push on 13 October 2026, the following tasks were completed:

1. **Configured Git Identity:**
   - Git user set to `namandevelopment`
   - Git email set to `naman.development@gmail.com`

2. **Cleaned Nested Git Repositories:**
   - Removed nested `sindhiMatrimony/.git` folder.
   - *Why?* If nested `.git` folders exist, Git treats them as Git submodules / gitlinks instead of committing their code. Removing it allowed all 390+ source files to be directly tracked.

3. **Created Central `.gitignore`:**
   - Excluded all heavy `node_modules/` across all nested directories.
   - Excluded sensitive secrets (`.env`, `.env.local`).
   - Excluded production builds (`dist/`, `build/`, `.next/`).

4. **Resolved macOS Multi-Account 403 Conflict:**
   - macOS Keychain had cached credentials for a different account (`NamanSainiCRM`).
   - Authenticated push to `namandevelopment` using a Personal Access Token (PAT with `repo` scope).

---

## 🚀 Daily Developer Workflow

### 1. Check Status
```bash
cd "/Users/naman/Documents/CRM Landing Projects/Matrimony Project"
git status
```

### 2. Pull Latest Changes
```bash
git pull origin main
```

### 3. Add and Push New Changes
```bash
git add .
git commit -m "feat: your descriptive commit message"
git push origin main
```

---

## 🔐 Authentication & Troubleshooting

### If Push Fails with 403 (Permission Denied)
If macOS Keychain switches back to another account, update the remote URL with your token:
```bash
git remote set-url origin https://<YOUR_GITHUB_PAT>@github.com/namandevelopment/matrimony-project.git
git push origin main
```

### Adding New Sub-projects to This Repo
If you copy a new project into this repository in the future:
1. Make sure to delete any existing `.git` folder inside the newly added folder:
   ```bash
   rm -rf path/to/new-folder/.git
   ```
2. Run standard git commands:
   ```bash
   git add .
   git commit -m "Add new subproject"
   git push origin main
   ```
