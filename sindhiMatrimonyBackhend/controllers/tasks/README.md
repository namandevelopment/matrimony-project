# 📅 Controllers: Staff Tasks (`controllers/tasks/`)

## 🎯 Kaam aur Zimmedari (Work & Responsibilities)
CRM Telecallers aur Matchmakers ke daily follow-up schedule ka management.

## 📄 Expected Files
- `index.js`: Module barrel exporter.
- `admin.js`: Create task, mark complete, reschedule, view today's agenda, reassign tasks.

## ⚙️ Key Actions & Flows
1. **Task Lifecycle**:
   - `PENDING` -> `DUE_TODAY` -> `COMPLETED` / `OVERDUE`.
2. **Automated Reminders**:
   - Follow-up time aane par CRM dashboard par browser notification aur alert aana.
