'use client'

import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, Zap, TreePine, DollarSign, Calendar, Award, Target } from 'lucide-react'
import Link from 'next/link'

interface User {
  id: string
  email: string
  name?: string
}

interface SolarStatsProps {
  user: User
}

export default function SolarStats({ user }: SolarStatsProps) {
  const [stats, setStats] = useState({
    totalPlans: 3,
    totalCapacity: 15.2,
    estimatedSavings: 12500,
    co2Reduction: 8500,
    plansByCategory: [
      { name: 'Home', value: 2, color: '#3b82f6' },
      { name: 'Business', value: 1, color: '#10b981' },
      { name: 'Farm', value: 0, color: '#f59e0b' },
    ],
    monthlyProgress: [
      { month: 'Jan', plans: 1, capacity: 5.2 },
      { month: 'Feb', plans: 1, capacity: 5.2 },
      { month: 'Mar', plans: 2, capacity: 10.4 },
      { month: 'Apr', plans: 2, capacity: 10.4 },
      { month: 'May', plans: 3, capacity: 15.2 },
      { month: 'Jun', plans: 3, capacity: 15.2 },
    ]
  })

  const achievements = [
    {
      id: 1,
      title: 'First Solar Plan',
      description: 'Created your first solar energy plan',
      icon: '🌟',
      earned: true,
      date: '2024-01-15'
    },
    {
      id: 2,
      title: 'Green Pioneer',
      description: 'Planned 10kW+ of solar capacity',
      icon: '🌱',
      earned: true,
      date: '2024-03-20'
    },
    {
      id: 3,
      title: 'Solar Evangelist',
      description: 'Shared 3+ solar plans',
      icon: '📢',
      earned: false,
      progress: 1,
      total: 3
    },
    {
      id: 4,
      title: 'Carbon Warrior',
      description: 'Planned to reduce 5+ tons of CO₂ annually',
      icon: '🛡️',
      earned: true,
      date: '2024-05-10'
    },
    {
      id: 5,
      title: 'Community Leader',
      description: 'Help 10 others with solar planning',
      icon: '👥',
      earned: false,
      progress: 2,
      total: 10
    },
    {
      id: 6,
      title: 'Solar Expert',
      description: 'Create 10+ detailed solar plans',
      icon: '🎓',
      earned: false,
      progress: 3,
      total: 10
    }
  ]

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Plans</p>
              <p className="text-3xl font-bold text-blue-900">{stats.totalPlans}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link href="/dashboard" className="text-sm text-blue-600 hover:underline">
              View all plans →
            </Link>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Total Capacity</p>
              <p className="text-3xl font-bold text-green-900">{stats.totalCapacity}kW</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Zap className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-green-700">
            <span>⚡ Powers ~12 homes</span>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Est. Savings</p>
              <p className="text-3xl font-bold text-orange-900">${stats.estimatedSavings.toLocaleString()}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <DollarSign className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-orange-700">
            <span>💰 Over 20 years</span>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">CO₂ Reduction</p>
              <p className="text-3xl font-bold text-purple-900">{stats.co2Reduction.toLocaleString()}kg</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <TreePine className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-purple-700">
            <span>🌳 = {Math.round(stats.co2Reduction / 21)} trees/year</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Plans by Category */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Plans by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.plansByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.plansByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-4 mt-4">
            {stats.plansByCategory.map((category) => (
              <div key={category.name} className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: category.color }}
                ></div>
                <span className="text-sm text-gray-600">
                  {category.name} ({category.value})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Progress */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Capacity Growth</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.monthlyProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    name === 'capacity' ? `${value}kW` : value,
                    name === 'capacity' ? 'Total Capacity' : 'Plans Created'
                  ]}
                />
                <Bar dataKey="capacity" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Award className="w-5 h-5 mr-2 text-yellow-500" />
            Achievements
          </h3>
          <div className="text-sm text-gray-600">
            {achievements.filter(a => a.earned).length} of {achievements.length} earned
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                achievement.earned
                  ? 'bg-yellow-50 border-yellow-200 shadow-sm'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="text-2xl">{achievement.icon}</div>
                {achievement.earned && (
                  <div className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                    Earned
                  </div>
                )}
              </div>
              
              <h4 className={`font-semibold mb-1 ${
                achievement.earned ? 'text-yellow-900' : 'text-gray-600'
              }`}>
                {achievement.title}
              </h4>
              
              <p className={`text-sm mb-3 ${
                achievement.earned ? 'text-yellow-700' : 'text-gray-500'
              }`}>
                {achievement.description}
              </p>

              {achievement.earned ? (
                <div className="text-xs text-yellow-600">
                  Earned on {new Date(achievement.date!).toLocaleDateString()}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Progress</span>
                    <span>{achievement.progress}/{achievement.total}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{
                        width: `${(achievement.progress! / achievement.total!) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Goals Section */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Target className="w-5 h-5 mr-2 text-primary-600" />
          Your Solar Goals for 2024
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-center">
              <div className="text-2xl mb-2">🎯</div>
              <div className="text-lg font-semibold text-blue-900">25kW</div>
              <div className="text-sm text-blue-700">Capacity Goal</div>
              <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
              <div className="text-xs text-blue-600 mt-1">15.2kW / 25kW</div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-center">
              <div className="text-2xl mb-2">💰</div>
              <div className="text-lg font-semibold text-green-900">$20,000</div>
              <div className="text-sm text-green-700">Savings Goal</div>
              <div className="mt-2 w-full bg-green-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '62%' }}></div>
              </div>
              <div className="text-xs text-green-600 mt-1">$12,500 / $20,000</div>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-center">
              <div className="text-2xl mb-2">🌍</div>
              <div className="text-lg font-semibold text-purple-900">15 tons</div>
              <div className="text-sm text-purple-700">CO₂ Reduction</div>
              <div className="mt-2 w-full bg-purple-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '57%' }}></div>
              </div>
              <div className="text-xs text-purple-600 mt-1">8.5 tons / 15 tons</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}