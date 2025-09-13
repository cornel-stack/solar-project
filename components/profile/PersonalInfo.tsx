'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth.tsx'
import { Edit, Save, X, Mail, Phone, User, MapPin, Calendar } from 'lucide-react'

interface User {
  id: string
  email: string
  name?: string
  phone?: string
  emailVerified: boolean
  createdAt: string
  preferences?: any
}

interface PersonalInfoProps {
  user: User
}

export default function PersonalInfo({ user }: PersonalInfoProps) {
  const { updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user.name || '',
    phone: user.phone || '',
    location: user.preferences?.location || '',
    bio: user.preferences?.bio || '',
    company: user.preferences?.company || '',
    website: user.preferences?.website || '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      await updateProfile({
        name: formData.name,
        phone: formData.phone,
        preferences: {
          ...user.preferences,
          location: formData.location,
          bio: formData.bio,
          company: formData.company,
          website: formData.website,
        },
      })
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      phone: user.phone || '',
      location: user.preferences?.location || '',
      bio: user.preferences?.bio || '',
      company: user.preferences?.company || '',
      website: user.preferences?.website || '',
    })
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      {/* Basic Information Card */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <User className="w-5 h-5 mr-2 text-primary-600" />
            Personal Information
          </h3>
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="btn-outline flex items-center px-4 py-2"
                >
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="btn-primary flex items-center px-4 py-2"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                  ) : (
                    <Save className="w-4 h-4 mr-1" />
                  )}
                  Save
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-outline flex items-center px-4 py-2"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="input"
                placeholder="Enter your full name"
              />
            ) : (
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <User className="w-4 h-4 text-gray-400 mr-2" />
                <span>{user.name || 'Not provided'}</span>
              </div>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="input"
                placeholder="Enter your phone number"
              />
            ) : (
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Phone className="w-4 h-4 text-gray-400 mr-2" />
                <span>{user.phone || 'Not provided'}</span>
              </div>
            )}
          </div>

          {/* Email (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <Mail className="w-4 h-4 text-gray-400 mr-2" />
              <span>{user.email}</span>
              {user.emailVerified && (
                <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  Verified
                </span>
              )}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            {isEditing ? (
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="input"
                placeholder="City, Country"
              />
            ) : (
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                <span>{user.preferences?.location || 'Not provided'}</span>
              </div>
            )}
          </div>
        </div>

        {/* Bio */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bio
          </label>
          {isEditing ? (
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={3}
              className="input resize-none"
              placeholder="Tell us about yourself and your solar journey..."
            />
          ) : (
            <div className="p-3 bg-gray-50 rounded-lg min-h-[80px]">
              <p className="text-gray-700">
                {user.preferences?.bio || 'No bio provided yet. Share your solar energy story!'}
              </p>
            </div>
          )}
        </div>

        {/* Professional Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company/Organization
            </label>
            {isEditing ? (
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className="input"
                placeholder="Your company name"
              />
            ) : (
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <span>🏢</span>
                <span className="ml-2">{user.preferences?.company || 'Not provided'}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website
            </label>
            {isEditing ? (
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="input"
                placeholder="https://yourwebsite.com"
              />
            ) : (
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <span>🌐</span>
                {user.preferences?.website ? (
                  <a
                    href={user.preferences.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-primary-600 hover:underline"
                  >
                    {user.preferences.website}
                  </a>
                ) : (
                  <span className="ml-2">Not provided</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Account Information Card */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-primary-600" />
          Account Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Created
            </label>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-4 h-4 text-gray-400 mr-2" />
              <span>{new Date(user.createdAt).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Status
            </label>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
              <span>Active</span>
              {user.emailVerified && (
                <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  Email Verified
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}