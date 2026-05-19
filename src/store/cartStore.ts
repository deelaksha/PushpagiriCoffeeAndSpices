"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartItem, Product } from "@/types";

// =============================================
// CART STORE INTERFACE
// =============================================

interface CartStore {
  items: CartItem[];
  isOpen: boolean;

  // Computed values
  itemCount: () => number;
  total: () => number;
  subtotal: () => number;

  // Actions
  addItem: (
    product: Product,
    quantity: number,
    selectedWeight: string,
    price: number
  ) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  // Utilities
  isInCart: (productId: string, weight: string) => boolean;
  getItemQuantity: (productId: string, weight: string) => number;
}

// =============================================
// CART STORE
// =============================================

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      // ─── Computed Values ─────────────────────────
      itemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      total: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },

      subtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },

      // ─── Add Item to Cart ─────────────────────────
      addItem: (product, quantity, selectedWeight, price) => {
        const existingItem = get().items.find(
          (item) =>
            item.product.id === product.id &&
            item.selectedWeight === selectedWeight
        );

        if (existingItem) {
          // Update quantity if already in cart
          set((state) => ({
            items: state.items.map((item) =>
              item.id === existingItem.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          }));
        } else {
          // Add new item
          const newItem: CartItem = {
            id: `${product.id}-${selectedWeight}-${Date.now()}`,
            product,
            quantity,
            selectedWeight,
            price,
          };
          set((state) => ({ items: [...state.items, newItem] }));
        }
      },

      // ─── Remove Item from Cart ────────────────────
      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
      },

      // ─── Update Quantity ──────────────────────────
      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        }));
      },

      // ─── Clear Cart ───────────────────────────────
      clearCart: () => {
        set({ items: [] });
      },

      // ─── Drawer Controls ──────────────────────────
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      // ─── Utilities ────────────────────────────────
      isInCart: (productId, weight) => {
        return get().items.some(
          (item) =>
            item.product.id === productId && item.selectedWeight === weight
        );
      },

      getItemQuantity: (productId, weight) => {
        const item = get().items.find(
          (item) =>
            item.product.id === productId && item.selectedWeight === weight
        );
        return item?.quantity || 0;
      },
    }),
    {
      name: "pushpagiri-cart", // localStorage key
      storage: createJSONStorage(() => localStorage),
      // Only persist items, not the drawer state
      partialize: (state) => ({ items: state.items }),
    }
  )
);
