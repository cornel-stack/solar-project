import Layout from '@/components/Layout'
import { ChevronDown, ChevronUp } from 'lucide-react'
import FAQ from '@/components/FAQ'

export default function FAQPage() {
  const faqData = [
    {
      question: "How accurate are the solar calculations?",
      answer: "Our calculations are based on industry-standard formulas and real-world data. We use average sunlight hours, equipment specifications, and local pricing to provide estimates that are typically within 10-15% of actual results. For precise quotes, we recommend consulting with local installers."
    },
    {
      question: "What's included in the system cost estimate?",
      answer: "Our cost estimates include solar panels, battery storage, inverter, charge controllers, wiring, and installation. We also factor in permits and basic system monitoring. Additional costs like ground mounting, electrical upgrades, or extended warranties are not included."
    },
    {
      question: "How long do solar systems last?",
      answer: "Quality solar panels typically come with 25-year warranties and can last 30+ years. Batteries usually last 5-15 years depending on type and usage. Inverters typically need replacement after 10-15 years. Our payback calculations account for these component lifecycles."
    },
    {
      question: "Is financing available for solar installations?",
      answer: "While we don't provide financing directly, many local installers and financial institutions offer solar loans and payment plans. Our tool helps you understand the financial benefits to support your financing applications."
    },
    {
      question: "Can the system work during power outages?",
      answer: "Yes, if your system includes battery storage, it can provide power during outages. Grid-tied systems without batteries will shut down during outages for safety reasons. Our calculator helps you size battery storage for your backup power needs."
    },
    {
      question: "What maintenance is required?",
      answer: "Solar systems require minimal maintenance. Regular cleaning of panels, visual inspections, and battery maintenance (for lead-acid batteries) are the main requirements. We recommend annual professional inspections to ensure optimal performance."
    },
    {
      question: "How do I find qualified installers?",
      answer: "We maintain a network of certified installers across Africa. After completing your solar plan, you can request quotes from local professionals who are familiar with our planning tool and your specific requirements."
    },
    {
      question: "What happens if I use more or less energy than planned?",
      answer: "Solar systems are designed with some flexibility. If you use less energy, excess power can be stored in batteries or fed back to the grid (where net metering is available). If you use more, you may need to supplement with grid power or expand your system."
    }
  ]

  return (
    <Layout>
      <div className="py-12 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-600">
              Everything you need to know about solar planning and installation
            </p>
          </div>

          <FAQ faqData={faqData} />

          <div className="card mt-12 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-6">
              Our team is here to help you understand solar energy and make the best decisions for your needs.
            </p>
            <a 
              href="mailto:support@solarafrica.com"
              className="btn-primary inline-flex items-center"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </Layout>
  )
}