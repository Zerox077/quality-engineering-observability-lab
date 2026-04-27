const express = require("express");
const app = express();
const logger = require("./logger");

const {
  httpRequestCounter,
  httpRequestDuration,
  securityEvents,
  register,
} = require("./metrics");

app.use(express.json());

/* -----------------------------
   LOGGING MIDDLEWARE
------------------------------*/
app.use((req, res, next) => {
  logger.info({
    method: req.method,
    url: req.url,
  });
  next();
});

/* -----------------------------
   CHAOS ENGINEERING LAYER
------------------------------*/
function simulateChaos(req, res, next) {
  const mode = req.query.chaos;
  const attack = req.query.attack;

  let delay = 0;
  let fail = false;

  switch (mode) {
    case "latency":
      delay = 2000;
      break;

    case "error":
      fail = true;
      break;

    case "random":
      delay = Math.random() * 1200;
      fail = Math.random() < 0.3;
      break;
  }

  // Security simulation tracking
  if (attack) {
    securityEvents.inc({ type: attack });
  }

  setTimeout(() => {
    if (fail) {
      return res.status(500).json({
        error: "Chaos injected failure",
      });
    }
    next();
  }, delay);
}

/* -----------------------------
   METRICS MIDDLEWARE
------------------------------*/
function getRouteName(req) {
  return req.route?.path || req.path;
}

app.use((req, res, next) => {
  const start = process.hrtime();

  res.on("finish", () => {
    const diff = process.hrtime(start);
    const duration = diff[0] + diff[1] / 1e9;

    const route = getRouteName(req);

    httpRequestCounter.inc({
      method: req.method,
      route,
      status: res.statusCode,
    });

    httpRequestDuration.observe(
      {
        method: req.method,
        route,
        status: res.statusCode,
      },
      duration,
    );
  });

  next();
});

/* -----------------------------
   ROUTES
------------------------------*/
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

app.get("/products", simulateChaos, (req, res) => {
  logger.info("GET /products executed");

  res.json([
    { id: 1, name: "Laptop" },
    { id: 2, name: "Phone" },
  ]);
});

app.post("/orders", simulateChaos, (req, res) => {
  logger.info("POST /orders executed");

  res.json({ message: "Order placed successfully" });
});

/* -----------------------------
   METRICS ENDPOINT
------------------------------*/
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  const metrics = await register.metrics();
  res.send(metrics);
});

/* -----------------------------
   START SERVER
------------------------------*/
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
