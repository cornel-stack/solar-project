'use client'

import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import Link from 'next/link'
import { useAuth } from '@/lib/auth.tsx'
import { useRouter } from 'next/navigation'
import { Edit, Download, Share, Plus, Trash2, Calendar, DollarSign, Zap } from 'lucide-react'

export default function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [savedPlans, setSavedPlans] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth?mode=login')
      return
    }

    if (isAuthenticated) {
      loadSavedPlans()
    }
  }, [isAuthenticated, loading, router])

  const loadSavedPlans = () => {
    try {
      const plans = JSON.parse(localStorage.getItem('solarPlans') || '[]')
      setSavedPlans(plans.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
    } catch (error) {
      console.error('Failed to load plans:', error)
      setSavedPlans([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeletePlan = (planId: number) => {
    if (confirm('Are you sure you want to delete this plan?')) {
      const updatedPlans = savedPlans.filter(plan => plan.id !== planId)
      localStorage.setItem('solarPlans', JSON.stringify(updatedPlans))
      setSavedPlans(updatedPlans)
    }
  }

  const handleSharePlan = (plan: any) => {
    const shareData = {
      title: `Solar Plan: ${plan.name}`,
      text: `Check out my ${plan.panelSize}kW solar system plan with ${plan.paybackPeriod} year payback and $${plan.annualSavings?.toLocaleString()} annual savings!`,
      url: window.location.href
    }

    if (navigator.share) {
      navigator.share(shareData)
    } else {
      navigator.clipboard.writeText(`${shareData.text}`)
      alert('Plan details copied to clipboard!')
    }
  }

  const handleDownloadPlan = (plan: any) => {
    const dataStr = JSON.stringify(plan, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `${plan.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_solar_plan.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  if (loading || isLoading) {
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

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="card mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Your Solar Plans
                </h1>
                <p className="text-gray-600">
                  Manage and track your solar energy projects
                </p>
              </div>
              <Link 
                href="/calculator"
                className="btn-primary inline-flex items-center mt-4 md:mt-0"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Plan
              </Link>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedPlans.map((plan) => (
              <div key={plan.id} className="card hover:shadow-xl transition-shadow duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-gray-600 capitalize">
                      {plan.category} • {plan.location}
                    </p>
                  </div>
                  <div className="flex space-x-1">
                    <button 
                      onClick={() => handleDownloadPlan(plan)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                      title="Download Plan"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleSharePlan(plan)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                      title="Share Plan"
                    >
                      <Share className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeletePlan(plan.id)}
                      className="p-2 text-red-400 hover:text-red-600"
                      title="Delete Plan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <Zap className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-blue-900">{plan.panelSize}kW</div>
                    <div className="text-xs text-blue-700">Solar Panels</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <DollarSign className="w-5 h-5 text-green-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-green-900">
                      {plan.paybackPeriod ? `${plan.paybackPeriod}y` : 'N/A'}
                    </div>
                    <div className="text-xs text-green-700">Payback</div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">System Cost</span>
                    <span className="font-semibold">${plan.netUpfrontCost?.toLocaleString() || plan.upfrontCost?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Annual Savings</span>
                    <span className="font-semibold text-green-600">
                      ${plan.annualSavings?.toLocaleString() || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ROI (20-year)</span>
                    <span className="font-semibold text-blue-600">
                      {plan.roi ? `${plan.roi}%` : 'N/A'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Calendar className="w-4 h-4 mr-1" />
                  Created {new Date(plan.createdAt).toLocaleDateString()}
                </div>

                <Link 
                  href={`/calculator?load=${plan.id}`}
                  className="btn-primary w-full inline-block text-center"
                >
                  View & Edit Plan
                </Link>
              </div>
            ))}
          </div>

          {savedPlans.length === 0 && (
            <div className="card text-center py-12">
              <div className="text-gray-400 mb-4">
                <Plus className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Solar Plans Yet
              </h3>
              <p className="text-gray-600 mb-6">
                Get started by creating your first solar energy plan
              </p>
              <Link href="/calculator" className="btn-primary">
                Create Your First Plan
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}