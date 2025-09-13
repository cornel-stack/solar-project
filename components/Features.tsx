import { Calculator, TrendingUp, Zap, Users } from 'lucide-react'

const features = [
  {
    icon: Calculator,
    title: 'Smart Planning',
    description: 'Get accurate solar system sizing and cost estimates tailored to your specific energy needs and location.'
  },
  {
    icon: TrendingUp,
    title: 'Financial Modeling',
    description: 'Understand your return on investment, payback period, and long-term savings with detailed financial projections.'
  },
  {
    icon: Zap,
    title: 'Energy Independence',
    description: 'Reduce reliance on grid electricity and achieve energy security for your home, business, or farm.'
  },
  {
    icon: Users,
    title: 'Community Impact',
    description: 'Join 600M+ Africans moving towards sustainable energy solutions and economic empowerment.'
  }
]

export default function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose SolarAfrica Planner?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform provides comprehensive solar planning tools designed specifically 
            for the African market, helping you make informed decisions about your energy future.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="card text-center group hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center group-hover:bg-primary-200 transition-colors duration-300">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}