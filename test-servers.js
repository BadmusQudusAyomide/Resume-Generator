const http = require("http");

console.log("🔍 Testing Resume Builder Servers...\n");

// Test frontend (should be on port 3001)
testServer("Frontend", "http://localhost:3001", 5000);

// Test backend (should be on port 3002)
testServer("Backend", "http://localhost:3002/health", 5000);

function testServer(name, url, timeout) {
  const startTime = Date.now();

  const req = http.get(url, (res) => {
    const endTime = Date.now();
    console.log(`✅ ${name}: Running on ${url} (${endTime - startTime}ms)`);
  });

  req.on("error", (err) => {
    console.log(`❌ ${name}: Not running on ${url} - ${err.message}`);
  });

  req.setTimeout(timeout, () => {
    console.log(`⏰ ${name}: Timeout after ${timeout}ms`);
    req.destroy();
  });
}
