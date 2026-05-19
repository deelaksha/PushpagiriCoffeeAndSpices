"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag, Leaf } from "lucide-react";
import { BRAND } from "@/constants";

export default function HeroSection() {
  return (
    <section
      className="relative min-h-[92vh] flex items-center overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #3A5A40 0%, #2d4631 40%, #4a7c59 100%)",
      }}
    >
      {/* Animated leaf pattern overlay */}
      <div className="absolute inset-0 bg-leaf-pattern opacity-20" />

      {/* Ambient circles */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand-green-light rounded-full blur-[120px] opacity-20 animate-float" />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-brand-brown rounded-full blur-[80px] opacity-15" />

      <div className="container-custom relative z-10 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* ── Left Content ─────────────────────── */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6"
            >
              <Leaf className="w-4 h-4 text-brand-green-light" />
              <span className="font-inter text-sm text-brand-green-light font-medium">
                Organic · Single Estate · Coorg, Karnataka
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-playfair text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
            >
              From Our Hills
              <span className="block text-brand-green-light">To Your Cup</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-inter text-lg text-white/80 mb-10 max-w-lg leading-relaxed"
            >
              Premium single-origin Arabica & Robusta coffee, hand-picked black pepper,
              aromatic cardamom, and authentic Coorg spices — all grown on our family
              estate at Pushpagiri, Choudlu.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Button size="lg" variant="gold" asChild>
                <Link href="/shop?category=coffee">
                  <ShoppingBag className="w-5 h-5" />
                  Shop Coffee
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-brand-green-dark" asChild>
                <Link href="/shop?category=spices">
                  Shop Spices
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="whatsapp" asChild>
                <a href={`https://wa.me/${BRAND.whatsapp}`} target="_blank" rel="noopener noreferrer">
                  Wholesale Inquiry
                </a>
              </Button>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-6 mt-12"
            >
              {[
                { label: "100% Organic", icon: "🌿" },
                { label: "4.9★ Rating", icon: "⭐" },
                { label: "500+ Orders", icon: "📦" },
                { label: "Direct Farm", icon: "🏡" },
              ].map((badge) => (
                <div key={badge.label} className="flex items-center gap-2">
                  <span className="text-xl">{badge.icon}</span>
                  <span className="font-inter text-sm text-white/70 font-medium">{badge.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Right: Visual Card ─────────────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="hidden lg:flex justify-center items-center"
          >
            <div className="relative">
              {/* Main card */}
              <div className="w-80 h-80 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-8xl mb-4">☕</div>
                  <h2 className="font-playfair text-2xl font-bold text-white">Pushpagiri</h2>
                  <p className="font-inter text-sm text-brand-green-light">Coffee & Spice</p>
                </div>
              </div>
              {/* Floating tags */}
              {[
                { emoji: "🫘", label: "Arabica", pos: "-top-6 -left-6" },
                { emoji: "🌶️", label: "Spices", pos: "-bottom-6 -right-6" },
                { emoji: "🏔️", label: "Coorg Hills", pos: "-top-6 -right-6" },
                { emoji: "🤝", label: "Farm Direct", pos: "-bottom-6 -left-6" },
              ].map((tag) => (
                <motion.div
                  key={tag.label}
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 3, delay: Math.random() * 2 }}
                  className={`absolute ${tag.pos} bg-white rounded-2xl px-4 py-2 shadow-lg flex items-center gap-2`}
                >
                  <span className="text-xl">{tag.emoji}</span>
                  <span className="font-inter text-xs font-semibold text-brand-green-dark">{tag.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-inter text-xs text-white/50">Scroll to explore</span>
        <div className="w-px h-12 bg-white/30" />
      </motion.div>
    </section>
  );
}
