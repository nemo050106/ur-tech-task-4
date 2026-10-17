"use client";

import React from "react";
import Button, { ButtonSize, ButtonVariant } from "@/components/ui/Button";
import { Product } from "@/types/product";

export interface EditProductButtonProps {
  product: Product;
  onEdit: (product: Product) => void;
  size?: ButtonSize;
  variant?: ButtonVariant;
  className?: string;
  children?: React.ReactNode;
}

export default function EditProductButton({
  product,
  onEdit,
  size = "sm",
  variant = "outline",
  className = "",
  children = "Edit",
}: EditProductButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      onClick={() => onEdit(product)}
      className={`shrink-0 ${className}`}
      icon={
        <svg
          className="h-3.5 w-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      }
    >
      {children}
    </Button>
  );
}
