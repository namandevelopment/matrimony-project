# 📢 Controllers: Marketing Campaigns (`controllers/campaigns/`)

## 🎯 Kaam aur Zimmedari (Work & Responsibilities)
App aur web par festive offers, in-app popups, SMS campaigns aur WhatsApp broadcasts chalana.

## 📄 Expected Files
- `index.js`: Module barrel exporter.
- `admin.js`: Campaign creation, target audience filter (e.g., Unpaid users registered > 7 days), scheduling, delivery analytics.
- `users.js`: Active popups aur banners fetch karna jo user ko display hone hain.

## ⚙️ Key Actions & Flows
1. **Admin Campaign Launcher**:
   - Title, message copy, deep-link URL, target criteria select karna.
   - Campaign execute hone par `BullMQ` queue me push notification jobs add karna.
2. **User Popup Ingestion**:
   - Mobile app open par `GET /api/v1/campaigns/active-popups` call hoti hai.
   - Redis cached active campaigns return hote hain jisse DB load zero rehta hai.
