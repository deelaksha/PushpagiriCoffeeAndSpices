"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingCart, Star, Heart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { Product } from "@/types";
import { formatPrice, getBadgeClass, isVideoUrl } from "@/lib/utils";
import { cn } from "@/lib/utils";

// =============================================
// PRODUCT CARD PROPS
// =============================================

interface ProductCardProps {
  product: Product;
  className?: string;
  variant?: "grid" | "list";
}

// =============================================
// PRODUCT CARD COMPONENT
// =============================================

export default function ProductCard({
  product,
  className,
  variant = "grid",
}: ProductCardProps) {
  const { addItem, isInCart } = useCartStore();
  const { user, openLoginModal } = useAuthStore();
  const router = useRouter();

  const defaultVariant = product.variants?.[0] ?? { id: "", weightLabel: "", price: product.price };
  const inCart = isInCart(product.id, defaultVariant.id);


  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      openLoginModal(() => addItem(product, defaultVariant.id, defaultVariant.weightLabel, defaultVariant.price));
      return;
    }
    addItem(product, defaultVariant.id, defaultVariant.weightLabel, defaultVariant.price);
  };

  // ─── Grid Variant ─────────────────────────
  if (variant === "grid") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
        className={cn("product-card group", className)}
      >
        {/* Image Container */}
        <Link href={`/shop/${product.slug}`} className="block relative overflow-hidden">
          <div className="relative h-56 sm:h-64 bg-brand-cream">
            {product.images?.[0] ? (
              isVideoUrl(product.images[0]) ? (
                <video
                  src={product.images[0]}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              )
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                No Media
              </div>
            )}

            {/* Overlay actions */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center gap-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 flex gap-2"
              >
                <Button
                  size="icon"
                  className="w-10 h-10 bg-white text-brand-green-dark hover:bg-brand-green-dark hover:text-white shadow-md"
                  onClick={() => router.push(`/shop/${product.slug}`)}
                  aria-label="View product"
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </motion.div>
            </div>

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {product.badge && (
                <span
                  className={cn(
                    "text-xs font-semibold px-2.5 py-1 rounded-full",
                    getBadgeClass(product.badge)
                  )}
                >
                  {product.badge}
                </span>
              )}

              {product.isOrganic && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-800">
                  🌿 Organic
                </span>
              )}
            </div>

            {/* Wishlist */}
            <button
              className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-50"
              aria-label="Add to wishlist"
            >
              <Heart className="w-4 h-4 text-muted-foreground hover:text-red-500 transition-colors" />
            </button>
          </div>
        </Link>

        {/* Card Content */}
        <div className="p-5">
          {/* Category */}
          <p className="font-inter text-xs text-muted-foreground uppercase tracking-wider mb-1.5">
            {product.category.replace("-", " ")}
          </p>

          {/* Product Name */}
          <Link href={`/shop/${product.slug}`}>
            <h3 className="font-playfair text-base font-semibold text-brand-green-dark mb-2 hover:text-brand-brown transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-3 h-3",
                    i < Math.floor(product.rating)
                      ? "fill-brand-gold text-brand-gold"
                      : "fill-muted text-muted"
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              ({product.reviewCount})
            </span>
          </div>

          {/* Price + Origin */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-playfair text-xl font-bold text-brand-green-dark">
                  {formatPrice(defaultVariant.price)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {defaultVariant.weightLabel}
              </p>
            </div>

            {/* Stock Indicator */}
            <div
              className={cn(
                "text-xs font-medium px-2 py-1 rounded-full",
                product.stock > 0
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              )}
            >
              {product.stock > 0
                ? "In Stock"
                : "Out of Stock"}
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            variant={inCart ? "secondary" : "default"}
            className="w-full"
            disabled={product.stock === 0}
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart className="w-4 h-4" />
            {inCart ? "Added to Cart" : "Add to Cart"}
          </Button>
        </div>
      </motion.div>
    );
  }

  // ─── List Variant ─────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className={cn(
        "flex gap-4 bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 p-4",
        className
      )}
    >
      <Link
        href={`/shop/${product.slug}`}
        className="relative h-28 w-28 rounded-xl overflow-hidden bg-brand-cream shrink-0"
      >
        <Image
          src={product.images?.[0]}
          alt={product.name}
          fill
          className="object-cover"
          sizes="112px"
        />
      </Link>

      <div className="flex-1 min-w-0">
        <p className="font-inter text-xs text-muted-foreground uppercase tracking-wider mb-1">
          {product.category}
        </p>
        <Link href={`/shop/${product.slug}`}>
          <h3 className="font-playfair font-semibold text-brand-green-dark hover:text-brand-brown transition-colors truncate">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-bold text-brand-green-dark">
            {formatPrice(defaultVariant.price)}
          </span>
        </div>
        <Button
          size="sm"
          onClick={handleAddToCart}
          className="mt-2"
          disabled={product.stock === 0}
        >
          <ShoppingCart className="w-3 h-3" />
          Add to Cart
        </Button>
      </div>
    </motion.div>
  );
}
