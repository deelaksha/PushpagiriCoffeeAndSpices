import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db, FIREBASE_COLLECTIONS } from "@/lib/firebase";
import { Review } from "@/types";

const COL = FIREBASE_COLLECTIONS.REVIEWS;

// ── GET REVIEWS BY PRODUCT ────────────────────────────────────────────────────
export async function getReviewsByProduct(productId: string): Promise<Review[]> {
  const q = query(
    collection(db, COL),
    where("productId", "==", productId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Review));
}

// ── ADD REVIEW ────────────────────────────────────────────────────────────────
export async function addReview(
  review: Omit<Review, "id" | "createdAt">
): Promise<void> {
  await addDoc(collection(db, COL), {
    ...review,
    createdAt: serverTimestamp(),
  });
}

// ── GET ALL REVIEWS (ADMIN) ───────────────────────────────────────────────────
export async function getAllReviews(): Promise<Review[]> {
  const snap = await getDocs(
    query(collection(db, COL), orderBy("createdAt", "desc"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Review));
}

// ── MARK REVIEW AS VERIFIED ───────────────────────────────────────────────────
export async function verifyReview(reviewId: string): Promise<void> {
  await updateDoc(doc(db, COL, reviewId), { isVerified: true });
}

// ── DELETE REVIEW (ADMIN) ─────────────────────────────────────────────────────
export async function deleteReview(reviewId: string): Promise<void> {
  const { deleteDoc } = await import("firebase/firestore");
  await deleteDoc(doc(db, COL, reviewId));
}
