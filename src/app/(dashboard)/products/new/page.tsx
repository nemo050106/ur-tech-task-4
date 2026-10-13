import React from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { productCategories } from "@/lib/product";

/**
 * Route metadata
 * Requirement 4: Each page sets its own title with metadata / generateMetadata.
 */
export const metadata = {
  title: "New Product | ShopDesk",
  description: "Create and catalog a new product in your ShopDesk store.",
};

/**
 * New Product Page (Server Component placeholder)
 * 
 * Requirement 5: Pages and layouts stay Server Components.
 */
export default function NewProductPage() {
  const categoryOptions = productCategories.map((c) => ({
    label: c,
    value: c,
  }));

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
          Register a new inventory item in your ShopDesk catalog.
        </p>
      </div>

      {/* Product Creation Form Card */}
      <Card className="p-6 sm:p-8 space-y-6 shadow-sm">
        <form className="space-y-5">
          <Input
            label="Product Name"
            placeholder="e.g. Ergonomic Bluetooth Mouse"
            required
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="Product Category"
              options={categoryOptions}
              placeholder="Select a category"
              defaultValue="Electronics"
            />

            <Input
              label="Unit Price (INR)"
              type="number"
              step="0.01"
              placeholder="99.99"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Initial Stock Quantity"
              type="number"
              placeholder="50"
              required
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Product Status
              </label>
              <div className="flex h-10 items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                  <input type="radio" name="isActive" defaultChecked className="text-indigo-600" />
                  <span>Active immediately</span>
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                  <input type="radio" name="isActive" className="text-indigo-600" />
                  <span>Draft</span>
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Product Description / Notes
            </label>
            <textarea
              rows={3}
              placeholder="Provide inventory details or specs..."
              className="w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
            <Link href="/products">
              <Button variant="secondary" size="md">
                Cancel
              </Button>
            </Link>
            <Link href="/products">
              <Button variant="primary" size="md">
                Save &amp; Catalog Product
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
