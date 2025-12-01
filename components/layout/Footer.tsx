import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-800 bg-[#050716] py-5 text-xs text-slate-300 md:text-sm">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-center gap-6 px-4 md:gap-8">
        <a href="/about" className="hover:text-white transition-colors">
          About
        </a>
        <a href="/contact" className="hover:text-white transition-colors">
          Contact
        </a>
        <a href="/apply" className="hover:text-white transition-colors">
          Sign Up
        </a>
        <a href="/auth/login" className="hover:text-white transition-colors">
          Login
        </a>
      </div>
    </footer>
  );
};
