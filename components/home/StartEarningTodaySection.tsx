import React from 'react';
import Link from 'next/link';

export const StartEarningTodaySection: React.FC = () => {
  return (
    <section className="bg-white py-14 text-slate-900 md:py-20">
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="relative overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-sky-50 to-emerald-50 p-8 text-center shadow-xl shadow-emerald-100 md:p-10">
          <div className="pointer-events-none absolute -left-20 top-0 h-40 w-40 rounded-full bg-emerald-200/40 blur-3xl" />
          <div className="pointer-events-none absolute -right-24 bottom-0 h-48 w-48 rounded-full bg-sky-200/40 blur-3xl" />

          <h2 className="relative text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl lg:text-4xl">
            Ready to turn your content into a real revenue channel?
          </h2>
          <p className="relative mt-3 text-sm text-slate-600 md:text-base">
            Submit your sites in a few clicks, get a quick review, and start receiving briefs from
            brands that are eager to reach your audience.
          </p>

          <div className="relative mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link href="/apply" className="w-full sm:w-auto">
              <button className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-indigo-500 px-8 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-300/60 transition-transform hover:-translate-y-[1px] hover:brightness-110 md:px-10 md:text-base">
                Apply as a publisher
              </button>
            </Link>
            <p className="text-[11px] text-slate-600 md:text-xs">
              No setup fee • No obligation • Keep full control over what you publish
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

