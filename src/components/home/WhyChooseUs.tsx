"use client";

import { motion } from "framer-motion";
import { WHY_CHOOSE_US } from "@/constants";
import * as Icons from "lucide-react";
import { LucideIcon } from "lucide-react";

export default function WhyChooseUs() {
  return (
    <section className="section-padding bg-brand-green-dark overflow-hidden">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="font-inter text-sm font-semibold text-brand-green-light uppercase tracking-widest">
            Why Pushpagiri
          </span>
          <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-white mt-2 mb-4">
            The Pushpagiri Difference
          </h2>
          <p className="font-inter text-white/70 text-lg max-w-2xl mx-auto">
            We don't just sell coffee and spices — we share the story of our
            land, our people, and our commitment to quality.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY_CHOOSE_US.map((item, i) => {
            const Icon = Icons[item.icon as keyof typeof Icons] as LucideIcon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.03 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-brand-green-light/20 rounded-xl flex items-center justify-center mb-4">
                  {Icon && <Icon className="w-6 h-6 text-brand-green-light" />}
                </div>
                <h3 className="font-playfair text-lg font-semibold text-white mb-2">
                  {item.title}
                </h3>
                <p className="font-inter text-sm text-white/60 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
