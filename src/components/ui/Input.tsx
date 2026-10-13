"use client";

import React from "react";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value?: string | number;
  onChange?: ((value: string) => void) | React.ChangeEventHandler<HTMLInputElement>;
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  clearable?: boolean;
  onClear?: () => void;
}

export default function Input({
  value,
  onChange,
  placeholder = "Enter text...",
  label,
  error,
  icon,
  clearable = false,
  onClear,
  className = "",
  disabled = false,
  type = "text",
  id,
  ...props
}: InputProps) {
  const generatedId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onChange) return;
    if (typeof onChange === "function") {
      // Check if the handler expects standard event or just string value
      if (onChange.length === 1) {
        try {
          (onChange as (val: string) => void)(e.target.value);
        } catch {
          (onChange as React.ChangeEventHandler<HTMLInputElement>)(e);
        }
      } else {
        (onChange as React.ChangeEventHandler<HTMLInputElement>)(e);
      }
    }
  };

  const hasValue = value !== undefined && value !== null && String(value).length > 0;

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={generatedId}
          className="block text-xs font-semibold uppercase tracking-wider text-slate-600"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {icon && (
          <div className="pointer-events-none absolute left-3 flex items-center text-slate-400">
            {icon}
          </div>
        )}

        <input
          id={generatedId}
          type={type}
          value={value ?? ""}
          onChange={handleChange}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full rounded-xl border bg-white py-2 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 ${
            icon ? "pl-9" : "pl-3.5"
          } ${clearable && hasValue ? "pr-9" : "pr-3.5"} ${
            error
              ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200"
              : "border-slate-300 hover:border-slate-400 focus:border-indigo-600 focus:ring-indigo-100"
          } ${className}`}
          {...props}
        />

        {clearable && hasValue && !disabled && (
          <button
            type="button"
            onClick={onClear || (() => {
              if (onChange) {
                (onChange as (val: string) => void)("");
              }
            })}
            className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer"
            aria-label="Clear input"
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {error && <p className="text-xs text-rose-600">{error}</p>}
    </div>
  );
}

export { Input };
