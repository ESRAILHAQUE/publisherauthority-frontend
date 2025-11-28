'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '../shared/Button';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-[#3F207F] to-[#2EE6B7] rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
              <span className="text-white font-bold text-xl">CM</span>
            </div>
            <span className="text-xl font-bold text-[#3F207F]">Content Manager</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-[#3F207F] transition-colors font-medium">
              Home
            </Link>
            <Link href="/blog" className="text-gray-700 hover:text-[#3F207F] transition-colors font-medium">
              Blog
            </Link>
            <Link href="/support" className="text-gray-700 hover:text-[#3F207F] transition-colors font-medium">
              Support
            </Link>
            <Link href="/apply" className="text-gray-700 hover:text-[#3F207F] transition-colors font-medium">
              Apply as Publisher
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" size="sm">Login</Button>
            </Link>
            <Link href="/apply">
              <Button variant="primary" size="sm">Sign Up</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3 border-t pt-4">
            <Link
              href="/"
              className="block py-2 text-gray-700 hover:text-[#3F207F] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/blog"
              className="block py-2 text-gray-700 hover:text-[#3F207F] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              href="/support"
              className="block py-2 text-gray-700 hover:text-[#3F207F] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Support
            </Link>
            <Link
              href="/apply"
              className="block py-2 text-gray-700 hover:text-[#3F207F] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Apply as Publisher
            </Link>
            <div className="flex flex-col space-y-2 pt-2">
              <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" size="sm" className="w-full">Login</Button>
              </Link>
              <Link href="/apply" onClick={() => setIsMenuOpen(false)}>
                <Button variant="primary" size="sm" className="w-full">Sign Up</Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

