import pool from '../config/database.js'
import bcrypt from 'bcrypt'

class UserModel {
  async findByEmail(email) {
    const result = await pool.query(
      'SELECT * FROM attendees WHERE LOWER(email) = LOWER($1)',
      [email]
    )
    return result.rows[0]
  }

  async findById(id) {
    const result = await pool.query(
      'SELECT id, email, first_name, last_name, role, created_at FROM attendees WHERE id = $1',
      [id]
    )
    return result.rows[0]
  }

  async create({ email, password, firstName, lastName }) {
    const passwordHash = await bcrypt.hash(password, 10)

    const result = await pool.query(
      `INSERT INTO attendees
       (email, password_hash, first_name, last_name, role)
       VALUES ($1, $2, $3, $4, 'user')
       RETURNING id, email, first_name, last_name, role, created_at`,
      [email.toLowerCase(), passwordHash, firstName, lastName]
    )
    return result.rows[0]
  }

  async verifyPassword(user, password) {
    if (!user.password_hash) {
      return false
    }
    return await bcrypt.compare(password, user.password_hash)
  }

  async updatePassword(userId, newPassword) {
    const passwordHash = await bcrypt.hash(newPassword, 10)

    const result = await pool.query(
      'UPDATE attendees SET password_hash = $1, updated_at = NOW() WHERE id = $2 RETURNING id',
      [passwordHash, userId]
    )
    return result.rows[0]
  }
}

export default new UserModel()
