'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import api from './api'

interface User {
  id: string
  email: string
  name?: string
  phone?: string
  emailVerified: boolean
  preferences?: any
  provider?: string
  createdAt?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: { email: string; password: string; name?: string; phone?: string }) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (data: { name?: string; phone?: string; preferences?: any }) => Promise<void>
  loginWithGoogle: (user: User) => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on mount
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    try {
      // First check for Google auth user in localStorage
      const savedUser = localStorage.getItem('user')
      const authToken = localStorage.getItem('authToken')
      
      if (savedUser && authToken) {
        const userData = JSON.parse(savedUser)
        setUser(userData)
        setLoading(false)
        return
      }

      // Fallback to API-based auth
      const accessToken = localStorage.getItem('accessToken')
      if (accessToken) {
        api.setAccessToken(accessToken)
        const userData = await api.getProfile()
        setUser(userData)
      }
    } catch (error) {
      // Try to refresh token
      try {
        await api.refreshToken()
        const userData = await api.getProfile()
        setUser(userData)
      } catch {
        // Clear invalid tokens
        api.setAccessToken(null)
        localStorage.removeItem('user')
        localStorage.removeItem('authToken')
      }
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await api.login({ email, password })
      setUser(response.user)
    } catch (error) {
      throw error
    }
  }

  const register = async (data: { email: string; password: string; name?: string; phone?: string }) => {
    try {
      const response = await api.register(data)
      setUser(response.user)
    } catch (error) {
      throw error
    }
  }

  const loginWithGoogle = async (user: User) => {
    try {
      console.log('Setting Google user in auth context:', user.email)
      // Store Google user in localStorage
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('authToken', 'google-auth-token-' + Date.now())
      setUser(user)
      console.log('Google user set successfully')
    } catch (error) {
      console.error('Error in loginWithGoogle:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      // Only call API logout if using API-based auth
      if (localStorage.getItem('accessToken')) {
        await api.logout()
      }
    } catch {
      // Continue with logout even if API call fails
    } finally {
      setUser(null)
      api.setAccessToken(null)
      // Clear Google auth data
      localStorage.removeItem('user')
      localStorage.removeItem('authToken')
    }
  }

  const updateProfile = async (data: { name?: string; phone?: string; preferences?: any }) => {
    try {
      const updatedUser = await api.updateProfile(data)
      setUser(updatedUser)
    } catch (error) {
      throw error
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    loginWithGoogle,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}