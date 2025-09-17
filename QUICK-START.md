# 🚀 Resume Builder - Quick Start Guide

## ✅ **Project Complete - Ready to Use!**

Your resume builder is **100% functional** and ready to run!

## 🎯 **Start Your App (2 commands)**

### **Step 1: Start Frontend**

```bash
cd frontend
npm run dev
```

**Result**: Frontend will run on http://localhost:3001 (or next available port)

### **Step 2: Start Backend**

```bash
cd backend
npm run dev
```

**Result**: Backend will run on http://localhost:3002 (or next available port)

## 🔧 **If You Get Port Conflicts**

The app will automatically find available ports. Check the terminal output to see which ports are actually being used.

## 📋 **Complete Firebase Setup (2 minutes)**

1. **Enable Authentication**:

   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select project: `resume-generator-164f7`
   - Enable Email/Password and Google authentication

2. **Create Firestore Database**:
   - Create database in test mode
   - Select a location

## 🎉 **You're Done!**

Once Firebase is configured, you'll have:

- ✅ **User Authentication** (Google + Email/Password)
- ✅ **Resume Creation & Editing** (All sections)
- ✅ **Live Preview** (Real-time updates)
- ✅ **Style Customization** (Fonts, colors, spacing)
- ✅ **Export Functionality** (PDF, HTML)
- ✅ **Data Persistence** (Firestore)

## 🔧 **Optional Features**

- **AI Suggestions**: Add your OpenAI API key to `backend/.env`
- **Payments**: Add your Stripe keys to `backend/.env`
- **Image Upload**: Add your Cloudinary credentials to `backend/.env`

## 📱 **Access Your App**

After starting both servers, visit the URL shown in your terminal (usually http://localhost:3001)

**Your resume builder is ready to use!** 🎉
