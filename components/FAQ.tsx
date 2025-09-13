'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
}

interface FAQProps {
  faqData: FAQItem[]
}

export default function FAQ({ faqData }: FAQProps) {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  return (
    <div className="space-y-4">
      {faqData.map((item, index) => (
        <div key={index} className="card">
          <button
            onClick={() => toggleItem(index)}
            className="w-full text-left flex justify-between items-center focus:outline-none"
          >
            <h3 className="text-lg font-semibold text-gray-900 pr-4">
              {item.question}
            </h3>
            <div className="flex-shrink-0">
              {openItems.includes(index) ? (
                <ChevronUp className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              )}
            </div>
          </button>
          
          {openItems.includes(index) && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-gray-600 leading-relaxed">
                {item.answer}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}