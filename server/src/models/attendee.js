import pool from '../config/database.js'

class AttendeeModel {
  async findOrCreate(email) {
    // Try to find existing
    let result = await pool.query(
      'SELECT * FROM attendees WHERE LOWER(email) = LOWER($1)',
      [email]
    )

    if (result.rows.length > 0) {
      return result.rows[0]
    }

    // Create new
    result = await pool.query(
      'INSERT INTO attendees (email) VALUES ($1) RETURNING *',
      [email]
    )
    return result.rows[0]
  }

  async getById(id) {
    const result = await pool.query(
      'SELECT * FROM attendees WHERE id = $1',
      [id]
    )
    return result.rows[0]
  }
}

export default new AttendeeModel()
