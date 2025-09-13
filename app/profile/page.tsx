'use client'

import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import { useAuth } from '@/lib/auth.tsx'
import { useRouter } from 'next/navigation'
import ProfileHeader from '@/components/profile/ProfileHeader'
import PersonalInfo from '@/components/profile/PersonalInfo'
import SolarStats from '@/components/profile/SolarStats'
import AccountSettings from '@/components/profile/AccountSettings'
import SecuritySettings from '@/components/profile/SecuritySettings'
import Preferences from '@/components/profile/Preferences'

export default function ProfilePage() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('personal')

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth?mode=login')
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    )
  }

  if (!user) {
    return null
  }

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: '👤' },
    { id: 'solar', label: 'Solar Stats', icon: '☀️' },
    { id: 'account', label: 'Account', icon: '⚙️' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'preferences', label: 'Preferences', icon: '🎛️' },
  ]

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Header */}
          <ProfileHeader user={user} />

          {/* Tab Navigation */}
          <div className="mt-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="mt-8">
            {activeTab === 'personal' && <PersonalInfo user={user} />}
            {activeTab === 'solar' && <SolarStats user={user} />}
            {activeTab === 'account' && <AccountSettings user={user} />}
            {activeTab === 'security' && <SecuritySettings user={user} />}
            {activeTab === 'preferences' && <Preferences user={user} />}
          </div>
        </div>
      </div>
    </Layout>
  )
}