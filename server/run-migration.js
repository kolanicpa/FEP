import pg from 'pg'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const pool = new pg.Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
})

async function runMigration() {
  try {
    console.log('🔄 Running authentication migration...')

    const migrationPath = path.join(__dirname, 'migrations', '004_add_authentication.sql')
    const sql = fs.readFileSync(migrationPath, 'utf8')

    await pool.query(sql)

    console.log('✅ Migration completed successfully!')
    console.log('   - Added password_hash column to attendees')
    console.log('   - Added role column to attendees')
    console.log('   - Created role index')

    process.exit(0)
  } catch (error) {
    console.error('❌ Migration failed:', error.message)

    if (error.message.includes('column "password_hash" of relation "attendees" already exists')) {
      console.log('ℹ️  Migration has already been run!')
      process.exit(0)
    }

    process.exit(1)
  }
}

runMigration()
