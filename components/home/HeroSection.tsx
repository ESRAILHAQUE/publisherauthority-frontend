import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#142854] via-[#102046] to-[#0b1835] pb-16 pt-10 text-white md:pb-20 md:pt-14">
      {/* Background accents in brand colors */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-0 h-64 w-64 rounded-full bg-[#ff8a3c]/15 blur-3xl" />
        <div className="absolute -right-10 top-24 h-72 w-72 rounded-full bg-sky-400/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 md:flex-row md:items-center md:justify-between md:gap-10 lg:gap-14">
        {/* Left column */}
        <div className="max-w-xl space-y-7 md:space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/60 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-800 shadow-sm shadow-emerald-200 md:text-sm">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#ff8a3c] text-[10px] font-bold text-white">
              ★
            </span>
            Trusted by 500+ growing publishers
          </div>

          <div className="space-y-4 md:space-y-5">
            <h1 className="text-3xl font-semibold leading-tight tracking-tight text-white md:text-4xl lg:text-5xl">
            Monetize Your Blog ,

              <span className="bg-gradient-to-r from-[#ffb347] via-[#ff8a3c] to-amber-300 bg-clip-text text-transparent">
                {' '}
                Publish Quality Content & Earn
              </span>
            
            </h1>
            <p className="text-sm leading-relaxed text-slate-100/90 md:text-base">
              Ready to join the content revolution? Get high-quality content for your website and earn for every publication.

            </p>
          </div>

          <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center">
            <Link href="/apply" className="sm:w-auto w-full">
              <button className="cursor-pointer inline-flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-emerald-400 via-sky-400 to-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-300/60 transition-transform hover:-translate-y-[1px] hover:brightness-110 md:px-6 md:py-3 md:text-base">
              Get Started
                <svg
                  className="ml-2 h-4 w-4 md:h-5 md:w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
            </Link>

          </div>

          <div className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/5 p-3 text-xs text-slate-100 md:max-w-md md:p-4 md:text-sm">
            <div className="flex -space-x-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-8 w-8 rounded-full border border-white/60 bg-gradient-to-tr from-emerald-400 via-sky-400 to-indigo-400"
                />
              ))}
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-semibold text-white md:text-xs">
                $1M+ paid out to publishers
              </p>
              <p className="text-[11px] text-slate-200/90 md:text-xs">
                Bi-weekly payouts, transparent tracking, and dedicated support.
              </p>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1 text-[11px] text-emerald-300 md:text-xs">
                <span>4.8</span>
                <span className="text-yellow-300">★★★★★</span>
              </div>
              <span className="text-[10px] text-slate-200 md:text-[11px]">Publisher rating</span>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="relative mx-auto w-full">
          <div className="relative rounded-2xl border border-slate-700/70 bg-slate-950/70 p-3 shadow-2xl shadow-black/60 backdrop-blur">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-900">
              <Image
                src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&h=900&fit=crop&q=80"
                alt="Publisher performance dashboard"
                fill
                className="object-cover"
                priority
              />

              {/* Overlay cards */}
              <div className="absolute left-3 top-3 rounded-xl border border-slate-700/80 bg-slate-950/90 px-3 py-2 text-xs shadow-lg shadow-black/50">
                <p className="text-[11px] text-slate-300">This month earnings</p>
                <p className="text-base font-semibold text-emerald-300 md:text-lg">$4,230</p>
                <p className="text-[10px] text-emerald-200/80">+142% vs last month</p>
              </div>

              <div className="absolute bottom-3 right-3 flex flex-col gap-1 rounded-xl border border-emerald-400/40 bg-slate-950/90 px-3 py-2 text-[10px] text-emerald-100 shadow-lg shadow-emerald-500/40 md:text-xs">
                <div className="flex items-center justify-between gap-6">
                  <span>Filled slots</span>
                  <span className="font-semibold text-emerald-300">18 / 20</span>
                </div>
                <div className="mt-1 h-1.5 w-full rounded-full bg-slate-800">
                  <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-emerald-400 to-sky-400" />
                </div>
                <span className="mt-1 text-[10px] text-emerald-200/80">
                  You are in the top 12% of publishers this week.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

