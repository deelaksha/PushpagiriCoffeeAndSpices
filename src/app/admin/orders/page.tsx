"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Eye, Filter, Download } from "lucide-react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Order } from "@/types/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice, cn } from "@/lib/utils";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  confirmed: "bg-blue-100 text-blue-700 border-blue-200",
  processing: "bg-purple-100 text-purple-700 border-purple-200",
  shipped: "bg-indigo-100 text-indigo-700 border-indigo-200",
  delivered: "bg-green-100 text-green-700 border-green-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedOrders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      setOrders(fetchedOrders);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching orders in real-time:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderId?.toLowerCase().includes(search.toLowerCase()) ||
      order.customerInfo?.name?.toLowerCase().includes(search.toLowerCase()) ||
      order.customerInfo?.email?.toLowerCase().includes(search.toLowerCase());
      
    const matchesStatus = statusFilter === "all" || order.orderStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="font-playfair text-2xl font-bold text-brand-green-dark">Orders Management</h2>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" /> Export CSV
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
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
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-muted-foreground">Loading orders...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold uppercase tracking-wide">Order ID</th>
                  <th className="px-6 py-3 text-left font-semibold uppercase tracking-wide">Customer</th>
                  <th className="px-6 py-3 text-left font-semibold uppercase tracking-wide">Date</th>
                  <th className="px-6 py-3 text-left font-semibold uppercase tracking-wide">Total</th>
                  <th className="px-6 py-3 text-left font-semibold uppercase tracking-wide">Status</th>
                  <th className="px-6 py-3 text-right font-semibold uppercase tracking-wide">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredOrders.map((order) => {
                  const date = order.createdAt?.seconds 
                    ? new Date(order.createdAt.seconds * 1000) 
                    : new Date();
                    
                  return (
                    <tr key={order.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4 font-medium text-brand-green-dark">{order.orderId || order.id}</td>
                      <td className="px-6 py-4">
                        <p className="font-medium">{order.customerInfo?.name || 'Guest'}</p>
                        <p className="text-xs text-muted-foreground">{order.customerInfo?.email || 'No email'}</p>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        <p className="text-xs">{date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                      </td>
                      <td className="px-6 py-4 font-bold">{formatPrice(order.total || 0)}</td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "text-[10px] font-semibold px-2.5 py-1 rounded-full capitalize border",
                          STATUS_COLORS[order.orderStatus || 'pending'] || "bg-gray-100 text-gray-700 border-gray-200"
                        )}>
                          {order.orderStatus || 'pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" asChild className="hover:bg-brand-green-light/20 text-brand-green-dark font-medium">
                          <Link href={`/admin/orders/${order.id}`}>
                            <Eye className="w-4 h-4 mr-2" /> View Details
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  )
                })}
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
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
