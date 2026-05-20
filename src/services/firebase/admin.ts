import { collection, getDocs, query, where } from "firebase/firestore";
import { db, FIREBASE_COLLECTIONS } from "@/lib/firebase";
import { DashboardStats } from "@/types";

// ── GET DASHBOARD STATS (ADMIN) ───────────────────────────────────────────────
export async function getDashboardStats(): Promise<DashboardStats> {
  const [ordersSnap, customersSnap, productsSnap] = await Promise.all([
    getDocs(collection(db, FIREBASE_COLLECTIONS.ORDERS)),
    getDocs(collection(db, FIREBASE_COLLECTIONS.CUSTOMERS)),
    getDocs(collection(db, FIREBASE_COLLECTIONS.PRODUCTS)),
  ]);

  const orders = ordersSnap.docs.map((d) => d.data());
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total ?? 0), 0);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;

  return {
    totalOrders: ordersSnap.size,
    totalRevenue,
    totalCustomers: customersSnap.size,
    totalProducts: productsSnap.size,
    ordersGrowth: 0,     // extend with date-range queries as needed
    revenueGrowth: 0,
    customersGrowth: 0,
    pendingOrders,
  };
}
