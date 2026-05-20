import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db, FIREBASE_COLLECTIONS } from "@/lib/firebase";
import { Product } from "@/types";
import { PRODUCTS } from "@/constants";

const COL = FIREBASE_COLLECTIONS.PRODUCTS;

// ── GET ALL PRODUCTS ──────────────────────────────────────────────────────────
export async function getAllProducts(): Promise<Product[]> {
  try {
    const snap = await getDocs(
      query(collection(db, COL), orderBy("createdAt", "desc"))
    );
    if (snap.empty) return PRODUCTS; // fallback to seed data
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
  } catch {
    console.warn("Firestore unavailable, using local data");
    return PRODUCTS;
  }
}

// ── GET PRODUCT BY SLUG ───────────────────────────────────────────────────────
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const q = query(collection(db, COL), where("slug", "==", slug), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) return PRODUCTS.find((p) => p.slug === slug) ?? null;
    return { id: snap.docs[0].id, ...snap.docs[0].data() } as Product;
  } catch {
    return PRODUCTS.find((p) => p.slug === slug) ?? null;
  }
}

// ── GET PRODUCTS BY CATEGORY ──────────────────────────────────────────────────
export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    const q = query(collection(db, COL), where("category", "==", category));
    const snap = await getDocs(q);
    if (snap.empty) return PRODUCTS.filter((p) => p.category === category);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
  } catch {
    return PRODUCTS.filter((p) => p.category === category);
  }
}

// ── GET FEATURED PRODUCTS ─────────────────────────────────────────────────────
export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const q = query(collection(db, COL), where("isFeatured", "==", true));
    const snap = await getDocs(q);
    if (snap.empty) return PRODUCTS.filter((p) => p.isFeatured);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
  } catch {
    return PRODUCTS.filter((p) => p.isFeatured);
  }
}

// ── SEED PRODUCTS (run once from Admin) ──────────────────────────────────────
export async function seedProductsToFirestore(): Promise<void> {
  const snap = await getDocs(collection(db, COL));
  if (!snap.empty) {
    console.log("Products already seeded.");
    return;
  }
  const promises = PRODUCTS.map((p) =>
    addDoc(collection(db, COL), {
      ...p,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  );
  await Promise.all(promises);
  console.log(`✅ Seeded ${PRODUCTS.length} products to Firestore.`);
}

// ── UPSERT PRODUCT (ADMIN) ────────────────────────────────────────────────────
export async function upsertProduct(product: Partial<Product>): Promise<void> {
  const now = serverTimestamp();
  if (product.id) {
    const { id, ...data } = product;
    await updateDoc(doc(db, COL, id), { ...data, updatedAt: now });
  } else {
    await addDoc(collection(db, COL), { ...product, createdAt: now, updatedAt: now });
  }
}

// ── DELETE PRODUCT (ADMIN) ────────────────────────────────────────────────────
export async function deleteProduct(productId: string): Promise<void> {
  await deleteDoc(doc(db, COL, productId));
}

// ── UPDATE STOCK ──────────────────────────────────────────────────────────────
export async function updateProductStock(
  productId: string,
  newStock: number
): Promise<void> {
  await updateDoc(doc(db, COL, productId), {
    stock: newStock,
    updatedAt: serverTimestamp(),
  });
}
