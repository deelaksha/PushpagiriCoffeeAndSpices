"use client";

import { use, useState } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, ShoppingCart, MessageCircle, Check, Truck, Shield, Minus, Plus, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/shop/ProductCard";
import { useCartStore } from "@/store/cartStore";
import { PRODUCTS, BRAND } from "@/constants";
import { formatPrice, generateWhatsAppOrderUrl, getBadgeClass } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: Props) {
  const { slug } = use(params);
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) notFound();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedWeight, setSelectedWeight] = useState(product.weightOptions[0]);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();

  const related = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 3);

  const waMessage = `Hi! I'd like to order:\n\n*${product.name}* (${selectedWeight.weight}) x${quantity}\nTotal: ${formatPrice(selectedWeight.price * quantity)}\n\nPlease confirm availability and payment details.`;

  const handleAddToCart = () => {
    addItem(product, quantity, selectedWeight.weight, selectedWeight.price);
  };

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-border">
        <div className="container-custom py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-brand-green-dark">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/shop" className="hover:text-brand-green-dark">Shop</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-brand-green-dark font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* ── Image Gallery ────────────────────── */}
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={selectedImage}
              className="relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden bg-white shadow-soft mb-4"
            >
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              {product.badge && (
                <div className={cn("absolute top-4 left-4 text-xs font-semibold px-3 py-1.5 rounded-full", getBadgeClass(product.badge))}>
                  {product.badge}
                </div>
              )}
            </motion.div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={cn("relative h-20 w-20 rounded-xl overflow-hidden border-2 transition-all", i === selectedImage ? "border-brand-green-dark" : "border-transparent")}
                  >
                    <Image src={img} alt={`View ${i + 1}`} fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Product Info ─────────────────────── */}
          <div>
            <p className="font-inter text-sm text-brand-brown uppercase tracking-wider mb-2">{product.category}</p>
            <h1 className="font-playfair text-3xl lg:text-4xl font-bold text-brand-green-dark mb-3">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={cn("w-4 h-4", i < Math.floor(product.rating) ? "fill-brand-gold text-brand-gold" : "fill-muted text-muted")} />
                ))}
              </div>
              <span className="font-inter text-sm text-muted-foreground">{product.rating} ({product.reviewCount} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-playfair text-4xl font-bold text-brand-green-dark">{formatPrice(selectedWeight.price)}</span>
              {product.originalPrice && (
                <span className="text-xl text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
              )}
            </div>

            <p className="font-inter text-muted-foreground leading-relaxed mb-6">{product.shortDescription}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {product.isOrganic && <Badge variant="organic">🌿 Organic</Badge>}
              <Badge variant="secondary">📍 {product.origin}</Badge>
            </div>

            {/* Weight selector */}
            <div className="mb-6">
              <p className="font-inter text-sm font-semibold text-brand-green-dark mb-3">Select Weight</p>
              <div className="flex flex-wrap gap-3">
                {product.weightOptions.map((opt) => (
                  <button
                    key={opt.weight}
                    onClick={() => setSelectedWeight(opt)}
                    disabled={opt.stock === 0}
                    className={cn(
                      "px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all",
                      selectedWeight.weight === opt.weight
                        ? "border-brand-green-dark bg-brand-green-dark text-white"
                        : opt.stock === 0
                        ? "border-muted text-muted-foreground cursor-not-allowed opacity-50"
                        : "border-border hover:border-brand-green-dark"
                    )}
                  >
                    {opt.weight} — {formatPrice(opt.price)}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-8">
              <p className="font-inter text-sm font-semibold text-brand-green-dark">Quantity</p>
              <div className="flex items-center gap-3 bg-brand-cream rounded-xl px-4 py-2">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-brand-green-light transition-colors">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-inter font-bold text-lg w-8 text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-brand-green-light transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <p className="font-playfair font-bold text-brand-green-dark">= {formatPrice(selectedWeight.price * quantity)}</p>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-3 mb-8">
              <Button size="lg" className="flex-1" onClick={handleAddToCart}>
                <ShoppingCart className="w-5 h-5" /> Add to Cart
              </Button>
              <Button size="lg" variant="whatsapp" asChild>
                <a href={generateWhatsAppOrderUrl(BRAND.whatsapp, waMessage)} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5" /> Order on WhatsApp
                </a>
              </Button>
            </div>

            {/* Highlights */}
            <div className="bg-white rounded-2xl p-5 mb-6 shadow-card">
              <h3 className="font-playfair font-bold text-brand-green-dark mb-3">Product Highlights</h3>
              <ul className="space-y-2">
                {product.highlights.map((h) => (
                  <li key={h} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-brand-green-dark shrink-0" /> {h}
                  </li>
                ))}
              </ul>
            </div>

            {/* Shipping info */}
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Truck className="w-4 h-4 text-brand-green-dark" />
              <span>{product.shippingInfo}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-3xl p-8 shadow-card mb-12">
          <h2 className="font-playfair text-2xl font-bold text-brand-green-dark mb-4">About This Product</h2>
          <p className="font-inter text-muted-foreground leading-relaxed">{product.description}</p>
          {product.flavorNotes && (
            <div className="mt-6">
              <h3 className="font-inter font-semibold mb-3">Flavor Notes</h3>
              <div className="flex flex-wrap gap-2">
                {product.flavorNotes.map((note) => (
                  <span key={note} className="badge-green">{note}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <h2 className="font-playfair text-2xl font-bold text-brand-green-dark mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
