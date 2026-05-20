import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
  increment,
} from "firebase/firestore";
import { db, FIREBASE_COLLECTIONS } from "@/lib/firebase";
import { Customer, ShippingAddress } from "@/types";

const COL = FIREBASE_COLLECTIONS.CUSTOMERS;

// ── UPSERT CUSTOMER ───────────────────────────────────────────────────────────
// Uses email as the stable document ID.
export async function upsertCustomer(
  customerInfo: ShippingAddress
): Promise<void> {
  const docRef = doc(db, COL, customerInfo.email);
  const snap = await getDoc(docRef);

  if (snap.exists()) {
    await updateDoc(docRef, {
      name: customerInfo.fullName,
      phone: customerInfo.phone,
      address: customerInfo,
      lastOrderAt: serverTimestamp(),
      orderCount: increment(1),
    });
  } else {
    await setDoc(docRef, {
      name: customerInfo.fullName,
      email: customerInfo.email,
      phone: customerInfo.phone,
      address: customerInfo,
      orderCount: 1,
      totalSpent: 0,
      createdAt: serverTimestamp(),
      lastOrderAt: serverTimestamp(),
    });
  }
}

// ── GET ALL CUSTOMERS (ADMIN) ─────────────────────────────────────────────────
export async function getAllCustomers(): Promise<Customer[]> {
  const snap = await getDocs(
    query(collection(db, COL), orderBy("createdAt", "desc"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Customer));
}

// ── GET CUSTOMER BY EMAIL ─────────────────────────────────────────────────────
export async function getCustomerByEmail(
  email: string
): Promise<Customer | null> {
  const snap = await getDoc(doc(db, COL, email));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Customer;
}

// ── UPDATE TOTAL SPENT ────────────────────────────────────────────────────────
export async function incrementCustomerSpend(
  email: string,
  amount: number
): Promise<void> {
  const docRef = doc(db, COL, email);
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    await updateDoc(docRef, { totalSpent: increment(amount) });
  }
}
