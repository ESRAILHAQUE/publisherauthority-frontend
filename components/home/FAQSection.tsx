import React from 'react';

interface FAQItem {
  question: string;
  answer: string | React.ReactNode;
}

export const FAQSection: React.FC = () => {
  const faqs: FAQItem[] = [
    {
      question: 'What is the minimum Domain Authority you will accept?',
      answer: 'Domain authority must be 20 or higher.',
    },
    {
      question: 'Will the content we provide contain links?',
      answer: 'Yes. Most articles include around 3 contextual links that must be set as do-follow.',
    },
    {
      question: 'Do you accept all sites?',
      answer: 'We currently only accept sites written primarily in English.',
    },
    {
      question: 'My blog is outdated — can I still apply?',
      answer:
        'Please make sure you have at least one recent post. We typically look for blogs that have been updated within the last 90 days.',
    },
    {
      question: 'Any other URL restrictions?',
      answer:
        'We do not accept subdomains, forum/community sites, sponsored tags, or guest post advertising pages as primary placement URLs.',
    },
    {
      question: 'Do you accept “grey” niches?',
      answer: 'We are open to sites in most niches, including many grey areas, as long as they meet our quality guidelines.',
    },
    {
      question: 'What is the minimum monthly traffic you will accept?',
      answer: (
        <>
          Our minimum traffic depends on authority. Domains with DA 20–39 require a minimum of 150
          monthly organic visits.
          <br className="mt-1 block" />
          Domains with DA 40+ require a minimum of 500 monthly organic visits.
        </>
      ),
    },
  ];

  return (
    <section className="bg-white py-14 text-slate-900 md:py-20">
      <div className="mx-auto w-full max-w-5xl px-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">
            Questions from publishers,{' '}
            <span className="bg-gradient-to-r from-emerald-500 to-sky-500 bg-clip-text text-transparent">
              answered
            </span>
          </h2>
          <p className="mt-3 text-sm text-slate-600 md:text-base">
            Everything you need to know before you submit your sites.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:mt-10">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-200 bg-white p-4 text-left text-sm text-slate-600 shadow-sm shadow-slate-100 md:p-5 md:text-base"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600 md:text-[13px]">
                Q{index + 1}.
              </p>
              <p className="mt-1 font-semibold text-slate-900">{faq.question}</p>
              <p className="mt-2 text-xs text-slate-600 md:text-sm">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

