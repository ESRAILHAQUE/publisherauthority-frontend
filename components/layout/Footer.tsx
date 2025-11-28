import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white py-12">
      <div className="container mx-auto px-4 text-center">
        <div className="flex justify-center space-x-8 mb-6">
          <Link href="/about" className="text-[#3F207F] hover:text-[#2EE6B7] transition-colors text-sm">
            About
          </Link>
          <Link href="/contact" className="text-[#3F207F] hover:text-[#2EE6B7] transition-colors text-sm">
            Contact
          </Link>
          <Link href="/apply" className="text-[#3F207F] hover:text-[#2EE6B7] transition-colors text-sm">
            Signup
          </Link>
          <Link href="/auth/login" className="text-[#3F207F] hover:text-[#2EE6B7] transition-colors text-sm">
            Login
          </Link>
        </div>
        <p className="text-sm text-gray-500">© ContentManager.io 2025</p>
      </div>
    </footer>
  );
};
