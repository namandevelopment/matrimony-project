# 💬 Controllers: Chat & Messaging (`controllers/chat/`)

## 🎯 Kaam aur Zimmedari (Work & Responsibilities)
Staff internal team chat aur candidates ke aapas ke real-time chat history ka HTTP controller layer.

## 📄 Expected Files
- `index.js`: Module barrel exporter.
- `admin.js`: CRM staff internal channels, task discussion threads, chat moderation.
- `users.js`: Member conversation list, chat message pagination, mark as read, block member in chat.

## ⚙️ Key Actions & Flows
1. **Candidate-to-Candidate Chat**:
   - Sirf un candidates ke beech chat allow hoti hai jinka mutual interest `ACCEPTED` ho aur valid subscription ho.
   - Chat history cursor pagination ke sath return hoti hai (`lastMessageId` based).
2. **Staff Team Chat**:
   - Matchmakers aur Telecallers customer profiles par internal discussion kar sakte hain.
