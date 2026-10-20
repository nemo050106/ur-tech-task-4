"use client";

import React, { useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import EditProductButton from "./EditProductButton";
import { Product } from "@/types/product";
import { formatPrice } from "@/lib/product";

export interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

/**
 * ProductCard component
 *
 * Displays individual product card in the responsive grid.
 * Includes thumbnail preview with fallback, rating, price, stock status,
 * link to detail page, an Edit button, and a Delete button.
 */
export default function ProductCard({
  product,
  onEdit,
  onDelete,
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false);

  const productTitle = product.title || product.name || "Untitled Product";
  const formattedDate = product.createdAt
    ? new Date(product.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recently";

  const thumbnailSrc =
    !imageError && (product.thumbnail || product.images?.[0])
      ? product.thumbnail || product.images?.[0]
      : null;

  return (
    <Card
      hoverable
      className="group flex flex-col justify-between overflow-hidden p-5 transition-all duration-200"
    >
      <div>
        {/* Product Image / Thumbnail with Fallback */}
        <div className="relative mb-4 flex h-40 w-full items-center justify-center overflow-hidden rounded-xl bg-slate-50 border border-slate-100 group-hover:bg-slate-100/70 transition-colors">
          {thumbnailSrc ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={thumbnailSrc}
              alt={productTitle}
              onError={() => setImageError(true)}
              className="h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-1 text-slate-400">
              <svg
                className="h-10 w-10 text-slate-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-[11px] font-medium text-slate-400">
                {productTitle.slice(0, 16)}
              </span>
            </div>
          )}

          {/* Optional Rating Badge */}
          {product.rating !== undefined && product.rating > 0 && (
            <div className="absolute top-2 right-2 flex items-center gap-1 rounded-lg bg-white/95 px-2 py-0.5 text-[11px] font-bold text-amber-600 shadow-xs backdrop-blur-xs">
              <span>★</span>
              <span>{Number(product.rating).toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Category tag & stock status badge */}
        <div className="flex items-start justify-between gap-2">
          <span className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold capitalize text-slate-600">
            {product.category?.replace(/-/g, " ") || "General"}
          </span>
          <Badge stock={product.stock} />
        </div>

        {/* Product Title linking to detail page */}
        <h3 className="mt-3 text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
          <Link href={`/products/${product.id}`} className="hover:underline">
            {productTitle}
          </Link>
        </h3>

        {/* Brand if available */}
        {product.brand && (
          <p className="mt-0.5 text-xs font-medium text-slate-500">
            by <span className="text-slate-700">{product.brand}</span>
          </p>
        )}

        {/* Product SKU and added date */}
        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
          <span>SKU #{product.sku || product.id}</span>
          <span>Added {formattedDate}</span>
        </div>
      </div>

      {/* Pricing, stock, and action buttons */}
      <div className="mt-5 border-t border-slate-100 pt-4">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              Price
            </p>
            <p className="text-xl font-extrabold text-slate-900">
              {formatPrice(product.price)}
            </p>
          </div>

          <div className="text-right">
            <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              Stock
            </p>
            <p
              className={`text-sm font-bold ${
                product.stock === 0
                  ? "text-rose-600"
                  : product.stock <= 5
                  ? "text-amber-600"
                  : "text-slate-700"
              }`}
            >
              {product.stock} units
            </p>
          </div>
        </div>

        {/* Action buttons: View Details and Edit */}
        <div className="mt-4 flex items-center gap-2">
          <Link href={`/products/${product.id}`} className="flex-1">
            <Button
              variant={product.stock === 0 ? "secondary" : "outline"}
              size="sm"
              className="w-full"
            >
              View Details &rarr;
            </Button>
          </Link>

          {onEdit && (
            <EditProductButton
              product={product}
              onEdit={onEdit}
              size="sm"
              variant="outline"
              className="hover:border-indigo-300 hover:text-indigo-600"
            />
          )}

          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(product)}
              className="hover:border-rose-300 hover:text-rose-600 text-slate-500 px-2.5"
              title="Delete Product"
            >
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
