import { apiClient } from './client.js'

export const performanceService = {
  async getAll() {
    const response = await apiClient.get('/performances')
    return response.performances
  },

  async getById(id) {
    const response = await apiClient.get(`/performances/${id}`)
    return response.performance
  },

  async create(data) {
    const response = await apiClient.post('/performances', {
      name: data.name,
      status: data.status,
      startDate: data.startDate,
      satnica: data.satnica,
      category: data.category,
      totalTickets: Number(data.tickets)
    })
    return response.performance
  }
}
