"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function AboutSection() {
  const highlights = [
    "Family-owned estate since 1982",
    "900m altitude, misty microclimate",
    "100% organic farming practices",
    "Direct farm-to-door delivery",
  ];

  return (
    <section className="section-padding bg-brand-cream">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* ── Visual Side ───────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-soft-hover">
              <div
                className="h-80 lg:h-[500px] w-full"
                style={{
                  background:
                    "linear-gradient(135deg, #3A5A40 0%, #A8D5BA 60%, #F8F5F0 100%)",
                }}
              >
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-white">
                    <div className="text-9xl mb-4">🏡</div>
                    <p className="font-playfair text-2xl font-bold">Pushpagiri Estate</p>
                    <p className="font-inter text-sm opacity-80 mt-2">
                      Choudlu, Coorg, Karnataka — 900m altitude
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating stat card */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, type: "spring" }}
              className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-5 shadow-card-hover border border-border"
            >
              <div className="text-center">
                <p className="font-playfair text-3xl font-bold text-brand-green-dark">40+</p>
                <p className="font-inter text-xs text-muted-foreground">Years of Farming</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, type: "spring" }}
              className="absolute -top-6 -left-6 bg-brand-green-dark text-white rounded-2xl p-5 shadow-card-hover"
            >
              <div className="text-center">
                <p className="font-playfair text-3xl font-bold">500+</p>
                <p className="font-inter text-xs opacity-80">Happy Customers</p>
              </div>
            </motion.div>
          </motion.div>

          {/* ── Text Side ─────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="font-inter text-sm font-semibold text-brand-brown uppercase tracking-widest">
              Our Story
            </span>
            <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-brand-green-dark mt-2 mb-6">
              Rooted in the Hills of Coorg
            </h2>
            <p className="font-inter text-muted-foreground leading-relaxed mb-4">
              Nestled in the verdant hills of Choudlu, Coorg, the Pushpagiri estate has
              been home to our family's passion for over four decades. At 900 meters above
              sea level, the misty climate and rich soil create the perfect conditions for
              growing world-class coffee and aromatic spices.
            </p>
            <p className="font-inter text-muted-foreground leading-relaxed mb-8">
              What began as a small family plantation has grown into a celebrated brand
              trusted by coffee lovers and home chefs across India. Every product you
              receive carries the care, knowledge, and love of generations of farmers.
            </p>

            <ul className="space-y-3 mb-8">
              {highlights.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-green-dark shrink-0" />
                  <span className="font-inter text-sm font-medium">{item}</span>
                </li>
              ))}
            </ul>

            <Button asChild>
              <Link href="/about">Read Our Full Story</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
