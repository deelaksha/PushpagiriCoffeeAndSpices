"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Check,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Trash2,
  ShoppingBag,
  Filter,
  MoreHorizontal,
  Settings,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Dummy data for notifications
type NotificationType = "order" | "stock" | "system";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  time: string;
  date: string;
}

const initialNotifications: Notification[] = [
  {
    id: "notif-1",
    title: "New Order #ORD-8901",
    message: "John Doe placed an order for 2kg Premium Arabica and 500g Cardamom.",
    type: "order",
    isRead: false,
    time: "10:23 AM",
    date: "Today",
  },
  {
    id: "notif-2",
    title: "Low Stock Alert",
    message: "Organic Black Pepper is running low (only 12 units remaining).",
    type: "stock",
    isRead: false,
    time: "09:45 AM",
    date: "Today",
  },
  {
    id: "notif-3",
    title: "System Update Complete",
    message: "The scheduled maintenance and security patch has been applied successfully.",
    type: "system",
    isRead: true,
    time: "02:30 AM",
    date: "Today",
  },
  {
    id: "notif-4",
    title: "Large Order Received",
    message: "A wholesale order #ORD-8895 for 50kg Robusta has been placed by Cafe Central.",
    type: "order",
    isRead: true,
    time: "Yesterday",
    date: "May 20, 2026",
  },
  {
    id: "notif-5",
    title: "Payment Gateway Error",
    message: "Temporary disruption in Stripe processing. Failures reported on checkout.",
    type: "system",
    isRead: true,
    time: "Yesterday",
    date: "May 20, 2026",
  },
  {
    id: "notif-6",
    title: "Out of Stock",
    message: "Premium Cinnamon Quills are now out of stock. Please restock immediately.",
    type: "stock",
    isRead: true,
    time: "Yesterday",
    date: "May 20, 2026",
  },
  {
    id: "notif-7",
    title: "Order Delivered",
    message: "Order #ORD-8850 has been successfully delivered to the customer.",
    type: "order",
    isRead: true,
    time: "May 19",
    date: "May 19, 2026",
  },
];

const getTypeIcon = (type: NotificationType) => {
  switch (type) {
    case "order":
      return <ShoppingBag className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
    case "stock":
      return <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
    case "system":
      return <Info className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
  }
};

const getTypeBg = (type: NotificationType) => {
  switch (type) {
    case "order":
      return "bg-blue-100 dark:bg-blue-900/30";
    case "stock":
      return "bg-amber-100 dark:bg-amber-900/30";
    case "system":
      return "bg-purple-100 dark:bg-purple-900/30";
  }
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [filter, setFilter] = useState<"all" | "unread" | NotificationType>("all");

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "all") return true;
    if (filter === "unread") return !n.isRead;
    return n.type === filter;
  });

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast.success("All notifications marked as read");
  };

  const markAsRead = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    toast.success("Notification marked as read");
  };

  const deleteNotification = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast.success("Notification removed");
  };

  const clearAll = () => {
    setNotifications([]);
    toast.success("All notifications cleared");
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            Notifications
            {unreadCount > 0 && (
              <span className="bg-brand-green-dark text-white text-sm font-semibold px-2.5 py-0.5 rounded-full">
                {unreadCount} New
              </span>
            )}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Stay updated with your store's activity
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => toast.info("Notification settings opened")}
            className="p-2 text-slate-600 hover:text-brand-green-dark hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 rounded-full transition-colors"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            Mark all as read
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 gap-4">
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <FilterButton
            active={filter === "all"}
            onClick={() => setFilter("all")}
            label="All"
          />
          <FilterButton
            active={filter === "unread"}
            onClick={() => setFilter("unread")}
            label="Unread"
            count={unreadCount}
          />
          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block"></div>
          <FilterButton
            active={filter === "order"}
            onClick={() => setFilter("order")}
            label="Orders"
            icon={<ShoppingBag className="w-4 h-4" />}
          />
          <FilterButton
            active={filter === "stock"}
            onClick={() => setFilter("stock")}
            label="Stock Alerts"
            icon={<AlertTriangle className="w-4 h-4" />}
          />
          <FilterButton
            active={filter === "system"}
            onClick={() => setFilter("system")}
            label="System"
            icon={<Info className="w-4 h-4" />}
          />
        </div>
        <button
          onClick={clearAll}
          className="text-sm text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 flex items-center gap-1 font-medium whitespace-nowrap px-2"
        >
          <Trash2 className="w-4 h-4" />
          Clear All
        </button>
      </div>

      {/* Notifications List */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        {filteredNotifications.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            <AnimatePresence initial={false}>
              {filteredNotifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "group relative p-4 sm:p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors",
                    !notification.isRead ? "bg-brand-green-light/10 dark:bg-brand-green-dark/10" : ""
                  )}
                >
                  <div className="flex gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 relative">
                      <div className={cn("p-2.5 rounded-full", getTypeBg(notification.type))}>
                        {getTypeIcon(notification.type)}
                      </div>
                      {!notification.isRead && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-brand-green-dark rounded-full border-2 border-white dark:border-slate-900" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h3 className={cn(
                            "text-sm font-semibold truncate",
                            !notification.isRead ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-200"
                          )}>
                            {notification.title}
                          </h3>
                          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                            {notification.message}
                          </p>
                        </div>
                        <div className="flex flex-col items-end flex-shrink-0 text-xs text-slate-400 dark:text-slate-500 gap-1 whitespace-nowrap">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {notification.time}
                          </span>
                          <span>{notification.date}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-3 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notification.isRead && (
                          <button
                            onClick={(e) => markAsRead(notification.id, e)}
                            className="text-xs font-medium text-brand-green-dark hover:text-brand-green-light flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" /> Mark as read
                          </button>
                        )}
                        <button
                          onClick={(e) => deleteNotification(notification.id, e)}
                          className="text-xs font-medium text-red-500 hover:text-red-700 dark:text-red-400 flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <Bell className="w-8 h-8 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
              No notifications
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              You're all caught up! There are no notifications to display.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Sub-component for filter buttons
function FilterButton({
  active,
  onClick,
  label,
  icon,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors",
        active
          ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
          : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
      )}
    >
      {icon}
      {label}
      {count !== undefined && count > 0 && (
        <span
          className={cn(
            "text-xs px-1.5 py-0.5 rounded-md",
            active
              ? "bg-slate-700 text-white dark:bg-slate-200 dark:text-slate-900"
              : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}
