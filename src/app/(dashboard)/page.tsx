import React from "react";
import Link from "next/link";
import StatCard from "@/components/Dashboard/StatCard";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import productsData from "@/data/product.json";
import { Product } from "@/types/Product";
import { getInventorySummary, sortProducts, formatPrice } from "@/lib/product";

/**
 * Metadata for Dashboard Route (/)
 * Requirement 4: Each page sets its own title with metadata / generateMetadata.
 */
export const metadata = {
  title: "Dashboard | ShopDesk",
  description: "Real-time store inventory summary, metrics, and recently cataloged items.",
};

/**
 * Dashboard Page (Server Component)
 * 
 * Requirement 5: Pages and layouts stay Server Components.
 * Uses helper functions from src/lib/product.ts:
 * - getInventorySummary() to calculate 4 stat metrics
 * - sortProducts() to find the 5 newest products
 * - formatPrice() to format currency values
 */
export default function DashboardPage() {
  const products = productsData as Product[];

  // 1. Calculate inventory summary using getInventorySummary from lib/product
  const summary = getInventorySummary(products);

  // 2. Fetch the top 5 most recent products sorted by creation date descending
  const recentProducts = sortProducts(products, "createdAt", "desc").slice(0, 5);

  const activeRate =
    summary.totalProducts > 0
      ? Math.round((summary.activeProducts / summary.totalProducts) * 100)
      : 0;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col gap-4 rounded-3xl bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-xl sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>ShopDesk Live Inventory</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Welcome to ShopDesk
          </h2>
          <p className="max-w-xl text-sm text-slate-300">
            Real-time inventory overview, stock health alerts, and recently cataloged items.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/products">
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
              Browse All Products
            </Button>
          </Link>
        </div>
      </div>

      {/* Four Stat Cards */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            Inventory Summary
          </h3>
          <span className="text-xs text-slate-400">Calculated via getInventorySummary</span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* 1. Total Products */}
          <StatCard
            title="Total Products"
            value={summary.totalProducts}
            subtitle="All cataloged SKUs"
            variant="default"
            icon={
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            }
          />

          {/* 2. Active Products */}
          <StatCard
            title="Active Products"
            value={summary.activeProducts}
            subtitle={`${activeRate}% of catalog active`}
            variant="success"
            icon={
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          />

          {/* 3. Out of Stock */}
          <StatCard
            title="Out of Stock"
            value={summary.outOfStock}
            subtitle={
              summary.outOfStock > 0
                ? "Requires restocking attention"
                : "All items currently in stock"
            }
            variant="danger"
            icon={
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            }
          />

          {/* 4. Total Stock Value */}
          <StatCard
            title="Total Stock Value"
            value={formatPrice(summary.totalStockValue)}
            subtitle="Asset valuation across inventory"
            variant="primary"
            icon={
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          />
        </div>
      </div>

      {/* Recent Products Section */}
      <Card className="overflow-hidden p-0 shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Recent Products
            </h3>
            <p className="text-xs text-slate-500">
              Latest items sorted by creation date using sortProducts(products, &quot;createdAt&quot;, &quot;desc&quot;)
            </p>
          </div>

          <Link href="/products">
            <Button variant="secondary" size="sm">
              View All {products.length} Products
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </Link>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="px-6 py-3.5">Product Name</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Price</th>
                <th className="px-6 py-3.5">Stock</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {recentProducts.map((product) => (
                <tr
                  key={product.id}
                  className="group transition-colors hover:bg-slate-50/80"
                >
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs font-bold text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                        {product.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <Link
                          href={`/products/${product.id}`}
                          className="line-clamp-1 hover:text-indigo-600 hover:underline"
                        >
                          {product.name}
                        </Link>
                        <span className="text-[11px] text-slate-400">SKU #{product.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-lg bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">
                    {product.stock} units
                  </td>
                  <td className="px-6 py-4">
                    <Badge stock={product.stock} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/products/${product.id}`}>
                      <Button variant="outline" size="sm">
                        View Details &rarr;
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-6 py-3 text-xs text-slate-500">
          <span>Displaying top 5 most recently created items</span>
          <Link
            href="/products"
            className="font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
          >
            Go to Products Page &rarr;
          </Link>
        </div>
      </Card>
    </div>
  );
}
