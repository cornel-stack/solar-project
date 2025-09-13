import { Check } from 'lucide-react'

interface ProgressBarProps {
  currentStep: number
}

const steps = [
  { number: 1, title: 'Category', description: 'Choose your category' },
  { number: 2, title: 'Details', description: 'Enter your details' },
  { number: 3, title: 'Review', description: 'Review your inputs' },
  { number: 4, title: 'Results', description: 'Your solar plan' },
]

export default function ProgressBar({ currentStep }: ProgressBarProps) {
  return (
    <nav aria-label="Progress">
      <ol className="flex items-center justify-between">
        {steps.map((step, stepIdx) => (
          <li key={step.number} className="relative flex-1">
            {stepIdx !== steps.length - 1 && (
              <div
                className={`absolute top-4 left-1/2 -ml-px mt-0.5 h-0.5 w-full ${
                  step.number < currentStep ? 'bg-orange-500' : 'bg-gray-300'
                }`}
                aria-hidden="true"
              />
            )}
            <div className="relative flex flex-col items-center group">
              <span
                className={`h-8 w-8 flex items-center justify-center rounded-full text-sm font-medium ${
                  step.number < currentStep
                    ? 'bg-orange-500 text-white'
                    : step.number === currentStep
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-300 text-gray-500'
                }`}
              >
                {step.number < currentStep ? (
                  <Check className="h-5 w-5" />
                ) : (
                  step.number
                )}
              </span>
              <span
                className={`mt-2 text-xs font-medium ${
                  step.number <= currentStep ? 'text-orange-600' : 'text-gray-500'
                }`}
              >
                {step.title}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  )
}