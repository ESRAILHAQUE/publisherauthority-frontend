import React from 'react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      step: 1,
      title: 'Sign Up For Free',
      description:
        "Sign Up for a free account and submit your blog(s). Depending on the quality of your website, we'll tell you how much brands are willing to pay to be featured.",
      icon: (
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      step: 2,
      title: 'Post Our Valuable Content',
      description:
        "We'll send you content that matches your audience. Just post it to your blog and submit the URL in our portal. It's that easy.",
      icon: (
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      step: 3,
      title: 'Get Paid Bi-weekly',
      description:
        "Once the posts are live, we send out bi-weekly payments through your chosen payment method. We've already paid out over $1MM to publishers.",
      icon: (
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-primary-purple text-center mb-16">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((step) => (
              <div key={step.step} className="text-center">
                <div className="w-20 h-20 bg-accent-pink rounded-full flex items-center justify-center mx-auto mb-6">
                  {step.icon}
                </div>
                <div className="mb-4">
                  <span className="text-2xl text-[#1E0E62]">
                    Step {step.step}:
                  </span>
                  <h3 className="text-2xl text-[#1E0E62] ">
                    {step.title}
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

