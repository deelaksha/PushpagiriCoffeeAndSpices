/**
 * Firebase Products Service — Placeholder
 *
 * TODO: Uncomment and implement when Firebase is connected.
 * Install: npm install firebase
 * Then update /src/lib/firebase.ts with real credentials.
 */

import { Product } from "@/types";
import { PRODUCTS } from "@/constants"; // Fallback to local data for now

// ── GET ALL PRODUCTS ──────────────────────────
export async function getAllProducts(): Promise<Product[]> {
  // TODO: Replace with Firestore query
  // const snapshot = await getDocs(collection(db, "products"));
  // return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Product));

  // Currently returning local data
  return PRODUCTS;
}

// ── GET PRODUCT BY SLUG ───────────────────────
export async function getProductBySlug(slug: string): Promise<Product | null> {
  // TODO: Replace with Firestore query
  // const q = query(collection(db, "products"), where("slug", "==", slug), limit(1));
  // const snapshot = await getDocs(q);
  // if (snapshot.empty) return null;
  // return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Product;

  return PRODUCTS.find((p) => p.slug === slug) ?? null;
}

// ── GET PRODUCTS BY CATEGORY ──────────────────
export async function getProductsByCategory(category: string): Promise<Product[]> {
  // TODO: Replace with Firestore query
  // const q = query(collection(db, "products"), where("category", "==", category));
  // const snapshot = await getDocs(q);
  // return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Product));

  return PRODUCTS.filter((p) => p.category === category);
}

// ── GET FEATURED PRODUCTS ─────────────────────
export async function getFeaturedProducts(): Promise<Product[]> {
  // TODO: Replace with Firestore query
  // const q = query(collection(db, "products"), where("isFeatured", "==", true));
  return PRODUCTS.filter((p) => p.isFeatured);
}

// ── CREATE/UPDATE PRODUCT (ADMIN) ─────────────
export async function upsertProduct(product: Partial<Product>): Promise<void> {
  // TODO: Implement with Firestore
  // if (product.id) {
  //   await updateDoc(doc(db, "products", product.id), product);
  // } else {
  //   await addDoc(collection(db, "products"), { ...product, createdAt: serverTimestamp() });
  // }
  console.log("TODO: upsertProduct — Firebase not connected", product);
}

// ── DELETE PRODUCT (ADMIN) ────────────────────
export async function deleteProduct(productId: string): Promise<void> {
  // TODO: Implement with Firestore
  // await deleteDoc(doc(db, "products", productId));
  console.log("TODO: deleteProduct — Firebase not connected", productId);
}
