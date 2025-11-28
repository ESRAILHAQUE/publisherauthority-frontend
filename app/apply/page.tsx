'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import { Textarea } from '@/components/shared/Textarea';
import { Select } from '@/components/shared/Select';
import { Card } from '@/components/shared/Card';

export default function ApplyPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    country: '',
    hearAbout: '',
    guestPostExperience: '',
    guestPostUrl1: '',
    guestPostUrl2: '',
    guestPostUrl3: '',
    referralInfo: '',
  });

  const [quizAnswers, setQuizAnswers] = useState({
    q1: '',
    q2: '',
    q3: '',
    q4: '',
    q5: '',
    q6: '',
    q7: '',
    q8: '',
    q9: '',
  });

  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const countries = [
    { value: '', label: 'Select your country of residence' },
    { value: 'US', label: 'United States' },
    { value: 'UK', label: 'United Kingdom' },
    { value: 'CA', label: 'Canada' },
    { value: 'AU', label: 'Australia' },
    { value: 'DE', label: 'Germany' },
    { value: 'FR', label: 'France' },
    { value: 'IN', label: 'India' },
    // Add more countries as needed
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Handle form submission here
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Application submitted successfully!');
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-[#3F207F] mb-4">
              Publisher Application
            </h1>
            <div className="space-y-4 text-gray-700">
              <p className="text-xl">🎉 Welcome to ContentManager.io! 🎉</p>
              <p>
                Since our inception, we have proudly paid out over $5,000,000 to our incredible users, 
                and we are always excited to welcome new members to our growing community.
              </p>
              <p>
                At ContentManager.io, we believe in fostering long-term relationships built on trust, 
                mutual respect, and shared success. Since 2019, over 100,000 people have applied to join. 
                Our platform is exclusive, and becoming a member is something we take very seriously. 
                Our current application acceptance rate is 9%.
              </p>
              <p>
                Please, do not rush the application process, as each answer will be carefully reviewed 
                to determine if you are a good fit for our platform.
              </p>
              <p className="font-semibold text-[#3F207F]">
                Please note, we use a payment compliance company and all answers below must match perfectly 
                with the legal identification document(s) you will be asked to securely provide. Please do 
                not use a VPN when applying or your application will be rejected.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <Card>
              <h2 className="text-2xl font-bold text-[#3F207F] mb-6">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="First Name (According to your legal identification document)"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Last Name (According to your legal identification document)"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Email Address (This cannot be changed after signup)"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Password (Create your password)"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                />
                <div className="md:col-span-2">
                  <Input
                    label="How did you hear about us?"
                    name="hearAbout"
                    value={formData.hearAbout}
                    onChange={handleChange}
                  />
                </div>
                <Select
                  label="Country of Residence (According to your legal identification document)"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  options={countries}
                  required
                />
              </div>
            </Card>

            {/* Guest Post Experience */}
            <Card>
              <h2 className="text-2xl font-bold text-[#3F207F] mb-6">Publisher Experience</h2>
              <Textarea
                label="Please share your experience with guest posting."
                name="guestPostExperience"
                value={formData.guestPostExperience}
                onChange={handleChange}
                rows={4}
              />
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Please provide 3 guest post URLs you were responsible for completing within the last 90 days. 
                  At least one link within each guest post must be do-follow.
                </label>
                <Input
                  placeholder="https://examplewebsite.com1 - Must use https:// url prefix format"
                  name="guestPostUrl1"
                  type="url"
                  value={formData.guestPostUrl1}
                  onChange={handleChange}
                  className="mb-4"
                />
                <Input
                  placeholder="https://examplewebsite.com2"
                  name="guestPostUrl2"
                  type="url"
                  value={formData.guestPostUrl2}
                  onChange={handleChange}
                  className="mb-4"
                />
                <Input
                  placeholder="https://examplewebsite.com3"
                  name="guestPostUrl3"
                  type="url"
                  value={formData.guestPostUrl3}
                  onChange={handleChange}
                />
              </div>

              <div className="mt-6">
                <Textarea
                  label="Please provide referral information for a professional organization that can attest to your credibility in posting guest posts in a timely and professional manner (Name, email, and/or phone number. We reserve the right to contact the individual.)"
                  name="referralInfo"
                  value={formData.referralInfo}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Please upload a CSV file of your website(s) for guest posting. (For secure management review only. 
                  This helps us determine the quality of sites you are looking to utilize.)
                </label>
                <input
                  type="file"
                  accept=".csv"
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#3F207F] file:text-white hover:file:bg-[#5A2F9F] cursor-pointer"
                />
              </div>
            </Card>

            {/* Publisher Expectations Quiz */}
            <Card>
              <h2 className="text-2xl font-bold text-[#3F207F] mb-4">Publisher Expectations</h2>
              <p className="text-gray-700 mb-6">
                We sincerely appreciate your time on this application. We know this is a lengthy process and 
                we promise it is worth it. Below are the expectations that all users will be held to if accepted 
                to our platform. Please read and then answer the questions below to check for understanding.
              </p>

              <div className="space-y-6">
                <QuizQuestion
                  statement="All articles assigned to you, along with the target URLS, must stay live permanently."
                  question="How long must articles stay live after you are paid for a job?"
                  answer={quizAnswers.q1}
                  onChange={(value) => setQuizAnswers({ ...quizAnswers, q1: value })}
                />
                <QuizQuestion
                  statement="Payment penalties will be enforced for links that fall or target URLs that are removed within 1 year of post date. In the event we detect an error with a provided link or target URL, we will notify you of the issue and grant 72 hours to resolve the issue. If the issue is not resolved, we will deduct the payment total previously paid for the link from your future payout total."
                  question="How long do you have to resolve a link issue before payment penalty is enforced?"
                  answer={quizAnswers.q2}
                  onChange={(value) => setQuizAnswers({ ...quizAnswers, q2: value })}
                />
                <QuizQuestion
                  statement="All articles must be placed in a relevant category or blog section, accessible from the homepage, ensuring they can be easily discovered and appearing as if they were written by you."
                  question="Where should the articles be placed on your website?"
                  answer={quizAnswers.q3}
                  onChange={(value) => setQuizAnswers({ ...quizAnswers, q3: value })}
                />
                <QuizQuestion
                  statement='The articles should not be labeled as sponsored, guest posts, or guest author/contributor, and our links must not have link attributes such as rel="sponsored".'
                  question="What type of link attributes are not allowed for our articles?"
                  answer={quizAnswers.q4}
                  onChange={(value) => setQuizAnswers({ ...quizAnswers, q4: value })}
                />
                <QuizQuestion
                  statement="The articles must be published on your main domain, not on a subdomain if you have one."
                  question="Where should our articles be published on your website?"
                  answer={quizAnswers.q5}
                  onChange={(value) => setQuizAnswers({ ...quizAnswers, q5: value })}
                />
                <QuizQuestion
                  statement="Our articles should be indexed within 90 days, meaning they will appear in Google and Bing search results."
                  question="Which two search engines should the guest post link appear?"
                  answer={quizAnswers.q6}
                  onChange={(value) => setQuizAnswers({ ...quizAnswers, q6: value })}
                />
                <QuizQuestion
                  statement="Our system uses a tight deadline system. You will have 48-72 hours to take most actions once a job is assigned to you."
                  question="How long do you have to take most actions once a job is assigned to you?"
                  answer={quizAnswers.q7}
                  onChange={(value) => setQuizAnswers({ ...quizAnswers, q7: value })}
                />
                <QuizQuestion
                  statement="We use a payment compliance processor to process all payments. Payments are sent bi-weekly on Mondays for the previous pay period."
                  question="When are payments sent?"
                  answer={quizAnswers.q8}
                  onChange={(value) => setQuizAnswers({ ...quizAnswers, q8: value })}
                />
                <QuizQuestion
                  statement="We use a payment compliance company. You must use your real name, email, etc. throughout the application process. Any changing of information after applying is flagged in compliance, and your account will be banned."
                  question='I hereby attest that all information provided on this application matches the information on my legal identification documents. Please state "I do".'
                  answer={quizAnswers.q9}
                  onChange={(value) => setQuizAnswers({ ...quizAnswers, q9: value })}
                />
              </div>
            </Card>

            {/* Agreement */}
            <Card>
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="agree"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 w-5 h-5 text-[#3F207F] border-gray-300 rounded focus:ring-[#3F207F]"
                  required
                />
                <label htmlFor="agree" className="text-gray-700">
                  I agree to the terms and conditions and confirm that all information provided is accurate and matches my legal identification documents.
                </label>
              </div>
            </Card>

            {/* Requirements Display */}
            <Card>
              <h2 className="text-2xl font-bold text-[#3F207F] mb-4">Requirements</h2>
              <ul className="space-y-2 text-gray-700">
                <li>• Minimum Domain Authority: 20 or higher</li>
                <li>• Minimum Monthly Traffic: DA 20-39 requires 150+ organic visitors, DA 40+ requires 500+ organic visitors</li>
                <li>• English language only</li>
                <li>• Blogs must be updated within the last 90 days</li>
                <li>• No subdomains, forums, or sponsored tags</li>
              </ul>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button
                type="submit"
                size="lg"
                isLoading={isSubmitting}
                disabled={!agreed}
                className="px-12"
              >
                Submit Application
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Quiz Question Component
function QuizQuestion({
  statement,
  question,
  answer,
  onChange,
}: {
  statement: string;
  question: string;
  answer: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
      <p className="font-semibold text-gray-900 mb-2">Statement: {statement}</p>
      <p className="text-gray-700 mb-4">Question: {question}</p>
      <Textarea
        value={answer}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        required
      />
    </div>
  );
}

