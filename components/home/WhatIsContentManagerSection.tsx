import React from 'react';

export const WhatIsContentManagerSection: React.FC = () => {
  return (
    <section className="bg-white py-14 text-slate-900 md:py-20">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 md:flex-row md:items-start md:gap-14">
        <div className="md:w-5/12">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">
            What is{' '}
            <span className="bg-gradient-to-r from-emerald-500 to-sky-500 bg-clip-text text-transparent">
              Publisher Authority?
            </span>
          </h2>
          <p className="mt-3 text-sm text-slate-500 md:text-base">
            A revenue layer built specifically for serious publishers.
          </p>
        </div>

        <div className="space-y-5 text-sm text-slate-600 md:w-7/12 md:text-base">
          <p>
            Publisher Authority connects well-established blogs with brands that want awareness,
            authority, and search visibility – without interruptive display ads. Instead of
            cluttering your layout with banners, you publish high-quality editorial pieces
            that naturally feature these brands.
          </p>
          <p>
            Every article is written to match your audience and tone. You keep control over
            what goes live on your site, while we handle vetting, briefs, and coordination
            with advertisers.
          </p>
          <div className="grid gap-4 pt-2 sm:grid-cols-3">
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-xs md:text-sm">
              <p className="font-semibold text-emerald-700">Quality-first</p>
              <p className="mt-1 text-slate-600">
                Editorial content crafted for readers, not just search engines.
              </p>
            </div>
            <div className="rounded-xl border border-sky-100 bg-sky-50 p-4 text-xs md:text-sm">
              <p className="font-semibold text-sky-700">Brand-safe</p>
              <p className="mt-1 text-slate-600">
                Work with vetted brands that respect your audience and guidelines.
              </p>
            </div>
            <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4 text-xs md:text-sm">
              <p className="font-semibold text-indigo-700">Future-proof</p>
              <p className="mt-1 text-slate-600">
                Built around content marketing – the model modern advertisers prefer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

