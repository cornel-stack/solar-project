import Link from 'next/link'

export default function CTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to Start Your Solar Journey?
        </h2>
        <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
          Join thousands of Africans who have already discovered the power of solar energy. 
          Get your free, personalized solar plan in just 3 simple steps.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            href="/calculator"
            className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-4 px-8 rounded-lg transition-colors duration-200 text-lg w-full sm:w-auto"
          >
            Start Planning Now
          </Link>
          <Link 
            href="/auth?mode=signup"
            className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-4 px-8 rounded-lg transition-colors duration-200 text-lg w-full sm:w-auto"
          >
            Create Account
          </Link>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">3</div>
            <div className="text-primary-200">Simple Steps</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">100%</div>
            <div className="text-primary-200">Free Planning</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">600M+</div>
            <div className="text-primary-200">Africans Empowered</div>
          </div>
        </div>
      </div>
    </section>
  )
}