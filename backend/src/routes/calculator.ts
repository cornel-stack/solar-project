import { Router } from 'express'
import {
  calculateSolarSystem,
  getDeviceCatalog,
  getLocationSunlightData,
  validateCalculation,
} from '@/controllers/calculatorController'
import { optionalAuth } from '@/middleware/auth'

const router = Router()

// Public routes (with optional auth for tracking)
router.post('/calculate', optionalAuth, validateCalculation, calculateSolarSystem)
router.get('/devices', getDeviceCatalog)
router.get('/sunlight', getLocationSunlightData)

export default router