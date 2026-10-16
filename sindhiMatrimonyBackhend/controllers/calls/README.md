# 📞 Controllers: Telephony & Calls (`controllers/calls/`)

## 🎯 Kaam aur Zimmedari (Work & Responsibilities)
CRM telecallers ke liye Exotel Click-to-Call integration aur call records ka management.

## 📄 Expected Files
- `index.js`: Module barrel exporter.
- `admin.js`: Click-to-call initiate karna, call disposition submit karna, recordings fetch karna.

## ⚙️ Key Actions & Flows
1. **Click-to-Call Trigger**:
   - Agent CRM me "Call Candidate" click karta hai.
   - Controller `serviceTelephony.initiateCall(agentPhone, customerPhone)` call karta hai.
   - Bridge connection setup hone par CallLog document create hota hai.
2. **Call Disposition & Notes**:
   - Call khatam hone ke baad agent status daalta hai: `INTERESTED`, `NOT_REACHABLE`, `CALL_BACK`, `WRONG_NUMBER`.
   - Next follow-up datetime set hone par automatically ek `FollowUpTask` create ho jata hai.
