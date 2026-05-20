// "use client"
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, ShoppingCart, MessageCircle, Check, Truck, ChevronRight, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/shop/ProductCard";
import { useCartStore } from "@/store/cartStore";
import { BRAND } from "@/constants";
import { getDocuments } from "@/lib/firebase/firestore";
import { where, limit } from "firebase/firestore"; // needed for queries
import { formatPrice, generateWhatsAppOrderUrl, getBadgeClass } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [productData, setProductData] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch product and related items
  useEffect(() => {
    if (!slug) {
      return; // slug not ready yet, skip fetch
    }

    const fetchData = async () => {
      try {
        const products = await getDocuments<any>("products", [where("slug", "==", slug), limit(1)]);
        const prod = products[0] ?? null;
        setProductData(prod);
        if (prod) {
          const relatedProducts = await getDocuments<any>("products", [where("category", "==", prod.category), limit(3)]);
          // Filter out the current product if it appears in the results
          setRelated(relatedProducts.filter(p => p.id !== prod.id).slice(0,3));
        }
      } catch (e) {
        console.error("Error fetching product", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedWeight, setSelectedWeight] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();


  useEffect(() => {
    if (productData && productData.weightOptions && productData.weightOptions.length > 0) {
      setSelectedWeight(productData.weightOptions[0]);
    }
  }, [productData]);



  const {
    images = [],
    weightOptions = [],
    name = "",
    category = "",
    rating = 0,
    reviewCount = 0,
    originalPrice,
    shortDescription = "",
    isOrganic = false,
    origin = "",
    highlights = [],
    shippingInfo = "",
    description = "",
    badge = "",
    flavorNotes = [],
  } = productData || {};

  const currentWeight = {
    weight: selectedWeight?.weight ?? productData?.weightOptions?.[0]?.weight ?? "",
    price: selectedWeight?.price ?? productData?.weightOptions?.[0]?.price ?? productData?.price ?? 0,
  };
  const waMessage = `Hi! I'd like to order:\n\n*${name}* (${currentWeight.weight}) x${quantity}\nTotal: ${formatPrice(currentWeight.price * quantity)}\n\nPlease confirm availability and payment details.`;

  const handleAddToCart = () => {
    addItem(productData, quantity, currentWeight.weight, currentWeight.price);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-cream">
        <p className="text-xl font-medium text-brand-green-dark">Loading product…</p>
      </div>
    );
  }
  if (!productData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-cream">
        <h1 className="text-2xl font-bold text-brand-green-dark">Product not found</h1>
      </div>
    );
  }
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
            <span className="text-brand-green-dark font-medium">{name}</span>
          </nav>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Image Gallery */}
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={selectedImage}
              className="relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden bg-white shadow-soft mb-4"
            >
              <Image
                src={images[selectedImage]}
                alt={name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              {badge && (
                <div className={cn("absolute top-4 left-4 text-xs font-semibold px-3 py-1.5 rounded-full", getBadgeClass(badge))}>
                  {badge}
                </div>
              )}
            </motion.div>
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img: string, i: number) => (
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

          {/* Product Info */}
          <div>
            <p className="font-inter text-sm text-brand-brown uppercase tracking-wider mb-2">{category}</p>
            <h1 className="font-playfair text-3xl lg:text-4xl font-bold text-brand-green-dark mb-3">{name}</h1>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={cn("w-4 h-4", i < Math.floor(rating) ? "fill-brand-gold text-brand-gold" : "fill-muted text-muted")} />
                ))}
              </div>
              <span className="font-inter text-sm text-muted-foreground">{rating} ({reviewCount} reviews)</span>
            </div>
            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-playfair text-4xl font-bold text-brand-green-dark">{formatPrice(currentWeight.price)}</span>
              {originalPrice && (
                <span className="text-xl text-muted-foreground line-through">{formatPrice(originalPrice)}</span>
              )}
            </div>
            <p className="font-inter text-muted-foreground leading-relaxed mb-6">{shortDescription}</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {isOrganic && <Badge variant="organic">🌿 Organic</Badge>}
              <Badge variant="secondary">📍 {origin}</Badge>
            </div>
            {/* Weight selector */}
            <div className="mb-6">
              <p className="font-inter text-sm font-semibold text-brand-green-dark mb-3">Select Weight</p>
              <div className="flex flex-wrap gap-3">
                {weightOptions.map((opt: any) => (
                  <button
                    key={opt.weight}
                    onClick={() => setSelectedWeight(opt)}
                    disabled={opt.stock === 0}
                    className={cn(
                      "px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all",
                      selectedWeight?.weight === opt.weight
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
              <p className="font-playfair font-bold text-brand-green-dark">= {formatPrice(currentWeight.price * quantity)}</p>
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
                {highlights.map((h: string) => (
                  <li key={h} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-brand-green-dark shrink-0" /> {h}
                  </li>
                ))}
              </ul>
            </div>
            {/* Shipping info */}
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Truck className="w-4 h-4 text-brand-green-dark" />
              <span>{shippingInfo}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-3xl p-8 shadow-card mb-12">
          <h2 className="font-playfair text-2xl font-bold text-brand-green-dark mb-4">About This Product</h2>
          <p className="font-inter text-muted-foreground leading-relaxed">{description}</p>
          {flavorNotes && (
            <div className="mt-6">
              <h3 className="font-inter font-semibold mb-3">Flavor Notes</h3>
              <div className="flex flex-wrap gap-2">
                {flavorNotes.map((note: string) => (
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
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
