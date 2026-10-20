"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";

// Fixed demo credentials required by the project
const DEMO_EMAIL = "demo@example.com";
const DEMO_PASSWORD = "Demo123";

/**
 * Login Page (Client Component)
 * Located in app/(auth)/login/page.tsx so it renders WITHOUT the dashboard AppShell/sidebar.
 * Uses fixed demo credentials in memory. Does not use real authentication or localStorage for auth.
 */
export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Quick auto-fill helper for demo credentials
  const handleAutoFill = () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    setErrorMessage("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    const success = login(email, password);
    if (success) {
      // Allowed: Navigate to dashboard
      router.push("/dashboard");
    } else {
      setIsLoading(false);
      setErrorMessage(
        "Invalid credentials. Please use the demo credentials shown below."
      );
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 sm:p-6 lg:p-8">
      {/* Brand logo at top */}
      <div className="mb-6 flex flex-col items-center gap-2 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-md shadow-indigo-200">
          <svg
            className="h-6 w-6"
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
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          ShopDesk
        </h1>
        <p className="text-xs text-slate-500 sm:text-sm">
          Retail & Inventory Management Platform
        </p>
      </div>

      {/* Login Card */}
      <Card className="w-full max-w-md p-6 sm:p-8 shadow-lg">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900">
            Sign in to your account
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Enter demo credentials to enter the store dashboard.
          </p>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 flex items-center gap-2">
            <svg
              className="h-4 w-4 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email or Username"
            type="email"
            placeholder="demo@example.com"
            value={email}
            onChange={(val: string | React.ChangeEvent<HTMLInputElement>) => {
              setEmail(typeof val === "string" ? val : val.target.value);
              setErrorMessage("");
            }}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(val: string | React.ChangeEvent<HTMLInputElement>) => {
              setPassword(typeof val === "string" ? val : val.target.value);
              setErrorMessage("");
            }}
            required
          />

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              loading={isLoading}
            >
              Sign In to Dashboard &rarr;
            </Button>
          </div>
        </form>

        {/* Demo credentials hint box */}
        <div className="mt-6 rounded-xl border border-indigo-100 bg-indigo-50/70 p-3.5 text-xs text-slate-600">
          <div className="flex items-center justify-between mb-1">
            <p className="font-semibold text-indigo-900">Demo Credentials:</p>
            <button
              type="button"
              onClick={handleAutoFill}
              className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 underline cursor-pointer"
            >
              Auto-fill
            </button>
          </div>
          <p className="text-[11px] text-slate-600">
            Email:{" "}
            <code className="font-mono text-indigo-700 font-semibold bg-white px-1 py-0.5 rounded">
              {DEMO_EMAIL}
            </code>{" "}
            | Password:{" "}
            <code className="font-mono text-indigo-700 font-semibold bg-white px-1 py-0.5 rounded">
              {DEMO_PASSWORD}
            </code>
          </p>
        </div>
      </Card>

      <div className="mt-6 text-center text-xs text-slate-400">
        <Link href="/" className="text-indigo-600 hover:underline">
          &larr; Back to Public Store
        </Link>
      </div>
    </div>
  );
}
