"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/constants";

export default function WholesaleCTA() {
  return (
    <section className="py-20 bg-brand-cream">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-brand-brown rounded-3xl overflow-hidden px-8 py-16 text-center"
          style={{
            background: "linear-gradient(135deg, #6F4E37 0%, #3A5A40 100%)",
          }}
        >
          <div className="absolute inset-0 bg-leaf-pattern opacity-10" />
          <div className="relative z-10">
            <span className="inline-block bg-white/20 text-white text-sm font-semibold px-4 py-1 rounded-full mb-4 font-inter">
              🤝 B2B & Wholesale
            </span>
            <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-white mb-4">
              Scale Your Business with Coorg&apos;s Finest
            </h2>
            <p className="font-inter text-white/80 text-lg max-w-2xl mx-auto mb-8">
              Partner with Pushpagiri for bulk coffee and spice supply. We serve cafes,
              hotels, restaurants, and retail chains across India with export-grade quality.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" variant="gold" asChild>
                <a href={`https://wa.me/${BRAND.whatsapp}`} target="_blank" rel="noopener noreferrer">
                  💬 WhatsApp Us
                </a>
              </Button>
              <Button
                size="lg"
                className="border-white text-white border-2 bg-transparent hover:bg-white hover:text-brand-green-dark"
                asChild
              >
                <a href={`tel:${BRAND.phone}`}>
                  📞 Call Us
                </a>
              </Button>
            </div>
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              {["Cafes & Restaurants", "Hotels & Resorts", "Grocery Chains", "Online Retailers", "Export Partners"].map((p) => (
                <div key={p} className="flex items-center gap-2 text-white/70">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-green-light" />
                  <span className="font-inter text-sm">{p}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
