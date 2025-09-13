'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Edit, Download, Share, Sparkles, Sun, Battery, Zap, DollarSign, TrendingUp, TreePine } from 'lucide-react'
import type { CalculatorData } from '@/app/calculator/page'
import SolarPlanSummary from '@/components/SolarPlanSummary'
import CostBreakdown from '@/components/CostBreakdown'
import PaybackTimeline from '@/components/PaybackTimeline'

interface ResultsStepProps {
  data: CalculatorData
  onPrev: () => void
  onEdit: () => void
}

// Calculate solar system requirements
const calculateSolarPlan = (data: CalculatorData) => {
  const totalDailyConsumption = data.devices.reduce((total, device) => {
    return total + (device.powerConsumption * device.quantity * device.hoursPerDay)
  }, 0)

  const energyDemand = totalDailyConsumption / 1000 // Convert to kWh
  const panelSize = Math.ceil(energyDemand / data.sunlightHours)
  const batteryCapacity = Math.ceil(energyDemand * 2) // 2 days backup
  const inverterSize = Math.ceil(panelSize * 1.2) // 20% oversizing

  const costs = {
    panels: panelSize * 800, // $800 per kW
    battery: batteryCapacity * 300, // $300 per kWh
    inverter: inverterSize * 200, // $200 per kW
    installation: (panelSize * 800 + batteryCapacity * 300 + inverterSize * 200) * 0.2 // 20% of components
  }

  const upfrontCost = costs.panels + costs.battery + costs.inverter + costs.installation
  const annualSavings = energyDemand * 365 * 0.15 // $0.15 per kWh saved
  const paybackPeriod = upfrontCost / annualSavings
  const roi = (annualSavings * 20 - upfrontCost) / upfrontCost * 100 // 20-year ROI
  const co2Reduction = energyDemand * 365 * 0.4 // 0.4 kg CO2 per kWh

  return {
    energyDemand: Math.round(energyDemand * 10) / 10,
    panelSize,
    batteryCapacity,
    inverterSize,
    costs,
    upfrontCost: Math.round(upfrontCost),
    annualSavings: Math.round(annualSavings),
    paybackPeriod: Math.round(paybackPeriod * 10) / 10,
    roi: Math.round(roi),
    co2Reduction: Math.round(co2Reduction)
  }
}

export default function ResultsStep({ data, onPrev, onEdit }: ResultsStepProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'financial' | 'environmental'>('overview')
  const solarPlan = calculateSolarPlan(data)

  return (
    <div className="space-y-8">
      {/* Celebration Header */}
      <div className="card text-center bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          🎉 Your Solar Plan is Ready!
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          Perfect solar solution for your {data.category} in {data.location}
        </p>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <Sun className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{solarPlan.panelSize}kW</div>
            <div className="text-sm text-gray-600">Solar Panels</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <Battery className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{solarPlan.batteryCapacity}kWh</div>
            <div className="text-sm text-gray-600">Battery Storage</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <DollarSign className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">${solarPlan.annualSavings.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Annual Savings</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <TreePine className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{solarPlan.co2Reduction}kg</div>
            <div className="text-sm text-gray-600">CO₂ Reduced/Year</div>
          </div>
        </div>

        <button
          onClick={onEdit}
          className="btn-outline inline-flex items-center"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit Inputs
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="card">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'overview'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            📊 System Overview
          </button>
          <button
            onClick={() => setActiveTab('financial')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'financial'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            💰 Financial Analysis
          </button>
          <button
            onClick={() => setActiveTab('environmental')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'environmental'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            🌱 Environmental Impact
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <SolarPlanSummary solarPlan={solarPlan} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Zap className="w-5 h-5 text-blue-600 mr-2" />
                    Daily Energy Production
                  </h4>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {(solarPlan.panelSize * data.sunlightHours).toFixed(1)} kWh
                  </div>
                  <p className="text-sm text-gray-600">
                    Your {solarPlan.panelSize}kW system will produce approximately{' '}
                    {(solarPlan.panelSize * data.sunlightHours).toFixed(1)} kWh per day
                  </p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Battery className="w-5 h-5 text-green-600 mr-2" />
                    Backup Power
                  </h4>
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {Math.round((solarPlan.batteryCapacity / solarPlan.energyDemand) * 10) / 10} Days
                  </div>
                  <p className="text-sm text-gray-600">
                    Your battery can power your devices for{' '}
                    {Math.round((solarPlan.batteryCapacity / solarPlan.energyDemand) * 10) / 10} days without sunlight
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'financial' && (
            <div className="space-y-6">
              <CostBreakdown costs={solarPlan.costs} upfrontCost={solarPlan.upfrontCost} />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 text-center">
                  <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-green-600 mb-1">{solarPlan.roi}%</div>
                  <div className="text-sm text-gray-600">20-Year ROI</div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 text-center">
                  <DollarSign className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-blue-600 mb-1">{solarPlan.paybackPeriod} years</div>
                  <div className="text-sm text-gray-600">Payback Period</div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg p-6 text-center">
                  <Sparkles className="w-12 h-12 text-orange-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-orange-600 mb-1">
                    ${((solarPlan.annualSavings * 20) - solarPlan.upfrontCost).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">20-Year Savings</div>
                </div>
              </div>

              <PaybackTimeline 
                upfrontCost={solarPlan.upfrontCost} 
                annualSavings={solarPlan.annualSavings} 
              />
            </div>
          )}

          {activeTab === 'environmental' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <TreePine className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Your Environmental Impact</h3>
                <p className="text-gray-600">Every kWh from solar reduces carbon emissions and helps fight climate change</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Annual CO₂ Reduction</h4>
                  <div className="text-4xl font-bold text-green-600 mb-2">{solarPlan.co2Reduction}kg</div>
                  <p className="text-sm text-gray-600 mb-4">
                    Equivalent to planting {Math.round(solarPlan.co2Reduction / 21)} trees per year
                  </p>
                  <div className="flex items-center text-sm text-green-700">
                    <TreePine className="w-4 h-4 mr-1" />
                    <span>{Math.round(solarPlan.co2Reduction / 21)} trees worth of CO₂ absorption</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">20-Year Impact</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total CO₂ Reduced:</span>
                      <span className="font-semibold">{(solarPlan.co2Reduction * 20).toLocaleString()}kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Equivalent Trees:</span>
                      <span className="font-semibold">{Math.round(solarPlan.co2Reduction * 20 / 21)} trees</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Clean Energy:</span>
                      <span className="font-semibold">{(solarPlan.energyDemand * 365 * 20).toLocaleString()}kWh</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-6 text-white text-center">
                <h4 className="text-xl font-semibold mb-2">🌍 Join the Clean Energy Revolution</h4>
                <p className="mb-4">
                  Your solar system will help reduce Africa's dependence on fossil fuels and create a sustainable energy future for generations to come.
                </p>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="font-semibold">Clean Energy</div>
                    <div className="opacity-90">100% renewable</div>
                  </div>
                  <div>
                    <div className="font-semibold">Energy Independence</div>
                    <div className="opacity-90">Reduced grid reliance</div>
                  </div>
                  <div>
                    <div className="font-semibold">Community Impact</div>
                    <div className="opacity-90">Leading by example</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/dashboard"
            className="btn-primary inline-flex items-center justify-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Save Plan to Dashboard
          </Link>
          <button className="btn-outline inline-flex items-center justify-center">
            <Share className="w-4 h-4 mr-2" />
            Share Plan
          </button>
          <Link 
            href="/auth?mode=signup"
            className="btn-secondary inline-flex items-center justify-center"
          >
            Get Professional Quote
          </Link>
        </div>
        
        <div className="mt-6 text-center">
          <button
            onClick={onPrev}
            className="text-gray-600 hover:text-gray-800 text-sm"
          >
            ← Back to Review
          </button>
        </div>
      </div>
    </div>
  )
}