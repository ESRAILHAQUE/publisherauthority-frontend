import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const HeroSection: React.FC = () => {
  return (
    <section className="bg-primary-purple text-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full border-2 border-accent-teal bg-primary-purple/50 backdrop-blur-sm">
              <span className="text-sm font-medium text-white">
                Trusted by 500+ Publishers
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-white">Monetize Your Blog</span>{' '}
                <span className="text-accent-teal">Without Annoying Ads</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-2xl">
                Boost your earnings and build quality content with our curated network. 
                Connect with brands through valuable content marketing. Get paid for publishing 
                articles on your high-authority sites.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/apply">
                <button className="inline-flex items-center justify-center px-4 py-2 bg-accent-teal hover:bg-accent-teal-dark text-white font-semibold rounded-lg transition-all group">
                  Get Started Free
                  <svg 
                    className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </Link>
              <Link href="/dashboard">
                <button className="inline-flex items-center justify-center px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-lg transition-all">
                  View Marketplace
                </button>
              </Link>
            </div>

            {/* Review Section */}
            <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 max-w-md">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-accent-teal"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-white">Excellent</div>
                <div className="text-sm text-gray-300">4.8 out of 5 on Trustpilot</div>
              </div>
              <svg 
                className="w-5 h-5 text-accent-teal" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 p-4 shadow-2xl">
              <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-900">
                <Image
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop&q=80"
                  alt="Dashboard Analytics"
                  fill
                  className="object-cover"
                  priority
                />
                
                {/* Overlay Badges */}
                <div className="absolute top-4 right-4 px-4 py-2 rounded-lg bg-primary-purple/90 backdrop-blur-sm border border-accent-teal/30">
                  <div className="text-xs text-gray-300">Traffic Growth</div>
                  <div className="text-xl font-bold text-accent-teal">+150%</div>
                </div>
                
                <div className="absolute bottom-4 left-4 px-4 py-2 rounded-lg bg-primary-purple/90 backdrop-blur-sm border border-accent-teal/30">
                  <div className="text-xs text-gray-300">DA Score</div>
                  <div className="text-xl font-bold text-accent-teal">85+</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

