import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import config from '@/config'
import routes from '@/routes'
import {
  createRateLimiter,
  corsOptions,
  helmetConfig,
  requestLogger,
  errorHandler,
  notFoundHandler,
} from '@/middleware/security'
import logger from '@/utils/logger'

const app = express()

// Trust proxy for accurate IP addresses when behind reverse proxy
app.set('trust proxy', 1)

// Security middleware
app.use(helmetConfig)
app.use(cors(corsOptions))

// Rate limiting
app.use(createRateLimiter())

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Cookie parsing
app.use(cookieParser(config.cookieSecret))

// Request logging (in development)
if (config.nodeEnv === 'development') {
  app.use(requestLogger)
}

// API routes
app.use('/api', routes)

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'SolarAfrica Planner API',
    version: '1.0.0',
    documentation: '/api/health',
  })
})

// 404 handler
app.use(notFoundHandler)

// Error handling middleware (must be last)
app.use(errorHandler)

// Start server
const startServer = async () => {
  try {
    const server = app.listen(config.port, () => {
      logger.info(`🚀 Server running on port ${config.port}`)
      logger.info(`📝 Environment: ${config.nodeEnv}`)
      logger.info(`🌐 Frontend URL: ${config.frontendUrl}`)
      
      if (config.nodeEnv === 'development') {
        logger.info(`🔍 API Health: http://localhost:${config.port}/api/health`)
        logger.info(`📊 API Docs: http://localhost:${config.port}/api`)
      }
    })

    // Graceful shutdown
    const gracefulShutdown = (signal: string) => {
      logger.info(`Received ${signal}. Starting graceful shutdown...`)
      
      server.close(() => {
        logger.info('HTTP server closed.')
        process.exit(0)
      })

      // Force close server after 30 seconds
      setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down')
        process.exit(1)
      }, 30000)
    }

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
    process.on('SIGINT', () => gracefulShutdown('SIGINT'))

  } catch (error) {
    logger.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()

export default app