const fs = require("fs");
const path = require("path");

console.log("🔧 Fixing port conflict...\n");

// Read current backend .env
const backendEnvPath = path.join("backend", ".env");
let backendEnv = fs.readFileSync(backendEnvPath, "utf8");

// Update port from 3001 to 3002
backendEnv = backendEnv.replace("PORT=3001", "PORT=3002");
backendEnv = backendEnv.replace(
  "FRONTEND_URL=http://localhost:3000",
  "FRONTEND_URL=http://localhost:3001"
);

// Write updated .env
fs.writeFileSync(backendEnvPath, backendEnv);

console.log("✅ Updated backend to use port 3002");
console.log("✅ Updated CORS to allow frontend on port 3001");
console.log("\n📋 Current setup:");
console.log("- Frontend: http://localhost:3001");
console.log("- Backend: http://localhost:3002");
console.log("\n🚀 Restart your servers to apply changes!");
