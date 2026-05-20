"use client";

import { useState, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Check, MessageCircle, ShoppingBag, MapPin, User,
  Download, Printer, ExternalLink, Loader2, Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCartStore } from "@/store/cartStore";
import { checkoutSchema, type CheckoutFormData } from "@/lib/validations";
import { formatPrice, generateWhatsAppOrderUrl } from "@/lib/utils";
import { BRAND } from "@/constants";
import { useAuth } from "@/providers/AuthProvider";
import InvoiceTemplate from "@/components/invoice/InvoiceTemplate";
import { generateInvoicePDF, downloadInvoicePDF, buildInvoiceFileName } from "@/components/invoice/InvoicePDFGenerator";
import type { OrderEmailData } from "@/lib/invoiceHelpers";

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
  "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
  "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi",
  "Jammu and Kashmir","Ladakh","Puducherry",
];

const INVOICE_ELEMENT_ID = "pushpagiri-invoice-template";

// ─── Success Screen ───────────────────────────────────────────────────────────

interface SuccessScreenProps {
  orderNumber: string;
  firestoreDocId: string;
  orderData: OrderEmailData;
  invoiceNumber: string;
  onDownload: () => Promise<void>;
  isDownloading: boolean;
}

function SuccessScreen({
  orderNumber,
  firestoreDocId,
  orderData,
  invoiceNumber,
  onDownload,
  isDownloading,
}: SuccessScreenProps) {
  const whatsappUrl = generateWhatsAppOrderUrl(
    BRAND.whatsapp,
    `Hi, I placed an order ${orderNumber}. Could you confirm it?`
  );
  const invoiceUrl = `/api/invoice/${firestoreDocId}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0F7F0] via-[#F8F5F0] to-[#EDF5ED] flex items-center justify-center p-4">
      {/* Hidden Invoice Template — rendered off-screen for PDF capture */}
      <div
        style={{
          position: "absolute",
          left: "-9999px",
          top: 0,
          visibility: "visible",
          pointerEvents: "none",
        }}
        aria-hidden="true"
      >
        <div id={INVOICE_ELEMENT_ID}>
          <InvoiceTemplate order={orderData} />
        </div>
      </div>

      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-xl"
      >
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Green Header Band */}
          <div className="bg-gradient-to-br from-[#2D4A2D] via-[#3A5A40] to-[#4A7A55] px-8 py-10 text-center relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/5 rounded-full" />
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-white/5 rounded-full" />

            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-white/15 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-5 border-2 border-white/20"
            >
              <Check className="w-10 h-10 text-white" strokeWidth={3} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <div className="inline-flex items-center gap-2 bg-[#A8D5BA]/20 border border-[#A8D5BA]/40 rounded-full px-4 py-1.5 mb-4">
                <span className="w-2 h-2 bg-[#A8D5BA] rounded-full animate-pulse" />
                <span className="text-[#A8D5BA] text-xs font-bold tracking-widest uppercase">Order Confirmed</span>
              </div>
              <h1 className="text-white text-2xl font-bold mb-1">Thank you! Your order is placed 🎉</h1>
              <p className="text-[#A8D5BA] text-sm">
                We'll reach out on WhatsApp shortly to confirm payment &amp; delivery.
              </p>
            </motion.div>
          </div>

          {/* Order Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="px-8 py-6 border-b border-[#E8EDE8]"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#F6FBF6] rounded-xl p-4 border border-[#C8E6C9]">
                <p className="text-xs text-[#6B8F73] font-semibold uppercase tracking-wider mb-1">Order Number</p>
                <p className="font-bold text-[#2D4A2D] text-sm">{orderNumber}</p>
              </div>
              <div className="bg-[#F6FBF6] rounded-xl p-4 border border-[#C8E6C9]">
                <p className="text-xs text-[#6B8F73] font-semibold uppercase tracking-wider mb-1">Invoice Number</p>
                <p className="font-bold text-[#2D4A2D] text-sm">{invoiceNumber}</p>
              </div>
            </div>

            <div className="mt-4 bg-[#FEF9E7] border border-[#F9E79F] rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#8B6914] shrink-0 mt-0.5" />
                <p className="text-[#8B6914] text-sm">
                  <span className="font-semibold">Confirmation email sent!</span> Check your inbox for
                  your order details and the attached invoice PDF.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="px-8 py-6 space-y-3"
          >
            <h3 className="text-xs font-bold text-[#6B7280] uppercase tracking-widest mb-4">Invoice Actions</h3>

            {/* Download Invoice */}
            <button
              onClick={onDownload}
              disabled={isDownloading}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#3A5A40] to-[#4A7A55] hover:from-[#2D4A2D] hover:to-[#3A5A40] text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isDownloading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Generating PDF…</>
              ) : (
                <><Download className="w-4 h-4" /> Download Invoice PDF</>
              )}
            </button>

            {/* Print Invoice */}
            <a
              href={invoiceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-3 bg-[#F6FBF6] hover:bg-[#EDF7EE] text-[#2D4A2D] font-semibold py-3.5 rounded-xl transition-all duration-200 border border-[#C8E6C9]"
            >
              <Printer className="w-4 h-4" />
              View &amp; Print Invoice
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </a>

            <div className="grid grid-cols-2 gap-3 pt-1">
              {/* WhatsApp */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold py-3 rounded-xl transition-all duration-200 text-sm shadow"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp Us
              </a>

              {/* Continue Shopping */}
              <Link
                href="/shop"
                className="flex items-center justify-center gap-2 bg-[#6F4E37] hover:bg-[#5a3e2b] text-white font-semibold py-3 rounded-xl transition-all duration-200 text-sm shadow"
              >
                <ShoppingBag className="w-4 h-4" />
                Shop More
              </Link>
            </div>
          </motion.div>

          {/* Footer Note */}
          <div className="bg-[#F6FBF6] px-8 py-4 border-t border-[#E8EDE8] text-center">
            <p className="text-xs text-[#9CA3AF]">
              🌿 <span className="text-[#6B8F73] font-medium">Pushpagiri Coffee &amp; Spice</span> — From the Misty Hills of Coorg
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Checkout Page ───────────────────────────────────────────────────────

export default function CheckoutPage() {
  const { user } = useAuth();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [firestoreDocId, setFirestoreDocId] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [orderEmailData, setOrderEmailData] = useState<OrderEmailData | null>(null);

  const { items, total, clearCart } = useCartStore();
  const cartTotal = total();
  const shipping   = cartTotal >= 999 ? 0 : 80;
  const grandTotal = cartTotal + shipping;

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>({ resolver: zodResolver(checkoutSchema) });

  // ── Handle Download ──────────────────────────────────────────────────────
  const handleDownload = useCallback(async () => {
    if (!orderEmailData) return;
    setIsDownloading(true);
    try {
      await downloadInvoicePDF(
        INVOICE_ELEMENT_ID,
        buildInvoiceFileName(orderEmailData)
      );
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setIsDownloading(false);
    }
  }, [orderEmailData]);

  // ── Submit Handler ───────────────────────────────────────────────────────
  const onSubmit = async (data: CheckoutFormData) => {
    try {
      // 1. Build formatted address string
      const fullAddress = [
        data.addressLine1,
        data.addressLine2,
        data.city,
        data.state,
        data.pincode,
        "India",
      ].filter(Boolean).join(", ");

      // 2. Build order payload for Firestore
      const orderPayload = {
        userId: user?.uid || "guest",
        customerInfo: {
          name:  data.fullName,
          email: data.email,
          phone: data.phone,
        },
        shippingAddress: {
          street:  data.addressLine1 + (data.addressLine2 ? `, ${data.addressLine2}` : ""),
          city:    data.city,
          state:   data.state,
          zipCode: data.pincode,
          country: "India",
        },
        products: items,
        subtotal:      cartTotal,
        shippingCharge: shipping,
        total:         grandTotal,
        orderNotes:    data.orderNotes,
        paymentMethod: "whatsapp",
        paymentStatus: "pending",
        orderStatus:   "processing",
      };

      // 3. Save order to Firestore
      const orderRes = await fetch("/api/orders", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(orderPayload),
      });

      if (!orderRes.ok) throw new Error("Failed to create order");

      const { orderId: newOrderId, id: docId } = await orderRes.json();

      setOrderNumber(newOrderId);
      setFirestoreDocId(docId || newOrderId);
      clearCart();

      // 4. Build OrderEmailData for the invoice template
      const emailOrderData: OrderEmailData = {
        orderId:        docId || newOrderId,
        orderNumber:    newOrderId,
        invoiceNumber:  "", // will be filled after email API call
        invoiceDate:    new Date().toISOString(),
        customerName:   data.fullName,
        customerEmail:  data.email,
        customerPhone:  data.phone,
        shippingAddress: fullAddress,
        orderNotes:     data.orderNotes,
        items: items.map((item) => ({
          productId:   item.product.id,
          productName: item.product.name,
          quantity:    item.quantity,
          weight:      item.selectedWeight,
          price:       item.price,
          image:       item.product.images?.[0],
        })),
        subtotal:      cartTotal,
        shippingCost:  shipping,
        discount:      0,
        grandTotal,
        paymentMethod: "whatsapp",
        paymentStatus: "pending",
        orderStatus:   "processing",
      };

      setOrderEmailData(emailOrderData);
      setOrderPlaced(true);

      // 5. Generate PDF in background (after DOM renders the invoice template)
      setIsSendingEmail(true);
      setTimeout(async () => {
        try {
          const pdfBase64 = await generateInvoicePDF(INVOICE_ELEMENT_ID);

          // 6. Call send-order API with PDF
          const emailRes = await fetch("/api/send-order", {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              firestoreDocId:  docId || newOrderId,
              orderNumber:     newOrderId,
              customerName:    data.fullName,
              customerEmail:   data.email,
              customerPhone:   data.phone,
              shippingAddress: fullAddress,
              orderNotes:      data.orderNotes,
              items: items.map((item) => ({
                productId:   item.product.id,
                productName: item.product.name,
                quantity:    item.quantity,
                weight:      item.selectedWeight,
                price:       item.price,
              })),
              subtotal:      cartTotal,
              shippingCost:  shipping,
              discount:      0,
              grandTotal,
              paymentMethod: "whatsapp",
              paymentStatus: "pending",
              orderStatus:   "processing",
              pdfBase64,
            }),
          });

          if (emailRes.ok) {
            const emailData = await emailRes.json();
            const newInvoiceNumber = emailData.invoiceNumber || "";
            setInvoiceNumber(newInvoiceNumber);
            // Update the email data with the invoice number
            setOrderEmailData((prev) =>
              prev ? { ...prev, invoiceNumber: newInvoiceNumber } : prev
            );
          }
        } catch (emailErr) {
          console.error("Email send failed (non-fatal):", emailErr);
        } finally {
          setIsSendingEmail(false);
        }
      }, 800); // small delay to let InvoiceTemplate render in DOM

    } catch (error) {
      console.error("Order error:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  // ── WhatsApp Quick Order ─────────────────────────────────────────────────
  const handleWhatsAppOrder = () => {
    const values = getValues();
    const itemsList = items
      .map((i) => `• ${i.product.name} (${i.selectedWeight}) x${i.quantity} = ${formatPrice(i.price * i.quantity)}`)
      .join("\n");
    const msg =
      `🌿 *New Order - Pushpagiri Coffee & Spice*\n\n` +
      `*Customer:* ${values.fullName || "Not filled"}\n` +
      `*Phone:* ${values.phone || "Not filled"}\n` +
      `*Address:* ${values.addressLine1 || ""}, ${values.city || ""}, ${values.state || ""} - ${values.pincode || ""}\n\n` +
      `*Items:*\n${itemsList}\n\n` +
      `*Total: ${formatPrice(grandTotal)}*\n\nPlease confirm this order!`;
    window.open(generateWhatsAppOrderUrl(BRAND.whatsapp, msg), "_blank");
  };

  // ── Success State ────────────────────────────────────────────────────────
  if (orderPlaced && orderEmailData) {
    return (
      <SuccessScreen
        orderNumber={orderNumber}
        firestoreDocId={firestoreDocId}
        orderData={{ ...orderEmailData, invoiceNumber }}
        invoiceNumber={invoiceNumber || "Generating…"}
        onDownload={handleDownload}
        isDownloading={isDownloading}
      />
    );
  }

  // ── Empty Cart ───────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-brand-cream gap-4">
        <div className="text-6xl">🛒</div>
        <h2 className="font-playfair text-2xl font-bold text-brand-green-dark">No items to checkout</h2>
        <Button asChild><Link href="/shop">Browse Products</Link></Button>
      </div>
    );
  }

  // ── Checkout Form ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-brand-cream py-10">
      <div className="container-custom">
        <h1 className="font-playfair text-3xl font-bold text-brand-green-dark mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* ── Form ──────────────────────────────────────── */}
          <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 space-y-6">

            {/* Personal Info */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h2 className="font-playfair text-xl font-bold text-brand-green-dark mb-5 flex items-center gap-2">
                <User className="w-5 h-5" /> Personal Information
              </h2>
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
              <h2 className="font-playfair text-xl font-bold text-brand-green-dark mb-5 flex items-center gap-2">
                <MapPin className="w-5 h-5" /> Shipping Address
              </h2>
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
                    <select
                      {...register("state")}
                      className="h-11 w-full rounded-xl border border-input px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-dark"
                    >
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
                  <Textarea
                    {...register("orderNotes")}
                    placeholder="Special instructions, delivery time preference, etc."
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Payment Notice */}
            <div className="bg-brand-green-light/20 border border-brand-green-light rounded-2xl p-5">
              <h3 className="font-playfair font-bold text-brand-green-dark mb-2">💳 Payment Information</h3>
              <p className="font-inter text-sm text-muted-foreground">
                After placing your order, we&apos;ll contact you via WhatsApp to confirm and share payment
                details (UPI, Bank Transfer, or COD). Online payment gateway coming soon.
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4">
              <Button
                type="submit"
                size="lg"
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin mr-2" />Placing Order…</>
                ) : (
                  "Place Order"
                )}
              </Button>
              <Button
                type="button"
                size="lg"
                variant="whatsapp"
                onClick={handleWhatsAppOrder}
              >
                <MessageCircle className="w-5 h-5" /> Order via WhatsApp
              </Button>
            </div>
          </form>

          {/* ── Order Summary ──────────────────────────────── */}
          <div>
            <div className="bg-white rounded-2xl shadow-card p-6 sticky top-24">
              <h2 className="font-playfair text-xl font-bold text-brand-green-dark mb-5">Order Summary</h2>
              <div className="space-y-4 mb-5">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-brand-cream shrink-0">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
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
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className={shipping === 0 ? "text-green-600 font-semibold" : ""}>
                    {shipping === 0 ? "FREE" : formatPrice(shipping)}
                  </span>
                </div>
                <div className="h-px bg-border my-2" />
                <div className="flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span className="text-brand-green-dark font-playfair text-xl">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Free shipping nudge */}
              {shipping > 0 && (
                <div className="mt-4 bg-[#F6FBF6] border border-[#C8E6C9] rounded-xl p-3">
                  <p className="text-xs text-[#3A5A40] text-center">
                    🎁 Add <strong>{formatPrice(999 - cartTotal)}</strong> more for <strong>FREE shipping</strong>!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
