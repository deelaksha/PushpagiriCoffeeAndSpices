"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { BRAND } from "@/constants";

// =============================================
// WHATSAPP FLOATING BUTTON
// =============================================

export default function WhatsAppFloat() {
  const message = encodeURIComponent(
    "Hello! I'd like to place an order from Pushpagiri Coffee & Spice. 🌿"
  );

  return (
    <motion.a
      href={`https://wa.me/${BRAND.whatsapp}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="whatsapp-float"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.95 }}
    >
      <MessageCircle className="w-7 h-7 text-white fill-white" />

      {/* Pulse Ring */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
    </motion.a>
  );
}
