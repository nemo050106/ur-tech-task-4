"use client";

import React from "react";
import { Product, InventorySummary as InventorySummaryType } from "@/types/product";
import { getInventorySummary, formatPrice } from "@/lib/product";
import StatCard from "@/components/Dashboard/StatCard";

export interface InventorySummaryProps {
  products?: Product[];
  summary?: InventorySummaryType;
  className?: string;
  title?: string;
  subtitle?: string;
}

export default function InventorySummary({
  products,
  summary: propSummary,
  className = "",
  title = "Inventory Summary",
  subtitle = "Real-time stock valuation and catalog health",
}: InventorySummaryProps) {
  const summary = React.useMemo(() => {
    if (propSummary) return propSummary;
    if (products) return getInventorySummary(products);
    return {
      totalProducts: 0,
      activeProducts: 0,
      outOfStock: 0,
      totalStockValue: 0,
    };
  }, [products, propSummary]);

  const activeRate =
    summary.totalProducts > 0
      ? Math.round((summary.activeProducts / summary.totalProducts) * 100)
      : 0;

  return (
    <div className={`space-y-3 ${className}`}>
      {(title || subtitle) && (
        <div className="flex items-center justify-between">
          <div>
            {title && (
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-slate-400">{subtitle}</p>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* 1. Total Products */}
        <StatCard
          title="Total Products"
          value={summary.totalProducts}
          subtitle="All cataloged SKUs"
          variant="default"
          icon={
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          }
        />

        {/* 2. Active Products */}
        <StatCard
          title="Active Products"
          value={summary.activeProducts}
          subtitle={`${activeRate}% of catalog active`}
          variant="success"
          icon={
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />

        {/* 3. Out of Stock */}
        <StatCard
          title="Out of Stock"
          value={summary.outOfStock}
          subtitle={
            summary.outOfStock > 0
              ? "Requires restocking attention"
              : "All items currently in stock"
          }
          variant="danger"
          icon={
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          }
        />

        {/* 4. Total Stock Value */}
        <StatCard
          title="Total Stock Value"
          value={formatPrice(summary.totalStockValue)}
          subtitle="Asset valuation across inventory"
          variant="primary"
          icon={
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
      </div>
    </div>
  );
}
