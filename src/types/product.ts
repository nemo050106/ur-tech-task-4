export type ProductCategory = string;

export interface ProductReview {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface ProductDimensions {
  width: number;
  height: number;
  depth: number;
}

export interface ProductMeta {
  createdAt?: string;
  updatedAt?: string;
  barcode?: string;
  qrCode?: string;
}

/**
 * Shared Product type matching DummyJSON products API schema
 * Includes backwards-compatible aliases for name, isActive, and createdAt.
 */
export interface Product {
  id: number;
  title: string;
  description: string;
  category: ProductCategory;
  price: number;
  stock: number;
  thumbnail: string;
  images: string[];
  rating: number;
  brand?: string;
  discountPercentage?: number;
  sku?: string;
  weight?: number;
  dimensions?: ProductDimensions;
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  reviews?: ProductReview[];
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  meta?: ProductMeta;

  // Normalized adapter properties for existing ShopDesk components
  name?: string;
  isActive?: boolean;
  createdAt?: string;
}

export interface CreateProductInput {
  title: string;
  price: number;
  stock: number;
  category: string;
  description?: string;
  brand?: string;
  rating?: number;
  thumbnail?: string;
  images?: string[];
  discountPercentage?: number;
}

export type UpdateProductInput = Partial<CreateProductInput>;

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface ProductsQueryOptions {
  limit?: number;
  skip?: number;
  search?: string;
  category?: string;
  sortBy?: string;
  order?: "asc" | "desc";
}

export interface InventorySummary {
  totalProducts: number;
  activeProducts: number;
  outOfStock: number;
  totalStockValue: number;
}

export type SortField = "name" | "title" | "price" | "rating" | "stock" | "createdAt";
export type SortDirection = "asc" | "desc";
