"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  LayoutDashboard, Package, ShoppingBag, Users, BarChart3,
  Menu, X, Leaf, TrendingUp, TrendingDown, Eye, Edit, Trash2,
  Plus, Search, Bell, Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PRODUCTS } from "@/constants";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

// ── Sidebar Navigation Items ──────────────────
const SIDEBAR_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: ShoppingBag, label: "Orders", id: "orders" },
  { icon: Package, label: "Products", id: "products" },
  { icon: Users, label: "Customers", id: "customers" },
  { icon: BarChart3, label: "Analytics", id: "analytics" },
  { icon: Settings, label: "Settings", id: "settings" },
];

// ── Dummy Dashboard Data ──────────────────────
const STATS = [
  { label: "Total Revenue", value: "₹1,28,450", icon: TrendingUp, change: "+18%", positive: true },
  { label: "Total Orders", value: "284", icon: ShoppingBag, change: "+12%", positive: true },
  { label: "Customers", value: "196", icon: Users, change: "+8%", positive: true },
  { label: "Products", value: String(PRODUCTS.length), icon: Package, change: "Active", positive: true },
];

const RECENT_ORDERS = [
  { id: "PCS-001", customer: "Priya Sharma", product: "Arabica Coffee 250g", total: "₹450", status: "delivered" },
  { id: "PCS-002", customer: "Rajesh Nair", product: "Filter Coffee 500g × 2", total: "₹1,398", status: "processing" },
  { id: "PCS-003", customer: "Ananya K.", product: "Spice Master Collection", total: "₹1,299", status: "shipped" },
  { id: "PCS-004", customer: "Deepak Menon", product: "Black Pepper 250g", total: "₹620", status: "pending" },
  { id: "PCS-005", customer: "Kavya Reddy", product: "Cardamom 50g", total: "₹650", status: "confirmed" },
];

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-purple-100 text-purple-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

// ── Admin Layout + Dashboard ──────────────────
export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [productSearch, setProductSearch] = useState("");

  const filteredProducts = PRODUCTS.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* ── Sidebar ──────────────────────────── */}
      <>
        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        <aside className={cn(
          "admin-sidebar fixed lg:static inset-y-0 left-0 z-50 w-64 flex-col flex transition-transform duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}>
          {/* Logo */}
          <div className="px-6 py-6 border-b border-white/10">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                <Leaf className="w-5 h-5 text-brand-green-light" />
              </div>
              <div>
                <p className="font-playfair text-sm font-bold text-white">Pushpagiri</p>
                <p className="font-inter text-xs text-white/50">Admin Panel</p>
              </div>
            </Link>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {SIDEBAR_ITEMS.map((item) => (
              <button key={item.id} onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                  activeTab === item.id
                    ? "bg-white/20 text-white"
                    : "text-white/60 hover:bg-white/10 hover:text-white"
                )}>
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-white/10">
            <Link href="/" className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors">
              <Eye className="w-4 h-4" /> View Store
            </Link>
          </div>
        </aside>
      </>

      {/* ── Main Content ─────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-border px-6 py-4 flex items-center gap-4">
          <button className="lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="font-playfair text-xl font-bold text-brand-green-dark capitalize">
            {SIDEBAR_ITEMS.find((i) => i.id === activeTab)?.label}
          </h1>
          <div className="ml-auto flex items-center gap-3">
            <button className="relative">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">3</span>
            </button>
            <div className="w-9 h-9 bg-brand-green-dark rounded-full flex items-center justify-center text-white font-bold text-sm">A</div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* ── DASHBOARD ─────────────────────── */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {STATS.map((stat, i) => (
                  <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    className="bg-white rounded-2xl p-5 shadow-card">
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
                  <Button size="sm" variant="outline" onClick={() => setActiveTab("orders")}>View All</Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        {["Order ID", "Customer", "Product", "Total", "Status"].map((h) => (
                          <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {RECENT_ORDERS.map((order) => (
                        <tr key={order.id} className="hover:bg-muted/20 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-brand-green-dark">{order.id}</td>
                          <td className="px-6 py-4 text-sm">{order.customer}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{order.product}</td>
                          <td className="px-6 py-4 text-sm font-bold">{order.total}</td>
                          <td className="px-6 py-4">
                            <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full capitalize", STATUS_COLORS[order.status])}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Charts placeholder */}
              <div className="grid md:grid-cols-2 gap-6">
                {["Revenue Overview", "Top Selling Products"].map((chart) => (
                  <div key={chart} className="bg-white rounded-2xl shadow-card p-6">
                    <h3 className="font-playfair font-bold text-brand-green-dark mb-4">{chart}</h3>
                    <div className="h-48 bg-brand-cream rounded-xl flex items-center justify-center text-muted-foreground text-sm">
                      📊 Chart placeholder — Connect Recharts with Firebase data
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── PRODUCTS ──────────────────────── */}
          {activeTab === "products" && (
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search products..." value={productSearch} onChange={(e) => setProductSearch(e.target.value)} className="pl-10" />
                </div>
                <Button><Plus className="w-4 h-4" /> Add Product</Button>
              </div>

              <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        {["Product", "Category", "Price", "Stock", "Status", "Actions"].map((h) => (
                          <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-muted/20 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-sm text-brand-green-dark">{product.name}</p>
                              <p className="text-xs text-muted-foreground">{product.sku}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm capitalize">{product.category.replace("-", " ")}</td>
                          <td className="px-6 py-4 text-sm font-bold">{formatPrice(product.price)}</td>
                          <td className="px-6 py-4 text-sm">{product.stock}</td>
                          <td className="px-6 py-4">
                            <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full", product.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
                              {product.stock > 0 ? "In Stock" : "Out of Stock"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button className="p-1.5 hover:bg-brand-green-light/20 rounded-lg transition-colors"><Edit className="w-4 h-4 text-brand-green-dark" /></button>
                              <button className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4 text-red-500" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── ORDERS ────────────────────────── */}
          {activeTab === "orders" && (
            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      {["Order ID", "Customer", "Items", "Total", "Status", "Date"].map((h) => (
                        <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {RECENT_ORDERS.map((order) => (
                      <tr key={order.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-brand-green-dark">{order.id}</td>
                        <td className="px-6 py-4 text-sm">{order.customer}</td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{order.product}</td>
                        <td className="px-6 py-4 text-sm font-bold">{order.total}</td>
                        <td className="px-6 py-4">
                          <select defaultValue={order.status} className="text-xs border border-border rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-brand-green-dark capitalize">
                            {["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"].map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">May 2026</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── CUSTOMERS ─────────────────────── */}
          {activeTab === "customers" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {RECENT_ORDERS.map((order) => (
                <div key={order.id} className="bg-white rounded-2xl shadow-card p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-brand-green-dark rounded-full flex items-center justify-center text-white font-bold">
                      {order.customer.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{order.customer}</p>
                      <p className="text-xs text-muted-foreground">{order.id}</p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Last Order: {order.product}</p>
                    <p className="font-semibold text-brand-green-dark mt-1">{order.total}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── ANALYTICS ─────────────────────── */}
          {activeTab === "analytics" && (
            <div className="grid md:grid-cols-2 gap-6">
              {["Revenue Over Time", "Orders by Category", "Customer Acquisition", "Top Products by Revenue"].map((chart) => (
                <div key={chart} className="bg-white rounded-2xl shadow-card p-6">
                  <h3 className="font-playfair font-bold text-brand-green-dark mb-4">{chart}</h3>
                  <div className="h-56 bg-brand-cream rounded-xl flex flex-col items-center justify-center text-muted-foreground text-sm gap-2">
                    <span className="text-4xl">📊</span>
                    <p className="font-medium">{chart}</p>
                    <p className="text-xs text-center px-4">Connect Recharts with Firebase Firestore data to display analytics</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── SETTINGS ──────────────────────── */}
          {activeTab === "settings" && (
            <div className="max-w-2xl space-y-6">
              <div className="bg-white rounded-2xl shadow-card p-6">
                <h3 className="font-playfair text-xl font-bold text-brand-green-dark mb-5">Store Settings</h3>
                <div className="space-y-4">
                  <div><label className="text-sm font-medium mb-1.5 block">Store Name</label><Input defaultValue="Pushpagiri Coffee & Spice" /></div>
                  <div><label className="text-sm font-medium mb-1.5 block">WhatsApp Number</label><Input defaultValue="+918277261881" /></div>
                  <div><label className="text-sm font-medium mb-1.5 block">Free Shipping Threshold (₹)</label><Input type="number" defaultValue="999" /></div>
                  <Button>Save Settings</Button>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-card p-6">
                <h3 className="font-playfair text-xl font-bold text-brand-green-dark mb-3">Firebase Integration</h3>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
                  <p className="font-semibold mb-1">⚠️ Firebase Not Connected</p>
                  <p>Configure your Firebase credentials in <code className="bg-amber-100 px-1 rounded">/src/lib/firebase.ts</code> to enable database, auth, and storage.</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
