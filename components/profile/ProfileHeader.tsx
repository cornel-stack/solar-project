'use client'

import { useState } from 'react'
import { Camera, MapPin, Calendar, Award, Zap } from 'lucide-react'

interface User {
  id: string
  email: string
  name?: string
  phone?: string
  emailVerified: boolean
  createdAt: string
  preferences?: any
}

interface ProfileHeaderProps {
  user: User
  onTabChange?: (tab: string) => void
}

export default function ProfileHeader({ user, onTabChange }: ProfileHeaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsUploading(false)
    // In real app, upload to server here
  }

  const memberSince = new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  })

  const handleViewAchievements = () => {
    if (onTabChange) {
      onTabChange('solar')
    }
  }

  const handleExportData = async () => {
    setIsExporting(true)
    // Simulate export delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Create and download comprehensive user data
    const data = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        preferences: user.preferences
      },
      solarPlans: [
        {
          id: 1,
          name: "Home Solar System - 5kW",
          capacity: 5,
          estimatedCost: 450000,
          estimatedSavings: 4200,
          createdAt: "2024-01-15"
        },
        {
          id: 2,
          name: "Business Solar Setup - 10kW",
          capacity: 10,
          estimatedCost: 850000,
          estimatedSavings: 8300,
          createdAt: "2024-03-20"
        }
      ],
      achievements: [
        { title: "First Solar Plan", earned: true, date: "2024-01-15" },
        { title: "Green Pioneer", earned: true, date: "2024-03-20" },
        { title: "Carbon Warrior", earned: true, date: "2024-05-10" }
      ],
      stats: {
        totalPlans: 3,
        totalCapacity: 15.2,
        estimatedSavings: 12500,
        co2Reduction: 8500
      },
      exportDate: new Date().toISOString(),
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `solarafrica-profile-data-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    setIsExporting(false)
  }

  return (
    <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 rounded-2xl shadow-xl overflow-hidden">
      <div className="px-8 py-12 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 w-32 h-32 bg-white rounded-full"></div>
          <div className="absolute bottom-4 left-4 w-24 h-24 bg-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white rounded-full"></div>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
          {/* Avatar Section */}
          <div className="relative group">
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-4xl font-bold text-gray-700 shadow-lg">
              {user.name ? getInitials(user.name) : '👤'}
            </div>
            
            {/* Camera Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <label htmlFor="avatar-upload" className="cursor-pointer">
                {isUploading ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                ) : (
                  <Camera className="w-8 h-8 text-white" />
                )}
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>

            {/* Status Badge */}
            <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
              {user.emailVerified ? (
                <>
                  <Award className="w-3 h-3" />
                  <span>Verified</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                  <span>Pending</span>
                </>
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {user.name || 'Solar Enthusiast'}
            </h1>
            <p className="text-xl text-green-100 mb-4">{user.email}</p>
            
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-2 md:space-y-0 md:space-x-6 text-green-100">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Member since {memberSince}</span>
              </div>
              {user.phone && (
                <div className="flex items-center space-x-2">
                  <span>📱</span>
                  <span>{user.phone}</span>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-green-400 border-opacity-30">
              <div className="text-center">
                <div className="text-2xl font-bold">3</div>
                <div className="text-sm text-green-200">Solar Plans</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold flex items-center justify-center">
                  <Zap className="w-6 h-6 mr-1" />
                  15kW
                </div>
                <div className="text-sm text-green-200">Total Capacity</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">$12,500</div>
                <div className="text-sm text-green-200">Est. Savings</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-3">
            <button 
              onClick={handleViewAchievements}
              className="bg-white text-gray-800 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center space-x-2"
            >
              <span>🏆</span>
              <span>View Achievements</span>
            </button>
            <button 
              onClick={handleExportData}
              disabled={isExporting}
              className="border-2 border-white text-white px-6 py-2 rounded-lg font-medium hover:bg-white hover:text-gray-800 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <span>📊</span>
              )}
              <span>{isExporting ? 'Exporting...' : 'Export Data'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}