import React from 'react';
import Link from 'next/link';

export const StartEarningTodaySection: React.FC = () => {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold text-primary-purple">
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
              <button className="px-10 py-4 bg-accent-teal hover:bg-accent-teal-dark text-white font-bold rounded-lg text-lg transition-all">
                Apply Now
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

