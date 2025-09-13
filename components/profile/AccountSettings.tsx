'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth.tsx'
import { Settings, Download, Upload, Trash2, AlertTriangle, CheckCircle } from 'lucide-react'

interface User {
  id: string
  email: string
  name?: string
  emailVerified: boolean
}

interface AccountSettingsProps {
  user: User
}

export default function AccountSettings({ user }: AccountSettingsProps) {
  const { logout } = useAuth()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')

  const handleExportData = async () => {
    setIsExporting(true)
    // Simulate export delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Create and download mock data
    const data = {
      user: user,
      plans: [], // Would fetch actual plans
      preferences: {},
      exportDate: new Date().toISOString(),
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `solarafrica-data-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    setIsExporting(false)
  }

  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    // Simulate import process
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsImporting(false)
    
    // In real app, would process the file and update user data
    alert('Data import completed successfully!')
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') return
    
    // In real app, would call delete API
    alert('Account deletion requested. You will receive an email confirmation.')
    setShowDeleteConfirm(false)
    setDeleteConfirmText('')
  }

  return (
    <div className="space-y-6">
      {/* Data Management */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Settings className="w-5 h-5 mr-2 text-primary-600" />
          Data Management
        </h3>

        <div className="space-y-4">
          {/* Export Data */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Export Your Data</h4>
              <p className="text-sm text-gray-600">
                Download all your solar plans, preferences, and account data
              </p>
            </div>
            <button
              onClick={handleExportData}
              disabled={isExporting}
              className="btn-primary flex items-center"
            >
              {isExporting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              {isExporting ? 'Exporting...' : 'Export Data'}
            </button>
          </div>

          {/* Import Data */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Import Data</h4>
              <p className="text-sm text-gray-600">
                Restore your data from a previous export file
              </p>
            </div>
            <div>
              <input
                type="file"
                id="import-data"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
              <label
                htmlFor="import-data"
                className={`btn-outline flex items-center cursor-pointer ${
                  isImporting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isImporting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2"></div>
                ) : (
                  <Upload className="w-4 h-4 mr-2" />
                )}
                {isImporting ? 'Importing...' : 'Import Data'}
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Account Verification */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Account Verification</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              {user.emailVerified ? (
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-yellow-500 mr-3" />
              )}
              <div>
                <h4 className="font-medium text-gray-900">Email Verification</h4>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>
            {user.emailVerified ? (
              <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                Verified
              </span>
            ) : (
              <button className="btn-primary">Verify Email</button>
            )}
          </div>
        </div>
      </div>

      {/* Account Activity */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-sm">📊</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Solar plan created</p>
                <p className="text-sm text-gray-600">Home Solar System - 5kW</p>
              </div>
            </div>
            <span className="text-sm text-gray-500">2 days ago</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-sm">👤</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Profile updated</p>
                <p className="text-sm text-gray-600">Phone number added</p>
              </div>
            </div>
            <span className="text-sm text-gray-500">1 week ago</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-sm">🔐</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Password changed</p>
                <p className="text-sm text-gray-600">Security update completed</p>
              </div>
            </div>
            <span className="text-sm text-gray-500">2 weeks ago</span>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Account Actions</h3>
        
        <div className="space-y-4">
          {/* Logout All Devices */}
          <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div>
              <h4 className="font-medium text-yellow-900">Sign Out All Devices</h4>
              <p className="text-sm text-yellow-700">
                End all active sessions on other devices for security
              </p>
            </div>
            <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-medium">
              Sign Out All
            </button>
          </div>

          {/* Delete Account */}
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 mr-3" />
              <div className="flex-1">
                <h4 className="font-medium text-red-900 mb-2">Delete Account</h4>
                <p className="text-sm text-red-700 mb-4">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                
                {!showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium flex items-center"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-red-800 mb-1">
                        Type "DELETE" to confirm:
                      </label>
                      <input
                        type="text"
                        value={deleteConfirmText}
                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                        className="w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                        placeholder="DELETE"
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={handleDeleteAccount}
                        disabled={deleteConfirmText !== 'DELETE'}
                        className={`px-4 py-2 rounded-lg font-medium ${
                          deleteConfirmText === 'DELETE'
                            ? 'bg-red-600 hover:bg-red-700 text-white'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        Confirm Delete
                      </button>
                      <button
                        onClick={() => {
                          setShowDeleteConfirm(false)
                          setDeleteConfirmText('')
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}