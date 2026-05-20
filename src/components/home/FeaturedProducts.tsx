"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import ProductCard from "@/components/shop/ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { getDocuments } from "@/lib/firebase/firestore";
import { Product } from "@/types/firebase";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getDocuments<Product>("products");
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch featured products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const featuredCoffee = products.filter(
    (p) => p.category === "coffee" && p.isFeatured
  ).slice(0, 3);
  const featuredSpices = products.filter(
    (p) => p.category === "spices" && p.isFeatured
  ).slice(0, 3);

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        {/* ── Featured Coffee ─────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="font-inter text-sm font-semibold text-brand-brown uppercase tracking-widest">
            Our Specialty
          </span>
          <h2 className="section-title mt-2">Premium Coffee</h2>
          <p className="section-subtitle font-inter text-muted-foreground text-lg max-w-2xl mx-auto">
            Single-origin Arabica and Robusta, roasted in small batches and
            shipped fresh from our Coorg estate.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {featuredCoffee.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        <div className="text-center mb-20">
          <Button variant="outline" asChild>
            <Link href="/shop?category=coffee">
              View All Coffee <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        {/* ── Featured Spices ─────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="font-inter text-sm font-semibold text-brand-brown uppercase tracking-widest">
            Authentic Flavors
          </span>
          <h2 className="section-title mt-2">Premium Spices</h2>
          <p className="section-subtitle font-inter text-muted-foreground text-lg max-w-2xl mx-auto">
            Black pepper, cardamom, cloves and cinnamon — grown in the shade of
            our coffee plantation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {featuredSpices.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" asChild>
            <Link href="/shop?category=spices">
              View All Spices <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
