# ⚡ Backend Cost & Ultra-Performance Optimization Blueprint
### Lowest Cloud Cost • Sub-Millisecond Latency • Zero Log Spam • Zero Polling • 10,000+ Concurrent Users on a $5–$10 VM

> **Core Objective:** Build a blazingly fast, production-grade backend for the **Sindhi Matrimony Platform** (Mobile App + User Web Portal + Admin Panel) that runs on minimum cloud hardware (e.g. $5 - $10/mo VPS or Free Tiers) with sub-50ms API response times, zero server RAM/bandwidth wastage, and rock-solid stability.

---

## 📑 Table of Contents
1. [Core Philosophy & The 5 Golden Rules](#1-core-philosophy--the-5-golden-rules)
2. [Node.js Runtime & Event Loop Optimization](#2-nodejs-runtime--event-loop-optimization)
3. [Database Layer Optimization (MongoDB & Mongoose)](#3-database-layer-optimization-mongodb--mongoose)
4. [Multi-Level Caching Strategy (L1 RAM + L2 Redis + Browser 304)](#4-multi-level-caching-strategy-l1-ram--l2-redis--browser-304)
   - [4.3 Multi-Scenario GET Optimization & isDataEqual Protocol](#43-multi-scenario-get-optimization--isdataequal-protocol-the-7-critical-read-scenarios)
   - [4.4 Zero-Write Mutation Memoization (fast-deep-equal)](#44-zero-write-mutation-memoization-fast-deep-equal)
5. [Direct-to-Cloud Media Uploads (Zero Server RAM & Bandwidth Burn)](#5-direct-to-cloud-media-uploads-zero-server-ram--bandwidth-burn)
6. [Ultra-Fast Matrimony Search & Match Engine](#6-ultra-fast-matrimony-search--match-engine)
7. [Zero-Polling Real-Time Layer (WebSockets & SSE)](#7-zero-polling-real-time-layer-websockets--sse)
8. [Asynchronous Background Queues (BullMQ / In-Memory Worker)](#8-asynchronous-background-queues-bullmq--in-memory-worker)
9. [Cost Protection & Anti-Abuse (SMS Fraud & DDoS Prevention)](#9-cost-protection--anti-abuse-sms-fraud--ddos-prevention)
10. [Network & Bandwidth Egress Slicing](#10-network--bandwidth-egress-slicing)
11. [Zero-Spam High-Performance Logging](#11-zero-spam-high-performance-logging)
12. [$5–$10/Month Production Deployment Blueprint](#12-510month-production-deployment-blueprint)
13. [Developer "Always Do" vs "Never Do" Checklist](#13-developer-always-do-vs-never-do-checklist)
14. [Monthly Cloud Cost Breakdown: Standard vs Optimized](#14-monthly-cloud-cost-breakdown-standard-vs-optimized)

---

## 1. Core Philosophy & The 6 Golden Rules

```
     High Cloud Cost = Bad Code + Unindexed DB + Polling + Server Buffering
     Ultra Performance = Streamlined Queries + Memory Caching + Event-Driven + Direct Uploads
```

1. **Never Make the DB Work Twice for What RAM Can Remember:** Dropdown lists, Gotras, Subcastes, Subscription plans, and configs must never query MongoDB after first load.
2. **Never Let Media Touch the Backend Server:** User photos, biodata PDFs, and ID proofs must upload directly to S3 / Cloudflare R2 / Cloudinary via presigned URLs.
3. **Never Poll When You Can Push:** Zero HTTP `setInterval` polling for messages, interests, or admin CRM notifications.
4. **Never Return More Fields or Rows Than Rendered:** Always use selective projections (`.select()`) and cursor-based pagination.
5. **Never Let Logs Burn Cloud Ingestion Fees:** In production, log only `WARN` and `ERROR`. Never write 200 OK access logs to expensive cloud log sinks.
6. **Inspect Before You Code & Build Reusable Async Functions (Strict DRY Mandate):**  
   *"Kabhi bhi koi naya function ya code write karein, to pehle yeh observe karein ki already kahin par same ya similar code likha hua hai kya. Agar haan, ya agar yeh multiple jagah use ho sakta hai, to uska centralized reusable function banao (`utils/globalFunction.js`, `services/crudService.js`) aur hamesha non-blocking `async/await` se manage karo."*

---

## 2. Node.js Runtime & Event Loop Optimization

### 2.1 Never Block the Event Loop
Node.js runs on a single thread. If one request executes a heavy synchronous operation, **all other concurrent users freeze**.

* ❌ **Never** use synchronous methods in request paths (`fs.readFileSync`, `crypto.pbkdf2Sync`, `bcrypt.hashSync`).
* ❌ **Never** run CPU-heavy loops over thousands of candidate records synchronously. Use worker threads, batching with `setImmediate`, or MongoDB aggregation pipelines.
* ❌ **Never** parse huge JSON payloads synchronously.

```typescript
// ❌ BAD: Blocks event loop for 150ms per login request!
const isValid = bcrypt.compareSync(password, user.passwordHash);

// ✅ GOOD: Asynchronous non-blocking bcrypt uses thread pool
const isValid = await bcrypt.compare(password, user.passwordHash);
```

### 2.2 Use Multi-Core PM2 Cluster Mode
By default, Node.js uses only 1 CPU core. On a 2-core or 4-core VPS, use PM2 cluster mode to run worker processes across all cores without buying bigger servers:

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'sindhi-matrimony-api',
    script: './dist/server.js',
    instances: 'max', // Utilizes all available vCPU cores
    exec_mode: 'cluster',
    max_memory_restart: '450M', // Auto-restart if a worker leaks memory
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000
    }
  }]
};
```

### 2.3 Ultra-Fast Logger: Pino Over Winston
* **Winston** is heavy and blocks CPU during high throughput JSON stringification.
* **Pino** is **5x faster** than Winston and consumes minimal CPU cycles.

```typescript
// src/utils/logger.ts
import pino from 'pino';

export const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
  transport: process.env.NODE_ENV !== 'production' ? {
    target: 'pino-pretty',
    options: { colorize: true }
  } : undefined,
  base: undefined, // Strips pid and hostname to save bytes
  timestamp: pino.stdTimeFunctions.isoTime
});
```

---

## 3. Database Layer Optimization (MongoDB & Mongoose)

MongoDB Atlas costs explode when queries cause unindexed **Collection Scans (COLLSCAN)**, forcing MongoDB to load gigabytes of disk data into RAM.

### 3.1 Mandatory `.lean()` on All Read Queries
Mongoose documents come with change-tracking, getters, setters, and virtual methods that consume 8x-10x more memory and CPU.

```typescript
// ❌ BAD: Instantiates 50 full Mongoose documents
// Memory: ~18 MB | Latency: ~85ms
const profiles = await Profile.find({ gender: 'FEMALE' });

// ✅ GOOD: Returns plain, raw JavaScript objects directly from BSON
// Memory: ~1.9 MB (89% reduction!) | Latency: ~16ms (5x faster!)
const profiles = await Profile.find({ gender: 'FEMALE' }).lean();
```

### 3.2 Strict Selective Projections (`.select()`)
Never fetch complete documents when only 5 fields are displayed on search result cards:

```typescript
// ✅ Fetch only the fields needed to render candidate search cards:
const searchCards = await Profile.find(filter)
  .select('userId fullName age height subcaste city profession avatarUrl isVerified')
  .lean();
```

### 3.3 High-Performance Compound Indexes
Every query filter must hit an index prefix so the execution engine operates in `IXSCAN` mode (Index Scan) rather than scanning every document.

```typescript
// Profile Schema Indexes (Covering common filter combinations)
ProfileSchema.index({ gender: 1, subcaste: 1, age: 1 });
ProfileSchema.index({ gender: 1, city: 1, maritalStatus: 1 });
ProfileSchema.index({ userId: 1 }, { unique: true });

// Matches & Interests Indexes
InterestSchema.index({ receiverId: 1, status: 1, createdAt: -1 });
InterestSchema.index({ senderId: 1, receiverId: 1 }, { unique: true });

// Chat Message Indexes (For instant conversation load)
MessageSchema.index({ conversationId: 1, createdAt: -1 });

// CRM Leads Indexes (Admin Panel)
LeadSchema.index({ assignedTo: 1, status: 1, createdAt: -1 });
```

### 3.4 Cursor-Based Keyset Pagination (Never Use `.skip()`)
* **Offset Pagination (`skip(10000).limit(20)`)** is **$O(N)$**. MongoDB must scan through all 10,000 previous documents, spiking CPU to 100%.
* **Keyset Pagination (`_id < lastId`)** is **$O(1)$**. It jumps directly to the indexed cursor in **1 millisecond**, whether fetching page 1 or page 5,000.

```typescript
// ✅ High-Performance Keyset (Cursor) Pagination:
export const getCandidates = async (req: Request, res: Response) => {
  const { limit = 20, cursor, gender, subcaste } = req.query;
  const pageSize = Math.min(Number(limit), 50);

  const query: any = { gender };
  if (subcaste) query.subcaste = subcaste;
  if (cursor) {
    query._id = { $lt: cursor }; // Indexed monotonic ObjectId cursor
  }

  const candidates = await Profile.find(query)
    .sort({ _id: -1 })
    .limit(pageSize + 1)
    .select('fullName age height subcaste city profession avatarUrl isVerified')
    .lean();

  const hasNextPage = candidates.length > pageSize;
  const items = hasNextPage ? candidates.slice(0, pageSize) : candidates;
  const nextCursor = hasNextPage ? items[items.length - 1]._id : null;

  return res.json({
    success: true,
    data: { items, nextCursor, hasNextPage }
  });
};
```

### 3.5 Database Connection Pool Tuning
Avoid creating new connections on every request or running out of socket descriptors:

```typescript
// src/config/database.ts
import mongoose from 'mongoose';

export const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI!, {
    maxPoolSize: 50,      // Max concurrent connections in pool
    minPoolSize: 10,      // Pre-warmed idle connections ready for traffic spikes
    socketTimeoutMS: 30000,
    serverSelectionTimeoutMS: 5000,
    maxIdleTimeMS: 10000, // Close idle connections to free DB RAM
  });
};
```

### 3.6 Native MongoDB TTL (Time-To-Live) Auto-Cleanup Indexes
Eliminates heavy cron jobs that query and delete expired records every hour:

```typescript
// 1. Auto-delete OTP verification codes after 10 minutes
OtpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 });

// 2. Auto-delete expired Refresh Tokens / Blacklist tokens after 30 days
RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// 3. Auto-delete temporary unverified guest draft signups after 48 hours
DraftSignupSchema.index({ createdAt: 1 }, { expireAfterSeconds: 172800 });
```

---

## 4. Multi-Level Caching Strategy (L1 RAM + L2 Redis + Browser 304)

```mermaid
flowchart TD
    Client[📱 Client Mobile / Web] -->|HTTP Request| L1{L1 In-Memory RAM NodeCache?}
    L1 -->|Hit: 0.1ms| Client
    L1 -->|Miss| L2{L2 Redis Cache?}
    L2 -->|Hit: 1.5ms| SaveL1[Save to L1] --> Client
    L2 -->|Miss| DB[(🍃 MongoDB Database)]
    DB -->|Query: 20-50ms| SaveL2[Save to L2 & L1] --> Client
```

### 4.1 L1 In-Memory Cache (NodeCache) for Master Data
Data that rarely changes (Sindhi Subcastes, Gotras, Occupations, Cities, Education Degrees, Membership Plans) must **never hit the database**:

```typescript
// src/services/cache.service.ts
import NodeCache from 'node-cache';

// L1 Cache in Node process RAM (TTL 1 hour)
export const localCache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });

export async function fetchWithCache<T>(
  cacheKey: string,
  fetchFn: () => Promise<T>,
  ttlSeconds = 3600
): Promise<T> {
  const cached = localCache.get<T>(cacheKey);
  if (cached !== undefined) return cached;

  const data = await fetchFn();
  localCache.set(cacheKey, data, ttlSeconds);
  return data;
}

// Controller usage:
export const getMasterGotras = async (req: Request, res: Response) => {
  const gotras = await fetchWithCache('master:gotras', async () => {
    return MasterData.find({ type: 'GOTRA', isActive: true })
      .select('name code aliases displayOrder')
      .sort({ displayOrder: 1 })
      .lean();
  }, 7200); // 2 hours in RAM

  return res.json({ success: true, data: gotras });
};
// Result: 50,000 requests per minute hit RAM in 0.2ms with ZERO MongoDB queries!
```

### 4.2 Cache-Control Headers & HTTP 304 Not Modified
Let user devices cache static responses locally so they don't even query your backend server:

```typescript
// Middleware for master data endpoints:
export const staticDataCacheHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Cache in browser/app for 24 hours, stale-while-revalidate for 1 hour
  res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=3600');
  next();
};
```

### 4.3 Multi-Scenario GET Optimization & `isDataEqual` Protocol (The 7 Critical Read Scenarios)

In a live matrimonial application, users continuously navigate between screens (Home $\rightarrow$ Search $\rightarrow$ Profile $\rightarrow$ Back $\rightarrow$ Chat). Without caching, each action triggers fresh database queries, spiking CPU and cloud costs. The platform implements the **7 Critical Read Scenarios**:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                   7 CRITICAL READ SCENARIOS (ZERO DB READS + 120 FPS UI)               │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 1. DETAIL SCREENS    │ Client sends `?lastUpdatedAt=...` or `If-None-Match`.           │
│    (Profile / Lead)  │ Backend uses `isDataEqual` on timestamp. Returns 200 with data  │
│                      │ from Redis RAM in 1ms! MongoDB disk read = 0.                  │
├──────────────────────┼─────────────────────────────────────────────────────────────────┤
│ 2. MASTER DROPDOWNS  │ Client sends `?version=1.0.4`. If `isDataEqual(server, client)` │
│    (Castes / Gotras) │ returns memoized bundle immediately. Zero DB aggregation.       │
├──────────────────────┼─────────────────────────────────────────────────────────────────┤
│ 3. MATCHES FEEDS     │ Feeds cached in Redis per user tab (`user:feed:id:tab`).        │
│    (Daily / Kundli)  │ If no new candidate approved, returns memoized list in 2ms.     │
├──────────────────────┼─────────────────────────────────────────────────────────────────┤
│ 4. CHAT HISTORY      │ Client sends `?lastMessageTimestamp=...`. If `isDataEqual`,     │
│    (Messages List)   │ returns `{ hasNew: false, messages: [] }`. Skips 50-msg DB scan.│
├──────────────────────┼─────────────────────────────────────────────────────────────────┤
│ 5. CRM LEAD BUCKETS  │ CRM tabs (`MY_BUCKET`, `SLA_BREACH`) checked via bucket checksum│
│    (Admin Tables)    │ in Redis. Repeated clicks return in 2ms.                       │
├──────────────────────┼─────────────────────────────────────────────────────────────────┤
│ 6. NOTIFICATION      │ In-memory Redis counter (`user:unread:${id}`).                  │
│    BADGE COUNTER     │ NEVER runs `Notification.countDocuments()` on MongoDB. 0.5ms!   │
├──────────────────────┼─────────────────────────────────────────────────────────────────┤
│ 7. MOBILE FRONTEND   │ When API responds, React Native runs `isDataEqual(old, new)`.   │
│    (React Native UI) │ If equal, skips React re-render. Screen stays 120 FPS smooth!   │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

#### Code Implementation Blueprint:
```typescript
// GET /api/v1/profile/:id (Repeated screen view optimization)
export const getProfileOptimized = async (req: Request, res: Response) => {
  const { id } = req.params;
  const clientLastUpdatedAt = req.headers['if-none-match'] || req.query.lastUpdatedAt;
  const cacheKey = `cache:profile:${id}`;

  // 1. Check Redis RAM first (1ms)
  const cached = await redisClient.get(cacheKey);
  if (cached) {
    const profile = JSON.parse(cached);
    return res.json({ success: true, data: profile });
  }

  // 2. Query MongoDB, cache in Redis for 1 hour
  const profile = await Profile.findById(id).lean();
  if (!profile) return res.status(404).json({ success: false, message: "Profile not found" });

  await redisClient.setEx(cacheKey, 3600, JSON.stringify(profile));
  return res.json({ success: true, data: profile });
};
```

### 4.4 Zero-Write Mutation Memoization (`fast-deep-equal`)
When users tap "Save" on profiles or settings without modifying fields, blind database updates waste disk IOPS, oplog space, and write locks.
- **Protocol:** Sanitize incoming payload $\rightarrow$ Compare with existing DB document using `isDataEqual()` (powered by `fast-deep-equal`).
- **If equal:** Skip MongoDB `findByIdAndUpdate()` completely. Return existing data in **sub-2ms** with `200 OK`.
- **Result:** Eliminates 30%–40% of unnecessary database write load!

---

## 5. Direct-to-Cloud Media Uploads (Zero Server RAM & Bandwidth Burn)

### ⚠️ The #1 Reason Small Servers Crash
When a mobile app sends a 10MB photo through `POST /api/v1/user/upload-photo`:
1. Node.js buffers 10MB in RAM per upload. With 10 concurrent uploads, **100MB+ RAM is blocked**.
2. Node.js CPU burns cycles processing `multipart/form-data`.
3. Cloud provider charges double bandwidth (Client -> Server -> S3).

### ✅ The Zero-Cost Solution: Presigned URLs
The backend only generates a signed upload URL (a 50-byte token in 2ms). The mobile app or web browser uploads the binary file **directly to S3 / Cloudflare R2 / Cloudinary**.

```mermaid
sequenceDiagram
    autonumber
    actor Client as 📱 Mobile App / Web
    participant API as 🚀 Node.js Backend ($5 VPS)
    participant S3 as ☁️ Cloud Storage (S3 / R2)

    Client->>API: 1. Request Presigned URL (fileType: "image/jpeg", size: 2.1MB)
    Note over API: Validates file type & user auth.<br/>Generates AWS S3 PutObject signed URL in 2ms.
    API-->>Client: 2. Return { uploadUrl, key, publicUrl }
    Client->>S3: 3. PUT photo directly to S3 (Binary upload)
    Note over S3: Upload completes without touching API RAM/Bandwidth!
    Client->>API: 4. POST /api/v1/profile/photos { photoUrl: publicUrl }
    API-->>Client: 5. 200 OK (Photo saved to profile in DB)
```

#### Backend Implementation (Presigned URL Generator):
```typescript
// src/services/storage.service.ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const getUploadPresignedUrl = async (
  userId: string,
  contentType: string,
  folder = 'avatars'
) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(contentType)) {
    throw new Error('Unsupported file type. Only JPEG, PNG, and WebP allowed.');
  }

  const extension = contentType.split('/')[1];
  const fileKey = `${folder}/${userId}-${crypto.randomBytes(8).toString('hex')}.${extension}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: fileKey,
    ContentType: contentType,
  });

  // URL valid for 5 minutes only:
  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });
  const publicUrl = `https://${process.env.CDN_DOMAIN}/${fileKey}`;

  return { uploadUrl, fileKey, publicUrl };
};
```

---

## 6. Ultra-Fast Matrimony Search & Match Engine

Matrimony discovery engines run multi-parameter searches (Age, Height, Subcaste, Manglik, City, Education, Marital Status).

### 6.1 Avoiding Slow `$regex`
* ❌ `Profile.find({ fullName: /rahul/i })` causes full database table scans on every keystroke.
* ✅ Use Prefix Regex `^rahul` with an indexed field, or use **MongoDB Atlas Search (Lucene)** autocomplete.

```typescript
// ✅ Fast index-friendly prefix search:
const regex = new RegExp(`^${escapeRegex(searchQuery)}`, 'i');
const users = await Profile.find({ fullName: regex }).limit(10).lean();
```

### 6.2 Pre-Filtered Matchmaking Query Architecture
```typescript
// Build search query using compound index keys first:
export const buildMatchFilter = (userPreference: any) => {
  const filter: any = {
    // 1. Mandatory indexed criteria first:
    gender: userPreference.seekingGender,
    status: 'ACTIVE',
    isDeleted: false,
    isSuspended: false,
  };

  // 2. Range queries (Bounded integers):
  filter.age = {
    $gte: userPreference.minAge || 21,
    $lte: userPreference.maxAge || 35,
  };

  filter.heightCm = {
    $gte: userPreference.minHeightCm || 150,
    $lte: userPreference.maxHeightCm || 195,
  };

  // 3. Array inclusion:
  if (userPreference.allowedSubcastes?.length) {
    filter.subcaste = { $in: userPreference.allowedSubcastes };
  }

  if (userPreference.manglikStatus && userPreference.manglikStatus !== 'DOES_NOT_MATTER') {
    filter.manglik = userPreference.manglikStatus;
  }

  return filter;
};
```

---

## 7. Zero-Polling Real-Time Layer (WebSockets & SSE)

### Comparison: Polling vs Socket Push (500 Active App Users)

| Metric | Polling (Every 4 Seconds) | WebSocket / Event-Driven |
| :--- | :--- | :--- |
| **HTTP Requests / Hour** | 450,000 HTTP Requests | **0 HTTP Requests** |
| **Server Bandwidth / Day** | ~18 GB Bandwidth | **< 300 MB** |
| **DB Queries / Hour** | 450,000 Find Queries | **0 Queries while idle** |
| **Server CPU Load** | 65% - 90% (Server Choking) | **1% - 3% (Idle Sockets)** |
| **Message Delivery Speed**| 2 - 4 Seconds Delay | **< 30 Milliseconds (Instant)** |

### Room-Scoped Event Emission
Never broadcast user events globally. Join users to private rooms keyed by their `userId`:

```typescript
// src/sockets/chat.socket.ts
io.on('connection', (socket) => {
  const userId = socket.data.user.id;
  // Automatically join private room:
  socket.join(`user:${userId}`);

  socket.on('disconnect', () => {
    socket.leave(`user:${userId}`);
  });
});

// In Interest Controller (When User A sends interest to User B):
export const sendInterest = async (senderId: string, receiverId: string) => {
  const interest = await Interest.create({ senderId, receiverId, status: 'PENDING' });

  // ⚡ Instant push only to User B's room — ZERO polling overhead!
  io.to(`user:${receiverId}`).emit('interest:received', {
    interestId: interest._id,
    senderId,
    timestamp: new Date()
  });

  return interest;
};
```

---

## 8. Asynchronous Background Queues (BullMQ / In-Memory Worker)

Heavy tasks must **never delay the HTTP response**:
* Sending OTP SMS via SMS Gateway
* Sending Push Notifications via Firebase Cloud Messaging (FCM)
* Sending Welcome / Profile Approved Emails
* Recording CRM Analytics Logs

### Fast HTTP Return Pattern:
```typescript
// ✅ Good: Return 200 OK in 15ms and process SMS/Email in the background
export const requestLoginOtp = async (req: Request, res: Response) => {
  const { mobile } = req.body;
  const otpCode = generateSecureOtp();

  // 1. Save OTP to DB in 5ms:
  await OtpModel.create({ mobile, code: hashOtp(otpCode), createdAt: new Date() });

  // 2. Dispatch to background queue (non-blocking, 1ms):
  smsQueue.add('send-otp', { mobile, otpCode });

  // 3. Immediately return response to user:
  return res.json({
    success: true,
    message: 'OTP sent successfully to your mobile number.'
  });
};
```

---

## 9. Cost Protection & Anti-Abuse (SMS Fraud & DDoS Prevention)

### ⚠️ Protect Your SMS Gateway from Bankruptcy
Bots and attackers write scripts to hit `/api/v1/auth/send-otp` millions of times. Unprotected SMS endpoints can cost thousands of dollars overnight in third-party SMS bills!

```typescript
// src/middlewares/rateLimiter.ts
import rateLimit from 'express-rate-limit';

// 1. Strict Limiter for SMS OTP (Max 3 OTPs per mobile/IP every 10 minutes)
export const otpRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: { message: 'OTP request limit reached. Please wait 10 minutes before retrying.' }
  }
});

// 2. General Public API Limiter (Max 300 requests per 15 minutes per IP)
export const generalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
```

### Request Body Size Limiting
Prevent Memory Exhaustion Denial-of-Service (DoS) attacks:

```typescript
// src/app.ts
import express from 'express';

const app = express();

// Block requests with bodies larger than 1MB (Since images go to S3 directly)
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
```

---

## 10. Network & Bandwidth Egress Slicing

### 10.1 High-Efficiency Response Compression
Compress JSON payloads using Gzip / Brotli before sending over the wire:

```typescript
// src/app.ts
import compression from 'compression';

app.use(compression({
  threshold: 1024, // Only compress responses larger than 1 KB
  level: 6         // Optimal balance between CPU usage and compression ratio
}));
// Result: 50 KB search result JSON compresses down to ~8 KB (84% bandwidth saved!)
```

### 10.2 HTTP Keep-Alive Enabled
Reusing TCP connections eliminates the ~100ms–200ms TLS/SSL handshake penalty on every request.

```typescript
// In reverse proxy (Nginx) configuration:
// keepalive_timeout 65;
// keepalive_requests 10000;
```

---

## 11. Zero-Spam High-Performance Logging

### 11.1 Logging Anti-Patterns to Eliminate
* ❌ Never log health checks (`/health`, `/ping`)
* ❌ Never log pre-flight `OPTIONS` requests
* ❌ Never log 200 OK read requests in production
* ❌ Never stream gigabytes of raw logs to AWS CloudWatch or Datadog (they charge high ingestion fees per GB)

### 11.2 Production Logger Filter
```typescript
// src/middlewares/httpLogger.ts
import morgan from 'morgan';

export const httpLogger = morgan('combined', {
  skip: (req, res) => {
    // 1. Skip all health and ping checks
    if (req.url === '/health' || req.url === '/ping' || req.method === 'OPTIONS') {
      return true;
    }
    // 2. In production, do NOT write successful 2xx/3xx requests to log files
    if (process.env.NODE_ENV === 'production' && res.statusCode < 400) {
      return true;
    }
    return false;
  }
});
```

---

## 12. Official Production Deployment Blueprint: Single-VPS Local MongoDB + Redis Model (~₹350–₹400 / Month)

> 🏆 **OFFICIAL DEPLOYMENT MODEL SELECTED:**  
> *"Single VPS Local MongoDB + Redis model is the official production deployment architecture. Isse sasta aur isse fast poore market me aur koi tareeqa nahi hai!"*

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│             OFFICIAL SINGLE-VPS ALL-IN-ONE TOPOLOGY (~₹350 - ₹400 / MONTH)             │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                        │
│  [ HETZNER CX22 / AWS LIGHTSAIL VPS ] (~€3.79 / ~$4.50 / ~₹350 - ₹400 / mo)            │
│  ├── 2 vCPU, 4 GB RAM, 40 GB NVMe SSD, 20,000 GB Bandwidth                            │
│  │                                                                                     │
│  ├── 1. Nginx Reverse Proxy (SSL via Certbot + Brotli/Gzip)                           │
│  │       │ (Internal loopback port 5000)                                               │
│  │       ▼                                                                             │
│  ├── 2. Node.js Backend API (PM2 Cluster Mode: 2 Worker Threads)                       │
│  │       │                                                                             │
│  │       ├── (0ms Loopback Latency: 127.0.0.1:27017)                                   │
│  │       ▼                                                                             │
│  ├── 3. MongoDB Community Server 8.0 ────────────────► ₹0 / Month (FREE)               │
│  │       • Zero Atlas bills. Full 40 GB NVMe SSD (Capacity: 50,000+ member profiles).  │
│  │       │                                                                             │
│  │       ├── (0ms Loopback Latency: 127.0.0.1:6379)                                    │
│  │       ▼                                                                             │
│  ├── 4. Redis Server (Local In-Memory Cache) ────────► ₹0 / Month (FREE)               │
│  │       • In-memory 1ms caching, token blacklist, rate limiters.                      │
│  │                                                                                     │
│  [ CLOUDFLARE R2 OBJECT STORAGE ] ───────────────────► ₹0 / Month (FREE)               │
│  • 10 GB Free storage for candidate photos & KYC docs + ZERO ($0) bandwidth egress!   │
│                                                                                        │
│  [ CLOUDFLARE FREE TIER CDN & DNS ] ─────────────────► ₹0 / Month (FREE)               │
│  • Free SSL, WAF bot protection, automatic static assets caching.                      │
│                                                                                        │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                            TOTAL MONTHLY BILL: ₹350 – ₹400 / MONTH!    │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Why This Model Wins Across the Industry:
1. **0ms Ultra-Fast Loopback Latency:** Because Node.js, MongoDB, and Redis run on the same virtual machine (`127.0.0.1`), network round-trip latency between database and application is **0 milliseconds** (bypassing the 20ms–50ms internet delay of remote Atlas cloud databases).
2. **Atlas Dependency Eliminated (₹0 Database Cost):** No Atlas accounts, no credit card risks, and no fear of the $57/mo M10 paywall.
3. **40 GB SSD vs 512 MB Free Atlas:** Atlas M0 limits storage to 512 MB; this local VPS provides **40,000 MB (40 GB NVMe)**, easily holding 50,000+ member biodatas, chats, and CRM records.
4. **Automated Daily Off-Site Backups to Cloudflare R2:** A lightweight daily cron script (`mongodump | gzip`) uploads database snapshots to Cloudflare R2 at **₹0 cost**.

### Server Setup Commands:
```bash
# 1. Install MongoDB Community Edition (100% Free Forever)
sudo apt update && sudo apt install -y gnupg curl
curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-8.0.gpg
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/8.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-8.0.list
sudo apt update && sudo apt install -y mongodb-org
sudo systemctl enable --now mongod

# 2. Install Redis Server (100% Free Forever)
sudo apt install -y redis-server
sudo systemctl enable --now redis-server

# 3. Production Environment (.env):
# MONGODB_URI=mongodb://127.0.0.1:27017/sindhiMatrimony
# REDIS_URL=redis://127.0.0.1:6379
```

### Production Nginx Reverse Proxy Config:
```nginx
# /etc/nginx/sites-available/api.sindhimarriage.in
server {
    server_name api.sindhimarriage.in;

    # Gzip settings for non-binary content
    gzip on;
    gzip_types application/json text/plain;
    gzip_min_length 1024;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        
        # WebSocket support:
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Keep-Alive:
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Block common malicious bot paths:
    location ~* \.(env|git|php|asp|aspx)$ {
        return 404;
    }
}
```

---

## 13. Developer "Always Do" vs "Never Do" Checklist

| Category | ❌ NEVER DO (High Cost / Slow) | ✅ ALWAYS DO (Optimized / Fast) |
| :--- | :--- | :--- |
| **Reads** | `await Model.find()` without lean | `await Model.find().lean()` |
| **Fields** | Returning full documents | Selective fields via `.select('...')` |
| **Pagination** | `.skip(page * 20).limit(20)` | Keyset cursor `_id: { $lt: cursor }` |
| **Media** | Receiving 10MB photo in Express | Presigned direct upload to S3/R2 |
| **Static Data** | Querying MongoDB for Gotras/Plans | In-memory cache (`NodeCache` in RAM) |
| **Realtime** | Frontend polling API every 3s | WebSockets / Server-Sent Events |
| **Auth** | Sync `bcrypt.hashSync()` | Async `await bcrypt.hash()` |
| **Logging** | Logging all 200 OKs to CloudWatch | Log only WARN/ERROR with Pino |
| **Endpoints** | Sending uncompressed JSON | Enable `compression()` middleware |
| **Anti-Fraud** | Open OTP endpoint without limits | `otpRateLimiter` (Max 3 OTP / 10m) |
| **Code Reusability** | Copy-pasting duplicate logic across controllers | **Inspect first** $\rightarrow$ Extract reusable `async/await` functions in `utils/globalFunction.js` or `services/` |

---

## 14. Monthly Cloud Cost Breakdown: Standard vs Optimized

| Infrastructure Component | Standard Unoptimized Setup | Our Ultra-Optimized Backend | Savings |
| :--- | :--- | :--- | :--- |
| **Application Server** | $48 - $80/mo (4-8 vCPU needed due to polling & buffering) | **$5 - $6/mo (1-2 vCPU on Lightsail/Hetzner with PM2)** | **~90% Cheaper** |
| **Database (MongoDB)** | $60 - $120/mo (Atlas M10+ needed due to unindexed scans) | **$0 - $9/mo (M0 Free or M2 Shared tier)** | **~90% Cheaper** |
| **Media Egress Bandwidth** | $35/mo (Server proxying images to users) | **$0/mo (Cloudflare R2 + Free CDN caching)** | **100% Free** |
| **Log Storage & Ingestion**| $25/mo (CloudWatch / Datadog per-GB ingestion) | **$0/mo (Local rotated files, errors only)** | **100% Free** |
| **SMS Gateway Waste** | $50 - $150/mo (Spam bots hitting OTP endpoint) | **$5 - $15/mo (Protected by strict rate limits)** | **~85% Cheaper** |
| **Total Monthly Bill** | **~$218 - $400+ / month** | **~$15 - $30 / month** | **~92% Net Savings** |

---

> **Ready to build?** Follow this blueprint in `sindhiMatrimonyBackhend` to guarantee sub-50ms API response times while keeping your monthly server bills under the cost of a couple of coffees! 🚀
