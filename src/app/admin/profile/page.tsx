"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { 
  Camera, 
  Save, 
  KeyRound, 
  User, 
  Mail, 
  ShieldCheck,
  Eye,
  EyeOff
} from "lucide-react";

export default function ProfilePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "Arjun",
    lastName: "Rao",
    email: "arjun.rao@pushpagiri.com",
    role: "Super Admin",
    avatar: "https://i.pravatar.cc/150?u=arjun"
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Profile updated successfully!");
    }, 800);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    setIsPasswordSubmitting(true);
    setTimeout(() => {
      setIsPasswordSubmitting(false);
      toast.success("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    }, 800);
  };

  const handleAvatarChange = () => {
    toast.info("Avatar upload triggered. Select a new image.");
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-green-dark">Admin Profile</h1>
          <p className="text-gray-500 mt-1">Manage your personal information and security settings.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Details Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-2 space-y-6"
        >
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 md:p-8 border-b border-gray-100 bg-brand-cream/30">
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md">
                    <img 
                      src={formData.avatar} 
                      alt="Admin Avatar" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button 
                    onClick={handleAvatarChange}
                    className="absolute bottom-0 right-0 bg-brand-green-dark text-white p-2 rounded-full shadow-lg hover:bg-brand-green-light transition-colors duration-200"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{formData.firstName} {formData.lastName}</h2>
                  <p className="text-brand-green-dark font-medium flex items-center gap-1.5 mt-1">
                    <ShieldCheck className="w-4 h-4" />
                    {formData.role}
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleProfileSubmit} className="p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    First Name
                  </label>
                  <input 
                    type="text" 
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green-light/50 focus:border-brand-green-dark transition-all duration-200"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    Last Name
                  </label>
                  <input 
                    type="text" 
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green-light/50 focus:border-brand-green-dark transition-all duration-200"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    Email Address
                  </label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green-light/50 focus:border-brand-green-dark transition-all duration-200"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-gray-400" />
                    Role
                  </label>
                  <input 
                    type="text" 
                    value={formData.role}
                    disabled
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-2.5 bg-brand-green-dark text-white rounded-xl hover:bg-brand-green-light transition-all duration-300 font-medium disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Security Settings Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-brand-cream/30">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-brand-green-dark" />
                Change Password
              </h2>
              <p className="text-sm text-gray-500 mt-1">Ensure your account is using a long, random password to stay secure.</p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Current Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green-light/50 focus:border-brand-green-dark transition-all duration-200"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">New Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green-light/50 focus:border-brand-green-dark transition-all duration-200"
                    required
                    minLength={8}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green-light/50 focus:border-brand-green-dark transition-all duration-200"
                    required
                    minLength={8}
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isPasswordSubmitting}
                  className="w-full flex justify-center items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-300 font-medium disabled:opacity-70"
                >
                  {isPasswordSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Update Password"
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
