# ⏰ Worker: Scheduled Cron Jobs (`worker/schedulers/`)
- `dailyMatchScheduler.js`: Roz subah 08:00 AM IST par sabhi active members ke liye fresh 36-Gunas matches calculate karta hai.
- `taskOverdueScheduler.js`: Har ghante telecaller tasks check karke `DUE_TODAY` aur `OVERDUE` me shift karta hai.
- `slaEscalationScheduler.js`: 60 minute se bina call kiye pade naye leads ko supervisor ko escalate karta hai.
- `subscriptionExpiryScheduler.js`: Expired premium memberships ko automatically `FREE` tier par downgrade karta hai.
