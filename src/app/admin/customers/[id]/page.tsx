"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { doc, onSnapshot, collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { UserProfile } from "@/types/user";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, MapPin, Package, ShoppingCart, User as UserIcon, Phone } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";
import { use } from "react";

export default function CustomerDetailsPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const router = useRouter();
  const [customer, setCustomer] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch Customer Profile
    const docRef = doc(db, "users", params.id);
    const unsubscribeCustomer = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        setCustomer({ uid: snapshot.id, ...snapshot.data() } as UserProfile);
      } else {
        toast.error("Customer not found");
        router.push("/admin/customers");
      }
      setLoading(false);
    });

    // 2. Fetch Customer's Orders
    const fetchOrders = async () => {
      try {
        const q = query(
          collection(db, "orders"),
          where("userId", "==", params.id),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        const fetchedOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Error fetching customer orders:", error);
      }
    };
    
    fetchOrders();

    return () => unsubscribeCustomer();
  }, [params.id, router]);

  if (loading) return <div className="p-12 text-center text-muted-foreground">Loading customer details...</div>;
  if (!customer) return null;

  const joinedDate = customer.createdAt?.seconds 
    ? new Date(customer.createdAt.seconds * 1000).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Unknown date';

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/customers" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h2 className="font-playfair text-2xl font-bold text-brand-green-dark">Customer Profile</h2>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {customer.email && (
            <Button variant="outline" size="sm" className="gap-2" asChild>
              <a href={`mailto:${customer.email}`}><Mail className="w-4 h-4" /> Email</a>
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Profile Summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-card p-6 text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 right-0 h-24 bg-brand-green-light/20" />
             <div className="relative z-10">
               <div className="w-24 h-24 mx-auto bg-white rounded-full p-1 mb-4 shadow-sm">
                 {customer.photoURL ? (
                   <img src={customer.photoURL} alt={customer.name || 'Customer'} className="w-full h-full rounded-full object-cover" />
                 ) : (
                   <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center">
                     <UserIcon className="w-10 h-10 text-gray-400" />
                   </div>
                 )}
               </div>
               <h3 className="font-playfair text-xl font-bold text-gray-800">{customer.name || 'Unknown'}</h3>
               <p className="text-sm text-gray-500 mb-2">{customer.email || 'No email provided'}</p>
               
               <div className="flex items-center justify-center gap-2 text-xs text-gray-500 bg-gray-50 py-1 px-3 rounded-full w-max mx-auto mt-2">
                 <span>Joined: {joinedDate}</span>
               </div>
             </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="font-playfair text-lg font-bold text-brand-green-dark mb-4">Contact Info</h3>
            <div className="space-y-4 text-sm text-gray-600">
              {customer.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-brand-green-light" />
                  <span>{customer.phone}</span>
                </div>
              )}
              <div className="flex items-start gap-3">
                 <MapPin className="w-4 h-4 text-brand-green-light mt-1 shrink-0" />
                 <div>
                   {customer.address ? (
                     <>
                      <p>{customer.address.line1}</p>
                      {customer.address.line2 && <p>{customer.address.line2}</p>}
                      <p>{customer.address.city}, {customer.address.state} {customer.address.postal_code}</p>
                     </>
                   ) : (
                     <p className="text-gray-400 italic">No saved address.</p>
                   )}
                 </div>
              </div>
            </div>
          </div>
          
        </div>
        
        {/* Right Column - Stats & History */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-6 shadow-card flex items-center gap-4 border-l-4 border-brand-green-light">
               <div className="w-12 h-12 bg-green-50 text-brand-green-dark rounded-full flex items-center justify-center shrink-0">
                 <ShoppingCart className="w-6 h-6" />
               </div>
               <div>
                 <p className="text-sm text-gray-500 font-medium">Total Orders</p>
                 <p className="text-2xl font-bold text-gray-900">{customer.totalOrders || 0}</p>
               </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-card flex items-center gap-4 border-l-4 border-brand-brown">
               <div className="w-12 h-12 bg-amber-50 text-brand-brown rounded-full flex items-center justify-center shrink-0">
                 <span className="font-bold text-xl">₹</span>
               </div>
               <div>
                 <p className="text-sm text-gray-500 font-medium">Lifetime Value</p>
                 <p className="text-2xl font-bold text-gray-900">{formatPrice(customer.totalSpent || 0)}</p>
               </div>
            </div>
          </div>
          
          {/* Order History Table */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="font-playfair text-lg font-bold text-brand-green-dark mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" /> Order History
            </h3>
            
            {orders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                This customer hasn't placed any orders yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500 border-y border-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">Order ID</th>
                      <th className="px-4 py-3 text-left font-medium">Date</th>
                      <th className="px-4 py-3 text-left font-medium">Status</th>
                      <th className="px-4 py-3 text-right font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.map(order => {
                      const orderDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) : "Unknown";
                      return (
                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 font-medium text-brand-green-dark">
                            <Link href={`/admin/orders/${order.id}`} className="hover:underline">
                              {order.orderId || `#${order.id.slice(-6)}`}
                            </Link>
                          </td>
                          <td className="px-4 py-3 text-gray-500">{orderDate}</td>
                          <td className="px-4 py-3">
                            <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-1 bg-gray-100 text-gray-700 rounded-full border border-gray-200">
                              {order.orderStatus || 'pending'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right font-semibold">{formatPrice(order.total)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
