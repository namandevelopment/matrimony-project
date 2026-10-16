# 💍 Controllers: Matchmaking Engine (`controllers/matchmaking/`)

## 🎯 Kaam aur Zimmedari (Work & Responsibilities)
Automated compatibility recommendations aur Assisted matchmaker proposal clearinghouse.

## 📄 Expected Files
- `index.js`: Module barrel exporter.
- `admin.js`: Matchmaker assisted proposals send karna, candidate pairing review, recommendation approval.
- `users.js`: Daily recommendations feed, Send Interest, Accept Interest, Decline, Shortlist.

## ⚙️ Key Actions & Flows
1. **Automated Recommendations**:
   - Partner preferences (Age, Height, Subcaste, Education, City, Income, Manglik) ke basis par compatibility percentage score calculate karna.
2. **Interest Clearinghouse**:
   - Member A Member B ko interest bhejta hai.
   - In-app notification, Push notification aur WhatsApp alert dispatch hota hai.
   - Member B Accept ya Decline kar sakta hai.
