## 🧠 Project Purpose

This project demonstrates the evolution of a traditional QA engineer into an **observability-driven quality engineer**.

Instead of focusing only on functional correctness, this system validates:

- how the system behaves under failure conditions
- how performance degrades under load
- how security events can be detected via telemetry
- how quality decisions can be made using real-time metrics

---

## 🎯 Problem Statement

In most systems, testing stops after functional validation.

This creates blind spots:

- ❌ No visibility into runtime failures
- ❌ No understanding of system behavior under stress
- ❌ No linkage between testing and production reliability

---

## 💡 Solution Approach

This project introduces a **Shift-Right testing strategy** using:

- Observability (metrics + logs)
- Chaos engineering (failure injection)
- Runtime validation using real system signals

---

## 🧪 What This Project Simulates

A production-like system where:

- APIs are tested under normal and failure conditions
- faults are intentionally injected (latency, errors)
- system behavior is measured using Prometheus metrics
- dashboards visualize real-time system health
- quality decisions can be made based on metrics

---

## 🔍 Key Engineering Concepts

- Observability-driven testing
- Chaos engineering basics
- Metrics-based quality gates
- Shift-left + Shift-right testing integration
- Security signal simulation

---

## 🧠 Why This Matters

Modern QA roles are evolving toward:

- Site Reliability Engineering (SRE)
- DevSecOps
- Observability engineering

This project reflects that transition by combining:

testing + monitoring + reliability + security

## 🏗️ Architecture Explanation

1. **Client / Test Layer**
   - Sends API requests (manual, curl, or automated tests)

2. **Backend API (Node.js + Express)**
   - Handles requests
   - Injects chaos (latency, failures)
   - Logs events
   - Generates metrics

3. **Metrics Layer**
   - Exposes `/metrics` endpoint
   - Tracks request count, latency, and security events

4. **Prometheus**
   - Scrapes metrics at regular intervals
   - Stores time-series data

5. **Grafana**
   - Visualizes system behavior
   - Displays latency, error rate, and security signals

6. **Quality Gate (Conceptual Layer)**
   - Evaluates system health
   - Determines PASS / FAIL conditions

---

## 📊 Observability Metrics

- `http_requests_total` → request count
- `http_request_duration_seconds` → latency tracking
- `security_events_total` → attack simulation tracking

## 📊 Observability in Action

The system exposes the following key metrics:

- `http_requests_total` → request volume and distribution
- `http_request_duration_seconds` → latency tracking
- `security_events_total` → simulated attack detection

These metrics allow:

- identifying latency spikes during chaos injection
- detecting increased error rates
- tracking simulated attack patterns

---

## 🔐 Security Simulation

The system includes basic security signal simulation:

- scan attacks
- injection attempts
- traffic flooding

These are tracked via metrics and can be visualized in dashboards.

This demonstrates how QA can contribute to **security observability**.

## 💼 Skills Demonstrated

- Advanced API testing
- Observability implementation (Prometheus + Grafana)
- Chaos engineering basics
- Metrics design and instrumentation
- System-level thinking
- Backend instrumentation (Node.js)

## 🧪 Running the Project

### 1. Start backend

```bash
npm install
npm run dev
```
