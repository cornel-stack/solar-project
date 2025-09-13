'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import AuthForm from '@/components/AuthForm'
import { useAuth } from '@/lib/auth.tsx'

export default function AuthPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { loginWithGoogle } = useAuth()
  const [mode, setMode] = useState<'login' | 'signup'>('signup')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const urlMode = searchParams.get('mode')
    if (urlMode === 'login' || urlMode === 'signup') {
      setMode(urlMode)
    }

    // Handle OAuth callback
    const handleOAuthCallback = async () => {
      const success = searchParams.get('success')
      const data = searchParams.get('data')
      const error = searchParams.get('error')

      // If no OAuth parameters, just stop loading
      if (!success && !data && !error) {
        setLoading(false)
        return
      }

      if (error) {
        console.error('OAuth error received:', error)
        setError(decodeURIComponent(error))
        setLoading(false)
        // Clear URL parameters after a delay
        setTimeout(() => {
          router.replace('/auth')
        }, 3000)
        return
      }

      if (success === 'true' && data) {
        try {
          setLoading(true)
          const authData = JSON.parse(decodeURIComponent(data))

          console.log('Processing OAuth success:', authData.user.email)

          // Store tokens and user data
          localStorage.setItem('accessToken', authData.accessToken)

          // Update API client with access token
          const { api } = await import('@/lib/api')
          api.setAccessToken(authData.accessToken)

          await loginWithGoogle(authData.user)

          console.log('OAuth login successful, redirecting to dashboard')

          // Clear URL parameters and redirect
          router.replace('/dashboard')
        } catch (err: any) {
          console.error('OAuth callback error:', err)
          setError('Failed to process authentication data')
          setLoading(false)
        }
      }
    }

    handleOAuthCallback()
  }, [searchParams, router, loginWithGoogle])

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Processing authentication...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Left side - Form */}
        <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
            <AuthForm mode={mode} onModeChange={setMode} />
          </div>
        </div>

        {/* Right side - African family illustration */}
        <div className="hidden lg:block relative w-0 flex-1">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center">
            {/* African Family with Solar Lights Illustration */}
            <div className="relative max-w-md w-full h-96 mx-8">
              {/* Background shapes */}
              <div className="absolute inset-0 bg-gradient-to-b from-yellow-400 via-orange-500 to-red-600 rounded-full opacity-20 transform rotate-12"></div>
              <div className="absolute top-10 right-10 w-20 h-20 bg-yellow-300 rounded-full opacity-30"></div>
              <div className="absolute bottom-10 left-10 w-16 h-16 bg-orange-400 rounded-full opacity-25"></div>
              
              {/* Family silhouettes */}
              <div className="relative z-10 flex items-end justify-center h-full">
                {/* Father */}
                <div className="relative mr-4">
                  <div className="w-16 h-20 bg-gradient-to-b from-yellow-600 to-orange-700 rounded-t-full"></div>
                  <div className="w-12 h-12 bg-yellow-800 rounded-full mx-auto -mt-2"></div>
                  {/* Solar light */}
                  <div className="absolute -top-8 -left-2 w-6 h-12 bg-gray-300 rounded-sm">
                    <div className="w-4 h-4 bg-yellow-300 rounded-full mx-auto mt-1 animate-pulse"></div>
                  </div>
                </div>
                
                {/* Mother */}
                <div className="relative mr-4">
                  <div className="w-14 h-18 bg-gradient-to-b from-orange-500 to-red-600 rounded-t-full"></div>
                  <div className="w-10 h-10 bg-orange-800 rounded-full mx-auto -mt-2"></div>
                  {/* Solar light */}
                  <div className="absolute -top-6 -right-2 w-6 h-12 bg-gray-300 rounded-sm">
                    <div className="w-4 h-4 bg-yellow-300 rounded-full mx-auto mt-1 animate-pulse"></div>
                  </div>
                </div>
                
                {/* Child */}
                <div className="relative">
                  <div className="w-10 h-12 bg-gradient-to-b from-green-500 to-blue-600 rounded-t-full"></div>
                  <div className="w-8 h-8 bg-green-800 rounded-full mx-auto -mt-1"></div>
                  {/* Solar light */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-4 h-8 bg-gray-300 rounded-sm">
                    <div className="w-3 h-3 bg-yellow-300 rounded-full mx-auto mt-1 animate-pulse"></div>
                  </div>
                </div>
              </div>
              
              {/* Quote */}
              <div className="absolute bottom-0 left-0 right-0 text-center">
                <p className="text-white text-lg font-medium mb-2">
                  &quot;Bringing light to every home&quot;
                </p>
                <p className="text-blue-200 text-sm">
                  Financial modeling for solar energy adoption in Africa
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}