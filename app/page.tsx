import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#3F207F] via-[#5A2F9F] to-[#3F207F] text-white py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              The Easiest Way To Monetize Your Blog Without Annoying Ads
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto">
              Ready to join the content revolution? With Content Manager, we're changing the way blogs can be monetized.
            </p>
            <div className="pt-6">
              <Link href="/apply">
                <Button variant="primary" size="lg" className="text-lg px-8 py-4">
                  Apply Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What Is Content Manager Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#3F207F] mb-6">
              What Is Content Manager?
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Content manager connects well-established blogs with brands that need more attention. 
              Instead of plastering annoying ads on your site, these brands are more interested in being 
              mentioned in a valuable piece of content that's featured on your site. This is the future 
              of marketing, content marketing.
            </p>
          </div>
        </div>
      </section>

      {/* Your Blog, Amplified Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-[#3F207F] text-center mb-12">
              Your Blog, Amplified
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card hover className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#E64980] to-[#FF6B9D] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Get Valuable Content, For Free</h3>
                <p className="text-gray-600">
                  Once you're approved, we'll work with you to craft valuable content that speaks to your 
                  audience and mentions the brand. This is the same type of content most blogs pay just to have written.
                </p>
              </Card>

              <Card hover className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#E64980] to-[#FF6B9D] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Grow Your Traffic</h3>
                <p className="text-gray-600">
                  Every piece of content you post to your site is a chance to rank for more keywords and 
                  get more free traffic from Google. With our optimized content, you can sit back and watch 
                  your organic traffic grow.
                </p>
              </Card>

              <Card hover className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#E64980] to-[#FF6B9D] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Monetize Your Blog</h3>
                <p className="text-gray-600">
                  Not only will you be able to get awesome content that connects with your readers, 
                  you'll earn every time you post one of our blogs… no annoying ads necessary!
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-[#3F207F] text-center mb-12">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-[#E64980] rounded-full flex items-center justify-center mx-auto mb-6 transform hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="mb-4">
                  <span className="text-sm font-semibold text-[#E64980]">Step 1:</span>
                  <h3 className="text-xl font-bold text-gray-900 mt-2">Sign Up For Free</h3>
                </div>
                <p className="text-gray-600">
                  Sign Up for a free account and submit your blog(s). Depending on the quality of your 
                  website, we'll tell you how much brands are willing to pay to be featured.
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-[#E64980] rounded-lg flex items-center justify-center mx-auto mb-6 transform hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="mb-4">
                  <span className="text-sm font-semibold text-[#E64980]">Step 2:</span>
                  <h3 className="text-xl font-bold text-gray-900 mt-2">Post Our Valuable Content</h3>
                </div>
                <p className="text-gray-600">
                  We'll send you content that matches your audience. Just post it to your blog and submit 
                  the URL in our portal. It's that easy.
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-[#E64980] rounded-lg flex items-center justify-center mx-auto mb-6 transform hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="mb-4">
                  <span className="text-sm font-semibold text-[#E64980]">Step 3:</span>
                  <h3 className="text-xl font-bold text-gray-900 mt-2">Get Paid Bi-weekly</h3>
                </div>
                <p className="text-gray-600">
                  Once the posts are live, we send out bi-weekly payments through your chosen payment method. 
                  We've already paid out over $1MM to publishers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How Much Can You Make Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#3F207F] mb-6">
              How Much Can You Make?
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Your earnings depend on the quality of your blog and the amount of posts you accept. 
              The more established your blog, the more the advertisers are willing to pay to be featured. 
              The more content you accept, the more you can get paid!
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-[#3F207F] text-center mb-12">
              What Our Publishers Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card hover>
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Content Manager has transformed how I monetize my blog. The content quality is excellent 
                  and payments are always on time. Highly recommended!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    <p className="font-semibold text-gray-900">Sarah Johnson</p>
                    <p className="text-sm text-gray-500">Tech Blogger</p>
                  </div>
                </div>
              </Card>

              <Card hover>
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "I've been working with Content Manager for over a year. The process is smooth, 
                  and I've earned significantly more than with traditional ad networks."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    <p className="font-semibold text-gray-900">Michael Chen</p>
                    <p className="text-sm text-gray-500">Lifestyle Blogger</p>
                  </div>
                </div>
              </Card>

              <Card hover>
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "The team is professional, responsive, and the content always matches my site's style. 
                  Best decision I made for my blog!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    <p className="font-semibold text-gray-900">Emily Rodriguez</p>
                    <p className="text-sm text-gray-500">Food Blogger</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Start Earning Today Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-[#3F207F] to-[#5A2F9F] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Start Earning Today
            </h2>
            <p className="text-xl text-gray-200">
              Ready to get started? Click the button below to apply:
            </p>
            <div className="pt-4">
              <Link href="/apply">
                <Button variant="primary" size="lg" className="text-lg px-8 py-4">
                  Apply Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-[#3F207F] text-center mb-12">
              F.A.Q.
            </h2>
            <div className="space-y-6">
              <FAQItem
                question="What is the minimum Domain Authority you will accept?"
                answer="Domain authority must be 20 or higher"
              />
              <FAQItem
                question="Will the content we provide contain links?"
                answer="Yes, the average article will contain around 3 links. These links must be set as Do-follow."
              />
              <FAQItem
                question="Do you accept all sites?"
                answer="We only accept sites that are written primarily in the English language"
              />
              <FAQItem
                question="I do not currently have a blog or my blog is outdated is that okay?"
                answer="If you do not have a blog set up please start your blog by adding at least 1 blog post so we can get a feel for your site. We want to see blogs that have been updated within the last 90 days."
              />
              <FAQItem
                question="Any other URL restrictions?"
                answer="We do not accept Subdomains, forum/community sites, sponsored tags, or guest post advertising."
              />
              <FAQItem
                question="Do you accept sites in the XYZ niche?"
                answer="We are open to accepting sites in every niche including grey niches."
              />
              <FAQItem
                question="What is the minimum monthly traffic you will accept?"
                answer="Our minimum monthly traffic is based on the DA of the website. Domains with DA's 20-39 require a minimum of 150 organic traffic. Domains with DA's 40+ require a minimum of 500 organic traffic."
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// FAQ Item Component
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-semibold text-gray-900">{question}</span>
        <svg
          className={`w-5 h-5 text-[#3F207F] transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-6 py-4 bg-gray-50 text-gray-700 border-t border-gray-200">
          {answer}
        </div>
      )}
    </div>
  );
}
