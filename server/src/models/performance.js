import pool from '../config/database.js'

class PerformanceModel {
  async getAll() {
    const result = await pool.query(
      'SELECT * FROM performances ORDER BY start_date ASC'
    )
    return result.rows
  }

  async getById(id) {
    const result = await pool.query(
      'SELECT * FROM performances WHERE id = $1',
      [id]
    )
    return result.rows[0]
  }

  async create(data) {
    const { name, status, startDate, satnica, category, totalTickets } = data
    const result = await pool.query(
      `INSERT INTO performances
       (name, status, start_date, satnica, category, total_tickets, available_tickets)
       VALUES ($1, $2, $3, $4, $5, $6, $6)
       RETURNING *`,
      [name, status, startDate, satnica, category, totalTickets]
    )
    return result.rows[0]
  }

  async decrementAvailableTickets(performanceId) {
    const result = await pool.query(
      `UPDATE performances
       SET available_tickets = available_tickets - 1
       WHERE id = $1 AND available_tickets > 0
       RETURNING *`,
      [performanceId]
    )
    return result.rows[0]
  }

  async incrementAvailableTickets(performanceId) {
    const result = await pool.query(
      `UPDATE performances
       SET available_tickets = available_tickets + 1
       WHERE id = $1
       RETURNING *`,
      [performanceId]
    )
    return result.rows[0]
  }
}

export default new PerformanceModel()
