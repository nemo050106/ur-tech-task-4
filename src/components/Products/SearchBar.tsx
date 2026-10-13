"use client";

import React from "react";
import Input from "@/components/ui/Input";

export interface SearchBarProps {
  search: string;
  setSearch: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  search,
  setSearch,
  placeholder = "Search by name or category...",
}: SearchBarProps) {
  return (
    <Input
      value={search}
      onChange={setSearch}
      placeholder={placeholder}
      clearable
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
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      }
    />
  );
}
