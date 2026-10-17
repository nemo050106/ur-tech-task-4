import {
  Product,
  ProductCategory,
  InventorySummary,
  SortField,
  SortDirection,
} from "@/types/product";

/**
 * Normalizes any product object (from DummyJSON or legacy format) into a consistent Product.
 * Maps legacy 'name' to 'title', provides backwards-compatible accessors,
 * and ensures all numeric fields are safe numbers.
 */
export function normalizeProduct(
  raw: Partial<Product> & { name?: string; title?: string }
): Product {
  const title = (raw.title || raw.name || "Untitled Product").trim();
  const name = title;
  const stock = typeof raw.stock === "number" ? raw.stock : Number(raw.stock) || 0;
  const price = typeof raw.price === "number" ? raw.price : Number(raw.price) || 0;
  const rating = typeof raw.rating === "number" ? raw.rating : Number(raw.rating) || 0;

  const thumbnail =
    raw.thumbnail ||
    (Array.isArray(raw.images) && raw.images.length > 0 ? raw.images[0] : "");
  const images =
    Array.isArray(raw.images) && raw.images.length > 0
      ? raw.images
      : thumbnail
      ? [thumbnail]
      : [];

  const createdAt =
    raw.meta?.createdAt || raw.createdAt || new Date().toISOString();
  const isActive =
    typeof raw.isActive === "boolean" ? raw.isActive : stock > 0;

  return {
    ...raw,
    id: Number(raw.id) || 0,
    title,
    name,
    description: raw.description || "",
    category: raw.category || "General",
    price,
    stock,
    thumbnail,
    images,
    rating,
    brand: raw.brand || "",
    discountPercentage: raw.discountPercentage,
    sku: raw.sku || `SKU-${raw.id || "0"}`,
    availabilityStatus:
      raw.availabilityStatus || (stock > 0 ? "In Stock" : "Out of Stock"),
    isActive,
    createdAt,
    meta: {
      ...raw.meta,
      createdAt,
    },
  };
}

/**
 * Searches products by title/name, category, brand, or description (case-insensitive)
 */
export const searchProducts = (products: Product[], query: string): Product[] => {
  const searchItem = query.trim().toLowerCase();
  if (!searchItem) {
    return products;
  }

  return products.filter((product) => {
    const titleMatch = (product.title || product.name || "")
      .toLowerCase()
      .includes(searchItem);
    const categoryMatch = (product.category || "")
      .toLowerCase()
      .includes(searchItem);
    const brandMatch = (product.brand || "")
      .toLowerCase()
      .includes(searchItem);
    const descMatch = (product.description || "")
      .toLowerCase()
      .includes(searchItem);

    return titleMatch || categoryMatch || brandMatch || descMatch;
  });
};

/**
 * Filters products by category (case-insensitive)
 */
export const filterByCategory = (
  products: Product[],
  category: string
): Product[] => {
  const searchItem = category.trim().toLowerCase();
  if (!searchItem || searchItem === "all") {
    return products;
  }
  return products.filter(
    (product) => (product.category || "").toLowerCase() === searchItem
  );
};

/**
 * Sorts products by field and direction
 */
export const sortProducts = (
  products: Product[],
  field: SortField,
  direction: SortDirection
): Product[] => {
  const sortedProducts = [...products];

  sortedProducts.sort((a, b) => {
    if (field === "name" || field === "title") {
      const aTitle = a.title || a.name || "";
      const bTitle = b.title || b.name || "";
      return direction === "asc"
        ? aTitle.localeCompare(bTitle)
        : bTitle.localeCompare(aTitle);
    }

    if (field === "price") {
      return direction === "asc" ? a.price - b.price : b.price - a.price;
    }

    if (field === "rating") {
      const aRating = a.rating || 0;
      const bRating = b.rating || 0;
      return direction === "asc" ? aRating - bRating : bRating - aRating;
    }

    if (field === "stock") {
      return direction === "asc" ? a.stock - b.stock : b.stock - a.stock;
    }

    if (field === "createdAt") {
      const aTime = new Date(a.createdAt || 0).getTime();
      const bTime = new Date(b.createdAt || 0).getTime();
      return direction === "asc" ? aTime - bTime : bTime - aTime;
    }

    return 0;
  });

  return sortedProducts;
};

/**
 * Computes inventory statistics for the given product list
 */
export const getInventorySummary = (
  products: Product[] = []
): InventorySummary => {
  return products.reduce(
    (summary, product) => {
      summary.totalProducts += 1;

      // A product is active if isActive is true or stock > 0
      if (product.isActive ?? product.stock > 0) {
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
    }
  );
};

/**
 * Formats a currency value with default USD / US locale matching DummyJSON pricing
 */
export const formatPrice = (
  amount: number,
  currency: string = "USD",
  locale: string = "en-US"
): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0);
};

/**
 * Default categories for fallback UI
 */
export const productCategories: ProductCategory[] = [
  "beauty",
  "fragrances",
  "furniture",
  "groceries",
  "home-decoration",
  "kitchen-accessories",
  "laptops",
  "mens-shirts",
  "mens-shoes",
  "mens-watches",
  "mobile-accessories",
  "skin-care",
  "smartphones",
  "sports-accessories",
  "sunglasses",
  "tablets",
  "tops",
  "womens-bags",
  "womens-dresses",
  "womens-jewellery",
  "womens-shoes",
  "womens-watches",
];

/**
 * Type guard for Product objects
 */
export const isProduct = (value: unknown): value is Product => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const p = value as Record<string, unknown>;

  return (
    (typeof p.id === "number" || typeof p.id === "string") &&
    (typeof p.title === "string" || typeof p.name === "string") &&
    typeof p.category === "string" &&
    typeof p.price === "number" &&
    typeof p.stock === "number"
  );
};

export type { InventorySummary, SortField, SortDirection };
