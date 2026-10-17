import React from "react";
import type { Metadata } from "next";
import NewProductClient from "./NewProductClient";

/**
 * Route metadata
 */
export const metadata: Metadata = {
  title: "New Product | ShopDesk",
  description: "Create and catalog a new product in your ShopDesk store using DummyJSON API.",
};

/**
 * New Product Page (Server Component)
 */
export default function NewProductPage() {
  return <NewProductClient />;
}
