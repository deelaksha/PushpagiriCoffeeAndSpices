"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, ShoppingBag, Users, Package } from "lucide-react";
import { getDocuments } from "@/lib/firebase/firestore";
import { Product, Order } from "@/types/firebase";
import { formatPrice, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-purple-100 text-purple-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedProducts = await getDocuments<Product>("products");
        const fetchedOrders = await getDocuments<Order>("orders");
        setProducts(fetchedProducts);
        setOrders(fetchedOrders);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const STATS_DYNAMIC = [
    { label: "Total Revenue", value: formatPrice(orders.reduce((sum, o) => sum + o.total, 0)), icon: TrendingUp, change: "+18%", positive: true },
    { label: "Total Orders", value: String(orders.length), icon: ShoppingBag, change: "+12%", positive: true },
    { label: "Customers", value: String(new Set(orders.filter(o => o.customerInfo?.email).map(o => o.customerInfo?.email)).size), icon: Users, change: "+8%", positive: true },
    { label: "Active Products", value: String(products.length), icon: Package, change: "Active", positive: true },
  ];

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green-dark"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
        {STATS_DYNAMIC.map((stat, i) => (
          <motion.div 
            key={stat.label} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl p-5 shadow-card"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-brand-green-light/20 rounded-xl flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-brand-green-dark" />
              </div>
              <span className={cn("text-xs font-semibold px-2 py-1 rounded-full", stat.positive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
                {stat.change}
              </span>
            </div>
            <p className="font-playfair text-2xl font-bold text-brand-green-dark">{stat.value}</p>
            <p className="font-inter text-xs text-muted-foreground mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-playfair text-lg font-bold text-brand-green-dark">Recent Orders</h2>
          <Button size="sm" variant="outline" asChild>
            <Link href="/admin/orders">View All</Link>
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-muted/50">
              <tr>
                {["Order ID", "Customer", "Items", "Total", "Status"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-brand-green-dark">{order.orderId}</td>
                  <td className="px-6 py-4 text-sm">{order.customerInfo?.name || 'Guest'}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{order.products?.length || 0} items</td>
                  <td className="px-6 py-4 text-sm font-bold">{formatPrice(order.total)}</td>
                  <td className="px-6 py-4">
                    <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full capitalize", STATUS_COLORS[order.orderStatus || 'pending'] || "bg-gray-100 text-gray-700")}>
                      {order.orderStatus || 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground text-sm">
                    No orders found.
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
            <div className="h-64 bg-brand-cream/30 rounded-xl flex flex-col items-center justify-center text-muted-foreground text-sm border border-dashed border-border">
              <BarChart3 className="w-8 h-8 mb-2 text-brand-green-light" />
              <span>Connect Recharts with Firebase data</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Temporary icon missing from top level import
import { BarChart3 } from "lucide-react";
