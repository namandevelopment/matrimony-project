# 🛡️ Middlewares Layer — Security, Auth & Interceptors

## 📌 Overview
Middlewares Express pipeline me har request ko intercept karte hain: security headers lagana, JWT token check karna, RBAC permissions verify karna, request body validate karna, aur global errors handle karna.

---

## 📄 Expected Middleware Files & Unke Andar Banne Wale Core Functions

### 1. `jwt.js`
- **`jwtAuth()`**:
  - Express-JWT wrapper jo Bearer token ko RSA/Secret key se verify karta hai.
  - Isme ek open whitelist hoti hai jisme public routes bypass hote hain (e.g., `/api/v1/auth/users/send-otp`, `/api/v1/auth/users/verify-otp`, `/api/v1/common/dropdowns`, `/api/v1/plans/public-list`, aur Webhooks).

---

### 2. `commonMiddleware.js` (Multi-Purpose Helper Middlewares)
- **`verifyTokenInRedis(req, res, next)`**:
  - Check karta hai ki user ka active JWT token Redis ki revoked/blacklist list me toh nahi hai (Force logout enable karne ke liye).
- **`checkRolePermission(allowedRoles)`**:
  - Higher-order middleware factory jo check karta hai ki `req.auth.role` allowed array me hai ya nahi (e.g. `['SUPER_ADMIN', 'MATCHMAKER']`).
- **`mergeParamsToBody(req, res, next)`**:
  - URL route params (`req.params`, e.g. `:id`) aur query params (`req.query`) ko automatically `req.body` me merge karta hai taaki controllers aur Joi validators ko ek uniform payload mile.
- **`ipClientAdd(req, res, next)`**:
  - Request se real Client IP (`x-forwarded-for` proxy headers ke through) extract karta hai aur `geoip-lite` se country/city attach karta hai.

---

### 3. `accessCheckMiddleware.js` (Granular RBAC & Data Scope)
- **`accessCheck(screenId, action)`**:
  - Granular permissions check karta hai (e.g., `screen: 'leads'`, `action: 'create'` ya `'delete'`).
- **`injectRecordScope(req, res, next)`**:
  - Employee ke role aur branch ke according query filter inject karta hai:
    - `ALL`: Super Admin sabhi records dekh sakta hai.
    - `OWN`: Telecaller sirf apne assigned leads/tasks dekh sakta hai.
    - `BRANCH`: Manager apne city/branch ke records dekh sakta hai.

---

### 4. `maintenance.js`
- **`checkMaintenanceMode(req, res, next)`**:
  - Redis key `system:maintenance_mode` read karta hai.
  - Agar system maintenance me hai toh public users ko `503 Service Unavailable` deta hai (Super Admin bypass allowed rehta hai).

---

### 5. `CheckDisableUserMiddleware.js`
- **`checkUserStatus(req, res, next)`**:
  - Logged-in user ka current DB/Redis status check karta hai.
  - Agar account `SUSPENDED`, `DELETED`, ya `FROZEN` ho gaya ho toh user ka session foran terminate karke `403 Forbidden` return karta hai.

---

### 6. `validationMiddleware.js`
- **`validationMiddleware(schema)`**:
  - Joi schema validator runner jo incoming payload ko `utils/joiValidationDataType.js` rules ke against validate karta hai.
  - Validation fail hone par 422 Unprocessable Entity error trigger karta hai.

---

### 7. `errorHandler.js`
- **`globalErrorHandler(err, req, res, next)`**:
  - Centralized global error boundary jo sabhi types ke errors catch karke uniform standard JSON response (`apiHTTPResponse`) me return karta hai:
    - Mongoose `ValidationError` & `CastError` (Invalid ObjectId)
    - MongoDB Duplicate Key error (`code: 11000`)
    - Joi validation errors
    - JWT `UnauthorizedError` & token expiry
    - Unhandled internal 500 server errors

---

### 8. `socketAuthMiddleware.js`
- **`socketAuth(socket, next)`**:
  - Socket.IO connection handshake ke time JWT Bearer token verify karta hai aur socket session me `socket.user` attach karta hai.

---

### 9. Supporting / Additional Middlewares (Optional / Future-Proof)
- **`rateLimiter.js` (`rateLimitMiddleware`)**:
  - Sensitive endpoints (OTP send, login attempts, forgot password) par DDoS aur brute-force attack rokne ke liye per-IP request limit lagana.
- **`multerConfig.js` (`uploadMiddleware`)**:
  - KYC photo/selfie upload ke time file type (MIME check) aur max file size validate karna.
