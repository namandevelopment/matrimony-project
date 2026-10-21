# 🔐 Sindhi Matrimony - Valid User & Admin Credentials

A comprehensive reference guide of all pre-configured, valid accounts, roles, access levels, and developer master OTPs across the **Admin CRM Panel**, **User Web Panel**, **Mobile App**, and **Backend API**.

---

## ⚡ Quick Cheat Sheet (TL;DR)

| Platform | Role | Identifier (Email / Phone) | Password | 2FA / OTP |
| :--- | :--- | :--- | :--- | :--- |
| **Admin Panel** | **Super Admin** | `admin@sindhimarriage.in` | `Admin@1234` | `1234` |
| **Admin Panel** | Operations Head (Admin) | `kavita.c@sindhimarriage.in` | `Admin@1234` | `1234` |
| **Admin Panel** | CRM Manager | `priya.s@sindhimarriage.in` | `Admin@1234` | `1234` |
| **Admin Panel** | Relationship Manager | `amit.b@sindhimarriage.in` | `Admin@1234` | `1234` |
| **Admin Panel** | KYC Moderator | `meena.a@sindhimarriage.in` | `Admin@1234` | `1234` |
| **User Panel / App** | Test Candidate (Male) | `9829012345` | `Password123@` | `1234` |
| **User Panel / App** | Seeded Candidates | `98290XXXXX` | `Password123@` | `1234` |

> 💡 **Master Dev OTP:** Har jagah (Admin 2FA, User Registration, Forgot Password, Phone Verification) **4-digit OTP** strictly enforce hai. Development mode me master code **`1234`** hamesha valid hai.

---

## 1. 🛡️ Admin & CRM Panel Accounts

Yeh accounts **`sindiMatrimonyAdmin`** (Web Portal) ke login screen par kaam karte hain.

### 👑 Super Admin (Full System Access)
- **Email:** `admin@sindhimarriage.in`
- **Password:** `Admin@1234`
- **2FA OTP:** `1234` *(agar prompted ho)*
- **Role:** `SUPER_ADMIN`
- **Department:** Executive Management
- **Scope:** `ALL` (Access to all 21 modules: Leads, Members, Verifications, Finance, Plans, Employees, Settings, Master Data, etc.)

---

### 👔 Executive Director
- **Email:** `rajesh.m@sindhimarriage.in`
- **Password:** `Admin@1234`
- **2FA OTP:** `1234`
- **Role:** `SUPER_ADMIN`
- **Scope:** `ALL`

---

### 📋 Operations Head (Chief Operating Officer)
- **Email:** `kavita.c@sindhimarriage.in`
- **Password:** `Admin@1234`
- **Role:** `ADMIN`
- **Scope:** `ALL` *(All modules except Master System Settings)*

---

### 📞 Senior Matchmaking Lead (CRM Manager)
- **Email:** `priya.s@sindhimarriage.in`
- **Password:** `Admin@1234`
- **Role:** `CRM_MANAGER`
- **Scope:** `TEAM` (Assigned leads, team tasks, chats, member search, and matchmaking)

---

### 🤝 Relationship Manager / Telecaller
- **Email:** `amit.b@sindhimarriage.in`
- **Password:** `Admin@1234`
- **Role:** `CRM_AGENT`
- **Scope:** `OWN` (Sirf apne assigned leads aur tasks dekh sakta hai)

---

### 🔍 KYC & Trust Moderator
- **Email:** `meena.a@sindhimarriage.in`
- **Password:** `Admin@1234`
- **Role:** `MODERATOR`
- **Scope:** `ALL` (Pending ID proofs, selfie verifications, community checks approve/reject karne ke liye)

---

## 2. 👥 User Panel & Mobile App (Candidate Accounts)

Yeh accounts **`sindhiMatrimonyUserPanel`** aur React Native **`sindhiMatrimony`** mobile app par login karne ke liye hain.

### 🌟 Primary Test User (Rohan Advani)
- **Mobile Number:** `9829012345`
- **Password:** `Password123@`
- **Name:** Rohan Advani
- **Gender:** Male (Age 28)
- **Subcaste / Gotra:** Amil / Advani
- **Status:** Verified Active Profile, Never Married
- **Membership:** Free Tier (Upgradeable via payment test flow)

---

### 🌱 Seeded Candidate Pool (150+ Realistic Profiles)
Backend seeder se create kiye gaye candidates ka format:
- **Mobile Number Pattern:** `98290` + 5 digits (e.g. `9829000001`, `9829012345`)
- **Default Password:** `Password123@`
- **Subcastes Available:** Amil, Bhaiband, Larkana, Sahiti, Shikarpuri, Sakhar, Dadu, etc.
- **Verification Status:** KYC Verified with badges

---

### 📝 New User Registration & OTP Rules
Naya user register karte waqt:
1. **Phone Number:** Koi bhi valid 10-digit number enter karein (e.g., `9876543210`)
2. **Send OTP:** Click karein
3. **OTP Box:** 4-digit input aayega — Enter code: **`1234`**
4. Set Password (e.g., `Password123@`) aur profile onboarding complete karein.

---

## 3. 🌐 API Endpoints Quick Reference

### Admin Authentication
```http
POST /api/v1/auth/admin/login
Content-Type: application/json

{
  "email": "admin@sindhimarriage.in",
  "password": "Admin@1234"
}
```

#### Admin 2FA Verification (if MFA enabled)
```http
POST /api/v1/auth/admin/verify-mfa
Content-Type: application/json

{
  "email": "admin@sindhimarriage.in",
  "otp": "1234"
}
```

---

### Candidate / User Authentication
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "phone": "9829012345",
  "password": "Password123@",
  "clientPlatform": "WEB"
}
```

#### User Send OTP (Registration / Verification)
```http
POST /api/v1/auth/send-otp
Content-Type: application/json

{
  "phone": "9829012345",
  "purpose": "REGISTER"
}
```

#### User Verify OTP
```http
POST /api/v1/auth/verify-otp
Content-Type: application/json

{
  "phone": "9829012345",
  "otp": "1234",
  "purpose": "REGISTER"
}
```
