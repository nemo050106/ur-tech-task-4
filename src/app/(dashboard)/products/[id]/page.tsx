import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProduct } from "@/lib/api/products";
import { Product } from "@/types/product";
import ProductDetailClient from "./ProductDetailClient";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Dynamic Metadata for Product Detail Page
 */
export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const product = await getProduct(id);
    const title = product.title || product.name || "Product";
    return {
      title: `${title} | ShopDesk`,
      description: `View details, pricing, and stock status for ${title} (${product.category}).`,
    };
  } catch {
    return {
      title: "Product Not Found | ShopDesk",
      description: "The requested product does not exist in the inventory.",
    };
  }
}

/**
 * Product Detail Page (Server Component)
 */
export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;
  const productId = Number(id);

  if (isNaN(productId) || productId <= 0) {
    notFound();
  }

  let product: Product | null = null;

  try {
    product = await getProduct(productId);
  } catch (error) {
    console.error(`Error loading product #${productId}:`, error);
  }

  if (!product) {
    notFound();
  }

  return <ProductDetailClient initialProduct={product} />;
}
