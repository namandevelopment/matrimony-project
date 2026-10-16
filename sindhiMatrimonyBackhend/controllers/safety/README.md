# 🛡️ Controllers: Trust & Safety (`controllers/safety/`)

## 🎯 Kaam aur Zimmedari (Work & Responsibilities)
Platform trust, fraud prevention, member blocking, aur blacklist enforcement.

## 📄 Expected Files
- `index.js`: Module barrel exporter.
- `admin.js`: Abuse reports review karna, suspect accounts ko suspend karna, blacklist identity add karna.
- `users.js`: Suspect profile ko report karna, kisi member ko block karna.

## ⚙️ Key Actions & Flows
1. **Abuse Reporting**:
   - Fake profile, harassment, incorrect details ki report submit karna.
2. **Permanent Blacklist**:
   - Phone number, Email ya Aadhaar hash ko blacklisted identity me daalna taaki future me account create na ho sake.
