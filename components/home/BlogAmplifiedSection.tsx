import React from 'react';

export const BlogAmplifiedSection: React.FC = () => {
  const items = [
    {
      title: 'Premium content without the overhead',
      body: "Once you're approved, our team and partners provide ready-to-publish content tailored to your audience and vertical. You focus on editing and scheduling – not chasing briefs or invoices.",
      accent: 'from-emerald-400 to-sky-400',
    },
    {
      title: 'SEO momentum that compounds',
      body: 'Every new article is another opportunity to rank, pick up links, and earn more organic traffic. Because pieces are built around topics brands already invest in, they’re designed to perform over the long term.',
      accent: 'from-sky-400 to-indigo-400',
    },
    {
      title: 'Revenue that fits your brand',
      body: "No pop-ups. No auto-play. No clutter. Just editorial content that reads like the rest of your site – with transparent compensation for every live placement you accept.",
      accent: 'from-indigo-400 to-emerald-400',
    },
  ];

  return (
    <section className="bg-white py-14 text-slate-900 md:py-20">
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">
            Your blog,{' '}
            <span className="bg-gradient-to-r from-emerald-500 via-sky-500 to-indigo-500 bg-clip-text text-transparent">
              amplified
            </span>
          </h2>
          <p className="mt-3 text-sm text-slate-500 md:text-base">
            Keep the editorial voice your readers trust, while we plug in a performance-ready
            monetization engine behind the scenes.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:mt-14 md:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.title}
              className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-md shadow-slate-100 md:p-6 md:text-base"
            >
              <div
                className={`pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-gradient-to-br ${item.accent} opacity-15 blur-2xl`}
              />
              <h3 className="relative text-base font-semibold text-slate-900 md:text-lg">
                {item.title}
              </h3>
              <p className="relative mt-3 text-xs text-slate-600 md:text-sm">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

