import React from "react";
import Link from "next/link";
import productsData from "@/data/product.json";
import { Product } from "@/types/Product";
import {
  searchProducts,
  filterByCategory,
  sortProducts,
  SortField,
  SortDirection,
} from "@/lib/product";
import ProductToolbar from "@/components/Products/ProductToolbar";
import ProductCard from "@/components/Products/ProductCard";
import Button from "@/components/ui/Button";

/**
 * Route metadata
 * Requirement 4: Each page sets its own title with metadata / generateMetadata.
 */
export const metadata = {
  title: "Products | ShopDesk",
  description: "Browse, search, filter and sort ShopDesk catalog items.",
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
 * Requirement 5: Pages and layouts stay Server Components.
 * Requirement 6: Search, filter, and sort live in searchParams, making URLs shareable
 * (e.g. /products?category=Electronics&sort=price-asc).
 */
export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  // In Next.js 15+, searchParams is a Promise that must be awaited
  const resolvedParams = await searchParams;
  const search = resolvedParams.search?.trim() || "";
  const category = resolvedParams.category || "all";
  const sort = resolvedParams.sort || "name-asc";

  const products = productsData as Product[];

  // Extract unique categories for the filter toolbar
  const categories = Array.from(new Set(products.map((p) => p.category))).sort();

  // 1. Search products on the server using searchProducts from src/lib/product.ts
  let filtered = searchProducts(products, search);

  // 2. Filter products on the server using filterByCategory from src/lib/product.ts
  filtered = filterByCategory(filtered, category);

  // 3. Sort products on the server using sortProducts from src/lib/product.ts
  let sortField: SortField = "name";
  let sortDirection: SortDirection = "asc";

  switch (sort) {
    case "name-asc":
      sortField = "name";
      sortDirection = "asc";
      break;
    case "name-desc":
      sortField = "name";
      sortDirection = "desc";
      break;
    case "price-asc":
      sortField = "price";
      sortDirection = "asc";
      break;
    case "price-desc":
      sortField = "price";
      sortDirection = "desc";
      break;
    case "date-desc":
      sortField = "createdAt";
      sortDirection = "desc";
      break;
    case "date-asc":
      sortField = "createdAt";
      sortDirection = "asc";
      break;
    default:
      sortField = "name";
      sortDirection = "asc";
  }

  filtered = sortProducts(filtered, sortField, sortDirection);

  return (
    <div className="space-y-6">
      {/* Header bar with title and link to New Product */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Product Inventory
          </h2>
          <p className="text-xs text-slate-500 sm:text-sm">
            Cataloged items with real-time stock levels, search, filtering, and sorting.
          </p>
        </div>

        <Link href="/products/new">
          <Button
            variant="primary"
            size="md"
            icon={
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            }
          >
            Add Product
          </Button>
        </Link>
      </div>

      {/* Interactive search, filter & sort toolbar (Client Component) */}
      <ProductToolbar categories={categories} />

      {/* Showing count indicator */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <p>
          Showing <strong className="text-slate-800">{filtered.length}</strong> of{" "}
          <strong className="text-slate-800">{products.length}</strong> products
        </p>
        {(search || category !== "all" || sort !== "name-asc") && (
          <Link
            href="/products"
            className="text-indigo-600 hover:text-indigo-700 hover:underline font-medium"
          >
            Reset URL filters
          </Link>
        )}
      </div>

      {/* Responsive product grid (1 / 2 / 3 / 4 columns) */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-xs">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-4">
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h4 className="text-lg font-bold text-slate-900">No matching products found</h4>
          <p className="mt-1 max-w-sm text-sm text-slate-500">
            No products match &quot;{search || category}&quot;. Try adjusting your filters or resetting the search.
          </p>
          <div className="mt-6">
            <Link href="/products">
              <Button variant="primary" size="md">
                Clear Filters
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
