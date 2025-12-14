import express from 'express'
import performanceController from '../controllers/performanceController.js'

const router = express.Router()

router.get('/', performanceController.getAll)
router.get('/:id', performanceController.getById)
router.post('/', performanceController.create)

export default router
