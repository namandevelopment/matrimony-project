# Database Connection & Login Troubleshooting Guide

## 1. Problem Summary
When calling `POST /api/v1/auth/login`, the API returned:
```json
{
  "message": "Database service is currently unavailable. Please ensure database connection is established.",
  "code": 1503,
  "error": true,
  "data": null
}
```

## 2. Root Cause Analysis
1. **Disconnected Database vs Missing User**:
   - **Error 1503 (`SERVICE_UNAVAILABLE`)**: Thrown when Mongoose has no active connection (`readyState !== 1`) and queries fail fast due to `bufferCommands = false`.
   - **Error 1404 (`NOT_FOUND`)**: Thrown only after database is connected and `User.findOne(...)` confirms no account matches the mobile number.
2. **MongoDB Connection String Format**:
   - Raw shard replica-set URI previously in `.env` failed SSL handshake / DNS resolution.
   - Local MongoDB daemon (`127.0.0.1:27017`) was not installed/running locally.
3. **Stale Process Environment**:
   - A long-running `nodemon` process cached old environment variables in memory, requiring a clean process restart.

## 3. Resolution Steps Applied
1. **Updated `.env` with Atlas SRV URI**:
   ```env
   DB_STRING=mongodb+srv://namandevelopment_db_user:j1OAW2teTXxgJpf0@cluster0.lya73ao.mongodb.net/sindhi_matrimony?retryWrites=true&w=majority
   ```
2. **Synchronized `models/connection.js`**:
   - Updated the Atlas fallback connection string to the identical SRV URI.
3. **Killed Stale Processes & Restarted Daemon**:
   - Terminated cached background node/nodemon instances.
   - Started clean dev server on port 5001.

## 4. Verification
- **Database Status**: MongoDB connected in ~366ms (`readyState: 1`).
- **Endpoint Test**: `POST /api/v1/auth/login` now executes database queries properly and returns `1404` ("No registered account found with this mobile number. Please register first.").

