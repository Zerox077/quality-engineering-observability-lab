#!/bin/bash

echo "🚀 Starting Quality Pipeline..."

# Step 1: Start server in background
echo "🟢 Starting server..."
npm run dev &
SERVER_PID=$!

# Wait for server to start
sleep 3

# Step 2: Run API tests
echo "🧪 Running API tests..."
npm test
if [ $? -ne 0 ]; then
  echo "❌ API Tests Failed"
  kill $SERVER_PID
  exit 1
fi

# Step 3: Run E2E tests
echo "🌐 Running Cypress tests..."
npx cypress run
if [ $? -ne 0 ]; then
  echo "❌ E2E Tests Failed"
  kill $SERVER_PID
  exit 1
fi

# Step 4: Inject chaos (simulate failures)
echo "💥 Injecting chaos..."
curl "http://localhost:3000/products?chaos=error" > /dev/null
curl "http://localhost:3000/products?chaos=error" > /dev/null
curl "http://localhost:3000/products?chaos=latency" > /dev/null

# Step 5: Run quality gate
echo "📊 Checking system health..."
node scripts/checkMetrics.js
if [ $? -ne 0 ]; then
  echo "❌ Quality Gate Failed"
  kill $SERVER_PID
  exit 1
fi

# Cleanup
kill $SERVER_PID

echo "✅ Pipeline Passed Successfully!"