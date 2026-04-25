const http = require('http');

const METRICS_URL = 'http://localhost:3000/metrics';

// thresholds
const MAX_ERROR_RATE = 0.3; // 30%
const MAX_LATENCY = 1.5;    // seconds

http.get(METRICS_URL, (res) => {
  let data = '';

  res.on('data', chunk => data += chunk);
  res.on('end', () => {

    let total = 0;
    let errors = 0;

    const lines = data.split('\n');

    lines.forEach(line => {
      if (line.includes('http_requests_total')) {
        const match = line.match(/status="(\d+)".*\s(\d+)/);

        if (match) {
          const status = parseInt(match[1]);
          const count = parseInt(match[2]);

          total += count;

          if (status >= 500) {
            errors += count;
          }
        }
      }
    });

    const errorRate = total > 0 ? errors / total : 0;

    console.log(`Total Requests: ${total}`);
    console.log(`Errors: ${errors}`);
    console.log(`Error Rate: ${errorRate}`);

    if (errorRate > MAX_ERROR_RATE) {
      console.error('❌ Quality Gate Failed: Error rate too high');
      process.exit(1);
    }

    console.log('✅ Quality Gate Passed');
    process.exit(0);
  });

}).on('error', (err) => {
  console.error('Failed to fetch metrics', err);
  process.exit(1);
});