"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authApi } from "@/lib/api";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "publisher";
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("authToken");
      
      if (!token) {
        // No token, redirect to login
        router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }

      try {
        // Verify token by getting current user
        const response = (await authApi.getMe()) as {
          data?: { user?: any };
          user?: any;
          [key: string]: unknown;
        };
        const user = response.data?.user || response.user;

        if (!user) {
          // Invalid token, clear and redirect
          localStorage.removeItem("authToken");
          localStorage.removeItem("rememberMe");
          router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
          return;
        }

        // Check if user is active
        if (!user.isActive || user.accountStatus !== "active") {
          localStorage.removeItem("authToken");
          localStorage.removeItem("rememberMe");
          router.push("/auth/login?error=account_deactivated");
          return;
        }

        // Check role if required
        if (requiredRole) {
          if (requiredRole === "admin" && user.role !== "admin") {
            router.push("/dashboard?error=unauthorized");
            return;
          }
          if (requiredRole === "publisher" && user.role !== "publisher") {
            router.push("/auth/login?error=unauthorized");
            return;
          }
        }

        // Check application status for publishers
        if (user.role === "publisher" && user.applicationStatus !== "approved") {
          router.push("/auth/login?error=pending_approval");
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        // Token invalid or expired
        localStorage.removeItem("authToken");
        localStorage.removeItem("rememberMe");
        router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [router, pathname, requiredRole]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-purple"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}

