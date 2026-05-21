"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Activity,
  Calendar,
  Download,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { cn, formatPrice } from "@/lib/utils";

// Dummy Data
const kpiData = [
  {
    title: "Total Revenue",
    value: "$45,231.89", // Alternatively could use formatPrice(45231.89)
    change: "+20.1%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Active Orders",
    value: "356",
    change: "+12.5%",
    trend: "up",
    icon: ShoppingCart,
  },
  {
    title: "Total Customers",
    value: "2,420",
    change: "+18.2%",
    trend: "up",
    icon: Users,
  },
  {
    title: "Conversion Rate",
    value: "3.24%",
    change: "-1.1%",
    trend: "down",
    icon: Activity,
  },
];

const revenueData = [
  { name: "1 May", revenue: 4000, orders: 240 },
  { name: "5 May", revenue: 3000, orders: 139 },
  { name: "10 May", revenue: 2000, orders: 980 },
  { name: "15 May", revenue: 2780, orders: 390 },
  { name: "20 May", revenue: 1890, orders: 480 },
  { name: "25 May", revenue: 2390, orders: 380 },
  { name: "30 May", revenue: 3490, orders: 430 },
];

const categoryData = [
  { name: "Arabica Coffee", sales: 4000 },
  { name: "Robusta Coffee", sales: 3000 },
  { name: "Black Pepper", sales: 2000 },
  { name: "Cardamom", sales: 2780 },
  { name: "Cloves", sales: 1890 },
  { name: "Cinnamon", sales: 2390 },
];

const trafficData = [
  { name: "Organic Search", value: 400 },
  { name: "Direct", value: 300 },
  { name: "Social Media", value: 300 },
  { name: "Referral", value: 200 },
];

// Brand colors
const COLORS = ["#166534", "#22c55e", "#fef3c7", "#78350f"]; 

const topProducts = [
  {
    id: "1",
    name: "Premium Arabica Beans",
    category: "Coffee",
    sales: 1245,
    revenue: 31125,
    status: "In Stock",
  },
  {
    id: "2",
    name: "Coorg Black Pepper",
    category: "Spices",
    sales: 982,
    revenue: 14730,
    status: "Low Stock",
  },
  {
    id: "3",
    name: "Robusta Filter Blend",
    category: "Coffee",
    sales: 856,
    revenue: 12840,
    status: "In Stock",
  },
  {
    id: "4",
    name: "Green Cardamom Pods",
    category: "Spices",
    sales: 654,
    revenue: 16350,
    status: "Out of Stock",
  },
  {
    id: "5",
    name: "Ceylon Cinnamon Sticks",
    category: "Spices",
    sales: 432,
    revenue: 6480,
    status: "In Stock",
  },
];

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("Last 30 Days");

  const handleExport = () => {
    toast.success("Analytics report exported successfully!");
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Analytics</h1>
          <p className="text-gray-500 mt-1">Detailed performance metrics for your store.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => {
                setDateRange(e.target.value);
                toast.info(`Date range updated to ${e.target.value}`);
              }}
              className="appearance-none bg-white border border-gray-200 text-gray-700 py-2 pl-4 pr-10 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-green-dark focus:border-transparent cursor-pointer"
            >
              <option>Today</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Year</option>
            </select>
            <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-brand-green-dark text-white px-4 py-2 rounded-lg hover:bg-brand-green-light transition-colors shadow-sm"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export Report</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">{kpi.title}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-2">{kpi.value}</h3>
              </div>
              <div className="p-3 bg-brand-cream/30 rounded-lg">
                <kpi.icon className="h-5 w-5 text-brand-green-dark" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              {kpi.trend === "up" ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span
                className={cn(
                  "text-sm font-medium",
                  kpi.trend === "up" ? "text-green-500" : "text-red-500"
                )}
              >
                {kpi.change}
              </span>
              <span className="text-sm text-gray-500 ml-2">vs last period</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Area Chart - Revenue vs Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm lg:col-span-2"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Revenue & Orders Overview</h3>
            <button 
              onClick={() => toast.info("Filter options opened")}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Filter className="h-5 w-5" />
            </button>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#166534" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#166534" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#78350f" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#78350f" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Area yAxisId="left" type="monotone" dataKey="revenue" name="Revenue" stroke="#166534" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                <Area yAxisId="right" type="monotone" dataKey="orders" name="Orders" stroke="#78350f" strokeWidth={3} fillOpacity={1} fill="url(#colorOrders)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Traffic Sources Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Traffic Sources</h3>
          </div>
          <div className="h-[300px] w-full flex-1 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={trafficData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {trafficData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`${value} visitors`, 'Traffic']}
                />
                <Legend iconType="circle" layout="horizontal" verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales by Category Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Sales by Category</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f3f4f6" />
                <XAxis type="number" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} width={90} />
                <Tooltip 
                  cursor={{fill: '#f9fafb'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`$${value}`, 'Sales']}
                />
                <Bar dataKey="sales" fill="#166534" radius={[0, 4, 4, 0]} barSize={24}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#166534" : "#78350f"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Top Selling Products Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Top Selling Products</h3>
            <button 
              onClick={() => toast.info("Navigating to all products...")}
              className="text-sm text-brand-green-dark font-medium hover:underline"
            >
              View All
            </button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-sm text-gray-500">
                  <th className="pb-3 font-medium whitespace-nowrap">Product</th>
                  <th className="pb-3 font-medium whitespace-nowrap">Category</th>
                  <th className="pb-3 font-medium text-right whitespace-nowrap">Sales</th>
                  <th className="pb-3 font-medium text-right whitespace-nowrap">Revenue</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {topProducts.map((product) => (
                  <tr key={product.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="py-3 text-gray-900 font-medium">
                      <div className="flex flex-col">
                        <span>{product.name}</span>
                        <span className={cn(
                          "text-xs mt-0.5",
                          product.status === "In Stock" ? "text-green-500" :
                          product.status === "Low Stock" ? "text-amber-500" : "text-red-500"
                        )}>
                          {product.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 text-gray-500">{product.category}</td>
                    <td className="py-3 text-gray-900 font-medium text-right">{product.sales}</td>
                    <td className="py-3 text-gray-900 font-medium text-right">
                      {typeof formatPrice !== 'undefined' ? formatPrice(product.revenue) : `$${product.revenue.toLocaleString()}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
