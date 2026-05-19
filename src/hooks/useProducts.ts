"use client";

import { useState, useMemo } from "react";
import { Product, ProductFilters, ProductCategory } from "@/types";
import { PRODUCTS } from "@/constants";
import { useDebounce } from "./useLocalStorage";

/**
 * useProducts — Manages product filtering, sorting, and search with debouncing.
 */
export function useProducts(initialFilters: Partial<ProductFilters> = {}) {
  const [filters, setFilters] = useState<ProductFilters>({
    category: "all",
    sortBy: "newest",
    search: "",
    isOrganic: false,
    inStock: false,
    ...initialFilters,
  });

  const debouncedSearch = useDebounce(filters.search || "", 300);

  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    // Category filter
    if (filters.category && filters.category !== "all") {
      result = result.filter((p) => p.category === filters.category);
    }

    // Organic filter
    if (filters.isOrganic) {
      result = result.filter((p) => p.isOrganic);
    }

    // In-stock filter
    if (filters.inStock) {
      result = result.filter((p) => p.stock > 0);
    }

    // Price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      result = result.filter((p) => p.price >= min && p.price <= max);
    }

    // Search filter (debounced)
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.includes(q))
      );
    }

    // Sort
    switch (filters.sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "popular":
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case "newest":
      default:
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }

    return result;
  }, [filters, debouncedSearch]);

  const setCategory = (category: ProductCategory | "all") =>
    setFilters((f) => ({ ...f, category }));

  const setSearch = (search: string) =>
    setFilters((f) => ({ ...f, search }));

  const setSortBy = (sortBy: ProductFilters["sortBy"]) =>
    setFilters((f) => ({ ...f, sortBy }));

  const toggleOrganic = () =>
    setFilters((f) => ({ ...f, isOrganic: !f.isOrganic }));

  const toggleInStock = () =>
    setFilters((f) => ({ ...f, inStock: !f.inStock }));

  const resetFilters = () =>
    setFilters({ category: "all", sortBy: "newest", search: "", isOrganic: false, inStock: false });

  return {
    products: filteredProducts,
    filters,
    setCategory,
    setSearch,
    setSortBy,
    toggleOrganic,
    toggleInStock,
    resetFilters,
    totalCount: filteredProducts.length,
  };
}
