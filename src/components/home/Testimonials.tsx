"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { TESTIMONIALS } from "@/constants";

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? TESTIMONIALS.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === TESTIMONIALS.length - 1 ? 0 : c + 1));

  return (
    <section className="section-padding bg-white overflow-hidden">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="font-inter text-sm font-semibold text-brand-brown uppercase tracking-widest">
            Customer Love
          </span>
          <h2 className="section-title mt-2">What Our Customers Say</h2>
        </motion.div>

        {/* Desktop: grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="testimonial-card rounded-2xl p-6 hover:shadow-card-hover transition-all duration-300"
            >
              <Quote className="w-8 h-8 text-brand-green-light mb-4" />
              <div className="flex mb-3">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-brand-gold text-brand-gold" />
                ))}
              </div>
              <p className="font-inter text-sm text-muted-foreground leading-relaxed mb-4 italic">
                &quot;{t.text}&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-green-dark rounded-full flex items-center justify-center text-white font-bold font-playfair text-sm">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="font-inter font-semibold text-sm text-brand-green-dark">{t.name}</p>
                  <p className="font-inter text-xs text-muted-foreground">{t.location}</p>
                </div>
              </div>
              {t.product && (
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="font-inter text-xs text-brand-brown">📦 {t.product}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Mobile: carousel */}
        <div className="md:hidden relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              className="testimonial-card rounded-2xl p-6"
            >
              <Quote className="w-8 h-8 text-brand-green-light mb-4" />
              <div className="flex mb-3">
                {[...Array(TESTIMONIALS[current].rating)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-brand-gold text-brand-gold" />
                ))}
              </div>
              <p className="font-inter text-sm text-muted-foreground leading-relaxed mb-4 italic">
                &quot;{TESTIMONIALS[current].text}&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-green-dark rounded-full flex items-center justify-center text-white font-bold">
                  {TESTIMONIALS[current].name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-sm">{TESTIMONIALS[current].name}</p>
                  <p className="text-xs text-muted-foreground">{TESTIMONIALS[current].location}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-4 mt-6">
            <button onClick={prev} className="w-10 h-10 bg-brand-green-dark text-white rounded-full flex items-center justify-center hover:bg-brand-green-light transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-brand-green-dark w-6" : "bg-brand-green-light"}`}
                />
              ))}
            </div>
            <button onClick={next} className="w-10 h-10 bg-brand-green-dark text-white rounded-full flex items-center justify-center hover:bg-brand-green-light transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
