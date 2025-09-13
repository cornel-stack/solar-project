'use client'

import { Edit, CheckCircle, MapPin, Sun, Zap } from 'lucide-react'
import type { CalculatorData } from '@/app/calculator/page'

interface ReviewStepProps {
  data: CalculatorData
  onNext: () => void
  onPrev: () => void
}

export default function ReviewStep({ data, onNext, onPrev }: ReviewStepProps) {
  const totalDailyConsumption = data.devices.reduce((total, device) => {
    return total + (device.powerConsumption * device.quantity * device.hoursPerDay)
  }, 0)

  return (
    <div className="card max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Review Your Information
        </h2>
        <p className="text-lg text-gray-600">
          Please review your details before we calculate your solar plan
        </p>
      </div>

      <div className="space-y-8">
        {/* Category Review */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Energy Category</h3>
            </div>
            <button 
              onClick={onPrev}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              <Edit className="w-4 h-4 inline mr-1" />
              Edit
            </button>
          </div>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
              {data.category === 'home' && '🏠'}
              {data.category === 'business' && '🏢'}
              {data.category === 'farm' && '🚜'}
            </div>
            <div>
              <div className="font-semibold text-gray-900 capitalize">{data.category}</div>
              <div className="text-sm text-gray-600">
                {data.category === 'home' && 'Household energy needs'}
                {data.category === 'business' && 'Business energy needs'}
                {data.category === 'farm' && 'Agricultural energy needs'}
              </div>
            </div>
          </div>
        </div>

        {/* Location Review */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Location & Climate</h3>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center">
              <MapPin className="w-8 h-8 text-primary-600 mr-3" />
              <div>
                <div className="font-semibold text-gray-900">{data.location}</div>
                <div className="text-sm text-gray-600">Your location</div>
              </div>
            </div>
            <div className="flex items-center">
              <Sun className="w-8 h-8 text-orange-500 mr-3" />
              <div>
                <div className="font-semibold text-gray-900">{data.sunlightHours} hours/day</div>
                <div className="text-sm text-gray-600">Average sunlight</div>
              </div>
            </div>
          </div>
        </div>

        {/* Devices Review */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Your Devices</h3>
            </div>
            <div className="text-right">
              <div className="font-semibold text-gray-900">{data.devices.length} devices</div>
              <div className="text-sm text-gray-600">
                {(totalDailyConsumption / 1000).toFixed(1)} kWh/day total
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.devices.map((device, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <Zap className="w-5 h-5 text-orange-500 mr-2" />
                    <div>
                      <div className="font-medium text-gray-900">{device.type}</div>
                      <div className="text-sm text-gray-600">
                        {device.quantity}x • {device.hoursPerDay}h/day • {device.powerConsumption}W
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {((device.powerConsumption * device.quantity * device.hoursPerDay) / 1000).toFixed(2)} kWh
                    </div>
                    <div className="text-xs text-gray-500">daily usage</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gradient-to-r from-primary-50 to-green-50 rounded-lg p-6 border border-primary-200">
          <div className="text-center">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Ready to Generate Your Solar Plan?
            </h4>
            <p className="text-gray-600 mb-4">
              We'll calculate the perfect solar system for your {data.category} in {data.location} 
              based on your {data.devices.length} devices and {data.sunlightHours} hours of daily sunlight.
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <span>• System sizing</span>
              <span>• Cost analysis</span>
              <span>• Payback timeline</span>
              <span>• Environmental impact</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={onPrev}
          className="btn-outline px-6 py-3"
        >
          Back to Details
        </button>
        <button
          onClick={onNext}
          className="btn-primary px-8 py-3 text-lg"
        >
          Generate Solar Plan ✨
        </button>
      </div>
    </div>
  )
}