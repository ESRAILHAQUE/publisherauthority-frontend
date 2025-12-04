"use client";

import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-b from-[#142854] via-[#102046] to-[#0b1835] overflow-hidden">
          {/* Background accents */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-10 top-0 h-48 w-48 rounded-full bg-sky-400/20 blur-3xl" />
            <div className="absolute left-1/4 top-10 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-6 py-12 md:py-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white">
              Terms and Conditions
            </h1>
          </div>
        </div>

        {/* Gradient Line Separator */}
        <div className="h-1 bg-gradient-to-r from-emerald-400 via-sky-400 to-indigo-500"></div>

        {/* Content Section */}
        <div className="max-w-6xl mx-auto px-6 py-16">
          {/* Introduction */}
          <div className="mb-12">
            <p className="text-gray-700 leading-relaxed text-lg mb-6">
              Welcome to the Terms of Use for PublisherAuthority.com (the
              &quot;Platform&quot;). This Agreement (&quot;Agreement&quot;) is
              between PublisherAuthority.com, the owner and operator of the
              Platform, and you, a registered user of the Platform. By using
              PublisherAuthority.com, you agree to comply with these Terms and
              Conditions.
            </p>
          </div>

          {/* Section 1: User Registration */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 uppercase">
              User Registration
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed text-lg">
              <p>• Users must be over 18 years old.</p>
              <p>• Each user may register only one account.</p>
              <p>
                • Only Website Owners and authors are allowed to register or use
                this platform.
              </p>
              <p>
                • Users are responsible for keeping their passwords secure and
                are liable for all activity under their account.
              </p>
            </div>
          </section>

          {/* Section 2: Prohibited Activities */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 uppercase">
              Prohibited Activities
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg mb-4">
              Users may not:
            </p>
            <div className="space-y-4 text-gray-700 leading-relaxed text-lg">
              <p>
                • Access or use the Platform for purposes other than intended.
              </p>
              <p>• Sell, transfer, or share their account with others.</p>
              <p>
                • Make any unauthorized use of the Platform, including sending
                unsolicited emails or contacting any vendors or clients.
              </p>
              <p>
                • Harass or intimidate any employees of PublisherAuthority.com.
              </p>
              <p>• Copy, adapt, or modify any Platform software.</p>
              <p>
                • Create multiple accounts. If multiple accounts are detected,
                all accounts will be terminated immediately, and no further
                payments will be processed.
              </p>
              <p>• Misuse support services or submit false reports.</p>
              <p>• Publish content on sites not approved in your account.</p>
              <p>
                • Replace or modify content provided by PublisherAuthority.com
                with your own.
              </p>
            </div>
          </section>

          {/* Section 3: Clawbacks */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 uppercase">
              Clawbacks
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg mb-4">
              We reserve the right to debit payments for jobs that have already
              been paid if any of the following issues are identified:
            </p>
            <div className="space-y-4 text-gray-700 leading-relaxed text-lg">
              <p>
                <strong>• 404 Error:</strong> The link to the job results in a
                &quot;404 Not Found&quot; error.
              </p>
              <p>
                <strong>• No Anchor Text:</strong> The link does not contain
                anchor text, or the anchor text is missing.
              </p>
              <p>
                <strong>• Homepage Redirects:</strong> The link redirects to the
                homepage instead of the intended page.
              </p>
              <p>
                <strong>• Changed Content After Approval:</strong> The content
                has been altered after approval.
              </p>
              <p>
                <strong>• No Link in Anchor Text:</strong> The anchor text does
                not contain a link.
              </p>
            </div>
            <p className="text-gray-700 leading-relaxed text-lg mt-6">
              If it is determined that the publisher is at fault for these
              issues, we will reverse the payment in the next payment cycle.
            </p>
          </section>

          {/* Section 4: Retracted Payment */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 uppercase">
              Retracted Payment
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              For jobs that have not yet been paid, we reserve the right to
              retract payment if the job is found to be down or has any of the
              issues listed above due to the publisher&apos;s fault. This may
              occur before payment is made, and the amount will be withheld or
              reversed in the next payment cycle.
            </p>
          </section>

          {/* Section 5: Additional Terms */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 uppercase">
              Additional Terms
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed text-lg">
              <p>
                • We reserve the right to deactivate your site(s) or account at
                any time for inappropriate behavior, including but not limited
                to:
              </p>
              <div className="ml-8 space-y-2">
                <p>- Violating any Terms and Conditions.</p>
                <p>- Abusing the PublisherAuthority.com system.</p>
                <p>
                  - Violating trust between the publisher and the
                  PublisherAuthority.com team.
                </p>
              </div>
              <p>
                • Users may update site prices within their account; however,
                current orders in the queue will retain the original price.
                Future orders will reflect the new price.
              </p>
              <p>
                • We reserve the right to cancel any orders and not process
                payment. Users will receive email notification if an order is
                canceled.
              </p>
              <p>
                • All orders must be completed within 5 days once ready for
                review. Late orders will be canceled and removed from the queue,
                with no payment processed.
              </p>
              <p>
                • No-Follow links will not be accepted. Orders with No-Follow
                links will be canceled, no payment will be processed, and the
                site may be removed.
              </p>
              <p>
                • Affiliate links, subdomain sites, forums/community sites, and
                sponsored post sites are not accepted. Violating sites will be
                deactivated.
              </p>
              <p>
                • We do not accept links that deviate from the original target
                URL provided.
              </p>
              <p>• Only English content sites are accepted.</p>
              <p>
                • Sites advertising sponsored links or sections will be
                deactivated.
              </p>
              <p>
                • Publishers may not contact clients demanding payment or
                threatening to remove posts/links. Violating sites will be
                deactivated.
              </p>
              <p>
                • Price changes for active sites only apply to new jobs. Current
                jobs retain the original price.
              </p>
              <p>
                • Once payment has been successfully received, no disputes or
                refunds for that payment will be accepted.
              </p>
            </div>
          </section>

          {/* Contact Section */}
          <section className="mt-16 pt-8 border-t-4 border-gray-200">
            <p className="text-gray-700 text-lg leading-relaxed">
              If you have any questions about these Terms and Conditions, please
              contact us at{" "}
              <a
                href="mailto:Info@publisherauthority.com"
                className="text-primary-purple hover:text-primary-purple-light font-semibold underline">
                Info@publisherauthority.com
              </a>
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
