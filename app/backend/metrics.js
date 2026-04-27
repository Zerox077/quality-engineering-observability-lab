const client = require("prom-client");

// Collect default system metrics (CPU, memory, etc.)
client.collectDefaultMetrics();

// -----------------------------
// HTTP REQUEST COUNTER
// -----------------------------
const httpRequestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status"],
});

// -----------------------------
// LATENCY HISTOGRAM
// -----------------------------
const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status"],
  buckets: [0.1, 0.5, 1, 2, 5],
});

// -----------------------------
// SECURITY EVENTS (NEW)
// -----------------------------
const securityEvents = new client.Counter({
  name: "security_events_total",
  help: "Number of simulated security events",
  labelNames: ["type"],
});

// -----------------------------
// EXPORTS
// -----------------------------
module.exports = {
  httpRequestCounter,
  httpRequestDuration,
  securityEvents,
  register: client.register,
};
