"use client";

import React, { useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

interface ProductToolbarProps {
  categories: string[];
}

/**
 * ProductToolbar (Client Component)
 * 
 * Only the interactive UI logic (capturing inputs and updating URL query parameters)
 * runs on the client. The actual product filtering and sorting runs on the server
 * via the Server Component page reading searchParams.
 */
export default function ProductToolbar({ categories }: ProductToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Read current active values directly from URL searchParams
  const currentSearch = searchParams.get("search") || "";
  const currentCategory = searchParams.get("category") || "all";
  const currentSort = searchParams.get("sort") || "name-asc";

  // Helper to update specific search parameter and replace URL
  const updateQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || value === "all" || (key === "sort" && value === "name-asc")) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    startTransition(() => {
      const queryString = params.toString();
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    });
  };

  // Reset all filters by navigating back to clean pathname
  const clearFilters = () => {
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  };

  const hasActiveFilters =
    Boolean(currentSearch.trim()) ||
    currentCategory !== "all" ||
    currentSort !== "name-asc";

  // Build category options for Select component
  const categoryOptions = [
    { label: "All Categories", value: "all" },
    ...categories.map((c) => ({ label: c, value: c })),
  ];

  // Build sort options for Select component
  const sortOptions = [
    { label: "Name: A to Z", value: "name-asc" },
    { label: "Name: Z to A", value: "name-desc" },
    { label: "Price: Low to High", value: "price-asc" },
    { label: "Price: High to Low", value: "price-desc" },
    { label: "Newest First", value: "date-desc" },
    { label: "Oldest First", value: "date-asc" },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:p-5">
      {/* Toolbar controls: search, category filter, sort select */}
      <div className="flex flex-col gap-3.5 md:flex-row md:items-center">
        {/* Search input with live searchParams binding */}
        <div className="flex-1 min-w-[240px]">
          <Input
            value={currentSearch}
            onChange={(val: string) => updateQuery("search", val)}
            placeholder="Search products by title or category..."
            clearable
            onClear={() => updateQuery("search", "")}
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            }
          />
        </div>

        {/* Filter and Sort Select dropdowns */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="w-full sm:w-52">
            <Select
              value={currentCategory}
              onChange={(val: string) => updateQuery("category", val)}
              options={categoryOptions}
            />
          </div>

          <div className="w-full sm:w-48">
            <Select
              value={currentSort}
              onChange={(val: string) => updateQuery("sort", val)}
              options={sortOptions}
            />
          </div>

          {/* Clear filters button */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="md"
              onClick={clearFilters}
              disabled={isPending}
              className="shrink-0 text-slate-600 hover:text-slate-900 border-dashed"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              }
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Active filter badge summary */}
      <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          {hasActiveFilters ? (
            <span className="rounded-full bg-indigo-50 px-2 py-0.5 font-semibold text-indigo-700">
              Active Filters in URL
            </span>
          ) : (
            <span>All products shown</span>
          )}
          {isPending && <span className="text-indigo-600 animate-pulse">Updating...</span>}
        </div>

        {currentCategory !== "all" && (
          <span className="text-slate-600">
            Filtered by category: <strong className="text-slate-900">{currentCategory}</strong>
          </span>
        )}
      </div>
    </div>
  );
}
