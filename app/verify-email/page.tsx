"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/shared/Button";
import { Card } from "@/components/shared/Card";
import { getApiUrl } from "@/lib/api";
import toast from "react-hot-toast";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setStatus("error");
        setMessage("Verification token is missing. Please check your email and try again.");
        return;
      }

      try {
        const API_URL = getApiUrl();
        const response = await fetch(`${API_URL}/applications/verify-email?token=${token}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Verification failed");
        }

        setStatus("success");
        setMessage(
          data.message || "Email verified successfully! Your application is now under review."
        );
        toast.success("Email verified successfully!");
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to verify email. The verification link may have expired.";
        setStatus("error");
        setMessage(errorMessage);
        toast.error(errorMessage);
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 py-10 md:py-14">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="border border-slate-200 bg-white/90 shadow-sm shadow-slate-100">
            <div className="text-center py-8 md:py-12">
              {status === "loading" && (
                <>
                  <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#3F207F]/10">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3F207F]"></div>
                    </div>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-3">
                    Verifying Your Email
                  </h1>
                  <p className="text-slate-600">Please wait while we verify your email address...</p>
                </>
              )}

              {status === "success" && (
                <>
                  <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
                      <svg
                        className="w-10 h-10 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-3">
                    Email Verified Successfully!
                  </h1>
                  <p className="text-slate-600 mb-6">{message}</p>
                  <div className="space-y-3">
                    <p className="text-sm text-slate-500">
                      Our team will review your application and notify you via email once a decision
                      has been made.
                    </p>
                    <Button
                      onClick={() => router.push("/")}
                      className="bg-[#3F207F] hover:bg-[#2d1559] text-white">
                      Go to Homepage
                    </Button>
                  </div>
                </>
              )}

              {status === "error" && (
                <>
                  <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100">
                      <svg
                        className="w-10 h-10 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </div>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-3">
                    Verification Failed
                  </h1>
                  <p className="text-slate-600 mb-6">{message}</p>
                  <div className="space-y-3">
                    <p className="text-sm text-slate-500">
                      If you continue to experience issues, please contact our support team.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button
                        onClick={() => router.push("/support")}
                        variant="outline"
                        className="border-[#3F207F] text-[#3F207F] hover:bg-[#3F207F] hover:text-white">
                        Contact Support
                      </Button>
                      <Button
                        onClick={() => router.push("/")}
                        className="bg-[#3F207F] hover:bg-[#2d1559] text-white">
                        Go to Homepage
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col bg-slate-50">
          <Header />
          <main className="flex-1 flex items-center justify-center py-10 md:py-14">
            <div className="text-gray-600">Loading...</div>
          </main>
          <Footer />
        </div>
      }>
      <VerifyEmailContent />
    </Suspense>
  );
}

