/**
 * Firebase Orders Service — Placeholder
 *
 * TODO: Uncomment and implement when Firebase is connected.
 */

import { Order, ShippingAddress, CartItem } from "@/types";
import { generateOrderNumber } from "@/lib/utils";

// ── SAVE ORDER ────────────────────────────────
export async function saveOrder(
  customerInfo: ShippingAddress,
  cartItems: CartItem[],
  total: number
): Promise<string> {
  const orderNumber = generateOrderNumber();

  // TODO: Replace with Firestore write
  // const orderData: Omit<Order, "id"> = {
  //   orderNumber,
  //   customerInfo,
  //   items: cartItems.map((item) => ({
  //     productId: item.product.id,
  //     productName: item.product.name,
  //     quantity: item.quantity,
  //     weight: item.selectedWeight,
  //     price: item.price,
  //     image: item.product.images[0],
  //   })),
  //   subtotal: total,
  //   shippingCost: total >= 999 ? 0 : 80,
  //   discount: 0,
  //   total: total >= 999 ? total : total + 80,
  //   status: "pending",
  //   paymentMethod: "whatsapp",
  //   paymentStatus: "pending",
  //   createdAt: new Date().toISOString(),
  //   updatedAt: new Date().toISOString(),
  // };
  // const docRef = await addDoc(collection(db, "orders"), orderData);
  // return orderNumber;

  console.log("TODO: saveOrder — Firebase not connected", { orderNumber, customerInfo, cartItems, total });
  return orderNumber;
}

// ── GET ALL ORDERS (ADMIN) ────────────────────
export async function getAllOrders(): Promise<Order[]> {
  // TODO: Replace with Firestore query
  // const snapshot = await getDocs(collection(db, "orders"));
  // return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Order));
  return [];
}

// ── UPDATE ORDER STATUS (ADMIN) ───────────────
export async function updateOrderStatus(
  orderId: string,
  status: Order["status"]
): Promise<void> {
  // TODO: Replace with Firestore update
  // await updateDoc(doc(db, "orders", orderId), { status, updatedAt: serverTimestamp() });
  console.log("TODO: updateOrderStatus — Firebase not connected", { orderId, status });
}
