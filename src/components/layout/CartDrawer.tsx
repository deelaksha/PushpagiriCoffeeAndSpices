"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { formatPrice, isVideoUrl } from "@/lib/utils";
import { useRouter } from "next/navigation";

const FREE_SHIPPING_THRESHOLD = 500;

// =============================================
// CART DRAWER COMPONENT
// =============================================

export default function CartDrawer() {
  const items        = useCartStore((state) => state.items);
  const isOpen       = useCartStore((state) => state.isOpen);
  const cartTotal    = useCartStore((state) => state.total());
  const count        = useCartStore((state) => state.itemCount());
  const closeCart    = useCartStore((state) => state.closeCart);
  const removeItem   = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const router = useRouter();

  const shippingProgress = Math.min(
    (cartTotal / FREE_SHIPPING_THRESHOLD) * 100,
    100
  );

  const handleProceedToCheckout = () => {
    closeCart();
    router.push("/checkout");
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeCart}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Drawer Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
            >
              {/* ── Header ─────────────────────────── */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-6 h-6 text-brand-green-dark" />
                  <h2 className="font-playfair text-xl font-bold text-brand-green-dark">
                    Your Cart
                  </h2>
                  {count > 0 && (
                    <span className="bg-brand-green-dark text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                      {count}
                    </span>
                  )}
                </div>
                <Button variant="ghost" size="icon" onClick={closeCart} aria-label="Close cart">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* ── Free Shipping Progress ──────────── */}
              {count > 0 && cartTotal < FREE_SHIPPING_THRESHOLD && (
                <div className="px-6 py-4 bg-brand-green-light/20 border-b border-border">
                  <p className="font-inter text-sm text-brand-green-dark mb-2">
                    🚚 Add{" "}
                    <strong>{formatPrice(FREE_SHIPPING_THRESHOLD - cartTotal)}</strong>{" "}
                    more for FREE shipping!
                  </p>
                  <div className="w-full bg-white rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${shippingProgress}%` }}
                      className="h-2 bg-brand-green-dark rounded-full"
                    />
                  </div>
                </div>
              )}
              {count > 0 && cartTotal >= FREE_SHIPPING_THRESHOLD && (
                <div className="px-6 py-3 bg-green-50 border-b border-border">
                  <p className="font-inter text-sm text-green-700">
                    🎉 You qualify for <strong>FREE shipping!</strong>
                  </p>
                </div>
              )}

              {/* ── Cart Items ──────────────────────── */}
              <div className="flex-1 overflow-y-auto">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                    <div className="w-24 h-24 bg-brand-green-light/20 rounded-full flex items-center justify-center mb-4">
                      <ShoppingCart className="w-12 h-12 text-brand-green-light" />
                    </div>
                    <h3 className="font-playfair text-xl font-bold text-brand-green-dark mb-2">
                      Your cart is empty
                    </h3>
                    <p className="font-inter text-sm text-muted-foreground mb-6">
                      Add some premium products to your cart and experience the taste of Coorg.
                    </p>
                    <Button onClick={closeCart} asChild>
                      <Link href="/shop">Browse Products</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="p-6 space-y-5">
                    <AnimatePresence>
                      {items.map((item) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20, height: 0 }}
                          className="flex gap-4 p-4 bg-brand-cream rounded-2xl"
                        >
                          {/* Product Image */}
                          <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white shrink-0">
                            {item.product.images?.[0] ? (
                              isVideoUrl(item.product.images[0]) ? (
                                <video
                                  src={item.product.images[0]}
                                  autoPlay
                                  loop
                                  muted
                                  playsInline
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Image
                                  src={item.product.images[0]}
                                  alt={item.product.name}
                                  fill
                                  className="object-cover"
                                  sizes="80px"
                                />
                              )
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-100 text-[10px] text-gray-400">
                                No Media
                              </div>
                            )}
                          </div>

                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-playfair font-semibold text-sm text-brand-green-dark truncate">
                              {item.product.name}
                            </h4>
                            <p className="font-inter text-xs text-muted-foreground mb-2">
                              {item.weightLabel}
                            </p>

                            <div className="flex items-center justify-between">
                              {/* Quantity Controls */}
                              <div className="flex items-center gap-2 bg-white rounded-full px-2 py-1 shadow-sm">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="w-6 h-6 flex items-center justify-center text-brand-green-dark hover:bg-brand-green-light rounded-full transition-colors"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="font-inter text-sm font-semibold w-6 text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="w-6 h-6 flex items-center justify-center text-brand-green-dark hover:bg-brand-green-light rounded-full transition-colors"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              {/* Price */}
                              <span className="font-playfair font-bold text-brand-green-dark">
                                {formatPrice(item.price * item.quantity)}
                              </span>
                            </div>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-muted-foreground hover:text-red-500 transition-colors p-1 self-start"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* ── Cart Footer ─────────────────────── */}
              {items.length > 0 && (
                <div className="p-6 border-t border-border space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-inter text-muted-foreground">
                      Subtotal ({count} items)
                    </span>
                    <span className="font-playfair text-xl font-bold text-brand-green-dark">
                      {formatPrice(cartTotal)}
                    </span>
                  </div>
                  <p className="font-inter text-xs text-muted-foreground text-center">
                    Taxes and shipping calculated at checkout
                  </p>
                  <div className="space-y-3">
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleProceedToCheckout}
                    >
                      Proceed to Checkout
                      <ArrowRight className="w-4 h-4 inline-block ml-2" />
                    </Button>
                    <Button variant="outline" className="w-full" onClick={closeCart}>
                      Continue Shopping
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
