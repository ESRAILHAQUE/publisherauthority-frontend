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
    <section className="bg-gray-50 py-16">
      <div className="mx-auto w-full max-w-4xl px-4">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">
            Questions from publishers,{' '}
            <span className="bg-linear-to-r from-emerald-500 to-sky-500 bg-clip-text text-transparent">
              answered
            </span>
          </h2>
          <p className="mt-3 text-sm text-slate-600 md:text-base">
            Everything you need to know before you submit your sites.
          </p>
        </div>

        <div className="space-y-0">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="overflow-hidden rounded-md border border-gray-200 bg-white"
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                >
                  <h3 className="text-base font-medium text-gray-900 md:text-lg">
                    {faq.question}
                  </h3>
                  <svg
                    className={`ml-4 h-5 w-5 shrink-0 text-gray-500 transition-transform duration-200 ${
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
                </button>

                <div
                  id={`faq-answer-${index}`}
                  className={`transition-all duration-200 ease-in-out ${
                    isOpen ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <div className="border-t border-gray-200 px-6 py-4">
                    <p className="text-sm text-gray-600 md:text-base">
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

