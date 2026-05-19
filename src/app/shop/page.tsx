"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, Grid3X3, List, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/shop/ProductCard";
import { PRODUCTS } from "@/constants";
import { ProductCategory } from "@/types";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { value: "all", label: "All Products" },
  { value: "coffee", label: "☕ Coffee" },
  { value: "spices", label: "🌶️ Spices" },
  { value: "premium-blends", label: "🎁 Premium Blends" },
  { value: "wholesale-packs", label: "📦 Wholesale Packs" },
];

const SORT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Best Rated" },
  { value: "popular", label: "Most Popular" },
];

export default function ShopPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ProductCategory | "all">("all");
  const [sort, setSort] = useState("default");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [organicOnly, setOrganicOnly] = useState(false);

  const filtered = useMemo(() => {
    let result = [...PRODUCTS];
    if (category !== "all") result = result.filter((p) => p.category === category);
    if (organicOnly) result = result.filter((p) => p.isOrganic);
    if (search) result = result.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    );
    switch (sort) {
      case "price-asc": result.sort((a, b) => a.price - b.price); break;
      case "price-desc": result.sort((a, b) => b.price - a.price); break;
      case "rating": result.sort((a, b) => b.rating - a.rating); break;
      case "popular": result.sort((a, b) => b.reviewCount - a.reviewCount); break;
    }
    return result;
  }, [search, category, sort, organicOnly]);

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Page Header */}
      <div className="bg-brand-green-dark text-white py-16">
        <div className="container-custom text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-playfair text-4xl lg:text-5xl font-bold mb-3"
          >
            Our Products
          </motion.h1>
          <p className="font-inter text-white/70 text-lg">
            Premium organic coffee & spices from our Coorg estate
          </p>
        </div>
      </div>

      <div className="container-custom py-10">
        {/* Filters Bar */}
        <div className="bg-white rounded-2xl shadow-card p-4 mb-8 flex flex-wrap gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-11 rounded-xl border border-input bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-dark"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          {/* Organic toggle */}
          <button
            onClick={() => setOrganicOnly(!organicOnly)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all",
              organicOnly
                ? "bg-brand-green-dark text-white border-brand-green-dark"
                : "border-input text-muted-foreground hover:border-brand-green-dark"
            )}
          >
            🌿 Organic Only
          </button>

          {/* View toggle */}
          <div className="flex items-center gap-1 ml-auto">
            <button onClick={() => setView("grid")} className={cn("p-2 rounded-lg", view === "grid" ? "bg-brand-green-dark text-white" : "text-muted-foreground hover:bg-muted")}>
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button onClick={() => setView("list")} className={cn("p-2 rounded-lg", view === "list" ? "bg-brand-green-dark text-white" : "text-muted-foreground hover:bg-muted")}>
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value as ProductCategory | "all")}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                category === cat.value
                  ? "bg-brand-green-dark text-white shadow-soft"
                  : "bg-white text-foreground hover:bg-brand-green-light/30 border border-border"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="font-inter text-sm text-muted-foreground mb-6">
          Showing <strong>{filtered.length}</strong> products
          {category !== "all" && ` in ${CATEGORIES.find(c => c.value === category)?.label}`}
        </p>

        {/* Products */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="font-playfair text-2xl font-bold text-brand-green-dark mb-2">No products found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your search or filters.</p>
            <Button onClick={() => { setSearch(""); setCategory("all"); setOrganicOnly(false); }}>
              Clear Filters
            </Button>
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} variant="list" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
