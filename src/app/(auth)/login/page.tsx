import React from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

/**
 * Route metadata for /login
 * Requirement 4: Each page sets its own title with metadata / generateMetadata.
 */
export const metadata = {
  title: "Login | ShopDesk",
  description: "Sign in to access your ShopDesk store dashboard.",
};

/**
 * Login Page (Server Component)
 * Located in app/(auth)/login/page.tsx so it renders WITHOUT the dashboard AppShell/sidebar.
 */
export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 sm:p-6 lg:p-8">
      {/* Brand logo at top */}
      <div className="mb-6 flex flex-col items-center gap-2 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-tr from-indigo-600 to-violet-500 text-white shadow-md shadow-indigo-200">
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
          <h2 className="text-xl font-bold text-slate-900">Sign in to your account</h2>
          <p className="mt-1 text-xs text-slate-500">
            Enter your credentials to enter the store dashboard.
          </p>
        </div>

        <form className="space-y-4">
          <Input
            label="Email or Username"
            type="email"
            placeholder="admin@shopdesk.io"
            defaultValue="admin@shopdesk.io"
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            defaultValue="password123"
            required
          />

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded border-slate-300 text-indigo-600" />
              <span>Remember me</span>
            </label>
            <span className="text-indigo-600 hover:underline cursor-pointer">
              Forgot password?
            </span>
          </div>

          <div className="pt-2">
            <Link href="/" className="block w-full">
              <Button variant="primary" size="lg" className="w-full">
                Sign In to Dashboard &rarr;
              </Button>
            </Link>
          </div>
        </form>

        {/* Demo hints */}
        <div className="mt-6 rounded-xl border border-indigo-100 bg-indigo-50/50 p-3.5 text-xs text-slate-600">
          <p className="font-semibold text-indigo-900">Demo Credentials:</p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Email: <code className="font-mono text-indigo-700">admin@shopdesk.io</code> | Password: <code className="font-mono text-indigo-700">password123</code>
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
