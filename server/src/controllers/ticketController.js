import performanceModel from '../models/performance.js'
import attendeeModel from '../models/attendee.js'
import ticketModel from '../models/ticket.js'
import qrService from '../services/qrService.js'
import emailService from '../services/emailService.js'
import crypto from 'crypto'

class TicketController {
  async createTicket(req, res, next) {
    try {
      const { performanceId, email } = req.body

      // 1. Validate performance exists and has available tickets
      const performance = await performanceModel.getById(performanceId)
      if (!performance) {
        return res.status(404).json({
          error: { message: 'Performance not found', code: 'PERFORMANCE_NOT_FOUND' }
        })
      }

      if (performance.available_tickets <= 0) {
        return res.status(409).json({
          error: { message: 'No tickets available', code: 'NO_TICKETS_AVAILABLE' }
        })
      }

      // 2. Find or create attendee
      const attendee = await attendeeModel.findOrCreate(email)

      // 3. Check for duplicate ticket
      const isDuplicate = await ticketModel.checkDuplicate(performanceId, attendee.id)
      if (isDuplicate) {
        return res.status(409).json({
          error: { message: 'Ticket already exists for this attendee', code: 'DUPLICATE_TICKET' }
        })
      }

      // 4. Generate QR code (ticket will get UUID from database)
      const ticketId = crypto.randomUUID() // Temporary for QR generation

      const qrCode = await qrService.generateQRCode({
        ticketId,
        performanceId: performance.id,
        performanceName: performance.name,
        startDate: performance.start_date,
        satnica: performance.satnica,
        category: performance.category,
        attendeeEmail: email
      })

      // 5. Create ticket
      const ticket = await ticketModel.create({
        performanceId: performance.id,
        attendeeId: attendee.id,
        qrCodeData: qrCode.data,
        qrCodeImage: qrCode.image
      })

      // 6. Decrement available tickets
      await performanceModel.decrementAvailableTickets(performanceId)

      // 7. Send email
      await emailService.sendTicketEmail({
        to: email,
        performance,
        ticket,
        qrCodeImage: qrCode.image
      })

      // 8. Return success
      res.status(201).json({
        ticket: {
          id: ticket.id,
          performanceId: ticket.performance_id,
          attendeeId: ticket.attendee_id,
          status: ticket.status,
          createdAt: ticket.created_at,
          performance: {
            name: performance.name,
            startDate: performance.start_date,
            satnica: performance.satnica,
            category: performance.category
          }
        },
        emailSent: true
      })

    } catch (error) {
      next(error)
    }
  }

  async getTicketsByPerformance(req, res, next) {
    try {
      const { performanceId } = req.params
      const tickets = await ticketModel.getByPerformance(performanceId)
      res.json({ tickets })
    } catch (error) {
      next(error)
    }
  }

  async deleteTicket(req, res, next) {
    try {
      const { id } = req.params

      // Get ticket info before deleting (to get performance_id)
      const ticket = await ticketModel.getById(id)
      if (!ticket) {
        return res.status(404).json({
          error: { message: 'Ticket not found', code: 'TICKET_NOT_FOUND' }
        })
      }

      // Delete the ticket
      await ticketModel.delete(id)

      // Increment available tickets for the performance
      await performanceModel.incrementAvailableTickets(ticket.performance_id)

      res.status(200).json({
        message: 'Ticket deleted successfully'
      })
    } catch (error) {
      next(error)
    }
  }

  async getMyTickets(req, res, next) {
    try {
      const userId = req.user.id
      const tickets = await ticketModel.getByUser(userId)
      res.json({ tickets })
    } catch (error) {
      next(error)
    }
  }

  async validateTicket(req, res, next) {
    try {
      const { ticketId } = req.body

      const ticket = await ticketModel.validateTicket(ticketId)

      if (!ticket) {
        return res.status(404).json({
          valid: false,
          reason: 'Ticket not found'
        })
      }

      if (ticket.status !== 'valid') {
        return res.status(400).json({
          valid: false,
          reason: `Ticket is ${ticket.status}`,
          ticket: {
            id: ticket.id,
            status: ticket.status,
            performanceName: ticket.performance_name,
            usedAt: ticket.used_at
          }
        })
      }

      // Check if performance date has passed
      const performanceDate = new Date(ticket.start_date)
      const now = new Date()

      if (performanceDate < now) {
        return res.status(400).json({
          valid: false,
          reason: 'Performance has already occurred'
        })
      }

      res.json({
        valid: true,
        ticket: {
          id: ticket.id,
          performanceName: ticket.performance_name,
          startDate: ticket.start_date,
          satnica: ticket.satnica,
          attendeeEmail: ticket.attendee_email,
          status: ticket.status
        }
      })
    } catch (error) {
      next(error)
    }
  }

  async markTicketAsUsed(req, res, next) {
    try {
      const { id } = req.params

      const ticket = await ticketModel.markAsUsed(id)

      if (!ticket) {
        return res.status(400).json({
          error: { message: 'Ticket cannot be marked as used', code: 'ALREADY_USED' }
        })
      }

      res.json({
        message: 'Ticket marked as used',
        ticket: {
          id: ticket.id,
          status: ticket.status,
          usedAt: ticket.used_at
        }
      })
    } catch (error) {
      next(error)
    }
  }
}

export default new TicketController()
