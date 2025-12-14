"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "../shared/Button";
import { authApi } from "@/lib/api";

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in and get their role
    const checkAuth = async () => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("authToken");
        if (token) {
          setIsLoggedIn(true);
          try {
            const response = (await authApi.getMe()) as {
              data?: { user?: { role?: string } };
              user?: { role?: string };
              [key: string]: unknown;
            };
            const user = response.data?.user || response.user;
            setUserRole(user?.role || null);
          } catch (error) {
            console.error("Failed to get user role:", error);
          }
        }
      }
    };
    checkAuth();
  }, []);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" },
    { href: "/support", label: "Support" },
    { href: "/terms", label: "Terms" },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-[#243b6b] bg-[#12244f]/95 backdrop-blur-xl">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 md:py-5">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-base font-semibold tracking-tight text-white md:text-lg">
          <img
            src="/logo/logo.png"
            alt="Publisher Authority Logo"
            className="h-9 w-auto md:h-10"
          />
          <span className="flex flex-col leading-tight">
            <span>publisher authority</span>
            <span className="text-[11px] font-normal text-slate-200 md:text-xs">
              Publisher Marketplace
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-100/90 transition-colors hover:text-white">
              {item.label}
            </Link>
          ))}

          <div className="ml-2 flex items-center gap-3">
            {isLoggedIn ? (
              <Link href={userRole === "admin" ? "/admin" : "/dashboard"}>
                <Button
                  variant="primary"
                  size="sm"
                  className="bg-[#ff8a3c] text-xs font-semibold text-white shadow-md shadow-slate-900/40 hover:brightness-110">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/25 bg-transparent text-xs font-medium text-white hover:border-[#ff8a3c] hover:bg-[#ff8a3c]/10 hover:text-white">
                    Login
                  </Button>
                </Link>
                <Link href="/apply">
                  <Button
                    variant="primary"
                    size="sm"
                    className="bg-[#ff8a3c] text-xs font-semibold text-white shadow-md shadow-slate-900/40 hover:brightness-110">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-2 md:hidden">
          {isLoggedIn ? (
            <Link href={userRole === "admin" ? "/admin" : "/dashboard"}>
              <Button
                variant="primary"
                size="sm"
                className="bg-[#ff8a3c] px-3 text-[11px] font-semibold text-white shadow-md shadow-slate-900/40 hover:brightness-110">
                Dashboard
              </Button>
            </Link>
          ) : (
            <Link href="/auth/login">
              <Button
                variant="outline"
                size="sm"
                className="border-white/25 bg-transparent px-3 text-[11px] font-medium text-white hover:border-[#ff8a3c] hover:bg-[#ff8a3c]/10 hover:text-white">
                Login
              </Button>
            </Link>
          )}
          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/25 bg-transparent text-white shadow-sm shadow-slate-900/40 hover:border-[#ff8a3c] hover:text-[#ff8a3c]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu">
            <svg
              className="h-5 w-5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor">
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu with smooth animation */}
      <div
        className={`md:hidden border-t border-[#243b6b] bg-[#12244f] px-4 pt-1 overflow-hidden transform origin-top transition-all duration-200 ease-out ${
          isMenuOpen
            ? "max-h-96 opacity-100 scale-y-100 pb-4"
            : "max-h-0 opacity-0 scale-y-95 pb-0 pointer-events-none"
        }`}>
        <div className="mt-2 flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-2 py-2 text-sm font-medium text-slate-100/90 transition-colors hover:bg-white/10 hover:text-white"
              onClick={() => setIsMenuOpen(false)}>
              {item.label}
            </Link>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          {isLoggedIn ? (
            <Link
              href={userRole === "admin" ? "/admin" : "/dashboard"}
              onClick={() => setIsMenuOpen(false)}
              className="flex-1">
              <Button
                variant="primary"
                size="sm"
                className="w-full bg-[#ff8a3c] text-xs font-semibold text-white shadow-md shadow-slate-900/40 hover:brightness-110">
                Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link
                href="/auth/login"
                onClick={() => setIsMenuOpen(false)}
                className="flex-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-white/25 bg-transparent text-xs font-medium text-white hover:border-[#ff8a3c] hover:bg-[#ff8a3c]/10 hover:text-white">
                  Login
                </Button>
              </Link>
              <Link
                href="/apply"
                onClick={() => setIsMenuOpen(false)}
                className="flex-1">
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full bg-[#ff8a3c] text-xs font-semibold text-white shadow-md shadow-slate-900/40 hover:brightness-110">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
