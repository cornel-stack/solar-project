import { Home, Building, Wheat } from 'lucide-react'
import type { Category, CalculatorData } from '@/app/calculator/page'

interface CategoryStepProps {
  data: CalculatorData
  updateData: (updates: Partial<CalculatorData>) => void
  onNext: () => void
}

const categories = [
  {
    id: 'home' as Category,
    title: 'Home',
    description: 'Plan for your household energy needs.',
    icon: Home,
    bgImage: 'bg-gradient-to-br from-blue-400 to-blue-600',
  },
  {
    id: 'business' as Category,
    title: 'Business',
    description: 'Plan for your business energy needs.',
    icon: Building,
    bgImage: 'bg-gradient-to-br from-green-400 to-green-600',
  },
  {
    id: 'farm' as Category,
    title: 'Farm',
    description: 'Plan for your farm energy needs.',
    icon: Wheat,
    bgImage: 'bg-gradient-to-br from-yellow-400 to-orange-500',
  },
]

export default function CategoryStep({ data, updateData, onNext }: CategoryStepProps) {
  const handleCategorySelect = (category: Category) => {
    updateData({ category })
    setTimeout(onNext, 300) // Small delay for visual feedback
  }

  return (
    <div className="card max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Select Your Category
        </h2>
        <p className="text-lg text-gray-600">
          Choose the option that best describes your energy needs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => handleCategorySelect(category.id)}
            className={`relative cursor-pointer rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
              data.category === category.id
                ? 'ring-4 ring-orange-500 shadow-xl scale-105'
                : 'shadow-lg hover:shadow-xl'
            }`}
          >
            {/* Background with gradient */}
            <div className={`${category.bgImage} h-48 flex items-center justify-center relative`}>
              {/* Decorative elements */}
              <div className="absolute inset-0 bg-black bg-opacity-10"></div>
              <div className="absolute top-4 right-4 w-16 h-16 bg-white bg-opacity-20 rounded-full"></div>
              <div className="absolute bottom-4 left-4 w-8 h-8 bg-white bg-opacity-30 rounded-full"></div>
              
              {/* Icon */}
              <category.icon className="w-16 h-16 text-white relative z-10" />
            </div>

            {/* Content */}
            <div className="p-6 bg-white">
              <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center">
                <category.icon className="w-5 h-5 mr-2" />
                {category.title}
              </h3>
              <p className="text-gray-600">
                {category.description}
              </p>
              
              {data.category === category.id && (
                <div className="mt-4 flex items-center text-orange-600">
                  <div className="w-2 h-2 bg-orange-600 rounded-full mr-2"></div>
                  <span className="text-sm font-medium">Selected</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {data.category && (
        <div className="mt-8 text-center">
          <button
            onClick={onNext}
            className="btn-primary px-8 py-3"
          >
            Continue to Details
          </button>
        </div>
      )}
    </div>
  )
}