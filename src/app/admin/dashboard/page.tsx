"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, ShoppingBag, Users, Package, BarChart3, Clock } from "lucide-react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Product, Order } from "@/types/firebase";
import { formatPrice, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// ─────────────────────────────────────────────────────────────────────────────
const STATUS_COLORS: Record<string, string> = {
  pending:    "bg-amber-100 text-amber-700",
  confirmed:  "bg-blue-100 text-blue-700",
  processing: "bg-purple-100 text-purple-700",
  shipped:    "bg-indigo-100 text-indigo-700",
  delivered:  "bg-green-100 text-green-700",
  cancelled:  "bg-red-100 text-red-700",
};

// ─────────────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders]     = useState<Order[]>([]);
  const [loading, setLoading]   = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // ── Real-time: orders ──────────────────────────────────────────────────────
  useEffect(() => {
    const unsubOrders = onSnapshot(
      query(collection(db, "orders"), orderBy("createdAt", "desc")),
      (snap) => {
        setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Order[]);
        setLastUpdated(new Date());
        setLoading(false);
      },
      (err) => {
        console.error("Dashboard orders listener error:", err);
        setLoading(false);
      }
    );

    return () => unsubOrders();
  }, []);

  // ── Real-time: products ────────────────────────────────────────────────────
  useEffect(() => {
    const unsubProducts = onSnapshot(
      collection(db, "products"),
      (snap) => {
        setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Product[]);
      },
      (err) => console.error("Dashboard products listener error:", err)
    );

    return () => unsubProducts();
  }, []);

  // ── Computed stats ─────────────────────────────────────────────────────────
  const totalRevenue   = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrders    = orders.length;
  const pendingOrders  = orders.filter((o) => {
    const s = o.orderStatus || (o as any).status || "pending";
    return s === "pending" || s === "confirmed";
  }).length;
  const uniqueCustomers = new Set(
    orders.filter((o) => o.customerInfo?.email).map((o) => o.customerInfo.email)
  ).size;

  const STATS = [
    {
      label: "Total Revenue",
      value: formatPrice(totalRevenue),
      icon: TrendingUp,
      badge: `${orders.filter((o) => {
        const s = o.orderStatus || (o as any).status || "";
        return s === "delivered";
      }).length} delivered`,
      positive: true,
    },
    {
      label: "Total Orders",
      value: String(totalOrders),
      icon: ShoppingBag,
      badge: `${pendingOrders} pending`,
      positive: pendingOrders === 0,
    },
    {
      label: "Unique Customers",
      value: String(uniqueCustomers),
      icon: Users,
      badge: "Real-time",
      positive: true,
    },
    {
      label: "Active Products",
      value: String(products.length),
      icon: Package,
      badge: "In catalogue",
      positive: true,
    },
  ];

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-green-dark mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">Loading live data…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Live indicator */}
      {lastUpdated && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          Live — last updated {lastUpdated.toLocaleTimeString("en-IN")}
        </div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white rounded-2xl p-5 shadow-card"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-brand-green-light/20 rounded-xl flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-brand-green-dark" />
              </div>
              <span
                className={cn(
                  "text-xs font-semibold px-2 py-1 rounded-full",
                  stat.positive
                    ? "bg-green-100 text-green-700"
                    : "bg-amber-100 text-amber-700"
                )}
              >
                {stat.badge}
              </span>
            </div>
            <p className="font-playfair text-2xl font-bold text-brand-green-dark">
              {stat.value}
            </p>
            <p className="font-inter text-xs text-muted-foreground mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders — real-time */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="font-playfair text-lg font-bold text-brand-green-dark">
              Recent Orders
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Updates automatically
            </p>
          </div>
          <Button size="sm" variant="outline" asChild>
            <Link href="/admin/orders">View All</Link>
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-muted/50">
              <tr>
                {["Order ID", "Customer", "Items", "Total", "Status"].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.slice(0, 8).map((order) => {
                const currentStatus = order.orderStatus || (order as any).status || "pending";
                const items = order.products ?? (order as any).items ?? [];

                return (
                  <tr key={order.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-3.5 text-sm font-medium text-brand-green-dark">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="hover:underline"
                      >
                        {order.orderId || order.id}
                      </Link>
                    </td>
                    <td className="px-6 py-3.5 text-sm">
                      <p className="font-medium">{order.customerInfo?.name || "Guest"}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.customerInfo?.email || "—"}
                      </p>
                    </td>
                    <td className="px-6 py-3.5 text-sm text-muted-foreground">
                      <span title={items.map((it: any) => `${it.name || it.productName} ×${it.quantity}`).join(", ")}>
                        {items.length} {items.length === 1 ? "item" : "items"}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-sm font-bold">
                      {formatPrice(order.total || 0)}
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className={cn(
                          "text-xs font-semibold px-2.5 py-1 rounded-full capitalize",
                          STATUS_COLORS[currentStatus] ?? "bg-gray-100 text-gray-700"
                        )}
                      >
                        {currentStatus}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {orders.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-muted-foreground text-sm"
                  >
                    No orders yet. They'll appear here in real-time.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {["Revenue Overview", "Top Selling Products"].map((chart) => (
          <div key={chart} className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="font-playfair font-bold text-brand-green-dark mb-4">{chart}</h3>
            <div className="h-56 bg-brand-cream/30 rounded-xl flex flex-col items-center justify-center text-muted-foreground text-sm border border-dashed border-border gap-2">
              <BarChart3 className="w-8 h-8 text-brand-green-light" />
              <span>Analytics charts coming soon</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
