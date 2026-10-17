# 🛡️ AegisLoad Studio - Standalone Universal Load Testing & Cyber Attack Defense Portal

A dedicated, standalone workspace module built for high-concurrency stress testing, multi-project API benchmarking, and cyber attack simulation.

---

## 📁 Architecture & Workspace Structure

```
Matrimony Project/
├── sindhiMatrimony/          # Mobile React Native Application
├── sindhiMatrimonyBackhend/  # Express REST API Backend
├── sindhiMatrimonyUserPanel/ # User Web Frontend
├── sindiMatrimonyAdmin/      # Admin Operations Web Panel
└── loadTestingPortal/        # 🚀 Standalone Universal Load Testing & Security Portal
    ├── public/
    │   └── index.html        # Responsive Glassmorphic Dark Dashboard
    ├── engine.js             # High-Throughput Socket-Pooled Load Engine
    ├── server.js             # Express Server with SSE & Email Dispatcher
    ├── package.json          # Independent Dependencies
    └── README.md
```

---

## ⚡ Quick Start

Inside the `loadTestingPortal` directory:

```bash
cd loadTestingPortal
npm install
npm start
```

Open your browser at:
👉 **[http://localhost:5050](http://localhost:5050)**

---

## 🌟 Key Capabilities

1. **Multi-Project Target Switching**:
   - **Sindhi Matrimony Platform**: In-memory direct Express route benchmarking (OTP, Login, Register, Profiles, Health).
   - **Rider App / Cab CRM**: Fleet API benchmarks.
   - **Custom Target API**: Test any URL (`https://api.myproject.com`), custom method (`GET`, `POST`, `PUT`, `DELETE`), custom headers (`Bearer Token`), and dynamic interpolated payloads (`{{index}}`, `{{phone}}`, `{{timestamp}}`).

2. **Attack Simulation Modes**:
   - **Steady Load**: 100 parallel workers standard high-traffic simulation.
   - **Spike Flood**: 250 parallel workers instant crowd surge.
   - **DDoS 429 Rate-Limit**: Single IP flood to verify sub-millisecond HTTP 429 response guards.
   - **Endurance Soak**: Continuous sustained stress to detect V8 memory leaks and event loop lag.

3. **Metrics & Percentiles**:
   - Real-time SSE progress & speedometer (RPS).
   - Min, Mean, P50 (Median SLA), P90, P95 (Production SLA), P99 (Tail Latency), and Max response latencies.
   - V8 Heap Delta and RSS memory consumption profiling.
   - Status codes breakdown (`200 OK`, `429 Rate Limited`, `422`, `500`).

4. **Executive Email Reports**:
   - One-click dispatch of audit scorecards to any email address.
   - JSON export and copy to clipboard.

5. **Engineer Mobile Login**:
   - Mobile number session authentication to tag benchmark logs.

6. **Knowledge Hub & Cyber Attacks**:
   - Deep dive architectural guides explaining Layer 7 HTTP floods, OTP drainage attacks, MongoDB write locking, and event loop starvation.
