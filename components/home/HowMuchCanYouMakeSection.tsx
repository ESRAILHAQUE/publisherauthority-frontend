import React from 'react';

export const HowMuchCanYouMakeSection: React.FC = () => {
  return (
    <section className="bg-white py-14 text-slate-900 md:py-20">
      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:items-center">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">
              How much can you make with{' '}
              <span className="bg-gradient-to-r from-emerald-500 to-sky-500 bg-clip-text text-transparent">
                publisherauthority
              </span>
              ?
            </h2>
            <p className="mt-3 text-sm text-slate-600 md:text-base">
              Your earnings depend on the authority and performance of your blogs, plus how many
              campaigns you choose to accept. Higher quality sites see higher rates and more
              frequent opportunities.
            </p>
            <p className="mt-3 text-sm text-slate-600 md:text-base">
              Many publishers start by filling a few open placements per month, then scale to a
              repeatable revenue line as they add more sites and content capacity.
            </p>
          </div>

          <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600 shadow-md shadow-slate-100 md:p-6">
            <div className="flex items-center justify-between text-xs md:text-sm">
              <span className="text-slate-600">Typical range for active publishers</span>
              <span className="font-semibold text-emerald-600">$500 – $3,000 / month</span>
            </div>
            <div className="mt-1 h-2 w-full rounded-full bg-emerald-50">
              <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-indigo-500" />
            </div>
            <ul className="mt-3 space-y-1.5 text-xs text-slate-600 md:text-sm">
              <li>• Higher DA and traffic typically unlock higher-per-placement rates.</li>
              <li>• You stay in control of how many posts you accept each month.</li>
              <li>• Bi‑weekly payouts keep cash flow predictable.</li>
            </ul>
            <p className="pt-1 text-[11px] text-slate-500 md:text-xs">
              Earnings are not guaranteed and depend on your sites, niche, and campaign volume –
              but we designed the platform so your upside grows with your authority.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

