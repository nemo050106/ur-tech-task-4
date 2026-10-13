import React from "react";
import AppShell from "@/components/layout/AppShell";
import ProductList from "@/components/Products/ProductList";
import productsData from "@/data/product.json";
import { Product } from "@/types/Product";

export const metadata = {
  title: "Products | ShopDesk Inventory",
  description: "Browse, search, filter and sort ShopDesk catalog items.",
};

export default function ProductsPage() {
  const products = productsData as Product[];

  return (
    <AppShell title="Products">
      <div className="space-y-6">
        {/* Page Subtitle & Action Bar */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Product Inventory
            </h2>
            <p className="text-xs text-slate-500 sm:text-sm">
              Manage, search, filter, and review catalog items with real-time stock statuses.
            </p>
          </div>
        </div>

        {/* Product List with Toolbar & Responsive Grid */}
        <ProductList products={products} />
      </div>
    </AppShell>
  );
}
