# 🛠️ Controllers: System Diagnostics (`controllers/tools/`)

## 🎯 Kaam aur Zimmedari (Work & Responsibilities)
Super Admin ke technical diagnostic tools.

## 📄 Expected Files
- `index.js`: Module barrel exporter.
- `admin.js`: Redis memory stats, manual cache flush, MongoDB index health, maintenance mode trigger.

## ⚙️ Key Actions & Flows
1. **System Health Check**:
   - DB latency, Redis ping, Bull queue backlog count inspect karna.
2. **Cache Purge**:
   - Selected cache tags ko Redis se delete karna.
