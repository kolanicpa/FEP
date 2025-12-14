import express from 'express'
import ticketController from '../controllers/ticketController.js'
import { authenticate, requireRole } from '../middleware/auth.js'
import { body } from 'express-validator'

const router = express.Router()

router.post('/',
  [
    body('performanceId').isInt(),
    body('email').isEmail()
  ],
  ticketController.createTicket
)

router.get('/performance/:performanceId', ticketController.getTicketsByPerformance)

router.delete('/:id', ticketController.deleteTicket)

// User-specific routes
router.get('/my-tickets', authenticate, ticketController.getMyTickets)

// Staff routes for validation
router.post('/validate',
  authenticate,
  requireRole('staff', 'admin'),
  [body('ticketId').isUUID()],
  ticketController.validateTicket
)

router.patch('/:id/use',
  authenticate,
  requireRole('staff', 'admin'),
  ticketController.markTicketAsUsed
)

export default router
