# 🗄️ Models Layer — Database Schemas & Connections

## 📌 Overview
Mongoose 8 based schemas jo MongoDB database collections ko represent karte hain.

## 🎯 Core Principles & Rules
1. **Connection Pool (`connection.js`)**:
   - MongoDB connection pool configuration with auto-reconnect, keepAlive, aur index build monitoring.
2. **Master Barrel Exporter (`index.js`)**:
   - Sabhi models ko centrally export karta hai taaki imports clean aur maintainable rahein.
3. **Compound Indexes**:
   - High-frequency query patterns par compound indexes (e.g. `{ isDeleted: 1, status: 1, createdAt: -1 }`).
4. **Soft Deletes**:
   - Kisi bhi customer ya critical record ko hard delete nahi karte; `isDeleted: { type: Boolean, default: false }` use hota hai.
5. **Timestamps**:
   - Har schema me `{ timestamps: true }` enable rehta hai.
