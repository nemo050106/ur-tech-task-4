import React from "react";
import Card from "@/components/ui/Card";

/**
 * Loading state for Products route
 * Requirement 3: Add loading.tsx and error.tsx for the products routes.
 * 
 * Automatically rendered by Next.js while the Products Server Component
 * resolves data and searchParams.
 */
export default function ProductsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="h-7 w-48 rounded-xl bg-slate-200" />
          <div className="h-4 w-72 rounded-lg bg-slate-200" />
        </div>
        <div className="h-9 w-36 rounded-xl bg-slate-200" />
      </div>

      {/* Toolbar skeleton */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex flex-col gap-3.5 md:flex-row">
          <div className="h-10 flex-1 rounded-xl bg-slate-100" />
          <div className="h-10 w-full sm:w-52 rounded-xl bg-slate-100" />
          <div className="h-10 w-full sm:w-48 rounded-xl bg-slate-100" />
        </div>
      </div>

      {/* 8 Card Skeletons in responsive grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index} className="flex flex-col justify-between p-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-5 w-20 rounded-lg bg-slate-200" />
                <div className="h-5 w-16 rounded-full bg-slate-200" />
              </div>
              <div className="h-5 w-3/4 rounded-lg bg-slate-200" />
              <div className="h-3 w-1/2 rounded-md bg-slate-100" />
            </div>

            <div className="mt-6 border-t border-slate-100 pt-4 space-y-3">
              <div className="flex justify-between items-center">
                <div className="h-6 w-20 rounded-md bg-slate-200" />
                <div className="h-4 w-12 rounded-md bg-slate-100" />
              </div>
              <div className="h-9 w-full rounded-xl bg-slate-100" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
