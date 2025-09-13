import { User } from '@prisma/client'
import prisma from '@/config/database'
import { hashPassword, verifyPassword } from '@/utils/password'
import { generateTokenPair } from '@/utils/jwt'
import { v4 as uuidv4 } from 'uuid'

export interface RegisterData {
  email: string
  password: string
  name?: string
  phone?: string
}

export interface LoginData {
  email: string
  password: string
}

export interface AuthResult {
  user: Omit<User, 'passwordHash'>
  accessToken: string
  refreshToken: string
}

export class AuthService {
  async register(data: RegisterData): Promise<AuthResult> {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    })

    if (existingUser) {
      throw new Error('User already exists with this email')
    }

    // Hash password
    const passwordHash = await hashPassword(data.password)

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        name: data.name,
        phone: data.phone,
      }
    })

    // Generate tokens
    const tokenPayload = { userId: user.id, email: user.email }
    const { accessToken, refreshToken } = generateTokenPair(tokenPayload)

    // Store refresh token
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      }
    })

    // Remove password hash from response
    const { passwordHash: _, ...userWithoutPassword } = user

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    }
  }

  async login(data: LoginData): Promise<AuthResult> {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: data.email }
    })

    if (!user || !user.passwordHash) {
      throw new Error('Invalid email or password')
    }

    // Verify password
    const isPasswordValid = await verifyPassword(data.password, user.passwordHash)

    if (!isPasswordValid) {
      throw new Error('Invalid email or password')
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    })

    // Generate tokens
    const tokenPayload = { userId: user.id, email: user.email }
    const { accessToken, refreshToken } = generateTokenPair(tokenPayload)

    // Store refresh token
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      }
    })

    // Remove password hash from response
    const { passwordHash: _, ...userWithoutPassword } = user

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    }
  }

  async refreshTokens(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    // Find refresh token in database
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true }
    })

    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new Error('Invalid or expired refresh token')
    }

    // Generate new tokens
    const tokenPayload = { userId: storedToken.user.id, email: storedToken.user.email }
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateTokenPair(tokenPayload)

    // Replace old refresh token with new one
    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: {
        token: newRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      }
    })

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    }
  }

  async logout(refreshToken: string): Promise<void> {
    // Remove refresh token from database
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken }
    })
  }

  async logoutAllDevices(userId: string): Promise<void> {
    // Remove all refresh tokens for user
    await prisma.refreshToken.deleteMany({
      where: { userId }
    })
  }

  async updateProfile(userId: string, data: { name?: string; phone?: string; preferences?: any }) {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        phone: data.phone,
        preferences: data.preferences,
        updatedAt: new Date(),
      },
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

    return updatedUser
  }
}