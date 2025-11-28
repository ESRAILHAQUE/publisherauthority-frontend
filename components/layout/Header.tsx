'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '../shared/Button';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#3F207F]">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-white hover:opacity-80 transition-opacity">
            Content Manager
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/about" className="text-white hover:opacity-80 transition-opacity">
              About
            </Link>
            <Link href="/blog" className="text-white hover:opacity-80 transition-opacity">
              Blog
            </Link>
            <Link href="/contact" className="text-white hover:opacity-80 transition-opacity">
              Contact
            </Link>
            <Link href="/terms" className="text-white hover:opacity-80 transition-opacity">
              Terms And Conditions
            </Link>
            <Link href="/auth/login" className="text-white hover:opacity-80 transition-opacity">
              Login
            </Link>
            <Link href="/apply">
              <button className="px-5 py-2 bg-[#5A2F9F] hover:bg-[#6B3FB0] text-white rounded-lg font-medium transition-colors">
                Sign Up
              </button>
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
              href="/about"
              className="block py-2 text-gray-700 hover:text-[#3F207F] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/blog"
              className="block py-2 text-gray-700 hover:text-[#3F207F] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              href="/contact"
              className="block py-2 text-gray-700 hover:text-[#3F207F] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              href="/terms"
              className="block py-2 text-gray-700 hover:text-[#3F207F] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Terms And Conditions
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

