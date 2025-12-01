'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import { Textarea } from '@/components/shared/Textarea';
import { Card } from '@/components/shared/Card';

export default function SupportPage() {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const faqs = [
    {
      question: 'How do I apply as a publisher?',
      answer: 'Click on "Apply as Publisher" in the navigation menu and fill out the application form. Make sure to provide all required information including your blog details and guest post examples.',
    },
    {
      question: 'What are the requirements to become a publisher?',
      answer: 'You need a minimum Domain Authority of 20, at least 150-500 monthly organic visitors (depending on DA), an English-language blog updated within the last 90 days, and no subdomains or forum sites.',
    },
    {
      question: 'How often will I receive orders?',
      answer: 'Order frequency depends on your website quality, niche, and availability. High-quality sites with good metrics typically receive regular orders.',
    },
    {
      question: 'When will I get paid?',
      answer: 'Payments are sent bi-weekly on the 1st and 15th of each month. If these dates fall on weekends, payments are processed on the next business day.',
    },
    {
      question: 'How much can I earn?',
      answer: 'Earnings depend on your website quality, Domain Authority, traffic, and the number of orders you accept. Higher quality sites earn more per post.',
    },
    {
      question: 'Can I reject an order?',
      answer: 'Yes, you can decline orders that don&apos;t fit your site. However, consistently accepting orders helps build a good relationship with the platform.',
    },
    {
      question: 'What happens if I remove a link?',
      answer: 'Links must stay live permanently. If a link is removed within 1 year, you&apos;ll have 72 hours to restore it, or payment penalties will apply.',
    },
    {
      question: 'How do I verify my website?',
      answer: 'After submitting your website, you&apos;ll receive verification instructions. You can either add a verification tag to your HTML head section or publish a temporary verification article.',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Handle form submission
    setTimeout(() => {
      setIsSubmitting(false);
      alert(`Message sent successfully! We'll get back to you soon.`);
      setContactForm({ name: '', email: '', subject: '', message: '' });
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-[#3F207F] text-center mb-4">
              Support & Help Center
            </h1>
            <p className="text-center text-gray-600 text-lg mb-12">
              We&apos;re here to help! Find answers to common questions or contact us directly.
            </p>

            {/* FAQs Section */}
            <section className="mb-16">
              <h2 className="text-3xl font-bold text-[#3F207F] mb-8 text-center">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <FAQItem key={index} question={faq.question} answer={faq.answer} />
                ))}
              </div>
            </section>

            {/* Contact Form Section */}
            <section>
              <Card>
                <h2 className="text-2xl font-bold text-[#3F207F] mb-6">Contact Us</h2>
                <p className="text-gray-600 mb-6">
                  Can&apos;t find what you&apos;re looking for? Send us a message and we&apos;ll get back to you as soon as possible.
                </p>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Your Name"
                      name="name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      required
                    />
                    <Input
                      label="Your Email"
                      name="email"
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <Input
                    label="Subject"
                    name="subject"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    required
                  />
                  <Textarea
                    label="Message"
                    name="message"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    rows={6}
                    required
                  />
                  <Button type="submit" isLoading={isSubmitting}>
                    Send Message
                  </Button>
                </form>
              </Card>
            </section>

            {/* Email Support */}
            <section className="mt-8 text-center">
              <Card>
                <h3 className="text-xl font-semibold text-[#3F207F] mb-4">Email Support</h3>
                <p className="text-gray-600 mb-2">
                  You can also reach us directly via email:
                </p>
                <a
                  href="mailto:support@contentmanager.io"
                  className="text-[#2EE6B7] hover:text-[#3F207F] font-semibold text-lg transition-colors"
                >
                  support@contentmanager.io
                </a>
                <p className="text-sm text-gray-500 mt-4">
                  We typically respond within 24-48 hours during business days.
                </p>
              </Card>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card>
      <button
        className="w-full text-left flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-semibold text-gray-900 pr-4">{question}</span>
        <svg
          className={`w-5 h-5 text-[#3F207F] flex-shrink-0 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="mt-4 pt-4 border-t border-gray-200 text-gray-700">
          {answer}
        </div>
      )}
    </Card>
  );
}

