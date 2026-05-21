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
    variantId: string,
    weightLabel: string,
    price: number,
    quantity?: number
  ) => void;
  setItems: (items: CartItem[]) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  clearItems: () => void;  // clears items only — used on logout
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  // Utilities
  isInCart: (productId: string, variantId: string) => boolean;
  getItemQuantity: (productId: string, variantId: string) => number;
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
      addItem: (product, variantId, weightLabel, price, quantity = 1) => {
        const existingItem = get().items.find(
          (item) =>
            item.product.id === product.id &&
            item.variantId === variantId
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
            id: `${product.id}-${variantId}-${Date.now()}`,
            product,
            quantity,
            variantId,
            weightLabel,
            price,
          };
          set((state) => ({ items: [...state.items, newItem] }));
        }
      },

      // ─── Set Items (for Firebase Sync) ────────────
      setItems: (items) => set({ items }),

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

      // Clears only items (used on logout — keeps drawer state)
      clearItems: () => set({ items: [] }),

      // ─── Drawer Controls ──────────────────────────
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      // ─── Utilities ────────────────────────────────
      isInCart: (productId, variantId) => {
        return get().items.some(
          (item) =>
            item.product.id === productId && item.variantId === variantId
        );
      },

      getItemQuantity: (productId, variantId) => {
        const item = get().items.find(
          (item) =>
            item.product.id === productId && item.variantId === variantId
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
