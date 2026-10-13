"use client";

import React from "react";

export type SelectOption = string | { label: string; value: string | number };

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  value?: string | number;
  onChange?: ((value: string) => void) | React.ChangeEventHandler<HTMLSelectElement>;
  options: SelectOption[];
  label?: string;
  error?: string;
  placeholder?: string;
}

export default function Select({
  value,
  onChange,
  options,
  label,
  error,
  placeholder,
  className = "",
  disabled = false,
  id,
  ...props
}: SelectProps) {
  const generatedId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!onChange) return;
    if (typeof onChange === "function") {
      if (onChange.length === 1) {
        try {
          (onChange as (val: string) => void)(e.target.value);
        } catch {
          (onChange as React.ChangeEventHandler<HTMLSelectElement>)(e);
        }
      } else {
        (onChange as React.ChangeEventHandler<HTMLSelectElement>)(e);
      }
    }
  };

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

      <div className="relative">
        <select
          id={generatedId}
          value={value ?? ""}
          onChange={handleChange}
          disabled={disabled}
          className={`w-full appearance-none rounded-xl border bg-white py-2 pl-3.5 pr-9 text-sm text-slate-900 transition-all hover:border-slate-400 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 ${
            error
              ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200"
              : "border-slate-300 focus:border-indigo-600 focus:ring-indigo-100"
          } ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => {
            const optValue = typeof opt === "string" ? opt : opt.value;
            const optLabel = typeof opt === "string" ? opt : opt.label;
            return (
              <option key={String(optValue)} value={optValue}>
                {optLabel}
              </option>
            );
          })}
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
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
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {error && <p className="text-xs text-rose-600">{error}</p>}
    </div>
  );
}

export { Select };
