import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import productsData from "@/data/product.json";
import { Product } from "@/types/Product";
import { formatPrice } from "@/lib/product";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Dynamic Metadata for Product Detail Page
 * Requirement 4: Each page sets its own title with metadata / generateMetadata.
 */
export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = (productsData as Product[]).find((p) => p.id === Number(id));

  if (!product) {
    return {
      title: "Product Not Found | ShopDesk",
      description: "The requested product does not exist in the inventory.",
    };
  }

  return {
    title: `${product.name} | ShopDesk`,
    description: `View details, pricing, and stock status for ${product.name} (${product.category}).`,
  };
}

/**
 * Product Detail Page (Server Component)
 * 
 * Requirement 1: Reads id from params, shows the product, and calls notFound() for unknown IDs.
 * Requirement 5: Pages stay Server Components.
 */
export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  // In Next.js 15+, params is a Promise that must be awaited
  const { id } = await params;
  const productId = Number(id);

  // If the ID is not a valid number, trigger 404
  if (isNaN(productId)) {
    notFound();
  }

  // Lookup product from local catalog data
  const product = (productsData as Product[]).find((p) => p.id === productId);

  // If product does not exist, call notFound() per Requirement 1
  if (!product) {
    notFound();
  }

  const formattedDate = new Date(product.createdAt).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Navigation breadcrumb / Back button */}
      <div>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Product Inventory
        </Link>
      </div>

      {/* Main Product Card */}
      <Card className="p-6 sm:p-8 space-y-8 shadow-sm">
        {/* Top Header */}
        <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                {product.category}
              </span>
              <Badge stock={product.stock} />
              {product.isActive ? (
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-600/20">
                  Active
                </span>
              ) : (
                <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-medium text-rose-700 ring-1 ring-rose-600/20">
                  Inactive
                </span>
              )}
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              {product.name}
            </h1>
            <p className="text-xs text-slate-400">
              Unique SKU ID: <span className="font-mono font-medium text-slate-600">#{product.id}</span>
            </p>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Unit Price
            </p>
            <p className="text-3xl font-extrabold text-indigo-600">
              {formatPrice(product.price)}
            </p>
          </div>
        </div>

        {/* Detailed specifications grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Current Stock
            </p>
            <p className="mt-1 text-xl font-bold text-slate-900">
              {product.stock} units
            </p>
            <p className="mt-0.5 text-[11px] text-slate-500">
              {product.stock === 0
                ? "Out of stock - reorder needed"
                : product.stock <= 5
                ? "Low stock threshold alert"
                : "Healthy inventory balance"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Stock Value
            </p>
            <p className="mt-1 text-xl font-bold text-slate-900">
              {formatPrice(product.price * product.stock)}
            </p>
            <p className="mt-0.5 text-[11px] text-slate-500">
              Asset value based on {product.stock} units
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Catalog Date
            </p>
            <p className="mt-1 text-sm font-bold text-slate-900">
              {formattedDate}
            </p>
            <p className="mt-0.5 text-[11px] text-slate-500">
              Registered in catalog
            </p>
          </div>
        </div>

        {/* Actions bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-6">
          <Link href="/products">
            <Button variant="secondary" size="md">
              &larr; Back to Inventory
            </Button>
          </Link>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={undefined}
            >
              Order Restock
            </Button>
            <Link href="/products/new">
              <Button variant="primary" size="md">
                + Create Another Product
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
