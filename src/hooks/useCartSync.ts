import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { getDocument, updateDocument } from '@/lib/firebase/firestore';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';

// Sets a document with a specific ID (upsert — creates or overwrites)
const setDocument = async (collectionName: string, id: string, data: object): Promise<void> => {
  const docRef = doc(db, collectionName, id);
  await setDoc(docRef, { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }, { merge: true });
};

export const useCartSync = () => {
  const { user } = useAuthStore();
  const { items, setItems } = useCartStore();

  // Load cart from Firebase on login
  useEffect(() => {
    if (user) {
      const loadCart = async () => {
        const cartData = await getDocument<{ items: unknown[] }>('cart', user.uid);
        if (cartData && cartData.items) {
          if (items.length === 0 && cartData.items.length > 0) {
            setItems(cartData.items as typeof items);
          } else if (items.length > 0) {
            await updateDocument('cart', user.uid, { items });
          }
        } else if (items.length > 0) {
          await setDocument('cart', user.uid, { items });
        }
      };
      loadCart();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Sync to Firebase on items change
  useEffect(() => {
    if (user) {
      const syncCart = async () => {
        try {
          const cartData = await getDocument('cart', user.uid);
          if (cartData) {
            await updateDocument('cart', user.uid, { items });
          } else {
            await setDocument('cart', user.uid, { items });
          }
        } catch (error) {
          console.error('Error syncing cart to Firebase:', error);
        }
      };
      const timeout = setTimeout(() => syncCart(), 1000);
      return () => clearTimeout(timeout);
    }
  }, [items, user]);
};
