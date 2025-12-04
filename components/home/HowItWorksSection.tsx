import React from 'react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      step: 1,
      title: 'Apply once, add your sites',
      description:
        "Create a free account and submit the sites you want to monetize. We review authority, traffic, and quality so brands know they’re working with real publishers.",
    },
    {
      step: 2,
      title: 'Accept briefs that fit',
      description:
        'When a campaign matches your sites, you’ll see the content, price, and requirements up front. Publish on your schedule and keep full editorial control.',
    },
    {
      step: 3,
      title: 'Get paid on autopilot',
      description:
        'Add your preferred payout method and receive bi‑weekly payments for approved posts. Track performance and lifetime earnings from a single dashboard.',
    },
  ];

  return (
    <section className="bg-white py-14 text-slate-900 md:py-20">
      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">
            How it works for publishers
          </h2>
          <p className="mt-3 text-sm text-slate-600 md:text-base">
            A simple, repeatable flow designed so you spend more time publishing and less time
            negotiating.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:mt-14 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.step}
              className="relative rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-md shadow-slate-100 md:p-6 md:text-base"
            >
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-sky-400 text-xs font-semibold text-white">
                  {step.step}
                </span>
                Step {step.step}
              </div>
              <h3 className="text-base font-semibold text-slate-900 md:text-lg">{step.title}</h3>
              <p className="mt-3 text-xs text-slate-600 md:text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

