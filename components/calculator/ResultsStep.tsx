'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Edit, Download, Share, Sparkles, Sun, Battery, Zap, DollarSign, TrendingUp, TreePine } from 'lucide-react'
import type { CalculatorData } from '@/app/calculator/page'
import SolarPlanSummary from '@/components/SolarPlanSummary'
import CostBreakdown from '@/components/CostBreakdown'
import PaybackTimeline from '@/components/PaybackTimeline'
import { useAuth } from '@/lib/auth.tsx'

interface ResultsStepProps {
  data: CalculatorData
  onPrev: () => void
  onEdit: () => void
}

// Calculate realistic solar system requirements for African markets
const calculateSolarPlan = (data: CalculatorData) => {
  const totalDailyConsumption = data.devices.reduce((total, device) => {
    return total + (device.powerConsumption * device.quantity * device.hoursPerDay)
  }, 0)

  const energyDemand = totalDailyConsumption / 1000 // Convert to kWh
  
  // More realistic sizing for African conditions
  const systemEfficiency = 0.78 // 78% efficiency (dust, heat, inverter losses)
  const panelSize = Math.ceil((energyDemand / data.sunlightHours) / systemEfficiency * 1.2) // 20% safety margin
  const batteryCapacity = Math.ceil(energyDemand * 3 * 1.25) // 3 days backup + 25% depth of discharge
  const inverterSize = Math.ceil(panelSize * 1.2) // 20% oversizing

  // Updated pricing for African markets (including import duties, logistics, installation complexity)
  const costs = {
    panels: panelSize * 1200, // $1,200 per kW (higher due to import costs)
    battery: batteryCapacity * 450, // $450 per kWh (lithium with import costs)
    inverter: inverterSize * 350, // $350 per kW (quality inverters with warranty)
    installation: 0 // Will be calculated as percentage
  }
  
  // Installation cost is 35% of component costs (complex African installations)
  costs.installation = (costs.panels + costs.battery + costs.inverter) * 0.35

  const upfrontCost = costs.panels + costs.battery + costs.inverter + costs.installation
  const governmentIncentive = 0.15 // 15% tax rebate/subsidy
  const netUpfrontCost = upfrontCost * (1 - governmentIncentive)

  // Realistic electricity pricing with tiers (common in Africa)
  const monthlyEnergyDemand = energyDemand * 30
  const electricityRates = {
    home: { baseRate: 0.08, tierRate: 0.18, tierThreshold: 200 },
    business: { baseRate: 0.12, tierRate: 0.22, tierThreshold: 500 },
    farm: { baseRate: 0.06, tierRate: 0.15, tierThreshold: 1000 }
  }
  
  const categoryRate = electricityRates[data.category as keyof typeof electricityRates] || electricityRates.home
  let currentElectricityBill = 0
  
  if (monthlyEnergyDemand <= categoryRate.tierThreshold) {
    currentElectricityBill = monthlyEnergyDemand * categoryRate.baseRate
  } else {
    const baseAmount = categoryRate.tierThreshold * categoryRate.baseRate
    const tierAmount = (monthlyEnergyDemand - categoryRate.tierThreshold) * categoryRate.tierRate
    currentElectricityBill = baseAmount + tierAmount
  }

  const annualSavings = currentElectricityBill * 12
  const maintenanceCost = upfrontCost * 0.02 // 2% annual maintenance
  const netAnnualSavings = annualSavings - maintenanceCost

  // Battery replacement every 8 years
  const batteryReplacementCost = costs.battery * 0.7 * 2 // 2 replacements over 20 years
  
  // Realistic payback calculation
  const adjustedPaybackPeriod = (netUpfrontCost + batteryReplacementCost) / netAnnualSavings
  
  // 20-year ROI with all costs considered
  const totalSavings = netAnnualSavings * 20
  const totalCosts = netUpfrontCost + batteryReplacementCost
  const roi = ((totalSavings - totalCosts) / totalCosts) * 100

  const co2Reduction = energyDemand * 365 * 0.6 // 0.6 kg CO2 per kWh (coal-heavy African grids)

  // Financing options
  const interestRate = 0.12 // 12% annual
  const monthlyRate = interestRate / 12
  
  // 5-year loan
  const loan5Payment = (netUpfrontCost * monthlyRate * Math.pow(1 + monthlyRate, 60)) / 
                       (Math.pow(1 + monthlyRate, 60) - 1)
  
  // 10-year loan
  const loan10Payment = (netUpfrontCost * monthlyRate * Math.pow(1 + monthlyRate, 120)) / 
                        (Math.pow(1 + monthlyRate, 120) - 1)

  return {
    energyDemand: Math.round(energyDemand * 10) / 10,
    panelSize,
    batteryCapacity,
    inverterSize,
    costs,
    upfrontCost: Math.round(upfrontCost),
    netUpfrontCost: Math.round(netUpfrontCost),
    currentElectricityBill: Math.round(currentElectricityBill),
    annualSavings: Math.round(annualSavings),
    netAnnualSavings: Math.round(netAnnualSavings),
    maintenanceCost: Math.round(maintenanceCost),
    batteryReplacementCost: Math.round(batteryReplacementCost),
    paybackPeriod: Math.round(adjustedPaybackPeriod * 10) / 10,
    roi: Math.round(roi),
    co2Reduction: Math.round(co2Reduction),
    governmentIncentive,
    financing: {
      loan5Year: {
        monthlyPayment: Math.round(loan5Payment),
        totalPayment: Math.round(loan5Payment * 60)
      },
      loan10Year: {
        monthlyPayment: Math.round(loan10Payment),
        totalPayment: Math.round(loan10Payment * 120)
      }
    }
  }
}

export default function ResultsStep({ data, onPrev, onEdit }: ResultsStepProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'financial' | 'environmental'>('overview')
  const [isSaving, setIsSaving] = useState(false)
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const solarPlan = calculateSolarPlan(data)

  const handleSavePlan = async () => {
    if (!isAuthenticated) {
      // Redirect to auth if not logged in
      router.push('/auth?mode=login&redirect=/calculator')
      return
    }

    setIsSaving(true)
    try {
      // Create plan data to save
      const planData = {
        name: `${data.category?.charAt(0).toUpperCase()}${data.category?.slice(1)} Solar System - ${solarPlan.panelSize}kW`,
        category: data.category,
        location: data.location,
        sunlightHours: data.sunlightHours,
        devices: data.devices,
        panelSize: solarPlan.panelSize,
        batteryCapacity: solarPlan.batteryCapacity,
        inverterSize: solarPlan.inverterSize,
        upfrontCost: solarPlan.upfrontCost,
        netUpfrontCost: solarPlan.netUpfrontCost,
        annualSavings: solarPlan.annualSavings,
        paybackPeriod: solarPlan.paybackPeriod,
        roi: solarPlan.roi,
        co2Reduction: solarPlan.co2Reduction,
        costBreakdown: solarPlan.costs,
        financingOptions: solarPlan.financing,
        createdAt: new Date().toISOString()
      }

      // Save to localStorage as backup (in case API fails)
      const savedPlans = JSON.parse(localStorage.getItem('solarPlans') || '[]')
      savedPlans.push({ id: Date.now(), ...planData })
      localStorage.setItem('solarPlans', JSON.stringify(savedPlans))

      // Try to save to backend (if available)
      try {
        const response = await fetch('/api/plans', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(planData),
        })
        
        if (response.ok) {
          console.log('Plan saved to backend successfully')
        }
      } catch (error) {
        console.log('Backend not available, saved locally only')
      }

      // Redirect to dashboard
      router.push('/dashboard')
    } catch (error) {
      console.error('Failed to save plan:', error)
      alert('Failed to save plan. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSharePlan = () => {
    const shareData = {
      title: `Solar Plan: ${solarPlan.panelSize}kW System`,
      text: `Check out my solar plan: ${solarPlan.panelSize}kW system for ${solarPlan.paybackPeriod} year payback with $${solarPlan.annualSavings.toLocaleString()} annual savings!`,
      url: window.location.href
    }

    if (navigator.share) {
      navigator.share(shareData)
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`)
      alert('Plan details copied to clipboard!')
    }
  }

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
              {/* Government Incentive Banner */}
              <div className="bg-gradient-to-r from-green-100 to-blue-100 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="text-2xl mr-3">🏛️</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Government Incentive Available</h4>
                    <p className="text-sm text-gray-600">
                      Save ${(solarPlan.upfrontCost * solarPlan.governmentIncentive).toLocaleString()} with {(solarPlan.governmentIncentive * 100)}% tax rebate/subsidy
                    </p>
                  </div>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="bg-white rounded-lg border p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Investment Breakdown</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Solar Panels ({solarPlan.panelSize}kW)</span>
                    <span className="font-medium">${solarPlan.costs.panels.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Battery Storage ({solarPlan.batteryCapacity}kWh)</span>
                    <span className="font-medium">${solarPlan.costs.battery.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Inverter ({solarPlan.inverterSize}kW)</span>
                    <span className="font-medium">${solarPlan.costs.inverter.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Installation & Setup</span>
                    <span className="font-medium">${solarPlan.costs.installation.toLocaleString()}</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total System Cost</span>
                    <span>${solarPlan.upfrontCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-green-600">
                    <span>After Government Incentive</span>
                    <span>${solarPlan.netUpfrontCost.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Key Financial Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 text-center">
                  <DollarSign className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-blue-600 mb-1">{solarPlan.paybackPeriod} years</div>
                  <div className="text-sm text-gray-600">Realistic Payback Period</div>
                  <div className="text-xs text-gray-500 mt-1">Including all costs</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 text-center">
                  <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-green-600 mb-1">{solarPlan.roi}%</div>
                  <div className="text-sm text-gray-600">20-Year ROI</div>
                  <div className="text-xs text-gray-500 mt-1">After maintenance & battery replacement</div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg p-6 text-center">
                  <Sparkles className="w-12 h-12 text-orange-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-orange-600 mb-1">
                    ${solarPlan.currentElectricityBill.toLocaleString()}/mo
                  </div>
                  <div className="text-sm text-gray-600">Current Electricity Bill</div>
                  <div className="text-xs text-gray-500 mt-1">What you'll save monthly</div>
                </div>
              </div>

              {/* Financing Options */}
              <div className="bg-white rounded-lg border p-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-xl mr-2">💳</span>
                  Financing Options
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="font-medium text-gray-900 mb-2">💰 Cash Purchase</div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      ${solarPlan.netUpfrontCost.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 mb-3">One-time payment</div>
                    <div className="text-xs text-green-600">✓ Lowest total cost</div>
                    <div className="text-xs text-green-600">✓ Best ROI</div>
                  </div>
                  
                  <div className="border rounded-lg p-4 bg-blue-50">
                    <div className="font-medium text-gray-900 mb-2">🏦 5-Year Loan</div>
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      ${solarPlan.financing.loan5Year.monthlyPayment.toLocaleString()}/mo
                    </div>
                    <div className="text-sm text-gray-600 mb-3">
                      Total: ${solarPlan.financing.loan5Year.totalPayment.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600">12% interest rate</div>
                    <div className="text-xs text-blue-600">✓ Higher monthly payment</div>
                  </div>

                  <div className="border rounded-lg p-4 bg-green-50">
                    <div className="font-medium text-gray-900 mb-2">🌱 10-Year Loan</div>
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      ${solarPlan.financing.loan10Year.monthlyPayment.toLocaleString()}/mo
                    </div>
                    <div className="text-sm text-gray-600 mb-3">
                      Total: ${solarPlan.financing.loan10Year.totalPayment.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600">12% interest rate</div>
                    <div className="text-xs text-green-600">✓ Lower monthly payment</div>
                  </div>
                </div>
              </div>

              {/* Annual Savings Breakdown */}
              <div className="bg-white rounded-lg border p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Annual Financial Impact</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-green-600">+ Electricity Bill Savings</span>
                    <span className="font-medium text-green-600">+${solarPlan.annualSavings.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>- Maintenance Cost (2% annually)</span>
                    <span className="font-medium">-${solarPlan.maintenanceCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-orange-600">
                    <span>- Battery Replacement (every 8 years)</span>
                    <span className="font-medium">-${Math.round(solarPlan.batteryReplacementCost / 20).toLocaleString()}/year</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between text-lg font-bold text-green-600">
                    <span>Net Annual Savings</span>
                    <span>+${solarPlan.netAnnualSavings.toLocaleString()}</span>
                  </div>
                </div>
              </div>
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
          <button 
            onClick={handleSavePlan}
            disabled={isSaving}
            className="btn-primary inline-flex items-center justify-center"
          >
            {isSaving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            {isSaving ? 'Saving...' : isAuthenticated ? 'Save Plan to Dashboard' : 'Login to Save Plan'}
          </button>
          <button 
            onClick={handleSharePlan}
            className="btn-outline inline-flex items-center justify-center"
          >
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