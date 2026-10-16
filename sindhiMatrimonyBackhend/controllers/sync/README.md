# 🔄 Controllers: WatermelonDB Sync (`controllers/sync/`)

## 🎯 Kaam aur Zimmedari (Work & Responsibilities)
React Native mobile app ke offline-first WatermelonDB (SQLite) ke sath delta synchronization.

## 📄 Expected Files
- `index.js`: Module barrel exporter.
- `users.js`: Delta Pull (`GET /pull`) aur Delta Push (`POST /push`) handlers.

## ⚙️ Key Actions & Flows
1. **Delta Pull**:
   - Mobile app apna `lastPulledAt` timestamp bhejti hai.
   - Backend sirf wahi records bhejta hai jo us timestamp ke baad `created`, `updated`, ya `deleted` huye hain.
2. **Delta Push**:
   - Mobile app local offline changes backend par push karti hai jise backend conflict-free merge karta hai.
