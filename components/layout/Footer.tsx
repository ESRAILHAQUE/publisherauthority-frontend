import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#3F207F] to-[#2EE6B7] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">CM</span>
              </div>
              <span className="text-xl font-bold text-white">Content Manager</span>
            </div>
            <p className="text-sm text-gray-400">
              The easiest way to monetize your blog without annoying ads.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-[#2EE6B7] transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/apply" className="hover:text-[#2EE6B7] transition-colors text-sm">
                  Apply as Publisher
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[#2EE6B7] transition-colors text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-[#2EE6B7] transition-colors text-sm">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="hover:text-[#2EE6B7] transition-colors text-sm">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#2EE6B7] transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#2EE6B7] transition-colors text-sm">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li>
                <a href="mailto:support@contentmanager.io" className="hover:text-[#2EE6B7] transition-colors text-sm">
                  support@contentmanager.io
                </a>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#2EE6B7] transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>© {currentYear} Content Manager. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

