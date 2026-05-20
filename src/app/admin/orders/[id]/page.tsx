"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { updateDocument } from "@/lib/firebase/firestore";
import { Order } from "@/types/firebase";
import { OrderTimeline } from "@/components/admin/OrderTimeline";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer, FileText, Send, MapPin, Phone, Mail } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";
import NextImage from "next/image";
import { use } from "react";

export default function OrderDetailsPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const docRef = doc(db, "orders", params.id);
    
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        setOrder({ id: snapshot.id, ...snapshot.data() } as Order);
      } else {
        toast.error("Order not found");
        router.push("/admin/orders");
      }
      setLoading(false);
    }, (error) => {
      console.error(error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [params.id, router]);

  const handleUpdateStatus = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      await updateDocument("orders", params.id, { orderStatus: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) return <div className="p-12 text-center text-muted-foreground">Loading order details...</div>;
  if (!order) return null;

  const orderDate = order.createdAt?.seconds 
    ? new Date(order.createdAt.seconds * 1000).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
    : 'Unknown date';

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h2 className="font-playfair text-2xl font-bold text-brand-green-dark">Order {order.orderId || `#${order.id?.slice(-6)}`}</h2>
            <p className="text-sm text-muted-foreground">{orderDate}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <FileText className="w-4 h-4" /> Invoice
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Printer className="w-4 h-4" /> Print
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Items */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="font-playfair text-lg font-bold text-brand-green-dark mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.products?.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 py-2 border-b border-gray-100 last:border-0">
                  <div className="w-16 h-16 relative rounded-lg bg-gray-50 overflow-hidden shrink-0 border border-gray-100">
                    {item.images?.[0] ? (
                      <NextImage src={item.images[0]} alt={item.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No Img</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-brand-green-dark">{item.name}</p>
                    {item.selectedWeight && <p className="text-xs text-muted-foreground">Weight: {item.selectedWeight}</p>}
                    <p className="text-sm font-medium">{formatPrice(item.price)} <span className="text-muted-foreground text-xs x {item.quantity}">x {item.quantity}</span></p>
                  </div>
                  <div className="font-bold text-lg text-brand-green-dark">
                    {formatPrice(item.price * (item.quantity || 1))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-border flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatPrice(order.subtotal || order.total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">{order.shipping === 0 ? "Free" : formatPrice(order.shipping || 0)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-100 text-brand-green-dark">
                  <span>Total</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Customer & Shipping */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h3 className="font-playfair text-lg font-bold text-brand-green-dark mb-4">Customer Info</h3>
              <div className="space-y-3">
                <p className="font-bold text-gray-800">{order.customerInfo?.name}</p>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4 text-brand-green-light" />
                  {order.customerInfo?.email || 'N/A'}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4 text-brand-green-light" />
                  {order.customerInfo?.phone || 'N/A'}
                </div>
                {order.customerInfo?.phone && (
                  <Button variant="outline" size="sm" className="w-full mt-2 gap-2 border-green-200 text-green-700 hover:bg-green-50" onClick={() => window.open(`https://wa.me/${order.customerInfo?.phone.replace(/\D/g, '')}`, '_blank')}>
                    <Send className="w-3 h-3" /> Message on WhatsApp
                  </Button>
                )}
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h3 className="font-playfair text-lg font-bold text-brand-green-dark mb-4">Shipping Address</h3>
              {order.shippingAddress ? (
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-brand-green-light mt-0.5 shrink-0" />
                    <div>
                      <p>{order.shippingAddress.line1}</p>
                      {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                      <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postal_code}</p>
                      <p>{order.shippingAddress.country}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">No shipping address provided</p>
              )}
            </div>
          </div>
          
        </div>
        
        {/* Right Column - Status & Timeline */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="font-playfair text-lg font-bold text-brand-green-dark mb-4">Update Status</h3>
            <select 
              className="w-full h-10 px-3 py-2 border border-input rounded-md text-sm bg-background mb-4"
              value={order.orderStatus || 'pending'}
              onChange={(e) => handleUpdateStatus(e.target.value)}
              disabled={isUpdating}
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            
            {order.paymentInfo && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Payment Info</p>
                <div className="flex justify-between text-sm mb-1">
                  <span>Method</span>
                  <span className="font-medium uppercase">{order.paymentInfo.method}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Status</span>
                  <span className="font-medium capitalize text-green-600">Paid</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="font-playfair text-lg font-bold text-brand-green-dark mb-4">Order Timeline</h3>
            <OrderTimeline currentStatus={order.orderStatus || 'pending'} />
          </div>
        </div>
        
      </div>
    </div>
  );
}
