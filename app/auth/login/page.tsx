'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Handle login here
    setTimeout(() => {
      setIsLoading(false);
      // Redirect to dashboard
      window.location.href = '/dashboard';
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      {/* Breadcrumbs */}
      <div className="bg-[#F5F5F5] py-2 px-5 w-11/12 mx-auto mt-3">
        <div className="">
          <nav className="text-sm">
            <Link href="/" className="text-blue-600 hover:text-blue-700 transition-colors">
              Home
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-600">Sign In</span>
          </nav>
        </div>
      </div>
      
      <main className="flex items-center justify-center py-12 bg-white">
        <div className="container mx-auto px-4 max-w-xl w-full">
          <div className="bg-white">
            <h1 className="text-3xl font-semibold text-gray-800 mb-8">Sign In</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="Email"
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:border-[#3F207F] focus:ring-[#3F207F] transition-all duration-200"
                />
              </div>

              <div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  placeholder="Password"
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:border-[#3F207F] focus:ring-[#3F207F] transition-all duration-200"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                    className="w-4 h-4 text-[#3F207F] border-gray-300 rounded focus:ring-[#3F207F]"
                  />
                  <span className="ml-2 text-sm text-gray-700">Remember Me</span>
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm font-semibold text-[#026a1885] hover:text-[#26D1A6] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-3 bg-[#25DAC5] hover:bg-[#25DAC5] text-white font-semibold rounded-full cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#25DAC5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/apply"
                className="text-gray-700 hover:text-[#3F207F] transition-colors text-center"
              >
                Create a new account.
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

