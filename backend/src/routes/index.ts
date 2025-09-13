import { Router } from 'express'
import authRoutes from './auth'
import calculatorRoutes from './calculator'
import planRoutes from './plans'

const router = Router()

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'SolarAfrica API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  })
})

// API routes
router.use('/auth', authRoutes)
router.use('/calculator', calculatorRoutes)
router.use('/plans', planRoutes)

export default router