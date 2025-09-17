import admin from 'firebase-admin'

let initialized = false
let db: admin.firestore.Firestore
let auth: admin.auth.Auth

export function initializeFirebase() {
  if (initialized) return

  if (!admin.apps.length) {
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID,
    })
  }

  // Initialize services after app is initialized
  db = admin.firestore()
  auth = admin.auth()
  initialized = true
}

export function getDb() {
  if (!initialized) {
    initializeFirebase()
  }
  return db
}

export function getAuth() {
  if (!initialized) {
    initializeFirebase()
  }
  return auth
}
