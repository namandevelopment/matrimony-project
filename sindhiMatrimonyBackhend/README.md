# 🚀 Sindhi Matrimony – Unified Backend Service (`sindhiMatrimonyBackhend`)

> **Platform Core:** Unified Node.js, Express 5, ESM (`"type": "module"`), Mongoose 8, Redis, BullMQ, and Socket.io.  
> **Production Live URL (Vercel):** [https://sindhi-matrimony-backend.vercel.app](https://sindhi-matrimony-backend.vercel.app)  
> **Production Health Check:** [https://sindhi-matrimony-backend.vercel.app/api/v1/health](https://sindhi-matrimony-backend.vercel.app/api/v1/health)  
> **Local Dev Base URL:** `http://localhost:5001` (`/api/v1`)  
> **Clients Served:**
> - 🛡️ **Admin Portal (`sindiMatrimonyAdmin`):** React + Vite CRM & Operations Dashboard
> - 💻 **User Web Portal (`sindhiMatrimonyUserPanel`):** Next.js Responsive Web App
> - 📱 **Mobile App (`sindhiMatrimony`):** React Native iOS & Android App

---

## 📚 Backend Documentation Index

All backend architectural plans, directory patterns, API specifications, and performance blueprints are consolidated in this directory:

| # | Document | File Link | Focus / Scope |
|:---|:---|:---|:---|
| 1 | **Backend Folder Structure & Architecture Blueprint** | [BACKEND_FOLDER_STRUCTURE.md](./BACKEND_FOLDER_STRUCTURE.md) | Modeled on `mymelemo-backend`. Full directory tree, ESM configuration, separated validation rules (`utils/joiValidationDataType.js`), and centralized messages (`utils/constantsMessage.js`). |
| 2 | **Admin Panel Backend API Requirements** | [ADMIN_BACKEND_API_REQUIREMENTS.md](./ADMIN_BACKEND_API_REQUIREMENTS.md) | Comprehensive API requirements for all 21 Admin modules. Endpoints, request payloads, response envelopes, pagination, validation rules, and error codes. |
| 3 | **Screen-by-Screen API Mapping** | [ADMIN_SCREENS_API_MAPPING.md](./ADMIN_SCREENS_API_MAPPING.md) | Admin screens mapped directly to backend endpoints, required roles, HTTP methods, and data handling workflows. |
| 4 | **Unified Backend Architecture Plan** | [BACKEND_ARCHITECTURE_PLAN.md](./BACKEND_ARCHITECTURE_PLAN.md) | Multi-client single backend topology, shared database schema, JWT auth flow, and modular service delegation. |
| 5 | **Cost & Ultra-Performance Optimization Blueprint** | [BACKEND_COST_PERFORMANCE_OPTIMIZATION.md](./BACKEND_COST_PERFORMANCE_OPTIMIZATION.md) | Sub-50ms latency, zero log spam (Pino), `.lean()` queries, direct-to-R2 presigned media uploads, and $5–$10/mo single-VPS deployment guide. |
| 6 | **Auto-Matchmaking Engine Technical Spec** | [BACKEND_AUTO_MATCHMAKING_ENGINE.md](./BACKEND_AUTO_MATCHMAKING_ENGINE.md) | 10-step eligibility filter, weighted scoring engine, Gotra exogamy validation, and batched daily recommendation worker. |
| 7 | **Horoscope, Kundli & Notification Specification** | [MASTER_HOROSCOPE_MATCHMAKING_NOTIFICATION_SPECIFICATION.md](./MASTER_HOROSCOPE_MATCHMAKING_NOTIFICATION_SPECIFICATION.md) | Vedic Ashtakoota 36-Guna calculation engine, Manglik Dosha evaluator, transactional event outbox, and push/WhatsApp notification queues. |

---

## 🏗️ Architectural Core Principles

1. **Zero Inline Hardcoded Strings:**
   - All response messages, validation errors, and notification copies reside exclusively in [`utils/constantsMessage.js`](./BACKEND_FOLDER_STRUCTURE.md#481-the-separate-messages-file-rule-utilsconstantsmessagejs).
2. **Centralized Joi Validation Types:**
   - Common schemas (MongoDB ObjectIds, phone numbers, emails, passwords, dates) reside in [`utils/joiValidationDataType.js`](./BACKEND_FOLDER_STRUCTURE.md#451-the-separate-validation-file-rule-utilsjoivalidationdatatypejs).
3. **Unified API Response Envelope:**
   - All controller endpoints reply with `apiHTTPResponse(req, res, statusCode, message, data, extraMeta)`.
4. **Shared vs Role-Protected APIs:**
   - Shared client logic resides in `routes/<module>/index.js` and `common.js`, while role-restricted operations reside in `admin.js` protected by `verifyEmployeeToken` & RBAC permissions.

---

## 🏆 Official Production Deployment Model: Single-VPS Local MongoDB + Redis

> 💡 **ARCHITECTURAL DECISION:**  
> *"Single VPS Local MongoDB + Redis model is the official production deployment architecture. Isse sasta aur isse fast poore market me aur koi tareeqa nahi hai!"*

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│            OFFICIAL SINGLE-VPS ALL-IN-ONE PRODUCTION ARCHITECTURE (~₹350 - ₹400 / MO)  │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                        │
│  [ BUDGET VPS (Hetzner CX22 / AWS Lightsail) ] (~€3.79 / ~$4.50 / ~₹350 - ₹400 / mo)   │
│  ├── 2 vCPU, 4 GB RAM, 40 GB NVMe SSD, 20 TB Bandwidth                                 │
│  │                                                                                     │
│  ├── 1. Nginx Reverse Proxy (SSL via Certbot + Brotli/Gzip)                           │
│  ├── 2. Node.js Backend API (PM2 Cluster Mode: 2 Worker Threads)                       │
│  ├── 3. MongoDB Community Server (Localhost 127.0.0.1:27017) ──► ₹0 / Month (FREE)    │
│  │       • 0ms loopback latency, zero Atlas cloud bills, full 40 GB NVMe disk storage. │
│  ├── 4. Redis Server (Localhost 127.0.0.1:6379) ───────────────► ₹0 / Month (FREE)    │
│  │       • 1ms in-memory cache, JWT blacklist, rate limiting, and unread counters.     │
│  │                                                                                     │
│  [ CLOUDFLARE R2 OBJECT STORAGE ] ─────────────────────────────► ₹0 / Month (FREE)    │
│  • 10 GB Free photo/KYC storage + ZERO ($0) download bandwidth egress fees.            │
│                                                                                        │
│  [ CLOUDFLARE FREE TIER CDN & DNS ] ───────────────────────────► ₹0 / Month (FREE)    │
│  • Free SSL certificates, DDoS mitigation, and edge caching.                           │
│                                                                                        │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                            TOTAL MONTHLY BILL: ₹350 – ₹400 / MONTH!    │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Why This Is The Best Choice:
- **Fastest Response (0ms Loopback):** Node.js, MongoDB, and Redis communicate over local IPC / loopback sockets on `127.0.0.1`, completely eliminating remote cloud database network latency.
- **Atlas Bills Eliminated:** No MongoDB Atlas $57/mo M10 upgrade paywalls.
- **40 GB SSD Capacity:** Easily supports 50,000+ candidate profiles, photos metadata, and chat histories.
- **Automated Free Backups:** Daily cron `mongodump` dumps compressed database snapshots directly to Cloudflare R2 at **₹0 cost**.
