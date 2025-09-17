const fs = require("fs");
const path = require("path");

console.log("🔍 Testing Resume Builder Setup...\n");

// Check if required directories exist
const requiredDirs = ["frontend", "backend", "infra"];
const missingDirs = requiredDirs.filter((dir) => !fs.existsSync(dir));

if (missingDirs.length > 0) {
  console.log("❌ Missing directories:", missingDirs.join(", "));
  process.exit(1);
}

// Check if package.json files exist
const frontendPackage = path.join("frontend", "package.json");
const backendPackage = path.join("backend", "package.json");

if (!fs.existsSync(frontendPackage)) {
  console.log("❌ Frontend package.json not found");
  process.exit(1);
}

if (!fs.existsSync(backendPackage)) {
  console.log("❌ Backend package.json not found");
  process.exit(1);
}

// Check if node_modules exist
const frontendNodeModules = path.join("frontend", "node_modules");
const backendNodeModules = path.join("backend", "node_modules");

if (!fs.existsSync(frontendNodeModules)) {
  console.log(
    "⚠️  Frontend dependencies not installed. Run: cd frontend && npm install"
  );
} else {
  console.log("✅ Frontend dependencies installed");
}

if (!fs.existsSync(backendNodeModules)) {
  console.log(
    "⚠️  Backend dependencies not installed. Run: cd backend && npm install"
  );
} else {
  console.log("✅ Backend dependencies installed");
}

// Check if environment files exist
const frontendEnv = path.join("frontend", ".env");
const backendEnv = path.join("backend", ".env");

if (!fs.existsSync(frontendEnv)) {
  console.log(
    "⚠️  Frontend .env file not found. Copy from frontend/env.example"
  );
} else {
  console.log("✅ Frontend .env file exists");
}

if (!fs.existsSync(backendEnv)) {
  console.log("⚠️  Backend .env file not found. Copy from backend/env.example");
} else {
  console.log("✅ Backend .env file exists");
}

// Check key files
const keyFiles = [
  "frontend/src/App.tsx",
  "frontend/src/contexts/AuthContext.tsx",
  "frontend/src/contexts/ResumeContext.tsx",
  "backend/src/index.ts",
  "backend/src/config/firebase.ts",
  "infra/firestore.rules",
];

const missingFiles = keyFiles.filter((file) => !fs.existsSync(file));

if (missingFiles.length > 0) {
  console.log("❌ Missing key files:", missingFiles.join(", "));
  process.exit(1);
}

console.log("\n🎉 Setup looks good!");
console.log("\nNext steps:");
console.log("1. Set up your Firebase project");
console.log("2. Add environment variables");
console.log("3. Start development:");
console.log(
  "   - Option 1: Double-click start-dev.bat (Windows) or ./start-dev.sh (Mac/Linux)"
);
console.log(
  '   - Option 2: Run "npm run dev" in both frontend and backend directories'
);
