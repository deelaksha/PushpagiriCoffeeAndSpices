"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Eye, Filter, Download } from "lucide-react";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Order } from "@/types/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice, cn } from "@/lib/utils";
import { toast } from "sonner";

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────
const ALL_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;

type OrderStatus = (typeof ALL_STATUSES)[number];

const STATUS_COLORS: Record<OrderStatus | string, string> = {
  pending:    "bg-amber-100 text-amber-700 border-amber-200",
  confirmed:  "bg-blue-100 text-blue-700 border-blue-200",
  processing: "bg-purple-100 text-purple-700 border-purple-200",
  shipped:    "bg-indigo-100 text-indigo-700 border-indigo-200",
  delivered:  "bg-green-100 text-green-700 border-green-200",
  cancelled:  "bg-red-100 text-red-700 border-red-200",
};

// ─────────────────────────────────────────────────────────────────────────────
// Inline status updater
// ─────────────────────────────────────────────────────────────────────────────
async function changeOrderStatus(orderId: string, newStatus: string) {
  try {
    await updateDoc(doc(db, "orders", orderId), {
      orderStatus: newStatus,
      status: newStatus, // keep both fields in sync
      updatedAt: serverTimestamp(),
    });
    toast.success(`Order status updated to "${newStatus}"`);
  } catch (err) {
    console.error("Status update failed:", err);
    toast.error("Failed to update status. Please try again.");
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Real-time listener
  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetched = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Order[];
        setOrders(fetched);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Filtered view
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderId?.toLowerCase().includes(search.toLowerCase()) ||
      order.customerInfo?.name?.toLowerCase().includes(search.toLowerCase()) ||
      order.customerInfo?.email?.toLowerCase().includes(search.toLowerCase());

    const currentStatus = order.orderStatus || (order as any).status || "pending";
    const matchesStatus = statusFilter === "all" || currentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Build item tooltip text
  const getItemsTooltip = (order: Order) => {
    const items = order.products ?? (order as any).items ?? [];
    if (!items.length) return "No items";
    return items
      .map((it: any) => `${it.name || it.productName} ×${it.quantity}`)
      .join(", ");
  };

  const getItemsCount = (order: Order) => {
    const items = order.products ?? (order as any).items ?? [];
    return items.length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="font-playfair text-2xl font-bold text-brand-green-dark">
          Orders Management
          {!loading && (
            <span className="ml-3 text-sm font-inter font-normal text-muted-foreground">
              ({filteredOrders.length} of {orders.length})
            </span>
          )}
        </h2>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" /> Export CSV
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-border flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by Order ID, Name, or Email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 px-3 py-2 border border-input rounded-md text-sm bg-background w-full sm:w-[180px] focus:outline-none focus:ring-1 focus:ring-brand-green-dark"
            >
              <option value="all">All Statuses</option>
              {ALL_STATUSES.map((s) => (
                <option key={s} value={s} className="capitalize">
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin inline-block rounded-full h-8 w-8 border-b-2 border-brand-green-dark mb-3" />
            <p className="text-muted-foreground text-sm">Loading orders in real-time…</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 text-left font-semibold uppercase tracking-wide text-xs">
                    Order ID
                  </th>
                  <th className="px-5 py-3 text-left font-semibold uppercase tracking-wide text-xs">
                    Customer
                  </th>
                  <th className="px-5 py-3 text-left font-semibold uppercase tracking-wide text-xs">
                    Items
                  </th>
                  <th className="px-5 py-3 text-left font-semibold uppercase tracking-wide text-xs">
                    Date
                  </th>
                  <th className="px-5 py-3 text-left font-semibold uppercase tracking-wide text-xs">
                    Total
                  </th>
                  <th className="px-5 py-3 text-left font-semibold uppercase tracking-wide text-xs">
                    Status
                  </th>
                  <th className="px-5 py-3 text-right font-semibold uppercase tracking-wide text-xs">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredOrders.map((order) => {
                  const currentStatus: string =
                    order.orderStatus || (order as any).status || "pending";
                  const date =
                    order.createdAt?.seconds
                      ? new Date(order.createdAt.seconds * 1000)
                      : new Date();

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-muted/20 transition-colors"
                    >
                      {/* Order ID */}
                      <td className="px-5 py-4 font-medium text-brand-green-dark whitespace-nowrap">
                        {order.orderId || order.id}
                      </td>

                      {/* Customer */}
                      <td className="px-5 py-4">
                        <p className="font-medium">
                          {order.customerInfo?.name || "Guest"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {order.customerInfo?.email || "—"}
                        </p>
                        {order.customerInfo?.phone && (
                          <p className="text-xs text-muted-foreground">
                            {order.customerInfo.phone}
                          </p>
                        )}
                      </td>

                      {/* Items — count + tooltip with names */}
                      <td className="px-5 py-4">
                        <div
                          className="inline-flex items-center gap-1 cursor-help"
                          title={getItemsTooltip(order)}
                        >
                          <span className="font-medium text-brand-green-dark">
                            {getItemsCount(order)}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            {getItemsCount(order) === 1 ? "item" : "items"}
                          </span>
                        </div>
                        {/* Show first item name */}
                        {(() => {
                          const items = order.products ?? (order as any).items ?? [];
                          const first = items[0];
                          if (!first) return null;
                          return (
                            <p className="text-xs text-muted-foreground truncate max-w-[130px]">
                              {first.name || first.productName}
                              {items.length > 1 && ` +${items.length - 1} more`}
                            </p>
                          );
                        })()}
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 text-muted-foreground whitespace-nowrap">
                        <p>
                          {date.toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                        <p className="text-xs">
                          {date.toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </td>

                      {/* Total */}
                      <td className="px-5 py-4 font-bold whitespace-nowrap">
                        {formatPrice(order.total || 0)}
                      </td>

                      {/* Status — inline editable dropdown */}
                      <td className="px-5 py-4">
                        <select
                          value={currentStatus}
                          onChange={(e) =>
                            changeOrderStatus(order.id!, e.target.value)
                          }
                          className={cn(
                            "text-xs font-semibold px-2.5 py-1.5 rounded-full border cursor-pointer",
                            "focus:outline-none focus:ring-2 focus:ring-brand-green-dark/30",
                            "appearance-none pr-6 bg-no-repeat",
                            STATUS_COLORS[currentStatus] ??
                              "bg-gray-100 text-gray-700 border-gray-200"
                          )}
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                            backgroundPosition: "right 6px center",
                          }}
                        >
                          {ALL_STATUSES.map((s) => (
                            <option key={s} value={s} className="capitalize bg-white text-gray-800">
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="hover:bg-brand-green-light/20 text-brand-green-dark font-medium"
                        >
                          <Link href={`/admin/orders/${order.id}`}>
                            <Eye className="w-4 h-4 mr-1.5" />
                            Details
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  );
                })}

                {filteredOrders.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-14 text-center text-muted-foreground"
                    >
                      <Search className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      No orders found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
