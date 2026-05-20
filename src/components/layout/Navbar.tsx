"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Menu,
  X,
  Search,
  Phone,
  ChevronDown,
  Leaf,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/cartStore";
import { NAV_ITEMS, BRAND } from "@/constants";
import { cn } from "@/lib/utils";

// =============================================
// NAVBAR COMPONENT
// =============================================

export default function Navbar() {
  const [hasMounted, setHasMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const { itemCount, openCart, toggleCart } = useCartStore();
  const count = itemCount();

  // Track scroll for sticky navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const isActiveLink = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* ── Top Announcement Bar ─────────────────── */}
      <div className="bg-brand-green-dark text-white text-center py-2 px-4 text-xs font-inter">
        <span>🌿 Free shipping on orders above ₹999 • </span>
        <a
          href={`tel:${BRAND.phone}`}
          className="hover:text-brand-green-light transition-colors inline-flex items-center gap-1"
        >
          <Phone className="w-3 h-3" />
          {BRAND.phone}
        </a>
      </div>

      {/* ── Main Navbar ──────────────────────────── */}
      <nav
        className={cn(
          "sticky top-0 z-50 transition-all duration-500",
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-soft border-b border-border"
            : "bg-brand-cream"
        )}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-20">
            {/* ── Brand Logo ───────────────────── */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-brand-green-dark rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-playfair text-lg font-bold text-brand-green-dark leading-tight">
                  Pushpagiri
                </h1>
                <p className="font-inter text-xs text-brand-brown font-medium tracking-widest uppercase">
                  Coffee & Spice
                </p>
              </div>
            </Link>

            {/* ── Desktop Navigation ────────────── */}
            <div className="hidden lg:flex items-center gap-8">
              {NAV_ITEMS.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() =>
                    item.children && setActiveDropdown(item.label)
                  }
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-1 font-inter text-sm font-medium transition-colors duration-200 py-2",
                      isActiveLink(item.href)
                        ? "text-brand-green-dark"
                        : "text-foreground hover:text-brand-green-dark"
                    )}
                  >
                    {item.label}
                    {item.children && (
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 transition-transform duration-200",
                          activeDropdown === item.label && "rotate-180"
                        )}
                      />
                    )}
                  </Link>

                  {/* Active indicator */}
                  {isActiveLink(item.href) && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-green-dark rounded-full"
                    />
                  )}

                  {/* Dropdown Menu */}
                  {item.children && activeDropdown === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-soft-hover border border-border overflow-hidden z-50"
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="block px-4 py-3 text-sm text-foreground hover:bg-brand-green-light/20 hover:text-brand-green-dark transition-colors duration-200"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>

            {/* ── Desktop Right Actions ─────────── */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <Link href="/shop">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Search products"
                  className="hidden md:flex text-foreground hover:text-brand-green-dark"
                >
                  <Search className="w-5 h-5" />
                </Button>
              </Link>

              {/* Cart Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleCart}
                aria-label="Shopping cart"
                className="relative text-foreground hover:text-brand-green-dark"
              >
                <ShoppingCart className="w-5 h-5" />
                {hasMounted && count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-brand-brown text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                  >
                    {count > 9 ? "9+" : count}
                  </motion.span>
                )}
              </Button>

              {/* WhatsApp CTA */}
              <Button
                variant="default"
                size="sm"
                className="hidden md:flex"
                asChild
              >
                <a
                  href={`https://wa.me/${BRAND.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Order Now
                </a>
              </Button>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile Menu ──────────────────────────── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="sticky top-[72px] z-40 bg-white border-b border-border shadow-soft overflow-hidden lg:hidden"
          >
            <div className="container-custom py-6 space-y-2">
              {NAV_ITEMS.map((item) => (
                <div key={item.label}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "block px-4 py-3 rounded-xl font-inter font-medium text-base transition-colors duration-200",
                      isActiveLink(item.href)
                        ? "bg-brand-green-light text-brand-green-dark"
                        : "text-foreground hover:bg-brand-green-light/30"
                    )}
                  >
                    {item.label}
                  </Link>
                  {/* Mobile sub-items */}
                  {item.children && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.children.slice(1).map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-brand-green-dark transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Mobile WhatsApp CTA */}
              <div className="pt-4 pb-2">
                <Button variant="whatsapp" className="w-full" asChild>
                  <a
                    href={`https://wa.me/${BRAND.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    💬 Order via WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
