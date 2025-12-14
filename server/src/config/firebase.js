import admin from 'firebase-admin'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import dotenv from 'dotenv'

dotenv.config()

// Initialize Firebase Admin
let serviceAccount

// In production (Vercel), use environment variables
if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
  serviceAccount = {
    type: 'service_account',
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL
  }
  console.log('Using Firebase credentials from environment variables')
} else {
  // In development, use credentials file
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)

  try {
    serviceAccount = JSON.parse(
      readFileSync(join(__dirname, 'firebase-credentials.json'), 'utf8')
    )
    console.log('Using Firebase credentials from file')
  } catch (error) {
    console.error('Failed to load Firebase credentials:', error.message)
    throw new Error('Firebase credentials not found. Please set environment variables or provide credentials file.')
  }
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

const db = admin.firestore()

// Configure Firestore settings
db.settings({
  ignoreUndefinedProperties: true
})

export { admin, db }
export default db
