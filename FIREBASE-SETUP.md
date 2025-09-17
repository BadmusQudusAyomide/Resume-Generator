# Firebase Setup Guide

## 🎯 Quick Setup for Resume Generator

Your Firebase project is already created: **resume-generator-164f7**

### 1. Enable Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **resume-generator-164f7**
3. Click on **Authentication** in the left sidebar
4. Click **Get Started**
5. Go to **Sign-in method** tab
6. Enable these providers:
   - ✅ **Email/Password**
   - ✅ **Google** (click on it and enable)

### 2. Create Firestore Database

1. In Firebase Console, click on **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (we'll secure it later)
4. Select a location (choose one close to you)
5. Click **Done**

### 3. Get Service Account Key (for Backend)

1. In Firebase Console, click the gear icon ⚙️
2. Select **Project settings**
3. Go to **Service accounts** tab
4. Click **Generate new private key**
5. Download the JSON file
6. Open the JSON file and copy these values:
   - `private_key` (the long string)
   - `client_email`

### 4. Update Backend Environment

Edit `backend/.env` and replace these lines:

```env
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@resume-generator-164f7.iam.gserviceaccount.com
```

With the actual values from your downloaded JSON file.

### 5. Deploy Firestore Security Rules

1. Install Firebase CLI (if not already installed):

   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:

   ```bash
   firebase login
   ```

3. Initialize Firebase in your project:

   ```bash
   firebase init firestore
   ```

   - Select your project: resume-generator-164f7
   - Use existing rules file: `infra/firestore.rules`

4. Deploy the rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

### 6. Test the Setup

1. Restart your development servers:

   ```bash
   # Stop current servers (Ctrl+C)
   # Then restart:
   start-dev.bat  # Windows
   # or
   ./start-dev.sh  # Mac/Linux
   ```

2. Visit http://localhost:3000
3. Try to sign in with Google or create an account
4. Test creating a resume

### 7. Optional: Add Domain to Authorized Domains

If you plan to deploy, add your domain to:

1. Firebase Console > Authentication > Settings
2. Add your domain to **Authorized domains**

## 🔧 Troubleshooting

### Authentication Not Working

- Check that Email/Password and Google are enabled
- Verify your frontend .env file has correct values
- Check browser console for errors

### Firestore Permission Denied

- Make sure you deployed the security rules
- Check that the rules are correct in Firebase Console

### Backend Can't Connect to Firebase

- Verify your backend .env file has correct service account values
- Check that the private key is properly formatted with `\n` for newlines

## ✅ Success Checklist

- [ ] Authentication enabled (Email/Password + Google)
- [ ] Firestore database created
- [ ] Service account key downloaded
- [ ] Backend .env updated with service account values
- [ ] Firestore rules deployed
- [ ] Development servers restarted
- [ ] Can sign in and create resumes

## 🚀 Next Steps

Once Firebase is set up:

1. Test the full application flow
2. Set up OpenAI API key for AI features (optional)
3. Set up Stripe for payments (optional)
4. Deploy to production

Your resume builder will be fully functional with authentication and data persistence!
