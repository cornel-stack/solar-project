'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth.tsx'
import { Settings, Bell, Globe, Moon, Sun, Palette, Volume2, Mail, MessageSquare, Smartphone } from 'lucide-react'

interface User {
  id: string
  email: string
  name?: string
  preferences?: any
}

interface PreferencesProps {
  user: User
}

export default function Preferences({ user }: PreferencesProps) {
  const { updateProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [preferences, setPreferences] = useState({
    theme: user.preferences?.theme || 'light',
    language: user.preferences?.language || 'en',
    currency: user.preferences?.currency || 'KES',
    timezone: user.preferences?.timezone || 'Africa/Nairobi',
    units: user.preferences?.units || 'metric',
    notifications: {
      email: user.preferences?.notifications?.email !== false,
      push: user.preferences?.notifications?.push !== false,
      sms: user.preferences?.notifications?.sms === true,
      marketing: user.preferences?.notifications?.marketing === true,
      planUpdates: user.preferences?.notifications?.planUpdates !== false,
      achievements: user.preferences?.notifications?.achievements !== false,
      tips: user.preferences?.notifications?.tips !== false,
    },
    privacy: {
      profileVisibility: user.preferences?.privacy?.profileVisibility || 'private',
      showStats: user.preferences?.privacy?.showStats !== false,
      allowMessages: user.preferences?.privacy?.allowMessages !== false,
      dataCollection: user.preferences?.privacy?.dataCollection !== false,
    },
    calculator: {
      defaultCapacity: user.preferences?.calculator?.defaultCapacity || '5',
      includeVAT: user.preferences?.calculator?.includeVAT !== false,
      showDetailed: user.preferences?.calculator?.showDetailed !== false,
      autoSave: user.preferences?.calculator?.autoSave !== false,
    }
  })

  const handlePreferenceChange = (section: string, key: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [section]: section === 'notifications' || section === 'privacy' || section === 'calculator'
        ? { ...prev[section as keyof typeof prev], [key]: value }
        : section === key ? value : prev[section as keyof typeof prev]
    }))
  }

  const handleSavePreferences = async () => {
    setLoading(true)
    try {
      await updateProfile({
        preferences: {
          ...user.preferences,
          ...preferences
        }
      })
      alert('Preferences saved successfully!')
    } catch (error) {
      console.error('Failed to save preferences:', error)
      alert('Failed to save preferences. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const themes = [
    { id: 'light', name: 'Light', icon: Sun, description: 'Clean and bright interface' },
    { id: 'dark', name: 'Dark', icon: Moon, description: 'Easy on the eyes' },
    { id: 'auto', name: 'Auto', icon: Settings, description: 'Follow system preference' }
  ]

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'sw', name: 'Kiswahili', flag: '🇰🇪' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }
  ]

  const currencies = [
    { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh' },
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GHS', name: 'Ghanaian Cedi', symbol: '₵' },
    { code: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
    { code: 'ZAR', name: 'South African Rand', symbol: 'R' }
  ]

  return (
    <div className="space-y-6">
      {/* Appearance Settings */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Palette className="w-5 h-5 mr-2 text-primary-600" />
          Appearance
        </h3>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Theme</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => handlePreferenceChange('theme', 'theme', theme.id)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    preferences.theme === theme.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <theme.icon className="w-5 h-5 mr-2 text-primary-600" />
                    <span className="font-medium">{theme.name}</span>
                  </div>
                  <p className="text-sm text-gray-600">{theme.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select
                value={preferences.language}
                onChange={(e) => handlePreferenceChange('language', 'language', e.target.value)}
                className="input"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
              <select
                value={preferences.currency}
                onChange={(e) => handlePreferenceChange('currency', 'currency', e.target.value)}
                className="input"
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.symbol} {currency.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Bell className="w-5 h-5 mr-2 text-primary-600" />
          Notifications
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Mail className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <h4 className="font-medium text-gray-900">Email Notifications</h4>
                <p className="text-sm text-gray-600">Receive updates via email</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.notifications.email}
                onChange={(e) => handlePreferenceChange('notifications', 'email', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Smartphone className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <h4 className="font-medium text-gray-900">Push Notifications</h4>
                <p className="text-sm text-gray-600">Get notified on your devices</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.notifications.push}
                onChange={(e) => handlePreferenceChange('notifications', 'push', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <MessageSquare className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <h4 className="font-medium text-gray-900">SMS Notifications</h4>
                <p className="text-sm text-gray-600">Important updates via text</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.notifications.sms}
                onChange={(e) => handlePreferenceChange('notifications', 'sms', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-900 mb-3">Notification Types</h4>
            <div className="space-y-3">
              {[
                { key: 'planUpdates', label: 'Plan Updates', description: 'When your solar plans are updated' },
                { key: 'achievements', label: 'Achievements', description: 'When you earn new badges' },
                { key: 'tips', label: 'Solar Tips', description: 'Educational content and tips' },
                { key: 'marketing', label: 'Marketing', description: 'Promotional content and offers' }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.notifications[item.key as keyof typeof preferences.notifications]}
                      onChange={(e) => handlePreferenceChange('notifications', item.key, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Globe className="w-5 h-5 mr-2 text-primary-600" />
          Privacy & Data
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Visibility</label>
            <select
              value={preferences.privacy.profileVisibility}
              onChange={(e) => handlePreferenceChange('privacy', 'profileVisibility', e.target.value)}
              className="input"
            >
              <option value="private">Private - Only you can see your profile</option>
              <option value="friends">Friends - People you connect with</option>
              <option value="public">Public - Anyone can see your profile</option>
            </select>
          </div>

          <div className="space-y-3">
            {[
              { key: 'showStats', label: 'Show Statistics', description: 'Display your solar stats publicly' },
              { key: 'allowMessages', label: 'Allow Messages', description: 'Let others contact you' },
              { key: 'dataCollection', label: 'Data Collection', description: 'Help improve our services with usage data' }
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{item.label}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.privacy[item.key as keyof typeof preferences.privacy]}
                    onChange={(e) => handlePreferenceChange('privacy', item.key, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Calculator Preferences */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Settings className="w-5 h-5 mr-2 text-primary-600" />
          Calculator Preferences
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Default System Capacity (kW)</label>
            <select
              value={preferences.calculator.defaultCapacity}
              onChange={(e) => handlePreferenceChange('calculator', 'defaultCapacity', e.target.value)}
              className="input"
            >
              <option value="3">3 kW - Small Home</option>
              <option value="5">5 kW - Medium Home</option>
              <option value="7">7 kW - Large Home</option>
              <option value="10">10 kW - Small Business</option>
              <option value="15">15 kW - Medium Business</option>
            </select>
          </div>

          <div className="space-y-3">
            {[
              { key: 'includeVAT', label: 'Include VAT in Calculations', description: 'Show prices with tax included' },
              { key: 'showDetailed', label: 'Show Detailed Breakdown', description: 'Display component-level costs' },
              { key: 'autoSave', label: 'Auto-save Calculations', description: 'Automatically save your calculations' }
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{item.label}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.calculator[item.key as keyof typeof preferences.calculator]}
                    onChange={(e) => handlePreferenceChange('calculator', item.key, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="card">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-medium text-gray-900">Save Changes</h4>
            <p className="text-sm text-gray-600">Your preferences will be applied immediately</p>
          </div>
          <button
            onClick={handleSavePreferences}
            disabled={loading}
            className="btn-primary flex items-center"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Settings className="w-4 h-4 mr-2" />
            )}
            {loading ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </div>
    </div>
  )
}