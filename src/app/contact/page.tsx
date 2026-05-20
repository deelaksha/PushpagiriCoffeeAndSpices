"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, MessageCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { contactSchema, type ContactFormData } from "@/lib/validations";
import { BRAND } from "@/constants";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    await new Promise((r) => setTimeout(r, 1200));
    // TODO: Save to Firebase /contact_forms collection
    console.log("Contact form:", data);
    setSubmitted(true);
  };

  const CONTACT_DETAILS = [
    { icon: MapPin, label: "Address", value: BRAND.address, href: BRAND.mapUrl },
    { icon: Phone, label: "Phone", value: BRAND.phone, href: `tel:${BRAND.phone}` },
    { icon: Mail, label: "Email", value: BRAND.email, href: `mailto:${BRAND.email}` },
    { icon: MessageCircle, label: "WhatsApp", value: "Chat with us", href: `https://wa.me/${BRAND.whatsapp}` },
  ];

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Header */}
      <div className="bg-brand-green-dark text-white py-20 text-center">
        <h1 className="font-playfair text-5xl font-bold mb-3">Get in Touch</h1>
        <p className="font-inter text-white/70 text-lg max-w-xl mx-auto">
          Whether you have a question, want to place a custom order, or explore wholesale — we&apos;re here to help.
        </p>
      </div>

      <div className="container-custom py-16">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* ── Contact Info ─────────────────────── */}
          <div className="space-y-6">
            <div>
              <h2 className="font-playfair text-2xl font-bold text-brand-green-dark mb-6">Contact Details</h2>
              <div className="space-y-4">
                {CONTACT_DETAILS.map((detail) => (
                  <a key={detail.label} href={detail.href} target={detail.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                    className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 group"
                  >
                    <div className="w-10 h-10 bg-brand-green-dark rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <detail.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-inter text-xs text-muted-foreground uppercase tracking-wide">{detail.label}</p>
                      <p className="font-inter text-sm font-medium text-brand-green-dark">{detail.value}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-brand-green-dark text-white rounded-2xl p-6">
              <h3 className="font-playfair text-lg font-bold mb-4">⏰ Business Hours</h3>
              <div className="space-y-2 font-inter text-sm text-white/80">
                <div className="flex justify-between"><span>Mon – Sat</span><span>9:00 AM – 6:00 PM</span></div>
                <div className="flex justify-between"><span>Sunday</span><span>10:00 AM – 3:00 PM</span></div>
                <div className="mt-3 pt-3 border-t border-white/20 text-xs text-white/60">
                  WhatsApp available 7 days, 8 AM – 8 PM
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-white rounded-2xl shadow-card p-1 overflow-hidden">
              <a
                href={BRAND.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-48 rounded-xl flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity block"
                style={{ background: "linear-gradient(135deg, #3A5A40 0%, #A8D5BA 100%)" }}
              >
                <div className="text-center text-white">
                  <MapPin className="w-10 h-10 mx-auto mb-2" />
                  <p className="font-inter font-semibold">Choudlu, Karnataka</p>
                  <p className="font-inter text-xs opacity-70 mt-1">Click to open in Google Maps</p>
                </div>
              </a>
            </div>
          </div>

          {/* ── Contact Form ─────────────────────── */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-card p-8">
              <h2 className="font-playfair text-2xl font-bold text-brand-green-dark mb-6">Send Us a Message</h2>

              {submitted ? (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
                    <Check className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-playfair text-2xl font-bold text-brand-green-dark mb-2">Message Sent! ✅</h3>
                  <p className="font-inter text-muted-foreground">We&apos;ll get back to you within 24 hours.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-inter text-sm font-medium mb-1.5 block">Your Name *</label>
                      <Input {...register("name")} placeholder="Full name" />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="font-inter text-sm font-medium mb-1.5 block">Email *</label>
                      <Input {...register("email")} type="email" placeholder="your@email.com" />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="font-inter text-sm font-medium mb-1.5 block">Phone (Optional)</label>
                    <Input {...register("phone")} placeholder="Mobile number" maxLength={10} />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                  </div>
                  <div>
                    <label className="font-inter text-sm font-medium mb-1.5 block">Subject *</label>
                    <Input {...register("subject")} placeholder="What is this about?" />
                    {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
                  </div>
                  <div>
                    <label className="font-inter text-sm font-medium mb-1.5 block">Message *</label>
                    <Textarea {...register("message")} placeholder="Write your message here..." rows={5} />
                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                  </div>
                  <div className="flex gap-4">
                    <Button type="submit" size="lg" className="flex-1" disabled={isSubmitting}>
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                    <Button type="button" size="lg" variant="whatsapp" asChild>
                      <a href={`https://wa.me/${BRAND.whatsapp}`} target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="w-5 h-5" />
                      </a>
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
