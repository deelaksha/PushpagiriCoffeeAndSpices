"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { 
  Settings, 
  CreditCard, 
  Percent, 
  Save,
  Store,
  Mail,
  DollarSign,
  Phone,
  MapPin,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);

  // Dummy state
  const [general, setGeneral] = useState({
    storeName: "Pushpagiri Coffee & Spice",
    currency: "INR",
    supportEmail: "support@pushpagiricoffee.com",
    phone: "+91 98765 43210",
    address: "123 Estate Road, Coorg, Karnataka, India"
  });

  const [payment, setPayment] = useState({
    stripe: true,
    razorpay: true,
    paypal: false,
    cod: true
  });

  const [tax, setTax] = useState({
    defaultRate: "18",
    shippingRate: "5",
    inclusive: false
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Settings saved successfully!");
    }, 1000);
  };

  const tabs = [
    { id: "general", label: "General", icon: Settings, description: "Basic store information" },
    { id: "payment", label: "Payment", icon: CreditCard, description: "Manage payment gateways" },
    { id: "tax", label: "Tax", icon: Percent, description: "Configure tax rates" },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-green-dark">Settings</h1>
          <p className="text-gray-500 mt-1">Manage your store preferences and configurations</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2.5 bg-brand-green-dark text-white rounded-xl hover:bg-brand-green-dark/90 transition-all shadow-sm disabled:opacity-70"
        >
          {isSaving ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
              <Settings className="w-5 h-5" />
            </motion.div>
          ) : (
            <Save className="w-5 h-5" />
          )}
          <span>{isSaving ? "Saving..." : "Save Changes"}</span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Tabs Sidebar */}
        <div className="lg:w-64 flex-shrink-0 flex flex-col gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-start gap-4 p-4 rounded-2xl text-left transition-all duration-200 relative overflow-hidden group",
                  isActive
                    ? "bg-brand-green-dark text-white shadow-md"
                    : "bg-white hover:bg-brand-cream/50 text-gray-600 hover:text-brand-green-dark"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 bg-brand-green-dark z-0"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <div className="relative z-10 flex gap-3">
                  <div className={cn(
                    "p-2 rounded-xl transition-colors",
                    isActive ? "bg-white/20 text-white" : "bg-brand-cream text-brand-green-dark group-hover:bg-white group-hover:shadow-sm"
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold">{tab.label}</div>
                    <div className={cn(
                      "text-xs mt-0.5 transition-colors",
                      isActive ? "text-white/80" : "text-gray-400 group-hover:text-gray-500"
                    )}>{tab.description}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 min-h-[500px]">
          <AnimatePresence mode="wait">
            {activeTab === "general" && (
              <motion.div
                key="general"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
              >
                <h2 className="text-xl font-bold text-brand-green-dark mb-6 flex items-center gap-2">
                  <Store className="w-5 h-5 text-brand-green-light" />
                  General Information
                </h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Store Name</label>
                      <input
                        type="text"
                        value={general.storeName}
                        onChange={(e) => setGeneral({ ...general, storeName: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green-light/50 transition-all bg-gray-50/50 focus:bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Store Currency</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                        </div>
                        <select
                          value={general.currency}
                          onChange={(e) => setGeneral({ ...general, currency: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green-light/50 transition-all bg-gray-50/50 focus:bg-white appearance-none"
                        >
                          <option value="INR">INR (₹)</option>
                          <option value="USD">USD ($)</option>
                          <option value="EUR">EUR (€)</option>
                          <option value="GBP">GBP (£)</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Support Email</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="w-4 h-4 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          value={general.supportEmail}
                          onChange={(e) => setGeneral({ ...general, supportEmail: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green-light/50 transition-all bg-gray-50/50 focus:bg-white"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Phone Number</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="w-4 h-4 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          value={general.phone}
                          onChange={(e) => setGeneral({ ...general, phone: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green-light/50 transition-all bg-gray-50/50 focus:bg-white"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Store Address</label>
                    <div className="relative">
                      <div className="absolute top-3 left-3 pointer-events-none">
                        <MapPin className="w-4 h-4 text-gray-400" />
                      </div>
                      <textarea
                        value={general.address}
                        onChange={(e) => setGeneral({ ...general, address: e.target.value })}
                        rows={3}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green-light/50 transition-all bg-gray-50/50 focus:bg-white resize-none"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "payment" && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
              >
                <h2 className="text-xl font-bold text-brand-green-dark mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-brand-green-light" />
                  Payment Gateways
                </h2>
                <div className="space-y-4">
                  {[
                    { id: 'stripe', name: 'Stripe', desc: 'Accept credit cards globally' },
                    { id: 'razorpay', name: 'Razorpay', desc: 'Popular in India, supports UPI' },
                    { id: 'paypal', name: 'PayPal', desc: 'International payments' },
                    { id: 'cod', name: 'Cash on Delivery', desc: 'Pay when the order arrives' }
                  ].map((gateway) => (
                    <div key={gateway.id} className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-brand-green-light/30 transition-colors bg-gray-50/30">
                      <div>
                        <div className="font-semibold text-gray-900">{gateway.name}</div>
                        <div className="text-sm text-gray-500 mt-0.5">{gateway.desc}</div>
                      </div>
                      <button
                        onClick={() => {
                          setPayment({ ...payment, [gateway.id]: !payment[gateway.id as keyof typeof payment] });
                          toast.info(`${gateway.name} ${!payment[gateway.id as keyof typeof payment] ? 'enabled' : 'disabled'}`);
                        }}
                        className={cn(
                          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-green-light/50",
                          payment[gateway.id as keyof typeof payment] ? "bg-brand-green-dark" : "bg-gray-200"
                        )}
                      >
                        <span className={cn(
                          "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                          payment[gateway.id as keyof typeof payment] ? "translate-x-6" : "translate-x-1"
                        )} />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "tax" && (
              <motion.div
                key="tax"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
              >
                <h2 className="text-xl font-bold text-brand-green-dark mb-6 flex items-center gap-2">
                  <Percent className="w-5 h-5 text-brand-green-light" />
                  Tax Settings
                </h2>
                <div className="space-y-6 max-w-lg">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Default Tax Rate (%)</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={tax.defaultRate}
                        onChange={(e) => setTax({ ...tax, defaultRate: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green-light/50 transition-all bg-gray-50/50 focus:bg-white"
                      />
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <Percent className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">Applied to products by default</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Shipping Tax Rate (%)</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={tax.shippingRate}
                        onChange={(e) => setTax({ ...tax, shippingRate: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green-light/50 transition-all bg-gray-50/50 focus:bg-white"
                      />
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <Percent className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">Tax applied to shipping fees</p>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className={cn(
                        "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                        tax.inclusive 
                          ? "bg-brand-green-dark border-brand-green-dark" 
                          : "border-gray-300 group-hover:border-brand-green-light"
                      )}>
                        {tax.inclusive && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <input 
                        type="checkbox" 
                        className="hidden"
                        checked={tax.inclusive}
                        onChange={(e) => {
                          setTax({ ...tax, inclusive: e.target.checked });
                          toast.success(e.target.checked ? "Prices will now include tax" : "Prices will now exclude tax");
                        }}
                      />
                      <div>
                        <div className="font-medium text-gray-900">Include tax in prices</div>
                        <div className="text-sm text-gray-500">I will enter prices inclusive of tax</div>
                      </div>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
