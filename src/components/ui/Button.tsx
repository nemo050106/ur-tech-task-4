"use client";

import React from "react";

export type ButtonVariant = "primary" | "secondary" | "danger" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  icon,
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      "bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 focus-visible:ring-indigo-500 shadow-xs border border-transparent",
    secondary:
      "bg-slate-100 text-slate-800 hover:bg-slate-200 active:bg-slate-300 focus-visible:ring-slate-400 border border-slate-200",
    danger:
      "bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 focus-visible:ring-rose-500 shadow-xs border border-transparent",
    outline:
      "bg-transparent text-slate-700 hover:bg-slate-100 active:bg-slate-200 focus-visible:ring-slate-400 border border-slate-300",
    ghost:
      "bg-transparent text-slate-600 hover:bg-slate-100 active:bg-slate-200 focus-visible:ring-slate-400 border border-transparent",
  };

  const sizeStyles: Record<ButtonSize, string> = {
    sm: "px-3 py-1.5 text-xs font-medium gap-1.5 rounded-lg",
    md: "px-4 py-2 text-sm font-medium gap-2 rounded-xl",
    lg: "px-5 py-2.5 text-base font-semibold gap-2.5 rounded-xl",
  };

  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={loading}
      className={`inline-flex items-center justify-center font-medium transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 select-none ${
        variantStyles[variant]
      } ${sizeStyles[size]} ${
        isDisabled ? "cursor-not-allowed opacity-60 pointer-events-none" : "cursor-pointer"
      } ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin h-4 w-4 shrink-0 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && <span className="shrink-0">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}

export { Button };
