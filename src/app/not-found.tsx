import React from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";

/**
 * Not Found Page
 * Requirement 1: calls notFound() for unknown IDs, displaying this page.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-50 text-indigo-600 mb-6 shadow-xs">
        <svg
          className="h-10 w-10"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700 ring-1 ring-rose-600/20 mb-3">
        404 Error
      </span>

      <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
        Product or Page Not Found
      </h1>

      <p className="mt-2 max-w-md text-sm text-slate-500">
        The item or page you requested could not be located in our catalog. It may have been removed, or the SKU ID is invalid.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/">
          <Button variant="secondary" size="md">
            &larr; Back to Dashboard
          </Button>
        </Link>
        <Link href="/products">
          <Button variant="primary" size="md">
            Browse All Products &rarr;
          </Button>
        </Link>
      </div>
    </div>
  );
}
