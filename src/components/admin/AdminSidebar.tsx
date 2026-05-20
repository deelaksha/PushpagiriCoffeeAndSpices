"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, ShoppingBag, Package, Users, BarChart3, 
  Settings, Receipt, Truck, Star, Bell, Archive, UserCircle, Leaf, Eye
} from "lucide-react";

const SIDEBAR_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: ShoppingBag, label: "Orders", href: "/admin/orders" },
  { icon: Package, label: "Products", href: "/admin/products" },
  { icon: Archive, label: "Inventory", href: "/admin/inventory" },
  { icon: Users, label: "Customers", href: "/admin/customers" },
  { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
  { icon: Receipt, label: "Invoices", href: "/admin/invoices" },
  { icon: Truck, label: "Delivery Tracking", href: "/admin/delivery" },
  { icon: Star, label: "Reviews", href: "/admin/reviews" },
  { icon: Bell, label: "Notifications", href: "/admin/notifications" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
  { icon: UserCircle, label: "Admin Profile", href: "/admin/profile" },
];

export function AdminSidebar({ 
  className, 
  onItemClick 
}: { 
  className?: string;
  onItemClick?: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside className={cn("admin-sidebar w-64 h-full flex flex-col bg-brand-green-dark text-white overflow-hidden", className)}>
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10 shrink-0">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
            <Leaf className="w-5 h-5 text-brand-green-light" />
          </div>
          <div>
            <p className="font-playfair text-sm font-bold text-white">Pushpagiri</p>
            <p className="font-inter text-xs text-white/50">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {SIDEBAR_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onItemClick}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                isActive
                  ? "bg-white/20 text-white"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10 shrink-0">
        <Link href="/" className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors">
          <Eye className="w-4 h-4" /> View Store
        </Link>
      </div>
    </aside>
  );
}
