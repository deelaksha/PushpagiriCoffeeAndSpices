"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, itemCount, clearCart } = useCartStore();
  const cartTotal = total();
  const count = itemCount();
  const shipping = cartTotal >= 999 ? 0 : 80;
  const grandTotal = cartTotal + shipping;

  if (count === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-brand-cream">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="text-8xl mb-6">🛒</div>
          <h1 className="font-playfair text-3xl font-bold text-brand-green-dark mb-3">Your Cart is Empty</h1>
          <p className="font-inter text-muted-foreground mb-8 max-w-md">
            Discover our premium organic coffee and spices from the hills of Coorg.
          </p>
          <Button size="lg" asChild><Link href="/shop"><ShoppingBag className="w-5 h-5" /> Start Shopping</Link></Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream py-10">
      <div className="container-custom">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-playfair text-3xl lg:text-4xl font-bold text-brand-green-dark mb-8">
          Shopping Cart ({count} items)
        </motion.h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* ── Cart Items ────────────────────────── */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0 }}
                  className="bg-white rounded-2xl shadow-card p-5 flex gap-5"
                >
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-brand-cream shrink-0">
                    <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" sizes="96px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2">
                      <div>
                        <Link href={`/shop/${item.product.slug}`}>
                          <h3 className="font-playfair font-bold text-brand-green-dark hover:text-brand-brown transition-colors">{item.product.name}</h3>
                        </Link>
                        <p className="font-inter text-xs text-muted-foreground mt-1">Weight: {item.selectedWeight}</p>
                        <p className="font-inter text-xs text-muted-foreground">Unit Price: {formatPrice(item.price)}</p>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-red-500 transition-colors p-1" aria-label="Remove">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3 bg-brand-cream rounded-xl px-3 py-1.5">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-brand-green-light transition-colors">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-bold w-6 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-brand-green-light transition-colors">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="font-playfair text-xl font-bold text-brand-green-dark">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <div className="flex justify-between">
              <Button variant="outline" asChild><Link href="/shop">← Continue Shopping</Link></Button>
              <Button variant="ghost" onClick={clearCart} className="text-red-500 hover:text-red-600">Clear Cart</Button>
            </div>
          </div>

          {/* ── Order Summary ─────────────────────── */}
          <div className="space-y-4">
            {/* Coupon — placeholder */}
            <div className="bg-white rounded-2xl shadow-card p-5">
              <h3 className="font-playfair font-bold text-brand-green-dark mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4" /> Coupon Code
              </h3>
              <div className="flex gap-2">
                <Input placeholder="Enter coupon code" />
                <Button variant="outline">Apply</Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">💡 Coupon system coming soon</p>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-2xl shadow-card p-5">
              <h3 className="font-playfair text-xl font-bold text-brand-green-dark mb-5">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-medium">{formatPrice(cartTotal)}</span></div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className={shipping === 0 ? "text-green-600 font-medium" : "font-medium"}>
                    {shipping === 0 ? "FREE 🎉" : formatPrice(shipping)}
                  </span>
                </div>
                {cartTotal < 999 && (
                  <p className="text-xs text-brand-green-dark bg-brand-green-light/20 rounded-lg px-3 py-2">
                    Add {formatPrice(999 - cartTotal)} more for free shipping!
                  </p>
                )}
                <div className="h-px bg-border" />
                <div className="flex justify-between text-base font-bold">
                  <span>Total</span>
                  <span className="text-brand-green-dark font-playfair text-xl">{formatPrice(grandTotal)}</span>
                </div>
              </div>
              <Button size="lg" className="w-full mt-6" asChild>
                <Link href="/checkout">Proceed to Checkout <ArrowRight className="w-4 h-4" /></Link>
              </Button>
            </div>

            {/* Guarantees */}
            <div className="bg-brand-green-dark text-white rounded-2xl p-5">
              <h4 className="font-playfair font-bold mb-3">🛡️ Our Guarantees</h4>
              {["100% Organic Products", "Fresh & Authentic", "Secure Checkout", "Easy Returns"].map((g) => (
                <div key={g} className="flex items-center gap-2 text-sm text-white/80 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-green-light" />{g}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
