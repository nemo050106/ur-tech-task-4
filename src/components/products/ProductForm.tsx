"use client";

import React, { useState } from "react";
import { Product, CreateProductInput } from "@/types/product";
import { productCategories } from "@/lib/product";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

export interface ProductFormProps {
  initialData?: Product | null;
  onSubmit: (data: CreateProductInput) => Promise<void> | void;
  onCancel: () => void;
  isLoading?: boolean;
  categories?: string[];
  title?: string;
}

interface FormErrors {
  title?: string;
  price?: string;
  stock?: string;
  category?: string;
  general?: string;
}

export default function ProductForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  categories = productCategories,
  title: customTitle,
}: ProductFormProps) {
  const isEditMode = Boolean(initialData && initialData.id);

  const [title, setTitle] = useState(
    initialData?.title || initialData?.name || ""
  );
  const [category, setCategory] = useState(
    initialData?.category || (categories[0] ?? "beauty")
  );
  const [price, setPrice] = useState<string>(
    initialData?.price !== undefined ? String(initialData.price) : ""
  );
  const [stock, setStock] = useState<string>(
    initialData?.stock !== undefined ? String(initialData.stock) : ""
  );
  const [brand, setBrand] = useState(initialData?.brand || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [thumbnail, setThumbnail] = useState(initialData?.thumbnail || "");

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!title.trim()) {
      newErrors.title = "Product title is required.";
    }

    if (!price.trim()) {
      newErrors.price = "Price is required.";
    } else {
      const numPrice = Number(price);
      if (isNaN(numPrice) || numPrice < 0) {
        newErrors.price = "Price must be a valid non-negative number.";
      }
    }

    if (!stock.trim()) {
      newErrors.stock = "Stock quantity is required.";
    } else {
      const numStock = Number(stock);
      if (isNaN(numStock) || numStock < 0 || !Number.isInteger(numStock)) {
        newErrors.stock = "Stock must be a valid non-negative whole number.";
      }
    }

    if (!category.trim()) {
      newErrors.category = "Category is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (isSubmitting || isLoading) return;

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: CreateProductInput = {
        title: title.trim(),
        category: category.trim(),
        price: Number(Number(price).toFixed(2)),
        stock: Math.floor(Number(stock)),
        brand: brand.trim() || undefined,
        description: description.trim() || undefined,
        thumbnail: thumbnail.trim() || undefined,
        images: thumbnail.trim() ? [thumbnail.trim()] : undefined,
      };

      await onSubmit(payload);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while saving the product.";
      setServerError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryOptions = Array.from(
    new Set([...categories, category].filter(Boolean))
  ).map((cat) => ({
    label: cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, " "),
    value: cat,
  }));

  const heading =
    customTitle ||
    (isEditMode ? `Edit Product #${initialData?.id}` : "Add New Product");

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Form header */}
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-lg font-bold text-slate-900">{heading}</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          {isEditMode
            ? "Update the details below. Mutations are simulated via DummyJSON API."
            : "Register a new catalog item. Mutation is simulated via DummyJSON API."}
        </p>
      </div>

      {/* Global Server Error Banner */}
      {serverError && (
        <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-800">
          <svg
            className="h-4 w-4 shrink-0 text-rose-600 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div className="flex-1">
            <span className="font-semibold">Request Failed: </span>
            {serverError}
          </div>
        </div>
      )}

      {/* Product Title */}
      <Input
        label="Product Title *"
        placeholder="e.g. Wireless Noise-Canceling Headphones"
        value={title}
        onChange={(val: string) => {
          setTitle(val);
          if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
        }}
        error={errors.title}
        disabled={isSubmitting || isLoading}
        required
      />

      {/* Category & Brand row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select
          label="Category *"
          value={category}
          onChange={(val: string) => {
            setCategory(val);
            if (errors.category)
              setErrors((prev) => ({ ...prev, category: undefined }));
          }}
          options={categoryOptions}
          error={errors.category}
          disabled={isSubmitting || isLoading}
        />

        <Input
          label="Brand"
          placeholder="e.g. Sony, Apple, Nike"
          value={brand}
          onChange={setBrand}
          disabled={isSubmitting || isLoading}
        />
      </div>

      {/* Price & Stock row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Price (USD) *"
          type="number"
          step="0.01"
          min="0"
          placeholder="29.99"
          value={price}
          onChange={(val: string) => {
            setPrice(val);
            if (errors.price)
              setErrors((prev) => ({ ...prev, price: undefined }));
          }}
          error={errors.price}
          disabled={isSubmitting || isLoading}
          required
        />

        <Input
          label="Stock Quantity *"
          type="number"
          step="1"
          min="0"
          placeholder="50"
          value={stock}
          onChange={(val: string) => {
            setStock(val);
            if (errors.stock)
              setErrors((prev) => ({ ...prev, stock: undefined }));
          }}
          error={errors.stock}
          disabled={isSubmitting || isLoading}
          required
        />
      </div>

      {/* Thumbnail URL */}
      <Input
        label="Thumbnail Image URL"
        placeholder="https://example.com/product-image.jpg"
        value={thumbnail}
        onChange={setThumbnail}
        disabled={isSubmitting || isLoading}
      />

      {/* Description */}
      <div className="w-full space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
          Description
        </label>
        <textarea
          rows={3}
          placeholder="Provide product details, specifications, or inventory notes..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isSubmitting || isLoading}
          className="w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-900 placeholder:text-slate-400 transition-all hover:border-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50 disabled:text-slate-400"
        />
      </div>

      {/* Form Action Buttons */}
      <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
        <Button
          variant="secondary"
          size="md"
          onClick={onCancel}
          disabled={isSubmitting || isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="md"
          loading={isSubmitting || isLoading}
          disabled={isSubmitting || isLoading}
        >
          {isEditMode ? "Save Changes" : "Create Product"}
        </Button>
      </div>
    </form>
  );
}
