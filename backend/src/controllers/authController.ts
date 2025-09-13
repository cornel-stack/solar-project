import { Request, Response } from 'express'
import { AuthService } from '@/services/authService'
import { sendSuccess, sendError, sendValidationError } from '@/utils/response'
import logger from '@/utils/logger'
import { body, validationResult } from 'express-validator'
import passport from 'passport'
import { generateTokenPair } from '@/utils/jwt'

const authService = new AuthService()

export const validateRegister = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('name').optional().trim().isLength({ min: 1 }).withMessage('Name cannot be empty'),
  body('phone').optional().trim().isLength({ min: 1 }).withMessage('Phone cannot be empty'),
]

export const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
]

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      sendValidationError(res, errors.array())
      return
    }

    const { email, password, name, phone } = req.body
    const result = await authService.register({ email, password, name, phone })

    // Set refresh token in httpOnly cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    sendSuccess(res, {
      user: result.user,
      accessToken: result.accessToken,
    }, 'User registered successfully', 201)
  } catch (error: any) {
    logger.error('Register error:', error)
    sendError(res, error.message || 'Registration failed', 400)
  }
}

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      sendValidationError(res, errors.array())
      return
    }

    const { email, password } = req.body
    const result = await authService.login({ email, password })

    // Set refresh token in httpOnly cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    sendSuccess(res, {
      user: result.user,
      accessToken: result.accessToken,
    }, 'Login successful')
  } catch (error: any) {
    logger.error('Login error:', error)
    sendError(res, error.message || 'Login failed', 400)
  }
}

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!refreshToken) {
      sendError(res, 'Refresh token is required', 401)
      return
    }

    const result = await authService.refreshTokens(refreshToken)

    // Set new refresh token in httpOnly cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    sendSuccess(res, {
      accessToken: result.accessToken,
    }, 'Token refreshed successfully')
  } catch (error: any) {
    logger.error('Refresh token error:', error)
    sendError(res, error.message || 'Token refresh failed', 401)
  }
}

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (refreshToken) {
      await authService.logout(refreshToken)
    }

    // Clear refresh token cookie
    res.clearCookie('refreshToken')

    sendSuccess(res, null, 'Logout successful')
  } catch (error: any) {
    logger.error('Logout error:', error)
    sendError(res, error.message || 'Logout failed', 400)
  }
}

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'User not found', 404)
      return
    }

    sendSuccess(res, req.user, 'Profile retrieved successfully')
  } catch (error: any) {
    logger.error('Get profile error:', error)
    sendError(res, error.message || 'Failed to get profile', 400)
  }
}

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'User not found', 404)
      return
    }

    const { name, phone, preferences } = req.body

    const updatedUser = await authService.updateProfile(req.user.id, {
      name,
      phone,
      preferences,
    })

    sendSuccess(res, updatedUser, 'Profile updated successfully')
  } catch (error: any) {
    logger.error('Update profile error:', error)
    sendError(res, error.message || 'Failed to update profile', 400)
  }
}

// Google OAuth routes
export const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email']
})

export const googleCallback = (req: Request, res: Response): void => {
  passport.authenticate('google', { session: false }, async (err: any, user: any, info: any) => {
    try {
      if (err) {
        logger.error('Google auth error:', err)
        return res.redirect(`${process.env.FRONTEND_URL}/auth?error=${encodeURIComponent(err.message || 'Google authentication failed')}`)
      }

      if (!user) {
        logger.error('Google auth failed: No user returned', { info })
        return res.redirect(`${process.env.FRONTEND_URL}/auth?error=${encodeURIComponent('Google authentication failed - no user data received')}`)
      }

      // Generate JWT tokens for the user
      const tokenPayload = { userId: user.id, email: user.email }
      const { accessToken, refreshToken } = generateTokenPair(tokenPayload)

      // Store refresh token in database
      await authService.storeRefreshToken(refreshToken, user.id)

      // Set refresh token in httpOnly cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })

      // Remove sensitive data from user object
      const { passwordHash, ...userWithoutPassword } = user

      // Redirect to frontend with success and user data
      const userData = encodeURIComponent(JSON.stringify({
        user: userWithoutPassword,
        accessToken
      }))

      logger.info('Google auth successful for user:', user.email)
      res.redirect(`${process.env.FRONTEND_URL}/auth?success=true&data=${userData}`)
    } catch (error: any) {
      logger.error('Google callback processing error:', error)
      res.redirect(`${process.env.FRONTEND_URL}/auth?error=${encodeURIComponent('Authentication processing failed')}`)
    }
  })(req, res)
}