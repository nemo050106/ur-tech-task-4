// import type { Product, ProductCategory } from "../types/product"; 

import { Product, ProductCategory } from "@/types/Product";

// search function(number 1)

export const searchProducts = (products: Product[], query: string) => {
  const searchItem = query.trim().toLowerCase();

  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchItem) ||
      product.category.toLowerCase().includes(searchItem),
  );
};

// filter by category function(number 2)
export const filterByCategory = (products: Product[], category: string) => {
  const searchItem = category.trim().toLowerCase();
  if (searchItem === "all") {
    return products;
  } else
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchItem) ||
        product.category.toLowerCase().includes(searchItem),
    );
};

// sorting function(number 3)

type SortField = "name" | "price" | "createdAt";
type SortDirection = "asc" | "desc";
export const sortProducts = (
  products: Product[],
  field: SortField,
  direction: SortDirection,
) => {
  const sortedProducts = [...products];

  sortedProducts.sort((a, b) => {
    if (field === "name") {
      return direction === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }

    if (field === "price") {
      return direction === "asc" ? a.price - b.price : b.price - a.price;
    }
    if (field === "createdAt") {
      return direction === "asc"
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }

    return 0;
  });

  return sortedProducts;
};

// summury function(Number 4)

// array.reduce(callback(accumulator, currentValue, currentIndex, array), initialValue)
type InventorySummary = {
  totalProducts: number;
  activeProducts: number;
  outOfStock: number;
  totalStockValue: number;
};

export const getInventorySummary = (products: Product[]): InventorySummary => {
  return products.reduce(
    (summary, product) => {
      summary.totalProducts += 1;

      if (product.isActive) {
        summary.activeProducts += 1;
      }

      if (product.stock === 0) {
        summary.outOfStock += 1;
      }

      summary.totalStockValue += product.price * product.stock;

      return summary;
    },
    {
      totalProducts: 0,
      activeProducts: 0,
      outOfStock: 0,
      totalStockValue: 0,
    },
  );
};

// currency format function (Number 5)
// new Intl.NumberFormat(locale, options)
export const formatPrice = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

const productCategories: ProductCategory[] = [
  "Electronics",
  "Furniture",
  "Home & Kitchen",
  "Apparel",
  "Footwear",
  "Accessories",
  "Sports & Outdoors",
  "Health & Personal Care",
];

export const isProduct = (value: unknown): value is Product => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const product = value as Record<string, unknown>;

  return (
    typeof product.id === "number" &&
    typeof product.name === "string" &&
    typeof product.category === "string" &&
    productCategories.includes(product.category as ProductCategory) &&
    typeof product.price === "number" &&
    typeof product.stock === "number" &&
    typeof product.isActive === "boolean" &&
    typeof product.createdAt === "string"
  );
};

export const fetchProducts = async () => {
  try {
    const response = await fetch("https://dummyjson.com/products");

    if (!response.ok) {
      throw new Error(`Failed to fetch products. Status: ${response.status}`);
    }

    const data: unknown = await response.json();

    if (
      typeof data !== "object" ||
      data === null ||
      !("products" in data) ||
      !Array.isArray(data.products)
    ) {
      throw new Error("Invalid products data");
    }

    return data.products.filter(isProduct);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Unable to load products");
  }
};