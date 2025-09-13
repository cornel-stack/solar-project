import Link from 'next/link'
import Image from 'next/image'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-african-sunset bg-cover bg-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Empower Africa with Solar
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8">
            Your Free Plan Awaits
          </p>
          <p className="text-lg text-gray-300 mb-12 max-w-3xl mx-auto">
            Unlock the potential of solar energy with our free financial modeling tool. 
            Tailored for rural communities, SMEs, and rural projects, our planner 
            provides clear insights into cost savings and environmental impact.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/calculator"
              className="btn-secondary text-lg px-8 py-4 w-full sm:w-auto"
            >
              Get Your Free Solar Plan
            </Link>
            <Link 
              href="/about"
              className="btn-outline text-lg px-8 py-4 w-full sm:w-auto bg-white bg-opacity-10 backdrop-blur-sm border-white text-white hover:bg-white hover:text-gray-900"
            >
              Learn More
            </Link>
          </div>
        </div>
        
        {/* Solar Panel Graphic */}
        <div className="mt-16 relative">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 max-w-md mx-auto opacity-80">
            {Array.from({ length: 18 }).map((_, i) => (
              <div 
                key={i}
                className="aspect-square bg-blue-900 bg-opacity-60 border border-blue-400 rounded-sm"
                style={{
                  background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #1e40af 100%)',
                  boxShadow: 'inset 0 1px 2px rgba(59, 130, 246, 0.3)'
                }}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  )
}