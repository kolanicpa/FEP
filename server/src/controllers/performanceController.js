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
      const { title, artist, description, genre, startTime, endTime, locationId, duration, isHeadliner } = req.body

      if (!title || !artist || !genre || !startTime) {
        return res.status(400).json({
          error: { message: 'Missing required fields: title, artist, genre, startTime' }
        })
      }

      const performance = await performanceModel.create({
        title,
        artist,
        description: description || '',
        genre,
        startTime,
        endTime: endTime || startTime,
        locationId,
        duration,
        isHeadliner
      })

      res.status(201).json({ performance })
    } catch (error) {
      next(error)
    }
  }
}

export default new PerformanceController()
