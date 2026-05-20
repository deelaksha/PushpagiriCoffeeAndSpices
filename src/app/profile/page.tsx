"use client";

import { useAuthStore } from "@/store/authStore";
import { User, Package, MapPin, Edit, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getDocuments } from "@/lib/firebase/firestore";
import { where, orderBy } from "firebase/firestore";
import { formatPrice } from "@/lib/utils";

export default function ProfilePage() {
  const { user, userProfile, isLoading, setUser } = useAuthStore();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        try {
          const userOrders = await getDocuments("orders", [
            where("userId", "==", user.uid),
            orderBy("createdAt", "desc")
          ]);
          setOrders(userOrders);
        } catch (error) {
          console.error("Failed to fetch orders:", error);
        } finally {
          setLoadingOrders(false);
        }
      }
    };
    fetchOrders();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      toast.success("Logged out successfully");
      router.push("/");
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-brand-cream">
        <p className="font-playfair text-xl text-brand-green-dark animate-pulse">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream py-12">
      <div className="container-custom max-w-5xl">
        <h1 className="font-playfair text-3xl font-bold text-brand-green-dark mb-8">My Account</h1>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-card text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-24 bg-brand-green-dark/10" />
              <div className="relative z-10">
                <div className="w-24 h-24 mx-auto bg-white rounded-full p-1 mb-4 shadow-sm">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={userProfile?.name || "User"} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <div className="w-full h-full rounded-full bg-brand-green-light/20 flex items-center justify-center text-brand-green-dark text-2xl font-bold">
                      {userProfile?.name?.charAt(0) || user.email?.charAt(0) || "U"}
                    </div>
                  )}
                </div>
                <h2 className="font-playfair text-xl font-bold text-gray-800">{userProfile?.name || "Customer"}</h2>
                <p className="text-sm text-gray-500 mb-6">{user.email}</p>
                
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" size="sm" className="gap-2 w-full text-xs" onClick={() => toast.info("Profile editing coming soon!")}>
                    <Edit className="w-3 h-3" /> Edit Profile
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-3xl shadow-card overflow-hidden">
              <nav className="flex flex-col">
                <button className="flex items-center gap-3 px-6 py-4 text-brand-green-dark bg-brand-green-light/10 font-medium border-l-4 border-brand-green-dark text-left">
                  <Package className="w-5 h-5" /> Order History
                </button>
                <button className="flex items-center gap-3 px-6 py-4 text-gray-600 hover:bg-gray-50 transition-colors text-left" onClick={() => toast.info("Address book coming soon!")}>
                  <MapPin className="w-5 h-5" /> Saved Addresses
                </button>
                <button className="flex items-center gap-3 px-6 py-4 text-red-600 hover:bg-red-50 transition-colors text-left border-t border-gray-100" onClick={handleLogout}>
                  <LogOut className="w-5 h-5" /> Log Out
                </button>
              </nav>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-3xl p-6 shadow-card flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{userProfile?.totalOrders || 0}</p>
                </div>
              </div>
              <div className="bg-white rounded-3xl p-6 shadow-card flex items-center gap-4">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center shrink-0">
                  <span className="font-bold text-xl">₹</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">{formatPrice(userProfile?.totalSpent || 0)}</p>
                </div>
              </div>
            </div>
            
            {/* Order History */}
            <div className="bg-white rounded-3xl p-6 shadow-card">
              <h3 className="font-playfair text-xl font-bold text-brand-green-dark mb-6">Recent Orders</h3>
              
              {loadingOrders ? (
                <div className="py-8 text-center text-muted-foreground animate-pulse">Loading orders...</div>
              ) : orders.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
                  <Button asChild><Link href="/shop">Start Shopping</Link></Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => {
                    const date = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) : "Unknown date";
                    return (
                      <div key={order.id} className="border border-gray-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-brand-green-light transition-colors">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-brand-green-dark">{order.orderId}</span>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">{order.orderStatus}</span>
                          </div>
                          <p className="text-sm text-gray-500">{date} • {order.products?.length || 0} items</p>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                          <span className="font-bold">{formatPrice(order.total)}</span>
                          <Button variant="outline" size="sm">View Details</Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
