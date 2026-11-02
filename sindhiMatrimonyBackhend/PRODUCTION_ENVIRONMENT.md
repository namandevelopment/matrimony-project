# 🌐 Production Environment Configuration (`.env`)

Official production configuration for the **Sindhi Matrimony Backend** deployment.

```bash
# Application Environment
NODE_ENV=production
PORT=5001
IS_PRODUCTION=true
API_END_POINT_V1=/api/v1/
MAINTENANCE=false
RUN_BACKGROUND=false

# Database (MongoDB Atlas)
DB_STRING=mongodb://namandevelopment_db_user:j1OAW2teTXxgJpf0@ac-v8zcrtd-shard-00-00.lya73ao.mongodb.net:27017,ac-v8zcrtd-shard-00-01.lya73ao.mongodb.net:27017,ac-v8zcrtd-shard-00-02.lya73ao.mongodb.net:27017/sindhi_matrimony?ssl=true&replicaSet=atlas-nrtlxb-shard-0&authSource=admin

# Redis Cache & Queues (Upstash / Cloud Redis)
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT Secrets & Security
JWT_SECRET_KEY=sindhi_matrimony_jwt_super_secret_access_key_2026
REFRESH_JWT_SECRET_KEY=sindhi_matrimony_jwt_super_secret_refresh_key_2026
RESET_JWT_SECRET_KEY=sindhi_matrimony_jwt_super_secret_reset_key_2026
OTP_HMAC_SECRET=sindhi_matrimony_otp_hmac_secret_2026
JWT_EXPIRATION=86400
REFRESH_TOKEN_EXPIRATION=604800

# CORS Whitelist
ALLOWED_ORIGINS=https://sindhimarriage.in,https://www.sindhimarriage.in,https://admin.sindhimarriage.in,https://sindhi-matrimony-user-panel.vercel.app,https://sindi-matrimony-admin.vercel.app
ALLOW_THIRD_PARTY_API_CLIENTS=true

# Storage (AWS S3 / Cloudflare R2)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=ap-south-1
AWS_S3_BUCKET_NAME=sindhi-matrimony-assets
AWS_ENDPOINT_URL=
CDN_DOMAIN=

# Payment Gateway (Razorpay)
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

# Telephony (Exotel)
EXOTEL_SID=
EXOTEL_API_KEY=
EXOTEL_API_TOKEN=
EXOTEL_SUB_DOMAIN=api.exotel.com
EXOTEL_CALLER_ID=

# SMS & WhatsApp Gateway (MSG91)
MSG91_AUTH_KEY=
MSG91_SENDER_ID=SINDHI
MSG91_OTP_TEMPLATE_ID=

# Push Notifications (Firebase Admin)
FIREBASE_PROJECT_ID=sindhimarriage-eb382
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@sindhimarriage-eb382.iam.gserviceaccount.com
FIREBASE_SERVICE_ACCOUNT=./config/serviceAccountKey.json
```

---

## 🔒 Security & Service Guidelines
- **MongoDB Atlas Cluster:** Connects securely over SSL to `atlas-nrtlxb-shard-0`.
- **Firebase Push Integration:** Authenticates using `config/serviceAccountKey.json` for live FCM multi-cast push alerts.
- **Allowed Origins:** Restricts CORS requests to production web domains, Vercel deployments, and mobile user agents.

