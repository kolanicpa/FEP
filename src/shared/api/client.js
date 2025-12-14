const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1'

class APIClient {
  constructor(baseURL) {
    this.baseURL = baseURL
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    }

    try {
      const response = await fetch(url, config)

      const isJson = response.headers
        ?.get('content-type')
        ?.toLowerCase()
        .includes('application/json')

      if (!response.ok) {
        const errorData = isJson ? await response.json() : await response.text()
        const message =
          typeof errorData === 'object'
            ? errorData.error?.message || 'API request failed'
            : errorData || 'API request failed'
        throw new Error(message)
      }

      if (response.status === 204) {
        return null
      }

      return isJson ? await response.json() : await response.text()
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  get(endpoint, options) {
    return this.request(endpoint, { ...options, method: 'GET' })
  }

  post(endpoint, data, options) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  delete(endpoint, options) {
    return this.request(endpoint, { ...options, method: 'DELETE' })
  }
}

export const apiClient = new APIClient(API_BASE_URL)
