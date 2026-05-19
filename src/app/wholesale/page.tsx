"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Building2, Package, Award, Globe, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { wholesaleSchema, type WholesaleFormData } from "@/lib/validations";
import { BRAND } from "@/constants";

const BUSINESS_TYPES = ["Cafe / Coffee Shop", "Restaurant / Hotel", "Grocery / Retail Store", "Online Retailer", "Export / Distributor", "Other"];
const ORDER_RANGES = ["Under 5kg / month", "5-20kg / month", "20-50kg / month", "50-100kg / month", "100kg+ / month"];
const PRODUCTS_LIST = ["Arabica Coffee", "Robusta Coffee", "Filter Coffee Powder", "Black Pepper", "Cardamom", "Cloves", "Cinnamon", "Custom Blends"];

const WHY_WHOLESALE = [
  { icon: Package, title: "Bulk Pricing", desc: "Significant discounts on bulk orders with transparent pricing tiers." },
  { icon: Award, title: "Export Grade", desc: "All our products meet international export quality standards." },
  { icon: Globe, title: "Pan-India Delivery", desc: "We ship to all major cities and towns across India." },
  { icon: Building2, title: "Custom Packaging", desc: "White-label and custom branded packaging available for partners." },
];

export default function WholesalePage() {
  const [submitted, setSubmitted] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<WholesaleFormData>({
    resolver: zodResolver(wholesaleSchema),
    defaultValues: { productsInterested: [] },
  });

  const toggleProduct = (p: string) => {
    const updated = selected.includes(p) ? selected.filter((x) => x !== p) : [...selected, p];
    setSelected(updated);
    setValue("productsInterested", updated);
  };

  const onSubmit = async (data: WholesaleFormData) => {
    await new Promise((r) => setTimeout(r, 1200));
    // TODO: Save to Firebase /wholesale_inquiries collection
    console.log("Wholesale inquiry:", data);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Header */}
      <div className="bg-brand-green-dark text-white py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-leaf-pattern opacity-10" />
        <div className="container-custom relative z-10">
          <span className="inline-block bg-white/20 text-white text-sm font-semibold px-4 py-1 rounded-full mb-4 font-inter">🤝 B2B & Wholesale</span>
          <h1 className="font-playfair text-5xl font-bold mb-4">Partner with Pushpagiri</h1>
          <p className="font-inter text-white/70 text-xl max-w-2xl mx-auto">
            Bring the authentic taste of Coorg to your customers. Premium coffee and spices at wholesale prices.
          </p>
        </div>
      </div>

      {/* Why Partner */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-4xl font-bold text-brand-green-dark mb-3">Why Partner with Us?</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_WHOLESALE.map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="text-center p-6 bg-brand-cream rounded-2xl">
                <div className="w-14 h-14 bg-brand-green-dark rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-playfair text-lg font-bold text-brand-green-dark mb-2">{item.title}</h3>
                <p className="font-inter text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="section-padding bg-brand-cream">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-4xl font-bold text-brand-green-dark mb-3">Export Quality Guarantee</h2>
            <p className="font-inter text-muted-foreground max-w-xl mx-auto">All our wholesale products are graded and meet export standards.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Standard", qty: "5 – 20 kg", disc: "10% off", features: ["Standard grades", "Regular packaging", "2-3 day processing"] },
              { title: "Business", qty: "20 – 100 kg", disc: "18% off", features: ["Premium grades", "Custom labels", "Priority processing", "Dedicated account manager"], highlight: true },
              { title: "Enterprise", qty: "100 kg+", disc: "Custom pricing", features: ["Export grade", "White-label packaging", "Same-day processing", "Dedicated account manager", "Custom blends"] },
            ].map((tier) => (
              <div key={tier.title} className={`rounded-2xl p-6 shadow-card ${tier.highlight ? "bg-brand-green-dark text-white" : "bg-white"}`}>
                <h3 className={`font-playfair text-xl font-bold mb-1 ${tier.highlight ? "text-brand-green-light" : "text-brand-green-dark"}`}>{tier.title}</h3>
                <p className={`font-inter text-sm mb-2 ${tier.highlight ? "text-white/70" : "text-muted-foreground"}`}>From {tier.qty}</p>
                <p className={`font-playfair text-2xl font-bold mb-4 ${tier.highlight ? "text-white" : "text-brand-brown"}`}>{tier.disc}</p>
                <ul className="space-y-2">
                  {tier.features.map((f) => (
                    <li key={f} className={`flex items-center gap-2 text-sm ${tier.highlight ? "text-white/80" : "text-muted-foreground"}`}>
                      <Check className={`w-4 h-4 ${tier.highlight ? "text-brand-green-light" : "text-brand-green-dark"}`} />{f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="font-playfair text-4xl font-bold text-brand-green-dark mb-3">Submit Wholesale Inquiry</h2>
            <p className="font-inter text-muted-foreground">Fill in the form and we&apos;ll reach out within 24 hours with pricing and samples.</p>
          </div>

          {submitted ? (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-12">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="font-playfair text-2xl font-bold text-brand-green-dark mb-2">Inquiry Received!</h3>
              <p className="font-inter text-muted-foreground">Our wholesale team will contact you within 24 hours.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="bg-brand-cream rounded-2xl p-8 space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-inter text-sm font-medium mb-1.5 block">Business Name *</label>
                  <Input {...register("businessName")} placeholder="Your business name" />
                  {errors.businessName && <p className="text-red-500 text-xs mt-1">{errors.businessName.message}</p>}
                </div>
                <div>
                  <label className="font-inter text-sm font-medium mb-1.5 block">Contact Name *</label>
                  <Input {...register("contactName")} placeholder="Your name" />
                  {errors.contactName && <p className="text-red-500 text-xs mt-1">{errors.contactName.message}</p>}
                </div>
                <div>
                  <label className="font-inter text-sm font-medium mb-1.5 block">Email *</label>
                  <Input {...register("email")} type="email" placeholder="business@email.com" />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="font-inter text-sm font-medium mb-1.5 block">Phone *</label>
                  <Input {...register("phone")} placeholder="10-digit mobile" maxLength={10} />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>
                <div>
                  <label className="font-inter text-sm font-medium mb-1.5 block">Business Type *</label>
                  <select {...register("businessType")} className="h-11 w-full rounded-xl border border-input px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-dark bg-white">
                    <option value="">Select type</option>
                    {BUSINESS_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                  {errors.businessType && <p className="text-red-500 text-xs mt-1">{errors.businessType.message}</p>}
                </div>
                <div>
                  <label className="font-inter text-sm font-medium mb-1.5 block">Estimated Monthly Order *</label>
                  <select {...register("estimatedMonthlyOrder")} className="h-11 w-full rounded-xl border border-input px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green-dark bg-white">
                    <option value="">Select range</option>
                    {ORDER_RANGES.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                  {errors.estimatedMonthlyOrder && <p className="text-red-500 text-xs mt-1">{errors.estimatedMonthlyOrder.message}</p>}
                </div>
              </div>

              <div>
                <label className="font-inter text-sm font-medium mb-2 block">Products Interested In *</label>
                <div className="flex flex-wrap gap-2">
                  {PRODUCTS_LIST.map((p) => (
                    <button type="button" key={p} onClick={() => toggleProduct(p)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-all ${selected.includes(p) ? "bg-brand-green-dark text-white border-brand-green-dark" : "border-border hover:border-brand-green-dark"}`}>
                      {p}
                    </button>
                  ))}
                </div>
                {errors.productsInterested && <p className="text-red-500 text-xs mt-1">{errors.productsInterested.message}</p>}
              </div>

              <div>
                <label className="font-inter text-sm font-medium mb-1.5 block">Additional Message</label>
                <Textarea {...register("message")} placeholder="Tell us more about your requirements..." rows={4} />
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Wholesale Inquiry"}
              </Button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
