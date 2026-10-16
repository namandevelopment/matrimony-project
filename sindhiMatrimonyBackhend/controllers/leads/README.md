# 🎯 Controllers: CRM Leads (`controllers/leads/`)

## 🎯 Kaam aur Zimmedari (Work & Responsibilities)
CRM Inbound/Outbound leads ka complete lifecycle handle karna.

## 📄 Expected Files
- `index.js`: Module barrel exporter.
- `admin.js`: Lead listing, bulk allocation, stage pipeline change, conversion to member.
- `users.js`: Public website enquiry form, Meta ads incoming lead intake.

## ⚙️ Key Actions & Flows
1. **Public Intake**:
   - Website ya campaign form se naye candidate ka lead submit hona.
   - Lead deduplication check (Phone & Email).
2. **Auto-Allocation Engine**:
   - Round-robin algorithm ke basis par available telecaller ko lead assign karna.
3. **Stage Transitions**:
   - `NEW` -> `CONTACTED` -> `INTERESTED` -> `DEMO_SCHEDULED` -> `CONVERTED` / `LOST`.
