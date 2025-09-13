import Layout from '@/components/Layout'
import Link from 'next/link'
import { Edit, Download, Share, Plus } from 'lucide-react'

export default function DashboardPage() {
  // Mock data - in a real app, this would come from a database
  const savedPlans = [
    {
      id: 1,
      name: 'Home Solar Plan',
      category: 'home',
      location: 'Kenya',
      energyDemand: 15,
      panelSize: 5,
      upfrontCost: 10000,
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      name: 'Farm Solar System',
      category: 'farm',
      location: 'Nigeria',
      energyDemand: 25,
      panelSize: 8,
      upfrontCost: 15000,
      createdAt: '2024-01-10'
    }
  ]

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
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-gray-600 capitalize">
                      {plan.category} • {plan.location}
                    </p>
                  </div>
                  <div className="flex space-x-1">
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Share className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Energy Demand</span>
                    <span className="font-semibold">{plan.energyDemand} kWh/day</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Panel Size</span>
                    <span className="font-semibold">{plan.panelSize} kW</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">System Cost</span>
                    <span className="font-semibold">${plan.upfrontCost.toLocaleString()}</span>
                  </div>
                </div>

                <div className="text-sm text-gray-500 mb-4">
                  Created on {new Date(plan.createdAt).toLocaleDateString()}
                </div>

                <button className="btn-primary w-full">
                  View Details
                </button>
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