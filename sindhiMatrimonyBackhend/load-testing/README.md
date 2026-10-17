# 🛡️ AegisLoad Studio - Universal Multi-Target Load & Security Benchmark Portal

> **Enterprise Real-Time Performance, Multi-Project Stress Testing & Cyber Attack Defense Simulator**  
> Test any project (Sindhi Matrimony, Cab/Rider CRM, Staging/Production) up to **500,000 Concurrent Requests** with real-time SSE telemetry, latency percentiles, attack simulations, email reports, and cyber defense diagnostics.

---

## ⚡ Quick Start

### 1. Launch the Studio Server
```bash
npm run load-studio
```
*(Runs on port **5050** using keep-alive socket pooling)*

### 2. Open in Any Browser
👉 **[http://localhost:5050](http://localhost:5050)**

---

## 🚀 Key Features

### 1. 🌐 Universal Multi-Project Testing
- **Sindhi Matrimony Platform**: Native direct in-memory Express benchmark covering Auth (OTP, Login, Register), Profiles, and Preferences.
- **Rider App / Cab CRM**: Preset test configurations for fleet and booking platforms.
- **Custom Project / External URL**: Enter any external HTTP/HTTPS URL, HTTP method (GET, POST, PUT, DELETE, PATCH), custom Bearer headers, and dynamic JSON payload templates with auto-incrementing variables:
  ```json
  {
    "userId": "{{index}}",
    "phone": "{{phone}}",
    "timestamp": "2026-10-17"
  }
  ```

### 2. 💣 Cyber Attack & Traffic Scenario Simulator
- **🟢 Steady Concurrent Load**: Simulates standard high-traffic production users (100 parallel workers).
- **⚡ Spike / Flash Crowd Flood**: Instant burst traffic (250 workers) simulating marketing push notification blasts.
- **🛡️ DDoS & Rate-Limit Stress**: Targeted flooding from a single IP to test whether your dual-layer rate limiters return HTTP 429 in `< 0.05ms`.
- **⏱️ Endurance Soak**: Sustained continuous throughput to detect Node.js event loop lag and memory leaks.

### 3. 📊 Deep Diagnostic Telemetry & Percentile SLA
- **Live Speedometer**: Real-time Requests Per Second (RPS) up to 25,000+ RPS.
- **Percentile Engine**: Min, Mean, **P50 (Median)**, P90, **P95 (Production SLA)**, **P99 (Tail Latency)**, and Max response times.
- **V8 Memory Profiler**: Measures exact Heap memory delta (MB) and RSS footprint.
- **Diagnostic Reasons**: Explains why requests succeeded (200 OK), were throttled (429 Rate Limit), or failed.
- **Live JSON Response Inspector**: Formatted code view with one-click **Copy JSON** and **Download Report** buttons.

### 4. 📧 Executive Email Reports & Audit History
- **Email Report Dispatch**: Enter any email to receive an executive benchmark scorecard and diagnostic audit report via `/api/reports/email`.
- **Historical Benchmark Runs (`History Tab`)**: Persistent log of all test runs in the session with instant email dispatch and export.

### 5. 📱 Mobile Engineer Session Login
- Authenticate QA Leads and DevOps engineers via mobile number to tag benchmark runs and audit logs.

### 6. 🛡️ Knowledge Hub & Cyber Attacks Reference Guide
Dedicated knowledge base tab covering:
- **Layer 7 Volumetric HTTP Floods & DDoS**
- **OTP Drain & SMS Gateway Billing Depletion**
- **Database Write Lock Cascades & Rule 4.4 Mitigation**
- **Node.js Single-Thread Event Loop Starvation**
- **Percentiles Explained (P50 vs P95 vs P99)**

---

## 🛠️ REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/load-test/stream` | Server-Sent Events (SSE) stream for live real-time progress |
| `POST` | `/api/load-test/abort` | Instantly abort any active running benchmark |
| `GET` | `/api/reports/history` | Fetch history of all benchmarks executed in this session |
| `POST` | `/api/reports/email` | Dispatch executive report to specified email address |
| `POST` | `/api/auth/engineer-login` | Authenticate engineer session via mobile number |
