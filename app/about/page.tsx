import Layout from '@/components/Layout'
import Link from 'next/link'
import { Target, Users, Zap, TrendingUp } from 'lucide-react'

export default function AboutPage() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-african-village bg-cover bg-center">
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Solving Energy Access for<br />
            <span className="text-orange-400">600M Africans by 2025</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto">
            Our mission is to empower communities across Africa with sustainable solar energy 
            solutions, fostering economic growth and improving lives.
          </p>
          <Link href="/calculator" className="btn-secondary text-lg px-8 py-4">
            Get Started
          </Link>
        </div>
      </section>

      {/* The Challenge */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              The Challenge
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Across Africa, millions of people lack access to reliable electricity, 
              limiting economic opportunities and quality of life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">600M+</div>
              <div className="text-gray-600">People without electricity access</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">80%</div>
              <div className="text-gray-600">Rural areas lack grid connection</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">$50B</div>
              <div className="text-gray-600">Annual economic loss due to energy poverty</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Energy Poverty in Africa</h3>
              <div className="space-y-4 text-gray-600">
                <p>
                  Despite abundant solar resources, many African communities rely on expensive, 
                  unreliable energy sources like kerosene lamps and diesel generators.
                </p>
                <p>
                  This energy poverty creates a cycle that limits education, healthcare, 
                  and economic development opportunities.
                </p>
                <p>
                  Solar energy offers a sustainable, affordable solution that can break 
                  this cycle and transform communities.
                </p>
              </div>
            </div>
            <div className="relative">
              {/* Illustration of African village */}
              <div className="bg-gradient-to-br from-orange-400 via-red-500 to-purple-600 rounded-2xl p-8 text-white">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-white rounded-full opacity-60"></div>
                    <span>Limited access to education after dark</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-white rounded-full opacity-60"></div>
                    <span>Healthcare facilities without reliable power</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-white rounded-full opacity-60"></div>
                    <span>Small businesses struggling to operate</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-white rounded-full opacity-60"></div>
                    <span>High cost of diesel and kerosene</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Solution */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Solution
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              SolarAfrica Planner makes solar energy accessible through intelligent 
              planning and financial modeling tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Planning</h3>
              <p className="text-gray-600">
                AI-powered system sizing based on your specific energy needs and location.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Financial Modeling</h3>
              <p className="text-gray-600">
                Clear ROI calculations and payback analysis to make informed decisions.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Local Solutions</h3>
              <p className="text-gray-600">
                Tailored for African markets with local pricing and installation networks.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Community Impact</h3>
              <p className="text-gray-600">
                Supporting sustainable development and economic empowerment.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Join the Solar Revolution
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
            Start your solar journey today and be part of the solution 
            to Africa's energy challenges.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/calculator"
              className="bg-white text-green-600 hover:bg-gray-100 font-semibold py-4 px-8 rounded-lg transition-colors duration-200 text-lg"
            >
              Plan Your Solar System
            </Link>
            <Link 
              href="/auth?mode=signup"
              className="border-2 border-white text-white hover:bg-white hover:text-green-600 font-semibold py-4 px-8 rounded-lg transition-colors duration-200 text-lg"
            >
              Get Professional Support
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  )
}