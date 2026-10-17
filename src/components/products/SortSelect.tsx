"use client";

import React from "react";
import Select from "@/components/ui/Select";

export interface SortSelectProps {
  sort: string;
  setSort: (value: string) => void;
}

export default function SortSelect({ sort, setSort }: SortSelectProps) {
  const options = [
    { label: "Title: A to Z", value: "name-asc" },
    { label: "Title: Z to A", value: "name-desc" },
    { label: "Price: Low to High", value: "price-asc" },
    { label: "Price: High to Low", value: "price-desc" },
    { label: "Highest Rated", value: "rating-desc" },
    { label: "In Stock First", value: "stock-desc" },
    { label: "Newest First", value: "date-desc" },
    { label: "Oldest First", value: "date-asc" },
  ];

  return (
    <Select
      value={sort}
      onChange={setSort}
      options={options}
    />
  );
}
