'use client'

import { useState } from 'react'
import { MapPin, Sun, Plus, Minus, Lightbulb } from 'lucide-react'
import type { CalculatorData } from '@/app/calculator/page'

interface DetailsStepProps {
  data: CalculatorData
  updateData: (updates: Partial<CalculatorData>) => void
  onNext: () => void
  onPrev: () => void
}

const africanCountries = [
  'Nigeria', 'Kenya', 'South Africa', 'Ghana', 'Tanzania', 'Uganda', 'Rwanda',
  'Ethiopia', 'Morocco', 'Egypt', 'Senegal', 'Mali', 'Burkina Faso', 'Ivory Coast'
]

const commonDevices = [
  { type: 'LED Light Bulb', powerConsumption: 10, icon: '💡', category: 'lighting' },
  { type: 'Phone Charger', powerConsumption: 5, icon: '📱', category: 'electronics' },
  { type: 'Radio', powerConsumption: 15, icon: '📻', category: 'electronics' },
  { type: 'TV', powerConsumption: 100, icon: '📺', category: 'electronics' },
  { type: 'Laptop', powerConsumption: 65, icon: '💻', category: 'electronics' },
  { type: 'Refrigerator', powerConsumption: 150, icon: '🧊', category: 'appliances' },
  { type: 'Fan', powerConsumption: 75, icon: '🌀', category: 'appliances' },
  { type: 'Water Pump', powerConsumption: 500, icon: '💧', category: 'industrial' },
  { type: 'Washing Machine', powerConsumption: 400, icon: '👕', category: 'appliances' },
  { type: 'Air Conditioner', powerConsumption: 1200, icon: '❄️', category: 'appliances' },
  { type: 'Microwave', powerConsumption: 800, icon: '📦', category: 'appliances' },
  { type: 'Electric Iron', powerConsumption: 1000, icon: '👔', category: 'appliances' },
]

export default function DetailsStep({ data, updateData, onNext, onPrev }: DetailsStepProps) {
  const [selectedDevices, setSelectedDevices] = useState<string[]>([])
  const [deviceCategory, setDeviceCategory] = useState<string>('all')

  const categories = ['all', 'lighting', 'electronics', 'appliances', 'industrial']

  const filteredDevices = deviceCategory === 'all' 
    ? commonDevices 
    : commonDevices.filter(device => device.category === deviceCategory)

  const toggleDeviceSelection = (deviceType: string) => {
    setSelectedDevices(prev => 
      prev.includes(deviceType)
        ? prev.filter(d => d !== deviceType)
        : [...prev, deviceType]
    )
  }

  const addSelectedDevices = () => {
    const newDevices = selectedDevices.map(deviceType => {
      const device = commonDevices.find(d => d.type === deviceType)!
      return {
        type: device.type,
        quantity: 1,
        hoursPerDay: 4,
        powerConsumption: device.powerConsumption
      }
    })
    
    updateData({
      devices: [...data.devices, ...newDevices]
    })
    setSelectedDevices([])
  }

  const updateDevice = (index: number, field: string, value: number) => {
    const newDevices = [...data.devices]
    newDevices[index] = { ...newDevices[index], [field]: value }
    updateData({ devices: newDevices })
  }

  const removeDevice = (index: number) => {
    const newDevices = data.devices.filter((_, i) => i !== index)
    updateData({ devices: newDevices })
  }

  const canContinue = data.location && data.sunlightHours > 0 && data.devices.length > 0

  return (
    <div className="card max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Enter Your Details
        </h2>
        <p className="text-lg text-gray-600">
          Provide information about your location and device usage.
        </p>
      </div>

      <div className="space-y-8">
        {/* Location */}
        <div>
          <div className="flex items-center mb-4">
            <MapPin className="w-5 h-5 text-primary-600 mr-2" />
            <h3 className="text-xl font-semibold text-gray-900">Location</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                Country/City
              </label>
              <select
                id="country"
                className="input"
                value={data.location}
                onChange={(e) => updateData({ location: e.target.value })}
              >
                <option value="">Select a location</option>
                {africanCountries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="sunlight" className="block text-sm font-medium text-gray-700 mb-2">
                Average Sunlight Hours
              </label>
              <input
                type="number"
                id="sunlight"
                className="input"
                placeholder="e.g. 5.5 hours"
                min="1"
                max="12"
                step="0.1"
                value={data.sunlightHours || ''}
                onChange={(e) => updateData({ sunlightHours: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>
        </div>

        {/* Devices */}
        <div>
          <div className="flex items-center mb-4">
            <Sun className="w-5 h-5 text-primary-600 mr-2" />
            <h3 className="text-xl font-semibold text-gray-900">Your Devices</h3>
            <div className="ml-auto">
              <Lightbulb className="w-5 h-5 text-orange-500" />
              <span className="text-sm text-gray-600 ml-1">AI Suggestion</span>
            </div>
          </div>

          {/* Device Category Filter */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setDeviceCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    deviceCategory === category
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Device Selection Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
            {filteredDevices.map((device) => {
              const isSelected = selectedDevices.includes(device.type)
              const isAlreadyAdded = data.devices.some(d => d.type === device.type)
              
              return (
                <button
                  key={device.type}
                  onClick={() => !isAlreadyAdded && toggleDeviceSelection(device.type)}
                  disabled={isAlreadyAdded}
                  className={`p-3 rounded-lg border text-center transition-all ${
                    isAlreadyAdded
                      ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                      : isSelected
                      ? 'bg-primary-50 border-primary-500 text-primary-700'
                      : 'bg-white border-gray-200 hover:border-primary-300 hover:bg-primary-25'
                  }`}
                >
                  <div className="text-2xl mb-1">{device.icon}</div>
                  <div className="text-xs font-medium mb-1">{device.type}</div>
                  <div className="text-xs text-gray-500">{device.powerConsumption}W</div>
                  {isAlreadyAdded && (
                    <div className="text-xs text-green-600 mt-1">✓ Added</div>
                  )}
                </button>
              )
            })}
          </div>

          {/* Add Selected Devices Button */}
          {selectedDevices.length > 0 && (
            <div className="mb-6">
              <button
                onClick={addSelectedDevices}
                className="btn-primary flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Selected Devices ({selectedDevices.length})
              </button>
            </div>
          )}

          {/* Device List */}
          {data.devices.length > 0 && (
            <div className="space-y-4">
              {data.devices.map((device, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">{device.type}</h4>
                    <button
                      onClick={() => removeDevice(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Quantity</label>
                      <input
                        type="number"
                        min="1"
                        className="input"
                        value={device.quantity}
                        onChange={(e) => updateDevice(index, 'quantity', parseInt(e.target.value) || 1)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Hours/Day</label>
                      <input
                        type="number"
                        min="1"
                        max="24"
                        className="input"
                        value={device.hoursPerDay}
                        onChange={(e) => updateDevice(index, 'hoursPerDay', parseInt(e.target.value) || 1)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={onPrev}
          className="btn-outline px-6 py-3"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!canContinue}
          className={`px-6 py-3 ${
            canContinue 
              ? 'btn-primary' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed rounded-lg'
          }`}
        >
          Review Plan
        </button>
      </div>
    </div>
  )
}