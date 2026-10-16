# ⚙️ Services Layer — Business Logic & External Integrations

## 📌 Overview
Services backend ka core business logic execute karte hain. Controllers directly DB ya external APIs se coordinate karne ke bajaye Services ko call karte hain.

## 📄 Key Services & Responsibilities
1. **`crudService.js`**:
   - Universal High-Performance Query Engine.
   - Built-in pagination (Cursor & Offset), dynamic filtering, field projection, population, and mandatory `.lean()` optimization.
2. **`serviceRedis.js`**:
   - Redis connection, token blacklisting (`setWithExpiry`), master data caching, distributed locks.
3. **`serviceHoroscope.js`**:
   - Vedic Astrology Ashtakoota 36-Guna Kundli Milan calculator & Manglik Dosha detector.
4. **`serviceNotifications.js`**:
   - Multi-channel notification dispatcher: Firebase Cloud Messaging (FCM Push), MSG91 (SMS), aur WhatsApp Business API.
5. **`servicePayment.js`**:
   - Razorpay SDK integration: Order generation, HMAC signature verification, instant refunds.
6. **`serviceQueueBull.js` & `serviceQueueProcessor.js` & `serviceQueueWorker.js`**:
   - BullMQ asynchronous job queue architecture for background tasks (matchmaking batch, email alerts, notification blasts).
7. **`serviceTelephony.js`**:
   - Exotel VoIP API integration for click-to-call, IVR call flow, call recording synchronization.
8. **`serviceBiodata.js`**:
   - Puppeteer-based HTML-to-PDF biodata generator with memory safeguards (Single browser instance pool to avoid OOM).
9. **`serviceCronJobs.js` & `serviceGlobal.js`**:
   - Scheduled task orchestrator and aggregate cross-module queries.
