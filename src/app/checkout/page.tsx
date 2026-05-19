"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Check, MessageCircle, ShoppingBag, MapPin, User, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCartStore } from "@/store/cartStore";
import { checkoutSchema, type CheckoutFormData } from "@/lib/validations";
import { formatPrice, generateWhatsAppOrderUrl, generateOrderNumber } from "@/lib/utils";
import { BRAND } from "@/constants";

const INDIAN_STATES = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu and Kashmir","Ladakh","Puducherry"];

export default function CheckoutPage() {
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const { items, total, clearCart } = useCartStore();
  const cartTotal = total();
  const shipping = cartTotal >= 999 ? 0 : 80;
  const grandTotal = cartTotal + shipping;

  const { register, handleSubmit, getValues, formState: { errors, isSubmitting } } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit = async (data: CheckoutFormData) => {
    await new Promise((r) => setTimeout(r, 1500));
    // TODO: Save order to Firebase Firestore
    const num = generateOrderNumber();
    setOrderNumber(num);
    setOrderPlaced(true);
    clearCart();
  };

  const handleWhatsAppOrder = () => {
    const values = getValues();
    const itemsList = items.map(i => `• ${i.product.name} (${i.selectedWeight}) x${i.quantity} = ${formatPrice(i.price * i.quantity)}`).join("\n");
    const msg = `🌿 *New Order - Pushpagiri Coffee & Spice*\n\n*Customer:* ${values.fullName || "Not filled"}\n*Phone:* ${values.phone || "Not filled"}\n*Address:* ${values.addressLine1 || ""}, ${values.city || ""}, ${values.state || ""} - ${values.pincode || ""}\n\n*Items:*\n${itemsList}\n\n*Total: ${formatPrice(grandTotal)}*\n\nPlease confirm this order!`;
    window.open(generateWhatsAppOrderUrl(BRAND.whatsapp, msg), "_blank");
  };

  // Success Screen
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl shadow-card-hover p-12 text-center max-w-lg mx-4">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h1 className="font-playfair text-3xl font-bold text-brand-green-dark mb-3">Order Placed! 🎉</h1>
          <p className="font-inter text-muted-foreground mb-2">Order Number: <strong className="text-brand-green-dark">{orderNumber}</strong></p>
          <p className="font-inter text-sm text-muted-foreground mb-8">
            We&apos;ll contact you on WhatsApp shortly to confirm your order and payment details.
          </p>
          <div className="flex flex-col gap-3">
            <Button variant="whatsapp" asChild>
              <a href={`https://wa.me/${BRAND.whatsapp}`} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-4 h-4" /> Chat with Us on WhatsApp
              </a>
            </Button>
            <Button variant="outline" asChild><Link href="/shop"><ShoppingBag className="w-4 h-4" /> Continue Shopping</Link></Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-brand-cream">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="font-playfair text-2xl font-bold text-brand-green-dark mb-3">No items to checkout</h2>
        <Button asChild><Link href="/shop">Browse Products</Link></Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream py-10">
      <div className="container-custom">
        <h1 className="font-playfair text-3xl font-bold text-brand-green-dark mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* ── Form ─────────────────────────────── */}
          <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 space-y-6">
            {/* Personal Info */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h2 className="font-playfair text-xl font-bold text-brand-green-dark mb-5 flex items-center gap-2"><User className="w-5 h-5" /> Personal Information</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-inter text-sm font-medium mb-1.5 block">Full Name *</label>
                  <Input {...register("fullName")} placeholder="Your full name" />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                </div>
                <div>
                  <label className="font-inter text-sm font-medium mb-1.5 block">Email *</label>
                  <Input {...register("email")} type="email" placeholder="your@email.com" />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="font-inter text-sm font-medium mb-1.5 block">Phone Number *</label>
                  <Input {...register("phone")} placeholder="10-digit mobile number" maxLength={10} />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h2 className="font-playfair text-xl font-bold text-brand-green-dark mb-5 flex items-center gap-2"><MapPin className="w-5 h-5" /> Shipping Address</h2>
              <div className="space-y-4">
                <div>
                  <label className="font-inter text-sm font-medium mb-1.5 block">Address Line 1 *</label>
                  <Input {...register("addressLine1")} placeholder="House/Flat no., Street name" />
                  {errors.addressLine1 && <p className="text-red-500 text-xs mt-1">{errors.addressLine1.message}</p>}
                </div>
                <div>
                  <label className="font-inter text-sm font-medium mb-1.5 block">Address Line 2</label>
                  <Input {...register("addressLine2")} placeholder="Landmark, Area (optional)" />
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="font-inter text-sm font-medium mb-1.5 block">City *</label>
                    <Input {...register("city")} placeholder="City" />
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                  </div>
                  <div>
                    <label className="font-inter text-sm font-medium mb-1.5 block">State *</label>
                    <select {...register("state")} className="h-11 w-full rounded-xl border border-input px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-dark">
                      <option value="">Select State</option>
                      {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
                  </div>
                  <div>
                    <label className="font-inter text-sm font-medium mb-1.5 block">PIN Code *</label>
                    <Input {...register("pincode")} placeholder="6-digit PIN" maxLength={6} />
                    {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode.message}</p>}
                  </div>
                </div>
                <div>
                  <label className="font-inter text-sm font-medium mb-1.5 block">Order Notes (Optional)</label>
                  <Textarea {...register("orderNotes")} placeholder="Special instructions, delivery time preference, etc." rows={3} />
                </div>
              </div>
            </div>

            {/* Payment Notice */}
            <div className="bg-brand-green-light/20 border border-brand-green-light rounded-2xl p-5">
              <h3 className="font-playfair font-bold text-brand-green-dark mb-2">💳 Payment Information</h3>
              <p className="font-inter text-sm text-muted-foreground">
                After placing your order, we&apos;ll contact you via WhatsApp to confirm and share payment details (UPI, Bank Transfer, or COD). Online payment gateway coming soon.
              </p>
            </div>

            <div className="flex gap-4">
              <Button type="submit" size="lg" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? "Placing Order..." : "Place Order"}
              </Button>
              <Button type="button" size="lg" variant="whatsapp" onClick={handleWhatsAppOrder}>
                <MessageCircle className="w-5 h-5" /> Order via WhatsApp
              </Button>
            </div>
          </form>

          {/* ── Order Summary ─────────────────────── */}
          <div>
            <div className="bg-white rounded-2xl shadow-card p-6 sticky top-24">
              <h2 className="font-playfair text-xl font-bold text-brand-green-dark mb-5">Order Summary</h2>
              <div className="space-y-4 mb-5">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-brand-cream shrink-0">
                      <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" sizes="56px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-inter text-sm font-medium text-brand-green-dark truncate">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">{item.selectedWeight} × {item.quantity}</p>
                    </div>
                    <p className="font-inter font-bold text-sm shrink-0">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="h-px bg-border mb-4" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(cartTotal)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className={shipping === 0 ? "text-green-600" : ""}>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span></div>
                <div className="h-px bg-border my-2" />
                <div className="flex justify-between font-bold text-base"><span>Total</span><span className="text-brand-green-dark font-playfair text-xl">{formatPrice(grandTotal)}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
