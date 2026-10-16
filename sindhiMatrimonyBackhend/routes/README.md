# 🛣️ Routes Layer — Express Endpoints & Access Control

## 📌 Overview
Routes incoming HTTP requests ko specific middlewares, Joi validators, aur controller handlers se bind karte hain.

## 🎯 Architecture & Segregation
1. **Master Router (`routes/index.js`)**:
   - Sabhi domain routers ko mount karta hai prefix `/api/v1` ke under.
2. **Role Segregated Route Files**:
   - Har module me `admin.js` (Admin CRM routes with RBAC) aur `users.js` (User Mobile/Web routes) alag hote hain.
3. **Execution Chain**:
   `Route -> jwt (auth) -> accessCheck (RBAC) -> validationMiddleware(schema) -> Controller Handler`
