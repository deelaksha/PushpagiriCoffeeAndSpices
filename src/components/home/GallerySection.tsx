"use client";

import { motion } from "framer-motion";

const GALLERY_ITEMS = [
  { emoji: "☕", label: "Freshly Brewed", bg: "#3A5A40", size: "col-span-2 row-span-2" },
  { emoji: "🫘", label: "Arabica Beans", bg: "#6F4E37", size: "" },
  { emoji: "🌿", label: "Organic Leaves", bg: "#A8D5BA", size: "" },
  { emoji: "🌶️", label: "Black Pepper", bg: "#2d4631", size: "" },
  { emoji: "🌱", label: "Green Cardamom", bg: "#4a7c59", size: "" },
  { emoji: "🏡", label: "Our Estate", bg: "#8B6914", size: "col-span-2" },
  { emoji: "📦", label: "Packed Fresh", bg: "#3A5A40", size: "" },
  { emoji: "🤝", label: "Farm Direct", bg: "#6F4E37", size: "" },
];

export default function GallerySection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="font-inter text-sm font-semibold text-brand-brown uppercase tracking-widest">
            Life at the Plantation
          </span>
          <h2 className="section-title mt-2">From Our Estate</h2>
          <p className="font-inter text-muted-foreground text-lg max-w-xl mx-auto">
            A glimpse into the Pushpagiri estate — where every product begins its journey.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[160px]">
          {GALLERY_ITEMS.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ scale: 1.02 }}
              className={`rounded-2xl flex items-center justify-center overflow-hidden cursor-pointer relative group ${item.size}`}
              style={{ backgroundColor: item.bg }}
            >
              <div className="text-center text-white p-4">
                <div className="text-5xl mb-2">{item.emoji}</div>
                <p className="font-inter text-xs font-semibold opacity-90">{item.label}</p>
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
            </motion.div>
          ))}
        </div>

        <p className="text-center font-inter text-sm text-muted-foreground mt-6">
          📸 Follow us on{" "}
          <a href="https://instagram.com/pushpagiricoffee" target="_blank" rel="noopener noreferrer" className="text-brand-green-dark font-semibold hover:underline">
            @pushpagiricoffee
          </a>{" "}
          for daily updates from the plantation
        </p>
      </div>
    </section>
  );
}
