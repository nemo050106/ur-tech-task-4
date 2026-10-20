import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import Button from "@/components/ui/Button";
import StoreNavbar from "@/components/layout/StoreNavbar";
import ProductList from "@/components/products/ProductList";
import { getProducts } from "@/lib/api/products";
import { Product } from "@/types/product";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ShopDesk — Public Online Store",
  description:
    "Browse our complete catalog of products. Search, filter by category, sort by price, and explore details.",
};

/**
 * Public Home Page (Server Component)
 * Route: /
 * Displays all products without requiring login.
 * Contains StoreNavbar with a Login button for accessing the dashboard.
 * Does NOT contain the dashboard sidebar.
 */
export default async function HomePage() {
  let products: Product[] = [];
  let fetchError: string | null = null;

  try {
    const data = await getProducts({ limit: 0 });
    products = data.products;
  } catch (error) {
    fetchError =
      error instanceof Error ? error.message : "Failed to load products";
    console.error("Home page failed to fetch products:", error);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Public Store Navbar */}
      <StoreNavbar />

      {/* Main Store Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Public Store Welcome Banner */}
        <div className="flex flex-col gap-4 rounded-3xl bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-xl sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>ShopDesk Public Catalog</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Welcome to ShopDesk Store
            </h1>
            <p className="max-w-xl text-sm text-slate-300">
              Browse our complete catalog of products freely without logging in. To manage, add, or edit inventory, please log in to the dashboard.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button
                variant="primary"
                size="md"
                className="bg-indigo-500 hover:bg-indigo-400 text-white shadow-md shadow-indigo-900/50"
                icon={
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                }
              >
                Login to Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Error Banner if any */}
        {fetchError && (
          <div className="flex items-center justify-between rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
            <span>{fetchError}</span>
          </div>
        )}

        {/* Public Product Catalog */}
        <ProductList initialProducts={products} />
      </main>
    </div>
  );
}
