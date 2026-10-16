# ⚡ Socket Layer — Real-Time WebSocket Communication

## 📌 Overview
Socket.IO architecture jo instant, bi-directional communication provide karta hai Mobile App, Web Portal, aur Admin CRM ke beech.

## 📄 Key Socket Modules & Responsibilities
1. **`socket.js`**:
   - Socket.IO server initialization, CORS policy, JWT authentication handshake, aur room joins (`user_<id>`, `agent_<id>`, `admin_broadcast`).
2. **`userChatSocket.js`**:
   - Candidate-to-candidate 1-on-1 instant messaging, typing indicators, message delivered & read receipts.
3. **`teamChatSocket.js`**:
   - CRM staff internal chat channels, lead discussions, @mentions.
4. **`notificationSocket.js`**:
   - Real-time admin alerts for new lead arrivals, SLA breaches (>60 mins uncalled), new KYC verification submissions.
5. **`callSocket.js`**:
   - Real-time telephony status (ringing, connected, ended) aur telecaller screen popups.
