import React from 'react';

export const HowMuchCanYouMakeSection: React.FC = () => {
  return (
    <section className="py-20 md:py-28 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-primary-purple mb-8">
            How Much Can You Make?
          </h2>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
            Your earnings depend on the quality of your blog and the amount of
            posts you accept. The more established your blog, the more the
            advertisers are willing to pay to be featured. The more content
            you accept, the more you can get paid!
          </p>
        </div>
      </div>
    </section>
  );
};

