'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="w-[90%] mx-auto px-4">
            {/* Header Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-[#3F207F] mb-4">
                Terms & Conditions
              </h1>
              <p className="text-gray-600 text-lg">
                PublisherAuthority.com Terms of Use
              </p>
            </div>

            {/* All Content */}
            <div>
              {/* Introduction */}
              <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-8">
                <p className="text-gray-700 leading-relaxed">
                  Welcome to the Terms of Use for PublisherAuthority.com (the &quot;Platform&quot;). 
                  This Agreement (&quot;Agreement&quot;) is between PublisherAuthority.com, the owner and 
                  operator of the Platform, and you, a registered user of the Platform. By using 
                  PublisherAuthority.com, you agree to comply with these Terms and Conditions.
                </p>
              </div>

              {/* Terms Sections */}
              <div className="space-y-6">
              {/* Section 1 */}
              <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
                <h2 className="text-2xl font-bold text-[#3F207F] mb-4 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#3F207F] to-[#2EE6B7] text-white text-sm font-bold">
                    1
                  </span>
                  User Registration
                </h2>
                <ul className="space-y-3 text-gray-700 leading-relaxed ml-10">
                  <li className="flex items-start gap-3">
                    <span className="text-[#2EE6B7] mt-1">•</span>
                    <span>Users must be over 18 years old.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#2EE6B7] mt-1">•</span>
                    <span>Each user may register only one account.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#2EE6B7] mt-1">•</span>
                    <span>Only Website Owners and authors are allowed to register or use this platform.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#2EE6B7] mt-1">•</span>
                    <span>Users are responsible for keeping their passwords secure and are liable for all activity under their account.</span>
                  </li>
                </ul>
              </div>

              {/* Section 2 */}
              <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
                <h2 className="text-2xl font-bold text-[#3F207F] mb-4 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#3F207F] to-[#2EE6B7] text-white text-sm font-bold">
                    2
                  </span>
                  Prohibited Activities
                </h2>
                <p className="text-gray-700 mb-4 ml-10">Users may not:</p>
                <ul className="space-y-3 text-gray-700 leading-relaxed ml-10">
                  <li className="flex items-start gap-3">
                    <span className="text-[#2EE6B7] mt-1">•</span>
                    <span>Access or use the Platform for purposes other than intended.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#2EE6B7] mt-1">•</span>
                    <span>Sell, transfer, or share their account with others.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#2EE6B7] mt-1">•</span>
                    <span>Make any unauthorized use of the Platform, including sending unsolicited emails or contacting any vendors or clients.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#2EE6B7] mt-1">•</span>
                    <span>Harass or intimidate any employees of PublisherAuthority.com.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#2EE6B7] mt-1">•</span>
                    <span>Copy, adapt, or modify any Platform software.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#2EE6B7] mt-1">•</span>
                    <span>Create multiple accounts. If multiple accounts are detected, all accounts will be terminated immediately, and no further payments will be processed.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#2EE6B7] mt-1">•</span>
                    <span>Misuse support services or submit false reports.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#2EE6B7] mt-1">•</span>
                    <span>Publish content on sites not approved in your account.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#2EE6B7] mt-1">•</span>
                    <span>Replace or modify content provided by PublisherAuthority.com with your own.</span>
                  </li>
                </ul>
              </div>

              {/* Section 3 */}
              <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
                <h2 className="text-2xl font-bold text-[#3F207F] mb-4 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#3F207F] to-[#2EE6B7] text-white text-sm font-bold">
                    3
                  </span>
                  Clawbacks
                </h2>
                <p className="text-gray-700 mb-4 ml-10 leading-relaxed">
                  We reserve the right to debit payments for jobs that have already been paid if any of the following issues are identified:
                </p>
                <ul className="space-y-3 text-gray-700 leading-relaxed ml-10">
                  <li className="flex items-start gap-3">
                    <span className="text-[#2EE6B7] mt-1">•</span>
                    <span><strong>404 Error:</strong> The link to the job results in a &quot;404 Not Found&quot; error.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#2EE6B7] mt-1">•</span>
                    <span><strong>No Anchor Text:</strong> The link does not contain anchor text, or the anchor text is missing.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#2EE6B7] mt-1">•</span>
                    <span><strong>Homepage Redirects:</strong> The link redirects to the homepage instead of the intended page.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#2EE6B7] mt-1">•</span>
                    <span><strong>Changed Content After Approval:</strong> The content has been altered after approval.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#2EE6B7] mt-1">•</span>
                    <span><strong>No Link in Anchor Text:</strong> The anchor text does not contain a link.</span>
                  </li>
                </ul>
                <p className="text-gray-700 mt-4 ml-10 leading-relaxed">
                  If it is determined that the publisher is at fault for these issues, we will reverse the payment in the next payment cycle.
                </p>
              </div>

              {/* Section 4 */}
              <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
                <h2 className="text-2xl font-bold text-[#3F207F] mb-4 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#3F207F] to-[#2EE6B7] text-white text-sm font-bold">
                    4
                  </span>
                  Retracted Payment
                </h2>
                <p className="text-gray-700 leading-relaxed ml-10">
                  For jobs that have not yet been paid, we reserve the right to retract payment if the job is found to be down or has any of the issues listed above due to the publisher&apos;s fault. This may occur before payment is made, and the amount will be withheld or reversed in the next payment cycle.
                </p>
              </div>

              {/* Section 5 */}
              <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
                <h2 className="text-2xl font-bold text-[#3F207F] mb-4 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#3F207F] to-[#2EE6B7] text-white text-sm font-bold">
                    5
                  </span>
                  Additional Terms
                </h2>
                <ul className="space-y-3 text-gray-700 leading-relaxed ml-10">
                  <li className="flex items-start gap-3">
                    <span className="text-[#2EE6B7] mt-1">•</span>
                    <span>We reserve the right to deactivate your site(s) or account at any time for inappropriate behavior, including but not limited to:</span>
                  </li>
                  <li className="flex items-start gap-3 ml-6">
                    <span className="text-gray-400 mt-1">-</span>
                    <span>Violating any Terms and Conditions.</span>
                  </li>
                  <li className="flex items-start gap-3 ml-6">
                    <span className="text-gray-400 mt-1">-</span>
                    <span>Abusing the PublisherAuthority.com system.</span>
                  </li>
                  <li className="flex items-start gap-3 ml-6">
                    <span className="text-gray-400 mt-1">-</span>
                    <span>Violating trust between the publisher and the PublisherAuthority.com team.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#2EE6B7] mt-1">•</span>
                    <span>Users may update site prices within their account; however, current orders in the queue will retain the original price. Future orders will reflect the new price.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#2EE6B7] mt-1">•</span>
                    <span>We reserve the right to cancel any orders and not process payment. Users will receive email notification if an order is canceled.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#2EE6B7] mt-1">•</span>
                    <span>All orders must be completed within 5 days once ready for review. Late orders will be canceled and removed from the queue, with no payment processed.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#2EE6B7] mt-1">•</span>
                    <span>No-Follow links will not be accepted. Orders with No-Follow links will be canceled, no payment will be processed, and the site may be removed.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#2EE6B7] mt-1">•</span>
                    <span>Affiliate links, subdomain sites, forums/community sites, and sponsored post sites are not accepted. Violating sites will be deactivated.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#2EE6B7] mt-1">•</span>
                    <span>We do not accept links that deviate from the original target URL provided.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#2EE6B7] mt-1">•</span>
                    <span>Only English content sites are accepted.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#2EE6B7] mt-1">•</span>
                    <span>Sites advertising sponsored links or sections will be deactivated.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#2EE6B7] mt-1">•</span>
                    <span>Publishers may not contact clients demanding payment or threatening to remove posts/links. Violating sites will be deactivated.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#2EE6B7] mt-1">•</span>
                    <span>Price changes for active sites only apply to new jobs. Current jobs retain the original price.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#2EE6B7] mt-1">•</span>
                    <span>Once payment has been successfully received, no disputes or refunds for that payment will be accepted.</span>
                  </li>
                </ul>
              </div>
              </div>

              {/* Footer Note */}
              <div className="mt-12 bg-gradient-to-r from-[#3F207F] to-[#2EE6B7] rounded-xl shadow-md p-6 md:p-8 text-center">
                <p className="text-white text-lg font-semibold mb-2">
                  Questions about our Terms & Conditions?
                </p>
                <p className="text-white/90">
                  Contact us at{' '}
                  <a 
                    href="mailto:support@contentmanager.io" 
                    className="underline hover:text-white font-semibold"
                  >
                    support@contentmanager.io
                  </a>
                </p>
              </div>
            </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

