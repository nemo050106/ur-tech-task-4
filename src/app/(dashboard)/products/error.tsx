"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

interface ProductsErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Error boundary component for Products routes
 * Requirement 3: Add loading.tsx and error.tsx for the products routes.
 * 
 * Must be a Client Component ('use client') per Next.js requirements.
 */
export default function ProductsError({ error, reset }: ProductsErrorProps) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to console for debugging
    console.error("Products error boundary caught an error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-rose-200 bg-rose-50/50 p-8 text-center shadow-xs">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 mb-4">
        <svg
          className="h-7 w-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      <h3 className="text-lg font-bold text-slate-900">
        Something went wrong loading products
      </h3>
      <p className="mt-1 max-w-md text-xs text-slate-600 sm:text-sm">
        {error.message || "An unexpected error occurred while processing product data."}
      </p>

      <div className="mt-6 flex items-center gap-3">
        <Button variant="danger" size="md" onClick={() => reset()}>
          Try Again
        </Button>
        <Button
          variant="secondary"
          size="md"
          onClick={() => {
            router.push("/products");
          }}
        >
          Reset Filters
        </Button>
      </div>
    </div>
  );
}
