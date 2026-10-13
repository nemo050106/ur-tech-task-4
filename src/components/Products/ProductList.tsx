"use client";

import React, { useState, useMemo } from "react";
import { Product } from "@/types/Product";
import {
  searchProducts,
  filterByCategory,
  sortProducts,
  SortField,
  SortDirection,
} from "@/lib/product";
import SearchBar from "./SearchBar";
import CategoryFilter from "./CategoryFilter";
import SortSelect from "./SortSelect";
import ProductCard from "./ProductCard";
import Button from "@/components/ui/Button";

export interface ProductListProps {
  products: Product[];
}

export default function ProductList({ products }: ProductListProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("name-asc");

  // Get unique categories from products
  const categories = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.category))).sort();
  }, [products]);

  // Use the functions in src/lib/product to search, filter and sort
  const filteredProducts = useMemo(() => {
    // 1. Search products using searchProducts from lib/product
    let result = searchProducts(products, search);

    // 2. Filter by category using filterByCategory from lib/product
    result = filterByCategory(result, category);

    // 3. Sort products using sortProducts from lib/product
    let field: SortField = "name";
    let direction: SortDirection = "asc";

    switch (sort) {
      case "name-asc":
        field = "name";
        direction = "asc";
        break;
      case "name-desc":
        field = "name";
        direction = "desc";
        break;
      case "price-asc":
        field = "price";
        direction = "asc";
        break;
      case "price-desc":
        field = "price";
        direction = "desc";
        break;
      case "date-desc":
        field = "createdAt";
        direction = "desc";
        break;
      case "date-asc":
        field = "createdAt";
        direction = "asc";
        break;
      default:
        field = "name";
        direction = "asc";
    }

    return sortProducts(result, field, direction);
  }, [products, search, category, sort]);

  const hasActiveFilters = search.trim() !== "" || category !== "all" || sort !== "name-asc";

  function clearFilters() {
    setSearch("");
    setCategory("all");
    setSort("name-asc");
  }

  return (
    <div className="space-y-6">
      {/* Module 4 Toolbar: Search, Filter, Sort that stacks on mobile */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:p-5">
        <div className="flex flex-col gap-3.5 md:flex-row md:items-center">
          {/* Search bar */}
          <div className="flex-1 min-w-[240px]">
            <SearchBar
              search={search}
              setSearch={setSearch}
              placeholder="Search products by title or category..."
            />
          </div>

          {/* Filter & Sort controls (stack on mobile, side-by-side on tablet/desktop) */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="w-full sm:w-52">
              <CategoryFilter
                category={category}
                setCategory={setCategory}
                categories={categories}
              />
            </div>

            <div className="w-full sm:w-48">
              <SortSelect
                sort={sort}
                setSort={setSort}
              />
            </div>

            {hasActiveFilters && (
              <Button
                variant="outline"
                size="md"
                onClick={clearFilters}
                className="shrink-0 text-slate-600 hover:text-slate-900 border-dashed"
                icon={
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                }
              >
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Status / Active filters indicators */}
        <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>
              Showing <strong className="text-slate-800">{filteredProducts.length}</strong> of{" "}
              <strong className="text-slate-800">{products.length}</strong> items
            </span>
            {hasActiveFilters && (
              <span className="rounded-full bg-indigo-50 px-2 py-0.5 font-semibold text-indigo-700">
                Filtered view
              </span>
            )}
          </div>

          {category !== "all" && (
            <span className="inline-flex items-center gap-1 text-slate-600">
              Category: <strong className="text-slate-800">{category}</strong>
            </span>
          )}
        </div>
      </div>

      {/* Responsive Product Grid: 1 / 2 / 3 / 4 columns */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
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
          <h4 className="text-lg font-bold text-slate-900">No products found</h4>
          <p className="mt-1 max-w-sm text-sm text-slate-500">
            No items matched your current filter criteria &quot;{search || category}&quot;. Try adjusting your keywords or clearing the filters.
          </p>
          <div className="mt-6">
            <Button variant="primary" size="md" onClick={clearFilters}>
              Reset All Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
