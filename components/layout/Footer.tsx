import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
            <Link href="/about" className="hover:text-[#3F207F] transition-colors">
              About
            </Link>
            <Link href="/contact" className="hover:text-[#3F207F] transition-colors">
              Contact
            </Link>
            <Link href="/apply" className="hover:text-[#3F207F] transition-colors">
              Signup
            </Link>
            <Link href="/auth/login" className="hover:text-[#3F207F] transition-colors">
              Login
            </Link>
          </div>
          <div className="text-sm text-gray-600">
            © ContentManager.io 2025
          </div>
        </div>
      </div>
    </footer>
  );
};
