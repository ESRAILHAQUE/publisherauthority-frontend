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
import { countries } from "@/lib/countries";

export default function ApplyPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    contactNumber: "",
    country: "",
    hearAbout: "",
    guestPostExperience: "",
    guestPostUrl1: "",
    guestPostUrl2: "",
    guestPostUrl3: "",
    completedProjectUrl1: "",
    completedProjectUrl2: "",
    completedProjectUrl3: "",
    referralInfo: "",
  });


  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate URLs start with https://
      const validateHttpsUrl = (url: string): boolean => {
        return url.trim().toLowerCase().startsWith("https://");
      };

      // Convert guest post URLs from separate fields to array
      const guestPostUrls: string[] = [];
      if (formData.guestPostUrl1) {
        if (!validateHttpsUrl(formData.guestPostUrl1)) {
          toast.error("All URLs must start with https://");
          setIsSubmitting(false);
          return;
        }
        guestPostUrls.push(formData.guestPostUrl1);
      }
      if (formData.guestPostUrl2) {
        if (!validateHttpsUrl(formData.guestPostUrl2)) {
          toast.error("All URLs must start with https://");
          setIsSubmitting(false);
          return;
        }
        guestPostUrls.push(formData.guestPostUrl2);
      }
      if (formData.guestPostUrl3) {
        if (!validateHttpsUrl(formData.guestPostUrl3)) {
          toast.error("All URLs must start with https://");
          setIsSubmitting(false);
          return;
        }
        guestPostUrls.push(formData.guestPostUrl3);
      }

      // Convert completed project URLs from separate fields to array
      const completedProjectsUrls: string[] = [];
      if (formData.completedProjectUrl1) {
        if (!validateHttpsUrl(formData.completedProjectUrl1)) {
          toast.error("All URLs must start with https://");
          setIsSubmitting(false);
          return;
        }
        completedProjectsUrls.push(formData.completedProjectUrl1);
      }
      if (formData.completedProjectUrl2) {
        if (!validateHttpsUrl(formData.completedProjectUrl2)) {
          toast.error("All URLs must start with https://");
          setIsSubmitting(false);
          return;
        }
        completedProjectsUrls.push(formData.completedProjectUrl2);
      }
      if (formData.completedProjectUrl3) {
        if (!validateHttpsUrl(formData.completedProjectUrl3)) {
          toast.error("All URLs must start with https://");
          setIsSubmitting(false);
          return;
        }
        completedProjectsUrls.push(formData.completedProjectUrl3);
      }

      // Prepare FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append("firstName", formData.firstName);
      formDataToSend.append("lastName", formData.lastName);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);
      if (formData.contactNumber) {
        formDataToSend.append("contactNumber", formData.contactNumber);
      }
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
      formDataToSend.append(
        "completedProjectsUrls",
        JSON.stringify(completedProjectsUrls)
      );
      if (formData.referralInfo) {
        formDataToSend.append(
          "referralInfo",
          JSON.stringify({ name: formData.referralInfo })
        );
      }

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
        contactNumber: "",
        country: "",
        hearAbout: "",
        guestPostExperience: "",
        guestPostUrl1: "",
        guestPostUrl2: "",
        guestPostUrl3: "",
        completedProjectUrl1: "",
        completedProjectUrl2: "",
        completedProjectUrl3: "",
        referralInfo: "",
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
                href="/support"
                className="inline-flex items-center justify-center rounded-full bg-[#ff8a3c] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-slate-900/40 transition-transform hover:-translate-y-[1px] hover:brightness-110 md:px-6 md:py-3">
                Contact to fast track application
              </a>
              <p className="text-[11px] md:text-xs text-slate-200/90 text-left md:text-right">
                Optional but recommended if you manage multiple sites or large
                inventories.
              </p>
              <a
                href="/support"
                className="text-[11px] md:text-xs text-slate-200/90 underline hover:text-white text-left md:text-right">
                Contact to fast track application
              </a>
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
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Create your password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                />
                <Input
                  label="Contact Number"
                  name="contactNumber"
                  type="tel"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="+1234567890"
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
                  label="Country of Residence"
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
                  Please share your experience with guest posting. Must use https:// url prefix format.
                </label>
                <Input
                  placeholder="https://examplewebsite.com1 - Must use https:// url prefix format"
                  name="guestPostUrl1"
                  type="url"
                  value={formData.guestPostUrl1}
                  onChange={handleChange}
                  className="mb-4"
                  required
                />
                <Input
                  placeholder="https://examplewebsite.com2"
                  name="guestPostUrl2"
                  type="url"
                  value={formData.guestPostUrl2}
                  onChange={handleChange}
                  className="mb-4"
                  required
                />
                <Input
                  placeholder="https://examplewebsite.com3"
                  name="guestPostUrl3"
                  type="url"
                  value={formData.guestPostUrl3}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-slate-800 mb-2">
                  Please share 3 examples of your completed projects from the last six months. Make sure the links you provide are do-follow.
                </label>
                <Input
                  placeholder="https://examplewebsite.com1"
                  name="completedProjectUrl1"
                  type="url"
                  value={formData.completedProjectUrl1}
                  onChange={handleChange}
                  className="mb-4"
                  required
                />
                <Input
                  placeholder="https://examplewebsite.com2"
                  name="completedProjectUrl2"
                  type="url"
                  value={formData.completedProjectUrl2}
                  onChange={handleChange}
                  className="mb-4"
                  required
                />
                <Input
                  placeholder="https://examplewebsite.com3"
                  name="completedProjectUrl3"
                  type="url"
                  value={formData.completedProjectUrl3}
                  onChange={handleChange}
                  required
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
