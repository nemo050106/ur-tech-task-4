export type ProductCategory =
  | "Electronics"
  | "Furniture"
  | "Home & Kitchen"
  | "Apparel"
  | "Footwear"
  | "Accessories"
  | "Sports & Outdoors"
  | "Health & Personal Care";

export type Product = {
  id: number;
  name: string;
  category: ProductCategory;
  price: number;
  stock: number;
  isActive: boolean;
  createdAt: string;
};

export type CreateProductInput = Omit<Product, "id" | "createdAt">;

export type UpdateProductInput = Partial<Product>;