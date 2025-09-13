import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '@/utils/jwt'
import { AuthRequest } from '@/types'
import { sendError } from '@/utils/response'
import prisma from '@/config/database'
import logger from '@/utils/logger'

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendError(res, 'Authentication required', 401)
      return
    }

    const token = authHeader.split(' ')[1]
    
    if (!token) {
      sendError(res, 'Authentication token required', 401)
      return
    }

    try {
      const payload = verifyAccessToken(token)
      
      // Fetch user from database
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
          preferences: true,
        }
      })

      if (!user) {
        sendError(res, 'User not found', 401)
        return
      }

      req.user = user
      next()
    } catch (jwtError) {
      sendError(res, 'Invalid authentication token', 401)
      return
    }
  } catch (error) {
    logger.error('Authentication middleware error:', error)
    sendError(res, 'Authentication failed', 500)
    return
  }
}

export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1]
      
      if (token) {
        try {
          const payload = verifyAccessToken(token)
          const user = await prisma.user.findUnique({
            where: { id: payload.userId },
            select: {
              id: true,
              email: true,
              name: true,
              phone: true,
              emailVerified: true,
              createdAt: true,
              updatedAt: true,
              preferences: true,
            }
          })
          
          if (user) {
            req.user = user
          }
        } catch (jwtError) {
          // Silently ignore invalid tokens for optional auth
        }
      }
    }
    
    next()
  } catch (error) {
    logger.error('Optional auth middleware error:', error)
    next()
  }
}