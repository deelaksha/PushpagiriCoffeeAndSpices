'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { getCartByUid, setCart } from '@/lib/firebase/firestore';
import type { CartItem } from '@/types';
import type { FirestoreCartItem } from '@/types/firebase';

// ─────────────────────────────────────────────────────────────────────────────
// Serialise: in-memory CartItem → lightweight FirestoreCartItem
// ─────────────────────────────────────────────────────────────────────────────
function toFirestore(item: CartItem): FirestoreCartItem {
  return {
    id: item.id,
    productId: item.product.id,
    productName: item.product.name,
    productSlug: item.product.slug,
    image: item.product.images?.[0] ?? '',
    variantId: item.variantId,
    weightLabel: item.weightLabel,
    price: item.price,
    quantity: item.quantity,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Deserialise: Firestore shape → partial CartItem that the store can hold
// (The full Product object cannot be stored in Firestore; reconstruct a stub.)
// ─────────────────────────────────────────────────────────────────────────────
function fromFirestore(item: FirestoreCartItem): CartItem {
  return {
    id: item.id,
    quantity: item.quantity,
    variantId: item.variantId,
    weightLabel: item.weightLabel,
    price: item.price,
    product: {
      id: item.productId,
      name: item.productName,
      slug: item.productSlug,
      images: [item.image],
      // Minimal stubs for fields not needed to display/remove cart items
      price: item.price,
      category: '',
      description: '',
      shortDescription: '',
      variants: [],
      stock: 0,
      isFeatured: false,
      isOrganic: false,
      origin: '',
      highlights: [],
      shippingInfo: '',
      rating: 0,
      reviewCount: 0,
      tags: [],
      createdAt: '',
      updatedAt: '',
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Merge local + remote items.
// Rule: local quantity wins for duplicate keys (same id).
// Firestore-only items are appended.
// ─────────────────────────────────────────────────────────────────────────────
function mergeItems(local: CartItem[], remote: FirestoreCartItem[]): CartItem[] {
  const merged = [...local];
  const localIds = new Set(local.map((i) => i.id));

  for (const remoteItem of remote) {
    if (!localIds.has(remoteItem.id)) {
      merged.push(fromFirestore(remoteItem));
    }
    // If the id exists locally we keep the local version (local wins)
  }

  return merged;
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────
export const useCartSync = () => {
  const { user } = useAuthStore();
  const { items, setItems, clearItems } = useCartStore();

  // Keep a stable ref to the previous user so we can detect login/logout events
  const prevUserRef = useRef<typeof user>(undefined);

  // ── 1. React to auth state changes ──────────────────────────────────────────
  useEffect(() => {
    const prevUser = prevUserRef.current;
    prevUserRef.current = user;

    // ── LOGOUT: user was logged in, now null ─────────────────────────────────
    if (prevUser && !user) {
      clearItems();
      return;
    }

    // ── LOGIN: user was null/undefined, now has a value ──────────────────────
    if (!prevUser && user) {
      const handleLogin = async () => {
        try {
          const remote = await getCartByUid(user.uid);
          const remoteItems: FirestoreCartItem[] = remote?.items ?? [];

          // Snapshot of current local items at the moment of login
          const currentLocalItems = useCartStore.getState().items;

          if (currentLocalItems.length === 0 && remoteItems.length === 0) {
            // Nothing to do
            return;
          }

          if (currentLocalItems.length === 0) {
            // No local cart — just load from Firestore
            setItems(remoteItems.map(fromFirestore));
            return;
          }

          // Merge local + remote and push back to Firestore
          const merged = mergeItems(currentLocalItems, remoteItems);
          setItems(merged);
          await setCart(user.uid, merged.map(toFirestore));
        } catch (err) {
          console.error('[CartSync] Login merge error:', err);
        }
      };

      handleLogin();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // ── 2. Debounced sync to Firestore while logged in ───────────────────────────
  useEffect(() => {
    if (!user) return;

    const timeout = setTimeout(async () => {
      try {
        await setCart(user.uid, items.map(toFirestore));
      } catch (err) {
        console.error('[CartSync] Sync error:', err);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [items, user]);
};
