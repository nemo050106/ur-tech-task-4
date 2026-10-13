import { Product, ProductCategory } from "@/types/Product";
import localProducts from "@/data/product.json";

// search function (number 1)
export const searchProducts = (products: Product[], query: string): Product[] => {
  const searchItem = query.trim().toLowerCase();
  if (!searchItem) {
    return products;
  }

  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchItem) ||
      product.category.toLowerCase().includes(searchItem),
  );
};

// filter by category function (number 2)
export const filterByCategory = (products: Product[], category: string): Product[] => {
  const searchItem = category.trim().toLowerCase();
  if (!searchItem || searchItem === "all") {
    return products;
  }
  return products.filter(
    (product) => product.category.toLowerCase() === searchItem,
  );
};

// sorting function (number 3)
export type SortField = "name" | "price" | "createdAt";
export type SortDirection = "asc" | "desc";

export const sortProducts = (
  products: Product[],
  field: SortField,
  direction: SortDirection,
): Product[] => {
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

// summary function (Number 4)
export type InventorySummary = {
  totalProducts: number;
  activeProducts: number;
  outOfStock: number;
  totalStockValue: number;
};

export const getInventorySummary = (products: Product[] = []): InventorySummary => {
  const list = Array.isArray(products) && products.length > 0 ? products : (localProducts as Product[]);

  return list.reduce(
    (summary, product) => {
      summary.totalProducts += 1;

      if (product.isActive) {
        summary.activeProducts += 1;
      }

      if (product.stock === 0) {
        summary.outOfStock += 1;
      }

      summary.totalStockValue += (product.price || 0) * (product.stock || 0);

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
export const formatPrice = (
  amount: number,
  currency: string = "INR",
  locale: string = "en-IN",
): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(amount);
};

export const productCategories: ProductCategory[] = [
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
    (typeof product.id === "number" || typeof product.id === "string") &&
    typeof product.name === "string" &&
    typeof product.category === "string" &&
    productCategories.includes(product.category as ProductCategory) &&
    typeof product.price === "number" &&
    typeof product.stock === "number" &&
    (typeof product.isActive === "boolean" || typeof product.isActive === "undefined") &&
    typeof product.createdAt === "string"
  );
};

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch("https://dummyjson.com/products");

    if (!response.ok) {
      throw new Error(`Failed to fetch products. Status: ${response.status}`);
    }

    const data: unknown = await response.json();

    if (
      typeof data === "object" &&
      data !== null &&
      "products" in data &&
      Array.isArray(data.products)
    ) {
      const valid = data.products.filter(isProduct);
      if (valid.length > 0) return valid;
    }

    return localProducts as Product[];
  } catch {
    return localProducts as Product[];
  }
};
