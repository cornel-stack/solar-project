interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  error?: string
  errors?: any[]
}

interface ApiConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: Record<string, string>
  body?: any
}

class ApiClient {
  private baseUrl: string
  private accessToken: string | null = null

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
    
    // Load token from localStorage on client side
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('accessToken')
    }
  }

  setAccessToken(token: string | null) {
    this.accessToken = token
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('accessToken', token)
      } else {
        localStorage.removeItem('accessToken')
      }
    }
  }

  private async request<T>(endpoint: string, config: ApiConfig = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...config.headers,
    }

    if (this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`
    }

    const fetchConfig: RequestInit = {
      method: config.method || 'GET',
      headers,
      credentials: 'include', // Include cookies for refresh tokens
    }

    if (config.body && config.method !== 'GET') {
      fetchConfig.body = JSON.stringify(config.body)
    }

    try {
      const response = await fetch(url, fetchConfig)
      
      if (!response.ok) {
        // Try to parse error response
        try {
          const errorData: ApiResponse = await response.json()
          throw new Error(errorData.error || `HTTP ${response.status}`)
        } catch {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
      }

      const data: ApiResponse<T> = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'API request failed')
      }

      return data.data as T
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Auth endpoints
  async register(data: { email: string; password: string; name?: string; phone?: string }) {
    const response = await this.request<{ user: any; accessToken: string }>('/auth/register', {
      method: 'POST',
      body: data,
    })
    
    if (response.accessToken) {
      this.setAccessToken(response.accessToken)
    }
    
    return response
  }

  async login(data: { email: string; password: string }) {
    const response = await this.request<{ user: any; accessToken: string }>('/auth/login', {
      method: 'POST',
      body: data,
    })
    
    if (response.accessToken) {
      this.setAccessToken(response.accessToken)
    }
    
    return response
  }

  async logout() {
    await this.request('/auth/logout', { method: 'POST' })
    this.setAccessToken(null)
  }

  async refreshToken() {
    try {
      const response = await this.request<{ accessToken: string }>('/auth/refresh', {
        method: 'POST',
      })
      
      if (response.accessToken) {
        this.setAccessToken(response.accessToken)
      }
      
      return response
    } catch {
      this.setAccessToken(null)
      throw new Error('Session expired')
    }
  }

  async getProfile() {
    return this.request('/auth/profile')
  }

  async updateProfile(data: { name?: string; phone?: string; preferences?: any }) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: data,
    })
  }

  // Calculator endpoints
  async calculateSolarSystem(data: {
    category: 'HOME' | 'BUSINESS' | 'FARM'
    location: string
    sunlightHours: number
    devices: Array<{
      type: string
      quantity: number
      hoursPerDay: number
      powerConsumption: number
    }>
  }) {
    return this.request('/calculator/calculate', {
      method: 'POST',
      body: data,
    })
  }

  async getDeviceCatalog() {
    return this.request('/calculator/devices')
  }

  async getSunlightData(location: string) {
    return this.request(`/calculator/sunlight?location=${encodeURIComponent(location)}`)
  }

  // Plans endpoints
  async createPlan(data: {
    name: string
    category: 'HOME' | 'BUSINESS' | 'FARM'
    location: string
    sunlightHours: number
    devices: Array<{
      type: string
      quantity: number
      hoursPerDay: number
      powerConsumption: number
    }>
  }) {
    return this.request('/plans', {
      method: 'POST',
      body: data,
    })
  }

  async getUserPlans(params: {
    page?: number
    limit?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  } = {}) {
    const queryString = new URLSearchParams(
      Object.entries(params)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => [key, String(value)])
    ).toString()
    
    return this.request(`/plans${queryString ? `?${queryString}` : ''}`)
  }

  async getPlanById(id: string) {
    return this.request(`/plans/${id}`)
  }

  async updatePlan(id: string, data: any) {
    return this.request(`/plans/${id}`, {
      method: 'PUT',
      body: data,
    })
  }

  async deletePlan(id: string) {
    return this.request(`/plans/${id}`, {
      method: 'DELETE',
    })
  }

  async duplicatePlan(id: string, name?: string) {
    return this.request(`/plans/${id}/duplicate`, {
      method: 'POST',
      body: { name },
    })
  }

  async sharePlan(id: string) {
    return this.request(`/plans/${id}/share`, {
      method: 'POST',
    })
  }

  async getSharedPlan(token: string) {
    return this.request(`/plans/shared/${token}`)
  }

  // Health check
  async healthCheck() {
    return this.request('/health')
  }
}

export const api = new ApiClient()
export default api