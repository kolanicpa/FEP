import performanceModel from '../models/performance.js'

class PerformanceController {
  async getAll(req, res, next) {
    try {
      const performances = await performanceModel.getAll()
      res.json({ performances })
    } catch (error) {
      next(error)
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params
      const performance = await performanceModel.getById(id)

      if (!performance) {
        return res.status(404).json({
          error: { message: 'Performance not found' }
        })
      }

      res.json({ performance })
    } catch (error) {
      next(error)
    }
  }

  async create(req, res, next) {
    try {
      const { name, status, startDate, satnica, category, totalTickets } = req.body

      if (!name || !startDate || !satnica || !totalTickets) {
        return res.status(400).json({
          error: { message: 'Missing required fields: name, startDate, satnica, totalTickets' }
        })
      }

      const performance = await performanceModel.create({
        name,
        status: status || 'Aktivna',
        startDate,
        satnica,
        category,
        totalTickets
      })

      res.status(201).json({ performance })
    } catch (error) {
      next(error)
    }
  }
}

export default new PerformanceController()
