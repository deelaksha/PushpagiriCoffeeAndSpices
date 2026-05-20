import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db, FIREBASE_COLLECTIONS } from "@/lib/firebase";
import { Order, ShippingAddress, CartItem } from "@/types";
import { generateOrderNumber } from "@/lib/utils";

const COL = FIREBASE_COLLECTIONS.ORDERS;

// ── SAVE ORDER ────────────────────────────────────────────────────────────────
export async function saveOrder(
  customerInfo: ShippingAddress,
  cartItems: CartItem[],
  total: number,
  paymentMethod: Order["paymentMethod"] = "whatsapp"
): Promise<string> {
  const orderNumber = generateOrderNumber();
  const shippingCost = total >= 999 ? 0 : 80;

  const orderData = {
    orderNumber,
    customerInfo,
    items: cartItems.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      quantity: item.quantity,
      weight: item.selectedWeight,
      price: item.price,
      image: item.product.images[0] ?? "",
    })),
    subtotal: total,
    shippingCost,
    discount: 0,
    total: total + shippingCost,
    status: "pending" as Order["status"],
    paymentMethod,
    paymentStatus: "pending" as Order["paymentStatus"],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await addDoc(collection(db, COL), orderData);
  return orderNumber;
}

// ── GET ALL ORDERS (ADMIN) ────────────────────────────────────────────────────
export async function getAllOrders(): Promise<Order[]> {
  const snap = await getDocs(
    query(collection(db, COL), orderBy("createdAt", "desc"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order));
}

// ── GET ORDERS BY CUSTOMER EMAIL ──────────────────────────────────────────────
export async function getOrdersByEmail(email: string): Promise<Order[]> {
  const q = query(
    collection(db, COL),
    where("customerInfo.email", "==", email),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order));
}

// ── UPDATE ORDER STATUS (ADMIN) ───────────────────────────────────────────────
export async function updateOrderStatus(
  orderId: string,
  status: Order["status"]
): Promise<void> {
  await updateDoc(doc(db, COL, orderId), {
    status,
    updatedAt: serverTimestamp(),
  });
}

// ── UPDATE PAYMENT STATUS (ADMIN) ─────────────────────────────────────────────
export async function updatePaymentStatus(
  orderId: string,
  paymentStatus: Order["paymentStatus"]
): Promise<void> {
  await updateDoc(doc(db, COL, orderId), {
    paymentStatus,
    updatedAt: serverTimestamp(),
  });
}
