# Resume Builder - Setup Guide

## Quick Start

### 1. Prerequisites

- Node.js 18+ installed
- A Firebase project
- OpenAI API key
- Stripe account (optional for payments)
- Cloudinary account (optional for images)

### 2. Environment Setup

#### Frontend Environment

Create `frontend/.env` file:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

#### Backend Environment

Create `backend/.env` file:

```env
PORT=3001
NODE_ENV=development

# Firebase Admin
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project.iam.gserviceaccount.com

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
FRONTEND_URL=http://localhost:3000
```

### 3. Firebase Setup

1. **Create Firebase Project**

   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication (Email/Password and Google)
   - Create a Firestore database

2. **Get Firebase Config**

   - Go to Project Settings > General
   - Scroll down to "Your apps" section
   - Add a web app
   - Copy the config values to your frontend `.env` file

3. **Set up Firebase Admin**

   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Download the JSON file
   - Copy the values to your backend `.env` file

4. **Deploy Firestore Rules**

   ```bash
   # Install Firebase CLI if you haven't
   npm install -g firebase-tools

   # Login to Firebase
   firebase login

   # Initialize Firebase in your project
   firebase init firestore

   # Deploy rules
   firebase deploy --only firestore:rules
   ```

### 4. Start Development

#### Option 1: Use the provided scripts (Recommended)

- **Windows**: Double-click `start-dev.bat`
- **Mac/Linux**: Run `chmod +x start-dev.sh && ./start-dev.sh`

#### Option 2: Manual start

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Both methods use `npm run dev` for both frontend and backend!

### 5. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Health Check: http://localhost:3001/health

## Features Available

### ✅ Implemented

- ✅ Project structure and configuration
- ✅ React frontend with TypeScript
- ✅ Node.js backend with Express
- ✅ Firebase authentication setup
- ✅ Resume data management
- ✅ Live preview with modern template
- ✅ Form-based resume editing
- ✅ Style customization (fonts, colors, spacing)
- ✅ PDF export functionality
- ✅ DOCX export functionality
- ✅ AI content suggestions
- ✅ Payment integration (Stripe)
- ✅ Public resume sharing
- ✅ Responsive design

### 🚧 Next Steps

1. Set up your Firebase project and add the environment variables
2. Test the basic functionality
3. Customize the templates and styling
4. Set up payment processing (optional)
5. Deploy to production

## Troubleshooting

### Common Issues

1. **Firebase Authentication Not Working**

   - Check that your Firebase config is correct
   - Ensure Authentication is enabled in Firebase Console
   - Verify the domain is added to authorized domains

2. **Backend Not Starting**

   - Check that all environment variables are set
   - Ensure Node.js 18+ is installed
   - Check that port 3001 is available

3. **Frontend Build Errors**

   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check TypeScript errors: `npm run build`

4. **PDF Export Not Working**
   - Ensure Puppeteer dependencies are installed
   - Check that the backend is running
   - Verify resume data is being passed correctly

### Getting Help

1. Check the console for error messages
2. Verify all environment variables are set
3. Ensure all dependencies are installed
4. Check that Firebase project is properly configured

## Production Deployment

### Frontend (Vercel/Netlify)

1. Connect your GitHub repository
2. Set environment variables
3. Deploy

### Backend (Render/Railway/Heroku)

1. Connect your GitHub repository
2. Set environment variables
3. Deploy

### Environment Variables for Production

Make sure to set all the same environment variables in your production environment, with production values for:

- Firebase project (use production project)
- Stripe keys (use live keys for production)
- OpenAI API key
- Cloudinary credentials
