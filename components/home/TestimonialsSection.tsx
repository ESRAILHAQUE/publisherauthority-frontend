import React from 'react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Tech Blogger",
      content: "This platform has transformed how I monetize my blog. The content quality is excellent and payments are always on time.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Digital Marketing Expert",
      content: "I've been working with them for over a year. The process is smooth, and I've earned significantly more than other platforms.",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "Lifestyle Publisher",
      content: "The best part is the flexibility. I can choose which orders to accept, and the support team is always helpful.",
      rating: 5,
    },
  ];

  return (
    <section className="bg-gray-50 py-16 md:py-20">
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-purple mb-4">
            What Our Publishers Say
          </h2>
          <p className="text-gray-600 text-lg">
            Join hundreds of satisfied publishers earning from their content
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">
                &quot;{testimonial.content}&quot;
              </p>
              <div className="border-t border-gray-200 pt-4">
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-600">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


