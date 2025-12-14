// Helper script to extract Firebase credentials for Vercel environment variables
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

try {
  const credentials = JSON.parse(
    readFileSync(join(__dirname, 'src/config/firebase-credentials.json'), 'utf8')
  )

  console.log('\n==========================================================')
  console.log('Firebase Environment Variables for Vercel')
  console.log('==========================================================\n')
  console.log('Copy and paste these into Vercel Dashboard → Project Settings → Environment Variables\n')

  console.log('FIREBASE_PROJECT_ID')
  console.log(credentials.project_id)
  console.log('')

  console.log('FIREBASE_PRIVATE_KEY_ID')
  console.log(credentials.private_key_id)
  console.log('')

  console.log('FIREBASE_CLIENT_EMAIL')
  console.log(credentials.client_email)
  console.log('')

  console.log('FIREBASE_CLIENT_ID')
  console.log(credentials.client_id)
  console.log('')

  console.log('FIREBASE_CLIENT_CERT_URL')
  console.log(credentials.client_x509_cert_url)
  console.log('')

  console.log('FIREBASE_PRIVATE_KEY')
  console.log('⚠️  IMPORTANT: Copy the ENTIRE key below including -----BEGIN and -----END lines')
  console.log('The \\n characters are correct - do not remove them!')
  console.log('─'.repeat(70))
  console.log(credentials.private_key)
  console.log('─'.repeat(70))
  console.log('')

  console.log('\n==========================================================')
  console.log('Vercel CLI Commands (Alternative Method)')
  console.log('==========================================================\n')

  console.log('Run these commands in your terminal:\n')
  console.log(`vercel env add FIREBASE_PROJECT_ID`)
  console.log(`# Enter: ${credentials.project_id}\n`)

  console.log(`vercel env add FIREBASE_PRIVATE_KEY_ID`)
  console.log(`# Enter: ${credentials.private_key_id}\n`)

  console.log(`vercel env add FIREBASE_CLIENT_EMAIL`)
  console.log(`# Enter: ${credentials.client_email}\n`)

  console.log(`vercel env add FIREBASE_CLIENT_ID`)
  console.log(`# Enter: ${credentials.client_id}\n`)

  console.log(`vercel env add FIREBASE_CLIENT_CERT_URL`)
  console.log(`# Enter: ${credentials.client_x509_cert_url}\n`)

  console.log(`vercel env add FIREBASE_PRIVATE_KEY`)
  console.log(`# Paste the entire private key from above\n`)

  console.log('\n==========================================================')
  console.log('✅ Done! Use these values to configure Vercel')
  console.log('==========================================================\n')

} catch (error) {
  console.error('Error reading Firebase credentials:', error.message)
  console.log('\nMake sure firebase-credentials.json exists at:')
  console.log(join(__dirname, 'src/config/firebase-credentials.json'))
  process.exit(1)
}
