import React from 'react';

interface FAQItem {
  question: string;
  answer: string | React.ReactNode;
}

export const FAQSection: React.FC = () => {
  const faqs: FAQItem[] = [
    {
      question: 'What is the minimum Domain Authority you will accept?',
      answer: 'Domain authority must be 20 or higher',
    },
    {
      question: 'Will the content we provide contain links?',
      answer: 'Yes, the average article will contain around 3 links. These links must be set as Do-follow.',
    },
    {
      question: 'Do you accept all sites?',
      answer: 'We only accept sites that are written primarily in the English language',
    },
    {
      question: 'I do not currently have a blog or my blog is outdated is that okay?',
      answer: 'If you do not have a blog set up please start your blog by adding at least 1 blog post so we can get a feel for your site. We want to see blogs that have been updated within the last 90 days.',
    },
    {
      question: 'Any other URL restrictions?',
      answer: 'We do not accept Subdomains, forum/community sites, sponsored tags, or guest post advertising.',
    },
    {
      question: 'Do you accept sites in the XYZ niche?',
      answer: 'We are open to accepting sites in every niche including grey niches.',
    },
    {
      question: 'What is the minimum monthly traffic you will accept?',
      answer: (
        <>
          Our minimum monthly traffic is based on the DA of the website. Domains with DA's 20-39 require a minimum of 150 organic traffic.
          <br className="block mt-1" />
          Domains with DA's 40+ require a minimum of 500 organic traffic.
        </>
      ),
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-white border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-primary-purple text-center mb-12">
            F.A.Q.
          </h2>
          <div className="space-y-6 text-left">
            {faqs.map((faq, index) => (
              <div key={index}>
                <p className="font-bold text-lg text-gray-900 mb-2">
                  Q. {faq.question}
                </p>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

