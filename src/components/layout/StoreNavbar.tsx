"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";

/**
 * Public Store Navbar for Home Page (/)
 * Provides brand identity and a direct Login button for accessing the dashboard.
 * Does NOT contain the dashboard sidebar or dashboard navigation links.
 */
export default function StoreNavbar() {
  const { isLoggedIn, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      {/* Brand Logo & Name */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2.5 transition hover:opacity-90">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-tr from-indigo-600 to-violet-500 text-white shadow-xs">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold tracking-tight text-slate-900">
                ShopDesk
              </span>
              <span className="rounded-md bg-indigo-50 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-700">
                Store
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Public Catalog</p>
          </div>
        </Link>
      </div>

      {/* Login / Dashboard Action */}
      <div className="flex items-center gap-3">
        {isLoggedIn ? (
          <>
            <Link href="/dashboard">
              <Button variant="primary" size="sm">
                Dashboard &rarr;
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="text-rose-600 hover:bg-rose-50 border-rose-200"
            >
              Logout
            </Button>
          </>
        ) : (
          <Link href="/login">
            <Button
              variant="primary"
              size="sm"
              icon={
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
              }
            >
              Login
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
