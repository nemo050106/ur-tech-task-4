import React from "react";
import type { Metadata } from "next";
import ProductList from "@/components/products/ProductList";
import { getProducts } from "@/lib/api/products";
import { Product } from "@/types/product";

export const dynamic = "force-dynamic";

/**
 * Route metadata
 */
export const metadata: Metadata = {
  title: "Products | ShopDesk",
  description: "Browse, search, filter and sort ShopDesk catalog items powered by DummyJSON API.",
};

interface ProductsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    sort?: string;
  }>;
}

/**
 * Products List Page (Server Component)
 *
 * Fetches initial products from DummyJSON Products API on the server
 * and renders the interactive ProductList component.
 */
export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedParams = await searchParams;
  const initialSearch = resolvedParams.search?.trim() || "";
  const initialCategory = resolvedParams.category || "all";
  const initialSort = resolvedParams.sort || "name-asc";

  let initialProducts: Product[] = [];
  try {
    const data = await getProducts({ limit: 0 });
    initialProducts = data.products;
  } catch (error) {
    console.error("Failed to prefetch products on server:", error);
    // ProductList client component will handle client-side fetch and error retry
  }

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Product Inventory
          </h2>
          <p className="text-xs text-slate-500 sm:text-sm">
            Cataloged items with real-time stock levels, search, filtering, and simulated DummyJSON mutations.
          </p>
        </div>
      </div>

      {/* Interactive ProductList coordinating search, filter, sort, Add, Edit */}
      <ProductList
        initialProducts={initialProducts}
        initialSearch={initialSearch}
        initialCategory={initialCategory}
        initialSort={initialSort}
      />
    </div>
  );
}
