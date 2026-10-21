# 🔐 Sindhi Matrimony - Comprehensive System Credentials

> **Project Root Documentation**: Valid login accounts, passwords, test profiles, roles, and developer master OTPs across **Admin CRM Panel**, **User Web Panel**, and **React Native Mobile App**.

---

## ⚡ Master Cheat Sheet (Quick Reference)

| # | Application | Role / Persona | Identifier (Email / Phone) | Password | 2FA / OTP |
|---|:---|:---|:---|:---|:---|
| 1 | **Admin Panel** | **Super Admin** | `admin@sindhimarriage.in` | `Admin@1234` | `1234` |
| 2 | **Admin Panel** | Executive Director | `rajesh.m@sindhimarriage.in` | `Admin@1234` | `1234` |
| 3 | **Admin Panel** | Operations Head (Admin) | `kavita.c@sindhimarriage.in` | `Admin@1234` | `1234` |
| 4 | **Admin Panel** | Senior Matchmaking Lead (CRM) | `priya.s@sindhimarriage.in` | `Admin@1234` | `1234` |
| 5 | **Admin Panel** | Relationship Manager / Agent | `amit.b@sindhimarriage.in` | `Admin@1234` | `1234` |
| 6 | **Admin Panel** | KYC & Verification Moderator | `meena.a@sindhimarriage.in` | `Admin@1234` | `1234` |
| 7 | **User Web / Mobile** | Primary Candidate (Male, Amil) | `9829012345` | `Password123@` | `1234` |
| 8 | **User Web / Mobile** | Seeded Candidates Pool (150+) | `98290XXXXX` | `Password123@` | `1234` |
| 9 | **User Web / Mobile** | New User Registration (Any No.) | e.g. `9876543210` | Set your own | `1234` |

---

## 🔑 Universal Developer Master OTP (4 Digits)

- **Standard Length:** Strictly **4 Digits** (`1234`).
- **Applicable Flows:**
  - Admin Login 2FA / MFA Prompt (`/api/v1/auth/admin/verify-mfa`)
  - User Panel Registration OTP (`/api/v1/auth/verify-otp`)
  - Mobile App Instant OTP Login (`ValidateOTPScreen`)
  - Password Reset / Forgot Password OTP
- **Dev Master Code:** **`1234`** *(Development environment me hamesha valid hai)*.

---

## 1. 🛡️ Admin & CRM Panel (`sindiMatrimonyAdmin`)

**Login URL / Route:** `/login`  
**API Endpoint:** `POST /api/v1/auth/admin/login`

### 1.1 Super Administrator (Full Clearance)
- **Email:** `admin@sindhimarriage.in`
- **Password:** `Admin@1234`
- **2FA OTP:** `1234` *(agar 2FA prompt aaye)*
- **Role Code:** `SUPER_ADMIN`
- **Department:** Executive Management
- **Record Scope:** `ALL` (Access to all 21 modules: Dashboard, Leads, Members, KYC Verifications, Finance, Plans, Employees, Settings, Master Data)

### 1.2 Managing Director (Super Admin)
- **Name:** Rajesh Mulchandani
- **Email:** `rajesh.m@sindhimarriage.in`
- **Password:** `Admin@1234`
- **Role:** `SUPER_ADMIN`
- **Record Scope:** `ALL`

### 1.3 Operations Head (Admin)
- **Name:** Kavita Chhabria
- **Email:** `kavita.c@sindhimarriage.in`
- **Password:** `Admin@1234`
- **Role:** `ADMIN`
- **Record Scope:** `ALL` *(All modules except Master System Configurations)*

### 1.4 Senior Matchmaking Lead (CRM Manager)
- **Name:** Priya Sharma
- **Email:** `priya.s@sindhimarriage.in`
- **Password:** `Admin@1234`
- **Role:** `CRM_MANAGER`
- **Record Scope:** `TEAM` (Assigned leads, team tasks, team chats, member directory)

### 1.5 Relationship Manager / Telecaller
- **Name:** Amit Bajaj
- **Email:** `amit.b@sindhimarriage.in`
- **Password:** `Admin@1234`
- **Role:** `CRM_AGENT`
- **Record Scope:** `OWN` (Sirf unhi leads aur tasks ko access kar sakta hai jo ise assign hain)

### 1.6 KYC & Trust Safety Moderator
- **Name:** Meena Advani
- **Email:** `meena.a@sindhimarriage.in`
- **Password:** `Admin@1234`
- **Role:** `MODERATOR`
- **Record Scope:** `ALL` (Verifications queue, ID proof reviews, KYC approve/reject)

---

## 2. 💻 User Web Panel (`sindhiMatrimonyUserPanel`)

**Login Method:** Click **"Login"** button on Header / Hero Banner  
**API Endpoint:** `POST /api/v1/auth/login`

### 2.1 Default Registered Candidate (Rohan Advani)
- **Mobile Number / Identifier:** `9829012345`
- **Password:** `Password123@`
- **Profile Name:** Rohan Advani
- **Gender:** Male (Age: 28)
- **Subcaste:** Amil | **Gotra:** Advani
- **Status:** Active & KYC Verified

### 2.2 New User Self-Registration
1. Landing page par **"Register Free"** par click karein.
2. Apna 10-digit mobile number daalein (e.g. `9811122233`).
3. **Send OTP** click karein.
4. **4-Digit OTP** daalein: **`1234`**.
5. Password set karein (e.g. `Password123@`) aur biodata form complete karein.

---

## 3. 📱 Mobile App (`sindhiMatrimony` - React Native)

The mobile app supports two authentication paths:

### 3.1 Flow A: Mobile Number + Password Login (`LoginWithPassword`)
- **Screen:** `LoginWithPassword`
- **Mobile Number:** `9829012345`
- **Password:** `Password123@`
- **Platform Header:** `MOBILE`
- **Result:** Successfully authenticates and navigates to `BottomTab` feed.

### 3.2 Flow B: Fast OTP Login (`LoginScreen` -> `ValidateOTPScreen`)
- **Screen:** `LoginScreen`
- **Mobile Number:** `9829012345` (or any valid 10-digit number)
- **Dial Code:** `+91`
- **Press:** "Get OTP"
- **Screen:** `ValidateOTPScreen` (4-digit input box)
- **OTP Code:** **`1234`**
- **Result:** Auto-verifies and navigates to `BottomTab`.

---

## 4. 🧪 Candidate Pool for Matchmaking & Search Tests

Seeder pool me multiple profiles hain jinko testing ke liye use kar sakte hain:

| Mobile Number | Default Password | Candidate Name | Gender | Subcaste | Tier |
|:---|:---|:---|:---|:---|:---|
| `9829012345` | `Password123@` | Rohan Advani | Male | Amil | Free |
| `9829000001` | `Password123@` | Simran Vazirani | Female | Bhaiband | Gold |
| `9829000002` | `Password123@` | Varun Chhabria | Male | Larkana | Silver |
| `9829000003` | `Password123@` | Pooja Mulchandani | Female | Sahiti | Diamond |
| `9829000004` | `Password123@` | Deepak Khubchandani | Male | Shikarpuri | Free |
| `9829000005` | `Password123@` | Neha Bathija | Female | Sakhar | Gold |

*(Note: All seeded candidates use standard phone pattern `98290` + 5 digits with password `Password123@`)*

---

## 5. 🔌 Backend API Verification Commands

### Test Super Admin Login (curl):
```bash
curl -X POST http://localhost:8000/api/v1/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sindhimarriage.in","password":"Admin@1234"}'
```

### Test User / Mobile Login (curl):
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"9829012345","password":"Password123@","clientPlatform":"WEB"}'
```

### Test 4-Digit OTP Verification (curl):
```bash
curl -X POST http://localhost:8000/api/v1/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone":"9829012345","otp":"1234","purpose":"REGISTER"}'
```

---

## 6. 🔄 Database Re-seeding (If Reset Needed)

Agar MongoDB me fresh demo data populate karna ho:
```bash
cd sindhiMatrimonyBackhend
npm run seed
```
Yeh command automatically Super Admin, Staff, 150+ Candidates, aur Membership Plans setup kar deti hai.
