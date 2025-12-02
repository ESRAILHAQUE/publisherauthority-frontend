'use client';

import React, { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string | React.ReactNode;
}

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: 'How do I join the Publisher Authority platform?',
      answer:
        'Click on "Apply as Publisher" in the navigation menu and fill out the application form. Make sure to provide all required information including your blog details and guest post examples.',
    },
    {
      question: 'What is the minimum monthly traffic you will accept?',
      answer:
        "Our traffic requirements depend on the website's Domain Authority (DA): Websites with DA 20+ must have at least 500 organic visitors per month.",
    },
    {
      question: 'Do you accept all sites?',
      answer: 'We currently only accept sites written primarily in English.',
    },
    {
      question: 'Any other URL restrictions?',
      answer:
        'We do not accept subdomains, forum or community sites, sponsored tags, or sites primarily used for guest post advertising.',
    },
    {
      question: 'How often will I receive orders?',
      answer:
        'Order frequency depends on your website quality, niche, and availability. High-quality sites with good metrics typically receive regular orders.',
    },
    {
      question: 'When will I get paid?',
      answer:
        'Payments are sent bi-weekly on the 1st and 15th of each month. If these dates fall on weekends, payments are processed on the next business day.',
    },
  ];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-100 transition-all duration-200 hover:shadow-md"
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full p-5 text-left transition-colors duration-200 hover:bg-slate-50 md:p-6"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-600 md:text-[13px]">
                        Q{index + 1}.
                      </div>
                      <h3 className="text-base font-semibold text-slate-900 md:text-lg">
                        {faq.question}
                      </h3>
                    </div>
                    <div className="flex-shrink-0">
                      <svg
                        className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </button>

                <div
                  id={`faq-answer-${index}`}
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="border-t border-slate-100 px-5 pb-5 pt-4 md:px-6 md:pb-6">
                    <p className="text-sm leading-relaxed text-slate-600 md:text-base">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

