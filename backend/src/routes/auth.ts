import { Router } from 'express'
import {
  register,
  login,
  logout,
  refreshToken,
  getProfile,
  updateProfile,
  validateRegister,
  validateLogin,
} from '@/controllers/authController'
import { authenticate } from '@/middleware/auth'

const router = Router()

// Public routes
router.post('/register', validateRegister, register)
router.post('/login', validateLogin, login)
router.post('/refresh', refreshToken)
router.post('/logout', logout)

// Protected routes
router.get('/profile', authenticate, getProfile)
router.put('/profile', authenticate, updateProfile)

export default router