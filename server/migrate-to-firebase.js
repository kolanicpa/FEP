import pg from 'pg'
import dotenv from 'dotenv'
import { admin, db } from './src/config/firebase.js'

dotenv.config()

const pool = new pg.Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'theater_db',
  user: process.env.DB_USER || 'theater_admin',
  password: process.env.DB_PASSWORD || 'theater_password',
})

async function migratePerformances() {
  console.log('Migrating performances...')

  const result = await pool.query('SELECT * FROM performances ORDER BY id ASC')
  const performances = result.rows

  const batch = db.batch()
  const performanceIdMap = new Map()

  for (const performance of performances) {
    const docRef = db.collection('performances').doc()
    performanceIdMap.set(performance.id, docRef.id)

    batch.set(docRef, {
      name: performance.name,
      status: performance.status,
      start_date: performance.start_date?.toISOString().split('T')[0] || performance.start_date,
      satnica: performance.satnica,
      category: performance.category,
      total_tickets: performance.total_tickets,
      available_tickets: performance.available_tickets,
      qr_code: performance.qr_code,
      created_at: performance.created_at || admin.firestore.FieldValue.serverTimestamp(),
      updated_at: performance.updated_at || admin.firestore.FieldValue.serverTimestamp()
    })
  }

  await batch.commit()
  console.log(`Migrated ${performances.length} performances`)

  return performanceIdMap
}

async function migrateAttendees() {
  console.log('Migrating attendees...')

  const result = await pool.query('SELECT * FROM attendees ORDER BY id ASC')
  const attendees = result.rows

  const batch = db.batch()
  const attendeeIdMap = new Map()

  for (const attendee of attendees) {
    const docRef = db.collection('attendees').doc()
    attendeeIdMap.set(attendee.id, docRef.id)

    batch.set(docRef, {
      email: attendee.email,
      email_lowercase: attendee.email.toLowerCase(),
      first_name: attendee.first_name || null,
      last_name: attendee.last_name || null,
      password_hash: attendee.password_hash || null,
      role: attendee.role || 'user',
      created_at: attendee.created_at || admin.firestore.FieldValue.serverTimestamp(),
      updated_at: attendee.updated_at || admin.firestore.FieldValue.serverTimestamp()
    })
  }

  await batch.commit()
  console.log(`Migrated ${attendees.length} attendees`)

  return attendeeIdMap
}

async function migrateTickets(performanceIdMap, attendeeIdMap) {
  console.log('Migrating tickets...')

  const result = await pool.query('SELECT * FROM tickets ORDER BY created_at ASC')
  const tickets = result.rows

  const batchSize = 500
  let count = 0

  for (let i = 0; i < tickets.length; i += batchSize) {
    const batch = db.batch()
    const chunk = tickets.slice(i, i + batchSize)

    for (const ticket of chunk) {
      const performanceFirebaseId = performanceIdMap.get(ticket.performance_id)
      const attendeeFirebaseId = attendeeIdMap.get(ticket.attendee_id)

      if (!performanceFirebaseId || !attendeeFirebaseId) {
        console.warn(`Skipping ticket ${ticket.id} - missing references`)
        continue
      }

      const docRef = db.collection('tickets').doc()

      batch.set(docRef, {
        performance_id: performanceFirebaseId,
        attendee_id: attendeeFirebaseId,
        qr_code_data: ticket.qr_code_data,
        qr_code_image: ticket.qr_code_image,
        status: ticket.status || 'valid',
        sent_at: ticket.sent_at || null,
        scanned_at: ticket.scanned_at || null,
        used_at: ticket.used_at || null,
        created_at: ticket.created_at || admin.firestore.FieldValue.serverTimestamp(),
        updated_at: ticket.updated_at || admin.firestore.FieldValue.serverTimestamp()
      })

      count++
    }

    await batch.commit()
    console.log(`Migrated ${Math.min(i + batchSize, tickets.length)}/${tickets.length} tickets`)
  }

  console.log(`Migrated ${count} tickets`)
}

async function createIndexes() {
  console.log('Creating Firestore indexes...')
  console.log('Note: You may need to create composite indexes manually in the Firebase Console')
  console.log('Required indexes:')
  console.log('1. attendees: email_lowercase (ASC)')
  console.log('2. tickets: performance_id (ASC), created_at (DESC)')
  console.log('3. tickets: attendee_id (ASC), created_at (DESC)')
  console.log('4. tickets: performance_id (ASC), attendee_id (ASC)')
}

async function migrate() {
  try {
    console.log('Starting migration from PostgreSQL to Firebase...\n')

    const performanceIdMap = await migratePerformances()
    console.log('')

    const attendeeIdMap = await migrateAttendees()
    console.log('')

    await migrateTickets(performanceIdMap, attendeeIdMap)
    console.log('')

    await createIndexes()
    console.log('')

    console.log('Migration completed successfully!')
    console.log('\nIMPORTANT: Please create the required Firestore indexes in the Firebase Console:')
    console.log('https://console.firebase.google.com/project/f-e-p-4e3a7/firestore/indexes')

    await pool.end()
    process.exit(0)
  } catch (error) {
    console.error('Migration failed:', error)
    await pool.end()
    process.exit(1)
  }
}

migrate()
