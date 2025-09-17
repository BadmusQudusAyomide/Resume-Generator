const fs = require("fs");
const path = require("path");

console.log("🔧 Setting up environment variables...\n");

// Frontend .env content
const frontendEnv = `VITE_FIREBASE_API_KEY=AIzaSyA8Lt4y-SWE5Di2cmZFSCg79HUi8qIB-X4
VITE_FIREBASE_AUTH_DOMAIN=resume-generator-164f7.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=resume-generator-164f7
VITE_FIREBASE_STORAGE_BUCKET=resume-generator-164f7.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=968558238433
VITE_FIREBASE_APP_ID=1:968558238433:web:4fc5d7b1a85ad6092a35a0`;

// Backend .env content
const backendEnv = `PORT=3001
NODE_ENV=development

# Firebase Admin
FIREBASE_PROJECT_ID=resume-generator-164f7
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nYOUR_PRIVATE_KEY_HERE\\n-----END PRIVATE KEY-----\\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@resume-generator-164f7.iam.gserviceaccount.com

# OpenAI
OPENAI_API_KEY=sk-your_openai_api_key

# Stripe (optional)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Cloudinary (optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS
FRONTEND_URL=http://localhost:3000`;

try {
  // Create frontend .env
  fs.writeFileSync(path.join("frontend", ".env"), frontendEnv);
  console.log("✅ Created frontend/.env");

  // Create backend .env
  fs.writeFileSync(path.join("backend", ".env"), backendEnv);
  console.log("✅ Created backend/.env");

  console.log("\n🎉 Environment files created successfully!");
  console.log("\n📋 Next steps:");
  console.log(
    "1. Go to Firebase Console: https://console.firebase.google.com/"
  );
  console.log("2. Select your project: resume-generator-164f7");
  console.log("3. Go to Project Settings > Service Accounts");
  console.log('4. Click "Generate new private key"');
  console.log("5. Download the JSON file");
  console.log("6. Update backend/.env with:");
  console.log("   - FIREBASE_PRIVATE_KEY (from the JSON file)");
  console.log("   - FIREBASE_CLIENT_EMAIL (from the JSON file)");
  console.log("7. Enable Authentication in Firebase Console");
  console.log("8. Create a Firestore database");
  console.log("9. Restart your development servers");
} catch (error) {
  console.error("❌ Error creating environment files:", error.message);
  console.log("\n📝 Manual setup:");
  console.log("1. Create frontend/.env with the frontend config");
  console.log("2. Create backend/.env with the backend config");
}
