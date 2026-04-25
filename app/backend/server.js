const express = require('express');
const app = express();
const logger = require('./logger');

app.use(express.json());

app.use((req, res, next) => {
  logger.info({
    method: req.method,
    url: req.url
  });

  next();
});

const {
  httpRequestCounter,
  httpRequestDuration,
  register
} = require('./metrics');

app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;

    httpRequestCounter.inc({
      method: req.method,
      route: req.route ? req.route.path : req.url,
      status: res.statusCode
    });

    httpRequestDuration.observe(
      {
        method: req.method,
        route: req.route ? req.route.path : req.url,
        status: res.statusCode
      },
      duration
    );
  });

  next();
});

// Simulate random delay + failure
function simulateChaos(req, res, next) {
  const chaosMode = req.query.chaos;

  let delay = 0;
  let fail = false;

  if (chaosMode === 'latency') {
    delay = 2000; // 2 seconds delay
  }

  if (chaosMode === 'error') {
    fail = true;
  }

  if (chaosMode === 'random') {
    delay = Math.random() * 1000;
    fail = Math.random() < 0.2;
  }

  setTimeout(() => {
    if (fail) {
      return res.status(500).json({ error: 'Injected failure' });
    }
    next();
  }, delay);
}

app.get('/health', (req, res) => {
    res.json({status: 'OK'});
});

app.get('/products', simulateChaos, (req, res) => {
  logger.info('GET /products executed');

  res.json([
    { id: 1, name: 'Laptop' },
    { id: 2, name: 'Phone' }
  ]);
});

app.post('/orders', simulateChaos, (req, res) => {
  logger.info('POST /orders executed');

  res.json({ message: 'Order placed successfully' });
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});



module.exports = app;