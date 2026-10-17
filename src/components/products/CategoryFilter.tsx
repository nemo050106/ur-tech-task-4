"use client";

import React from "react";
import Select from "@/components/ui/Select";

export interface CategoryFilterProps {
  category: string;
  setCategory: (value: string) => void;
  categories: string[];
}

export default function CategoryFilter({
  category,
  setCategory,
  categories,
}: CategoryFilterProps) {
  const options = [
    { label: "All Categories", value: "all" },
    ...categories.map((c) => ({
      label: c.charAt(0).toUpperCase() + c.slice(1).replace(/-/g, " "),
      value: c,
    })),
  ];

  return (
    <Select
      value={category}
      onChange={setCategory}
      options={options}
    />
  );
}
