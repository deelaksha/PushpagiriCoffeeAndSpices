"use client";

import React, { useState, useEffect, useRef } from "react";
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
  User,
  LogOut,
  Package,
  UserCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { logout } from "@/lib/firebase/auth";
import { NAV_ITEMS, BRAND } from "@/constants";
import { cn } from "@/lib/utils";

// =============================================
// NAVBAR COMPONENT
// =============================================

export default function Navbar() {
  const [hasMounted, setHasMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const { itemCount, toggleCart } = useCartStore();
  const { user, userProfile, openLoginModal, clearPendingAction } = useAuthStore();
  const { clearItems } = useCartStore();
  const count = hasMounted ? itemCount() : 0;

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Track scroll for sticky navbar styling
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
  }, [pathname]);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActiveLink = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const handleSignOut = async () => {
    try {
      setIsProfileOpen(false);
      clearItems();         // clear cart on logout
      clearPendingAction(); // reset any pending modal action
      await logout();
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  // ── Avatar helpers ─────────────────────────────────────────────────────────
  const displayName = userProfile?.name || user?.displayName || "Account";
  const initials = displayName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
  const photoURL = userProfile?.photoURL || user?.photoURL;

  return (
    <>
      {/* ── Top Announcement Bar ─────────────────────── */}
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

      {/* ── Main Navbar ──────────────────────────────── */}
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

            {/* ── Brand Logo ───────────────────────── */}
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

            {/* ── Desktop Navigation ─────────────────── */}
            <div className="hidden lg:flex items-center gap-8">
              {NAV_ITEMS.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.children && setActiveDropdown(item.label)}
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

            {/* ── Desktop Right Actions ─────────────── */}
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

              {/* ── Auth Section ─────────────────────── */}
              {hasMounted && (
                <>
                  {!user ? (
                    /* LOGGED OUT — Login button */
                    <Button
                      id="navbar-login-btn"
                      variant="default"
                      size="sm"
                      onClick={openLoginModal}
                      className="hidden md:flex items-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      Login
                    </Button>
                  ) : (
                    /* LOGGED IN — Profile avatar + dropdown */
                    <div className="relative hidden md:block" ref={profileRef}>
                      <button
                        id="navbar-profile-btn"
                        onClick={() => setIsProfileOpen((v) => !v)}
                        className="flex items-center gap-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green-dark"
                        aria-label="Profile menu"
                      >
                        {/* Avatar */}
                        <div className="relative w-9 h-9 rounded-full ring-2 ring-brand-green-dark/20 hover:ring-brand-green-dark/60 transition-all duration-200 overflow-hidden bg-brand-green-dark flex items-center justify-center">
                          {photoURL ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={photoURL}
                              alt={displayName}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                              }}
                            />
                          ) : (
                            <span className="text-white text-xs font-bold font-inter">
                              {initials || <UserCircle className="w-5 h-5 text-white" />}
                            </span>
                          )}
                        </div>
                        {/* Name */}
                        <span className="hidden lg:block font-inter text-sm font-medium text-foreground max-w-[100px] truncate">
                          {displayName.split(" ")[0]}
                        </span>
                        <ChevronDown
                          className={cn(
                            "hidden lg:block w-3.5 h-3.5 text-muted-foreground transition-transform duration-200",
                            isProfileOpen && "rotate-180"
                          )}
                        />
                      </button>

                      {/* Profile Dropdown */}
                      <AnimatePresence>
                        {isProfileOpen && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 8 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 8 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            className="absolute right-0 top-full mt-3 w-60 bg-white rounded-2xl shadow-soft-hover border border-border overflow-hidden z-50"
                          >
                            {/* User info header */}
                            <div className="px-4 py-3 bg-brand-cream/60 border-b border-border">
                              <p className="font-inter text-sm font-semibold text-brand-green-dark truncate">
                                {displayName}
                              </p>
                              <p className="font-inter text-xs text-muted-foreground truncate">
                                {user.email}
                              </p>
                            </div>

                            {/* Menu items */}
                            <div className="py-1">
                              <Link
                                href="/profile"
                                onClick={() => setIsProfileOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-brand-green-light/20 hover:text-brand-green-dark transition-colors"
                              >
                                <UserCircle className="w-4 h-4 text-brand-green-dark/70" />
                                My Profile
                              </Link>
                              <Link
                                href="/profile"
                                onClick={() => setIsProfileOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-brand-green-light/20 hover:text-brand-green-dark transition-colors"
                              >
                                <Package className="w-4 h-4 text-brand-green-dark/70" />
                                My Orders
                              </Link>
                            </div>

                            <div className="border-t border-border py-1">
                              <button
                                id="navbar-signout-btn"
                                onClick={handleSignOut}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </>
              )}

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

      {/* ── Mobile Menu ──────────────────────────────── */}
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

              {/* Mobile Auth section */}
              <div className="pt-3 border-t border-border space-y-2">
                {hasMounted && !user ? (
                  <Button
                    variant="default"
                    className="w-full gap-2"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      openLoginModal();
                    }}
                  >
                    <User className="w-4 h-4" />
                    Login / Sign Up
                  </Button>
                ) : hasMounted && user ? (
                  <div className="space-y-1">
                    {/* Mobile user info */}
                    <div className="flex items-center gap-3 px-4 py-2">
                      <div className="w-8 h-8 rounded-full bg-brand-green-dark flex items-center justify-center shrink-0 overflow-hidden">
                        {photoURL ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={photoURL} alt={displayName} width={32} height={32} className="object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <span className="text-white text-xs font-bold">{initials}</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-brand-green-dark truncate">{displayName}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-foreground hover:bg-brand-green-light/20"
                    >
                      <Package className="w-4 h-4 text-brand-green-dark/70" /> My Orders
                    </Link>
                    <button
                      onClick={() => { setIsMobileMenuOpen(false); handleSignOut(); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                ) : null}

                {/* WhatsApp CTA */}
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
