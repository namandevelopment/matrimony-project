# 📊 Controllers: Admin Dashboard (`controllers/dashboard/`)

## 🎯 Kaam aur Zimmedari (Work & Responsibilities)
Super Admin aur Staff ke dashboard ke analytical charts, KPIs, aur action queues render karna.

## 📄 Expected Files
- `index.js`: Module barrel exporter.
- `admin.js`: High-level metrics, conversion funnels, daily revenue, active telecalling queues.

## ⚙️ Key Actions & Flows
1. **Live KPI Counters**:
   - Total Verified Members, Pending KYC Approvals, Today's Revenue, New Leads in last 24h.
2. **Action Queues**:
   - Urgent tasks due today, SLA breach alerts (leads untouched > 60 mins).
3. **Optimized Aggregation**:
   - Dashboard counters Redis me 5-minute pre-aggregated cache se serve hote hain taaki heavy DB scan na ho.
