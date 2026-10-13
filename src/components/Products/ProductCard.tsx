"use client";

import React from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Product } from "@/types/Product";
import { formatPrice } from "@/lib/product";

export interface ProductCardProps {
  product: Product;
  onSelect?: (product: Product) => void;
}

export default function ProductCard({ product, onSelect }: ProductCardProps) {
  const formattedDate = new Date(product.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Card hoverable className="group flex flex-col justify-between p-5 transition-all duration-200">
      <div>
        {/* Top: Category & Stock Badge */}
        <div className="flex items-start justify-between gap-2">
          <span className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
            {product.category}
          </span>
          <Badge stock={product.stock} />
        </div>

        {/* Product Name */}
        <h3 className="mt-3 text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
          {product.name}
        </h3>

        {/* SKU & Date info */}
        <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
          <span>SKU #{product.id}</span>
          <span>Added {formattedDate}</span>
        </div>
      </div>

      {/* Bottom: Price & Stock details + Action */}
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
            <p className={`text-sm font-bold ${
              product.stock === 0
                ? "text-rose-600"
                : product.stock <= 5
                ? "text-amber-600"
                : "text-slate-700"
            }`}>
              {product.stock} units
            </p>
          </div>
        </div>

        <div className="mt-4">
          <Button
            variant={product.stock === 0 ? "secondary" : "outline"}
            size="sm"
            className="w-full"
            onClick={() => onSelect?.(product)}
          >
            {product.stock === 0 ? "Restock Request" : "Manage Product"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
