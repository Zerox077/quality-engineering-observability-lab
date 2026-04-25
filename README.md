## ⚡ Observability-Driven QA System

This project demonstrates how QA evolves into **system reliability engineering**.

Instead of only verifying functionality, it:

- Injects controlled failures (chaos engineering)
- Measures system behavior (metrics + logs)
- Applies quality gates based on real-time system health
- Simulates a CI/CD pipeline decision flow

### 🔄 Pipeline Flow

Code → API Tests → E2E → Chaos → Metrics → Quality Gate → PASS/FAIL

[Client] → [Backend API]
              ↓
     [Chaos Injection Layer]
              ↓
   [Metrics + Logging Layer]
              ↓
        [Quality Gate]
              ↓
          PASS / FAIL