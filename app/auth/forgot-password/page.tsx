"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { authApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await authApi.forgotPassword(email);
      setEmailSent(true);
      toast.success("Password reset email sent! Please check your inbox.");
    } catch (err: unknown) {
      let errorMessage = "Failed to send reset email";
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'object' && err !== null) {
        const apiError = err as { message?: string; error?: { message?: string } };
        errorMessage = apiError.message || apiError.error?.message || errorMessage;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 flex items-center justify-center py-10 md:py-14">
        <div className="container mx-auto px-4 max-w-md">
          <div className="bg-white/90 rounded-2xl border border-slate-200 shadow-md shadow-slate-100 p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-semibold text-slate-900 mb-1">
              Forgot Password
            </h2>
            <p className="text-xs md:text-sm text-slate-500 mb-6">
              {emailSent
                ? "Check your email for password reset instructions."
                : "Enter your email address and we'll send you a link to reset your password."}
            </p>

            {!emailSent ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-4 py-2.5 md:py-3 bg-[#ff8a3c] hover:bg-[#ff7a1f] text-white text-sm md:text-base font-semibold rounded-full cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff8a3c] disabled:opacity-60 disabled:cursor-not-allowed">
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </button>

                <div className="text-center">
                  <Link
                    href="/auth/login"
                    className="text-xs md:text-sm font-semibold text-emerald-600 hover:text-emerald-700">
                    Back to Login
                  </Link>
                </div>
              </form>
            ) : (
              <div className="space-y-5">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <p className="text-sm text-emerald-800">
                    We've sent a password reset link to <strong>{email}</strong>.
                    Please check your email and click the link to reset your password.
                  </p>
                </div>
                <div className="text-center space-y-3">
                  <p className="text-xs text-slate-500">
                    Didn't receive the email? Check your spam folder or{" "}
                    <button
                      onClick={() => setEmailSent(false)}
                      className="font-semibold text-emerald-600 hover:text-emerald-700">
                      try again
                    </button>
                    .
                  </p>
                  <Link
                    href="/auth/login"
                    className="block text-xs md:text-sm font-semibold text-emerald-600 hover:text-emerald-700">
                    Back to Login
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

