"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Product, CreateProductInput, SortField, SortDirection } from "@/types/product";
import {
  searchProducts,
  filterByCategory,
  sortProducts,
} from "@/lib/product";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getProductCategories,
} from "@/lib/api/products";
import SearchBar from "./SearchBar";
import CategoryFilter from "./CategoryFilter";
import SortSelect from "./SortSelect";
import ProductCard from "./ProductCard";
import ProductForm from "./ProductForm";
import AddProductButton from "./AddProductButton";
import Button from "@/components/ui/Button";

export interface ProductListProps {
  initialProducts?: Product[];
  initialSearch?: string;
  initialCategory?: string;
  initialSort?: string;
}

export default function ProductList({
  initialProducts = [],
  initialSearch = "",
  initialCategory = "all",
  initialSort = "name-asc",
}: ProductListProps) {
  // Main product state (single source of truth)
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isLoading, setIsLoading] = useState<boolean>(initialProducts.length === 0);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Filter & Sort states
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState(initialSort);

  // Available categories list
  const [apiCategories, setApiCategories] = useState<string[]>([]);

  // Modal Dialog states for Add / Edit
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Success / Error Feedback Toast
  const [toastMessage, setToastMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Auto-dismiss toast after 5 seconds
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Load products from API if initialProducts was empty
  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const response = await getProducts({ limit: 0 });
      setProducts(response.products);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load products from API";
      setFetchError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch products if initialProducts is empty on mount
  useEffect(() => {
    if (initialProducts.length === 0) {
      let isMounted = true;
      getProducts({ limit: 0 })
        .then((response) => {
          if (isMounted) {
            setProducts(response.products);
            setIsLoading(false);
          }
        })
        .catch((err) => {
          if (isMounted) {
            setFetchError(
              err instanceof Error ? err.message : "Failed to load products from API"
            );
            setIsLoading(false);
          }
        });
      return () => {
        isMounted = false;
      };
    }
  }, [initialProducts]);

  // Synchronize products on localStorage changes or custom update event
  useEffect(() => {
    const handleSync = () => {
      loadProducts();
    };
    window.addEventListener("products-updated", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("products-updated", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, [loadProducts]);

  // Fetch categories from API
  useEffect(() => {
    let isMounted = true;
    getProductCategories().then((cats) => {
      if (isMounted && cats.length > 0) {
        setApiCategories(cats);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Compute available categories from products and API
  const availableCategories = useMemo(() => {
    const fromProducts = products.map((p) => p.category).filter(Boolean);
    const set = new Set([...fromProducts, ...apiCategories]);
    return Array.from(set).sort();
  }, [products, apiCategories]);

  // Computed filtered and sorted products
  const filteredProducts = useMemo(() => {
    // 1. Search products
    let result = searchProducts(products, search);

    // 2. Filter by category
    result = filterByCategory(result, category);

    // 3. Sort products
    let field: SortField = "title";
    let direction: SortDirection = "asc";

    switch (sort) {
      case "name-asc":
      case "title-asc":
        field = "title";
        direction = "asc";
        break;
      case "name-desc":
      case "title-desc":
        field = "title";
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
      case "rating-desc":
        field = "rating";
        direction = "desc";
        break;
      case "stock-desc":
        field = "stock";
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
        field = "title";
        direction = "asc";
    }

    return sortProducts(result, field, direction);
  }, [products, search, category, sort]);

  const hasActiveFilters =
    search.trim() !== "" || category !== "all" || sort !== "name-asc";

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setSort("name-asc");
  };

  // Handler for creating a new product
  const handleAddSubmit = async (formData: CreateProductInput) => {
    try {
      const created = await addProduct(formData);
      // Immediately prepend to local state
      setProducts((prev) => [created, ...prev]);
      setIsAddModalOpen(false);
      setToastMessage({
        type: "success",
        text: `Product "${created.title}" added successfully! (Simulated mutation via DummyJSON API)`,
      });
    } catch (err) {
      throw err; // Handled inside ProductForm
    }
  };

  // Handler for editing an existing product
  const handleEditSubmit = async (formData: CreateProductInput) => {
    if (!editingProduct) return;

    try {
      const updated = await updateProduct(editingProduct.id, formData);
      // Update in local state preserving existing properties
      setProducts((prev) =>
        prev.map((item) =>
          item.id === editingProduct.id
            ? { ...item, ...updated, title: updated.title || item.title }
            : item
        )
      );
      setEditingProduct(null);
      setToastMessage({
        type: "success",
        text: `Product "${updated.title || editingProduct.title}" updated successfully!`,
      });
    } catch (err) {
      throw err; // Handled inside ProductForm
    }
  };

  // Handler for deleting a product
  const handleDeleteProduct = async (product: Product) => {
    const title = product.title || product.name || "Product";
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"?`
    );
    if (!confirmed) return;

    try {
      await deleteProduct(product.id);
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      setToastMessage({
        type: "success",
        text: `Product "${title}" was deleted successfully.`,
      });
    } catch {
      setToastMessage({
        type: "error",
        text: `Failed to delete product "${title}".`,
      });
    }
  };

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsAddModalOpen(false);
        setEditingProduct(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="space-y-6">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div
          role="alert"
          className={`flex items-center justify-between gap-3 rounded-2xl p-4 text-sm font-medium shadow-md transition-all ${
            toastMessage.type === "success"
              ? "bg-emerald-600 text-white"
              : "bg-rose-600 text-white"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {toastMessage.type === "success" ? (
              <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span>{toastMessage.text}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-white/80 hover:text-white cursor-pointer"
            aria-label="Dismiss notification"
          >
            ✕
          </button>
        </div>
      )}

      {/* Toolbar: Search, Filter, Sort, and Add Product Action */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:p-5">
        <div className="flex flex-col gap-3.5 md:flex-row md:items-center">
          {/* Search bar */}
          <div className="flex-1 min-w-[240px]">
            <SearchBar
              search={search}
              setSearch={setSearch}
              placeholder="Search products by title, category, or brand..."
            />
          </div>

          {/* Filter & Sort controls */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="w-full sm:w-52">
              <CategoryFilter
                category={category}
                setCategory={setCategory}
                categories={availableCategories}
              />
            </div>

            <div className="w-full sm:w-48">
              <SortSelect sort={sort} setSort={setSort} />
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

            <AddProductButton
              onClick={() => setIsAddModalOpen(true)}
              size="md"
              className="shrink-0 bg-indigo-600 text-white hover:bg-indigo-700"
            />
          </div>
        </div>

        {/* Status / Active filters indicators */}
        <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>
              Showing <strong className="text-slate-800">{filteredProducts.length}</strong> of{" "}
              <strong className="text-slate-800">{products.length}</strong> catalog items
            </span>
            {hasActiveFilters && (
              <span className="rounded-full bg-indigo-50 px-2 py-0.5 font-semibold text-indigo-700">
                Filtered view
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {category !== "all" && (
              <span className="inline-flex items-center gap-1 text-slate-600 capitalize">
                Category: <strong className="text-slate-800">{category.replace(/-/g, " ")}</strong>
              </span>
            )}
            <span className="text-[11px] text-slate-400">
              API: DummyJSON Products
            </span>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-16 text-center shadow-xs">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent mb-4" />
          <h4 className="text-base font-bold text-slate-800">Loading Products...</h4>
          <p className="mt-1 text-xs text-slate-500">
            Fetching product catalog from DummyJSON API.
          </p>
        </div>
      ) : fetchError ? (
        /* Failed API Request State */
        <div className="flex flex-col items-center justify-center rounded-2xl border border-rose-200 bg-rose-50/50 p-12 text-center shadow-xs">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 mb-4">
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h4 className="text-lg font-bold text-slate-900">Failed to Load Products</h4>
          <p className="mt-1 max-w-md text-sm text-slate-600">
            {fetchError}
          </p>
          <div className="mt-6 flex items-center gap-3">
            <Button variant="primary" size="md" onClick={loadProducts}>
              Retry API Request
            </Button>
          </div>
        </div>
      ) : filteredProducts.length > 0 ? (
        /* Responsive Product Grid: 1 / 2 / 3 / 4 columns */
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={(prod) => setEditingProduct(prod)}
              onDelete={handleDeleteProduct}
            />
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
            No items matched your current filter criteria &quot;{search || category}&quot;. Try adjusting your keywords or clearing the filters.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <Button variant="secondary" size="md" onClick={clearFilters}>
              Reset All Filters
            </Button>
            <AddProductButton
              onClick={() => setIsAddModalOpen(true)}
              size="md"
              variant="primary"
            >
              Add New Product
            </AddProductButton>
          </div>
        </div>
      )}

      {/* Add Product Modal Dialog */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 cursor-pointer p-1 rounded-lg hover:bg-slate-100"
              aria-label="Close dialog"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <ProductForm
              key="add-modal"
              title="Add New Product"
              onSubmit={handleAddSubmit}
              onCancel={() => setIsAddModalOpen(false)}
              categories={availableCategories}
            />
          </div>
        </div>
      )}

      {/* Edit Product Modal Dialog */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setEditingProduct(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 cursor-pointer p-1 rounded-lg hover:bg-slate-100"
              aria-label="Close dialog"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <ProductForm
              key={`edit-modal-${editingProduct.id}`}
              initialData={editingProduct}
              onSubmit={handleEditSubmit}
              onCancel={() => setEditingProduct(null)}
              categories={availableCategories}
            />
          </div>
        </div>
      )}
    </div>
  );
}
