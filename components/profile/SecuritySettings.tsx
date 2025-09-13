'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth.tsx'
import { Shield, Lock, Smartphone, Key, AlertTriangle, CheckCircle, Eye, EyeOff } from 'lucide-react'

interface User {
  id: string
  email: string
  name?: string
  emailVerified: boolean
}

interface SecuritySettingsProps {
  user: User
}

export default function SecuritySettings({ user }: SecuritySettingsProps) {
  const { logout } = useAuth()
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [sessions] = useState([
    {
      id: 1,
      device: 'Windows PC',
      browser: 'Chrome',
      location: 'Nairobi, Kenya',
      lastActive: '2 minutes ago',
      current: true
    },
    {
      id: 2,
      device: 'iPhone 14',
      browser: 'Safari',
      location: 'Nairobi, Kenya',
      lastActive: '2 hours ago',
      current: false
    },
    {
      id: 3,
      device: 'MacBook Pro',
      browser: 'Firefox',
      location: 'Lagos, Nigeria',
      lastActive: '3 days ago',
      current: false
    }
  ])

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match')
      return
    }
    
    setIsChangingPassword(true)
    // Simulate password change
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsChangingPassword(false)
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    alert('Password changed successfully!')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    })
  }

  const handleEndSession = (sessionId: number) => {
    alert(`Session ${sessionId} ended successfully`)
  }

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: '', color: '' }
    if (password.length < 6) return { strength: 25, label: 'Weak', color: 'bg-red-500' }
    if (password.length < 10) return { strength: 50, label: 'Fair', color: 'bg-yellow-500' }
    if (password.length < 12) return { strength: 75, label: 'Good', color: 'bg-blue-500' }
    return { strength: 100, label: 'Strong', color: 'bg-green-500' }
  }

  const passwordStrength = getPasswordStrength(passwordForm.newPassword)

  return (
    <div className="space-y-6">
      {/* Password Security */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Lock className="w-5 h-5 mr-2 text-primary-600" />
          Password Security
        </h3>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handleInputChange}
                className="input pr-10"
                placeholder="Enter current password"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showCurrentPassword ? (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                ) : (
                  <Eye className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handleInputChange}
                className="input pr-10"
                placeholder="Enter new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showNewPassword ? (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                ) : (
                  <Eye className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </div>
            {passwordForm.newPassword && (
              <div className="mt-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Password Strength</span>
                  <span className={`font-medium ${
                    passwordStrength.strength >= 75 ? 'text-green-600' :
                    passwordStrength.strength >= 50 ? 'text-blue-600' :
                    passwordStrength.strength >= 25 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${passwordStrength.color}`}
                    style={{ width: `${passwordStrength.strength}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handleInputChange}
                className="input pr-10"
                placeholder="Confirm new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                ) : (
                  <Eye className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isChangingPassword}
            className="btn-primary flex items-center"
          >
            {isChangingPassword ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Key className="w-4 h-4 mr-2" />
            )}
            {isChangingPassword ? 'Changing Password...' : 'Change Password'}
          </button>
        </form>
      </div>

      {/* Two-Factor Authentication */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Shield className="w-5 h-5 mr-2 text-primary-600" />
          Two-Factor Authentication
        </h3>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            {twoFactorEnabled ? (
              <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-yellow-500 mr-3" />
            )}
            <div>
              <h4 className="font-medium text-gray-900">
                {twoFactorEnabled ? 'Two-Factor Authentication Enabled' : 'Two-Factor Authentication Disabled'}
              </h4>
              <p className="text-sm text-gray-600">
                {twoFactorEnabled 
                  ? 'Your account is protected with 2FA using an authenticator app'
                  : 'Add an extra layer of security to your account'
                }
              </p>
            </div>
          </div>
          <button
            onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
            className={`px-4 py-2 rounded-lg font-medium ${
              twoFactorEnabled 
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
          </button>
        </div>

        {!twoFactorEnabled && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start">
              <Smartphone className="w-5 h-5 text-blue-500 mt-0.5 mr-3" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Recommended</h4>
                <p className="text-sm text-blue-700">
                  Use an authenticator app like Google Authenticator or Authy for the best security.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Active Sessions */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Active Sessions</h3>
        
        <div className="space-y-4">
          {sessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  {session.device.includes('iPhone') ? '📱' : 
                   session.device.includes('Mac') ? '💻' : '🖥️'}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-gray-900">{session.device}</h4>
                    {session.current && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {session.browser} • {session.location}
                  </p>
                  <p className="text-xs text-gray-500">Last active: {session.lastActive}</p>
                </div>
              </div>
              {!session.current && (
                <button
                  onClick={() => handleEndSession(session.id)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  End Session
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={() => alert('All other sessions ended')}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium"
          >
            End All Other Sessions
          </button>
        </div>
      </div>

      {/* Security Recommendations */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Security Recommendations</h3>
        
        <div className="space-y-4">
          <div className="flex items-start p-4 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3" />
            <div>
              <h4 className="font-medium text-green-900">Strong Password</h4>
              <p className="text-sm text-green-700">Your password meets security requirements</p>
            </div>
          </div>

          <div className="flex items-start p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 mr-3" />
            <div>
              <h4 className="font-medium text-yellow-900">Email Verification</h4>
              <p className="text-sm text-yellow-700">
                {user.emailVerified 
                  ? 'Your email is verified and secure'
                  : 'Please verify your email address for better security'
                }
              </p>
            </div>
          </div>

          {!twoFactorEnabled && (
            <div className="flex items-start p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Shield className="w-5 h-5 text-blue-500 mt-0.5 mr-3" />
              <div>
                <h4 className="font-medium text-blue-900">Enable Two-Factor Authentication</h4>
                <p className="text-sm text-blue-700">
                  Add an extra layer of security to protect your account
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}