import pool from '../config/database.js'

class TicketModel {
  async create(data) {
    const { performanceId, attendeeId, qrCodeData, qrCodeImage } = data

    const result = await pool.query(
      `INSERT INTO tickets
       (performance_id, attendee_id, qr_code_data, qr_code_image, sent_at)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING *`,
      [performanceId, attendeeId, qrCodeData, qrCodeImage]
    )
    return result.rows[0]
  }

  async getById(id) {
    const result = await pool.query(
      `SELECT t.*,
              p.name as performance_name, p.start_date, p.satnica, p.category,
              a.email as attendee_email
       FROM tickets t
       JOIN performances p ON t.performance_id = p.id
       JOIN attendees a ON t.attendee_id = a.id
       WHERE t.id = $1`,
      [id]
    )
    return result.rows[0]
  }

  async getByPerformance(performanceId) {
    const result = await pool.query(
      `SELECT t.*, a.email as attendee_email
       FROM tickets t
       JOIN attendees a ON t.attendee_id = a.id
       WHERE t.performance_id = $1
       ORDER BY t.created_at DESC`,
      [performanceId]
    )
    return result.rows
  }

  async checkDuplicate(performanceId, attendeeId) {
    const result = await pool.query(
      'SELECT * FROM tickets WHERE performance_id = $1 AND attendee_id = $2',
      [performanceId, attendeeId]
    )
    return result.rows.length > 0
  }

  async delete(id) {
    const result = await pool.query(
      'DELETE FROM tickets WHERE id = $1 RETURNING performance_id',
      [id]
    )
    return result.rows[0]
  }

  async getByUser(userId) {
    const result = await pool.query(
      `SELECT t.*,
              p.name as performance_name,
              p.start_date,
              p.satnica,
              p.category,
              a.email as attendee_email
       FROM tickets t
       JOIN performances p ON t.performance_id = p.id
       JOIN attendees a ON t.attendee_id = a.id
       WHERE t.attendee_id = $1
       ORDER BY p.start_date DESC, t.created_at DESC`,
      [userId]
    )
    return result.rows
  }

  async validateTicket(ticketId) {
    const result = await pool.query(
      `SELECT t.*,
              p.name as performance_name,
              p.start_date,
              p.satnica,
              a.email as attendee_email
       FROM tickets t
       JOIN performances p ON t.performance_id = p.id
       JOIN attendees a ON t.attendee_id = a.id
       WHERE t.id = $1`,
      [ticketId]
    )
    return result.rows[0]
  }

  async markAsUsed(ticketId) {
    const result = await pool.query(
      `UPDATE tickets
       SET status = 'used', used_at = NOW()
       WHERE id = $1 AND status = 'valid'
       RETURNING *`,
      [ticketId]
    )
    return result.rows[0]
  }
}

export default new TicketModel()
