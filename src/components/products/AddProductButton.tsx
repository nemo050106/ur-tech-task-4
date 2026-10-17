"use client";

import React from "react";
import Link from "next/link";
import Button, { ButtonSize, ButtonVariant } from "@/components/ui/Button";

export interface AddProductButtonProps {
  onClick?: () => void;
  className?: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
  children?: React.ReactNode;
}

export default function AddProductButton({
  onClick,
  className = "",
  size = "md",
  variant = "primary",
  children = "Add Product",
}: AddProductButtonProps) {
  const buttonContent = (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      className={`shadow-xs ${className}`}
      icon={
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      }
    >
      {children}
    </Button>
  );

  if (onClick) {
    return buttonContent;
  }

  return <Link href="/products/new">{buttonContent}</Link>;
}
