import React from "react";
import Link from "next/link";
import {
  Leaf,
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import { BRAND, NAV_ITEMS } from "@/constants";

// =============================================
// FOOTER COMPONENT
// =============================================

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-green-dark text-white">
      {/* ── Main Footer ─────────────────────────── */}
      <div className="container-custom py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* ── Brand Column ─────────────────────── */}
          <div className="lg:col-span-1">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Leaf className="w-6 h-6 text-brand-green-light" />
              </div>
              <div>
                <h2 className="font-playfair text-xl font-bold text-white">
                  Pushpagiri
                </h2>
                <p className="font-inter text-xs text-brand-green-light tracking-widest uppercase">
                  Coffee & Spice
                </p>
              </div>
            </Link>

            <p className="font-inter text-sm text-white/70 leading-relaxed mb-6">
              From the misty hills of Coorg, we bring you premium organic coffee
              and authentic spices — pure, fresh, and traceable to our estate.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a
                href={BRAND.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Instagram"
                className="w-10 h-10 bg-white/10 hover:bg-brand-green-light/30 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={BRAND.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Facebook"
                className="w-10 h-10 bg-white/10 hover:bg-brand-green-light/30 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${BRAND.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contact us on WhatsApp"
                className="w-10 h-10 bg-white/10 hover:bg-[#25D366]/50 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* ── Quick Links ──────────────────────── */}
          <div>
            <h3 className="font-playfair text-lg font-semibold mb-6 text-brand-green-light">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="font-inter text-sm text-white/70 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/admin"
                  className="font-inter text-sm text-white/70 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                >
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* ── Product Categories ────────────────── */}
          <div>
            <h3 className="font-playfair text-lg font-semibold mb-6 text-brand-green-light">
              Our Products
            </h3>
            <ul className="space-y-3">
              {[
                { label: "Arabica Coffee", href: "/shop?category=coffee" },
                { label: "Robusta Coffee", href: "/shop?category=coffee" },
                {
                  label: "Filter Coffee Powder",
                  href: "/shop?category=coffee",
                },
                { label: "Black Pepper", href: "/shop?category=spices" },
                { label: "Cardamom", href: "/shop?category=spices" },
                { label: "Cloves & Cinnamon", href: "/shop?category=spices" },
                {
                  label: "Gift Collections",
                  href: "/shop?category=premium-blends",
                },
                {
                  label: "Wholesale Packs",
                  href: "/shop?category=wholesale-packs",
                },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-inter text-sm text-white/70 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact Info ──────────────────────── */}
          <div>
            <h3 className="font-playfair text-lg font-semibold mb-6 text-brand-green-light">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-green-light mt-0.5 shrink-0" />
                <span className="font-inter text-sm text-white/70 leading-relaxed">
                  {BRAND.address}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-brand-green-light shrink-0" />
                <a
                  href={`tel:${BRAND.phone}`}
                  className="font-inter text-sm text-white/70 hover:text-white transition-colors"
                >
                  {BRAND.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-brand-green-light shrink-0" />
                <a
                  href={`mailto:${BRAND.email}`}
                  className="font-inter text-sm text-white/70 hover:text-white transition-colors"
                >
                  {BRAND.email}
                </a>
              </li>
            </ul>

            {/* Business Hours */}
            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
              <h4 className="font-inter text-xs font-semibold text-brand-green-light uppercase tracking-wide mb-2">
                Business Hours
              </h4>
              <p className="font-inter text-xs text-white/60">
                Mon – Sat: 9:00 AM – 6:00 PM
              </p>
              <p className="font-inter text-xs text-white/60">
                Sunday: 10:00 AM – 3:00 PM
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ───────────────────────────── */}
      <div className="border-t border-white/10">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-inter text-xs text-white/50 text-center md:text-left">
              © {currentYear} {BRAND.name}. All rights reserved. | Made with
              ❤️ from Coorg, Karnataka.
            </p>
            <div className="flex items-center gap-6">
              {[
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
                { label: "Sitemap", href: "/sitemap.xml" },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="font-inter text-xs text-white/50 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
