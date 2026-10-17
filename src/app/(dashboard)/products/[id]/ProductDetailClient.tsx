"use client";

import React, { useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import ProductForm from "@/components/products/ProductForm";
import EditProductButton from "@/components/products/EditProductButton";
import { Product, CreateProductInput } from "@/types/product";
import { formatPrice } from "@/lib/product";
import { updateProduct } from "@/lib/api/products";

export interface ProductDetailClientProps {
  initialProduct: Product;
}

export default function ProductDetailClient({
  initialProduct,
}: ProductDetailClientProps) {
  const [product, setProduct] = useState<Product>(initialProduct);
  const [isEditing, setIsEditing] = useState(false);
  const [activeImage, setActiveImage] = useState<string>(
    initialProduct.thumbnail || initialProduct.images?.[0] || ""
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const productTitle = product.title || product.name || "Untitled Product";
  const formattedDate = product.createdAt
    ? new Date(product.createdAt).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Recently cataloged";

  const handleEditSubmit = async (formData: CreateProductInput) => {
    try {
      const updated = await updateProduct(product.id, formData);
      setProduct((prev) => ({
        ...prev,
        ...updated,
        title: updated.title || prev.title,
      }));
      setIsEditing(false);
      setToastMessage(
        `Product #${product.id} updated successfully! (Simulated mutation via DummyJSON API)`
      );
    } catch (err) {
      throw err;
    }
  };

  const imagesList = Array.from(
    new Set([product.thumbnail, ...(product.images || [])].filter(Boolean))
  ) as string[];

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-emerald-600 p-4 text-sm font-medium text-white shadow-md">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-white/80 hover:text-white cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Navigation breadcrumb / Back button */}
      <div className="flex items-center justify-between">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Product Inventory
        </Link>

        <EditProductButton
          product={product}
          onEdit={() => setIsEditing(true)}
          size="md"
          variant="outline"
          className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
        >
          Edit Product
        </EditProductButton>
      </div>

      {/* Main Product Card */}
      <Card className="p-6 sm:p-8 space-y-8 shadow-sm">
        {/* Top Header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between border-b border-slate-100 pb-8">
          {/* Images preview gallery */}
          <div className="w-full lg:w-80 shrink-0 space-y-3">
            <div className="relative flex h-64 w-full items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-4">
              {activeImage ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={activeImage}
                  alt={productTitle}
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <span className="text-sm font-semibold text-slate-400">No Image</span>
              )}

              {product.rating !== undefined && product.rating > 0 && (
                <div className="absolute top-3 right-3 flex items-center gap-1 rounded-lg bg-white/95 px-2.5 py-1 text-xs font-bold text-amber-600 shadow-xs">
                  <span>★</span>
                  <span>{Number(product.rating).toFixed(1)}</span>
                </div>
              )}
            </div>

            {imagesList.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {imagesList.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border p-1 transition-all cursor-pointer ${
                      activeImage === img
                        ? "border-indigo-600 ring-2 ring-indigo-200"
                        : "border-slate-200 hover:border-slate-300 opacity-75 hover:opacity-100"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={`${productTitle} thumbnail ${idx + 1}`}
                      className="h-full w-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details header */}
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-700">
                {product.category?.replace(/-/g, " ")}
              </span>
              <Badge stock={product.stock} />
              {product.brand && (
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                  Brand: {product.brand}
                </span>
              )}
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              {productTitle}
            </h1>

            <p className="text-xs text-slate-400">
              SKU: <span className="font-mono font-medium text-slate-600">#{product.sku || product.id}</span>
              {product.meta?.barcode && (
                <span className="ml-3 font-mono">Barcode: {product.meta.barcode}</span>
              )}
            </p>

            <div className="mt-4 pt-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Unit Price (USD)
              </p>
              <p className="text-3xl font-extrabold text-indigo-600">
                {formatPrice(product.price)}
              </p>
            </div>

            {product.description && (
              <div className="pt-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Description
                </p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}
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
              Registered in DummyJSON catalog
            </p>
          </div>
        </div>

        {/* Additional shipping and warranty specs if present */}
        {(product.shippingInformation ||
          product.warrantyInformation ||
          product.returnPolicy) && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 border-t border-slate-100 pt-6 text-xs text-slate-600">
            {product.shippingInformation && (
              <div className="rounded-xl border border-slate-100 p-3 bg-white">
                <span className="font-semibold text-slate-800 block">Shipping:</span>
                {product.shippingInformation}
              </div>
            )}
            {product.warrantyInformation && (
              <div className="rounded-xl border border-slate-100 p-3 bg-white">
                <span className="font-semibold text-slate-800 block">Warranty:</span>
                {product.warrantyInformation}
              </div>
            )}
            {product.returnPolicy && (
              <div className="rounded-xl border border-slate-100 p-3 bg-white">
                <span className="font-semibold text-slate-800 block">Return Policy:</span>
                {product.returnPolicy}
              </div>
            )}
          </div>
        )}

        {/* Actions bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-6">
          <Link href="/products">
            <Button variant="secondary" size="md">
              &larr; Back to Inventory
            </Button>
          </Link>

          <div className="flex items-center gap-3">
            <EditProductButton
              product={product}
              onEdit={() => setIsEditing(true)}
              size="md"
              variant="outline"
            >
              Edit Product
            </EditProductButton>
            <Link href="/products/new">
              <Button variant="primary" size="md">
                + Create Another Product
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Edit Product Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsEditing(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 cursor-pointer p-1 rounded-lg hover:bg-slate-100"
              aria-label="Close dialog"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <ProductForm
              key={`edit-detail-${product.id}`}
              initialData={product}
              onSubmit={handleEditSubmit}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
