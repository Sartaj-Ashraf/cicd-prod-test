import Link from 'next/link'

export const CtaSection = () => {
  return (
    <section className="w-full ">
      <div className="container mx-auto">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-2.5 h-2.5 rounded-full bg-leaf-dark dark:bg-leaf-main" />
            <div className="w-5 h-0.5 bg-leaf-dark dark:bg-leaf-main" />
            <span className="text-[11px] font-bold tracking-widest uppercase text-leaf-dark dark:text-leaf-main">
              Ready to Grow
            </span>
          </div>

          {/* Main Heading */}
          <h3 className="font-medium text-foreground leading-tight mb-4">
            Transform Your Online Reputation Today
          </h3>
          
          {/* Description */}
          <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
            Join thousands of businesses that are already collecting more reviews, 
            responding faster, and building trust with AI-powered reputation management.
          </p>

          {/* CTA Buttons */}
          <div className="flex  gap-4 justify-center items-center mb-8">
            {/* <Link href="/pricing" className="inline-flex items-center gap-2 bg-linear-to-br from-mango-orange to-mango-light dark:from-mango-deep dark:to-mango-mid text-primary-foreground font-medium text-xs md:text-sm px-2 py-2 md:px-4 md:py-3 rounded-md transition-all hover:shadow-lg hover:scale-105">
              Start a Trial
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link> */}
            
            <Link href="/contact-us" className="inline-flex items-center gap-2 bg-card text-card-foreground font-medium text-xs md:text-sm px-2 py-1.5 md:px-4 md:py-2.5 rounded-md border border-mango-orange dark:border-mango-light transition-all hover:shadow-md hover:border-border">
              Book a Demo
            </Link>
          </div>

          {/* Trust Indicators */}
          {/* <div className="flex flex-col sm:flex-row gap-8 justify-center items-center text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-leaf-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-leaf-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-leaf-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Cancel anytime</span>
            </div>
          </div> */}
        </div>

        {/* Stats Section */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">10K+</div>
            <div className="text-sm text-gray-600">Businesses Trust Us</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">4.8★</div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">2M+</div>
            <div className="text-sm text-gray-600">Reviews Generated</div>
          </div>
        </div> */}
      </div>
    </section>
  )
}
