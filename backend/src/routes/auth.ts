import { Router, RequestHandler } from 'express'
import {
  register,
  login,
  logout,
  refreshToken,
  getProfile,
  updateProfile,
  validateRegister,
  validateLogin,
  googleAuth,
  googleCallback,
} from '@/controllers/authController'
import { authenticate } from '@/middleware/auth'

const router = Router()

// Public routes
router.post('/register', validateRegister, register)
router.post('/login', validateLogin, login)
router.post('/refresh', refreshToken)
router.post('/logout', logout)

// Google OAuth routes
router.get('/google', googleAuth)
router.get('/google/callback', googleCallback)

// Protected routes
router.get('/profile', authenticate as RequestHandler, getProfile as RequestHandler)
router.put('/profile', authenticate as RequestHandler, updateProfile as RequestHandler)

export default router