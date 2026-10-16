# ⚙️ Worker Layer — Background Processors & Schedulers

## 📌 Overview
Worker process ek independent background service hai jo API server ke performance ko slow kiye bina heavy operations execute karta hai.

## 📄 Submodules
1. **`cacheSettings/`**: Server boot hone par master dropdown data ko Redis me preload karta hai.
2. **`redisListeners/`**: Key expiration events aur pub/sub channels ko listen karta hai.
3. **`schedulers/`**: Scheduled node-cron jobs jo specific samay par trigger hote hain.
