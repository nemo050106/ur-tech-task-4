import {
  Product,
  CreateProductInput,
  UpdateProductInput,
  ProductsResponse,
  ProductsQueryOptions,
} from "@/types/product";
import {
  normalizeProduct,
  searchProducts,
  filterByCategory,
  sortProducts,
} from "@/lib/product";
import initialProductsData from "@/data/product.json";

// Browser localStorage key for persistent product management
const STORAGE_KEY = "shopdesk_products_local";

/**
 * Returns true if code is running in the browser
 */
function isClient(): boolean {
  return typeof window !== "undefined";
}

/**
 * Loads products from localStorage.
 * If running on the server or storage is not initialized yet,
 * it falls back to the original src/data/product.json file.
 */
function loadAllProducts(): Product[] {
  if (!isClient()) {
    return (initialProductsData as unknown as Array<Partial<Product>>).map(
      normalizeProduct
    );
  }

  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (!rawData) {
      // Initialize localStorage with all original products from product.json
      const initialList = (
        initialProductsData as unknown as Array<Partial<Product>>
      ).map(normalizeProduct);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialList));
      return initialList;
    }

    const parsed: unknown = JSON.parse(rawData);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return (parsed as Array<Partial<Product>>).map(normalizeProduct);
    }

    // If storage is an empty array (user deleted all products)
    if (Array.isArray(parsed)) {
      return [];
    }

    return (initialProductsData as unknown as Array<Partial<Product>>).map(
      normalizeProduct
    );
  } catch (error) {
    console.error("Error reading products from localStorage:", error);
    return (initialProductsData as unknown as Array<Partial<Product>>).map(
      normalizeProduct
    );
  }
}

/**
 * Saves the product list back to localStorage
 */
function saveAllProducts(products: Product[]): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    window.dispatchEvent(new Event("products-updated"));
  } catch (error) {
    console.error("Failed to save products to localStorage:", error);
  }
}

/**
 * Fetches products from localStorage with search, category filtering, and sorting
 */
export async function getProducts(
  options: ProductsQueryOptions = {}
): Promise<ProductsResponse> {
  let products = loadAllProducts();

  // Search filter
  if (options.search && options.search.trim()) {
    products = searchProducts(products, options.search);
  }

  // Category filter
  if (options.category && options.category !== "all") {
    products = filterByCategory(products, options.category);
  }

  const total = products.length;

  // Sorting
  if (options.sortBy) {
    const validFields = [
      "title",
      "name",
      "price",
      "rating",
      "stock",
      "createdAt",
    ] as const;
    type VF = (typeof validFields)[number];
    const field: VF = validFields.includes(options.sortBy as VF)
      ? (options.sortBy as VF)
      : "title";
    products = sortProducts(products, field, options.order ?? "asc");
  }

  // Pagination (limit = 0 means return all)
  const skip = options.skip ?? 0;
  const limit = options.limit && options.limit > 0 ? options.limit : 0;
  const paginated = limit > 0 ? products.slice(skip, skip + limit) : products;

  return {
    products: paginated,
    total,
    skip,
    limit: limit || total,
  };
}

/**
 * Fetches a single product by ID from localStorage
 */
export async function getProduct(id: number | string): Promise<Product> {
  const products = loadAllProducts();
  const searchId = String(id);
  const found = products.find(
    (product) => String(product.id) === searchId
  );

  if (!found) {
    throw new Error(`Product #${id} not found`);
  }

  return found;
}

/**
 * Returns all unique categories present in the stored products
 */
export async function getProductCategories(): Promise<string[]> {
  const products = loadAllProducts();
  const categoriesSet = new Set(
    products.map((p) => p.category).filter(Boolean)
  );
  return Array.from(categoriesSet).sort();
}

/**
 * Adds a new product and saves it in localStorage
 */
export async function addProduct(
  productData: CreateProductInput
): Promise<Product> {
  if (!productData.title || !productData.title.trim()) {
    throw new Error("Product title is required.");
  }
  if (
    productData.price === undefined ||
    isNaN(productData.price) ||
    productData.price < 0
  ) {
    throw new Error("Product price must be a valid non-negative number.");
  }
  if (
    productData.stock === undefined ||
    isNaN(productData.stock) ||
    productData.stock < 0
  ) {
    throw new Error("Product stock must be a valid non-negative integer.");
  }

  const products = loadAllProducts();

  // Generate unique numeric ID
  const maxId = products.reduce((max, p) => {
    const num = Number(p.id);
    return !isNaN(num) && num > max ? num : max;
  }, 0);
  const newId = maxId + 1;

  const now = new Date().toISOString();
  const newProduct = normalizeProduct({
    ...productData,
    id: newId,
    title: productData.title.trim(),
    name: productData.title.trim(),
    price: Number(Number(productData.price).toFixed(2)),
    stock: Math.floor(Number(productData.stock)),
    category: productData.category?.trim() || "General",
    description: productData.description?.trim() || "",
    brand: productData.brand?.trim() || "",
    thumbnail: productData.thumbnail?.trim() || "",
    images: productData.images?.length
      ? productData.images
      : productData.thumbnail
      ? [productData.thumbnail.trim()]
      : [],
    rating:
      productData.rating !== undefined ? Number(productData.rating) : 4.5,
    createdAt: now,
    isActive: true,
  });

  saveAllProducts([newProduct, ...products]);
  return newProduct;
}

/**
 * Updates an existing product in localStorage by ID
 */
export async function updateProduct(
  id: number | string,
  productData: UpdateProductInput
): Promise<Product> {
  const products = loadAllProducts();
  const searchId = String(id);
  const index = products.findIndex(
    (product) => String(product.id) === searchId
  );

  if (index === -1) {
    throw new Error(`Product #${id} not found.`);
  }

  const existing = products[index];
  const now = new Date().toISOString();

  const updated = normalizeProduct({
    ...existing,
    ...(productData.title !== undefined
      ? { title: productData.title.trim(), name: productData.title.trim() }
      : {}),
    ...(productData.price !== undefined
      ? { price: Number(Number(productData.price).toFixed(2)) }
      : {}),
    ...(productData.stock !== undefined
      ? { stock: Math.floor(Number(productData.stock)) }
      : {}),
    ...(productData.category !== undefined
      ? { category: productData.category.trim() }
      : {}),
    ...(productData.description !== undefined
      ? { description: productData.description.trim() }
      : {}),
    ...(productData.brand !== undefined
      ? { brand: productData.brand.trim() }
      : {}),
    ...(productData.thumbnail !== undefined
      ? { thumbnail: productData.thumbnail.trim() }
      : {}),
    meta: {
      ...existing.meta,
      updatedAt: now,
    },
  });

  const updatedList = [...products];
  updatedList[index] = updated;
  saveAllProducts(updatedList);

  return updated;
}

/**
 * Deletes a product from localStorage by ID
 */
export async function deleteProduct(id: number | string): Promise<boolean> {
  const products = loadAllProducts();
  const searchId = String(id);
  const filtered = products.filter(
    (product) => String(product.id) !== searchId
  );

  saveAllProducts(filtered);
  return true;
}
