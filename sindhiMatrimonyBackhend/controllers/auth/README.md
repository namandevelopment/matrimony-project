# 🔐 Controllers: Authentication (`controllers/auth/`)

## 🎯 Kaam aur Zimmedari (Work & Responsibilities)
Authentication aur authorization se jude sabhi flows ko handle karna.

## 📄 Expected Files
- `index.js`: Module barrel exporter.
- `admin.js`: Admin CRM login, password verify, MFA TOTP setup & verification.
- `users.js`: Candidate mobile OTP login, registration, Google auth, refresh token, logout.

## ⚙️ Key Actions & Flows
1. **Admin Login (`admin.js`)**:
   - Email + Password validation.
   - Brute-force rate limiting check.
   - If MFA enabled -> Require 4-digit TOTP code.
   - Sign Access Token (15 min) + Refresh Token (7 days).
2. **User Login (`users.js`)**:
   - Mobile number input -> MSG91 OTP generation (or test OTP in dev).
   - OTP verify -> Agar naya user hai toh lead se member convert ya onboarding start.
   - Token creation with `role: 'USER'`.
3. **Logout & Blacklist**:
   - Active JWT token ko Redis blacklist me daalna (`logoutUtils.js`).
