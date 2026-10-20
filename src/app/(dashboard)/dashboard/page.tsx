import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import Button from "@/components/ui/Button";
import InventorySummary from "@/components/products/InventorySummary";
import ProductList from "@/components/products/ProductList";
import { getProducts } from "@/lib/api/products";
import { Product } from "@/types/product";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard | ShopDesk Admin",
  description:
    "Product management dashboard with inventory stats, view, add, edit, and delete functionality.",
};

/**
 * Dashboard Page (Server Component)
 * Route: /dashboard
 * Accessible via the demo login flow.
 */
export default async function DashboardPage() {
  let products: Product[] = [];
  let fetchError: string | null = null;

  try {
    const data = await getProducts({ limit: 0 });
    products = data.products;
  } catch (error) {
    fetchError =
      error instanceof Error ? error.message : "Failed to load products";
    console.error("Dashboard failed to fetch products:", error);
  }

  return (
    <div className="space-y-8">
      {/* Dashboard Welcome Header */}
      <div className="flex flex-col gap-4 rounded-3xl bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-xl sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Product Management &bull; Admin Dashboard</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Welcome to Dashboard
          </h1>
          <p className="max-w-xl text-sm text-slate-300">
            Manage your store inventory: view, add, edit, and delete products. All changes persist in localStorage.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/products/new">
            <Button
              variant="primary"
              size="md"
              className="bg-indigo-500 hover:bg-indigo-400 text-white shadow-md shadow-indigo-900/50"
              icon={
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              }
            >
              Add Product
            </Button>
          </Link>
          <Link href="/">
            <Button
              variant="outline"
              size="md"
              className="border-white/20 text-white hover:bg-white/10"
              icon={
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              }
            >
              View Storefront
            </Button>
          </Link>
        </div>
      </div>

      {fetchError && (
        <div className="flex items-center justify-between rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          <span>{fetchError}</span>
        </div>
      )}

      {/* Inventory Summary Metrics */}
      <InventorySummary
        products={products}
        title="Inventory Overview"
        subtitle="Live statistics from localStorage"
      />

      {/* Product Management Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Manage Products
          </h2>
          <p className="text-xs text-slate-500 sm:text-sm">
            Search, filter, edit, or remove catalog items below.
          </p>
        </div>

        <ProductList initialProducts={products} />
      </div>
    </div>
  );
}
