"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import { Textarea } from "@/components/shared/Textarea";
import { Select } from "@/components/shared/Select";
import { Card } from "@/components/shared/Card";
import { applicationsApi } from "@/lib/api";
import toast from "react-hot-toast";

export default function ApplyPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    country: "",
    hearAbout: "",
    guestPostExperience: "",
    guestPostUrl1: "",
    guestPostUrl2: "",
    guestPostUrl3: "",
    referralInfo: "",
  });

  const [quizAnswers, setQuizAnswers] = useState({
    q1: "",
    q2: "",
    q3: "",
    q4: "",
    q5: "",
    q6: "",
    q7: "",
    q8: "",
    q9: "",
  });

  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const countries = [
    { value: "", label: "Select your country of residence" },
    { value: "US", label: "United States" },
    { value: "UK", label: "United Kingdom" },
    { value: "CA", label: "Canada" },
    { value: "AU", label: "Australia" },
    { value: "DE", label: "Germany" },
    { value: "FR", label: "France" },
    { value: "IN", label: "India" },
    // Add more countries as needed
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Convert quiz answers from q1-q9 to question1-question9 format
      const formattedQuizAnswers: Record<string, string> = {};
      Object.keys(quizAnswers).forEach((key) => {
        const questionNumber = key.replace("q", "question");
        formattedQuizAnswers[questionNumber] =
          quizAnswers[key as keyof typeof quizAnswers];
      });

      // Convert guest post URLs from separate fields to array
      const guestPostUrls: string[] = [];
      if (formData.guestPostUrl1) guestPostUrls.push(formData.guestPostUrl1);
      if (formData.guestPostUrl2) guestPostUrls.push(formData.guestPostUrl2);
      if (formData.guestPostUrl3) guestPostUrls.push(formData.guestPostUrl3);

      // Prepare FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append("firstName", formData.firstName);
      formDataToSend.append("lastName", formData.lastName);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);
      // Save full country name instead of code
      const selectedCountry = countries.find(
        (c) => c.value === formData.country
      );
      formDataToSend.append(
        "country",
        selectedCountry?.label || formData.country
      );
      formDataToSend.append("hearAboutUs", formData.hearAbout);
      formDataToSend.append(
        "guestPostExperience",
        formData.guestPostExperience
      );
      formDataToSend.append("guestPostUrls", JSON.stringify(guestPostUrls));
      if (formData.referralInfo) {
        formDataToSend.append(
          "referralInfo",
          JSON.stringify({ name: formData.referralInfo })
        );
      }
      formDataToSend.append(
        "quizAnswers",
        JSON.stringify(formattedQuizAnswers)
      );

      // Append files
      selectedFiles.forEach((file) => {
        formDataToSend.append("files", file);
      });

      await applicationsApi.submitApplication(formDataToSend);
      toast.success(
        "Application submitted successfully! We will review your application and get back to you soon."
      );
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        country: "",
        hearAbout: "",
        guestPostExperience: "",
        guestPostUrl1: "",
        guestPostUrl2: "",
        guestPostUrl3: "",
        referralInfo: "",
      });
      setQuizAnswers({
        q1: "",
        q2: "",
        q3: "",
        q4: "",
        q5: "",
        q6: "",
        q7: "",
        q8: "",
        q9: "",
      });
      setSelectedFiles([]);
      setAgreed(false);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to submit application. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 py-10 md:py-14">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Top call-to-action + intro */}
          <div className="mb-10 flex flex-col gap-4 rounded-2xl bg-gradient-to-r from-[#142854] via-[#12244f] to-[#0b1835] p-6 text-white shadow-lg shadow-slate-900/40 md:mb-12 md:flex-row md:items-center md:gap-8 md:p-8">
            <div className="md:w-3/5 space-y-3 md:space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-slate-100">
                <span className="h-5 w-5 rounded-full bg-[#ff8a3c] text-[11px] font-bold flex items-center justify-center">
                  ★
                </span>
                Exclusive publisher program
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold leading-snug">
                Publisher application to join the publisherauthority network
              </h1>
              <p className="text-sm md:text-base text-slate-100/90">
                We carefully vet every application to protect our advertisers
                and publishers. Take your time – strong, accurate answers
                significantly increase your chances of approval.
              </p>
            </div>
            <div className="md:w-2/5 flex flex-col items-start gap-3 md:items-end">
              <a
                href="https://calendar.app.google/gZYy6vD1PM8A8c8d6"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-[#ff8a3c] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-slate-900/40 transition-transform hover:-translate-y-[1px] hover:brightness-110 md:px-6 md:py-3">
                Book a call to fast track application
              </a>
              <p className="text-[11px] md:text-xs text-slate-200/90 text-left md:text-right">
                Optional but recommended if you manage multiple sites or large
                inventories.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <Card className="border border-slate-200 bg-white/90 shadow-sm shadow-slate-100">
              <h2 className="text-xl md:text-2xl font-semibold text-slate-900 mb-2">
                Personal information
              </h2>
              <p className="text-sm text-slate-600 mb-6">
                Make sure these details match your legal identification
                documents exactly. This is required for payment compliance.
              </p>
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
            <Card className="border border-slate-200 bg-white/90 shadow-sm shadow-slate-100">
              <h2 className="text-xl md:text-2xl font-semibold text-slate-900 mb-2">
                Publisher experience
              </h2>
              <p className="text-sm text-slate-600 mb-6">
                Tell us how you currently work with guest posts and sponsored
                content.
              </p>
              <Textarea
                label="Please share your experience with guest posting."
                name="guestPostExperience"
                value={formData.guestPostExperience}
                onChange={handleChange}
                rows={4}
              />

              <div className="mt-6">
                <label className="block text-sm font-medium text-slate-800 mb-2">
                  Please provide 3 guest post URLs you were responsible for
                  completing within the last 90 days. At least one link within
                  each guest post must be do-follow.
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
                  label="Referral information (professional contact who can confirm your experience)"
                  name="referralInfo"
                  value={formData.referralInfo}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-slate-800 mb-2">
                  Upload files (PDF, DOC, DOCX, XLS, XLSX, CSV, JPG, PNG, TXT) -
                  Max 10MB per file
                </label>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.jpg,.jpeg,.png,.txt"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setSelectedFiles(files);
                  }}
                  className="block w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#3F207F] file:text-white hover:file:bg-[#2EE6B7] cursor-pointer"
                />
                {selectedFiles.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {selectedFiles.map((file, index) => (
                      <p key={index} className="text-sm text-slate-600">
                        {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6 hidden">
                <label className="block text-sm font-medium text-slate-800 mb-2">
                  Please upload a CSV file of your website(s) for guest posting.
                  (For secure management review only. This helps us determine
                  the quality of sites you are looking to utilize.)
                </label>
                <input
                  type="file"
                  accept=".csv"
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#3F207F] file:text-white hover:file:bg-[#5A2F9F] cursor-pointer"
                />
              </div>
            </Card>

            {/* Publisher Expectations Quiz */}
            <Card className="border border-slate-200 bg-white/90 shadow-sm shadow-slate-100">
              <h2 className="text-xl md:text-2xl font-semibold text-slate-900 mb-2">
                Publisher expectations
              </h2>
              <p className="text-sm text-slate-600 mb-6">
                We sincerely appreciate your time on this application. We know
                this is a lengthy process and we promise it is worth it. Below
                are the expectations that all users will be held to if accepted
                to our platform. Please read and then answer the questions below
                to check for understanding.
              </p>

              <div className="space-y-6">
                <QuizQuestion
                  statement="All articles assigned to you, along with the target URLS, must stay live permanently."
                  question="How long must articles stay live after you are paid for a job?"
                  answer={quizAnswers.q1}
                  onChange={(value) =>
                    setQuizAnswers({ ...quizAnswers, q1: value })
                  }
                />
                <QuizQuestion
                  statement="Payment penalties will be enforced for links that fall or target URLs that are removed within 1 year of post date. In the event we detect an error with a provided link or target URL, we will notify you of the issue and grant 72 hours to resolve the issue. If the issue is not resolved, we will deduct the payment total previously paid for the link from your future payout total."
                  question="How long do you have to resolve a link issue before payment penalty is enforced?"
                  answer={quizAnswers.q2}
                  onChange={(value) =>
                    setQuizAnswers({ ...quizAnswers, q2: value })
                  }
                />
                <QuizQuestion
                  statement="All articles must be placed in a relevant category or blog section, accessible from the homepage, ensuring they can be easily discovered and appearing as if they were written by you."
                  question="Where should the articles be placed on your website?"
                  answer={quizAnswers.q3}
                  onChange={(value) =>
                    setQuizAnswers({ ...quizAnswers, q3: value })
                  }
                />
                <QuizQuestion
                  statement='The articles should not be labeled as sponsored, guest posts, or guest author/contributor, and our links must not have link attributes such as rel="sponsored".'
                  question="What type of link attributes are not allowed for our articles?"
                  answer={quizAnswers.q4}
                  onChange={(value) =>
                    setQuizAnswers({ ...quizAnswers, q4: value })
                  }
                />
                <QuizQuestion
                  statement="The articles must be published on your main domain, not on a subdomain if you have one."
                  question="Where should our articles be published on your website?"
                  answer={quizAnswers.q5}
                  onChange={(value) =>
                    setQuizAnswers({ ...quizAnswers, q5: value })
                  }
                />
                <QuizQuestion
                  statement="Our articles should be indexed within 90 days, meaning they will appear in Google and Bing search results."
                  question="Which two search engines should the guest post link appear?"
                  answer={quizAnswers.q6}
                  onChange={(value) =>
                    setQuizAnswers({ ...quizAnswers, q6: value })
                  }
                />
                <QuizQuestion
                  statement="Our system uses a tight deadline system. You will have 48-72 hours to take most actions once a job is assigned to you."
                  question="How long do you have to take most actions once a job is assigned to you?"
                  answer={quizAnswers.q7}
                  onChange={(value) =>
                    setQuizAnswers({ ...quizAnswers, q7: value })
                  }
                />
                <QuizQuestion
                  statement="We use a payment compliance processor to process all payments. Payments are sent bi-weekly on Mondays for the previous pay period."
                  question="When are payments sent?"
                  answer={quizAnswers.q8}
                  onChange={(value) =>
                    setQuizAnswers({ ...quizAnswers, q8: value })
                  }
                />
                <QuizQuestion
                  statement="We use a payment compliance company. You must use your real name, email, etc. throughout the application process. Any changing of information after applying is flagged in compliance, and your account will be banned."
                  question='I hereby attest that all information provided on this application matches the information on my legal identification documents. Please state "I do".'
                  answer={quizAnswers.q9}
                  onChange={(value) =>
                    setQuizAnswers({ ...quizAnswers, q9: value })
                  }
                />
              </div>
            </Card>

            {/* Agreement */}
            <Card className="border border-slate-200 bg-white/90 shadow-sm shadow-slate-100">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="agree"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 w-5 h-5 text-primary-purple border-gray-300 rounded focus:ring-[#3F207F]"
                  required
                />
                <label htmlFor="agree" className="text-slate-700 text-sm">
                  I agree to the terms and conditions and confirm that all
                  information provided is accurate and matches my legal
                  identification documents.
                </label>
              </div>
            </Card>

            {/* Requirements Display */}
            <Card className="border border-amber-100 bg-amber-50/70 shadow-sm shadow-amber-100">
              <h2 className="text-xl md:text-2xl font-semibold text-slate-900 mb-3">
                Requirements
              </h2>
              <ul className="space-y-2 text-sm text-slate-700">
                <li>• Minimum Domain Authority: 20 or higher</li>
                <li>
                  • Minimum Monthly Traffic: DA 20-39 requires 150+ organic
                  visitors, DA 40+ requires 500+ organic visitors
                </li>
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
                className="px-12 bg-[#ff8a3c] hover:bg-[#ff7a1f] text-white disabled:opacity-70 disabled:cursor-not-allowed">
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
    <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/80">
      <p className="font-semibold text-slate-900 mb-2 text-sm md:text-base">
        Statement: {statement}
      </p>
      <p className="text-slate-700 mb-4 text-sm md:text-base">
        Question: {question}
      </p>
      <Textarea
        value={answer}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        required
      />
    </div>
  );
}
