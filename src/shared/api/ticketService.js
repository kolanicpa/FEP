import { apiClient } from './client'

class TicketService {
  async getPerformances() {
    return apiClient.get('/performances')
  }

  async getTicketsForPerformance(performanceId) {
    return apiClient.get(`/tickets/performance/${performanceId}`)
  }

  async createTicket(data) {
    return apiClient.post('/tickets', data)
  }

  async deleteTicket(ticketId) {
    return apiClient.delete(`/tickets/${ticketId}`)
  }
}

export const ticketService = new TicketService()
