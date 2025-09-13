import { Request } from 'express'

export interface AuthUser {
  id: string
  email: string
  name: string | null
  phone: string | null
  emailVerified: boolean
  provider: string | null
  createdAt: Date
  updatedAt: Date
  preferences: any
}

export interface AuthRequest extends Request {
  user?: AuthUser
}


export interface JWTPayload {
  userId: string
  email: string
  iat?: number
  exp?: number
}

export interface DeviceData {
  type: string
  quantity: number
  hoursPerDay: number
  powerConsumption: number
}

export interface CalculatorData {
  category: 'HOME' | 'BUSINESS' | 'FARM'
  location: string
  sunlightHours: number
  devices: DeviceData[]
}

export interface SolarCalculationResult {
  energyDemand: number
  panelSize: number
  batteryCapacity: number
  inverterSize: number
  upfrontCost: number
  annualSavings: number
  batteryReplacementCost: number
  paybackPeriod: number
  roi: number
  co2Reduction: number
  costBreakdown: {
    panels: number
    battery: number
    inverter: number
    installation: number
  }
  financingOptions: any
  governmentIncentive: number
}

export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  error?: string
  errors?: any[]
}

export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}