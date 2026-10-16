# 🏷️ Controllers: Membership Plans (`controllers/plans/`)

## 🎯 Kaam aur Zimmedari (Work & Responsibilities)
Self-Service aur Assisted Membership packages ka control.

## 📄 Expected Files
- `index.js`: Module barrel exporter.
- `admin.js`: Package creation, price tiering, contact view credits, validity days, feature flags.
- `users.js`: Public active plans listing with discount tags.

## ⚙️ Key Actions & Flows
1. **Plan Tiers**:
   - Free (Browse only), Silver (15 Contacts), Gold (40 Contacts + Chat), Diamond Assisted (Dedicated Matchmaker).
2. **Dynamic Invalidation**:
   - Admin dwara plan price change hone par client side caching update karna.
