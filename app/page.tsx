"use client";

import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-[#3F207F] text-white py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              The Easiest Way To Monetize Your Blog Without Annoying Ads
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
              Ready to join the content revolution? With Content Manager, we're
              changing the way blogs can be monetized.
            </p>
            <div className="pt-6">
              <Link href="/apply">
                <button className="px-10 py-4 bg-[#2EE6B7] hover:bg-[#26D1A6] text-white font-bold rounded-lg text-lg transition-all">
                  Apply Now
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What Is Content Manager Section */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-[#3F207F] mb-8">
              What Is Content Manager?
            </h2>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              Content manager connects well-established blogs with brands that
              need more attention. Instead of plastering annoying ads on your
              site, these brands are more interested in being mentioned in a
              valuable piece of content that's featured on your site. This is
              the future of marketing, content marketing.
            </p>
          </div>
        </div>
      </section>

      {/* Your Blog, Amplified Section */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-[#3F207F] text-center mb-16">
              Your Blog, Amplified
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Get Valuable Content, For Free
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Once you're approved, we'll work with you to craft valuable
                  content that speaks to your audience and mentions the brand.
                  This is the same type of content most blogs pay just to have
                  written.
                </p>
              </div>

              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Grow Your Traffic
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Every piece of content you post to your site is a chance to
                  rank for more keywords and get more free traffic from Google.
                  With our optimized content, you can sit back and watch your
                  organic traffic grow.
                </p>
              </div>

              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Monetize Your Blog
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Not only will you be able to get awesome content that connects
                  with your readers, you'll earn every time you post one of our
                  blogs… no annoying ads necessary!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-[#3F207F] text-center mb-16">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="w-20 h-20 bg-[#E64980] rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="mb-4">
                  <span className="text-base font-bold text-[#E64980]">
                    Step 1:
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 mt-2">
                    Sign Up For Free
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Sign Up for a free account and submit your blog(s). Depending
                  on the quality of your website, we'll tell you how much brands
                  are willing to pay to be featured.
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-[#E64980] rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="mb-4">
                  <span className="text-base font-bold text-[#E64980]">
                    Step 2:
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 mt-2">
                    Post Our Valuable Content
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  We'll send you content that matches your audience. Just post
                  it to your blog and submit the URL in our portal. It's that
                  easy.
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-[#E64980] rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="mb-4">
                  <span className="text-base font-bold text-[#E64980]">
                    Step 3:
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 mt-2">
                    Get Paid Bi-weekly
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Once the posts are live, we send out bi-weekly payments
                  through your chosen payment method. We've already paid out
                  over $1MM to publishers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How Much Can You Make Section */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-[#3F207F] mb-8">
              How Much Can You Make?
            </h2>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              Your earnings depend on the quality of your blog and the amount of
              posts you accept. The more established your blog, the more the
              advertisers are willing to pay to be featured. The more content
              you accept, the more you can get paid!
            </p>
          </div>
        </div>
      </section>

      {/* Start Earning Today Section */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-[#3F207F]">
              Start Earning Today
            </h2>
            <div className="space-y-1">
              <p className="text-lg text-gray-700">Ready to get started?</p>
              <p className="text-lg text-gray-700">
                Click the button below to apply:
              </p>
            </div>
            <div className="pt-4">
              <Link href="/apply">
                <button className="px-10 py-4 bg-[#2EE6B7] hover:bg-[#26D1A6] text-white font-bold rounded-lg text-lg transition-all">
                  Apply Now
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-28 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-[#3F207F] text-center mb-12">
              F.A.Q.
            </h2>
            <div className="space-y-6 text-left">
              <div>
                <p className="font-bold text-lg text-gray-900 mb-2">
                  Q. What is the minimum Domain Authority you will accept?
                </p>
                <p className="text-gray-700">
                  A. Domain authority must be 20 or higher
                </p>
              </div>
              <div>
                <p className="font-bold text-lg text-gray-900 mb-2">
                  Q. Will the content we provide contain links?
                </p>
                <p className="text-gray-700">
                  A. Yes, the average article will contain around 3 links. These
                  links must be set as Do-follow.
                </p>
              </div>
              <div>
                <p className="font-bold text-lg text-gray-900 mb-2">
                  Q. Do you accept all sites?
                </p>
                <p className="text-gray-700">
                  A. We only accept sites that are written primarily in the
                  English language
                </p>
              </div>
              <div>
                <p className="font-bold text-lg text-gray-900 mb-2">
                  Q. I do not currently have a blog or my blog is outdated is
                  that okay?
                </p>
                <p className="text-gray-700">
                  A. If you do not have a blog set up please start your blog by
                  adding at least 1 blog post so we can get a feel for your
                  site. We want to see blogs that have been updated within the
                  last 90 days.
                </p>
              </div>
              <div>
                <p className="font-bold text-lg text-gray-900 mb-2">
                  Q. Any other URL restrictions?
                </p>
                <p className="text-gray-700">
                  A. We do not accept Subdomains, forum/community sites,
                  sponsored tags, or guest post advertising.
                </p>
              </div>
              <div>
                <p className="font-bold text-lg text-gray-900 mb-2">
                  Q. Do you accept sites in the XYZ niche?
                </p>
                <p className="text-gray-700">
                  A. We are open to accepting sites in every niche including
                  grey niches.
                </p>
              </div>
              <div>
                <p className="font-bold text-lg text-gray-900 mb-2">
                  Q. What is the minimum monthly traffic you will accept?
                </p>
                <p className="text-gray-700">
                  Our minimum monthly traffic is based on the DA of the website.
                  Domains with DA's 20-39 require a minimum of 150 organic
                  traffic.
                </p>
                <p className="text-gray-700 mt-1">
                  Domains with DA's 40+ require a minimum of 500 organic
                  traffic.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}