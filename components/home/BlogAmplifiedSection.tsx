import React from 'react';

export const BlogAmplifiedSection: React.FC = () => {
  return (
    <section className="py-20 md:py-28 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-primary-purple text-center mb-16">
            Your Blog, Amplified
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Get Valuable Content, For Free
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Once you're approved, we'll work with you to craft valuable
                content that speaks to your audience and mentions the brand.
                This is the same type of content most blogs pay just to have
                written.
              </p>
            </div>

            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Grow Your Traffic
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Every piece of content you post to your site is a chance to
                rank for more keywords and get more free traffic from Google.
                With our optimized content, you can sit back and watch your
                organic traffic grow.
              </p>
            </div>

            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Monetize Your Blog
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Not only will you be able to get awesome content that connects
                with your readers, you'll earn every time you post one of our
                blogs… no annoying ads necessary!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

