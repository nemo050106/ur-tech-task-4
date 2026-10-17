import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import InventorySummary from "@/components/products/InventorySummary";
import { Product } from "@/types/product";
import { getProducts } from "@/lib/api/products";
import { sortProducts, formatPrice } from "@/lib/product";

export const dynamic = "force-dynamic";

/**
 * Metadata for Dashboard Route (/)
 */
export const metadata: Metadata = {
  title: "Dashboard | ShopDesk",
  description: "Real-time store inventory summary, metrics, and recently cataloged items powered by DummyJSON API.",
};

/**
 * Dashboard Page (Server Component)
 */
export default async function DashboardPage() {
  let products: Product[] = [];
  let fetchError: string | null = null;

  try {
    const data = await getProducts({ limit: 0 });
    products = data.products;
  } catch (error) {
    fetchError =
      error instanceof Error ? error.message : "Failed to load products from API";
    console.error("Dashboard failed to fetch products:", error);
  }

  // Get the top 5 most recent products sorted by creation date descending
  const recentProducts = sortProducts(products, "createdAt", "desc").slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col gap-4 rounded-3xl bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-xl sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>ShopDesk Live Inventory &bull; DummyJSON API</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Welcome to ShopDesk
          </h2>
          <p className="max-w-xl text-sm text-slate-300">
            Real-time inventory overview, stock health alerts, and catalog items powered by DummyJSON.
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

      {/* API Fetch Error Banner if any */}
      {fetchError && (
        <div className="flex items-center justify-between rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          <span>Failed to connect to DummyJSON API: {fetchError}</span>
          <Link href="/products" className="font-semibold underline">
            Go to Products page
          </Link>
        </div>
      )}

      {/* Inventory Summary Metrics (Reusable component) */}
      <InventorySummary
        products={products}
        title="Inventory Summary"
        subtitle="Calculated live across catalog SKUs"
      />

      {/* Recent Products Section */}
      <Card className="overflow-hidden p-0 shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Recent Catalog Items
            </h3>
            <p className="text-xs text-slate-500">
              Latest items from DummyJSON catalog
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
                <th className="px-6 py-3.5">Product Title</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Price</th>
                <th className="px-6 py-3.5">Stock</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {recentProducts.map((product) => {
                const productTitle = product.title || product.name || "Untitled";
                return (
                  <tr
                    key={product.id}
                    className="group transition-colors hover:bg-slate-50/80"
                  >
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs font-bold text-slate-600 overflow-hidden border border-slate-200/60 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                          {product.thumbnail ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={product.thumbnail}
                              alt={productTitle}
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            productTitle.slice(0, 2).toUpperCase()
                          )}
                        </div>
                        <div>
                          <Link
                            href={`/products/${product.id}`}
                            className="line-clamp-1 hover:text-indigo-600 hover:underline"
                          >
                            {productTitle}
                          </Link>
                          <span className="text-[11px] text-slate-400">
                            SKU #{product.sku || product.id} {product.brand ? `&bull; ${product.brand}` : ""}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-lg bg-slate-100 px-2 py-0.5 text-xs font-medium capitalize text-slate-700">
                        {product.category?.replace(/-/g, " ")}
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
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-6 py-3 text-xs text-slate-500">
          <span>Displaying recent items from DummyJSON API</span>
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
