"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import ProductForm from "@/components/products/ProductForm";
import { CreateProductInput } from "@/types/product";
import { addProduct } from "@/lib/api/products";

export default function NewProductClient() {
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleCreate = async (formData: CreateProductInput) => {
    try {
      const created = await addProduct(formData);
      setSuccessMessage(
        `Product "${created.title}" successfully created! (Simulated mutation via DummyJSON API). Redirecting to products...`
      );
      setTimeout(() => {
        router.push("/products");
      }, 1500);
    } catch (err) {
      throw err;
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Breadcrumb Navigation */}
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

      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          Add New Product
        </h2>
        <p className="text-xs text-slate-500 sm:text-sm">
          Register a new inventory item in your ShopDesk catalog using DummyJSON API.
        </p>
      </div>

      {successMessage && (
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-600 p-4 text-sm font-medium text-white shadow-md">
          <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>{successMessage}</span>
        </div>
      )}

      {/* Product Creation Form Card */}
      <Card className="p-6 sm:p-8 shadow-sm">
        <ProductForm
          onSubmit={handleCreate}
          onCancel={() => router.push("/products")}
        />
      </Card>
    </div>
  );
}
