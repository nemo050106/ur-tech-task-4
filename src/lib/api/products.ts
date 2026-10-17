import {
  Product,
  CreateProductInput,
  UpdateProductInput,
  ProductsResponse,
  ProductsQueryOptions,
} from "@/types/product";
import { normalizeProduct } from "@/lib/product";

/**
 * Returns the configured base API URL without trailing slash
 */
export function getApiBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (envUrl && envUrl.trim().length > 0) {
    return envUrl.trim().replace(/\/+$/, "");
  }
  return "https://dummyjson.com";
}

/**
 * Fetches products from DummyJSON API with optional pagination, search, or category filter.
 * Defaults to fetching all products (limit: 0) to support rich client-side search, filtering, and sorting.
 */
export async function getProducts(
  options: ProductsQueryOptions = {}
): Promise<ProductsResponse> {
  const baseUrl = getApiBaseUrl();
  const limit = options.limit !== undefined ? options.limit : 0;
  const skip = options.skip !== undefined ? options.skip : 0;

  let url: string;

  if (options.search && options.search.trim()) {
    url = `${baseUrl}/products/search?q=${encodeURIComponent(
      options.search.trim()
    )}&limit=${limit}&skip=${skip}`;
  } else if (options.category && options.category !== "all") {
    url = `${baseUrl}/products/category/${encodeURIComponent(
      options.category
    )}?limit=${limit}&skip=${skip}`;
  } else {
    url = `${baseUrl}/products?limit=${limit}&skip=${skip}`;
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Revalidate or cache config can be specified if needed
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch products: ${response.status} ${response.statusText}`
      );
    }

    const data: unknown = await response.json();

    if (
      typeof data === "object" &&
      data !== null &&
      "products" in data &&
      Array.isArray((data as { products: unknown[] }).products)
    ) {
      const typedData = data as {
        products: Array<Partial<Product>>;
        total?: number;
        skip?: number;
        limit?: number;
      };

      const normalizedProducts = typedData.products.map((item) =>
        normalizeProduct(item)
      );

      return {
        products: normalizedProducts,
        total: typedData.total ?? normalizedProducts.length,
        skip: typedData.skip ?? skip,
        limit: typedData.limit ?? limit,
      };
    }

    throw new Error("Invalid response format received from products API");
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred while fetching products");
  }
}

/**
 * Fetches a single product by ID from DummyJSON API
 */
export async function getProduct(id: number | string): Promise<Product> {
  const baseUrl = getApiBaseUrl();
  const numericId = Number(id);

  if (isNaN(numericId) || numericId <= 0) {
    throw new Error(`Invalid product ID: ${id}`);
  }

  const url = `${baseUrl}/products/${numericId}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch product #${id}: ${response.status} ${response.statusText}`
      );
    }

    const data = (await response.json()) as Partial<Product>;
    return normalizeProduct(data);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`An unexpected network error occurred while fetching product #${id}`);
  }
}

/**
 * Fetches the list of product categories from DummyJSON
 */
export async function getProductCategories(): Promise<string[]> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}/products/category-list`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch categories: ${response.status} ${response.statusText}`
      );
    }

    const data: unknown = await response.json();
    if (Array.isArray(data)) {
      return data.filter((item): item is string => typeof item === "string");
    }

    return [];
  } catch (error) {
    console.error("Error fetching product categories:", error);
    return [];
  }
}

/**
 * Adds a new product via POST /products/add
 * Note: DummyJSON simulates adding a product and returns the created product with a new ID.
 */
export async function addProduct(
  productData: CreateProductInput
): Promise<Product> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}/products/add`;

  // Validation before sending
  if (!productData.title || !productData.title.trim()) {
    throw new Error("Product title is required.");
  }
  if (productData.price === undefined || isNaN(productData.price) || productData.price < 0) {
    throw new Error("Product price must be a valid non-negative number.");
  }
  if (productData.stock === undefined || isNaN(productData.stock) || productData.stock < 0) {
    throw new Error("Product stock must be a valid non-negative integer.");
  }

  const payload = {
    title: productData.title.trim(),
    price: Number(productData.price),
    stock: Math.floor(Number(productData.stock)),
    category: productData.category?.trim() || "General",
    description: productData.description?.trim() || "",
    brand: productData.brand?.trim() || undefined,
    thumbnail: productData.thumbnail?.trim() || undefined,
    images: productData.images && productData.images.length > 0 ? productData.images : undefined,
    rating: productData.rating !== undefined ? Number(productData.rating) : 4.5,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to add product: ${response.status} ${response.statusText}`
      );
    }

    const created = (await response.json()) as Partial<Product>;
    return normalizeProduct({
      ...payload,
      ...created,
      // If DummyJSON did not return images/thumbnail, fallback to what was submitted
      thumbnail: created.thumbnail || payload.thumbnail,
      images: created.images || payload.images,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred while adding the product.");
  }
}

/**
 * Updates an existing product via PATCH /products/{id}
 * Note: DummyJSON simulates updating a product and returns the updated product.
 */
export async function updateProduct(
  id: number | string,
  productData: UpdateProductInput
): Promise<Product> {
  const baseUrl = getApiBaseUrl();
  const numericId = Number(id);

  if (isNaN(numericId) || numericId <= 0) {
    throw new Error(`Invalid product ID: ${id}`);
  }

  const url = `${baseUrl}/products/${numericId}`;

  const payload: Record<string, unknown> = {};

  if (productData.title !== undefined) {
    if (!productData.title.trim()) {
      throw new Error("Product title cannot be empty.");
    }
    payload.title = productData.title.trim();
  }
  if (productData.price !== undefined) {
    const p = Number(productData.price);
    if (isNaN(p) || p < 0) {
      throw new Error("Product price must be a valid non-negative number.");
    }
    payload.price = p;
  }
  if (productData.stock !== undefined) {
    const s = Number(productData.stock);
    if (isNaN(s) || s < 0) {
      throw new Error("Product stock must be a valid non-negative integer.");
    }
    payload.stock = Math.floor(s);
  }
  if (productData.category !== undefined) {
    payload.category = productData.category.trim();
  }
  if (productData.description !== undefined) {
    payload.description = productData.description.trim();
  }
  if (productData.brand !== undefined) {
    payload.brand = productData.brand.trim();
  }
  if (productData.thumbnail !== undefined) {
    payload.thumbnail = productData.thumbnail.trim();
  }

  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to update product #${id}: ${response.status} ${response.statusText}`
      );
    }

    const updated = (await response.json()) as Partial<Product>;
    return normalizeProduct(updated);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`An unexpected error occurred while updating product #${id}.`);
  }
}
