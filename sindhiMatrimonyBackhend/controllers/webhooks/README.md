# 🪝 Controllers: Webhooks (`controllers/webhooks/`)

## 🎯 Kaam aur Zimmedari (Work & Responsibilities)
External payment gateways aur VoIP telephony providers ke incoming webhooks ko process karna.

## 📄 Expected Files
- `index.js`: Module barrel exporter.
- `razorpay.js`: Razorpay payment.captured, payment.failed, refund.processed webhook events.
- `exotel.js`: Exotel call complete, duration, recording URL availability events.

## ⚙️ Key Actions & Flows
1. **HMAC Signature Verification**:
   - Raw webhook payload aur provider signature ko verify karna.
2. **Idempotent Processing**:
   - Webhook event ID check karna taaki duplicate events double-process na hon.
