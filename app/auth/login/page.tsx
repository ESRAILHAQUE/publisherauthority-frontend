"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { authApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response: any = await authApi.login(
        formData.email,
        formData.password
      );
      // Backend returns { success: true, data: { user, token } }
      const user = response.data?.user || response.user;
      const token = response.data?.token || response.token;
      if (!token) {
        throw new Error("No token received from server");
      }
      localStorage.setItem("authToken", token);
      if (formData.rememberMe) {
        localStorage.setItem("rememberMe", "true");
      }

      // Redirect based on user role
      if (user?.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      let errorMessage = err.message || "Invalid email or password";

      // Show more specific error messages
      if (err.message?.includes("pending approval")) {
        errorMessage =
          "Your application is still pending approval. Please wait for admin approval before logging in.";
      } else if (err.message?.includes("deactivated")) {
        errorMessage =
          "Your account has been deactivated. Please contact support.";
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 flex items-center justify-center py-10 md:py-14">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-center">
            {/* Left side intro */}
            <div className="space-y-4 md:space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                <span className="h-5 w-5 rounded-full bg-[#ff8a3c] text-[11px] font-bold flex items-center justify-center text-white">
                  CM
                </span>
                Sign in to your publisher dashboard
              </div>
              <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 leading-snug">
                Welcome back to{" "}
                <span className="bg-gradient-to-r from-emerald-500 to-sky-500 bg-clip-text text-transparent">
                  publisherauthority
                </span>
              </h1>
              <p className="text-sm md:text-base text-slate-600 max-w-md">
                Access your sites, open jobs, and payouts in one place. Use the
                same email you used when you applied as a publisher.
              </p>
              <p className="text-xs md:text-sm text-slate-500">
                Don’t have an account yet?{" "}
                <Link
                  href="/apply"
                  className="font-semibold text-emerald-600 hover:text-emerald-700">
                  Apply to become a publisher
                </Link>
                .
              </p>
            </div>

            {/* Right side form */}
            <div className="bg-white/90 rounded-2xl border border-slate-200 shadow-md shadow-slate-100 p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-semibold text-slate-900 mb-1">
                Sign in
              </h2>
              <p className="text-xs md:text-sm text-slate-500 mb-6">
                Enter your email and password to continue.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    placeholder="you@example.com"
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                    placeholder="Your password"
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all"
                  />
                </div>

                <div className="flex items-center justify-between gap-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          rememberMe: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-emerald-500 border-slate-300 rounded focus:ring-emerald-400"
                    />
                    <span className="ml-2 text-xs md:text-sm text-slate-700">
                      Remember me
                    </span>
                  </label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-xs md:text-sm font-semibold text-emerald-600 hover:text-emerald-700">
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-4 py-2.5 md:py-3 bg-[#ff8a3c] hover:bg-[#ff7a1f] text-white text-sm md:text-base font-semibold rounded-full cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff8a3c] disabled:opacity-60 disabled:cursor-not-allowed">
                  {isLoading ? "Signing in…" : "Sign in"}
                </button>

                <p className="text-[11px] md:text-xs text-slate-500 text-center">
                  By signing in, you agree to our{" "}
                  <Link
                    href="/terms"
                    className="underline hover:text-slate-700">
                    Terms
                  </Link>
                  .
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
