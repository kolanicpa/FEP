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
      title: data.title,
      artist: data.artist,
      description: data.description,
      genre: data.genre,
      startTime: data.startTime,
      endTime: data.endTime,
      locationId: data.locationId,
      duration: Number(data.duration),
      isHeadliner: data.isHeadliner
    })
    return response.performance
  },

  async update(id, data) {
    const response = await apiClient.put(`/performances/${id}`, {
      title: data.title,
      artist: data.artist,
      description: data.description,
      genre: data.genre,
      startTime: data.startTime,
      endTime: data.endTime,
      locationId: data.locationId,
      duration: Number(data.duration),
      isHeadliner: data.isHeadliner,
      isActive: data.isActive
    })
    return response.performance
  },

  async delete(id) {
    await apiClient.delete(`/performances/${id}`)
    return { id }
  }
}
