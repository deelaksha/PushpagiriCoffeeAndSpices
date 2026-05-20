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
import NextImage from "next/image";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { getDocuments, addDocument, deleteDocument, updateDocument, getDocument } from "@/lib/firebase/firestore";
import { uploadImage } from "@/lib/firebase/storage";
import { Product, Order } from "@/types/firebase";

// ── Sidebar Navigation Items ──────────────────
const SIDEBAR_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: ShoppingBag, label: "Orders", id: "orders" },
  { icon: Package, label: "Products", id: "products" },
  { icon: Users, label: "Customers", id: "customers" },
  { icon: BarChart3, label: "Analytics", id: "analytics" },
  { icon: Settings, label: "Settings", id: "settings" },
];

// ── Dummy Dashboard Data (Status Colors only) ──
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
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageType, setImageType] = useState<"url" | "upload">("url");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  
  const handleViewProductClick = (product: Product) => {
    setViewProduct(product);
    setIsViewModalOpen(true);
  };
  
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    slug: "",
    price: 0,
    stock: 0,
    category: "coffee",
  });
  
  // Settings State
  const [storeSettings, setStoreSettings] = useState({
    storeName: "Pushpagiri Coffee & Spice",
    whatsappNumber: "+918277261881",
    freeShippingThreshold: 999
  });

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let finalImageUrl = imageUrl;
      
      if (imageType === "upload" && imageFile) {
        finalImageUrl = await uploadImage(imageFile, "products");
      }

      const productData = {
        ...newProduct,
        images: finalImageUrl ? [finalImageUrl] : [],
      };

      if (editingProductId) {
        await updateDocument("products", editingProductId, productData);
        setProducts(products.map(p => p.id === editingProductId ? { ...p, ...productData } as unknown as Product : p));
      } else {
        const id = await addDocument("products", productData);
        setProducts([...products, { ...productData, id } as unknown as Product]);
      }
      setIsAddModalOpen(false);
      setEditingProductId(null);
      setNewProduct({ name: "", slug: "", price: 0, stock: 0, category: "coffee" });
      setImageUrl("");
      setImageFile(null);
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteDocument("products", id);
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    }
  };

  const handleEditProductClick = (product: Product) => {
    setNewProduct({
      name: product.name,
      slug: product.slug,
      price: product.price,
      stock: product.stock,
      category: product.category as any,
    });
    setImageUrl(product.images?.[0] || "");
    setImageType(product.images?.[0] ? "url" : "upload");
    setEditingProductId(product.id);
    setIsAddModalOpen(true);
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateDocument("orders", orderId, { orderStatus: newStatus });
      setOrders(orders.map(o => o.id === orderId ? { ...o, orderStatus: newStatus as any } : o));
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status");
    }
  };

  const handleSaveSettings = async () => {
    try {
      await addDocument("settings", { id: "global", ...storeSettings });
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedProducts = await getDocuments<Product>("products");
        const fetchedOrders = await getDocuments<Order>("orders");
        const settingsDoc = await getDocument<any>("settings", "global");
        
        setProducts(fetchedProducts);
        setOrders(fetchedOrders);
        if (settingsDoc) {
          setStoreSettings({
            storeName: settingsDoc.storeName || "Pushpagiri Coffee & Spice",
            whatsappNumber: settingsDoc.whatsappNumber || "+918277261881",
            freeShippingThreshold: settingsDoc.freeShippingThreshold || 999
          });
        }
      } catch (err) {
        console.error("Failed to fetch admin data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  const STATS_DYNAMIC = [
    { label: "Total Revenue", value: formatPrice(orders.reduce((sum, o) => sum + o.total, 0)), icon: TrendingUp, change: "+18%", positive: true },
    { label: "Total Orders", value: String(orders.length), icon: ShoppingBag, change: "+12%", positive: true },
    { label: "Customers", value: String(new Set(orders.map(o => o.customerInfo?.email)).size), icon: Users, change: "+8%", positive: true },
    { label: "Products", value: String(products.length), icon: Package, change: "Active", positive: true },
  ];

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
                {STATS_DYNAMIC.map((stat, i) => (
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
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id} className="hover:bg-muted/20 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-brand-green-dark">{order.orderId}</td>
                          <td className="px-6 py-4 text-sm">{order.customerInfo?.name || 'Guest'}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{order.products?.length} items</td>
                          <td className="px-6 py-4 text-sm font-bold">{formatPrice(order.total)}</td>
                          <td className="px-6 py-4">
                            <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full capitalize", STATUS_COLORS[order.orderStatus] || "bg-gray-100 text-gray-700")}>
                              {order.orderStatus}
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
                <Button onClick={() => {
                  setEditingProductId(null);
                  setNewProduct({ name: "", slug: "", price: 0, stock: 0, category: "coffee" });
                  setImageUrl("");
                  setImageFile(null);
                  setIsAddModalOpen(true);
                }}><Plus className="w-4 h-4" /> Add Product</Button>
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
                        <tr key={product.id} className="hover:bg-muted/20 transition-colors cursor-pointer" onClick={() => handleViewProductClick(product)}>
                          <td className="px-6 py-4 flex items-center gap-4">
                                                        <NextImage src={product.images?.[0]} alt={product.name} width={60} height={60} className="object-cover rounded" />
                            <div>
                              <p className="font-medium text-sm text-brand-green-dark">{product.name}</p>
                              <p className="text-xs text-muted-foreground">{product.slug}</p>
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
                              <button onClick={(e) => { e.stopPropagation(); handleEditProductClick(product); }} className="p-1.5 hover:bg-brand-green-light/20 rounded-lg transition-colors"><Edit className="w-4 h-4 text-brand-green-dark" /></button>
                              <button onClick={(e) => { e.stopPropagation(); handleDeleteProduct(product.id); }} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4 text-red-500" /></button>
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
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-brand-green-dark">{order.orderId}</td>
                        <td className="px-6 py-4 text-sm">{order.customerInfo?.name || 'Guest'}</td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{order.products?.map(p => p.name).join(", ") || 'Items'}</td>
                        <td className="px-6 py-4 text-sm font-bold">{formatPrice(order.total)}</td>
                        <td className="px-6 py-4">
                          <select value={order.orderStatus} onChange={(e) => handleUpdateOrderStatus(order.id!, e.target.value)} className="text-xs border border-border rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-brand-green-dark capitalize">
                            {["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"].map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {order.createdAt ? new Date(order.createdAt?.seconds ? order.createdAt.seconds * 1000 : order.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
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
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-2xl shadow-card p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-brand-green-dark rounded-full flex items-center justify-center text-white font-bold">
                      {(order.customerInfo?.name || 'G').charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{order.customerInfo?.name || 'Guest'}</p>
                      <p className="text-xs text-muted-foreground">{order.customerInfo?.email || 'No email'}</p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Last Order: {order.orderId}</p>
                    <p className="font-semibold text-brand-green-dark mt-1">{formatPrice(order.total)}</p>
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
                  <div><label className="text-sm font-medium mb-1.5 block">Store Name</label><Input value={storeSettings.storeName} onChange={(e) => setStoreSettings({...storeSettings, storeName: e.target.value})} /></div>
                  <div><label className="text-sm font-medium mb-1.5 block">WhatsApp Number</label><Input value={storeSettings.whatsappNumber} onChange={(e) => setStoreSettings({...storeSettings, whatsappNumber: e.target.value})} /></div>
                  <div><label className="text-sm font-medium mb-1.5 block">Free Shipping Threshold (₹)</label><Input type="number" value={storeSettings.freeShippingThreshold} onChange={(e) => setStoreSettings({...storeSettings, freeShippingThreshold: Number(e.target.value)})} /></div>
                  <Button onClick={handleSaveSettings}>Save Settings</Button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── VIEW PRODUCT MODAL ────────────────── */}
      {isViewModalOpen && viewProduct && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold font-playfair text-brand-green-dark">Product Details</h2>
              <button onClick={() => { setIsViewModalOpen(false); setViewProduct(null); }} className="text-gray-500 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <NextImage src={viewProduct.images?.[0] ?? "/placeholder.png"} alt={viewProduct.name} width={200} height={200} className="object-cover rounded" />
              <p className="font-playfair font-semibold text-brand-green-dark text-lg">{viewProduct.name}</p>
              <p className="text-sm text-muted-foreground">{viewProduct.slug}</p>
              <p className="text-sm font-medium">{formatPrice(viewProduct.price)}</p>
              <p className="text-sm">Category: {viewProduct.category}</p>
              <p className="text-sm">Stock: {viewProduct.stock}</p>
              <div className="flex gap-2 mt-2">
                <Button onClick={() => { handleEditProductClick(viewProduct); setIsViewModalOpen(false); }} variant="default">
                  Edit
                </Button>
                <Button onClick={() => { setIsViewModalOpen(false); setViewProduct(null); }} variant="secondary">
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── ADD PRODUCT MODAL ────────────────── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold font-playfair text-brand-green-dark">{editingProductId ? "Edit Product" : "Add New Product"}</h2>
              <button onClick={() => { setIsAddModalOpen(false); setEditingProductId(null); }} className="text-gray-500 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Product Name</label>
                <Input required value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Slug URL</label>
                <Input required value={newProduct.slug} onChange={(e) => setNewProduct({ ...newProduct, slug: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Price (₹)</label>
                  <Input type="number" required value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Stock</label>
                  <Input type="number" required value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select className="w-full border border-gray-300 p-2 rounded-md" value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}>
                  <option value="coffee">Coffee</option>
                  <option value="spices">Spices</option>
                  <option value="honey">Honey</option>
                </select>
              </div>
              <div className="border border-gray-200 p-4 rounded-md">
                <label className="block text-sm font-medium mb-2">Product Image</label>
                <div className="flex gap-4 mb-3">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="radio" checked={imageType === 'url'} onChange={() => setImageType('url')} /> Image URL
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="radio" checked={imageType === 'upload'} onChange={() => setImageType('upload')} /> Upload File
                  </label>
                </div>
                {imageType === 'url' && (
                  <Input placeholder="https://example.com/image.jpg" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                )}
                {imageType === 'upload' && (
                  <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                )}
              </div>
              <Button type="submit" className="w-full mt-4" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : editingProductId ? "Save Changes" : "Add Product"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
