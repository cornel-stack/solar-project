'use client'

import { useState } from 'react'
import Layout from '@/components/Layout'
import ProgressBar from '@/components/calculator/ProgressBar'
import CategoryStep from '@/components/calculator/CategoryStep'
import DetailsStep from '@/components/calculator/DetailsStep'
import ReviewStep from '@/components/calculator/ReviewStep'
import ResultsStep from '@/components/calculator/ResultsStep'

export type Category = 'home' | 'business' | 'farm'

export interface CalculatorData {
  category: Category | null
  location: string
  sunlightHours: number
  devices: Array<{
    type: string
    quantity: number
    hoursPerDay: number
    powerConsumption: number
  }>
}

export default function CalculatorPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [data, setData] = useState<CalculatorData>({
    category: null,
    location: '',
    sunlightHours: 0,
    devices: []
  })

  const updateData = (updates: Partial<CalculatorData>) => {
    setData(prev => ({ ...prev, ...updates }))
  }

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 4))
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const goToStep = (step: number) => {
    setCurrentStep(step)
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProgressBar currentStep={currentStep} />
          
          <div className="mt-8">
            {currentStep === 1 && (
              <CategoryStep 
                data={data} 
                updateData={updateData} 
                onNext={nextStep} 
              />
            )}
            {currentStep === 2 && (
              <DetailsStep 
                data={data} 
                updateData={updateData} 
                onNext={nextStep}
                onPrev={prevStep}
              />
            )}
            {currentStep === 3 && (
              <ReviewStep 
                data={data} 
                onNext={nextStep}
                onPrev={prevStep}
              />
            )}
            {currentStep === 4 && (
              <ResultsStep 
                data={data} 
                onPrev={prevStep}
                onEdit={() => goToStep(2)}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}